/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { WorkflowNodeType } from '../workflow-canvas.types.js';
import type { WorkflowNode } from '../workflow-canvas.types.js';
import type { ChatbotCoreController } from '../../chatbot/core/chatbot-core.controller.js';
import type { WorkflowSocketProvider } from '../../chatbot/providers/workflow-socket-provider.js';

/**
 * Data required for rendering the preview panel
 */
export interface PreviewPanelTemplateData {
  previewNode: WorkflowNode | null;
  position: { x: number; y: number } | null;
  currentTheme: string;
  // HTTP preview state
  httpPreviewBody: string;
  httpPreviewResponse: string;
  httpPreviewLoading: boolean;
  httpPreviewError: string;
  // Chat preview state
  chatPreviewController: ChatbotCoreController | null;
  chatPreviewProvider: WorkflowSocketProvider | null;
}

/**
 * Callbacks for preview panel interactions
 */
export interface PreviewPanelCallbacks {
  onClose: () => void;
  onSendHttpRequest: () => void;
  onHttpBodyChange: (value: string) => void;
}

/**
 * Render the HTTP start preview panel
 */
function renderHttpPreview(
  data: PreviewPanelTemplateData,
  callbacks: PreviewPanelCallbacks,
  panelStyle: Record<string, string>,
  httpPath: string
): TemplateResult {
  return html`
    <div class="chatbot-preview-panel http-preview-panel" style=${styleMap(panelStyle)} data-theme=${data.currentTheme}>
      <div class="chatbot-preview-header">
        <div class="chatbot-preview-title">
          <nr-icon name="globe" size="small"></nr-icon>
          <span>HTTP Test</span>
        </div>
        <button class="chatbot-preview-close" @click=${callbacks.onClose}>
          <nr-icon name="x" size="small"></nr-icon>
        </button>
      </div>
      <div class="http-preview-content">
        <div class="http-preview-url">
          <span class="http-method">POST</span>
          <span class="http-path">${httpPath}</span>
        </div>
        <div class="http-preview-section">
          <label>Request Body (JSON)</label>
          <textarea
            class="http-request-body"
            .value=${data.httpPreviewBody}
            @input=${(e: Event) => callbacks.onHttpBodyChange((e.target as HTMLTextAreaElement).value)}
            placeholder='{ "key": "value" }'
            ?disabled=${data.httpPreviewLoading}
          ></textarea>
        </div>
        <div class="http-preview-actions">
          <button
            class="http-send-btn"
            @click=${callbacks.onSendHttpRequest}
            ?disabled=${data.httpPreviewLoading}
          >
            ${data.httpPreviewLoading ? html`
              <nr-icon name="loader" size="small"></nr-icon>
              <span>Sending...</span>
            ` : html`
              <nr-icon name="send" size="small"></nr-icon>
              <span>Send Request</span>
            `}
          </button>
        </div>
        ${data.httpPreviewError ? html`
          <div class="http-preview-error">
            <nr-icon name="alert-circle" size="small"></nr-icon>
            <span>${data.httpPreviewError}</span>
          </div>
        ` : ''}
        ${data.httpPreviewResponse ? html`
          <div class="http-preview-section">
            <label>Response</label>
            <pre class="http-response-body">${data.httpPreviewResponse}</pre>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Render the chat preview panel (CHAT_START or CHATBOT)
 */
function renderChatPreview(
  data: PreviewPanelTemplateData,
  callbacks: PreviewPanelCallbacks,
  panelStyle: Record<string, string>,
  previewNode: WorkflowNode
): TemplateResult {
  const config = previewNode.configuration || {};
  const rawSuggestions = (config.suggestions as Array<{id?: string; text?: string}>) || [];
  const suggestions = rawSuggestions.map((s, i) => ({
    id: s.id || String(i),
    text: s.text || '',
  }));

  const isChatStartNode = previewNode.type === WorkflowNodeType.CHAT_START;
  const isConnected = data.chatPreviewProvider?.isConnected() ?? false;
  const headerTitle = isChatStartNode ? 'Workflow Chat' : 'Chat Preview';
  const headerIcon = isChatStartNode ? 'zap' : 'message-circle';

  return html`
    <div class="chatbot-preview-panel" style=${styleMap(panelStyle)} data-theme=${data.currentTheme}>
      <div class="chatbot-preview-header">
        <div class="chatbot-preview-title">
          <nr-icon name=${headerIcon} size="small"></nr-icon>
          <span>${headerTitle}</span>
          ${isChatStartNode ? html`
            <span class="chat-preview-status ${isConnected ? 'connected' : 'disconnected'}">
              ${isConnected ? '● Connected' : '○ Connecting...'}
            </span>
          ` : ''}
        </div>
        <button class="chatbot-preview-close" @click=${callbacks.onClose}>
          <nr-icon name="x" size="small"></nr-icon>
        </button>
      </div>
      <div class="chatbot-preview-content">
        ${isChatStartNode && data.chatPreviewController ? html`
          <nr-chatbot
            size="small"
            variant="default"
            .controller=${data.chatPreviewController}
            .suggestions=${suggestions}
            placeholder=${(config.placeholder as string) || 'Send a message...'}
            botName="Workflow"
            ?showHeader=${false}
            ?showSuggestions=${suggestions.length > 0}
            ?enableFileUpload=${config.enableFileUpload === true}
            loadingType="dots"
          ></nr-chatbot>
        ` : isChatStartNode ? html`
          <div class="chat-preview-loading">
            <nr-icon name="loader" size="large"></nr-icon>
            <span>Connecting to workflow...</span>
          </div>
        ` : html`
          <nr-chatbot
            size=${(config.chatbotSize as string) || 'medium'}
            variant=${(config.chatbotVariant as string) || 'default'}
            .suggestions=${suggestions}
            placeholder=${(config.placeholder as string) || 'Type a message...'}
            botName=${(config.title as string) || 'Chat Assistant'}
            ?showHeader=${true}
            ?showSuggestions=${config.enableSuggestions !== false}
            ?enableFileUpload=${config.enableFileUpload === true}
            loadingType=${(config.loadingType as string) || 'dots'}
          ></nr-chatbot>
        `}
      </div>
    </div>
  `;
}

/**
 * Render the preview panel (HTTP test or chat preview)
 */
export function renderPreviewPanelTemplate(
  data: PreviewPanelTemplateData,
  callbacks: PreviewPanelCallbacks
): TemplateResult | typeof nothing {
  if (!data.previewNode || !data.position) return nothing;

  const previewNode = data.previewNode;
  const config = previewNode.configuration || {};
  const panelStyle = {
    left: `${data.position.x}px`,
    top: `${data.position.y}px`,
  };

  // HTTP_START preview
  if (previewNode.type === WorkflowNodeType.HTTP_START) {
    const httpPath = (config.httpPath as string) || '/webhook';
    return renderHttpPreview(data, callbacks, panelStyle, httpPath);
  }

  // Chat preview (CHAT_START or CHATBOT)
  return renderChatPreview(data, callbacks, panelStyle, previewNode);
}
