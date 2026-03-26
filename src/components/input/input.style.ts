import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    /* ========================================
     * HOST ELEMENT
     * ======================================== */
    nr-input {
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 13px;
      line-height: 1.4;
    }

    /* ========================================
     * INPUT WRAPPER
     * ======================================== */
    nr-input .input-wrapper {
      display: flex;
      align-items: stretch;
      width: 100%;
      background-color: transparent;
    }

    /* ========================================
     * INPUT CONTAINER
     * ======================================== */
    nr-input #input-container {
      display: flex;
      align-items: center;
      position: relative;
      flex: 1;
      min-width: 0;
      border: 1px solid var(--nr-border, #d9d9d9);
      border-radius: 8px;
      background-color: var(--nr-bg, #ffffff);
      color: var(--nr-text, rgba(0, 0, 0, 0.88));
      font-family: inherit;
      font-size: 13px;
      overflow: hidden;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    nr-input:not([disabled]) #input-container:hover {
      border-color: var(--nr-primary, #7c3aed);
    }

    nr-input:not([disabled]) #input-container:focus-within {
      border-color: var(--nr-primary, #7c3aed);
      box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.15);
      outline: none;
    }

    /* ========================================
     * INPUT ELEMENT
     * ======================================== */
    nr-input #input-container > input {
      background-color: transparent;
      border: none;
      border-radius: 0;
      outline: none;
      box-shadow: none;
      -webkit-appearance: none;
      appearance: none;
      flex: 1;
      min-width: 0;
      width: 100%;
      font-family: inherit;
      font-size: 13px;
      color: var(--nr-text, rgba(0, 0, 0, 0.88));
      padding: 6px 10px;
    }

    nr-input ::placeholder {
      color: var(--nr-placeholder, #a8a8a8);
      font-size: 13px;
      font-family: inherit;
    }

    /* Remove default number spinners */
    nr-input input::-webkit-outer-spin-button,
    nr-input input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    nr-input input[type='number'] {
      -moz-appearance: textfield;
    }

    /* ========================================
     * SIZE VARIATIONS
     * ======================================== */

    /* Small */
    nr-input div[data-size='small'] {
      min-height: 28px;
    }
    nr-input div[data-size='small'] > input {
      padding: 4px 8px;
      font-size: 12px;
    }

    /* Medium (default) */
    nr-input div[data-size='medium'] {
      min-height: 32px;
    }
    nr-input div[data-size='medium'] > input {
      padding: 6px 10px;
      font-size: 13px;
    }

    /* Large */
    nr-input div[data-size='large'] {
      min-height: 38px;
    }
    nr-input div[data-size='large'] > input {
      padding: 8px 12px;
      font-size: 14px;
    }

    /* ========================================
     * VARIANT STYLES
     * ======================================== */

    /* Outlined (default) */
    nr-input[variant='outlined'] #input-container {
      border: 1px solid var(--nr-border, #d1d5db);
      border-radius: 8px;
      background-color: transparent;
    }
    nr-input[variant='outlined'] .input-wrapper {
      background-color: transparent;
    }
    nr-input[variant='outlined']:not([state='error']):not([disabled]) #input-container:hover {
      border-color: var(--nr-primary, #7c3aed);
    }
    nr-input[variant='outlined']:not([state='error']) #input-container:focus-within {
      border-color: var(--nr-primary, #7c3aed);
      box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.15);
    }

    /* Filled */
    nr-input[variant='filled'] #input-container {
      background-color: var(--nr-bg-subtle, #f5f5f5);
      border-radius: 8px;
      border-bottom: 1px solid var(--nr-border, #d9d9d9);
      border-top: none;
      border-left: none;
      border-right: none;
    }
    nr-input[variant='filled'] .input-wrapper {
      background-color: transparent;
    }
    nr-input[variant='filled']:not([state='error']) #input-container:focus-within {
      border-bottom-color: var(--nr-primary, #7c3aed);
      border-top: none;
      border-left: none;
      border-right: none;
    }

    /* Borderless */
    nr-input[variant='borderless'] #input-container {
      background-color: transparent;
      border: none;
      border-radius: 8px;
    }
    nr-input[variant='borderless'] .input-wrapper {
      background-color: transparent;
    }
    nr-input[variant='borderless']:not([state='error']) #input-container:focus-within {
      outline: 1px solid var(--nr-primary, #7c3aed);
      border: none;
    }

    /* Underlined */
    nr-input[variant='underlined'] #input-container {
      border-bottom: 1px solid var(--nr-border, #d9d9d9);
      border-top: none;
      border-left: none;
      border-right: none;
      border-radius: 0;
    }
    nr-input[variant='underlined']:not([state='error']) #input-container:focus-within {
      border-bottom-color: var(--nr-primary, #7c3aed);
      border-top: none;
      border-left: none;
      border-right: none;
    }

    /* ========================================
     * STATE STYLES
     * ======================================== */

    /* Error */
    nr-input:not([disabled])[state='error'] #input-container {
      border-color: var(--nr-danger, #dc2626) !important;
    }
    nr-input:not([disabled])[state='error'] #input-container:focus-within {
      border-color: var(--nr-danger, #dc2626) !important;
      box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.15) !important;
    }
    nr-input[variant='underlined'][state='error'] #input-container,
    nr-input[variant='filled'][state='error'] #input-container {
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      border-bottom-color: var(--nr-danger, #dc2626) !important;
    }
    nr-input[variant='borderless'][state='error'] #input-container {
      border: 1px solid var(--nr-danger, #dc2626) !important;
    }

    /* Warning */
    nr-input:not([disabled])[state='warning'] #input-container {
      border-color: var(--nr-warning, #d97706) !important;
    }
    nr-input:not([disabled])[state='warning'] #input-container:focus-within {
      border-color: var(--nr-warning, #d97706) !important;
      box-shadow: 0 0 0 1px rgba(217, 119, 6, 0.15) !important;
    }

    /* Success */
    nr-input:not([disabled])[state='success'] #input-container {
      border-color: var(--nr-success, #16a34a) !important;
    }
    nr-input:not([disabled])[state='success'] #input-container:focus-within {
      border-color: var(--nr-success, #16a34a) !important;
      box-shadow: 0 0 0 1px rgba(22, 163, 74, 0.15) !important;
    }

    /* Warning/error — number icon position */
    nr-input[state='error'] input[type='number'] ~ #number-icons,
    nr-input[state='warning'] input[type='number'] ~ #number-icons {
      position: static;
      padding-left: 4px;
    }

    /* ========================================
     * DISABLED
     * ======================================== */
    nr-input[disabled] {
      opacity: 0.5;
      pointer-events: none;
    }
    nr-input[disabled] .input-wrapper {
      background-color: #f4f4f4;
    }
    nr-input[disabled] #input-container {
      background-color: #f5f5f5;
      border-color: var(--nr-border, #d9d9d9);
      cursor: not-allowed;
    }
    nr-input[disabled] #input-container > input {
      background-color: transparent;
      cursor: not-allowed;
      color: var(--nr-disabled, rgba(0, 0, 0, 0.25));
    }
    nr-input[disabled] ::placeholder {
      color: var(--nr-disabled, #c6c6c6);
    }
    nr-input[disabled] #password-icon,
    nr-input[disabled] #error-icon,
    nr-input[disabled] #warning-icon,
    nr-input[disabled] #number-icons,
    nr-input[disabled] #calendar-icon,
    nr-input[disabled] #copy-icon,
    nr-input[disabled] #clear-icon {
      opacity: 0.5;
    }
    nr-input[disabled] #password-icon,
    nr-input[disabled] #number-icons,
    nr-input[disabled] #copy-icon,
    nr-input[disabled] #clear-icon {
      cursor: not-allowed;
    }

    /* ========================================
     * ICON STYLES
     * ======================================== */
    nr-input #input-container nr-icon {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      height: 100%;
      max-height: 100%;
    }

    nr-input #warning-icon {
      --nuraly-color-icon: var(--nr-warning, #f1c21b);
    }
    nr-input #error-icon {
      --nuraly-color-icon: var(--nr-danger, #da1e28);
    }
    nr-input #calendar-icon {
      --nuraly-color-icon: var(--nr-text, #161616);
    }
    nr-input #password-icon {
      padding-left: 8px;
      padding-right: 8px;
      cursor: pointer;
      color: var(--nr-text-secondary, #6b7280);
      transition: color 0.15s;
    }
    nr-input #password-icon:hover { color: var(--nr-primary, #7c3aed); }

    nr-input #copy-icon {
      padding-right: 8px;
      cursor: pointer;
      color: var(--nr-text-secondary, #6b7280);
      transition: color 0.15s;
    }
    nr-input #copy-icon:hover { color: var(--nr-primary, #7c3aed); }

    nr-input #clear-icon {
      padding-right: 8px;
      cursor: pointer;
      color: var(--nr-text-secondary, #6b7280);
      transition: color 0.15s;
    }
    nr-input #clear-icon:hover { color: var(--nr-danger, #dc2626); }

    /* Number icons */
    nr-input #number-icons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 50px;
      padding-right: 8px;
    }
    nr-input #number-icons nr-icon {
      color: var(--nr-text-secondary, #6b7280);
      padding-left: 4px;
      padding-right: 4px;
      width: 24px;
      height: 24px;
      transition: color 0.15s;
    }
    nr-input #number-icons nr-icon:hover {
      color: var(--nr-primary, #7c3aed);
    }
    nr-input #icons-separator {
      color: var(--nr-border, #d9d9d9);
    }

    /* ========================================
     * ADDON STYLES
     * ======================================== */
    nr-input .input-addon-before {
      background-color: var(--nr-bg-subtle, #fafafa);
      border: 1px solid var(--nr-border, #d9d9d9);
      border-right: none;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      color: var(--nr-text-secondary, #666);
      font-size: 13px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    nr-input .input-addon-after {
      background-color: var(--nr-bg-subtle, #fafafa);
      border: 1px solid var(--nr-border, #d9d9d9);
      border-left: none;
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      color: var(--nr-text-secondary, #666);
      font-size: 13px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Border radius adjustments when addons are present */
    nr-input .input-wrapper:has(.input-addon-before) #input-container {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: none;
    }
    nr-input .input-wrapper:has(.input-addon-after) #input-container {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
    }

    /* ========================================
     * PREFIX / SUFFIX
     * ======================================== */
    nr-input .input-prefix {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    nr-input .input-suffix {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ========================================
     * LABEL STYLES
     * ======================================== */
    nr-input [slot='label'] {
      color: var(--nr-text-secondary, #374151);
      font-size: 13px;
      padding-bottom: 4px;
      font-weight: 500;
    }
    nr-input[disabled] [slot='label'] {
      color: var(--nr-disabled, #9ca3af);
    }

    /* ========================================
     * HELPER TEXT STYLES
     * ======================================== */
    nr-input [slot='helper-text'] {
      color: var(--nr-text-secondary, #6b7280);
      font-size: 12px;
      padding-top: 4px;
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-height: 1.4;
    }
    nr-input[state='error'] [slot='helper-text'] {
      color: var(--nr-danger, #dc2626);
    }
    nr-input[state='warning'] [slot='helper-text'] {
      color: var(--nr-warning, #d97706);
    }
    nr-input[disabled] [slot='helper-text'] {
      color: var(--nr-disabled, #9ca3af);
    }

    /* ========================================
     * CHARACTER COUNT
     * ======================================== */
    nr-input .character-count {
      font-size: 12px;
      color: var(--nr-text-secondary, #6b7280);
      text-align: right;
      margin-top: 4px;
      font-family: inherit;
    }
    nr-input .character-count[data-over-limit] {
      color: var(--nr-danger, #dc2626);
    }

    /* ========================================
     * VALIDATION MESSAGE STYLES
     * ======================================== */
    nr-input .validation-message {
      font-size: 12px;
      font-family: inherit;
      margin-top: 4px;
      padding: 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-height: 1.4;
    }
    nr-input .validation-message.error {
      color: var(--nr-danger, #dc2626);
    }
    nr-input .validation-message.warning {
      color: var(--nr-warning, #d97706);
    }
    nr-input[disabled] .validation-message {
      opacity: 0.6;
    }

    /* Validation icon */
    nr-input .validation-icon {
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    nr-input .validation-icon.validation-loading {
      color: var(--nr-primary, #7c3aed);
      animation: nr-input-hourglass 2s ease-in-out infinite;
      transform-origin: center;
    }
    nr-input .validation-icon.validation-error {
      color: var(--nr-danger, #dc2626);
    }
    nr-input .validation-icon.validation-warning {
      color: var(--nr-warning, #d97706);
    }
    nr-input .validation-icon.validation-success {
      color: var(--nr-success, #16a34a);
    }

    @keyframes nr-input-hourglass {
      0% { opacity: 0.7; transform: scale(1); }
      25% { opacity: 1; transform: scale(1.03); }
      50% { opacity: 0.8; transform: scale(1); }
      75% { opacity: 1; transform: scale(1.03); }
      100% { opacity: 0.7; transform: scale(1); }
    }
  }
`;
