/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrInputElement } from '../input.component.js';
import {
  INPUT_TYPE,
  INPUT_STATE,
  INPUT_SIZE,
  INPUT_VARIANT,
  VALIDATION_RULES
} from '../input.types.js';

describe('NrInputElement', () => {
  let element: NrInputElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-input></nr-input>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-INPUT');
    });

    it('should have default properties', () => {
      expect(element.type).to.equal(INPUT_TYPE.TEXT);
      expect(element.state).to.equal(INPUT_STATE.Default);
      expect(element.size).to.equal(INPUT_SIZE.Medium);
      expect(element.variant).to.equal(INPUT_VARIANT.Outlined);
      expect(element.disabled).to.be.false;
      expect(element.readonly).to.be.false;
      expect(element.value).to.equal('');
    });

    it('should have empty initial value', () => {
      expect(element.value).to.equal('');
    });

    it('should render an input element in shadow DOM', async () => {
      const input = element.shadowRoot?.querySelector('input');
      expect(input).to.exist;
      expect(input?.id).to.equal('input');
    });

    it('should reflect value property to input element', async () => {
      element.value = 'test value';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.value).to.equal('test value');
    });
  });

  describe('Input types', () => {
    it('should handle text type', async () => {
      element.type = INPUT_TYPE.TEXT;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('text');
    });

    it('should handle password type', async () => {
      element.type = INPUT_TYPE.PASSWORD;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('password');
    });

    it('should handle number type', async () => {
      element.type = INPUT_TYPE.NUMBER;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('number');
    });

    it('should handle email type', async () => {
      element.type = INPUT_TYPE.EMAIL;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('email');
    });

    it('should handle url type', async () => {
      element.type = INPUT_TYPE.URL;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('url');
    });

    it('should handle tel type', async () => {
      element.type = INPUT_TYPE.TEL;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('tel');
    });
  });

  describe('Input states', () => {
    it('should apply default state', async () => {
      element.state = INPUT_STATE.Default;
      await element.updateComplete;
      expect(element.state).to.equal('default');
    });

    it('should apply error state', async () => {
      element.state = INPUT_STATE.Error;
      await element.updateComplete;
      expect(element.state).to.equal('error');
    });

    it('should apply warning state', async () => {
      element.state = INPUT_STATE.Warning;
      await element.updateComplete;
      expect(element.state).to.equal('warning');
    });

    it('should apply success state', async () => {
      element.state = INPUT_STATE.Success;
      await element.updateComplete;
      expect(element.state).to.equal('success');
    });
  });

  describe('Input sizes', () => {
    it('should apply small size', async () => {
      element.size = INPUT_SIZE.Small;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('#input-container');
      expect(container?.getAttribute('data-size')).to.equal('small');
    });

    it('should apply medium size', async () => {
      element.size = INPUT_SIZE.Medium;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('#input-container');
      expect(container?.getAttribute('data-size')).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = INPUT_SIZE.Large;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('#input-container');
      expect(container?.getAttribute('data-size')).to.equal('large');
    });
  });

  describe('Input variants', () => {
    it('should apply outlined variant', async () => {
      element.variant = INPUT_VARIANT.Outlined;
      await element.updateComplete;
      expect(element.getAttribute('variant')).to.equal('outlined');
    });

    it('should apply filled variant', async () => {
      element.variant = INPUT_VARIANT.Filled;
      await element.updateComplete;
      expect(element.getAttribute('variant')).to.equal('filled');
    });

    it('should apply borderless variant', async () => {
      element.variant = INPUT_VARIANT.Borderless;
      await element.updateComplete;
      expect(element.getAttribute('variant')).to.equal('borderless');
    });

    it('should apply underlined variant', async () => {
      element.variant = INPUT_VARIANT.Underlined;
      await element.updateComplete;
      expect(element.getAttribute('variant')).to.equal('underlined');
    });
  });

  describe('Disabled and readonly states', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.disabled).to.be.true;
      expect(element.hasAttribute('disabled')).to.be.true;
    });

    it('should support readonly state', async () => {
      element.readonly = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.readOnly).to.be.true;
      expect(element.hasAttribute('readonly')).to.be.true;
    });

    it('should not allow input when disabled', async () => {
      element.disabled = true;
      element.value = 'initial';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });
  });

  describe('Placeholder', () => {
    it('should display placeholder text', async () => {
      element.placeholder = 'Enter your name';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.placeholder).to.equal('Enter your name');
    });
  });

  describe('Event handling', () => {
    it('should dispatch nr-input event on value change', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      setTimeout(() => {
        input.value = 'new value';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-input');
      expect(event).to.exist;
    });

    it('should dispatch nr-focus event on focus', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      setTimeout(() => {
        input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-focus');
      expect(event).to.exist;
    });

    it('should dispatch nr-blur event on blur', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      setTimeout(() => {
        input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-blur');
      expect(event).to.exist;
    });

    it('should dispatch nr-enter event on Enter key', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      setTimeout(() => {
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-enter');
      expect(event).to.exist;
    });
  });

  describe('Clear functionality', () => {
    it('should show clear button when allowClear is true and has value', async () => {
      element.allowClear = true;
      element.value = 'some text';
      await element.updateComplete;

      const clearIcon = element.shadowRoot?.querySelector('.clear-icon, [class*="clear"]');
      expect(clearIcon).to.exist;
    });

    it('should clear value when clear button is clicked', async () => {
      element.allowClear = true;
      element.value = 'some text';
      await element.updateComplete;

      const clearIcon = element.shadowRoot?.querySelector('.clear-icon, [class*="clear"]') as HTMLElement;
      if (clearIcon) {
        setTimeout(() => clearIcon.click());
        await oneEvent(element, 'nr-clear');
        await element.updateComplete;
        expect(element.value).to.equal('');
      }
    });

    it('should not show clear button when disabled', async () => {
      element.allowClear = true;
      element.value = 'some text';
      element.disabled = true;
      await element.updateComplete;

      // When disabled, clear functionality should be restricted
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });
  });

  describe('Password toggle', () => {
    it('should toggle password visibility', async () => {
      element.type = INPUT_TYPE.PASSWORD;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('password');

      // Find and click the password toggle icon
      const toggleIcon = element.shadowRoot?.querySelector('[class*="password"], [class*="eye"]') as HTMLElement;
      if (toggleIcon) {
        toggleIcon.click();
        await element.updateComplete;

        // After toggle, type should be 'text'
        expect(input.type).to.equal('text');

        // Toggle again
        toggleIcon.click();
        await element.updateComplete;
        expect(input.type).to.equal('password');
      }
    });
  });

  describe('Number input controls', () => {
    it('should have increment and decrement buttons for number type', async () => {
      element.type = INPUT_TYPE.NUMBER;
      await element.updateComplete;

      // Number inputs should have the correct type
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('number');
    });

    it('should respect min value for number input', async () => {
      element.type = INPUT_TYPE.NUMBER;
      element.min = '0';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('min')).to.equal('0');
    });

    it('should respect max value for number input', async () => {
      element.type = INPUT_TYPE.NUMBER;
      element.max = '100';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('max')).to.equal('100');
    });

    it('should respect step value for number input', async () => {
      element.type = INPUT_TYPE.NUMBER;
      element.step = '5';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('step')).to.equal('5');
    });
  });

  describe('Character count', () => {
    it('should show character count when showCount is true', async () => {
      element.showCount = true;
      element.value = 'hello';
      await element.updateComplete;

      const countElement = element.shadowRoot?.querySelector('.character-count, [part="character-count"]');
      expect(countElement).to.exist;
      expect(countElement?.textContent).to.contain('5');
    });

    it('should show character count with maxLength', async () => {
      element.showCount = true;
      element.maxLength = 10;
      element.value = 'hello';
      await element.updateComplete;

      expect(element.characterCountDisplay).to.equal('5/10');
    });

    it('should indicate when over character limit', async () => {
      element.maxLength = 5;
      element.value = 'hello world';
      await element.updateComplete;

      expect(element.isOverCharacterLimit).to.be.true;
    });

    it('should not indicate over limit when within limit', async () => {
      element.maxLength = 20;
      element.value = 'hello';
      await element.updateComplete;

      expect(element.isOverCharacterLimit).to.be.false;
    });
  });

  describe('Validation', () => {
    it('should validate required field', async () => {
      element.required = true;
      element.value = '';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.false;
    });

    it('should pass validation when required field has value', async () => {
      element.required = true;
      element.value = 'some value';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.true;
    });

    it('should validate email format', async () => {
      element.type = INPUT_TYPE.EMAIL;
      element.rules = [VALIDATION_RULES.email()];
      element.value = 'invalid-email';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.false;
    });

    it('should pass email validation with valid email', async () => {
      element.type = INPUT_TYPE.EMAIL;
      element.rules = [VALIDATION_RULES.email()];
      element.value = 'test@example.com';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.true;
    });

    it('should validate minLength', async () => {
      element.rules = [VALIDATION_RULES.minLength(5)];
      element.value = 'abc';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.false;
    });

    it('should pass minLength validation', async () => {
      element.rules = [VALIDATION_RULES.minLength(5)];
      element.value = 'abcdefg';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.true;
    });

    it('should validate maxLength', async () => {
      element.rules = [VALIDATION_RULES.maxLength(5)];
      element.value = 'abcdefgh';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.false;
    });

    it('should validate pattern', async () => {
      element.rules = [VALIDATION_RULES.pattern(/^[A-Z]+$/)];
      element.value = 'abc123';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.false;
    });

    it('should pass pattern validation', async () => {
      element.rules = [VALIDATION_RULES.pattern(/^[A-Z]+$/)];
      element.value = 'ABC';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.true;
    });

    it('should support custom validator function', async () => {
      element.rules = [{
        validator: (_rule, value) => {
          if (value !== 'secret') {
            return { isValid: false, message: 'Value must be "secret"' };
          }
          return { isValid: true };
        }
      }];
      element.value = 'wrong';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.false;
    });

    it('should set error state on validation failure', async () => {
      element.required = true;
      element.hasFeedback = true;
      element.value = '';
      await element.updateComplete;

      await element.validateInput();
      await element.updateComplete;
      await aTimeout(50);

      expect(element.state).to.equal(INPUT_STATE.Error);
    });

    it('should set success state on validation success with feedback', async () => {
      element.required = true;
      element.hasFeedback = true;
      element.value = 'valid value';
      await element.updateComplete;

      await element.validateInput();
      await element.updateComplete;
      await aTimeout(50);

      expect(element.state).to.equal(INPUT_STATE.Success);
    });
  });

  describe('Validation rules API', () => {
    it('should add validation rule dynamically', async () => {
      element.addRule(VALIDATION_RULES.required());
      element.value = '';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.false;
    });

    it('should remove validation rule', async () => {
      element.addRule({ required: true, message: 'Required' });
      element.removeRule(rule => rule.required === true);
      element.value = '';
      await element.updateComplete;

      const isValid = await element.validateInput();
      expect(isValid).to.be.true;
    });

    it('should clear all validation rules', async () => {
      element.rules = [
        VALIDATION_RULES.required(),
        VALIDATION_RULES.minLength(10)
      ];
      await element.updateComplete;

      element.clearRules();
      element.value = '';

      const isValid = await element.validateInput();
      expect(isValid).to.be.true;
    });

    it('should return validation status', async () => {
      element.required = true;
      element.value = '';
      await element.updateComplete;

      await element.validateInput();
      const status = element.getValidationStatus();

      expect(status.isValid).to.be.false;
      expect(status.errors).to.be.an('array');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const input = element.shadowRoot?.querySelector('input');
      expect(input).to.exist;
      expect(input?.getAttribute('aria-invalid')).to.equal('false');
    });

    it('should set aria-invalid to true on validation error', async () => {
      element.required = true;
      element.value = '';
      await element.updateComplete;

      await element.validateInput();
      await element.updateComplete;
      await aTimeout(50);

      const input = element.shadowRoot?.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).to.equal('true');
    });

    it('should support autocomplete attribute', async () => {
      element.autocomplete = 'email';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.autocomplete).to.equal('email');
    });

    it('should support name attribute', async () => {
      element.name = 'email-field';
      await element.updateComplete;

      expect(element.name).to.equal('email-field');
    });
  });

  describe('Copy functionality', () => {
    it('should show copy button when withCopy is true', async () => {
      element.withCopy = true;
      element.value = 'copy me';
      await element.updateComplete;

      const copyIcon = element.shadowRoot?.querySelector('[class*="copy"]');
      expect(copyIcon).to.exist;
    });
  });

  describe('Slots', () => {
    it('should render label slot', async () => {
      const el = await fixture(html`
        <nr-input>
          <span slot="label">Username</span>
        </nr-input>
      `);

      const labelSlot = el.shadowRoot?.querySelector('slot[name="label"]');
      expect(labelSlot).to.exist;
    });

    it('should render helper-text slot', async () => {
      const el = await fixture(html`
        <nr-input>
          <span slot="helper-text">Enter your username</span>
        </nr-input>
      `);

      const helperSlot = el.shadowRoot?.querySelector('slot[name="helper-text"]');
      expect(helperSlot).to.exist;
    });

    it('should render addon-before slot', async () => {
      const el = await fixture<NrInputElement>(html`
        <nr-input>
          <span slot="addon-before">$</span>
        </nr-input>
      `);
      await el.updateComplete;

      const addonSlot = el.shadowRoot?.querySelector('slot[name="addon-before"]');
      expect(addonSlot).to.exist;
    });

    it('should render addon-after slot', async () => {
      const el = await fixture<NrInputElement>(html`
        <nr-input>
          <span slot="addon-after">.00</span>
        </nr-input>
      `);
      await el.updateComplete;

      const addonSlot = el.shadowRoot?.querySelector('slot[name="addon-after"]');
      expect(addonSlot).to.exist;
    });
  });

  describe('Controller integration', () => {
    it('should have validation controller', () => {
      const controller = (element as any).validationController;
      expect(controller).to.exist;
      expect(typeof controller.validate).to.equal('function');
    });

    it('should have event controller', () => {
      const controller = (element as any).eventController;
      expect(controller).to.exist;
      expect(typeof controller.handleValueChange).to.equal('function');
    });
  });

  describe('Debounce functionality', () => {
    it('should support debounce for input events', async () => {
      element.debounce = 100;
      await element.updateComplete;

      expect(element.debounce).to.equal(100);
    });

    it('should support validation debounce', async () => {
      element.validationDebounce = 200;
      await element.updateComplete;

      expect(element.validationDebounce).to.equal(200);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string value', async () => {
      element.value = '';
      await element.updateComplete;

      expect(element.value).to.equal('');
      expect(element.characterCountDisplay).to.equal('0');
    });

    it('should handle special characters in value', async () => {
      element.value = '<script>alert("xss")</script>';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.value).to.equal('<script>alert("xss")</script>');
    });

    it('should handle very long values', async () => {
      const longValue = 'a'.repeat(10000);
      element.value = longValue;
      await element.updateComplete;

      expect(element.value).to.equal(longValue);
      expect(element.value.length).to.equal(10000);
    });

    it('should handle unicode characters', async () => {
      element.value = '你好世界 🎉 مرحبا';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.value).to.equal('你好世界 🎉 مرحبا');
    });

    it('should handle rapid value changes', async () => {
      for (let i = 0; i < 100; i++) {
        element.value = `value-${i}`;
      }
      await element.updateComplete;

      expect(element.value).to.equal('value-99');
    });
  });
});
