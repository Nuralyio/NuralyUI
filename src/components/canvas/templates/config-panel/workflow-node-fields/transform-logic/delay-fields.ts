/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

/**
 * Render Delay node fields
 */
export function renderDelayFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  return html`
    <div class="config-field">
      <label>Duration</label>
      <nr-input
        type="number"
        min="0"
        value=${String(config.duration || 1000)}
        @nr-input=${(e: CustomEvent) => onUpdate('duration', Number.parseInt(e.detail.value) || 0)}
      ></nr-input>
      <small class="field-hint">Effective delay is capped at 24 hours. Delays over 10s release the worker until they elapse.</small>
    </div>
    <div class="config-field">
      <label>Unit</label>
      <nr-select
        .value=${config.unit || 'milliseconds'}
        .options=${[
          { label: 'Milliseconds', value: 'milliseconds' },
          { label: 'Seconds', value: 'seconds' },
          { label: 'Minutes', value: 'minutes' },
          { label: 'Hours', value: 'hours' }
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('unit', e.detail.value)}
      ></nr-select>
    </div>
  `;
}
