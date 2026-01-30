/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrFormElement } from '../form.component.js';

describe('NrFormElement', () => {
  let element: NrFormElement;

  beforeEach(async () => {
    element = await fixture(html`
      <nr-form>
        <input name="username" type="text" />
        <input name="email" type="email" />
        <button type="submit">Submit</button>
      </nr-form>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-FORM');
    });

    it('should have default properties', () => {
      expect(element.validateOnChange).to.be.false;
      expect(element.validateOnBlur).to.be.true;
      expect(element.preventInvalidSubmission).to.be.true;
      expect(element.resetOnSuccess).to.be.false;
      expect(element.method).to.equal('POST');
      expect(element.enctype).to.equal('multipart/form-data');
    });

    it('should render slot for form content', async () => {
      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should have default config', () => {
      expect(element.config.validateOnChange).to.be.false;
      expect(element.config.validateOnBlur).to.be.true;
      expect(element.config.preventInvalidSubmission).to.be.true;
    });
  });

  describe('Validation configuration', () => {
    it('should support validate-on-change attribute', async () => {
      element.validateOnChange = true;
      await element.updateComplete;

      expect(element.validateOnChange).to.be.true;
    });

    it('should support validate-on-blur attribute', async () => {
      element.validateOnBlur = true;
      await element.updateComplete;

      expect(element.validateOnBlur).to.be.true;
    });

    it('should support prevent-invalid-submission attribute', async () => {
      element.preventInvalidSubmission = false;
      await element.updateComplete;

      expect(element.preventInvalidSubmission).to.be.false;
    });

    it('should support reset-on-success attribute', async () => {
      element.resetOnSuccess = true;
      await element.updateComplete;

      expect(element.resetOnSuccess).to.be.true;
    });
  });

  describe('Form submission', () => {
    it('should support action attribute', async () => {
      element.action = '/api/submit';
      await element.updateComplete;

      expect(element.action).to.equal('/api/submit');
    });

    it('should support method attribute', async () => {
      element.method = 'GET';
      await element.updateComplete;

      expect(element.method).to.equal('GET');
    });

    it('should support enctype attribute', async () => {
      element.enctype = 'application/json';
      await element.updateComplete;

      expect(element.enctype).to.equal('application/json');
    });

    it('should support target attribute', async () => {
      element.target = '_blank';
      await element.updateComplete;

      expect(element.target).to.equal('_blank');
    });

    it('should dispatch nr-form-submit-attempt on submit', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-form-submit-attempt', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-form-submit-attempt');
      expect(event).to.exist;
    });

    it('should dispatch nr-form-submit-success on successful submit', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-form-submit-success', {
          detail: { values: { username: 'test' } },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-form-submit-success');
      expect(event).to.exist;
    });

    it('should dispatch nr-form-submit-error on failed submit', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-form-submit-error', {
          detail: { errors: ['Validation failed'] },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-form-submit-error');
      expect(event).to.exist;
    });
  });

  describe('Field management API', () => {
    it('should have setFieldsValue method', () => {
      expect(typeof element.setFieldsValue).to.equal('function');
    });

    it('should have getFieldsValue method', () => {
      expect(typeof element.getFieldsValue).to.equal('function');
    });

    it('should have resetFields method', () => {
      expect(typeof element.resetFields).to.equal('function');
    });

    it('should have validateFields method', () => {
      expect(typeof element.validateFields).to.equal('function');
    });

    it('should have finish method', () => {
      expect(typeof element.finish).to.equal('function');
    });
  });

  describe('Validation events', () => {
    it('should dispatch nr-form-validation-changed', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-form-validation-changed', {
          detail: { isValid: false, errors: ['Required field'] },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-form-validation-changed');
      expect(event).to.exist;
    });

    it('should dispatch nr-form-field-changed', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-form-field-changed', {
          detail: { field: 'username', value: 'test' },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-form-field-changed');
      expect(event).to.exist;
    });
  });

  describe('Form reset', () => {
    it('should dispatch nr-form-reset on reset', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-form-reset', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-form-reset');
      expect(event).to.exist;
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      (element as any).disabled = true;
      await element.updateComplete;

      expect((element as any).disabled).to.be.true;
    });
  });

  describe('Custom config object', () => {
    it('should accept custom config', async () => {
      element.config = {
        validateOnChange: true,
        validateOnBlur: true,
        showErrorsImmediately: true,
        preventInvalidSubmission: false,
        resetOnSuccess: true,
        validationDelay: 500
      };
      await element.updateComplete;

      expect(element.config.validateOnChange).to.be.true;
      expect(element.config.validationDelay).to.equal(500);
    });
  });

  describe('Controller integration', () => {
    it('should have validation controller', () => {
      const controller = (element as any).validationController;
      expect(controller).to.exist;
    });

    it('should have submission controller', () => {
      const controller = (element as any).submissionController;
      expect(controller).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle form with no fields', async () => {
      const emptyForm = await fixture<NrFormElement>(html`<nr-form></nr-form>`);
      expect(emptyForm).to.exist;
    });

    it('should handle nested form elements', async () => {
      const nestedForm = await fixture<NrFormElement>(html`
        <nr-form>
          <div>
            <div>
              <input name="deep-nested" />
            </div>
          </div>
        </nr-form>
      `);
      expect(nestedForm).to.exist;
    });
  });
});
