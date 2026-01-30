/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { NrContainerElement } from '../container.component.js';

describe('NrContainerElement', () => {
  let element: NrContainerElement;

  beforeEach(async () => {
    element = await fixture(html`
      <nr-container>
        <div>Content</div>
      </nr-container>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-CONTAINER');
    });

    it('should have default properties', () => {
      expect(element.layout).to.equal('fluid');
      expect(element.direction).to.equal('column');
      expect(element.size).to.equal('lg');
      expect(element.wrap).to.be.false;
    });

    it('should render container element', async () => {
      const container = element.shadowRoot?.querySelector('.nr-container');
      expect(container).to.exist;
    });

    it('should render slot for content', async () => {
      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Layout types', () => {
    it('should apply fluid layout by default', async () => {
      const container = element.shadowRoot?.querySelector('[data-layout="fluid"]');
      expect(container).to.exist;
    });

    it('should apply boxed layout', async () => {
      element.layout = 'boxed';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-layout="boxed"]');
      expect(container).to.exist;
    });

    it('should apply fixed layout', async () => {
      element.layout = 'fixed';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-layout="fixed"]');
      expect(container).to.exist;
    });
  });

  describe('Direction', () => {
    it('should apply column direction by default', async () => {
      const container = element.shadowRoot?.querySelector('[data-direction="column"]');
      expect(container).to.exist;
    });

    it('should apply row direction', async () => {
      element.direction = 'row';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-direction="row"]');
      expect(container).to.exist;
    });
  });

  describe('Size presets', () => {
    it('should apply sm size', async () => {
      element.layout = 'boxed';
      element.size = 'sm';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-size="sm"]');
      expect(container).to.exist;
    });

    it('should apply md size', async () => {
      element.layout = 'boxed';
      element.size = 'md';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-size="md"]');
      expect(container).to.exist;
    });

    it('should apply lg size', async () => {
      element.layout = 'boxed';
      element.size = 'lg';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-size="lg"]');
      expect(container).to.exist;
    });

    it('should apply xl size', async () => {
      element.layout = 'boxed';
      element.size = 'xl';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-size="xl"]');
      expect(container).to.exist;
    });

    it('should apply full size', async () => {
      element.layout = 'boxed';
      element.size = 'full';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-size="full"]');
      expect(container).to.exist;
    });
  });

  describe('Padding presets', () => {
    it('should apply none padding', async () => {
      element.padding = 'none';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-padding="none"]');
      expect(container).to.exist;
    });

    it('should apply sm padding', async () => {
      element.padding = 'sm';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-padding="sm"]');
      expect(container).to.exist;
    });

    it('should apply md padding', async () => {
      element.padding = 'md';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-padding="md"]');
      expect(container).to.exist;
    });

    it('should apply lg padding', async () => {
      element.padding = 'lg';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-padding="lg"]');
      expect(container).to.exist;
    });
  });

  describe('Alignment', () => {
    it('should apply justify center', async () => {
      element.justify = 'center';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-justify="center"]');
      expect(container).to.exist;
    });

    it('should apply justify space-between', async () => {
      element.justify = 'space-between';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-justify="space-between"]');
      expect(container).to.exist;
    });

    it('should apply align center', async () => {
      element.align = 'center';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-align="center"]');
      expect(container).to.exist;
    });

    it('should apply align stretch', async () => {
      element.align = 'stretch';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-align="stretch"]');
      expect(container).to.exist;
    });
  });

  describe('Gap', () => {
    it('should apply numeric gap', async () => {
      element.gap = 16;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-container') as HTMLElement;
      expect(container.style.gap).to.equal('16px');
    });

    it('should apply preset gap', async () => {
      element.gap = 'medium';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-container') as HTMLElement;
      expect(container.style.gap).to.include('var(--nuraly-spacing');
    });

    it('should apply array gap', async () => {
      element.gap = [16, 24];
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-container') as HTMLElement;
      expect(container.style.columnGap).to.equal('16px');
      expect(container.style.rowGap).to.equal('24px');
    });
  });

  describe('Wrap', () => {
    it('should not wrap by default', async () => {
      const container = element.shadowRoot?.querySelector('[data-wrap="false"]');
      expect(container).to.exist;
    });

    it('should enable wrap', async () => {
      element.wrap = true;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-wrap="true"]');
      expect(container).to.exist;
    });
  });

  describe('Custom dimensions', () => {
    it('should apply custom width', async () => {
      element.width = '800px';
      await element.updateComplete;

      expect(element.width).to.equal('800px');
    });

    it('should apply custom height', async () => {
      element.height = '600px';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-container') as HTMLElement;
      expect(container.style.height).to.equal('600px');
    });

    it('should apply custom min-height', async () => {
      element.minHeight = '400px';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-container') as HTMLElement;
      expect(container.style.minHeight).to.equal('400px');
    });
  });

  describe('Inner class', () => {
    it('should apply inner class', async () => {
      element.innerClass = 'custom-container';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-container.custom-container');
      expect(container).to.exist;
    });
  });

  describe('Part attribute', () => {
    it('should have container part', async () => {
      const container = element.shadowRoot?.querySelector('[part="container"]');
      expect(container).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content', async () => {
      const emptyContainer = await fixture<NrContainerElement>(html`
        <nr-container></nr-container>
      `);

      expect(emptyContainer).to.exist;
    });

    it('should handle rapid property changes', async () => {
      element.layout = 'fluid';
      element.direction = 'row';
      element.layout = 'boxed';
      element.direction = 'column';
      await element.updateComplete;

      expect(element.layout).to.equal('boxed');
      expect(element.direction).to.equal('column');
    });

    it('should handle multiple children', async () => {
      const containerWithChildren = await fixture<NrContainerElement>(html`
        <nr-container>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </nr-container>
      `);

      expect(containerWithChildren.children.length).to.equal(3);
    });
  });

  describe('Accessibility', () => {
    it('should render proper container structure', async () => {
      const container = element.shadowRoot?.querySelector('.nr-container');
      expect(container).to.exist;
    });
  });
});
