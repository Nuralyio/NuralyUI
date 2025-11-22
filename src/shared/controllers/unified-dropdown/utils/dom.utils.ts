/**
 * DOM utility functions for dropdown controller
 */

/**
 * Check if an element is within another element, accounting for shadow DOM
 */
export function isElementWithin(target: Element, container: Element | null): boolean {
  if (!container) return false;

  // Direct containment check
  if (container.contains(target)) {
    return true;
  }

  // Check composed path (includes shadow DOM boundaries)
  const composedPath = getComposedPath(target);
  for (const element of composedPath) {
    if (element === container) {
      return true;
    }
    if (element instanceof Element && container.contains(element)) {
      return true;
    }
  }

  return false;
}

/**
 * Get the composed path for an element (includes shadow DOM)
 */
export function getComposedPath(element: Element): Element[] {
  const path: Element[] = [];
  let current: Element | null = element;

  while (current) {
    path.push(current);
    const root = current.getRootNode();

    if (root instanceof ShadowRoot && root.host) {
      current = root.host as Element;
    } else {
      break;
    }
  }

  return path;
}

/**
 * Check if an element or any of its ancestors matches a selector
 */
export function matchesOrClosest(element: Element, selector: string): boolean {
  if (element.matches(selector)) {
    return true;
  }

  const closest = element.closest(selector);
  return closest !== null;
}

/**
 * Find an element within a shadow root or regular DOM
 */
export function findElement(root: Element | ShadowRoot | Document, selector: string): HTMLElement | null {
  if (root instanceof Element && root.shadowRoot) {
    return root.shadowRoot.querySelector<HTMLElement>(selector);
  }
  return root.querySelector<HTMLElement>(selector);
}

/**
 * Check if element is currently focused
 */
export function isElementFocused(element: HTMLElement | null): boolean {
  if (!element) return false;

  const activeElement = document.activeElement;
  if (!activeElement) return false;

  // Direct focus check
  if (element.contains(activeElement)) {
    return true;
  }

  // Check shadow DOM
  let current: Element | null = activeElement;
  while (current) {
    const root = current.getRootNode();
    if (root instanceof ShadowRoot && root.host) {
      if (element.contains(root.host)) {
        return true;
      }
      current = root.host;
    } else {
      break;
    }
  }

  return false;
}

/**
 * Check if element is currently being hovered
 */
export function isElementHovered(element: HTMLElement | null): boolean {
  if (!element) return false;
  return element.matches(':hover');
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions(): { width: number; height: number } {
  return {
    width: window.visualViewport?.width || window.innerWidth,
    height: window.visualViewport?.height || window.innerHeight,
  };
}

/**
 * Get scroll position
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  };
}

/**
 * Check if element is visible in viewport
 */
export function isElementInViewport(element: HTMLElement, threshold = 0): boolean {
  const rect = element.getBoundingClientRect();
  const viewport = getViewportDimensions();

  return (
    rect.bottom >= threshold &&
    rect.top <= viewport.height - threshold &&
    rect.right >= threshold &&
    rect.left <= viewport.width - threshold
  );
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Request animation frame helper
 */
export function nextFrame(callback: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}
