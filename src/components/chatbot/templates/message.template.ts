/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';
import { ChatbotMessage, ChatbotFile, ChatbotLoadingType, ChatbotI18n } from '../chatbot.types.js';
import { formatTimestamp } from '../utils/format.js';
import {
  isTextualFile,
  loadTextualContent,
  snippetOf,
  SNIPPET_COMPACT_THRESHOLD,
} from '../utils/textual-file.js';

// Import required components for template

export interface MessageTemplateHandlers {
  onRetry: (message: ChatbotMessage) => void;
  onRetryKeydown: (e: KeyboardEvent) => void;
  onCopy: (message: ChatbotMessage) => void;
  onCopyKeydown: (e: KeyboardEvent, message: ChatbotMessage) => void;
  onFileClick?: (file: any) => void;
  collapseThreshold?: number;
  isExpanded?: (id: string) => boolean;
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

const FILE_ICON_SVG = html`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;

function renderBinaryFileThumb(
  f: ChatbotFile,
  handlers: MessageTemplateHandlers,
  i18n: ChatbotI18n
): TemplateResult {
  void i18n;
  return html`
    <nr-dropdown trigger="hover" placement="top-end" size="small" class="message-file-preview-dropdown">
      <div
        slot="trigger"
        class="file-thumb file-thumb--message"
        role="button"
        tabindex="0"
        title="${f.name}"
        @click=${() => handlers.onFileClick?.(f)}
      >
        ${isImageFile(f.mimeType) && (f.url || f.previewUrl) ? html`
          <img class="file-thumb__image" src="${f.previewUrl || f.url}" alt="${f.name}"/>
        ` : html`
          <div class="file-thumb__ext" data-ext="${getFileExtension(f.name, f.mimeType)}">
            <span class="file-thumb__ext-label">${getFileExtension(f.name, f.mimeType)}</span>
          </div>
        `}
      </div>
      <div slot="content" class="message-file-preview-content">
        ${isImageFile(f.mimeType) && (f.url || f.previewUrl) ? html`
          <img src="${f.previewUrl || f.url}" alt="${f.name}" class="message-file-preview-image"/>
        ` : html`
          <div class="file-preview-ext" data-ext="${getFileExtension(f.name, f.mimeType)}">
            ${getFileExtension(f.name, f.mimeType)}
          </div>
        `}
        <div class="message-file-preview-info">
          <div class="message-file-preview-name" title="${f.name}">${f.name}</div>
          <div class="message-file-preview-details"><span>${formatFileSize(f.size)}</span></div>
        </div>
      </div>
    </nr-dropdown>
  `;
}

function renderTextualSnippetCard(
  f: ChatbotFile,
  handlers: MessageTemplateHandlers
): TemplateResult {
  const onActivate = () => handlers.onFileClick?.(f);
  const onKeyActivate = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlers.onFileClick?.(f);
    }
  };

  const placeholder = html`
    <div
      class="text-snippet-card text-snippet-card--loading"
      part="text-snippet-card"
      role="button"
      tabindex="0"
      title="${f.name}"
      @click=${onActivate}
      @keydown=${onKeyActivate}
    >
      <div class="text-snippet-card__header" part="text-snippet-header">
        <span class="text-snippet-card__icon" part="text-snippet-icon">${FILE_ICON_SVG}</span>
        <div class="text-snippet-card__meta">
          <div class="text-snippet-card__name" part="text-snippet-name">${f.name}</div>
          <div class="text-snippet-card__sub" part="text-snippet-sub">${formatFileSize(f.size)}</div>
        </div>
      </div>
    </div>
  `;

  const content = loadTextualContent(f).then((r) => {
    if ('error' in r) {
      return html`
        <div
          class="text-snippet-card text-snippet-card--error"
          part="text-snippet-card"
          role="button"
          tabindex="0"
          title="${f.name}"
          @click=${onActivate}
          @keydown=${onKeyActivate}
        >
          <div class="text-snippet-card__header" part="text-snippet-header">
            <span class="text-snippet-card__icon" part="text-snippet-icon">${FILE_ICON_SVG}</span>
            <div class="text-snippet-card__meta">
              <div class="text-snippet-card__name" part="text-snippet-name">${f.name}</div>
              <div class="text-snippet-card__sub" part="text-snippet-sub">${formatFileSize(f.size)}</div>
            </div>
          </div>
        </div>
      `;
    }
    const compact = r.lineCount <= SNIPPET_COMPACT_THRESHOLD;
    const snippet = compact ? '' : snippetOf(r.text);
    return html`
      <div
        class="text-snippet-card ${compact ? 'text-snippet-card--compact' : ''}"
        part="text-snippet-card"
        role="button"
        tabindex="0"
        title="${f.name}"
        @click=${onActivate}
        @keydown=${onKeyActivate}
      >
        <div class="text-snippet-card__header" part="text-snippet-header">
          <span class="text-snippet-card__icon" part="text-snippet-icon">${FILE_ICON_SVG}</span>
          <div class="text-snippet-card__meta">
            <div class="text-snippet-card__name" part="text-snippet-name">${f.name}</div>
            <div class="text-snippet-card__sub" part="text-snippet-sub">${r.lineCount} lines · ${formatFileSize(f.size)}</div>
          </div>
        </div>
        ${compact ? nothing : html`
          <pre class="text-snippet-card__snippet" part="text-snippet-snippet">${snippet}<span class="text-snippet-card__fade" part="text-snippet-fade"></span></pre>
        `}
      </div>
    `;
  });

  return html`${until(content, placeholder)}`;
}

/**
 * Renders a single message
 */
export function renderMessage(
  message: ChatbotMessage,
  handlers: MessageTemplateHandlers,
  i18n: ChatbotI18n
): TemplateResult {
  const isError = message.text?.includes('[ERROR_START]');
  const messageClasses = {
    error: !!message.error || isError,
    introduction: !!message.introduction,
    [message.sender]: true,
  };

  const role = message.sender;
  const rawText = message.text?.trim() ?? '';
  const threshold = handlers.collapseThreshold ?? 0;
  const collapsible = role === 'user' && !isError && threshold > 0 && rawText.length > threshold;
  const expanded = collapsible ? !!handlers.isExpanded?.(message.id) : true;
  const innerContent = isError
    ? renderErrorMessage(rawText)
    : message?.metadata?.renderAsHtml
      ? unsafeHTML(rawText)
      : unsafeHTML(rawText.replaceAll('\n', '<br>'));
  return html`
    <div
      class="message ${classMap(messageClasses)}"
      part=${`message message-${role}`}
      data-sender="${message.sender}"
      data-id="${message.id}"
    >
      <div class="message__content" part=${`message-content message-content-${role}`}>
        ${collapsible ? html`
          <div
            class="message__text-collapsible ${expanded ? 'message__text-collapsible--expanded' : ''}"
            part="message-text-collapsible"
          >
            <div class="message__text-inner">${innerContent}</div>
          </div>
          <button
            class="message__show-more-toggle"
            part="message-show-more"
            type="button"
            data-message-toggle="${message.id}"
            aria-expanded="${expanded ? 'true' : 'false'}"
          >${expanded ? i18n.messages.showLessLabel : i18n.messages.showMoreLabel}</button>
        ` : innerContent}
      </div>
      ${message.files && message.files.length > 0 ? html`
        <div class="message__attachments" part="message-attachments" role="list" aria-label="${i18n.messages.attachedFilesLabel}">
          ${message.files.map((f) => isTextualFile(f)
            ? renderTextualSnippetCard(f, handlers)
            : renderBinaryFileThumb(f, handlers, i18n))}
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
          part="message-copy"
          @click=${() => handlers.onCopy(message)}
          @keydown=${(e: KeyboardEvent) => handlers.onCopyKeydown(e, message)}
          title="${i18n.messages.copyMessageLabel}"
          aria-label="${i18n.messages.copyMessageLabel}"
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
            aria-label="${i18n.messages.retryMessageLabel}"
          >
            ${i18n.messages.retryButton}
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
        <div class="dots" part="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `
    : html`<div class="spinner" part="typing-spinner"></div>`;

  return html`
    <div class="message bot loading" part="typing-indicator">
      <div class="message__content" part="typing-content">
        ${indicatorContent}
        ${loadingText ? html`<span class="loading-text" part="typing-text">${loadingText.split('').map((char, i) =>
          html`<span class="loading-text__char" style="animation-delay:${i * 0.04}s">${char === ' ' ? '\u00A0' : char}</span>`
        )}</span>` : nothing}
      </div>
    </div>
  `;
}

export function renderEmptyState(i18n: ChatbotI18n, welcomeMessage?: string): TemplateResult {
  const heading = welcomeMessage ?? i18n.messages.startConversationLabel;
  return html`
    <div class="empty-state" part="empty-state">
      <slot name="empty-state">
        <div class="empty-state__content" part="empty-state-content">
          ${heading}
        </div>
      </slot>
    </div>
  `;
}

export function renderThreadLoading(i18n: ChatbotI18n): TemplateResult {
  return html`
    <div class="empty-state empty-state--loading" part="empty-state thread-loading">
      <slot name="thread-loading">
        <div class="spinner" part="thread-loading-spinner"></div>
        <div class="empty-state__content" part="empty-state-content">
          ${i18n.messages.loadingConversationLabel}
        </div>
      </slot>
    </div>
  `;
}

export function renderMessages(
  messages: ChatbotMessage[],
  suggestions: TemplateResult | typeof nothing,
  typingIndicator: TemplateResult | typeof nothing,
  messageHandlers: MessageTemplateHandlers,
  i18n: ChatbotI18n,
  welcomeMessage?: string,
  isPendingThread?: boolean,
  invertedScroll?: boolean
): TemplateResult {
  const emptyContent = messages.length === 0
    ? isPendingThread
      ? renderThreadLoading(i18n)
      : renderEmptyState(i18n, welcomeMessage)
    : nothing;
  const renderMsg = (m: ChatbotMessage) => renderMessage(m, messageHandlers, i18n);
  if (invertedScroll) {
    const reversed = [...messages].reverse();
    return html`
      <div class="messages messages--inverted" part="messages">
        ${typingIndicator}
        ${suggestions}
        ${repeat(reversed, (m) => m.id, renderMsg)}
        ${emptyContent}
      </div>
    `;
  }
  return html`
    <div class="messages" part="messages">
      ${emptyContent}
      ${repeat(messages, (m) => m.id, renderMsg)}
      ${suggestions}
      ${typingIndicator}
    </div>
  `;
}
