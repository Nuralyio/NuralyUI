/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';
import type { KvEntryLike } from '../shared/kv-credential-utils.js';
import type { TriggerInfo, TriggerActions } from '../../types.js';
import { renderTriggerStatusSection } from '../shared/trigger-status-utils.js';

import '../../../../../kv-secret-select/kv-secret-select.component.js';

const CALENDLY_EVENT_OPTIONS = [
  { value: 'invitee.created', label: 'Invitee Created (meeting booked)' },
  { value: 'invitee.canceled', label: 'Invitee Canceled (meeting cancelled)' },
];

const CALENDLY_SCOPE_OPTIONS = [
  { value: 'user', label: 'User — only your events' },
  { value: 'organization', label: 'Organization — all members\' events' },
];

/**
 * Render Calendly Trigger config fields
 */
export function renderCalendlyTriggerFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  triggerInfo?: TriggerInfo,
  triggerActions?: TriggerActions,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const events: string[] = (config as any).events || ['invitee.created'];

  const calendlyEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('calendly/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    ${renderTriggerStatusSection(triggerInfo, triggerActions, 'CALENDLY_TRIGGER', config, {
      activateLabel: 'Activate Trigger',
    })}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Credentials</span>
        <span class="config-section-desc">Calendly Personal Access Token for webhook management</span>
      </div>
      <div class="config-field">
        <label>API Token</label>
        <nr-kv-secret-select
          .provider=${'calendly'}
          .entries=${calendlyEntries}
          .value=${(config as any).apiTokenPath || ''}
          placeholder="Select Calendly API token..."
          @value-change=${(e: CustomEvent) => onUpdate('apiTokenPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Personal Access Token from Calendly (Settings → Integrations → API)</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Events</span>
        <span class="config-section-desc">Select which Calendly events trigger this workflow</span>
      </div>
      <div class="config-field">
        <div class="method-checkboxes">
          ${CALENDLY_EVENT_OPTIONS.map(eventOption => {
            const isChecked = events.includes(eventOption.value);
            return html`
              <label class="method-checkbox">
                <nr-checkbox
                  .checked=${isChecked}
                  @nr-change=${(e: CustomEvent) => {
                    const checked = e.detail.checked;
                    const current = [...events];
                    const newEvents = checked
                      ? [...current, eventOption.value]
                      : current.filter(ev => ev !== eventOption.value);
                    onUpdate('events', newEvents);
                  }}
                ></nr-checkbox>
                <span class="method-label">${eventOption.label}</span>
              </label>
            `;
          })}
        </div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Scope</span>
        <span class="config-section-desc">Determines whose events trigger the workflow</span>
      </div>
      <div class="config-field">
        <label>Scope</label>
        <nr-select
          .value=${(config as any).scope || 'user'}
          .options=${CALENDLY_SCOPE_OPTIONS}
          @nr-change=${(e: CustomEvent) => onUpdate('scope', e.detail.value)}
        ></nr-select>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Output</span>
        <span class="config-section-desc">Variable name to store the event payload for downstream nodes</span>
      </div>
      <div class="config-field">
        <label>Output Variable</label>
        <nr-input
          value=${(config as any).outputVariable || 'calendlyEvent'}
          placeholder="calendlyEvent"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description">The event data will be available as this variable in downstream nodes</span>
      </div>
    </div>
  `;
}
