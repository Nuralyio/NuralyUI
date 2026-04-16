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

const SLACK_EVENT_TYPES = [
  { value: 'message.channels', label: 'Message in Public Channel' },
  { value: 'message.groups', label: 'Message in Private Channel' },
  { value: 'message.im', label: 'Direct Message' },
  { value: 'message.mpim', label: 'Group Direct Message' },
  { value: 'app_mention', label: 'App Mentioned' },
  { value: 'reaction_added', label: 'Reaction Added' },
  { value: 'reaction_removed', label: 'Reaction Removed' },
  { value: 'channel_created', label: 'Channel Created' },
  { value: 'channel_archive', label: 'Channel Archived' },
  { value: 'team_join', label: 'User Joined Workspace' },
  { value: 'member_joined_channel', label: 'Member Joined Channel' },
  { value: 'member_left_channel', label: 'Member Left Channel' },
  { value: 'file_shared', label: 'File Shared' },
  { value: 'pin_added', label: 'Pin Added' },
  { value: 'emoji_changed', label: 'Emoji Changed' },
];

const SLACK_INTERACTION_TYPES = [
  { value: 'block_actions', label: 'Block Actions (Button / Select)' },
  { value: 'view_submission', label: 'Modal Submission' },
  { value: 'view_closed', label: 'Modal Closed' },
  { value: 'shortcut', label: 'Global Shortcut' },
  { value: 'message_action', label: 'Message Shortcut' },
];

/**
 * Render Slack Socket Mode trigger config fields
 */
export function renderSlackSocketFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  triggerInfo?: TriggerInfo,
  triggerActions?: TriggerActions,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const eventTypes: string[] = (config as any).eventTypes || [];
  const interactionTypes: string[] = (config as any).interactionTypes || [];

  const slackEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('slack/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    ${renderTriggerStatusSection(triggerInfo, triggerActions, 'SLACK_SOCKET', config, {
      activateLabel: 'Connect',
    })}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Slack App Credentials</span>
        <span class="config-section-desc">Enable Socket Mode in your Slack app and generate these tokens</span>
      </div>
      <div class="config-field">
        <label>App-Level Token</label>
        <nr-kv-secret-select
          .provider=${'slack'}
          .entries=${slackEntries}
          .value=${(config as any).appTokenPath || ''}
          placeholder="Select Slack app token..."
          @value-change=${(e: CustomEvent) => onUpdate('appTokenPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Starts with "xapp-" — generate under Basic Information → App-Level Tokens with the connections:write scope</span>
      </div>
      <div class="config-field">
        <label>Bot Token</label>
        <nr-kv-secret-select
          .provider=${'slack'}
          .entries=${slackEntries}
          .value=${(config as any).botTokenPath || ''}
          placeholder="Select Slack bot token..."
          @value-change=${(e: CustomEvent) => onUpdate('botTokenPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Starts with "xoxb-" — from OAuth &amp; Permissions, used for Web API calls</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Event Subscriptions</span>
        <span class="config-section-desc">Which Events API events fire this workflow (empty = all subscribed events)</span>
      </div>
      <div class="config-field">
        <div class="method-checkboxes">
          ${SLACK_EVENT_TYPES.map(eventType => {
            const isChecked = eventTypes.includes(eventType.value);
            return html`
              <label class="method-checkbox">
                <nr-checkbox
                  .checked=${isChecked}
                  @nr-change=${(e: CustomEvent) => {
                    const checked = e.detail.checked;
                    const next = checked
                      ? [...eventTypes, eventType.value]
                      : eventTypes.filter(t => t !== eventType.value);
                    onUpdate('eventTypes', next);
                  }}
                ></nr-checkbox>
                <span class="method-label">${eventType.label}</span>
              </label>
            `;
          })}
        </div>
        <span class="field-description">Event types must also be subscribed in the Slack app's Event Subscriptions page</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Interactivity</span>
        <span class="config-section-desc">Which interactive payload types fire this workflow</span>
      </div>
      <div class="config-field">
        <div class="method-checkboxes">
          ${SLACK_INTERACTION_TYPES.map(interaction => {
            const isChecked = interactionTypes.includes(interaction.value);
            return html`
              <label class="method-checkbox">
                <nr-checkbox
                  .checked=${isChecked}
                  @nr-change=${(e: CustomEvent) => {
                    const checked = e.detail.checked;
                    const next = checked
                      ? [...interactionTypes, interaction.value]
                      : interactionTypes.filter(i => i !== interaction.value);
                    onUpdate('interactionTypes', next);
                  }}
                ></nr-checkbox>
                <span class="method-label">${interaction.label}</span>
              </label>
            `;
          })}
        </div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Slash Commands</span>
        <span class="config-section-desc">Comma-separated list of slash commands that should fire this workflow</span>
      </div>
      <div class="config-field">
        <label>Commands</label>
        <nr-input
          value=${(config as any).slashCommands || ''}
          placeholder="/deploy, /ticket"
          @nr-input=${(e: CustomEvent) => onUpdate('slashCommands', e.detail.value)}
        ></nr-input>
        <span class="field-description">Leave empty to ignore slash commands</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Filtering</span>
        <span class="config-section-desc">Restrict which workspaces, channels or users can trigger this workflow</span>
      </div>
      <div class="config-field">
        <label>Allowed Team IDs</label>
        <nr-input
          value=${(config as any).allowedTeamIds || ''}
          placeholder="T01234567, T89ABCDEF"
          @nr-input=${(e: CustomEvent) => onUpdate('allowedTeamIds', e.detail.value)}
        ></nr-input>
        <span class="field-description">Comma-separated workspace IDs (leave empty to allow all)</span>
      </div>
      <div class="config-field">
        <label>Allowed Channel IDs</label>
        <nr-input
          value=${(config as any).allowedChannelIds || ''}
          placeholder="C01234567, C89ABCDEF"
          @nr-input=${(e: CustomEvent) => onUpdate('allowedChannelIds', e.detail.value)}
        ></nr-input>
        <span class="field-description">Comma-separated channel IDs (leave empty to allow all)</span>
      </div>
      <div class="config-field">
        <label>Allowed User IDs</label>
        <nr-input
          value=${(config as any).allowedUserIds || ''}
          placeholder="U01234567, U89ABCDEF"
          @nr-input=${(e: CustomEvent) => onUpdate('allowedUserIds', e.detail.value)}
        ></nr-input>
        <span class="field-description">Comma-separated user IDs (leave empty to allow all)</span>
      </div>
      <div class="config-field">
        <label>Ignore Bot Messages</label>
        <nr-checkbox
          .checked=${(config as any).ignoreBots !== false}
          @nr-change=${(e: CustomEvent) => onUpdate('ignoreBots', e.detail.checked)}
        ></nr-checkbox>
        <span class="field-description">Skip events where bot_id is set (including messages from this bot)</span>
      </div>
    </div>
  `;
}
