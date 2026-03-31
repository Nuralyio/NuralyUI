import { css } from 'lit';

const menuStyle = css`
  /* Root menu container */
  :host {
    display: block;
  }

  .menu-root {
    font-size: 0.875rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    line-height: 1.5;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Menu Link Styles */
  .menu-link {
    list-style: none;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 1px;
    color: #161616;
    background-color: transparent;
    border-left: 4px solid transparent;
    border-top: 2px solid transparent;
    border-right: 2px solid transparent;
    border-bottom: 2px solid transparent;
    border-radius: 6px;
    margin-bottom: 4px;
    gap: 8px;
  }

  .menu-link.disabled {
    color: #c6c6c6;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .menu-link:not(.disabled):not(.selected):hover {
    background-color: #f4f4f4;
    color: #161616;
  }

  .menu-link.selected {
    background-color: rgba(124, 58, 237, 0.08);
    color: #7c3aed;
    border-left-color: #7c3aed;
  }

  .menu-link:not(.disabled):not(.selected):focus {
    outline: none;
    border-color: #7c3aed;
    border-left-color: transparent;
    color: #7c3aed;
  }

  .menu-link.selected:not(.disabled):focus {
    outline: none;
    border-left-color: #7c3aed;
    border-top-color: #7c3aed;
    border-right-color: #7c3aed;
    border-bottom-color: #7c3aed;
    color: #7c3aed;
  }

  /* Focus-visible for keyboard navigation */
  .menu-link:not(.disabled):focus-visible {
    outline: none;
    border-top-color: #7c3aed;
    border-right-color: #7c3aed;
    border-bottom-color: #7c3aed;
  }

  .menu-link:not(.disabled):not(.selected):focus-visible {
    border-left-color: #7c3aed;
    color: #7c3aed;
  }

  .menu-link.selected:not(.disabled):focus-visible {
    border-left-color: #7c3aed;
    color: #7c3aed;
  }

  .menu-link:not(.disabled):not(.selected):active {
    color: #6d28d9;
    background-color: #e8e8e8;
  }

  .menu-link.selected:not(.disabled):active {
    background-color: #e8e8e8;
    color: #6d28d9;
    border-left-color: #7c3aed;
  }

  .menu-link .action-text-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .menu-link .text-container {
    flex: 1;
    min-width: 0;
  }

  .menu-link nr-icon {
    display: flex;
    align-items: center;
    --nuraly-color-icon: #161616;
    --nuraly-icon-size: 20px;
    flex-shrink: 0;
  }

  .menu-link nr-icon:first-child {
    padding-right: 0;
    padding-left: 0;
  }

  .menu-link:not(.disabled):not(.selected):hover nr-icon {
    --nuraly-color-icon: #161616;
  }

  .menu-link.selected nr-icon {
    --nuraly-color-icon: #7c3aed;
  }

  /* Sub Menu Styles */
  .sub-menu {
    display: flex;
    flex-direction: column;
    padding-left: 0;
    list-style: none;
    color: #161616;
    margin-bottom: 4px;
  }

  .sub-menu.disabled .sub-menu-header {
    color: #c6c6c6;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .sub-menu.highlighted .sub-menu-header {
    background-color: rgba(124, 58, 237, 0.08);
    color: #7c3aed;
  }

  .sub-menu .sub-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 1px;
    border-left: 4px solid transparent;
    border-top: 2px solid transparent;
    border-right: 2px solid transparent;
    border-bottom: 2px solid transparent;
    border-radius: 6px;
    gap: 8px;
  }

  .sub-menu .sub-menu-header span {
    flex: 1;
    min-width: 0;
    padding-left: 0;
  }

  .sub-menu .text-icon {
    flex-shrink: 0;
    --nuraly-color-icon: #525252;
    --nuraly-icon-size: 20px;
  }

  .sub-menu .icons-container {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    flex-shrink: 0;
    /* Reserve space for dropdown to prevent layout shift */
    min-width: fit-content;
    /* Fixed height to prevent vertical shifting */
    height: 100%;
    min-height: 20px;
  }

  .menu-link .icon-container {
    display: flex;
    align-items: center;
    position: relative;
    flex-shrink: 0;
    /* Fixed height to prevent vertical shifting */
    height: 100%;
    min-height: 20px;
  }

  .sub-menu nr-dropdown,
  .menu-link nr-dropdown {
    /* Keep in normal flow but ensure it doesn't grow/shrink */
    display: inline-flex;
    flex-shrink: 0;
    flex-grow: 0;
    align-items: center;
    vertical-align: middle;
  }

  .sub-menu .action-icon,
  .menu-link .action-icon {
    flex-shrink: 0;
    cursor: pointer;
  }

  .sub-menu .action-icon {
    --nuraly-color-icon: #525252;
    --nuraly-icon-size: 16px;
  }

  .sub-menu .status-icon {
    --nuraly-color-icon: #525252;
    --nuraly-icon-size: 16px;
  }

  .sub-menu .text-icon {
    --nuraly-color-icon: #525252;
    --nuraly-icon-size: 20px;
  }

  .sub-menu #toggle-icon {
    --nuraly-color-icon: #525252;
    --nuraly-icon-size: 16px;
  }

  .sub-menu:not(.disabled):not(.selected) .sub-menu-header:focus {
    outline: none;
    border-color: #7c3aed;
    border-left-color: transparent;
    color: #7c3aed;
  }

  .sub-menu.selected:not(.disabled) .sub-menu-header:focus {
    outline: none;
    border-left-color: #7c3aed;
    border-top-color: #7c3aed;
    border-right-color: #7c3aed;
    border-bottom-color: #7c3aed;
    color: #7c3aed;
  }

  /* Focus-visible for keyboard navigation on submenus */
  .sub-menu:not(.disabled) .sub-menu-header:focus-visible {
    outline: none;
    border-top-color: #7c3aed;
    border-right-color: #7c3aed;
    border-bottom-color: #7c3aed;
  }

  .sub-menu:not(.disabled):not(.selected) .sub-menu-header:focus-visible {
    border-left-color: #7c3aed;
    color: #7c3aed;
  }

  .sub-menu.selected:not(.disabled) .sub-menu-header:focus-visible {
    border-left-color: #7c3aed;
    color: #7c3aed;
  }

  .sub-menu:not(.disabled) .sub-menu-header:hover {
    background-color: #f4f4f4;
    color: #161616;
  }

  .sub-menu.selected:not(.disabled) .sub-menu-header {
    background-color: rgba(124, 58, 237, 0.08);
    color: #7c3aed;
    border-left-color: #7c3aed;
  }

  .sub-menu.selected:not(.disabled) .sub-menu-header:active {
    background-color: #e8e8e8;
    color: #6d28d9;
    border-left-color: #7c3aed;
  }

  .sub-menu:not(.disabled):not(.selected) .sub-menu-header:active {
    background-color: #e8e8e8;
    color: #6d28d9;
  }

  .sub-menu-children {
    padding-left: 1rem;
  }

  /* Arrow positioning for left arrow */
  .sub-menu.arrow-left .sub-menu-header {
    padding-left: 8px; /* Add space for left arrow */
  }

  .sub-menu.arrow-left .sub-menu-header #toggle-icon {
    margin-right: 8px; /* Space between arrow and text */
    order: -1; /* Place arrow at the beginning */
  }

  /* Arrow positioning for right arrow (default) */
  .sub-menu.arrow-right .sub-menu-header #toggle-icon {
    margin-left: 8px; /* Space between text and arrow */
  }

  /* Ensure proper spacing in the header */
  .sub-menu.arrow-left .sub-menu-header span {
    padding-left: 0; /* Remove left padding when arrow is on the left */
  }

  /* Size Variants */
  .menu--small .menu-link {
    padding: 1px;
  }

  .menu--small .sub-menu .sub-menu-header {
    padding: 1px;
  }

  .menu--medium .menu-link {
    padding: 1px;
  }

  .menu--medium .sub-menu .sub-menu-header {
    padding: 1px;
  }

  .menu--large .menu-link {
    padding: 1px;
  }

  .menu--large .sub-menu .sub-menu-header {
    padding: 1px;
  }

  /* Edit input styles */
  .edit-input {
    flex: 1;
    min-width: 0;
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    background-color: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    outline: none;
  }

  .edit-input:focus {
    outline: none;
    box-shadow: none;
  }

  .menu-link.editing,
  .sub-menu.editing > .sub-menu-header {
    background-color: transparent;
  }

`;

export const styles = [menuStyle];
