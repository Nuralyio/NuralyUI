import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    nr-select {
      width: fit-content;
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
    }

    /* Disabled */
    nr-select[disabled] {
      opacity: 0.5;
      pointer-events: none;
    }
    nr-select[disabled] .wrapper {
      background-color: #f4f4f4;
      border-color: var(--nr-border);
      color: var(--nr-disabled);
      cursor: not-allowed;
    }

    /* Size: Small */
    nr-select[size="small"] .wrapper {
      height: 2rem;
      min-height: 2rem;
      font-size: 0.75rem;
    }
    nr-select[size="small"] .select-trigger {
      padding: 0.25rem 0.5rem;
      padding-right: 2.5rem;
    }
    nr-select[size="small"] .option {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      min-height: 2rem;
    }

    /* Size: Medium */
    nr-select[size="medium"] .wrapper {
      min-height: 2.5rem;
      font-size: 0.875rem;
    }
    nr-select[size="medium"] .select-trigger {
      padding: 0.5rem 0.75rem;
      padding-right: 2.5rem;
    }
    nr-select[size="medium"] .option {
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      min-height: 2.5rem;
    }

    /* Size: Large */
    nr-select[size="large"] .wrapper {
      min-height: 3rem;
      font-size: 1rem;
    }
    nr-select[size="large"] .select-trigger {
      padding: 0.75rem 1rem;
      padding-right: 3rem;
    }
    nr-select[size="large"] .option {
      padding: 0.75rem 1rem;
      font-size: 1rem;
      min-height: 3rem;
    }

    /* Status */
    nr-select[status="error"] .wrapper { border-color: var(--nr-danger); }
    nr-select[status="warning"] .wrapper { border-color: var(--nr-warning); }
    nr-select[status="success"] .wrapper { border-color: var(--nr-success); }

    /* Type: inline */
    nr-select[type="inline"] {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    nr-select[type="inline"] .wrapper { flex: 1; }

    /* Block (full width) */
    nr-select[block] { width: 100%; }
    nr-select[block] .wrapper { width: 100%; }

    /* Show dropdown */
    nr-select[show] .options {
      display: flex !important;
      pointer-events: auto;
    }

    /* Arrow rotation when open */
    nr-select[show] .arrow-icon {
      transform: rotate(180deg);
    }

    /* Wrapper */
    nr-select .wrapper {
      position: relative;
      width: fit-content;
      background-color: var(--nr-surface);
      border: 1px solid var(--nr-border);
      border-radius: 4px;
      transition: all 0.15s ease-in-out;
      cursor: pointer;
      outline: none;
      margin: 0;
      min-height: 2.5rem;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      overflow: visible;
    }
    nr-select .wrapper:hover:not(:disabled) {
      border-color: var(--nr-primary);
    }
    nr-select .wrapper:focus,
    nr-select .wrapper:focus-within {
      border-color: var(--nr-primary);
      box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.2);
    }

    /* Select container */
    nr-select .select {
      display: flex;
      flex-direction: column;
    }

    /* Trigger */
    nr-select .select-trigger {
      display: flex;
      align-items: center;
      padding: 0.5rem 2.5rem 0.5rem 0.75rem;
      color: var(--nr-text);
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
    nr-select .placeholder {
      color: var(--nr-text-secondary);
      font-size: 0.875rem;
    }

    /* Tags (multi-select) */
    nr-select .tag {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background-color: var(--nr-bg-hover);
      color: var(--nr-text);
      padding: 0.25rem 0.5rem;
      border-radius: 2px;
      font-size: 0.8125rem;
      max-width: 100%;
    }
    nr-select .tag-label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    nr-select .tag-close {
      color: var(--nr-text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: color 0.15s;
    }
    nr-select .tag-close:hover { color: var(--nr-text); }

    /* Icons container */
    nr-select .icons-container {
      position: absolute;
      top: 50%;
      right: 0.75rem;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: 0.25rem;
      pointer-events: none;
    }
    nr-select .icons-container nr-icon {
      pointer-events: auto;
      cursor: pointer;
      color: var(--nr-text-secondary);
      transition: color 0.15s;
    }
    nr-select .icons-container nr-icon:hover { color: var(--nr-text); }

    nr-select .arrow-icon {
      transition: transform 0.15s;
      pointer-events: none !important;
    }

    /* Dropdown */
    nr-select .options {
      position: fixed;
      background-color: var(--nr-surface);
      border: 1px solid var(--nr-border);
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      max-height: auto;
      overflow-y: auto;
      overflow-x: hidden;
      display: none;
      flex-direction: column;
      animation: nr-select-dropdown-enter 0.15s ease-out;
      box-sizing: border-box;
      width: var(--nuraly-select-dropdown-width, max-content);
      isolation: isolate;
      pointer-events: none;
    }

    nr-select .options.placement-top {
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
    nr-select .search-container {
      position: sticky;
      top: 0;
      z-index: 1;
      background-color: var(--nr-surface);
      border-bottom: 1px solid var(--nr-border);
      padding: 0.5rem;
      margin: 0;
    }
    nr-select .search-container .search-input {
      width: 100%;
    }

    /* Options */
    nr-select .option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      color: var(--nr-text);
      font-size: 0.875rem;
      cursor: pointer;
      transition: background-color 0.15s;
      position: relative;
    }
    nr-select .option:hover {
      background-color: var(--nr-bg-hover);
    }
    nr-select .option.selected {
      background-color: var(--nr-primary);
      color: var(--nr-text-on-color);
    }
    nr-select .option.focused {
      background-color: var(--nr-bg-hover);
      outline: 2px solid var(--nr-primary);
      outline-offset: -2px;
    }
    nr-select .option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    nr-select .option-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    nr-select .option-icon { color: currentColor; }
    nr-select .option-text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    nr-select .option-description {
      font-size: 0.8125rem;
      opacity: 0.7;
      margin-top: 0.25rem;
    }
    nr-select .check-icon { color: var(--nr-text-on-color); }

    /* No options */
    nr-select .no-options {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
      color: var(--nr-text-secondary);
      font-size: 0.875rem;
      cursor: default;
      user-select: none;
    }
    nr-select .no-options-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      text-align: center;
    }
    nr-select .no-options-icon {
      opacity: 0.8;
      color: var(--nr-border);
    }

    /* Validation message */
    nr-select .validation-message {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: var(--nr-danger);
    }
    nr-select .validation-message.warning { color: var(--nr-warning); }
    nr-select .validation-message.success { color: var(--nr-success); }

    /* Label slot */
    nr-select [slot="label"] {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
      color: var(--nr-text);
    }

    /* Helper text slot */
    nr-select [slot="helper-text"] {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: var(--nr-text-secondary);
    }

    /* Status icons */
    nr-select .status-icon.warning { color: var(--nr-warning); }
    nr-select .status-icon.error { color: var(--nr-danger); }
    nr-select .status-icon.success { color: var(--nr-success); }

    /* Clear icon */
    nr-select .clear-icon {
      color: var(--nr-text-secondary);
      cursor: pointer;
      pointer-events: auto !important;
    }
    nr-select .clear-icon:hover { color: var(--nr-text); }

    /* Button type */
    nr-select .select-button {
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
    nr-select .select-button:hover { border-color: var(--nr-primary); }
    nr-select .select-button:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      nr-select .options,
      nr-select .wrapper,
      nr-select .tag-close,
      nr-select .arrow-icon,
      nr-select .option {
        transition: none;
        animation: none;
      }
    }

    @media (prefers-contrast: high) {
      nr-select .wrapper { border-width: 2px; }
      nr-select .wrapper:focus,
      nr-select .wrapper:focus-within { outline: 3px solid; }
    }
  }
`;
