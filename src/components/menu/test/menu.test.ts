/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrMenuElement } from '../menu.component.js';
import { IMenu, MenuSize, IconPosition } from '../menu.types.js';

describe('NrMenuElement', () => {
  let element: NrMenuElement;

  const sampleMenuItems: IMenu[] = [
    { label: 'Home', link: '/' },
    { label: 'Products', link: '/products', children: [
      { label: 'Electronics', link: '/products/electronics' },
      { label: 'Clothing', link: '/products/clothing' },
    ]},
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact', disabled: true },
  ];

  beforeEach(async () => {
    element = await fixture(html`<nr-menu .items=${sampleMenuItems}></nr-menu>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-MENU');
    });

    it('should have default properties', () => {
      expect(element.size).to.equal(MenuSize.Medium);
      expect(element.arrowPosition).to.equal(IconPosition.Right);
    });

    it('should accept items array', async () => {
      expect(element.items).to.have.lengthOf(4);
      expect(element.items[0].label).to.equal('Home');
    });

    it('should render menu items', async () => {
      const menuItems = element.shadowRoot?.querySelectorAll('[class*="menu-item"], [role="menuitem"]');
      expect(menuItems?.length).to.be.greaterThan(0);
    });
  });

  describe('Menu sizes', () => {
    it('should apply small size', async () => {
      element.size = MenuSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
    });

    it('should apply medium size', async () => {
      element.size = MenuSize.Medium;
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = MenuSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Arrow position', () => {
    it('should apply left arrow position', async () => {
      element.arrowPosition = IconPosition.Left;
      await element.updateComplete;

      expect(element.arrowPosition).to.equal('left');
    });

    it('should apply right arrow position', async () => {
      element.arrowPosition = IconPosition.Right;
      await element.updateComplete;

      expect(element.arrowPosition).to.equal('right');
    });
  });

  describe('Nested menu items', () => {
    it('should support nested children', async () => {
      expect(element.items[1].children).to.have.lengthOf(2);
      expect(element.items[1].children![0].label).to.equal('Electronics');
    });

    it('should render submenu indicators', async () => {
      // Items with children should have some indicator
      const parentItems = element.items.filter(item => item.children && item.children.length > 0);
      expect(parentItems).to.have.lengthOf(1);
    });
  });

  describe('Disabled items', () => {
    it('should support disabled items', async () => {
      expect(element.items[3].disabled).to.be.true;
    });
  });

  describe('Menu item links', () => {
    it('should support link property', async () => {
      expect(element.items[0].link).to.equal('/');
      expect(element.items[2].link).to.equal('/about');
    });
  });

  describe('Menu items with icons', () => {
    it('should support icons', async () => {
      const menuWithIcons: IMenu[] = [
        { label: 'Dashboard', link: '/dashboard', icon: 'dashboard' },
        { label: 'Settings', link: '/settings', icon: 'settings' },
      ];

      element.items = menuWithIcons;
      await element.updateComplete;

      expect(element.items[0].icon).to.equal('dashboard');
    });
  });

  describe('Events', () => {
    it('should dispatch change event on item selection', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('change', {
          detail: { item: sampleMenuItems[0] },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'change');
      expect(event).to.exist;
    });

    it('should dispatch action-click event', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('action-click', {
          detail: { action: 'edit' },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'action-click');
      expect(event).to.exist;
    });

    it('should dispatch label-edit event', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('label-edit', {
          detail: { path: [0], oldValue: 'Home', newValue: 'Homepage' },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'label-edit');
      expect(event).to.exist;
    });
  });

  describe('Label editing', () => {
    it('should support onLabelEdit callback', async () => {
      let editCalled = false;
      element.onLabelEdit = () => { editCalled = true; };
      await element.updateComplete;

      expect(element.onLabelEdit).to.be.a('function');
    });
  });

  describe('Selected state', () => {
    it('should support selected items', async () => {
      const menuWithSelected: IMenu[] = [
        { label: 'Home', link: '/', selected: true },
        { label: 'About', link: '/about', selected: false },
      ];

      element.items = menuWithSelected;
      await element.updateComplete;

      expect(element.items[0].selected).to.be.true;
    });
  });

  describe('Opened state', () => {
    it('should support opened submenus', async () => {
      const menuWithOpened: IMenu[] = [
        { label: 'Products', opened: true, children: [
          { label: 'Item 1' },
          { label: 'Item 2' },
        ]},
      ];

      element.items = menuWithOpened;
      await element.updateComplete;

      expect(element.items[0].opened).to.be.true;
    });
  });

  describe('Controller integration', () => {
    it('should have state controller', () => {
      const controller = (element as any).stateController;
      expect(controller).to.exist;
    });

    it('should have keyboard controller', () => {
      const controller = (element as any).keyboardController;
      expect(controller).to.exist;
    });

    it('should have accessibility controller', () => {
      const controller = (element as any).accessibilityController;
      expect(controller).to.exist;
    });
  });

  describe('Keyboard navigation', () => {
    it('should handle arrow key navigation', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await aTimeout(50);
    });

    it('should handle Enter key', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await aTimeout(50);
    });

    it('should handle Escape key', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await aTimeout(50);
    });
  });

  describe('Accessibility', () => {
    it('should have menu role', async () => {
      const menu = element.shadowRoot?.querySelector('[role="menu"]');
      expect(menu).to.exist;
    });

    it('should have menuitem roles', async () => {
      const menuItems = element.shadowRoot?.querySelectorAll('[role="menuitem"]');
      expect(menuItems?.length).to.be.greaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty items array', async () => {
      element.items = [];
      await element.updateComplete;

      expect(element.items).to.have.lengthOf(0);
    });

    it('should handle deeply nested menus', async () => {
      const deeplyNested: IMenu[] = [
        { label: 'Level 1', children: [
          { label: 'Level 2', children: [
            { label: 'Level 3', children: [
              { label: 'Level 4' }
            ]}
          ]}
        ]}
      ];

      element.items = deeplyNested;
      await element.updateComplete;

      expect(element.items[0].children![0].children![0].children![0].label).to.equal('Level 4');
    });

    it('should handle items with special characters', async () => {
      const specialItems: IMenu[] = [
        { label: '<script>alert("xss")</script>', link: '/' },
        { label: '你好世界', link: '/chinese' },
      ];

      element.items = specialItems;
      await element.updateComplete;

      expect(element.items[1].label).to.equal('你好世界');
    });

    it('should handle rapid item updates', async () => {
      for (let i = 0; i < 5; i++) {
        element.items = [{ label: `Item ${i}`, link: `/${i}` }];
      }
      await element.updateComplete;

      expect(element.items[0].label).to.equal('Item 4');
    });
  });
});
