/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import { styles } from './presence-chat.style.js';
import type { PresenceUser, PresenceChatMessage } from './presence.types.js';

/**
 * A floating, draggable, minimizable chat panel.
 * Pure UI — all state owned by parent (`nr-presence`).
 *
 * @fires drag-start - User started dragging header. Detail: `{ offsetX, offsetY }`
 * @fires minimize   - Minimize button clicked
 * @fires restore    - Minimized header clicked (open above slot)
 * @fires float      - Float/detach button clicked (restore to saved pos)
 * @fires close      - Close button clicked
 * @fires send       - Message sent. Detail: `{ text: string }`
 * @fires focus      - Panel mousedown (bring to front)
 */
@customElement('nr-presence-chat')
export class NrPresenceChatElement extends NuralyUIBaseMixin(LitElement) {
  static override styles = styles;
  static useShadowDom = true;

  /** User this chat is with */
  @property({ type: Object })
  user: PresenceUser = { displayName: '', color: '#7c3aed' };

  /** Panel left position (px) */
  @property({ type: Number })
  x = 300;

  /** Panel top position (px) */
  @property({ type: Number })
  y = 200;

  /** z-index */
  @property({ type: Number })
  z = 100;

  /** Minimized state */
  @property({ type: Boolean })
  minimized = false;

  /** Position index in bottom minimized strip (0, 1, 2…) */
  @property({ type: Number })
  minimizedIndex = 0;

  /** Chat messages array */
  @property({ type: Array })
  messages: PresenceChatMessage[] = [];

  @state()
  private _draft = '';

  private _emit(type: string, detail?: unknown) {
    this.dispatchEvent(new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  private _onHeaderMousedown(e: MouseEvent) {
    if (this.minimized) return;
    const rect = this.getBoundingClientRect();
    this._emit('drag-start', { offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
    e.preventDefault();
  }

  private _onHeaderClick() {
    if (this.minimized) this._emit('restore');
  }

  private _onSend() {
    const text = this._draft.trim();
    if (!text) return;
    this._emit('send', { text });
    this._draft = '';
  }

  private _onInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') this._onSend();
    if (e.key === 'Escape') this._emit('close');
  }

  override updated() {
    // Light DOM component — apply layout directly to host element
    this.style.position = 'fixed';
    this.style.display = 'block';
    this.style.width = '300px';
    if (this.minimized) {
      this.style.right = `${12 + this.minimizedIndex * 212}px`;
      this.style.bottom = '0';
      this.style.top = 'auto';
      this.style.left = 'auto';
    } else {
      this.style.left = `${this.x}px`;
      this.style.top = `${this.y}px`;
      this.style.right = 'auto';
      this.style.bottom = 'auto';
    }
    this.style.zIndex = String(this.z);
  }

  override render() {
    return html`
      <div
        class="chat-panel${this.minimized ? ' minimized' : ''}"
        @mousedown=${() => this._emit('focus')}
      >
        <div
          class="chat-header"
          @mousedown=${this._onHeaderMousedown}
          @click=${this._onHeaderClick}
        >
          <div class="chat-header-avatar" style="background:${this.user.color}">
            ${this.user.avatarUrl
              ? html`<img src="${this.user.avatarUrl}" alt="${this.user.displayName}">`
              : (this.user.initials || (this.user.displayName || '?')[0].toUpperCase())}
          </div>
          <div class="chat-header-info">
            <div class="chat-header-name">${this.user.displayName}</div>
            ${!this.minimized ? html`<div class="chat-header-status">Online</div>` : nothing}
          </div>

          ${this.minimized ? html`
            <button
              class="chat-btn"
              title="Float"
              @mousedown=${(e: MouseEvent) => e.stopPropagation()}
              @click=${(e: MouseEvent) => { e.stopPropagation(); this._emit('float'); }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="15 3 21 3 21 9"/>
                <polyline points="9 21 3 21 3 15"/>
                <line x1="21" y1="3" x2="14" y2="10"/>
                <line x1="3" y1="21" x2="10" y2="14"/>
              </svg>
            </button>
          ` : html`
            <button
              class="chat-btn"
              title="Minimize"
              @mousedown=${(e: MouseEvent) => e.stopPropagation()}
              @click=${(e: MouseEvent) => { e.stopPropagation(); this._emit('minimize'); }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          `}

          <button
            class="chat-btn"
            title="Close"
            @mousedown=${(e: MouseEvent) => e.stopPropagation()}
            @click=${(e: MouseEvent) => { e.stopPropagation(); this._emit('close'); }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="chat-messages">
          ${this.messages.length === 0 ? html`
            <div class="chat-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>No messages yet</span>
              <span style="font-size:11px">Say hi to ${this.user.displayName}!</span>
            </div>
          ` : this.messages.map(m => html`
            <div class="chat-msg ${m.me ? 'me' : 'other'}">
              <div class="chat-bubble">${m.text}</div>
              <span class="chat-time">${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          `)}
        </div>

        <div class="chat-input-row">
          <input
            part="input-container"
            class="chat-input"
            placeholder="Type a message..."
            .value=${this._draft}
            @input=${(e: InputEvent) => { this._draft = (e.target as HTMLInputElement).value; }}
            @keydown=${this._onInputKeydown}
          >
          <button
            class="chat-send"
            ?disabled=${!this._draft.trim()}
            @click=${this._onSend}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-presence-chat': NrPresenceChatElement;
  }
}
