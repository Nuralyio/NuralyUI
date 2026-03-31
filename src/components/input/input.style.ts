import { css } from 'lit';

export const styles = css`
  /* ========================================
   * HOST ELEMENT
   * ======================================== */
  :host {
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 13px;
    line-height: 1.4;
  }

  /* ========================================
   * INPUT WRAPPER
   * ======================================== */
  .input-wrapper {
    display: flex;
    align-items: stretch;
    width: 100%;
    background-color: transparent;
  }

  /* ========================================
   * INPUT CONTAINER
   * ======================================== */
  #input-container {
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

  :host(:not([disabled])) #input-container:hover {
    border-color: var(--nr-primary, #7c3aed);
  }

  :host(:not([disabled])) #input-container:focus-within {
    border-color: var(--nr-primary, #7c3aed);
    box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.15);
    outline: none;
  }

  /* ========================================
   * INPUT ELEMENT
   * ======================================== */
  #input-container > input {
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

  ::placeholder {
    color: var(--nr-placeholder, #a8a8a8);
    font-size: 13px;
    font-family: inherit;
  }

  /* Remove default number spinners */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }

  /* ========================================
   * SIZE VARIATIONS
   * ======================================== */

  /* Small */
  div[data-size='small'] {
    min-height: 28px;
  }
  div[data-size='small'] > input {
    padding: 4px 8px;
    font-size: 12px;
  }

  /* Medium (default) */
  div[data-size='medium'] {
    min-height: 32px;
  }
  div[data-size='medium'] > input {
    padding: 6px 10px;
    font-size: 13px;
  }

  /* Large */
  div[data-size='large'] {
    min-height: 38px;
  }
  div[data-size='large'] > input {
    padding: 8px 12px;
    font-size: 14px;
  }

  /* ========================================
   * VARIANT STYLES
   * ======================================== */

  /* Outlined (default) */
  :host([variant='outlined']) #input-container {
    border: 1px solid var(--nr-border, #d1d5db);
    border-radius: 8px;
    background-color: transparent;
  }
  :host([variant='outlined']) .input-wrapper {
    background-color: transparent;
  }
  :host([variant='outlined']:not([state='error']):not([disabled])) #input-container:hover {
    border-color: var(--nr-primary, #7c3aed);
  }
  :host([variant='outlined']:not([state='error'])) #input-container:focus-within {
    border-color: var(--nr-primary, #7c3aed);
    box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.15);
  }

  /* Filled */
  :host([variant='filled']) #input-container {
    background-color: var(--nr-bg-subtle, #f5f5f5);
    border-radius: 8px;
    border-bottom: 1px solid var(--nr-border, #d9d9d9);
    border-top: none;
    border-left: none;
    border-right: none;
  }
  :host([variant='filled']) .input-wrapper {
    background-color: transparent;
  }
  :host([variant='filled']:not([state='error'])) #input-container:focus-within {
    border-bottom-color: var(--nr-primary, #7c3aed);
    border-top: none;
    border-left: none;
    border-right: none;
  }

  /* Borderless */
  :host([variant='borderless']) #input-container {
    background-color: transparent;
    border: none;
    border-radius: 8px;
  }
  :host([variant='borderless']) .input-wrapper {
    background-color: transparent;
  }
  :host([variant='borderless']:not([state='error'])) #input-container:focus-within {
    outline: 1px solid var(--nr-primary, #7c3aed);
    border: none;
  }

  /* Underlined */
  :host([variant='underlined']) #input-container {
    border-bottom: 1px solid var(--nr-border, #d9d9d9);
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  :host([variant='underlined']:not([state='error'])) #input-container:focus-within {
    border-bottom-color: var(--nr-primary, #7c3aed);
    border-top: none;
    border-left: none;
    border-right: none;
  }

  /* ========================================
   * STATE STYLES
   * ======================================== */

  /* Error */
  :host(:not([disabled])[state='error']) #input-container {
    border-color: var(--nr-danger, #dc2626) !important;
  }
  :host(:not([disabled])[state='error']) #input-container:focus-within {
    border-color: var(--nr-danger, #dc2626) !important;
    box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.15) !important;
  }
  :host([variant='underlined'][state='error']) #input-container,
  :host([variant='filled'][state='error']) #input-container {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom-color: var(--nr-danger, #dc2626) !important;
  }
  :host([variant='borderless'][state='error']) #input-container {
    border: 1px solid var(--nr-danger, #dc2626) !important;
  }

  /* Warning */
  :host(:not([disabled])[state='warning']) #input-container {
    border-color: var(--nr-warning, #d97706) !important;
  }
  :host(:not([disabled])[state='warning']) #input-container:focus-within {
    border-color: var(--nr-warning, #d97706) !important;
    box-shadow: 0 0 0 1px rgba(217, 119, 6, 0.15) !important;
  }

  /* Success */
  :host(:not([disabled])[state='success']) #input-container {
    border-color: var(--nr-success, #16a34a) !important;
  }
  :host(:not([disabled])[state='success']) #input-container:focus-within {
    border-color: var(--nr-success, #16a34a) !important;
    box-shadow: 0 0 0 1px rgba(22, 163, 74, 0.15) !important;
  }

  /* Warning/error — number icon position */
  :host([state='error']) input[type='number'] ~ #number-icons,
  :host([state='warning']) input[type='number'] ~ #number-icons {
    position: static;
    padding-left: 4px;
  }

  /* ========================================
   * DISABLED
   * ======================================== */
  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }
  :host([disabled]) .input-wrapper {
    background-color: #f4f4f4;
  }
  :host([disabled]) #input-container {
    background-color: #f5f5f5;
    border-color: var(--nr-border, #d9d9d9);
    cursor: not-allowed;
  }
  :host([disabled]) #input-container > input {
    background-color: transparent;
    cursor: not-allowed;
    color: var(--nr-disabled, rgba(0, 0, 0, 0.25));
  }
  :host([disabled]) ::placeholder {
    color: var(--nr-disabled, #c6c6c6);
  }
  :host([disabled]) #password-icon,
  :host([disabled]) #error-icon,
  :host([disabled]) #warning-icon,
  :host([disabled]) #number-icons,
  :host([disabled]) #calendar-icon,
  :host([disabled]) #copy-icon,
  :host([disabled]) #clear-icon {
    opacity: 0.5;
  }
  :host([disabled]) #password-icon,
  :host([disabled]) #number-icons,
  :host([disabled]) #copy-icon,
  :host([disabled]) #clear-icon {
    cursor: not-allowed;
  }

  /* ========================================
   * ICON STYLES
   * ======================================== */
  #input-container nr-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    height: 100%;
    max-height: 100%;
  }

  #warning-icon {
    --nuraly-color-icon: var(--nr-warning, #f1c21b);
  }
  #error-icon {
    --nuraly-color-icon: var(--nr-danger, #da1e28);
  }
  #calendar-icon {
    --nuraly-color-icon: var(--nr-text, #161616);
  }
  #password-icon {
    padding-left: 8px;
    padding-right: 8px;
    cursor: pointer;
    color: var(--nr-text-secondary, #6b7280);
    transition: color 0.15s;
  }
  #password-icon:hover { color: var(--nr-primary, #7c3aed); }

  #copy-icon {
    padding-right: 8px;
    cursor: pointer;
    color: var(--nr-text-secondary, #6b7280);
    transition: color 0.15s;
  }
  #copy-icon:hover { color: var(--nr-primary, #7c3aed); }

  #clear-icon {
    padding-right: 8px;
    cursor: pointer;
    color: var(--nr-text-secondary, #6b7280);
    transition: color 0.15s;
  }
  #clear-icon:hover { color: var(--nr-danger, #dc2626); }

  /* Number icons */
  #number-icons {
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
  #number-icons nr-icon {
    color: var(--nr-text-secondary, #6b7280);
    padding-left: 4px;
    padding-right: 4px;
    width: 24px;
    height: 24px;
    transition: color 0.15s;
  }
  #number-icons nr-icon:hover {
    color: var(--nr-primary, #7c3aed);
  }
  #icons-separator {
    color: var(--nr-border, #d9d9d9);
  }

  /* ========================================
   * ADDON STYLES
   * ======================================== */
  .input-addon-before {
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
  .input-addon-after {
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
  .input-wrapper:has(.input-addon-before) #input-container {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: none;
  }
  .input-wrapper:has(.input-addon-after) #input-container {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }

  /* ========================================
   * PREFIX / SUFFIX
   * ======================================== */
  .input-prefix {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .input-suffix {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ========================================
   * LABEL STYLES
   * ======================================== */
  ::slotted([slot='label']) {
    color: var(--nr-text-secondary, #374151);
    font-size: 13px;
    padding-bottom: 4px;
    font-weight: 500;
  }
  :host([disabled]) ::slotted([slot='label']) {
    color: var(--nr-disabled, #9ca3af);
  }

  /* ========================================
   * HELPER TEXT STYLES
   * ======================================== */
  ::slotted([slot='helper-text']) {
    color: var(--nr-text-secondary, #6b7280);
    font-size: 12px;
    padding-top: 4px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
  }
  :host([state='error']) ::slotted([slot='helper-text']) {
    color: var(--nr-danger, #dc2626);
  }
  :host([state='warning']) ::slotted([slot='helper-text']) {
    color: var(--nr-warning, #d97706);
  }
  :host([disabled]) ::slotted([slot='helper-text']) {
    color: var(--nr-disabled, #9ca3af);
  }

  /* ========================================
   * CHARACTER COUNT
   * ======================================== */
  .character-count {
    font-size: 12px;
    color: var(--nr-text-secondary, #6b7280);
    text-align: right;
    margin-top: 4px;
    font-family: inherit;
  }
  .character-count[data-over-limit] {
    color: var(--nr-danger, #dc2626);
  }

  /* ========================================
   * VALIDATION MESSAGE STYLES
   * ======================================== */
  .validation-message {
    font-size: 12px;
    font-family: inherit;
    margin-top: 4px;
    padding: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
  }
  .validation-message.error {
    color: var(--nr-danger, #dc2626);
  }
  .validation-message.warning {
    color: var(--nr-warning, #d97706);
  }
  :host([disabled]) .validation-message {
    opacity: 0.6;
  }

  /* Validation icon */
  .validation-icon {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .validation-icon.validation-loading {
    color: var(--nr-primary, #7c3aed);
    animation: nr-input-hourglass 2s ease-in-out infinite;
    transform-origin: center;
  }
  .validation-icon.validation-error {
    color: var(--nr-danger, #dc2626);
  }
  .validation-icon.validation-warning {
    color: var(--nr-warning, #d97706);
  }
  .validation-icon.validation-success {
    color: var(--nr-success, #16a34a);
  }

  @keyframes nr-input-hourglass {
    0% { opacity: 0.7; transform: scale(1); }
    25% { opacity: 1; transform: scale(1.03); }
    50% { opacity: 0.8; transform: scale(1); }
    75% { opacity: 1; transform: scale(1.03); }
    100% { opacity: 0.7; transform: scale(1); }
  }
`;
