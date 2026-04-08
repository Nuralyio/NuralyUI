/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

/**
 * Render Try / Catch node fields — error boundary for the connected branch
 */
export function renderTryCatchFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const catchTypes: string[] = Array.isArray(config.catchTypes)
    ? (config.catchTypes as string[])
    : ['*'];

  const updateTypes = (raw: string) => {
    const next = raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onUpdate('catchTypes', next.length > 0 ? next : ['*']);
  };

  return html`
    <div class="config-field">
      <label>Catch Error Types</label>
      <nr-input
        .value=${catchTypes.join(', ')}
        placeholder="* (all) or HttpError, TimeoutError"
        @nr-input=${(e: CustomEvent) => updateTypes(e.detail.value)}
      ></nr-input>
      <small class="field-hint">Comma-separated list. Use <code>*</code> to catch every error</small>
    </div>

    <div class="config-field">
      <label>Error Variable</label>
      <nr-input
        .value=${String(config.errorVariable || 'error')}
        placeholder="error"
        @nr-input=${(e: CustomEvent) => onUpdate('errorVariable', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Variable holding the caught error in the Catch branch</small>
    </div>

    <div class="config-field">
      <label class="checkbox-label">
        <nr-checkbox
          ?checked=${config.rethrowAfterCatch || false}
          @nr-change=${(e: CustomEvent) => onUpdate('rethrowAfterCatch', e.detail.checked)}
        ></nr-checkbox>
        Rethrow After Catch
      </label>
      <small class="field-hint">Re-raise the error once the Catch branch completes</small>
    </div>

    <div class="config-field">
      <label>Max Retries</label>
      <nr-input
        type="number"
        .value=${String(config.maxRetries ?? 0)}
        min="0"
        @nr-input=${(e: CustomEvent) => onUpdate('maxRetries', Number.parseInt(e.detail.value) || 0)}
      ></nr-input>
      <small class="field-hint">Retry the Try branch this many times before catching</small>
    </div>
  `;
}
