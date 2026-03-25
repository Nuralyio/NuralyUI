/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration, TriggerConnectionState } from '../../../../workflow-canvas.types.js';
import type { TriggerInfo, TriggerActions } from '../../types.js';

const ACKS_OPTIONS = [
  { value: 'none', label: 'None — No acknowledgment' },
  { value: 'leader', label: 'Leader — Leader broker only' },
  { value: 'all', label: 'All — All in-sync replicas' },
];

const COMPRESSION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'gzip', label: 'Gzip' },
  { value: 'snappy', label: 'Snappy' },
  { value: 'lz4', label: 'LZ4' },
];

/**
 * Format a relative time string from an ISO timestamp
 */
function formatRelativeTime(isoString: string): string {
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
function getStatusDisplay(state?: TriggerConnectionState): { label: string; cssClass: string } {
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
function renderTriggerStats(triggerInfo: TriggerInfo): TemplateResult {
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
function renderActionButton(
  hasTrigger: boolean,
  isActive: boolean,
  triggerInfo: TriggerInfo | undefined,
  triggerActions: TriggerActions,
  nodeType: string,
  config: NodeConfiguration,
): TemplateResult {
  if (!hasTrigger) {
    return html`
      <nr-button
        type="primary"
        size="small"
        .iconLeft=${'play'}
        @click=${() => triggerActions.onCreateAndActivate(nodeType, config)}
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
        Deactivate
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
      Activate
    </nr-button>
  `;
}

/**
 * Render the trigger status section at the top of the config panel
 */
function renderTriggerStatusSection(
  triggerInfo: TriggerInfo | undefined,
  triggerActions: TriggerActions | undefined,
  nodeType: string,
  config: NodeConfiguration,
): TemplateResult {
  const hasTrigger = !!triggerInfo?.triggerId;
  const statusDisplay = getStatusDisplay(triggerInfo?.status);
  const isActive = triggerInfo?.status === TriggerConnectionState.CONNECTED
    || triggerInfo?.status === TriggerConnectionState.CONNECTING;
  const showStats = isActive && triggerInfo?.messagesReceived != null;

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
      </div>

      ${triggerActions ? html`
        <div class="trigger-actions">
          ${renderActionButton(hasTrigger, isActive, triggerInfo, triggerActions, nodeType, config)}

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

/**
 * Render shared Kafka connection fields (brokers + credentials)
 */
function renderKafkaConnectionFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: { keyPath: string; value?: any; isSecret: boolean }[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
        <span class="config-section-desc">Configure the Kafka broker connection</span>
      </div>
      <div class="config-field">
        <label>Brokers</label>
        <nr-input
          value=${(config as any).kafkaBrokers || ''}
          placeholder="broker1:9092,broker2:9092"
          @nr-input=${(e: CustomEvent) => onUpdate('kafkaBrokers', e.detail.value)}
        ></nr-input>
        <span class="field-description">Comma-separated list of Kafka broker addresses</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Credentials</span>
        <span class="config-section-desc">SASL/SSL authentication (optional)</span>
      </div>
      <div class="config-field">
        <label>SASL Username</label>
        ${kvEntries && onCreateKvEntry ? html`
          <nr-kv-secret-select
            .value=${(config as any).kafkaSaslUsernamePath || ''}
            .entries=${kvEntries}
            placeholder="Select or create a secret..."
            @nr-change=${(e: CustomEvent) => onUpdate('kafkaSaslUsernamePath', e.detail.value)}
            @nr-create=${(e: CustomEvent) => onCreateKvEntry({
              keyPath: e.detail.keyPath,
              value: e.detail.value,
              scope: 'application',
              isSecret: true,
            })}
          ></nr-kv-secret-select>
        ` : html`
          <nr-input
            type="password"
            value=${(config as any).kafkaSaslUsernamePath || ''}
            placeholder="SASL username"
            @nr-input=${(e: CustomEvent) => onUpdate('kafkaSaslUsernamePath', e.detail.value)}
          ></nr-input>
        `}
        <span class="field-description">SASL username for authentication</span>
      </div>
      <div class="config-field">
        <label>SASL Password</label>
        ${kvEntries && onCreateKvEntry ? html`
          <nr-kv-secret-select
            .value=${(config as any).kafkaSaslPasswordPath || ''}
            .entries=${kvEntries}
            placeholder="Select or create a secret..."
            @nr-change=${(e: CustomEvent) => onUpdate('kafkaSaslPasswordPath', e.detail.value)}
            @nr-create=${(e: CustomEvent) => onCreateKvEntry({
              keyPath: e.detail.keyPath,
              value: e.detail.value,
              scope: 'application',
              isSecret: true,
            })}
          ></nr-kv-secret-select>
        ` : html`
          <nr-input
            type="password"
            value=${(config as any).kafkaSaslPasswordPath || ''}
            placeholder="SASL password"
            @nr-input=${(e: CustomEvent) => onUpdate('kafkaSaslPasswordPath', e.detail.value)}
          ></nr-input>
        `}
        <span class="field-description">SASL password for authentication</span>
      </div>
      <div class="config-field">
        <label>Use SSL</label>
        <nr-checkbox
          .checked=${!!(config as any).kafkaUseSsl}
          @nr-change=${(e: CustomEvent) => onUpdate('kafkaUseSsl', e.detail.checked)}
        ></nr-checkbox>
        <span class="field-description">Enable SSL/TLS encryption for the connection</span>
      </div>
    </div>
  `;
}

/**
 * Render Kafka Producer config fields
 */
export function renderKafkaFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: { keyPath: string; value?: any; isSecret: boolean }[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  return html`
    ${renderKafkaConnectionFields(config, onUpdate, kvEntries, onCreateKvEntry)}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Producer Settings</span>
        <span class="config-section-desc">Configure message production</span>
      </div>
      <div class="config-field">
        <label>Topic</label>
        <nr-input
          value=${(config as any).kafkaTopic || ''}
          placeholder="my-topic"
          @nr-input=${(e: CustomEvent) => onUpdate('kafkaTopic', e.detail.value)}
        ></nr-input>
        <span class="field-description">Kafka topic to produce messages to</span>
      </div>
      <div class="config-field">
        <label>Message Key</label>
        <nr-input
          value=${(config as any).kafkaMessageKey || ''}
          placeholder="Optional key for partitioning"
          @nr-input=${(e: CustomEvent) => onUpdate('kafkaMessageKey', e.detail.value)}
        ></nr-input>
        <span class="field-description">Optional message key used for partition assignment</span>
      </div>
      <div class="config-field">
        <label>Headers</label>
        <nr-code-editor
          language="json"
          value=${(config as any).kafkaHeaders || ''}
          placeholder='{"key": "value"}'
          @nr-change=${(e: CustomEvent) => onUpdate('kafkaHeaders', e.detail.value)}
        ></nr-code-editor>
        <span class="field-description">Optional JSON headers to include with the message</span>
      </div>
      <div class="config-field">
        <label>Acks</label>
        <nr-select
          .value=${(config as any).kafkaAcks || 'all'}
          .options=${ACKS_OPTIONS}
          @nr-change=${(e: CustomEvent) => onUpdate('kafkaAcks', e.detail.value)}
        ></nr-select>
        <span class="field-description">Acknowledgment level required from brokers</span>
      </div>
      <div class="config-field">
        <label>Compression</label>
        <nr-select
          .value=${(config as any).kafkaCompressionType || 'none'}
          .options=${COMPRESSION_OPTIONS}
          @nr-change=${(e: CustomEvent) => onUpdate('kafkaCompressionType', e.detail.value)}
        ></nr-select>
        <span class="field-description">Compression codec for message batches</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Output</span>
      </div>
      <div class="config-field">
        <label>Output Variable</label>
        <nr-input
          value=${(config as any).outputVariable || ''}
          placeholder="kafkaResult"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description">Variable name to store the send result</span>
      </div>
    </div>
  `;
}

/**
 * Render Kafka Trigger config fields
 */
export function renderKafkaTriggerFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  triggerInfo?: TriggerInfo,
  triggerActions?: TriggerActions,
  kvEntries?: { keyPath: string; value?: any; isSecret: boolean }[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  return html`
    ${renderTriggerStatusSection(triggerInfo, triggerActions, 'KAFKA_TRIGGER', config)}

    ${renderKafkaConnectionFields(config, onUpdate, kvEntries, onCreateKvEntry)}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Consumer Settings</span>
        <span class="config-section-desc">Configure message consumption</span>
      </div>
      <div class="config-field">
        <label>Topic</label>
        <nr-input
          value=${(config as any).kafkaTopic || ''}
          placeholder="my-topic"
          @nr-input=${(e: CustomEvent) => onUpdate('kafkaTopic', e.detail.value)}
        ></nr-input>
        <span class="field-description">Kafka topic to consume messages from</span>
      </div>
      <div class="config-field">
        <label>Consumer Group</label>
        <nr-input
          value=${(config as any).kafkaConsumerGroup || ''}
          placeholder="nuraly-workflow"
          @nr-input=${(e: CustomEvent) => onUpdate('kafkaConsumerGroup', e.detail.value)}
        ></nr-input>
        <span class="field-description">Consumer group ID for coordinated consumption</span>
      </div>
      <div class="config-field">
        <label>From Beginning</label>
        <nr-checkbox
          .checked=${!!(config as any).kafkaFromBeginning}
          @nr-change=${(e: CustomEvent) => onUpdate('kafkaFromBeginning', e.detail.checked)}
        ></nr-checkbox>
        <span class="field-description">Start reading from the beginning of the topic (instead of latest)</span>
      </div>
      <div class="config-field">
        <label>Session Timeout (ms)</label>
        <nr-input
          type="number"
          value=${(config as any).kafkaSessionTimeout ?? 30000}
          min="1000"
          max="300000"
          @nr-input=${(e: CustomEvent) => onUpdate('kafkaSessionTimeout', parseInt(e.detail.value, 10) || 30000)}
        ></nr-input>
        <span class="field-description">Session timeout in milliseconds (default: 30000)</span>
      </div>
      <div class="config-field">
        <label>Max Bytes per Partition</label>
        <nr-input
          type="number"
          value=${(config as any).kafkaMaxBytes ?? ''}
          placeholder="1048576"
          min="1"
          @nr-input=${(e: CustomEvent) => onUpdate('kafkaMaxBytes', e.detail.value ? parseInt(e.detail.value, 10) : undefined)}
        ></nr-input>
        <span class="field-description">Maximum bytes to fetch per partition (leave empty for default)</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Output</span>
      </div>
      <div class="config-field">
        <label>Output Variable</label>
        <nr-input
          value=${(config as any).outputVariable || ''}
          placeholder="kafkaMessage"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description">Variable name to store the consumed message</span>
      </div>
    </div>
  `;
}
