/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

// Export all shared mixins and utilities
export { NuralyUIBaseMixin, BaseMixin, type NuralyUIBaseElement } from './base-mixin.js';
export { ThemeAwareMixin, type ThemeAware } from './theme-mixin.js';
export { DependencyValidationMixin, type DependencyAware } from './dependency-mixin.js';
export { EventHandlerMixin, type EventHandlerCapable } from './event-handler-mixin.js';

// Export utility functions
export { throttle, debounce, rafThrottle } from './utils.js';

// Export positioning utilities
export * from './utils/index.js';

// Export shared controllers
export * from './controllers/index.js';

// Export shared validation types
export * from './validation.types.js';

// Export shared constants
export { EMPTY_STRING } from './constants.js';

// Export shared enums
export {
  ComponentSize,
  ComponentState,
  InputVariant,
  TriggerType,
  IconPosition,
} from './enums.js';

// Export shared color constants
export {
  PRESET_COLORS,
  PRESET_COLOR_SET,
  TIMELINE_PRESET_COLORS,
  TIMELINE_PRESET_COLOR_SET,
  isPresetColor,
  isTimelinePresetColor,
} from './colors.js';

// Export shared focus types
export type {
  FocusOptions,
  BlurOptions,
  FocusChangeEvent,
} from './focus.types.js';
