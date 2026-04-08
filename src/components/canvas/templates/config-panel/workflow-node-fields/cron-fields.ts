/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration, TriggerConnectionState } from '../../../workflow-canvas.types.js';
import type { TriggerInfo, TriggerActions } from '../types.js';

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'America/Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST/AEDT)' },
];

const CRON_PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'Every 30 minutes', value: '*/30 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every 6 hours', value: '0 */6 * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at noon', value: '0 12 * * *' },
  { label: 'Every Monday at 9am', value: '0 9 * * 1' },
  { label: 'Every weekday at 9am', value: '0 9 * * 1-5' },
  { label: 'First day of month', value: '0 0 1 * *' },
];

function getStatusDisplay(state?: TriggerConnectionState): { label: string; cssClass: string } {
  switch (state) {
    case TriggerConnectionState.CONNECTED:
      return { label: 'Running', cssClass: 'trigger-status--connected' };
    case TriggerConnectionState.CONNECTING:
      return { label: 'Starting...', cssClass: 'trigger-status--connecting' };
    case TriggerConnectionState.ERROR:
      return { label: 'Error', cssClass: 'trigger-status--error' };
    case TriggerConnectionState.PAUSED:
      return { label: 'Paused', cssClass: 'trigger-status--paused' };
    case TriggerConnectionState.DISCONNECTED:
    default:
      return { label: 'Stopped', cssClass: 'trigger-status--disconnected' };
  }
}

function renderActionButton(
  hasTrigger: boolean,
  isActive: boolean,
  triggerInfo: TriggerInfo | undefined,
  triggerActions: TriggerActions,
  config: NodeConfiguration,
): TemplateResult {
  if (!hasTrigger) {
    return html`
      <nr-button
        type="primary"
        size="small"
        .iconLeft=${'play'}
        @click=${() => triggerActions.onCreateAndActivate('CRON', config)}
      >
        Activate Trigger
      </nr-button>
    `;
  }
  const triggerId = triggerInfo?.triggerId ?? '';
  if (isActive) {
    return html`
      <nr-button
        type="danger"
        size="small"
        .iconLeft=${'square'}
        @click=${() => triggerActions.onDeactivate(triggerId)}
      >
        Stop
      </nr-button>
    `;
  }
  return html`
    <nr-button
      type="primary"
      size="small"
      .iconLeft=${'play'}
      @click=${() => triggerActions.onActivate(triggerId)}
    >
      Start
    </nr-button>
  `;
}

function renderTriggerStatusSection(
  triggerInfo: TriggerInfo | undefined,
  triggerActions: TriggerActions | undefined,
  config: NodeConfiguration,
): TemplateResult {
  const hasTrigger = !!triggerInfo?.triggerId;
  const statusDisplay = getStatusDisplay(triggerInfo?.status);
  const isActive = triggerInfo?.status === TriggerConnectionState.CONNECTED
    || triggerInfo?.status === TriggerConnectionState.CONNECTING;

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">
          <nr-icon name="radio" size="small"></nr-icon>
          Scheduler Status
        </span>
      </div>

      <div class="trigger-status-panel">
        <div class="trigger-status-row">
          <span class="trigger-status-dot ${statusDisplay.cssClass}"></span>
          <span class="trigger-status-label">${statusDisplay.label}</span>
        </div>

        ${triggerInfo?.stateReason ? html`
          <div class="trigger-status-reason">${triggerInfo.stateReason}</div>
        ` : nothing}
      </div>

      ${triggerActions ? html`
        <div class="trigger-actions">
          ${renderActionButton(hasTrigger, isActive, triggerInfo, triggerActions, config)}
        </div>
      ` : nothing}
    </div>
  `;
}

/**
 * Render Cron Trigger config fields
 */
export function renderCronFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  triggerInfo?: TriggerInfo,
  triggerActions?: TriggerActions,
): TemplateResult {
  const cronExpression = (config as any).cronExpression || '0 * * * *';
  const timezone = (config as any).timezone || 'UTC';

  return html`
    ${renderTriggerStatusSection(triggerInfo, triggerActions, config)}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Schedule</span>
        <span class="config-section-desc">Define when the workflow should run</span>
      </div>

      <div class="config-field">
        <label>Preset</label>
        <nr-select
          .value=${''}
          placeholder="Pick a preset..."
          .options=${CRON_PRESETS}
          @nr-change=${(e: CustomEvent) => {
            if (e.detail.value) onUpdate('cronExpression', e.detail.value);
          }}
        ></nr-select>
        <span class="field-description">Select a common schedule or enter a custom expression below</span>
      </div>

      <div class="config-field">
        <label>Cron Expression</label>
        <nr-input
          value=${cronExpression}
          placeholder="* * * * *"
          @nr-input=${(e: CustomEvent) => onUpdate('cronExpression', e.detail.value)}
        ></nr-input>
        <span class="field-description">
          Format: minute hour day month weekday — e.g. <code>0 9 * * 1-5</code> runs every weekday at 9am
        </span>
      </div>

      <div class="config-field">
        <label>Timezone</label>
        <nr-select
          .value=${timezone}
          .options=${TIMEZONE_OPTIONS}
          @nr-change=${(e: CustomEvent) => onUpdate('timezone', e.detail.value)}
        ></nr-select>
        <span class="field-description">Timezone used to interpret the cron expression</span>
      </div>
    </div>
  `;
}
