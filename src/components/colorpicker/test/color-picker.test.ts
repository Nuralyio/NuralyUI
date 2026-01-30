/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { ColorPicker } from '../color-picker.component.js';
import {
  ColorPickerSize,
  ColorPickerTrigger,
  ColorPickerPlacement,
  ColorFormat
} from '../color-picker.types.js';

describe('ColorPicker', () => {
  let element: ColorPicker;

  beforeEach(async () => {
    element = await fixture(html`<nr-color-picker></nr-color-picker>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-COLOR-PICKER');
    });

    it('should have default properties', () => {
      expect(element.color).to.equal('#3498db');
      expect(element.show).to.be.false;
      expect(element.disabled).to.be.false;
      expect(element.size).to.equal(ColorPickerSize.Default);
      expect(element.trigger).to.equal(ColorPickerTrigger.Click);
      expect(element.placement).to.equal(ColorPickerPlacement.Auto);
      expect(element.closeOnSelect).to.be.false;
      expect(element.closeOnOutsideClick).to.be.true;
      expect(element.closeOnEscape).to.be.true;
      expect(element.showInput).to.be.true;
      expect(element.showCopyButton).to.be.true;
      expect(element.format).to.equal(ColorFormat.Hex);
    });

    it('should render color picker container', async () => {
      const container = element.shadowRoot?.querySelector('.color-picker-container');
      expect(container).to.exist;
    });

    it('should render color holder trigger', async () => {
      const colorHolder = element.shadowRoot?.querySelector('nr-colorholder-box');
      expect(colorHolder).to.exist;
    });
  });

  describe('Color value', () => {
    it('should accept initial color', async () => {
      const picker = await fixture<ColorPicker>(html`
        <nr-color-picker color="#ff5500"></nr-color-picker>
      `);

      expect(picker.color).to.equal('#ff5500');
    });

    it('should update color programmatically', async () => {
      element.color = '#00ff00';
      await element.updateComplete;

      expect(element.color).to.equal('#00ff00');
    });

    it('should display color in trigger', async () => {
      element.color = '#e74c3c';
      await element.updateComplete;

      const colorHolder = element.shadowRoot?.querySelector('nr-colorholder-box');
      expect(colorHolder?.getAttribute('color')).to.equal('#e74c3c');
    });
  });

  describe('Size variants', () => {
    it('should apply default size', async () => {
      const container = element.shadowRoot?.querySelector('.color-picker-container--default');
      expect(container).to.exist;
    });

    it('should apply small size', async () => {
      element.size = ColorPickerSize.Small;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.color-picker-container--small');
      expect(container).to.exist;
    });

    it('should apply large size', async () => {
      element.size = ColorPickerSize.Large;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.color-picker-container--large');
      expect(container).to.exist;
    });
  });

  describe('Dropdown behavior', () => {
    it('should be closed by default', () => {
      expect(element.show).to.be.false;
    });

    it('should open dropdown programmatically', async () => {
      element.open();
      await element.updateComplete;

      expect(element.show).to.be.true;
    });

    it('should close dropdown programmatically', async () => {
      element.show = true;
      await element.updateComplete;

      element.close();
      await element.updateComplete;

      expect(element.show).to.be.false;
    });

    it('should toggle dropdown', async () => {
      element.toggle();
      await element.updateComplete;
      expect(element.show).to.be.true;

      element.toggle();
      await element.updateComplete;
      expect(element.show).to.be.false;
    });

    it('should render dropdown when open', async () => {
      element.show = true;
      await element.updateComplete;

      const dropdown = element.shadowRoot?.querySelector('.dropdown-container');
      expect(dropdown).to.exist;
    });

    it('should not render dropdown when closed', async () => {
      element.show = false;
      await element.updateComplete;

      const dropdown = element.shadowRoot?.querySelector('.dropdown-container');
      expect(dropdown).to.not.exist;
    });
  });

  describe('Disabled state', () => {
    it('should not be disabled by default', () => {
      expect(element.disabled).to.be.false;
    });

    it('should apply disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.color-picker-container--disabled');
      expect(container).to.exist;
    });

    it('should not open when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const colorHolder = element.shadowRoot?.querySelector('nr-colorholder-box');
      expect(colorHolder?.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('Default color sets', () => {
    it('should accept default color sets', async () => {
      const picker = await fixture<ColorPicker>(html`
        <nr-color-picker
          .defaultColorSets=${['#ff0000', '#00ff00', '#0000ff']}
        ></nr-color-picker>
      `);

      expect(picker.defaultColorSets).to.deep.equal(['#ff0000', '#00ff00', '#0000ff']);
    });

    it('should render default color sets when open', async () => {
      element.defaultColorSets = ['#ff0000', '#00ff00', '#0000ff'];
      element.show = true;
      await element.updateComplete;

      const defaultSets = element.shadowRoot?.querySelector('nr-default-color-sets');
      expect(defaultSets).to.exist;
    });

    it('should not render default color sets when empty', async () => {
      element.defaultColorSets = [];
      element.show = true;
      await element.updateComplete;

      const defaultSets = element.shadowRoot?.querySelector('nr-default-color-sets');
      expect(defaultSets).to.not.exist;
    });
  });

  describe('Color input', () => {
    it('should show input by default', async () => {
      element.show = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('nr-input');
      expect(input).to.exist;
    });

    it('should hide input when showInput is false', async () => {
      element.showInput = false;
      element.show = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('nr-input');
      expect(input).to.not.exist;
    });

    it('should apply input placeholder', async () => {
      element.inputPlaceholder = 'Enter hex color';
      element.show = true;
      await element.updateComplete;

      expect(element.inputPlaceholder).to.equal('Enter hex color');
    });
  });

  describe('Label and helper text', () => {
    it('should render label when provided', async () => {
      element.label = 'Pick a color';
      await element.updateComplete;

      const label = element.shadowRoot?.querySelector('.color-picker-label');
      expect(label?.textContent).to.include('Pick a color');
    });

    it('should not render label when empty', async () => {
      element.label = '';
      await element.updateComplete;

      const label = element.shadowRoot?.querySelector('.color-picker-label');
      expect(label).to.not.exist;
    });

    it('should render helper text when provided', async () => {
      element.helperText = 'Select your favorite color';
      await element.updateComplete;

      const helper = element.shadowRoot?.querySelector('.color-picker-helper-text');
      expect(helper?.textContent).to.include('Select your favorite color');
    });

    it('should not render helper text when empty', async () => {
      element.helperText = '';
      await element.updateComplete;

      const helper = element.shadowRoot?.querySelector('.color-picker-helper-text');
      expect(helper).to.not.exist;
    });
  });

  describe('Color validation', () => {
    it('should validate correct hex color', async () => {
      element.color = '#ff5500';
      const isValid = element.validateColor();
      expect(isValid).to.be.true;
    });

    it('should validate color on change', async () => {
      element.color = '#123456';
      await element.updateComplete;

      // Validation happens automatically on color change
      expect(element.color).to.equal('#123456');
    });
  });

  describe('Color format', () => {
    it('should default to hex format', () => {
      expect(element.format).to.equal('hex');
    });

    it('should accept RGB format', async () => {
      element.format = ColorFormat.RGB;
      await element.updateComplete;

      expect(element.format).to.equal('rgb');
    });

    it('should accept RGBA format', async () => {
      element.format = ColorFormat.RGBA;
      await element.updateComplete;

      expect(element.format).to.equal('rgba');
    });

    it('should accept HSL format', async () => {
      element.format = ColorFormat.HSL;
      await element.updateComplete;

      expect(element.format).to.equal('hsl');
    });
  });

  describe('Close behaviors', () => {
    it('should have closeOnOutsideClick enabled by default', () => {
      expect(element.closeOnOutsideClick).to.be.true;
    });

    it('should have closeOnEscape enabled by default', () => {
      expect(element.closeOnEscape).to.be.true;
    });

    it('should have closeOnSelect disabled by default', () => {
      expect(element.closeOnSelect).to.be.false;
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on trigger', async () => {
      const colorHolder = element.shadowRoot?.querySelector('nr-colorholder-box');
      expect(colorHolder?.getAttribute('aria-label')).to.equal('Select color');
    });

    it('should have aria-expanded on trigger', async () => {
      const colorHolder = element.shadowRoot?.querySelector('nr-colorholder-box');
      expect(colorHolder?.getAttribute('aria-expanded')).to.equal('false');

      element.show = true;
      await element.updateComplete;

      const updatedHolder = element.shadowRoot?.querySelector('nr-colorholder-box');
      expect(updatedHolder?.getAttribute('aria-expanded')).to.equal('true');
    });

    it('should have aria-haspopup on trigger', async () => {
      const colorHolder = element.shadowRoot?.querySelector('nr-colorholder-box');
      expect(colorHolder?.getAttribute('aria-haspopup')).to.equal('dialog');
    });

    it('should have role dialog on dropdown', async () => {
      element.show = true;
      await element.updateComplete;

      const dropdown = element.shadowRoot?.querySelector('.dropdown-container');
      expect(dropdown?.getAttribute('role')).to.equal('dialog');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty color', async () => {
      element.color = '';
      await element.updateComplete;

      expect(element.color).to.equal('');
    });

    it('should handle rapid open/close', async () => {
      element.open();
      element.close();
      element.open();
      element.close();
      await element.updateComplete;

      expect(element.show).to.be.false;
    });

    it('should handle special color values', async () => {
      element.color = 'rgb(255, 0, 0)';
      await element.updateComplete;

      expect(element.color).to.equal('rgb(255, 0, 0)');
    });

    it('should handle named colors', async () => {
      element.color = 'red';
      await element.updateComplete;

      expect(element.color).to.equal('red');
    });
  });
});
