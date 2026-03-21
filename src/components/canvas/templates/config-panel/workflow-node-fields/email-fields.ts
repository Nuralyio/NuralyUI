/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../workflow-canvas.types.js';
import type { CodeEditorChangeEventDetail } from '../../../../code-editor/code-editor.types.js';

// Import KV secret select component
import '../../../../kv-secret-select/kv-secret-select.component.js';

interface KvEntryLike {
  keyPath: string;
  value?: any;
  isSecret: boolean;
}

/**
 * Open fullscreen HTML editor modal for email body
 */
function openEmailBodyModal(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
) {
  const existingModal = document.querySelector('#email-body-modal');
  existingModal?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'email-body-modal';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: var(--nuraly-color-background, #fff);
    border-radius: 8px;
    width: 85vw;
    height: 85vh;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  `;

  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color, #e0e0e0);
  `;

  const headerTitle = document.createElement('span');
  headerTitle.style.cssText = 'font-size: 16px; font-weight: 500; color: var(--text-primary, #333);';
  headerTitle.textContent = 'Edit Email Body';

  const closeHeaderBtn = document.createElement('nr-button') as any;
  closeHeaderBtn.setAttribute('variant', 'ghost');
  closeHeaderBtn.setAttribute('size', 'small');
  closeHeaderBtn.innerHTML = `
    <nr-icon name="x" size="20"></nr-icon>
  `;

  header.appendChild(headerTitle);
  header.appendChild(closeHeaderBtn);

  const body = document.createElement('div');
  body.style.cssText = `
    flex: 1;
    padding: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `;

  const editorContainer = document.createElement('div');
  editorContainer.style.cssText = `
    flex: 1;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  `;

  const isHtml = (config as any).bodyType === 'html';
  const editor = document.createElement('nr-code-editor') as any;
  editor.setAttribute('language', isHtml ? 'html' : 'plaintext');
  editor.setAttribute('theme', 'vs-dark');
  editor.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    --nuraly-code-editor-height: 100%;
    --nuraly-code-editor-width: 100%;
  `;

  editorContainer.appendChild(editor);
  body.appendChild(editorContainer);

  const footer = document.createElement('div');
  footer.style.cssText = `
    display: flex;
    justify-content: flex-end;
    padding: 12px 20px;
    border-top: 1px solid var(--border-color, #e0e0e0);
    gap: 8px;
  `;

  const closeBtn = document.createElement('nr-button') as any;
  closeBtn.setAttribute('variant', 'secondary');
  closeBtn.textContent = 'Close';

  footer.appendChild(closeBtn);

  modalContent.appendChild(header);
  modalContent.appendChild(body);
  modalContent.appendChild(footer);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    editor.code = (config as any).body || '';
    editor.addEventListener('nr-change', (e: CustomEvent<CodeEditorChangeEventDetail>) => {
      onUpdate('body', e.detail.value);
    });
  });

  const closeModal = () => overlay.remove();

  closeHeaderBtn.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e: MouseEvent) => {
    if (e.target === overlay) closeModal();
  });

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEsc);
    }
  };
  document.addEventListener('keydown', handleEsc);
}

/**
 * Render Email node fields
 */
export function renderEmailFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const isHtml = (config as any).bodyType === 'html';

  const smtpEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('smtp/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    <style>
      .email-body-wrapper {
        position: relative;
        height: 150px;
        border: 1px solid var(--border-color, #e0e0e0);
        border-radius: 4px;
        overflow: hidden;
      }
      .email-body-wrapper nr-code-editor {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        --nuraly-code-editor-height: 100%;
        --nuraly-code-editor-width: 100%;
        --nuraly-code-editor-border-radius: 4px;
        --nuraly-code-editor-border: none;
      }
      .email-editor-toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
      }
    </style>

    <!-- Connection Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
        <span class="config-section-desc">SMTP server credentials from KV secret store</span>
      </div>
      <div class="config-field">
        <label>SMTP Credentials</label>
        <nr-kv-secret-select
          .provider=${'smtp'}
          .entries=${smtpEntries}
          .value=${(config as any).smtpConfigPath || ''}
          placeholder="Select SMTP connection..."
          @value-change=${(e: CustomEvent) => onUpdate('smtpConfigPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">SMTP connection config (host, port, username, password) from the KV secret store</span>
      </div>
    </div>

    <!-- Recipients Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Recipients</span>
        <span class="config-section-desc">Email addresses (use \${variables.name} for dynamic values)</span>
      </div>
      <div class="config-field">
        <label>To</label>
        <nr-input
          value=${(config as any).to || ''}
          placeholder="recipient@example.com"
          @nr-input=${(e: CustomEvent) => onUpdate('to', e.detail.value)}
        ></nr-input>
        <span class="field-description">Primary recipient(s), comma-separated</span>
      </div>
      <div class="config-field">
        <label>CC</label>
        <nr-input
          value=${(config as any).cc || ''}
          placeholder="cc@example.com"
          @nr-input=${(e: CustomEvent) => onUpdate('cc', e.detail.value)}
        ></nr-input>
        <span class="field-description">Carbon copy recipients</span>
      </div>
      <div class="config-field">
        <label>BCC</label>
        <nr-input
          value=${(config as any).bcc || ''}
          placeholder="bcc@example.com"
          @nr-input=${(e: CustomEvent) => onUpdate('bcc', e.detail.value)}
        ></nr-input>
        <span class="field-description">Blind carbon copy recipients</span>
      </div>
    </div>

    <!-- Message Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Message</span>
      </div>
      <div class="config-field">
        <label>Subject</label>
        <nr-input
          value=${(config as any).subject || ''}
          placeholder="Email subject"
          @nr-input=${(e: CustomEvent) => onUpdate('subject', e.detail.value)}
        ></nr-input>
      </div>
      <div class="config-field">
        <label>Body Type</label>
        <nr-select
          .value=${(config as any).bodyType || 'text'}
          .options=${[
            { label: 'Plain Text', value: 'text' },
            { label: 'HTML', value: 'html' }
          ]}
          @nr-change=${(e: CustomEvent) => onUpdate('bodyType', e.detail.value)}
        ></nr-select>
      </div>
      <div class="config-field">
        <label>Body</label>
        <div class="email-editor-toolbar">
          <nr-button variant="secondary" size="small" @click=${() => openEmailBodyModal(config, onUpdate)}>
            <nr-icon name="maximize-2" size="14"></nr-icon>
            Fullscreen
          </nr-button>
        </div>
        <div class="email-body-wrapper">
          <nr-code-editor
            language=${isHtml ? 'html' : 'plaintext'}
            theme="vs-dark"
            .code=${(config as any).body || ''}
            @nr-change=${(e: CustomEvent<CodeEditorChangeEventDetail>) => onUpdate('body', e.detail.value)}
          ></nr-code-editor>
        </div>
        <span class="field-description">Use \${variables.name} or \${input.field} for dynamic content</span>
      </div>
    </div>

    <!-- Options Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Options</span>
      </div>
      <div class="config-field">
        <label>From Name</label>
        <nr-input
          value=${(config as any).fromName || ''}
          placeholder="Sender name (optional)"
          @nr-input=${(e: CustomEvent) => onUpdate('fromName', e.detail.value)}
        ></nr-input>
        <span class="field-description">Override the default sender name</span>
      </div>
      <div class="config-field">
        <label>Reply-To</label>
        <nr-input
          value=${(config as any).replyTo || ''}
          placeholder="reply@example.com"
          @nr-input=${(e: CustomEvent) => onUpdate('replyTo', e.detail.value)}
        ></nr-input>
        <span class="field-description">Email address for replies</span>
      </div>
      <div class="config-field">
        <label>Priority</label>
        <nr-select
          .value=${(config as any).priority || 'normal'}
          .options=${[
            { label: 'Low', value: 'low' },
            { label: 'Normal', value: 'normal' },
            { label: 'High', value: 'high' }
          ]}
          @nr-change=${(e: CustomEvent) => onUpdate('priority', e.detail.value)}
        ></nr-select>
      </div>
    </div>
  `;
}
