/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import { styles } from './presence-avatars.style.js';
import type { PresenceUser } from './presence.types.js';

/**
 * Renders an overlapping avatar bubble strip for presence indicators.
 * Pure UI — no socket, no state.
 *
 * @example
 * ```html
 * <nr-presence-avatars
 *   .users=${viewers}
 *   max="5"
 *   @user-click=${e => this._openChat(e.detail.user)}
 * ></nr-presence-avatars>
 * ```
 *
 * @fires user-click - Fired when an avatar is clicked. Detail: `{ user: PresenceUser }`
 */
@customElement('nr-presence-avatars')
export class NrPresenceAvatarsElement extends NuralyUIBaseMixin(LitElement) {
  static override styles = styles;

  /** List of users to display */
  @property({ type: Array })
  users: PresenceUser[] = [];

  /** Max visible avatars before +N overflow badge */
  @property({ type: Number })
  max = 5;

  private _handleClick(user: PresenceUser) {
    this.dispatchEvent(new CustomEvent('user-click', {
      detail: { user },
      bubbles: true,
      composed: true,
    }));
  }

  override render() {
    const visible = this.users.slice(0, this.max);
    const extra = Math.max(0, this.users.length - this.max);

    return html`
      <div class="presence">
        ${visible.map(u => html`
          <div class="pa" @click=${() => this._handleClick(u)}>
            <div class="pa-avatar" style="background:${u.color}">
              ${u.avatarUrl
                ? html`<img src="${u.avatarUrl}" alt="${u.displayName}">`
                : (u.initials || (u.displayName || '?')[0].toUpperCase())}
            </div>
            <span class="pa-dot"></span>
            <span class="pa-tip">${u.displayName}</span>
          </div>
        `)}
        ${extra > 0 ? html`
          <div class="pa pa-extra">
            <div class="pa-avatar" title="${extra} more">+${extra}</div>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-presence-avatars': NrPresenceAvatarsElement;
  }
}
