/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement, html } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  NodeType,
  Position,
  CanvasMode,
  CanvasType,
  ExecutionStatus,
  createNodeFromTemplate,
} from './workflow-canvas.types.js';
import { styles } from './workflow-canvas.style.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import './workflow-node.component.js';
import '../icon/icon.component.js';
import '../input/input.component.js';
import '../chatbot/chatbot.component.js';

// Controllers
import {
  ViewportController,
  SelectionController,
  ConnectionController,
  KeyboardController,
  DragController,
  ConfigController,
} from './controllers/index.js';

// Templates
import {
  renderToolbarTemplate,
  renderZoomControlsTemplate,
  renderPaletteTemplate,
  renderContextMenuTemplate,
  renderEmptyStateTemplate,
  renderConfigPanelTemplate,
  renderEdgesTemplate,
  renderPendingDiffPanel,
  renderDiffLegend,
} from './templates/index.js';

// Interfaces
import type { ConnectionState, DragState, CanvasHost, CanvasViewport } from './interfaces/index.js';

// Schema Diff
import {
  type SchemaDiff,
  type SchemaSnapshot,
  type SchemaChange,
  type PendingDiff,
  type PendingSchemaChange,
  type PendingChangeStatus,
  type ApplyDiffResult,
  type ApplyDiffOptions,
  type DiffOptions,
  type DiffDisplayMode,
  type EntityDiffState,
  type SchemaDiffChangedEvent,
  type SchemaDiffSavedEvent,
  type SchemaDiffRevertedEvent,
  type DiffLoadedEvent,
  type DiffAppliedEvent,
  type ChangeStatusUpdatedEvent,
  type PropertyChange,
  captureSnapshot,
  snapshotToSchema,
  calculateSchemaDiff,
  createEmptyDiff,
  getEntityDiffState,
  deepClone,
  DEFAULT_DIFF_OPTIONS,
} from './schema-diff/index.js';

/**
 * Workflow canvas component for visual workflow editing
 *
 * @element workflow-canvas
 * @fires workflow-changed - When workflow is modified
 * @fires node-selected - When a node is selected
 * @fires node-configured - When a node configuration is requested
 * @fires schema-diff-changed - When schema changes vs baseline
 * @fires schema-diff-saved - When changes are marked as saved
 * @fires schema-diff-reverted - When changes are reverted to baseline
 * @fires diff-loaded - When a diff is loaded for review
 * @fires diff-applied - When diff changes are applied
 * @fires change-status-updated - When a change's accept/reject status changes
 */
@customElement('workflow-canvas')
export class WorkflowCanvasElement extends NuralyUIBaseMixin(LitElement) {
  static override styles = styles;

  private _workflow: Workflow = {
    id: '',
    name: 'New Workflow',
    nodes: [],
    edges: [],
  };

  /** Baseline snapshot for diff calculation */
  private _baselineSnapshot: SchemaSnapshot | null = null;

  @property({ type: Object })
  get workflow(): Workflow {
    return this._workflow;
  }

  set workflow(value: Workflow) {
    const oldValue = this._workflow;
    const isNewSchema = !oldValue || oldValue.id !== value.id;

    // Normalize node status values to uppercase
    this._workflow = {
      ...value,
      nodes: value.nodes.map(node => ({
        ...node,
        status: node.status
          ? (node.status.toUpperCase() as ExecutionStatus)
          : undefined,
      })),
    };
    this.requestUpdate('workflow', oldValue);

    // Capture baseline snapshot when loading a new schema
    if (isNewSchema) {
      this._baselineSnapshot = captureSnapshot(this._workflow);
    }

    // Restore viewport from workflow if available and this is a new workflow
    if (value.viewport && isNewSchema) {
      this.viewport = value.viewport;
      // Update the CSS transform after the component renders
      this.updateComplete.then(() => {
        this.viewportController?.updateTransform();
      });
    }
  }

  @property({ type: Boolean })
  readonly = false;

  @property({ type: Boolean })
  showMinimap = true;

  @property({ type: Boolean })
  showToolbar = true;

  @property({ type: Boolean })
  showPalette = false;

  @property({ type: String })
  canvasType: CanvasType = CanvasType.WORKFLOW;

  /**
   * Map of node IDs to their current execution status
   * Used to show real-time execution progress on nodes
   */
  @property({ type: Object })
  nodeStatuses: Record<string, 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'> = {};

  /** Enable/disable schema diff event emission */
  @property({ type: Boolean })
  emitDiffEvents = false;

  /** Current diff display mode */
  @property({ type: String })
  diffDisplayMode: DiffDisplayMode = 'none';

  @state()
  private viewport: CanvasViewport = { zoom: 1, panX: 0, panY: 0 };

  @state()
  private mode: CanvasMode = CanvasMode.SELECT;

  @state()
  private selectedNodeIds: Set<string> = new Set();

  @state()
  private selectedEdgeIds: Set<string> = new Set();

  @state()
  private connectionState: ConnectionState | null = null;

  @state()
  private dragState: DragState | null = null;

  @state()
  private contextMenu: { x: number; y: number; type: 'canvas' | 'node' | 'edge'; target?: string } | null = null;

  @state()
  private isPanning = false;

  @state()
  private expandedCategories: Set<string> = new Set([
    'trigger', 'control', 'action', 'data', 'agent',
    'db-tables-views', 'db-relations-constraints', 'db-indexes-queries'
  ]);

  @state()
  private configuredNode: WorkflowNode | null = null;

  @state()
  private hoveredEdgeId: string | null = null;

  @state()
  private previewNodeId: string | null = null;

  /** Currently loaded pending diff for interactive application */
  @state()
  private _pendingDiff: PendingDiff | null = null;

  /** Expanded change IDs in the pending diff panel */
  @state()
  private _expandedChangeIds: Set<string> = new Set();

  /** Applied diff for visualization (can be from internal changes or external) */
  @state()
  private _appliedDiff: SchemaDiff | null = null;

  @query('.canvas-wrapper')
  canvasWrapper!: HTMLElement;

  @query('.canvas-viewport')
  canvasViewport!: HTMLElement;

  @query('.config-panel')
  configPanel!: HTMLElement;

  // Controllers - initialized in constructor
  private viewportController!: ViewportController;
  private selectionController!: SelectionController;
  private connectionController!: ConnectionController;
  private dragController!: DragController;
  private configController!: ConfigController;

  constructor() {
    super();
    // Initialize controllers - they will add themselves via addController
    this.viewportController = new ViewportController(this as unknown as CanvasHost & LitElement);
    this.selectionController = new SelectionController(this as unknown as CanvasHost & LitElement);
    this.connectionController = new ConnectionController(this as unknown as CanvasHost & LitElement);
    this.configController = new ConfigController(this as unknown as CanvasHost & LitElement);
    // KeyboardController adds itself via addController, no need to store reference
    new KeyboardController(
      this as unknown as CanvasHost & LitElement,
      this.selectionController
    );
    this.dragController = new DragController(
      this as unknown as CanvasHost & LitElement,
      this.viewportController
    );
  }

  // CanvasHost interface methods for controllers
  setWorkflow(workflow: Workflow): void {
    this.workflow = workflow;
  }

  override async connectedCallback() {
    super.connectedCallback();
    // Note: Keyboard and wheel events are now handled by controllers
    window.addEventListener('mouseup', this.handleGlobalMouseUp);
    window.addEventListener('mousemove', this.handleGlobalMouseMove);
    await this.updateComplete;
    this.viewportController.updateTransform();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mouseup', this.handleGlobalMouseUp);
    window.removeEventListener('mousemove', this.handleGlobalMouseMove);
  }

  // Note: Keyboard handling is now in KeyboardController

  private handleGlobalMouseUp = () => {
    this.dragController.stopDrag();
    this.viewportController.stopPan();
    this.connectionController.cancelConnection();
  };

  private handleGlobalMouseMove = (e: MouseEvent) => {
    if (this.dragState) {
      this.dragController.handleDrag(e);
    }
    if (this.isPanning) {
      this.viewportController.handlePanDrag(e);
    }
    if (this.connectionState) {
      this.connectionController.updateConnectionPosition(e);
    }
  };

  private handleCanvasMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isCanvasBackground = target.classList.contains('canvas-grid') || target.classList.contains('canvas-wrapper');

    if (e.button === 1) {
      // Middle click for panning
      e.preventDefault();
      this.viewportController.startPan(e);
    } else if (e.button === 0 && isCanvasBackground) {
      // Left click on empty canvas - start panning (like n8n)
      e.preventDefault();
      this.viewportController.startPan(e);
      this.selectionController.clearSelection();
    }
  };

  private handleCanvasContextMenu = (e: MouseEvent) => {
    e.preventDefault();

    // Check if a node is selected - if so, show node context menu
    const menuType = this.selectedNodeIds.size > 0 ? 'node' : 'canvas';

    this.contextMenu = {
      x: e.clientX,
      y: e.clientY,
      type: menuType,
    };
  };

  // Note: Wheel/pan/zoom handling is now in ViewportController

  private handleNodeMouseDown(e: CustomEvent) {
    const { node, event } = e.detail;

    if (!event.shiftKey) {
      if (!this.selectedNodeIds.has(node.id)) {
        this.selectionController.clearSelection();
      }
    }

    this.selectionController.selectNode(node.id, event.shiftKey);

    // Update config panel if it's open
    if (this.configuredNode) {
      this.configuredNode = node;
    }

    // Start dragging
    this.dragController.startDrag(node, event);

    this.dispatchNodeSelected(node);
  }

  // Note: Node drag handling is now in DragController

  private handleNodeDblClick(e: CustomEvent) {
    const { node } = e.detail;
    // Open configuration panel
    this.configuredNode = node;
    this.dispatchEvent(new CustomEvent('node-configured', {
      detail: { node },
      bubbles: true,
      composed: true,
    }));
  }

  private handleNodePreview(e: CustomEvent) {
    const { node } = e.detail;
    // Toggle preview panel - close if same node, open if different
    if (this.previewNodeId === node.id) {
      this.previewNodeId = null;
    } else {
      this.previewNodeId = node.id;
    }
  }

  private handleNodeTrigger(e: CustomEvent) {
    const { node } = e.detail;
    console.log('[Canvas] Node trigger clicked:', node.name, node.type);
    // Bubble up the trigger event for workflow execution
    this.dispatchEvent(new CustomEvent('workflow-trigger', {
      detail: { node },
      bubbles: true,
      composed: true,
    }));
  }

  private closePreviewPanel() {
    this.previewNodeId = null;
  }

  /**
   * Get the current preview node from workflow (live position)
   */
  private getPreviewNode(): WorkflowNode | null {
    if (!this.previewNodeId) return null;
    return this.workflow.nodes.find(n => n.id === this.previewNodeId) || null;
  }

  /**
   * Calculate preview panel position to the LEFT of the preview node
   */
  private getPreviewPanelPosition(): { x: number; y: number } | null {
    const previewNode = this.getPreviewNode();
    if (!previewNode) return null;

    const previewPanelWidth = 420;
    const panelOffset = 20;

    return {
      x: (previewNode.position.x - previewPanelWidth - panelOffset) * this.viewport.zoom + this.viewport.panX,
      y: previewNode.position.y * this.viewport.zoom + this.viewport.panY,
    };
  }

  private handlePortMouseDown(e: CustomEvent) {
    const { node, port, isInput, event } = e.detail;
    this.connectionController.startConnection(node, port, isInput, event);
  }

  private handlePortMouseUp(e: CustomEvent) {
    const { node, port, isInput } = e.detail;
    this.connectionController.completeConnection(node, port, isInput);
  }

  // Note: Connection line update is now in ConnectionController

  private handleEdgeClick(e: MouseEvent, edge: WorkflowEdge) {
    e.stopPropagation();
    this.selectionController.selectEdge(edge.id, e.shiftKey);
  }

  // Note: Selection methods are now in SelectionController

  private addNode(type: NodeType, position?: Position) {
    if (this.readonly) return;

    const pos = position || {
      x: (-this.viewport.panX + 400) / this.viewport.zoom,
      y: (-this.viewport.panY + 200) / this.viewport.zoom,
    };

    const newNode = createNodeFromTemplate(type, pos);
    if (newNode) {
      this.workflow = {
        ...this.workflow,
        nodes: [...this.workflow.nodes, newNode],
      };
      this.dispatchWorkflowChanged();
    }
  }

  private handlePaletteItemDrag(e: DragEvent, type: NodeType) {
    e.dataTransfer?.setData('application/workflow-node-type', type);
  }

  private handleCanvasDrop = (e: DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer?.getData('application/workflow-node-type') as NodeType;
    if (!type) return;

    const rect = this.canvasWrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left - this.viewport.panX) / this.viewport.zoom;
    const y = (e.clientY - rect.top - this.viewport.panY) / this.viewport.zoom;

    this.addNode(type, { x: Math.round(x / 20) * 20, y: Math.round(y / 20) * 20 });
  };

  private handleCanvasDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer!.dropEffect = 'copy';
  };

  // Note: Zoom methods are now in ViewportController

  private togglePalette() {
    this.showPalette = !this.showPalette;
  }

  private toggleCategory(categoryId: string) {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
    this.expandedCategories = new Set(this.expandedCategories);
  }

  private dispatchWorkflowChanged() {
    this.dispatchEvent(new CustomEvent('workflow-changed', {
      detail: { workflow: this.workflow },
      bubbles: true,
      composed: true,
    }));

    // Emit diff event if enabled
    if (this.emitDiffEvents && this._baselineSnapshot) {
      this.emitDiffChanged();
    }
  }

  // Required by CanvasHost interface - called by ViewportController
  dispatchViewportChanged() {
    this.dispatchEvent(new CustomEvent('viewport-changed', {
      detail: { viewport: this.viewport },
      bubbles: true,
      composed: true,
    }));
  }

  private dispatchNodeSelected(node: WorkflowNode) {
    this.dispatchEvent(new CustomEvent('node-selected', {
      detail: { node },
      bubbles: true,
      composed: true,
    }));
  }

  // ─────────────────────────────────────────────────────────────
  // SCHEMA DIFF - Public API
  // ─────────────────────────────────────────────────────────────

  /**
   * Get current diff from baseline
   */
  getSchemaDiff(options?: Partial<DiffOptions>): SchemaDiff {
    if (!this._baselineSnapshot) {
      return createEmptyDiff(this.workflow.id, this.workflow.version);
    }
    const currentSnapshot = captureSnapshot(this.workflow);
    return calculateSchemaDiff(
      this._baselineSnapshot,
      currentSnapshot,
      { ...DEFAULT_DIFF_OPTIONS, ...options }
    );
  }

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges(): boolean {
    return this.getSchemaDiff().hasChanges;
  }

  /**
   * Get count of changes
   */
  getChangeCount(): number {
    return this.getSchemaDiff().summary.totalChanges;
  }

  /**
   * Get the baseline snapshot
   */
  getBaselineSnapshot(): SchemaSnapshot | null {
    return this._baselineSnapshot ? { ...this._baselineSnapshot } : null;
  }

  /**
   * Mark current state as saved - updates baseline to current
   */
  markAsSaved(): void {
    const savedDiff = this.getSchemaDiff();
    const newBaseline = captureSnapshot(this.workflow);

    this._baselineSnapshot = newBaseline;

    if (this.emitDiffEvents) {
      this.emitDiffSaved(savedDiff, newBaseline);
    }

    // Clear pending diff if all changes applied
    if (this._pendingDiff) {
      this.clearPendingDiff();
    }
  }

  /**
   * Alias for markAsSaved
   */
  commitChanges(): void {
    this.markAsSaved();
  }

  /**
   * Revert to baseline snapshot
   */
  revertToBaseline(): void {
    if (!this._baselineSnapshot) return;

    const discardedDiff = this.getSchemaDiff();

    // Restore workflow to baseline (preserving positions from current)
    const restoredSchema = snapshotToSchema(this._baselineSnapshot);

    // Merge with current positions
    const positionMap = new Map(
      this.workflow.nodes.map(n => [n.id, n.position])
    );

    restoredSchema.nodes = restoredSchema.nodes.map(node => ({
      ...node,
      position: positionMap.get(node.id) || node.position || { x: 100, y: 100 },
    }));

    this.workflow = restoredSchema;

    if (this.emitDiffEvents) {
      this.emitDiffReverted(discardedDiff, this._baselineSnapshot);
    }

    this.dispatchWorkflowChanged();
  }

  /**
   * Reset baseline to current state
   */
  resetBaseline(): void {
    this._baselineSnapshot = captureSnapshot(this.workflow);

    if (this.emitDiffEvents) {
      this.emitDiffChanged();
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SCHEMA DIFF - Load External Diff (Interactive)
  // ─────────────────────────────────────────────────────────────

  /**
   * Load a diff for interactive review and application
   */
  loadDiff(
    diff: SchemaDiff,
    source: PendingDiff['source'] = 'external',
    sourceDescription?: string
  ): PendingDiff {
    this._pendingDiff = {
      id: `diff_${Date.now()}`,
      source,
      sourceDescription,
      loadedAt: new Date().toISOString(),
      changes: diff.changes.map(c => ({
        ...c,
        status: 'pending' as PendingChangeStatus,
      })),
      summary: {
        total: diff.changes.length,
        pending: diff.changes.length,
        accepted: 0,
        rejected: 0,
        applied: 0,
      },
    };

    // Show visualization
    this._appliedDiff = diff;
    this.diffDisplayMode = 'full';

    // Emit event
    this.dispatchEvent(new CustomEvent<DiffLoadedEvent>('diff-loaded', {
      detail: { pendingDiff: this._pendingDiff },
      bubbles: true,
      composed: true,
    }));

    return this._pendingDiff;
  }

  /**
   * Get currently loaded pending diff
   */
  getPendingDiff(): PendingDiff | null {
    return this._pendingDiff;
  }

  /**
   * Check if there's a pending diff loaded
   */
  hasPendingDiff(): boolean {
    return this._pendingDiff !== null;
  }

  // ─────────────────────────────────────────────────────────────
  // SCHEMA DIFF - Change Status Management
  // ─────────────────────────────────────────────────────────────

  /**
   * Accept a specific change
   */
  acceptChange(changeId: string): void {
    this.updateChangeStatus(changeId, 'accepted');
  }

  /**
   * Reject a specific change
   */
  rejectChange(changeId: string, reason?: string): void {
    this.updateChangeStatus(changeId, 'rejected', reason);
  }

  /**
   * Accept all pending changes
   */
  acceptAllChanges(): void {
    if (!this._pendingDiff) return;

    this._pendingDiff.changes
      .filter(c => c.status === 'pending')
      .forEach(c => this.updateChangeStatus(c.changeId, 'accepted'));
  }

  /**
   * Reject all pending changes
   */
  rejectAllChanges(): void {
    if (!this._pendingDiff) return;

    this._pendingDiff.changes
      .filter(c => c.status === 'pending')
      .forEach(c => this.updateChangeStatus(c.changeId, 'rejected'));
  }

  /**
   * Reset change status to pending
   */
  resetChangeStatus(changeId: string): void {
    this.updateChangeStatus(changeId, 'pending');
  }

  private updateChangeStatus(
    changeId: string,
    status: PendingChangeStatus,
    reason?: string
  ): void {
    if (!this._pendingDiff) return;

    const change = this._pendingDiff.changes.find(c => c.changeId === changeId);
    if (!change) return;

    const oldStatus = change.status;
    change.status = status;
    if (reason) change.rejectedReason = reason;

    this.updatePendingSummary();

    this.dispatchEvent(new CustomEvent<ChangeStatusUpdatedEvent>('change-status-updated', {
      detail: { changeId, oldStatus, newStatus: status },
      bubbles: true,
      composed: true,
    }));

    this.requestUpdate();
  }

  private updatePendingSummary(): void {
    if (!this._pendingDiff) return;

    const changes = this._pendingDiff.changes;
    this._pendingDiff.summary = {
      total: changes.length,
      pending: changes.filter(c => c.status === 'pending').length,
      accepted: changes.filter(c => c.status === 'accepted').length,
      rejected: changes.filter(c => c.status === 'rejected').length,
      applied: changes.filter(c => c.status === 'applied').length,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // SCHEMA DIFF - Apply Changes
  // ─────────────────────────────────────────────────────────────

  /**
   * Apply accepted changes to the schema
   */
  applyAcceptedChanges(): ApplyDiffResult {
    return this.applyDiff({ acceptedOnly: true });
  }

  /**
   * Apply all pending changes (skip rejected)
   */
  applyAllChanges(): ApplyDiffResult {
    return this.applyDiff({ acceptedOnly: false });
  }

  /**
   * Apply specific changes by ID
   */
  applyChanges(changeIds: string[]): ApplyDiffResult {
    return this.applyDiff({ changeIds });
  }

  /**
   * Apply a single change
   */
  applySingleChange(changeId: string): ApplyDiffResult {
    return this.applyDiff({ changeIds: [changeId] });
  }

  /**
   * Core apply logic
   */
  applyDiff(options: ApplyDiffOptions = {}): ApplyDiffResult {
    if (!this._pendingDiff) {
      return {
        success: false,
        appliedChanges: [],
        failedChanges: [],
        skippedChanges: [],
        newSchema: this.workflow,
      };
    }

    const result: ApplyDiffResult = {
      success: true,
      appliedChanges: [],
      failedChanges: [],
      skippedChanges: [],
      newSchema: this.workflow,
    };

    // Determine which changes to apply
    const changesToApply = this._pendingDiff.changes.filter(c => {
      if (c.status === 'applied') return false;
      if (c.status === 'rejected') return false;
      if (options.changeIds && !options.changeIds.includes(c.changeId)) return false;
      if (options.acceptedOnly && c.status !== 'accepted') return false;
      return true;
    });

    // Apply each change
    let updatedSchema = deepClone(this.workflow);

    for (const change of changesToApply) {
      try {
        updatedSchema = this.applySchemaChange(updatedSchema, change);
        change.status = 'applied';
        change.appliedAt = new Date().toISOString();
        result.appliedChanges.push(change);
      } catch (error) {
        result.failedChanges.push({
          change,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        result.success = false;
      }
    }

    // Update schema if any changes applied
    if (result.appliedChanges.length > 0) {
      this.workflow = updatedSchema;
      result.newSchema = updatedSchema;
      this.dispatchWorkflowChanged();
    }

    this.updatePendingSummary();

    this.dispatchEvent(new CustomEvent<DiffAppliedEvent>('diff-applied', {
      detail: { result, pendingDiff: this._pendingDiff },
      bubbles: true,
      composed: true,
    }));

    // Clear visualization if all applied
    if (
      this._pendingDiff.summary.pending === 0 &&
      this._pendingDiff.summary.accepted === 0
    ) {
      this.clearDiffVisualization();
    }

    return result;
  }

  /**
   * Apply a single change to schema
   */
  private applySchemaChange(schema: Workflow, change: SchemaChange): Workflow {
    switch (change.changeType) {
      case 'ADD':
        return this.applyAddChange(schema, change);
      case 'REMOVE':
        return this.applyRemoveChange(schema, change);
      case 'MODIFY':
      case 'RENAME':
        return this.applyModifyChange(schema, change);
      default:
        throw new Error(`Unknown change type: ${change.changeType}`);
    }
  }

  private applyAddChange(schema: Workflow, change: SchemaChange): Workflow {
    if (change.entityType === 'FOREIGN_KEY') {
      return {
        ...schema,
        edges: [...schema.edges, change.added as WorkflowEdge],
      };
    } else {
      const newNode = change.added as WorkflowNode;
      // Ensure position is set
      if (!newNode.position) {
        newNode.position = { x: 100, y: 100 };
      }
      return {
        ...schema,
        nodes: [...schema.nodes, newNode],
      };
    }
  }

  private applyRemoveChange(schema: Workflow, change: SchemaChange): Workflow {
    if (change.entityType === 'FOREIGN_KEY') {
      return {
        ...schema,
        edges: schema.edges.filter(e => e.id !== change.entityId),
      };
    } else {
      return {
        ...schema,
        nodes: schema.nodes.filter(n => n.id !== change.entityId),
      };
    }
  }

  private applyModifyChange(schema: Workflow, change: SchemaChange): Workflow {
    if (!change.propertyChanges?.length) return schema;

    const nodeIndex = schema.nodes.findIndex(n => n.id === change.entityId);
    if (nodeIndex === -1) return schema;

    const updatedNode = deepClone(schema.nodes[nodeIndex]);

    // Apply each property change
    for (const propChange of change.propertyChanges) {
      this.applyPropertyChange(updatedNode, propChange);
    }

    const newNodes = [...schema.nodes];
    newNodes[nodeIndex] = updatedNode;

    return { ...schema, nodes: newNodes };
  }

  private applyPropertyChange(node: WorkflowNode, change: PropertyChange): void {
    const pathParts = this.parsePath(change.path);
    let current: unknown = node;

    // Navigate to parent of target property
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (typeof part === 'number') {
        current = (current as unknown[])[part];
      } else {
        current = (current as Record<string, unknown>)[part];
      }
    }

    // Apply change to final property
    const lastPart = pathParts[pathParts.length - 1];

    if (typeof lastPart === 'number') {
      const arr = current as unknown[];
      switch (change.changeType) {
        case 'ADD':
          arr.splice(lastPart, 0, change.after);
          break;
        case 'REMOVE':
          arr.splice(lastPart, 1);
          break;
        case 'MODIFY':
          arr[lastPart] = change.after;
          break;
      }
    } else {
      const obj = current as Record<string, unknown>;
      switch (change.changeType) {
        case 'ADD':
        case 'MODIFY':
          obj[lastPart] = change.after;
          break;
        case 'REMOVE':
          delete obj[lastPart];
          break;
      }
    }
  }

  private parsePath(path: string): (string | number)[] {
    const parts: (string | number)[] = [];
    const regex = /([^.\[\]]+)|\[(\d+)\]/g;
    let match;

    while ((match = regex.exec(path)) !== null) {
      if (match[1] !== undefined) {
        parts.push(match[1]);
      } else if (match[2] !== undefined) {
        parts.push(parseInt(match[2], 10));
      }
    }

    return parts;
  }

  // ─────────────────────────────────────────────────────────────
  // SCHEMA DIFF - Clear / Cancel
  // ─────────────────────────────────────────────────────────────

  /**
   * Clear pending diff without applying
   */
  clearPendingDiff(): void {
    this._pendingDiff = null;
    this._expandedChangeIds = new Set();
    this.clearDiffVisualization();
  }

  /**
   * Cancel and discard all pending changes
   */
  cancelPendingChanges(): void {
    this.clearPendingDiff();
  }

  /**
   * Apply diff visualization without pending diff
   */
  applyDiffVisualization(diff: SchemaDiff): void {
    this._appliedDiff = diff;
    this.diffDisplayMode = 'full';
    this.requestUpdate();
  }

  /**
   * Clear diff visualization
   */
  clearDiffVisualization(): void {
    this._appliedDiff = null;
    this.diffDisplayMode = 'none';
    this.requestUpdate();
  }

  /**
   * Get currently visualized diff
   */
  getAppliedDiff(): SchemaDiff | null {
    return this._appliedDiff;
  }

  /**
   * Toggle diff visualization
   */
  toggleDiffVisualization(show?: boolean): void {
    if (show === undefined) {
      this.diffDisplayMode = this.diffDisplayMode === 'none' ? 'full' : 'none';
    } else {
      this.diffDisplayMode = show ? 'full' : 'none';
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SCHEMA DIFF - Event Emitters
  // ─────────────────────────────────────────────────────────────

  private emitDiffChanged(latestChange?: SchemaChange): void {
    const diff = this.getSchemaDiff();

    this.dispatchEvent(new CustomEvent<SchemaDiffChangedEvent>('schema-diff-changed', {
      detail: {
        diff,
        changeCount: diff.summary.totalChanges,
        hasUnsavedChanges: diff.hasChanges,
        latestChange,
      },
      bubbles: true,
      composed: true,
    }));
  }

  private emitDiffSaved(savedDiff: SchemaDiff, newBaseline: SchemaSnapshot): void {
    this.dispatchEvent(new CustomEvent<SchemaDiffSavedEvent>('schema-diff-saved', {
      detail: {
        savedDiff,
        newBaseline,
        savedAt: new Date().toISOString(),
      },
      bubbles: true,
      composed: true,
    }));
  }

  private emitDiffReverted(discardedDiff: SchemaDiff, restoredSnapshot: SchemaSnapshot): void {
    this.dispatchEvent(new CustomEvent<SchemaDiffRevertedEvent>('schema-diff-reverted', {
      detail: {
        discardedDiff,
        restoredSnapshot,
      },
      bubbles: true,
      composed: true,
    }));
  }

  // ─────────────────────────────────────────────────────────────
  // SCHEMA DIFF - Helpers
  // ─────────────────────────────────────────────────────────────

  /**
   * Get diff state for an entity (for visualization)
   */
  getEntityDiffStateForNode(nodeId: string): EntityDiffState {
    return getEntityDiffState(this._appliedDiff, nodeId);
  }

  /**
   * Toggle expanded state for a change in the pending diff panel
   */
  private toggleChangeExpanded(changeId: string): void {
    if (this._expandedChangeIds.has(changeId)) {
      this._expandedChangeIds.delete(changeId);
    } else {
      this._expandedChangeIds.add(changeId);
    }
    this._expandedChangeIds = new Set(this._expandedChangeIds);
  }

  // Note: Port position calculation is now in ConnectionController
  private getPortPosition(node: WorkflowNode, portId: string, isInput: boolean): Position {
    return this.connectionController.getPortPosition(node, portId, isInput);
  }

  /**
   * Get nodes with execution statuses applied from nodeStatuses map
   * This ensures edges can derive their status from connected nodes
   */
  private getNodesWithStatuses(): WorkflowNode[] {
    return this.workflow.nodes.map(node =>
      this.nodeStatuses[node.id]
        ? { ...node, status: this.nodeStatuses[node.id].toUpperCase() as ExecutionStatus }
        : node
    );
  }

  // Note: Edge rendering is now in edges.template.ts
  private renderEdges() {
    return renderEdgesTemplate({
      edges: this.workflow.edges,
      nodes: this.getNodesWithStatuses(),
      selectedEdgeIds: this.selectedEdgeIds,
      hoveredEdgeId: this.hoveredEdgeId,
      connectionState: this.connectionState,
      currentTheme: this.currentTheme,
      callbacks: {
        onEdgeClick: (e, edge) => this.handleEdgeClick(e, edge),
        onEdgeHover: (edgeId) => this.connectionController.setHoveredEdge(edgeId),
        getPortPosition: (node, portId, isInput) => this.getPortPosition(node, portId, isInput),
      },
    });
  }

  private renderToolbar() {
    return renderToolbarTemplate({
      showToolbar: this.showToolbar,
      mode: this.mode,
      showPalette: this.showPalette,
      hasSelection: this.selectedNodeIds.size > 0 || this.selectedEdgeIds.size > 0,
      hasSingleSelection: this.selectedNodeIds.size === 1,
      onModeChange: (mode) => { this.mode = mode; },
      onTogglePalette: () => this.togglePalette(),
      onZoomIn: () => this.viewportController.zoomIn(),
      onZoomOut: () => this.viewportController.zoomOut(),
      onResetView: () => this.viewportController.resetView(),
      onOpenConfig: () => this.selectionController.openConfigForSelected(),
      onDelete: () => this.selectionController.deleteSelected(),
    });
  }

  private renderZoomControls() {
    return renderZoomControlsTemplate({
      zoomPercentage: this.viewportController.getZoomPercentage(),
      onZoomIn: () => this.viewportController.zoomIn(),
      onZoomOut: () => this.viewportController.zoomOut(),
    });
  }

  private renderPalette() {
    return renderPaletteTemplate({
      showPalette: this.showPalette,
      expandedCategories: this.expandedCategories,
      canvasType: this.canvasType,
      onClose: () => { this.showPalette = false; },
      onToggleCategory: (categoryId) => this.toggleCategory(categoryId),
      onNodeDragStart: (e, type) => this.handlePaletteItemDrag(e, type),
      onNodeDoubleClick: (type) => this.addNode(type),
    });
  }

  private renderContextMenu() {
    return renderContextMenuTemplate({
      contextMenu: this.contextMenu,
      onClose: () => { this.contextMenu = null; },
      onAddNode: () => this.togglePalette(),
      onSelectAll: () => this.selectionController.selectAll(),
      onResetView: () => this.viewportController.resetView(),
      onConfigure: () => this.selectionController.openConfigForSelected(),
      onDuplicate: () => this.selectionController.duplicateSelected(),
      onDelete: () => this.selectionController.deleteSelected(),
    });
  }

  private renderEmptyState() {
    return renderEmptyStateTemplate({
      hasNodes: this.workflow.nodes.length > 0,
    });
  }

  // Note: Config panel methods are now in ConfigController and config-panel.template.ts
  private renderConfigPanel() {
    return renderConfigPanelTemplate({
      node: this.configuredNode,
      position: this.configController.getPanelPosition(),
      callbacks: {
        onClose: () => this.configController.closeConfig(),
        onUpdateName: (name) => this.configController.updateName(name),
        onUpdateDescription: (desc) => this.configController.updateDescription(desc),
        onUpdateConfig: (key, value) => this.configController.updateConfig(key, value),
      },
    });
  }

  private renderChatbotPreview() {
    const previewNode = this.getPreviewNode();
    const position = this.getPreviewPanelPosition();
    if (!previewNode || !position) return html``;

    const config = previewNode.configuration || {};
    const rawSuggestions = (config.suggestions as Array<{id?: string; text?: string}>) || [];
    const suggestions = rawSuggestions.map((s, i) => ({
      id: s.id || String(i),
      text: s.text || '',
    }));

    const panelStyle = {
      left: `${position.x}px`,
      top: `${position.y}px`,
    };

    return html`
      <div class="chatbot-preview-panel" style=${styleMap(panelStyle)} data-theme=${this.currentTheme}>
        <div class="chatbot-preview-header">
          <div class="chatbot-preview-title">
            <nr-icon name="message-circle" size="small"></nr-icon>
            <span>Chat Preview</span>
          </div>
          <button class="chatbot-preview-close" @click=${this.closePreviewPanel}>
            <nr-icon name="x" size="small"></nr-icon>
          </button>
        </div>
        <div class="chatbot-preview-content">
          <nr-chatbot
            size=${(config.chatbotSize as string) || 'medium'}
            variant=${(config.chatbotVariant as string) || 'default'}
            .suggestions=${suggestions}
            placeholder=${(config.placeholder as string) || 'Type a message...'}
            botName=${(config.title as string) || 'Chat Assistant'}
            ?showHeader=${true}
            ?showSuggestions=${config.enableSuggestions !== false}
            loadingType=${(config.loadingType as string) || 'dots'}
          ></nr-chatbot>
        </div>
      </div>
    `;
  }

  private renderPendingDiffPanelContent() {
    return renderPendingDiffPanel({
      pendingDiff: this._pendingDiff,
      expandedChangeIds: this._expandedChangeIds,
      callbacks: {
        onAccept: (changeId) => this.acceptChange(changeId),
        onReject: (changeId) => this.rejectChange(changeId),
        onResetStatus: (changeId) => this.resetChangeStatus(changeId),
        onApplyAll: () => this.applyAllChanges(),
        onApplyAccepted: () => this.applyAcceptedChanges(),
        onCancel: () => this.clearPendingDiff(),
        onToggleDetails: (changeId) => this.toggleChangeExpanded(changeId),
      },
    });
  }

  private renderDiffLegendContent() {
    if (!this._pendingDiff || this.diffDisplayMode === 'none') return html``;
    return renderDiffLegend(this._pendingDiff, () => this.clearDiffVisualization());
  }

  override render() {
    return html`
      <div
        class="canvas-wrapper"
        data-theme=${this.currentTheme}
        @mousedown=${this.handleCanvasMouseDown}
        @contextmenu=${this.handleCanvasContextMenu}
        @drop=${this.handleCanvasDrop}
        @dragover=${this.handleCanvasDragOver}
      >
        <div class="canvas-grid"></div>

        <div class="canvas-viewport">
          <!-- Edges SVG layer -->
          <svg class="edges-svg">
            ${this.renderEdges()}
          </svg>

          <!-- Nodes layer -->
          <div class="nodes-layer">
            ${this.getNodesWithStatuses().map(node => html`
              <workflow-node
                .node=${node}
                ?selected=${this.selectedNodeIds.has(node.id)}
                ?dragging=${this.dragState?.nodeId === node.id}
                .connectingPortId=${this.connectionState?.sourcePortId || null}
                .diffState=${this.getEntityDiffStateForNode(node.id)}
                @node-mousedown=${this.handleNodeMouseDown}
                @node-dblclick=${this.handleNodeDblClick}
                @node-preview=${this.handleNodePreview}
                @node-trigger=${this.handleNodeTrigger}
                @port-mousedown=${this.handlePortMouseDown}
                @port-mouseup=${this.handlePortMouseUp}
              ></workflow-node>
            `)}
          </div>
        </div>

        ${this.renderEmptyState()}
        ${this.renderToolbar()}
        ${this.renderPalette()}
        ${this.renderConfigPanel()}
        ${this.renderChatbotPreview()}
        ${this.renderZoomControls()}
        ${this.renderContextMenu()}
        ${this.renderPendingDiffPanelContent()}
        ${this.renderDiffLegendContent()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'workflow-canvas': WorkflowCanvasElement;
  }
}
