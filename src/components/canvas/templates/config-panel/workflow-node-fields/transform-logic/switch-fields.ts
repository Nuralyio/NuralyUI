/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

interface SwitchCase {
  value: string;
  label?: string;
}

/**
 * Render Switch node fields — multi-way branching based on an expression
 */
export function renderSwitchFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const cases: SwitchCase[] = Array.isArray(config.cases)
    ? (config.cases as SwitchCase[])
    : [];

  const updateCase = (index: number, patch: Partial<SwitchCase>) => {
    const next = cases.map((c, i) => (i === index ? { ...c, ...patch } : c));
    onUpdate('cases', next);
  };

  const addCase = () => {
    const next = [...cases, { value: `case${cases.length + 1}`, label: `Case ${cases.length + 1}` }];
    onUpdate('cases', next);
  };

  const removeCase = (index: number) => {
    onUpdate('cases', cases.filter((_, i) => i !== index));
  };

  return html`
    <div class="config-field">
      <label>Expression</label>
      <nr-input
        .value=${String(config.expression || '')}
        placeholder="\${input.status}"
        @nr-input=${(e: CustomEvent) => onUpdate('expression', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Value to match against each case</small>
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

    <div class="config-field">
      <label>Cases</label>
      ${cases.map(
        (c, index) => html`
          <div class="condition-row">
            <nr-input
              .value=${c.value || ''}
              placeholder="match value"
              @nr-input=${(e: CustomEvent) => updateCase(index, { value: e.detail.value })}
            ></nr-input>
            <nr-input
              .value=${c.label || ''}
              placeholder="port label"
              @nr-input=${(e: CustomEvent) => updateCase(index, { label: e.detail.value })}
            ></nr-input>
            <nr-button size="small" type="text" @click=${() => removeCase(index)}>
              <nr-icon name="trash-2" size="small"></nr-icon>
            </nr-button>
          </div>
        `
      )}
      <nr-button size="small" type="dashed" @click=${addCase}>
        <nr-icon name="plus" size="small"></nr-icon>
        Add Case
      </nr-button>
      <small class="field-hint">Edit node ports to wire each case to a downstream branch</small>
    </div>

    <div class="config-field">
      <label class="checkbox-label">
        <nr-checkbox
          ?checked=${config.includeDefault !== false}
          @nr-change=${(e: CustomEvent) => onUpdate('includeDefault', e.detail.checked)}
        ></nr-checkbox>
        Include Default Branch
      </label>
      <small class="field-hint">Adds a fallback path when no case matches</small>
    </div>
  `;
}
