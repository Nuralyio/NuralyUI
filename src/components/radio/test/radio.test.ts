/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { NrRadioElement } from '../radio.component.js';
import { RadioSize } from '../radio.types.js';

describe('NrRadioElement', () => {
  let element: NrRadioElement;

  beforeEach(async () => {
    element = await fixture(html`
      <nr-radio value="option1">Option 1</nr-radio>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-RADIO');
    });

    it('should have default properties', () => {
      expect(element.checked).to.be.false;
      expect(element.disabled).to.be.false;
      expect(element.size).to.equal(RadioSize.Medium);
      expect(element.name).to.equal('');
      expect(element.required).to.be.false;
    });

    it('should render radio wrapper', async () => {
      const wrapper = element.shadowRoot?.querySelector('.radio-wrapper');
      expect(wrapper).to.exist;
    });

    it('should render radio input', async () => {
      const input = element.shadowRoot?.querySelector('input[type="radio"]');
      expect(input).to.exist;
    });

    it('should render radio circle', async () => {
      const circle = element.shadowRoot?.querySelector('.radio-circle');
      expect(circle).to.exist;
    });

    it('should render radio label', async () => {
      const label = element.shadowRoot?.querySelector('.radio-label');
      expect(label).to.exist;
    });

    it('should render slot for content', async () => {
      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Checked state', () => {
    it('should not be checked by default', () => {
      expect(element.checked).to.be.false;
    });

    it('should accept checked attribute', async () => {
      const radio = await fixture<NrRadioElement>(html`
        <nr-radio checked>Checked option</nr-radio>
      `);

      expect(radio.checked).to.be.true;
    });

    it('should update checked programmatically', async () => {
      element.checked = true;
      await element.updateComplete;

      expect(element.checked).to.be.true;
    });

    it('should reflect checked in input element', async () => {
      element.checked = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
      expect(input.checked).to.be.true;
    });

    it('should check on click', async () => {
      element.click();
      await element.updateComplete;

      expect(element.checked).to.be.true;
    });

    it('should not uncheck when clicking already checked radio', async () => {
      element.checked = true;
      await element.updateComplete;

      element.click();
      await element.updateComplete;

      expect(element.checked).to.be.true;
    });
  });

  describe('Disabled state', () => {
    it('should not be disabled by default', () => {
      expect(element.disabled).to.be.false;
    });

    it('should accept disabled attribute', async () => {
      const radio = await fixture<NrRadioElement>(html`
        <nr-radio disabled>Disabled option</nr-radio>
      `);

      expect(radio.disabled).to.be.true;
    });

    it('should update disabled programmatically', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
    });

    it('should reflect disabled in input element', async () => {
      element.disabled = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('should not check when clicked while disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.click();
      await element.updateComplete;

      expect(element.checked).to.be.false;
    });
  });

  describe('Size variants', () => {
    it('should apply medium size by default', () => {
      expect(element.size).to.equal('medium');
    });

    it('should apply small size', async () => {
      element.size = RadioSize.Small;
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector('[data-size="small"]');
      expect(wrapper).to.exist;
    });

    it('should apply medium size', async () => {
      element.size = RadioSize.Medium;
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector('[data-size="medium"]');
      expect(wrapper).to.exist;
    });

    it('should apply large size', async () => {
      element.size = RadioSize.Large;
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector('[data-size="large"]');
      expect(wrapper).to.exist;
    });
  });

  describe('Name and Value', () => {
    it('should accept name attribute', async () => {
      const radio = await fixture<NrRadioElement>(html`
        <nr-radio name="options" value="1">Option 1</nr-radio>
      `);

      expect(radio.name).to.equal('options');
    });

    it('should accept value attribute', async () => {
      expect(element.value).to.equal('option1');
    });

    it('should update name programmatically', async () => {
      element.name = 'myGroup';
      await element.updateComplete;

      expect(element.name).to.equal('myGroup');
    });

    it('should update value programmatically', async () => {
      element.value = 'newValue';
      await element.updateComplete;

      expect(element.value).to.equal('newValue');
    });

    it('should reflect name in input element', async () => {
      element.name = 'groupName';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
      expect(input.name).to.equal('groupName');
    });

    it('should reflect value in input element', async () => {
      element.value = 'testValue';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
      expect(input.value).to.equal('testValue');
    });
  });

  describe('Required state', () => {
    it('should not be required by default', () => {
      expect(element.required).to.be.false;
    });

    it('should accept required attribute', async () => {
      const radio = await fixture<NrRadioElement>(html`
        <nr-radio required>Required option</nr-radio>
      `);

      expect(radio.required).to.be.true;
    });

    it('should reflect required in input element', async () => {
      element.required = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement;
      expect(input.required).to.be.true;
    });
  });

  describe('Events', () => {
    it('should dispatch nr-change event when checked', async () => {
      setTimeout(() => {
        element.click();
      });

      const event = await oneEvent(element, 'nr-change') as CustomEvent;
      expect(event).to.exist;
      expect(event.detail.value).to.equal('option1');
      expect(event.detail.checked).to.be.true;
    });

    it('should dispatch nr-focus event on focus', async () => {
      setTimeout(() => {
        element.focus();
      });

      const event = await oneEvent(element, 'nr-focus');
      expect(event).to.exist;
    });

    it('should dispatch nr-blur event on blur', async () => {
      element.focus();
      await element.updateComplete;

      setTimeout(() => {
        element.blur();
      });

      const event = await oneEvent(element, 'nr-blur');
      expect(event).to.exist;
    });

    it('should not dispatch events when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      let eventFired = false;
      element.addEventListener('nr-change', () => {
        eventFired = true;
      });

      element.click();
      await element.updateComplete;

      expect(eventFired).to.be.false;
    });
  });

  describe('Radio group behavior', () => {
    it('should uncheck siblings with same name', async () => {
      const container = await fixture(html`
        <div>
          <nr-radio name="group" value="1" checked>Option 1</nr-radio>
          <nr-radio name="group" value="2">Option 2</nr-radio>
          <nr-radio name="group" value="3">Option 3</nr-radio>
        </div>
      `);

      const radios = container.querySelectorAll('nr-radio') as NodeListOf<NrRadioElement>;
      expect(radios[0].checked).to.be.true;
      expect(radios[1].checked).to.be.false;
      expect(radios[2].checked).to.be.false;

      radios[1].click();
      await radios[1].updateComplete;

      expect(radios[0].checked).to.be.false;
      expect(radios[1].checked).to.be.true;
      expect(radios[2].checked).to.be.false;
    });

    it('should only allow one checked in group', async () => {
      const container = await fixture(html`
        <div>
          <nr-radio name="exclusive" value="a">A</nr-radio>
          <nr-radio name="exclusive" value="b">B</nr-radio>
        </div>
      `);

      const radios = container.querySelectorAll('nr-radio') as NodeListOf<NrRadioElement>;

      radios[0].click();
      await radios[0].updateComplete;
      expect(radios[0].checked).to.be.true;

      radios[1].click();
      await radios[1].updateComplete;
      expect(radios[0].checked).to.be.false;
      expect(radios[1].checked).to.be.true;
    });

    it('should not affect radios with different names', async () => {
      const container = await fixture(html`
        <div>
          <nr-radio name="group1" value="1" checked>Group 1</nr-radio>
          <nr-radio name="group2" value="2" checked>Group 2</nr-radio>
        </div>
      `);

      const radios = container.querySelectorAll('nr-radio') as NodeListOf<NrRadioElement>;
      expect(radios[0].checked).to.be.true;
      expect(radios[1].checked).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('should have aria-checked attribute', async () => {
      const input = element.shadowRoot?.querySelector('input[type="radio"]');
      expect(input?.getAttribute('aria-checked')).to.equal('false');

      element.checked = true;
      await element.updateComplete;

      const checkedInput = element.shadowRoot?.querySelector('input[type="radio"]');
      expect(checkedInput?.getAttribute('aria-checked')).to.equal('true');
    });

    it('should have aria-disabled attribute', async () => {
      const input = element.shadowRoot?.querySelector('input[type="radio"]');
      expect(input?.getAttribute('aria-disabled')).to.equal('false');

      element.disabled = true;
      await element.updateComplete;

      const disabledInput = element.shadowRoot?.querySelector('input[type="radio"]');
      expect(disabledInput?.getAttribute('aria-disabled')).to.equal('true');
    });

    it('should have tabindex', async () => {
      expect(element.tabIndex).to.equal(0);
    });

    it('should accept custom tabindex', async () => {
      element.tabIndex = -1;
      await element.updateComplete;

      expect(element.tabIndex).to.equal(-1);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty value', async () => {
      element.value = '';
      await element.updateComplete;

      expect(element.value).to.equal('');
    });

    it('should handle empty name', async () => {
      element.name = '';
      await element.updateComplete;

      expect(element.name).to.equal('');
    });

    it('should handle rapid state changes', async () => {
      element.checked = true;
      element.checked = false;
      element.checked = true;
      await element.updateComplete;

      expect(element.checked).to.be.true;
    });

    it('should handle special characters in value', async () => {
      element.value = '<script>alert("xss")</script>';
      await element.updateComplete;

      // Value should be stored safely
      expect(element.value).to.equal('<script>alert("xss")</script>');
    });

    it('should handle unicode in label', async () => {
      const radio = await fixture<NrRadioElement>(html`
        <nr-radio>选项 1 🔘</nr-radio>
      `);

      expect(radio).to.exist;
    });
  });
});
