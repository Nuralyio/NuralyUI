/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';
import { handleFileSelect, formatFileSize } from '../shared/file-utils.js';

/**
 * Render Document Loader node fields
 */
export function renderDocumentLoaderFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const sourceType = config.sourceType || 'text';
  const testDocument = config.testDocument as { filename: string; contentType: string; size: number; base64: string } | undefined;

  return html`
    <div class="config-field">
      <label>Source Type</label>
      <nr-select
        .value=${sourceType}
        .options=${[
          { label: 'Text Content', value: 'text' },
          { label: 'URL', value: 'url' },
          { label: 'Base64 Encoded', value: 'base64' },
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('sourceType', e.detail.value)}
      ></nr-select>
    </div>

    ${sourceType === 'url' ? html`
      <div class="config-field">
        <label>URL Field</label>
        <nr-input
          value=${config.urlField || 'documentUrl'}
          placeholder="documentUrl"
          @nr-input=${(e: CustomEvent) => onUpdate('urlField', e.detail.value)}
        ></nr-input>
        <small class="field-hint">Input field containing the document URL</small>
      </div>

      <div class="config-field">
        <label>Timeout (ms)</label>
        <nr-input
          type="number"
          value=${config.timeout || 30000}
          min="1000"
          max="120000"
          @nr-input=${(e: CustomEvent) => onUpdate('timeout', Number.parseInt(e.detail.value) || 30000)}
        ></nr-input>
      </div>
    ` : html`
      <div class="config-field">
        <label>Content Field</label>
        <nr-input
          value=${config.contentField || 'content'}
          placeholder="content"
          @nr-input=${(e: CustomEvent) => onUpdate('contentField', e.detail.value)}
        ></nr-input>
        <small class="field-hint">Input field containing document content</small>
      </div>
    `}

    <div class="config-field">
      <label>Filename Field</label>
      <nr-input
        value=${config.filenameField || 'filename'}
        placeholder="filename"
        @nr-input=${(e: CustomEvent) => onUpdate('filenameField', e.detail.value)}
      ></nr-input>
      <small class="field-hint">Used for file type detection</small>
    </div>

    <div class="config-field">
      <label>Default File Type</label>
      <nr-select
        .value=${config.defaultType || 'txt'}
        .options=${[
          { label: 'Plain Text (.txt)', value: 'txt' },
          { label: 'Markdown (.md)', value: 'md' },
          { label: 'PDF (.pdf)', value: 'pdf' },
          { label: 'Word (.docx)', value: 'docx' },
          { label: 'HTML (.html)', value: 'html' },
          { label: 'CSV (.csv)', value: 'csv' },
          { label: 'JSON (.json)', value: 'json' },
          { label: 'Excel (.xlsx)', value: 'xlsx' },
        ]}
        @nr-change=${(e: CustomEvent) => onUpdate('defaultType', e.detail.value)}
      ></nr-select>
      <small class="field-hint">Used when filename doesn't have extension</small>
    </div>

    <div class="config-section-divider"></div>
    <div class="config-section-title">Test Data</div>

    <div class="config-field">
      <label>Upload Test Document</label>
      ${testDocument ? html`
        <div class="test-file-info">
          <div class="test-file-details">
            <nr-icon name="file-text" size="small"></nr-icon>
            <div class="test-file-meta">
              <span class="test-file-name">${testDocument.filename}</span>
              <span class="test-file-size">${formatFileSize(testDocument.size)} • ${testDocument.contentType || 'unknown type'}</span>
            </div>
          </div>
          <nr-button variant="ghost" size="small"
            @click=${() => onUpdate('testDocument', undefined)}
            title="Remove test document">
            <nr-icon name="x" size="small"></nr-icon>
          </nr-button>
        </div>
        <nr-button variant="outline" size="small"
          @click=${(e: Event) => {
            e.target?.dispatchEvent(new CustomEvent('test-workflow-request', {
              bubbles: true,
              composed: true,
            }));
          }}>
          <nr-icon name="play" size="small"></nr-icon>
          Test Workflow
        </nr-button>
      ` : html`
        <nr-file-upload
          accept=".txt,.md,.pdf,.docx,.html,.csv,.json,.xlsx"
          tip="Drop document here or click to upload"
          @file-select=${(e: CustomEvent) => handleFileSelect(e, onUpdate, 'testDocument')}
        ></nr-file-upload>
      `}
      <small class="field-hint">Upload a document to use as test input</small>
    </div>
  `;
}
