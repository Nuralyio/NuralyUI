/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

// Concrete, runnable example used by the hint bubble. Kept next to the renderer
// so it can't drift from the field set below.
const LOOP_EXAMPLE = `{
  "arrayExpression": "\${variables.users}",
  "iteratorVariable": "user",
  "maxIterations": 1000,
  "batchSize": 1,
  "continueOnError": true,
  "iterationDelay": 200
}`;

const HINT_BUBBLE_STYLE = `
  margin: 0 0 12px 0;
  padding: 8px 12px;
  background: var(--nuraly-color-info-background, #eff6ff);
  border: 1px solid var(--nuraly-color-info-border, #bfdbfe);
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--nuraly-color-text-secondary, #1e3a8a);
`;

const HINT_SUMMARY_STYLE = `
  cursor: pointer;
  user-select: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
`;

const HINT_BODY_STYLE = `
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const HINT_CODE_STYLE = `
  margin: 0;
  padding: 8px 10px;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  white-space: pre;
  overflow-x: auto;
`;

const HINT_COPY_BTN_STYLE = `
  align-self: flex-start;
  padding: 4px 10px;
  font-size: 11px;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 4px;
  cursor: pointer;
`;

/**
 * Render Loop node fields
 */
export function renderLoopFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const copyExample = async (e: Event) => {
    const button = e.currentTarget as HTMLButtonElement;
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(LOOP_EXAMPLE);
      button.textContent = 'Copied ✓';
    } catch {
      button.textContent = 'Copy failed';
    }
    setTimeout(() => { button.textContent = original; }, 1500);
  };

  return html`
    <details style=${HINT_BUBBLE_STYLE}>
      <summary style=${HINT_SUMMARY_STYLE}>
        <nr-icon name="info" size="small"></nr-icon>
        How the Loop node works
      </summary>
      <div style=${HINT_BODY_STYLE}>
        <p style="margin: 0;">
          Iterates over the array resolved from <code>arrayExpression</code> and runs
          the <strong>item</strong>-port subgraph once per element. Each iteration binds
          the current value to <code>\${variables.&lt;iteratorVariable&gt;}</code> and
          its position to <code>\${variables.&lt;iteratorVariable&gt;_index}</code>.
        </p>
        <p style="margin: 0;">
          Wire downstream nodes to the <strong>item</strong> port to run them per
          element, and to the <strong>done</strong> port for whatever should run after
          the loop finishes. A <strong>Break</strong> node anywhere in the item subgraph
          short-circuits the remaining iterations.
        </p>
        <pre style=${HINT_CODE_STYLE}>${LOOP_EXAMPLE}</pre>
        <button type="button" style=${HINT_COPY_BTN_STYLE} @click=${copyExample}>
          Copy example
        </button>
      </div>
    </details>

    <div class="config-field">
      <label>Array Expression</label>
      <nr-input
        value=${config.arrayExpression || ''}
        placeholder="\${input.items} or data.items"
        @nr-input=${(e: CustomEvent) => onUpdate('arrayExpression', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Expression that resolves to an array to iterate over</small>
    </div>

    <div class="config-field">
      <label>Iterator Variable</label>
      <nr-input
        value=${config.iteratorVariable || 'item'}
        placeholder="item"
        @nr-input=${(e: CustomEvent) => onUpdate('iteratorVariable', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Variable name for the current item (access via \${variables.item})</small>
    </div>

    <div class="config-field">
      <label>Batch Size</label>
      <nr-input
        type="number"
        value=${String(config.batchSize || 1)}
        min="1"
        @nr-input=${(e: CustomEvent) => onUpdate('batchSize', Number.parseInt(e.detail.value) || 1)}
      ></nr-input>
      <small class="field-hint">Number of items to process per iteration (1 = one at a time)</small>
    </div>

    <div class="config-field">
      <label>Max Iterations</label>
      <nr-input
        type="number"
        value=${String(config.maxIterations || 100)}
        @nr-input=${(e: CustomEvent) => onUpdate('maxIterations', Number.parseInt(e.detail.value))}
      ></nr-input>
      <small class="field-hint">Safety limit to prevent infinite loops</small>
    </div>

    <div class="config-field">
      <label class="checkbox-label">
        <nr-checkbox
          ?checked=${config.continueOnError || false}
          @nr-change=${(e: CustomEvent) => onUpdate('continueOnError', e.detail.checked)}
        ></nr-checkbox>
        Continue On Error
      </label>
      <small class="field-hint">Skip failed iterations instead of stopping the loop</small>
    </div>

    <div class="config-field">
      <label>Delay Between Iterations (ms)</label>
      <nr-input
        type="number"
        value=${String(config.iterationDelay || 0)}
        min="0"
        @nr-input=${(e: CustomEvent) => onUpdate('iterationDelay', Number.parseInt(e.detail.value) || 0)}
      ></nr-input>
      <small class="field-hint">Wait time between iterations (useful for API rate limits)</small>
    </div>
  `;
}
