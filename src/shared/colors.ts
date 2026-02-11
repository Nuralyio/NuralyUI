/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Shared preset color definitions for Nuraly UI components
 *
 * These color palettes are used across multiple components (Badge, Tag, Timeline)
 * for consistent color handling. Components should import from this file
 * rather than defining their own duplicate color arrays.
 */

/**
 * Full preset color palette used by Badge and Tag components.
 * These colors are handled via CSS classes rather than inline styles.
 */
export const PRESET_COLORS = [
  'pink', 'red', 'yellow', 'orange', 'cyan', 'green',
  'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime'
] as const;

/**
 * Set version of preset colors for O(1) lookup performance.
 * Preferred when only checking membership (e.g., `isPresetColor`).
 */
export const PRESET_COLOR_SET: ReadonlySet<string> = new Set(PRESET_COLORS);

/**
 * Subset of preset colors used specifically by the Timeline component.
 */
export const TIMELINE_PRESET_COLORS = ['blue', 'red', 'green', 'gray'] as const;

/**
 * Set version of timeline preset colors for O(1) lookup.
 */
export const TIMELINE_PRESET_COLOR_SET: ReadonlySet<string> = new Set(TIMELINE_PRESET_COLORS);

/**
 * Check if a color string is a preset color.
 *
 * @param color - The color string to check
 * @returns true if the color is in the full preset color palette
 */
export function isPresetColor(color: string | undefined): boolean {
  if (!color) return false;
  return PRESET_COLOR_SET.has(color);
}

/**
 * Check if a color string is a timeline preset color.
 *
 * @param color - The color string to check
 * @returns true if the color is in the timeline preset color palette
 */
export function isTimelinePresetColor(color: string | undefined): boolean {
  if (!color) return false;
  return TIMELINE_PRESET_COLOR_SET.has(color);
}
