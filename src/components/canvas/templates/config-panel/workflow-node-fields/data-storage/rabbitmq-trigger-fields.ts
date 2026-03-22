/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';
import type { TriggerInfo, TriggerActions } from '../../types.js';
import { renderTriggerStatusSection } from '../shared/trigger-status-utils.js';

const CONTENT_TYPE_OPTIONS = [
  { value: 'application/json', label: 'JSON' },
  { value: 'text/plain', label: 'Text' },
  { value: 'application/octet-stream', label: 'Binary' },
];

/**
 * Render RabbitMQ Trigger config fields
 */
export function renderRabbitMQTriggerFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  triggerInfo?: TriggerInfo,
  triggerActions?: TriggerActions,
  kvEntries?: { keyPath: string; value?: any; isSecret: boolean }[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  return html`
    ${renderTriggerStatusSection(triggerInfo, triggerActions, 'RABBITMQ_TRIGGER', config)}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
        <span class="config-section-desc">Configure the RabbitMQ connection</span>
      </div>
      <div class="config-field">
        <label>Connection URL</label>
        <nr-kv-secret-select
          provider="rabbitmq"
          type="url"
          .value=${(config as any).connectionUrlPath || ''}
          .entries=${kvEntries || []}
          placeholder="Select RabbitMQ connection URL..."
          @value-change=${(e: CustomEvent) => onUpdate('connectionUrlPath', e.detail.value)}
          @create-entry=${(e: CustomEvent) => onCreateKvEntry?.(e.detail)}
        ></nr-kv-secret-select>
        <span class="field-description">AMQP connection URL stored securely in the KV secret store</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Queue Configuration</span>
        <span class="config-section-desc">Specify the queue and routing settings</span>
      </div>
      <div class="config-field">
        <label>Queue Name</label>
        <nr-input
          value=${(config as any).queueName || ''}
          placeholder="my-queue"
          @nr-input=${(e: CustomEvent) => onUpdate('queueName', e.detail.value)}
        ></nr-input>
        <span class="field-description">The queue to listen on for incoming messages</span>
      </div>
      <div class="config-field">
        <label>Exchange</label>
        <nr-input
          value=${(config as any).exchange || ''}
          placeholder="my-exchange (optional)"
          @nr-input=${(e: CustomEvent) => onUpdate('exchange', e.detail.value)}
        ></nr-input>
        <span class="field-description">Exchange to bind the queue to (leave empty for default exchange)</span>
      </div>
      <div class="config-field">
        <label>Routing Key</label>
        <nr-input
          value=${(config as any).routingKey || '#'}
          placeholder="#"
          @nr-input=${(e: CustomEvent) => onUpdate('routingKey', e.detail.value)}
        ></nr-input>
        <span class="field-description">Routing key for message filtering (# matches all)</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Consumer Settings</span>
        <span class="config-section-desc">Configure message consumption behavior</span>
      </div>
      <div class="config-field">
        <label>Auto Acknowledge</label>
        <nr-checkbox
          .checked=${!!(config as any).autoAck}
          @nr-change=${(e: CustomEvent) => onUpdate('autoAck', e.detail.checked)}
        ></nr-checkbox>
        <span class="field-description">Automatically acknowledge messages (disable for manual ack after workflow completion)</span>
      </div>
      <div class="config-field">
        <label>Content Type</label>
        <nr-select
          .value=${(config as any).contentType || 'application/json'}
          .options=${CONTENT_TYPE_OPTIONS}
          @nr-change=${(e: CustomEvent) => onUpdate('contentType', e.detail.value)}
        ></nr-select>
        <span class="field-description">Expected message content type for deserialization</span>
      </div>
      <div class="config-field">
        <label>Prefetch Count</label>
        <nr-input
          type="number"
          value=${(config as any).prefetchCount ?? 1}
          min="1"
          max="100"
          @nr-input=${(e: CustomEvent) => onUpdate('prefetchCount', parseInt(e.detail.value, 10) || 1)}
        ></nr-input>
        <span class="field-description">Maximum number of unacknowledged messages to receive concurrently</span>
      </div>
    </div>
  `;
}
