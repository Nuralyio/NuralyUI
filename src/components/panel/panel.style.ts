/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    /* ========================================
     * CSS CUSTOM PROPERTIES - PANEL
     * ======================================== */
    
    /* Colors */
    --nuraly-panel-background: #ffffff;
    --nuraly-panel-border-color: #e0e0e0;
    --nuraly-panel-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    --nuraly-panel-header-background: #f5f5f5;
    --nuraly-panel-header-text-color: #1a1a1a;
    --nuraly-panel-header-border-color: #e0e0e0;
    --nuraly-panel-header-border-width: 1px;
    --nuraly-panel-header-border-style: solid;
    
    /* Spacing */
    --nuraly-panel-padding: 1rem;
    --nuraly-panel-header-padding: 0.75rem 1rem;
    
    /* Border Radius */
    --nuraly-panel-border-radius: 6px;
    
    /* Typography */
    --nuraly-panel-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --nuraly-panel-header-font-size: 1.125rem;
    --nuraly-panel-header-font-weight: 600;
    
    /* Transitions */
    --nuraly-panel-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Sizes */
    --nuraly-panel-small-width: 320px;
    --nuraly-panel-medium-width: 480px;
    --nuraly-panel-large-width: 640px;
    --nuraly-panel-small-height: 400px;
    --nuraly-panel-medium-height: 600px;
    --nuraly-panel-large-height: 800px;
    
    /* Z-index */
    --nuraly-panel-z-index: 100;
    --nuraly-panel-window-z-index: 200;
    
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* ========================================
   * PANEL CONTAINER
   * ======================================== */

  .panel {
    position: relative;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Smooth transitions - only applied when animated attribute is true */
  .panel--animated {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                right 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                top 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Disable transitions when dragging for immediate feedback */
  .panel--dragging {
    transition: none !important;
  }

  /* ========================================
   * PANEL MODES
   * ======================================== */

  /* Panel Mode - Docked to edges */
  .panel--mode-panel {
    position: fixed;
    z-index: 100;
  }

  .panel--mode-panel.panel--position-left {
    left: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    border-radius: 0 6px 6px 0;
  }

  .panel--mode-panel.panel--position-right {
    right: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    border-radius: 6px 0 0 6px;
  }

  .panel--mode-panel.panel--position-top {
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    border-radius: 0 0 6px 6px;
  }

  .panel--mode-panel.panel--position-bottom {
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    border-radius: 6px 6px 0 0;
  }

  /* Window Mode - Floating, draggable */
  .panel--mode-window {
    position: fixed;
    z-index: 200;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .panel--mode-window.panel--dragging {
    user-select: none;
    transition: none;
  }

  /* Minimized Mode */
  .panel--mode-minimized {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 280px;
    height: 56px;
    z-index: 200;
    cursor: pointer;
    top: auto !important;
    left: auto !important;
    transform: none !important;
  }

  .panel--mode-minimized .panel-body,
  .panel--mode-minimized .panel-footer {
    display: none;
  }

  /* Embedded Mode */
  .panel--mode-embedded {
    position: relative;
    width: 100% !important;  /* Override size-specific widths */
    height: 100% !important; /* Override size-specific heights */
  }

  /* Special handling for tabs in embedded panels */
  .panel--mode-embedded nr-tabs {
    height: 100%;
    min-height: 0;
  }

  /* Override all size classes when in embedded mode */
  .panel--mode-embedded.panel--size-small,
  .panel--mode-embedded.panel--size-medium,
  .panel--mode-embedded.panel--size-large {
    width: 100% !important;
    height: auto !important;
  }

  .panel--mode-embedded .resize-handle {
    display: none;
  }

  /* ========================================
   * PANEL SIZES
   * ======================================== */

  .panel--size-small {
    width: 320px;
    height: 400px;
    
    --nuraly-panel-border-radius: 4px;
  }

  .panel--size-medium {
    width: 480px;
    height: 600px;
    
    --nuraly-panel-action-button-border-radius: 6px;
  }

  .panel--size-large {
    width: 640px;
    height: 800px;
    
    --nuraly-panel-action-button-border-radius: 8px;
  }

  /* ========================================
   * PANEL HEADER
   * ======================================== */

  .panel-header {
    padding: 0.75rem 1rem;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .panel-header--draggable {
    cursor: move;
    user-select: none;
  }

  .panel-header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .panel-header-icon {
    flex-shrink: 0;
    --nuraly-icon-size: 20px;
  }

  .panel-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Size-specific header styles */
  .panel--size-small .panel-title {
    font-size: 0.875rem;
  }

  .panel--size-small .panel-header-icon {
    --nuraly-icon-size: 16px;
  }

  .panel--size-small .panel-action-button {
    padding: 0.125rem;
  }

  .panel--size-small {
    --nuraly-label-font-weight: 400;
  }

  .panel--size-medium .panel-title {
    font-size: 1rem;
  }

  .panel--size-medium .panel-header-icon {
    --nuraly-icon-size: 18px;
  }

  .panel--size-large .panel-title {
    font-size: 1.25rem;
  }

  .panel--size-large .panel-header-icon {
    --nuraly-icon-size: 24px;
  }

  .panel--size-large .panel-action-button {
    padding: 0.375rem;
  }

  .panel-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .panel-action-button {
    background: transparent;
    border: none;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
    color: #525252;
  }

  .panel-action-button:hover {
    background: #f4f4f4;
  }

  .panel-action-button:active {
    background: rgba(0, 0, 0, 0.1);
  }

  .panel-action-button nr-icon {
    --nuraly-icon-size: 16px;
  }

  /* ========================================
   * PANEL BODY
   * ======================================== */

  .panel-body {
    padding: 1rem;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  /* Size-specific body and header padding */
  .panel--size-small .panel-header {
    padding: 0.5rem 0.75rem;
  }

  .panel--size-small .panel-body {
    padding: 0.75rem;
  }

  .panel--size-medium .panel-header {
    padding: 0.625rem 1rem;
  }

  .panel--size-medium .panel-body {
    padding: 1rem;
  }

  .panel--size-large .panel-header {
    padding: 0.875rem 1.25rem;
  }

  .panel--size-large .panel-body {
    padding: 1.5rem;
  }

  /* ========================================
   * PANEL FOOTER
   * ======================================== */

  .panel-footer {
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
    background: #f5f5f5;
    flex-shrink: 0;
  }

  /* ========================================
   * RESIZE HANDLES
   * ======================================== */

  .resize-handle {
    position: absolute;
    background: transparent;
    z-index: 10;
  }

  .resize-handle-n {
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ns-resize;
  }

  .resize-handle-s {
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ns-resize;
  }

  .resize-handle-e {
    right: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: ew-resize;
  }

  .resize-handle-w {
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: ew-resize;
  }

  .resize-handle-ne {
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    cursor: nesw-resize;
  }

  .resize-handle-nw {
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    cursor: nwse-resize;
  }

  .resize-handle-se {
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    cursor: nwse-resize;
  }

  .resize-handle-sw {
    bottom: 0;
    left: 0;
    width: 8px;
    height: 8px;
    cursor: nesw-resize;
  }

  /* Visual indicator for resize corner */
  .resize-handle-se::after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 12px;
    height: 12px;
    background: linear-gradient(
      -45deg,
      transparent 40%,
      #e0e0e0 40%,
      #e0e0e0 50%,
      transparent 50%,
      transparent 60%,
      #e0e0e0 60%,
      #e0e0e0 70%,
      transparent 70%
    );
  }

  /* ========================================
   * COLLAPSED STATE
   * ======================================== */

  .panel--collapsed .panel-body,
  .panel--collapsed .panel-footer {
    display: none;
  }

  .panel--collapsed {
    height: auto !important;
  }

  /* ========================================
   * DARK MODE SUPPORT
   * ======================================== */

  :host([data-theme="dark"]) {
    --nuraly-panel-background: #1a1a1a;
    --nuraly-panel-border-color: #333;
    --nuraly-panel-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    --nuraly-panel-header-background: #252525;
    --nuraly-panel-header-text-color: #e0e0e0;
    --nuraly-panel-header-border-color: #333;
  }

  /* ========================================
   * ANIMATIONS
   * ======================================== */

  /* Transitions are controlled by the .panel--animated class above */
  /* No additional animation rules needed */
`;
