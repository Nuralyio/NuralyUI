/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, type CSSResult } from 'lit';
import { ThemeAwareMixin, ThemeAware } from './theme-mixin.js';
import { DependencyValidationMixin, DependencyAware } from './dependency-mixin.js';
import { EventHandlerMixin, EventHandlerCapable } from './event-handler-mixin.js';
import { injectStyles } from './style-injector.js';

/**
 * Base interface combining theme awareness, dependency validation, and event handling
 */
export interface NuralyUIBaseElement extends ThemeAware, DependencyAware, EventHandlerCapable {}

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Mixin that switches components to Light DOM rendering and injects styles
 * into document.adoptedStyleSheets once per tag name.
 */
const LightDomMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class LightDomClass extends superClass {
    override createRenderRoot() {
      return this;
    }

    override connectedCallback() {
      super.connectedCallback();

      const ctor = this.constructor as typeof LitElement;
      const tag = this.tagName.toLowerCase();
      const componentStyles = ctor.styles;

      if (componentStyles) {
        const cssText = flattenStyles(componentStyles);
        if (cssText) {
          injectStyles(tag, cssText);
        }
      }
    }
  }
  return LightDomClass as T;
};

/**
 * Global base mixin that combines Light DOM, style injection, ThemeAwareMixin,
 * DependencyValidationMixin, and EventHandlerMixin.
 *
 * Uses **Light DOM** rendering so external CSS can reach component internals.
 * Component styles are injected once per tag into `document.adoptedStyleSheets`.
 *
 * @param superClass - The base class to extend (typically LitElement)
 * @returns Enhanced class with light DOM, style injection, theme management, and dependency validation
 */
export const NuralyUIBaseMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  return DependencyValidationMixin(ThemeAwareMixin(EventHandlerMixin(LightDomMixin(superClass))));
};

/**
 * Alternative shorter name for convenience
 */
export const BaseMixin = NuralyUIBaseMixin;

/**
 * Flatten Lit CSSResult / CSSResult[] into a single CSS string.
 */
function flattenStyles(styles: CSSResult | CSSResult[] | any): string {
  if (Array.isArray(styles)) {
    return styles.map(s => flattenStyles(s)).filter(Boolean).join('\n');
  }
  if (styles && typeof styles.cssText === 'string') {
    return styles.cssText;
  }
  if (typeof styles === 'string') {
    return styles;
  }
  return '';
}
