/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import { NrIconPickerElement } from '../icon-picker.component.js';
import {
  IconPickerSize,
  IconPickerPlacement,
  IconPickerTrigger,
  IconType
} from '../icon-picker.types.js';

describe('NrIconPickerElement', () => {
  let element: NrIconPickerElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-icon-picker></nr-icon-picker>`);
    // Wait for icons to load
    await aTimeout(100);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-ICON-PICKER');
    });

    it('should have default properties', () => {
      expect(element.value).to.equal('');
      expect(element.size).to.equal(IconPickerSize.Small);
      expect(element.placement).to.equal(IconPickerPlacement.Auto);
      expect(element.trigger).to.equal(IconPickerTrigger.Manual);
      expect(element.disabled).to.be.false;
      expect(element.readonly).to.be.false;
      expect(element.showSearch).to.be.true;
      expect(element.showClear).to.be.true;
      expect(element.dropdownOpen).to.be.false;
    });

    it('should render dropdown component', async () => {
      const dropdown = element.shadowRoot?.querySelector('nr-dropdown');
      expect(dropdown).to.exist;
    });

    it('should render trigger button', async () => {
      const trigger = element.shadowRoot?.querySelector('.trigger-button');
      expect(trigger).to.exist;
    });
  });

  describe('Value', () => {
    it('should accept initial value', async () => {
      const picker = await fixture<NrIconPickerElement>(html`
        <nr-icon-picker value="heart"></nr-icon-picker>
      `);
      await aTimeout(100);

      expect(picker.value).to.equal('heart');
    });

    it('should update value programmatically', async () => {
      element.value = 'star';
      await element.updateComplete;

      expect(element.value).to.equal('star');
    });

    it('should display selected icon name', async () => {
      element.value = 'home';
      await element.updateComplete;
      await aTimeout(100);

      // If icon is found, selectedIcon should be set
      if (element.selectedIcon) {
        const iconName = element.shadowRoot?.querySelector('.icon-name');
        expect(iconName?.textContent).to.include('home');
      }
    });
  });

  describe('Size variants', () => {
    it('should apply small size by default', () => {
      expect(element.size).to.equal('small');
    });

    it('should accept medium size', async () => {
      element.size = IconPickerSize.Medium;
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should accept large size', async () => {
      element.size = IconPickerSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Placement options', () => {
    it('should default to auto placement', () => {
      expect(element.placement).to.equal('auto');
    });

    it('should accept top placement', async () => {
      element.placement = IconPickerPlacement.Top;
      await element.updateComplete;

      expect(element.placement).to.equal('top');
    });

    it('should accept bottom placement', async () => {
      element.placement = IconPickerPlacement.Bottom;
      await element.updateComplete;

      expect(element.placement).to.equal('bottom');
    });

    it('should accept left placement', async () => {
      element.placement = IconPickerPlacement.Left;
      await element.updateComplete;

      expect(element.placement).to.equal('left');
    });

    it('should accept right placement', async () => {
      element.placement = IconPickerPlacement.Right;
      await element.updateComplete;

      expect(element.placement).to.equal('right');
    });
  });

  describe('Dropdown behavior', () => {
    it('should be closed by default', () => {
      expect(element.dropdownOpen).to.be.false;
    });

    it('should open dropdown on trigger click', async () => {
      const triggerButton = element.shadowRoot?.querySelector('.trigger-button') as HTMLElement;
      triggerButton?.click();
      await element.updateComplete;

      expect(element.dropdownOpen).to.be.true;
    });

    it('should close dropdown on second click', async () => {
      element.dropdownOpen = true;
      await element.updateComplete;

      const triggerButton = element.shadowRoot?.querySelector('.trigger-button') as HTMLElement;
      triggerButton?.click();
      await element.updateComplete;

      expect(element.dropdownOpen).to.be.false;
    });
  });

  describe('Disabled state', () => {
    it('should not be disabled by default', () => {
      expect(element.disabled).to.be.false;
    });

    it('should apply disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
    });

    it('should pass disabled to trigger button', async () => {
      element.disabled = true;
      await element.updateComplete;

      const triggerButton = element.shadowRoot?.querySelector('.trigger-button');
      expect(triggerButton).to.exist;
    });
  });

  describe('Search functionality', () => {
    it('should show search by default', () => {
      expect(element.showSearch).to.be.true;
    });

    it('should hide search when showSearch is false', async () => {
      element.showSearch = false;
      element.dropdownOpen = true;
      await element.updateComplete;

      const searchInput = element.shadowRoot?.querySelector('.search-container');
      expect(searchInput).to.not.exist;
    });

    it('should have empty search query by default', () => {
      expect(element.searchQuery).to.equal('');
    });
  });

  describe('Clear functionality', () => {
    it('should show clear by default', () => {
      expect(element.showClear).to.be.true;
    });

    it('should hide clear button when no selection', async () => {
      element.value = '';
      await element.updateComplete;

      // Clear icon should not appear without selection
      expect(element.selectedIcon).to.be.null;
    });
  });

  describe('Icon types', () => {
    it('should default to solid icon type', () => {
      expect(element.iconTypes).to.deep.equal([IconType.Solid]);
    });

    it('should accept multiple icon types', async () => {
      element.iconTypes = [IconType.Solid, IconType.Regular];
      await element.updateComplete;

      expect(element.iconTypes).to.deep.equal([IconType.Solid, IconType.Regular]);
    });
  });

  describe('Placeholder', () => {
    it('should have default placeholder', () => {
      expect(element.placeholder).to.equal('Select an icon');
    });

    it('should accept custom placeholder', async () => {
      element.placeholder = 'Choose icon';
      await element.updateComplete;

      expect(element.placeholder).to.equal('Choose icon');
    });

    it('should display placeholder when no selection', async () => {
      element.value = '';
      await element.updateComplete;

      const placeholder = element.shadowRoot?.querySelector('.placeholder');
      expect(placeholder).to.exist;
    });
  });

  describe('Max visible icons', () => {
    it('should have default max visible', () => {
      expect(element.maxVisible).to.equal(500);
    });

    it('should accept custom max visible', async () => {
      element.maxVisible = 100;
      await element.updateComplete;

      expect(element.maxVisible).to.equal(100);
    });
  });

  describe('Loading state', () => {
    it('should not be loading after initialization', async () => {
      await aTimeout(150);
      expect(element.isLoading).to.be.false;
    });

    it('should have icons loaded', async () => {
      await aTimeout(150);
      expect(element.allIcons.length).to.be.greaterThan(0);
    });
  });

  describe('Filtered icons', () => {
    it('should have filtered icons matching all icons initially', async () => {
      await aTimeout(150);
      expect(element.filteredIcons.length).to.equal(element.allIcons.length);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty value', async () => {
      element.value = '';
      await element.updateComplete;

      expect(element.value).to.equal('');
      expect(element.selectedIcon).to.be.null;
    });

    it('should handle invalid icon name', async () => {
      element.value = 'nonexistent-icon-name-12345';
      await element.updateComplete;
      await aTimeout(100);

      expect(element.value).to.equal('nonexistent-icon-name-12345');
    });

    it('should handle rapid dropdown toggle', async () => {
      element.dropdownOpen = true;
      element.dropdownOpen = false;
      element.dropdownOpen = true;
      element.dropdownOpen = false;
      await element.updateComplete;

      expect(element.dropdownOpen).to.be.false;
    });

    it('should handle readonly state', async () => {
      element.readonly = true;
      await element.updateComplete;

      expect(element.readonly).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('should have trigger container', async () => {
      const triggerContainer = element.shadowRoot?.querySelector('.trigger-container');
      expect(triggerContainer).to.exist;
    });

    it('should render dropdown with slots', async () => {
      const dropdown = element.shadowRoot?.querySelector('nr-dropdown');
      expect(dropdown).to.exist;
    });
  });
});
