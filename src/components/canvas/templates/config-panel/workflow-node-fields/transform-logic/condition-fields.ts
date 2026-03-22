/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

/**
 * Render Condition node fields
 */
export function renderConditionFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  return html`
    <div class="config-field">
      <label>Expression</label>
      <nr-input
        value=${config.expression || ''}
        placeholder="data.value > 10"
        @nr-input=${(e: CustomEvent) => onUpdate('expression', e.detail.value)}
      ></nr-input>
    </div>
    <div class="config-field">
      <label>Language</label>
      <nr-select
        .value=${config.language || 'javascript'}
        .options=${[
          { label: 'JavaScript', value: 'javascript' },
          { label: 'JSONata', value: 'jsonata' },
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('language', e.detail.value)}
      ></nr-select>
    </div>
  `;
}
