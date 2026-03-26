/**
 * @license
 * Copyright 2024 Nuraly
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  :host([hidden]) {
    display: none;
  }

  .editor-container {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 80px;
    border-radius: 8px;
    border: 1px solid var(--nr-border, #e0e0e0);
    overflow: auto;
    font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 13px;
    line-height: 1.6;
  }

  /* Light theme */
  .editor-container.light {
    background: #fafafa;
    color: #24292e;
  }

  .editor-container.light .line-numbers-gutter {
    background: #f0f0f0;
    color: #999;
    border-right: 1px solid #e0e0e0;
  }

  /* Dark theme */
  .editor-container.dark {
    background: #1e1e1e;
    color: #d4d4d4;
    border-color: #333;
  }

  .editor-container.dark .line-numbers-gutter {
    background: #1a1a1a;
    color: #555;
    border-right: 1px solid #333;
  }

  /* Line numbers gutter */
  .line-numbers-gutter {
    flex-shrink: 0;
    width: 48px;
    padding: 10px 0;
    text-align: right;
    user-select: none;
    overflow: hidden;
  }

  .line-number {
    padding: 0 12px 0 0;
    font-size: inherit;
    line-height: inherit;
  }

  /* Editor area */
  .editor {
    flex: 1;
    min-width: 0;
    padding: 10px 16px;
    outline: none;
    overflow: auto;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    white-space: pre;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .editor:focus {
    outline: none;
  }

  /* Selection colors */
  .editor-container.light .editor::selection,
  .editor-container.light .editor *::selection {
    background: rgba(124, 58, 237, 0.15);
  }

  .editor-container.dark .editor::selection,
  .editor-container.dark .editor *::selection {
    background: rgba(124, 58, 237, 0.3);
  }

  /* Caret color */
  .editor-container.light .editor {
    caret-color: #24292e;
  }

  .editor-container.dark .editor {
    caret-color: #d4d4d4;
  }

  /* Readonly state */
  :host([readonly]) .editor {
    opacity: 0.7;
    cursor: default;
  }

  /* ======== Syntax highlighting — Light theme ======== */
  .editor-container.light .hljs-keyword { color: #d73a49; }
  .editor-container.light .hljs-string { color: #032f62; }
  .editor-container.light .hljs-number { color: #005cc5; }
  .editor-container.light .hljs-comment { color: #6a737d; font-style: italic; }
  .editor-container.light .hljs-function { color: #6f42c1; }
  .editor-container.light .hljs-title { color: #6f42c1; }
  .editor-container.light .hljs-params { color: #24292e; }
  .editor-container.light .hljs-built_in { color: #e36209; }
  .editor-container.light .hljs-literal { color: #005cc5; }
  .editor-container.light .hljs-type { color: #005cc5; }
  .editor-container.light .hljs-attr { color: #005cc5; }
  .editor-container.light .hljs-tag { color: #22863a; }
  .editor-container.light .hljs-name { color: #22863a; }
  .editor-container.light .hljs-selector-class { color: #6f42c1; }
  .editor-container.light .hljs-selector-id { color: #005cc5; }
  .editor-container.light .hljs-attribute { color: #005cc5; }
  .editor-container.light .hljs-variable { color: #e36209; }
  .editor-container.light .hljs-regexp { color: #032f62; }
  .editor-container.light .hljs-symbol { color: #005cc5; }
  .editor-container.light .hljs-meta { color: #6a737d; }
  .editor-container.light .hljs-punctuation { color: #24292e; }

  /* ======== Syntax highlighting — Dark theme ======== */
  .editor-container.dark .hljs-keyword { color: #c678dd; }
  .editor-container.dark .hljs-string { color: #98c379; }
  .editor-container.dark .hljs-number { color: #d19a66; }
  .editor-container.dark .hljs-comment { color: #5c6370; font-style: italic; }
  .editor-container.dark .hljs-function { color: #61afef; }
  .editor-container.dark .hljs-title { color: #61afef; }
  .editor-container.dark .hljs-params { color: #abb2bf; }
  .editor-container.dark .hljs-built_in { color: #e6c07b; }
  .editor-container.dark .hljs-literal { color: #d19a66; }
  .editor-container.dark .hljs-type { color: #e6c07b; }
  .editor-container.dark .hljs-attr { color: #d19a66; }
  .editor-container.dark .hljs-tag { color: #e06c75; }
  .editor-container.dark .hljs-name { color: #e06c75; }
  .editor-container.dark .hljs-selector-class { color: #e6c07b; }
  .editor-container.dark .hljs-selector-id { color: #61afef; }
  .editor-container.dark .hljs-attribute { color: #d19a66; }
  .editor-container.dark .hljs-variable { color: #e06c75; }
  .editor-container.dark .hljs-regexp { color: #98c379; }
  .editor-container.dark .hljs-symbol { color: #56b6c2; }
  .editor-container.dark .hljs-meta { color: #5c6370; }
  .editor-container.dark .hljs-punctuation { color: #abb2bf; }
`;
