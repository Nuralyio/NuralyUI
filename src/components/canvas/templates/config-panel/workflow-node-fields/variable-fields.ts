/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../workflow-canvas.types.js';

/**
 * Render Variable node fields
 */
export function renderVariableFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  // Support both old format { name: value } and new format { name: { type, value } }
  const rawVariables = (config.variables as Record<string, unknown>) || {};
  const normalizedVars: Array<{ name: string; type: string; value: string }> = [];

  for (const [key, val] of Object.entries(rawVariables)) {
    if (val && typeof val === 'object' && 'type' in (val as object)) {
      const v = val as { type: string; value: string };
      normalizedVars.push({ name: key, type: v.type || 'string', value: v.value || '' });
    } else {
      normalizedVars.push({ name: key, type: 'string', value: String(val || '') });
    }
  }

  const updateVariables = (vars: Array<{ name: string; type: string; value: string }>) => {
    const newVars: Record<string, { type: string; value: string }> = {};
    for (const v of vars) {
      if (v.name) {
        newVars[v.name] = { type: v.type, value: v.value };
      }
    }
    onUpdate('variables', newVars);
  };

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Variables</span>
        <span class="config-section-desc">Set workflow variables</span>
      </div>
      <div class="config-columns-list">
        ${normalizedVars.map((variable, index) => html`
          <div class="config-column-item variable-item">
            <div class="config-field variable-fields">
              <nr-select
                size="small"
                .value=${variable.type}
                .options=${[
                  { label: 'String', value: 'string' },
                  { label: 'Number', value: 'number' },
                  { label: 'Expression', value: 'expression' },
                ]}
                @nr-change=${(e: CustomEvent) => {
                  const newVars = [...normalizedVars];
                  newVars[index] = { ...variable, type: e.detail.value };
                  updateVariables(newVars);
                }}
              ></nr-select>
              <nr-input
                .value=${variable.name}
                placeholder="Name"
                class="variable-name-input"
                @nr-input=${(e: CustomEvent) => {
                  const newVars = [...normalizedVars];
                  newVars[index] = { ...variable, name: e.detail.value };
                  updateVariables(newVars);
                }}
              ></nr-input>
              <nr-input
                .value=${variable.value}
                placeholder=${variable.type === 'expression' ? '\${input.field}' : variable.type === 'number' ? '0' : 'Value'}
                class="variable-value-input"
                @nr-input=${(e: CustomEvent) => {
                  const newVars = [...normalizedVars];
                  newVars[index] = { ...variable, value: e.detail.value };
                  updateVariables(newVars);
                }}
              ></nr-input>
            </div>
            <nr-button
              variant="ghost"
              size="small"
              @click=${() => {
                const newVars = normalizedVars.filter((_, i) => i !== index);
                updateVariables(newVars);
              }}
            >
              <nr-icon name="trash-2" size="small"></nr-icon>
            </nr-button>
          </div>
        `)}
        <nr-button
          variant="outline"
          size="small"
          @click=${() => {
            const newVars = [...normalizedVars, { name: `var${normalizedVars.length + 1}`, type: 'string', value: '' }];
            updateVariables(newVars);
          }}
        >
          <nr-icon name="plus" size="small"></nr-icon>
          Add Variable
        </nr-button>
      </div>
      <span class="field-description">Expr: \${input.field} or \${variables.name}</span>
    </div>
  `;
}
