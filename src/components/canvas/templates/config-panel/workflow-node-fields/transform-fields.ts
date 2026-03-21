/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../workflow-canvas.types.js';

/**
 * Render Transform node fields
 */
export function renderTransformFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Transform</span>
      </div>
      <div class="config-field">
        <label>Expression Language</label>
        <nr-select
          .value=${config.expressionLanguage || 'jsonata'}
          .options=${[
            { label: 'JSONata', value: 'jsonata' },
            { label: 'JavaScript', value: 'javascript' },
          ]}
          @nr-change=${(e: CustomEvent) => onUpdate('expressionLanguage', e.detail.value)}
        ></nr-select>
      </div>
      <div class="config-field">
        <label>Transform Expression</label>
        <nr-textarea
          value=${config.transformExpression || ''}
          placeholder=${(config.expressionLanguage || 'jsonata') === 'jsonata'
            ? "e.g., input.{ 'name': firstName & ' ' & lastName }"
            : 'e.g., return { name: input.firstName + " " + input.lastName }'}
          rows="4"
          @nr-input=${(e: CustomEvent) => onUpdate('transformExpression', e.detail.value)}
        ></nr-textarea>
        <span class="field-description">Use \${input.field} for input data, \${variables.name} for workflow variables</span>
      </div>
    </div>
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Output</span>
      </div>
      <div class="config-field">
        <label>Output Variable</label>
        <nr-input
          value=${config.outputVariable || ''}
          placeholder="Optional: store result in variable"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description">Variable name to store the transform result</span>
      </div>
    </div>
  `;
}
