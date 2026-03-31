/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const dataNodeFieldStyles = css`
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

  .field-error {
    font-size: 0.75rem;
    color: #ef4444;
    margin-top: 0.25rem;
  }

  /* Expression input styles */
  .expression-input {
    position: relative;
    font-family: 'JetBrains Mono', monospace;
  }

  .expression-input input,
  .expression-input textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #ffffff;
    color: #1e293b;
    font-size: 0.875rem;
    font-family: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    box-sizing: border-box;
  }

  .expression-input input:focus,
  .expression-input textarea:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .expression-input .expression-highlight {
    color: #7c3aed;
    font-weight: 500;
  }

  /* Filter builder styles */
  .filter-builder {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-group {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 0.75rem;
    background: #f8fafc;
  }

  .filter-group-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .filter-group-logic {
    display: inline-flex;
    gap: 0.25rem;
    background: #ffffff;
    padding: 0.25rem;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .filter-group-logic button {
    padding: 0.25rem 0.5rem;
    border: none;
    background: transparent;
    border-radius: 3px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    color: #525252;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .filter-group-logic button:hover {
    background: #f1f5f9;
  }

  .filter-group-logic button.active {
    background: #7c3aed;
    color: white;
  }

  .filter-conditions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-condition {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #f1f5f9;
  }

  .filter-condition select,
  .filter-condition input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #ffffff;
    font-size: 0.875rem;
    color: #1e293b;
  }

  .filter-condition select:focus,
  .filter-condition input:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .filter-remove-btn {
    padding: 0.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    border-radius: 4px;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .filter-remove-btn:hover {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  .filter-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .filter-add-btn {
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

  .filter-add-btn:hover {
    border-color: #7c3aed;
    color: #7c3aed;
  }

  /* Field mapper styles */
  .field-mapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-mapper-header {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f8fafc;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #525252;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .field-mapper-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 4px;
  }

  .field-mapper-row select,
  .field-mapper-row input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #ffffff;
    font-size: 0.875rem;
    color: #1e293b;
    font-family: 'JetBrains Mono', monospace;
  }

  .field-mapper-row select:focus,
  .field-mapper-row input:focus {
    outline: none;
    border-color: #7c3aed;
  }

  /* Sort builder styles */
  .sort-builder {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .sort-item {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 4px;
    cursor: grab;
  }

  .sort-item:active {
    cursor: grabbing;
  }

  .sort-item.dragging {
    opacity: 0.5;
  }

  .sort-item select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #ffffff;
    font-size: 0.875rem;
    color: #1e293b;
  }

  .sort-direction-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background: #ffffff;
    cursor: pointer;
    color: #525252;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .sort-direction-btn:hover {
    border-color: #7c3aed;
    color: #7c3aed;
  }

  .sort-direction-btn.asc {
    color: #7c3aed;
    border-color: #7c3aed;
    background: rgba(99, 102, 241, 0.1);
  }

  /* Select with icons */
  .icon-select {
    position: relative;
  }

  .icon-select-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .icon-select-option nr-icon {
    color: #94a3b8;
  }

  .icon-select-option .option-label {
    flex: 1;
  }

  .icon-select-option .option-description {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  /* Multi-select tokens */
  .multi-select-tokens {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    padding: 0.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #ffffff;
    min-height: 38px;
  }

  .multi-select-token {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: #f8fafc;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #1e293b;
  }

  .multi-select-token button {
    display: flex;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #94a3b8;
  }

  .multi-select-token button:hover {
    color: #ef4444;
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

  /* Variable name input */
  .variable-name-input {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .variable-name-prefix {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: #f8fafc;
    border: 1px solid #e0e0e0;
    border-right: none;
    border-radius: 6px 0 0 6px;
    font-size: 0.875rem;
    color: #94a3b8;
    font-family: 'JetBrains Mono', monospace;
  }

  .variable-name-input input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 0 6px 6px 0;
    background: #ffffff;
    font-size: 0.875rem;
    font-family: 'JetBrains Mono', monospace;
    color: #1e293b;
  }

  .variable-name-input input:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  /* Dark theme overrides */
  :host([data-theme="dark"]) .filter-group,
  :host([data-theme="dark"]) .field-mapper-header {
    background: #1e293b;
  }

  :host([data-theme="dark"]) .filter-condition,
  :host([data-theme="dark"]) .field-mapper-row,
  :host([data-theme="dark"]) .sort-item {
    background: #0f172a;
    border-color: #334155;
  }

  :host([data-theme="dark"]) input,
  :host([data-theme="dark"]) select,
  :host([data-theme="dark"]) textarea {
    background: #1e293b;
    border-color: #334155;
    color: #f8fafc;
  }
`;
