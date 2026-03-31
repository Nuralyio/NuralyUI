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
    color: var(--nr-text-secondary, #525252);
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .breadcrumb-item {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    position: relative;
  }

  .breadcrumb-item:not(:last-child) {
    margin-right: 8px;
  }

  .breadcrumb-link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--nr-primary, #7c3aed);
    text-decoration: none;
    transition: color 0.15s ease;
    cursor: pointer;
    padding: 0.25rem 0;
    border-radius: 2px;
  }

  .breadcrumb-link:hover {
    color: #0353e9;
  }

  .breadcrumb-link:focus {
    outline: 2px solid var(--nr-focus, #7c3aed);
    outline-offset: 2px;
  }

  .breadcrumb-link.disabled {
    color: var(--nr-disabled, #c6c6c6);
    cursor: not-allowed;
    pointer-events: none;
  }

  .breadcrumb-text {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--nr-text, #161616);
    padding: 0.25rem 0;
  }

  .breadcrumb-separator {
    display: inline-flex;
    align-items: center;
    color: var(--nr-text-secondary, #525252);
    margin: 0 8px;
    user-select: none;
    font-size: 14px;
  }

  .breadcrumb-icon {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
  }

  /* Dropdown menu */
  .breadcrumb-item-with-menu { position: relative; }
  .breadcrumb-item-with-menu:hover .breadcrumb-dropdown { display: block; }

  .breadcrumb-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    background-color: var(--nr-surface, #ffffff);
    border: 1px solid var(--nr-border, #e0e0e0);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    min-width: 160px;
    margin-top: 0.25rem;
    padding: 0.25rem 0;
  }

  .breadcrumb-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    color: var(--nr-text, #161616);
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .breadcrumb-menu-item:hover {
    background-color: var(--nr-bg-hover, #f4f4f4);
  }

  .breadcrumb-menu-item.disabled {
    color: var(--nr-disabled, #c6c6c6);
    cursor: not-allowed;
    pointer-events: none;
  }

  /* RTL */
  :host([dir="rtl"]) .breadcrumb { direction: rtl; }
  :host([dir="rtl"]) .breadcrumb-item:not(:last-child) {
    margin-right: 0;
    margin-left: 8px;
  }
  :host([dir="rtl"]) .breadcrumb-separator { transform: scaleX(-1); }
`;
