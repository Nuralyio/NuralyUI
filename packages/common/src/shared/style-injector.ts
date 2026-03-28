/**
 * @license
 * Copyright 2025 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Light DOM style injector — injects component CSS into the document
 * and any ancestor shadow roots, once per tag per root.
 * Uses adoptedStyleSheets for efficient, non-duplicating style injection.
 */
const injected = new Set<string>();
const sheetCache = new Map<string, CSSStyleSheet>();

export function injectStyles(tag: string, cssText: string, element?: HTMLElement) {
  // Ensure we have a cached stylesheet for this tag
  if (!sheetCache.has(tag)) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    sheetCache.set(tag, sheet);
  }
  const sheet = sheetCache.get(tag)!;

  // Always inject into document (light DOM)
  const docKey = `doc:${tag}`;
  if (!injected.has(docKey)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    injected.add(docKey);
  }

  // Also inject into any ancestor shadow root (so it works inside shadow DOM)
  if (element) {
    let node: Node | null = element;
    while (node) {
      const root = node.getRootNode();
      if (root instanceof ShadowRoot) {
        const shadowKey = `shadow:${(root.host?.tagName || '').toLowerCase()}:${tag}`;
        if (!injected.has(shadowKey)) {
          root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
          injected.add(shadowKey);
        }
        node = root.host;
      } else {
        break;
      }
    }
  }
}

/**
 * Check if styles have already been injected for a given tag.
 */
export function hasInjectedStyles(tag: string): boolean {
  return injected.has(tag);
}
