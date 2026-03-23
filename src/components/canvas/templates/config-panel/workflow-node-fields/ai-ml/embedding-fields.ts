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
 * Render Embedding node fields
 */
export function renderEmbeddingFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const provider = config.provider || 'openai';
  const isOllama = provider === 'ollama';
  const isLocal = provider === 'local';

  // Filter entries for the current provider
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
      <label>Provider</label>
      <nr-select
        .value=${provider}
        .options=${[
          { label: 'OpenAI', value: 'openai' },
          { label: 'Ollama', value: 'ollama' },
          { label: 'Local (ONNX)', value: 'local' },
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('provider', e.detail.value)}
      ></nr-select>
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
          value=${config.model || (isOllama ? 'nomic-embed-text' : 'all-MiniLM-L6-v2')}
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
          placeholder="Select server URL..."
          @value-change=${(e: CustomEvent) => onUpdate('apiUrlPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <small class="field-hint">KV store path for Ollama server URL</small>
      </div>
    ` : ''}

    <div class="config-field">
      <label>Input Field</label>
      <nr-input
        value=${config.inputField || 'text'}
        placeholder="text"
        @nr-input=${(e: CustomEvent) => onUpdate('inputField', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Field containing text to embed (also accepts: texts, chunks, query, content)</small>
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
      <small class="field-hint">Max texts per API call for batch embedding</small>
    </div>

    ${provider === 'openai' ? html`
      <div class="config-field">
        <label>Dimensions (Optional)</label>
        <nr-input
          type="number"
          value=${config.dimensions || ''}
          placeholder="Default (model-specific)"
          min="1"
          max="3072"
          @nr-input=${(e: CustomEvent) => {
            const val = e.detail.value ? Number.parseInt(e.detail.value) : null;
            onUpdate('dimensions', val);
          }}
        ></nr-input>
        <small class="field-hint">Reduce embedding dimensions (e.g., 256, 512). Leave empty for model default.</small>
      </div>
    ` : ''}

    <div class="config-field">
      <label>Output Variable</label>
      <nr-input
        value=${config.outputVariable || 'embeddings'}
        placeholder="embeddings"
        @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Variable to store embedding results</small>
    </div>
  `;
}
