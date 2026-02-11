/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * Shared enums for Nuraly UI components
 *
 * These enums represent common patterns used across multiple components.
 * Components should import from this file rather than defining their own
 * duplicate enums.
 */

/**
 * Common component size options (small, medium, large)
 * Used by: Button, Input, Textarea, Tabs, Dropdown, ColorPicker, Menu,
 * Skeleton, IconPicker, Collapse, and other components.
 */
export const enum ComponentSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

/**
 * Common component state for form elements
 * Used by: Input, Textarea, Alert, Toast
 */
export const enum ComponentState {
  Default = 'default',
  Error = 'error',
  Warning = 'warning',
  Success = 'success',
}

/**
 * Common input variant options
 * Used by: Input, Textarea
 */
export const enum InputVariant {
  Outlined = 'outlined',
  Filled = 'filled',
  Borderless = 'borderless',
  Underlined = 'underlined',
}

/**
 * Common trigger types for popups/dropdowns
 * Used by: ColorPicker, IconPicker, Dropdown
 */
export const enum TriggerType {
  Click = 'click',
  Hover = 'hover',
  Focus = 'focus',
  Manual = 'manual',
}

/**
 * Common icon position options
 * Used by: Button, Menu
 */
export const enum IconPosition {
  Left = 'left',
  Right = 'right',
}
