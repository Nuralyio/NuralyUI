/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, css, nothing, PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { ChatbotArtifact } from '../chatbot.types.js';
import { applyCanonicalize, diffLines, hasRealDiff, type Canonicalize } from './artifact-diff.js';

type TabId = 'json' | 'diff' | 'patch';
type ViewMode = 'auto' | TabId;

const TAB_LABELS: Record<TabId, string> = { json: 'JSON', diff: 'Diff', patch: 'Patch' };

/**
 * Renders an artifact's content with a JSON / Diff / Patch tab toggle when the
 * artifact carries edit metadata (`previousContent`, `patch`). For plain
 * artifacts only the JSON tab applies and the tab bar is hidden. The diff is a
 * dependency-free line-by-line LCS render styled to read like a code review.
 */
@customElement('nr-artifact-diff-view')
export class NrArtifactDiffViewElement extends LitElement {
  @property({ attribute: false }) artifact!: ChatbotArtifact;
  @property({ attribute: false }) canonicalize: Canonicalize = 'none';
  /** 'auto' shows the JSON/Diff/Patch tab bar. A fixed view renders only that, with no tabs. */
  @property({ type: String }) view: ViewMode = 'auto';

  @state() private activeTab: TabId = 'json';
  @state() private artifactKey = '';

  static override styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .tabbar {
      display: flex;
      gap: 2px;
      border-bottom: 1px solid var(--nuraly-color-border, #d0d7de);
      margin-bottom: 12px;
    }
    .tab {
      appearance: none;
      border: none;
      background: transparent;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      color: var(--nuraly-color-text-secondary, #57606a);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }
    .tab:hover {
      color: var(--nuraly-color-text, #1f2937);
    }
    .tab[aria-selected='true'] {
      color: var(--nuraly-color-primary, #0b5fff);
      border-bottom-color: var(--nuraly-color-primary, #0b5fff);
    }
    .tab:focus-visible {
      outline: 2px solid var(--nuraly-color-primary, #0b5fff);
      outline-offset: 2px;
    }
    pre.code {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12.5px;
      line-height: 1.5;
    }
    .diff {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12.5px;
      line-height: 1.55;
      border: 1px solid var(--nuraly-color-border, #d0d7de);
      border-radius: 6px;
      overflow: hidden;
    }
    .diff__line {
      display: flex;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .diff__gutter {
      flex: 0 0 22px;
      text-align: center;
      user-select: none;
      color: var(--nuraly-color-text-tertiary, #8b949e);
      border-right: 1px solid var(--nuraly-color-border, #d0d7de);
    }
    .diff__text {
      flex: 1;
      padding: 0 10px;
    }
    .diff__line--add {
      background: var(--nuraly-color-diff-add-bg, #e6ffec);
    }
    .diff__line--add .diff__gutter {
      color: var(--nuraly-color-diff-add-fg, #1a7f37);
    }
    .diff__line--del {
      background: var(--nuraly-color-diff-del-bg, #ffebe9);
    }
    .diff__line--del .diff__gutter {
      color: var(--nuraly-color-diff-del-fg, #cf222e);
    }
    .diff__line--hl {
      background: var(--nuraly-color-diff-hl-bg, #fff3bf);
      box-shadow: inset 3px 0 0 var(--nuraly-color-diff-hl-fg, #f59f00);
    }
    table.patch {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    table.patch th,
    table.patch td {
      border: 1px solid var(--nuraly-color-border, #d0d7de);
      padding: 6px 10px;
      text-align: left;
      vertical-align: top;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
    table.patch th {
      background: var(--nuraly-color-surface-secondary, #f6f8fa);
      font-weight: 600;
    }
    .patch-line--add {
      color: var(--nuraly-color-diff-add-fg, #1a7f37);
    }
    .patch-line--del {
      color: var(--nuraly-color-diff-del-fg, #cf222e);
    }
  `;

  /**
   * Highlight the first diff line containing `needle` and scroll it into view.
   * Used by hosts (e.g. the flow editor) to link a diagram node to its JSON.
   * No-op when the diff is not currently rendered.
   */
  highlightByText(needle: string): boolean {
    const lines = Array.from(this.shadowRoot?.querySelectorAll('.diff__line') ?? []);
    let target: Element | null = null;
    for (const line of lines) {
      line.classList.remove('diff__line--hl');
      if (!target && (line.textContent || '').includes(needle)) target = line;
    }
    if (!target) return false;
    target.classList.add('diff__line--hl');
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return true;
  }

  clearHighlight(): void {
    this.shadowRoot?.querySelectorAll('.diff__line--hl')
      .forEach(line => line.classList.remove('diff__line--hl'));
  }

  /**
   * Highlight the entire object/array value of a top-level-ish property `key`
   * (the opening `"key": {` line through its matching close) and scroll it into
   * view. Block extent is found by indentation, so braces inside string values
   * do not break it. Falls back to a single-line highlight when the property is
   * a scalar. Returns false when the key is not found.
   */
  highlightObjectByKey(key: string): boolean {
    this.clearHighlight();
    const lineEls = Array.from(this.shadowRoot?.querySelectorAll('.diff__line') ?? []);
    if (!lineEls.length) return false;
    const texts = lineEls.map(el => el.querySelector('.diff__text')?.textContent ?? '');
    const keyToken = `"${key}"`;

    let start = -1;
    for (let i = 0; i < texts.length; i++) {
      const idx = texts[i].indexOf(keyToken);
      if (idx !== -1 && texts[i].slice(idx + keyToken.length).trimStart().startsWith(':')) {
        start = i;
        break;
      }
    }
    if (start === -1) return false;

    const indentOf = (s: string) => s.length - s.trimStart().length;
    const startIndent = indentOf(texts[start]);
    const opensBlock = /[{[]\s*$/.test(texts[start].trimEnd());

    let end = start;
    if (opensBlock) {
      for (let j = start + 1; j < texts.length; j++) {
        const trimmed = texts[j].trim();
        if (indentOf(texts[j]) <= startIndent && (trimmed.startsWith('}') || trimmed.startsWith(']'))) {
          end = j;
          break;
        }
      }
    }

    for (let k = start; k <= end; k++) lineEls[k].classList.add('diff__line--hl');
    lineEls[start].scrollIntoView({ block: 'center', behavior: 'smooth' });
    return true;
  }

  private get meta(): Record<string, unknown> {
    return (this.artifact?.metadata as Record<string, unknown>) ?? {};
  }

  private get previousContent(): string | undefined {
    const value = this.meta.previousContent;
    return typeof value === 'string' ? value : undefined;
  }

  private get isEdit(): boolean {
    return this.meta.isEdit !== undefined ? !!this.meta.isEdit : this.previousContent !== undefined;
  }

  private get canonicalMode(): Canonicalize {
    const mode = this.meta.canonicalize as Canonicalize | undefined;
    return mode ?? this.canonicalize;
  }

  private get hasDiff(): boolean {
    return this.previousContent !== undefined
      && hasRealDiff(this.previousContent, this.artifact.content, this.canonicalMode);
  }

  private get hasPatch(): boolean {
    const patch = this.meta.patch;
    if (patch === undefined || patch === null) return false;
    if (Array.isArray(patch) && patch.length === 0) return false;
    return true;
  }

  private get tabs(): TabId[] {
    const tabs: TabId[] = ['json'];
    if (this.isEdit && this.hasDiff) tabs.push('diff');
    if (this.hasPatch) tabs.push('patch');
    return tabs;
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('artifact') && this.artifact && this.artifact.id !== this.artifactKey) {
      this.artifactKey = this.artifact.id;
      const tabs = this.tabs;
      this.activeTab = this.isEdit && tabs.includes('diff') ? 'diff' : 'json';
    }
  }

  override render(): TemplateResult | typeof nothing {
    if (!this.artifact) return nothing;
    if (this.view !== 'auto') {
      return html`<div class="content" part="artifact-diff-content">${this.renderTab(this.view)}</div>`;
    }
    const tabs = this.tabs;
    const active = tabs.includes(this.activeTab) ? this.activeTab : tabs[0];
    return html`
      ${tabs.length > 1 ? this.renderTabBar(tabs, active) : nothing}
      <div class="content" part="artifact-diff-content">${this.renderTab(active)}</div>
    `;
  }

  private renderTabBar(tabs: TabId[], active: TabId): TemplateResult {
    return html`
      <div class="tabbar" role="tablist" part="artifact-diff-tabs">
        ${tabs.map(
          tab => html`
            <button
              class="tab"
              role="tab"
              part="artifact-diff-tab"
              aria-selected=${active === tab ? 'true' : 'false'}
              data-tab=${tab}
              @click=${() => { this.activeTab = tab; }}
            >${TAB_LABELS[tab]}</button>
          `
        )}
      </div>
    `;
  }

  private renderTab(tab: TabId): TemplateResult {
    if (tab === 'diff') return this.renderDiff();
    if (tab === 'patch') return this.renderPatch();
    return this.renderJson();
  }

  private renderJson(): TemplateResult {
    let pretty = this.artifact.content;
    if (this.artifact.language === 'json') {
      try {
        pretty = JSON.stringify(JSON.parse(this.artifact.content), null, 2);
      } catch {
        pretty = this.artifact.content;
      }
    }
    return html`<pre class="code" part="artifact-diff-json"><code>${pretty}</code></pre>`;
  }

  private renderDiff(): TemplateResult {
    const before = applyCanonicalize(this.previousContent ?? '', this.canonicalMode);
    const after = applyCanonicalize(this.artifact.content, this.canonicalMode);
    const rows = diffLines(before, after);
    return html`
      <div class="diff" part="artifact-diff">
        ${rows.map(row => {
          const kind = row.kind === 'equal' ? 'ctx' : row.kind;
          const sign = row.kind === 'add' ? '+' : row.kind === 'del' ? '-' : '';
          return html`
            <div class="diff__line diff__line--${kind}">
              <span class="diff__gutter">${sign}</span>
              <span class="diff__text">${row.text.length ? row.text : ' '}</span>
            </div>
          `;
        })}
      </div>
    `;
  }

  private renderPatch(): TemplateResult {
    const patch = this.meta.patch;

    if (Array.isArray(patch) && patch.every(op => op && typeof op === 'object' && 'op' in op && 'path' in op)) {
      return html`
        <table class="patch" part="artifact-diff-patch">
          <thead>
            <tr><th>op</th><th>path</th><th>value</th></tr>
          </thead>
          <tbody>
            ${patch.map((op: Record<string, unknown>) => html`
              <tr>
                <td>${String(op.op ?? '')}</td>
                <td>${String(op.path ?? '')}</td>
                <td>${'value' in op ? JSON.stringify(op.value) : ''}</td>
              </tr>
            `)}
          </tbody>
        </table>
      `;
    }

    if (typeof patch === 'string') {
      return html`
        <pre class="code" part="artifact-diff-patch">${patch.split('\n').map(line => {
          const cls = line.startsWith('+') ? 'patch-line--add' : line.startsWith('-') ? 'patch-line--del' : '';
          return html`<div class=${cls}>${line.length ? line : ' '}</div>`;
        })}</pre>
      `;
    }

    return html`<pre class="code" part="artifact-diff-patch"><code>${JSON.stringify(patch, null, 2)}</code></pre>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-artifact-diff-view': NrArtifactDiffViewElement;
  }
}
