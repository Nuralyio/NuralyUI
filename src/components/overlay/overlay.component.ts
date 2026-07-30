/**
 * @license
 * Copyright 2026 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './overlay.style.js';
import { OverlayPlacement, OverlaySize, EMPTY_STRING } from './overlay.types.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';

/**
 * A surface that covers the page to hold a task.
 *
 * Where `nr-modal` asks a question and waits for an answer — confirm, cancel,
 * a form of a few fields — an overlay is somewhere to *work*: settings, a
 * browser, an editor. It is sized as a proportion of the viewport, it can go
 * fullscreen, and its content is the host's to lay out. It has no footer and
 * no buttons of its own, because there is nothing here to confirm.
 *
 * @element nr-overlay
 *
 * @fires nr-open - Opened
 * @fires nr-close - Closed, with `detail.reason` — 'escape', 'scrim' or 'close'
 * @fires nr-fullscreen - Fullscreen toggled, with `detail.fullscreen`
 *
 * @slot - The content
 * @slot header - Replaces the whole header bar
 * @slot actions - Extra buttons, before the close button
 *
 * @csspart surface - The panel
 * @csspart header - The header bar
 * @csspart content - The content wrapper
 *
 * @example
 * ```html
 * <nr-overlay open label="Settings" @nr-close=${() => (this.open = false)}>
 *   <my-settings></my-settings>
 * </nr-overlay>
 * ```
 */
@customElement('nr-overlay')
export class NrOverlayElement extends NuralyUIBaseMixin(LitElement) {
  /**
   * The mixin renders into the Light DOM by default, which an overlay cannot
   * do: its content arrives through `<slot>`, and without a shadow root the
   * template overwrites the very children it was meant to project.
   */
  static useShadowDom = true;
  static override styles = styles;

  override requiredComponents = ['nr-icon'];

  /** Whether the overlay is on screen. Reflected, so CSS can select on it. */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** What this overlay is, shown in the header and read to assistive tech. */
  @property({ type: String })
  label = EMPTY_STRING;

  @property({ type: String, reflect: true })
  size: OverlaySize = OverlaySize.Default;

  @property({ type: String, reflect: true })
  placement: OverlayPlacement = OverlayPlacement.Center;

  /** Offer the fullscreen toggle. */
  @property({ type: Boolean, attribute: 'allow-fullscreen' })
  allowFullscreen = false;

  /** Currently fullscreen. Reflected so the host can style around it. */
  @property({ type: Boolean, reflect: true })
  fullscreen = false;

  /**
   * Keep the overlay open when the scrim is clicked or Escape is pressed.
   *
   * For work that would be lost: a half-filled form is worse to dismiss by a
   * stray click than to close deliberately.
   */
  @property({ type: Boolean, attribute: 'no-dismiss' })
  noDismiss = false;

  /** Hide the header entirely; the content provides its own. */
  @property({ type: Boolean, attribute: 'no-header' })
  noHeader = false;

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.onKeydown);
  }

  override disconnectedCallback(): void {
    document.removeEventListener('keydown', this.onKeydown);
    super.disconnectedCallback();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('open') && this.open) {
      this.dispatchEvent(new CustomEvent('nr-open', { bubbles: true, composed: true }));
      // Focus moves into the overlay, so the keyboard is where the eye is.
      this.updateComplete.then(() => {
        const target = this.querySelector<HTMLElement>('[autofocus]')
          ?? this.shadowRoot?.querySelector<HTMLElement>('.close');
        target?.focus();
      });
    }
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (!this.open || e.key !== 'Escape' || this.noDismiss) return;
    e.stopPropagation();
    this.close('escape');
  };

  private close(reason: 'escape' | 'scrim' | 'close') {
    this.open = false;
    this.dispatchEvent(new CustomEvent('nr-close', {
      detail: { reason },
      bubbles: true,
      composed: true,
    }));
  }

  private toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    this.dispatchEvent(new CustomEvent('nr-fullscreen', {
      detail: { fullscreen: this.fullscreen },
      bubbles: true,
      composed: true,
    }));
  }

  override render() {
    if (!this.open) return nothing;
    return html`
      <div class="scrim" @click=${() => { if (!this.noDismiss) this.close('scrim'); }}></div>
      <div
        class="surface"
        part="surface"
        role="dialog"
        aria-modal="true"
        aria-label=${this.label || 'Overlay'}
      >
        ${this.noHeader ? nothing : html`
          <header part="header">
            <slot name="header">
              <span class="title">${this.label}</span>
            </slot>
            <slot name="actions"></slot>
            ${this.allowFullscreen ? html`
              <button
                class="fullscreen"
                title=${this.fullscreen ? 'Leave fullscreen' : 'Fullscreen'}
                aria-label=${this.fullscreen ? 'Leave fullscreen' : 'Fullscreen'}
                @click=${this.toggleFullscreen}
              >
                <nr-icon name=${this.fullscreen ? 'minimize' : 'maximize'} size="small"></nr-icon>
              </button>` : nothing}
            <button
              class="close"
              title="Close"
              aria-label=${`Close ${this.label || 'overlay'}`}
              @click=${() => this.close('close')}
            >
              <!-- "x", not "close": the icon set has no glyph by that name and
                   would draw the word instead. -->
              <nr-icon name="x" size="small"></nr-icon>
            </button>
          </header>`}
        <div class="content" part="content"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-overlay': NrOverlayElement;
  }
}
