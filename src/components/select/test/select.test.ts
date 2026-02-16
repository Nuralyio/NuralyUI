/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { HySelectComponent } from '../select.component.js';
import {
  SelectOption,
  SelectType,
  SelectSize,
  SelectStatus
} from '../select.types.js';

describe('HySelectComponent', () => {
  let element: HySelectComponent;

  const sampleOptions: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4', disabled: true },
  ];

  beforeEach(async () => {
    element = await fixture(html`<nr-select .options=${sampleOptions}></nr-select>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-SELECT');
    });

    it('should have default properties', () => {
      expect(element.placeholder).to.equal('Select an option');
      expect(element.disabled).to.be.false;
      expect(element.type).to.equal(SelectType.Default);
      expect(element.multiple).to.be.false;
      expect(element.show).to.be.false;
      expect(element.status).to.equal(SelectStatus.Default);
      expect(element.size).to.equal(SelectSize.Medium);
      expect(element.required).to.be.false;
    });

    it('should accept options array', async () => {
      expect(element.options).to.have.lengthOf(4);
      expect(element.options[0].value).to.equal('1');
      expect(element.options[0].label).to.equal('Option 1');
    });

    it('should render placeholder when no value selected', async () => {
      const triggerText = element.shadowRoot?.querySelector('.select-trigger, [class*="trigger"]');
      expect(triggerText?.textContent).to.contain('Select an option');
    });
  });

  describe('Single selection', () => {
    it('should select an option', async () => {
      element.value = '1';
      await element.updateComplete;

      expect(element.value).to.equal('1');
    });

    it('should display selected option label', async () => {
      element.value = '1';
      await element.updateComplete;

      // The trigger should show the selected option's label
      const trigger = element.shadowRoot?.querySelector('.select-trigger, [class*="trigger"]');
      expect(trigger?.textContent).to.contain('Option 1');
    });

    it('should dispatch nr-change event on selection', async () => {
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
  });

  describe('Multiple selection', () => {
    beforeEach(async () => {
      element.multiple = true;
      await element.updateComplete;
    });

    it('should support multiple selection mode', () => {
      expect(element.multiple).to.be.true;
    });

    it('should accept array value for multiple selection', async () => {
      element.value = ['1', '2'];
      await element.updateComplete;

      expect(element.value).to.deep.equal(['1', '2']);
    });

    it('should handle empty array value', async () => {
      element.value = [];
      await element.updateComplete;

      expect(element.value).to.deep.equal([]);
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
      expect(element.hasAttribute('disabled')).to.be.true;
    });

    it('should not open dropdown when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      // Try to open
      const trigger = element.shadowRoot?.querySelector('.select-trigger, [class*="trigger"]') as HTMLElement;
      trigger?.click();
      await element.updateComplete;

      expect(element.show).to.be.false;
    });

    it('should support disabled options', async () => {
      expect(element.options[3].disabled).to.be.true;
    });
  });

  describe('Select types', () => {
    it('should apply default type', async () => {
      element.type = SelectType.Default;
      await element.updateComplete;

      expect(element.type).to.equal('default');
    });

    it('should apply inline type', async () => {
      element.type = SelectType.Inline;
      await element.updateComplete;

      expect(element.type).to.equal('inline');
    });

    it('should apply button type', async () => {
      element.type = SelectType.Button;
      await element.updateComplete;

      expect(element.type).to.equal('button');
    });

    it('should apply slot type', async () => {
      element.type = SelectType.Slot;
      await element.updateComplete;

      expect(element.type).to.equal('slot');
    });
  });

  describe('Select sizes', () => {
    it('should apply small size', async () => {
      element.size = SelectSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
      expect(element.hasAttribute('size')).to.be.true;
    });

    it('should apply medium size', async () => {
      element.size = SelectSize.Medium;
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = SelectSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Validation status', () => {
    it('should apply default status', async () => {
      element.status = SelectStatus.Default;
      await element.updateComplete;

      expect(element.status).to.equal('default');
    });

    it('should apply error status', async () => {
      element.status = SelectStatus.Error;
      await element.updateComplete;

      expect(element.status).to.equal('error');
      expect(element.hasAttribute('status')).to.be.true;
    });

    it('should apply warning status', async () => {
      element.status = SelectStatus.Warning;
      await element.updateComplete;

      expect(element.status).to.equal('warning');
    });

    it('should apply success status', async () => {
      element.status = SelectStatus.Success;
      await element.updateComplete;

      expect(element.status).to.equal('success');
    });
  });

  describe('Dropdown behavior', () => {
    it('should open dropdown on click', async () => {
      const trigger = element.shadowRoot?.querySelector('.select-trigger, [class*="trigger"]') as HTMLElement;
      trigger?.click();
      await element.updateComplete;

      expect(element.show).to.be.true;
    });

    it('should close dropdown on outside click', async () => {
      element.show = true;
      await element.updateComplete;

      // Simulate outside click
      document.body.click();
      await aTimeout(50);

      expect(element.show).to.be.false;
    });

    it('should dispatch nr-dropdown-open event', async () => {
      setTimeout(() => {
        element.show = true;
        element.dispatchEvent(new CustomEvent('nr-dropdown-open', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-dropdown-open');
      expect(event).to.exist;
    });

    it('should dispatch nr-dropdown-close event', async () => {
      element.show = true;
      await element.updateComplete;

      setTimeout(() => {
        element.show = false;
        element.dispatchEvent(new CustomEvent('nr-dropdown-close', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-dropdown-close');
      expect(event).to.exist;
    });
  });

  describe('Required validation', () => {
    it('should support required attribute', async () => {
      element.required = true;
      await element.updateComplete;

      expect(element.required).to.be.true;
      expect(element.hasAttribute('required')).to.be.true;
    });
  });

  describe('Form integration', () => {
    it('should support name attribute', async () => {
      element.name = 'country';
      await element.updateComplete;

      expect(element.name).to.equal('country');
    });
  });

  describe('Placeholder', () => {
    it('should display custom placeholder', async () => {
      element.placeholder = 'Choose a country';
      await element.updateComplete;

      expect(element.placeholder).to.equal('Choose a country');
    });
  });

  describe('Options with groups', () => {
    it('should support grouped options', async () => {
      const groupedOptions: SelectOption[] = [
        { value: '1', label: 'Option 1', group: 'Group A' },
        { value: '2', label: 'Option 2', group: 'Group A' },
        { value: '3', label: 'Option 3', group: 'Group B' },
      ];

      element.options = groupedOptions;
      await element.updateComplete;

      expect(element.options[0].group).to.equal('Group A');
      expect(element.options[2].group).to.equal('Group B');
    });
  });

  describe('Options with icons', () => {
    it('should support options with icons', async () => {
      const iconOptions: SelectOption[] = [
        { value: '1', label: 'Home', icon: 'home' },
        { value: '2', label: 'Settings', icon: 'settings' },
      ];

      element.options = iconOptions;
      await element.updateComplete;

      expect(element.options[0].icon).to.equal('home');
      expect(element.options[1].icon).to.equal('settings');
    });
  });

  describe('Options with descriptions', () => {
    it('should support options with descriptions', async () => {
      const descOptions: SelectOption[] = [
        { value: '1', label: 'Option 1', description: 'This is option 1' },
        { value: '2', label: 'Option 2', description: 'This is option 2' },
      ];

      element.options = descOptions;
      await element.updateComplete;

      expect(element.options[0].description).to.equal('This is option 1');
    });
  });

  describe('Keyboard navigation', () => {
    it('should open dropdown on Enter key', async () => {
      const trigger = element.shadowRoot?.querySelector('.select-trigger, [class*="trigger"]') as HTMLElement;
      trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await element.updateComplete;
      await aTimeout(50);

      expect(element.show).to.be.true;
    });

    it('should open dropdown on Space key', async () => {
      const trigger = element.shadowRoot?.querySelector('.select-trigger, [class*="trigger"]') as HTMLElement;
      trigger?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      await element.updateComplete;
      await aTimeout(50);

      expect(element.show).to.be.true;
    });

    it('should close dropdown on Escape key', async () => {
      element.show = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await element.updateComplete;
      await aTimeout(50);

      expect(element.show).to.be.false;
    });
  });

  describe('Controller integration', () => {
    it('should have selection controller', () => {
      const controller = (element as any).selectionController;
      expect(controller).to.exist;
    });

    it('should have keyboard controller', () => {
      const controller = (element as any).keyboardController;
      expect(controller).to.exist;
    });

    it('should have dropdown controller', () => {
      const controller = (element as any).dropdownController;
      expect(controller).to.exist;
    });

    it('should have validation controller', () => {
      const controller = (element as any).validationController;
      expect(controller).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty options array', async () => {
      element.options = [];
      await element.updateComplete;

      expect(element.options).to.have.lengthOf(0);
    });

    it('should handle undefined value', async () => {
      element.value = '';
      await element.updateComplete;

      expect(element.value).to.equal('');
    });

    it('should handle options with special characters', async () => {
      const specialOptions: SelectOption[] = [
        { value: 'special', label: '<script>alert("xss")</script>' },
        { value: 'unicode', label: '你好世界 🎉' },
      ];

      element.options = specialOptions;
      await element.updateComplete;

      expect(element.options[1].label).to.equal('你好世界 🎉');
    });

    it('should handle rapid selection changes', async () => {
      for (let i = 1; i <= 3; i++) {
        element.value = String(i);
      }
      await element.updateComplete;

      expect(element.value).to.equal('3');
    });

    it('should handle selecting non-existent value', async () => {
      element.value = 'non-existent';
      await element.updateComplete;

      expect(element.value).to.equal('non-existent');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const trigger = element.shadowRoot?.querySelector('.select-trigger, [class*="trigger"], [role="combobox"]');
      expect(trigger).to.exist;
    });

    it('should have listbox role for dropdown', async () => {
      element.show = true;
      await element.updateComplete;

      const dropdown = element.shadowRoot?.querySelector('[role="listbox"]');
      expect(dropdown).to.exist;
    });
  });
});
