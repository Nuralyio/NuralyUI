import { css } from 'lit';
import { chatbotPanelStyles } from './chatbot-panel.style.js';

/**
 * Whiteboard Canvas component styles
 * Shared canvas infrastructure + whiteboard-specific toolbar/sidebar styles
 */
export const whiteboardCanvasStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    color: #161616;
    background-color: #ffffff;
  }

  :host([data-theme]) {
    color: inherit;
    background-color: inherit;
  }

  .canvas-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 0;
    background: #0f0f0f;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    overscroll-behavior: none;
    touch-action: none;
  }

  .canvas-wrapper[data-mode="PAN"] {
    cursor: grab;
  }

  .canvas-wrapper[data-mode="PAN"]:active {
    cursor: grabbing;
  }

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

  .canvas-viewport {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    will-change: transform;
    z-index: 1;
  }

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

  .edge-path {
    fill: none;
    stroke: #4a4a4a;
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
    fill: #4a4a4a;
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

  .connection-line {
    fill: none;
    stroke: #7c3aed;
    stroke-width: 2;
    stroke-dasharray: 5;
    pointer-events: none;
  }

  .nodes-layer {
    position: relative;
    z-index: 2;
  }

  .selection-box {
    position: absolute;
    border: 1px dashed #7c3aed;
    background: rgba(59, 130, 246, 0.1);
    pointer-events: none;
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
    background: rgba(255, 255, 255, 0.1);
    color: #e5e5e5;
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
    color: #e5e5e5;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .context-menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
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
    color: #e5e5e5;
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
    color: #e5e5e5;
    background: rgba(255, 255, 255, 0.1);
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

  /* Frames layer */
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

  /* Frame nodes */
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

  .frame-label.outside { top: -22px; left: 0; }
  .frame-label.inside { top: 8px; left: 12px; background: inherit; padding: 2px 6px; border-radius: 4px; }
  .frame-label.top-left { left: 0; }
  .frame-label.top-center { left: 50%; transform: translateX(-50%); }
  .frame-label.top-right { left: auto; right: 0; }

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

  .frame-label-text:hover .frame-label-edit-icon {
    opacity: 0.7;
  }

  .frame-label-edit-icon:hover {
    opacity: 1 !important;
    background: rgba(255, 255, 255, 0.1);
    color: #7c3aed;
  }

  .frame-label-input {
    font-size: 12px;
    font-weight: 600;
    color: #e5e5e5;
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

  .frame-node:hover .frame-collapse-btn { opacity: 1; }
  .frame-collapse-btn:hover { background: #3a3a3a; }
  .frame-collapse-btn nr-icon { width: 12px; height: 12px; color: #525252; }

  .frame-resize-handles {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
  }

  .resize-handle {
    position: absolute;
    pointer-events: auto;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .frame-node:hover .resize-handle,
  .frame-node.selected .resize-handle { opacity: 1; }

  .resize-handle.corner {
    width: 12px; height: 12px;
    background: #7c3aed;
    border: 2px solid #f4f4f4;
    border-radius: 2px;
  }

  .resize-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
  .resize-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
  .resize-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
  .resize-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }

  .resize-handle.edge { background: transparent; }
  .resize-handle.n { top: -4px; left: 12px; right: 12px; height: 8px; cursor: n-resize; }
  .resize-handle.s { bottom: -4px; left: 12px; right: 12px; height: 8px; cursor: s-resize; }
  .resize-handle.w { left: -4px; top: 12px; bottom: 12px; width: 8px; cursor: w-resize; }
  .resize-handle.e { right: -4px; top: 12px; bottom: 12px; width: 8px; cursor: e-resize; }

  /* ========================================
   * WHITEBOARD FLOATING TOOLBAR
   * ======================================== */

  .wb-floating-toolbar {
    position: absolute;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
    pointer-events: auto;
    white-space: nowrap;
  }

  .wb-color-picker-panel {
    position: absolute;
    z-index: 1001;
    pointer-events: auto;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
    padding: 8px;
    width: 200px;
  }

  .wb-picker-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
  }

  .wb-picker-swatch {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1.5px solid #d1d5db;
    cursor: pointer;
    padding: 0;
    transition: transform 0.1s ease, border-color 0.1s ease;
  }

  .wb-picker-swatch:hover {
    transform: scale(1.15);
    border-color: #9ca3af;
  }

  .wb-picker-swatch.active {
    border-color: #3b82f6;
    box-shadow: 0 0 0 1.5px #3b82f6;
  }

  .wb-picker-custom {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .wb-picker-native {
    width: 32px;
    height: 32px;
    padding: 1px;
    border: 1.5px solid #d1d5db;
    border-radius: 6px;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
    -webkit-appearance: none;
    appearance: none;
  }

  .wb-picker-native::-webkit-color-swatch-wrapper { padding: 2px; }
  .wb-picker-native::-webkit-color-swatch { border: none; border-radius: 3px; }
  .wb-picker-native::-moz-color-swatch { border: none; border-radius: 3px; }
  .wb-picker-native:hover { border-color: #9ca3af; }

  .wb-toolbar-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .wb-toolbar-label {
    font-size: 10px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 2px;
    user-select: none;
  }

  .wb-toolbar-divider {
    width: 1px;
    height: 20px;
    background: #e5e7eb;
    margin: 0 4px;
  }

  .wb-floating-toolbar nr-colorholder-box { cursor: pointer; }
  .wb-floating-toolbar nr-input { --nr-input-height: 28px; --nr-input-font-size: 12px; }
  .wb-floating-toolbar nr-select { --nr-select-height: 28px; --nr-select-font-size: 12px; }

  .wb-toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #f9fafb;
    cursor: pointer;
    transition: all 0.1s ease;
    color: #374151;
  }

  .wb-toolbar-btn:hover { background: #e5e7eb; }
  .wb-toolbar-btn.danger:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
  .wb-toolbar-btn nr-icon { --icon-size: 14px; }

  /* ========================================
   * WHITEBOARD LEFT SIDEBAR (Miro-style)
   * ======================================== */

  .wb-sidebar {
    position: absolute;
    left: 16px;
    top: 16px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
    pointer-events: auto;
  }

  .wb-sidebar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    color: #6b7280;
  }

  .wb-sidebar-btn:hover { background: #f3f4f6; color: #374151; }
  .wb-sidebar-btn.active { background: #7c3aed; color: #fff; }
  .wb-sidebar-btn nr-icon { color: inherit; }

  .wb-sidebar-divider {
    width: 24px;
    height: 1px;
    background: #e5e7eb;
    margin: 4px 0;
  }

  .wb-sidebar-shapes-wrapper { position: relative; }

  .wb-shapes-flyout {
    position: absolute;
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    padding: 8px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
    z-index: 101;
    pointer-events: auto;
  }

  .wb-shapes-flyout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    transition: all 0.15s ease;
    color: #6b7280;
  }

  .wb-shapes-flyout-btn:hover { background: #f3f4f6; color: #374151; }
  .wb-shapes-flyout-btn nr-icon { color: inherit; }

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

  /* ========================================
   * LIGHT THEME
   * ======================================== */

  .canvas-wrapper[data-theme="light"],
  .canvas-wrapper[data-theme="carbon-light"],
  .canvas-wrapper[data-theme="default-light"] {
    background: #f4f4f4;

    .canvas-grid {
      background-image:
        linear-gradient(#e0e0e0 1px, transparent 1px),
        linear-gradient(90deg, #e0e0e0 1px, transparent 1px);
    }

    .edge-path { stroke: #8d8d8d; }
    .edge-path:hover { stroke: #6f6f6f; }
    .edge-arrow { fill: #8d8d8d; }
  }

  .canvas-wrapper[data-theme="light"] .canvas-toolbar,
  .canvas-wrapper[data-theme="light"] .zoom-controls,
  .canvas-wrapper[data-theme="light"] .context-menu,
  .canvas-wrapper[data-theme="light"] .config-panel,
  .canvas-wrapper[data-theme="carbon-light"] .canvas-toolbar,
  .canvas-wrapper[data-theme="carbon-light"] .zoom-controls,
  .canvas-wrapper[data-theme="carbon-light"] .context-menu,
  .canvas-wrapper[data-theme="carbon-light"] .config-panel,
  .canvas-wrapper[data-theme="default-light"] .canvas-toolbar,
  .canvas-wrapper[data-theme="default-light"] .zoom-controls,
  .canvas-wrapper[data-theme="default-light"] .context-menu,
  .canvas-wrapper[data-theme="default-light"] .config-panel,
  .canvas-wrapper[data-theme="default"] .canvas-toolbar,
  .canvas-wrapper[data-theme="default"] .zoom-controls,
  .canvas-wrapper[data-theme="default"] .context-menu,
  .canvas-wrapper[data-theme="default"] .config-panel {
    background: #f4f4f4;
    border-color: #e0e0e0;
  }

  .canvas-wrapper[data-theme="light"] .context-menu-item,
  .canvas-wrapper[data-theme="carbon-light"] .context-menu-item,
  .canvas-wrapper[data-theme="default-light"] .context-menu-item,
  .canvas-wrapper[data-theme="default"] .context-menu-item {
    color: #1a1a1a;
  }

  .canvas-wrapper[data-theme="light"] .context-menu-item:hover,
  .canvas-wrapper[data-theme="carbon-light"] .context-menu-item:hover,
  .canvas-wrapper[data-theme="default-light"] .context-menu-item:hover,
  .canvas-wrapper[data-theme="default"] .context-menu-item:hover {
    background: #f3f4f6;
  }

  .canvas-wrapper[data-theme="light"] .context-menu-item.danger,
  .canvas-wrapper[data-theme="carbon-light"] .context-menu-item.danger,
  .canvas-wrapper[data-theme="default-light"] .context-menu-item.danger,
  .canvas-wrapper[data-theme="default"] .context-menu-item.danger {
    color: #ef4444;
  }

  .canvas-wrapper[data-theme="light"] .context-menu-shortcut,
  .canvas-wrapper[data-theme="carbon-light"] .context-menu-shortcut,
  .canvas-wrapper[data-theme="default-light"] .context-menu-shortcut,
  .canvas-wrapper[data-theme="default"] .context-menu-shortcut {
    color: #525252;
  }

  .canvas-wrapper[data-theme="light"] .context-menu-divider,
  .canvas-wrapper[data-theme="carbon-light"] .context-menu-divider,
  .canvas-wrapper[data-theme="default-light"] .context-menu-divider,
  .canvas-wrapper[data-theme="default"] .context-menu-divider {
    background: #e0e0e0;
  }

  .canvas-wrapper[data-theme="light"] .toolbar-btn,
  .canvas-wrapper[data-theme="carbon-light"] .toolbar-btn,
  .canvas-wrapper[data-theme="default-light"] .toolbar-btn,
  .canvas-wrapper[data-theme="default"] .toolbar-btn {
    color: #525252;
  }

  .canvas-wrapper[data-theme="light"] .toolbar-btn:hover,
  .canvas-wrapper[data-theme="carbon-light"] .toolbar-btn:hover,
  .canvas-wrapper[data-theme="default-light"] .toolbar-btn:hover,
  .canvas-wrapper[data-theme="default"] .toolbar-btn:hover {
    background: #f3f4f6;
    color: #1a1a1a;
  }

  .canvas-wrapper[data-theme="light"] .zoom-value,
  .canvas-wrapper[data-theme="carbon-light"] .zoom-value,
  .canvas-wrapper[data-theme="default-light"] .zoom-value,
  .canvas-wrapper[data-theme="default"] .zoom-value {
    color: #525252;
  }

  .canvas-wrapper[data-theme="light"] .empty-state,
  .canvas-wrapper[data-theme="carbon-light"] .empty-state,
  .canvas-wrapper[data-theme="default-light"] .empty-state {
    color: #a8a8a8;
  }

  /* ========================================
   * DARK THEME
   * ======================================== */

  .canvas-wrapper[data-theme="dark"],
  .canvas-wrapper[data-theme="carbon-dark"],
  .canvas-wrapper[data-theme="default-dark"] {
    background: #ffffff;

    .canvas-grid {
      background-image:
        linear-gradient(#e0e0e0 1px, transparent 1px),
        linear-gradient(90deg, #e0e0e0 1px, transparent 1px);
    }
  }

  .canvas-wrapper[data-theme="dark"] .canvas-toolbar,
  .canvas-wrapper[data-theme="dark"] .zoom-controls,
  .canvas-wrapper[data-theme="dark"] .context-menu,
  .canvas-wrapper[data-theme="dark"] .config-panel,
  .canvas-wrapper[data-theme="carbon-dark"] .canvas-toolbar,
  .canvas-wrapper[data-theme="carbon-dark"] .zoom-controls,
  .canvas-wrapper[data-theme="carbon-dark"] .context-menu,
  .canvas-wrapper[data-theme="carbon-dark"] .config-panel,
  .canvas-wrapper[data-theme="default-dark"] .canvas-toolbar,
  .canvas-wrapper[data-theme="default-dark"] .zoom-controls,
  .canvas-wrapper[data-theme="default-dark"] .context-menu,
  .canvas-wrapper[data-theme="default-dark"] .config-panel {
    background: #f4f4f4;
    border-color: #e0e0e0;
  }

  /* Carbon theme sharp corners */
  .canvas-wrapper[data-theme="carbon-light"],
  .canvas-wrapper[data-theme="carbon-dark"],
  .canvas-wrapper[data-theme="carbon"] {
    .canvas-toolbar,
    .zoom-controls,
    .context-menu,
    .config-panel {
      border-radius: 0;
    }

    .toolbar-btn,
    .config-panel-close {
      border-radius: 0;
    }
  }

`;

export const styles = [whiteboardCanvasStyles, chatbotPanelStyles];
