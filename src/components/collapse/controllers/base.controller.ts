/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { ReactiveControllerHost } from 'lit';
import { BaseComponentController, type BaseControllerHost } from '../../../shared/controllers/base.controller.js';
import { CollapseSection } from '../collapse.type.js';

/**
 * Base controller interface for collapse components
 */
export interface CollapseControllerHost extends BaseControllerHost {
  sections: CollapseSection[];
  accordion?: boolean;
  allowMultiple?: boolean;
  animation?: string;
  updateSection?(index: number, updates: Partial<CollapseSection>): void;
  updateSections?(updates: Array<{ index: number; updates: Partial<CollapseSection> }>): void;
}

/**
 * Base controller for collapse component functionality.
 * Extends the shared BaseComponentController with section management helpers.
 */
export abstract class BaseCollapseController
  extends BaseComponentController<CollapseControllerHost> {

  constructor(host: CollapseControllerHost & ReactiveControllerHost) {
    super(host);
  }

  /** Get section by index safely */
  protected getSection(index: number): CollapseSection | undefined {
    return this._host.sections[index];
  }

  /** Update a specific section */
  protected updateSection(index: number, updates: Partial<CollapseSection>): void {
    if (this._host.updateSection) {
      this._host.updateSection(index, updates);
      return;
    }
    const section = this.getSection(index);
    if (section) {
      const newSections = [...this._host.sections];
      newSections[index] = { ...section, ...updates };
      this._host.sections = newSections;
      this._host.requestUpdate();
    }
  }

  /** Update multiple sections at once */
  protected updateSections(updates: Array<{ index: number; updates: Partial<CollapseSection> }>): void {
    if (this._host.updateSections) {
      this._host.updateSections(updates);
      return;
    }
    const newSections = [...this._host.sections];
    let hasChanges = false;
    updates.forEach(({ index, updates: sectionUpdates }) => {
      const section = this.getSection(index);
      if (section) {
        newSections[index] = { ...section, ...sectionUpdates };
        hasChanges = true;
      }
    });
    if (hasChanges) {
      this._host.sections = newSections;
      this._host.requestUpdate();
    }
  }

  /** Get all open sections */
  protected getOpenSections(): number[] {
    return this._host.sections
      .map((section, index) => section.open ? index : -1)
      .filter(index => index !== -1);
  }
}
