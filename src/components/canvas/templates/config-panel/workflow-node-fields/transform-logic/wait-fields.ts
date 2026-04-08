/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

/**
 * Render Wait node fields — pause until a signal is received or timeout elapses
 */
export function renderWaitFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  return html`
    <div class="config-field">
      <label>Signal Name</label>
      <nr-input
        .value=${String(config.signalName || '')}
        placeholder="payment.received"
        @nr-input=${(e: CustomEvent) => onUpdate('signalName', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Resume execution when this signal is dispatched</small>
    </div>

    <div class="config-field">
      <label>Timeout</label>
      <nr-input
        type="number"
        .value=${String(config.timeout ?? 300000)}
        min="0"
        @nr-input=${(e: CustomEvent) => onUpdate('timeout', Number.parseInt(e.detail.value) || 0)}
      ></nr-input>
    </div>

    <div class="config-field">
      <label>Unit</label>
      <nr-select
        .value=${config.timeoutUnit || 'milliseconds'}
        .options=${[
          { label: 'Milliseconds', value: 'milliseconds' },
          { label: 'Seconds', value: 'seconds' },
          { label: 'Minutes', value: 'minutes' },
          { label: 'Hours', value: 'hours' },
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('timeoutUnit', e.detail.value)}
      ></nr-select>
      <small class="field-hint">Routes to the Timeout port if the signal never arrives</small>
    </div>

    <div class="config-field">
      <label>Output Variable</label>
      <nr-input
        .value=${String(config.outputVariable || 'signalPayload')}
        placeholder="signalPayload"
        @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Variable name for the received signal payload</small>
    </div>
  `;
}
