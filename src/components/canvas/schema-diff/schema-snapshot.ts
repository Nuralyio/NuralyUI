/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type {
  DatabaseSchema,
  SchemaSnapshot,
  SchemaEntity,
  SchemaRelation,
} from './schema-diff.types.js';
import { deepClone } from './deep-compare.js';

/**
 * Capture a schema as a snapshot for diff comparison
 */
export function captureSnapshot(schema: DatabaseSchema): SchemaSnapshot {
  return {
    schemaId: schema.id,
    schemaName: schema.name,
    description: schema.description,
    version: schema.version,
    capturedAt: new Date().toISOString(),
    entities: cleanEntitiesForSnapshot(schema.nodes),
    relations: cleanRelationsForSnapshot(schema.edges),
  };
}

/**
 * Convert a snapshot back to a schema
 */
export function snapshotToSchema(snapshot: SchemaSnapshot): DatabaseSchema {
  return {
    id: snapshot.schemaId,
    name: snapshot.schemaName,
    description: snapshot.description,
    version: snapshot.version,
    nodes: deepClone(snapshot.entities),
    edges: deepClone(snapshot.relations),
  };
}

/**
 * Clean entity array for snapshot (remove runtime/visual properties)
 */
function cleanEntitiesForSnapshot(entities: SchemaEntity[]): SchemaEntity[] {
  return entities.map(entity => cleanEntityForSnapshot(entity));
}

/**
 * Clean a single entity for snapshot
 */
function cleanEntityForSnapshot(entity: SchemaEntity): SchemaEntity {
  const cleaned = deepClone(entity);

  // Remove visual/runtime properties
  delete (cleaned as Partial<SchemaEntity>).position;
  delete (cleaned as Partial<SchemaEntity>).status;
  delete (cleaned as Partial<SchemaEntity>).selected;
  delete (cleaned as Partial<SchemaEntity>).error;

  return cleaned;
}

/**
 * Clean relation array for snapshot
 */
function cleanRelationsForSnapshot(relations: SchemaRelation[]): SchemaRelation[] {
  return relations.map(relation => cleanRelationForSnapshot(relation));
}

/**
 * Clean a single relation for snapshot
 */
function cleanRelationForSnapshot(relation: SchemaRelation): SchemaRelation {
  const cleaned = deepClone(relation);

  // Remove visual/runtime properties
  delete (cleaned as Partial<SchemaRelation>).selected;
  delete (cleaned as Partial<SchemaRelation>).status;
  delete (cleaned as Partial<SchemaRelation>).animated;

  return cleaned;
}

/**
 * Compare two snapshots for equality (quick check)
 */
export function snapshotsEqual(a: SchemaSnapshot, b: SchemaSnapshot): boolean {
  if (a.schemaId !== b.schemaId) return false;
  if (a.schemaName !== b.schemaName) return false;
  if (a.entities.length !== b.entities.length) return false;
  if (a.relations.length !== b.relations.length) return false;

  // Quick check - compare JSON strings
  const aJson = JSON.stringify({ entities: a.entities, relations: a.relations });
  const bJson = JSON.stringify({ entities: b.entities, relations: b.relations });

  return aJson === bJson;
}

/**
 * Get entity by ID from snapshot
 */
export function getEntityFromSnapshot(
  snapshot: SchemaSnapshot,
  entityId: string
): SchemaEntity | undefined {
  return snapshot.entities.find(e => e.id === entityId);
}

/**
 * Get relation by ID from snapshot
 */
export function getRelationFromSnapshot(
  snapshot: SchemaSnapshot,
  relationId: string
): SchemaRelation | undefined {
  return snapshot.relations.find(r => r.id === relationId);
}

/**
 * Get all entity IDs from snapshot
 */
export function getEntityIds(snapshot: SchemaSnapshot): string[] {
  return snapshot.entities.map(e => e.id);
}

/**
 * Get all relation IDs from snapshot
 */
export function getRelationIds(snapshot: SchemaSnapshot): string[] {
  return snapshot.relations.map(r => r.id);
}

/**
 * Create an empty snapshot
 */
export function createEmptySnapshot(schemaId: string, schemaName: string = 'New Schema'): SchemaSnapshot {
  return {
    schemaId,
    schemaName,
    capturedAt: new Date().toISOString(),
    entities: [],
    relations: [],
  };
}

/**
 * Merge a snapshot with position data from current schema
 * Used when applying changes that shouldn't lose position info
 */
export function mergeSnapshotWithPositions(
  snapshot: SchemaSnapshot,
  currentSchema: DatabaseSchema
): DatabaseSchema {
  const positionMap = new Map<string, { x: number; y: number }>();

  // Capture current positions
  for (const node of currentSchema.nodes) {
    positionMap.set(node.id, { ...node.position });
  }

  // Apply snapshot with positions
  const mergedNodes = snapshot.entities.map(entity => {
    const position = positionMap.get(entity.id) || { x: 100, y: 100 };
    return {
      ...entity,
      position,
    };
  });

  return {
    id: snapshot.schemaId,
    name: snapshot.schemaName,
    description: snapshot.description,
    version: snapshot.version,
    nodes: mergedNodes,
    edges: deepClone(snapshot.relations),
  };
}
