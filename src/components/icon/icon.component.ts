/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @license
 * Copyright 2023 Nuraly Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, svg as litSvg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { styles } from './icon.style.js';
import { IconTypes } from './icon.types.js';
import { iconPaths } from './icon-paths.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import { ClickableMixin } from './mixins/index.js';

/**
 * Icon component using inline SVG paths (no external dependencies).
 *
 * @example
 * ```html
 * <nr-icon name="mail"></nr-icon>
 * <nr-icon name="check" clickable @icon-click="${this.handleIconClick}"></nr-icon>
 * <nr-icon name="star" color="#ffd700" size="large"></nr-icon>
 * ```
 *
 * @fires icon-click - Dispatched when icon is clicked
 * @fires icon-keyboard-activation - Dispatched when icon is activated via keyboard
 */

const IconBaseMixin = ClickableMixin(NuralyUIBaseMixin(LitElement));
@customElement('nr-icon')
export class HyIconElement extends IconBaseMixin {
  static useShadowDom = true;
  static override readonly styles = styles;

  /** The icon name (kebab-case, e.g. "arrow-down", "check-square") */
  @property({type: String})
  name!: string;

  /** The icon type (solid or regular) */
  @property()
  type = IconTypes.Regular;

  /** Alternative text for accessibility */
  @property({type: String, attribute: 'alt'})
  alt = '';

  /** Icon size (small, medium, large, xlarge, xxlarge) */
  @property({type: String, reflect: true})
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

  /** Icon color override */
  @property({type: String})
  color?: string;

  /** Custom width override */
  @property({type: String})
  width?: string;

  /** Custom height override */
  @property({type: String})
  height?: string;

  /**
   * Validate component properties on update
   */
  override willUpdate(changedProperties: Map<string, any>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has('name') && !this.name) {
      console.error('HyIconElement: "name" property is required');
    }

    if (changedProperties.has('type') &&
        this.type !== IconTypes.Solid && this.type !== IconTypes.Regular) {
      console.warn(`HyIconElement: Invalid type "${this.type}". Using default "${IconTypes.Solid}"`);
      this.type = IconTypes.Solid;
    }

    if (changedProperties.has('size') && this.size) {
      const validSizes = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
      if (!validSizes.includes(this.size)) {
        console.warn(`HyIconElement: Invalid size "${this.size}". Valid sizes are: ${validSizes.join(', ')}`);
      }
    }
  }

  override render() {
    let dynamicStyles = '';
    if (this.color) dynamicStyles += `color: ${this.color};`;
    if (this.width) dynamicStyles += `width: ${this.width};`;
    if (this.height) dynamicStyles += `height: ${this.height};`;

    const pathData = iconPaths[this.name];

    return html`
      <div
        id="icon-slot"
        class="icon-container ${this.clickable ? 'clickable' : ''} ${this.disabled ? 'disabled' : ''}"
        style="${dynamicStyles}"
        role="${this.getIconRole()}"
        tabindex="${this.getIconTabIndex()}"
        aria-label="${this.alt || this.name}"
        ?aria-disabled="${this.disabled}"
        @click="${this.clickable ? (e: MouseEvent) => this.handleIconClick(e) : undefined}"
        @keydown="${this.clickable ? (e: KeyboardEvent) => this.handleIconKeydown(e) : undefined}"
      >
        ${pathData ? html`
          <svg
            class="svg-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >${unsafeHTML(pathData)}</svg>
        ` : html`<span class="icon-fallback">${this.name}</span>`}
      </div>
    `;
  }

  /**
   * Get the appropriate ARIA role for the icon
   */
  override getIconRole(): string {
    if (this.clickable) return 'button';
    return this.alt ? 'img' : 'presentation';
  }

  /**
   * Get the appropriate tabindex for the icon
   */
  override getIconTabIndex(): string {
    if (this.clickable && !this.disabled) return '0';
    return '-1';
  }

  /**
   * Get the appropriate aria-disabled value
   */
  override getAriaDisabled(): string | undefined {
    return this.disabled ? 'true' : undefined;
  }
}
