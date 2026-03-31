/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const chatbotTriggerFieldStyles = css`
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Common field styles */
  .field-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #525252;
  }

  .field-description {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }

  /* Event checkbox list */
  .event-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .event-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .event-item:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .event-item.selected {
    background: rgba(99, 102, 241, 0.1);
    border-color: #7c3aed;
  }

  .event-item-checkbox {
    margin-top: 2px;
  }

  .event-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .event-item-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .event-item-icon {
    color: #94a3b8;
  }

  .event-item.selected .event-item-icon {
    color: #7c3aed;
  }

  .event-item-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
  }

  .event-item-description {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  /* Suggestion list */
  .suggestion-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .suggestion-item {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 4px;
  }

  .suggestion-item-drag {
    cursor: grab;
    color: #94a3b8;
    padding: 0.25rem;
  }

  .suggestion-item-drag:active {
    cursor: grabbing;
  }

  /* Toggle switch styling */
  .toggle-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
  }

  .toggle-label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .toggle-label-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e293b;
  }

  .toggle-label-desc {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  /* Toggle switch */
  .toggle-switch {
    position: relative;
    width: 44px;
    height: 24px;
    background: #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .toggle-switch.active {
    background: #7c3aed;
  }

  .toggle-switch-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }

  .toggle-switch.active .toggle-switch-knob {
    transform: translateX(20px);
  }

  /* Preview card */
  .chatbot-preview {
    padding: 1rem;
    background: #f8fafc;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    text-align: center;
  }

  .chatbot-preview-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    border-radius: 6px;
    color: white;
    margin-bottom: 0.75rem;
  }

  .chatbot-preview-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .chatbot-preview-subtitle {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  /* Add button */
  .add-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: transparent;
    border: 1px dashed #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    color: #525252;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .add-btn:hover {
    border-color: #7c3aed;
    color: #7c3aed;
  }

  /* Remove button */
  .remove-btn {
    padding: 0.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    border-radius: 4px;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .remove-btn:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    text-align: center;
    color: #94a3b8;
    border: 1px dashed #e0e0e0;
    border-radius: 6px;
  }

  .empty-state nr-icon {
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }

  .empty-state-text {
    font-size: 0.875rem;
  }

  /* Size/variant selector */
  .option-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .option-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem;
    background: #f8fafc;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .option-card:hover {
    border-color: #cbd5e1;
  }

  .option-card.selected {
    border-color: #7c3aed;
    background: rgba(99, 102, 241, 0.05);
  }

  .option-card-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #1e293b;
  }

  /* Dark theme overrides */
  :host([data-theme="dark"]) .event-item,
  :host([data-theme="dark"]) .chatbot-preview {
    background: #1e293b;
    border-color: #334155;
  }

  :host([data-theme="dark"]) .event-item:hover {
    background: #334155;
  }

  :host([data-theme="dark"]) .suggestion-item {
    background: #0f172a;
    border-color: #334155;
  }
`;
