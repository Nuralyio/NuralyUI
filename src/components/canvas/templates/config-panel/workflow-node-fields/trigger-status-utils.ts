/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration, TriggerConnectionState } from '../../../workflow-canvas.types.js';
import type { TriggerInfo, TriggerActions } from '../types.js';

/**
 * Format a relative time string from an ISO timestamp
 */
export function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'just now';
  if (diffMs < 60_000) return `${Math.floor(diffMs / 1000)}s ago`;
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)} min ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  return `${Math.floor(diffMs / 86_400_000)}d ago`;
}

/**
 * Get display label and CSS class for a trigger connection state
 */
export function getStatusDisplay(state?: TriggerConnectionState): { label: string; cssClass: string } {
  switch (state) {
    case TriggerConnectionState.CONNECTED:
      return { label: 'Connected', cssClass: 'trigger-status--connected' };
    case TriggerConnectionState.CONNECTING:
      return { label: 'Connecting...', cssClass: 'trigger-status--connecting' };
    case TriggerConnectionState.ERROR:
      return { label: 'Error', cssClass: 'trigger-status--error' };
    case TriggerConnectionState.PAUSED:
      return { label: 'Paused', cssClass: 'trigger-status--paused' };
    case TriggerConnectionState.DISCONNECTED:
    default:
      return { label: 'Disconnected', cssClass: 'trigger-status--disconnected' };
  }
}

/**
 * Render the trigger stats row (messages received, last message time)
 */
export function renderTriggerStats(triggerInfo: TriggerInfo): TemplateResult {
  return html`
    <div class="trigger-stats-row">
      <span class="trigger-stat">
        <nr-icon name="message-square" size="small"></nr-icon>
        ${triggerInfo.messagesReceived} message${triggerInfo.messagesReceived === 1 ? '' : 's'} received
      </span>
      ${triggerInfo.lastMessageAt ? html`
        <span class="trigger-stat trigger-stat--secondary">
          Last: ${formatRelativeTime(triggerInfo.lastMessageAt)}
        </span>
      ` : nothing}
    </div>
  `;
}

/**
 * Render the action button based on trigger state
 */
export function renderActionButton(
  hasTrigger: boolean,
  isActive: boolean,
  triggerInfo: TriggerInfo | undefined,
  triggerActions: TriggerActions,
  nodeType: string,
  config: NodeConfiguration,
  activateLabel = 'Activate Trigger',
): TemplateResult {
  if (!hasTrigger) {
    return html`
      <nr-button
        type="primary"
        size="small"
        @click=${() => triggerActions.onCreateAndActivate(nodeType, config)}
      >
        <nr-icon name="play" size="small"></nr-icon>
        ${activateLabel}
      </nr-button>
    `;
  }
  const triggerId = triggerInfo?.triggerId ?? '';
  if (isActive) {
    return html`
      <nr-button
        type="danger"
        size="small"
        @click=${() => triggerActions.onDeactivate(triggerId)}
      >
        <nr-icon name="square" size="small"></nr-icon>
        Deactivate
      </nr-button>
    `;
  }
  return html`
    <nr-button
      type="primary"
      size="small"
      @click=${() => triggerActions.onActivate(triggerId)}
    >
      <nr-icon name="play" size="small"></nr-icon>
      Activate
    </nr-button>
  `;
}

export interface TriggerStatusOptions {
  activateLabel?: string;
  extraStatusContent?: TemplateResult | typeof nothing;
}

/**
 * Render the trigger status section at the top of the config panel
 */
export function renderTriggerStatusSection(
  triggerInfo: TriggerInfo | undefined,
  triggerActions: TriggerActions | undefined,
  nodeType: string,
  config: NodeConfiguration,
  options?: TriggerStatusOptions,
): TemplateResult {
  const hasTrigger = !!triggerInfo?.triggerId;
  const statusDisplay = getStatusDisplay(triggerInfo?.status);
  const isActive = triggerInfo?.status === TriggerConnectionState.CONNECTED
    || triggerInfo?.status === TriggerConnectionState.CONNECTING;
  const showStats = isActive && triggerInfo?.messagesReceived != null;
  const activateLabel = options?.activateLabel ?? 'Activate Trigger';

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">
          <nr-icon name="radio" size="small"></nr-icon>
          Trigger Status
        </span>
      </div>

      <div class="trigger-status-panel">
        <div class="trigger-status-row">
          <span class="trigger-status-dot ${statusDisplay.cssClass}"></span>
          <span class="trigger-status-label">${statusDisplay.label}</span>
          ${triggerInfo?.health && isActive ? html`
            <span class="trigger-health-badge trigger-health--${triggerInfo.health.toLowerCase()}">${triggerInfo.health}</span>
          ` : nothing}
        </div>

        ${triggerInfo?.stateReason ? html`
          <div class="trigger-status-reason">${triggerInfo.stateReason}</div>
        ` : nothing}

        ${showStats && triggerInfo ? renderTriggerStats(triggerInfo) : nothing}

        ${triggerInfo?.inDevMode ? html`
          <div class="trigger-dev-mode-badge">
            <nr-icon name="code" size="small"></nr-icon>
            Dev Mode Active
          </div>
        ` : nothing}

        ${triggerInfo?.webhookUrl ? html`
          <div class="trigger-webhook-url">
            <code>${triggerInfo.webhookUrl}</code>
            <nr-button
              type="ghost"
              size="small"
              @click=${() => navigator.clipboard.writeText(triggerInfo.webhookUrl!)}
              title="Copy webhook URL"
            >
              <nr-icon name="copy" size="small"></nr-icon>
            </nr-button>
          </div>
        ` : nothing}

        ${options?.extraStatusContent ?? nothing}
      </div>

      ${triggerActions ? html`
        <div class="trigger-actions">
          ${renderActionButton(hasTrigger, isActive, triggerInfo, triggerActions, nodeType, config, activateLabel)}

          ${hasTrigger ? html`
            <label class="trigger-dev-toggle">
              <nr-switch
                ?checked=${!!triggerInfo?.inDevMode}
                @nr-change=${(e: CustomEvent) => {
                  triggerActions.onToggleDevMode(triggerInfo!.triggerId!, e.detail.checked);
                }}
              ></nr-switch>
              <span class="trigger-dev-toggle-label">
                ${triggerInfo?.inDevMode ? 'Exit Dev Mode' : 'Dev Mode'}
              </span>
            </label>
          ` : nothing}
        </div>
      ` : nothing}
    </div>
  `;
}
