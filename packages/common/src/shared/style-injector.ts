/**
 * @license
 * Copyright 2025 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Light DOM style injector — injects component CSS into the document once per tag.
 * Uses adoptedStyleSheets for efficient, non-duplicating style injection.
 */
const injected = new Set<string>();

export function injectStyles(tag: string, cssText: string) {
  if (injected.has(tag)) return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  injected.add(tag);
}

/**
 * Check if styles have already been injected for a given tag.
 */
export function hasInjectedStyles(tag: string): boolean {
  return injected.has(tag);
}
