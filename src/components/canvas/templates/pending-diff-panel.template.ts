/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing } from 'lit';
import type {
  PendingDiff,
  PendingSchemaChange,
  PropertyChange,
  ChangeType,
} from '../schema-diff/index.js';

export interface PendingDiffPanelCallbacks {
  onAccept: (changeId: string) => void;
  onReject: (changeId: string) => void;
  onResetStatus: (changeId: string) => void;
  onApplyAll: () => void;
  onApplyAccepted: () => void;
  onCancel: () => void;
  onToggleDetails: (changeId: string) => void;
}

export interface PendingDiffPanelOptions {
  pendingDiff: PendingDiff | null;
  expandedChangeIds: Set<string>;
  callbacks: PendingDiffPanelCallbacks;
}

/**
 * Render the pending diff panel for reviewing and applying changes
 */
export function renderPendingDiffPanel(options: PendingDiffPanelOptions) {
  const { pendingDiff, expandedChangeIds, callbacks } = options;

  if (!pendingDiff) return nothing;

  const { summary, changes, source, sourceDescription } = pendingDiff;

  return html`
    <div class="pending-diff-panel">
      <div class="pending-diff-header">
        <div class="pending-diff-title">
          <nr-icon name="git-pull-request" size="small"></nr-icon>
          <span>Pending Changes</span>
        </div>
        <div class="pending-diff-source">
          ${getSourceIcon(source)} ${sourceDescription || source}
        </div>
        <button
          class="pending-diff-close"
          @click=${callbacks.onCancel}
          title="Cancel"
        >
          <nr-icon name="x" size="small"></nr-icon>
        </button>
      </div>

      <div class="pending-diff-summary">
        <span class="summary-item summary-pending">
          <span class="summary-dot"></span>
          ${summary.pending} pending
        </span>
        <span class="summary-item summary-accepted">
          <span class="summary-dot"></span>
          ${summary.accepted} accepted
        </span>
        <span class="summary-item summary-rejected">
          <span class="summary-dot"></span>
          ${summary.rejected} rejected
        </span>
        ${summary.applied > 0
          ? html`
              <span class="summary-item summary-applied">
                <span class="summary-dot"></span>
                ${summary.applied} applied
              </span>
            `
          : nothing}
      </div>

      <div class="pending-diff-changes">
        ${changes.map((change) =>
          renderChangeItem(change, expandedChangeIds.has(change.changeId), callbacks)
        )}
      </div>

      <div class="pending-diff-footer">
        <button class="btn-secondary" @click=${callbacks.onCancel}>
          Cancel
        </button>
        <button
          class="btn-primary"
          ?disabled=${summary.accepted === 0}
          @click=${callbacks.onApplyAccepted}
        >
          Apply Accepted (${summary.accepted})
        </button>
        <button
          class="btn-primary btn-apply-all"
          ?disabled=${summary.pending === 0 && summary.accepted === 0}
          @click=${callbacks.onApplyAll}
        >
          Apply All (${summary.pending + summary.accepted})
        </button>
      </div>
    </div>
  `;
}

/**
 * Render a single change item
 */
function renderChangeItem(
  change: PendingSchemaChange,
  isExpanded: boolean,
  callbacks: PendingDiffPanelCallbacks
) {
  const hasDetails =
    change.propertyChanges && change.propertyChanges.length > 0;

  return html`
    <div class="change-item change-status-${change.status}">
      <div
        class="change-header"
        @click=${() =>
          hasDetails && callbacks.onToggleDetails(change.changeId)}
      >
        <span class="change-type-icon change-type-${change.changeType}">
          ${getChangeTypeIcon(change.changeType)}
        </span>
        <span class="change-entity-type">${change.entityType}</span>
        <span class="change-name">${change.entityName}</span>
        <span class="change-status-badge status-${change.status}">
          ${change.status}
        </span>
        ${hasDetails
          ? html`
              <span class="change-expand-icon">
                <nr-icon
                  name=${isExpanded ? 'chevron-up' : 'chevron-down'}
                  size="small"
                ></nr-icon>
              </span>
            `
          : nothing}
      </div>

      ${isExpanded && hasDetails
        ? html`
            <div class="change-details">
              ${change.propertyChanges!.map((pc) => renderPropertyChange(pc))}
            </div>
          `
        : nothing}
      ${change.changeType === 'ADD' && change.added
        ? html`
            <div class="change-preview">
              <pre>${JSON.stringify(change.added, null, 2)}</pre>
            </div>
          `
        : nothing}

      <div class="change-actions">
        ${change.status === 'pending'
          ? html`
              <button
                class="btn-accept"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  callbacks.onAccept(change.changeId);
                }}
              >
                <nr-icon name="check" size="small"></nr-icon>
                Accept
              </button>
              <button
                class="btn-reject"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  callbacks.onReject(change.changeId);
                }}
              >
                <nr-icon name="x" size="small"></nr-icon>
                Reject
              </button>
            `
          : change.status !== 'applied'
            ? html`
                <button
                  class="btn-reset"
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    callbacks.onResetStatus(change.changeId);
                  }}
                >
                  <nr-icon name="rotate-ccw" size="small"></nr-icon>
                  Reset
                </button>
              `
            : nothing}
      </div>
    </div>
  `;
}

/**
 * Render a property change
 */
function renderPropertyChange(change: PropertyChange) {
  return html`
    <div class="property-change property-change-${change.changeType}">
      <span class="property-name">
        <code>${change.property}</code>
      </span>
      <span class="property-change-type">${change.changeType}</span>
      ${change.changeType === 'MODIFY'
        ? html`
            <div class="property-values">
              <span class="property-before">${formatValue(change.before)}</span>
              <span class="property-arrow">→</span>
              <span class="property-after">${formatValue(change.after)}</span>
            </div>
          `
        : change.changeType === 'ADD'
          ? html`
              <div class="property-values">
                <span class="property-after">+ ${formatValue(change.after)}</span>
              </div>
            `
          : html`
              <div class="property-values">
                <span class="property-before">- ${formatValue(change.before)}</span>
              </div>
            `}
    </div>
  `;
}

/**
 * Format a value for display
 */
function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Get icon for change type
 */
function getChangeTypeIcon(changeType: ChangeType): string {
  switch (changeType) {
    case 'ADD':
      return '+';
    case 'REMOVE':
      return '−';
    case 'MODIFY':
      return '●';
    case 'RENAME':
      return '↻';
    default:
      return '?';
  }
}

/**
 * Get icon for source type
 */
function getSourceIcon(source: PendingDiff['source']): string {
  switch (source) {
    case 'ai':
      return '🤖';
    case 'import':
      return '📥';
    case 'migration':
      return '🔄';
    case 'external':
    default:
      return '📋';
  }
}

/**
 * Render diff legend (for canvas overlay)
 */
export function renderDiffLegend(
  pendingDiff: PendingDiff | null,
  onClear: () => void
) {
  if (!pendingDiff) return nothing;

  const { summary } = pendingDiff;

  return html`
    <div class="diff-legend">
      <div class="diff-legend-title">
        <nr-icon name="layers" size="small"></nr-icon>
        Schema Changes
      </div>
      <div class="diff-legend-items">
        ${summary.pending > 0
          ? html`
              <span class="legend-item legend-pending">
                <span class="legend-dot"></span>
                ${summary.pending} pending
              </span>
            `
          : nothing}
        ${summary.accepted > 0
          ? html`
              <span class="legend-item legend-accepted">
                <span class="legend-dot"></span>
                ${summary.accepted} accepted
              </span>
            `
          : nothing}
        ${summary.applied > 0
          ? html`
              <span class="legend-item legend-applied">
                <span class="legend-dot"></span>
                ${summary.applied} applied
              </span>
            `
          : nothing}
      </div>
      <button class="legend-clear" @click=${onClear}>
        <nr-icon name="x" size="small"></nr-icon>
        Clear
      </button>
    </div>
  `;
}
