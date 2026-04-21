/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { msg } from '@lit/localize';
import { ChatbotThread } from '../chatbot.types.js';
import { formatTimestamp } from '../utils/format.js';


export interface ThreadSidebarTemplateHandlers {
  onCreateNew: () => void;
  onSelectThread: (threadId: string) => void;
  onDeleteThread?: (threadId: string) => void;
  onRenameThread?: (threadId: string, newTitle: string) => void;
  onBookmarkThread?: (threadId: string) => void;
}

export interface ThreadSidebarTemplateData {
  threads: ChatbotThread[];
  activeThreadId?: string;
  editingThreadId?: string;
}

function renderThreadItem(
  thread: ChatbotThread,
  data: ThreadSidebarTemplateData,
  handlers: ThreadSidebarTemplateHandlers
): TemplateResult {
  const lastMessage = thread.messages.length > 0
    ? thread.messages[thread.messages.length - 1]
    : null;
  const previewText = lastMessage && typeof lastMessage.text === 'string'
    ? lastMessage.text
    : '';

  return html`
    <div
      class="thread-item ${classMap({
        'thread-item--active': thread.id === data.activeThreadId
      })}"
      @click=${() => handlers.onSelectThread(thread.id)}
      part="thread-item"
    >
      <div class="thread-item__header">
        ${data.editingThreadId === thread.id && handlers.onRenameThread ? html`
          <input
            class="thread-item__rename-input"
            type="text"
            .value=${thread.title || ''}
            @click=${(e: Event) => e.stopPropagation()}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                const value = input.value.trim();
                if (value) handlers.onRenameThread!(thread.id, value);
              }
              if (e.key === 'Escape') {
                handlers.onRenameThread!(thread.id, thread.title || '');
              }
            }}
            @blur=${(e: FocusEvent) => {
              const input = e.target as HTMLInputElement;
              const value = input.value.trim();
              if (value && value !== thread.title) {
                handlers.onRenameThread!(thread.id, value);
              } else {
                handlers.onRenameThread!(thread.id, thread.title || '');
              }
            }}
          />
        ` : html`
          <div class="thread-item__title">${thread.title || msg('New Chat')}</div>
        `}
        <div class="thread-item__actions">
          ${handlers.onBookmarkThread && thread.bookmarked ? html`
            <button
              class="thread-item__action-btn thread-item__bookmark--active"
              title="${msg('Remove bookmark')}"
              @click=${(e: Event) => {
                e.stopPropagation();
                handlers.onBookmarkThread!(thread.id);
              }}
              part="thread-bookmark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          ` : ''}
          ${data.editingThreadId !== thread.id && (handlers.onRenameThread || handlers.onBookmarkThread || handlers.onDeleteThread) ? html`
            <nr-dropdown
              trigger="click"
              placement="bottom-end"
              size="small"
              auto-close
              @click=${(e: Event) => e.stopPropagation()}
              @nr-dropdown-item-click=${(e: CustomEvent) => {
                const id = e.detail?.item?.id;
                if (id === 'rename' && handlers.onRenameThread) {
                  (e.target as HTMLElement).dispatchEvent(
                    new CustomEvent('nr-thread-edit', {
                      bubbles: true,
                      composed: true,
                      detail: { threadId: thread.id }
                    })
                  );
                } else if (id === 'bookmark' && handlers.onBookmarkThread) {
                  handlers.onBookmarkThread(thread.id);
                } else if (id === 'delete' && handlers.onDeleteThread) {
                  handlers.onDeleteThread(thread.id);
                }
              }}
              .items=${[
                ...(handlers.onRenameThread ? [{ id: 'rename', label: msg('Rename') }] : []),
                ...(handlers.onBookmarkThread ? [{ id: 'bookmark', label: thread.bookmarked ? msg('Remove bookmark') : msg('Bookmark') }] : []),
                ...(handlers.onDeleteThread ? [{ id: 'delete', label: msg('Delete') }] : []),
              ]}
            >
              <button
                slot="trigger"
                class="thread-item__action-btn thread-item__menu"
                title="${msg('More options')}"
                part="thread-menu"
                aria-label="${msg('More options')}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>
              </button>
            </nr-dropdown>
          ` : ''}
        </div>
      </div>
      <div class="thread-item__preview">
        ${previewText}
      </div>
      <div class="thread-item__timestamp">${formatTimestamp(thread.updatedAt)}</div>
    </div>
  `;
}

/**
 * Renders thread sidebar
 */
export function renderThreadSidebar(
  data: ThreadSidebarTemplateData,
  handlers: ThreadSidebarTemplateHandlers
): TemplateResult {
  const bookmarkedThreads = data.threads.filter(t => t.bookmarked);
  const regularThreads = data.threads.filter(t => !t.bookmarked);

  return html`
    <div class="thread-sidebar" part="thread-sidebar">
      <div class="thread-sidebar__header">
        <h3>${msg('Conversations')}</h3>
      </div>

      <div class="thread-list">
        ${bookmarkedThreads.length > 0 ? html`
          <div class="thread-section" part="thread-section-bookmarks">
            <div class="thread-section__label">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              ${msg('Bookmarks')}
            </div>
            ${repeat(bookmarkedThreads, t => t.id, t => renderThreadItem(t, data, handlers))}
          </div>
        ` : nothing}
        ${regularThreads.length > 0 || bookmarkedThreads.length === 0 ? html`
          ${bookmarkedThreads.length > 0 ? html`
            <div class="thread-section__label">${msg('All Conversations')}</div>
          ` : nothing}
          ${repeat(regularThreads, t => t.id, t => renderThreadItem(t, data, handlers))}
          ${regularThreads.length === 0 && bookmarkedThreads.length === 0 ? html`
            <p class="empty-msg">${msg('No conversations yet')}</p>
          ` : nothing}
        ` : nothing}
      </div>

      <slot name="thread-sidebar"></slot>
    </div>
  `;
}
