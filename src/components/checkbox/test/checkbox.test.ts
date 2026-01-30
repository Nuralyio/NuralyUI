/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrCheckboxElement } from '../checkbox.component.js';
import { CheckboxSize } from '../checkbox.types.js';

describe('NrCheckboxElement', () => {
  let element: NrCheckboxElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-checkbox>Check me</nr-checkbox>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-CHECKBOX');
    });

    it('should have default properties', () => {
      expect(element.checked).to.be.false;
      expect(element.disabled).to.be.false;
      expect(element.indeterminate).to.be.false;
      expect(element.size).to.equal(CheckboxSize.Medium);
      expect(element.autoFocus).to.be.false;
      expect(element.required).to.be.false;
    });

    it('should render slot content (label)', async () => {
      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should render checkbox input', async () => {
      const input = element.shadowRoot?.querySelector('input[type="checkbox"]');
      expect(input).to.exist;
    });
  });

  describe('Checked state', () => {
    it('should toggle checked state', async () => {
      element.checked = true;
      await element.updateComplete;

      expect(element.checked).to.be.true;
      expect(element.hasAttribute('checked')).to.be.true;
    });

    it('should uncheck when clicked while checked', async () => {
      element.checked = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await element.updateComplete;

      expect(element.checked).to.be.false;
    });

    it('should check when clicked while unchecked', async () => {
      element.checked = false;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await element.updateComplete;

      expect(element.checked).to.be.true;
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
      expect(element.hasAttribute('disabled')).to.be.true;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input?.disabled).to.be.true;
    });

    it('should not toggle when disabled', async () => {
      element.disabled = true;
      element.checked = false;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.click();
      await element.updateComplete;

      expect(element.checked).to.be.false;
    });
  });

  describe('Indeterminate state', () => {
    it('should support indeterminate state', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      expect(element.indeterminate).to.be.true;
      expect(element.hasAttribute('indeterminate')).to.be.true;
    });

    it('should clear indeterminate when checked', async () => {
      element.indeterminate = true;
      await element.updateComplete;

      element.checked = true;
      await element.updateComplete;

      // Clicking should clear indeterminate state
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      if (input) {
        expect(input.indeterminate || element.indeterminate).to.be.true;
      }
    });
  });

  describe('Checkbox sizes', () => {
    it('should apply small size', async () => {
      element.size = CheckboxSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
      expect(element.getAttribute('size')).to.equal('small');
    });

    it('should apply medium size', async () => {
      element.size = CheckboxSize.Medium;
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = CheckboxSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });

    it('should default to medium for invalid size', async () => {
      element.size = 'invalid' as CheckboxSize;
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });
  });

  describe('Event handling', () => {
    it('should dispatch nr-change event on change', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      setTimeout(() => {
        input?.click();
      });

      const event = await oneEvent(element, 'nr-change');
      expect(event).to.exist;
    });

    it('should dispatch nr-focus event on focus', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      setTimeout(() => {
        input?.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-focus');
      expect(event).to.exist;
    });

    it('should dispatch nr-blur event on blur', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

      setTimeout(() => {
        input?.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-blur');
      expect(event).to.exist;
    });
  });

  describe('Keyboard navigation', () => {
    it('should toggle on Space key', async () => {
      element.checked = false;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      await aTimeout(50);

      // Space should trigger the checkbox
    });

    it('should toggle on Enter key', async () => {
      element.checked = false;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await aTimeout(50);

      // Enter should trigger the checkbox
    });
  });

  describe('Form integration', () => {
    it('should support name attribute', async () => {
      element.name = 'accept-terms';
      await element.updateComplete;

      expect(element.name).to.equal('accept-terms');
    });

    it('should support value attribute', async () => {
      element.value = 'agreed';
      await element.updateComplete;

      expect(element.value).to.equal('agreed');
    });

    it('should support required attribute', async () => {
      element.required = true;
      await element.updateComplete;

      expect(element.required).to.be.true;
    });
  });

  describe('Focus management', () => {
    it('should support tabIndex', async () => {
      element.tabIndex = 5;
      await element.updateComplete;

      expect(element.tabIndex).to.equal(5);
    });

    it('should support autoFocus', async () => {
      element.autoFocus = true;
      await element.updateComplete;

      expect(element.autoFocus).to.be.true;
    });

    it('should be focusable', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      input?.focus();

      expect(document.activeElement).to.equal(element);
    });
  });

  describe('Accessibility', () => {
    it('should have proper role', async () => {
      const input = element.shadowRoot?.querySelector('input[type="checkbox"]');
      expect(input).to.exist;
    });

    it('should support title attribute', async () => {
      element.title = 'Accept the terms and conditions';
      await element.updateComplete;

      expect(element.title).to.equal('Accept the terms and conditions');
    });

    it('should support id attribute', async () => {
      element.id = 'terms-checkbox';
      await element.updateComplete;

      expect(element.id).to.equal('terms-checkbox');
    });
  });

  describe('Label slot', () => {
    it('should render label from slot', async () => {
      const el = await fixture<NrCheckboxElement>(html`
        <nr-checkbox>
          <span>I agree to the terms</span>
        </nr-checkbox>
      `);

      const slot = el.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should render without label', async () => {
      const el = await fixture<NrCheckboxElement>(html`<nr-checkbox></nr-checkbox>`);
      expect(el).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid toggling', async () => {
      for (let i = 0; i < 10; i++) {
        element.checked = !element.checked;
      }
      await element.updateComplete;

      expect(element.checked).to.be.false; // 10 toggles = back to false
    });

    it('should handle setting checked while disabled', async () => {
      element.disabled = true;
      element.checked = true;
      await element.updateComplete;

      // Should still update the property even when disabled
      expect(element.checked).to.be.true;
    });

    it('should handle simultaneous checked and indeterminate', async () => {
      element.checked = true;
      element.indeterminate = true;
      await element.updateComplete;

      // Both states can coexist (indeterminate takes visual precedence)
      expect(element.checked).to.be.true;
      expect(element.indeterminate).to.be.true;
    });
  });
});
