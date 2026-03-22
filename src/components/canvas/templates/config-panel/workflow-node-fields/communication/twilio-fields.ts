/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

// Import KV secret select component
import '../../../../../kv-secret-select/kv-secret-select.component.js';

interface KvEntryLike {
  keyPath: string;
  value?: any;
  isSecret: boolean;
}

const TWILIO_OPERATIONS = [
  { value: 'send_sms', label: 'Send SMS' },
  { value: 'make_call', label: 'Make Voice Call' },
  { value: 'send_whatsapp', label: 'Send WhatsApp Message' },
  { value: 'get_message', label: 'Get Message Status' },
];

const MACHINE_DETECTION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'Enable', label: 'Enable' },
  { value: 'DetectMessageEnd', label: 'Detect Message End' },
];

/**
 * Render shared Twilio credential section using KV secret store
 */
function renderTwilioCredentials(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const providerEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('twilio/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Credentials</span>
        <span class="config-section-desc">Twilio account credentials from the KV secret store</span>
      </div>
      <div class="config-field">
        <label>Credentials</label>
        <nr-kv-secret-select
          .provider=${'twilio'}
          .entries=${providerEntries}
          .value=${(config as any).credentialPath || ''}
          placeholder="Select Twilio credentials..."
          @value-change=${(e: CustomEvent) => onUpdate('credentialPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Twilio API credentials (Account SID + Auth Token)</span>
      </div>
    </div>
  `;
}

/**
 * Render Twilio SMS node config fields
 */
export function renderTwilioSmsFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Operation</span>
        <span class="config-section-desc">Choose the Twilio action to perform</span>
      </div>
      <div class="config-field">
        <label>Operation</label>
        <nr-select
          value=${(config as any).twilioOperation || 'send_sms'}
          @nr-change=${(e: CustomEvent) => onUpdate('twilioOperation', e.detail.value)}
        >
          ${TWILIO_OPERATIONS.map(op => html`
            <nr-option value=${op.value}>${op.label}</nr-option>
          `)}
        </nr-select>
        <span class="field-description">SMS, Voice Call, WhatsApp message, or message status lookup</span>
      </div>
    </div>

    ${renderTwilioCredentials(config, onUpdate, kvEntries, onCreateKvEntry)}

    ${(config as any).twilioOperation === 'get_message' ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Message Lookup</span>
          <span class="config-section-desc">Retrieve a message by its SID</span>
        </div>
        <div class="config-field">
          <label>Message SID</label>
          <nr-input
            value=${(config as any).twilioMessageSid || ''}
            placeholder="SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            @nr-input=${(e: CustomEvent) => onUpdate('twilioMessageSid', e.detail.value)}
          ></nr-input>
          <span class="field-description">The SID of the message to look up. Use \${variableName} for dynamic content.</span>
        </div>
      </div>
    ` : html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Message</span>
          <span class="config-section-desc">Configure the message to send</span>
        </div>
        <div class="config-field">
          <label>From Number</label>
          <nr-input
            value=${(config as any).twilioFromNumber || ''}
            placeholder="+1234567890${(config as any).twilioOperation === 'send_whatsapp' ? ' or whatsapp:+1234567890' : ''}"
            @nr-input=${(e: CustomEvent) => onUpdate('twilioFromNumber', e.detail.value)}
          ></nr-input>
          <span class="field-description">Your Twilio phone number${(config as any).twilioOperation === 'send_whatsapp' ? ' (prefix with whatsapp:)' : ''}</span>
        </div>
        <div class="config-field">
          <label>To Number</label>
          <nr-input
            value=${(config as any).twilioToNumber || ''}
            placeholder="+1234567890"
            @nr-input=${(e: CustomEvent) => onUpdate('twilioToNumber', e.detail.value)}
          ></nr-input>
          <span class="field-description">Recipient phone number. Use \${variableName} for dynamic content.</span>
        </div>
        <div class="config-field">
          <label>Message Body</label>
          <nr-textarea
            value=${(config as any).twilioMessageBody || ''}
            placeholder="Hello from Nuraly! Use \${variable} for dynamic content"
            rows="4"
            @nr-input=${(e: CustomEvent) => onUpdate('twilioMessageBody', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Message text. Use \${variableName} for dynamic content.</span>
        </div>
        <div class="config-field">
          <label>Media URL (optional)</label>
          <nr-input
            value=${(config as any).twilioMediaUrl || ''}
            placeholder="https://example.com/image.jpg"
            @nr-input=${(e: CustomEvent) => onUpdate('twilioMediaUrl', e.detail.value)}
          ></nr-input>
          <span class="field-description">URL of media to attach (MMS/WhatsApp). Supports images, audio, video, and PDFs.</span>
        </div>
      </div>

      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Options</span>
        </div>
        <div class="config-field">
          <label>Status Callback URL</label>
          <nr-input
            value=${(config as any).twilioStatusCallback || ''}
            placeholder="https://example.com/status (optional)"
            @nr-input=${(e: CustomEvent) => onUpdate('twilioStatusCallback', e.detail.value)}
          ></nr-input>
          <span class="field-description">URL to receive delivery status updates</span>
        </div>
      </div>
    `}
  `;
}

/**
 * Render Twilio Voice Call node config fields
 */
export function renderTwilioVoiceFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const twimlSource = (config as any).twilioTwimlSource || 'url';

  return html`
    ${renderTwilioCredentials(config, onUpdate, kvEntries, onCreateKvEntry)}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Call Configuration</span>
        <span class="config-section-desc">Configure the voice call</span>
      </div>
      <div class="config-field">
        <label>From Number</label>
        <nr-input
          value=${(config as any).twilioFromNumber || ''}
          placeholder="+1234567890"
          @nr-input=${(e: CustomEvent) => onUpdate('twilioFromNumber', e.detail.value)}
        ></nr-input>
        <span class="field-description">Your Twilio phone number</span>
      </div>
      <div class="config-field">
        <label>To Number</label>
        <nr-input
          value=${(config as any).twilioToNumber || ''}
          placeholder="+1234567890"
          @nr-input=${(e: CustomEvent) => onUpdate('twilioToNumber', e.detail.value)}
        ></nr-input>
        <span class="field-description">Recipient phone number. Use \${variableName} for dynamic content.</span>
      </div>
      <div class="config-field">
        <label>TwiML Source</label>
        <nr-select
          value=${twimlSource}
          @nr-change=${(e: CustomEvent) => onUpdate('twilioTwimlSource', e.detail.value)}
        >
          <nr-option value="url">TwiML URL</nr-option>
          <nr-option value="inline">Inline TwiML</nr-option>
        </nr-select>
        <span class="field-description">Choose between a URL or inline TwiML XML</span>
      </div>
      ${twimlSource === 'url' ? html`
        <div class="config-field">
          <label>TwiML URL</label>
          <nr-input
            value=${(config as any).twilioVoiceUrl || ''}
            placeholder="https://example.com/twiml.xml"
            @nr-input=${(e: CustomEvent) => onUpdate('twilioVoiceUrl', e.detail.value)}
          ></nr-input>
          <span class="field-description">URL that returns TwiML instructions for the call</span>
        </div>
      ` : html`
        <div class="config-field">
          <label>TwiML Body</label>
          <nr-textarea
            value=${(config as any).twilioTwimlBody || ''}
            placeholder="<Response><Say>Hello from Nuraly!</Say></Response>"
            rows="4"
            @nr-input=${(e: CustomEvent) => onUpdate('twilioTwimlBody', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Inline TwiML XML instructions for the call</span>
        </div>
      `}
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Options</span>
      </div>
      <div class="config-field">
        <label>Machine Detection</label>
        <nr-select
          value=${(config as any).twilioMachineDetection || 'none'}
          @nr-change=${(e: CustomEvent) => onUpdate('twilioMachineDetection', e.detail.value)}
        >
          ${MACHINE_DETECTION_OPTIONS.map(opt => html`
            <nr-option value=${opt.value}>${opt.label}</nr-option>
          `)}
        </nr-select>
        <span class="field-description">Detect if an answering machine picks up the call</span>
      </div>
      <div class="config-field">
        <label>
          <nr-checkbox
            ?checked=${(config as any).twilioRecord || false}
            @nr-change=${(e: CustomEvent) => onUpdate('twilioRecord', e.detail.checked)}
          ></nr-checkbox>
          Record Call
        </label>
        <span class="field-description">Enable call recording</span>
      </div>
      <div class="config-field">
        <label>Timeout (seconds)</label>
        <nr-input
          type="number"
          value=${(config as any).twilioTimeout || ''}
          placeholder="60"
          @nr-input=${(e: CustomEvent) => onUpdate('twilioTimeout', e.detail.value)}
        ></nr-input>
        <span class="field-description">Number of seconds to wait for the call to be answered before giving up</span>
      </div>
      <div class="config-field">
        <label>Status Callback URL</label>
        <nr-input
          value=${(config as any).twilioStatusCallback || ''}
          placeholder="https://example.com/status (optional)"
          @nr-input=${(e: CustomEvent) => onUpdate('twilioStatusCallback', e.detail.value)}
        ></nr-input>
        <span class="field-description">URL to receive call status updates</span>
      </div>
    </div>
  `;
}
