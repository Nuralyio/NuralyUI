import { ReactiveController } from 'lit';
import type {
  UnifiedDropdownConfig,
  DropdownHost,
  DropdownPosition,
  DropdownSpace,
  PositionResult,
} from './types/dropdown.types.js';
import { DEFAULT_DROPDOWN_CONFIG } from './types/dropdown.types.js';
import {
  isElementWithin,
  isElementFocused,
  isElementHovered,
  isElementInViewport,
  debounce,
  nextFrame,
} from './utils/dom.utils.js';
import {
  calculateAvailableSpace,
  calculateCompletePosition,
  calculateMaxHeight,
} from './utils/positioning.utils.js';

/**
 * Unified dropdown controller for all dropdown-like components
 * Provides comprehensive dropdown functionality with positioning, events, and interactions
 */
export class UnifiedDropdownController implements ReactiveController {
  private host: DropdownHost;
  private config: Required<Omit<UnifiedDropdownConfig, 'customPositionFn' | 'excludeClickOutside' | 'maxWidth' | 'maxHeight' | 'minWidth'>> &
    Pick<UnifiedDropdownConfig, 'customPositionFn' | 'excludeClickOutside' | 'maxWidth' | 'maxHeight' | 'minWidth'>;

  private _isOpen = false;
  private _position: DropdownPosition = { top: 0, left: 0, width: 0, placement: 'bottom' };
  private _dropdownElement: HTMLElement | null = null;
  private _triggerElement: HTMLElement | null = null;

  // Event handlers
  private _outsideClickHandler: ((event: Event) => void) | null = null;
  private _keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  private _scrollHandler: (() => void) | null = null;
  private _resizeHandler: (() => void) | null = null;
  private _triggerClickHandler: ((event: Event) => void) | null = null;
  private _triggerHoverHandler: ((event: Event) => void) | null = null;
  private _triggerLeaveHandler: ((event: Event) => void) | null = null;
  private _triggerFocusHandler: ((event: Event) => void) | null = null;
  private _triggerBlurHandler: ((event: Event) => void) | null = null;
  private _dropdownHoverHandler: ((event: Event) => void) | null = null;
  private _dropdownLeaveHandler: ((event: Event) => void) | null = null;

  // Timers
  private _hoverTimer: number | null = null;
  private _closeTimer: number | null = null;

  constructor(host: DropdownHost, config: UnifiedDropdownConfig = {}) {
    this.host = host;
    this.config = { ...DEFAULT_DROPDOWN_CONFIG, ...config };
    this.host.addController(this);
  }

  /**
   * Get open state
   */
  get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   * Get current position
   */
  get position(): DropdownPosition {
    return { ...this._position };
  }

  /**
   * Get available space around trigger
   */
  getAvailableSpace(): DropdownSpace {
    if (!this._triggerElement) {
      return { above: 0, below: 0, left: 0, right: 0 };
    }
    return calculateAvailableSpace(this._triggerElement);
  }

  /**
   * Set dropdown and trigger elements
   */
  setElements(dropdownElement: HTMLElement, triggerElement: HTMLElement): void {
    this._dropdownElement = dropdownElement;
    this._triggerElement = triggerElement;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<UnifiedDropdownConfig>): void {
    this.config = { ...this.config, ...config };
    if (this._isOpen) {
      this.calculatePosition();
    }
  }

  /**
   * Open dropdown
   */
  open(): void {
    if (this._isOpen || this.config.disabled || this.host.disabled) {
      return;
    }

    // Dispatch before-open event
    const beforeOpenEvent = new CustomEvent('dropdown-before-open', {
      bubbles: true,
      composed: true,
      detail: { dropdown: this.host },
      cancelable: true,
    });

    if (!this.host.dispatchEvent(beforeOpenEvent)) {
      return; // Event was cancelled
    }

    this._isOpen = true;
    this.host.requestUpdate();

    // Wait for DOM update, then calculate position
    nextFrame(() => {
      this.calculatePosition();
      this.setupEventListeners();

      // Dispatch open event
      this.host.dispatchEvent(
        new CustomEvent('dropdown-open', {
          bubbles: true,
          composed: true,
          detail: { dropdown: this.host },
        })
      );
    });
  }

  /**
   * Close dropdown
   */
  close(): void {
    if (!this._isOpen) {
      return;
    }

    // Dispatch before-close event
    const beforeCloseEvent = new CustomEvent('dropdown-before-close', {
      bubbles: true,
      composed: true,
      detail: { dropdown: this.host },
      cancelable: true,
    });

    if (!this.host.dispatchEvent(beforeCloseEvent)) {
      return; // Event was cancelled
    }

    this._isOpen = false;
    this.removeEventListeners();
    this.resetPosition();
    this.host.requestUpdate();

    // Dispatch close event
    this.host.dispatchEvent(
      new CustomEvent('dropdown-close', {
        bubbles: true,
        composed: true,
        detail: { dropdown: this.host },
      })
    );
  }

  /**
   * Toggle dropdown
   */
  toggle(): void {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Calculate and apply dropdown position
   */
  calculatePosition(): void {
    if (!this._dropdownElement || !this._triggerElement) {
      return;
    }

    try {
      const result: PositionResult = calculateCompletePosition(
        this._triggerElement,
        this._dropdownElement,
        this.config.placement,
        this.config.alignment,
        this.config.offset,
        this.config.positioning,
        this.config.constrainToViewport
      );

      // Apply custom position function if provided
      if (this.config.customPositionFn) {
        result.position = this.config.customPositionFn(result.position);
      }

      this._position = result.position;
      this.applyPosition();

      // Dispatch reposition event
      this.host.dispatchEvent(
        new CustomEvent('dropdown-reposition', {
          bubbles: true,
          composed: true,
          detail: { position: this._position },
        })
      );
    } catch (error) {
      console.error('UnifiedDropdownController: Error calculating position', error);
    }
  }

  /**
   * Reset dropdown position styles
   */
  resetPosition(): void {
    if (!this._dropdownElement) return;

    this._dropdownElement.style.removeProperty('position');
    this._dropdownElement.style.removeProperty('top');
    this._dropdownElement.style.removeProperty('bottom');
    this._dropdownElement.style.removeProperty('left');
    this._dropdownElement.style.removeProperty('right');
    this._dropdownElement.style.removeProperty('width');
    this._dropdownElement.style.removeProperty('min-width');
    this._dropdownElement.style.removeProperty('max-width');
    this._dropdownElement.style.removeProperty('max-height');
    this._dropdownElement.style.removeProperty('z-index');
    this._dropdownElement.style.removeProperty('overflow-y');
    this._dropdownElement.classList.remove(
      'placement-top',
      'placement-bottom',
      'alignment-left',
      'alignment-center',
      'alignment-right'
    );
  }

  /**
   * Apply calculated position to dropdown element
   */
  private applyPosition(): void {
    if (!this._dropdownElement || !this._triggerElement) return;

    const { positioning } = this.config;
    const { placement, alignment } = this._position;

    // Set positioning mode
    this._dropdownElement.style.position = positioning;
    this._dropdownElement.style.zIndex = this.config.zIndex.toString();

    if (positioning === 'fixed') {
      this.applyFixedPosition();
    } else {
      this.applyAbsolutePosition();
    }

    // Apply placement classes
    this._dropdownElement.classList.remove('placement-top', 'placement-bottom');
    this._dropdownElement.classList.add(`placement-${placement}`);

    if (alignment) {
      this._dropdownElement.classList.remove('alignment-left', 'alignment-center', 'alignment-right');
      this._dropdownElement.classList.add(`alignment-${alignment}`);
    }

    // Apply width constraints
    this.applyWidthConstraints();

    // Apply height constraints
    this.applyHeightConstraints();
  }

  /**
   * Apply fixed positioning
   */
  private applyFixedPosition(): void {
    if (!this._dropdownElement) return;

    this._dropdownElement.style.top = `${this._position.top}px`;
    this._dropdownElement.style.left = `${this._position.left}px`;
    this._dropdownElement.style.bottom = 'auto';
    this._dropdownElement.style.right = 'auto';
  }

  /**
   * Apply absolute positioning
   */
  private applyAbsolutePosition(): void {
    if (!this._dropdownElement || !this._triggerElement) return;

    const { placement } = this._position;
    const triggerRect = this._triggerElement.getBoundingClientRect();

    // Vertical positioning
    if (placement === 'bottom') {
      this._dropdownElement.style.top = '100%';
      this._dropdownElement.style.bottom = 'auto';
    } else {
      this._dropdownElement.style.top = 'auto';
      this._dropdownElement.style.bottom = '100%';
    }

    // Horizontal positioning
    this._dropdownElement.style.left = '0';
    this._dropdownElement.style.right = 'auto';

    // Match trigger width if configured
    if (this.config.minWidth === 'trigger') {
      this._dropdownElement.style.minWidth = `${triggerRect.width}px`;
    }
  }

  /**
   * Apply width constraints
   */
  private applyWidthConstraints(): void {
    if (!this._dropdownElement || !this._triggerElement) return;

    const triggerRect = this._triggerElement.getBoundingClientRect();

    if (typeof this.config.minWidth === 'number') {
      this._dropdownElement.style.minWidth = `${this.config.minWidth}px`;
    } else if (this.config.minWidth === 'trigger') {
      this._dropdownElement.style.minWidth = `${triggerRect.width}px`;
    }

    if (this.config.maxWidth) {
      this._dropdownElement.style.maxWidth = `${this.config.maxWidth}px`;
    }
  }

  /**
   * Apply height constraints
   */
  private applyHeightConstraints(): void {
    if (!this._dropdownElement || !this._triggerElement) return;

    const maxHeight = calculateMaxHeight(
      this._triggerElement,
      this._position.placement,
      this.config.offset
    );

    const constrainedMaxHeight = this.config.maxHeight
      ? Math.min(maxHeight, this.config.maxHeight)
      : maxHeight;

    this._dropdownElement.style.maxHeight = `${constrainedMaxHeight}px`;
    this._dropdownElement.style.overflowY = 'auto';
  }

  /**
   * Setup all event listeners
   */
  private setupEventListeners(): void {
    this.setupTriggerListeners();
    this.setupDocumentListeners();
    this.setupWindowListeners();
    this.setupDropdownListeners();
  }

  /**
   * Setup trigger element listeners
   */
  private setupTriggerListeners(): void {
    if (!this._triggerElement || this.config.trigger === 'manual') return;

    this.removeTriggerListeners();

    switch (this.config.trigger) {
      case 'click':
        this._triggerClickHandler = this.handleTriggerClick.bind(this);
        this._triggerElement.addEventListener('click', this._triggerClickHandler);
        break;

      case 'hover':
        this._triggerHoverHandler = this.handleTriggerHover.bind(this);
        this._triggerLeaveHandler = this.handleTriggerLeave.bind(this);
        this._triggerElement.addEventListener('mouseenter', this._triggerHoverHandler);
        this._triggerElement.addEventListener('mouseleave', this._triggerLeaveHandler);
        break;

      case 'focus':
        this._triggerFocusHandler = this.handleTriggerFocus.bind(this);
        this._triggerBlurHandler = this.handleTriggerBlur.bind(this);
        this._triggerElement.addEventListener('focusin', this._triggerFocusHandler);
        this._triggerElement.addEventListener('focusout', this._triggerBlurHandler);
        break;
    }
  }

  /**
   * Setup document listeners
   */
  private setupDocumentListeners(): void {
    if (this.config.closeOnClickOutside) {
      this._outsideClickHandler = this.handleOutsideClick.bind(this);
      document.addEventListener('click', this._outsideClickHandler, true);
    }

    if (this.config.closeOnEscape) {
      this._keydownHandler = this.handleKeydown.bind(this);
      document.addEventListener('keydown', this._keydownHandler);
    }
  }

  /**
   * Setup window listeners
   */
  private setupWindowListeners(): void {
    this._scrollHandler = debounce(this.handleScroll.bind(this), 16);
    this._resizeHandler = debounce(this.handleResize.bind(this), 100);

    window.addEventListener('scroll', this._scrollHandler, true);
    window.addEventListener('resize', this._resizeHandler);
  }

  /**
   * Setup dropdown hover listeners (for hover trigger mode)
   */
  private setupDropdownListeners(): void {
    if (this.config.trigger === 'hover' && this._dropdownElement) {
      this._dropdownHoverHandler = this.handleDropdownHover.bind(this);
      this._dropdownLeaveHandler = this.handleDropdownLeave.bind(this);
      this._dropdownElement.addEventListener('mouseenter', this._dropdownHoverHandler);
      this._dropdownElement.addEventListener('mouseleave', this._dropdownLeaveHandler);
    }
  }

  /**
   * Remove all event listeners
   */
  private removeEventListeners(): void {
    this.removeTriggerListeners();
    this.removeDocumentListeners();
    this.removeWindowListeners();
    this.removeDropdownListeners();
  }

  /**
   * Remove trigger listeners
   */
  private removeTriggerListeners(): void {
    if (!this._triggerElement) return;

    if (this._triggerClickHandler) {
      this._triggerElement.removeEventListener('click', this._triggerClickHandler);
      this._triggerClickHandler = null;
    }
    if (this._triggerHoverHandler) {
      this._triggerElement.removeEventListener('mouseenter', this._triggerHoverHandler);
      this._triggerHoverHandler = null;
    }
    if (this._triggerLeaveHandler) {
      this._triggerElement.removeEventListener('mouseleave', this._triggerLeaveHandler);
      this._triggerLeaveHandler = null;
    }
    if (this._triggerFocusHandler) {
      this._triggerElement.removeEventListener('focusin', this._triggerFocusHandler);
      this._triggerFocusHandler = null;
    }
    if (this._triggerBlurHandler) {
      this._triggerElement.removeEventListener('focusout', this._triggerBlurHandler);
      this._triggerBlurHandler = null;
    }
  }

  /**
   * Remove document listeners
   */
  private removeDocumentListeners(): void {
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler, true);
      this._outsideClickHandler = null;
    }
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
      this._keydownHandler = null;
    }
  }

  /**
   * Remove window listeners
   */
  private removeWindowListeners(): void {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler, true);
      this._scrollHandler = null;
    }
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
  }

  /**
   * Remove dropdown listeners
   */
  private removeDropdownListeners(): void {
    if (this._dropdownElement) {
      if (this._dropdownHoverHandler) {
        this._dropdownElement.removeEventListener('mouseenter', this._dropdownHoverHandler);
        this._dropdownHoverHandler = null;
      }
      if (this._dropdownLeaveHandler) {
        this._dropdownElement.removeEventListener('mouseleave', this._dropdownLeaveHandler);
        this._dropdownLeaveHandler = null;
      }
    }
  }

  /**
   * Handle trigger click
   */
  private handleTriggerClick(event: Event): void {
    if (this.config.disabled || this.host.disabled) return;
    event.stopPropagation();
    this.toggle();
  }

  /**
   * Handle trigger hover
   */
  private handleTriggerHover(): void {
    if (this.config.disabled || this.host.disabled) return;

    if (this._hoverTimer) {
      clearTimeout(this._hoverTimer);
    }

    this._hoverTimer = window.setTimeout(() => {
      this.open();
    }, this.config.hoverDelay);
  }

  /**
   * Handle trigger leave
   */
  private handleTriggerLeave(): void {
    if (this._hoverTimer) {
      clearTimeout(this._hoverTimer);
      this._hoverTimer = null;
    }

    this._closeTimer = window.setTimeout(() => {
      if (!isElementHovered(this._dropdownElement)) {
        this.close();
      }
    }, 100);
  }

  /**
   * Handle dropdown hover
   */
  private handleDropdownHover(): void {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  /**
   * Handle dropdown leave
   */
  private handleDropdownLeave(): void {
    this._closeTimer = window.setTimeout(() => {
      if (!isElementHovered(this._triggerElement)) {
        this.close();
      }
    }, 100);
  }

  /**
   * Handle trigger focus
   */
  private handleTriggerFocus(): void {
    if (this.config.disabled || this.host.disabled) return;
    this.open();
  }

  /**
   * Handle trigger blur
   */
  private handleTriggerBlur(): void {
    setTimeout(() => {
      if (!isElementFocused(this._dropdownElement)) {
        this.close();
      }
    }, 100);
  }

  /**
   * Handle outside click
   */
  private handleOutsideClick(event: Event): void {
    const target = event.target as Element;

    // Check if click is on trigger or dropdown
    if (
      isElementWithin(target, this._triggerElement) ||
      isElementWithin(target, this._dropdownElement)
    ) {
      return;
    }

    // Check exclude selectors
    if (this.config.excludeClickOutside) {
      for (const selector of this.config.excludeClickOutside) {
        if (target.closest(selector)) {
          return;
        }
      }
    }

    this.close();
  }

  /**
   * Handle keydown
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  /**
   * Handle scroll
   */
  private handleScroll(): void {
    if (!this._isOpen) return;

    if (this.config.scrollBehavior === 'close') {
      if (this._triggerElement && !isElementInViewport(this._triggerElement)) {
        this.close();
      }
    } else if (this.config.scrollBehavior === 'reposition') {
      this.calculatePosition();
    }
  }

  /**
   * Handle resize
   */
  private handleResize(): void {
    if (this._isOpen) {
      this.calculatePosition();
    }
  }

  /**
   * Cleanup
   */
  private cleanup(): void {
    this.removeEventListeners();

    if (this._hoverTimer) {
      clearTimeout(this._hoverTimer);
      this._hoverTimer = null;
    }

    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = null;
    }
  }

  /**
   * Lifecycle: Connected
   */
  hostConnected(): void {
    // Setup initial listeners if needed
  }

  /**
   * Lifecycle: Disconnected
   */
  hostDisconnected(): void {
    this.cleanup();
  }

  /**
   * Lifecycle: Updated
   */
  hostUpdated?(): void {
    // Re-setup trigger listeners if elements changed
    if (this.config.trigger !== 'manual' && !this._triggerClickHandler && !this._triggerHoverHandler && !this._triggerFocusHandler) {
      this.setupTriggerListeners();
    }
  }
}
