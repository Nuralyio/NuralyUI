/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ReactiveControllerHost } from 'lit';
import { BaseCanvasController } from './base.controller.js';
import { CanvasHost } from '../interfaces/index.js';
import { WorkflowNode } from '../workflow-canvas.types.js';
import { ViewportController } from './viewport.controller.js';
import { DragController } from './drag.controller.js';
import { SelectionController } from './selection.controller.js';

const DOUBLE_TAP_THRESHOLD = 300;
const DOUBLE_TAP_DISTANCE = 30;
const TAP_MOVE_THRESHOLD = 10;

/** CSS classes of UI overlay elements that should receive normal browser touch/click handling */
const UI_OVERLAY_CLASSES = [
  'canvas-toolbar',
  'wb-sidebar',
  'zoom-controls',
  'context-menu',
  'wb-floating-toolbar',
  'wb-color-picker-panel',
  'presence-bar',
  'config-panel',
  'config-panel-content',
  'wb-action-indicator',
];

type GestureType = 'none' | 'pending' | 'pan' | 'drag' | 'pinch';

/**
 * Controller for handling touch interactions on the canvas.
 * Detects gestures (pan, pinch-zoom, drag, tap, double-tap) and
 * delegates to existing controllers using synthetic MouseEvent objects.
 */
export class TouchController extends BaseCanvasController {
  private viewportController: ViewportController;
  private dragController: DragController;
  private selectionController: SelectionController;

  private activeTouches: Map<number, Touch> = new Map();
  private gestureType: GestureType = 'none';
  private initialPinchDistance = 0;
  private initialPinchZoom = 1;
  private lastTapTime = 0;
  private lastTapPosition: { x: number; y: number } = { x: 0, y: 0 };
  private touchStartPos: { x: number; y: number } | null = null;
  private _touchStartTime = 0;
  private touchTargetNode: WorkflowNode | null = null;

  constructor(
    host: CanvasHost & ReactiveControllerHost,
    viewportController: ViewportController,
    dragController: DragController,
    selectionController: SelectionController
  ) {
    super(host);
    this.viewportController = viewportController;
    this.dragController = dragController;
    this.selectionController = selectionController;
  }

  override hostConnected(): void {
    this._host.updateComplete.then(() => {
      const wrapper = this.canvasWrapper;
      if (!wrapper) return;
      wrapper.addEventListener('touchstart', this.handleTouchStart, { passive: false });
      wrapper.addEventListener('touchmove', this.handleTouchMove, { passive: false });
      wrapper.addEventListener('touchend', this.handleTouchEnd, { passive: false });
      wrapper.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
    });
  }

  override hostDisconnected(): void {
    const wrapper = this.canvasWrapper;
    if (!wrapper) return;
    wrapper.removeEventListener('touchstart', this.handleTouchStart);
    wrapper.removeEventListener('touchmove', this.handleTouchMove);
    wrapper.removeEventListener('touchend', this.handleTouchEnd);
    wrapper.removeEventListener('touchcancel', this.handleTouchEnd);
  }

  // ===== TOUCH EVENT HANDLERS =====

  private handleTouchStart = (e: TouchEvent): void => {
    if (this._host.disabled) return;

    // Let UI overlay elements (toolbar, sidebar, etc.) handle their own touches
    if (this.isTouchOnUIOverlay(e)) return;

    // Prevent browser from generating synthetic mouse events
    e.preventDefault();

    // Update active touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      this.activeTouches.set(t.identifier, t);
    }

    const count = this.activeTouches.size;

    if (count === 2) {
      // Transition to pinch — cancel any pending single-touch gesture
      if (this.gestureType === 'drag' && this.dragController.isDragging()) {
        this.dragController.stopDrag();
      }
      if (this.gestureType === 'pan' && this._host.isPanning) {
        this.viewportController.stopPan();
      }

      this.gestureType = 'pinch';
      const touches = Array.from(this.activeTouches.values());
      this.initialPinchDistance = this.getDistance(touches[0], touches[1]);
      this.initialPinchZoom = this._host.viewport.zoom;
      return;
    }

    if (count === 1) {
      const touch = e.changedTouches[0];
      this.touchStartPos = { x: touch.clientX, y: touch.clientY };
      this._touchStartTime = Date.now();
      this.touchTargetNode = this.findNodeFromTouch(e);
      this.gestureType = 'pending';
    }
  };

  private handleTouchMove = (e: TouchEvent): void => {
    if (this._host.disabled) return;
    if (this.gestureType === 'none') return;
    e.preventDefault();

    // Update active touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      this.activeTouches.set(t.identifier, t);
    }

    // Update lastMousePosition for collaboration cursors
    if (e.touches.length >= 1 && this.canvasWrapper) {
      const touch = e.touches[0];
      const rect = this.canvasWrapper.getBoundingClientRect();
      this._host.lastMousePosition = {
        x: (touch.clientX - rect.left - this._host.viewport.panX) / this._host.viewport.zoom,
        y: (touch.clientY - rect.top - this._host.viewport.panY) / this._host.viewport.zoom,
      };
    }

    if (this.gestureType === 'pinch' && this.activeTouches.size >= 2) {
      this.handlePinchMove();
      return;
    }

    if (this.activeTouches.size !== 1) return;
    const touch = e.touches[0];
    if (!touch || !this.touchStartPos) return;

    const dx = touch.clientX - this.touchStartPos.x;
    const dy = touch.clientY - this.touchStartPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (this.gestureType === 'pending' && dist > TAP_MOVE_THRESHOLD) {
      // Promote pending gesture
      if (this.touchTargetNode) {
        this.gestureType = 'drag';
        const synth = this.createSyntheticMouseEvent(touch);

        // Select the node if not already selected
        if (!this._host.selectedNodeIds.has(this.touchTargetNode.id)) {
          this.selectionController.clearSelection();
          this.selectionController.selectNode(this.touchTargetNode.id, false);
        }

        this.dragController.startDrag(this.touchTargetNode, synth);
      } else {
        this.gestureType = 'pan';
        const startSynth = this.createSyntheticMouseEvent(
          // Use the original start position for startPan
          { clientX: this.touchStartPos.x, clientY: this.touchStartPos.y } as Touch
        );
        this.viewportController.startPan(startSynth);
      }
    }

    if (this.gestureType === 'drag') {
      this.dragController.handleDrag(this.createSyntheticMouseEvent(touch));
    } else if (this.gestureType === 'pan') {
      this.viewportController.handlePanDrag(this.createSyntheticMouseEvent(touch));
    }
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    if (this._host.disabled) return;
    if (this.gestureType === 'none') return;
    e.preventDefault();

    // Remove ended touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      this.activeTouches.delete(e.changedTouches[i].identifier);
    }

    const remaining = this.activeTouches.size;

    // Pinch ended — transition to pan if 1 finger remains
    if (this.gestureType === 'pinch') {
      if (remaining === 1) {
        this.gestureType = 'pan';
        const touch = Array.from(this.activeTouches.values())[0];
        this.viewportController.startPan(this.createSyntheticMouseEvent(touch));
      } else if (remaining === 0) {
        this.resetGesture();
      }
      return;
    }

    // Only process end if all fingers are lifted
    if (remaining > 0) return;

    const touch = e.changedTouches[0];
    const now = Date.now();

    if (this.gestureType === 'pan') {
      this.viewportController.stopPan();
    } else if (this.gestureType === 'drag') {
      this.dragController.stopDrag();
    } else if (this.gestureType === 'pending' && this.touchStartPos) {
      // It was a tap (didn't move enough to promote)
      const isDoubleTap = this.isDoubleTap(touch.clientX, touch.clientY, now);

      if (isDoubleTap && this.touchTargetNode) {
        // Double-tap on node — dispatch dblclick event
        const nodeEl = this.findNodeElementFromTouch(touch);
        if (nodeEl) {
          nodeEl.dispatchEvent(new CustomEvent('node-dblclick', {
            detail: { node: this.touchTargetNode },
            bubbles: true,
            composed: true,
          }));
        }
      } else if (this.touchTargetNode) {
        // Single tap on node — select it
        this.selectionController.clearSelection();
        this.selectionController.selectNode(this.touchTargetNode.id, false);
        this._host.dispatchNodeSelected(this.touchTargetNode);
      } else {
        // Tap on background — clear selection
        this.selectionController.clearSelection();
      }

      this.lastTapTime = now;
      this.lastTapPosition = { x: touch.clientX, y: touch.clientY };
    }

    this.resetGesture();
  };

  // ===== PINCH HANDLING =====

  private handlePinchMove(): void {
    const touches = Array.from(this.activeTouches.values());
    if (touches.length < 2) return;

    const currentDistance = this.getDistance(touches[0], touches[1]);
    if (this.initialPinchDistance === 0) return;

    const scale = currentDistance / this.initialPinchDistance;
    const newZoom = this.initialPinchZoom * scale;

    const mid = this.getMidpoint(touches[0], touches[1]);
    this.viewportController.setZoomAtPoint(newZoom, mid.clientX, mid.clientY);
  }

  // ===== HELPERS =====

  /**
   * Check if a touch event targets a UI overlay element (toolbar, sidebar, etc.)
   * that should receive normal browser touch/click handling.
   */
  private isTouchOnUIOverlay(e: TouchEvent): boolean {
    const path = e.composedPath();
    for (const el of path) {
      if (el === this.canvasWrapper) break; // stop at wrapper boundary
      if (el instanceof HTMLElement) {
        for (const cls of UI_OVERLAY_CLASSES) {
          if (el.classList.contains(cls)) return true;
        }
      }
    }
    return false;
  }

  private createSyntheticMouseEvent(touch: Touch | { clientX: number; clientY: number }): MouseEvent {
    return new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY,
      button: 0,
      bubbles: true,
    });
  }

  private getDistance(t1: Touch, t2: Touch): number {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getMidpoint(t1: Touch, t2: Touch): { clientX: number; clientY: number } {
    return {
      clientX: (t1.clientX + t2.clientX) / 2,
      clientY: (t1.clientY + t2.clientY) / 2,
    };
  }

  private findNodeFromTouch(e: TouchEvent): WorkflowNode | null {
    const path = e.composedPath();
    for (const el of path) {
      if (el instanceof HTMLElement && el.dataset.nodeId) {
        return this._host.workflow.nodes.find(n => n.id === el.dataset.nodeId) || null;
      }
    }
    return null;
  }

  private findNodeElementFromTouch(_touch: Touch): HTMLElement | null {
    const host = this._host as unknown as HTMLElement;
    if (!host.shadowRoot) return null;
    const nodeId = this.touchTargetNode?.id;
    if (!nodeId) return null;
    return host.shadowRoot.querySelector(`whiteboard-node[data-node-id="${nodeId}"]`) as HTMLElement | null;
  }

  private isDoubleTap(x: number, y: number, now: number): boolean {
    const dt = now - this.lastTapTime;
    const dx = x - this.lastTapPosition.x;
    const dy = y - this.lastTapPosition.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dt < DOUBLE_TAP_THRESHOLD && dist < DOUBLE_TAP_DISTANCE;
  }

  private resetGesture(): void {
    this.gestureType = 'none';
    this.touchTargetNode = null;
    this.touchStartPos = null;
    this.initialPinchDistance = 0;
    this.initialPinchZoom = 1;
  }
}
