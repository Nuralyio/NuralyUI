/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../workflow-canvas.types.js';

/**
 * Render WB_WORKFLOW node specific configuration fields
 */
export function renderWhiteboardWorkflowFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  availableWorkflows?: { id: string; name: string }[],
): TemplateResult {
  const workflowId = (config.workflowId as string) || '';
  const workflowName = (config.workflowName as string) || '';
  const steps = (config.workflowSteps as Array<{ name: string; type: string }>) || [];

  const handleWorkflowSelect = (e: CustomEvent) => {
    const selectedId = e.detail.value;
    if (!selectedId) {
      onUpdate('workflowId', '');
      onUpdate('workflowName', '');
      onUpdate('workflowSteps', []);
      return;
    }
    const selected = availableWorkflows?.find(w => w.id === selectedId);
    if (selected) {
      onUpdate('workflowId', selected.id);
      onUpdate('workflowName', selected.name);
    }
  };

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Workflow Settings</span>
      </div>

      <div class="config-field">
        <nr-label size="small">Workflow</nr-label>
        ${availableWorkflows && availableWorkflows.length > 0 ? html`
          <nr-select
            .value=${workflowId}
            .options=${availableWorkflows.map(w => ({ value: w.id, label: w.name }))}
            placeholder="Select a workflow..."
            searchable
            clearable
            @nr-change=${handleWorkflowSelect}
          ></nr-select>
        ` : html`
          <nr-input
            .value=${workflowId}
            placeholder="Enter workflow ID"
            @nr-input=${(e: CustomEvent) => onUpdate('workflowId', e.detail.value)}
          ></nr-input>
        `}
        <span class="field-description">Select a workflow to preview on the whiteboard.</span>
      </div>

      ${workflowId ? html`
        <div class="config-field">
          <nr-label size="small">Selected Workflow</nr-label>
          <div class="wb-workflow-selected">
            <nr-icon name="layers" size="small"></nr-icon>
            <span class="wb-workflow-selected-name">${workflowName || workflowId}</span>
          </div>
        </div>
      ` : nothing}

      ${steps.length > 0 ? html`
        <div class="config-field">
          <nr-label size="small">Steps (${steps.length})</nr-label>
          <div class="wb-workflow-steps-list">
            ${steps.map((step, i) => html`
              <div class="wb-workflow-step-item">
                <span class="wb-workflow-step-index">${i + 1}</span>
                <span class="wb-workflow-step-name">${step.name}</span>
                <span class="wb-workflow-step-type">${step.type}</span>
              </div>
            `)}
          </div>
        </div>
      ` : nothing}
    </div>

    <style>
      .wb-workflow-selected {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 6px;
        background: var(--bg-secondary, #f0f0ff);
        border: 1px solid var(--n-color-primary, #6366f1);
        font-size: 13px;
      }
      .wb-workflow-selected-name {
        flex: 1;
        color: var(--text-primary, #333);
        font-weight: 500;
      }
      .wb-workflow-steps-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 200px;
        overflow-y: auto;
      }
      .wb-workflow-step-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 4px;
        background: var(--bg-secondary, #f5f5f5);
        font-size: 12px;
      }
      .wb-workflow-step-index {
        color: var(--text-tertiary, #999);
        min-width: 16px;
        text-align: center;
      }
      .wb-workflow-step-name {
        flex: 1;
        color: var(--text-primary, #333);
      }
      .wb-workflow-step-type {
        color: var(--text-secondary, #666);
        font-size: 11px;
      }
    </style>
  `;
}
