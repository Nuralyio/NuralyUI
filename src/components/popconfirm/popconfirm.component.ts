/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, LitElement, render, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styles } from './popconfirm.style.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import {
  PopconfirmPlacement,
  PopconfirmTrigger,
  PopconfirmButtonType,
  PopconfirmIcon,
} from './popconfirm.types.js';

/**
 * # Popconfirm Component
 *
 * A pop-up confirmation dialog triggered by user interaction. The panel is rendered
 * into a body-level portal so it escapes ancestor stacking contexts and is not
 * hidden when the trigger's ancestors are toggled with `display: none`.
 *
 * @element nr-popconfirm
 * @fires nr-confirm - Fired when user confirms the action
 * @fires nr-cancel - Fired when user cancels the action
 * @fires nr-open-change - Fired when popconfirm visibility changes
 *
 * @slot trigger - Element that triggers the popconfirm
 *
 * @cssproperty --nuraly-popconfirm-icon-color - Custom icon color
 */
@customElement('nr-popconfirm')
export class NrPopconfirmElement extends NuralyUIBaseMixin(LitElement) {
  static useShadowDom = true;
  static override styles = styles;

  override requiredComponents = ['nr-icon', 'nr-button', 'nr-label'];

  @property({ type: String }) override title = '';
  @property({ type: String }) description = '';
  @property({ type: String, attribute: 'ok-text' }) okText = 'OK';
  @property({ type: String, attribute: 'cancel-text' }) cancelText = 'Cancel';
  @property({ type: String, attribute: 'ok-type' }) okType: PopconfirmButtonType =
    PopconfirmButtonType.Primary;
  @property({ type: Boolean, attribute: 'show-cancel' }) showCancel = true;
  @property({ type: String }) icon = PopconfirmIcon.Warning;
  @property({ type: String, attribute: 'icon-color' }) iconColor = '';
  @property({ type: String }) placement: PopconfirmPlacement = PopconfirmPlacement.Top;
  @property({ type: String }) trigger: PopconfirmTrigger = PopconfirmTrigger.Click;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) arrow = true;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private okLoading = false;

  private _portalHost: HTMLDivElement | null = null;
  private _portalRoot: ShadowRoot | null = null;

  private _boundHandleOutsideClick: ((e: Event) => void) | null = null;
  private _boundHandleKeydown: ((e: KeyboardEvent) => void) | null = null;
  private _boundReposition: (() => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._boundHandleOutsideClick = this.handleOutsideClick.bind(this);
    this._boundHandleKeydown = this.handleKeydown.bind(this);
    this._boundReposition = () => this.reposition();
    document.addEventListener('click', this._boundHandleOutsideClick, true);
    document.addEventListener('keydown', this._boundHandleKeydown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._boundHandleOutsideClick) {
      document.removeEventListener('click', this._boundHandleOutsideClick, true);
    }
    if (this._boundHandleKeydown) {
      document.removeEventListener('keydown', this._boundHandleKeydown);
    }
    this._detachViewportListeners();
    this._teardownPortal();
  }

  override updated(changed: Map<string, any>): void {
    super.updated(changed);
    if (changed.has('open')) {
      if (this.open) {
        this._attachViewportListeners();
      } else {
        this._detachViewportListeners();
      }
    }
    this._renderPortal();
  }

  private _ensurePortal(): ShadowRoot {
    if (this._portalRoot) return this._portalRoot;
    const host = document.createElement('div');
    host.setAttribute('data-nr-popconfirm-portal', '');
    host.style.position = 'fixed';
    host.style.top = '0';
    host.style.left = '0';
    host.style.width = '0';
    host.style.height = '0';
    host.style.zIndex = '2147483000';
    document.body.appendChild(host);
    this._portalHost = host;
    this._portalRoot = host.attachShadow({ mode: 'open' });
    return this._portalRoot;
  }

  private _teardownPortal(): void {
    if (this._portalRoot) {
      render(nothing, this._portalRoot);
    }
    if (this._portalHost && this._portalHost.parentNode) {
      this._portalHost.parentNode.removeChild(this._portalHost);
    }
    this._portalHost = null;
    this._portalRoot = null;
  }

  private _attachViewportListeners(): void {
    if (!this._boundReposition) return;
    window.addEventListener('scroll', this._boundReposition, true);
    window.addEventListener('resize', this._boundReposition);
  }

  private _detachViewportListeners(): void {
    if (!this._boundReposition) return;
    window.removeEventListener('scroll', this._boundReposition, true);
    window.removeEventListener('resize', this._boundReposition);
  }

  private _renderPortal(): void {
    if (!this.open) {
      if (this._portalRoot) {
        render(nothing, this._portalRoot);
      }
      return;
    }
    const root = this._ensurePortal();
    render(this._renderPortalTemplate(), root);
    requestAnimationFrame(() => this.reposition());
  }

  private _renderPortalTemplate() {
    const placementClass = `popconfirm-panel--${this.placement}`;
    return html`
      <style>${(styles as any).cssText}</style>
      <div
        class="popconfirm-panel ${classMap({ [placementClass]: true, 'popconfirm-panel--with-arrow': this.arrow })}"
        part="panel"
        role="dialog"
        @click=${(e: Event) => e.stopPropagation()}>
        ${this.arrow ? html`<div class="popconfirm-arrow" part="arrow"></div>` : nothing}
        ${this.renderContent()}
      </div>
    `;
  }

  private reposition(): void {
    if (!this.open || !this._portalRoot) return;
    const panel = this._portalRoot.querySelector('.popconfirm-panel') as HTMLElement | null;
    if (!panel) return;

    const triggerRect = this.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const offset = 8;
    const placement = this.placement || PopconfirmPlacement.Top;

    let top = 0;
    let left = 0;

    if (placement.startsWith('top')) {
      top = triggerRect.top - panelRect.height - offset;
    } else if (placement.startsWith('bottom')) {
      top = triggerRect.bottom + offset;
    } else if (placement.startsWith('left')) {
      left = triggerRect.left - panelRect.width - offset;
    } else if (placement.startsWith('right')) {
      left = triggerRect.right + offset;
    }

    if (placement === PopconfirmPlacement.Top || placement === PopconfirmPlacement.Bottom) {
      left = triggerRect.left + (triggerRect.width - panelRect.width) / 2;
    } else if (placement === PopconfirmPlacement.Left || placement === PopconfirmPlacement.Right) {
      top = triggerRect.top + (triggerRect.height - panelRect.height) / 2;
    } else if (placement.endsWith('-start')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        left = triggerRect.left;
      } else {
        top = triggerRect.top;
      }
    } else if (placement.endsWith('-end')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        left = triggerRect.right - panelRect.width;
      } else {
        top = triggerRect.bottom - panelRect.height;
      }
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    left = Math.max(8, Math.min(left, vw - panelRect.width - 8));
    top = Math.max(8, Math.min(top, vh - panelRect.height - 8));

    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
  }

  private handleTriggerClick = (e: Event): void => {
    if (this.disabled) return;
    e.stopPropagation();
    if (this.open) {
      this.closePopconfirm();
    } else {
      this.openPopconfirm();
    }
  };

  private openPopconfirm(): void {
    this.open = true;
    this.dispatchEvent(
      new CustomEvent('nr-open-change', {
        bubbles: true,
        composed: true,
        detail: { open: true },
      })
    );
  }

  private closePopconfirm(): void {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('nr-open-change', {
        bubbles: true,
        composed: true,
        detail: { open: false },
      })
    );
  }

  private handleOutsideClick(e: Event): void {
    if (!this.open) return;
    const path = e.composedPath();
    if (path.includes(this)) return;
    if (this._portalHost && path.includes(this._portalHost)) return;
    this.closePopconfirm();
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.open) {
      this.closePopconfirm();
    }
  }

  private handleConfirm = async (e: Event) => {
    e.stopPropagation();

    const confirmEvent = new CustomEvent('nr-confirm', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { originalEvent: e },
    });

    const dispatched = this.dispatchEvent(confirmEvent);

    if (dispatched && !confirmEvent.defaultPrevented) {
      const handler = (this as any).onConfirm;
      if (handler && typeof handler === 'function') {
        const result = handler(e);
        if (result && typeof result.then === 'function') {
          this.okLoading = true;
          try {
            await result;
            this.closePopconfirm();
          } catch (error) {
            console.error('Confirmation failed:', error);
          } finally {
            this.okLoading = false;
          }
          return;
        }
      }
      this.closePopconfirm();
    }
  };

  private handleCancel = (e: Event) => {
    e.stopPropagation();

    this.dispatchEvent(
      new CustomEvent('nr-cancel', {
        bubbles: true,
        composed: true,
        detail: { originalEvent: e },
      })
    );

    this.closePopconfirm();
  };

  private getIconColor(): string {
    return this.iconColor || '';
  }

  private getIconClass(): string {
    const iconColorMap: Record<string, string> = {
      [PopconfirmIcon.Warning]: 'warning',
      [PopconfirmIcon.Question]: 'question',
      [PopconfirmIcon.Info]: 'info',
      [PopconfirmIcon.Error]: 'error',
      [PopconfirmIcon.Success]: 'success',
    };
    if (this.iconColor) return 'custom';
    return iconColorMap[this.icon] || 'warning';
  }

  private renderContent() {
    const iconClass = this.getIconClass();
    const iconColor = this.getIconColor();

    return html`
      <div class="popconfirm-content" part="content">
        <div class="popconfirm-message" part="message">
          <div
            class="popconfirm-icon popconfirm-icon--${iconClass}"
            part="icon"
            style=${iconColor ? `color: ${iconColor}` : ''}>
            <nr-icon name=${this.icon}></nr-icon>
          </div>
          <div class="popconfirm-text" part="text">
            ${this.title ? html`<nr-label class="popconfirm-title" size="medium">${this.title}</nr-label>` : ''}
            ${this.description
              ? html`<nr-label class="popconfirm-description" size="small" variant="secondary">${this.description}</nr-label>`
              : ''}
          </div>
        </div>
        <div class="popconfirm-buttons" part="buttons">
          ${this.showCancel
            ? html`
                <nr-button
                  size="small"
                  part="cancel-button"
                  @click=${this.handleCancel}>
                  ${this.cancelText}
                </nr-button>
              `
            : ''}
          <nr-button
            size="small"
            part="confirm-button"
            type=${this.okType === 'danger' ? 'danger' : this.okType === 'primary' ? 'primary' : 'default'}
            ?loading=${this.okLoading}
            ?disabled=${this.okLoading}
            @click=${this.handleConfirm}>
            ${this.okText}
          </nr-button>
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="popconfirm-trigger" part="trigger" @click=${this.handleTriggerClick}>
        <slot name="trigger"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-popconfirm': NrPopconfirmElement;
  }
}
