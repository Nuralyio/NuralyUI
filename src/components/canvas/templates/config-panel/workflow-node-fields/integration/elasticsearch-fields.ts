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


const ELASTICSEARCH_OPERATIONS = [
  { value: 'search', label: 'Search' },
  { value: 'index', label: 'Index' },
  { value: 'get', label: 'Get' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'bulk', label: 'Bulk' },
];

const ELASTICSEARCH_REFRESH_OPTIONS = [
  { value: 'false', label: 'false (default)' },
  { value: 'true', label: 'true' },
  { value: 'wait_for', label: 'wait_for' },
];

/**
 * Render Elasticsearch node config fields
 */
export function renderElasticsearchFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const operation = (config as any).elasticsearchOperation || 'search';

  const providerEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('elasticsearch/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  const needsDocumentId = ['get', 'update', 'delete'].includes(operation);
  const needsBody = ['search', 'index', 'update', 'bulk'].includes(operation);
  const showSearchOptions = operation === 'search';

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
        <span class="config-section-desc">Elasticsearch cluster connection settings</span>
      </div>
      <div class="config-field">
        <label>Connection URL</label>
        <nr-input
          value=${(config as any).elasticsearchUrl || ''}
          placeholder="https://es.example.com:9200"
          @nr-input=${(e: CustomEvent) => onUpdate('elasticsearchUrl', e.detail.value)}
        ></nr-input>
        <span class="field-description">Elasticsearch cluster URL</span>
      </div>
      <div class="config-field">
        <label>Credentials</label>
        <nr-kv-secret-select
          .provider=${'elasticsearch'}
          .entries=${providerEntries}
          .value=${(config as any).elasticsearchCredentialPath || ''}
          placeholder="Select Elasticsearch credentials..."
          @value-change=${(e: CustomEvent) => onUpdate('elasticsearchCredentialPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">API key, basic auth, or bearer token stored securely in KV.</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Operation</span>
        <span class="config-section-desc">Select the Elasticsearch operation to perform</span>
      </div>
      <div class="config-field">
        <label>Operation</label>
        <nr-select
          value=${operation}
          @nr-change=${(e: CustomEvent) => onUpdate('elasticsearchOperation', e.detail.value)}
        >
          ${ELASTICSEARCH_OPERATIONS.map(o => html`
            <nr-option value=${o.value}>${o.label}</nr-option>
          `)}
        </nr-select>
        <span class="field-description">Action to perform on the Elasticsearch cluster</span>
      </div>
      <div class="config-field">
        <label>Index</label>
        <nr-input
          value=${(config as any).elasticsearchIndex || ''}
          placeholder="my-index or \${input.indexName}"
          @nr-input=${(e: CustomEvent) => onUpdate('elasticsearchIndex', e.detail.value)}
        ></nr-input>
        <span class="field-description">Target index name. Use \${variableName} for dynamic values.</span>
      </div>
    </div>

    ${needsDocumentId ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Document ID</span>
        </div>
        <div class="config-field">
          <label>Document ID</label>
          <nr-input
            value=${(config as any).elasticsearchDocumentId || ''}
            placeholder="doc-123 or \${input.id}"
            @nr-input=${(e: CustomEvent) => onUpdate('elasticsearchDocumentId', e.detail.value)}
          ></nr-input>
          <span class="field-description">Document ID for Get/Update/Delete operations. Use \${variableName} for dynamic values.</span>
        </div>
      </div>
    ` : ''}

    ${needsBody ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">${operation === 'search' ? 'Query Body' : operation === 'bulk' ? 'Bulk Body' : 'Document Body'}</span>
          <span class="config-section-desc">${operation === 'search' ? 'Elasticsearch query DSL (JSON)' : operation === 'bulk' ? 'NDJSON bulk operations' : 'Document content as JSON'}</span>
        </div>
        <div class="config-field">
          <label>${operation === 'search' ? 'Query / Body' : operation === 'bulk' ? 'Bulk Operations' : 'Body'}</label>
          <nr-textarea
            value=${(config as any).elasticsearchQueryBody || ''}
            placeholder=${operation === 'search'
              ? '{"query": {"match": {"title": "search term"}}}'
              : operation === 'bulk'
              ? '{"index": {"_index": "my-index"}}\n{"field": "value"}'
              : '{"field": "value"}'}
            rows="6"
            @nr-input=${(e: CustomEvent) => onUpdate('elasticsearchQueryBody', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">JSON body for the operation. Use \${variableName} for dynamic values.</span>
        </div>
      </div>
    ` : ''}

    ${showSearchOptions ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Search Options</span>
          <span class="config-section-desc">Pagination and search settings</span>
        </div>
        <div class="config-field">
          <label>Size</label>
          <nr-input
            type="number"
            value=${String((config as any).elasticsearchSize ?? 10)}
            placeholder="10"
            @nr-input=${(e: CustomEvent) => onUpdate('elasticsearchSize', parseInt(e.detail.value, 10) || 10)}
          ></nr-input>
          <span class="field-description">Maximum number of results to return</span>
        </div>
        <div class="config-field">
          <label>From</label>
          <nr-input
            type="number"
            value=${String((config as any).elasticsearchFrom ?? 0)}
            placeholder="0"
            @nr-input=${(e: CustomEvent) => onUpdate('elasticsearchFrom', parseInt(e.detail.value, 10) || 0)}
          ></nr-input>
          <span class="field-description">Offset for pagination (starting position)</span>
        </div>
      </div>
    ` : ''}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Options</span>
        <span class="config-section-desc">Additional request options</span>
      </div>
      <div class="config-field">
        <label>Refresh</label>
        <nr-select
          value=${(config as any).elasticsearchRefresh || 'false'}
          @nr-change=${(e: CustomEvent) => onUpdate('elasticsearchRefresh', e.detail.value)}
        >
          ${ELASTICSEARCH_REFRESH_OPTIONS.map(o => html`
            <nr-option value=${o.value}>${o.label}</nr-option>
          `)}
        </nr-select>
        <span class="field-description">Control when changes become visible to search</span>
      </div>
      <div class="config-field">
        <label>Timeout</label>
        <nr-input
          value=${(config as any).elasticsearchTimeout || '30s'}
          placeholder="30s"
          @nr-input=${(e: CustomEvent) => onUpdate('elasticsearchTimeout', e.detail.value)}
        ></nr-input>
        <span class="field-description">Request timeout (e.g., 30s, 1m)</span>
      </div>
      <div class="config-field">
        <label>Routing</label>
        <nr-input
          value=${(config as any).elasticsearchRouting || ''}
          placeholder="Optional routing value"
          @nr-input=${(e: CustomEvent) => onUpdate('elasticsearchRouting', e.detail.value)}
        ></nr-input>
        <span class="field-description">Custom routing value for the request</span>
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
          placeholder="elasticsearchResult"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description">Variable name to store the Elasticsearch response for downstream nodes</span>
      </div>
    </div>
  `;
}
