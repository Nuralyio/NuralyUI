/**
 * Unified Dropdown Controller
 * Consolidated dropdown functionality for all UI components
 */

export { UnifiedDropdownController } from './unified-dropdown.controller.js';

export type {
  UnifiedDropdownConfig,
  DropdownPosition,
  DropdownSpace,
  DropdownOffset,
  DropdownHost,
  DropdownEvents,
  PositionResult,
  PositioningStrategy,
  VerticalPlacement,
  HorizontalAlignment,
  TriggerMode,
  ScrollBehavior,
} from './types/dropdown.types.js';

export { DEFAULT_DROPDOWN_CONFIG } from './types/dropdown.types.js';

export * from './utils/dom.utils.js';
export * from './utils/positioning.utils.js';
