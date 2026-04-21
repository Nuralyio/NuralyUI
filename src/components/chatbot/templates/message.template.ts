/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';
import { msg } from '@lit/localize';
import { ChatbotMessage, ChatbotLoadingType } from '../chatbot.types.js';
import { formatTimestamp } from '../utils/format.js';

// Import required components for template

export interface MessageTemplateHandlers {
  onRetry: (message: ChatbotMessage) => void;
  onRetryKeydown: (e: KeyboardEvent) => void;
  onCopy: (message: ChatbotMessage) => void;
  onCopyKeydown: (e: KeyboardEvent, message: ChatbotMessage) => void;
  onFileClick?: (file: any) => void;
}

/**
 * Parse and render error message with styled container
 */
function renderErrorMessage(text: string): TemplateResult {
  const errorMatch = text.match(/\[ERROR_START\]\[ERROR_TITLE_START\]([\s\S]*?)\[ERROR_TITLE_END\]([\s\S]*?)\[ERROR_END\]/);
  
  if (errorMatch) {
    const title = errorMatch[1];
    const description = errorMatch[2];
    
    return html`
      <div class="message__error-container" part="message-error">
        ${title ? html`<div class="message__error-title" part="message-error-title">${title}</div>` : ''}
        <div class="message__error-description" part="message-error-description">${description}</div>
      </div>
    `;
  }
  
  return html`${text}`;
}

/**
 * Format file size to human readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file is an image
 */
function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Derive a short extension label for non-image thumbnails
 */
function getFileExtension(name: string, mimeType: string): string {
  const dot = name.lastIndexOf('.');
  if (dot >= 0 && dot < name.length - 1) {
    return name.slice(dot + 1).toUpperCase().slice(0, 4);
  }
  if (mimeType) {
    const slash = mimeType.indexOf('/');
    if (slash >= 0) return mimeType.slice(slash + 1).toUpperCase().slice(0, 4);
  }
  return 'FILE';
}

/**
 * Renders a single message
 */
export function renderMessage(
  message: ChatbotMessage, 
  handlers: MessageTemplateHandlers
): TemplateResult {
  const isError = message.text?.includes('[ERROR_START]');
  const messageClasses = {
    error: !!message.error || isError,
    introduction: !!message.introduction,
    [message.sender]: true,
  };

  return html`
    <div
      class="message ${classMap(messageClasses)}"
      part="message"
      data-sender="${message.sender}"
      data-id="${message.id}"
    >
      <div class="message__content" part="message-content">
        ${isError
          ? renderErrorMessage(message.text?.trim() ?? '')
          : message?.metadata?.renderAsHtml
            ? unsafeHTML(message.text?.trim() ?? '')
            : unsafeHTML((message.text?.trim() ?? '').replaceAll('\n', '<br>'))
        }
      </div>
      ${message.files && message.files.length > 0 ? html`
        <div class="message__attachments" part="message-attachments" role="list" aria-label="${msg('Attached files')}">
          ${message.files.map((f) => html`
            <nr-dropdown
              trigger="hover"
              placement="top-end"
              size="small"
              class="message-file-preview-dropdown"
            >
              <div
                slot="trigger"
                class="file-thumb file-thumb--message"
                role="button"
                tabindex="0"
                title="${f.name}"
                @click=${() => handlers.onFileClick?.(f)}
              >
                ${isImageFile(f.mimeType) && (f.url || f.previewUrl) ? html`
                  <img
                    class="file-thumb__image"
                    src="${f.previewUrl || f.url}"
                    alt="${f.name}"
                  />
                ` : html`
                  <div class="file-thumb__ext" data-ext="${getFileExtension(f.name, f.mimeType)}">
                    <span class="file-thumb__ext-label">${getFileExtension(f.name, f.mimeType)}</span>
                  </div>
                `}
              </div>

              <div slot="content" class="message-file-preview-content">
                ${isImageFile(f.mimeType) && (f.url || f.previewUrl) ? html`
                  <img
                    src="${f.previewUrl || f.url}"
                    alt="${f.name}"
                    class="message-file-preview-image"
                  />
                ` : html`
                  <div class="file-preview-ext" data-ext="${getFileExtension(f.name, f.mimeType)}">
                    ${getFileExtension(f.name, f.mimeType)}
                  </div>
                `}
                <div class="message-file-preview-info">
                  <div class="message-file-preview-name" title="${f.name}">${f.name}</div>
                  <div class="message-file-preview-details">
                    <span>${formatFileSize(f.size)}</span>
                  </div>
                </div>
              </div>
            </nr-dropdown>
          `)}
        </div>
      ` : nothing}
      <div class="message__footer" part="message-footer">
        <div class="message__timestamp" part="message-timestamp">
          ${formatTimestamp(message.timestamp)}
        </div>
        <nr-icon
          name="copy"
          size="small"
          color="#9ca3af"
          class="message__copy"
          @click=${() => handlers.onCopy(message)}
          @keydown=${(e: KeyboardEvent) => handlers.onCopyKeydown(e, message)}
          title="${msg('Copy message')}"
          aria-label="${msg('Copy message')}"
          role="button"
          tabindex="0"
        ></nr-icon>
      </div>
      ${message.error
        ? html`
          <nr-button 
            type="secondary"
            size="small"
            class="message__retry" 
            part="retry-button"
            @click=${() => handlers.onRetry(message)}
            @keydown=${handlers.onRetryKeydown}
            aria-label="${msg('Retry message')}"
          >
            ${msg('Retry')}
          </nr-button>`
        : nothing}
    </div>
  `;
}

/**
 * Renders bot typing indicator
 */
export function renderBotTypingIndicator(
  isTyping: boolean,
  loadingIndicator: ChatbotLoadingType,
  loadingText?: string
): TemplateResult | typeof nothing {
  if (!isTyping) return nothing;

  const indicatorContent = loadingIndicator === ChatbotLoadingType.Dots
    ? html`
        <div class="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `
    : html`<div class="spinner"></div>`;

  return html`
    <div class="message bot loading" part="typing-indicator">
      <div class="message__content">
        ${indicatorContent}
        ${loadingText ? html`<span class="loading-text">${loadingText.split('').map((char, i) =>
          html`<span class="loading-text__char" style="animation-delay:${i * 0.04}s">${char === ' ' ? '\u00A0' : char}</span>`
        )}</span>` : nothing}
      </div>
    </div>
  `;
}

/**
 * Renders empty state
 */
export function renderEmptyState(): TemplateResult {
  return html`
    <div class="empty-state" part="empty-state">
      <slot name="empty-state">
        <div class="empty-state__content">
          ${msg('Start a conversation')}
        </div>
      </slot>
    </div>
  `;
}

/**
 * Renders messages container with all messages
 */
export function renderMessages(
  messages: ChatbotMessage[],
  suggestions: TemplateResult | typeof nothing,
  typingIndicator: TemplateResult | typeof nothing,
  messageHandlers: MessageTemplateHandlers
): TemplateResult {
  return html`
    <div class="messages" part="messages">
      ${messages.length === 0 ? renderEmptyState() : nothing}
      ${messages.map((message) => renderMessage(message, messageHandlers))}
      ${suggestions}
      ${typingIndicator}
    </div>
  `;
}
