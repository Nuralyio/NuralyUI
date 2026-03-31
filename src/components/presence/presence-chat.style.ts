/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    position: fixed;
    display: block;
    width: 300px;
  }

  .chat-panel {
    width: 300px;
    height: 420px;
    background: #fff;
    border: 1px solid var(--nr-presence-border, #e0e0e8);
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: chatIn 0.18s ease;
  }

  @keyframes chatIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: none; }
  }

  .chat-panel.minimized {
    height: auto;
    width: 200px;
  }

  .chat-panel.minimized .chat-messages,
  .chat-panel.minimized .chat-input-row {
    display: none;
  }

  .chat-panel.minimized .chat-header {
    border-bottom: none;
    border-radius: 14px;
    cursor: pointer;
  }

  .chat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-bottom: 1px solid var(--nr-presence-border, #e0e0e8);
    flex-shrink: 0;
    cursor: grab;
    user-select: none;
  }

  .chat-header:active {
    cursor: grabbing;
  }

  .chat-header-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    overflow: hidden;
  }

  .chat-header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .chat-header-info {
    flex: 1;
    min-width: 0;
  }

  .chat-header-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--nr-presence-text, #0f0f3c);
  }

  .chat-header-status {
    font-size: 11px;
    color: #22c55e;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .chat-header-status::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    display: inline-block;
  }

  .chat-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: var(--nr-presence-input-bg, #f5f5f8);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c8ca8;
    transition: background 150ms;
    flex-shrink: 0;
  }

  .chat-btn:hover {
    background: var(--nr-presence-border, #e0e0e8);
    color: var(--nr-presence-text, #0f0f3c);
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .chat-msg {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 80%;
  }

  .chat-msg.me {
    align-self: flex-end;
    align-items: flex-end;
  }

  .chat-msg.other {
    align-self: flex-start;
    align-items: flex-start;
  }

  .chat-bubble {
    padding: 7px 11px;
    border-radius: 12px;
    font-size: 12px;
    line-height: 1.4;
    word-break: break-word;
  }

  .chat-msg.me .chat-bubble {
    background: var(--nr-presence-accent, #7c3aed);
    color: #fff;
    border-bottom-right-radius: 3px;
  }

  .chat-msg.other .chat-bubble {
    background: var(--nr-presence-input-bg, #f5f5f8);
    color: var(--nr-presence-text, #0f0f3c);
    border-bottom-left-radius: 3px;
  }

  .chat-time {
    font-size: 10px;
    color: var(--nr-presence-text-secondary, #8c8ca8);
    padding: 0 2px;
  }

  .chat-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    color: var(--nr-presence-text-secondary, #8c8ca8);
    font-size: 12px;
  }

  .chat-empty svg {
    opacity: 0.35;
  }

  .chat-input-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-top: 1px solid var(--nr-presence-border, #e0e0e8);
    flex-shrink: 0;
  }

  .chat-input {
    flex: 1;
    border: 1px solid var(--nr-presence-border, #e0e0e8);
    border-radius: 20px;
    padding: 6px 12px;
    font-size: 12px;
    outline: none;
    background: var(--nr-presence-input-bg, #f5f5f8);
    color: var(--nr-presence-text, #0f0f3c);
    transition: border-color 150ms;
  }

  .chat-input:focus {
    border-color: var(--nr-presence-accent, #7c3aed);
  }

  .chat-send {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: var(--nr-presence-accent, #7c3aed);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 150ms;
  }

  .chat-send:hover {
    background: #6d28d9;
  }

  .chat-send:disabled {
    background: var(--nr-presence-border, #e0e0e8);
    cursor: default;
  }
`;
