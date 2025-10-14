/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, LitElement } from 'lit';
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
 * A pop-up confirmation dialog triggered by user interaction. It provides a simple and
 * compact way to ask for user confirmation before performing an action.
 *
 * ## Features
 * - Customizable title and description
 * - Configurable OK and Cancel buttons
 * - Multiple placement options (12 positions)
 * - Custom icons with predefined options
 * - Async confirmation support
 * - Multiple trigger modes (click, hover, focus)
 * - Theme-aware styling
 * - Keyboard accessibility
 *
 * ## Usage
 * ```html
 * <!-- Basic popconfirm -->
 * <nr-popconfirm
 *   title="Are you sure delete this task?"
 *   ok-text="Yes"
 *   cancel-text="No">
 *   <button slot="trigger">Delete</button>
 * </nr-popconfirm>
 *
 * <!-- With description -->
 * <nr-popconfirm
 *   title="Delete the task"
 *   description="Are you sure you want to delete this task? This action cannot be undone."
 *   ok-type="danger">
 *   <button slot="trigger">Delete</button>
 * </nr-popconfirm>
 *
 * <!-- Custom icon -->
 * <nr-popconfirm
 *   title="Change status?"
 *   icon="question-circle"
 *   icon-color="#1890ff">
 *   <button slot="trigger">Change Status</button>
 * </nr-popconfirm>
 * ```
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
  static override styles = styles;

  override requiredComponents = ['nr-dropdown', 'nr-icon'];

  /**
   * Title of the confirmation box
   */
  @property({ type: String }) override title = '';

  /**
   * Description of the confirmation box (optional)
   */
  @property({ type: String }) description = '';

  /**
   * Text of the OK button
   */
  @property({ type: String, attribute: 'ok-text' }) okText = 'OK';

  /**
   * Text of the Cancel button
   */
  @property({ type: String, attribute: 'cancel-text' }) cancelText = 'Cancel';

  /**
   * Button type of the OK button
   */
  @property({ type: String, attribute: 'ok-type' }) okType: PopconfirmButtonType =
    PopconfirmButtonType.Primary;

  /**
   * Show cancel button
   */
  @property({ type: Boolean, attribute: 'show-cancel' }) showCancel = true;

  /**
   * Icon name for the confirmation box
   */
  @property({ type: String }) icon = PopconfirmIcon.Warning;

  /**
   * Custom icon color
   */
  @property({ type: String, attribute: 'icon-color' }) iconColor = '';

  /**
   * Placement of the popconfirm
   */
  @property({ type: String }) placement: PopconfirmPlacement = PopconfirmPlacement.Top;

  /**
   * Trigger mode
   */
  @property({ type: String }) trigger: PopconfirmTrigger = PopconfirmTrigger.Click;

  /**
   * Whether the popconfirm is disabled
   */
  @property({ type: Boolean }) disabled = false;

  /**
   * Whether to show arrow
   */
  @property({ type: Boolean }) arrow = true;

  /**
   * Whether the popconfirm is open
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Loading state for OK button (for async operations)
   */
  @state() private okLoading = false;

  /**
   * Reference to the dropdown element
   */
  private get dropdownElement(): any {
    return this.shadowRoot?.querySelector('nr-dropdown');
  }

  /**
   * Handle confirm button click
   */
  private handleConfirm = async (e: Event) => {
    e.stopPropagation();

    const confirmEvent = new CustomEvent('nr-confirm', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { originalEvent: e },
    });

    const dispatched = this.dispatchEvent(confirmEvent);

    // If event is not prevented, close the popconfirm
    if (dispatched && !confirmEvent.defaultPrevented) {
      // Check if the event handler returns a promise
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

  /**
   * Handle cancel button click
   */
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

  /**
   * Close the popconfirm
   */
  private closePopconfirm() {
    this.open = false;
    if (this.dropdownElement) {
      this.dropdownElement.open = false;
    }
  }

  /**
   * Handle dropdown open/close events
   */
  private handleOpenChange = (e: CustomEvent) => {
    this.open = e.detail.open;
    this.dispatchEvent(
      new CustomEvent('nr-open-change', {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      })
    );
  };

  /**
   * Get icon color based on icon type
   */
  private getIconColor(): string {
    if (this.iconColor) {
      return this.iconColor;
    }

    // Return empty string to use CSS class colors
    return '';
  }

  /**
   * Get icon class based on icon type
   */
  private getIconClass(): string {
    const iconColorMap: Record<string, string> = {
      [PopconfirmIcon.Warning]: 'warning',
      [PopconfirmIcon.Question]: 'question',
      [PopconfirmIcon.Info]: 'info',
      [PopconfirmIcon.Error]: 'error',
      [PopconfirmIcon.Success]: 'success',
    };

    if (this.iconColor) {
      return 'custom';
    }

    return iconColorMap[this.icon] || 'warning';
  }

  /**
   * Render the popconfirm content
   */
  private renderContent() {
    const iconClass = this.getIconClass();
    const iconColor = this.getIconColor();
    const okButtonClass = `ok-${this.okType}`;

    return html`
      <div class="popconfirm-content">
        <div class="popconfirm-message">
          <div
            class="popconfirm-icon popconfirm-icon--${iconClass}"
            style=${iconColor ? `color: ${iconColor}` : ''}>
            <nr-icon name=${this.icon}></nr-icon>
          </div>
          <div class="popconfirm-text">
            ${this.title ? html`<div class="popconfirm-title">${this.title}</div>` : ''}
            ${this.description
              ? html`<div class="popconfirm-description">${this.description}</div>`
              : ''}
          </div>
        </div>
        <div class="popconfirm-buttons">
          ${this.showCancel
            ? html`
                <button
                  class="popconfirm-button popconfirm-button--cancel"
                  @click=${this.handleCancel}
                  type="button">
                  ${this.cancelText}
                </button>
              `
            : ''}
          <button
            class=${classMap({
              'popconfirm-button': true,
              [`popconfirm-button--${okButtonClass}`]: true,
              'popconfirm-button--loading': this.okLoading,
            })}
            @click=${this.handleConfirm}
            ?disabled=${this.okLoading}
            type="button">
            ${this.okText}
          </button>
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      <nr-dropdown
        .open=${this.open}
        .placement=${this.placement as any}
        .trigger=${this.trigger as any}
        ?disabled=${this.disabled}
        ?arrow=${this.arrow}
        @nr-dropdown-open=${this.handleOpenChange}
        @nr-dropdown-close=${this.handleOpenChange}>
        <slot name="trigger" slot="trigger"></slot>
        <div slot="content">${this.renderContent()}</div>
      </nr-dropdown>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-popconfirm': NrPopconfirmElement;
  }
}
