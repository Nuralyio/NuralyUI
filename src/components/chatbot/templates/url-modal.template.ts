/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult, nothing } from 'lit';
import { ChatbotI18n } from '../chatbot.types.js';


export interface UrlModalTemplateHandlers {
  onClose: () => void;
  onUrlInputChange: (e: Event) => void;
  onUrlInputKeydown: (e: KeyboardEvent) => void;
  onConfirm: () => void;
  onAttachFile: () => void;
}

export interface UrlModalTemplateData {
  isOpen: boolean;
  urlInput: string;
  isLoading?: boolean;
  error?: string;
  selectedFileName?: string;
  i18n: ChatbotI18n;
}

export function renderUrlModal(
  data: UrlModalTemplateData,
  handlers: UrlModalTemplateHandlers
): TemplateResult {
  return html`
    <nr-modal
      ?open=${data.isOpen}
      @nr-modal-close=${handlers.onClose}
      part="url-modal"
    >
      <div slot="header">${data.i18n.urlModal.addUrlTitle}</div>

      <div >
        <nr-row gutter="8" align="bottom">
          <nr-col span="20" >
            <nr-input

              type="url"
              .value=${data.urlInput}
              placeholder="${data.i18n.urlModal.urlPlaceholder}"
              ?disabled=${data.isLoading}
              @nr-input=${handlers.onUrlInputChange}
              @keydown=${handlers.onUrlInputKeydown}
            >
              <nr-label slot="label">${data.i18n.urlModal.urlLabel}</nr-label>
            </nr-input>
          </nr-col>
          <nr-col span="4" >
            <nr-button
              type="default"
              .icon=${['paperclip']}
              size="small"
              ?disabled=${data.isLoading}
              @click=${handlers.onAttachFile}
              title="${data.i18n.urlModal.loadFromUrlLabel}"
              style="margin-left: 0.5rem;"
            >
            </nr-button>
          </nr-col>
        </nr-row>

        ${data.error ? html`
          <nr-alert
            type="error"
            closable
            style="margin-top: 1rem;"
          >
            ${data.error}
          </nr-alert>
        ` : nothing}

        ${data.selectedFileName ? html`
          <nr-alert
            type="success"
            style="margin-top: 1rem;"
          >
            ${data.i18n.urlModal.selectedFileLabel}: ${data.selectedFileName}
          </nr-alert>
        ` : nothing}

        ${data.isLoading ? html`
          <nr-alert
            type="info"
            style="margin-top: 1rem;"
          >
            ${data.i18n.urlModal.loadingFromUrlLabel}
          </nr-alert>
        ` : nothing}
      </div>

      <div slot="footer">
        <nr-button
          type="default"
          size="small"
          ?disabled=${data.isLoading}
          @click=${handlers.onClose}
        >
          ${data.i18n.urlModal.cancelButton}
        </nr-button>
        <nr-button
          type="primary"
          size="small"
          ?disabled=${(!data.urlInput && !data.selectedFileName) || data.isLoading}
          ?loading=${data.isLoading}
          @click=${handlers.onConfirm}
        >
          ${data.i18n.urlModal.addButton}
        </nr-button>
      </div>
    </nr-modal>
  `;
}
