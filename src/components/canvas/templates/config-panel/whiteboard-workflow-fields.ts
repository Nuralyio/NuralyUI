/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../workflow-canvas.types.js';

interface WorkflowListItem {
  id: string;
  name: string;
  description?: string;
  nodeCount: number;
}

// Module-level cache for fetched workflows
let _cachedWorkflows: WorkflowListItem[] | null = null;
let _fetchPromise: Promise<void> | null = null;
let _fetchError = '';
let _pendingCallbacks: Array<() => void> = [];

/**
 * Fetch all workflows from the API and cache them.
 * Calls pending callbacks when complete so the config panel re-renders.
 */
function ensureWorkflowsFetched(onReady: () => void): void {
  if (_cachedWorkflows !== null) {
    return; // Already cached
  }

  _pendingCallbacks.push(onReady);

  if (_fetchPromise) {
    return; // Already fetching
  }

  _fetchPromise = fetch('/api/v1/workflows')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((dtos: Array<{ id: string; name: string; description?: string; nodes?: unknown[] }>) => {
      _cachedWorkflows = dtos.map(dto => ({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        nodeCount: dto.nodes?.length ?? 0,
      }));
      _fetchError = '';
    })
    .catch((err: Error) => {
      _fetchError = err.message || 'Failed to fetch workflows';
      _cachedWorkflows = [];
    })
    .finally(() => {
      _fetchPromise = null;
      const cbs = _pendingCallbacks;
      _pendingCallbacks = [];
      for (const cb of cbs) {
        try { cb(); } catch { /* ignore */ }
      }
    });
}

/**
 * Fetch a single workflow's details and update the node config with its data.
 */
async function selectWorkflow(
  workflowId: string,
  onUpdate: (key: string, value: unknown) => void,
): Promise<void> {
  if (!workflowId) {
    onUpdate('workflowId', '');
    onUpdate('workflowName', 'Workflow');
    onUpdate('workflowSteps', []);
    return;
  }

  try {
    const res = await fetch(`/api/v1/workflows/${workflowId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const dto = await res.json();

    const nodes = (dto.nodes || []) as Array<{
      name: string;
      type: string;
      configuration?: string;
    }>;

    const steps = nodes.map(n => ({
      name: n.name || 'Untitled',
      type: (n.type || '').replace(/^WF_/, ''),
    }));

    onUpdate('workflowId', workflowId);
    onUpdate('workflowName', dto.name || 'Workflow');
    onUpdate('workflowSteps', steps);
  } catch {
    // On error, still save the ID so the user can retry
    onUpdate('workflowId', workflowId);
  }
}

/**
 * Invalidate the cached workflow list (e.g. after creating a new workflow).
 */
export function invalidateWorkflowCache(): void {
  _cachedWorkflows = null;
  _fetchPromise = null;
  _fetchError = '';
}

/**
 * Render WB_WORKFLOW node specific configuration fields.
 *
 * Shows a workflow selector dropdown fetched from the API.
 * When a workflow is selected, its nodes are loaded and stored as
 * preview steps in the node configuration.
 */
export function renderWhiteboardWorkflowFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const workflowId = (config.workflowId as string) || '';
  const workflowName = (config.workflowName as string) || 'Workflow';
  const steps = (config.workflowSteps as Array<{ name: string; type: string }>) || [];

  // Trigger fetch if not yet done. The callback forces a re-render
  // by performing a no-op update on the config, which causes Lit to
  // re-call this template function with fresh _cachedWorkflows.
  const workflows = _cachedWorkflows;
  if (workflows === null) {
    ensureWorkflowsFetched(() => {
      // Trigger re-render by writing the same workflowId back
      onUpdate('workflowId', workflowId);
    });
  }

  const isLoading = workflows === null;
  const hasError = !isLoading && _fetchError;

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Workflow Preview</span>
      </div>

      <div class="config-field">
        <label>Select Workflow</label>
        ${isLoading ? html`
          <div class="wb-wf-loading">
            <nr-icon name="loader" size="small"></nr-icon>
            <span>Loading workflows...</span>
          </div>
        ` : hasError ? html`
          <div class="wb-wf-error">
            <span>Failed to load workflows</span>
            <button class="wb-wf-retry-btn" @click=${() => {
              invalidateWorkflowCache();
              onUpdate('workflowId', workflowId);
            }}>Retry</button>
          </div>
        ` : html`
          <select
            class="config-select"
            .value=${workflowId}
            @change=${(e: Event) => {
              const selectedId = (e.target as HTMLSelectElement).value;
              selectWorkflow(selectedId, onUpdate);
            }}
          >
            <option value="">-- Select a workflow --</option>
            ${(workflows || []).map(wf => html`
              <option value=${wf.id} ?selected=${wf.id === workflowId}>
                ${wf.name}${wf.nodeCount > 0 ? ` (${wf.nodeCount} nodes)` : ''}
              </option>
            `)}
          </select>
          <span class="field-description">Choose a workflow to preview on the whiteboard.</span>
        `}
      </div>

      ${workflowId ? html`
        <div class="config-field">
          <label>Workflow Name</label>
          <input
            type="text"
            class="config-input"
            .value=${workflowName}
            readonly
          />
        </div>
      ` : nothing}

      ${steps.length > 0 ? html`
        <div class="config-field">
          <label>Preview (${steps.length} nodes)</label>
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
          <div class="wb-wf-empty-preview">
            <nr-icon name="layers" size="small"></nr-icon>
            <span>This workflow has no nodes yet.</span>
          </div>
        </div>
      ` : nothing}
    </div>

    <style>
      .wb-wf-loading {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        color: var(--text-secondary, #666);
        font-size: 12px;
      }
      .wb-wf-loading nr-icon {
        animation: wb-wf-spin 1s linear infinite;
      }
      @keyframes wb-wf-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .wb-wf-error {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        background: var(--bg-error, #fef2f2);
        border-radius: 4px;
        font-size: 12px;
        color: var(--text-error, #dc2626);
      }
      .wb-wf-retry-btn {
        background: none;
        border: 1px solid var(--text-error, #dc2626);
        border-radius: 4px;
        padding: 2px 8px;
        font-size: 11px;
        color: var(--text-error, #dc2626);
        cursor: pointer;
      }
      .wb-wf-retry-btn:hover {
        background: var(--bg-error, #fef2f2);
      }
      .wb-wf-empty-preview {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        color: var(--text-tertiary, #999);
        font-size: 12px;
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
