/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Shared KV credential utilities for workflow node config panels.
 * Provides the common KvEntryLike interface and helper functions
 * used across multiple node types for credential management.
 */

export interface KvEntryLike {
  keyPath: string;
  value?: any;
  isSecret: boolean;
}

/**
 * Filter KV entries by provider prefix
 */
export function filterKvEntriesByProvider(
  kvEntries: KvEntryLike[] | undefined,
  provider: string,
): KvEntryLike[] {
  return (kvEntries || []).filter((e) => e.keyPath.startsWith(`${provider}/`));
}

/**
 * Create a handler for KV entry creation events
 */
export function createKvEntryHandler(
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): (e: CustomEvent) => void {
  return (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };
}
