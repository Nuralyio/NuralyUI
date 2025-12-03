/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { LitElement } from 'lit';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Interface for components that support number operations
 */
export interface NumberCapable {
  /**
   * Increment the number value
   */
  increment(): void;

  /**
   * Decrement the number value
   */
  decrement(): void;

  /**
   * Set the step attribute for number inputs
   * @param step - The step value
   */
  setStep(step: string | undefined): void;

  /**
   * Validate if a step value is valid
   * @param step - The step value to validate
   * @returns True if valid
   */
  isValidStep(step: string | undefined): boolean;
}

/**
 * Mixin that provides number input capabilities to input components
 * 
 * @param superClass - The base class to extend
 * @returns Enhanced class with number capabilities
 * 
 * @example
 * ```typescript
 * export class MyInput extends NumberMixin(LitElement) {
 *   @query('input') input!: HTMLInputElement;
 *   
 *   handleUpClick() {
 *     this.increment();
 *   }
 * }
 * ```
 */
export const NumberMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class NumberMixinClass extends superClass implements NumberCapable {
    /**
     * Input element getter - provided by component
     */
    protected get inputElement(): HTMLInputElement {
      throw new Error('inputElement must be implemented by the component');
    }

    /**
     * Dispatch an input event - will be overridden by components that have _dispatchInputEvent
     */
    protected dispatchInputEvent(eventName: string, detail: any): void {
      // Try to use the component's _dispatchInputEvent method if available
      if ('_dispatchInputEvent' in this && typeof (this as any)._dispatchInputEvent === 'function') {
        (this as any)._dispatchInputEvent(eventName, detail);
      } else {
        // Fallback to standard event dispatch
        this.dispatchEvent(new CustomEvent(eventName, {
          detail,
          bubbles: true,
          composed: true
        }));
      }
    }

    increment(): void {
      try {
        const input = this.inputElement;
        
        if (!input.value) {
          const min = input.getAttribute('min');
          input.value = min ? min : '0';
        }
        
        input.stepUp();
        const newValue = input.value;
        
        this.dispatchInputEvent('nr-input', {
          value: newValue,
          target: input,
          action: 'increment'
        });
        
        if ('value' in this) {
          (this as any).value = newValue;
        }
      } catch (error) {
        console.warn('Failed to increment value:', error);
        this.dispatchInputEvent('nr-increment-error', {
          error,
          value: this.inputElement.value,
          target: this.inputElement
        });
      }
    }

    decrement(): void {
      try {
        const input = this.inputElement;
        input.stepDown();
        const newValue = input.value;
        
        this.dispatchInputEvent('nr-input', {
          value: newValue,
          target: input,
          action: 'decrement'
        });
        
        if ('value' in this) {
          (this as any).value = newValue;
        }
      } catch (error) {
        console.warn('Failed to decrement value:', error);
        this.dispatchInputEvent('nr-decrement-error', {
          error,
          value: this.inputElement.value,
          target: this.inputElement
        });
      }
    }

    setStep(step: string | undefined): void {
      const input = this.inputElement;
      if (step && this.isValidStep(step)) {
        input.setAttribute('step', step);
      } else {
        input.removeAttribute('step');
      }
    }

    isValidStep(step: string | undefined): boolean {
      if (!step) return true;
      const stepValue = parseFloat(step);
      return !isNaN(stepValue) && stepValue > 0;
    }
  }

  // Cast return type to the superClass type passed in
  return NumberMixinClass as Constructor<NumberCapable> & T;
};
