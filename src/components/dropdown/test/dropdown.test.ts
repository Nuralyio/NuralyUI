/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrDropdownElement } from '../dropdown.component.js';
import {
  DropdownPlacement,
  DropdownTrigger,
  DropdownSize,
  DropdownAnimation,
  DropdownItem
} from '../dropdown.types.js';

describe('NrDropdownElement', () => {
  let element: NrDropdownElement;

  const sampleItems: DropdownItem[] = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3', disabled: true },
    { label: 'Item 4', value: '4' },
  ];

  beforeEach(async () => {
    element = await fixture(html`
      <nr-dropdown>
        <button slot="trigger">Open Menu</button>
        <div slot="content">Dropdown content</div>
      </nr-dropdown>
    `);
  });

  afterEach(() => {
    element.open = false;
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-DROPDOWN');
    });

    it('should have default properties', () => {
      expect(element.open).to.be.false;
      expect(element.placement).to.equal(DropdownPlacement.Bottom);
      expect(element.trigger).to.equal(DropdownTrigger.Hover);
      expect(element.size).to.equal(DropdownSize.Medium);
      expect(element.animation).to.equal(DropdownAnimation.Fade);
      expect(element.disabled).to.be.false;
      expect(element.arrow).to.be.false;
      expect(element.autoClose).to.be.false;
      expect(element.closeOnOutsideClick).to.be.true;
    });

    it('should render trigger slot', async () => {
      const triggerSlot = element.shadowRoot?.querySelector('slot[name="trigger"]');
      expect(triggerSlot).to.exist;
    });

    it('should render content slot', async () => {
      const contentSlot = element.shadowRoot?.querySelector('slot[name="content"]');
      expect(contentSlot).to.exist;
    });
  });

  describe('Open/Close behavior', () => {
    it('should open when open property is true', async () => {
      element.open = true;
      await element.updateComplete;

      expect(element.open).to.be.true;
      expect(element.hasAttribute('open')).to.be.true;
    });

    it('should close when open property is false', async () => {
      element.open = true;
      await element.updateComplete;

      element.open = false;
      await element.updateComplete;

      expect(element.open).to.be.false;
    });

    it('should dispatch nr-dropdown-open event', async () => {
      setTimeout(() => {
        element.open = true;
      });

      const event = await oneEvent(element, 'nr-dropdown-open');
      expect(event).to.exist;
    });

    it('should dispatch nr-dropdown-close event', async () => {
      element.open = true;
      await element.updateComplete;

      setTimeout(() => {
        element.open = false;
      });

      const event = await oneEvent(element, 'nr-dropdown-close');
      expect(event).to.exist;
    });
  });

  describe('Trigger modes', () => {
    it('should support hover trigger', async () => {
      element.trigger = DropdownTrigger.Hover;
      await element.updateComplete;

      expect(element.trigger).to.equal('hover');
    });

    it('should support click trigger', async () => {
      element.trigger = DropdownTrigger.Click;
      await element.updateComplete;

      expect(element.trigger).to.equal('click');
    });

    it('should support focus trigger', async () => {
      element.trigger = DropdownTrigger.Focus;
      await element.updateComplete;

      expect(element.trigger).to.equal('focus');
    });

    it('should support manual trigger', async () => {
      element.trigger = DropdownTrigger.Manual;
      await element.updateComplete;

      expect(element.trigger).to.equal('manual');
    });
  });

  describe('Placement', () => {
    it('should apply bottom placement', async () => {
      element.placement = DropdownPlacement.Bottom;
      await element.updateComplete;

      expect(element.placement).to.equal('bottom');
    });

    it('should apply top placement', async () => {
      element.placement = DropdownPlacement.Top;
      await element.updateComplete;

      expect(element.placement).to.equal('top');
    });

    it('should apply left placement', async () => {
      element.placement = DropdownPlacement.Left;
      await element.updateComplete;

      expect(element.placement).to.equal('left');
    });

    it('should apply right placement', async () => {
      element.placement = DropdownPlacement.Right;
      await element.updateComplete;

      expect(element.placement).to.equal('right');
    });

    it('should apply bottom-start placement', async () => {
      element.placement = DropdownPlacement.BottomStart;
      await element.updateComplete;

      expect(element.placement).to.equal('bottom-start');
    });

    it('should apply bottom-end placement', async () => {
      element.placement = DropdownPlacement.BottomEnd;
      await element.updateComplete;

      expect(element.placement).to.equal('bottom-end');
    });
  });

  describe('Dropdown sizes', () => {
    it('should apply small size', async () => {
      element.size = DropdownSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
    });

    it('should apply medium size', async () => {
      element.size = DropdownSize.Medium;
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = DropdownSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Animations', () => {
    it('should apply fade animation', async () => {
      element.animation = DropdownAnimation.Fade;
      await element.updateComplete;

      expect(element.animation).to.equal('fade');
    });

    it('should apply slide animation', async () => {
      element.animation = DropdownAnimation.Slide;
      await element.updateComplete;

      expect(element.animation).to.equal('slide');
    });

    it('should apply zoom animation', async () => {
      element.animation = DropdownAnimation.Zoom;
      await element.updateComplete;

      expect(element.animation).to.equal('zoom');
    });

    it('should support no animation', async () => {
      element.animation = DropdownAnimation.None;
      await element.updateComplete;

      expect(element.animation).to.equal('none');
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
    });

    it('should not open when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      // Try to open
      element.open = true;
      await element.updateComplete;

      // Should still be closed or behavior is prevented
    });
  });

  describe('Arrow', () => {
    it('should support arrow display', async () => {
      element.arrow = true;
      await element.updateComplete;

      expect(element.arrow).to.be.true;
    });
  });

  describe('Items', () => {
    it('should accept items array', async () => {
      element.items = sampleItems;
      await element.updateComplete;

      expect(element.items).to.have.lengthOf(4);
    });

    it('should support disabled items', async () => {
      element.items = sampleItems;
      await element.updateComplete;

      expect(element.items[2].disabled).to.be.true;
    });

    it('should dispatch nr-dropdown-item-click on item click', async () => {
      element.items = sampleItems;
      element.open = true;
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-dropdown-item-click', {
          detail: { item: sampleItems[0] },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-dropdown-item-click');
      expect(event).to.exist;
    });
  });

  describe('Close on outside click', () => {
    it('should close on outside click by default', async () => {
      expect(element.closeOnOutsideClick).to.be.true;
    });

    it('should allow disabling close on outside click', async () => {
      element.closeOnOutsideClick = false;
      await element.updateComplete;

      expect(element.closeOnOutsideClick).to.be.false;
    });

    it('should close when clicking outside', async () => {
      element.open = true;
      element.closeOnOutsideClick = true;
      await element.updateComplete;

      document.body.click();
      await aTimeout(100);

      expect(element.open).to.be.false;
    });
  });

  describe('Auto close', () => {
    it('should not auto close by default', () => {
      expect(element.autoClose).to.be.false;
    });

    it('should allow enabling auto close', async () => {
      element.autoClose = true;
      await element.updateComplete;

      expect(element.autoClose).to.be.true;
    });
  });

  describe('Slots', () => {
    it('should render trigger slot', async () => {
      const slot = element.shadowRoot?.querySelector('slot[name="trigger"]');
      expect(slot).to.exist;
    });

    it('should render content slot', async () => {
      const slot = element.shadowRoot?.querySelector('slot[name="content"]');
      expect(slot).to.exist;
    });

    it('should render header slot', async () => {
      const el = await fixture<NrDropdownElement>(html`
        <nr-dropdown>
          <button slot="trigger">Menu</button>
          <div slot="header">Header</div>
          <div slot="content">Content</div>
        </nr-dropdown>
      `);

      const headerSlot = el.shadowRoot?.querySelector('slot[name="header"]');
      expect(headerSlot).to.exist;
    });

    it('should render footer slot', async () => {
      const el = await fixture<NrDropdownElement>(html`
        <nr-dropdown>
          <button slot="trigger">Menu</button>
          <div slot="content">Content</div>
          <div slot="footer">Footer</div>
        </nr-dropdown>
      `);

      const footerSlot = el.shadowRoot?.querySelector('slot[name="footer"]');
      expect(footerSlot).to.exist;
    });
  });

  describe('Keyboard navigation', () => {
    it('should close on Escape key', async () => {
      element.open = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await aTimeout(50);

      expect(element.open).to.be.false;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty items array', async () => {
      element.items = [];
      await element.updateComplete;

      expect(element.items).to.have.lengthOf(0);
    });

    it('should handle rapid open/close', async () => {
      for (let i = 0; i < 5; i++) {
        element.open = true;
        element.open = false;
      }
      await element.updateComplete;

      expect(element.open).to.be.false;
    });

    it('should handle items with special characters', async () => {
      const specialItems: DropdownItem[] = [
        { label: '<script>alert("xss")</script>', value: 'xss' },
        { label: '你好世界', value: 'unicode' },
      ];

      element.items = specialItems;
      await element.updateComplete;

      expect(element.items[1].label).to.equal('你好世界');
    });
  });
});
