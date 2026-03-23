/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

interface ConditionRow {
  leftValue: string;
  operator: string;
  rightValue: string;
}

const OPERATORS = [
  { label: 'Equals', value: 'eq' },
  { label: 'Not Equals', value: 'neq' },
  { label: 'Greater Than', value: 'gt' },
  { label: 'Greater Than or Equal', value: 'gte' },
  { label: 'Less Than', value: 'lt' },
  { label: 'Less Than or Equal', value: 'lte' },
  { label: 'Contains', value: 'contains' },
  { label: 'Does Not Contain', value: 'notContains' },
  { label: 'Starts With', value: 'startsWith' },
  { label: 'Ends With', value: 'endsWith' },
  { label: 'Is Empty', value: 'isEmpty' },
  { label: 'Is Not Empty', value: 'isNotEmpty' },
  { label: 'Matches Regex', value: 'regex' },
];

const UNARY_OPERATORS = new Set(['isEmpty', 'isNotEmpty']);

function renderConditionRow(
  row: ConditionRow,
  index: number,
  conditions: ConditionRow[],
  updateConditions: (conditions: ConditionRow[]) => void
): TemplateResult {
  const isUnary = UNARY_OPERATORS.has(row.operator);

  return html`
    <div class="condition-row">
      <div class="condition-row-fields">
        <nr-input
          .value=${row.leftValue}
          placeholder="\${input.field}"
          class="condition-left-value"
          @nr-input=${(e: CustomEvent) => {
            const updated = [...conditions];
            updated[index] = { ...row, leftValue: e.detail.value };
            updateConditions(updated);
          }}
        ></nr-input>
        <nr-select
          size="small"
          .value=${row.operator}
          .options=${OPERATORS}
          class="condition-operator"
          @nr-change=${(e: CustomEvent) => {
            const updated = [...conditions];
            updated[index] = { ...row, operator: e.detail.value };
            updateConditions(updated);
          }}
        ></nr-select>
        ${isUnary ? nothing : html`
          <nr-input
            .value=${row.rightValue}
            placeholder="value"
            class="condition-right-value"
            @nr-input=${(e: CustomEvent) => {
              const updated = [...conditions];
              updated[index] = { ...row, rightValue: e.detail.value };
              updateConditions(updated);
            }}
          ></nr-input>
        `}
      </div>
      <nr-button
        variant="ghost"
        size="small"
        @click=${() => {
          const updated = conditions.filter((_, i) => i !== index);
          updateConditions(updated.length > 0 ? updated : [{ leftValue: '', operator: 'eq', rightValue: '' }]);
        }}
      >
        <nr-icon name="trash-2" size="small"></nr-icon>
      </nr-button>
    </div>
  `;
}

/**
 * Render Condition node fields
 */
export function renderConditionFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const mode = (config.conditionMode as string) || 'visual';
  const logic = (config.conditionLogic as string) || 'and';
  const conditions: ConditionRow[] =
    (config.conditions as ConditionRow[] | undefined)?.length
      ? (config.conditions as ConditionRow[])
      : [{ leftValue: '', operator: 'eq', rightValue: '' }];

  const updateConditions = (updated: ConditionRow[]) => {
    onUpdate('conditions', updated);
  };

  return html`
    <div class="config-field">
      <label>Mode</label>
      <nr-select
        .value=${mode}
        .options=${[
          { label: 'Visual Builder', value: 'visual' },
          { label: 'Expression', value: 'expression' },
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('conditionMode', e.detail.value)}
      ></nr-select>
    </div>

    ${mode === 'visual' ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Conditions</span>
          <span class="config-section-desc">Define conditions to evaluate</span>
        </div>

        <div class="condition-logic-toggle">
          <label>Match</label>
          <nr-select
            size="small"
            .value=${logic}
            .options=${[
              { label: 'All conditions (AND)', value: 'and' },
              { label: 'Any condition (OR)', value: 'or' },
            ]}
            @nr-change=${(e: CustomEvent) => onUpdate('conditionLogic', e.detail.value)}
          ></nr-select>
        </div>

        <div class="config-columns-list">
          ${conditions.map((row, index) => html`
            ${index > 0 ? html`
              <div class="condition-logic-label">
                <span>${logic === 'and' ? 'AND' : 'OR'}</span>
              </div>
            ` : nothing}
            ${renderConditionRow(row, index, conditions, updateConditions)}
          `)}
          <nr-button
            variant="outline"
            size="small"
            @click=${() => {
              updateConditions([...conditions, { leftValue: '', operator: 'eq', rightValue: '' }]);
            }}
          >
            <nr-icon name="plus" size="small"></nr-icon>
            Add Condition
          </nr-button>
        </div>
      </div>
    ` : html`
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
    `}

    <div class="config-field">
      <label>Output Variable</label>
      <nr-input
        value=${config.outputVariable || ''}
        placeholder="conditionResult"
        @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Store the condition result in a variable for downstream nodes</small>
    </div>
  `;
}
