/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { HyCollapse } from '../collapse.component.js';
import {
  CollapseSection,
  CollapseSize,
  CollapseVariant,
  CollapseAnimation
} from '../collapse.type.js';

describe('HyCollapse', () => {
  let element: HyCollapse;

  const sampleSections: CollapseSection[] = [
    { header: 'Section 1', content: 'Content 1' },
    { header: 'Section 2', content: 'Content 2' },
    { header: 'Section 3', content: 'Content 3' }
  ];

  beforeEach(async () => {
    element = await fixture(html`
      <nr-collapse .sections=${sampleSections}></nr-collapse>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-COLLAPSE');
    });

    it('should have default properties', () => {
      expect(element.size).to.equal(CollapseSize.Medium);
      expect(element.variant).to.equal(CollapseVariant.Default);
      expect(element.animation).to.equal(CollapseAnimation.Slide);
      expect(element.accordion).to.be.false;
      expect(element.allowMultiple).to.be.false;
      expect(element.disabled).to.be.false;
    });

    it('should render collapse container', async () => {
      const container = element.shadowRoot?.querySelector('.collapse-container');
      expect(container).to.exist;
    });

    it('should render all sections', async () => {
      const sections = element.shadowRoot?.querySelectorAll('.collapse-section');
      expect(sections?.length).to.equal(3);
    });
  });

  describe('Section toggling', () => {
    it('should toggle section on click', async () => {
      const header = element.shadowRoot?.querySelector('.collapse-header') as HTMLElement;
      header?.click();
      await element.updateComplete;

      expect(element.sections[0].open).to.be.true;
    });

    it('should close open section on second click', async () => {
      element.sections = [{ ...sampleSections[0], open: true }, ...sampleSections.slice(1)];
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.collapse-header') as HTMLElement;
      header?.click();
      await element.updateComplete;

      expect(element.sections[0].open).to.be.false;
    });

    it('should toggle section programmatically', async () => {
      await element.toggleSection(0);
      await element.updateComplete;

      expect(element.sections[0].open).to.be.true;
    });

    it('should open section programmatically', async () => {
      await element.openSection(0);
      await element.updateComplete;

      expect(element.sections[0].open).to.be.true;
    });

    it('should close section programmatically', async () => {
      element.sections = [{ ...sampleSections[0], open: true }, ...sampleSections.slice(1)];
      await element.updateComplete;

      await element.closeSection(0);
      await element.updateComplete;

      expect(element.sections[0].open).to.be.false;
    });
  });

  describe('Accordion mode', () => {
    it('should support accordion mode', async () => {
      element.accordion = true;
      await element.updateComplete;

      expect(element.accordion).to.be.true;
    });

    it('should close other sections in accordion mode', async () => {
      element.accordion = true;
      element.sections = [
        { ...sampleSections[0], open: true },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      // Open another section
      await element.toggleSection(1);
      await element.updateComplete;

      // First section should be closed
      expect(element.sections[0].open).to.be.false;
      expect(element.sections[1].open).to.be.true;
    });

    it('should allow multiple open sections when allowMultiple is true', async () => {
      element.allowMultiple = true;
      await element.updateComplete;

      await element.toggleSection(0);
      await element.toggleSection(1);
      await element.updateComplete;

      expect(element.sections[0].open).to.be.true;
      expect(element.sections[1].open).to.be.true;
    });
  });

  describe('Collapse sizes', () => {
    it('should apply small size', async () => {
      element.size = CollapseSize.Small;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.collapse-small');
      expect(container).to.exist;
    });

    it('should apply medium size', async () => {
      element.size = CollapseSize.Medium;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.collapse-medium');
      expect(container).to.exist;
    });

    it('should apply large size', async () => {
      element.size = CollapseSize.Large;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.collapse-large');
      expect(container).to.exist;
    });
  });

  describe('Collapse variants', () => {
    it('should apply default variant', async () => {
      element.variant = CollapseVariant.Default;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.collapse-default');
      expect(container).to.exist;
    });

    it('should apply bordered variant', async () => {
      element.variant = CollapseVariant.Bordered;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.collapse-bordered');
      expect(container).to.exist;
    });

    it('should apply ghost variant', async () => {
      element.variant = CollapseVariant.Ghost;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.collapse-ghost');
      expect(container).to.exist;
    });
  });

  describe('Animation types', () => {
    it('should apply slide animation', async () => {
      element.animation = CollapseAnimation.Slide;
      await element.updateComplete;

      expect(element.animation).to.equal('slide');
    });

    it('should apply fade animation', async () => {
      element.animation = CollapseAnimation.Fade;
      await element.updateComplete;

      expect(element.animation).to.equal('fade');
    });

    it('should support no animation', async () => {
      element.animation = CollapseAnimation.None;
      await element.updateComplete;

      expect(element.animation).to.equal('none');
    });
  });

  describe('Disabled state', () => {
    it('should support global disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.collapse-disabled');
      expect(container).to.exist;
    });

    it('should support disabled sections', async () => {
      element.sections = [
        { ...sampleSections[0], disabled: true },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      const disabledSection = element.shadowRoot?.querySelector('.collapse-section--disabled');
      expect(disabledSection).to.exist;
    });

    it('should not toggle disabled section', async () => {
      element.sections = [
        { ...sampleSections[0], disabled: true },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      await element.toggleSection(0);
      await element.updateComplete;

      expect(element.sections[0].open).to.be.undefined;
    });
  });

  describe('Non-collapsible sections', () => {
    it('should support non-collapsible sections', async () => {
      element.sections = [
        { ...sampleSections[0], collapsible: false, open: true },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      const nonCollapsible = element.shadowRoot?.querySelector('.collapse-section--non-collapsible');
      expect(nonCollapsible).to.exist;
    });

    it('should not toggle non-collapsible section', async () => {
      element.sections = [
        { ...sampleSections[0], collapsible: false, open: true },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      await element.toggleSection(0);
      await element.updateComplete;

      // Should remain open
      expect(element.sections[0].open).to.be.true;
    });
  });

  describe('Custom icons', () => {
    it('should use default expand icon', () => {
      expect(element.expandIcon).to.equal('chevron-right');
    });

    it('should use default collapse icon', () => {
      expect(element.collapseIcon).to.equal('chevron-down');
    });

    it('should support custom expand icon', async () => {
      element.expandIcon = 'plus';
      await element.updateComplete;

      expect(element.expandIcon).to.equal('plus');
    });

    it('should support custom collapse icon', async () => {
      element.collapseIcon = 'minus';
      await element.updateComplete;

      expect(element.collapseIcon).to.equal('minus');
    });

    it('should support per-section custom icons', async () => {
      element.sections = [
        { ...sampleSections[0], expandIcon: 'arrow-right', collapseIcon: 'arrow-down' },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      expect(element.sections[0].expandIcon).to.equal('arrow-right');
    });
  });

  describe('Events', () => {
    it('should dispatch section-toggle event', async () => {
      setTimeout(() => {
        element.toggleSection(0);
      });

      const event = await oneEvent(element, 'section-toggle');
      expect(event).to.exist;
      expect((event as CustomEvent).detail.index).to.equal(0);
      expect((event as CustomEvent).detail.isOpen).to.be.true;
    });

    it('should dispatch section-before-toggle event', async () => {
      setTimeout(() => {
        element.toggleSection(0);
      });

      const event = await oneEvent(element, 'section-before-toggle');
      expect(event).to.exist;
      expect((event as CustomEvent).detail.index).to.equal(0);
    });
  });

  describe('Bulk operations', () => {
    it('should open all sections', async () => {
      element.openAllSections();
      await element.updateComplete;

      // In accordion mode, only one should be open
      // Otherwise depends on allowMultiple
    });

    it('should close all sections', async () => {
      element.sections = [
        { ...sampleSections[0], open: true },
        { ...sampleSections[1], open: true },
        sampleSections[2]
      ];
      await element.updateComplete;

      element.closeAllSections();
      await element.updateComplete;

      const openSections = element.sections.filter(s => s.open);
      expect(openSections.length).to.equal(0);
    });
  });

  describe('Accessibility', () => {
    it('should have role="button" on headers', async () => {
      const header = element.shadowRoot?.querySelector('.collapse-header');
      expect(header?.getAttribute('role')).to.equal('button');
    });

    it('should have aria-expanded attribute', async () => {
      const header = element.shadowRoot?.querySelector('.collapse-header');
      expect(header?.getAttribute('aria-expanded')).to.exist;
    });

    it('should have aria-controls attribute', async () => {
      // Open a section first to render content
      await element.toggleSection(0);
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.collapse-header');
      expect(header?.getAttribute('aria-controls')).to.exist;
    });

    it('should have role="region" on content', async () => {
      await element.toggleSection(0);
      await element.updateComplete;

      const content = element.shadowRoot?.querySelector('.collapse-content');
      expect(content?.getAttribute('role')).to.equal('region');
    });

    it('should be focusable via tabindex', async () => {
      const header = element.shadowRoot?.querySelector('.collapse-header');
      expect(header?.getAttribute('tabindex')).to.equal('0');
    });

    it('should have tabindex=-1 when disabled', async () => {
      element.sections = [
        { ...sampleSections[0], disabled: true },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      const headers = element.shadowRoot?.querySelectorAll('.collapse-header');
      expect(headers?.[0]?.getAttribute('tabindex')).to.equal('-1');
    });
  });

  describe('Header content', () => {
    it('should render header text', async () => {
      const header = element.shadowRoot?.querySelector('.collapse-header-text');
      expect(header).to.exist;
    });

    it('should support header right content', async () => {
      element.sections = [
        { ...sampleSections[0], headerRight: 'Extra info' },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      const headerRight = element.shadowRoot?.querySelector('.collapse-header-right');
      expect(headerRight).to.exist;
    });
  });

  describe('Content rendering', () => {
    it('should render content when open', async () => {
      element.sections = [{ ...sampleSections[0], open: true }, ...sampleSections.slice(1)];
      await element.updateComplete;

      const content = element.shadowRoot?.querySelector('.collapse-content');
      expect(content).to.exist;
    });

    it('should not render content when closed', async () => {
      const content = element.shadowRoot?.querySelector('.collapse-content');
      expect(content).to.not.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty sections array', async () => {
      element.sections = [];
      await element.updateComplete;

      const sections = element.shadowRoot?.querySelectorAll('.collapse-section');
      expect(sections?.length).to.equal(0);
    });

    it('should handle single section', async () => {
      element.sections = [sampleSections[0]];
      await element.updateComplete;

      const sections = element.shadowRoot?.querySelectorAll('.collapse-section');
      expect(sections?.length).to.equal(1);
    });

    it('should handle special characters in header', async () => {
      element.sections = [
        { header: '<script>alert("xss")</script>', content: 'Safe content' }
      ];
      await element.updateComplete;

      // Content should be escaped
    });

    it('should handle unicode in header', async () => {
      element.sections = [
        { header: '折叠面板 🔽', content: 'Content' }
      ];
      await element.updateComplete;

      expect(element.sections[0].header).to.include('折叠面板');
    });

    it('should handle rapid toggling', async () => {
      for (let i = 0; i < 5; i++) {
        element.toggleSection(0);
      }
      await element.updateComplete;

      // Should handle without errors
    });

    it('should handle out of bounds index', async () => {
      await element.toggleSection(100);
      await element.updateComplete;

      // Should not throw error
    });
  });

  describe('Custom class names', () => {
    it('should apply custom class to sections', async () => {
      element.sections = [
        { ...sampleSections[0], className: 'custom-section' },
        ...sampleSections.slice(1)
      ];
      await element.updateComplete;

      const customSection = element.shadowRoot?.querySelector('.collapse-section.custom-section');
      expect(customSection).to.exist;
    });
  });
});
