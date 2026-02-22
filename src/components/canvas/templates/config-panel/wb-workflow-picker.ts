/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';

interface WorkflowListItem {
  id: string;
  name: string;
}

interface WorkflowPreviewNode {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
}

interface WorkflowPreviewEdge {
  sourceNodeId: string;
  targetNodeId: string;
}

export interface WorkflowSelectedDetail {
  workflowId: string;
  workflowName: string;
  workflowSteps: Array<{ name: string; type: string }>;
  workflowPreviewNodes: WorkflowPreviewNode[];
  workflowPreviewEdges: WorkflowPreviewEdge[];
}

/**
 * Self-contained workflow picker element for the whiteboard workflow config panel.
 * Fetches the user's workflows from the API and renders a select dropdown.
 * On selection, fetches the full workflow data and dispatches a `workflow-selected` event.
 *
 * @element wb-workflow-picker
 * @fires workflow-selected - When a workflow is selected from the dropdown
 */
@customElement('wb-workflow-picker')
export class WbWorkflowPicker extends NuralyUIBaseMixin(LitElement) {
  static override styles = css`
    :host {
      display: block;
    }

    .picker-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .picker-select {
      width: 100%;
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--nuraly-color-border, #e5e7eb);
      background: var(--nuraly-color-surface, #fff);
      color: var(--nuraly-color-text, #1a1a1a);
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      outline: none;
    }

    .picker-select:focus {
      border-color: var(--nuraly-color-interactive, #3b82f6);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
    }

    .picker-loading {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--nuraly-color-text-secondary, #6b7280);
      font-size: 12px;
      padding: 4px 0;
    }

    .picker-error {
      color: var(--nuraly-color-danger, #ef4444);
      font-size: 12px;
      padding: 4px 0;
    }

    .picker-loading-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid var(--nuraly-color-border, #e5e7eb);
      border-top-color: var(--nuraly-color-interactive, #3b82f6);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .fetching-detail {
      color: var(--nuraly-color-text-secondary, #6b7280);
      font-size: 11px;
      font-style: italic;
    }
  `;

  @property({ type: String, attribute: 'selected-workflow-id' })
  selectedWorkflowId = '';

  @state()
  private _workflows: WorkflowListItem[] = [];

  @state()
  private _loading = true;

  @state()
  private _fetchingDetail = false;

  @state()
  private _error = '';

  override connectedCallback() {
    super.connectedCallback();
    this._fetchWorkflows();
  }

  private async _fetchWorkflows() {
    this._loading = true;
    this._error = '';
    try {
      const response = await fetch('/api/v1/workflows');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this._workflows = (data as Array<{ id: string; name: string }>).map(w => ({
        id: w.id,
        name: w.name,
      }));
    } catch (err: unknown) {
      this._error = 'Failed to load workflows';
    }
    this._loading = false;
  }

  private async _handleSelect(e: Event) {
    const select = e.target as HTMLSelectElement;
    const workflowId = select.value;

    if (!workflowId) {
      this.dispatchEvent(new CustomEvent<WorkflowSelectedDetail>('workflow-selected', {
        detail: {
          workflowId: '',
          workflowName: '',
          workflowSteps: [],
          workflowPreviewNodes: [],
          workflowPreviewEdges: [],
        },
        bubbles: true,
        composed: true,
      }));
      return;
    }

    this._fetchingDetail = true;
    try {
      const response = await fetch(`/api/v1/workflows/${workflowId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const dto = await response.json() as {
        id: string;
        name: string;
        nodes?: Array<{ id: string; name: string; type: string; positionX: number; positionY: number; configuration?: string }>;
        edges?: Array<{ sourceNodeId: string; targetNodeId: string }>;
      };

      const nodes = dto.nodes || [];
      const edges = dto.edges || [];

      this.dispatchEvent(new CustomEvent<WorkflowSelectedDetail>('workflow-selected', {
        detail: {
          workflowId: dto.id,
          workflowName: dto.name,
          workflowSteps: nodes.map(n => ({ name: n.name, type: n.type })),
          workflowPreviewNodes: nodes.map(n => ({
            id: n.id,
            name: n.name,
            type: n.type,
            x: n.positionX || 0,
            y: n.positionY || 0,
          })),
          workflowPreviewEdges: edges.map(e => ({
            sourceNodeId: e.sourceNodeId,
            targetNodeId: e.targetNodeId,
          })),
        },
        bubbles: true,
        composed: true,
      }));
    } catch {
      this._error = 'Failed to load workflow details';
    }
    this._fetchingDetail = false;
  }

  override render() {
    if (this._loading) {
      return html`
        <div class="picker-container">
          <div class="picker-loading">
            <div class="picker-loading-spinner"></div>
            Loading workflows...
          </div>
        </div>
      `;
    }

    return html`
      <div class="picker-container">
        <select
          class="picker-select"
          .value=${this.selectedWorkflowId}
          @change=${this._handleSelect}
        >
          <option value="">Select a workflow...</option>
          ${this._workflows.map(w => html`
            <option value=${w.id} ?selected=${w.id === this.selectedWorkflowId}>${w.name}</option>
          `)}
        </select>
        ${this._fetchingDetail ? html`<span class="fetching-detail">Loading workflow data...</span>` : nothing}
        ${this._error ? html`<span class="picker-error">${this._error}</span>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wb-workflow-picker': WbWorkflowPicker;
  }
}
