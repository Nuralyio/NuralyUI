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


const RESOURCES = [
  { value: 'TICKET', label: 'Ticket' },
  { value: 'USER', label: 'User' },
  { value: 'ORGANIZATION', label: 'Organization' },
  { value: 'TICKET_COMMENT', label: 'Ticket Comment' },
  { value: 'SATISFACTION_RATING', label: 'Satisfaction Rating' },
  { value: 'GROUP', label: 'Group' },
];

const OPERATIONS = [
  { value: 'CREATE', label: 'Create' },
  { value: 'READ', label: 'Read' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'LIST', label: 'List' },
  { value: 'SEARCH', label: 'Search' },
];

const PRIORITIES = [
  { value: '', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const STATUSES = [
  { value: '', label: 'None' },
  { value: 'new', label: 'New' },
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'hold', label: 'Hold' },
  { value: 'solved', label: 'Solved' },
  { value: 'closed', label: 'Closed' },
];

const TICKET_TYPES = [
  { value: '', label: 'None' },
  { value: 'question', label: 'Question' },
  { value: 'incident', label: 'Incident' },
  { value: 'problem', label: 'Problem' },
  { value: 'task', label: 'Task' },
];

const SORT_FIELDS = [
  { value: '', label: 'Default' },
  { value: 'created_at', label: 'Created At' },
  { value: 'updated_at', label: 'Updated At' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
];

const SORT_ORDERS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

/**
 * Render Zendesk node config fields
 */
export function renderZendeskFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const resource = (config as any).zendeskResource || 'TICKET';
  const operation = (config as any).zendeskOperation || 'LIST';
  const isTicket = resource === 'TICKET' || resource === 'TICKET_COMMENT';
  const needsId = ['READ', 'UPDATE', 'DELETE'].includes(operation);
  const isSearch = operation === 'SEARCH';
  const isList = operation === 'LIST';
  const isListOrSearch = isList || isSearch;
  const isCreateOrUpdate = ['CREATE', 'UPDATE'].includes(operation);

  const providerEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('zendesk/')
  );

  const handleCreateEntry = onCreateKvEntry
    ? (e: CustomEvent) => onCreateKvEntry(e.detail)
    : undefined;

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
        <span class="config-section-desc">Zendesk API authentication</span>
      </div>
      <div class="config-field">
        <label>Subdomain</label>
        <nr-input
          value=${(config as any).zendeskSubdomain || ''}
          placeholder="mycompany"
          @nr-input=${(e: CustomEvent) => onUpdate('zendeskSubdomain', e.detail.value)}
        ></nr-input>
        <span class="field-description">Your Zendesk subdomain (e.g., "mycompany" for mycompany.zendesk.com)</span>
      </div>
      <div class="config-field">
        <label>Credentials</label>
        <nr-kv-secret-select
          .provider=${'zendesk'}
          .entries=${providerEntries}
          .value=${(config as any).zendeskCredentialPath || ''}
          placeholder="Select Zendesk credentials..."
          @value-change=${(e: CustomEvent) => onUpdate('zendeskCredentialPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">KV secret containing Zendesk email and API token</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Operation</span>
        <span class="config-section-desc">What to do with the resource</span>
      </div>
      <div class="config-field">
        <label>Resource</label>
        <nr-select
          value=${resource}
          @nr-change=${(e: CustomEvent) => onUpdate('zendeskResource', e.detail.value)}
        >
          ${RESOURCES.map(r => html`
            <nr-option value=${r.value}>${r.label}</nr-option>
          `)}
        </nr-select>
      </div>
      <div class="config-field">
        <label>Operation</label>
        <nr-select
          value=${operation}
          @nr-change=${(e: CustomEvent) => onUpdate('zendeskOperation', e.detail.value)}
        >
          ${OPERATIONS.map(o => html`
            <nr-option value=${o.value}>${o.label}</nr-option>
          `)}
        </nr-select>
      </div>
      ${needsId ? html`
        <div class="config-field">
          <label>Resource ID</label>
          <nr-input
            value=${(config as any).zendeskResourceId || ''}
            placeholder="12345"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskResourceId', e.detail.value)}
          ></nr-input>
          <span class="field-description">ID of the resource to ${operation.toLowerCase()}</span>
        </div>
      ` : nothing}
      ${isSearch ? html`
        <div class="config-field">
          <label>Search Query</label>
          <nr-textarea
            value=${(config as any).zendeskSearchQuery || ''}
            placeholder="type:ticket status:open priority:high"
            rows="3"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskSearchQuery', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Zendesk search syntax</span>
        </div>
      ` : nothing}
    </div>

    ${isListOrSearch ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Pagination & Sorting</span>
        </div>
        <div class="config-field">
          <label>Limit</label>
          <nr-input
            type="number"
            value=${String((config as any).zendeskLimit ?? 100)}
            placeholder="100"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskLimit', parseInt(e.detail.value, 10) || 100)}
          ></nr-input>
          <span class="field-description">Maximum number of results to return</span>
        </div>
        <div class="config-field">
          <label>Sort By</label>
          <nr-select
            value=${(config as any).zendeskSortBy || ''}
            @nr-change=${(e: CustomEvent) => onUpdate('zendeskSortBy', e.detail.value)}
          >
            ${SORT_FIELDS.map(s => html`
              <nr-option value=${s.value}>${s.label}</nr-option>
            `)}
          </nr-select>
        </div>
        <div class="config-field">
          <label>Sort Order</label>
          <nr-select
            value=${(config as any).zendeskSortOrder || 'asc'}
            @nr-change=${(e: CustomEvent) => onUpdate('zendeskSortOrder', e.detail.value)}
          >
            ${SORT_ORDERS.map(s => html`
              <nr-option value=${s.value}>${s.label}</nr-option>
            `)}
          </nr-select>
        </div>
      </div>
    ` : nothing}

    ${isCreateOrUpdate && isTicket ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Ticket Fields</span>
        </div>
        <div class="config-field">
          <label>Subject</label>
          <nr-input
            value=${(config as any).zendeskSubject || ''}
            placeholder="Ticket subject"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskSubject', e.detail.value)}
          ></nr-input>
        </div>
        <div class="config-field">
          <label>Description</label>
          <nr-textarea
            value=${(config as any).zendeskDescription || ''}
            placeholder="Ticket description"
            rows="3"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskDescription', e.detail.value)}
          ></nr-textarea>
        </div>
        <div class="config-field">
          <label>Type</label>
          <nr-select
            value=${(config as any).zendeskType || ''}
            @nr-change=${(e: CustomEvent) => onUpdate('zendeskType', e.detail.value)}
          >
            ${TICKET_TYPES.map(t => html`
              <nr-option value=${t.value}>${t.label}</nr-option>
            `)}
          </nr-select>
          <span class="field-description">Ticket type classification</span>
        </div>
        <div class="config-field">
          <label>Priority</label>
          <nr-select
            value=${(config as any).zendeskPriority || ''}
            @nr-change=${(e: CustomEvent) => onUpdate('zendeskPriority', e.detail.value)}
          >
            ${PRIORITIES.map(p => html`
              <nr-option value=${p.value}>${p.label}</nr-option>
            `)}
          </nr-select>
        </div>
        <div class="config-field">
          <label>Status</label>
          <nr-select
            value=${(config as any).zendeskStatus || ''}
            @nr-change=${(e: CustomEvent) => onUpdate('zendeskStatus', e.detail.value)}
          >
            ${STATUSES.map(s => html`
              <nr-option value=${s.value}>${s.label}</nr-option>
            `)}
          </nr-select>
        </div>
        <div class="config-field">
          <label>Requester Email</label>
          <nr-input
            value=${(config as any).zendeskRequesterEmail || ''}
            placeholder="requester@example.com"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskRequesterEmail', e.detail.value)}
          ></nr-input>
          <span class="field-description">Email of the ticket requester</span>
        </div>
        <div class="config-field">
          <label>Requester Name</label>
          <nr-input
            value=${(config as any).zendeskRequesterName || ''}
            placeholder="John Doe"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskRequesterName', e.detail.value)}
          ></nr-input>
          <span class="field-description">Display name of the ticket requester (optional)</span>
        </div>
        <div class="config-field">
          <label>Assignee ID</label>
          <nr-input
            value=${(config as any).zendeskAssigneeId || ''}
            placeholder="User ID to assign"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskAssigneeId', e.detail.value)}
          ></nr-input>
        </div>
        <div class="config-field">
          <label>Group ID</label>
          <nr-input
            value=${(config as any).zendeskGroupId || ''}
            placeholder="Group ID to assign"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskGroupId', e.detail.value)}
          ></nr-input>
          <span class="field-description">Zendesk group to assign the ticket to (optional)</span>
        </div>
        <div class="config-field">
          <label>External ID</label>
          <nr-input
            value=${(config as any).zendeskExternalId || ''}
            placeholder="external-ref-123"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskExternalId', e.detail.value)}
          ></nr-input>
          <span class="field-description">External system reference ID (optional)</span>
        </div>
        <div class="config-field">
          <label>Tags</label>
          <nr-input
            value=${(config as any).zendeskTags || ''}
            placeholder="tag1, tag2, tag3"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskTags', e.detail.value)}
          ></nr-input>
          <span class="field-description">Comma-separated tags</span>
        </div>
        <div class="config-field">
          <label>Custom Fields (JSON)</label>
          <nr-textarea
            value=${(config as any).zendeskCustomFields || ''}
            placeholder='[{"id": 123, "value": "custom"}]'
            rows="3"
            @nr-input=${(e: CustomEvent) => onUpdate('zendeskCustomFields', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Custom field values as JSON array</span>
        </div>
      </div>
    ` : nothing}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Output</span>
      </div>
      <div class="config-field">
        <label>Output Variable</label>
        <nr-input
          value=${(config as any).outputVariable || ''}
          placeholder="zendeskResult"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description">Variable name to store the Zendesk API response</span>
      </div>
    </div>
  `;
}
