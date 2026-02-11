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
 * Base interface for input controllers
 */
export interface InputBaseController {
  host: InputHost;
}

/**
 * Input host interface - defines what the input component should provide
 */
export interface InputHost extends BaseControllerHost {
  value: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  name?: string;
  type?: string;
  label?: string;
  placeholder?: string;
}

export type { ErrorHandler };

/**
 * Abstract base controller class for all input component controllers.
 * Extends the shared BaseComponentController with InputHost-specific typing.
 */
export abstract class BaseInputController
  extends BaseComponentController<InputHost>
  implements InputBaseController {

  constructor(host: InputHost & ReactiveControllerHost) {
    super(host);
  }
}
