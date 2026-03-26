/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    nr-alert {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    nr-alert[hidden] {
      display: none;
    }

    nr-alert .alert {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    nr-alert .alert--banner {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }

    /* Success */
    nr-alert .alert--success {
      background-color: #f6ffed;
      border-color: #52c41a;
      color: #389e0d;
    }
    nr-alert .alert--success .alert__icon { color: #52c41a; }

    /* Info */
    nr-alert .alert--info {
      background-color: #e6f7ff;
      border-color: #1890ff;
      color: #096dd9;
    }
    nr-alert .alert--info .alert__icon { color: #1890ff; }

    /* Warning */
    nr-alert .alert--warning {
      background-color: #fffbe6;
      border-color: #faad14;
      color: #d48806;
    }
    nr-alert .alert--warning .alert__icon { color: #faad14; }

    /* Error */
    nr-alert .alert--error {
      background-color: #fff2f0;
      border-color: #ff4d4f;
      color: #cf1322;
    }
    nr-alert .alert--error .alert__icon { color: #ff4d4f; }

    /* With description */
    nr-alert .alert--with-description {
      padding: 0.75rem 1rem;
    }
    nr-alert .alert--with-description .alert__icon {
      font-size: 1.5rem;
    }

    nr-alert .alert__icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      line-height: 1;
    }

    nr-alert .alert__content {
      flex: 1;
      min-width: 0;
    }

    nr-alert .alert__message {
      font-weight: 500;
      margin: 0;
      line-height: 1.5;
    }

    nr-alert .alert--with-description .alert__message {
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }

    nr-alert .alert__description {
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
      line-height: 1.6;
      opacity: 0.85;
    }

    nr-alert .alert__close {
      flex-shrink: 0;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: currentColor;
      opacity: 0.6;
      transition: opacity 0.15s ease;
      line-height: 1;
    }

    nr-alert .alert__close:hover { opacity: 1; }
    nr-alert .alert__close:focus { outline: none; opacity: 1; }
    nr-alert .alert__close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
      border-radius: 2px;
    }

    /* Closing animation */
    @keyframes nr-alertFadeOut {
      from { opacity: 1; max-height: 200px; }
      to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; margin-top: 0; margin-bottom: 0; }
    }

    nr-alert .alert--closing {
      animation: nr-alertFadeOut 0.3s ease forwards;
      overflow: hidden;
    }

    /* Responsive */
    @media (max-width: 768px) {
      nr-alert .alert { padding: 0.5rem 0.75rem; }
      nr-alert .alert--with-description { padding: 0.75rem 1rem; }
    }
  }
`;
