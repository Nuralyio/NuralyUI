/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Check if an element is an editable input (input, textarea, or contentEditable)
 */
export function isEditableElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tag = element.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || element.isContentEditable;
}

/**
 * Check if the keyboard event has a modifier key held
 */
export function hasModifierKey(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey;
}

/**
 * Check if a key is a single printable character (for type-ahead)
 */
export function isPrintableKey(key: string): boolean {
  return key.length === 1;
}

/**
 * Navigate to the next index in a list with wrapping.
 * Skips items for which `isEnabled` returns false.
 *
 * @param currentIndex - The current focused index (-1 for none)
 * @param totalItems - Total number of items
 * @param isEnabled - Function that checks if an item at index is enabled/interactive
 * @returns The next enabled index, or -1 if none found
 */
export function getNextEnabledIndex(
  currentIndex: number,
  totalItems: number,
  isEnabled: (index: number) => boolean = () => true
): number {
  if (totalItems === 0) return -1;

  for (let i = 1; i <= totalItems; i++) {
    const index = (currentIndex + i) % totalItems;
    if (isEnabled(index)) return index;
  }
  return -1;
}

/**
 * Navigate to the previous index in a list with wrapping.
 * Skips items for which `isEnabled` returns false.
 *
 * @param currentIndex - The current focused index (-1 wraps from end)
 * @param totalItems - Total number of items
 * @param isEnabled - Function that checks if an item at index is enabled/interactive
 * @returns The previous enabled index, or -1 if none found
 */
export function getPrevEnabledIndex(
  currentIndex: number,
  totalItems: number,
  isEnabled: (index: number) => boolean = () => true
): number {
  if (totalItems === 0) return -1;

  const start = currentIndex < 0 ? totalItems : currentIndex;
  for (let i = 1; i <= totalItems; i++) {
    const index = (start - i + totalItems) % totalItems;
    if (isEnabled(index)) return index;
  }
  return -1;
}

/**
 * Get the first enabled index in a list.
 */
export function getFirstEnabledIndex(
  totalItems: number,
  isEnabled: (index: number) => boolean = () => true
): number {
  for (let i = 0; i < totalItems; i++) {
    if (isEnabled(i)) return i;
  }
  return -1;
}

/**
 * Get the last enabled index in a list.
 */
export function getLastEnabledIndex(
  totalItems: number,
  isEnabled: (index: number) => boolean = () => true
): number {
  for (let i = totalItems - 1; i >= 0; i--) {
    if (isEnabled(i)) return i;
  }
  return -1;
}

/**
 * Type-ahead search buffer manager.
 * Accumulates characters and auto-clears after a timeout.
 *
 * @example
 * ```typescript
 * const typeAhead = new TypeAheadBuffer();
 * // On keydown:
 * typeAhead.append(event.key);
 * const match = items.find(item => item.label.toLowerCase().startsWith(typeAhead.value));
 * ```
 */
export class TypeAheadBuffer {
  private _buffer = '';
  private _timeout: ReturnType<typeof setTimeout> | null = null;
  private _delay: number;

  constructor(delay: number = 500) {
    this._delay = delay;
  }

  /** Current buffer value */
  get value(): string {
    return this._buffer;
  }

  /** Append a character and reset the clear timer */
  append(char: string): string {
    if (this._timeout) clearTimeout(this._timeout);
    this._buffer += char.toLowerCase();
    this._timeout = setTimeout(() => this.clear(), this._delay);
    return this._buffer;
  }

  /** Clear the buffer and timer */
  clear(): void {
    this._buffer = '';
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }

  /** Destroy the buffer (cleanup) */
  destroy(): void {
    this.clear();
  }
}
