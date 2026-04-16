/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../workflow-canvas.types.js';
import type { KvEntryLike } from './shared/kv-credential-utils.js';
import type { TriggerInfo, TriggerActions } from '../types.js';
import { renderTriggerStatusSection } from './shared/trigger-status-utils.js';

import '../../../../kv-secret-select/kv-secret-select.component.js';

const AUTH_MODES = [
  { value: 'none', label: 'None' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'basic', label: 'Basic Auth' },
  { value: 'header', label: 'Custom Header' },
  { value: 'query', label: 'Query Parameter' },
];

const MESSAGE_FORMATS = [
  { value: 'json', label: 'JSON' },
  { value: 'text', label: 'Text' },
  { value: 'binary', label: 'Binary (base64)' },
];

/**
 * Render Custom WebSocket Listener trigger config fields
 */
export function renderWebsocketListenerFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  triggerInfo?: TriggerInfo,
  triggerActions?: TriggerActions,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const authMode = (config as any).authMode || 'none';
  const messageFormat = (config as any).messageFormat || 'json';
  const autoReconnect = (config as any).autoReconnect !== false;

  const wsEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('websocket/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    ${renderTriggerStatusSection(triggerInfo, triggerActions, 'CUSTOM_WEBSOCKET', config, {
      activateLabel: 'Connect',
    })}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Endpoint</span>
        <span class="config-section-desc">The WebSocket URL this node should connect to</span>
      </div>
      <div class="config-field">
        <label>URL</label>
        <nr-input
          value=${(config as any).url || ''}
          placeholder="wss://example.com/stream"
          @nr-input=${(e: CustomEvent) => onUpdate('url', e.detail.value)}
        ></nr-input>
        <span class="field-description">Must start with ws:// or wss://</span>
      </div>
      <div class="config-field">
        <label>Subprotocol</label>
        <nr-input
          value=${(config as any).subprotocol || ''}
          placeholder="graphql-ws"
          @nr-input=${(e: CustomEvent) => onUpdate('subprotocol', e.detail.value)}
        ></nr-input>
        <span class="field-description">Optional — sent as Sec-WebSocket-Protocol during the handshake</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Authentication</span>
        <span class="config-section-desc">Credentials sent when opening the WebSocket connection</span>
      </div>
      <div class="config-field">
        <label>Mode</label>
        <nr-select
          .value=${authMode}
          .options=${AUTH_MODES}
          @nr-change=${(e: CustomEvent) => onUpdate('authMode', e.detail.value)}
        ></nr-select>
      </div>

      ${authMode === 'bearer'
        ? html`
            <div class="config-field">
              <label>Bearer Token</label>
              <nr-kv-secret-select
                .provider=${'websocket'}
                .entries=${wsEntries}
                .value=${(config as any).tokenPath || ''}
                placeholder="Select token..."
                @value-change=${(e: CustomEvent) => onUpdate('tokenPath', e.detail.value)}
                @create-entry=${handleCreateEntry}
              ></nr-kv-secret-select>
              <span class="field-description">Sent as "Authorization: Bearer &lt;token&gt;"</span>
            </div>
          `
        : nothing}

      ${authMode === 'basic'
        ? html`
            <div class="config-field">
              <label>Username</label>
              <nr-input
                value=${(config as any).username || ''}
                @nr-input=${(e: CustomEvent) => onUpdate('username', e.detail.value)}
              ></nr-input>
            </div>
            <div class="config-field">
              <label>Password</label>
              <nr-kv-secret-select
                .provider=${'websocket'}
                .entries=${wsEntries}
                .value=${(config as any).passwordPath || ''}
                placeholder="Select password..."
                @value-change=${(e: CustomEvent) => onUpdate('passwordPath', e.detail.value)}
                @create-entry=${handleCreateEntry}
              ></nr-kv-secret-select>
            </div>
          `
        : nothing}

      ${authMode === 'header'
        ? html`
            <div class="config-field">
              <label>Header Name</label>
              <nr-input
                value=${(config as any).headerName || ''}
                placeholder="X-Api-Key"
                @nr-input=${(e: CustomEvent) => onUpdate('headerName', e.detail.value)}
              ></nr-input>
            </div>
            <div class="config-field">
              <label>Header Value</label>
              <nr-kv-secret-select
                .provider=${'websocket'}
                .entries=${wsEntries}
                .value=${(config as any).headerValuePath || ''}
                placeholder="Select secret..."
                @value-change=${(e: CustomEvent) => onUpdate('headerValuePath', e.detail.value)}
                @create-entry=${handleCreateEntry}
              ></nr-kv-secret-select>
            </div>
          `
        : nothing}

      ${authMode === 'query'
        ? html`
            <div class="config-field">
              <label>Query Parameter Name</label>
              <nr-input
                value=${(config as any).queryParamName || 'token'}
                placeholder="token"
                @nr-input=${(e: CustomEvent) => onUpdate('queryParamName', e.detail.value)}
              ></nr-input>
            </div>
            <div class="config-field">
              <label>Query Parameter Value</label>
              <nr-kv-secret-select
                .provider=${'websocket'}
                .entries=${wsEntries}
                .value=${(config as any).queryParamValuePath || ''}
                placeholder="Select secret..."
                @value-change=${(e: CustomEvent) => onUpdate('queryParamValuePath', e.detail.value)}
                @create-entry=${handleCreateEntry}
              ></nr-kv-secret-select>
              <span class="field-description">Appended to the URL as ?name=value</span>
            </div>
          `
        : nothing}
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Handshake</span>
        <span class="config-section-desc">Optional payload sent immediately after the connection opens</span>
      </div>
      <div class="config-field">
        <label>Initial Message</label>
        <nr-textarea
          value=${(config as any).initialMessage || ''}
          placeholder='{"type":"subscribe","channel":"orders"}'
          rows="3"
          @nr-input=${(e: CustomEvent) => onUpdate('initialMessage', e.detail.value)}
        ></nr-textarea>
        <span class="field-description">Plain text or JSON — leave empty to skip</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection Reliability</span>
      </div>
      <div class="config-field">
        <label>Auto-Reconnect</label>
        <nr-checkbox
          .checked=${autoReconnect}
          @nr-change=${(e: CustomEvent) => onUpdate('autoReconnect', e.detail.checked)}
        ></nr-checkbox>
        <span class="field-description">Reconnect automatically when the connection drops</span>
      </div>
      ${autoReconnect
        ? html`
            <div class="config-field">
              <label>Reconnect Delay (ms)</label>
              <nr-input
                type="number"
                value=${String((config as any).reconnectDelayMs ?? 5000)}
                @nr-input=${(e: CustomEvent) => onUpdate('reconnectDelayMs', Number.parseInt(e.detail.value))}
              ></nr-input>
              <span class="field-description">Base delay between reconnect attempts (exponential backoff applies)</span>
            </div>
            <div class="config-field">
              <label>Max Reconnect Attempts</label>
              <nr-input
                type="number"
                value=${String((config as any).maxReconnectAttempts ?? 0)}
                @nr-input=${(e: CustomEvent) => onUpdate('maxReconnectAttempts', Number.parseInt(e.detail.value))}
              ></nr-input>
              <span class="field-description">0 = retry forever</span>
            </div>
          `
        : nothing}
      <div class="config-field">
        <label>Ping Interval (seconds)</label>
        <nr-input
          type="number"
          value=${String((config as any).pingIntervalSec ?? 30)}
          @nr-input=${(e: CustomEvent) => onUpdate('pingIntervalSec', Number.parseInt(e.detail.value))}
        ></nr-input>
        <span class="field-description">Send a keep-alive ping at this interval (0 to disable)</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Message Handling</span>
        <span class="config-section-desc">How incoming frames are parsed and filtered</span>
      </div>
      <div class="config-field">
        <label>Message Format</label>
        <nr-select
          .value=${messageFormat}
          .options=${MESSAGE_FORMATS}
          @nr-change=${(e: CustomEvent) => onUpdate('messageFormat', e.detail.value)}
        ></nr-select>
      </div>
      ${messageFormat === 'json'
        ? html`
            <div class="config-field">
              <label>Filter Expression</label>
              <nr-input
                value=${(config as any).filterExpression || ''}
                placeholder="$.type == 'order.created'"
                @nr-input=${(e: CustomEvent) => onUpdate('filterExpression', e.detail.value)}
              ></nr-input>
              <span class="field-description">Optional JSONPath/boolean expression — only matching messages trigger the workflow</span>
            </div>
          `
        : nothing}
    </div>
  `;
}
