import { css } from 'lit';

/**
 * Workflow Node component styles
 * Using shared CSS variables from /src/shared/themes/
 * Supports default and carbon themes
 */
export const workflowNodeStyles = css`
  :host {
    display: block;
    position: absolute;
    user-select: none;

    /* Force CSS custom property inheritance to ensure theme switching works properly */
    color: #161616;

    /* Ensure clean state transitions when theme changes */
    * {
      transition: all 0.15s ease;
    }
  }

  /* Force re-evaluation of theme-dependent properties on theme change */
  :host([data-theme]) {
    color: inherit;
  }

  .node-container {
    position: relative;
    min-width: 180px;
    min-height: 60px;
    background: #f4f4f4;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: box-shadow 0.15s ease,
                border-color 0.15s ease,
                transform 0.15s ease;
    cursor: grab;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .node-container:hover {
    border-color: #a8a8a8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .node-container.selected {
    border-color: #7c3aed;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .node-container.dragging {
    cursor: grabbing;
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  /* Status indicators */
  /* Pending status - uncomment to show orange border for pending nodes
  .node-container.status-pending {
    border-color: #f59e0b !important;
    box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.3), 0 1px 3px rgba(0,0,0,0.1);
  }
  */

  .node-container.status-running {
    border-color: #7c3aed !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3), 0 1px 3px rgba(0,0,0,0.1);
    animation: pulse-running 1.5s infinite;
  }

  .node-container.status-completed {
    border-color: #22c55e !important;
    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3), 0 1px 3px rgba(0,0,0,0.1);
  }

  .node-container.status-failed {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3), 0 1px 3px rgba(0,0,0,0.1);
  }

  .node-container.status-waiting {
    border-color: #f59e0b !important;
    box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.3), 0 1px 3px rgba(0,0,0,0.1);
  }

  .node-container.status-paused {
    border-color: #8b5cf6 !important;
    box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3), 0 1px 3px rgba(0,0,0,0.1);
  }

  .node-container.status-cancelled {
    border-color: #6b7280 !important;
    box-shadow: 0 0 0 1px rgba(107, 114, 128, 0.3), 0 1px 3px rgba(0,0,0,0.1);
  }

  @keyframes pulse-running {
    0%, 100% { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3); }
    50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.1), 0 2px 8px rgba(0, 0, 0, 0.3); }
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
  }

  /* Header */
  .node-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #e8e8e8;
    border-radius: 6px 6px 0 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .node-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: #7c3aed;
    color: #ffffff;
    font-size: 0.875rem;
  }

  .node-icon nr-icon {
    color: inherit;
    --icon-size: 14px;
  }

  .node-title {
    flex: 1;
    font-size: 0.875rem;
    font-weight: 600;
    color: #161616;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .node-type-badge {
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 4px;
    background: #7c3aed;
    color: #ffffff;
    text-transform: uppercase;
    font-weight: 500;
  }

  /* Agent badge */
  .node-type-badge.agent {
    background: linear-gradient(135deg, #10b981, #059669);
  }

  /* Body */
  .node-body {
    padding: 0.5rem 0.75rem;
    min-height: 20px;
    background: #ffffff;
  }

  .node-description {
    font-size: 0.75rem;
    color: #525252;
    line-height: 1.4;
  }

  /* Node body button styling */
  .node-body nr-button {
    margin-top: 0.25rem;
  }

  /* Status indicator */
  .node-status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-top: 1px solid #e0e0e0;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #525252;
  }

  .status-dot.idle { background: #6b7280; }
  .status-dot.pending { background: #f59e0b; }
  .status-dot.running {
    background: #7c3aed;
    animation: blink 1s infinite;
  }
  .status-dot.completed { background: #22c55e; }
  .status-dot.failed { background: #ef4444; }
  .status-dot.paused { background: #8b5cf6; }
  .status-dot.waiting { background: #f59e0b; }
  .status-dot.thinking {
    background: #7c3aed;
    animation: blink 0.8s infinite;
  }
  .status-dot.tool {
    background: #f59e0b;
    animation: blink 0.8s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .status-text {
    color: #525252;
    text-transform: capitalize;
  }


  /* Ports */
  .ports-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .port {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #a8a8a8;
    border: 1.5px solid #666;
    cursor: crosshair;
    pointer-events: auto;
    transition: transform 0.15s ease,
                background 0.15s ease,
                border-color 0.15s ease;
    z-index: 10;
  }

  .port:hover {
    transform: scale(1.3);
    background: #5a5a5a;
  }

  .port.connecting {
    transform: scale(1.4);
    background: #7c3aed;
    border-color: #7c3aed;
  }

  .port.compatible {
    animation: port-pulse 0.8s infinite;
  }

  @keyframes port-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }

  /* Input ports - left side */
  .port.input {
    left: -4px;
    background: #6b7280;
    border-color: #525252;
  }

  /* Output ports - right side */
  .port.output {
    right: -4px;
    background: #7c3aed;
    border-color: #2563eb;
  }

  /* Conditional ports */
  .port.conditional-true {
    background: #22c55e;
    border-color: #16a34a;
  }

  .port.conditional-false {
    background: #ef4444;
    border-color: #dc2626;
  }

  .port.conditional-default {
    background: #6b7280;
    border-color: #4b5563;
  }

  .port.error {
    background: #ef4444;
    border-color: #dc2626;
  }

  /* Config ports - bottom side */
  .port.config {
    bottom: -4px;
    background: #06b6d4;
    border-color: #0891b2;
  }

  .port.config:hover {
    background: #0891b2;
  }

  /* Port labels */
  .port-label {
    position: absolute;
    font-size: 9px;
    color: #525252;
    white-space: nowrap;
    pointer-events: none;
    top: 50%;
    transform: translateY(-50%);
  }

  .port-label.input {
    right: calc(100% + 8px);
  }

  .port-label.output {
    left: calc(100% + 8px);
  }

  .port-label.config {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
  }

  /* Error display */
  .node-error {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    border-top: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 0 0 6px 6px;
  }

  /* ========================================
   * CARBON THEME - Sharp corners
   * ======================================== */

  .node-container[data-theme="carbon-light"],
  .node-container[data-theme="carbon-dark"],
  .node-container[data-theme="carbon"] {
    border-radius: 0;

    .node-header {
      border-radius: 0;
    }

    .node-icon {
      border-radius: 0;
    }

    .node-type-badge {
      border-radius: 0;
    }

    .node-error {
      border-radius: 0;
    }
  }

  /* ========================================
   * LIGHT THEME STYLING
   * ======================================== */

  /* Light Theme - target node-container with data-theme */
  .node-container[data-theme="light"],
  .node-container[data-theme="carbon-light"],
  .node-container[data-theme="default-light"],
  .node-container[data-theme="default"] {
    background: #f4f4f4;
    border-color: #e0e0e0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .node-container[data-theme="light"]:hover,
  .node-container[data-theme="carbon-light"]:hover,
  .node-container[data-theme="default-light"]:hover,
  .node-container[data-theme="default"]:hover {
    border-color: #a8a8a8;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .node-container[data-theme="light"].selected,
  .node-container[data-theme="carbon-light"].selected,
  .node-container[data-theme="default-light"].selected,
  .node-container[data-theme="default"].selected {
    border-color: #7c3aed;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }


  .node-container[data-theme="light"] .node-header,
  .node-container[data-theme="carbon-light"] .node-header,
  .node-container[data-theme="default-light"] .node-header {
    background: #e8e8e8;
    border-color: #e0e0e0;
  }

  .node-container[data-theme="light"] .node-title,
  .node-container[data-theme="carbon-light"] .node-title,
  .node-container[data-theme="default-light"] .node-title {
    color: #161616;
  }

  .node-container[data-theme="light"] .node-description,
  .node-container[data-theme="light"] .node-status,
  .node-container[data-theme="light"] .status-text,
  .node-container[data-theme="carbon-light"] .node-description,
  .node-container[data-theme="carbon-light"] .node-status,
  .node-container[data-theme="carbon-light"] .status-text,
  .node-container[data-theme="default-light"] .node-description,
  .node-container[data-theme="default-light"] .node-status,
  .node-container[data-theme="default-light"] .status-text {
    color: #525252;
  }

  .node-container[data-theme="light"] .port,
  .node-container[data-theme="carbon-light"] .port,
  .node-container[data-theme="default-light"] .port {
    background: #8d8d8d;
    border-color: #6f6f6f;
  }

  .node-container[data-theme="light"] .port:hover,
  .node-container[data-theme="carbon-light"] .port:hover,
  .node-container[data-theme="default-light"] .port:hover {
    background: #6f6f6f;
  }

  /* ========================================
   * DARK THEME STYLING (Default)
   * ======================================== */

  /* Dark Theme - target node-container with data-theme */
  .node-container[data-theme="dark"],
  .node-container[data-theme="carbon-dark"],
  .node-container[data-theme="default-dark"] {
    background: #f4f4f4;
    border-color: #e0e0e0;
  }

  .node-container[data-theme="dark"]:hover,
  .node-container[data-theme="carbon-dark"]:hover,
  .node-container[data-theme="default-dark"]:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .node-container[data-theme="dark"] .node-header,
  .node-container[data-theme="carbon-dark"] .node-header,
  .node-container[data-theme="default-dark"] .node-header {
    background: #e8e8e8;
    border-color: #e0e0e0;
  }

  .node-container[data-theme="dark"] .node-title,
  .node-container[data-theme="carbon-dark"] .node-title,
  .node-container[data-theme="default-dark"] .node-title {
    color: #f4f4f4;
  }

  .node-container[data-theme="dark"] .node-description,
  .node-container[data-theme="dark"] .status-text,
  .node-container[data-theme="carbon-dark"] .node-description,
  .node-container[data-theme="carbon-dark"] .status-text,
  .node-container[data-theme="default-dark"] .node-description,
  .node-container[data-theme="default-dark"] .status-text {
    color: #525252;
  }

  /* ========================================
   * DB TABLE NODE STYLES (ERD-style)
   * ======================================== */

  .node-container.db-table-node {
    min-width: 160px;
    min-height: auto;
    padding: 0;
    overflow: hidden;
  }

  .db-table-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.75rem;
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  }

  .db-table-insert-btn {
    position: absolute;
    left: 8px;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s ease, background 0.15s ease;
  }

  .db-table-node:hover .db-table-insert-btn,
  .db-table-node.selected .db-table-insert-btn {
    opacity: 1;
  }

  .db-table-insert-btn:hover {
    background: rgba(0, 0, 0, 0.15);
  }

  .db-table-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
    text-transform: capitalize;
  }

  .db-table-columns {
    padding: 0.25rem 0;
    background: #f4f4f4;
  }

  .db-table-column {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 6px 0.75rem;
    font-size: 0.75rem;
    color: #161616;
    border-bottom: 1px solid #e0e0e0;
    transition: background 0.15s ease;
  }

  .db-table-column:last-child {
    border-bottom: none;
  }

  .db-table-column:hover {
    background: #e8e8e8;
  }

  .db-table-column.primary-key {
    background: rgba(245, 158, 11, 0.1);
  }

  .db-table-column.primary-key:hover {
    background: rgba(245, 158, 11, 0.15);
  }

  .column-type-icon {
    color: #525252;
    --icon-size: 12px;
    flex-shrink: 0;
  }

  .column-key-icon {
    color: #f59e0b;
    --icon-size: 12px;
    flex-shrink: 0;
  }

  .column-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .column-required {
    color: #ef4444;
    font-weight: 700;
    font-size: 0.75rem;
  }

  .db-table-empty {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    color: #666;
    font-style: italic;
    text-align: center;
  }

  /* DB Table node - Light theme */
  .node-container.db-table-node[data-theme="light"] .db-table-columns,
  .node-container.db-table-node[data-theme="carbon-light"] .db-table-columns,
  .node-container.db-table-node[data-theme="default-light"] .db-table-columns,
  .node-container.db-table-node[data-theme="default"] .db-table-columns {
    background: #f4f4f4;
  }

  .node-container.db-table-node[data-theme="light"] .db-table-column,
  .node-container.db-table-node[data-theme="carbon-light"] .db-table-column,
  .node-container.db-table-node[data-theme="default-light"] .db-table-column,
  .node-container.db-table-node[data-theme="default"] .db-table-column {
    color: #161616;
    border-bottom-color: #e0e0e0;
  }

  .node-container.db-table-node[data-theme="light"] .db-table-column:hover,
  .node-container.db-table-node[data-theme="carbon-light"] .db-table-column:hover,
  .node-container.db-table-node[data-theme="default-light"] .db-table-column:hover,
  .node-container.db-table-node[data-theme="default"] .db-table-column:hover {
    background: #e8e8e8;
  }

  .node-container.db-table-node[data-theme="light"] .column-type-icon,
  .node-container.db-table-node[data-theme="carbon-light"] .column-type-icon,
  .node-container.db-table-node[data-theme="default-light"] .column-type-icon,
  .node-container.db-table-node[data-theme="default"] .column-type-icon {
    color: #525252;
  }

  /* ========================================
   * UI TABLE NODE STYLES
   * ======================================== */

  .node-container.ui-table-node {
    min-width: 200px;
    min-height: 120px;
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .ui-table-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  }

  .ui-table-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: white;
  }

  .ui-table-grid {
    flex: 1;
    background: #f4f4f4;
    overflow: hidden;
  }

  .ui-table-grid.placeholder {
    opacity: 0.55;
  }

  .ui-table-row {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
  }

  .ui-table-row:last-child {
    border-bottom: none;
  }

  .ui-table-cell {
    flex: 1;
    padding: 5px 10px;
    font-size: 11px;
    color: #161616;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right: 1px solid #e0e0e0;
  }

  .ui-table-cell:last-child {
    border-right: none;
  }

  .ui-table-head-row {
    background: #e8e8e8;
  }

  .ui-table-head-cell {
    font-weight: 600;
    font-size: 11px;
    color: #525252;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .ui-table-hint {
    padding: 4px 10px 6px;
    font-size: 10px;
    color: #666;
    text-align: center;
    font-style: italic;
    background: #f4f4f4;
  }

  /* UI Table node - Light theme */
  .node-container.ui-table-node[data-theme="light"] .ui-table-grid,
  .node-container.ui-table-node[data-theme="carbon-light"] .ui-table-grid,
  .node-container.ui-table-node[data-theme="default-light"] .ui-table-grid,
  .node-container.ui-table-node[data-theme="default"] .ui-table-grid {
    background: #f4f4f4;
  }

  .node-container.ui-table-node[data-theme="light"] .ui-table-head-row,
  .node-container.ui-table-node[data-theme="carbon-light"] .ui-table-head-row,
  .node-container.ui-table-node[data-theme="default-light"] .ui-table-head-row,
  .node-container.ui-table-node[data-theme="default"] .ui-table-head-row {
    background: #e8e8e8;
  }

  .node-container.ui-table-node[data-theme="light"] .ui-table-cell,
  .node-container.ui-table-node[data-theme="carbon-light"] .ui-table-cell,
  .node-container.ui-table-node[data-theme="default-light"] .ui-table-cell,
  .node-container.ui-table-node[data-theme="default"] .ui-table-cell {
    color: #161616;
    border-right-color: #e0e0e0;
  }

  .node-container.ui-table-node[data-theme="light"] .ui-table-row,
  .node-container.ui-table-node[data-theme="carbon-light"] .ui-table-row,
  .node-container.ui-table-node[data-theme="default-light"] .ui-table-row,
  .node-container.ui-table-node[data-theme="default"] .ui-table-row {
    border-bottom-color: #e0e0e0;
  }

  .node-container.ui-table-node[data-theme="light"] .ui-table-head-cell,
  .node-container.ui-table-node[data-theme="carbon-light"] .ui-table-head-cell,
  .node-container.ui-table-node[data-theme="default-light"] .ui-table-head-cell,
  .node-container.ui-table-node[data-theme="default"] .ui-table-head-cell {
    color: #525252;
  }

  .node-container.ui-table-node[data-theme="light"] .ui-table-hint,
  .node-container.ui-table-node[data-theme="carbon-light"] .ui-table-hint,
  .node-container.ui-table-node[data-theme="default-light"] .ui-table-hint,
  .node-container.ui-table-node[data-theme="default"] .ui-table-hint {
    background: #f4f4f4;
  }

  /* UI Table node - Resize handle */
  .ui-table-resize-handle {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: #7c3aed;
    border: 2px solid #f4f4f4;
    border-radius: 2px;
    cursor: se-resize;
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: 10;
  }

  .node-container.ui-table-node:hover .ui-table-resize-handle,
  .node-container.ui-table-node.selected .ui-table-resize-handle {
    opacity: 1;
  }

  .ui-table-resize-handle:hover {
    transform: scale(1.2);
  }

  /* ========================================
   * NOTE NODE STYLES (Sticky note style)
   * ======================================== */

  .node-container.note-node {
    min-width: 150px;
    min-height: 80px;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .node-container.note-node:hover {
    border: none;
    box-shadow: none;
  }

  .node-container.note-node.selected {
    border: none;
  }

  .node-container.note-node.selected .note-content {
    box-shadow: 0 0 0 2px #7c3aed,
                2px 2px 8px rgba(0, 0, 0, 0.15);
  }

  .node-container.note-node.dragging {
    transform: scale(1.02);
  }

  .note-content {
    min-width: 150px;
    min-height: 80px;
    max-width: 300px;
    padding: 12px 14px;
    border-radius: 4px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
    cursor: grab;
    transition: box-shadow 0.15s ease,
                transform 0.15s ease;
  }

  .note-content:hover {
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.15);
  }

  .node-container.note-node.dragging .note-content {
    cursor: grabbing;
    box-shadow: 6px 6px 16px rgba(0, 0, 0, 0.2);
  }

  /* Note node - Font sizes */
  .note-content.font-small {
    font-size: 12px;
  }

  .note-content.font-medium {
    font-size: 14px;
  }

  .note-content.font-large {
    font-size: 16px;
  }

  /* Note node - Text display */
  .note-text {
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Note node - Textarea for editing */
  .note-textarea {
    width: 100%;
    height: 100%;
    min-height: 60px;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    font-family: inherit;
    resize: none;
    outline: none;
    overflow: auto;
  }

  .node-container.note-node.editing .note-content {
    box-shadow: 0 0 0 2px #7c3aed,
                2px 2px 8px rgba(0, 0, 0, 0.15);
  }

  /* Note node - Settings button */
  .note-settings-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, background 0.15s ease;
    z-index: 10;
  }

  .note-settings-btn nr-icon {
    color: inherit;
    width: 14px;
    height: 14px;
  }

  .node-container.note-node:hover .note-settings-btn {
    opacity: 0.7;
  }

  .note-settings-btn:hover {
    opacity: 1 !important;
    background: rgba(0, 0, 0, 0.5);
  }

  /* Note node - Resize handle */
  .note-resize-handle {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: #7c3aed;
    border: 2px solid #f4f4f4;
    border-radius: 2px;
    cursor: se-resize;
    opacity: 0;
    transition: opacity 0.15s ease;
    z-index: 10;
  }

  .node-container.note-node:hover .note-resize-handle,
  .node-container.note-node.selected .note-resize-handle {
    opacity: 1;
  }

  .note-resize-handle:hover {
    transform: scale(1.2);
  }

  /* ---- Trigger Connection Status ---- */
  .trigger-status {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-top: 1px solid #e0e0e0;
  }

  .trigger-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .trigger-status-dot.connected {
    background: #22c55e;
    animation: trigger-pulse-connected 2s infinite;
  }

  .trigger-status-dot.disconnected {
    background: #6b7280;
  }

  .trigger-status-dot.connecting {
    background: #7c3aed;
    animation: blink 1s infinite;
  }

  .trigger-status-dot.error {
    background: #ef4444;
  }

  .trigger-status-dot.paused {
    background: #8b5cf6;
  }

  .trigger-status-dot.handoff_pending {
    background: #f59e0b;
    animation: blink 1.2s infinite;
  }

  @keyframes trigger-pulse-connected {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
    50% { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0); }
  }

  .trigger-status-text {
    color: #525252;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trigger-msg-count {
    font-size: 9px;
    padding: 1px 4px;
    border-radius: 8px;
    background: #e8e8e8;
    color: #525252;
    flex-shrink: 0;
  }

  /* ---- Remote Collaboration Overlays ---- */
  .remote-overlay-wrapper {
    position: relative;
  }

  .remote-selection-ring {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 2px dashed var(--remote-selection-color, #3b82f6);
    border-radius: 6px;
    pointer-events: none;
    z-index: 5;
    animation: remote-selection-fade-in 0.2s ease;
  }

  @keyframes remote-selection-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .remote-typing-indicator {
    position: absolute;
    bottom: -24px;
    left: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    pointer-events: none;
    z-index: 5;
    animation: remote-typing-blink 1.2s ease-in-out infinite;
  }

  @keyframes remote-typing-blink {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .node-container.remote-selected {
    outline: 2px dashed var(--remote-selection-color, #3b82f6);
    outline-offset: 4px;
  }
`;

export const styles = workflowNodeStyles;
