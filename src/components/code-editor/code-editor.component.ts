/**
 * @license
 * Copyright 2024 Nuraly
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { styles } from './code-editor.style.js';
import {
  CODE_EDITOR_THEME,
  type CodeEditorTheme,
  type CodeEditorLanguage,
  type CodeEditorKeyEventDetail
} from './code-editor.types.js';
import { ThemeAwareMixin } from '../../shared/theme-mixin.js';
import { CodeJar } from 'codejar';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import markdown from 'highlight.js/lib/languages/markdown';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);

/**
 * NuralyUI Code Editor component using CodeJar — a lightweight (~2KB) code editor.
 *
 * @example
 * ```html
 * <nr-code-editor
 *   language="javascript"
 *   theme="vs-dark"
 *   .code=${"console.log('Hello');"}
 *   @nr-change=${(e) => console.log(e.detail.value)}
 * ></nr-code-editor>
 * ```
 *
 * @fires nr-change - Fired when the code content changes
 * @fires nr-keydown - Fired on keydown events in the editor
 * @fires nr-keyup - Fired on keyup events in the editor
 * @fires nr-focus - Fired when the editor gains focus
 * @fires nr-blur - Fired when the editor loses focus
 * @fires nr-ready - Fired when the editor is ready
 *
 * @csspart editor-container - The container wrapping the editor
 */
@customElement('nr-code-editor')
export class NrCodeEditorElement extends ThemeAwareMixin(LitElement) {
  static override styles = styles;

  /** CodeJar instance */
  private jar?: ReturnType<typeof CodeJar>;

  /** Whether editor is initialized */
  private isEditorReady = false;

  /** Reference to the editor element */
  private editorRef: Ref<HTMLElement> = createRef();

  /** Suppress change events during programmatic updates */
  private suppressChange = false;

  /** Makes the editor read-only */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  /** Editor theme (vs, vs-dark, hc-black, hc-light) */
  @property({ type: String, reflect: true })
  theme: CodeEditorTheme = CODE_EDITOR_THEME.Dark;

  /** Programming language for syntax highlighting */
  @property({ type: String, reflect: true })
  language: CodeEditorLanguage = 'javascript';

  /** The code content */
  @property({ type: String })
  code = '';

  /** Show line numbers */
  @property({ type: Boolean, attribute: 'line-numbers' })
  lineNumbers = true;

  /** Font size in pixels */
  @property({ type: Number, attribute: 'font-size' })
  fontSize = 13;

  /** Enable word wrap */
  @property({ type: Boolean, attribute: 'word-wrap' })
  wordWrap = false;

  /** Tab size in spaces */
  @property({ type: Number, attribute: 'tab-size' })
  tabSize = 2;

  override render() {
    const isDark = this.isDarkTheme();

    return html`
      <div class="editor-container ${isDark ? 'dark' : 'light'}" part="editor-container">
        <div class="line-numbers-gutter" style="display: ${this.lineNumbers ? 'block' : 'none'}"></div>
        <code
          ${ref(this.editorRef)}
          class="editor language-${this.language}"
          style="font-size: ${this.fontSize}px; tab-size: ${this.tabSize}; white-space: ${this.wordWrap ? 'pre-wrap' : 'pre'};"
        ></code>
      </div>
    `;
  }

  /** Returns the current code contents */
  getValue(): string {
    return this.editorRef.value?.textContent ?? '';
  }

  /** Sets the editor value programmatically */
  setValue(value: string): void {
    if (this.jar) {
      this.suppressChange = true;
      this.jar.updateCode(value);
      this.suppressChange = false;
    }
  }

  /** Focus the editor */
  override focus(): void {
    this.editorRef.value?.focus();
  }

  override firstUpdated(): void {
    if (!this.editorRef.value) return;
    this.initializeEditor();
  }

  private initializeEditor(): void {
    const el = this.editorRef.value!;

    // Set initial content
    el.textContent = this.code;

    // Syntax highlighter using highlight.js
    const highlight = (editor: HTMLElement) => {
      const code = editor.textContent || '';
      const lang = this.language || 'plaintext';
      try {
        if (lang !== 'plaintext' && hljs.getLanguage(lang)) {
          editor.innerHTML = hljs.highlight(code, { language: lang }).value;
        } else {
          editor.innerHTML = this.escapeHtml(code);
        }
      } catch {
        editor.innerHTML = this.escapeHtml(code);
      }
    };

    this.jar = CodeJar(el, highlight, {
      tab: ' '.repeat(this.tabSize),
      indentOn: /[({[]$/,
      addClosing: true,
      catchTab: true,
      preserveIdent: true,
      history: true,
    });

    this.isEditorReady = true;

    // Listen for changes
    this.jar.onUpdate((code: string) => {
      if (!this.suppressChange) {
        this.code = code;
        this.updateLineNumbers();
        this.emit('nr-change', { value: code });
      }
    });

    // Keyboard events
    el.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.readonly) {
        e.preventDefault();
        return;
      }
      this.emit('nr-keydown', this.createKeyEventDetail(e) as unknown as Record<string, unknown>);
    });

    el.addEventListener('keyup', (e: KeyboardEvent) => {
      this.emit('nr-keyup', this.createKeyEventDetail(e) as unknown as Record<string, unknown>);
    });

    // Focus/blur
    el.addEventListener('focus', () => this.emit('nr-focus'));
    el.addEventListener('blur', () => this.emit('nr-blur'));

    // Readonly
    if (this.readonly) {
      el.setAttribute('contenteditable', 'false');
    }

    // Initial line numbers
    this.updateLineNumbers();

    this.emit('nr-ready', { editor: this.jar });
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private updateLineNumbers(): void {
    const gutter = this.shadowRoot?.querySelector('.line-numbers-gutter') ??
                   this.renderRoot?.querySelector('.line-numbers-gutter');
    if (!gutter || !this.lineNumbers) return;

    const code = this.getValue();
    const lines = code.split('\n').length;
    gutter.innerHTML = Array.from({ length: lines }, (_, i) =>
      `<div class="line-number">${i + 1}</div>`
    ).join('');
  }

  private createKeyEventDetail(e: KeyboardEvent): CodeEditorKeyEventDetail {
    return {
      event: e,
      key: e.key,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
    };
  }

  private emit(eventName: string, detail?: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  private isDarkTheme(): boolean {
    if (this.theme === CODE_EDITOR_THEME.Dark || this.theme === CODE_EDITOR_THEME.HighContrastDark) {
      return true;
    }
    if (this.theme === CODE_EDITOR_THEME.Light || this.theme === CODE_EDITOR_THEME.HighContrastLight) {
      return false;
    }
    return this.currentTheme?.includes('dark') ?? false;
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (!this.isEditorReady || !this.jar) return;

    if (changedProperties.has('code') && this.code !== changedProperties.get('code')) {
      const current = this.getValue();
      if (this.code !== current) {
        this.setValue(this.code);
        this.updateLineNumbers();
      }
    }

    if (changedProperties.has('readonly')) {
      this.editorRef.value?.setAttribute('contenteditable', this.readonly ? 'false' : 'true');
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.jar) {
      this.jar.destroy();
      this.jar = undefined;
    }
    this.isEditorReady = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-code-editor': NrCodeEditorElement;
  }
}
