/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    nr-radio {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    nr-radio[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    nr-radio .radio-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    nr-radio .radio-input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      width: 0;
      height: 0;
    }

    nr-radio .radio-circle {
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
    nr-radio[size="small"] .radio-circle { width: 16px; height: 16px; }
    nr-radio[size="medium"] .radio-circle,
    nr-radio:not([size]) .radio-circle { width: 20px; height: 20px; }
    nr-radio[size="large"] .radio-circle { width: 24px; height: 24px; }

    nr-radio .radio-circle::after {
      content: '';
      display: block;
      border-radius: 50%;
      background: #1677ff;
      transform: scale(0);
      transition: transform 0.2s ease;
    }

    nr-radio[size="small"] .radio-circle::after { width: 8px; height: 8px; }
    nr-radio[size="medium"] .radio-circle::after,
    nr-radio:not([size]) .radio-circle::after { width: 10px; height: 10px; }
    nr-radio[size="large"] .radio-circle::after { width: 12px; height: 12px; }

    /* Checked */
    nr-radio[checked] .radio-circle { border-color: #1677ff; }
    nr-radio[checked] .radio-circle::after { transform: scale(1); }

    /* Focus */
    nr-radio .radio-input:focus-visible + .radio-circle {
      outline: 2px solid #1677ff;
      outline-offset: 2px;
    }

    /* Hover */
    nr-radio:not([disabled]):hover .radio-circle { border-color: #1677ff; }

    /* Disabled */
    nr-radio[disabled] .radio-circle {
      background: #f5f5f5;
      border-color: #d9d9d9;
    }
    nr-radio[disabled][checked] .radio-circle::after { background: #bfbfbf; }

    /* Label */
    nr-radio .radio-label {
      display: inline-block;
      line-height: 1.5;
    }

    /* Size-based label font sizes */
    nr-radio[size="small"] .radio-label { font-size: 12px; }
    nr-radio[size="medium"] .radio-label,
    nr-radio:not([size]) .radio-label { font-size: 14px; }
    nr-radio[size="large"] .radio-label { font-size: 16px; }

    nr-radio[disabled] .radio-label { color: #bfbfbf; }
  }
`;
