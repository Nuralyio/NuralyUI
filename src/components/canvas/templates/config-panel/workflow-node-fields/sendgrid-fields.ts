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

const RESOURCE_OPTIONS = [
  { value: 'mail', label: 'Mail' },
  { value: 'contact', label: 'Contact' },
  { value: 'list', label: 'List' },
];

const MAIL_OPERATIONS = [
  { value: 'send_email', label: 'Send Email' },
  { value: 'send_template', label: 'Send Template Email' },
];

const CONTACT_OPERATIONS = [
  { value: 'add_contact', label: 'Create/Update Contact' },
  { value: 'remove_contact', label: 'Delete Contact' },
  { value: 'get_contact', label: 'Get Contact' },
  { value: 'get_all_contacts', label: 'Get All Contacts' },
];

const LIST_OPERATIONS = [
  { value: 'create_list', label: 'Create List' },
  { value: 'delete_list', label: 'Delete List' },
  { value: 'get_list', label: 'Get List' },
  { value: 'get_all_lists', label: 'Get All Lists' },
  { value: 'update_list', label: 'Update List' },
];

/**
 * Render SendGrid node fields
 */
export function renderSendgridFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: any) => void,
): TemplateResult {
  const sendgridEntries = (kvEntries || []).filter(e =>
    e.keyPath.startsWith('sendgrid/'),
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  const resource = (config as any).resource || 'mail';
  const operation = (config as any).operation || 'send_email';
  const isTemplate = operation === 'send_template';
  const isMail = resource === 'mail';
  const isContact = resource === 'contact';
  const isList = resource === 'list';

  const operationOptions =
    resource === 'contact'
      ? CONTACT_OPERATIONS
      : resource === 'list'
        ? LIST_OPERATIONS
        : MAIL_OPERATIONS;

  return html`
    <!-- Connection Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
      </div>
      <div class="config-field">
        <label>API Key</label>
        <nr-kv-secret-select
          .provider=${'sendgrid'}
          .entries=${sendgridEntries}
          .value=${(config as any).apiKeyPath || ''}
          placeholder="Select SendGrid API key..."
          @value-change=${(e: CustomEvent) => onUpdate('apiKeyPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">SendGrid API key from the KV secret store</span>
      </div>
    </div>

    <!-- Resource & Operation Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Operation</span>
      </div>
      <div class="config-field">
        <label>Resource</label>
        <nr-select
          .value=${resource}
          .options=${RESOURCE_OPTIONS}
          @nr-change=${(e: CustomEvent) => {
            onUpdate('resource', e.detail.value);
            // Reset operation to first option of new resource
            const ops =
              e.detail.value === 'contact'
                ? CONTACT_OPERATIONS
                : e.detail.value === 'list'
                  ? LIST_OPERATIONS
                  : MAIL_OPERATIONS;
            onUpdate('operation', ops[0].value);
          }}
        ></nr-select>
        <span class="field-description">SendGrid resource to interact with</span>
      </div>
      <div class="config-field">
        <label>Operation</label>
        <nr-select
          .value=${operation}
          .options=${operationOptions}
          @nr-change=${(e: CustomEvent) => onUpdate('operation', e.detail.value)}
        ></nr-select>
        <span class="field-description">Action to perform on the resource</span>
      </div>
    </div>

    <!-- Sender Section (for mail operations) -->
    ${isMail
      ? html`
          <div class="config-section">
            <div class="config-section-header">
              <span class="config-section-title">Sender</span>
            </div>
            <div class="config-field">
              <label>From Email</label>
              <nr-input
                value=${(config as any).fromEmail || ''}
                placeholder="sender@example.com"
                @nr-input=${(e: CustomEvent) => onUpdate('fromEmail', e.detail.value)}
              ></nr-input>
              <span class="field-description">Verified sender email address</span>
            </div>
            <div class="config-field">
              <label>From Name</label>
              <nr-input
                value=${(config as any).fromName || ''}
                placeholder="Sender Name"
                @nr-input=${(e: CustomEvent) => onUpdate('fromName', e.detail.value)}
              ></nr-input>
              <span class="field-description">Display name for the sender (optional)</span>
            </div>
          </div>
        `
      : nothing}

    <!-- Recipients Section (for mail operations) -->
    ${isMail
      ? html`
          <div class="config-section">
            <div class="config-section-header">
              <span class="config-section-title">Recipients</span>
              <span class="config-section-desc"
                >Email addresses (use \${variables.name} for dynamic values)</span
              >
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
            </div>
            <div class="config-field">
              <label>BCC</label>
              <nr-input
                value=${(config as any).bcc || ''}
                placeholder="bcc@example.com"
                @nr-input=${(e: CustomEvent) => onUpdate('bcc', e.detail.value)}
              ></nr-input>
            </div>
            <div class="config-field">
              <label>Reply-To</label>
              <nr-input
                value=${(config as any).replyTo || ''}
                placeholder="reply@example.com"
                @nr-input=${(e: CustomEvent) => onUpdate('replyTo', e.detail.value)}
              ></nr-input>
            </div>
          </div>
        `
      : nothing}

    <!-- Message Section (for send_email) -->
    ${isMail && !isTemplate
      ? html`
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
              <label>Content Type</label>
              <nr-select
                .value=${(config as any).contentType || 'text/html'}
                .options=${[
                  { label: 'HTML', value: 'text/html' },
                  { label: 'Plain Text', value: 'text/plain' },
                ]}
                @nr-change=${(e: CustomEvent) => onUpdate('contentType', e.detail.value)}
              ></nr-select>
            </div>
            <div class="config-field">
              <label>Body</label>
              <nr-textarea
                value=${(config as any).body || ''}
                placeholder="Email body content"
                rows="6"
                @nr-input=${(e: CustomEvent) => onUpdate('body', e.detail.value)}
              ></nr-textarea>
              <span class="field-description"
                >Use \${variables.name} or \${input.field} for dynamic content</span
              >
            </div>
          </div>
        `
      : nothing}

    <!-- Template Section (for send_template) -->
    ${isTemplate
      ? html`
          <div class="config-section">
            <div class="config-section-header">
              <span class="config-section-title">Template</span>
            </div>
            <div class="config-field">
              <label>Subject</label>
              <nr-input
                value=${(config as any).subject || ''}
                placeholder="Email subject (overrides template subject)"
                @nr-input=${(e: CustomEvent) => onUpdate('subject', e.detail.value)}
              ></nr-input>
              <span class="field-description"
                >Optional — overrides the template's subject line</span
              >
            </div>
            <div class="config-field">
              <label>Template ID</label>
              <nr-input
                value=${(config as any).templateId || ''}
                placeholder="d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                @nr-input=${(e: CustomEvent) => onUpdate('templateId', e.detail.value)}
              ></nr-input>
              <span class="field-description">SendGrid dynamic template ID</span>
            </div>
            <div class="config-field">
              <label>Dynamic Template Data</label>
              <nr-textarea
                value=${(config as any).dynamicTemplateData || ''}
                placeholder='{"first_name": "John", "order_id": "12345"}'
                rows="4"
                @nr-input=${(e: CustomEvent) => onUpdate('dynamicTemplateData', e.detail.value)}
              ></nr-textarea>
              <span class="field-description"
                >JSON object with Handlebars variables for the template</span
              >
            </div>
          </div>
        `
      : nothing}

    <!-- Contact Section (for contact operations) -->
    ${isContact
      ? html`
          <div class="config-section">
            <div class="config-section-header">
              <span class="config-section-title">Contact</span>
            </div>
            <div class="config-field">
              <label>Email</label>
              <nr-input
                value=${(config as any).contactEmail || ''}
                placeholder="contact@example.com"
                @nr-input=${(e: CustomEvent) => onUpdate('contactEmail', e.detail.value)}
              ></nr-input>
              <span class="field-description">Contact email address</span>
            </div>
            ${operation === 'add_contact'
              ? html`
                  <div class="config-field">
                    <label>First Name</label>
                    <nr-input
                      value=${(config as any).contactFirstName || ''}
                      placeholder="John"
                      @nr-input=${(e: CustomEvent) =>
                        onUpdate('contactFirstName', e.detail.value)}
                    ></nr-input>
                  </div>
                  <div class="config-field">
                    <label>Last Name</label>
                    <nr-input
                      value=${(config as any).contactLastName || ''}
                      placeholder="Doe"
                      @nr-input=${(e: CustomEvent) =>
                        onUpdate('contactLastName', e.detail.value)}
                    ></nr-input>
                  </div>
                  <div class="config-field">
                    <label>List IDs</label>
                    <nr-input
                      value=${(config as any).listIds || ''}
                      placeholder="list-id-1, list-id-2"
                      @nr-input=${(e: CustomEvent) => onUpdate('listIds', e.detail.value)}
                    ></nr-input>
                    <span class="field-description"
                      >Comma-separated list IDs to add the contact to (optional)</span
                    >
                  </div>
                `
              : nothing}
            ${operation === 'get_contact'
              ? html`
                  <div class="config-field">
                    <label>Contact ID</label>
                    <nr-input
                      value=${(config as any).contactId || ''}
                      placeholder="Contact ID"
                      @nr-input=${(e: CustomEvent) => onUpdate('contactId', e.detail.value)}
                    ></nr-input>
                    <span class="field-description"
                      >SendGrid contact ID (use email or ID)</span
                    >
                  </div>
                `
              : nothing}
            ${operation === 'get_all_contacts'
              ? html`
                  <div class="config-field">
                    <label>Limit</label>
                    <nr-input
                      value=${(config as any).limit || ''}
                      placeholder="50"
                      @nr-input=${(e: CustomEvent) => onUpdate('limit', e.detail.value)}
                    ></nr-input>
                    <span class="field-description"
                      >Maximum number of contacts to return</span
                    >
                  </div>
                `
              : nothing}
          </div>
        `
      : nothing}

    <!-- List Section (for list operations) -->
    ${isList
      ? html`
          <div class="config-section">
            <div class="config-section-header">
              <span class="config-section-title">List</span>
            </div>
            ${operation === 'create_list' || operation === 'update_list'
              ? html`
                  <div class="config-field">
                    <label>List Name</label>
                    <nr-input
                      value=${(config as any).listName || ''}
                      placeholder="My Contact List"
                      @nr-input=${(e: CustomEvent) => onUpdate('listName', e.detail.value)}
                    ></nr-input>
                    <span class="field-description">Name of the contact list</span>
                  </div>
                `
              : nothing}
            ${operation === 'delete_list' ||
            operation === 'get_list' ||
            operation === 'update_list'
              ? html`
                  <div class="config-field">
                    <label>List ID</label>
                    <nr-input
                      value=${(config as any).listId || ''}
                      placeholder="List ID"
                      @nr-input=${(e: CustomEvent) => onUpdate('listId', e.detail.value)}
                    ></nr-input>
                    <span class="field-description">SendGrid contact list ID</span>
                  </div>
                `
              : nothing}
          </div>
        `
      : nothing}

    <!-- Additional Options Section (for mail operations) -->
    ${isMail
      ? html`
          <div class="config-section">
            <div class="config-section-header">
              <span class="config-section-title">Options</span>
            </div>
            <div class="config-field">
              <label>Categories</label>
              <nr-input
                value=${(config as any).categories || ''}
                placeholder="transactional, order-confirmation"
                @nr-input=${(e: CustomEvent) => onUpdate('categories', e.detail.value)}
              ></nr-input>
              <span class="field-description"
                >Comma-separated categories for analytics tracking</span
              >
            </div>
            <div class="config-field">
              <label>Attachments</label>
              <nr-input
                value=${(config as any).attachments || ''}
                placeholder="\${variables.fileData}"
                @nr-input=${(e: CustomEvent) => onUpdate('attachments', e.detail.value)}
              ></nr-input>
              <span class="field-description"
                >Variable reference to attachment data (JSON array of {filename, content,
                type})</span
              >
            </div>
            <div class="config-field">
              <label>Send At</label>
              <nr-input
                value=${(config as any).sendAt || ''}
                placeholder="2025-01-15T10:00:00Z"
                @nr-input=${(e: CustomEvent) => onUpdate('sendAt', e.detail.value)}
              ></nr-input>
              <span class="field-description"
                >Schedule delivery time (ISO 8601 / Unix timestamp)</span
              >
            </div>
            <div class="config-field">
              <label>IP Pool Name</label>
              <nr-input
                value=${(config as any).ipPoolName || ''}
                placeholder="marketing"
                @nr-input=${(e: CustomEvent) => onUpdate('ipPoolName', e.detail.value)}
              ></nr-input>
              <span class="field-description">Send from a specific IP pool (optional)</span>
            </div>
            <div class="config-field">
              <label>Custom Headers</label>
              <nr-textarea
                value=${(config as any).customHeaders || ''}
                placeholder='{"X-Custom-Header": "value"}'
                rows="3"
                @nr-input=${(e: CustomEvent) => onUpdate('customHeaders', e.detail.value)}
              ></nr-textarea>
              <span class="field-description"
                >JSON object of additional email headers (optional)</span
              >
            </div>
          </div>
        `
      : nothing}

    <!-- Output Section -->
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Output</span>
      </div>
      <div class="config-field">
        <label>Output Variable</label>
        <nr-input
          value=${(config as any).outputVariable || ''}
          placeholder="sendgridResult"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description"
          >Variable name to store the SendGrid API response</span
        >
      </div>
    </div>
  `;
}
