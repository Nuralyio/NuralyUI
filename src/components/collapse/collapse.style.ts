/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

/**
 * Collapse component styles using theme variables
 * Follows NuralyUI architecture with clean CSS variable usage
 */
export const styles = css`
  :host {
    display: block;
    width: 100%;

    /* Force CSS custom property inheritance to ensure theme switching works properly */
    color: #161616;
    background-color: #ffffff;
  }

  /* Force re-evaluation of theme-dependent properties on theme change */
  :host([data-theme]) {
    color: inherit;
    background-color: inherit;
  }

  .collapse-container {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background-color: #ffffff;
    overflow: visible;
  }

  .collapse-section {
    position: relative;
    border-bottom: 1px solid #e0e0e0;
    transition: all 0.2s;
  }

  .collapse-section:last-child {
    border-bottom: none;
  }

  .collapse-section--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .collapse-section--non-collapsible .collapse-header {
    cursor: default;
  }

  .collapse-section--animating .collapse-content {
    overflow: hidden;
  }

  /* Header Styles */
  .collapse-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background-color: #f4f4f4;
    color: #161616;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.5;
    border: none;
    cursor: pointer;
    user-select: none;
    transition: 0.2s ease;
    border-radius: 0;
  }

  .collapse-header--clickable:hover {
    background-color: #e8e8e8;
  }

  .collapse-header--clickable:active {
    background-color: #d8d8d8;
  }

  .collapse-header--expanded {
    background-color: #e8e8e8;
  }

  .collapse-header--disabled {
    color: #c6c6c6;
    cursor: not-allowed;
  }

  .collapse-header:focus-visible {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.2);
  }

  .collapse-header-text {
    flex: 1;
    text-align: left;
  }

  .collapse-header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.75rem;
    color: inherit;
  }

  .collapse-header-right > * {
    flex-shrink: 0;
  }

  /* Icon Styles */
  .collapse-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    color: #525252;
    transition: transform 0.2s ease;
    transform-origin: center;
  }

  .collapse-header--disabled .collapse-icon {
    color: #c6c6c6;
  }

  /* Content Styles */
  .collapse-content {
    background-color: #ffffff;
    border-radius: 0;
    transition: 0.2s ease;
  }

  .collapse-content-inner {
    padding: 1rem;
    color: #161616;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* Size Variants */
  :host([size="small"]) .collapse-header {
    padding: 0.5rem 0.75rem;
  }

  :host([size="small"]) .collapse-content-inner {
    padding: 0.5rem 0.75rem;
  }

  :host([size="medium"]) .collapse-header {
    padding: 0.75rem 1rem;
  }

  :host([size="medium"]) .collapse-content-inner {
    padding: 0.75rem 1rem;
  }

  :host([size="large"]) .collapse-header {
    padding: 1rem 1.5rem;
  }

  :host([size="large"]) .collapse-content-inner {
    padding: 1rem 1.5rem;
  }

  /* Variant Styles */
  :host([variant="default"]) .collapse-container {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
  }

  :host([variant="bordered"]) .collapse-container {
    background-color: #ffffff;
    border: 2px solid #e0e0e0;
  }

  :host([variant="ghost"]) .collapse-container {
    background-color: transparent;
    border: 1px solid transparent;
  }

  :host([variant="ghost"]) .collapse-header:hover {
    background-color: #f4f4f4;
  }

  /* Accordion Mode */
  :host([accordion]) .collapse-section {
    border-bottom: 1px solid #e0e0e0;
  }

  /* Shadow Variants */
  :host(:not([variant="ghost"])) .collapse-container {
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  :host(:not([variant="ghost"])) .collapse-container:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .collapse-header,
    .collapse-icon,
    .collapse-content,
    .collapse-section {
      transition: none;
    }

    .collapse-icon--expanded {
      transform: none;
    }
  }

  /* High Contrast Mode */
  @media (prefers-contrast: high) {
    .collapse-header {
      border: 2px solid #e0e0e0;
    }

    .collapse-header:focus-visible {
      outline: 3px solid #7c3aed;
    }
  }
`;

// Export the styles for the collapse component
