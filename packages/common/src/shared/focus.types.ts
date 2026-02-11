/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Shared focus/blur interfaces for form components
 */

export interface FocusOptions {
  preventScroll?: boolean;
  cursor?: 'start' | 'end' | 'all' | number;
  select?: boolean;
}

export interface BlurOptions {
  preventScroll?: boolean;
  restoreCursor?: boolean;
}

export interface FocusChangeEvent {
  focused: boolean;
  cursorPosition?: number;
  selectedText?: string;
}
