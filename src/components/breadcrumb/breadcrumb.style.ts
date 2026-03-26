/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    nr-breadcrumb {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--nr-text-secondary);
    }

    nr-breadcrumb .breadcrumb {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    nr-breadcrumb .breadcrumb-item {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      position: relative;
    }

    nr-breadcrumb .breadcrumb-item:not(:last-child) {
      margin-right: 8px;
    }

    nr-breadcrumb .breadcrumb-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--nr-primary);
      text-decoration: none;
      transition: color 0.15s ease;
      cursor: pointer;
      padding: 0.25rem 0;
      border-radius: 2px;
    }

    nr-breadcrumb .breadcrumb-link:hover {
      color: #0353e9;
    }

    nr-breadcrumb .breadcrumb-link:focus {
      outline: 2px solid var(--nr-focus);
      outline-offset: 2px;
    }

    nr-breadcrumb .breadcrumb-link.disabled {
      color: var(--nr-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }

    nr-breadcrumb .breadcrumb-text {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: var(--nr-text);
      padding: 0.25rem 0;
    }

    nr-breadcrumb .breadcrumb-separator {
      display: inline-flex;
      align-items: center;
      color: var(--nr-text-secondary);
      margin: 0 8px;
      user-select: none;
      font-size: 14px;
    }

    nr-breadcrumb .breadcrumb-icon {
      display: inline-flex;
      align-items: center;
      font-size: 14px;
    }

    /* Dropdown menu */
    nr-breadcrumb .breadcrumb-item-with-menu { position: relative; }
    nr-breadcrumb .breadcrumb-item-with-menu:hover .breadcrumb-dropdown { display: block; }

    nr-breadcrumb .breadcrumb-dropdown {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      background-color: var(--nr-surface);
      border: 1px solid var(--nr-border);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      min-width: 160px;
      margin-top: 0.25rem;
      padding: 0.25rem 0;
    }

    nr-breadcrumb .breadcrumb-menu-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      color: var(--nr-text);
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    nr-breadcrumb .breadcrumb-menu-item:hover {
      background-color: var(--nr-bg-hover);
    }

    nr-breadcrumb .breadcrumb-menu-item.disabled {
      color: var(--nr-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }

    /* RTL */
    nr-breadcrumb[dir="rtl"] .breadcrumb { direction: rtl; }
    nr-breadcrumb[dir="rtl"] .breadcrumb-item:not(:last-child) {
      margin-right: 0;
      margin-left: 8px;
    }
    nr-breadcrumb[dir="rtl"] .breadcrumb-separator { transform: scaleX(-1); }
  }
`;
