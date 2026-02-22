/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../workflow-canvas.types.js';

/**
 * Module-level cache for fetched workflows.
 * Avoids re-fetching every time the config panel re-renders.
 */
let _cachedWorkflows: Array<{ id: string; name: string }> | null = null;
let _fetchingWorkflows = false;

/**
 * Fetch all workflows from the API and populate a native <select> element.
 */
async function loadWorkflowOptions(
  select: HTMLSelectElement,
  currentId: string,
): Promise<void> {
  if (_cachedWorkflows) {
    populateSelectOptions(select, _cachedWorkflows, currentId);
    return;
  }

  if (_fetchingWorkflows) return;
  _fetchingWorkflows = true;

  try {
    const response = await fetch('/api/v1/workflows');
    if (response.ok) {
      const data: Array<{ id: string; name: string }> = await response.json();
      _cachedWorkflows = data.map(wf => ({ id: wf.id, name: wf.name }));
      populateSelectOptions(select, _cachedWorkflows, currentId);
    }
  } catch {
    // Silently fail — the user can still type a workflow ID manually
  } finally {
    _fetchingWorkflows = false;
  }
}

/**
 * Replace all options in a <select> with the given workflow list.
 */
function populateSelectOptions(
  select: HTMLSelectElement,
  workflows: Array<{ id: string; name: string }>,
  currentId: string,
): void {
  // Keep the first placeholder option, clear the rest
  while (select.options.length > 1) select.remove(1);

  for (const wf of workflows) {
    const opt = new Option(wf.name, wf.id);
    if (wf.id === currentId) opt.selected = true;
    select.add(opt);
  }
}

/**
 * Fetch a single workflow's nodes to build the steps list for preview.
 */
async function fetchWorkflowSteps(
  workflowId: string,
): Promise<Array<{ name: string; type: string }>> {
  try {
    const response = await fetch(`/api/v1/workflows/${workflowId}`);
    if (response.ok) {
      const data = await response.json();
      const nodes: Array<{ name: string; type: string }> = data.nodes || [];
      return nodes.map((n: { name: string; type: string }) => ({
        name: n.name || n.type,
        type: n.type,
      }));
    }
  } catch {
    // Fall through to empty steps
  }
  return [];
}

/**
 * Render WB_WORKFLOW node specific configuration fields.
 *
 * Shows a workflow selector dropdown that fetches available workflows
 * from the API. When a workflow is selected, its nodes are fetched
 * and displayed as preview steps on the whiteboard node.
 */
export function renderWhiteboardWorkflowFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
): TemplateResult {
  const workflowId = (config.workflowId as string) || '';
  const workflowName = (config.workflowName as string) || '';
  const steps = (config.workflowSteps as Array<{ name: string; type: string }>) || [];

  /**
   * When the select is focused/clicked, fetch workflows if not yet cached
   * and populate the dropdown options.
   */
  const handleSelectFocus = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    // Only load if we haven't populated yet (only placeholder exists)
    if (select.options.length <= 1) {
      loadWorkflowOptions(select, workflowId);
    }
  };

  /**
   * When a workflow is selected from the dropdown, fetch its nodes
   * and update the config with workflowId, workflowName, and workflowSteps.
   */
  const handleWorkflowChange = async (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const selectedId = select.value;

    if (!selectedId) {
      onUpdate('workflowId', '');
      onUpdate('workflowName', '');
      onUpdate('workflowSteps', []);
      return;
    }

    const selectedOption = select.options[select.selectedIndex];
    onUpdate('workflowId', selectedId);
    onUpdate('workflowName', selectedOption.text);

    // Fetch workflow nodes to populate the preview steps
    const fetchedSteps = await fetchWorkflowSteps(selectedId);
    onUpdate('workflowSteps', fetchedSteps);
  };

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Workflow Preview</span>
      </div>

      <div class="config-field">
        <label>Select Workflow</label>
        <select
          class="config-input"
          @focus=${handleSelectFocus}
          @mousedown=${handleSelectFocus}
          @change=${handleWorkflowChange}
        >
          <option value="">Select a workflow...</option>
          ${workflowId ? html`
            <option value=${workflowId} selected>${workflowName || workflowId}</option>
          ` : nothing}
        </select>
        <span class="field-description">Choose a workflow to preview on the whiteboard.</span>
      </div>

      ${steps.length > 0 ? html`
        <div class="config-field">
          <label>Steps (${steps.length})</label>
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
      ` : workflowId ? html`
        <div class="config-field">
          <span class="field-description">No steps found for this workflow.</span>
        </div>
      ` : nothing}
    </div>

    <style>
      .field-description {
        font-size: 11px;
        color: var(--text-tertiary, #999);
        margin-top: 4px;
        display: block;
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
        text-transform: uppercase;
      }
    </style>
  `;
}
