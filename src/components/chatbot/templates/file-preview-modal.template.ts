/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult, nothing } from 'lit';
import { until } from 'lit/directives/until.js';
import { ChatbotFile } from '../chatbot.types.js';

export interface FilePreviewModalTemplateData {
  isOpen: boolean;
  file: ChatbotFile | null;
}

export interface FilePreviewModalTemplateHandlers {
  onClose: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

const TEXT_MIME_PREFIXES = ['text/'];
const TEXT_MIME_EXACT = new Set([
  'application/json',
  'application/xml',
  'application/yaml',
  'application/x-yaml',
  'application/sql',
  'application/javascript',
  'application/typescript',
  'application/x-sh',
  'application/x-httpd-php',
  'application/x-www-form-urlencoded',
  'application/graphql',
  'application/ld+json',
  'image/svg+xml',
]);
const TEXT_EXTENSIONS = new Set([
  'json','xml','yaml','yml','md','markdown','csv','tsv','sql','toml','ini','conf','env','log','txt',
  'ts','tsx','js','jsx','mjs','cjs','py','rb','go','rs','java','kt','swift','c','h','cpp','hpp',
  'sh','bash','zsh','fish','ps1','bat','make','dockerfile','tf','hcl',
  'css','scss','sass','less','html','htm','svg','vue','svelte',
  'docflow','graphql','gql','proto',
]);
const MAX_TEXT_BYTES = 512 * 1024; // 512 KB

function isTextual(file: ChatbotFile): boolean {
  const mime = (file.mimeType || '').toLowerCase();
  if (TEXT_MIME_EXACT.has(mime)) return true;
  for (const p of TEXT_MIME_PREFIXES) if (mime.startsWith(p)) return true;
  const dot = file.name.lastIndexOf('.');
  if (dot >= 0 && dot < file.name.length - 1) {
    const ext = file.name.slice(dot + 1).toLowerCase();
    if (TEXT_EXTENSIONS.has(ext)) return true;
  }
  return false;
}

const textCache = new Map<string, Promise<{text: string; truncated: boolean} | {error: string}>>();

function loadTextContent(file: ChatbotFile): Promise<{text: string; truncated: boolean} | {error: string}> {
  const key = file.id || file.url || file.name;
  const cached = textCache.get(key);
  if (cached) return cached;
  const url = file.url || file.previewUrl;
  if (!url) {
    const p = Promise.resolve({error: 'no-url'});
    textCache.set(key, p);
    return p;
  }
  const p = fetch(url)
    .then(async (res) => {
      if (!res.ok) return {error: `HTTP ${res.status}`};
      const blob = await res.blob();
      const truncated = blob.size > MAX_TEXT_BYTES;
      const slice = truncated ? blob.slice(0, MAX_TEXT_BYTES) : blob;
      const text = await slice.text();
      return {text, truncated};
    })
    .catch((err) => ({error: err?.message || 'fetch-failed'}));
  textCache.set(key, p);
  return p;
}

function renderTextualContent(file: ChatbotFile): TemplateResult {
  const dot = file.name.lastIndexOf('.');
  const ext = dot >= 0 ? file.name.slice(dot + 1).toLowerCase() : '';
  const placeholder = html`
    <div style="padding: 1rem; color: #6b7280; font: 13px ui-monospace,monospace;">Loading…</div>
  `;
  const content = loadTextContent(file).then((r) => {
    if ('error' in r) {
      return html`
        <div style="padding: 1rem; color: #b91c1c; font: 13px sans-serif;">
          Unable to load file content (${r.error}).
          ${file.url ? html`<br><br><nr-button type="primary" @click=${() => window.open(file.url, '_blank')}>Open File</nr-button>` : nothing}
        </div>
      `;
    }
    return html`
      ${r.truncated ? html`
        <div style="padding: 6px 12px; background: #fef3c7; color: #92400e; font: 12px sans-serif; border-bottom: 1px solid #fde68a;">
          File preview truncated at ${formatFileSize(MAX_TEXT_BYTES)} of ${formatFileSize(file.size)}.
          ${file.url ? html`<a href="${file.url}" target="_blank" style="color: inherit; text-decoration: underline;">Open full file</a>` : nothing}
        </div>
      ` : nothing}
      <pre data-language="${ext}" part="file-preview-text" style="margin: 0; padding: 12px 16px; flex: 1; overflow: auto; font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre; background: #fafafa; color: #1f2937;"><code>${r.text}</code></pre>
    `;
  });
  return html`${until(content, placeholder)}`;
}

/**
 * Renders file preview modal
 */
export function renderFilePreviewModal(
  data: FilePreviewModalTemplateData,
  handlers: FilePreviewModalTemplateHandlers
): TemplateResult | typeof nothing {
  if (!data.isOpen || !data.file) {
    return nothing;
  }

  const file = data.file;
  const isImage = file.mimeType.startsWith('image/') && file.mimeType !== 'image/svg+xml';
  const isPDF = file.mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isTextual_ = !isImage && !isPDF && isTextual(file);

  return html`
    <nr-modal
      .open=${data.isOpen}
      size="large"
      title="${file.name}"
      @modal-close=${handlers.onClose}
    >
      <div style="width: 100%; height: 75vh; display: flex; flex-direction: column; align-items: stretch; justify-content: stretch;">
        ${isImage && (file.url || file.previewUrl) ? html`
          <img
            src="${file.url || file.previewUrl}"
            alt="${file.name}"
            style="max-width: 100%; max-height: 100%; object-fit: contain; align-self: center;"
          />
        ` : isPDF && file.url ? html`
          <div style="width: 100%; height: 100%; position: relative;">
            <nr-document
              .src="${file.url}"
              .type="${'pdf'}"
              .width="${'100%'}"
              .height="${'100%'}"
              .block="${true}"
              style="width: 100%; height: 100%; display: block;"
            ></nr-document>
          </div>
        ` : isTextual_ ? renderTextualContent(file) : html`
          <div style="text-align: center; padding: 2rem; align-self: center;">
            <nr-icon name="file" size="xlarge" style="margin-bottom: 1rem;"></nr-icon>
            <p style="font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem;">${file.name}</p>
            <p style="color: #9ca3af; margin-bottom: 1.5rem;">
              ${formatFileSize(file.size)}
            </p>
            ${file.url ? html`
              <nr-button
                type="primary"
                @click=${() => window.open(file.url, '_blank')}
              >
                Open File
              </nr-button>
            ` : nothing}
          </div>
        `}
      </div>
    </nr-modal>
  `;
}
