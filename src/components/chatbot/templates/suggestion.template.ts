/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ChatbotSuggestion, ChatbotI18n } from '../chatbot.types.js';

export interface SuggestionTemplateHandlers {
  onClick: (suggestion: ChatbotSuggestion) => void;
  onKeydown: (e: KeyboardEvent) => void;
}

export function renderSuggestion(
  suggestion: ChatbotSuggestion,
  handlers: SuggestionTemplateHandlers,
  i18n: ChatbotI18n
): TemplateResult {
  return html`
    <div
      class="suggestion ${classMap({ 'suggestion--disabled': suggestion.enabled === false })}"
      part="suggestion"
      role="button"
      tabindex="0"
      @click=${() => handlers.onClick(suggestion)}
      @keydown=${handlers.onKeydown}
      data-id="${suggestion.id}"
      aria-label="${i18n.messages.suggestionPrefix}${suggestion.text}"
    >
      ${suggestion.text}
    </div>
  `;
}

export function renderSuggestions(
  _chatStarted: boolean,
  suggestions: ChatbotSuggestion[],
  handlers: SuggestionTemplateHandlers,
  i18n: ChatbotI18n
): TemplateResult | typeof nothing {
  return suggestions.length > 0
    ? html`
        <div class="suggestion-container" part="suggestions">
          ${suggestions.map((suggestion) =>
            renderSuggestion(suggestion, handlers, i18n)
          )}
        </div>
      `
    : nothing;
}
