/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { io, type Socket } from 'socket.io-client';
import { BaseCanvasController } from './base.controller.js';
import type {
  CanvasOperation,
  CanvasOperationType,
  CollaborationState,
  CollaborationUser,
  NodeLock,
  RemoteCursor,
} from '../interfaces/collaboration.interface.js';

const CURSOR_THROTTLE_MS = 33;
const STALE_CURSOR_MS = 10_000;
const STALE_CURSOR_CHECK_MS = 5_000;
const LOCK_KEEPALIVE_MS = 10_000;

/**
 * CollaborationController manages real-time collaboration via Socket.IO.
 * Uses the LumenJS page socket (path `/__nk_socketio/`, namespace
 * `/nk<pathname>`). Wire format: all server→client traffic arrives on the
 * single `nk:data` event carrying `{ event, data }`; client→server uses
 * `nk:<event>` which the server binds via `on('<event>', …)`.
 */
export class CollaborationController extends BaseCanvasController {
  private socket: Socket | null = null;
  private staleCursorInterval: ReturnType<typeof setInterval> | null = null;
  private keepaliveInterval: ReturnType<typeof setInterval> | null = null;
  private lastCursorBroadcast = 0;
  private cursorThrottleTimer: ReturnType<typeof setTimeout> | null = null;
  private myUserId: string = '';

  private state: CollaborationState = {
    connected: false,
    canvasId: null,
    users: new Map(),
    cursors: new Map(),
    selections: new Map(),
    typingIndicators: new Map(),
    lockedNodes: new Map(),
    serverVersion: 0,
    pendingOps: new Map(),
  };

  private opCounter = 0;
  private myHeldLocks: Set<string> = new Set();

  // ==================== Lifecycle ====================

  /**
   * Connect via the LumenJS page socket.
   * @param canvasId  workflow/whiteboard id (for local state tracking only)
   * @param namespace LumenJS namespace, e.g. `/nk/apps/workflows/<id>`
   * @param userId    current user id (used to identify ownership of locks)
   */
  connect(canvasId: string, namespace: string, userId: string): void {
    if (this.socket?.connected && this.state.canvasId === canvasId) return;

    console.log('[collab] connect()', { canvasId, namespace, userId });

    this.disconnect();
    this.state.canvasId = canvasId;
    this.myUserId = userId;

    if (!namespace || !userId) return;

    try {
      this.socket = io(namespace, {
        path: '/__nk_socketio/',
        query: {
          __params: JSON.stringify({
            workflowId: canvasId,
            resourceId: canvasId,
            userId,
            source: 'canvas',
          }),
        },
        // Force a dedicated connection — the LumenJS router already opens a
        // socket to this same namespace; without forceNew, Socket.IO would
        // hand us a cached instance whose `connect` event has already fired
        // (we'd never hear it) and whose handshake query is from the router,
        // not ours (server would treat this socket as not a canvas source).
        forceNew: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });

      const onConnected = () => {
        console.log('[collab] socket connected', { canvasId });
        this.state.connected = true;
        this.safeExecute(
          () => this.socket!.emit('nk:canvas:lock:request'),
          'connect: lock:request'
        );
        this._host.requestUpdate();
      };

      this.socket.on('connect', onConnected);

      // If somehow the socket is already connected by the time we attach
      // (Socket.IO reuse edge case), fire the handler manually.
      if (this.socket.connected) {
        console.log('[collab] socket already connected at attach time');
        onConnected();
      }

      this.socket.on('disconnect', (reason: string) => {
        console.log('[collab] socket disconnected', reason);
        this.state.connected = false;
        this._host.requestUpdate();
      });

      this.socket.on('connect_error', (err: Error) => {
        console.warn('[collab] connect_error', err?.message);
      });

      this.socket.on('nk:data', (payload: { event: string; data: any }) => {
        console.log('[collab] nk:data', payload?.event, payload?.data);
        this.safeExecute(() => this.handleWireMessage(payload), 'handleWireMessage');
      });

      this.staleCursorInterval = setInterval(() => this.cleanStaleCursors(), STALE_CURSOR_CHECK_MS);
    } catch (error) {
      this.handleError(error as Error, 'connect');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.safeExecute(() => {
        this.socket!.removeAllListeners();
        this.socket!.disconnect();
      }, 'disconnect');
      this.socket = null;
    }

    if (this.staleCursorInterval) {
      clearInterval(this.staleCursorInterval);
      this.staleCursorInterval = null;
    }

    if (this.keepaliveInterval) {
      clearInterval(this.keepaliveInterval);
      this.keepaliveInterval = null;
    }

    if (this.cursorThrottleTimer) {
      clearTimeout(this.cursorThrottleTimer);
      this.cursorThrottleTimer = null;
    }

    this.state = {
      connected: false,
      canvasId: null,
      users: new Map(),
      cursors: new Map(),
      selections: new Map(),
      typingIndicators: new Map(),
      lockedNodes: new Map(),
      serverVersion: 0,
      pendingOps: new Map(),
    };
    this.myHeldLocks.clear();
  }

  override hostDisconnected(): void {
    this.disconnect();
  }

  // ==================== Inbound routing ====================

  private handleWireMessage(payload: { event: string; data: any }): void {
    if (!payload?.event) return;
    switch (payload.event) {
      case 'canvas:op':
        this.handleOperationReceived(payload.data);
        break;
      case 'canvas:lock:state':
        this.handleLockState(payload.data);
        break;
      case 'canvas:lock:ack':
        // Server-authoritative reply to an acquire attempt; lock:state follows,
        // so no state change needed here — left as an extension point.
        break;
      default:
        // Non-collaboration events (presence:*, execution:*) are handled by
        // other listeners/components on the page; ignore here.
        break;
    }
  }

  // ==================== Outbound Methods ====================

  broadcastCursorMove(x: number, y: number): void {
    if (!this.socket?.connected || !this.state.canvasId) return;

    const now = Date.now();
    if (now - this.lastCursorBroadcast < CURSOR_THROTTLE_MS) {
      // Throttle: schedule a trailing emit
      if (!this.cursorThrottleTimer) {
        this.cursorThrottleTimer = setTimeout(() => {
          this.cursorThrottleTimer = null;
          this.emitCursorMove(x, y);
        }, CURSOR_THROTTLE_MS - (now - this.lastCursorBroadcast));
      }
      return;
    }

    this.emitCursorMove(x, y);
  }

  private emitCursorMove(x: number, y: number): void {
    if (!this.socket?.connected || !this.state.canvasId) return;
    this.lastCursorBroadcast = Date.now();
    this.safeExecute(
      () => this.socket!.emit('nk:cursor:move', { x, y }),
      'emitCursorMove'
    );
  }

  broadcastSelectionChange(elementIds: string[]): void {
    if (!this.socket?.connected || !this.state.canvasId) return;
    this.safeExecute(
      () => this.socket!.emit('nk:selection:change', { elementIds }),
      'broadcastSelectionChange'
    );
  }

  broadcastTypingStart(elementId: string): void {
    if (!this.socket?.connected || !this.state.canvasId) return;
    this.safeExecute(
      () => this.socket!.emit('nk:typing:start', { elementId }),
      'broadcastTypingStart'
    );
  }

  broadcastTypingStop(elementId: string): void {
    if (!this.socket?.connected || !this.state.canvasId) return;
    this.safeExecute(
      () => this.socket!.emit('nk:typing:stop', { elementId }),
      'broadcastTypingStop'
    );
  }

  broadcastOperation(type: CanvasOperationType, elementId: string, data: Record<string, unknown>): void {
    if (!this.socket?.connected || !this.state.canvasId) return;

    const opId = `op_${Date.now()}_${++this.opCounter}`;
    this.state.pendingOps.set(opId, {
      id: opId,
      type,
      elementId,
      data,
      userId: this.myUserId,
      timestamp: Date.now(),
      version: this.state.serverVersion,
    });

    this.safeExecute(
      () => this.socket!.emit('nk:canvas:op', {
        id: opId,
        type,
        elementId,
        data,
      }),
      'broadcastOperation'
    );
  }

  // ==================== Lock methods ====================

  /** Acquire an edit lock for a node. Server broadcasts lock:state on grant. */
  acquireLock(nodeId: string): void {
    console.log('[collab] acquireLock()', { nodeId, connected: this.socket?.connected });
    if (!this.socket?.connected || !nodeId) return;
    this.myHeldLocks.add(nodeId);
    this.safeExecute(
      () => this.socket!.emit('nk:canvas:lock:acquire', { nodeId }),
      'acquireLock'
    );
    this.ensureKeepalive();
  }

  /** Release a lock this user holds. */
  releaseLock(nodeId: string): void {
    if (!nodeId) return;
    console.log('[collab] releaseLock()', { nodeId, connected: this.socket?.connected });
    const had = this.myHeldLocks.delete(nodeId);
    if (this.socket?.connected && had) {
      this.safeExecute(
        () => this.socket!.emit('nk:canvas:lock:release', { nodeId }),
        'releaseLock'
      );
    }
    if (this.myHeldLocks.size === 0 && this.keepaliveInterval) {
      clearInterval(this.keepaliveInterval);
      this.keepaliveInterval = null;
    }
  }

  /** Whether a remote user is currently editing this node. */
  getRemoteLock(nodeId: string): NodeLock | null {
    const lock = this.state.lockedNodes.get(nodeId);
    if (!lock) return null;
    if (lock.userId === this.myUserId) return null;
    return lock;
  }

  private ensureKeepalive(): void {
    if (this.keepaliveInterval || this.myHeldLocks.size === 0) return;
    this.keepaliveInterval = setInterval(() => {
      if (!this.socket?.connected) return;
      for (const nodeId of this.myHeldLocks) {
        this.safeExecute(
          () => this.socket!.emit('nk:canvas:lock:keepalive', { nodeId }),
          'lockKeepalive'
        );
      }
    }, LOCK_KEEPALIVE_MS);
  }

  private handleLockState(data: { locks: Record<string, NodeLock> }): void {
    if (!data?.locks) return;
    this.state.lockedNodes.clear();
    for (const [nodeId, lock] of Object.entries(data.locks)) {
      this.state.lockedNodes.set(nodeId, lock);
    }
    this._host.requestUpdate();
  }

  // ==================== Inbound Handlers ====================

  private handleOperationReceived(payload: {
    id?: string;
    type: CanvasOperationType;
    elementId?: string;
    data: Record<string, unknown>;
    userId?: string;
    displayName?: string;
    timestamp?: number;
  }): void {
    if (!payload || !payload.type) return;
    // Ignore the echo of our own op — we already applied it locally.
    if (payload.userId && payload.userId === this.myUserId) return;
    const op: CanvasOperation = {
      id: payload.id ?? `remote_${Date.now()}`,
      type: payload.type,
      elementId: payload.elementId,
      data: payload.data || {},
      userId: payload.userId ?? '',
      timestamp: payload.timestamp ?? Date.now(),
      version: this.state.serverVersion,
    };
    this.applyRemoteOperation(op);
  }

  // ==================== Remote Operation Application ====================

  private applyRemoteOperation(op: CanvasOperation): void {
    const workflow = this._host.workflow;
    if (!workflow) return;

    let updatedNodes = [...workflow.nodes];
    let updatedEdges = [...workflow.edges];
    let modified = false;

    switch (op.type) {
      case 'ADD': {
        const nodeData = op.data.node as Record<string, unknown> | undefined;
        if (nodeData) {
          updatedNodes = [...updatedNodes, nodeData as any];
          modified = true;
        }
        break;
      }

      case 'DELETE': {
        if (op.elementId) {
          updatedNodes = updatedNodes.filter(n => n.id !== op.elementId);
          updatedEdges = updatedEdges.filter(
            e => e.sourceNodeId !== op.elementId && e.targetNodeId !== op.elementId
          );
          modified = true;
        }
        break;
      }

      case 'MOVE': {
        if (op.elementId) {
          updatedNodes = updatedNodes.map(n => {
            if (n.id === op.elementId) {
              return {
                ...n,
                position: {
                  x: op.data.x as number,
                  y: op.data.y as number,
                },
              };
            }
            return n;
          });
          modified = true;
        }
        break;
      }

      case 'RESIZE': {
        if (op.elementId) {
          updatedNodes = updatedNodes.map(n => {
            if (n.id === op.elementId) {
              return {
                ...n,
                configuration: {
                  ...n.configuration,
                  width: op.data.width as number,
                  height: op.data.height as number,
                },
              };
            }
            return n;
          });
          modified = true;
        }
        break;
      }

      case 'UPDATE_TEXT': {
        if (op.elementId) {
          updatedNodes = updatedNodes.map(n => {
            if (n.id === op.elementId) {
              return {
                ...n,
                configuration: {
                  ...n.configuration,
                  textContent: op.data.textContent as string,
                },
              };
            }
            return n;
          });
          modified = true;
        }
        break;
      }

      case 'UPDATE': {
        if (op.elementId) {
          updatedNodes = updatedNodes.map(n => {
            if (n.id === op.elementId) {
              return {
                ...n,
                configuration: {
                  ...n.configuration,
                  ...op.data,
                },
              };
            }
            return n;
          });
          modified = true;
        }
        break;
      }

      case 'ADD_CONNECTOR': {
        const edgeData = op.data.edge as Record<string, unknown> | undefined;
        if (edgeData) {
          updatedEdges = [...updatedEdges, edgeData as any];
          modified = true;
        }
        break;
      }

      case 'DELETE_CONNECTOR': {
        if (op.elementId) {
          updatedEdges = updatedEdges.filter(e => e.id !== op.elementId);
          modified = true;
        }
        break;
      }
    }

    if (modified) {
      // Update workflow WITHOUT dispatching workflow-changed event
      // to prevent re-broadcasting and re-triggering HTTP save
      this._host.setWorkflow({
        ...workflow,
        nodes: updatedNodes,
        edges: updatedEdges,
      });
      this._host.requestUpdate();
    }
  }

  // ==================== Query Methods ====================

  getState(): CollaborationState {
    return this.state;
  }

  isConnected(): boolean {
    return this.state.connected;
  }

  getUsers(): CollaborationUser[] {
    return Array.from(this.state.users.values());
  }

  getCursors(): RemoteCursor[] {
    return Array.from(this.state.cursors.values());
  }

  isElementSelectedByRemote(elementId: string): { userId: string; color: string; username: string } | null {
    for (const [userId, sel] of this.state.selections) {
      if (sel.elementIds.includes(elementId)) {
        const user = this.state.users.get(userId);
        if (user) {
          return { userId, color: user.color, username: user.username };
        }
      }
    }
    return null;
  }

  isElementBeingTypedByRemote(elementId: string): { userId: string; username: string; color: string } | null {
    for (const [userId, indicator] of this.state.typingIndicators) {
      if (indicator.elementId === elementId && indicator.isTyping) {
        const user = this.state.users.get(userId);
        if (user) {
          return { userId, username: user.username, color: user.color };
        }
      }
    }
    return null;
  }

  // ==================== Helpers ====================

  private cleanStaleCursors(): void {
    const now = Date.now();
    let changed = false;
    for (const [userId, cursor] of this.state.cursors) {
      if (now - cursor.lastUpdate > STALE_CURSOR_MS) {
        this.state.cursors.delete(userId);
        changed = true;
      }
    }
    if (changed) {
      this._host.requestUpdate();
    }
  }
}
