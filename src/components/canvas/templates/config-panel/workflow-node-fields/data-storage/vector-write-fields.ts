/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';
import type { KvEntryLike } from '../shared/kv-credential-utils.js';

// Import KV secret select component
import '../../../../../kv-secret-select/kv-secret-select.component.js';

/**
 * Render Vector Write node fields
 */
export function renderVectorWriteFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const provider = config.provider || 'openai';
  const isOllama = provider === 'ollama';
  const isLocal = provider === 'local';

  const providerEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith(`${provider}/`)
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    <div class="config-field">
      <label>Collection Name <span class="required">*</span></label>
      <nr-input
        value=${config.collectionName || ''}
        placeholder="knowledge-base"
        @nr-input=${(e: CustomEvent) => onUpdate('collectionName', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Name of the vector collection to store in</small>
    </div>

    <div class="config-field">
      <label>Content Field</label>
      <nr-input
        value=${config.contentField || ''}
        placeholder="content"
        @nr-input=${(e: CustomEvent) => onUpdate('contentField', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Input field containing the text to embed (default: "content")</small>
    </div>

    <div class="config-field">
      <label>Source ID Field</label>
      <nr-input
        value=${config.sourceIdField || ''}
        placeholder="sourceId"
        @nr-input=${(e: CustomEvent) => onUpdate('sourceIdField', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Input field containing the document identifier for upsert (default: "sourceId")</small>
    </div>

    <div class="config-field">
      <label>Metadata Fields</label>
      <nr-input
        value=${config.metadataFields || ''}
        placeholder="title, author, category"
        @nr-input=${(e: CustomEvent) => onUpdate('metadataFields', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Comma-separated input fields to store as vector metadata</small>
    </div>

    <div class="config-field">
      <label>Upsert Mode</label>
      <nr-select
        .value=${config.upsertMode || 'replace'}
        .options=${[
          { label: 'Replace (delete existing by sourceId)', value: 'replace' },
          { label: 'Append (always add new)', value: 'append' },
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('upsertMode', e.detail.value)}
      ></nr-select>
      <small class="field-hint">How to handle existing documents with same sourceId</small>
    </div>

    <div class="config-field">
      <label>Batch Size</label>
      <nr-input
        type="number"
        value=${config.batchSize || 100}
        min="1"
        max="1000"
        @nr-input=${(e: CustomEvent) => onUpdate('batchSize', Number.parseInt(e.detail.value) || 100)}
      ></nr-input>
      <small class="field-hint">Number of vectors to upsert per API call</small>
    </div>

    <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--nr-border-color);" />
    <div class="config-section-title">Embedding Settings</div>

    <div class="config-field">
      <label>Embedding Provider</label>
      <nr-select
        .value=${provider}
        .options=${[
          { label: 'OpenAI', value: 'openai' },
          { label: 'Ollama', value: 'ollama' },
          { label: 'Local (ONNX)', value: 'local' },
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('provider', e.detail.value)}
      ></nr-select>
      <small class="field-hint">Provider used to generate embeddings from text</small>
    </div>

    <div class="config-field">
      <label>Model</label>
      ${provider === 'openai' ? html`
        <nr-select
          .value=${config.model || 'text-embedding-3-small'}
          .options=${[
            { label: 'text-embedding-3-small', value: 'text-embedding-3-small' },
            { label: 'text-embedding-3-large', value: 'text-embedding-3-large' },
            { label: 'text-embedding-ada-002', value: 'text-embedding-ada-002' },
          ]}
          @nr-change=${(e: CustomEvent) => onUpdate('model', e.detail.value)}
        ></nr-select>
      ` : html`
        <nr-input
          value=${config.model || ''}
          placeholder=${isOllama ? 'nomic-embed-text' : 'all-MiniLM-L6-v2'}
          @nr-input=${(e: CustomEvent) => onUpdate('model', e.detail.value)}
        ></nr-input>
      `}
    </div>

    ${!isLocal ? html`
      <div class="config-field">
        <label>API Key Path</label>
        <nr-kv-secret-select
          .provider=${provider}
          .entries=${providerEntries}
          .value=${config.apiKeyPath || ''}
          placeholder="Select API key..."
          @value-change=${(e: CustomEvent) => onUpdate('apiKeyPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <small class="field-hint">KV store path for API key</small>
      </div>
    ` : ''}

    ${isOllama ? html`
      <div class="config-field">
        <label>API URL Path</label>
        <nr-kv-secret-select
          .provider=${provider}
          .entries=${providerEntries}
          .value=${config.apiUrlPath || ''}
          type="url"
          placeholder="Select or create server URL..."
          @value-change=${(e: CustomEvent) => onUpdate('apiUrlPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
      </div>
    ` : ''}

    <div class="config-field">
      <label>Isolation Key (Optional)</label>
      <nr-input
        value=${config.isolationKey || ''}
        placeholder="\${input.userId}"
        @nr-input=${(e: CustomEvent) => onUpdate('isolationKey', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Partition data by user or tenant</small>
    </div>
  `;
}
