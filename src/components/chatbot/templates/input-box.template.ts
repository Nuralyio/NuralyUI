/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ChatbotFile, ChatbotI18n } from '../chatbot.types.js';
import type { AudioRecordingState } from '../chatbot-audio.controller.js';
import { DropdownItem } from '../../dropdown/dropdown.types.js';
import { SelectOption } from '../../select/select.types.js';
import { isTextualFile, loadTextualContent } from '../utils/textual-file.js';


export interface InputBoxTemplateHandlers {
  onInput: (e: Event) => void;
  onKeydown: (e: KeyboardEvent) => void;
  onFocus: (e: FocusEvent) => void;
  onBlur: (e: FocusEvent) => void;
  onSend: () => void;
  onStop: () => void;
  onSendKeydown: (e: KeyboardEvent) => void;
  onFileDropdownClick: (e: CustomEvent) => void;
  onModuleChange: (e: CustomEvent) => void;
  onFileRemove: (fileId: string) => void;
  onFileClick?: (file: ChatbotFile) => void;
  onAudioStart?: (mode: 'transcribe' | 'message') => void;
  onAudioCancel?: () => void;
  onAudioSend?: () => void;
}

export interface InputBoxTemplateData {
  placeholder: string;
  disabled: boolean;
  currentInput: string;
  uploadedFiles: ChatbotFile[];
  isQueryRunning: boolean;
  showSendButton: boolean;
  enableFileUpload: boolean;
  fileUploadItems: DropdownItem[];
  attachIcon?: string;
  enableModuleSelection: boolean;
  moduleOptions: SelectOption[];
  selectedModules: string[];
  moduleSelectionLabel: string;
  renderModuleDisplay: () => TemplateResult;
  showAudioButton: boolean;
  audioRecording: AudioRecordingState;
  audioMode: 'transcribe' | 'message';
  i18n: ChatbotI18n;
}

/**
 * Renders thumbnail chips for uploaded files (image thumb for images,
 * extension badge for other file types). While a file is uploading, a
 * spinner overlay is shown on top of the thumbnail.
 */
function renderContextTags(
  files: ChatbotFile[],
  onRemove: (id: string) => void,
  i18n: ChatbotI18n,
  onFileClick?: (file: ChatbotFile) => void
): TemplateResult {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getExtension = (name: string, mimeType: string): string => {
    const dot = name.lastIndexOf('.');
    if (dot >= 0 && dot < name.length - 1) {
      return name.slice(dot + 1).toUpperCase().slice(0, 4);
    }
    if (mimeType) {
      const slash = mimeType.indexOf('/');
      if (slash >= 0) return mimeType.slice(slash + 1).toUpperCase().slice(0, 4);
    }
    return 'FILE';
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  const renderRemoveButton = (f: ChatbotFile) => html`
    <button
      type="button"
      class="file-pill__remove"
      part="file-pill-remove"
      aria-label="${i18n.input.removeFileLabel}"
      title="${i18n.input.removeFileLabel}"
      @click=${(e: Event) => { e.stopPropagation(); onRemove(f.id); }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <line x1="6" y1="6" x2="18" y2="18"/>
        <line x1="6" y1="18" x2="18" y2="6"/>
      </svg>
    </button>
  `;

  const FILE_ICON_SVG = html`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;

  const renderTextualPill = (f: ChatbotFile) => {
    const meta = loadTextualContent(f).then((r) => {
      const sub = 'error' in r ? formatFileSize(f.size) : `${r.lineCount} lines · ${formatFileSize(f.size)}`;
      return html`<span class="file-pill__sub" part="file-pill-sub">${sub}</span>`;
    });
    return html`
      <div
        class="file-pill ${f.isUploading ? 'file-pill--uploading' : ''}"
        part="file-pill"
        role="button"
        tabindex="0"
        title="${f.name}"
        @click=${() => onFileClick?.(f)}
      >
        <span class="file-pill__icon" part="file-pill-icon">${FILE_ICON_SVG}</span>
        <div class="file-pill__text">
          <span class="file-pill__name" part="file-pill-name">${f.name}</span>
          ${until(meta, html`<span class="file-pill__sub" part="file-pill-sub">${formatFileSize(f.size)}</span>`)}
        </div>
        ${f.isUploading ? html`
          <span class="file-pill__spinner" part="file-pill-spinner" aria-label="${i18n.input.uploadingLabel}">
            <span class="file-pill__spinner-ring"></span>
          </span>
        ` : ''}
        ${renderRemoveButton(f)}
      </div>
    `;
  };

  return html`
    <div class="context-tags-row" part="context-tags">
      ${repeat(files, f => f.id, f => isTextualFile(f) ? renderTextualPill(f) : html`
        <nr-dropdown
          trigger="hover"
          placement="top"
          size="small"
          class="file-preview-dropdown"
        >
          <div
            slot="trigger"
            class="file-thumb ${f.isUploading ? 'file-thumb--uploading' : ''}"
            part="file-thumb"
            role="button"
            tabindex="0"
            title="${f.name}"
            @click=${() => onFileClick?.(f)}
          >
            ${isImage(f.mimeType) && (f.previewUrl || f.url) ? html`
              <img
                class="file-thumb__image"
                part="file-thumb-image"
                src="${f.previewUrl || f.url}"
                alt="${f.name}"
              />
            ` : html`
              <div class="file-thumb__ext" part="file-thumb-ext" data-ext="${getExtension(f.name, f.mimeType)}">
                <span class="file-thumb__ext-label" part="file-thumb-ext-label">${getExtension(f.name, f.mimeType)}</span>
              </div>
            `}
            ${f.isUploading ? html`
              <div class="file-thumb__spinner" part="file-thumb-spinner" aria-label="${i18n.input.uploadingLabel}">
                <span class="file-thumb__spinner-ring"></span>
              </div>
            ` : ''}
            <button
              type="button"
              class="file-thumb__remove"
              part="file-thumb-remove"
              aria-label="${i18n.input.removeFileLabel}"
              title="${i18n.input.removeFileLabel}"
              @click=${(e: Event) => { e.stopPropagation(); onRemove(f.id); }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                <line x1="6" y1="6" x2="18" y2="18"/>
                <line x1="6" y1="18" x2="18" y2="6"/>
              </svg>
            </button>
          </div>

          <div slot="content" class="file-preview-content">
            ${isImage(f.mimeType) && (f.url || f.previewUrl) ? html`
              <img
                src="${f.previewUrl || f.url}"
                alt="${f.name}"
                class="file-preview-image"
              />
            ` : html`
              <div class="file-preview-ext" data-ext="${getExtension(f.name, f.mimeType)}">
                ${getExtension(f.name, f.mimeType)}
              </div>
            `}
            <div class="file-preview-info">
              <div class="file-preview-name" title="${f.name}">${f.name}</div>
              <div class="file-preview-details">
                <span>${formatFileSize(f.size)}</span>
                ${f.isUploading ? html`<span> · ${i18n.input.uploadingProgress}</span>` : ''}
              </div>
            </div>
          </div>
        </nr-dropdown>
      `)}
    </div>
  `;
}

/**
 * Renders file upload button
 */
function renderFileUploadButton(
  data: InputBoxTemplateData,
  handlers: InputBoxTemplateHandlers
): TemplateResult {
  return html`
    <nr-dropdown
      .items=${data.fileUploadItems}
      trigger="click"
      placement="top-start"
      size="small"
      auto-close
      ?disabled=${data.disabled}
      @nr-dropdown-item-click=${handlers.onFileDropdownClick}
    >
      <nr-button
        slot="trigger"
        part="file-button"
        type="default"
        size="small"
        .icon=${[data.attachIcon ?? "paperclip"]}
        ?disabled=${data.disabled}
        aria-label="${data.i18n.input.attachFilesAriaLabel}"
        title="${data.i18n.input.attachFilesAriaLabel}"
      >
        ${data.i18n.input.attachButton}
      </nr-button>
    </nr-dropdown>
  `;
}

/**
 * Renders module selector
 */
function renderModuleSelector(
  data: InputBoxTemplateData,
  handlers: InputBoxTemplateHandlers
): TemplateResult {
  return html`
    <nr-select
      .options=${data.moduleOptions}
      .value=${data.selectedModules}
      multiple
      placeholder="${data.moduleSelectionLabel}"
      size="small"
      ?disabled=${data.disabled}
      searchable
      search-placeholder="${data.i18n.modules.moduleSearchPlaceholder}"
      use-custom-selected-display
      part="module-select"
      class="module-select"
      @nr-change=${handlers.onModuleChange}
      aria-label="${data.i18n.modules.moduleSelectAriaLabel}"
    >
      <span slot="selected-display">
        ${data.renderModuleDisplay()}
      </span>
    </nr-select>
  `;
}

/**
 * Renders send/stop button
 */
function renderSendButton(
  data: InputBoxTemplateData,
  handlers: InputBoxTemplateHandlers
): TemplateResult {
  return html`
    <nr-button 
      class="input-box__send-button" 
      part="send-button"
      type="default"
      size="small"
      .iconRight=${data.isQueryRunning ? 'square' : 'arrow-up'}
      @click=${data.isQueryRunning ? handlers.onStop : handlers.onSend}
      @keydown=${handlers.onSendKeydown}
      aria-label="${data.isQueryRunning ? data.i18n.send.stopQueryLabel : data.i18n.send.sendMessageLabel}"
      title="${data.isQueryRunning ? data.i18n.send.stopQueryLabel : data.i18n.send.sendMessageLabel}"
    >
      ${data.isQueryRunning ? data.i18n.send.stopButton : data.i18n.send.sendButton}
    </nr-button>
  `;
}

/**
 * Renders the live recording bar (replaces input row while recording).
 * The send button icon/title differs by mode:
 *   transcribe → keyboard icon (converts speech to text in the input)
 *   message    → send arrow  (sends as an audio attachment)
 */
function renderRecordingBar(
  data: InputBoxTemplateData,
  handlers: InputBoxTemplateHandlers
): TemplateResult {
  const { duration, bars } = data.audioRecording;
  const isTranscribe = data.audioMode === 'transcribe';
  const sendTitle = isTranscribe ? data.i18n.audio.convertToTextLabel : data.i18n.audio.sendAsVoiceMessageLabel;
  const sendIcon = isTranscribe
    ? html`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        <path d="M7 10h2l2 3 2-6 2 3h2"/>
      </svg>`
    : html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
      </svg>`;

  return html`
    <div class="audio-recording-bar" part="audio-recording-bar">
      <button
        class="audio-rec-cancel"
        part="audio-cancel-button"
        title="${data.i18n.audio.cancelRecordingLabel}"
        @click=${handlers.onAudioCancel}
        aria-label="${data.i18n.audio.cancelRecordingLabel}"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>

      <div class="audio-rec-indicator" part="audio-indicator">
        <span class="audio-rec-dot" part="audio-dot"></span>
        <div class="audio-rec-wave" part="audio-wave">
          ${bars.map(v => html`
            <div class="audio-rec-bar" part="audio-bar" style=${styleMap({ height: `${Math.round(v * 24)}px` })}></div>
          `)}
        </div>
        <span class="audio-rec-time" part="audio-time">${duration}</span>
      </div>

      <span class="audio-rec-mode-label" part="audio-mode-label">
        ${isTranscribe ? data.i18n.audio.speechToTextLabel : data.i18n.audio.voiceMessageLabel}
      </span>

      <button
        class="audio-rec-send ${isTranscribe ? 'audio-rec-send--transcribe' : ''}"
        part="audio-send-button"
        title="${sendTitle}"
        @click=${handlers.onAudioSend}
        aria-label="${sendTitle}"
      >
        ${sendIcon}
      </button>
    </div>
  `;
}

/**
 * Renders action buttons row
 */
function renderActionButtons(
  data: InputBoxTemplateData,
  handlers: InputBoxTemplateHandlers
): TemplateResult {
  return html`
    <div class="action-buttons-row" part="actions">
      <div class="action-buttons-left" part="actions-left">
        ${data.enableFileUpload ? renderFileUploadButton(data, handlers) : nothing}
        ${data.enableModuleSelection && data.moduleOptions.length > 0
          ? renderModuleSelector(data, handlers)
          : nothing}
      </div>

      <div class="action-buttons-right" part="actions-right">
        ${data.showAudioButton && !data.isQueryRunning ? html`
          <!-- Speech-to-text: mic + keyboard indicator -->
          <button
            class="audio-mic-btn"
            part="audio-mic-button audio-mic-transcribe"
            title="${data.i18n.audio.recordSpeechLabel}"
            ?disabled=${data.disabled}
            @click=${() => handlers.onAudioStart?.('transcribe')}
            aria-label="${data.i18n.audio.recordSpeechLabel}"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
            </svg>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="audio-mic-badge">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M7 12h2l2 3 2-5 2 2h2"/>
            </svg>
          </button>
          <!-- Voice message: mic + waveform indicator -->
          <button
            class="audio-mic-btn"
            part="audio-mic-button audio-mic-voice"
            title="${data.i18n.audio.sendVoiceMessageLabel}"
            ?disabled=${data.disabled}
            @click=${() => handlers.onAudioStart?.('message')}
            aria-label="${data.i18n.audio.sendVoiceMessageLabel}"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
              <path d="M19 10v2a7 7 0 01-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
            </svg>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="audio-mic-badge">
              <path d="M2 12h2M6 8h2M10 6h2M14 8h2M18 12h2M22 12h2"/>
            </svg>
          </button>
        ` : nothing}
        ${data.showSendButton && (!data.disabled || data.isQueryRunning) &&
          (data.currentInput.trim() || data.uploadedFiles.length > 0 || data.isQueryRunning)
          ? renderSendButton(data, handlers)
          : nothing}
      </div>
    </div>
  `;
}

/**
 * Renders the complete input box
 */
export function renderInputBox(
  data: InputBoxTemplateData,
  handlers: InputBoxTemplateHandlers
): TemplateResult {
  if (data.audioRecording.active) {
    return html`
      <div class="input-box" part="input-box">
        <div class="input-container" part="input-container">
          ${renderRecordingBar(data, handlers)}
        </div>
      </div>
    `;
  }

  return html`
    <div class="input-box" part="input-box">
      <div class="input-container" part="input-container">
        <!-- Context tags -->
        ${data.uploadedFiles.length > 0
          ? renderContextTags(data.uploadedFiles, handlers.onFileRemove, data.i18n, handlers.onFileClick)
          : nothing}

        <!-- Input area -->
        <div class="input-row" part="input-row">
          <div
            class="input-box__input"
            part="input"
            contenteditable="true"
            role="textbox"
            aria-multiline="true"
            aria-label="${data.i18n.input.chatInputAriaLabel}"
            data-placeholder="${data.placeholder}"
            @input=${handlers.onInput}
            @keydown=${handlers.onKeydown}
            @focus=${handlers.onFocus}
            @blur=${handlers.onBlur}
          ></div>
        </div>

        <!-- Action buttons -->
        ${renderActionButtons(data, handlers)}
      </div>
    </div>
  `;
}
