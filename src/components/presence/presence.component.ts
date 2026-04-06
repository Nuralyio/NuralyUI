/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import { styles } from './presence.style.js';
import type { PresenceUser, PresenceChatState } from './presence.types.js';
import './presence-avatars.component.js';
import './presence-chat.component.js';

/**
 * Top-level presence orchestrator.
 *
 * Owns the socket connection, viewer list, and chat panel manager.
 * Renders `nr-presence-avatars` + one `nr-presence-chat` per open chat.
 *
 * @example
 * ```html
 * <nr-presence
 *   namespace="/nk/apps/workflows/socket"
 *   socket-path="/__nk_socketio/"
 *   resource-id="workflow-abc123"
 *   user-id="user-xyz"
 *   .currentUser=${{ displayName, initials, color, avatarUrl }}
 *   .extraUsers=${[...mockUsers]}
 * ></nr-presence>
 * ```
 *
 * @fires presence-changed - Fires when viewer list updates. Detail: `{ viewers: PresenceUser[] }`
 */
@customElement('nr-presence')
export class NrPresenceElement extends NuralyUIBaseMixin(LitElement) {
  static override styles = styles;
  static useShadowDom = true;

  /** Socket.io namespace */
  @property({ type: String })
  namespace = '';

  /** Socket.io path */
  @property({ type: String, attribute: 'socket-path' })
  socketPath = '/__nk_socketio/';

  /** The resource being viewed (workflow id, doc id, etc.) */
  @property({ type: String, attribute: 'resource-id' })
  resourceId = '';

  /** Current user's id */
  @property({ type: String, attribute: 'user-id' })
  userId = '';

  /** Current user object (shown first in avatar strip) */
  @property({ type: Object })
  currentUser: PresenceUser | null = null;

  /** Additional users to show (e.g. mocks for demo) */
  @property({ type: Array })
  extraUsers: PresenceUser[] = [];

  @state()
  private _viewers: PresenceUser[] = [];

  private _socket: any = null;
  private _chats: Map<string, PresenceChatState> = new Map();
  private _chatZ = 100;
  private _drag: { userId: string; ox: number; oy: number } | null = null;
  private _boundDragMove = (e: MouseEvent) => this._onDragMove(e);
  private _boundDragEnd = () => this._onDragEnd();
  private _boundEscape = (e: KeyboardEvent) => this._onEscape(e);

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._boundEscape);
    this._connect();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._boundEscape);
    document.removeEventListener('mousemove', this._boundDragMove);
    document.removeEventListener('mouseup', this._boundDragEnd);
    this._socket?.disconnect();
    this._socket = null;
  }

  private async _connect() {
    if (!this.userId || !this.resourceId || !this.namespace) return;
    try {
      const { io } = await import('socket.io-client');
      this._socket = io(this.namespace, {
        path: this.socketPath,
        query: { __params: JSON.stringify({ userId: this.userId, resourceId: this.resourceId }) },
      });
      this._socket.on('nk:data', (data: any) => {
        const ev = data.event;
        if (ev === 'presence:viewers' || ev === 'presence:joined' || ev === 'presence:left') {
          this._viewers = data.data?.viewers || [];
          this.dispatchEvent(new CustomEvent('presence-changed', {
            detail: { viewers: this._viewers },
            bubbles: true,
            composed: true,
          }));
        } else if (ev === 'presence:chat') {
          const msg = data.data;
          if (!msg?.targetUserId || msg.targetUserId !== this.userId) return;
          const key = msg.senderId;
          const chat = this._chats.get(key);
          if (chat) {
            chat.messages = [...chat.messages, {
              id: msg.id || crypto.randomUUID(),
              senderId: msg.senderId,
              text: msg.text,
              timestamp: msg.timestamp || Date.now(),
              me: false,
            }];
          } else {
            // Auto-open chat from sender
            const sender = this._viewers.find(v => v.userId === msg.senderId);
            if (sender) {
              const offset = this._chats.size * 24;
              const ix = window.innerWidth - 324 - offset;
              const iy = 56 + offset;
              this._chats.set(key, {
                user: sender, x: ix, y: iy, savedX: ix, savedY: iy,
                z: ++this._chatZ, minimized: false, draftText: '',
                messages: [{
                  id: msg.id || crypto.randomUUID(),
                  senderId: msg.senderId,
                  text: msg.text,
                  timestamp: msg.timestamp || Date.now(),
                  me: false,
                }],
              });
            }
          }
          this.requestUpdate();
        }
      });
    } catch (e) {
      console.error('[nr-presence] Connection failed:', e);
    }
  }

  private _openChat(user: PresenceUser) {
    const key = user.userId || user.displayName;
    if (this._chats.has(key)) {
      this._chats.get(key)!.z = ++this._chatZ;
    } else {
      const offset = this._chats.size * 24;
      const ix = window.innerWidth - 324 - offset;
      const iy = 56 + offset;
      this._chats.set(key, {
        user, x: ix, y: iy, savedX: ix, savedY: iy,
        z: ++this._chatZ, minimized: false, messages: [], draftText: '',
      });
    }
    this.requestUpdate();
  }

  private _closeChat(key: string) {
    this._chats.delete(key);
    this.requestUpdate();
  }

  private _onEscape(e: KeyboardEvent) {
    if (e.key !== 'Escape' || this._chats.size === 0) return;
    let topKey = '';
    let topZ = -1;
    for (const [k, c] of this._chats) { if (c.z > topZ) { topZ = c.z; topKey = k; } }
    if (!topKey) return;
    const c = this._chats.get(topKey)!;
    if (!c.minimized) { c.savedX = c.x; c.savedY = c.y; c.minimized = true; this.requestUpdate(); }
    else { this._closeChat(topKey); }
  }

  private _onDragStart(key: string, offsetX: number, offsetY: number) {
    const c = this._chats.get(key);
    if (!c) return;
    c.z = ++this._chatZ;
    this._drag = { userId: key, ox: offsetX, oy: offsetY };
    document.addEventListener('mousemove', this._boundDragMove);
    document.addEventListener('mouseup', this._boundDragEnd);
  }

  private _onDragMove(e: MouseEvent) {
    if (!this._drag) return;
    const c = this._chats.get(this._drag.userId);
    if (!c) return;
    c.x = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - this._drag.ox));
    c.y = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - this._drag.oy));
    this.requestUpdate();
  }

  private _onDragEnd() {
    this._drag = null;
    document.removeEventListener('mousemove', this._boundDragMove);
    document.removeEventListener('mouseup', this._boundDragEnd);
  }

  override render() {
    const cu = this.currentUser;
    const allUsers: PresenceUser[] = [
      ...(cu ? [cu] : []),
      ...this._viewers.filter(v => !cu || v.userId !== cu.userId),
      ...this.extraUsers,
    ];

    const minimizedList = [...this._chats.entries()].filter(([, c]) => c.minimized);

    return html`
      <nr-presence-avatars
        .users=${allUsers}
        @user-click=${(e: CustomEvent) => this._openChat(e.detail.user)}
      ></nr-presence-avatars>

      ${[...this._chats.entries()].map(([key, c]) => {
        const minIdx = minimizedList.findIndex(([k]) => k === key);
        return html`
          <nr-presence-chat
            .user=${c.user}
            .x=${c.x}
            .y=${c.y}
            .z=${c.z}
            .minimized=${c.minimized}
            .minimizedIndex=${minIdx >= 0 ? minIdx : 0}
            .messages=${c.messages}
            @focus=${() => { c.z = ++this._chatZ; this.requestUpdate(); }}
            @drag-start=${(e: CustomEvent) => this._onDragStart(key, e.detail.offsetX, e.detail.offsetY)}
            @minimize=${() => { c.savedX = c.x; c.savedY = c.y; c.minimized = true; this.requestUpdate(); }}
            @restore=${() => {
              c.x = Math.max(0, window.innerWidth - (12 + minIdx * 212) - 300);
              c.y = Math.max(0, window.innerHeight - 420 - 56);
              c.minimized = false; c.z = ++this._chatZ; this.requestUpdate();
            }}
            @float=${() => { c.minimized = false; c.x = c.savedX; c.y = c.savedY; c.z = ++this._chatZ; this.requestUpdate(); }}
            @close=${() => this._closeChat(key)}
            @send=${(e: CustomEvent) => {
              const msg = {
                id: crypto.randomUUID(),
                senderId: this.userId,
                text: e.detail.text,
                timestamp: Date.now(),
                me: true,
              };
              c.messages = [...c.messages, msg];
              if (this._socket) {
                this._socket.emit('nk:presence:chat', {
                  targetUserId: c.user.userId,
                  senderId: this.userId,
                  text: e.detail.text,
                  id: msg.id,
                  timestamp: msg.timestamp,
                });
              }
              this.requestUpdate();
            }}
          ></nr-presence-chat>
        `;
      })}

      ${this._chats.size === 0 ? nothing : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-presence': NrPresenceElement;
  }
}
