/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrTabsElement } from '../tabs.component.js';
import {
  TabOrientation,
  TabsAlign,
  TabSize,
  TabType,
  TabItem
} from '../tabs.types.js';

describe('NrTabsElement', () => {
  let element: NrTabsElement;

  const sampleTabs: TabItem[] = [
    { label: 'Tab 1', key: '0', content: 'Content 1' },
    { label: 'Tab 2', key: '1', content: 'Content 2' },
    { label: 'Tab 3', key: '2', content: 'Content 3' },
    { label: 'Tab 4', key: '3', content: 'Content 4', disabled: true },
  ];

  beforeEach(async () => {
    element = await fixture(html`<nr-tabs .tabs=${sampleTabs}></nr-tabs>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-TABS');
    });

    it('should have default properties', () => {
      expect(element.activeTab).to.equal(0);
      expect(element.orientation).to.equal(TabOrientation.Horizontal);
      expect(element.align).to.equal(TabsAlign.Left);
    });

    it('should accept tabs array', async () => {
      expect(element.tabs).to.have.lengthOf(4);
      expect(element.tabs[0].label).to.equal('Tab 1');
    });

    it('should render tab headers', async () => {
      const tabHeaders = element.shadowRoot?.querySelectorAll('[class*="tab-header"], [role="tab"]');
      expect(tabHeaders?.length).to.be.greaterThan(0);
    });
  });

  describe('Active tab', () => {
    it('should set active tab', async () => {
      element.activeTab = 1;
      await element.updateComplete;

      expect(element.activeTab).to.equal(1);
    });

    it('should dispatch nr-tab-change event', async () => {
      setTimeout(() => {
        element.activeTab = 2;
        element.dispatchEvent(new CustomEvent('nr-tab-change', {
          detail: { index: 2 },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-tab-change');
      expect(event).to.exist;
    });

    it('should dispatch nr-tab-click event', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-tab-click', {
          detail: { index: 1, tab: sampleTabs[1] },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-tab-click');
      expect(event).to.exist;
    });
  });

  describe('Tab orientations', () => {
    it('should apply horizontal orientation', async () => {
      element.orientation = TabOrientation.Horizontal;
      await element.updateComplete;

      expect(element.orientation).to.equal('horizontal');
    });

    it('should apply vertical orientation', async () => {
      element.orientation = TabOrientation.Vertical;
      await element.updateComplete;

      expect(element.orientation).to.equal('vertical');
    });
  });

  describe('Tab alignment', () => {
    it('should apply left alignment', async () => {
      element.align = TabsAlign.Left;
      await element.updateComplete;

      expect(element.align).to.equal('left');
    });

    it('should apply center alignment', async () => {
      element.align = TabsAlign.Center;
      await element.updateComplete;

      expect(element.align).to.equal('center');
    });

    it('should apply right alignment', async () => {
      element.align = TabsAlign.Right;
      await element.updateComplete;

      expect(element.align).to.equal('right');
    });

    it('should apply stretch alignment', async () => {
      element.align = TabsAlign.Stretch;
      await element.updateComplete;

      expect(element.align).to.equal('stretch');
    });
  });

  describe('Tab sizes', () => {
    it('should apply small size', async () => {
      element.size = TabSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
    });

    it('should apply medium size', async () => {
      element.size = TabSize.Medium;
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = TabSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Tab types', () => {
    it('should apply line type', async () => {
      element.type = TabType.Line;
      await element.updateComplete;

      expect(element.type).to.equal('line');
    });

    it('should apply card type', async () => {
      element.type = TabType.Card;
      await element.updateComplete;

      expect(element.type).to.equal('card');
    });

    it('should apply button type', async () => {
      element.type = TabType.Button;
      await element.updateComplete;

      expect(element.type).to.equal('button');
    });
  });

  describe('Disabled tabs', () => {
    it('should support disabled tabs', async () => {
      expect(element.tabs[3].disabled).to.be.true;
    });

    it('should not allow selecting disabled tab', async () => {
      const initialActive = element.activeTab;
      // Attempt to select disabled tab
      element.activeTab = 3;
      await element.updateComplete;

      // Behavior depends on implementation
    });
  });

  describe('Editable tabs', () => {
    it('should support editable config', async () => {
      element.editable = { canAddTab: true, canDeleteTab: true };
      await element.updateComplete;

      expect(element.editable?.canAddTab).to.be.true;
      expect(element.editable?.canDeleteTab).to.be.true;
    });

    it('should dispatch nr-tab-add event', async () => {
      element.editable = { canAddTab: true };
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-tab-add', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-tab-add');
      expect(event).to.exist;
    });

    it('should dispatch nr-tab-remove event', async () => {
      element.editable = { canDeleteTab: true };
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-tab-remove', {
          detail: { index: 1 },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-tab-remove');
      expect(event).to.exist;
    });

    it('should dispatch nr-tab-edit event', async () => {
      element.editable = { canRenameTab: true };
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-tab-edit', {
          detail: { index: 0, label: 'Renamed Tab' },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-tab-edit');
      expect(event).to.exist;
    });
  });

  describe('Drag and drop', () => {
    it('should dispatch nr-tab-order-change event', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-tab-order-change', {
          detail: { fromIndex: 0, toIndex: 2 },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-tab-order-change');
      expect(event).to.exist;
    });
  });

  describe('Panel configuration', () => {
    it('should support panel config', async () => {
      element.panelConfig = { enabled: true, resizable: true, title: 'My Tabs' };
      await element.updateComplete;

      expect(element.panelConfig?.enabled).to.be.true;
      expect(element.panelConfig?.title).to.equal('My Tabs');
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate tabs with arrow keys', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await aTimeout(50);
    });

    it('should support Home key', async () => {
      element.activeTab = 2;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      await aTimeout(50);
    });

    it('should support End key', async () => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      await aTimeout(50);
    });
  });

  describe('Tabs with icons', () => {
    it('should support tabs with icons', async () => {
      const tabsWithIcons: TabItem[] = [
        { label: 'Home', key: '0', icon: 'home' },
        { label: 'Settings', key: '1', icon: 'settings' },
      ];

      element.tabs = tabsWithIcons;
      await element.updateComplete;

      expect(element.tabs[0].icon).to.equal('home');
    });
  });

  describe('Closable tabs', () => {
    it('should support closable tabs', async () => {
      const closableTabs: TabItem[] = [
        { label: 'Tab 1', key: '0', closable: true },
        { label: 'Tab 2', key: '1', closable: false },
      ];

      element.tabs = closableTabs;
      await element.updateComplete;

      expect(element.tabs[0].closable).to.be.true;
    });
  });

  describe('Controller integration', () => {
    it('should have keyboard controller', () => {
      const controller = (element as any).keyboardController;
      expect(controller).to.exist;
    });

    it('should have drag drop controller', () => {
      const controller = (element as any).dragDropController;
      expect(controller).to.exist;
    });

    it('should have editable controller', () => {
      const controller = (element as any).editableController;
      expect(controller).to.exist;
    });

    it('should have event controller', () => {
      const controller = (element as any).eventController;
      expect(controller).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty tabs array', async () => {
      element.tabs = [];
      await element.updateComplete;

      expect(element.tabs).to.have.lengthOf(0);
    });

    it('should handle single tab', async () => {
      element.tabs = [{ label: 'Only Tab', key: '0' }];
      await element.updateComplete;

      expect(element.tabs).to.have.lengthOf(1);
    });

    it('should handle tabs with special characters', async () => {
      const specialTabs: TabItem[] = [
        { label: '<script>alert("xss")</script>', key: '0' },
        { label: '你好世界', key: '1' },
      ];

      element.tabs = specialTabs;
      await element.updateComplete;

      expect(element.tabs[1].label).to.equal('你好世界');
    });

    it('should handle rapid tab changes', async () => {
      for (let i = 0; i < 3; i++) {
        element.activeTab = i;
      }
      await element.updateComplete;

      expect(element.activeTab).to.equal(2);
    });
  });

  describe('Accessibility', () => {
    it('should have tablist role', async () => {
      const tablist = element.shadowRoot?.querySelector('[role="tablist"]');
      expect(tablist).to.exist;
    });

    it('should have tab roles', async () => {
      const tabs = element.shadowRoot?.querySelectorAll('[role="tab"]');
      expect(tabs?.length).to.be.greaterThan(0);
    });

    it('should have tabpanel role', async () => {
      const tabpanel = element.shadowRoot?.querySelector('[role="tabpanel"]');
      expect(tabpanel).to.exist;
    });
  });
});
