/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../workflow-canvas.types.js';

// Import KV secret select component
import '../../../../kv-secret-select/kv-secret-select.component.js';

interface KvEntryLike {
  keyPath: string;
  value?: any;
  isSecret: boolean;
}

/**
 * Render HTTP Start node fields
 */
export function renderHttpStartFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  workflowId?: string,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const wfId = workflowId || '{workflowId}';
  const httpPath = (config.httpPath as string) || '/webhook';
  const webhookUrl = `${window.location.origin}/api/v1/workflows/${wfId}/trigger${httpPath}`;
  const defaultMethod = config.httpMethod || 'POST';
  const httpAuth = (config.httpAuth as string) || 'none';

  const httpTriggerEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('http_trigger/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Webhook URL</span>
        <span class="config-section-desc">Use this URL to trigger the workflow</span>
      </div>
      <div class="config-field">
        <div class="webhook-url-container">
          <code class="webhook-url">${webhookUrl}</code>
          <nr-button
            type="ghost"
            size="small"
            @click=${() => {
              navigator.clipboard.writeText(webhookUrl);
            }}
            buttonAriaLabel="Copy URL"
          >
            <nr-icon name="copy" size="small"></nr-icon>
          </nr-button>
        </div>
      </div>
    </div>
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">HTTP Settings</span>
      </div>
      <div class="config-field">
        <label>Path</label>
        <nr-input
          value=${config.httpPath || '/webhook'}
          placeholder="/webhook"
          @nr-input=${(e: CustomEvent) => onUpdate('httpPath', e.detail.value)}
        ></nr-input>
        <span class="field-description">Custom path suffix for this trigger</span>
      </div>
      <div class="config-field">
        <label>Allowed Method</label>
        <nr-select
          .value=${defaultMethod}
          .options=${[
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'PATCH', value: 'PATCH' },
            { label: 'DELETE', value: 'DELETE' },
            { label: 'HEAD', value: 'HEAD' },
            { label: 'OPTIONS', value: 'OPTIONS' }
          ]}
          @nr-change=${(e: CustomEvent) => onUpdate('httpMethod', e.detail.value)}
        ></nr-select>
      </div>
      <div class="config-field">
        <label>Authentication</label>
        <nr-select
          .value=${config.httpAuth || 'none'}
          .options=${[
            { label: 'None', value: 'none' },
            { label: 'API Key', value: 'api_key' },
            { label: 'Bearer Token', value: 'bearer' },
            { label: 'Basic Auth', value: 'basic' }
          ]}
          @nr-change=${(e: CustomEvent) => onUpdate('httpAuth', e.detail.value)}
        ></nr-select>
      </div>
      ${httpAuth === 'api_key' ? html`
        <div class="config-field">
          <label>API Key Header Name</label>
          <nr-input
            value=${(config as any).httpAuthHeaderName || 'X-API-Key'}
            placeholder="X-API-Key"
            @nr-input=${(e: CustomEvent) => onUpdate('httpAuthHeaderName', e.detail.value)}
          ></nr-input>
          <span class="field-description">The HTTP header name for the API key</span>
        </div>
        <div class="config-field">
          <label>API Key</label>
          <nr-kv-secret-select
            .provider=${'http_trigger'}
            .entries=${httpTriggerEntries}
            .value=${(config as any).httpAuthTokenPath || ''}
            placeholder="Select API key..."
            @value-change=${(e: CustomEvent) => onUpdate('httpAuthTokenPath', e.detail.value)}
            @create-entry=${handleCreateEntry}
          ></nr-kv-secret-select>
          <span class="field-description">KV secret containing the API key</span>
        </div>
      ` : nothing}
      ${httpAuth === 'bearer' ? html`
        <div class="config-field">
          <label>Bearer Token</label>
          <nr-kv-secret-select
            .provider=${'http_trigger'}
            .entries=${httpTriggerEntries}
            .value=${(config as any).httpAuthTokenPath || ''}
            placeholder="Select bearer token..."
            @value-change=${(e: CustomEvent) => onUpdate('httpAuthTokenPath', e.detail.value)}
            @create-entry=${handleCreateEntry}
          ></nr-kv-secret-select>
          <span class="field-description">KV secret containing the bearer token</span>
        </div>
      ` : nothing}
      ${httpAuth === 'basic' ? html`
        <div class="config-field">
          <label>Username</label>
          <nr-kv-secret-select
            .provider=${'http_trigger'}
            .entries=${httpTriggerEntries}
            .value=${(config as any).httpAuthUsernamePath || ''}
            placeholder="Select username..."
            @value-change=${(e: CustomEvent) => onUpdate('httpAuthUsernamePath', e.detail.value)}
            @create-entry=${handleCreateEntry}
          ></nr-kv-secret-select>
          <span class="field-description">KV secret containing the username</span>
        </div>
        <div class="config-field">
          <label>Password</label>
          <nr-kv-secret-select
            .provider=${'http_trigger'}
            .entries=${httpTriggerEntries}
            .value=${(config as any).httpAuthPasswordPath || ''}
            placeholder="Select password..."
            @value-change=${(e: CustomEvent) => onUpdate('httpAuthPasswordPath', e.detail.value)}
            @create-entry=${handleCreateEntry}
          ></nr-kv-secret-select>
          <span class="field-description">KV secret containing the password</span>
        </div>
      ` : nothing}
      <div class="config-field">
        <label>Rate Limit (req/min)</label>
        <nr-input
          type="number"
          value=${String(config.httpRateLimit || 100)}
          @nr-input=${(e: CustomEvent) => onUpdate('httpRateLimit', Number.parseInt(e.detail.value))}
        ></nr-input>
      </div>
    </div>
  `;
}

/**
 * Render HTTP End node fields
 */
export function renderHttpEndFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  return html`
    <div class="config-field">
      <label>Status Code</label>
      <nr-input
        type="number"
        value=${String(config.httpStatusCode || 200)}
        @nr-input=${(e: CustomEvent) => onUpdate('httpStatusCode', Number.parseInt(e.detail.value))}
      ></nr-input>
    </div>
    <div class="config-field">
      <label>Content Type</label>
      <nr-input
        value=${config.httpContentType || 'application/json'}
        placeholder="application/json"
        @nr-input=${(e: CustomEvent) => onUpdate('httpContentType', e.detail.value)}
      ></nr-input>
    </div>
    <div class="config-field">
      <label>Response Body</label>
      <nr-input
        value=${config.httpResponseBody || '{{data}}'}
        placeholder="{{data}}"
        @nr-input=${(e: CustomEvent) => onUpdate('httpResponseBody', e.detail.value)}
      ></nr-input>
      <span class="field-description">Use \${variables.varName} to reference variables</span>
    </div>
  `;
}

/**
 * Render HTTP node fields
 */
export function renderHttpFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  return html`
    <div class="config-field">
      <label>Method</label>
      <nr-input
        value=${config.method || 'GET'}
        placeholder="GET, POST, PUT, DELETE"
        @nr-input=${(e: CustomEvent) => onUpdate('method', e.detail.value)}
      ></nr-input>
    </div>
    <div class="config-field">
      <label>URL</label>
      <nr-input
        value=${config.url || ''}
        placeholder="https://api.example.com"
        @nr-input=${(e: CustomEvent) => onUpdate('url', e.detail.value)}
      ></nr-input>
    </div>
    <div class="config-field">
      <label>Timeout (ms)</label>
      <nr-input
        type="number"
        value=${String(config.timeout || 30000)}
        @nr-input=${(e: CustomEvent) => onUpdate('timeout', Number.parseInt(e.detail.value))}
      ></nr-input>
    </div>
  `;
}
