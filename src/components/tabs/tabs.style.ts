import { css } from 'lit';

/**
 * Tabs component styles for the Hybrid UI Library
 * Using shared CSS variables from /src/shared/themes/
 *
 * This file contains all the styling for the nr-tabs component with
 * clean CSS variable usage without local fallbacks and proper theme switching support.
 */
export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;

    /* Force CSS custom property inheritance to ensure theme switching works properly */
    color: #161616;
    background-color: #ffffff;

    /* Minimal transitions for better performance */

  }

  /* When tabs are inside a panel, adjust sizing */
  :host-context(nr-panel) {
    height: 100%;
    min-height: 0;
  }

  /* Ensure tabs container fills available space when in panel */
  nr-panel .tabs-container,
  :host-context(nr-panel) .tabs-container {
    height: 100%;
    min-height: 0;
    flex: 1;
  }

  /* Force re-evaluation of theme-dependent properties on theme change */
  :host([data-theme]) {
    color: inherit;
    background-color: inherit;
  }

  .tabs-container {
    display: flex;
    flex: 1;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 6px;
    box-shadow: none;
  }

  /* Hide tabs container when all tabs are popped out */
  .tabs-container.no-visible-tabs {
    display: none;
    height: 0;
    min-height: 0;
    overflow: hidden;
  }

  .tab-labels {
    display: flex;
    flex-shrink: 0;
    background-color: #f4f4f4;
    border: none;
  }

  /* Tab label base styles */
  .tab-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
    cursor: pointer;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid transparent;
    background-color: transparent;
    color: #161616;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    user-select: none;
    white-space: nowrap;
  }

  .tab-label:hover {
    color: #7c3aed;
    background-color: #f4f4f4;
    border-color: transparent;
  }

  .tab-label:focus {
    outline: 2px solid #7c3aed;
    outline-offset: -2px;
  }

  .tab-label.active {
    color: #7c3aed;
    background-color: #ffffff;
    border-color: #7c3aed;
    font-weight: 500;
  }

  /* Positioning-specific border radius for horizontal tabs */
  .tab-label.first-tab {
    border-radius: 6px 0 0 6px;
  }

  .tab-label.middle-tab {
    border-radius: 0;
  }

  .tab-label.last-tab {
    border-radius: 0 6px 6px 0;
  }

  .tab-label.single-tab {
    border-radius: 6px;
  }

  .tab-label.disabled {
    cursor: not-allowed;
    color: #c6c6c6;
    background-color: #f4f4f4;
  }

  .tab-label.disabled:hover {
    color: #c6c6c6;
    background-color: #f4f4f4;
    border-color: transparent;
  }

  /* Tab icon styling */
  .tab-icon {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    color: inherit;
  }

  /* Tab text styling */
  .tab-text {
    flex: 1;
    color: inherit;
    text-align: center;
  }

  .tab-text[contenteditable="true"] {
    cursor: text;
    outline: none;
  }

  .tab-text[contenteditable="true"]:focus {
    background-color: #ffffff;
    border-radius: 4px;
    padding: 0.25rem;
  }

  /* Close/delete icon styling */
  .close-icon {
    flex-shrink: 0;
    width: 0.875rem;
    height: 0.875rem;
    color: #525252;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
  }

  .close-icon:hover {
    color: #161616;
    background-color: #e0e0e0;
  }

  .close-icon:active {
    color: #161616;
    background-color: #c6c6c6;
  }

  /* Pop-out icon styling */
  .pop-out-icon {
    flex-shrink: 0;
    width: 0.875rem;
    height: 0.875rem;
    color: #525252;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    margin-right: 0.25rem;
  }

  .pop-out-icon:hover {
    color: #161616;
    background-color: #e0e0e0;
  }

  .pop-out-icon:active {
    color: #161616;
    background-color: #c6c6c6;
  }

  /* Tab actions container */
  .tab-actions {
    display: flex;
    align-items: center;
    gap: 0;
  }

  /* Add tab button styling */
  .add-tab-label {
    min-width: auto;
    width: 2.5rem;
    color: #525252;
  }

  .add-tab-label:hover {
    color: #7c3aed;
    background-color: #f4f4f4;
  }

  .add-tab-icon {
    width: 1rem;
    height: 1rem;
    color: inherit;
  }

  /* Tab content area */
  .tab-content {
    flex: 1;
    padding: 1rem;
    background-color: #ffffff;
    border-top: none;
    border-right: none;
    border-bottom: none;
    border-left: none;
    overflow: auto;
    min-height: 0;
  }

  /* Orientation specific styles */
  .vertical-align {
    flex-direction: row;

    .tab-labels {
      flex-direction: column;
      min-width: 12rem;
    }

    .tab-content {
      border-top: none;
      border-left: 1px solid #e0e0e0;
    }

    .tab-label {
      border-bottom: none;
      border-right: 1px solid transparent;
    }
  }

  .vertical-align .tab-label:hover,
  .vertical-align .tab-label.active {
    border-right-color: #7c3aed;
  }

  .vertical-align.right-align {
    flex-direction: row-reverse;
  }

  .vertical-align.right-align .tab-content {
    border-left: none;
    border-right: 1px solid #e0e0e0;
  }

  .vertical-align.right-align .tab-label {
    border-right: none;
    border-left: 1px solid transparent;
  }

  .vertical-align.right-align .tab-label:hover,
  .vertical-align.right-align .tab-label.active {
    border-left-color: #7c3aed;
    border-right-color: transparent;
  }

  /* Alignment specific styles */
  .right-align > .tab-labels {
    flex-direction: row-reverse;
    align-self: flex-end;
  }

  .center-align > .tab-labels {
    align-self: center;
  }

  /* Stretch alignment - tabs fill full width with equal sizes */
  .stretch-align > .tab-labels {
    width: 100%;
  }

  .stretch-align .tab-label {
    flex: 1;
    min-width: 0; /* Allow flex items to shrink below their content size */
  }

  /* Ensure add-tab button doesn't stretch when using stretch alignment */
  .stretch-align .add-tab-label {
    flex: 0 0 auto;
    width: 2.5rem;
  }

  .horizontal-align {
    flex-direction: column;
    min-height: 0;
  }

  /* Size variations */
  .tabs-container[data-size="small"] {
    .tab-label {
      padding: 0.5rem 0.75rem;
      font-size: 0.75rem;
      gap: 0.25rem;
    }

    .tab-text {
      font-size: 0.75rem;
      text-align: center;
    }

    .tab-icon {
      width: calc(1rem * 0.875);
      height: calc(1rem * 0.875);
    }

    .close-icon {
      width: calc(0.875rem * 0.875);
      height: calc(0.875rem * 0.875);
    }

    .tab-content {
      padding: 0.75rem;
    }
  }

  .tabs-container[data-size="large"] {
    .tab-label {
      padding: 1rem 1.5rem;
      font-size: 1.125rem;
      gap: 0.75rem;
    }

    .tab-text {
      font-size: 1.125rem;
      text-align: center;
    }

    .tab-icon {
      width: calc(1rem * 1.25);
      height: calc(1rem * 1.25);
    }

    .close-icon {
      width: calc(0.875rem * 1.25);
      height: calc(0.875rem * 1.25);
    }

    .tab-content {
      padding: 1.5rem;
    }
  }

  /* Type variations */

  /* Default variant - uses standard theme variables */
  .tabs-container[data-type="default"] .tab-labels {
    gap: 0.5rem;
  }

  .tabs-container[data-type="default"] .tab-label {
    background-color: transparent;
    border-top: 1px solid transparent;
    border-right: 1px solid transparent;
    border-bottom: 1px solid transparent;
    border-left: 1px solid transparent;
    color: #161616;
    border-radius: 6px;
  }

  .tabs-container[data-type="default"] .tab-label:hover {
    background-color: #f4f4f4;
    color: #7c3aed;
    border-top-width: 1px;
    border-right-width: 1px;
    border-bottom-width: 1px;
    border-left-width: 1px;
  }

  .tabs-container[data-type="default"] .tab-label.active {
    background-color: #ffffff;
    color: #7c3aed;
    border-top-width: 1px;
    border-right-width: 1px;
    border-bottom-width: 2px;
    border-left-width: 1px;
    border-color: #7c3aed;
    font-weight: 500;
  }



  /* Line variant - underline on active tab */
  .tabs-container[data-type="line"] .tab-labels {
    gap: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .tabs-container[data-type="line"] .tab-label {
    padding: 0.5rem 0;
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    background-color: transparent;
    font-weight: 400;
    font-size: 1rem;
    margin-bottom: calc(-1 * 1px);
  }

  .tabs-container[data-type="line"] .tab-label:hover {
    background-color: transparent;
    border-bottom-color: currentColor;
  }

  .tabs-container[data-type="line"] .tab-label.active {
    background-color: transparent;
    border-bottom-color: currentColor;
    font-weight: 700;
    color: inherit;
  }

  .tabs-container[data-type="line"] .tab-content {
    border-top: none;
  }

  .tabs-container[data-type="card"] .tab-label {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin: 0 0.25rem;
  }

  .tabs-container[data-type="card"] .tab-label.active {
    background-color: #7c3aed;
    color: #ffffff;
    border-color: #7c3aed;
  }

  .tabs-container[data-type="bordered"] {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
  }

  /* Drag and drop states */
  .tab-label.dragging-start {
    opacity: 0.7;
    border: 1px dashed #525252;
    background-color: #f4f4f4;
  }

  .tab-label.dragging {
    border: 1px dashed #7c3aed;
    background-color: rgba(124, 58, 237, 0.08);
    opacity: 0.8;
  }

  /* Minimal animation support for better performance */

  /* Pop-out placeholder styles */
  .tab-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    padding: 1rem;
    text-align: center;
    background-color: #f4f4f4;
    border: 2px dashed #e0e0e0;
    border-radius: 6px;
    color: #525252;
  }

  .placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .placeholder-icon {
    font-size: 2rem;
    opacity: 0.6;
  }

  .placeholder-text {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .placeholder-text strong {
    color: #161616;
    font-weight: 500;
  }

  .pop-in-button {
    background-color: #7c3aed;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .pop-in-button:hover {
    background-color: #6d28d9;
  }

  .pop-in-button:active {
    background-color: #5b21b6;
  }

  /* Placeholder tab styling */
  .tab-label.tab-placeholder-state {
    background-color: #f4f4f4;
    border: 1px dashed #e0e0e0;
    opacity: 0.8;
  }

  .tab-label.tab-placeholder-state .tab-text {
    font-style: italic;
    opacity: 0.7;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }

  /* Focus management for keyboard navigation */
  .tab-label[tabindex="0"] {
    position: relative;
  }

  .tab-label:focus-visible {
    z-index: 1;
  }
`;
