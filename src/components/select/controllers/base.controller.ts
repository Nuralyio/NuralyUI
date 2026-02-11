import { ReactiveControllerHost } from 'lit';
import { BaseComponentController } from '../../../shared/controllers/base.controller.js';
import { SelectBaseController, SelectHost, ErrorHandler } from '../interfaces/index.js';

/**
 * Abstract base controller class for all select component controllers.
 * Extends the shared BaseComponentController with SelectHost-specific typing.
 */
export abstract class BaseSelectController
  extends BaseComponentController<SelectHost>
  implements SelectBaseController, ErrorHandler {

  constructor(host: SelectHost & ReactiveControllerHost) {
    super(host);
  }

  /** Request host update safely */
  protected override requestUpdate(): void {
    try {
      this._host.requestUpdate();
    } catch (error) {
      this.handleError(error as Error, 'requestUpdate');
    }
  }

  /** Dispatch custom event safely */
  protected override dispatchEvent(event: Event): boolean {
    try {
      return this._host.dispatchEvent(event);
    } catch (error) {
      this.handleError(error as Error, 'dispatchEvent');
      return false;
    }
  }
}
