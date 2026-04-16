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

const DISCORD_GATEWAY_INTENTS = [
  { value: 'GUILDS', label: 'Guilds' },
  { value: 'GUILD_MEMBERS', label: 'Guild Members (privileged)' },
  { value: 'GUILD_MODERATION', label: 'Guild Moderation' },
  { value: 'GUILD_VOICE_STATES', label: 'Voice States' },
  { value: 'GUILD_PRESENCES', label: 'Presences (privileged)' },
  { value: 'GUILD_MESSAGES', label: 'Guild Messages' },
  { value: 'GUILD_MESSAGE_REACTIONS', label: 'Guild Message Reactions' },
  { value: 'DIRECT_MESSAGES', label: 'Direct Messages' },
  { value: 'DIRECT_MESSAGE_REACTIONS', label: 'DM Reactions' },
  { value: 'MESSAGE_CONTENT', label: 'Message Content (privileged)' },
  { value: 'GUILD_SCHEDULED_EVENTS', label: 'Scheduled Events' },
  { value: 'AUTO_MODERATION_EXECUTION', label: 'Auto-Moderation Execution' },
];

const DISCORD_EVENT_TYPES = [
  { value: 'MESSAGE_CREATE', label: 'Message Create' },
  { value: 'MESSAGE_UPDATE', label: 'Message Update' },
  { value: 'MESSAGE_DELETE', label: 'Message Delete' },
  { value: 'MESSAGE_REACTION_ADD', label: 'Reaction Add' },
  { value: 'MESSAGE_REACTION_REMOVE', label: 'Reaction Remove' },
  { value: 'GUILD_MEMBER_ADD', label: 'Member Join' },
  { value: 'GUILD_MEMBER_REMOVE', label: 'Member Leave' },
  { value: 'INTERACTION_CREATE', label: 'Interaction (Slash Command / Button)' },
  { value: 'TYPING_START', label: 'Typing Start' },
  { value: 'PRESENCE_UPDATE', label: 'Presence Update' },
];

/**
 * Render Discord Bot trigger config fields
 */
export function renderDiscordBotFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  triggerInfo?: TriggerInfo,
  triggerActions?: TriggerActions,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const intents: string[] = (config as any).intents || ['GUILDS', 'GUILD_MESSAGES', 'MESSAGE_CONTENT'];
  const eventTypes: string[] = (config as any).eventTypes || [];

  const discordEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('discord/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    ${renderTriggerStatusSection(triggerInfo, triggerActions, 'DISCORD_BOT', config, {
      activateLabel: 'Activate Bot',
    })}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Bot Configuration</span>
        <span class="config-section-desc">Connect a Discord bot via the Gateway WebSocket</span>
      </div>
      <div class="config-field">
        <label>Bot Token</label>
        <nr-kv-secret-select
          .provider=${'discord'}
          .entries=${discordEntries}
          .value=${(config as any).botTokenPath || ''}
          placeholder="Select Discord bot token..."
          @value-change=${(e: CustomEvent) => onUpdate('botTokenPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Create a bot at discord.com/developers/applications and copy the token from the Bot tab</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Gateway Intents</span>
        <span class="config-section-desc">
          Intents tell Discord which events your bot wants to receive. Privileged intents
          (Members, Presences, Message Content) must also be enabled in the Developer Portal.
        </span>
      </div>
      <div class="config-field">
        <div class="method-checkboxes">
          ${DISCORD_GATEWAY_INTENTS.map(intent => {
            const isChecked = intents.includes(intent.value);
            return html`
              <label class="method-checkbox">
                <nr-checkbox
                  .checked=${isChecked}
                  @nr-change=${(e: CustomEvent) => {
                    const checked = e.detail.checked;
                    const next = checked
                      ? [...intents, intent.value]
                      : intents.filter(i => i !== intent.value);
                    onUpdate('intents', next);
                  }}
                ></nr-checkbox>
                <span class="method-label">${intent.label}</span>
              </label>
            `;
          })}
        </div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Event Types</span>
        <span class="config-section-desc">Select which Gateway dispatch events fire this workflow (empty = all received events)</span>
      </div>
      <div class="config-field">
        <div class="method-checkboxes">
          ${DISCORD_EVENT_TYPES.map(eventType => {
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
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Filtering</span>
        <span class="config-section-desc">Restrict which servers, channels or users can trigger this workflow</span>
      </div>
      <div class="config-field">
        <label>Allowed Guild IDs</label>
        <nr-input
          value=${(config as any).allowedGuildIds || ''}
          placeholder="123456789012345678, 234567890123456789"
          @nr-input=${(e: CustomEvent) => onUpdate('allowedGuildIds', e.detail.value)}
        ></nr-input>
        <span class="field-description">Comma-separated guild (server) IDs (leave empty to allow all)</span>
      </div>
      <div class="config-field">
        <label>Allowed Channel IDs</label>
        <nr-input
          value=${(config as any).allowedChannelIds || ''}
          placeholder="345678901234567890, 456789012345678901"
          @nr-input=${(e: CustomEvent) => onUpdate('allowedChannelIds', e.detail.value)}
        ></nr-input>
        <span class="field-description">Comma-separated channel IDs (leave empty to allow all)</span>
      </div>
      <div class="config-field">
        <label>Allowed User IDs</label>
        <nr-input
          value=${(config as any).allowedUserIds || ''}
          placeholder="567890123456789012, 678901234567890123"
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
        <span class="field-description">Skip events originating from other bots (including this bot)</span>
      </div>
    </div>
  `;
}
