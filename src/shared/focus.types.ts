/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Shared focus/blur interfaces for form components
 *
 * These interfaces are used by Input, Textarea, and the FocusMixin
 * to provide consistent focus management APIs across form elements.
 */

/**
 * Options for programmatic focus behavior
 */
export interface FocusOptions {
  /** Prevent scrolling the element into view */
  preventScroll?: boolean;
  /** Cursor placement: 'start', 'end', 'all' to select all, or a numeric position */
  cursor?: 'start' | 'end' | 'all' | number;
  /** Whether to select the input text on focus */
  select?: boolean;
}

/**
 * Options for programmatic blur behavior
 */
export interface BlurOptions {
  /** Prevent scrolling when blurring */
  preventScroll?: boolean;
  /** Whether to restore cursor position on next focus */
  restoreCursor?: boolean;
}

/**
 * Event detail for focus state changes
 */
export interface FocusChangeEvent {
  /** Whether the element is now focused */
  focused: boolean;
  /** Current cursor position */
  cursorPosition?: number;
  /** Currently selected text */
  selectedText?: string;
}
