/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ReactiveController, ReactiveControllerHost } from 'lit';

/**
 * Minimum interface that all controller hosts must provide
 */
export interface BaseControllerHost {
  requestUpdate(): void;
}

/**
 * Error handler interface for consistent error handling
 */
export interface ErrorHandler {
  handleError(error: Error, context: string): void;
}

/**
 * Generic base controller class that implements common functionality
 * shared by all component controllers.
 *
 * @typeParam T - The host interface that extends BaseControllerHost
 *
 * @example
 * ```typescript
 * interface MyHost extends BaseControllerHost {
 *   value: string;
 *   disabled?: boolean;
 * }
 *
 * class MyController extends BaseComponentController<MyHost> {
 *   // custom methods...
 * }
 * ```
 */
export abstract class BaseComponentController<T extends BaseControllerHost = BaseControllerHost>
  implements ReactiveController, ErrorHandler {

  protected _host: T & ReactiveControllerHost;

  constructor(host: T & ReactiveControllerHost) {
    this._host = host;
    this._host.addController(this);
  }

  /** Get the host element */
  get host(): T & ReactiveControllerHost {
    return this._host;
  }

  /** Reactive controller lifecycle - called when host connects */
  hostConnected(): void { }

  /** Reactive controller lifecycle - called when host disconnects */
  hostDisconnected(): void { }

  /** Reactive controller lifecycle - called before host updates */
  hostUpdate(): void { }

  /** Reactive controller lifecycle - called after host updates */
  hostUpdated(): void { }

  /** Request host to update */
  protected requestUpdate(): void {
    this._host.requestUpdate();
  }

  /** Dispatch custom event from host */
  protected dispatchEvent(event: CustomEvent): boolean {
    return (this._host as any).dispatchEvent(event);
  }

  /** Handle errors consistently across controllers */
  handleError(error: Error, context: string): void {
    console.error(`[${this.constructor.name}] Error in ${context}:`, error);
    this.dispatchEvent(
      new CustomEvent('nr-controller-error', {
        detail: { error, context, controller: this.constructor.name },
        bubbles: true,
        composed: true,
      })
    );
  }

  /** Safely execute a function with error handling */
  protected safeExecute<R>(fn: () => R, context: string, fallback?: R): R | undefined {
    try {
      return fn();
    } catch (error) {
      this.handleError(error as Error, context);
      return fallback;
    }
  }
}
