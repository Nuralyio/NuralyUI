/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ReactiveControllerHost } from 'lit';
import { BaseCanvasController } from './base.controller.js';
import type { WorkflowNode } from '../workflow-canvas.types.js';
import type { CanvasHost } from '../interfaces/index.js';

interface ResizeState {
  nodeId: string;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

/**
 * Controller that manages resize operations for Note and Table nodes.
 *
 * Handles mouse-drag resizing by tracking the initial dimensions and
 * computing deltas based on viewport zoom. Extracted from
 * WorkflowCanvasElement to reduce component size.
 */
export class ResizeController extends BaseCanvasController {
  private noteResizeState: ResizeState | null = null;
  private tableResizeState: ResizeState | null = null;

  /** Callback to dispatch workflow-changed event after resize ends */
  private _onResizeEnd: () => void = () => {};

  constructor(host: CanvasHost & ReactiveControllerHost) {
    super(host);
  }

  setResizeEndCallback(cb: () => void): void {
    this._onResizeEnd = cb;
  }

  override hostDisconnected(): void {
    this.stopNoteResize();
    this.stopTableResize();
  }

  // ---- Note resize ----

  startNoteResize(node: WorkflowNode, event: MouseEvent): void {
    const config = node.configuration || {};
    this.noteResizeState = {
      nodeId: node.id,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: (config.noteWidth as number) || 200,
      startHeight: (config.noteHeight as number) || 100,
    };

    document.addEventListener('mousemove', this.handleNoteResizeDrag);
    document.addEventListener('mouseup', this.stopNoteResize);
  }

  private handleNoteResizeDrag = (event: MouseEvent) => {
    if (!this.noteResizeState) return;

    const { nodeId, startX, startY, startWidth, startHeight } = this.noteResizeState;
    const node = this._host.workflow.nodes.find((n: WorkflowNode) => n.id === nodeId);
    if (!node) return;

    const deltaX = (event.clientX - startX) / this._host.viewport.zoom;
    const deltaY = (event.clientY - startY) / this._host.viewport.zoom;

    const newWidth = Math.max(100, startWidth + deltaX);
    const newHeight = Math.max(50, startHeight + deltaY);

    node.configuration = {
      ...node.configuration,
      noteWidth: newWidth,
      noteHeight: newHeight,
    };

    this._host.requestUpdate();
  };

  private stopNoteResize = () => {
    if (!this.noteResizeState) return;

    this.noteResizeState = null;
    document.removeEventListener('mousemove', this.handleNoteResizeDrag);
    document.removeEventListener('mouseup', this.stopNoteResize);

    this._onResizeEnd();
  };

  // ---- Table resize ----

  startTableResize(node: WorkflowNode, event: MouseEvent): void {
    const config = node.configuration || {};
    this.tableResizeState = {
      nodeId: node.id,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: (config.tableWidth as number) || 320,
      startHeight: (config.tableHeight as number) || 200,
    };

    document.addEventListener('mousemove', this.handleTableResizeDrag);
    document.addEventListener('mouseup', this.stopTableResize);
  }

  private handleTableResizeDrag = (event: MouseEvent) => {
    if (!this.tableResizeState) return;

    const { nodeId, startX, startY, startWidth, startHeight } = this.tableResizeState;
    const node = this._host.workflow.nodes.find((n: WorkflowNode) => n.id === nodeId);
    if (!node) return;

    const deltaX = (event.clientX - startX) / this._host.viewport.zoom;
    const deltaY = (event.clientY - startY) / this._host.viewport.zoom;

    const newWidth = Math.max(200, startWidth + deltaX);
    const newHeight = Math.max(120, startHeight + deltaY);

    node.configuration = {
      ...node.configuration,
      tableWidth: newWidth,
      tableHeight: newHeight,
    };

    this._host.requestUpdate();
  };

  private stopTableResize = () => {
    if (!this.tableResizeState) return;

    this.tableResizeState = null;
    document.removeEventListener('mousemove', this.handleTableResizeDrag);
    document.removeEventListener('mouseup', this.stopTableResize);

    this._onResizeEnd();
  };
}
