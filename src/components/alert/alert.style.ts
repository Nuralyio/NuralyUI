/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  :host([hidden]) {
    display: none;
  }

  .alert {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .alert--banner {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  /* Success */
  .alert--success {
    background-color: #f6ffed;
    border-color: #52c41a;
    color: #389e0d;
  }
  .alert--success .alert__icon { color: #52c41a; }

  /* Info */
  .alert--info {
    background-color: #e6f7ff;
    border-color: #1890ff;
    color: #096dd9;
  }
  .alert--info .alert__icon { color: #1890ff; }

  /* Warning */
  .alert--warning {
    background-color: #fffbe6;
    border-color: #faad14;
    color: #d48806;
  }
  .alert--warning .alert__icon { color: #faad14; }

  /* Error */
  .alert--error {
    background-color: #fff2f0;
    border-color: #ff4d4f;
    color: #cf1322;
  }
  .alert--error .alert__icon { color: #ff4d4f; }

  /* With description */
  .alert--with-description {
    padding: 0.75rem 1rem;
  }
  .alert--with-description .alert__icon {
    font-size: 1.5rem;
  }

  .alert__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    line-height: 1;
  }

  .alert__content {
    flex: 1;
    min-width: 0;
  }

  .alert__message {
    font-weight: 500;
    margin: 0;
    line-height: 1.5;
  }

  .alert--with-description .alert__message {
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
  }

  .alert__description {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    line-height: 1.6;
    opacity: 0.85;
  }

  .alert__close {
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

  .alert__close:hover { opacity: 1; }
  .alert__close:focus { outline: none; opacity: 1; }
  .alert__close:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
    border-radius: 2px;
  }

  /* Closing animation */
  @keyframes nr-alertFadeOut {
    from { opacity: 1; max-height: 200px; }
    to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; margin-top: 0; margin-bottom: 0; }
  }

  .alert--closing {
    animation: nr-alertFadeOut 0.3s ease forwards;
    overflow: hidden;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .alert { padding: 0.5rem 0.75rem; }
    .alert--with-description { padding: 0.75rem 1rem; }
  }
`;
