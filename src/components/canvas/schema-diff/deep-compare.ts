/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type { PropertyChange } from './schema-diff.types.js';

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  const cloned: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
    }
  }
  return cloned as T;
}

/**
 * Check if two values are deeply equal
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a === null || b === null) return a === b;
  if (a === undefined || b === undefined) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object') return a === b;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;

  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(bObj, key)) return false;
    if (!deepEqual(aObj[key], bObj[key])) return false;
  }

  return true;
}

/**
 * Compare two objects and return property changes
 */
export function deepCompare(
  original: unknown,
  modified: unknown,
  basePath: string = '',
  excludeProperties: string[] = []
): PropertyChange[] {
  const changes: PropertyChange[] = [];

  // Handle null/undefined
  if (original === null || original === undefined) {
    if (modified !== null && modified !== undefined) {
      changes.push({
        property: getPropertyName(basePath),
        path: basePath,
        changeType: 'ADD',
        after: modified,
      });
    }
    return changes;
  }

  if (modified === null || modified === undefined) {
    changes.push({
      property: getPropertyName(basePath),
      path: basePath,
      changeType: 'REMOVE',
      before: original,
    });
    return changes;
  }

  // Handle primitives
  if (typeof original !== 'object' || typeof modified !== 'object') {
    if (original !== modified) {
      changes.push({
        property: getPropertyName(basePath),
        path: basePath,
        changeType: 'MODIFY',
        before: original,
        after: modified,
      });
    }
    return changes;
  }

  // Handle arrays
  if (Array.isArray(original) && Array.isArray(modified)) {
    return compareArrays(original, modified, basePath, excludeProperties);
  }

  // Handle objects
  const origObj = original as Record<string, unknown>;
  const modObj = modified as Record<string, unknown>;

  const allKeys = new Set([...Object.keys(origObj), ...Object.keys(modObj)]);

  for (const key of allKeys) {
    // Skip excluded properties
    if (excludeProperties.includes(key)) continue;

    const newPath = basePath ? `${basePath}.${key}` : key;
    const origValue = origObj[key];
    const modValue = modObj[key];

    if (!(key in origObj)) {
      // Property added
      changes.push({
        property: getPropertyName(newPath),
        path: newPath,
        changeType: 'ADD',
        after: modValue,
      });
    } else if (!(key in modObj)) {
      // Property removed
      changes.push({
        property: getPropertyName(newPath),
        path: newPath,
        changeType: 'REMOVE',
        before: origValue,
      });
    } else if (!deepEqual(origValue, modValue)) {
      // Property modified - recurse for nested objects
      if (
        typeof origValue === 'object' &&
        typeof modValue === 'object' &&
        origValue !== null &&
        modValue !== null &&
        !Array.isArray(origValue)
      ) {
        changes.push(...deepCompare(origValue, modValue, newPath, excludeProperties));
      } else {
        changes.push({
          property: getPropertyName(newPath),
          path: newPath,
          changeType: 'MODIFY',
          before: origValue,
          after: modValue,
        });
      }
    }
  }

  return changes;
}

/**
 * Compare two arrays and return changes
 */
function compareArrays(
  original: unknown[],
  modified: unknown[],
  basePath: string,
  excludeProperties: string[]
): PropertyChange[] {
  const changes: PropertyChange[] = [];

  const maxLen = Math.max(original.length, modified.length);

  for (let i = 0; i < maxLen; i++) {
    const itemPath = `${basePath}[${i}]`;

    if (i >= original.length) {
      // Item added
      changes.push({
        property: getPropertyName(itemPath),
        path: itemPath,
        changeType: 'ADD',
        after: modified[i],
      });
    } else if (i >= modified.length) {
      // Item removed
      changes.push({
        property: getPropertyName(itemPath),
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
        changes.push(...deepCompare(original[i], modified[i], itemPath, excludeProperties));
      } else {
        changes.push({
          property: getPropertyName(itemPath),
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
 * Extract human-readable property name from path
 * e.g., "configuration.columns[2].type" -> "columns[2].type"
 */
function getPropertyName(path: string): string {
  // Remove common prefixes
  const prefixes = ['configuration.', 'metadata.'];
  for (const prefix of prefixes) {
    if (path.startsWith(prefix)) {
      return path.slice(prefix.length);
    }
  }
  return path;
}

/**
 * Get value at a given path in an object
 */
export function getValueAtPath(obj: unknown, path: string): unknown {
  if (!path) return obj;

  const parts = parsePath(path);
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) return undefined;

    if (typeof part === 'number') {
      current = (current as unknown[])[part];
    } else {
      current = (current as Record<string, unknown>)[part];
    }
  }

  return current;
}

/**
 * Set value at a given path in an object
 */
export function setValueAtPath(obj: unknown, path: string, value: unknown): void {
  const parts = parsePath(path);
  let current: unknown = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof part === 'number') {
      current = (current as unknown[])[part];
    } else {
      current = (current as Record<string, unknown>)[part];
    }
  }

  const lastPart = parts[parts.length - 1];
  if (typeof lastPart === 'number') {
    (current as unknown[])[lastPart] = value;
  } else {
    (current as Record<string, unknown>)[lastPart] = value;
  }
}

/**
 * Delete value at a given path in an object
 */
export function deleteValueAtPath(obj: unknown, path: string): void {
  const parts = parsePath(path);
  let current: unknown = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof part === 'number') {
      current = (current as unknown[])[part];
    } else {
      current = (current as Record<string, unknown>)[part];
    }
  }

  const lastPart = parts[parts.length - 1];
  if (typeof lastPart === 'number') {
    (current as unknown[]).splice(lastPart, 1);
  } else {
    delete (current as Record<string, unknown>)[lastPart];
  }
}

/**
 * Parse a path string into parts
 * e.g., "configuration.columns[2].type" -> ["configuration", "columns", 2, "type"]
 */
function parsePath(path: string): (string | number)[] {
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

/**
 * Check if an object has a property at a given path
 */
export function hasValueAtPath(obj: unknown, path: string): boolean {
  const value = getValueAtPath(obj, path);
  return value !== undefined;
}
