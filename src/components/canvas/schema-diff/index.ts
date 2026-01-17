/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

// Types
export type {
  DatabaseSchema,
  SchemaEntity,
  SchemaRelation,
  SchemaEntityType,
  SchemaSnapshot,
  SchemaDiff,
  DiffSummary,
  EntityTypeSummary,
  ChangeType,
  SchemaChange,
  PropertyChange,
  DiffOptions,
  PendingChangeStatus,
  PendingSchemaChange,
  PendingDiff,
  PendingDiffSummary,
  ApplyDiffOptions,
  ApplyDiffResult,
  DiffDisplayMode,
  EntityDiffState,
  DiffVisualizationOptions,
  EntityDiffMap,
  // Events
  SchemaDiffChangedEvent,
  SchemaDiffSavedEvent,
  SchemaDiffRevertedEvent,
  DiffLoadedEvent,
  DiffAppliedEvent,
  ChangeStatusUpdatedEvent,
} from './schema-diff.types.js';

// Constants
export {
  EXCLUDED_ENTITY_PROPERTIES,
  EXCLUDED_RELATION_PROPERTIES,
  DEFAULT_DIFF_OPTIONS,
  DEFAULT_DIFF_VISUALIZATION,
} from './schema-diff.types.js';

// Utility functions from types
export {
  nodeTypeToEntityType,
  entityTypeToNodeType,
  generateChangeId,
  createEmptyDiff,
} from './schema-diff.types.js';

// Deep compare utilities
export {
  deepClone,
  deepEqual,
  deepCompare,
  getValueAtPath,
  setValueAtPath,
  deleteValueAtPath,
  hasValueAtPath,
} from './deep-compare.js';

// Array diff utilities
export {
  diffArrayByKey,
  diffArrayByIndex,
  arrayDiffToPropertyChanges,
  getKeyFunctionForProperty,
  smartArrayDiff,
} from './array-diff.js';
export type { ArrayDiffResult } from './array-diff.js';

// Snapshot functions
export {
  captureSnapshot,
  snapshotToSchema,
  snapshotsEqual,
  getEntityFromSnapshot,
  getRelationFromSnapshot,
  getEntityIds,
  getRelationIds,
  createEmptySnapshot,
  mergeSnapshotWithPositions,
} from './schema-snapshot.js';

// Diff calculator
export {
  calculateSchemaDiff,
  filterChangesByEntityType,
  filterChangesByChangeType,
  getChangesForEntity,
  wasEntityChanged,
  getEntityDiffState,
} from './schema-diff-calculator.js';
