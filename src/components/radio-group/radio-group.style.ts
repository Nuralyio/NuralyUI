/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    /* ========================================
     * CSS CUSTOM PROPERTIES - RADIO GROUP
     * ======================================== */
    
    /* Group Layout */
    --nuraly-radio-group-gap: 12px;
    --nuraly-radio-group-horizontal-gap: 16px;

    /* Colors - Error/Warning states */
    --nuraly-radio-group-error-icon-color: #ef4444;
    --nuraly-radio-group-error-text-color: #ef4444;
    --nuraly-radio-group-warning-icon-color: #f59e0b;
    --nuraly-radio-group-warning-text-color: #f59e0b;

    /* Typography */
    --nuraly-radio-group-font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif;
    --nuraly-radio-group-message-font-size: 12px;

    /* Button type styling */
    --nuraly-radio-group-button-border-radius: 4px;
    --nuraly-radio-group-button-hover-color: #7c3aed;

    /* Slot container styling */
    --nuraly-radio-group-slot-hover-bg: rgba(124, 58, 237, 0.04);
    --nuraly-radio-group-slot-selected-bg: rgba(124, 58, 237, 0.08);
    --nuraly-radio-group-slot-border-radius: 6px;

    /* ========================================
     * COMPONENT STYLES
     * ======================================== */
    
    width: fit-content;
    display: block;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif;
  }

  /* ========================================
   * RADIO GROUP LAYOUT
   * ======================================== */

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .radio-group.horizontal {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .radio-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* ========================================
   * MESSAGE CONTAINERS (Error/Warning)
   * ======================================== */

  .radio-wrapper .message-container {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    padding-left: 28px; /* Align with radio label */
  }

  nr-icon {
    display: flex;
  }

  .radio-wrapper.error nr-icon {
    --nuraly-icon-color: #ef4444;
  }

  .radio-wrapper.warning nr-icon {
    --nuraly-icon-color: #f59e0b;
  }

  .radio-wrapper.error .message-container {
    color: #ef4444;
  }

  .radio-wrapper.warning .message-container {
    color: #f59e0b;
  }

  /* ========================================
   * BUTTON TYPE STYLING
   * ======================================== */

  .type-button {
    display: inline-flex;
    gap: 0px;
  }

  /* Button border radius for first and last child */
  .type-button :first-child {
    --nuraly-button-border-top-left-radius: 4px;
    --nuraly-button-border-bottom-left-radius: 4px;
  }

  .type-button :last-child {
    --nuraly-button-border-top-right-radius: 4px;
    --nuraly-button-border-bottom-right-radius: 4px;
  }

  .type-button nr-button:not(:last-child) {
    margin-right: -1px;
  }

  .type-button nr-button {
    position: relative;
    z-index: 1;
  }

  .type-button nr-button[type="default"]:hover {
    --nuraly-button-color: #7c3aed;
    --nuraly-button-border-color: #7c3aed;
    z-index: 2;
  }

  .type-button nr-button[type="primary"] {
    z-index: 1;
    position: relative;
  }

  /* Disabled button states */
  .type-button nr-button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  .type-button nr-button[disabled]:hover {
    z-index: auto;
    --nuraly-button-border-color: #c6c6c6;
    --nuraly-button-background-color: #f4f4f4;
    --nuraly-button-color: #c6c6c6;
  }

  .type-button nr-button[type="primary"][disabled] {
    --nuraly-button-background-color: #c6c6c6;
    --nuraly-button-border-color: #c6c6c6;
    --nuraly-button-color: #ffffff;
  }

  .type-button nr-button[type="primary"][disabled] nr-icon {
    --nuraly-icon-color: #ffffff;
    --nuraly-icon-local-color: #ffffff;
  }

  /* ========================================
   * AUTO WIDTH STYLING
   * ======================================== */

  :host([auto-width]) .type-button nr-button {
    --nuraly-button-min-width: 40px;
    min-width: auto;
    width: auto;
  }

  /* Ensure minimum padding for auto-width buttons to prevent them from becoming too small */
  :host([auto-width]) .type-button nr-button button {
    min-width: auto;
    padding-left: max(0.5rem, 0.5rem);
    padding-right: max(0.5rem, 0.5rem);
  }

  /* Icon-only buttons with auto-width should have minimal but adequate padding */
  :host([auto-width]) .type-button nr-button.icon-only {
    padding: 0.375rem; /* Even more minimal padding for icon-only */
    min-width: auto;
    width: auto;
  }

  :host([auto-width]) .type-button nr-button.icon-only button {
    padding: max(0.375rem, 0.5rem); /* Ensure minimum 6px padding for icon-only */
    min-width: auto;
  }

  /* For small size buttons, use proportionally smaller but still adequate padding */
  :host([auto-width]) .type-button nr-button[size="small"] button {
    padding-left: max(0.375rem, 0.375rem);
    padding-right: max(0.375rem, 0.375rem);
  }

  /* For small size icon-only buttons, use even less but still minimum padding */
  :host([auto-width]) .type-button nr-button.icon-only[size="small"] button {
    padding: max(0.25rem, 0.375rem);
  }

  /* For large size buttons, maintain larger minimum padding */
  :host([auto-width]) .type-button nr-button[size="large"] button {
    padding-left: max(1rem, 0.75rem);
    padding-right: max(1rem, 0.75rem);
  }

  /* For large size icon-only buttons, use proportionally larger padding */
  :host([auto-width]) .type-button nr-button.icon-only[size="large"] button {
    padding: max(0.5rem, 0.75rem);
  }

  /* ========================================
   * SLOT-BASED RADIO STYLING
   * ======================================== */

  .slot-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 8px;
    border-radius: 6px;
  }

  .slot-wrapper:hover {
    background-color: rgba(124, 58, 237, 0.04);
  }

  .slot-wrapper nr-radio {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .slot-wrapper .slot-content {
    flex: 1;
    min-width: 0;
  }

  .slot-container.selected .slot-wrapper {
    background-color: rgba(124, 58, 237, 0.08);
  }

  /* ========================================
   * HELPER TEXT SLOT STYLING
   * ======================================== */

  ::slotted([slot='helper-text']) {
    color: #8c8c8c;
    font-size: 12px;
    padding-top: 4px;
    
    /* Prevent text overflow and ensure proper wrapping without affecting parent width */
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    white-space: normal;
    max-width: 100%;
    width: 0;
    min-width: 100%;
    box-sizing: border-box;
    line-height: 1.4;
    display: block;
  }
`;
