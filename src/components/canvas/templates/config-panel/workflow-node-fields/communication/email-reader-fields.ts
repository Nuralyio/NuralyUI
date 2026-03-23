/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';
import type { KvEntryLike } from '../shared/kv-credential-utils.js';

// Import KV secret select component
import '../../../../../kv-secret-select/kv-secret-select.component.js';


/**
 * Default IMAP settings per provider
 */
const PROVIDER_DEFAULTS: Record<string, { host: string; port: number; tls: boolean }> = {
  imap: { host: '', port: 993, tls: true },
  gmail: { host: 'imap.gmail.com', port: 993, tls: true },
  outlook: { host: 'outlook.office365.com', port: 993, tls: true },
  yahoo: { host: 'imap.mail.yahoo.com', port: 993, tls: true },
};

/**
 * Render Email Reader node fields
 */
export function renderEmailReaderFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const provider = (config as any).provider || 'imap';
  const operation = (config as any).operation || 'LIST';
  const showImapSettings = provider === 'imap';
  const showSearchQuery = operation === 'SEARCH';
  const showMessageId = ['READ', 'MARK_READ', 'MARK_UNREAD', 'MOVE', 'DELETE'].includes(operation);
  const showTargetFolder = operation === 'MOVE';
  const showLimit = ['LIST', 'SEARCH'].includes(operation);
  const showDateFilters = ['LIST', 'SEARCH'].includes(operation);

  const emailEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('email_reader/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    <!-- Provider Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
        <span class="config-section-desc">Email provider and authentication</span>
      </div>
      <div class="config-field">
        <label>Provider</label>
        <nr-select
          .value=${provider}
          .options=${[
            { label: 'IMAP (Generic)', value: 'imap' },
            { label: 'Gmail', value: 'gmail' },
            { label: 'Outlook / Office 365', value: 'outlook' },
            { label: 'Yahoo Mail', value: 'yahoo' },
          ]}
          @nr-change=${(e: CustomEvent) => {
            const newProvider = e.detail.value;
            onUpdate('provider', newProvider);
            const defaults = PROVIDER_DEFAULTS[newProvider];
            if (defaults && newProvider !== 'imap') {
              onUpdate('host', defaults.host);
              onUpdate('port', defaults.port);
              onUpdate('tls', defaults.tls);
            }
          }}
        ></nr-select>
      </div>

      <div class="config-field">
        <label>Credentials</label>
        <nr-kv-secret-select
          .provider=${'email_reader'}
          .entries=${emailEntries}
          .value=${(config as any).credentialPath || ''}
          placeholder=${provider === 'gmail'
            ? 'Select Gmail OAuth token...'
            : provider === 'outlook'
            ? 'Select Outlook credentials...'
            : provider === 'yahoo'
            ? 'Select Yahoo credentials...'
            : 'Select IMAP credentials...'}
          @value-change=${(e: CustomEvent) => onUpdate('credentialPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">${provider === 'gmail'
          ? 'Gmail OAuth2 credentials from KV secret store (username + oauth_token)'
          : provider === 'outlook'
          ? 'Outlook/Office 365 credentials from KV secret store (username + password)'
          : provider === 'yahoo'
          ? 'Yahoo Mail credentials from KV secret store (username + app password)'
          : 'IMAP credentials from KV secret store (username + password)'}</span>
      </div>

      ${showImapSettings ? html`
        <div class="config-field">
          <label>Host</label>
          <nr-input
            value=${(config as any).host || ''}
            placeholder="imap.example.com"
            @nr-input=${(e: CustomEvent) => onUpdate('host', e.detail.value)}
          ></nr-input>
        </div>
        <div class="config-field">
          <label>Port</label>
          <nr-input
            type="number"
            value=${(config as any).port || 993}
            placeholder="993"
            @nr-input=${(e: CustomEvent) => onUpdate('port', Number.parseInt(e.detail.value) || 993)}
          ></nr-input>
        </div>
        <div class="config-field">
          <label>TLS</label>
          <nr-checkbox
            ?checked=${(config as any).tls !== false}
            @nr-change=${(e: CustomEvent) => onUpdate('tls', e.detail.checked)}
          ></nr-checkbox>
          <span class="field-description">Use SSL/TLS encryption</span>
        </div>
      ` : ''}

      ${provider === 'outlook' ? html`
        <div class="config-field">
          <span class="field-description">Connects to outlook.office365.com:993 with TLS</span>
        </div>
      ` : ''}

      ${provider === 'yahoo' ? html`
        <div class="config-field">
          <span class="field-description">Connects to imap.mail.yahoo.com:993 with TLS. Requires an app-specific password.</span>
        </div>
      ` : ''}
    </div>

    <!-- Operation Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Operation</span>
      </div>
      <div class="config-field">
        <label>Action</label>
        <nr-select
          .value=${operation}
          .options=${[
            { label: 'List Emails', value: 'LIST' },
            { label: 'Read Email', value: 'READ' },
            { label: 'Search Emails', value: 'SEARCH' },
            { label: 'Mark as Read', value: 'MARK_READ' },
            { label: 'Mark as Unread', value: 'MARK_UNREAD' },
            { label: 'Move Email', value: 'MOVE' },
            { label: 'Delete Email', value: 'DELETE' },
          ]}
          @nr-change=${(e: CustomEvent) => onUpdate('operation', e.detail.value)}
        ></nr-select>
      </div>
      <div class="config-field">
        <label>Folder</label>
        <nr-input
          value=${(config as any).folder || 'INBOX'}
          placeholder="INBOX"
          @nr-input=${(e: CustomEvent) => onUpdate('folder', e.detail.value)}
        ></nr-input>
        <span class="field-description">INBOX, SENT, DRAFTS, TRASH, or custom folder</span>
      </div>

      ${showSearchQuery ? html`
        <div class="config-field">
          <label>Search Query</label>
          <nr-input
            value=${(config as any).searchQuery || ''}
            placeholder="subject:invoice or from:sender@example.com"
            @nr-input=${(e: CustomEvent) => onUpdate('searchQuery', e.detail.value)}
          ></nr-input>
          <span class="field-description">Prefix with subject: or from: for targeted search</span>
        </div>
      ` : ''}

      ${showMessageId ? html`
        <div class="config-field">
          <label>Message ID</label>
          <nr-input
            type="number"
            value=${(config as any).messageId || ''}
            placeholder="Message number"
            @nr-input=${(e: CustomEvent) => onUpdate('messageId', Number.parseInt(e.detail.value) || 0)}
          ></nr-input>
          <span class="field-description">Message number in the folder</span>
        </div>
        <div class="config-field">
          <label>
            <nr-checkbox
              ?checked=${(config as any).useUid || false}
              @nr-change=${(e: CustomEvent) => onUpdate('useUid', e.detail.checked)}
            ></nr-checkbox>
            Fetch by UID
          </label>
          <span class="field-description">Use unique message UID instead of sequence number</span>
        </div>
      ` : ''}

      ${showTargetFolder ? html`
        <div class="config-field">
          <label>Target Folder</label>
          <nr-input
            value=${(config as any).targetFolder || ''}
            placeholder="Archive"
            @nr-input=${(e: CustomEvent) => onUpdate('targetFolder', e.detail.value)}
          ></nr-input>
          <span class="field-description">Folder to move the email to</span>
        </div>
      ` : ''}

      ${showLimit ? html`
        <div class="config-field">
          <label>Limit</label>
          <nr-input
            type="number"
            value=${(config as any).limit || 10}
            placeholder="10"
            @nr-input=${(e: CustomEvent) => onUpdate('limit', Number.parseInt(e.detail.value) || 10)}
          ></nr-input>
          <span class="field-description">Maximum number of messages to return</span>
        </div>
      ` : ''}

      ${showDateFilters ? html`
        <div class="config-field">
          <label>Since Date</label>
          <nr-input
            type="date"
            value=${(config as any).sinceDate || ''}
            @nr-input=${(e: CustomEvent) => onUpdate('sinceDate', e.detail.value)}
          ></nr-input>
          <span class="field-description">Only return emails received on or after this date</span>
        </div>
        <div class="config-field">
          <label>Before Date</label>
          <nr-input
            type="date"
            value=${(config as any).beforeDate || ''}
            @nr-input=${(e: CustomEvent) => onUpdate('beforeDate', e.detail.value)}
          ></nr-input>
          <span class="field-description">Only return emails received before this date</span>
        </div>
      ` : ''}
    </div>

    <!-- Options Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Options</span>
      </div>
      <div class="config-field">
        <label>
          <nr-checkbox
            ?checked=${(config as any).includeAttachments || false}
            @nr-change=${(e: CustomEvent) => onUpdate('includeAttachments', e.detail.checked)}
          ></nr-checkbox>
          Include Attachments
        </label>
        <span class="field-description">Download and include attachment content (base64 encoded)</span>
      </div>
      ${showLimit ? html`
        <div class="config-field">
          <label>
            <nr-checkbox
              ?checked=${(config as any).markAsReadOnFetch || false}
              @nr-change=${(e: CustomEvent) => onUpdate('markAsReadOnFetch', e.detail.checked)}
            ></nr-checkbox>
            Mark as Read on Fetch
          </label>
          <span class="field-description">Automatically mark fetched emails as read</span>
        </div>
      ` : nothing}
    </div>

    <!-- Output Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Output</span>
      </div>
      <div class="config-field">
        <label>Output Variable</label>
        <nr-input
          value=${(config as any).outputVariable || ''}
          placeholder="emails"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description"
          >Variable name to store fetched email data</span
        >
      </div>
    </div>
  `;
}
