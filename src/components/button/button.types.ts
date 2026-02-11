export const enum ButtonType {
  Primary = 'primary',
  Secondary = 'secondary',
  Danger = 'danger',
  Ghost = 'ghost',
  Default = 'default',
}

export { ComponentSize as ButtonSize } from '../../shared/enums.js';

export const enum ButtonShape {
  Default = 'default',
  Circle = 'circle',
  Round = 'round',
}

export { IconPosition } from '../../shared/enums.js';

/**
 * Enhanced icon configuration for buttons
 */
export interface ButtonIconConfig {
  /** Icon name (required) */
  name: string;
  /** Icon type - solid or regular */
  type?: 'solid' | 'regular';
  /** Icon size override */
  size?: string;
  /** Icon color override */
  color?: string;
  /** Alternative text for accessibility */
  alt?: string;
  /** Custom attributes to pass to icon */
  attributes?: Record<string, string>;
}

/**
 * Union type for icon input - supports both simple string and enhanced config
 */
export type ButtonIcon = string | ButtonIconConfig;

/**
 * Array of icons (supports 1-2 icons)
 */
export type ButtonIcons = ButtonIcon[];

/**
 * Alternative icon configuration using positioned properties
 */
export interface ButtonIconsConfig {
  /** Left icon configuration */
  left?: ButtonIcon;
  /** Right icon configuration */
  right?: ButtonIcon;
}

export { EMPTY_STRING } from '../../shared/constants.js';
