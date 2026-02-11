/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ReactiveControllerHost } from 'lit';
import {
  BaseComponentController,
  type BaseControllerHost,
  type ErrorHandler,
} from '../../../shared/controllers/base.controller.js';

/**
 * Base interface for textarea controllers
 */
export interface TextareaBaseController {
  host: TextareaHost;
}

/**
 * Textarea host interface - defines what the textarea component should provide
 */
export interface TextareaHost extends BaseControllerHost, EventTarget {
  value: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  resize?: string;
  autoResize?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

export type { ErrorHandler };

/**
 * Abstract base controller class for all textarea component controllers.
 * Extends the shared BaseComponentController with TextareaHost-specific typing.
 */
export abstract class BaseTextareaController
  extends BaseComponentController<TextareaHost>
  implements TextareaBaseController {

  constructor(host: TextareaHost & ReactiveControllerHost) {
    super(host);
  }

  /** Request a host update safely */
  protected requestHostUpdate(): void {
    this.safeExecute(() => this._host.requestUpdate(), 'requestHostUpdate');
  }

  /** Debounce utility for controllers */
  protected debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}
