/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type { ReactiveControllerHost } from 'lit';
import type { NrMenuElement } from '../menu.component.js';
import type { MenuController } from '../interfaces/index.js';
import { BaseComponentController, type BaseControllerHost } from '../../../shared/controllers/base.controller.js';

/**
 * Base controller class for all menu controllers.
 * Extends the shared BaseComponentController with NrMenuElement-specific typing
 * and provides DOM query helpers for menu navigation.
 */
export class BaseMenuController
  extends BaseComponentController<NrMenuElement & BaseControllerHost>
  implements MenuController {

  constructor(host: NrMenuElement & ReactiveControllerHost) {
    super(host);
  }

  /**
   * Dispatch a named custom event from the host element.
   * Overrides the base to accept event name + detail directly.
   */
  protected override dispatchEvent(
    eventOrName: CustomEvent | string,
    detail?: any,
    options: Partial<CustomEventInit> = {}
  ): boolean {
    try {
      const event = typeof eventOrName === 'string'
        ? new CustomEvent(eventOrName, { detail, bubbles: true, composed: true, cancelable: true, ...options })
        : eventOrName;
      return this.host.dispatchEvent(event);
    } catch (error) {
      this.handleError(error as Error, 'dispatchEvent');
      return false;
    }
  }

  /** Check if host element is disabled */
  protected isDisabled(): boolean {
    return false;
  }

  /** Get element by path key */
  protected getElementByPath(pathKey: string): HTMLElement | null {
    return this.host.shadowRoot?.querySelector(`[data-path="${pathKey}"]`) || null;
  }

  /** Get all menu link elements */
  protected getAllMenuLinks(): HTMLElement[] {
    return Array.from(
      this.host.shadowRoot?.querySelectorAll('.menu-link, .sub-menu') || []
    );
  }

  /** Check if element is visible and not disabled */
  protected isElementInteractive(element: HTMLElement | null): boolean {
    if (!element) return false;
    const isDisabled = element.classList.contains('disabled');
    const isVisible = element.offsetParent !== null;
    return !isDisabled && isVisible;
  }
}
