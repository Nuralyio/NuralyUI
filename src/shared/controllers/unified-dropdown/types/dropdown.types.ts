import { ReactiveControllerHost } from 'lit';

/**
 * Positioning strategies for dropdown
 */
export type PositioningStrategy = 'fixed' | 'absolute';

/**
 * Vertical placement options
 */
export type VerticalPlacement = 'top' | 'bottom' | 'auto';

/**
 * Horizontal alignment options
 */
export type HorizontalAlignment = 'left' | 'center' | 'right' | 'auto';

/**
 * Trigger mode options
 */
export type TriggerMode = 'click' | 'hover' | 'focus' | 'manual';

/**
 * Scroll behavior options
 */
export type ScrollBehavior = 'reposition' | 'close' | 'none';

/**
 * Dropdown position information
 */
export interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  placement: 'top' | 'bottom';
  alignment?: 'left' | 'center' | 'right';
}

/**
 * Available space around trigger element
 */
export interface DropdownSpace {
  above: number;
  below: number;
  left: number;
  right: number;
}

/**
 * Offset for dropdown positioning
 */
export interface DropdownOffset {
  x: number;
  y: number;
}

/**
 * Configuration options for unified dropdown controller
 */
export interface UnifiedDropdownConfig {
  // Positioning
  positioning?: PositioningStrategy;
  placement?: VerticalPlacement;
  alignment?: HorizontalAlignment;
  offset?: DropdownOffset;

  // Triggers
  trigger?: TriggerMode;
  hoverDelay?: number;

  // Behavior
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  scrollBehavior?: ScrollBehavior;

  // Constraints
  constrainToViewport?: boolean;
  minWidth?: number | 'trigger';
  maxWidth?: number;
  maxHeight?: number;

  // Advanced
  cascading?: boolean;
  customPositionFn?: (position: DropdownPosition) => DropdownPosition;
  excludeClickOutside?: string[];
  autoClose?: boolean;
  disabled?: boolean;

  // z-index
  zIndex?: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_DROPDOWN_CONFIG: Required<Omit<UnifiedDropdownConfig, 'customPositionFn' | 'excludeClickOutside' | 'maxWidth' | 'maxHeight' | 'minWidth'>> = {
  positioning: 'fixed',
  placement: 'auto',
  alignment: 'auto',
  offset: { x: 0, y: 0 },
  trigger: 'click',
  hoverDelay: 200,
  closeOnClickOutside: true,
  closeOnEscape: true,
  scrollBehavior: 'reposition',
  constrainToViewport: true,
  cascading: false,
  autoClose: true,
  disabled: false,
  zIndex: 9999,
};

/**
 * Host interface for components using dropdown functionality
 */
export interface DropdownHost extends ReactiveControllerHost {
  requestUpdate(): void;
  dispatchEvent(event: Event): boolean;
  disabled?: boolean;
}

/**
 * Events dispatched by the dropdown controller
 */
export interface DropdownEvents {
  'dropdown-open': CustomEvent<{ dropdown: any }>;
  'dropdown-close': CustomEvent<{ dropdown: any }>;
  'dropdown-reposition': CustomEvent<{ position: DropdownPosition }>;
  'dropdown-before-open': CustomEvent<{ dropdown: any }>;
  'dropdown-before-close': CustomEvent<{ dropdown: any }>;
}

/**
 * Result of position calculation
 */
export interface PositionResult {
  position: DropdownPosition;
  space: DropdownSpace;
  constrained: boolean;
}
