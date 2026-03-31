/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  :host([disabled]) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .radio-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .radio-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 0;
    height: 0;
  }

  .radio-circle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px solid #d9d9d9;
    background: #ffffff;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  /* Size variants */
  :host([size="small"]) .radio-circle { width: 16px; height: 16px; }
  :host([size="medium"]) .radio-circle,
  :host(:not([size])) .radio-circle { width: 20px; height: 20px; }
  :host([size="large"]) .radio-circle { width: 24px; height: 24px; }

  .radio-circle::after {
    content: '';
    display: block;
    border-radius: 50%;
    background: #1677ff;
    transform: scale(0);
    transition: transform 0.2s ease;
  }

  :host([size="small"]) .radio-circle::after { width: 8px; height: 8px; }
  :host([size="medium"]) .radio-circle::after,
  :host(:not([size])) .radio-circle::after { width: 10px; height: 10px; }
  :host([size="large"]) .radio-circle::after { width: 12px; height: 12px; }

  /* Checked */
  :host([checked]) .radio-circle { border-color: #1677ff; }
  :host([checked]) .radio-circle::after { transform: scale(1); }

  /* Focus */
  .radio-input:focus-visible + .radio-circle {
    outline: 2px solid #1677ff;
    outline-offset: 2px;
  }

  /* Hover */
  :host(:not([disabled])):hover .radio-circle { border-color: #1677ff; }

  /* Disabled */
  :host([disabled]) .radio-circle {
    background: #f5f5f5;
    border-color: #d9d9d9;
  }
  :host([disabled][checked]) .radio-circle::after { background: #bfbfbf; }

  /* Label */
  .radio-label {
    display: inline-block;
    line-height: 1.5;
  }

  /* Size-based label font sizes */
  :host([size="small"]) .radio-label { font-size: 12px; }
  :host([size="medium"]) .radio-label,
  :host(:not([size])) .radio-label { font-size: 14px; }
  :host([size="large"]) .radio-label { font-size: 16px; }

  :host([disabled]) .radio-label { color: #bfbfbf; }
`;
