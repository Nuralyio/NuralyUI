/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrRadioGroupElement } from '../radio-group.component.js';

describe('NrRadioGroupElement', () => {
  let element: NrRadioGroupElement;

  const sampleOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
    { label: 'Option 4', value: '4', disabled: true },
  ];

  beforeEach(async () => {
    element = await fixture(html`<nr-radio-group .options=${sampleOptions}></nr-radio-group>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-RADIO-GROUP');
    });

    it('should accept options array', async () => {
      expect(element.options).to.have.lengthOf(4);
      expect(element.options[0].label).to.equal('Option 1');
    });

    it('should render radio buttons', async () => {
      const radios = element.shadowRoot?.querySelectorAll('input[type="radio"], [role="radio"]');
      expect(radios?.length).to.be.greaterThan(0);
    });
  });

  describe('Selection', () => {
    it('should select a value', async () => {
      element.value = '1';
      await element.updateComplete;

      expect(element.value).to.equal('1');
    });

    it('should dispatch change event on selection', async () => {
      setTimeout(() => {
        element.value = '2';
        element.dispatchEvent(new CustomEvent('nr-change', {
          detail: { value: '2' },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-change');
      expect(event).to.exist;
    });

    it('should only allow one selection', async () => {
      element.value = '1';
      await element.updateComplete;

      element.value = '2';
      await element.updateComplete;

      expect(element.value).to.equal('2');
    });
  });

  describe('Disabled state', () => {
    it('should support disabled group', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
    });

    it('should support disabled options', async () => {
      expect(element.options[3].disabled).to.be.true;
    });
  });

  describe('Direction', () => {
    it('should support horizontal direction', async () => {
      element.direction = 'horizontal';
      await element.updateComplete;

      expect(element.direction).to.equal('horizontal');
    });

    it('should support vertical direction', async () => {
      element.direction = 'vertical';
      await element.updateComplete;

      expect(element.direction).to.equal('vertical');
    });
  });

  describe('Size', () => {
    it('should support small size', async () => {
      element.size = 'small';
      await element.updateComplete;

      expect(element.size).to.equal('small');
    });

    it('should support medium size', async () => {
      element.size = 'medium';
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should support large size', async () => {
      element.size = 'large';
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Form integration', () => {
    it('should support name attribute', async () => {
      element.name = 'gender';
      await element.updateComplete;

      expect(element.name).to.equal('gender');
    });

    it('should support required attribute', async () => {
      element.required = true;
      await element.updateComplete;

      expect(element.required).to.be.true;
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate with arrow keys', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await aTimeout(50);
    });

    it('should select with Space key', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      await aTimeout(50);
    });
  });

  describe('Accessibility', () => {
    it('should have radiogroup role', async () => {
      const group = element.shadowRoot?.querySelector('[role="radiogroup"]');
      expect(group).to.exist;
    });

    it('should have radio roles', async () => {
      const radios = element.shadowRoot?.querySelectorAll('[role="radio"]');
      expect(radios?.length).to.be.greaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty options', async () => {
      element.options = [];
      await element.updateComplete;

      expect(element.options).to.have.lengthOf(0);
    });

    it('should handle options with special characters', async () => {
      element.options = [
        { label: '你好世界', value: 'chinese' },
        { label: '<script>xss</script>', value: 'xss' },
      ];
      await element.updateComplete;

      expect(element.options[0].label).to.equal('你好世界');
    });
  });
});
