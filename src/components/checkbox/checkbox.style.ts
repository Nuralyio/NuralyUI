import { css } from 'lit';

const checkBoxStyles = css`
  :host {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5715;
    color: #161616;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  /* Input base */
  input {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    position: relative;
    border-radius: 2px;
    background-color: #ffffff;
    border: 1px solid #d9d9d9;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    margin: 0;
    outline: none;
  }

  /* Sizes */
  input {
    width: 16px;
    height: 16px;
  }
  :host([size="small"]) input {
    width: 14px;
    height: 14px;
  }
  :host([size="large"]) input {
    width: 18px;
    height: 18px;
  }

  /* Checked / indeterminate */
  :host(:not([disabled])[checked]) input,
  :host(:not([disabled])[indeterminate]) input {
    background-color: #7c3aed;
    border: 1px solid #7c3aed;
  }

  /* Hover */
  :host(:not([disabled])):hover input {
    border-color: #7c3aed;
  }

  /* Focus */
  input:focus,
  input:focus-visible {
    border-color: #7c3aed;
    outline: 2px solid rgba(124, 58, 237, 0.2);
    outline-offset: 2px;
  }

  /* Disabled */
  :host([disabled]) {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
  :host([disabled]) input {
    background-color: #f5f5f5;
    border: 1px solid #d9d9d9;
    cursor: not-allowed;
  }

  /* Checkmark base */
  input:after {
    color: #ffffff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -51%);
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  /* Checked checkmark */
  :host([checked]) input:after {
    border: solid #ffffff;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -51%) rotate(45deg);
    content: '';
  }
  :host([checked]) input:after { width: 3px; height: 9px; }
  :host([checked][size="small"]) input:after { width: 2px; height: 7px; }
  :host([checked][size="large"]) input:after { width: 4px; height: 10px; }

  /* Indeterminate */
  :host([indeterminate]:not([checked])) input:after {
    content: '-';
    color: #ffffff;
    font-weight: bold;
    transform: translate(-50%, -51%);
  }
  :host([indeterminate][size="small"]) input:after { font-size: 10px; }
  :host([indeterminate][size="medium"]) input:after { font-size: 11px; }
  :host([indeterminate][size="large"]) input:after { font-size: 13px; }

  /* Empty state */
  :host(:not([checked]):not([indeterminate])) input:after {
    content: '';
  }

  /* Disabled checkmark */
  :host([disabled]) input:after {
    color: rgba(0, 0, 0, 0.25);
    border-color: rgba(0, 0, 0, 0.25);
  }

  /* Label */
  .checkbox-label {
    flex: 1;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  :host([disabled]) .checkbox-label {
    cursor: not-allowed;
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    :host,
    input,
    input:after,
    .checkbox-label {
      transition: none;
    }
  }

  @media (prefers-contrast: high) {
    input { border-width: 2px; }
    :host([checked]) input:after,
    :host([indeterminate]) input:after { font-weight: 900; }
  }
`;

export const styles = checkBoxStyles;
