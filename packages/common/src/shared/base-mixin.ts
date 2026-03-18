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
 * Interface for Light DOM content projection (replacement for Shadow DOM <slot>)
 */
export interface LightDomContent {
  /** Default-slot children (nodes without a `slot` attribute) */
  readonly lightChildren: Node[];
  /** Named-slot children (elements with `slot="name"`) */
  lightChildrenNamed(name: string): Element[];
}

/**
 * Base interface combining theme awareness, dependency validation, event handling, and Light DOM content
 */
export interface NuralyUIBaseElement extends ThemeAware, DependencyAware, EventHandlerCapable, LightDomContent {}

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Mixin that switches components to Light DOM rendering, injects styles into
 * document.adoptedStyleSheets, and provides Light DOM content projection
 * (replacement for Shadow DOM <slot>).
 */
const LightDomMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class LightDomClass extends superClass {
    /**
     * Original children saved before Lit's first render.
     * Use `lightChildren` / `lightChildrenNamed(name)` in templates
     * instead of `<slot>` / `<slot name="...">`.
     */
    private __lightDomChildren: Node[] | null = null;

    override createRenderRoot() {
      return this;
    }

    override connectedCallback() {
      // Save and remove original children BEFORE super triggers first render.
      // This prevents duplicated content (original children as siblings + template output).
      if (this.__lightDomChildren === null) {
        this.__lightDomChildren = [];
        while (this.firstChild) {
          this.__lightDomChildren.push(this.removeChild(this.firstChild));
        }
      }

      super.connectedCallback();

      // Inject component styles into document.adoptedStyleSheets once per tag
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

    /**
     * Get default-slot children (nodes without a `slot` attribute).
     * Use in templates: `html\`<span>\${this.lightChildren}</span>\``
     */
    get lightChildren(): Node[] {
      if (!this.__lightDomChildren) return [];
      return this.__lightDomChildren.filter(
        n => !(n instanceof Element && n.hasAttribute('slot'))
      );
    }

    /**
     * Get named-slot children (elements with `slot="name"`).
     * Use in templates: `html\`<span>\${this.lightChildrenNamed('icon')}</span>\``
     */
    lightChildrenNamed(name: string): Element[] {
      if (!this.__lightDomChildren) return [];
      return this.__lightDomChildren.filter(
        (n): n is Element => n instanceof Element && n.getAttribute('slot') === name
      );
    }
  }
  return LightDomClass as Constructor<LightDomContent> & T;
};

/**
 * Global base mixin that combines Light DOM, style injection, ThemeAwareMixin,
 * DependencyValidationMixin, and EventHandlerMixin.
 *
 * Uses **Light DOM** rendering so external CSS can reach component internals.
 * Component styles are injected once per tag into `document.adoptedStyleSheets`.
 *
 * Instead of `<slot>`, use:
 * - `this.lightChildren` for default slot content
 * - `this.lightChildrenNamed('name')` for named slot content
 *
 * @param superClass - The base class to extend (typically LitElement)
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
