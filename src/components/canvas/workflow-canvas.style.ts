import { css } from 'lit';
import { chatbotPanelStyles } from './chatbot-panel.style.js';

/**
 * Workflow Canvas component styles
 * Using shared CSS variables from /src/shared/themes/
 * Supports default and carbon themes
 */
export const workflowCanvasStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    /* Force CSS custom property inheritance to ensure theme switching works properly */
    color: #161616;
    background-color: #ffffff;
  }

  /* Force re-evaluation of theme-dependent properties on theme change */
  :host([data-theme]) {
    color: inherit;
    background-color: inherit;
  }

  .canvas-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 0;
    background: #f4f4f4;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    /* Prevent browser back/forward navigation on horizontal swipe */
    overscroll-behavior: none;
    touch-action: none;
  }

  /* PAN mode cursor */
  .canvas-wrapper[data-mode="PAN"] {
    cursor: grab;
  }

  .canvas-wrapper[data-mode="PAN"]:active {
    cursor: grabbing;
  }

  /* Grid background */
  .canvas-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(#e0e0e0 1px, transparent 1px),
      linear-gradient(90deg, #e0e0e0 1px, transparent 1px);
    background-size: 1.25rem 1.25rem;
    z-index: 0;
    pointer-events: none;
  }

  /* Viewport container for pan/zoom */
  .canvas-viewport {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    will-change: transform;
    z-index: 1;
  }

  /* SVG layer for edges */
  .edges-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 10000px;
    height: 10000px;
    pointer-events: none;
    overflow: visible;
    z-index: 1;
  }

  /* Edge styles */
  .edge-path {
    fill: none;
    stroke: #a8a8a8;
    stroke-width: 2;
    transition: stroke 0.15s ease;
    pointer-events: stroke;
    cursor: pointer;
  }

  .edge-path:hover {
    stroke: #6a6a6a;
    stroke-width: 3;
  }

  .edge-path.selected {
    stroke: #7c3aed;
    stroke-width: 3;
  }

  .edge-path.animated {
    stroke-dasharray: 8;
    animation: edge-flow 1s linear infinite;
  }

  @keyframes edge-flow {
    from { stroke-dashoffset: 16; }
    to { stroke-dashoffset: 0; }
  }

  .edge-arrow {
    fill: #a8a8a8;
    transition: fill 0.15s ease;
  }

  .edge-path:hover + .edge-arrow,
  .edge-path.selected + .edge-arrow {
    fill: #7c3aed;
  }

  .edge-label {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    fill: #525252;
    pointer-events: none;
  }

  /* Temporary connection line */
  .connection-line {
    fill: none;
    stroke: #7c3aed;
    stroke-width: 2;
    stroke-dasharray: 5;
    pointer-events: none;
  }

  /* Nodes layer */
  .nodes-layer {
    position: relative;
    z-index: 2;
  }

  /* Selection box */
  .selection-box {
    position: absolute;
    border: 1px dashed #7c3aed;
    background: rgba(59, 130, 246, 0.1);
    pointer-events: none;
  }

  /* Minimap */
  .minimap {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 200px;
    height: 150px;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
  }

  .minimap-viewport {
    position: absolute;
    border: 2px solid #7c3aed;
    background: rgba(59, 130, 246, 0.1);
    cursor: move;
  }

  .minimap-node {
    position: absolute;
    background: #a8a8a8;
    border-radius: 2px;
  }

  /* Toolbar */
  .canvas-toolbar {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    z-index: 100;
  }

  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #525252;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .toolbar-btn:hover {
    background: rgba(0, 0, 0, 0.08);
    color: #161616;
  }

  .toolbar-btn:hover nr-icon {
    --nr-text: #161616;
  }

  .toolbar-btn.active {
    background: #7c3aed;
    color: #ffffff;
  }

  .toolbar-btn.active nr-icon,
  .toolbar-btn.active:hover nr-icon {
    color: #fff;
    --nr-text: #fff;
  }

  .toolbar-btn:focus {
    outline: none;
  }

  .toolbar-btn:focus-visible {
    outline: 2px solid #7c3aed;
    outline-offset: 1px;
  }

  .toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toolbar-btn nr-icon {
    color: inherit;
  }

  .toolbar-divider {
    width: 1px;
    background: #e0e0e0;
    margin: 0 0.25rem;
  }

  /* Zoom controls */
  .zoom-controls {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
  }

  .zoom-value {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    color: #525252;
    min-width: 48px;
    text-align: center;
  }

  /* Node palette */
  .node-palette {
    position: absolute;
    top: 64px;
    left: 1rem;
    width: 220px;
    max-height: calc(100% - 180px);
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
    z-index: 90;
    display: flex;
    flex-direction: column;
  }

  .palette-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .palette-title {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #161616;
    text-transform: uppercase;
  }

  .palette-close {
    background: none;
    border: none;
    color: #525252;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.15s ease;
  }

  .palette-close:hover {
    color: #161616;
    background: rgba(0, 0, 0, 0.05);
  }

  .palette-search {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .palette-search nr-input {
    width: 100%;
  }

  .palette-search nr-icon {
    color: #a8a8a8;
  }

  .palette-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.5rem;
    color: #a8a8a8;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
  }

  .palette-empty nr-icon {
    color: inherit;
    opacity: 0.7;
  }

  .palette-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    min-height: 0;
  }

  .palette-category {
    border-bottom: 1px solid #e0e0e0;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 10px 0.75rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: #525252;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .category-header:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .category-header nr-icon {
    color: inherit;
  }

  .category-items {
    padding: 0.5rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .palette-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: grab;
    transition: all 0.15s ease;
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
  }

  .palette-item:hover {
    background: rgba(0, 0, 0, 0.04);
    border-color: #a8a8a8;
  }

  .palette-item:active {
    cursor: grabbing;
  }

  .palette-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    color: #ffffff;
  }

  .palette-item-icon nr-icon {
    color: inherit;
  }

  .palette-item-name {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  /* Context menu */
  .context-menu {
    position: fixed;
    min-width: 160px;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 0.25rem 0;
    z-index: 1000;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  .context-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    color: #161616;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .context-menu-item:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .context-menu-item.danger {
    color: #ef4444;
  }

  .context-menu-item nr-icon {
    color: inherit;
  }

  .context-menu-shortcut {
    margin-left: auto;
    font-size: 11px;
    color: #525252;
    opacity: 0.7;
  }

  .context-menu-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 0.25rem 0;
  }

  /* Configuration panel */
  .config-panel {
    position: absolute;
    width: 320px;
    max-height: 500px;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
    z-index: 200;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  .insert-panel {
    position: absolute;
    z-index: 200;
    pointer-events: auto;
  }

  .config-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 1px solid #e0e0e0;
    background: #e8e8e8;
  }

  .config-panel-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #161616;
  }

  .config-panel-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: #ffffff;
    margin-right: 0.5rem;
  }

  .config-panel-icon nr-icon {
    color: inherit;
  }

  .config-panel-close {
    background: none;
    border: none;
    color: #525252;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.15s ease;
  }

  .config-panel-close:hover {
    color: #161616;
    background: rgba(0, 0, 0, 0.05);
  }

  .config-panel-content {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overscroll-behavior: contain;
  }

  .config-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .config-field label {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: #525252;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .config-field nr-input {
    width: 100%;
  }

  .config-section {
    padding-top: 0.5rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .config-section:first-child {
    padding-top: 0;
    border-top: none;
  }

  .config-section-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .config-section-title {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: #a8a8a8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .config-section-desc {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
  }

  .config-section-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 0.5rem 0;
  }

  /* Note color presets */
  .note-color-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .note-color-preset {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 2px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s ease, border-color 0.15s ease;
  }

  .note-color-preset:hover {
    transform: scale(1.1);
  }

  .note-color-preset.active {
    border-color: #7c3aed;
  }

  .note-color-preset nr-icon {
    width: 14px;
    height: 14px;
  }

  .field-hint {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #666;
    margin-top: 0.25rem;
  }

  /* File upload styles */
  .file-upload-container {
    position: relative;
  }

  .file-upload-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    overflow: hidden;
  }

  .file-upload-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    background: #f4f4f4;
    color: #525252;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .file-upload-label:hover {
    border-color: #7c3aed;
    background: rgba(59, 130, 246, 0.1);
    color: #7c3aed;
  }

  .test-file-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

  .test-file-details {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow: hidden;
  }

  .test-file-details nr-icon {
    color: #525252;
    flex-shrink: 0;
  }

  .test-file-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;
  }

  .test-file-name {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #161616;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .test-file-size {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
  }

  .test-file-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: #525252;
    cursor: pointer;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .test-file-remove:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .test-workflow-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: #7c3aed;
    border: none;
    border-radius: 6px;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .test-workflow-btn:hover {
    background: #6d28d9;
  }

  .test-workflow-btn:active {
    background: #1d4ed8;
  }

  .test-workflow-btn nr-icon {
    flex-shrink: 0;
  }

  /* Variables section styles */
  .variables-section {
    margin-top: 0.75rem;
  }

  .variables-section .config-section-title {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .variables-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
  }

  .variables-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .variables-group-header {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: #7c3aed;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .variable-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .variable-item:hover {
    background: #e8e8e8;
  }

  .variable-path {
    font-family: 'SF Mono', monospace;
    font-size: 0.75rem;
    color: #161616;
    word-break: break-all;
  }

  .variable-type {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
    padding: 2px 6px;
    background: #f4f4f4;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .variable-item.dynamic {
    border-left: 2px solid #7c3aed;
  }

  .variable-dynamic-badge {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #7c3aed;
    padding: 1px 4px;
    background: rgba(15, 98, 254, 0.15);
    border-radius: 3px;
    flex-shrink: 0;
  }

  .variables-loading {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    color: #525252;
    font-style: italic;
    padding: 0.5rem;
    text-align: center;
  }

  /* Execution data section styles */
  .execution-section {
    border-top: 1px solid #e0e0e0;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
  }

  .execution-status {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .execution-error {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    color: #ef4444;
    margin-bottom: 0.5rem;
  }

  .execution-error nr-icon {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .execution-data-block {
    margin-bottom: 0.5rem;
  }

  .execution-data-label {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: #525252;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.25rem;
  }

  .execution-data-content {
    font-family: 'SF Mono', monospace;
    font-size: 0.75rem;
    color: #161616;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 0.5rem;
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 150px;
    overflow-y: auto;
  }

  .execution-duration {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
    margin-top: 0.5rem;
  }

  .retry-node-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #ffffff;
    background: #7c3aed;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .retry-node-btn:hover {
    background: #6d28d9;
  }

  /* Trigger status panel styles */
  .trigger-status-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }

  .trigger-status-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .trigger-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .trigger-status--connected {
    background: #10b981;
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
    animation: trigger-pulse 2s ease-in-out infinite;
  }

  .trigger-status--connecting {
    background: #3b82f6;
    animation: trigger-blink 1s ease-in-out infinite;
  }

  .trigger-status--error {
    background: #ef4444;
  }

  .trigger-status--paused {
    background: #f59e0b;
  }

  .trigger-status--disconnected {
    background: #6b7280;
  }

  @keyframes trigger-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes trigger-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .trigger-status-label {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #161616;
  }

  .trigger-health-badge {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .trigger-health--healthy {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
  }

  .trigger-health--degraded {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
  }

  .trigger-health--unhealthy {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  .trigger-health--unknown {
    background: rgba(107, 114, 128, 0.15);
    color: #6b7280;
  }

  .trigger-status-reason {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
    padding-left: 16px;
  }

  .trigger-stats-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-left: 16px;
  }

  .trigger-stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
  }

  .trigger-stat--secondary {
    color: #525252;
  }

  .trigger-dev-mode-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 2px 8px;
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-left: 16px;
    width: fit-content;
  }

  .trigger-webhook-url {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    margin-left: 16px;
  }

  .trigger-webhook-url code {
    flex: 1;
    font-family: monospace;
    font-size: 0.75rem;
    color: #525252;
    word-break: break-all;
    user-select: all;
  }

  .trigger-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.5rem;
  }

  .trigger-action-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease, opacity 0.15s ease;
  }

  .trigger-action-btn--primary {
    background: #7c3aed;
    color: #fff;
  }

  .trigger-action-btn--primary:hover {
    background: #6d28d9;
  }

  .trigger-action-btn--danger {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
  }

  .trigger-action-btn--danger:hover {
    background: rgba(239, 68, 68, 0.25);
  }

  .trigger-dev-toggle {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    margin-left: auto;
  }

  .trigger-dev-toggle input[type="checkbox"] {
    cursor: pointer;
  }

  .trigger-dev-toggle-label {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
    user-select: none;
  }

  .config-info-box {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    color: #525252;
    line-height: 1.4;
  }

  .config-info-box nr-icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: #525252;
  }

  .config-info-box strong {
    color: #161616;
  }

  .field-description {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    color: #525252;
    margin-top: 0.25rem;
  }

  /* Webhook URL styles */
  .webhook-url-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
  }

  .webhook-url {
    flex: 1;
    font-family: monospace;
    font-size: 0.75rem;
    color: #161616;
    word-break: break-all;
    user-select: all;
  }

  .copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #525252;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .copy-btn:hover {
    background: #e8e8e8;
    color: #161616;
  }

  /* Variable node styles */
  .config-columns-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .config-column-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .variable-fields {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex: 1;
    align-items: center;
  }

  /* Condition builder */
  .condition-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .condition-row-fields {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    flex: 1;
    align-items: center;
  }

  .condition-left-value,
  .condition-right-value {
    flex: 1;
    min-width: 60px;
  }

  .condition-operator {
    flex: 0 0 140px;
  }

  .condition-logic-toggle {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .condition-logic-toggle label {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: #525252;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .condition-logic-label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0;
  }

  .condition-logic-label span {
    font-family: 'SF Mono', monospace;
    font-size: 0.75rem;
    font-weight: 600;
    color: #7c3aed;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .variable-type-select {
    flex: 0 0 70px;
    padding: 0.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    background: #262626;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #f4f4f4;
    cursor: pointer;
  }

  .variable-type-select:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .variable-name-input {
    flex: 1;
    min-width: 60px;
  }

  .variable-value-input {
    flex: 2;
    min-width: 80px;
  }

  .remove-column-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #525252;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .remove-column-btn:hover {
    background: rgba(218, 30, 40, 0.1);
    color: #da1e28;
  }

  .add-column-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    border: 1px dashed #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    color: #525252;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .add-column-btn:hover {
    background: #353535;
    border-color: #6f6f6f;
    color: #f4f4f4;
  }

  /* HTTP Method checkboxes */
  .method-checkboxes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .method-checkbox {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .method-checkbox:hover {
    background: #e8e8e8;
  }

  .method-checkbox:has(input:checked) {
    background: #7c3aed;
    border-color: #7c3aed;
  }

  .method-checkbox:has(input:checked) .method-label {
    color: white;
  }

  .method-checkbox input {
    display: none;
  }

  .method-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
  }

  .method-toggle:hover {
    background: #e8e8e8;
  }

  .method-toggle.active {
    background: #7c3aed;
    border-color: #7c3aed;
  }

  .method-toggle.active .method-label {
    color: white;
  }

  .method-label {
    font-family: monospace;
    font-size: 0.75rem;
    font-weight: 500;
    color: #161616;
  }

  /* File upload checkbox group */
  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #161616;
    cursor: pointer;
  }

  .checkbox-item:hover {
    color: #7c3aed;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #161616;
    cursor: pointer;
  }

  /* Debug node styles */
  .debug-placeholder {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    color: #525252;
    font-size: 0.875rem;
  }

  .debug-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .debug-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #525252;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .debug-output {
    margin: 0;
    padding: 0.5rem;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.75rem;
    color: #161616;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 150px;
    overflow-y: auto;
  }

  /* Code editor (Function node) */
  .code-editor {
    width: 100%;
    min-height: 150px;
    padding: 0.75rem;
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    background: #262626;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #f4f4f4;
    resize: vertical;
    tab-size: 2;
  }

  .code-editor:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .code-editor::placeholder {
    color: #a8a8a8;
  }

  /* Tool parameter styles */
  .tool-param-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    background: #f4f4f4;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }

  .tool-param-fields {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    flex: 1;
  }

  .tool-param-name {
    flex: 1;
    min-width: 80px;
  }

  .tool-param-type {
    flex: 0 0 80px;
    padding: 0.5rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    background: #262626;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #f4f4f4;
    cursor: pointer;
  }

  .tool-param-type:focus {
    outline: none;
    border-color: #7c3aed;
  }

  .tool-param-required {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: #525252;
    cursor: pointer;
    white-space: nowrap;
  }

  .tool-param-required input {
    accent-color: #7c3aed;
  }

  .tool-param-desc {
    flex: 1;
  }

  /* Empty state */
  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #a8a8a8;
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-state-icon nr-icon {
    color: inherit;
  }

  .empty-state-text {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    margin-bottom: 0.5rem;
  }

  .empty-state-hint {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    opacity: 0.7;
  }

  /* ========================================
   * CARBON THEME - Sharp corners
   * ======================================== */

  .canvas-wrapper[data-theme="carbon-light"],
  .canvas-wrapper[data-theme="carbon-dark"],
  .canvas-wrapper[data-theme="carbon"] {
    .canvas-toolbar,
    .zoom-controls,
    .node-palette,
    .context-menu,
    .config-panel {
      border-radius: 0;
    }

    .palette-item,
    .palette-close,
    .toolbar-btn,
    .config-panel-close,
    .config-panel-icon {
      border-radius: 0;
    }
  }

  /* ========================================
   * LIGHT THEME STYLING
   * ======================================== */

  /* Light Theme - target canvas-wrapper with data-theme */
  .canvas-wrapper[data-theme="light"],
  .canvas-wrapper[data-theme="carbon-light"],
  .canvas-wrapper[data-theme="default-light"],
  .canvas-wrapper[data-theme="default"],
  .canvas-wrapper[data-theme="social-light"] {
    background: #f4f4f4;
  }

  .canvas-wrapper[data-theme="light"] .canvas-grid,
  .canvas-wrapper[data-theme="carbon-light"] .canvas-grid,
  .canvas-wrapper[data-theme="default-light"] .canvas-grid,
  .canvas-wrapper[data-theme="default"] .canvas-grid,
  .canvas-wrapper[data-theme="social-light"] .canvas-grid {
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.08) 1px, transparent 1px);
  }

  .canvas-wrapper[data-theme="light"] .edge-path,
  .canvas-wrapper[data-theme="carbon-light"] .edge-path,
  .canvas-wrapper[data-theme="default-light"] .edge-path,
  .canvas-wrapper[data-theme="default"] .edge-path,
  .canvas-wrapper[data-theme="social-light"] .edge-path {
    stroke: #8d8d8d;
  }

  .canvas-wrapper[data-theme="light"] .edge-path:hover,
  .canvas-wrapper[data-theme="carbon-light"] .edge-path:hover,
  .canvas-wrapper[data-theme="default-light"] .edge-path:hover,
  .canvas-wrapper[data-theme="default"] .edge-path:hover,
  .canvas-wrapper[data-theme="social-light"] .edge-path:hover {
    stroke: #6f6f6f;
  }

  .canvas-wrapper[data-theme="light"] .edge-arrow,
  .canvas-wrapper[data-theme="carbon-light"] .edge-arrow,
  .canvas-wrapper[data-theme="default-light"] .edge-arrow,
  .canvas-wrapper[data-theme="default"] .edge-arrow,
  .canvas-wrapper[data-theme="social-light"] .edge-arrow {
    fill: #8d8d8d;
  }

  .canvas-wrapper[data-theme="light"] .edge-path,
  .canvas-wrapper[data-theme="carbon-light"] .edge-path,
  .canvas-wrapper[data-theme="default-light"] .edge-path,
  .canvas-wrapper[data-theme="default"] .edge-path {
    stroke: #8d8d8d;
  }

  .canvas-wrapper[data-theme="light"] .edge-path:hover,
  .canvas-wrapper[data-theme="carbon-light"] .edge-path:hover,
  .canvas-wrapper[data-theme="default-light"] .edge-path:hover,
  .canvas-wrapper[data-theme="default"] .edge-path:hover {
    stroke: #6f6f6f;
  }

  .canvas-wrapper[data-theme="light"] .edge-arrow,
  .canvas-wrapper[data-theme="carbon-light"] .edge-arrow,
  .canvas-wrapper[data-theme="default-light"] .edge-arrow,
  .canvas-wrapper[data-theme="default"] .edge-arrow {
    fill: #8d8d8d;
  }

  .canvas-wrapper[data-theme="light"] .canvas-toolbar,
  .canvas-wrapper[data-theme="light"] .zoom-controls,
  .canvas-wrapper[data-theme="light"] .node-palette,
  .canvas-wrapper[data-theme="light"] .context-menu,
  .canvas-wrapper[data-theme="light"] .config-panel,
  .canvas-wrapper[data-theme="carbon-light"] .canvas-toolbar,
  .canvas-wrapper[data-theme="carbon-light"] .zoom-controls,
  .canvas-wrapper[data-theme="carbon-light"] .node-palette,
  .canvas-wrapper[data-theme="carbon-light"] .context-menu,
  .canvas-wrapper[data-theme="carbon-light"] .config-panel,
  .canvas-wrapper[data-theme="default-light"] .canvas-toolbar,
  .canvas-wrapper[data-theme="default-light"] .zoom-controls,
  .canvas-wrapper[data-theme="default-light"] .node-palette,
  .canvas-wrapper[data-theme="default-light"] .context-menu,
  .canvas-wrapper[data-theme="default-light"] .config-panel,
  .canvas-wrapper[data-theme="default"] .canvas-toolbar,
  .canvas-wrapper[data-theme="default"] .zoom-controls,
  .canvas-wrapper[data-theme="default"] .node-palette,
  .canvas-wrapper[data-theme="default"] .context-menu,
  .canvas-wrapper[data-theme="default"] .config-panel {
    background: #f4f4f4;
    border-color: #e0e0e0;
  }

  .canvas-wrapper[data-theme="light"] .toolbar-btn:hover,
  .canvas-wrapper[data-theme="carbon-light"] .toolbar-btn:hover,
  .canvas-wrapper[data-theme="default-light"] .toolbar-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #161616;
  }

  .canvas-wrapper[data-theme="light"] .palette-item,
  .canvas-wrapper[data-theme="carbon-light"] .palette-item,
  .canvas-wrapper[data-theme="default-light"] .palette-item {
    background: #e8e8e8;
    border-color: #e0e0e0;
  }

  .canvas-wrapper[data-theme="light"] .palette-item:hover,
  .canvas-wrapper[data-theme="carbon-light"] .palette-item:hover,
  .canvas-wrapper[data-theme="default-light"] .palette-item:hover {
    background: #d0d0d0;
  }

  .canvas-wrapper[data-theme="light"] .palette-title,
  .canvas-wrapper[data-theme="light"] .category-header,
  .canvas-wrapper[data-theme="light"] .context-menu-item,
  .canvas-wrapper[data-theme="carbon-light"] .palette-title,
  .canvas-wrapper[data-theme="carbon-light"] .category-header,
  .canvas-wrapper[data-theme="carbon-light"] .context-menu-item,
  .canvas-wrapper[data-theme="default-light"] .palette-title,
  .canvas-wrapper[data-theme="default-light"] .category-header,
  .canvas-wrapper[data-theme="default-light"] .context-menu-item {
    color: #161616;
  }

  .canvas-wrapper[data-theme="light"] .toolbar-btn,
  .canvas-wrapper[data-theme="light"] .zoom-value,
  .canvas-wrapper[data-theme="light"] .palette-item-name,
  .canvas-wrapper[data-theme="carbon-light"] .toolbar-btn,
  .canvas-wrapper[data-theme="carbon-light"] .zoom-value,
  .canvas-wrapper[data-theme="carbon-light"] .palette-item-name,
  .canvas-wrapper[data-theme="default-light"] .toolbar-btn,
  .canvas-wrapper[data-theme="default-light"] .zoom-value,
  .canvas-wrapper[data-theme="default-light"] .palette-item-name {
    color: #525252;
  }

  .canvas-wrapper[data-theme="light"] .empty-state,
  .canvas-wrapper[data-theme="light"] .empty-state-text,
  .canvas-wrapper[data-theme="light"] .empty-state-hint,
  .canvas-wrapper[data-theme="carbon-light"] .empty-state,
  .canvas-wrapper[data-theme="carbon-light"] .empty-state-text,
  .canvas-wrapper[data-theme="carbon-light"] .empty-state-hint,
  .canvas-wrapper[data-theme="default-light"] .empty-state,
  .canvas-wrapper[data-theme="default-light"] .empty-state-text,
  .canvas-wrapper[data-theme="default-light"] .empty-state-hint {
    color: #a8a8a8;
  }

  /* ========================================
   * DARK THEME STYLING (Default)
   * ======================================== */

  /* Dark Theme - target canvas-wrapper with data-theme */
  .canvas-wrapper[data-theme="dark"],
  .canvas-wrapper[data-theme="carbon-dark"],
  .canvas-wrapper[data-theme="default-dark"],
  .canvas-wrapper[data-theme="social-dark"] {
    background: #161616;
  }

  .canvas-wrapper[data-theme="dark"] .canvas-grid,
  .canvas-wrapper[data-theme="carbon-dark"] .canvas-grid,
  .canvas-wrapper[data-theme="default-dark"] .canvas-grid,
  .canvas-wrapper[data-theme="social-dark"] .canvas-grid {
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  }

  .canvas-wrapper[data-theme="dark"] .canvas-toolbar,
  .canvas-wrapper[data-theme="dark"] .zoom-controls,
  .canvas-wrapper[data-theme="dark"] .node-palette,
  .canvas-wrapper[data-theme="dark"] .context-menu,
  .canvas-wrapper[data-theme="dark"] .config-panel,
  .canvas-wrapper[data-theme="carbon-dark"] .canvas-toolbar,
  .canvas-wrapper[data-theme="carbon-dark"] .zoom-controls,
  .canvas-wrapper[data-theme="carbon-dark"] .node-palette,
  .canvas-wrapper[data-theme="carbon-dark"] .context-menu,
  .canvas-wrapper[data-theme="carbon-dark"] .config-panel,
  .canvas-wrapper[data-theme="default-dark"] .canvas-toolbar,
  .canvas-wrapper[data-theme="default-dark"] .zoom-controls,
  .canvas-wrapper[data-theme="default-dark"] .node-palette,
  .canvas-wrapper[data-theme="default-dark"] .context-menu,
  .canvas-wrapper[data-theme="default-dark"] .config-panel {
    background: #f4f4f4;
    border-color: #e0e0e0;
  }

  .canvas-wrapper[data-theme="dark"] .toolbar-btn,
  .canvas-wrapper[data-theme="carbon-dark"] .toolbar-btn,
  .canvas-wrapper[data-theme="default-dark"] .toolbar-btn {
    color: #525252;
  }

  .canvas-wrapper[data-theme="dark"] .toolbar-btn:hover,
  .canvas-wrapper[data-theme="carbon-dark"] .toolbar-btn:hover,
  .canvas-wrapper[data-theme="default-dark"] .toolbar-btn:hover {
    background: #353535;
    color: #f4f4f4;
  }

  .canvas-wrapper[data-theme="dark"] .palette-item,
  .canvas-wrapper[data-theme="carbon-dark"] .palette-item,
  .canvas-wrapper[data-theme="default-dark"] .palette-item {
    background: #e8e8e8;
    border-color: #e0e0e0;
  }

  .canvas-wrapper[data-theme="dark"] .palette-item:hover,
  .canvas-wrapper[data-theme="carbon-dark"] .palette-item:hover,
  .canvas-wrapper[data-theme="default-dark"] .palette-item:hover {
    background: #4c4c4c;
  }

  /* ========================================
   * CHATBOT PREVIEW PANEL
   * ======================================== */

  .chatbot-preview-panel {
    position: absolute;
    width: 340px;
    height: 420px;
    background: #fff;
    border: 1px solid #e0e0e8;
    border-radius: 14px;
    overflow: hidden;
    z-index: 200;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0,0,0,0.14);
  }

  .chatbot-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-bottom: 1px solid #e0e0e8;
    background: #fff;
    flex-shrink: 0;
    gap: 8px;
  }

  .chatbot-preview-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #0f0f3c;
  }

  .chatbot-preview-title nr-icon {
    color: #7c3aed;
  }

  .chatbot-preview-close {
    width: 22px;
    height: 22px;
    padding: 0;
    box-sizing: border-box;
    border-radius: 50%;
    border: none;
    background: #f5f5f8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8c8ca8;
    flex-shrink: 0;
    transition: background 150ms;
    line-height: 0;
  }

  .chatbot-preview-close:hover {
    background: #e0e0e8;
    color: #0f0f3c;
  }

  .chatbot-preview-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .chatbot-preview-content nr-chatbot {
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
    --chatbot-border-radius: 0;
    --chatbot-height: 100%;
    --chatbot-min-height: 100%;
    --nuraly-size-chatbot-min-width: 0;
    --nuraly-size-chatbot-container-min-width: 0;
    --chatbot-radius: 12px;
  }

  .chatbot-preview-content nr-chatbot::part(input-box) {
    border-radius: 20px;
    border: 1px solid #e0e0e8;
    background: #f5f5f8;
    margin: 8px;
  }

  .chatbot-preview-content nr-chatbot::part(input) {
    border-radius: 20px;
    background: transparent;
  }

  /* Chat preview status indicator */
  .chat-preview-status {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: auto;
  }

  .chat-preview-status.connected {
    color: #42be65;
    background: rgba(66, 190, 101, 0.15);
  }

  .chat-preview-status.disconnected {
    color: #525252;
    background: rgba(136, 136, 136, 0.15);
  }

  /* Chat preview loading state */
  .chat-preview-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 0.75rem;
    color: #525252;
    font-size: 0.875rem;
  }

  .chat-preview-loading nr-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Dark theme for chatbot preview */
  .canvas-wrapper[data-theme="dark"] .chatbot-preview-panel,
  .canvas-wrapper[data-theme="carbon-dark"] .chatbot-preview-panel,
  .canvas-wrapper[data-theme="default-dark"] .chatbot-preview-panel {
    background: #1a1a2e;
    border-color: #2d2d4a;
    box-shadow: 0 8px 32px rgba(0,0,0,0.30);
  }

  .canvas-wrapper[data-theme="dark"] .chatbot-preview-header,
  .canvas-wrapper[data-theme="carbon-dark"] .chatbot-preview-header,
  .canvas-wrapper[data-theme="default-dark"] .chatbot-preview-header {
    background: #1a1a2e;
    border-color: #2d2d4a;
  }

  .canvas-wrapper[data-theme="dark"] .chatbot-preview-title,
  .canvas-wrapper[data-theme="carbon-dark"] .chatbot-preview-title,
  .canvas-wrapper[data-theme="default-dark"] .chatbot-preview-title {
    color: #f0f0ff;
  }

  .canvas-wrapper[data-theme="dark"] .chatbot-preview-close,
  .canvas-wrapper[data-theme="carbon-dark"] .chatbot-preview-close,
  .canvas-wrapper[data-theme="default-dark"] .chatbot-preview-close {
    background: #2d2d4a;
    color: #8c8ca8;
  }

  .canvas-wrapper[data-theme="dark"] .chatbot-preview-close:hover,
  .canvas-wrapper[data-theme="carbon-dark"] .chatbot-preview-close:hover,
  .canvas-wrapper[data-theme="default-dark"] .chatbot-preview-close:hover {
    background: #3d3d5a;
    color: #f0f0ff;
  }

  /* ========================================
   * HTTP PREVIEW PANEL
   * ======================================== */

  .http-preview-panel {
    height: auto;
    max-height: 480px;
  }

  .http-preview-content {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
  }

  .http-preview-url {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #e8e8e8;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.875rem;
  }

  .http-method {
    color: #42be65;
    font-weight: 600;
  }

  .http-path {
    color: #525252;
  }

  .http-preview-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .http-preview-section label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #525252;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .http-request-body {
    min-height: 120px;
    padding: 0.75rem;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #161616;
    font-family: monospace;
    font-size: 0.875rem;
    resize: vertical;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .http-request-body:focus {
    border-color: #7c3aed;
  }

  .http-request-body:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .http-preview-actions {
    display: flex;
    justify-content: flex-end;
  }

  .http-send-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .http-send-btn:hover:not(:disabled) {
    background: #6d28d9;
  }

  .http-send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .http-send-btn nr-icon {
    animation: none;
  }

  .http-send-btn:disabled nr-icon {
    animation: spin 1s linear infinite;
  }

  .http-preview-error {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 4px;
    color: #fa4d56;
    font-size: 0.875rem;
  }

  .http-preview-error nr-icon {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .http-response-body {
    margin: 0;
    padding: 0.75rem;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    color: #161616;
    font-family: monospace;
    font-size: 0.875rem;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
  }

  /* Light theme for HTTP preview */
  .canvas-wrapper[data-theme="light"] .http-request-body,
  .canvas-wrapper[data-theme="carbon-light"] .http-request-body,
  .canvas-wrapper[data-theme="default-light"] .http-request-body,
  .canvas-wrapper[data-theme="default"] .http-request-body {
    background: #e8e8e8;
    border-color: #e0e0e0;
    color: #161616;
  }

  .canvas-wrapper[data-theme="light"] .http-response-body,
  .canvas-wrapper[data-theme="carbon-light"] .http-response-body,
  .canvas-wrapper[data-theme="default-light"] .http-response-body,
  .canvas-wrapper[data-theme="default"] .http-response-body {
    background: #e8e8e8;
    border-color: #e0e0e0;
    color: #161616;
  }

  .canvas-wrapper[data-theme="light"] .http-preview-url,
  .canvas-wrapper[data-theme="carbon-light"] .http-preview-url,
  .canvas-wrapper[data-theme="default-light"] .http-preview-url,
  .canvas-wrapper[data-theme="default"] .http-preview-url {
    background: #e8e8e8;
  }

  /* Disabled overlay styles */
  .disabled-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    transition: background 0.15s ease;
  }

  .disabled-overlay.hovering {
    background: rgba(0, 0, 0, 0.4);
  }

  .disabled-overlay-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    color: #161616;
    font-size: 0.875rem;
    font-weight: 500;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.15s ease,
                transform 0.15s ease;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .disabled-overlay.hovering .disabled-overlay-message {
    opacity: 1;
    transform: translateY(0);
  }

  .disabled-overlay-message nr-icon {
    color: #7c3aed;
  }

  /* Light theme for disabled overlay */
  .canvas-wrapper[data-theme="light"] .disabled-overlay.hovering,
  .canvas-wrapper[data-theme="carbon-light"] .disabled-overlay.hovering,
  .canvas-wrapper[data-theme="default-light"] .disabled-overlay.hovering,
  .canvas-wrapper[data-theme="default"] .disabled-overlay.hovering {
    background: rgba(255, 255, 255, 0.5);
  }

  .canvas-wrapper[data-theme="light"] .disabled-overlay-message,
  .canvas-wrapper[data-theme="carbon-light"] .disabled-overlay-message,
  .canvas-wrapper[data-theme="default-light"] .disabled-overlay-message,
  .canvas-wrapper[data-theme="default"] .disabled-overlay-message {
    background: #e8e8e8;
    border-color: #e0e0e0;
    color: #161616;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* ===== FRAME NODE STYLES ===== */

  /* Frames layer - renders behind regular nodes */
  .frames-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .frames-layer > * {
    pointer-events: auto;
  }

  /* Expanded Frame Node */
  .frame-node {
    position: absolute;
    border-radius: 8px;
    cursor: move;
    transition: box-shadow 0.15s ease;
  }

  .frame-node:hover {
    box-shadow: 0 0 0 1px #7c3aed;
  }

  .frame-node.selected {
    box-shadow: 0 0 0 2px #7c3aed;
  }

  /* Frame Label */
  .frame-label {
    position: absolute;
    font-size: 12px;
    font-weight: 600;
    color: #525252;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 40px);
    user-select: none;
  }

  .frame-label.outside {
    top: -22px;
    left: 0;
  }

  .frame-label.inside {
    top: 8px;
    left: 12px;
    background: inherit;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .frame-label.top-left { left: 0; }
  .frame-label.top-center { left: 50%; transform: translateX(-50%); }
  .frame-label.top-right { left: auto; right: 0; }

  /* Frame Label Text (with edit icon) */
  .frame-label-text {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }

  .frame-label-edit-icon {
    opacity: 0;
    width: 14px;
    height: 14px;
    padding: 2px;
    color: #525252;
    cursor: pointer;
    border-radius: 3px;
    transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease;
  }

  .frame-label-text:hover .frame-label-edit-icon,
  .collapsed-frame-header:hover .frame-label-edit-icon {
    opacity: 0.7;
  }

  .frame-label-edit-icon:hover {
    opacity: 1 !important;
    background: rgba(0, 0, 0, 0.05);
    color: #7c3aed;
  }

  /* Frame Label Input */
  .frame-label-input {
    font-size: 12px;
    font-weight: 600;
    color: #161616;
    background: #e8e8e8;
    border: 1px solid #7c3aed;
    border-radius: 4px;
    padding: 2px 6px;
    outline: none;
    min-width: 80px;
    max-width: 200px;
  }

  .frame-label-input:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }

  /* Frame Collapse Button */
  .frame-collapse-btn {
    position: absolute;
    top: -22px;
    right: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, background 0.15s ease;
  }

  .frame-node:hover .frame-collapse-btn {
    opacity: 1;
  }

  .frame-collapse-btn:hover {
    background: #e0e0e0;
  }

  .frame-collapse-btn nr-icon {
    width: 12px;
    height: 12px;
    color: #525252;
  }

  /* Frame Resize Handles */
  .frame-resize-handles {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .resize-handle {
    position: absolute;
    pointer-events: auto;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .frame-node:hover .resize-handle,
  .frame-node.selected .resize-handle {
    opacity: 1;
  }

  /* Corner handles */
  .resize-handle.corner {
    width: 12px;
    height: 12px;
    background: #7c3aed;
    border: 2px solid #f4f4f4;
    border-radius: 2px;
  }

  .resize-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
  .resize-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
  .resize-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
  .resize-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }

  /* Edge handles */
  .resize-handle.edge {
    background: transparent;
  }

  .resize-handle.n { top: -4px; left: 12px; right: 12px; height: 8px; cursor: n-resize; }
  .resize-handle.s { bottom: -4px; left: 12px; right: 12px; height: 8px; cursor: s-resize; }
  .resize-handle.w { left: -4px; top: 12px; bottom: 12px; width: 8px; cursor: w-resize; }
  .resize-handle.e { right: -4px; top: 12px; bottom: 12px; width: 8px; cursor: e-resize; }

  /* Collapsed Frame Node (Group Node) */
  .collapsed-frame-node {
    position: absolute;
    min-width: 180px;
    background: #e8e8e8;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: move;
    transition: box-shadow 0.15s ease, transform 0.1s ease;
  }

  .collapsed-frame-node:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .collapsed-frame-node.selected {
    box-shadow: 0 0 0 2px #7c3aed,
                0 4px 12px rgba(0, 0, 0, 0.2);
  }

  /* Collapsed Frame Ports */
  .collapsed-frame-node .ports {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    pointer-events: none;
  }

  .collapsed-frame-node .ports-left {
    left: 0;
  }

  .collapsed-frame-node .ports-right {
    right: 0;
  }

  .collapsed-frame-node .port {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    cursor: crosshair;
    pointer-events: auto;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .collapsed-frame-node .port-input {
    margin-left: -5px;
    background: #6b7280;
    border: 2px solid #e8e8e8;
  }

  .collapsed-frame-node .port-output {
    margin-right: -5px;
    background: #7c3aed;
    border: 2px solid #e8e8e8;
  }

  .collapsed-frame-node .port:hover {
    transform: scale(1.3);
  }

  /* Collapsed Frame Header */
  .collapsed-frame-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-bottom: 1px solid #e0e0e0;
  }

  .collapsed-frame-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e0e0e0;
    border-radius: 6px;
  }

  .collapsed-frame-icon nr-icon {
    width: 14px;
    height: 14px;
    color: #7c3aed;
  }

  .collapsed-frame-title {
    flex: 1;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;
    color: #161616;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .collapsed-frame-title .frame-label-edit-icon {
    opacity: 0;
    flex-shrink: 0;
  }

  /* Collapsed Frame Title Input */
  .collapsed-frame-title-input {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    color: #161616;
    background: #e0e0e0;
    border: 1px solid #7c3aed;
    border-radius: 4px;
    padding: 2px 6px;
    outline: none;
    min-width: 60px;
  }

  .collapsed-frame-title-input:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }

  .collapsed-frame-count {
    font-size: 11px;
    color: #525252;
    background: #e0e0e0;
    padding: 2px 6px;
    border-radius: 10px;
  }

  /* Node Icons Preview */
  .node-icons-preview {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .node-icon-item {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .node-icon-item nr-icon {
    width: 14px;
    height: 14px;
  }

  .node-icons-more {
    font-size: 10px;
    color: #525252;
    padding: 0 4px;
  }

  /* Aggregated Ports */
  .collapsed-frame-ports {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
  }

  .aggregated-ports-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .aggregated-ports-section.inputs {
    align-items: flex-start;
  }

  .aggregated-ports-section.outputs {
    align-items: flex-end;
  }

  .aggregated-port {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #525252;
  }

  .aggregated-port-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #7c3aed;
    border: 2px solid #e8e8e8;
  }

  .aggregated-ports-section.inputs .aggregated-port-dot {
    order: -1;
  }

  .aggregated-ports-section.outputs .aggregated-port-dot {
    order: 1;
  }

  /* Expand button for collapsed frame */
  .collapsed-frame-expand-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, background 0.15s ease;
  }

  .collapsed-frame-node:hover .collapsed-frame-expand-btn {
    opacity: 1;
  }

  .collapsed-frame-expand-btn:hover {
    background: #e0e0e0;
  }

  .collapsed-frame-expand-btn nr-icon {
    width: 12px;
    height: 12px;
    color: #525252;
  }

  /* Light theme overrides for frames */
  .canvas-wrapper[data-theme="light"] .collapsed-frame-node,
  .canvas-wrapper[data-theme="carbon-light"] .collapsed-frame-node,
  .canvas-wrapper[data-theme="default-light"] .collapsed-frame-node,
  .canvas-wrapper[data-theme="default"] .collapsed-frame-node {
    background: #e8e8e8;
    border-color: #e0e0e0;
  }

  .canvas-wrapper[data-theme="light"] .collapsed-frame-header,
  .canvas-wrapper[data-theme="carbon-light"] .collapsed-frame-header,
  .canvas-wrapper[data-theme="default-light"] .collapsed-frame-header,
  .canvas-wrapper[data-theme="default"] .collapsed-frame-header,
  .canvas-wrapper[data-theme="light"] .node-icons-preview,
  .canvas-wrapper[data-theme="carbon-light"] .node-icons-preview,
  .canvas-wrapper[data-theme="default-light"] .node-icons-preview,
  .canvas-wrapper[data-theme="default"] .node-icons-preview {
    border-color: #e0e0e0;
  }

  .canvas-wrapper[data-theme="light"] .collapsed-frame-icon,
  .canvas-wrapper[data-theme="carbon-light"] .collapsed-frame-icon,
  .canvas-wrapper[data-theme="default-light"] .collapsed-frame-icon,
  .canvas-wrapper[data-theme="default"] .collapsed-frame-icon,
  .canvas-wrapper[data-theme="light"] .collapsed-frame-count,
  .canvas-wrapper[data-theme="carbon-light"] .collapsed-frame-count,
  .canvas-wrapper[data-theme="default-light"] .collapsed-frame-count,
  .canvas-wrapper[data-theme="default"] .collapsed-frame-count {
    background: #f4f4f4;
  }

  .canvas-wrapper[data-theme="light"] .collapsed-frame-title,
  .canvas-wrapper[data-theme="carbon-light"] .collapsed-frame-title,
  .canvas-wrapper[data-theme="default-light"] .collapsed-frame-title,
  .canvas-wrapper[data-theme="default"] .collapsed-frame-title {
    color: #161616;
  }

  /* Light theme for label inputs */
  .canvas-wrapper[data-theme="light"] .frame-label-input,
  .canvas-wrapper[data-theme="carbon-light"] .frame-label-input,
  .canvas-wrapper[data-theme="default-light"] .frame-label-input,
  .canvas-wrapper[data-theme="default"] .frame-label-input,
  .canvas-wrapper[data-theme="light"] .collapsed-frame-title-input,
  .canvas-wrapper[data-theme="carbon-light"] .collapsed-frame-title-input,
  .canvas-wrapper[data-theme="default-light"] .collapsed-frame-title-input,
  .canvas-wrapper[data-theme="default"] .collapsed-frame-title-input {
    color: #161616;
    background: #f4f4f4;
  }

  .canvas-wrapper[data-theme="light"] .frame-collapse-btn,
  .canvas-wrapper[data-theme="carbon-light"] .frame-collapse-btn,
  .canvas-wrapper[data-theme="default-light"] .frame-collapse-btn,
  .canvas-wrapper[data-theme="default"] .frame-collapse-btn {
    background: #e8e8e8;
    border-color: #e0e0e0;
  }

  .canvas-wrapper[data-theme="light"] .resize-handle.corner,
  .canvas-wrapper[data-theme="carbon-light"] .resize-handle.corner,
  .canvas-wrapper[data-theme="default-light"] .resize-handle.corner,
  .canvas-wrapper[data-theme="default"] .resize-handle.corner {
    border-color: #f4f4f4;
  }

  /* ===== COLLAPSED FRAME STATUS INDICATORS ===== */

  /* Status indicator badge */
  .frame-status-indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    z-index: 10;
  }

  .frame-status-indicator nr-icon {
    width: 14px;
    height: 14px;
  }

  /* Running status - blue with spinning animation */
  .frame-status-indicator.status-running {
    background: #7c3aed;
    color: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  .frame-status-indicator.status-running .spinning {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Failed status - red */
  .frame-status-indicator.status-failed {
    background: #dc2626;
    color: white;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
  }

  /* Completed status - green */
  .frame-status-indicator.status-completed {
    background: #198038;
    color: white;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
  }

  /* Pending status - yellow/amber */
  .frame-status-indicator.status-pending,
  .frame-status-indicator.status-waiting {
    background: #f1c21b;
    color: white;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
  }

  /* Collapsed frame border glow for active statuses */
  .collapsed-frame-node.status-running {
    box-shadow: 0 0 0 2px #7c3aed,
                0 4px 12px rgba(59, 130, 246, 0.2);
    animation: pulse-blue 2s ease-in-out infinite;
  }

  @keyframes pulse-blue {
    0%, 100% { box-shadow: 0 0 0 2px #7c3aed, 0 4px 12px rgba(59, 130, 246, 0.2); }
    50% { box-shadow: 0 0 0 4px #7c3aed, 0 4px 16px rgba(59, 130, 246, 0.4); }
  }

  .collapsed-frame-node.status-failed {
    border-color: #dc2626;
    box-shadow: 0 0 0 2px #dc2626,
                0 4px 12px rgba(239, 68, 68, 0.2);
  }

  .collapsed-frame-node.status-completed {
    border-color: #198038;
  }

  .collapsed-frame-node.status-pending,
  .collapsed-frame-node.status-waiting {
    border-color: #f1c21b;
  }

  /* ========================================
   * COLLABORATION: REMOTE CURSORS
   * ======================================== */

  .remote-cursor {
    position: absolute;
    pointer-events: none;
    z-index: 9999;
    transition: left 50ms linear, top 50ms linear;
    will-change: left, top;
  }

  .remote-cursor svg {
    display: block;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  }

  .remote-cursor-label {
    display: inline-block;
    margin-left: 16px;
    margin-top: -2px;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #ffffff;
    white-space: nowrap;
    line-height: 1.4;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  /* ========================================
   * COLLABORATION: PRESENCE BAR
   * ======================================== */

  .presence-bar {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    pointer-events: auto;
  }

  .presence-avatars {
    display: flex;
    flex-direction: row-reverse;
  }

  .presence-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    color: #ffffff;
    border: 2px solid #ffffff;
    margin-left: -8px;
    cursor: default;
    position: relative;
    transition: transform 0.15s ease;
  }

  .presence-avatar-clickable {
    cursor: pointer;
  }

  .presence-avatar:hover {
    transform: scale(1.15);
    z-index: 1;
  }

  .presence-avatar-clickable:hover {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.6);
  }

  .presence-avatar:last-child {
    margin-left: 0;
  }

  .presence-avatar-typing {
    animation: presence-typing-pulse 1.2s ease-in-out infinite;
  }

  @keyframes presence-typing-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); }
  }

  .presence-avatar-extra {
    background: #6b7280 !important;
    font-size: 10px;
  }

  .presence-count {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    white-space: nowrap;
  }

`;

export const styles = [workflowCanvasStyles, chatbotPanelStyles];
