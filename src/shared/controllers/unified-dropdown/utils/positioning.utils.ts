import type {
  DropdownPosition,
  DropdownSpace,
  DropdownOffset,
  VerticalPlacement,
  HorizontalAlignment,
  PositionResult,
} from '../types/dropdown.types.js';
import { getViewportDimensions } from './dom.utils.js';

/**
 * Calculate available space around trigger element
 */
export function calculateAvailableSpace(triggerElement: HTMLElement): DropdownSpace {
  const triggerRect = triggerElement.getBoundingClientRect();
  const viewport = getViewportDimensions();

  return {
    above: triggerRect.top,
    below: viewport.height - triggerRect.bottom,
    left: triggerRect.left,
    right: viewport.width - triggerRect.right,
  };
}

/**
 * Determine optimal vertical placement
 */
export function determineVerticalPlacement(
  placement: VerticalPlacement,
  dropdownHeight: number,
  space: DropdownSpace
): 'top' | 'bottom' {
  // If placement is explicitly set, use it if there's space
  if (placement === 'top' && space.above >= dropdownHeight) {
    return 'top';
  }
  if (placement === 'bottom' && space.below >= dropdownHeight) {
    return 'bottom';
  }

  // Auto-detect based on available space
  if (placement === 'auto' || placement === 'top' || placement === 'bottom') {
    if (space.below >= dropdownHeight) {
      return 'bottom';
    }
    if (space.above >= dropdownHeight) {
      return 'top';
    }
    // If neither has enough space, choose the side with more space
    return space.above > space.below ? 'top' : 'bottom';
  }

  return 'bottom';
}

/**
 * Determine optimal horizontal alignment
 */
export function determineHorizontalAlignment(
  alignment: HorizontalAlignment,
  dropdownWidth: number,
  space: DropdownSpace,
  triggerWidth: number
): 'left' | 'center' | 'right' {
  // If alignment is explicitly set, use it if there's space
  if (alignment === 'left' && space.right >= dropdownWidth) {
    return 'left';
  }
  if (alignment === 'right' && space.left >= dropdownWidth) {
    return 'right';
  }
  if (alignment === 'center') {
    const requiredSpace = (dropdownWidth - triggerWidth) / 2;
    if (space.left >= requiredSpace && space.right >= requiredSpace) {
      return 'center';
    }
  }

  // Auto-detect based on available space
  if (alignment === 'auto') {
    // Try to align left (dropdown starts at trigger's left edge)
    if (space.right >= dropdownWidth) {
      return 'left';
    }
    // Try to align right (dropdown ends at trigger's right edge)
    if (space.left + triggerWidth >= dropdownWidth) {
      return 'right';
    }
    // Default to left if neither works perfectly
    return 'left';
  }

  return 'left';
}

/**
 * Calculate fixed positioning coordinates
 */
export function calculateFixedPosition(
  triggerElement: HTMLElement,
  dropdownElement: HTMLElement,
  verticalPlacement: 'top' | 'bottom',
  horizontalAlignment: 'left' | 'center' | 'right',
  offset: DropdownOffset
): DropdownPosition {
  const triggerRect = triggerElement.getBoundingClientRect();
  const dropdownRect = dropdownElement.getBoundingClientRect();

  let top: number;
  let left: number;

  // Vertical positioning
  if (verticalPlacement === 'bottom') {
    top = triggerRect.bottom + offset.y;
  } else {
    top = triggerRect.top - dropdownRect.height - offset.y;
  }

  // Horizontal positioning
  if (horizontalAlignment === 'left') {
    left = triggerRect.left + offset.x;
  } else if (horizontalAlignment === 'right') {
    left = triggerRect.right - dropdownRect.width - offset.x;
  } else {
    // center
    left = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2 + offset.x;
  }

  return {
    top,
    left,
    width: dropdownRect.width,
    placement: verticalPlacement,
    alignment: horizontalAlignment,
  };
}

/**
 * Calculate absolute positioning coordinates (relative to trigger)
 */
export function calculateAbsolutePosition(
  triggerElement: HTMLElement,
  dropdownElement: HTMLElement,
  verticalPlacement: 'top' | 'bottom',
  horizontalAlignment: 'left' | 'center' | 'right',
  offset: DropdownOffset
): DropdownPosition {
  const triggerRect = triggerElement.getBoundingClientRect();
  const dropdownRect = dropdownElement.getBoundingClientRect();

  let top: number;
  let left: number;

  // Vertical positioning (relative to trigger)
  if (verticalPlacement === 'bottom') {
    top = triggerRect.height + offset.y;
  } else {
    top = -(dropdownRect.height + offset.y);
  }

  // Horizontal positioning
  if (horizontalAlignment === 'left') {
    left = offset.x;
  } else if (horizontalAlignment === 'right') {
    left = triggerRect.width - dropdownRect.width - offset.x;
  } else {
    // center
    left = (triggerRect.width - dropdownRect.width) / 2 + offset.x;
  }

  return {
    top,
    left,
    width: dropdownRect.width,
    placement: verticalPlacement,
    alignment: horizontalAlignment,
  };
}

/**
 * Constrain position to viewport boundaries
 */
export function constrainToViewport(position: DropdownPosition, dropdownElement: HTMLElement): DropdownPosition {
  const viewport = getViewportDimensions();
  const dropdownRect = dropdownElement.getBoundingClientRect();

  let { top, left } = position;

  // Constrain horizontally
  if (left < 0) {
    left = 0;
  } else if (left + dropdownRect.width > viewport.width) {
    left = viewport.width - dropdownRect.width;
  }

  // Constrain vertically
  if (top < 0) {
    top = 0;
  } else if (top + dropdownRect.height > viewport.height) {
    top = viewport.height - dropdownRect.height;
  }

  return {
    ...position,
    top: Math.max(0, top),
    left: Math.max(0, left),
  };
}

/**
 * Get dropdown element dimensions (handling hidden elements)
 */
export function getDropdownDimensions(
  dropdownElement: HTMLElement
): { width: number; height: number } {
  // If element is visible, get actual dimensions
  const computedStyle = window.getComputedStyle(dropdownElement);
  if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
    return {
      width: dropdownElement.offsetWidth,
      height: dropdownElement.offsetHeight,
    };
  }

  // For hidden elements, temporarily make visible to measure
  const originalDisplay = dropdownElement.style.display;
  const originalVisibility = dropdownElement.style.visibility;
  const originalPosition = dropdownElement.style.position;

  dropdownElement.style.visibility = 'hidden';
  dropdownElement.style.display = 'block';
  dropdownElement.style.position = 'absolute';

  const dimensions = {
    width: dropdownElement.offsetWidth || dropdownElement.scrollWidth || 200,
    height: dropdownElement.offsetHeight || dropdownElement.scrollHeight || 200,
  };

  // Restore original styles
  dropdownElement.style.display = originalDisplay;
  dropdownElement.style.visibility = originalVisibility;
  dropdownElement.style.position = originalPosition;

  return dimensions;
}

/**
 * Calculate maximum available height for dropdown
 */
export function calculateMaxHeight(
  triggerElement: HTMLElement,
  verticalPlacement: 'top' | 'bottom',
  offset: DropdownOffset,
  margin = 10
): number {
  const triggerRect = triggerElement.getBoundingClientRect();
  const viewport = getViewportDimensions();

  if (verticalPlacement === 'bottom') {
    return viewport.height - triggerRect.bottom - offset.y - margin;
  } else {
    return triggerRect.top - offset.y - margin;
  }
}

/**
 * Calculate complete position with constraints
 */
export function calculateCompletePosition(
  triggerElement: HTMLElement,
  dropdownElement: HTMLElement,
  verticalPlacement: VerticalPlacement,
  horizontalAlignment: HorizontalAlignment,
  offset: DropdownOffset,
  positioning: 'fixed' | 'absolute',
  constrainToViewportBounds: boolean
): PositionResult {
  const space = calculateAvailableSpace(triggerElement);
  const dimensions = getDropdownDimensions(dropdownElement);
  const triggerRect = triggerElement.getBoundingClientRect();

  const finalVerticalPlacement = determineVerticalPlacement(
    verticalPlacement,
    dimensions.height,
    space
  );

  const finalHorizontalAlignment = determineHorizontalAlignment(
    horizontalAlignment,
    dimensions.width,
    space,
    triggerRect.width
  );

  let position: DropdownPosition;
  if (positioning === 'fixed') {
    position = calculateFixedPosition(
      triggerElement,
      dropdownElement,
      finalVerticalPlacement,
      finalHorizontalAlignment,
      offset
    );
  } else {
    position = calculateAbsolutePosition(
      triggerElement,
      dropdownElement,
      finalVerticalPlacement,
      finalHorizontalAlignment,
      offset
    );
  }

  let constrained = false;
  if (constrainToViewportBounds && positioning === 'fixed') {
    const constrainedPosition = constrainToViewport(position, dropdownElement);
    constrained = constrainedPosition.top !== position.top || constrainedPosition.left !== position.left;
    position = constrainedPosition;
  }

  return {
    position,
    space,
    constrained,
  };
}
