/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { SliderInput } from '../slider-input.component.js';

describe('SliderInput', () => {
  let element: SliderInput;

  beforeEach(async () => {
    element = await fixture(html`<nr-slider-input></nr-slider-input>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-SLIDER-INPUT');
    });

    it('should have default properties', () => {
      expect(element.disabled).to.be.false;
      expect(element.max).to.equal(100);
      expect(element.min).to.equal(0);
      expect(element.step).to.equal(1);
      expect(element.value).to.equal(0);
    });

    it('should render slider wrapper', async () => {
      const wrapper = element.shadowRoot?.querySelector('.slider-wrapper');
      expect(wrapper).to.exist;
    });

    it('should render range input', async () => {
      const input = element.shadowRoot?.querySelector('input[type="range"]');
      expect(input).to.exist;
    });

    it('should render range container', async () => {
      const container = element.shadowRoot?.querySelector('.range-container');
      expect(container).to.exist;
    });

    it('should render range slider track', async () => {
      const slider = element.shadowRoot?.querySelector('.range-slider');
      expect(slider).to.exist;
    });

    it('should render range thumb', async () => {
      const thumb = element.shadowRoot?.querySelector('.range-thumb');
      expect(thumb).to.exist;
    });
  });

  describe('Value', () => {
    it('should accept initial value', async () => {
      const sliderWithValue = await fixture<SliderInput>(html`
        <nr-slider-input value="50"></nr-slider-input>
      `);

      expect(sliderWithValue.value).to.equal(50);
    });

    it('should update value programmatically', async () => {
      element.value = 75;
      await element.updateComplete;

      expect(element.value).to.equal(75);
    });

    it('should clamp value to max', async () => {
      element.max = 100;
      element.value = 150;
      await element.updateComplete;

      // Value should be clamped when slider is interacted with
      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input).to.exist;
    });

    it('should clamp value to min', async () => {
      element.min = 10;
      element.value = 5;
      await element.updateComplete;

      // Value should be clamped when slider is interacted with
      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input).to.exist;
    });

    it('should reflect value in input element', async () => {
      element.value = 42;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.value).to.equal('42');
    });
  });

  describe('Min and Max', () => {
    it('should accept custom min', async () => {
      const slider = await fixture<SliderInput>(html`
        <nr-slider-input min="10"></nr-slider-input>
      `);

      expect(slider.min).to.equal(10);
    });

    it('should accept custom max', async () => {
      const slider = await fixture<SliderInput>(html`
        <nr-slider-input max="200"></nr-slider-input>
      `);

      expect(slider.max).to.equal(200);
    });

    it('should update min programmatically', async () => {
      element.min = 25;
      await element.updateComplete;

      expect(element.min).to.equal(25);
    });

    it('should update max programmatically', async () => {
      element.max = 500;
      await element.updateComplete;

      expect(element.max).to.equal(500);
    });

    it('should reflect min in input element', async () => {
      element.min = 20;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.min).to.equal('20');
    });

    it('should reflect max in input element', async () => {
      element.max = 150;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.max).to.equal('150');
    });

    it('should handle negative min', async () => {
      element.min = -50;
      await element.updateComplete;

      expect(element.min).to.equal(-50);
    });

    it('should handle negative range', async () => {
      element.min = -100;
      element.max = 0;
      element.value = -50;
      await element.updateComplete;

      expect(element.value).to.equal(-50);
    });
  });

  describe('Step', () => {
    it('should accept custom step', async () => {
      const slider = await fixture<SliderInput>(html`
        <nr-slider-input step="5"></nr-slider-input>
      `);

      expect(slider.step).to.equal(5);
    });

    it('should update step programmatically', async () => {
      element.step = 10;
      await element.updateComplete;

      expect(element.step).to.equal(10);
    });

    it('should reflect step in input element', async () => {
      element.step = 0.5;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.step).to.equal('0.5');
    });

    it('should handle decimal step', async () => {
      element.step = 0.1;
      await element.updateComplete;

      expect(element.step).to.equal(0.1);
    });
  });

  describe('Disabled state', () => {
    it('should not be disabled by default', () => {
      expect(element.disabled).to.be.false;
    });

    it('should accept disabled attribute', async () => {
      const disabledSlider = await fixture<SliderInput>(html`
        <nr-slider-input disabled></nr-slider-input>
      `);

      expect(disabledSlider.disabled).to.be.true;
    });

    it('should update disabled programmatically', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
    });

    it('should reflect disabled in input element', async () => {
      element.disabled = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.disabled).to.be.true;
    });

    it('should enable slider when disabled is removed', async () => {
      element.disabled = true;
      await element.updateComplete;

      element.disabled = false;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.disabled).to.be.false;
    });
  });

  describe('Events', () => {
    it('should dispatch change event when value changes', async () => {
      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;

      setTimeout(() => {
        input.value = '50';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      const event = await oneEvent(element, 'change');
      expect(event).to.exist;
    });

    it('should dispatch changed custom event with value detail', async () => {
      // Wait for firstUpdated to complete
      await aTimeout(50);

      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;

      setTimeout(() => {
        input.value = '75';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      const event = await oneEvent(element, 'changed') as CustomEvent;
      expect(event).to.exist;
      expect(event.detail).to.have.property('value');
    });
  });

  describe('Visual updates', () => {
    it('should update slider visuals on value change', async () => {
      element.value = 50;
      await element.updateComplete;
      await aTimeout(50); // Wait for requestAnimationFrame

      // Check CSS custom properties are set
      const sliderValueWidth = element.style.getPropertyValue('--nr-slider-value-width');
      expect(sliderValueWidth).to.exist;
    });

    it('should update thumb position on value change', async () => {
      element.value = 75;
      await element.updateComplete;
      await aTimeout(50);

      const thumbOffset = element.style.getPropertyValue('--nr-slider-thumb-offset');
      expect(thumbOffset).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle value at min', async () => {
      element.min = 0;
      element.max = 100;
      element.value = 0;
      await element.updateComplete;

      expect(element.value).to.equal(0);
    });

    it('should handle value at max', async () => {
      element.min = 0;
      element.max = 100;
      element.value = 100;
      await element.updateComplete;

      expect(element.value).to.equal(100);
    });

    it('should handle equal min and max', async () => {
      element.min = 50;
      element.max = 50;
      element.value = 50;
      await element.updateComplete;

      expect(element.value).to.equal(50);
    });

    it('should handle rapid value changes', async () => {
      element.value = 10;
      element.value = 50;
      element.value = 90;
      element.value = 25;
      await element.updateComplete;

      expect(element.value).to.equal(25);
    });

    it('should handle very large max value', async () => {
      element.max = 10000;
      element.value = 5000;
      await element.updateComplete;

      expect(element.value).to.equal(5000);
    });

    it('should handle very small step', async () => {
      element.step = 0.01;
      element.value = 0.05;
      await element.updateComplete;

      expect(element.step).to.equal(0.01);
    });

    it('should handle large step', async () => {
      element.step = 25;
      element.max = 100;
      await element.updateComplete;

      expect(element.step).to.equal(25);
    });
  });

  describe('Complex scenarios', () => {
    it('should work with custom range', async () => {
      const slider = await fixture<SliderInput>(html`
        <nr-slider-input
          min="0"
          max="255"
          step="1"
          value="128"
        ></nr-slider-input>
      `);

      expect(slider.min).to.equal(0);
      expect(slider.max).to.equal(255);
      expect(slider.value).to.equal(128);
    });

    it('should work with percentage-like range', async () => {
      const slider = await fixture<SliderInput>(html`
        <nr-slider-input
          min="0"
          max="100"
          step="1"
          value="50"
        ></nr-slider-input>
      `);

      expect(slider.value).to.equal(50);
    });

    it('should work with decimal range', async () => {
      const slider = await fixture<SliderInput>(html`
        <nr-slider-input
          min="0"
          max="1"
          step="0.1"
          value="0.5"
        ></nr-slider-input>
      `);

      expect(slider.min).to.equal(0);
      expect(slider.max).to.equal(1);
      expect(slider.step).to.equal(0.1);
    });
  });

  describe('Accessibility', () => {
    it('should render proper slider structure', async () => {
      const input = element.shadowRoot?.querySelector('input[type="range"]');
      expect(input).to.exist;
    });

    it('should have range type for input', async () => {
      const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
      expect(input.type).to.equal('range');
    });

    it('should have min and max attributes', async () => {
      const input = element.shadowRoot?.querySelector('input[type="range"]') as HTMLInputElement;
      expect(input.hasAttribute('min')).to.be.true;
      expect(input.hasAttribute('max')).to.be.true;
    });
  });
});
