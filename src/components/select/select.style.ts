import { css } from 'lit';

export const styles = css`
  :host {
    width: fit-content;
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 13px;
    line-height: 1.4;
    margin: 0;
  }

  /* Disabled */
  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }
  :host([disabled]) .wrapper {
    background-color: #f4f4f4;
    border-color: var(--nr-border, #e0e0e0);
    color: var(--nr-disabled, #c6c6c6);
    cursor: not-allowed;
  }

  /* Size: Small */
  :host([size="small"]) .wrapper {
    min-height: 28px;
    font-size: 12px;
  }
  :host([size="small"]) .select-trigger {
    padding: 4px 8px;
    padding-right: 28px;
  }
  :host([size="small"]) .option {
    padding: 4px 8px;
    font-size: 12px;
  }

  /* Size: Medium */
  :host([size="medium"]) .wrapper {
    min-height: 32px;
    font-size: 13px;
  }
  :host([size="medium"]) .select-trigger {
    padding: 5px 10px;
    padding-right: 30px;
  }
  :host([size="medium"]) .option {
    padding: 5px 10px;
    font-size: 13px;
  }

  /* Size: Large */
  :host([size="large"]) .wrapper {
    min-height: 38px;
    font-size: 14px;
  }
  :host([size="large"]) .select-trigger {
    padding: 8px 12px;
    padding-right: 34px;
  }
  :host([size="large"]) .option {
    padding: 8px 12px;
    font-size: 14px;
  }

  /* Status */
  :host([status="error"]) .wrapper { border-color: var(--nr-danger, #da1e28); }
  :host([status="warning"]) .wrapper { border-color: var(--nr-warning, #f1c21b); }
  :host([status="success"]) .wrapper { border-color: var(--nr-success, #198038); }

  /* Type: inline */
  :host([type="inline"]) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  :host([type="inline"]) .wrapper { flex: 1; }

  /* Block (full width) */
  :host([block]) { width: 100%; }
  :host([block]) .wrapper { width: 100%; }

  /* Arrow rotation when open */
  :host([show]) .arrow-icon {
    transform: rotate(180deg);
  }

  /* Wrapper */
  .wrapper {
    position: relative;
    width: fit-content;
    background-color: var(--nr-bg, #ffffff);
    border: 1px solid var(--nr-border, #e0e0e0);
    border-radius: 8px;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    outline: none;
    margin: 0;
    min-height: 32px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    overflow: visible;
  }
  .wrapper:hover:not(:disabled) {
    border-color: var(--nr-primary, #7c3aed);
  }
  .wrapper:focus,
  .wrapper:focus-within {
    border-color: var(--nr-primary, #7c3aed);
    box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.2);
  }

  /* Select container */
  .select {
    display: flex;
    flex-direction: column;
  }

  /* Trigger */
  .select-trigger {
    display: flex;
    align-items: center;
    padding: 5px 30px 5px 10px;
    color: var(--nr-text, #161616);
    font-size: inherit;
    line-height: inherit;
    word-break: break-word;
    flex: 1;
    min-height: 0;
    flex-wrap: wrap;
    gap: 0.25rem;
    box-sizing: border-box;
  }

  /* Placeholder */
  .placeholder {
    color: var(--nr-text-secondary, #525252);
    font-size: 13px;
  }

  /* Tags (multi-select) */
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background-color: var(--nr-bg-hover, #f4f4f4);
    color: var(--nr-text, #161616);
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 12px;
    max-width: 100%;
  }
  .tag-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tag-close {
    color: var(--nr-text-secondary, #525252);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: color 0.15s;
  }
  .tag-close:hover { color: var(--nr-text, #161616); }

  /* Icons container */
  .icons-container {
    position: absolute;
    top: 50%;
    right: 0.75rem;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    pointer-events: none;
  }
  .icons-container nr-icon {
    pointer-events: auto;
    cursor: pointer;
    color: var(--nr-text-secondary, #525252);
    transition: color 0.15s;
  }
  .icons-container nr-icon:hover { color: var(--nr-text, #161616); }

  .arrow-icon {
    transition: transform 0.15s;
    pointer-events: none !important;
  }

  /* Dropdown */
  .options {
    position: fixed;
    background-color: var(--nr-surface, #ffffff);
    border: 1px solid var(--nr-border, #e0e0e0);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    max-height: auto;
    overflow-y: auto;
    overflow-x: hidden;
    display: none;
    flex-direction: column;
    animation: nr-select-dropdown-enter 0.15s ease-out;
    box-sizing: border-box;
    width: max-content;
    isolation: isolate;
  }

  /* Show dropdown — must come after base .options */
  :host([show]) .options {
    display: flex !important;
    pointer-events: auto !important;
  }

  .options.placement-top {
    animation: nr-select-dropdown-enter-top 0.15s ease-out;
  }

  @keyframes nr-select-dropdown-enter {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes nr-select-dropdown-enter-top {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Search */
  .search-container {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: var(--nr-surface, #ffffff);
    border-bottom: 1px solid var(--nr-border, #e0e0e0);
    padding: 0.5rem;
    margin: 0;
  }
  .search-container .search-input {
    width: 100%;
  }

  /* Options */
  .option {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    color: var(--nr-text, #161616);
    font-size: 13px;
    cursor: pointer;
    transition: background-color 0.15s;
    position: relative;
  }
  .option:hover:not(.selected):not(.disabled) {
    background-color: rgba(124, 58, 237, 0.08);
    color: var(--nr-primary, #7c3aed);
    cursor: pointer;
  }
  .option.selected {
    background-color: var(--nr-primary, #7c3aed);
    color: var(--nr-text-on-color, #ffffff);
  }
  .option.focused {
    background-color: rgba(124, 58, 237, 0.08);
    color: var(--nr-primary, #7c3aed);
  }
  .option.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .option-icon { color: currentColor; }
  .option-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .option-description {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 0.25rem;
  }
  .check-icon { color: var(--nr-text-on-color, #ffffff); }

  /* No options */
  .no-options {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 10px;
    color: var(--nr-text-secondary, #525252);
    font-size: 13px;
    cursor: default;
    user-select: none;
  }
  .no-options-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
  }
  .no-options-icon {
    opacity: 0.8;
    color: var(--nr-border, #e0e0e0);
  }

  /* Validation message */
  .validation-message {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: var(--nr-danger, #da1e28);
  }
  .validation-message.warning { color: var(--nr-warning, #f1c21b); }
  .validation-message.success { color: var(--nr-success, #198038); }

  /* Label slot */
  ::slotted([slot="label"]) {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 500;
    color: var(--nr-text, #161616);
  }

  /* Helper text slot */
  ::slotted([slot="helper-text"]) {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: var(--nr-text-secondary, #525252);
  }

  /* Status icons */
  .status-icon.warning { color: var(--nr-warning, #f1c21b); }
  .status-icon.error { color: var(--nr-danger, #da1e28); }
  .status-icon.success { color: var(--nr-success, #198038); }

  /* Clear icon */
  .clear-icon {
    color: var(--nr-text-secondary);
    cursor: pointer;
    pointer-events: auto !important;
  }
  .clear-icon:hover { color: var(--nr-text); }

  /* Button type */
  .select-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--nr-border);
    border-radius: 4px;
    background-color: var(--nr-surface);
    color: var(--nr-text);
    cursor: pointer;
    font-size: inherit;
    transition: all 0.15s;
  }
  .select-button:hover { border-color: var(--nr-primary); }
  .select-button:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .options,
    .wrapper,
    .tag-close,
    .arrow-icon,
    .option {
      transition: none;
      animation: none;
    }
  }

  @media (prefers-contrast: high) {
    .wrapper { border-width: 2px; }
    .wrapper:focus,
    .wrapper:focus-within { outline: 3px solid; }
  }
`;
