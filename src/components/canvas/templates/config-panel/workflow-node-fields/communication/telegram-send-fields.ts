/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

// Import KV secret select component
import '../../../../../kv-secret-select/kv-secret-select.component.js';

interface KvEntryLike {
  keyPath: string;
  value?: any;
  isSecret: boolean;
}

const PARSE_MODES = [
  { value: '', label: 'None' },
  { value: 'HTML', label: 'HTML' },
  { value: 'Markdown', label: 'Markdown' },
  { value: 'MarkdownV2', label: 'MarkdownV2' },
];

const OPERATIONS = [
  { value: 'sendMessage', label: 'Send Message' },
  { value: 'sendPhoto', label: 'Send Photo' },
  { value: 'sendVideo', label: 'Send Video' },
  { value: 'sendDocument', label: 'Send Document' },
  { value: 'sendAudio', label: 'Send Audio' },
  { value: 'sendSticker', label: 'Send Sticker' },
  { value: 'sendAnimation', label: 'Send Animation (GIF)' },
  { value: 'sendLocation', label: 'Send Location' },
  { value: 'sendMediaGroup', label: 'Send Media Group' },
  { value: 'editMessageText', label: 'Edit Message Text' },
  { value: 'deleteMessage', label: 'Delete Message' },
  { value: 'pinChatMessage', label: 'Pin Message' },
  { value: 'unpinChatMessage', label: 'Unpin Message' },
  { value: 'answerCallbackQuery', label: 'Answer Callback Query' },
  { value: 'sendChatAction', label: 'Send Chat Action' },
];

const CHAT_ACTIONS = [
  { value: 'typing', label: 'Typing' },
  { value: 'upload_photo', label: 'Upload Photo' },
  { value: 'record_video', label: 'Record Video' },
  { value: 'upload_video', label: 'Upload Video' },
  { value: 'record_voice', label: 'Record Voice' },
  { value: 'upload_voice', label: 'Upload Voice' },
  { value: 'upload_document', label: 'Upload Document' },
  { value: 'find_location', label: 'Find Location' },
  { value: 'record_video_note', label: 'Record Video Note' },
  { value: 'upload_video_note', label: 'Upload Video Note' },
];

const REACTION_EMOJIS = [
  { value: '', label: 'None' },
  { value: '👍', label: '👍 Thumbs Up' },
  { value: '👀', label: '👀 Eyes (read)' },
  { value: '✅', label: '✅ Check' },
  { value: '❤', label: '❤ Heart' },
  { value: '🔥', label: '🔥 Fire' },
  { value: '⚡', label: '⚡ Lightning' },
];

// Operations that accept a caption instead of text
const MEDIA_OPERATIONS = [
  'sendPhoto', 'sendVideo', 'sendDocument', 'sendAudio', 'sendAnimation',
];

// Operations that need a file/URL input
const FILE_OPERATIONS = [
  'sendPhoto', 'sendVideo', 'sendDocument', 'sendAudio', 'sendSticker', 'sendAnimation',
];

// Operations that support parse mode (text or caption)
const PARSE_MODE_OPERATIONS = [
  'sendMessage', 'editMessageText',
  ...MEDIA_OPERATIONS,
];

/**
 * Render Telegram Send Message node config fields
 */
export function renderTelegramSendFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const operation = (config as any).operation || 'sendMessage';

  const telegramEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('telegram/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  const needsText = operation === 'sendMessage' || operation === 'editMessageText';
  const needsCaption = MEDIA_OPERATIONS.includes(operation);
  const needsFile = FILE_OPERATIONS.includes(operation);
  const needsParseMode = PARSE_MODE_OPERATIONS.includes(operation);
  const needsMessageId = operation === 'editMessageText' || operation === 'deleteMessage'
    || operation === 'pinChatMessage' || operation === 'unpinChatMessage';
  const needsLocation = operation === 'sendLocation';
  const needsCallbackQueryId = operation === 'answerCallbackQuery';
  const needsChatAction = operation === 'sendChatAction';
  const needsMediaGroup = operation === 'sendMediaGroup';

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Operation</span>
        <span class="config-section-desc">Choose the Telegram action to perform</span>
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

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Target</span>
        <span class="config-section-desc">Leave empty to auto-use from Telegram Bot trigger</span>
      </div>
      <div class="config-field">
        <label>Bot Token</label>
        <nr-kv-secret-select
          .provider=${'telegram'}
          .entries=${telegramEntries}
          .value=${(config as any).botTokenPath || ''}
          placeholder="Select bot token (or leave empty to auto-use from trigger)"
          @value-change=${(e: CustomEvent) => onUpdate('botTokenPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Leave empty to use the token from the Telegram Bot trigger node</span>
      </div>
      <div class="config-field">
        <label>Chat ID</label>
        <nr-input
          value=${(config as any).chatId || ''}
          placeholder="Auto from trigger (leave empty)"
          @nr-input=${(e: CustomEvent) => onUpdate('chatId', e.detail.value)}
        ></nr-input>
        <span class="field-description">Leave empty to reply to the same chat that triggered the workflow</span>
      </div>
    </div>

    ${needsText ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Message</span>
          <span class="config-section-desc">Configure the message text</span>
        </div>
        <div class="config-field">
          <label>Text</label>
          <nr-textarea
            value=${(config as any).text || ''}
            placeholder="Hello! Use \${message} to reference workflow variables"
            rows="4"
            @nr-input=${(e: CustomEvent) => onUpdate('text', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Message text. Use \${variableName} for dynamic content.</span>
        </div>
        ${needsParseMode ? html`
          <div class="config-field">
            <label>Parse Mode</label>
            <nr-select
              value=${(config as any).parseMode || ''}
              @nr-change=${(e: CustomEvent) => onUpdate('parseMode', e.detail.value)}
            >
              ${PARSE_MODES.map(m => html`
                <nr-option value=${m.value}>${m.label}</nr-option>
              `)}
            </nr-select>
            <span class="field-description">Text formatting mode</span>
          </div>
        ` : nothing}
        <div class="config-field">
          <label>Disable Link Preview</label>
          <nr-switch
            ?checked=${(config as any).disableLinkPreview === true}
            @nr-change=${(e: CustomEvent) => onUpdate('disableLinkPreview', e.detail.checked)}
          ></nr-switch>
          <span class="field-description">Disable link previews in the message</span>
        </div>
      </div>
    ` : nothing}

    ${needsFile ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Media</span>
          <span class="config-section-desc">Provide a URL or file_id</span>
        </div>
        <div class="config-field">
          <label>File URL or ID</label>
          <nr-input
            value=${(config as any).fileUrl || ''}
            placeholder="https://example.com/image.png or file_id"
            @nr-input=${(e: CustomEvent) => onUpdate('fileUrl', e.detail.value)}
          ></nr-input>
          <span class="field-description">URL to the file, or a Telegram file_id from a previous message</span>
        </div>
        ${needsCaption ? html`
          <div class="config-field">
            <label>Caption</label>
            <nr-textarea
              value=${(config as any).caption || ''}
              placeholder="Optional caption for the media"
              rows="4"
              @nr-input=${(e: CustomEvent) => onUpdate('caption', e.detail.value)}
            ></nr-textarea>
          </div>
          ${needsParseMode ? html`
            <div class="config-field">
              <label>Parse Mode</label>
              <nr-select
                value=${(config as any).parseMode || ''}
                @nr-change=${(e: CustomEvent) => onUpdate('parseMode', e.detail.value)}
              >
                ${PARSE_MODES.map(m => html`
                  <nr-option value=${m.value}>${m.label}</nr-option>
                `)}
              </nr-select>
              <span class="field-description">Caption formatting mode</span>
            </div>
          ` : nothing}
        ` : nothing}
      </div>
    ` : nothing}

    ${needsLocation ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Location</span>
        </div>
        <div class="config-field">
          <label>Latitude</label>
          <nr-input
            type="number"
            value=${String((config as any).latitude || '')}
            placeholder="e.g. 40.7128"
            @nr-input=${(e: CustomEvent) => onUpdate('latitude', e.detail.value)}
          ></nr-input>
        </div>
        <div class="config-field">
          <label>Longitude</label>
          <nr-input
            type="number"
            value=${String((config as any).longitude || '')}
            placeholder="e.g. -74.0060"
            @nr-input=${(e: CustomEvent) => onUpdate('longitude', e.detail.value)}
          ></nr-input>
        </div>
      </div>
    ` : nothing}

    ${needsMediaGroup ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Media Group</span>
          <span class="config-section-desc">JSON array of media objects</span>
        </div>
        <div class="config-field">
          <label>Media JSON</label>
          <nr-textarea
            value=${(config as any).mediaGroup || ''}
            placeholder='[{"type":"photo","media":"https://..."},{"type":"photo","media":"https://..."}]'
            rows="4"
            @nr-input=${(e: CustomEvent) => onUpdate('mediaGroup', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">JSON array of InputMediaPhoto, InputMediaVideo, etc.</span>
        </div>
      </div>
    ` : nothing}

    ${needsMessageId ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Message Reference</span>
        </div>
        <div class="config-field">
          <label>Message ID</label>
          <nr-input
            value=${(config as any).messageId || ''}
            placeholder="ID of the message to ${operation === 'editMessageText' ? 'edit' : operation === 'deleteMessage' ? 'delete' : 'pin/unpin'}"
            @nr-input=${(e: CustomEvent) => onUpdate('messageId', e.detail.value)}
          ></nr-input>
          <span class="field-description">Use \${messageId} to reference a dynamic value</span>
        </div>
      </div>
    ` : nothing}

    ${needsCallbackQueryId ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Callback Query</span>
        </div>
        <div class="config-field">
          <label>Callback Query ID</label>
          <nr-input
            value=${(config as any).callbackQueryId || ''}
            placeholder="\${callbackQueryId}"
            @nr-input=${(e: CustomEvent) => onUpdate('callbackQueryId', e.detail.value)}
          ></nr-input>
        </div>
        <div class="config-field">
          <label>Answer Text</label>
          <nr-input
            value=${(config as any).answerText || ''}
            placeholder="Optional text shown as notification"
            @nr-input=${(e: CustomEvent) => onUpdate('answerText', e.detail.value)}
          ></nr-input>
        </div>
        <div class="config-field">
          <label>Show Alert</label>
          <nr-switch
            ?checked=${(config as any).showAlert === true}
            @nr-change=${(e: CustomEvent) => onUpdate('showAlert', e.detail.checked)}
          ></nr-switch>
          <span class="field-description">Show answer as an alert instead of a notification</span>
        </div>
      </div>
    ` : nothing}

    ${needsChatAction ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">Chat Action</span>
        </div>
        <div class="config-field">
          <label>Action</label>
          <nr-select
            value=${(config as any).chatAction || 'typing'}
            @nr-change=${(e: CustomEvent) => onUpdate('chatAction', e.detail.value)}
          >
            ${CHAT_ACTIONS.map(a => html`
              <nr-option value=${a.value}>${a.label}</nr-option>
            `)}
          </nr-select>
          <span class="field-description">Action to broadcast to the chat</span>
        </div>
      </div>
    ` : nothing}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Options</span>
      </div>
      ${operation === 'sendMessage' ? html`
        <div class="config-field">
          <label>Reply To Message ID</label>
          <nr-input
            value=${(config as any).replyToMessageId || ''}
            placeholder="Leave empty for no reply"
            @nr-input=${(e: CustomEvent) => onUpdate('replyToMessageId', e.detail.value)}
          ></nr-input>
          <span class="field-description">Reply to a specific message (use \${messageId} for dynamic value)</span>
        </div>
        <div class="config-field">
          <label>Message Thread ID</label>
          <nr-input
            value=${(config as any).messageThreadId || ''}
            placeholder="For forum/topic groups"
            @nr-input=${(e: CustomEvent) => onUpdate('messageThreadId', e.detail.value)}
          ></nr-input>
          <span class="field-description">Send to a specific topic in a forum group</span>
        </div>
        <div class="config-field">
          <label>Inline Keyboard (JSON)</label>
          <nr-textarea
            value=${(config as any).replyMarkup || ''}
            placeholder='[[{"text":"Button 1","callback_data":"btn1"}],[{"text":"URL","url":"https://..."}]]'
            rows="4"
            @nr-input=${(e: CustomEvent) => onUpdate('replyMarkup', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">JSON array of button rows for an inline keyboard</span>
        </div>
        <div class="config-field">
          <label>Protect Content</label>
          <nr-switch
            ?checked=${(config as any).protectContent === true}
            @nr-change=${(e: CustomEvent) => onUpdate('protectContent', e.detail.checked)}
          ></nr-switch>
          <span class="field-description">Prevent forwarding and saving of the message</span>
        </div>
        <div class="config-field">
          <label>Show Typing</label>
          <nr-switch
            ?checked=${(config as any).showTyping !== false}
            @nr-change=${(e: CustomEvent) => onUpdate('showTyping', e.detail.checked)}
          ></nr-switch>
          <span class="field-description">Show "typing..." indicator before sending</span>
        </div>
        <div class="config-field">
          <label>Reaction Emoji</label>
          <nr-select
            value=${(config as any).reaction || ''}
            @nr-change=${(e: CustomEvent) => onUpdate('reaction', e.detail.value)}
          >
            ${REACTION_EMOJIS.map(r => html`
              <nr-option value=${r.value}>${r.label}</nr-option>
            `)}
          </nr-select>
          <span class="field-description">React to the incoming message (read acknowledgment)</span>
        </div>
      ` : nothing}
      <div class="config-field">
        <label>Disable Notification</label>
        <nr-switch
          ?checked=${(config as any).disableNotification === true}
          @nr-change=${(e: CustomEvent) => onUpdate('disableNotification', e.detail.checked)}
        ></nr-switch>
        <span class="field-description">Send message silently</span>
      </div>
    </div>
  `;
}
