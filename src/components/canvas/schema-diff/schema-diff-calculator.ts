/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type {
  SchemaSnapshot,
  SchemaEntity,
  SchemaRelation,
  SchemaDiff,
  SchemaChange,
  PropertyChange,
  DiffOptions,
  DiffSummary,
  SchemaEntityType,
} from './schema-diff.types.js';
import {
  generateChangeId,
  nodeTypeToEntityType,
} from './schema-diff.types.js';
import { deepCompare, deepEqual } from './deep-compare.js';
import { diffArrayByKey, arrayDiffToPropertyChanges, getKeyFunctionForProperty } from './array-diff.js';

/**
 * Calculate the diff between two schema snapshots
 */
export function calculateSchemaDiff(
  original: SchemaSnapshot,
  modified: SchemaSnapshot,
  options: DiffOptions = { includeDescriptions: true }
): SchemaDiff {
  const changes: SchemaChange[] = [];

  // Compare entities (nodes)
  const entityChanges = compareEntities(
    original.entities,
    modified.entities,
    options
  );
  changes.push(...entityChanges);

  // Compare relations (edges)
  const relationChanges = compareRelations(
    original.relations,
    modified.relations,
    options
  );
  changes.push(...relationChanges);

  // Build summary
  const summary = buildDiffSummary(changes);

  return {
    version: '1.0',
    originalSchemaId: original.schemaId,
    originalVersion: original.version,
    modifiedSchemaId: modified.schemaId,
    modifiedVersion: modified.version,
    generatedAt: new Date().toISOString(),
    hasChanges: changes.length > 0,
    summary,
    changes,
  };
}

/**
 * Compare entity arrays (nodes)
 */
function compareEntities(
  original: SchemaEntity[],
  modified: SchemaEntity[],
  options: DiffOptions
): SchemaChange[] {
  const changes: SchemaChange[] = [];

  // Build maps for quick lookup
  const originalMap = new Map(original.map(e => [e.id, e]));
  const modifiedMap = new Map(modified.map(e => [e.id, e]));

  // Find removed entities
  for (const [id, entity] of originalMap) {
    if (!modifiedMap.has(id)) {
      changes.push(createRemoveChange(entity));
    }
  }

  // Find added and modified entities
  for (const [id, modEntity] of modifiedMap) {
    const origEntity = originalMap.get(id);

    if (!origEntity) {
      // Entity added
      changes.push(createAddChange(modEntity));
    } else {
      // Entity exists - check for modifications
      const entityChanges = compareEntity(origEntity, modEntity, options);
      if (entityChanges) {
        changes.push(entityChanges);
      }
    }
  }

  return changes;
}

/**
 * Compare two entities and return change if different
 */
function compareEntity(
  original: SchemaEntity,
  modified: SchemaEntity,
  options: DiffOptions
): SchemaChange | null {
  const propertyChanges: PropertyChange[] = [];

  // Compare name (RENAME detection)
  if (original.name !== modified.name) {
    propertyChanges.push({
      property: 'name',
      path: 'name',
      changeType: 'MODIFY',
      before: original.name,
      after: modified.name,
    });
  }

  // Compare configuration
  const configChanges = compareConfiguration(
    original.configuration,
    modified.configuration,
    original.type
  );
  propertyChanges.push(...configChanges);

  // Compare ports (if they changed)
  const portChanges = comparePorts(original.ports, modified.ports);
  propertyChanges.push(...portChanges);

  // Compare metadata.description (if enabled)
  if (options.includeDescriptions) {
    const origDesc = original.metadata?.description;
    const modDesc = modified.metadata?.description;
    if (origDesc !== modDesc) {
      propertyChanges.push({
        property: 'description',
        path: 'metadata.description',
        changeType: origDesc ? (modDesc ? 'MODIFY' : 'REMOVE') : 'ADD',
        before: origDesc,
        after: modDesc,
      });
    }
  }

  if (propertyChanges.length === 0) {
    return null;
  }

  // Determine if this is a RENAME or MODIFY
  const isRename = propertyChanges.some(
    c => c.property === 'name' || isEntityNameProperty(c.property, original.type)
  );

  return {
    changeId: generateChangeId(),
    changeType: isRename ? 'RENAME' : 'MODIFY',
    entityType: nodeTypeToEntityType(original.type),
    entityId: original.id,
    entityName: getEntityName(modified),
    propertyChanges,
  };
}

/**
 * Compare configuration objects
 */
function compareConfiguration(
  original: Record<string, unknown>,
  modified: Record<string, unknown>,
  _nodeType: string
): PropertyChange[] {
  const changes: PropertyChange[] = [];
  const allKeys = new Set([...Object.keys(original), ...Object.keys(modified)]);

  for (const key of allKeys) {
    const origValue = original[key];
    const modValue = modified[key];

    if (deepEqual(origValue, modValue)) continue;

    const path = `configuration.${key}`;

    // Handle arrays specially
    if (Array.isArray(origValue) && Array.isArray(modValue)) {
      const keyFn = getKeyFunctionForProperty(key);
      if (keyFn) {
        const arrayDiff = diffArrayByKey(origValue, modValue, keyFn, path);
        changes.push(...arrayDiffToPropertyChanges(arrayDiff, path));
      } else {
        // Index-based comparison
        const arrayChanges = deepCompare(origValue, modValue, path);
        changes.push(...arrayChanges);
      }
    } else if (!(key in original)) {
      // Property added
      changes.push({
        property: key,
        path,
        changeType: 'ADD',
        after: modValue,
      });
    } else if (!(key in modified)) {
      // Property removed
      changes.push({
        property: key,
        path,
        changeType: 'REMOVE',
        before: origValue,
      });
    } else if (typeof origValue === 'object' && typeof modValue === 'object') {
      // Nested object comparison
      changes.push(...deepCompare(origValue, modValue, path));
    } else {
      // Primitive value changed
      changes.push({
        property: key,
        path,
        changeType: 'MODIFY',
        before: origValue,
        after: modValue,
      });
    }
  }

  return changes;
}

/**
 * Compare port configurations
 */
function comparePorts(
  original: SchemaEntity['ports'],
  modified: SchemaEntity['ports']
): PropertyChange[] {
  const changes: PropertyChange[] = [];

  // Compare inputs
  if (!deepEqual(original.inputs, modified.inputs)) {
    changes.push(...deepCompare(original.inputs, modified.inputs, 'ports.inputs'));
  }

  // Compare outputs
  if (!deepEqual(original.outputs, modified.outputs)) {
    changes.push(...deepCompare(original.outputs, modified.outputs, 'ports.outputs'));
  }

  return changes;
}

/**
 * Compare relation arrays (edges)
 */
function compareRelations(
  original: SchemaRelation[],
  modified: SchemaRelation[],
  _options: DiffOptions
): SchemaChange[] {
  const changes: SchemaChange[] = [];

  // Build maps for quick lookup
  const originalMap = new Map(original.map(r => [r.id, r]));
  const modifiedMap = new Map(modified.map(r => [r.id, r]));

  // Find removed relations
  for (const [id, relation] of originalMap) {
    if (!modifiedMap.has(id)) {
      changes.push(createRelationRemoveChange(relation));
    }
  }

  // Find added and modified relations
  for (const [id, modRelation] of modifiedMap) {
    const origRelation = originalMap.get(id);

    if (!origRelation) {
      // Relation added
      changes.push(createRelationAddChange(modRelation));
    } else {
      // Relation exists - check for modifications
      const relationChange = compareRelation(origRelation, modRelation);
      if (relationChange) {
        changes.push(relationChange);
      }
    }
  }

  return changes;
}

/**
 * Compare two relations and return change if different
 */
function compareRelation(
  original: SchemaRelation,
  modified: SchemaRelation
): SchemaChange | null {
  const propertyChanges: PropertyChange[] = [];

  // Properties to compare (excluding visual/runtime)
  const propsToCompare: (keyof SchemaRelation)[] = [
    'sourceNodeId',
    'sourcePortId',
    'targetNodeId',
    'targetPortId',
    'label',
    'condition',
    'priority',
  ];

  for (const prop of propsToCompare) {
    const origValue = original[prop];
    const modValue = modified[prop];

    if (origValue !== modValue) {
      propertyChanges.push({
        property: prop,
        path: prop,
        changeType: origValue === undefined ? 'ADD' : modValue === undefined ? 'REMOVE' : 'MODIFY',
        before: origValue,
        after: modValue,
      });
    }
  }

  if (propertyChanges.length === 0) {
    return null;
  }

  return {
    changeId: generateChangeId(),
    changeType: 'MODIFY',
    entityType: 'FOREIGN_KEY',
    entityId: original.id,
    entityName: original.label || `${original.sourceNodeId} -> ${original.targetNodeId}`,
    propertyChanges,
  };
}

/**
 * Create ADD change for entity
 */
function createAddChange(entity: SchemaEntity): SchemaChange {
  return {
    changeId: generateChangeId(),
    changeType: 'ADD',
    entityType: nodeTypeToEntityType(entity.type),
    entityId: entity.id,
    entityName: getEntityName(entity),
    added: cleanEntityForChange(entity),
  };
}

/**
 * Create REMOVE change for entity
 */
function createRemoveChange(entity: SchemaEntity): SchemaChange {
  return {
    changeId: generateChangeId(),
    changeType: 'REMOVE',
    entityType: nodeTypeToEntityType(entity.type),
    entityId: entity.id,
    entityName: getEntityName(entity),
    removed: cleanEntityForChange(entity),
  };
}

/**
 * Create ADD change for relation
 */
function createRelationAddChange(relation: SchemaRelation): SchemaChange {
  return {
    changeId: generateChangeId(),
    changeType: 'ADD',
    entityType: 'FOREIGN_KEY',
    entityId: relation.id,
    entityName: relation.label || `${relation.sourceNodeId} -> ${relation.targetNodeId}`,
    added: cleanRelationForChange(relation),
  };
}

/**
 * Create REMOVE change for relation
 */
function createRelationRemoveChange(relation: SchemaRelation): SchemaChange {
  return {
    changeId: generateChangeId(),
    changeType: 'REMOVE',
    entityType: 'FOREIGN_KEY',
    entityId: relation.id,
    entityName: relation.label || `${relation.sourceNodeId} -> ${relation.targetNodeId}`,
    removed: cleanRelationForChange(relation),
  };
}

/**
 * Clean entity for inclusion in change (remove position, status, etc.)
 */
function cleanEntityForChange(entity: SchemaEntity): Partial<SchemaEntity> {
  const { position, status, selected, error, ...clean } = entity;
  return clean;
}

/**
 * Clean relation for inclusion in change
 */
function cleanRelationForChange(relation: SchemaRelation): Partial<SchemaRelation> {
  const { selected, status, animated, ...clean } = relation;
  return clean;
}

/**
 * Get human-readable name for entity
 */
function getEntityName(entity: SchemaEntity): string {
  const config = entity.configuration || {};

  // Try type-specific name properties
  const nameProps = ['tableName', 'viewName', 'indexName', 'constraintName', 'queryName'];
  for (const prop of nameProps) {
    if (config[prop]) return String(config[prop]);
  }

  // Fallback to node name
  return entity.name;
}

/**
 * Check if a property is the entity's name property
 */
function isEntityNameProperty(property: string, nodeType: string): boolean {
  const nameProps: Record<string, string> = {
    'DB_TABLE': 'tableName',
    'DB_VIEW': 'viewName',
    'DB_INDEX': 'indexName',
    'DB_CONSTRAINT': 'constraintName',
    'DB_QUERY': 'queryName',
  };
  return property === nameProps[nodeType];
}

/**
 * Build diff summary from changes
 */
function buildDiffSummary(changes: SchemaChange[]): DiffSummary {
  const summary: DiffSummary = {
    totalChanges: changes.length,
    entities: { added: 0, modified: 0, removed: 0, renamed: 0 },
    relations: { added: 0, modified: 0, removed: 0 },
    byEntityType: {},
  };

  for (const change of changes) {
    if (change.entityType === 'FOREIGN_KEY') {
      // Relation change
      switch (change.changeType) {
        case 'ADD':
          summary.relations.added++;
          break;
        case 'REMOVE':
          summary.relations.removed++;
          break;
        case 'MODIFY':
        case 'RENAME':
          summary.relations.modified++;
          break;
      }
    } else {
      // Entity change
      switch (change.changeType) {
        case 'ADD':
          summary.entities.added++;
          break;
        case 'REMOVE':
          summary.entities.removed++;
          break;
        case 'MODIFY':
          summary.entities.modified++;
          break;
        case 'RENAME':
          summary.entities.renamed++;
          break;
      }

      // By entity type
      const entityType = change.entityType as SchemaEntityType;
      if (!summary.byEntityType[entityType]) {
        summary.byEntityType[entityType] = { added: 0, modified: 0, removed: 0 };
      }

      switch (change.changeType) {
        case 'ADD':
          summary.byEntityType[entityType]!.added++;
          break;
        case 'REMOVE':
          summary.byEntityType[entityType]!.removed++;
          break;
        case 'MODIFY':
        case 'RENAME':
          summary.byEntityType[entityType]!.modified++;
          break;
      }
    }
  }

  return summary;
}

/**
 * Filter changes by entity type
 */
export function filterChangesByEntityType(
  changes: SchemaChange[],
  entityTypes: (SchemaEntityType | 'FOREIGN_KEY')[]
): SchemaChange[] {
  return changes.filter(c => entityTypes.includes(c.entityType));
}

/**
 * Filter changes by change type
 */
export function filterChangesByChangeType(
  changes: SchemaChange[],
  changeTypes: SchemaChange['changeType'][]
): SchemaChange[] {
  return changes.filter(c => changeTypes.includes(c.changeType));
}

/**
 * Get changes for a specific entity
 */
export function getChangesForEntity(
  diff: SchemaDiff,
  entityId: string
): SchemaChange | undefined {
  return diff.changes.find(c => c.entityId === entityId);
}

/**
 * Check if an entity was changed in the diff
 */
export function wasEntityChanged(diff: SchemaDiff, entityId: string): boolean {
  return diff.changes.some(c => c.entityId === entityId);
}

/**
 * Get the diff state for an entity
 */
export function getEntityDiffState(
  diff: SchemaDiff | null,
  entityId: string
): 'unchanged' | 'added' | 'modified' | 'removed' {
  if (!diff) return 'unchanged';

  const change = diff.changes.find(c => c.entityId === entityId);
  if (!change) return 'unchanged';

  switch (change.changeType) {
    case 'ADD':
      return 'added';
    case 'REMOVE':
      return 'removed';
    case 'MODIFY':
    case 'RENAME':
      return 'modified';
    default:
      return 'unchanged';
  }
}
