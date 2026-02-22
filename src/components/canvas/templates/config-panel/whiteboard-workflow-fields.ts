/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { until } from 'lit/directives/until.js';
import { NodeConfiguration } from '../../workflow-canvas.types.js';

interface WorkflowOption {
  id: string;
  name: string;
  steps: Array<{ name: string; type: string }>;
}

/** Cached workflows list (null = not yet fetched) */
let _workflowsCache: WorkflowOption[] | null = null;
let _fetchPromise: Promise<WorkflowOption[]> | null = null;
let _cacheTimestamp = 0;
const CACHE_TTL = 120_000; // 2 minutes

/**
 * Fetch workflows list from the API with caching
 */
function getWorkflows(): Promise<WorkflowOption[]> {
  // Return cache if fresh
  if (_workflowsCache && Date.now() - _cacheTimestamp < CACHE_TTL) {
    return Promise.resolve(_workflowsCache);
  }

  // Return in-flight request if any
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = fetch('/api/v1/workflows')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: any[]) => {
      _workflowsCache = data
        .filter((w: any) => !w.isTemplate)
        .map((w: any) => ({
          id: w.id,
          name: w.name,
          steps: (w.nodes || []).map((n: any) => ({
            name: n.name,
            type: n.type,
          })),
        }));
      _cacheTimestamp = Date.now();
      return _workflowsCache;
    })
    .catch(() => {
      _workflowsCache = [];
      _cacheTimestamp = Date.now();
      return [] as WorkflowOption[];
    })
    .finally(() => {
      _fetchPromise = null;
    });

  return _fetchPromise;
}

/**
 * Render the workflow select dropdown
 */
function renderWorkflowSelect(
  workflows: WorkflowOption[],
  currentId: string,
  onSelect: (e: Event) => void,
): TemplateResult {
  return html`
    <select class="config-select" .value=${currentId} @change=${onSelect}>
      <option value="">— Select a workflow —</option>
      ${workflows.map(w => html`
        <option value=${w.id} ?selected=${w.id === currentId}>${w.name}</option>
      `)}
    </select>
  `;
}

/**
 * Render WB_WORKFLOW node specific configuration fields
 */
export function renderWhiteboardWorkflowFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const workflowId = (config.workflowId as string) || '';
  const steps = (config.workflowSteps as Array<{ name: string; type: string }>) || [];

  const handleWorkflowSelect = (e: Event) => {
    const selectedId = (e.target as HTMLSelectElement).value;
    if (!selectedId) {
      onUpdate('workflowId', '');
      onUpdate('workflowName', '');
      onUpdate('workflowSteps', []);
      return;
    }
    const workflows = _workflowsCache || [];
    const selected = workflows.find(w => w.id === selectedId);
    if (selected) {
      onUpdate('workflowId', selected.id);
      onUpdate('workflowName', selected.name);
      onUpdate('workflowSteps', selected.steps);
    }
  };

  // Use cached data synchronously when available, otherwise show loading state
  const selectContent = _workflowsCache !== null && Date.now() - _cacheTimestamp < CACHE_TTL
    ? renderWorkflowSelect(_workflowsCache, workflowId, handleWorkflowSelect)
    : until(
        getWorkflows().then(wfs => renderWorkflowSelect(wfs, workflowId, handleWorkflowSelect)),
        html`<select class="config-select" disabled><option>Loading workflows…</option></select>`
      );

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Workflow Preview</span>
      </div>

      <div class="config-field">
        <label>Workflow</label>
        ${selectContent}
        <span class="field-description">Select a workflow to preview on the whiteboard.</span>
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
      ` : nothing}
    </div>

    <style>
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
