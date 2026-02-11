/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { WorkflowNode, AggregatedPort } from '../workflow-canvas.types.js';
import { ExecutionStatus } from '../workflow-canvas.types.js';

/**
 * Data required for rendering frame nodes
 */
export interface FrameNodesTemplateData {
  frame: WorkflowNode;
  selectedNodeIds: Set<string>;
  editingFrameLabelId: string | null;
  containedNodes: WorkflowNode[];
  previews: Array<{ icon: string; color: string; name: string }>;
  aggregatedPorts: { inputs: AggregatedPort[]; outputs: AggregatedPort[] };
}

/**
 * Callbacks for frame node interactions
 */
export interface FrameNodesCallbacks {
  onFrameMouseDown: (e: MouseEvent, frame: WorkflowNode) => void;
  onFrameDblClick: (e: MouseEvent, frame: WorkflowNode) => void;
  onFrameResize: (e: MouseEvent, frame: WorkflowNode, handle: string) => void;
  onStartEditingLabel: (e: MouseEvent, frame: WorkflowNode) => void;
  onLabelBlur: (e: FocusEvent, frame: WorkflowNode) => void;
  onLabelKeydown: (e: KeyboardEvent, frame: WorkflowNode) => void;
}

/**
 * Compute an aggregated execution status from a set of contained nodes.
 * This is a pure function with no side effects.
 */
export function getAggregatedFrameStatus(containedNodes: WorkflowNode[]): ExecutionStatus {
  if (containedNodes.length === 0) return ExecutionStatus.IDLE;

  let hasRunning = false;
  let hasFailed = false;
  let hasPending = false;
  let hasCompleted = false;

  for (const node of containedNodes) {
    const status = node.status || ExecutionStatus.IDLE;
    switch (status) {
      case ExecutionStatus.RUNNING:
        hasRunning = true;
        break;
      case ExecutionStatus.FAILED:
        hasFailed = true;
        break;
      case ExecutionStatus.PENDING:
      case ExecutionStatus.WAITING:
        hasPending = true;
        break;
      case ExecutionStatus.COMPLETED:
        hasCompleted = true;
        break;
    }
  }

  if (hasRunning) return ExecutionStatus.RUNNING;
  if (hasFailed) return ExecutionStatus.FAILED;
  if (hasPending) return ExecutionStatus.PENDING;
  if (hasCompleted) return ExecutionStatus.COMPLETED;
  return ExecutionStatus.IDLE;
}

/**
 * Render an expanded (non-collapsed) frame node
 */
export function renderExpandedFrameTemplate(
  data: FrameNodesTemplateData,
  callbacks: FrameNodesCallbacks
): TemplateResult | null {
  const { frame, selectedNodeIds, editingFrameLabelId } = data;
  const config = frame.configuration || {};
  const collapsed = config.frameCollapsed as boolean;
  if (collapsed) return null;

  const width = (config.frameWidth as number) || 400;
  const height = (config.frameHeight as number) || 300;
  const bgColor = (config.frameBackgroundColor as string) || 'rgba(99, 102, 241, 0.05)';
  const borderColor = (config.frameBorderColor as string) || 'rgba(99, 102, 241, 0.3)';
  const label = (config.frameLabel as string) || 'Group';
  const labelPosition = (config.frameLabelPosition as string) || 'top-left';
  const labelPlacement = (config.frameLabelPlacement as string) || 'outside';
  const showLabel = config.frameShowLabel !== false;
  const isSelected = selectedNodeIds.has(frame.id);

  const frameStyles = {
    left: `${frame.position.x}px`,
    top: `${frame.position.y}px`,
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: bgColor,
    borderColor: borderColor,
  };

  return html`
    <div
      class="frame-node ${isSelected ? 'selected' : ''}"
      style=${styleMap(frameStyles)}
      data-frame-id=${frame.id}
      @mousedown=${(e: MouseEvent) => callbacks.onFrameMouseDown(e, frame)}
      @dblclick=${(e: MouseEvent) => callbacks.onFrameDblClick(e, frame)}
    >
      ${showLabel ? html`
        <div class="frame-label ${labelPosition} ${labelPlacement}">
          ${editingFrameLabelId === frame.id ? html`
            <input
              type="text"
              class="frame-label-input"
              .value=${label}
              @blur=${(e: FocusEvent) => callbacks.onLabelBlur(e, frame)}
              @keydown=${(e: KeyboardEvent) => callbacks.onLabelKeydown(e, frame)}
              @click=${(e: MouseEvent) => e.stopPropagation()}
              @mousedown=${(e: MouseEvent) => e.stopPropagation()}
            />
          ` : html`
            <span class="frame-label-text">
              ${label}
              <nr-icon
                name="edit-2"
                size="small"
                class="frame-label-edit-icon"
                @click=${(e: MouseEvent) => callbacks.onStartEditingLabel(e, frame)}
              ></nr-icon>
            </span>
          `}
        </div>
      ` : null}
      ${isSelected ? html`
        <div class="resize-handle resize-se" @mousedown=${(e: MouseEvent) => callbacks.onFrameResize(e, frame, 'se')}></div>
        <div class="resize-handle resize-sw" @mousedown=${(e: MouseEvent) => callbacks.onFrameResize(e, frame, 'sw')}></div>
        <div class="resize-handle resize-ne" @mousedown=${(e: MouseEvent) => callbacks.onFrameResize(e, frame, 'ne')}></div>
        <div class="resize-handle resize-nw" @mousedown=${(e: MouseEvent) => callbacks.onFrameResize(e, frame, 'nw')}></div>
      ` : null}
    </div>
  `;
}

/**
 * Render a collapsed frame node with aggregated ports and node previews
 */
export function renderCollapsedFrameTemplate(
  data: FrameNodesTemplateData,
  callbacks: FrameNodesCallbacks
): TemplateResult | null {
  const { frame, selectedNodeIds, editingFrameLabelId, containedNodes, previews, aggregatedPorts } = data;
  const config = frame.configuration || {};
  const collapsed = config.frameCollapsed as boolean;
  if (!collapsed) return null;

  const label = (config.frameLabel as string) || 'Group';
  const borderColor = (config.frameBorderColor as string) || 'rgba(99, 102, 241, 0.3)';
  const isSelected = selectedNodeIds.has(frame.id);
  const overflowCount = containedNodes.length - 5;

  // Get aggregated execution status for contained nodes
  const aggregatedStatus = getAggregatedFrameStatus(containedNodes);

  const nodeStyles = {
    left: `${frame.position.x}px`,
    top: `${frame.position.y}px`,
    '--node-color': borderColor.replace('0.3)', '1)').replace('rgba', 'rgb').split(',').slice(0, 3).join(',') + ')',
  };

  // Generate tooltip
  const tooltipContent = containedNodes.length === 0
    ? 'Empty group'
    : `Contains:\n${containedNodes.map(n => `• ${n.name}`).join('\n')}\n\nDouble-click to expand`;

  // Map status to CSS class
  const statusClass = aggregatedStatus !== ExecutionStatus.IDLE
    ? `status-${aggregatedStatus.toLowerCase()}`
    : '';

  return html`
    <div
      class="collapsed-frame-node ${isSelected ? 'selected' : ''} ${statusClass}"
      style=${styleMap(nodeStyles)}
      data-frame-id=${frame.id}
      data-status=${aggregatedStatus}
      title=${tooltipContent}
      @mousedown=${(e: MouseEvent) => callbacks.onFrameMouseDown(e, frame)}
      @dblclick=${(e: MouseEvent) => callbacks.onFrameDblClick(e, frame)}
    >
      <!-- Status indicator -->
      ${aggregatedStatus !== ExecutionStatus.IDLE ? html`
        <div class="frame-status-indicator status-${aggregatedStatus.toLowerCase()}">
          ${aggregatedStatus === ExecutionStatus.RUNNING ? html`
            <nr-icon name="loader" size="small" class="spinning"></nr-icon>
          ` : aggregatedStatus === ExecutionStatus.FAILED ? html`
            <nr-icon name="alert-circle" size="small"></nr-icon>
          ` : aggregatedStatus === ExecutionStatus.COMPLETED ? html`
            <nr-icon name="check-circle" size="small"></nr-icon>
          ` : aggregatedStatus === ExecutionStatus.PENDING ? html`
            <nr-icon name="clock" size="small"></nr-icon>
          ` : null}
        </div>
      ` : null}

      <!-- Aggregated input ports -->
      ${aggregatedPorts.inputs.length > 0 ? html`
        <div class="ports ports-left">
          ${aggregatedPorts.inputs.map(port => html`
            <div
              class="port port-input"
              data-port-id=${port.id}
              title=${port.label || 'Input'}
            ></div>
          `)}
        </div>
      ` : null}

      <!-- Node body -->
      <div class="collapsed-frame-body">
        <div class="collapsed-frame-header">
          <nr-icon name="layers" size="small"></nr-icon>
          ${editingFrameLabelId === frame.id ? html`
            <input
              type="text"
              class="collapsed-frame-title-input"
              .value=${label}
              @blur=${(e: FocusEvent) => callbacks.onLabelBlur(e, frame)}
              @keydown=${(e: KeyboardEvent) => callbacks.onLabelKeydown(e, frame)}
              @click=${(e: MouseEvent) => e.stopPropagation()}
              @mousedown=${(e: MouseEvent) => e.stopPropagation()}
              @dblclick=${(e: MouseEvent) => e.stopPropagation()}
            />
          ` : html`
            <span class="collapsed-frame-title">
              ${label}
              <nr-icon
                name="edit-2"
                size="small"
                class="frame-label-edit-icon"
                @click=${(e: MouseEvent) => callbacks.onStartEditingLabel(e, frame)}
              ></nr-icon>
            </span>
          `}
        </div>

        <!-- Node icons preview row -->
        ${previews.length > 0 ? html`
          <div class="node-icons-preview">
            ${previews.map(preview => html`
              <div
                class="preview-icon"
                style="background-color: ${preview.color}20"
                title=${preview.name}
              >
                <nr-icon
                  name=${preview.icon}
                  size="small"
                  style="color: ${preview.color}"
                ></nr-icon>
              </div>
            `)}
            ${overflowCount > 0 ? html`
              <span class="overflow-count">+${overflowCount}</span>
            ` : null}
          </div>
        ` : html`
          <div class="node-icons-preview empty">
            <span class="empty-text">Empty</span>
          </div>
        `}
      </div>

      <!-- Aggregated output ports -->
      ${aggregatedPorts.outputs.length > 0 ? html`
        <div class="ports ports-right">
          ${aggregatedPorts.outputs.map(port => html`
            <div
              class="port port-output"
              data-port-id=${port.id}
              title=${port.label || 'Output'}
            ></div>
          `)}
        </div>
      ` : null}

    </div>
  `;
}
