/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ReactiveControllerHost } from 'lit';
import { BaseComponentController, type BaseControllerHost } from '../../../shared/controllers/base.controller.js';
import { TabItem } from '../tabs.types.js';

/**
 * Base interface for tabs host element
 */
export interface TabsHost extends BaseControllerHost, EventTarget {
  activeTab: number;
  tabs: TabItem[];
  disabled?: boolean;
  currentTheme: string;
  isComponentAvailable(component: string): boolean;
  shadowRoot: ShadowRoot | null;
}

/**
 * Base interface for tabs controllers
 */
export interface TabsBaseController {
  readonly host: TabsHost;
}

/**
 * Error handler interface for controllers
 */
export interface ErrorHandler {
  handleError(error: Error, context: string): void;
}

/**
 * Abstract base controller class for all tabs component controllers.
 * Extends the shared BaseComponentController with TabsHost-specific typing.
 */
export abstract class BaseTabsController
  extends BaseComponentController<TabsHost>
  implements TabsBaseController, ErrorHandler {

  constructor(host: TabsHost & ReactiveControllerHost) {
    super(host);
  }

  /** Helper method to check if tab index is valid */
  protected isValidTabIndex(index: number): boolean {
    return index >= 0 && index < this.host.tabs.length;
  }

  /** Helper method to get tab element by index */
  protected getTabElement(index: number): Element | null {
    return this.host.shadowRoot?.querySelector(`[data-index="${index}"]`) || null;
  }
}
