/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

/**
 * Render Loop node fields
 */
export function renderLoopFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  return html`
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
