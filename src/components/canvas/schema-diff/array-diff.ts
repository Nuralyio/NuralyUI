/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type { PropertyChange } from './schema-diff.types.js';
import { deepEqual, deepCompare } from './deep-compare.js';

/**
 * Result of array diff operation
 */
export interface ArrayDiffResult<T> {
  added: Array<{ index: number; value: T }>;
  removed: Array<{ index: number; value: T }>;
  modified: Array<{
    originalIndex: number;
    modifiedIndex: number;
    before: T;
    after: T;
    changes: PropertyChange[];
  }>;
  unchanged: Array<{ index: number; value: T }>;
}

/**
 * Compare arrays by identifying items via a key function
 * This allows matching items even if their order changed
 *
 * @param original - Original array
 * @param modified - Modified array
 * @param keyFn - Function to extract unique key from item
 * @param basePath - Base path for property change paths
 */
export function diffArrayByKey<T>(
  original: T[],
  modified: T[],
  keyFn: (item: T) => string,
  basePath: string = ''
): ArrayDiffResult<T> {
  const result: ArrayDiffResult<T> = {
    added: [],
    removed: [],
    modified: [],
    unchanged: [],
  };

  // Build maps for quick lookup
  const originalMap = new Map<string, { index: number; item: T }>();
  const modifiedMap = new Map<string, { index: number; item: T }>();

  original.forEach((item, index) => {
    const key = keyFn(item);
    originalMap.set(key, { index, item });
  });

  modified.forEach((item, index) => {
    const key = keyFn(item);
    modifiedMap.set(key, { index, item });
  });

  // Find removed items (in original but not in modified)
  for (const [key, { index, item }] of originalMap) {
    if (!modifiedMap.has(key)) {
      result.removed.push({ index, value: item });
    }
  }

  // Find added and modified items
  for (const [key, { index: modIndex, item: modItem }] of modifiedMap) {
    const origEntry = originalMap.get(key);

    if (!origEntry) {
      // New item added
      result.added.push({ index: modIndex, value: modItem });
    } else {
      // Item exists in both - check if modified
      if (!deepEqual(origEntry.item, modItem)) {
        const itemPath = basePath ? `${basePath}[${origEntry.index}]` : `[${origEntry.index}]`;
        const changes = deepCompare(origEntry.item, modItem, itemPath);

        result.modified.push({
          originalIndex: origEntry.index,
          modifiedIndex: modIndex,
          before: origEntry.item,
          after: modItem,
          changes,
        });
      } else {
        result.unchanged.push({ index: modIndex, value: modItem });
      }
    }
  }

  return result;
}

/**
 * Compare arrays by index (order matters)
 * Used when items don't have unique keys
 *
 * @param original - Original array
 * @param modified - Modified array
 * @param basePath - Base path for property change paths
 */
export function diffArrayByIndex<T>(
  original: T[],
  modified: T[],
  basePath: string = ''
): PropertyChange[] {
  const changes: PropertyChange[] = [];
  const maxLen = Math.max(original.length, modified.length);

  for (let i = 0; i < maxLen; i++) {
    const itemPath = basePath ? `${basePath}[${i}]` : `[${i}]`;
    const propName = `[${i}]`;

    if (i >= original.length) {
      // Item added
      changes.push({
        property: propName,
        path: itemPath,
        changeType: 'ADD',
        after: modified[i],
      });
    } else if (i >= modified.length) {
      // Item removed
      changes.push({
        property: propName,
        path: itemPath,
        changeType: 'REMOVE',
        before: original[i],
      });
    } else if (!deepEqual(original[i], modified[i])) {
      // Item modified
      if (
        typeof original[i] === 'object' &&
        typeof modified[i] === 'object' &&
        original[i] !== null &&
        modified[i] !== null
      ) {
        // Recurse for objects
        changes.push(...deepCompare(original[i], modified[i], itemPath));
      } else {
        changes.push({
          property: propName,
          path: itemPath,
          changeType: 'MODIFY',
          before: original[i],
          after: modified[i],
        });
      }
    }
  }

  return changes;
}

/**
 * Convert ArrayDiffResult to PropertyChange array
 */
export function arrayDiffToPropertyChanges<T>(
  result: ArrayDiffResult<T>,
  basePath: string = ''
): PropertyChange[] {
  const changes: PropertyChange[] = [];

  // Added items
  for (const { index, value } of result.added) {
    const itemPath = basePath ? `${basePath}[${index}]` : `[${index}]`;
    changes.push({
      property: `[${index}]`,
      path: itemPath,
      changeType: 'ADD',
      after: value,
    });
  }

  // Removed items
  for (const { index, value } of result.removed) {
    const itemPath = basePath ? `${basePath}[${index}]` : `[${index}]`;
    changes.push({
      property: `[${index}]`,
      path: itemPath,
      changeType: 'REMOVE',
      before: value,
    });
  }

  // Modified items - include nested changes
  for (const { changes: nestedChanges } of result.modified) {
    changes.push(...nestedChanges);
  }

  return changes;
}

/**
 * Get key function for common DB entity arrays
 */
export function getKeyFunctionForProperty(propertyName: string): ((item: unknown) => string) | null {
  switch (propertyName) {
    case 'columns':
      // Columns identified by name
      return (item: unknown) => (item as { name: string }).name || '';

    case 'parameters':
      // Parameters identified by name
      return (item: unknown) => (item as { name: string }).name || '';

    case 'indexColumns':
    case 'constraintColumns':
      // String arrays - use value itself
      return (item: unknown) => String(item);

    default:
      return null;
  }
}

/**
 * Smart array diff that chooses strategy based on array content
 */
export function smartArrayDiff<T>(
  original: T[],
  modified: T[],
  basePath: string,
  propertyName: string
): PropertyChange[] {
  const keyFn = getKeyFunctionForProperty(propertyName);

  if (keyFn) {
    const result = diffArrayByKey(original, modified, keyFn as (item: T) => string, basePath);
    return arrayDiffToPropertyChanges(result, basePath);
  } else {
    return diffArrayByIndex(original, modified, basePath);
  }
}
