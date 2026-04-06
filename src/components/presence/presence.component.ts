/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, nothing, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import { styles } from './presence.style.js';
import type { PresenceUser, PresenceChatState, PresenceChatMessage } from './presence.types.js';
import './presence-avatars.component.js';
import './presence-chat.component.js';

const GROUP_CHAT_KEY = '__group__';

/**
 * Top-level presence orchestrator.
 *
 * Owns the resource socket for viewer tracking, and uses the global messages
 * socket (`.globalSocket`) for real-time chat.
 *
 * Two chat modes:
 * - **Group chat**: One conversation per resource. Opened via the chat button.
 * - **DM**: Private 1-on-1 conversation. Opened by clicking a viewer's avatar.
 *
 * @example
 * ```html
 * <nr-presence
 *   namespace="/nk/apps/workflows/socket"
 *   socket-path="/__nk_socketio/"
 *   resource-id="workflow-abc123"
 *   resource-type="workflow"
 *   resource-name="My Workflow"
 *   user-id="user-xyz"
 *   .currentUser=${{ displayName, initials, color, avatarUrl }}
 *   .globalSocket=${globalSocket}
 * ></nr-presence>
 * ```
 *
 * @fires presence-changed - Fires when viewer list updates. Detail: `{ viewers: PresenceUser[] }`
 */
@customElement('nr-presence')
export class NrPresenceElement extends NuralyUIBaseMixin(LitElement) {
  static override styles = [styles, css`
    .group-chat-btn {
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--bg, #fff);
      background: var(--accent, #7c3aed); color: #fff; cursor: pointer;
      margin-left: 4px; transition: transform 120ms, background 120ms;
      position: relative;
    }
    .group-chat-btn:hover { transform: scale(1.1); background: var(--accent-hover, #6d28d9); }
    .group-chat-btn svg { width: 14px; height: 14px; }
    .unread-dot {
      position: absolute; top: -2px; right: -2px; width: 8px; height: 8px;
      border-radius: 50%; background: #ef4444; border: 2px solid var(--bg, #fff);
    }
  `];
  static useShadowDom = true;

  /** Socket.io namespace for presence tracking */
  @property({ type: String })
  namespace = '';

  /** Socket.io path */
  @property({ type: String, attribute: 'socket-path' })
  socketPath = '/__nk_socketio/';

  /** The resource being viewed (workflow id, doc id, etc.) */
  @property({ type: String, attribute: 'resource-id' })
  resourceId = '';

  /** Resource type for group conversation (e.g. 'workflow', 'whiteboard') */
  @property({ type: String, attribute: 'resource-type' })
  resourceType = '';

  /** Resource name (used as group conversation name) */
  @property({ type: String, attribute: 'resource-name' })
  resourceName = '';

  /** Current user's id */
  @property({ type: String, attribute: 'user-id' })
  userId = '';

  /** Current user object (shown first in avatar strip) */
  @property({ type: Object })
  currentUser: PresenceUser | null = null;

  /** Additional users to show (e.g. mocks for demo) */
  @property({ type: Array })
  extraUsers: PresenceUser[] = [];

  /** Global messages socket (from layout's /nk/messages connection) for real-time chat */
  @property({ type: Object })
  globalSocket: any = null;

  @state()
  private _viewers: PresenceUser[] = [];

  @state()
  private _hasUnreadGroup = false;

  private _socket: any = null;
  private _chats: Map<string, PresenceChatState> = new Map();
  private _chatZ = 100;
  private _drag: { userId: string; ox: number; oy: number } | null = null;
  private _boundDragMove = (e: MouseEvent) => this._onDragMove(e);
  private _boundDragEnd = () => this._onDragEnd();
  private _boundEscape = (e: KeyboardEvent) => this._onEscape(e);
  private _boundOnMessage = (data: any) => this._onSocketMessage(data);

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._boundEscape);
    this._connect();
    this._attachGlobalSocket();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._boundEscape);
    document.removeEventListener('mousemove', this._boundDragMove);
    document.removeEventListener('mouseup', this._boundDragEnd);
    this._socket?.disconnect();
    this._socket = null;
    this._detachGlobalSocket();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('globalSocket')) {
      this._detachGlobalSocket(changed.get('globalSocket') as any);
      this._attachGlobalSocket();
    }
  }

  private _attachGlobalSocket() {
    if (this.globalSocket) {
      this.globalSocket.on('nk:data', this._boundOnMessage);
    }
  }

  private _detachGlobalSocket(old?: any) {
    const sock = old || this.globalSocket;
    if (sock) {
      sock.off('nk:data', this._boundOnMessage);
    }
  }

  /** Handle incoming messages from the global /nk/messages socket */
  private _onSocketMessage(data: any) {
    if (data.event !== 'message:new') return;
    const msg = data.data;
    if (!msg?.conversationId || msg.senderId === this.userId) return;

    for (const [key, chat] of this._chats) {
      if (chat.conversationId === msg.conversationId) {
        chat.messages = [...chat.messages, {
          id: String(msg.id),
          senderId: msg.senderId,
          text: msg.content,
          timestamp: new Date(msg.createdAt).getTime(),
          me: false,
        }];
        this.requestUpdate();
        return;
      }
    }

    // If message is for our group conversation but panel is closed, show unread dot
    if (this._groupConversationId && msg.conversationId === this._groupConversationId) {
      this._hasUnreadGroup = true;
    }
  }

  // ── Resource presence socket ──

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
        }
      });
    } catch (e) {
      console.error('[nr-presence] Connection failed:', e);
    }
  }

  // ── Group chat ──

  private _groupConversationId: string | null = null;

  private async _openGroupChat() {
    if (this._chats.has(GROUP_CHAT_KEY)) {
      const c = this._chats.get(GROUP_CHAT_KEY)!;
      c.minimized = false;
      c.z = ++this._chatZ;
      this._hasUnreadGroup = false;
      this.requestUpdate();
      return;
    }

    const ix = window.innerWidth - 324;
    const iy = 56;
    this._chats.set(GROUP_CHAT_KEY, {
      user: { displayName: this.resourceName || `${this.resourceType} chat`, color: '#7c3aed', initials: '#' },
      conversationId: null, loading: true,
      x: ix, y: iy, savedX: ix, savedY: iy,
      z: ++this._chatZ, minimized: false, messages: [], draftText: '',
    });
    this._hasUnreadGroup = false;
    this.requestUpdate();

    try {
      const res = await fetch('/api/conversations/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: this.resourceType,
          resourceId: this.resourceId,
          resourceName: this.resourceName,
        }),
      });
      const data = await res.json();
      const chat = this._chats.get(GROUP_CHAT_KEY);
      if (!chat || !data.conversationId) {
        if (chat) chat.loading = false;
        this.requestUpdate();
        return;
      }
      chat.conversationId = data.conversationId;
      this._groupConversationId = data.conversationId;

      // Join the conversation room on the global socket
      if (this.globalSocket?.connected) {
        this.globalSocket.emit('conversation:join', { conversationId: data.conversationId });
      }

      // Load existing messages
      await this._loadMessages(chat);
    } catch (e) {
      console.error('[nr-presence] Failed to open group chat:', e);
      const chat = this._chats.get(GROUP_CHAT_KEY);
      if (chat) chat.loading = false;
    }
    this.requestUpdate();
  }

  // ── DM chat ──

  private async _openDm(user: PresenceUser) {
    const key = user.userId || user.displayName;
    // Clicking your own avatar opens the group chat (notes to self in context)
    if (key === this.userId) { this._openGroupChat(); return; }
    if (this._chats.has(key)) {
      this._chats.get(key)!.z = ++this._chatZ;
      this.requestUpdate();
      return;
    }

    const offset = [...this._chats.keys()].filter(k => k !== GROUP_CHAT_KEY).length;
    const ix = window.innerWidth - 324 - (offset + 1) * 24;
    const iy = 56 + (offset + 1) * 24;
    this._chats.set(key, {
      user, conversationId: null, loading: true,
      x: ix, y: iy, savedX: ix, savedY: iy,
      z: ++this._chatZ, minimized: false, messages: [], draftText: '',
    });
    this.requestUpdate();

    if (!user.userId) return;

    try {
      const dmRes = await fetch('/api/conversations/dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: user.userId }),
      });
      const dm = await dmRes.json();
      const chat = this._chats.get(key);
      if (!chat || !dm.conversationId) {
        if (chat) chat.loading = false;
        this.requestUpdate();
        return;
      }
      chat.conversationId = dm.conversationId;

      if (this.globalSocket?.connected) {
        this.globalSocket.emit('conversation:join', { conversationId: dm.conversationId });
      }

      await this._loadMessages(chat);
    } catch (e) {
      console.error('[nr-presence] Failed to open DM:', e);
      const chat = this._chats.get(key);
      if (chat) chat.loading = false;
    }
    this.requestUpdate();
  }

  // ── Shared helpers ──

  private async _loadMessages(chat: PresenceChatState) {
    if (!chat.conversationId) return;
    try {
      const res = await fetch(`/api/conversations/${chat.conversationId}/messages`);
      const data = await res.json();
      if (data.messages?.length) {
        chat.messages = data.messages.map((m: any) => ({
          id: String(m.id),
          senderId: m.sender_id,
          text: m.content,
          timestamp: new Date(m.created_at).getTime(),
          me: m.sender_id === this.userId,
        }));
      }
    } catch (e) {
      console.error('[nr-presence] Failed to load messages:', e);
    }
    chat.loading = false;
  }

  private _sendMessage(key: string, text: string) {
    const chat = this._chats.get(key);
    if (!chat?.conversationId) return;

    // Optimistic local update
    chat.messages = [...chat.messages, {
      id: crypto.randomUUID(),
      senderId: this.userId,
      text,
      timestamp: Date.now(),
      me: true,
    }];
    this.requestUpdate();

    // Send via global socket
    if (this.globalSocket?.connected) {
      this.globalSocket.emit('message:send', {
        conversationId: chat.conversationId,
        content: text,
        type: 'text',
      });
    }
  }

  // ── Chat panel UI management ──

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
        @user-click=${(e: CustomEvent) => this._openDm(e.detail.user)}
      ></nr-presence-avatars>

      ${this.resourceType ? html`
        <button class="group-chat-btn" title="Team chat" @click=${() => this._openGroupChat()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          ${this._hasUnreadGroup ? html`<span class="unread-dot"></span>` : nothing}
        </button>
      ` : nothing}

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
            .loading=${c.loading}
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
            @send=${(e: CustomEvent) => this._sendMessage(key, e.detail.text)}
          ></nr-presence-chat>
        `;
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-presence': NrPresenceElement;
  }
}
