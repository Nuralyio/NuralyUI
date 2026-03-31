/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../workflow-canvas.types.js';

// Register the workflow selector element
import './wb-workflow-selector.component.js';

/**
 * Render WB_WORKFLOW node specific configuration fields.
 * Shows a workflow selector dropdown that fetches available workflows
 * from the API and populates the preview node on selection.
 */
export function renderWhiteboardWorkflowFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const workflowId = typeof config.workflowId === 'string' ? config.workflowId : '';
  const workflowName = typeof config.workflowName === 'string' ? config.workflowName : '';
  const steps = (config.workflowSteps as Array<{ name: string; type: string }>) || [];

  const handleWorkflowSelect = (e: CustomEvent) => {
    const detail = e.detail as { workflowId: string; workflowName: string; workflowSteps: Array<{ name: string; type: string }> };
    onUpdate('workflowId', detail.workflowId);
    onUpdate('workflowName', detail.workflowName);
    onUpdate('workflowSteps', detail.workflowSteps);
  };

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Workflow Preview</span>
      </div>

      <div class="config-field">
        <label>Workflow</label>
        <wb-workflow-selector
          .selectedWorkflowId=${workflowId}
          @workflow-select=${handleWorkflowSelect}
        ></wb-workflow-selector>
      </div>

      ${workflowName ? html`
        <div class="config-field">
          <label>Selected</label>
          <span class="wb-workflow-selected-name">${workflowName}</span>
        </div>
      ` : nothing}

      ${steps.length > 0 ? html`
        <div class="config-field">
          <label>Nodes (${steps.length})</label>
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
      .wb-workflow-selected-name {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 0.875rem;
        color: #161616;
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
        background: #f4f4f4;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 12px;
      }
      .wb-workflow-step-index {
        color: #888;
        font-size: 0.75rem;
        min-width: 16px;
        text-align: center;
      }
      .wb-workflow-step-name {
        flex: 1;
        color: #161616;
      }
      .wb-workflow-step-type {
        color: #525252;
        font-size: 0.75rem;
        text-transform: uppercase;
      }
    </style>
  `;
}
