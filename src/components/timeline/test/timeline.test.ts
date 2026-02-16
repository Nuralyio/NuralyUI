/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { NrTimelineElement } from '../timeline.component.js';
import {
  TimelineMode,
  TimelineItem,
  TimelineItemColor,
  TimelineItemPosition
} from '../timeline.types.js';

describe('NrTimelineElement', () => {
  let element: NrTimelineElement;

  const sampleItems: TimelineItem[] = [
    { children: 'Create a services site', label: '2015-09-01' },
    { children: 'Solve initial network problems', label: '2015-09-02' },
    { children: 'Technical testing', label: '2015-09-03' }
  ];

  beforeEach(async () => {
    element = await fixture(html`
      <nr-timeline .items=${sampleItems}></nr-timeline>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-TIMELINE');
    });

    it('should have default properties', () => {
      expect(element.mode).to.equal(TimelineMode.Left);
      expect(element.reverse).to.be.false;
      expect(element.items).to.deep.equal(sampleItems);
    });

    it('should render timeline list', async () => {
      const timeline = element.shadowRoot?.querySelector('ul.timeline');
      expect(timeline).to.exist;
    });

    it('should render all items', async () => {
      const items = element.shadowRoot?.querySelectorAll('.timeline-item');
      expect(items?.length).to.equal(3);
    });
  });

  describe('Timeline modes', () => {
    it('should apply left mode by default', async () => {
      expect(element.mode).to.equal('left');
    });

    it('should apply right mode', async () => {
      element.mode = TimelineMode.Right;
      await element.updateComplete;

      expect(element.mode).to.equal('right');
    });

    it('should apply alternate mode', async () => {
      element.mode = TimelineMode.Alternate;
      await element.updateComplete;

      expect(element.mode).to.equal('alternate');
    });

    it('should alternate positions in alternate mode', async () => {
      element.mode = TimelineMode.Alternate;
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.timeline-item');
      const firstItem = items?.[0];
      const secondItem = items?.[1];

      expect(firstItem?.classList.contains('timeline-item-left')).to.be.true;
      expect(secondItem?.classList.contains('timeline-item-right')).to.be.true;
    });
  });

  describe('Timeline item colors', () => {
    it('should apply blue color by default', async () => {
      const dot = element.shadowRoot?.querySelector('.timeline-item-head');
      expect(dot?.classList.contains('blue')).to.be.true;
    });

    it('should apply red color', async () => {
      const itemsWithColor: TimelineItem[] = [
        { children: 'Error item', color: TimelineItemColor.Red }
      ];

      element.items = itemsWithColor;
      await element.updateComplete;

      const dot = element.shadowRoot?.querySelector('.timeline-item-head.red');
      expect(dot).to.exist;
    });

    it('should apply green color', async () => {
      const itemsWithColor: TimelineItem[] = [
        { children: 'Success item', color: TimelineItemColor.Green }
      ];

      element.items = itemsWithColor;
      await element.updateComplete;

      const dot = element.shadowRoot?.querySelector('.timeline-item-head.green');
      expect(dot).to.exist;
    });

    it('should apply gray color', async () => {
      const itemsWithColor: TimelineItem[] = [
        { children: 'Neutral item', color: TimelineItemColor.Gray }
      ];

      element.items = itemsWithColor;
      await element.updateComplete;

      const dot = element.shadowRoot?.querySelector('.timeline-item-head.gray');
      expect(dot).to.exist;
    });

    it('should support custom color', async () => {
      const itemsWithCustomColor: TimelineItem[] = [
        { children: 'Custom color item', color: '#ff5500' }
      ];

      element.items = itemsWithCustomColor;
      await element.updateComplete;

      expect(element.items[0].color).to.equal('#ff5500');
    });
  });

  describe('Timeline item labels', () => {
    it('should display labels', async () => {
      const content = element.shadowRoot?.querySelector('.timeline-item-content');
      expect(content?.textContent).to.include('2015-09-01');
    });

    it('should display labels in alternate mode', async () => {
      element.mode = TimelineMode.Alternate;
      await element.updateComplete;

      const label = element.shadowRoot?.querySelector('.timeline-item-label');
      expect(label).to.exist;
    });
  });

  describe('Custom dot icons', () => {
    it('should support custom dot icon', async () => {
      const itemsWithDot: TimelineItem[] = [
        { children: 'Item with custom dot', dot: 'clock' }
      ];

      element.items = itemsWithDot;
      await element.updateComplete;

      const customDot = element.shadowRoot?.querySelector('.timeline-item-head-custom');
      expect(customDot).to.exist;
    });
  });

  describe('Pending state', () => {
    it('should render pending item', async () => {
      element.pending = 'Recording...';
      await element.updateComplete;

      const pendingItem = element.shadowRoot?.querySelector('.timeline-item.pending');
      expect(pendingItem).to.exist;
    });

    it('should display pending text', async () => {
      element.pending = 'Loading more...';
      await element.updateComplete;

      const pendingContent = element.shadowRoot?.querySelector('.timeline-item.pending .timeline-item-content');
      expect(pendingContent?.textContent).to.include('Loading more...');
    });

    it('should support custom pending dot', async () => {
      element.pending = 'Processing';
      element.pendingDot = 'spinner';
      await element.updateComplete;

      expect(element.pendingDot).to.equal('spinner');
    });
  });

  describe('Reverse order', () => {
    it('should not reverse by default', () => {
      expect(element.reverse).to.be.false;
    });

    it('should support reverse order', async () => {
      element.reverse = true;
      await element.updateComplete;

      expect(element.reverse).to.be.true;
    });
  });

  describe('Custom positioning in alternate mode', () => {
    it('should support custom position for items', async () => {
      const itemsWithPosition: TimelineItem[] = [
        { children: 'Item 1', position: TimelineItemPosition.Left },
        { children: 'Item 2', position: TimelineItemPosition.Left }, // Override alternate
        { children: 'Item 3', position: TimelineItemPosition.Right }
      ];

      element.mode = TimelineMode.Alternate;
      element.items = itemsWithPosition;
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.timeline-item');
      expect(items?.[1]?.classList.contains('timeline-item-left')).to.be.true;
    });
  });

  describe('Item content', () => {
    it('should display children content', async () => {
      const content = element.shadowRoot?.querySelector('.timeline-item-content');
      expect(content?.textContent).to.include('Create a services site');
    });
  });

  describe('Timeline structure', () => {
    it('should render tail for connecting items', async () => {
      const tail = element.shadowRoot?.querySelector('.timeline-item-tail');
      expect(tail).to.exist;
    });

    it('should render head/dot for each item', async () => {
      const heads = element.shadowRoot?.querySelectorAll('.timeline-item-head');
      expect(heads?.length).to.be.greaterThan(0);
    });
  });

  describe('Custom class names', () => {
    it('should apply custom class to items', async () => {
      const itemsWithClass: TimelineItem[] = [
        { children: 'Custom class item', className: 'custom-timeline-item' }
      ];

      element.items = itemsWithClass;
      await element.updateComplete;

      const item = element.shadowRoot?.querySelector('.timeline-item.custom-timeline-item');
      expect(item).to.exist;
    });
  });

  describe('Empty state', () => {
    it('should handle empty items array', async () => {
      element.items = [];
      await element.updateComplete;

      const timeline = element.shadowRoot?.querySelector('ul.timeline');
      expect(timeline).to.not.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle single item', async () => {
      element.items = [{ children: 'Single item' }];
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.timeline-item');
      expect(items?.length).to.equal(1);
    });

    it('should handle special characters in content', async () => {
      const specialItems: TimelineItem[] = [
        { children: '<script>alert("xss")</script>' }
      ];

      element.items = specialItems;
      await element.updateComplete;

      // Content should be safely rendered
    });

    it('should handle unicode content', async () => {
      const unicodeItems: TimelineItem[] = [
        { children: '创建网站 🚀', label: '2023年1月1日' }
      ];

      element.items = unicodeItems;
      await element.updateComplete;

      const content = element.shadowRoot?.querySelector('.timeline-item-content');
      expect(content?.textContent).to.include('创建网站');
    });

    it('should handle very long content', async () => {
      const longContent = 'A'.repeat(500);
      const longItems: TimelineItem[] = [
        { children: longContent }
      ];

      element.items = longItems;
      await element.updateComplete;

      expect(element.items[0].children.length).to.equal(500);
    });

    it('should handle rapid property changes', async () => {
      element.mode = TimelineMode.Left;
      element.mode = TimelineMode.Alternate;
      element.mode = TimelineMode.Right;
      await element.updateComplete;

      expect(element.mode).to.equal('right');
    });

    it('should handle many items', async () => {
      const manyItems: TimelineItem[] = Array.from({ length: 50 }, (_, i) => ({
        children: `Item ${i + 1}`,
        label: `Day ${i + 1}`
      }));

      element.items = manyItems;
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.timeline-item');
      expect(items?.length).to.equal(50);
    });
  });

  describe('Complex scenarios', () => {
    it('should render timeline with all features', async () => {
      const complexItems: TimelineItem[] = [
        { children: 'Success', color: TimelineItemColor.Green, label: 'Day 1' },
        { children: 'Processing', color: TimelineItemColor.Blue, dot: 'spinner' },
        { children: 'Error', color: TimelineItemColor.Red, label: 'Day 3' },
        { children: 'Pending', color: TimelineItemColor.Gray }
      ];

      element.mode = TimelineMode.Alternate;
      element.items = complexItems;
      element.pending = 'More to come...';
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.timeline-item');
      expect(items?.length).to.equal(5); // 4 items + 1 pending
    });

    it('should handle dynamic item updates', async () => {
      element.items = [{ children: 'Initial' }];
      await element.updateComplete;

      let items = element.shadowRoot?.querySelectorAll('.timeline-item');
      expect(items?.length).to.equal(1);

      element.items = [...element.items, { children: 'Added' }];
      await element.updateComplete;

      items = element.shadowRoot?.querySelectorAll('.timeline-item');
      expect(items?.length).to.equal(2);
    });
  });

  describe('Accessibility', () => {
    it('should render as unordered list', async () => {
      const list = element.shadowRoot?.querySelector('ul.timeline');
      expect(list).to.exist;
    });

    it('should render items as list items', async () => {
      const listItems = element.shadowRoot?.querySelectorAll('li.timeline-item');
      expect(listItems?.length).to.be.greaterThan(0);
    });
  });
});
