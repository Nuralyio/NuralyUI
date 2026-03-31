/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

/**
 * Shared chatbot panel styles used by both workflow-canvas and whiteboard-canvas.
 * Extracted to avoid duplication across shadow DOM boundaries.
 */
export const chatbotPanelStyles = css`
  /* ========================================
   * CHATBOT PANEL (AI Assistant side panel)
   * ======================================== */

  .chatbot-panel {
    position: absolute;
    top: 0;
    right: 0;
    width: 380px;
    height: 100%;
    z-index: 999;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-left: 1px solid #e0e0e8;
    border-radius: 14px 0 0 14px;
    box-shadow: -8px 0 32px rgba(0,0,0,0.10);
    animation: chatbot-panel-slide-in 0.18s ease-out;
    /* Override canvas touch-action:none so inputs/scrolling work on mobile */
    touch-action: auto;
    overflow: hidden;
  }

  @keyframes chatbot-panel-slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .chatbot-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid #e0e0e8;
    background: #fff;
    flex-shrink: 0;
    gap: 8px;
  }

  .chatbot-panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #0f0f3c;
  }

  .chatbot-panel-title nr-icon {
    color: #7c3aed;
  }

  .chatbot-panel-close {
    width: 22px;
    height: 22px;
    padding: 0;
    box-sizing: border-box;
    border-radius: 50%;
    border: none;
    background: #f5f5f8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c8ca8;
    flex-shrink: 0;
    transition: background 150ms;
    line-height: 0;
  }

  .chatbot-panel-close:hover {
    background: #e0e0e8;
    color: #0f0f3c;
  }

  .chatbot-panel-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .chatbot-panel-content nr-chatbot {
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
    --chatbot-border-radius: 0;
    --chatbot-height: 100%;
    --chatbot-min-height: 100%;
    --nuraly-size-chatbot-min-width: 0;
    --nuraly-size-chatbot-container-min-width: 0;
    --chatbot-radius: 12px;
  }

  .chatbot-panel-content nr-chatbot::part(input-box) {
    border-radius: 20px;
    border: 1px solid #e0e0e8;
    background: #f5f5f8;
    margin: 8px;
  }

  .chatbot-panel-content nr-chatbot::part(input) {
    border-radius: 20px;
    background: transparent;
  }

  .toolbar-btn {
    position: relative;
  }

  .toolbar-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #da1e28;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /* Dark theme for chatbot panel */
  .chatbot-panel[data-theme="dark"],
  .chatbot-panel[data-theme="carbon-dark"],
  .chatbot-panel[data-theme="default-dark"] {
    background: #1a1a2e;
    border-color: #2d2d4a;
    box-shadow: -8px 0 32px rgba(0,0,0,0.30);
  }

  .chatbot-panel[data-theme="dark"] .chatbot-panel-header,
  .chatbot-panel[data-theme="carbon-dark"] .chatbot-panel-header,
  .chatbot-panel[data-theme="default-dark"] .chatbot-panel-header {
    background: #1a1a2e;
    border-color: #2d2d4a;
  }

  .chatbot-panel[data-theme="dark"] .chatbot-panel-title,
  .chatbot-panel[data-theme="carbon-dark"] .chatbot-panel-title,
  .chatbot-panel[data-theme="default-dark"] .chatbot-panel-title {
    color: #f0f0ff;
  }

  .chatbot-panel[data-theme="dark"] .chatbot-panel-close,
  .chatbot-panel[data-theme="carbon-dark"] .chatbot-panel-close,
  .chatbot-panel[data-theme="default-dark"] .chatbot-panel-close {
    background: #2d2d4a;
    color: #8c8ca8;
  }

  .chatbot-panel[data-theme="dark"] .chatbot-panel-close:hover,
  .chatbot-panel[data-theme="carbon-dark"] .chatbot-panel-close:hover,
  .chatbot-panel[data-theme="default-dark"] .chatbot-panel-close:hover {
    background: #3d3d5a;
    color: #f0f0ff;
  }

  /* Mobile: chatbot panel full-screen */
  @media (max-width: 768px) {
    .chatbot-panel {
      width: 100%;
    }
  }
`;
