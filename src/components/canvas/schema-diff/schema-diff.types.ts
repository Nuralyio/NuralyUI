/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
} from '../workflow-canvas.types.js';

// ─────────────────────────────────────────────────────────────
// TYPE ALIASES (maps internal names to DB terminology)
// ─────────────────────────────────────────────────────────────

/** Database schema document (alias for Workflow) */
export type DatabaseSchema = Workflow;

/** Schema entity: TABLE, VIEW, INDEX, etc. (alias for WorkflowNode) */
export type SchemaEntity = WorkflowNode;

/** Schema relation: foreign keys, references (alias for WorkflowEdge) */
export type SchemaRelation = WorkflowEdge;

/** Entity types in database context */
export type SchemaEntityType =
  | 'TABLE'
  | 'VIEW'
  | 'INDEX'
  | 'RELATIONSHIP'
  | 'CONSTRAINT'
  | 'QUERY';

// ─────────────────────────────────────────────────────────────
// EXCLUSIONS (visual/runtime properties to ignore)
// ─────────────────────────────────────────────────────────────

/** Properties excluded from entity comparison (visual/runtime only) */
export const EXCLUDED_ENTITY_PROPERTIES: (keyof SchemaEntity)[] = [
  'position',
  'status',
  'selected',
  'error',
];

/** Properties excluded from relation comparison (visual/runtime only) */
export const EXCLUDED_RELATION_PROPERTIES: (keyof SchemaRelation)[] = [
  'selected',
  'status',
  'animated',
];

// ─────────────────────────────────────────────────────────────
// SNAPSHOT
// ─────────────────────────────────────────────────────────────

/** Captured state of schema at a point in time */
export interface SchemaSnapshot {
  schemaId: string;
  schemaName: string;
  description?: string;
  version?: string;
  capturedAt: string;
  entities: SchemaEntity[];
  relations: SchemaRelation[];
}

// ─────────────────────────────────────────────────────────────
// DIFF RESULT
// ─────────────────────────────────────────────────────────────

/** Complete diff between two schema versions */
export interface SchemaDiff {
  version: '1.0';
  originalSchemaId: string;
  originalVersion?: string;
  modifiedSchemaId: string;
  modifiedVersion?: string;
  generatedAt: string;
  hasChanges: boolean;
  summary: DiffSummary;
  changes: SchemaChange[];
}

/** Summary of changes in a diff */
export interface DiffSummary {
  totalChanges: number;
  entities: {
    added: number;
    modified: number;
    removed: number;
    renamed: number;
  };
  relations: {
    added: number;
    modified: number;
    removed: number;
  };
  byEntityType: Partial<Record<SchemaEntityType, EntityTypeSummary>>;
}

/** Summary for a specific entity type */
export interface EntityTypeSummary {
  added: number;
  modified: number;
  removed: number;
}

// ─────────────────────────────────────────────────────────────
// CHANGE ENTRIES
// ─────────────────────────────────────────────────────────────

/** Type of change */
export type ChangeType = 'ADD' | 'REMOVE' | 'MODIFY' | 'RENAME';

/** Individual change entry */
export interface SchemaChange {
  /** Unique identifier for this change */
  changeId: string;

  /** Type of change */
  changeType: ChangeType;

  /** What kind of entity changed */
  entityType: SchemaEntityType | 'FOREIGN_KEY';

  /** Unique ID of the entity */
  entityId: string;

  /** Human-readable name (table name, index name, etc.) */
  entityName: string;

  /** For ADD: the new entity */
  added?: Partial<SchemaEntity | SchemaRelation>;

  /** For REMOVE: the removed entity */
  removed?: Partial<SchemaEntity | SchemaRelation>;

  /** For MODIFY/RENAME: detailed property changes */
  propertyChanges?: PropertyChange[];
}

/** Property-level change */
export interface PropertyChange {
  /** Human-readable property path: "columns[2].type" */
  property: string;

  /** Full JSON path: "configuration.columns[2].type" */
  path: string;

  /** Type of property change */
  changeType: 'ADD' | 'REMOVE' | 'MODIFY';

  /** Previous value */
  before?: unknown;

  /** New value */
  after?: unknown;
}

// ─────────────────────────────────────────────────────────────
// DIFF OPTIONS
// ─────────────────────────────────────────────────────────────

/** Options for diff calculation */
export interface DiffOptions {
  /** Include description changes (default: true) */
  includeDescriptions: boolean;

  /** Custom properties to exclude */
  additionalExclusions?: string[];
}

/** Default diff options */
export const DEFAULT_DIFF_OPTIONS: DiffOptions = {
  includeDescriptions: true,
};

// ─────────────────────────────────────────────────────────────
// PENDING DIFF (Interactive)
// ─────────────────────────────────────────────────────────────

/** Status of a pending change */
export type PendingChangeStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'applied';

/** A change with interactive status */
export interface PendingSchemaChange extends SchemaChange {
  status: PendingChangeStatus;
  appliedAt?: string;
  rejectedReason?: string;
}

/** Diff loaded for interactive application */
export interface PendingDiff {
  id: string;
  source: 'ai' | 'import' | 'migration' | 'external';
  sourceDescription?: string;
  loadedAt: string;
  changes: PendingSchemaChange[];
  summary: PendingDiffSummary;
}

/** Summary of pending diff status */
export interface PendingDiffSummary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  applied: number;
}

/** Options for applying changes */
export interface ApplyDiffOptions {
  /** Only apply changes with these IDs */
  changeIds?: string[];

  /** Skip confirmation */
  skipConfirmation?: boolean;

  /** Apply accepted changes only */
  acceptedOnly?: boolean;
}

/** Result of applying diff */
export interface ApplyDiffResult {
  success: boolean;
  appliedChanges: SchemaChange[];
  failedChanges: Array<{ change: SchemaChange; error: string }>;
  skippedChanges: SchemaChange[];
  newSchema: DatabaseSchema;
}

// ─────────────────────────────────────────────────────────────
// DIFF VISUALIZATION
// ─────────────────────────────────────────────────────────────

/** Diff display mode */
export type DiffDisplayMode =
  | 'none'
  | 'full'
  | 'additions'
  | 'modifications'
  | 'removals';

/** Entity diff state for visualization */
export type EntityDiffState =
  | 'unchanged'
  | 'added'
  | 'modified'
  | 'removed';

/** Options for diff visualization */
export interface DiffVisualizationOptions {
  mode: DiffDisplayMode;
  showRemovedAsGhost: boolean;
  addedColor: string;
  modifiedColor: string;
  removedColor: string;
  showChangeBadges: boolean;
  showPropertyChanges: boolean;
}

/** Default visualization options */
export const DEFAULT_DIFF_VISUALIZATION: DiffVisualizationOptions = {
  mode: 'full',
  showRemovedAsGhost: true,
  addedColor: '#22c55e',
  modifiedColor: '#f59e0b',
  removedColor: '#ef4444',
  showChangeBadges: true,
  showPropertyChanges: true,
};

// ─────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────

/** Emitted when schema changes vs baseline */
export interface SchemaDiffChangedEvent {
  diff: SchemaDiff;
  changeCount: number;
  hasUnsavedChanges: boolean;
  latestChange?: SchemaChange;
}

/** Emitted when changes are saved */
export interface SchemaDiffSavedEvent {
  savedDiff: SchemaDiff;
  newBaseline: SchemaSnapshot;
  savedAt: string;
}

/** Emitted when changes are reverted */
export interface SchemaDiffRevertedEvent {
  discardedDiff: SchemaDiff;
  restoredSnapshot: SchemaSnapshot;
}

/** Emitted when diff is loaded for review */
export interface DiffLoadedEvent {
  pendingDiff: PendingDiff;
}

/** Emitted when diff is applied */
export interface DiffAppliedEvent {
  result: ApplyDiffResult;
  pendingDiff: PendingDiff;
}

/** Emitted when change status is updated */
export interface ChangeStatusUpdatedEvent {
  changeId: string;
  oldStatus: PendingChangeStatus;
  newStatus: PendingChangeStatus;
}

// ─────────────────────────────────────────────────────────────
// UTILITY TYPES
// ─────────────────────────────────────────────────────────────

/** Map entity ID to diff state */
export interface EntityDiffMap {
  state: EntityDiffState;
  changes: PropertyChange[];
}

/** Convert DbDesignerNodeType to SchemaEntityType */
export function nodeTypeToEntityType(nodeType: string): SchemaEntityType | 'FOREIGN_KEY' {
  const mapping: Record<string, SchemaEntityType> = {
    'DB_TABLE': 'TABLE',
    'DB_VIEW': 'VIEW',
    'DB_INDEX': 'INDEX',
    'DB_RELATIONSHIP': 'RELATIONSHIP',
    'DB_CONSTRAINT': 'CONSTRAINT',
    'DB_QUERY': 'QUERY',
  };
  return mapping[nodeType] || 'TABLE';
}

/** Convert SchemaEntityType to DbDesignerNodeType */
export function entityTypeToNodeType(entityType: SchemaEntityType): string {
  const mapping: Record<SchemaEntityType, string> = {
    'TABLE': 'DB_TABLE',
    'VIEW': 'DB_VIEW',
    'INDEX': 'DB_INDEX',
    'RELATIONSHIP': 'DB_RELATIONSHIP',
    'CONSTRAINT': 'DB_CONSTRAINT',
    'QUERY': 'DB_QUERY',
  };
  return mapping[entityType];
}

/** Generate unique change ID */
export function generateChangeId(): string {
  return `chg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/** Create empty diff */
export function createEmptyDiff(schemaId: string, version?: string): SchemaDiff {
  return {
    version: '1.0',
    originalSchemaId: schemaId,
    originalVersion: version,
    modifiedSchemaId: schemaId,
    modifiedVersion: version,
    generatedAt: new Date().toISOString(),
    hasChanges: false,
    summary: {
      totalChanges: 0,
      entities: { added: 0, modified: 0, removed: 0, renamed: 0 },
      relations: { added: 0, modified: 0, removed: 0 },
      byEntityType: {},
    },
    changes: [],
  };
}
