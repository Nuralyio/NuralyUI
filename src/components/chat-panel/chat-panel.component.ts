/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { chatPanelStyles } from './chat-panel.style.js';
import type { ChatMessage, ChatUser } from './chat-panel.types.js';

const REACTIONS = [
  { key: '👍', label: 'Like' },
  { key: '❤️', label: 'Love' },
  { key: '😂', label: 'Haha' },
  { key: '😮', label: 'Wow' },
  { key: '😢', label: 'Sad' },
  { key: '🔥', label: 'Fire' },
] as const;

const EMOJI_GRID = ['😀','😂','🥰','😎','🤔','🎉','✨','🙏','💯','🚀','👏','😍','🤣','💪','😊','🥳','😤','💀','🫡','👀','💜','🤝','⭐','🙌'];

const svgCheck = html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
const svgCheckDouble = html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 6 7 17 2 12"/><polyline points="23 6 12 17" opacity="0.5"/></svg>`;
const svgCheckDoubleRead = html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><polyline points="18 6 7 17 2 12"/><polyline points="23 6 12 17"/></svg>`;
const svgSend = html`<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
const svgSmile = html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
const svgPlay = html`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const svgFile = html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
const svgDownload = html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
const svgPhone = html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`;
const svgVideo = html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
const svgChat = html`<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
const svgAttach = html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>`;
const svgImage = html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;

/**
 * Shared chat panel — renders messages, input bar, reactions, context menu.
 * Used inside both the floating presence chat and the full messages page.
 *
 * @fires message-send - User sends a message. Detail: `{ text, replyTo? }`
 * @fires message-edit - User edits a message. Detail: `{ messageId, content }`
 * @fires message-delete - User deletes a message. Detail: `{ messageId }`
 * @fires message-react - User reacts to a message. Detail: `{ messageId, emoji }`
 * @fires typing-start
 * @fires typing-stop
 * @fires file-select - User selected a file. Detail: `{ file: File, imageOnly: boolean }`
 */
@customElement('nr-chat-panel')
export class NrChatPanelElement extends LitElement {
  static override styles = chatPanelStyles;

  /** Messages to display */
  @property({ type: Array })
  messages: ChatMessage[] = [];

  /** Current user info */
  @property({ type: Object })
  currentUser: ChatUser | null = null;

  /** Conversation ID */
  @property({ type: String, attribute: 'conversation-id' })
  conversationId = '';

  /** Whether this is a group conversation */
  @property({ type: Boolean })
  isGroup = false;

  /** Loading state */
  @property({ type: Boolean })
  loading = false;

  /** Compact mode for floating panels */
  @property({ type: Boolean, reflect: true })
  compact = false;

  /** Empty state text */
  @property({ type: String, attribute: 'empty-text' })
  emptyText = 'No messages yet';

  /** Hide the built-in input bar (for pages that provide their own) */
  @property({ type: Boolean, attribute: 'hide-input' })
  hideInput = false;

  @state() private _showEmoji = false;
  @state() private _contextMenu: { msgIdx: number; y: number; left?: number; right?: number } | null = null;
  @state() private _replyTo: { text: string; from: string } | null = null;
  @state() private _editingIdx: number | null = null;
  @state() private _typing: string[] = [];

  private _typingTimer: any = null;
  private _longPressTimer: any = null;
  private _touchMoved = false;

  override updated(changed: Map<string, unknown>) {
    // Auto-scroll on new messages
    if (changed.has('messages')) {
      requestAnimationFrame(() => {
        const el = this.shadowRoot?.querySelector('.chat-messages');
        if (el) el.scrollTop = el.scrollHeight;
      });
    }
  }

  // ── Public methods (called by parent for socket events) ──

  /** Add a typing indicator */
  addTyping(userName: string) {
    if (!this._typing.includes(userName)) {
      this._typing = [...this._typing, userName];
    }
  }

  /** Remove a typing indicator */
  removeTyping(userName: string) {
    this._typing = this._typing.filter(n => n !== userName);
  }

  // ── Send ──

  private _sendMessage() {
    const input = this.shadowRoot?.querySelector('.chat-input textarea') as HTMLTextAreaElement;
    if (!input?.value.trim()) return;
    const text = input.value.trim();
    input.value = '';
    input.focus();
    this.dispatchEvent(new CustomEvent('message-send', {
      detail: { text, replyTo: this._replyTo || undefined },
      bubbles: true, composed: true,
    }));
    this._replyTo = null;
    this._showEmoji = false;
    this._playSound();
  }

  private _onInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this._sendMessage();
      return;
    }
    this.dispatchEvent(new CustomEvent('typing-start', { bubbles: true, composed: true }));
    clearTimeout(this._typingTimer);
    this._typingTimer = setTimeout(() => {
      this.dispatchEvent(new CustomEvent('typing-stop', { bubbles: true, composed: true }));
    }, 2000);
  }

  // ── Emoji ──

  private _toggleEmoji() { this._showEmoji = !this._showEmoji; }

  private _insertEmoji(emoji: string) {
    const input = this.shadowRoot?.querySelector('.chat-input textarea') as HTMLTextAreaElement;
    if (input) { input.value += emoji; input.focus(); }
    this._showEmoji = false;
  }

  // ── Context menu ──

  private _menuPos(target: HTMLElement): { y: number; left?: number; right?: number } {
    const bubble = (target.closest('.msg-bubble') || target.closest('.msg-row')) as HTMLElement;
    if (!bubble) return { y: 0, left: 0 };
    const rect = bubble.getBoundingClientRect();
    const isMe = !!target.closest('.msg-row.me');
    const menuH = isMe ? 140 : 80;
    const y = rect.top > menuH + 12 ? rect.top - menuH - 4 : rect.bottom + 4;
    if (isMe) return { y, right: Math.max(8, window.innerWidth - rect.right) };
    return { y, left: Math.max(8, rect.left) };
  }

  private _showContextMenuHandler(e: MouseEvent, msgIdx: number) {
    e.preventDefault();
    this._contextMenu = { msgIdx, ...this._menuPos(e.target as HTMLElement) };
  }

  private _onTouchStart(e: TouchEvent, msgIdx: number) {
    this._touchMoved = false;
    this._longPressTimer = setTimeout(() => {
      e.preventDefault();
      window.getSelection()?.removeAllRanges();
      this._contextMenu = { msgIdx, ...this._menuPos(e.target as HTMLElement) };
      this._touchMoved = true;
    }, 500);
  }

  private _onTouchEnd() { clearTimeout(this._longPressTimer); }
  private _onTouchMove() { this._touchMoved = true; clearTimeout(this._longPressTimer); }

  private _onMsgTap(e: MouseEvent, msgIdx: number) {
    if (!window.matchMedia('(max-width: 640px)').matches) return;
    if (this._touchMoved) return;
    const target = e.target as HTMLElement;
    if (target.closest('.reaction') || target.closest('.audio-play-btn') || target.closest('.file-card') || target.closest('.edit-inline')) return;
    e.stopPropagation();
    this._contextMenu = { msgIdx, ...this._menuPos(target) };
  }

  private _hideContextMenu() { this._contextMenu = null; }

  // ── Message actions ──

  private _deleteMsg(idx: number) {
    const msg = this.messages[idx];
    if (msg?.id) {
      this.dispatchEvent(new CustomEvent('message-delete', {
        detail: { messageId: msg.id }, bubbles: true, composed: true,
      }));
    }
    this._contextMenu = null;
  }

  private _replyMsg(idx: number) {
    const msg = this.messages[idx];
    if (msg) {
      this._replyTo = { text: msg.text, from: msg.from };
      (this.shadowRoot?.querySelector('.chat-input textarea') as HTMLTextAreaElement)?.focus();
    }
    this._contextMenu = null;
  }

  private _editMsg(idx: number) {
    this._editingIdx = idx;
    this._contextMenu = null;
    requestAnimationFrame(() => {
      const input = this.shadowRoot?.querySelector('.edit-input') as HTMLInputElement;
      if (input) { input.focus(); input.select(); }
    });
  }

  private _confirmEdit(idx: number) {
    const input = this.shadowRoot?.querySelector('.edit-input') as HTMLInputElement;
    const content = input?.value.trim();
    if (!content) { this._editingIdx = null; return; }
    const msg = this.messages[idx];
    if (msg?.id) {
      this.dispatchEvent(new CustomEvent('message-edit', {
        detail: { messageId: msg.id, content }, bubbles: true, composed: true,
      }));
    }
    this._editingIdx = null;
  }

  private _onEditKeydown(e: KeyboardEvent, idx: number) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._confirmEdit(idx); }
    else if (e.key === 'Escape') { this._editingIdx = null; }
  }

  private _reactMsg(idx: number, emoji: string) {
    const msg = this.messages[idx];
    if (msg?.id) {
      this.dispatchEvent(new CustomEvent('message-react', {
        detail: { messageId: msg.id, emoji }, bubbles: true, composed: true,
      }));
    }
    this._contextMenu = null;
  }

  // ── Audio player ──

  private _toggleAudioPlay(e: Event) {
    const btn = e.currentTarget as HTMLElement;
    const container = btn.closest('.audio-msg') as HTMLElement;
    const audio = container?.querySelector('audio') as HTMLAudioElement;
    if (!audio) return;
    if (audio.paused) {
      this.shadowRoot?.querySelectorAll('.audio-msg audio').forEach((a: any) => {
        if (a !== audio && !a.paused) { a.pause(); a.currentTime = 0; }
      });
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  private _onAudioTimeUpdate(e: Event) {
    const audio = e.target as HTMLAudioElement;
    const container = audio.closest('.audio-msg') as HTMLElement;
    if (!container || !audio.duration) return;
    const bars = container.querySelectorAll('.a-bar');
    const progress = audio.currentTime / audio.duration;
    const filledCount = Math.floor(progress * bars.length);
    bars.forEach((bar, idx) => (bar as HTMLElement).classList.toggle('played', idx <= filledCount));
  }

  private _onAudioEnded(e: Event) {
    const audio = e.target as HTMLAudioElement;
    const container = audio.closest('.audio-msg') as HTMLElement;
    container?.querySelectorAll('.a-bar').forEach(bar => (bar as HTMLElement).classList.remove('played'));
  }

  // ── File picker ──

  private _pickFile(imageOnly = false) {
    const input = document.createElement('input');
    input.type = 'file';
    if (imageOnly) input.accept = 'image/jpeg,image/png,image/gif,image/webp,image/heic,image/heif';
    input.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(input);
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        this.dispatchEvent(new CustomEvent('file-select', {
          detail: { file, imageOnly }, bubbles: true, composed: true,
        }));
      }
      try { document.body.removeChild(input); } catch {}
    };
    input.click();
  }

  // ── Sound ──

  private _playSound() {
    try {
      const ctx = new AudioContext();
      const gain = ctx.createGain(); gain.connect(ctx.destination); gain.gain.value = 0.12;
      const o = ctx.createOscillator(); o.connect(gain); o.type = 'sine';
      o.frequency.setValueAtTime(600, ctx.currentTime);
      o.frequency.setValueAtTime(900, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15);
      setTimeout(() => ctx.close(), 500);
    } catch {}
  }

  // ── Render ──

  override render() {
    if (this.loading) return html`<div class="loading">Loading...</div>`;

    return html`
      ${this.messages.length === 0
        ? html`<div class="empty-state">${svgChat}<span>${this.emptyText}</span></div>`
        : html`
          <div class="chat-messages" @click=${() => this._hideContextMenu()} @touchstart=${() => { if (this._contextMenu) this._hideContextMenu(); }}>
            ${this.messages.map((m, i, arr) => this._renderMessage(m, i, arr))}
          </div>
        `}

      ${this._contextMenu ? this._renderContextMenu() : nothing}
      ${this._typing.length > 0 ? html`<div class="typing-indicator">${this._typing.join(', ')} typing...</div>` : nothing}
      ${this._replyTo ? html`
        <div class="reply-bar">
          <span class="reply-text">Replying to: ${this._replyTo.text}</span>
          <button @click=${() => { this._replyTo = null; }}>✕</button>
        </div>
      ` : nothing}
      ${this._showEmoji ? this._renderEmojiPicker() : nothing}
      ${this.hideInput ? nothing : this._renderInputBar()}
    `;
  }

  private _renderMessage(m: ChatMessage, i: number, arr: ChatMessage[]) {
    if (m.from === 'date') return html`<div class="date-sep">${m.text}</div>`;
    if (m.deleted) return html`<div class="msg-row system"><div class="msg-bubble"><div class="msg them msg-deleted">This message was deleted</div></div></div>`;

    const prevMsg = i > 0 ? arr[i - 1] : null;
    const showSenderName = this.isGroup && m.from === 'them' && (!prevMsg || prevMsg.from !== 'them' || prevMsg.senderId !== m.senderId);

    return html`
      <div class="msg-row ${m.from}"
        @contextmenu=${(e: MouseEvent) => this._showContextMenuHandler(e, i)}
        @touchstart=${(e: TouchEvent) => this._onTouchStart(e, i)}
        @touchend=${() => this._onTouchEnd()}
        @touchmove=${() => this._onTouchMove()}
        @click=${(e: MouseEvent) => this._onMsgTap(e, i)}>
        ${m.from === 'them' ? html`<div class="msg-avatar" style="background:${m.senderColor || '#7c3aed'}">${(m.senderInitials || '?').charAt(0)}</div>` : nothing}
        <div class="msg-bubble" @dblclick=${m.from === 'me' && !m.deleted ? () => this._editMsg(i) : undefined}>
          ${showSenderName ? html`<div class="msg-sender-name" style="color:${m.senderColor || '#7c3aed'}">${m.senderName}</div>` : nothing}
          ${m.replyTo ? html`<div class="msg-reply-quote">${m.replyTo.text}</div>` : nothing}
          ${this._renderAttachment(m)}
          ${this._editingIdx === i
            ? html`<div class="edit-inline"><input class="edit-input" type="text" .value=${m.text || ''} @keydown=${(e: KeyboardEvent) => this._onEditKeydown(e, i)}><button class="edit-confirm" @click=${() => this._confirmEdit(i)}>✓</button><button class="edit-cancel" @click=${() => { this._editingIdx = null; }}>✕</button></div>`
            : m.text ? html`<div class="msg ${m.from}">${m.text}${m.edited ? html` <span class="msg-edited">(edited)</span>` : nothing}${m.encrypted ? html`<span class="msg-e2e" title="End-to-end encrypted">🔒</span>` : nothing}</div>` : nothing}
          <div class="msg-footer ${m.from}">
            <span class="msg-time">${m.time || ''}</span>
            ${m.from === 'me' ? html`<span class="msg-read">${m.status === 'read' ? svgCheckDoubleRead : m.status === 'delivered' ? svgCheckDouble : svgCheck}</span>` : nothing}
          </div>
          ${m.reactions?.length ? html`
            <div class="msg-reactions">
              ${m.reactions.map(r => html`
                <span class="reaction ${r.users?.includes('me') ? 'mine' : ''}" @click=${() => this._reactMsg(i, r.emoji)}>${r.emoji} <span class="count">${r.count}</span></span>
              `)}
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private _renderAttachment(m: ChatMessage) {
    const a = m.attachment;
    if (!a) return nothing;
    if (a.type === 'call') {
      const icon = a.callType === 'video' ? svgVideo : svgPhone;
      const color = (a.callStatus === 'missed' || a.callStatus === 'declined') ? '#ef4444' : '#22c55e';
      return html`<div class="msg-call-log">
        <span style="color:${color}">${icon}</span>
        <div class="msg-call-info">
          <div class="msg-call-type">${a.callType === 'video' ? 'Video call' : 'Voice call'}</div>
          <div class="msg-call-status ${a.callStatus}">${a.callStatus === 'completed' ? (a.duration || 'Ended') : a.callStatus === 'declined' ? 'Declined' : 'Missed'}</div>
        </div>
      </div>`;
    }
    if (a.type === 'image') {
      return html`<div class="msg-attachment"><img src="${a.decryptedUrl || a.url}" alt="${a.name || 'Image'}"></div>`;
    }
    if (a.type === 'audio') {
      const waveform = a.waveform?.length ? a.waveform : Array(36).fill(0.15);
      return html`<div class="msg-attachment"><div class="audio-msg">
        <button class="audio-play-btn" @click=${(e: Event) => this._toggleAudioPlay(e)}>${svgPlay}</button>
        <div class="audio-bars">${waveform.map((h: number) => html`<div class="a-bar" style="height:${Math.round(h * 22 + 3)}px"></div>`)}</div>
        <span class="audio-dur">${a.duration || '0:00'}</span>
        <audio src="${a.decryptedUrl || a.url}" preload="metadata" @timeupdate=${(e: Event) => this._onAudioTimeUpdate(e)} @ended=${(e: Event) => this._onAudioEnded(e)}></audio>
      </div></div>`;
    }
    // Generic file
    return html`<div class="msg-attachment"><a class="file-card" href="${a.decryptedUrl || a.url}" target="_blank" download="${a.name || 'file'}">
      ${svgFile}
      <div style="flex:1;min-width:0"><div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a.name || 'File'}</div>${a.fileSize ? html`<div style="font-size:10px;color:var(--text-secondary);margin-top:1px">${(a.fileSize / 1024).toFixed(0)} KB</div>` : nothing}</div>
      ${svgDownload}
    </a></div>`;
  }

  private _renderContextMenu() {
    const cm = this._contextMenu!;
    const msg = this.messages[cm.msgIdx];
    const isMe = msg?.from === 'me';
    return html`
      <div class="ctx-menu" @mousedown=${(e: Event) => e.preventDefault()} @touchstart=${(e: Event) => e.stopPropagation()} style="top:${cm.y}px;${cm.right != null ? `right:${cm.right}px` : `left:${cm.left}px`}">
        <div class="ctx-reactions">
          ${REACTIONS.map(r => html`<button @click=${() => this._reactMsg(cm.msgIdx, r.key)} title=${r.label}>${r.key}</button>`)}
        </div>
        <button @click=${() => this._replyMsg(cm.msgIdx)}>↩ Reply</button>
        ${isMe && !msg?.deleted ? html`<button @click=${() => this._editMsg(cm.msgIdx)}>✏️ Edit</button>` : nothing}
        ${isMe && !msg?.deleted ? html`<button class="danger" @click=${() => this._deleteMsg(cm.msgIdx)}>🗑 Delete</button>` : nothing}
      </div>
    `;
  }

  private _renderEmojiPicker() {
    return html`
      <div class="emoji-picker" @mousedown=${(e: Event) => e.preventDefault()}>
        <div class="emoji-quick">
          ${REACTIONS.map(r => html`<button @click=${() => this._insertEmoji(r.key)} title=${r.label}>${r.key}</button>`)}
        </div>
        <div class="emoji-grid">
          ${EMOJI_GRID.map(e => html`<button @click=${() => this._insertEmoji(e)}>${e}</button>`)}
        </div>
      </div>
    `;
  }

  private _renderInputBar() {
    return html`
      <div class="chat-input">
        <div class="input-tools">
          <button @click=${() => this._pickFile()} title="Attach file">${svgAttach}</button>
          <button @click=${() => this._pickFile(true)} title="Send image">${svgImage}</button>
          <button @click=${() => this._toggleEmoji()} title="Emoji">${svgSmile}</button>
        </div>
        <textarea rows="1" placeholder="Type a message..." @keydown=${(e: KeyboardEvent) => this._onInputKeydown(e)}></textarea>
        <button class="send-btn" @mousedown=${(e: Event) => e.preventDefault()} @click=${() => this._sendMessage()} title="Send">${svgSend}</button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-chat-panel': NrChatPanelElement;
  }
}
