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

const OPERATIONS = [
  { value: 'createIssue', label: 'Create Issue' },
  { value: 'getIssue', label: 'Get Issue' },
  { value: 'updateIssue', label: 'Update Issue' },
  { value: 'deleteIssue', label: 'Delete Issue' },
  { value: 'searchJql', label: 'Search (JQL)' },
  { value: 'transitionIssue', label: 'Transition Issue' },
  { value: 'addComment', label: 'Add Comment' },
  { value: 'listComments', label: 'List Comments' },
  { value: 'getChangelog', label: 'Get Changelog' },
  { value: 'listProjects', label: 'List Projects' },
  { value: 'addAttachment', label: 'Add Attachment' },
  { value: 'listAttachments', label: 'List Attachments' },
  { value: 'addWorklog', label: 'Add Worklog' },
  { value: 'listWorklogs', label: 'List Worklogs' },
  { value: 'getUser', label: 'Get User' },
  { value: 'searchUsers', label: 'Search Users' },
];

const ISSUE_TYPES = [
  { value: 'Task', label: 'Task' },
  { value: 'Bug', label: 'Bug' },
  { value: 'Story', label: 'Story' },
  { value: 'Epic', label: 'Epic' },
  { value: 'Sub-task', label: 'Sub-task' },
];

const PRIORITIES = [
  { value: 'Highest', label: 'Highest' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
  { value: 'Lowest', label: 'Lowest' },
];

/**
 * Render Jira node config fields
 */
export function renderJiraFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const operation = (config as any).operation || 'createIssue';

  const needsIssueKey = [
    'getIssue', 'updateIssue', 'deleteIssue', 'transitionIssue',
    'addComment', 'listComments', 'getChangelog',
    'addAttachment', 'listAttachments',
    'addWorklog', 'listWorklogs',
  ].includes(operation);
  const needsProjectKey = ['createIssue', 'searchJql'].includes(operation);
  const needsIssueFields = ['createIssue', 'updateIssue'].includes(operation);
  const needsJql = operation === 'searchJql';
  const needsTransition = operation === 'transitionIssue';
  const needsComment = operation === 'addComment';
  const needsAttachmentUpload = operation === 'addAttachment';
  const needsWorklog = operation === 'addWorklog';
  const needsUserLookup = operation === 'getUser';
  const needsUserSearch = operation === 'searchUsers';
  const needsPagination = ['searchJql', 'listProjects', 'listComments', 'listAttachments', 'listWorklogs', 'searchUsers'].includes(operation);

  const providerEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('jira/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  // Custom fields helper
  const customFields: Array<{ key: string; value: string }> =
    (config as any).customFields || [];

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
        <span class="config-section-desc">Jira instance and credentials</span>
      </div>
      <div class="config-field">
        <label>Jira Instance URL</label>
        <nr-input
          value=${(config as any).jiraInstanceUrl || ''}
          placeholder="https://your-org.atlassian.net"
          @nr-input=${(e: CustomEvent) => onUpdate('jiraInstanceUrl', e.detail.value)}
        ></nr-input>
        <span class="field-description">Your Jira Cloud or Server URL</span>
      </div>
      <div class="config-field">
        <label>Credentials</label>
        <nr-kv-secret-select
          .provider=${'jira'}
          .entries=${providerEntries}
          .value=${(config as any).credentialPath || ''}
          placeholder="Select Jira credentials..."
          @value-change=${(e: CustomEvent) => onUpdate('credentialPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Jira API credentials from the KV secret store (email + API token)</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Operation</span>
        <span class="config-section-desc">What action to perform</span>
      </div>
      <div class="config-field">
        <label>Operation</label>
        <nr-select
          value=${operation}
          @nr-change=${(e: CustomEvent) => onUpdate('operation', e.detail.value)}
        >
          ${OPERATIONS.map(op => html`
            <nr-option value=${op.value}>${op.label}</nr-option>
          `)}
        </nr-select>
      </div>
    </div>

    ${needsIssueKey ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Issue</span>
        </div>
        <div class="config-field">
          <label>Issue Key</label>
          <nr-input
            value=${(config as any).issueKey || ''}
            placeholder="PROJECT-123"
            @nr-input=${(e: CustomEvent) => onUpdate('issueKey', e.detail.value)}
          ></nr-input>
          <span class="field-description">Jira issue key. Use \${variableName} for dynamic values.</span>
        </div>
      </div>
    ` : nothing}

    ${needsProjectKey ? html`
      <div class="config-field">
        <label>Project Key</label>
        <nr-input
          value=${(config as any).projectKey || ''}
          placeholder="PROJ"
          @nr-input=${(e: CustomEvent) => onUpdate('projectKey', e.detail.value)}
        ></nr-input>
        <span class="field-description">Jira project key</span>
      </div>
    ` : nothing}

    ${needsIssueFields ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Issue Details</span>
          <span class="config-section-desc">Configure the issue fields</span>
        </div>
        <div class="config-field">
          <label>Issue Type</label>
          <nr-select
            value=${(config as any).issueType || 'Task'}
            @nr-change=${(e: CustomEvent) => onUpdate('issueType', e.detail.value)}
          >
            ${ISSUE_TYPES.map(t => html`
              <nr-option value=${t.value}>${t.label}</nr-option>
            `)}
          </nr-select>
        </div>
        <div class="config-field">
          <label>Summary</label>
          <nr-input
            value=${(config as any).summary || ''}
            placeholder="Issue summary"
            @nr-input=${(e: CustomEvent) => onUpdate('summary', e.detail.value)}
          ></nr-input>
          <span class="field-description">Issue title. Use \${variableName} for dynamic content.</span>
        </div>
        <div class="config-field">
          <label>Description</label>
          <nr-textarea
            value=${(config as any).description || ''}
            placeholder="Issue description"
            rows="4"
            @nr-input=${(e: CustomEvent) => onUpdate('description', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Issue description. Use \${variableName} for dynamic content.</span>
        </div>
        <div class="config-field">
          <label>Assignee</label>
          <nr-input
            value=${(config as any).assignee || ''}
            placeholder="Account ID or email"
            @nr-input=${(e: CustomEvent) => onUpdate('assignee', e.detail.value)}
          ></nr-input>
          <span class="field-description">Jira user account ID or email (optional)</span>
        </div>
        <div class="config-field">
          <label>Priority</label>
          <nr-select
            value=${(config as any).priority || 'Medium'}
            @nr-change=${(e: CustomEvent) => onUpdate('priority', e.detail.value)}
          >
            ${PRIORITIES.map(p => html`
              <nr-option value=${p.value}>${p.label}</nr-option>
            `)}
          </nr-select>
        </div>
        <div class="config-field">
          <label>Labels</label>
          <nr-input
            value=${(config as any).labels || ''}
            placeholder="label1, label2"
            @nr-input=${(e: CustomEvent) => onUpdate('labels', e.detail.value)}
          ></nr-input>
          <span class="field-description">Comma-separated list of labels (optional)</span>
        </div>
        <div class="config-field">
          <label>Sprint ID</label>
          <nr-input
            value=${(config as any).sprintId || ''}
            placeholder="123"
            @nr-input=${(e: CustomEvent) => onUpdate('sprintId', e.detail.value)}
          ></nr-input>
          <span class="field-description">Sprint ID for agile boards (optional). Use \${variableName} for dynamic values.</span>
        </div>
        <div class="config-field">
          <label>Board ID</label>
          <nr-input
            value=${(config as any).boardId || ''}
            placeholder="42"
            @nr-input=${(e: CustomEvent) => onUpdate('boardId', e.detail.value)}
          ></nr-input>
          <span class="field-description">Agile board ID (optional). Use \${variableName} for dynamic values.</span>
        </div>
        ${['createIssue', 'updateIssue', 'addComment', 'transitionIssue'].includes(operation) ? html`
        <div class="config-field">
          <label>
            <nr-checkbox
              ?checked=${(config as any).notifyWatchers !== false}
              @nr-change=${(e: CustomEvent) => onUpdate('notifyWatchers', e.detail.checked)}
            ></nr-checkbox>
            Notify Watchers
          </label>
          <span class="field-description">Send notification emails to issue watchers</span>
        </div>
        ` : ''}
      </div>

      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Custom Fields</span>
          <span class="config-section-desc">Set arbitrary Jira custom fields (e.g. customfield_10001)</span>
        </div>
        ${customFields.map((field, i) => html`
          <div style="display: flex; gap: 4px; margin-bottom: 4px; align-items: center;">
            <nr-input
              size="small"
              value=${field.key}
              placeholder="customfield_10001"
              style="flex: 1;"
              @nr-input=${(e: CustomEvent) => {
                const updated = [...customFields];
                updated[i] = { ...field, key: e.detail.value };
                onUpdate('customFields', updated);
              }}
            ></nr-input>
            <nr-input
              size="small"
              value=${field.value}
              placeholder="Value or \${var}"
              style="flex: 2;"
              @nr-input=${(e: CustomEvent) => {
                const updated = [...customFields];
                updated[i] = { ...field, value: e.detail.value };
                onUpdate('customFields', updated);
              }}
            ></nr-input>
            <nr-button size="small" variant="text" @click=${() => {
              const updated = [...customFields];
              updated.splice(i, 1);
              onUpdate('customFields', updated);
            }}>x</nr-button>
          </div>
        `)}
        <nr-button size="small" variant="outline" @click=${() => {
          const updated = [...customFields, { key: '', value: '' }];
          onUpdate('customFields', updated);
        }}>+ Add Custom Field</nr-button>
      </div>
    ` : nothing}

    ${needsJql ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Search</span>
        </div>
        <div class="config-field">
          <label>JQL Query</label>
          <nr-textarea
            value=${(config as any).jqlQuery || ''}
            placeholder="project = PROJ AND status = 'In Progress'"
            rows="3"
            @nr-input=${(e: CustomEvent) => onUpdate('jqlQuery', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Jira Query Language expression. Use \${variableName} for dynamic values.</span>
        </div>
      </div>
    ` : nothing}

    ${needsTransition ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Transition</span>
        </div>
        <div class="config-field">
          <label>Transition ID</label>
          <nr-input
            value=${(config as any).transitionId || ''}
            placeholder="21"
            @nr-input=${(e: CustomEvent) => onUpdate('transitionId', e.detail.value)}
          ></nr-input>
          <span class="field-description">The ID of the transition to apply (get from Jira workflow)</span>
        </div>
      </div>
    ` : nothing}

    ${needsComment ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Comment</span>
        </div>
        <div class="config-field">
          <label>Comment Text</label>
          <nr-textarea
            value=${(config as any).comment || ''}
            placeholder="Comment body"
            rows="4"
            @nr-input=${(e: CustomEvent) => onUpdate('comment', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Comment text. Use \${variableName} for dynamic content.</span>
        </div>
      </div>
    ` : nothing}

    ${needsWorklog ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Worklog</span>
          <span class="config-section-desc">Time tracking entry</span>
        </div>
        <div class="config-field">
          <label>Time Spent</label>
          <nr-input
            value=${(config as any).timeSpent || ''}
            placeholder="2h 30m"
            @nr-input=${(e: CustomEvent) => onUpdate('timeSpent', e.detail.value)}
          ></nr-input>
          <span class="field-description">Time in Jira duration format (e.g. 1d, 4h, 30m)</span>
        </div>
        <div class="config-field">
          <label>Started At</label>
          <nr-input
            value=${(config as any).worklogStarted || ''}
            placeholder="2024-01-15T09:00:00.000+0000"
            @nr-input=${(e: CustomEvent) => onUpdate('worklogStarted', e.detail.value)}
          ></nr-input>
          <span class="field-description">When the work was started (ISO 8601 format, optional — defaults to now)</span>
        </div>
        <div class="config-field">
          <label>Worklog Comment</label>
          <nr-textarea
            value=${(config as any).worklogComment || ''}
            placeholder="Description of work done"
            rows="3"
            @nr-input=${(e: CustomEvent) => onUpdate('worklogComment', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Optional description of the work performed</span>
        </div>
      </div>
    ` : nothing}

    ${needsAttachmentUpload ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Attachment</span>
          <span class="config-section-desc">Upload a file to the issue</span>
        </div>
        <div class="config-field">
          <label>File Content</label>
          <nr-input
            value=${(config as any).attachmentContent || ''}
            placeholder="\${previousNode.fileBuffer}"
            @nr-input=${(e: CustomEvent) => onUpdate('attachmentContent', e.detail.value)}
          ></nr-input>
          <span class="field-description">File content (base64) or variable reference from a previous node</span>
        </div>
        <div class="config-field">
          <label>File Name</label>
          <nr-input
            value=${(config as any).attachmentFilename || ''}
            placeholder="report.pdf"
            @nr-input=${(e: CustomEvent) => onUpdate('attachmentFilename', e.detail.value)}
          ></nr-input>
          <span class="field-description">Name for the uploaded file</span>
        </div>
      </div>
    ` : nothing}

    ${needsUserLookup ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">User Lookup</span>
        </div>
        <div class="config-field">
          <label>Account ID</label>
          <nr-input
            value=${(config as any).accountId || ''}
            placeholder="5b10ac8d82e05b22cc7d4ef5"
            @nr-input=${(e: CustomEvent) => onUpdate('accountId', e.detail.value)}
          ></nr-input>
          <span class="field-description">Jira user account ID. Use \${variableName} for dynamic values.</span>
        </div>
      </div>
    ` : nothing}

    ${needsUserSearch ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">User Search</span>
        </div>
        <div class="config-field">
          <label>Search Query</label>
          <nr-input
            value=${(config as any).userQuery || ''}
            placeholder="john.doe@example.com"
            @nr-input=${(e: CustomEvent) => onUpdate('userQuery', e.detail.value)}
          ></nr-input>
          <span class="field-description">Search by display name, email, or account ID</span>
        </div>
      </div>
    ` : nothing}

    ${needsPagination ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Pagination</span>
          <span class="config-section-desc">Control result set size</span>
        </div>
        <div class="config-field">
          <label>Max Results</label>
          <nr-input
            type="number"
            value=${String((config as any).maxResults ?? 50)}
            min="1"
            max="1000"
            @nr-input=${(e: CustomEvent) => onUpdate('maxResults', Number.parseInt(e.detail.value))}
          ></nr-input>
          <span class="field-description">Maximum number of results to return (default 50)</span>
        </div>
        <div class="config-field">
          <label>Start At</label>
          <nr-input
            type="number"
            value=${String((config as any).startAt ?? 0)}
            min="0"
            @nr-input=${(e: CustomEvent) => onUpdate('startAt', Number.parseInt(e.detail.value))}
          ></nr-input>
          <span class="field-description">Index of the first result to return (for pagination)</span>
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
          placeholder="jiraResult"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description">Variable name to store the Jira response</span>
      </div>
    </div>
  `;
}
