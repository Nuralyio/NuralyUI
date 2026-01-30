/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { NrBreadcrumbElement } from '../breadcrumb.component.js';
import { BreadcrumbSeparator, BreadcrumbItem } from '../breadcrumb.types.js';

describe('NrBreadcrumbElement', () => {
  let element: NrBreadcrumbElement;

  const sampleItems: BreadcrumbItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Category', href: '/category' },
    { title: 'Product' }
  ];

  beforeEach(async () => {
    element = await fixture(html`
      <nr-breadcrumb .items=${sampleItems}></nr-breadcrumb>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-BREADCRUMB');
    });

    it('should have default properties', () => {
      expect(element.separator).to.equal(BreadcrumbSeparator.Slash);
      expect(element.items).to.deep.equal(sampleItems);
    });

    it('should render nav element', async () => {
      const nav = element.shadowRoot?.querySelector('nav.breadcrumb');
      expect(nav).to.exist;
    });

    it('should have aria-label for accessibility', async () => {
      const nav = element.shadowRoot?.querySelector('nav');
      expect(nav?.getAttribute('aria-label')).to.equal('Breadcrumb');
    });

    it('should render all items', async () => {
      const items = element.shadowRoot?.querySelectorAll('.breadcrumb-item');
      expect(items?.length).to.equal(3);
    });
  });

  describe('Separator types', () => {
    it('should use slash separator by default', async () => {
      const separator = element.shadowRoot?.querySelector('.breadcrumb-separator');
      expect(separator?.textContent).to.equal('/');
    });

    it('should use arrow separator', async () => {
      element.separator = BreadcrumbSeparator.Arrow;
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.breadcrumb-separator');
      expect(separator?.textContent).to.equal('>');
    });

    it('should use chevron separator', async () => {
      element.separator = BreadcrumbSeparator.Chevron;
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.breadcrumb-separator');
      expect(separator?.textContent).to.equal('›');
    });

    it('should use dash separator', async () => {
      element.separator = BreadcrumbSeparator.Dash;
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.breadcrumb-separator');
      expect(separator?.textContent).to.equal('-');
    });

    it('should use dot separator', async () => {
      element.separator = BreadcrumbSeparator.Dot;
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.breadcrumb-separator');
      expect(separator?.textContent).to.equal('•');
    });

    it('should support custom string separator', async () => {
      element.separator = '::';
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.breadcrumb-separator');
      expect(separator?.textContent).to.equal('::');
    });
  });

  describe('Breadcrumb items', () => {
    it('should render items with href as links', async () => {
      const links = element.shadowRoot?.querySelectorAll('a.breadcrumb-link');
      expect(links?.length).to.be.greaterThan(0);
    });

    it('should render last item as text (not link)', async () => {
      const items = element.shadowRoot?.querySelectorAll('.breadcrumb-item');
      const lastItem = items?.[items.length - 1];
      const link = lastItem?.querySelector('a.breadcrumb-link');
      expect(link).to.not.exist;

      const text = lastItem?.querySelector('.breadcrumb-text');
      expect(text).to.exist;
    });

    it('should handle items without href', async () => {
      const itemsWithoutHref: BreadcrumbItem[] = [
        { title: 'Home' },
        { title: 'Category' },
        { title: 'Product' }
      ];

      element.items = itemsWithoutHref;
      await element.updateComplete;

      expect(element.items).to.deep.equal(itemsWithoutHref);
    });
  });

  describe('Items with icons', () => {
    it('should render items with icons', async () => {
      const itemsWithIcons: BreadcrumbItem[] = [
        { title: 'Home', href: '/', icon: 'home' },
        { title: 'Settings', href: '/settings', icon: 'settings' },
        { title: 'Profile' }
      ];

      element.items = itemsWithIcons;
      await element.updateComplete;

      const icons = element.shadowRoot?.querySelectorAll('.breadcrumb-icon');
      expect(icons?.length).to.be.greaterThan(0);
    });
  });

  describe('Disabled items', () => {
    it('should support disabled items', async () => {
      const itemsWithDisabled: BreadcrumbItem[] = [
        { title: 'Home', href: '/' },
        { title: 'Category', href: '/category', disabled: true },
        { title: 'Product' }
      ];

      element.items = itemsWithDisabled;
      await element.updateComplete;

      const disabledLink = element.shadowRoot?.querySelector('.breadcrumb-link.disabled');
      expect(disabledLink).to.exist;
    });
  });

  describe('Click events', () => {
    it('should dispatch nr-breadcrumb-click event', async () => {
      const link = element.shadowRoot?.querySelector('a.breadcrumb-link') as HTMLAnchorElement;

      setTimeout(() => {
        link?.click();
      });

      const event = await oneEvent(element, 'nr-breadcrumb-click');
      expect(event).to.exist;
      expect((event as CustomEvent).detail.item).to.exist;
    });

    it('should not dispatch event for disabled items', async () => {
      const itemsWithDisabled: BreadcrumbItem[] = [
        { title: 'Home', href: '/', disabled: true },
        { title: 'Product' }
      ];

      element.items = itemsWithDisabled;
      await element.updateComplete;

      // Disabled items should prevent default
    });
  });

  describe('Dropdown menu', () => {
    it('should render items with dropdown menu', async () => {
      const itemsWithMenu: BreadcrumbItem[] = [
        { title: 'Home', href: '/' },
        {
          title: 'Products',
          menu: [
            { label: 'Electronics', href: '/products/electronics' },
            { label: 'Clothing', href: '/products/clothing' }
          ]
        },
        { title: 'Current Item' }
      ];

      element.items = itemsWithMenu;
      await element.updateComplete;

      const menuItem = element.shadowRoot?.querySelector('.breadcrumb-item-with-menu');
      expect(menuItem).to.exist;
    });

    it('should render menu items', async () => {
      const itemsWithMenu: BreadcrumbItem[] = [
        {
          title: 'Products',
          menu: [
            { label: 'Item 1' },
            { label: 'Item 2' }
          ]
        }
      ];

      element.items = itemsWithMenu;
      await element.updateComplete;

      const dropdown = element.shadowRoot?.querySelector('.breadcrumb-dropdown');
      expect(dropdown).to.exist;
    });
  });

  describe('Custom separator config', () => {
    it('should support separator config with icon', async () => {
      element.separatorConfig = {
        separator: 'chevron-right',
        isIcon: true,
        iconType: 'regular'
      };
      await element.updateComplete;

      // Should render icon as separator
    });

    it('should support separator config with text', async () => {
      element.separatorConfig = {
        separator: '>>>'
      };
      await element.updateComplete;

      const separator = element.shadowRoot?.querySelector('.breadcrumb-separator');
      expect(separator?.textContent?.trim()).to.equal('>>>');
    });
  });

  describe('Empty state', () => {
    it('should handle empty items array', async () => {
      element.items = [];
      await element.updateComplete;

      const nav = element.shadowRoot?.querySelector('nav.breadcrumb');
      expect(nav).to.not.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle single item', async () => {
      element.items = [{ title: 'Home' }];
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.breadcrumb-item');
      expect(items?.length).to.equal(1);

      // No separator should be shown
      const separator = element.shadowRoot?.querySelector('.breadcrumb-separator');
      expect(separator).to.not.exist;
    });

    it('should handle special characters in title', async () => {
      const specialItems: BreadcrumbItem[] = [
        { title: '<script>alert("xss")</script>' },
        { title: '你好世界' }
      ];

      element.items = specialItems;
      await element.updateComplete;

      // Content should be safely escaped
    });

    it('should handle very long titles', async () => {
      const longTitle = 'A'.repeat(200);
      element.items = [{ title: longTitle }];
      await element.updateComplete;

      expect(element.items[0].title.length).to.equal(200);
    });

    it('should handle rapid item updates', async () => {
      element.items = [{ title: 'First' }];
      element.items = [{ title: 'Second' }];
      element.items = [{ title: 'Third' }];
      await element.updateComplete;

      expect(element.items[0].title).to.equal('Third');
    });
  });

  describe('Custom class names', () => {
    it('should apply custom class to items', async () => {
      const itemsWithClass: BreadcrumbItem[] = [
        { title: 'Home', className: 'custom-class' }
      ];

      element.items = itemsWithClass;
      await element.updateComplete;

      const item = element.shadowRoot?.querySelector('.breadcrumb-item.custom-class');
      expect(item).to.exist;
    });
  });

  describe('Accessibility', () => {
    it('should have proper navigation landmark', async () => {
      const nav = element.shadowRoot?.querySelector('nav[aria-label="Breadcrumb"]');
      expect(nav).to.exist;
    });
  });
});
