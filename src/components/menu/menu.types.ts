/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

export { EMPTY_STRING } from '../../shared/constants.js';

/**
 * Menu size variants
 */
export { ComponentSize as MenuSize } from '../../shared/enums.js';

/**
 * Icon position in menu items
 */
import { IconPosition } from '../../shared/enums.js';
export { IconPosition };

/**
 * Menu item configuration interface
 */
export interface IMenu {
  /** Display text for the menu item */
  text: string;
  /** URL link for navigation */
  link?: string;
  /** Menu configuration with icon and actions */
  menu?: { icon: string; actions: IAction[] };
  /** Status indicator with icon and label */
  status?: { icon: string; label: string };
  /** Icon name */
  icon?: string;
  /** Icon position (left or right) */
  iconPosition?: IconPosition | string;
  /** Whether the menu item is selected */
  selected?: boolean;
  /** Whether the menu item is disabled */
  disabled?: boolean;
  /** Whether the submenu is opened */
  opened?: boolean;
  /** Whether the menu item label can be edited (double-click to edit) */
  editable?: boolean;
  /** Child menu items for nested menus */
  children?: IMenu[];
}

/**
 * Menu action configuration interface
 */
export interface IAction {
  /** Action label */
  label: string;
  /** Action value */
  value: string;
  /** Action icon */
  icon?: string;
}
