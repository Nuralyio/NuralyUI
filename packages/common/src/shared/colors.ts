/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Shared preset color definitions for Nuraly UI components
 */

export const PRESET_COLORS = [
  'pink', 'red', 'yellow', 'orange', 'cyan', 'green',
  'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime'
] as const;

export const PRESET_COLOR_SET: ReadonlySet<string> = new Set(PRESET_COLORS);

export const TIMELINE_PRESET_COLORS = ['blue', 'red', 'green', 'gray'] as const;

export const TIMELINE_PRESET_COLOR_SET: ReadonlySet<string> = new Set(TIMELINE_PRESET_COLORS);

export function isPresetColor(color: string | undefined): boolean {
  if (!color) return false;
  return PRESET_COLOR_SET.has(color);
}

export function isTimelinePresetColor(color: string | undefined): boolean {
  if (!color) return false;
  return TIMELINE_PRESET_COLOR_SET.has(color);
}
