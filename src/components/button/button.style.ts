import { css } from 'lit';

export const buttonStyles = css`
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :host([hidden]) {
    display: none;
  }

  button,
  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    padding: 6px 16px;
    border: 1px solid transparent;
    border-radius: 8px;
    background-color: #fff;
    color: #161616;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: none;
    gap: 6px;
  }

  button:focus,
  a:focus {
    outline: none;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #0f62fe;
    outline-offset: 2px;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Icon styling inside button */
  button nr-icon,
  a nr-icon {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 1;
    color: inherit;
    font-size: 1rem !important;
    cursor: inherit;
    pointer-events: none;
  }

  /* Container span */
  .button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: inherit;
  }

  /* ======== Type: Primary ======== */
  :host([type="primary"]) button {
    background-color: #7c3aed;
    border-color: #7c3aed;
    color: #fff;
    font-weight: 500;
  }
  :host([type="primary"]) button nr-icon {
    color: #fff !important;
  }
  :host([type="primary"]) button:hover:not(:disabled) {
    background-color: #6d28d9;
    border-color: #6d28d9;
  }
  :host([type="primary"]) button:active:not(:disabled) {
    background-color: #6d28d9;
    filter: brightness(0.9);
  }
  :host([type="primary"]) button:disabled {
    background-color: #c6c6c6;
    border-color: #c6c6c6;
    color: #525252;
    opacity: 0.5;
  }

  /* ======== Type: Secondary ======== */
  :host([type="secondary"]) button {
    background-color: #0f1419;
    border-color: #0f1419;
    color: #fff;
    font-weight: 500;
  }
  :host([type="secondary"]) button:hover:not(:disabled) {
    background-color: #272c30;
    border-color: #272c30;
  }
  :host([type="secondary"]) button:active:not(:disabled) {
    background-color: #3a3f44;
    border-color: #3a3f44;
  }
  :host([type="secondary"]) button:disabled {
    opacity: 0.5;
  }

  /* ======== Type: Default ======== */
  :host([type="default"]) button {
    background-color: #fff;
    border-color: #eff3f4;
    color: #536471;
    font-weight: 500;
  }
  :host([type="default"]) button:hover:not(:disabled) {
    border-color: #7c3aed;
    color: #7c3aed;
  }
  :host([type="default"]) button:active:not(:disabled) {
    background-color: #f7f9f9;
  }
  :host([type="default"]) button:disabled {
    opacity: 0.5;
  }

  /* ======== Type: Ghost ======== */
  :host([type="ghost"]) button {
    background-color: transparent;
    border-color: #7c3aed;
    color: #7c3aed;
    font-weight: 500;
  }
  :host([type="ghost"]) button:hover:not(:disabled) {
    background-color: rgba(124, 58, 237, 0.1);
  }
  :host([type="ghost"]) button:active:not(:disabled) {
    background-color: rgba(124, 58, 237, 0.15);
  }
  :host([type="ghost"]) button:disabled {
    opacity: 0.5;
  }

  /* ======== Type: Danger ======== */
  :host([type="danger"]) button {
    background-color: #dc2626;
    border-color: #dc2626;
    color: #fff;
    font-weight: 500;
  }
  :host([type="danger"]) button:hover:not(:disabled) {
    filter: brightness(0.9);
  }
  :host([type="danger"]) button:active:not(:disabled) {
    filter: brightness(0.8);
  }
  :host([type="danger"]) button:disabled {
    opacity: 0.5;
  }

  /* ======== Sizes ======== */
  :host([size="small"]) button {
    padding: 5px 14px;
    font-size: 13px;
    gap: 4px;
  }
  :host([size="small"]) button nr-icon {
    width: 0.875rem;
    height: 0.875rem;
    font-size: 0.875rem !important;
  }

  :host([size="medium"]) button {
    padding: 7px 18px;
    font-size: 14px;
  }

  :host([size="large"]) button {
    padding: 0.875rem 2rem;
    font-size: 1.0625rem;
    font-weight: 500;
  }
  :host([size="large"]) button nr-icon {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 1.25rem !important;
  }

  /* ======== Full width (block) ======== */
  :host([full-width]),
  :host([block]) {
    width: 100%;
  }
  :host([full-width]) button,
  :host([block]) button {
    width: 100%;
  }

  /* ======== Loading ======== */
  :host([loading]) button {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* ======== Shape: Round ======== */
  :host([shape="round"]) button {
    border-radius: 9999px;
  }

  /* ======== Shape: Circle ======== */
  :host([shape="circle"]) button {
    border-radius: 50%;
    min-width: auto;
    width: 36px;
    height: 36px;
    padding: 0;
  }
  :host([shape="circle"][size="small"]) button {
    width: 28px;
    height: 28px;
  }
  :host([shape="circle"][size="large"]) button {
    width: 44px;
    height: 44px;
  }

  /* ======== Dashed ======== */
  button.button-dashed {
    border-style: dashed;
  }

  /* ======== Ripple ======== */
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes ripple-animation {
    0% { transform: scale(0); opacity: 1; }
    70% { transform: scale(3); opacity: 0.5; }
    100% { transform: scale(4); opacity: 0; }
  }

  :host([type="primary"]) .ripple { background: rgba(255, 255, 255, 0.3); }
  :host([type="secondary"]) .ripple { background: rgba(255, 255, 255, 0.3); }
  :host([type="default"]) .ripple { background: rgba(0, 0, 0, 0.06); }
  :host([type="ghost"]) .ripple { background: rgba(124, 58, 237, 0.15); }
  :host([type="danger"]) .ripple { background: rgba(255, 255, 255, 0.3); }
`;

export const styles = buttonStyles;
