/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';
import type { KvEntryLike } from '../shared/kv-credential-utils.js';
import type { TriggerInfo, TriggerActions } from '../../types.js';
import { renderTriggerStatusSection } from '../shared/trigger-status-utils.js';

import '../../../../../kv-secret-select/kv-secret-select.component.js';

const WHATSAPP_WEBHOOK_FIELDS = [
  { value: 'messages', label: 'Messages' },
  { value: 'message_status', label: 'Message Status' },
  { value: 'message_template_status_update', label: 'Template Status' },
  { value: 'account_update', label: 'Account Update' },
  { value: 'account_alerts', label: 'Account Alerts' },
  { value: 'business_capability_update', label: 'Business Capability' },
  { value: 'phone_number_name_update', label: 'Phone Number Name' },
  { value: 'phone_number_quality_update', label: 'Phone Number Quality' },
];

const WHATSAPP_MESSAGE_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
  { value: 'audio', label: 'Audio' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
  { value: 'sticker', label: 'Sticker' },
  { value: 'location', label: 'Location' },
  { value: 'contacts', label: 'Contacts' },
  { value: 'interactive', label: 'Interactive (Buttons / Lists)' },
  { value: 'button', label: 'Button Reply' },
  { value: 'reaction', label: 'Reaction' },
  { value: 'order', label: 'Order' },
];

/**
 * Render WhatsApp Webhook trigger config fields
 */
export function renderWhatsappFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  triggerInfo?: TriggerInfo,
  triggerActions?: TriggerActions,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const webhookFields: string[] = (config as any).webhookFields || ['messages'];
  const messageTypes: string[] = (config as any).messageTypes || [];
  const webhookUrl = triggerInfo?.webhookUrl;

  const whatsappEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('whatsapp/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    ${renderTriggerStatusSection(triggerInfo, triggerActions, 'WHATSAPP_WEBHOOK', config, {
      activateLabel: 'Activate Webhook',
    })}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">WhatsApp Business Account</span>
        <span class="config-section-desc">Identify the phone number and Business Account that should receive events</span>
      </div>
      <div class="config-field">
        <label>Phone Number ID</label>
        <nr-input
          value=${(config as any).phoneNumberId || ''}
          placeholder="106540352242922"
          @nr-input=${(e: CustomEvent) => onUpdate('phoneNumberId', e.detail.value)}
        ></nr-input>
        <span class="field-description">The WhatsApp Business phone number ID from Meta Developer Console</span>
      </div>
      <div class="config-field">
        <label>Business Account ID</label>
        <nr-input
          value=${(config as any).businessAccountId || ''}
          placeholder="102290129340398"
          @nr-input=${(e: CustomEvent) => onUpdate('businessAccountId', e.detail.value)}
        ></nr-input>
        <span class="field-description">Optional — WABA ID used when sending outbound messages</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Credentials</span>
        <span class="config-section-desc">System-user access token and app secret for signature verification</span>
      </div>
      <div class="config-field">
        <label>Access Token</label>
        <nr-kv-secret-select
          .provider=${'whatsapp'}
          .entries=${whatsappEntries}
          .value=${(config as any).accessTokenPath || ''}
          placeholder="Select WhatsApp access token..."
          @value-change=${(e: CustomEvent) => onUpdate('accessTokenPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Meta permanent system-user token (stored in KV)</span>
      </div>
      <div class="config-field">
        <label>App Secret</label>
        <nr-kv-secret-select
          .provider=${'whatsapp'}
          .entries=${whatsappEntries}
          .value=${(config as any).appSecretPath || ''}
          placeholder="Select WhatsApp app secret..."
          @value-change=${(e: CustomEvent) => onUpdate('appSecretPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Used to verify the X-Hub-Signature-256 header on incoming webhooks</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Webhook Verification</span>
        <span class="config-section-desc">Meta calls the webhook URL with this token during the subscription handshake</span>
      </div>
      <div class="config-field">
        <label>Verify Token</label>
        <nr-input
          value=${(config as any).verifyToken || ''}
          placeholder="my-secret-verify-token"
          @nr-input=${(e: CustomEvent) => onUpdate('verifyToken', e.detail.value)}
        ></nr-input>
        <span class="field-description">Paste the same value into the "Verify token" field in the Meta webhook configuration</span>
      </div>
      ${webhookUrl
        ? html`
            <div class="config-field">
              <label>Callback URL</label>
              <div class="webhook-url-container">
                <code class="webhook-url">${webhookUrl}</code>
                <nr-button
                  type="ghost"
                  size="small"
                  @click=${() => {
                    navigator.clipboard.writeText(webhookUrl);
                  }}
                  buttonAriaLabel="Copy URL"
                >
                  <nr-icon name="copy" size="small"></nr-icon>
                </nr-button>
              </div>
              <span class="field-description">Enter this as the "Callback URL" in Meta's webhook configuration</span>
            </div>
          `
        : nothing}
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Webhook Fields</span>
        <span class="config-section-desc">Subscribe to specific event categories on the WhatsApp Business Account</span>
      </div>
      <div class="config-field">
        <div class="method-checkboxes">
          ${WHATSAPP_WEBHOOK_FIELDS.map(field => {
            const isChecked = webhookFields.includes(field.value);
            return html`
              <label class="method-checkbox">
                <nr-checkbox
                  .checked=${isChecked}
                  @nr-change=${(e: CustomEvent) => {
                    const checked = e.detail.checked;
                    const next = checked
                      ? [...webhookFields, field.value]
                      : webhookFields.filter(f => f !== field.value);
                    onUpdate('webhookFields', next);
                  }}
                ></nr-checkbox>
                <span class="method-label">${field.label}</span>
              </label>
            `;
          })}
        </div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Message Types</span>
        <span class="config-section-desc">Filter which incoming message types fire this workflow (empty = all types)</span>
      </div>
      <div class="config-field">
        <div class="method-checkboxes">
          ${WHATSAPP_MESSAGE_TYPES.map(messageType => {
            const isChecked = messageTypes.includes(messageType.value);
            return html`
              <label class="method-checkbox">
                <nr-checkbox
                  .checked=${isChecked}
                  @nr-change=${(e: CustomEvent) => {
                    const checked = e.detail.checked;
                    const next = checked
                      ? [...messageTypes, messageType.value]
                      : messageTypes.filter(t => t !== messageType.value);
                    onUpdate('messageTypes', next);
                  }}
                ></nr-checkbox>
                <span class="method-label">${messageType.label}</span>
              </label>
            `;
          })}
        </div>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Filtering</span>
        <span class="config-section-desc">Restrict which senders can trigger this workflow</span>
      </div>
      <div class="config-field">
        <label>Allowed Sender Numbers</label>
        <nr-input
          value=${(config as any).allowedSenders || ''}
          placeholder="+14155552671, +442071234567"
          @nr-input=${(e: CustomEvent) => onUpdate('allowedSenders', e.detail.value)}
        ></nr-input>
        <span class="field-description">Comma-separated E.164 phone numbers (leave empty to allow all)</span>
      </div>
      <div class="config-field">
        <label>Ignore Status Updates</label>
        <nr-checkbox
          .checked=${(config as any).ignoreStatusUpdates === true}
          @nr-change=${(e: CustomEvent) => onUpdate('ignoreStatusUpdates', e.detail.checked)}
        ></nr-checkbox>
        <span class="field-description">Skip sent/delivered/read receipts and only fire on inbound messages</span>
      </div>
    </div>
  `;
}
