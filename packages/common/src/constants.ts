/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * Shared constants for Nuraly UI components
 * 
 * @module @nuralyui/common/constants
 * 
 * @example
 * ```typescript
 * import { COMPONENT_PREFIX } from '@nuralyui/common/constants';
 * ```
 */

// Export shared constants
export { EMPTY_STRING } from './shared/constants.js';

// Export shared enums
export {
  ComponentSize,
  ComponentState,
  InputVariant,
  TriggerType,
  IconPosition,
} from './shared/enums.js';

// Export shared color constants
export {
  PRESET_COLORS,
  PRESET_COLOR_SET,
  TIMELINE_PRESET_COLORS,
  TIMELINE_PRESET_COLOR_SET,
  isPresetColor,
  isTimelinePresetColor,
} from './shared/colors.js';

// Export shared focus types
export type {
  FocusOptions,
  BlurOptions,
  FocusChangeEvent,
} from './shared/focus.types.js';
