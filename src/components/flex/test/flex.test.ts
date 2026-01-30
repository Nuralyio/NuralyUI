/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { NrFlexElement } from '../flex.component.js';
import {
  FlexDirection,
  FlexWrap,
  FlexJustify,
  FlexAlign,
  FlexGap
} from '../flex.types.js';

describe('NrFlexElement', () => {
  let element: NrFlexElement;

  beforeEach(async () => {
    element = await fixture(html`
      <nr-flex>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </nr-flex>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-FLEX');
    });

    it('should have default properties', () => {
      expect(element.direction).to.equal(FlexDirection.Row);
      expect(element.vertical).to.be.false;
      expect(element.wrap).to.equal(FlexWrap.NoWrap);
      expect(element.justify).to.equal('');
      expect(element.align).to.equal('');
      expect(element.gap).to.equal(0);
      expect(element.inline).to.be.false;
      expect(element.flex).to.equal('');
    });

    it('should render flex container', async () => {
      const container = element.shadowRoot?.querySelector('.nr-flex');
      expect(container).to.exist;
    });

    it('should render slot for children', async () => {
      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Direction', () => {
    it('should apply row direction by default', async () => {
      const container = element.shadowRoot?.querySelector('[data-direction="row"]');
      expect(container).to.exist;
    });

    it('should apply column direction', async () => {
      element.direction = FlexDirection.Column;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-direction="column"]');
      expect(container).to.exist;
    });

    it('should apply row-reverse direction', async () => {
      element.direction = FlexDirection.RowReverse;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-direction="row-reverse"]');
      expect(container).to.exist;
    });

    it('should apply column-reverse direction', async () => {
      element.direction = FlexDirection.ColumnReverse;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-direction="column-reverse"]');
      expect(container).to.exist;
    });

    it('should use vertical shorthand for column direction', async () => {
      element.vertical = true;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-direction="column"]');
      expect(container).to.exist;
    });

    it('should override direction when vertical is true', async () => {
      element.direction = FlexDirection.Row;
      element.vertical = true;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-direction="column"]');
      expect(container).to.exist;
    });
  });

  describe('Wrap', () => {
    it('should apply nowrap by default', async () => {
      const container = element.shadowRoot?.querySelector('[data-wrap="nowrap"]');
      expect(container).to.exist;
    });

    it('should apply wrap', async () => {
      element.wrap = FlexWrap.Wrap;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-wrap="wrap"]');
      expect(container).to.exist;
    });

    it('should apply wrap-reverse', async () => {
      element.wrap = FlexWrap.WrapReverse;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-wrap="wrap-reverse"]');
      expect(container).to.exist;
    });
  });

  describe('Justify content', () => {
    it('should apply justify flex-start', async () => {
      element.justify = FlexJustify.FlexStart;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-justify="flex-start"]');
      expect(container).to.exist;
    });

    it('should apply justify flex-end', async () => {
      element.justify = FlexJustify.FlexEnd;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-justify="flex-end"]');
      expect(container).to.exist;
    });

    it('should apply justify center', async () => {
      element.justify = FlexJustify.Center;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-justify="center"]');
      expect(container).to.exist;
    });

    it('should apply justify space-between', async () => {
      element.justify = FlexJustify.SpaceBetween;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-justify="space-between"]');
      expect(container).to.exist;
    });

    it('should apply justify space-around', async () => {
      element.justify = FlexJustify.SpaceAround;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-justify="space-around"]');
      expect(container).to.exist;
    });

    it('should apply justify space-evenly', async () => {
      element.justify = FlexJustify.SpaceEvenly;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-justify="space-evenly"]');
      expect(container).to.exist;
    });
  });

  describe('Align items', () => {
    it('should apply align flex-start', async () => {
      element.align = FlexAlign.FlexStart;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-align="flex-start"]');
      expect(container).to.exist;
    });

    it('should apply align flex-end', async () => {
      element.align = FlexAlign.FlexEnd;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-align="flex-end"]');
      expect(container).to.exist;
    });

    it('should apply align center', async () => {
      element.align = FlexAlign.Center;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-align="center"]');
      expect(container).to.exist;
    });

    it('should apply align baseline', async () => {
      element.align = FlexAlign.Baseline;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-align="baseline"]');
      expect(container).to.exist;
    });

    it('should apply align stretch', async () => {
      element.align = FlexAlign.Stretch;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-align="stretch"]');
      expect(container).to.exist;
    });
  });

  describe('Gap', () => {
    it('should apply numeric gap', async () => {
      element.gap = 16;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.gap).to.equal('16px');
    });

    it('should apply zero gap by default', async () => {
      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      // When gap is 0, no style is applied
      expect(element.gap).to.equal(0);
    });

    it('should apply small gap preset', async () => {
      element.gap = FlexGap.Small;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.gap).to.include('var(--nuraly-spacing');
    });

    it('should apply medium gap preset', async () => {
      element.gap = FlexGap.Medium;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.gap).to.include('var(--nuraly-spacing');
    });

    it('should apply large gap preset', async () => {
      element.gap = FlexGap.Large;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.gap).to.include('var(--nuraly-spacing');
    });

    it('should apply array gap [horizontal, vertical]', async () => {
      element.gap = [16, 24];
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.columnGap).to.equal('16px');
      expect(container.style.rowGap).to.equal('24px');
    });

    it('should apply custom string gap', async () => {
      element.gap = '2rem';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.gap).to.equal('2rem');
    });
  });

  describe('Inline mode', () => {
    it('should not be inline by default', async () => {
      const container = element.shadowRoot?.querySelector('[data-inline="false"]');
      expect(container).to.exist;
    });

    it('should apply inline mode', async () => {
      element.inline = true;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('[data-inline="true"]');
      expect(container).to.exist;
    });
  });

  describe('Flex property', () => {
    it('should apply custom flex value', async () => {
      element.flex = '1';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.flex).to.equal('1');
    });

    it('should apply flex auto', async () => {
      element.flex = 'auto';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.flex).to.include('auto');
    });

    it('should apply flex none', async () => {
      element.flex = 'none';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.style.flex).to.equal('none');
    });
  });

  describe('Combined properties', () => {
    it('should apply multiple properties together', async () => {
      element.direction = FlexDirection.Column;
      element.justify = FlexJustify.Center;
      element.align = FlexAlign.Center;
      element.gap = 16;
      element.wrap = FlexWrap.Wrap;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.getAttribute('data-direction')).to.equal('column');
      expect(container.getAttribute('data-justify')).to.equal('center');
      expect(container.getAttribute('data-align')).to.equal('center');
      expect(container.getAttribute('data-wrap')).to.equal('wrap');
      expect(container.style.gap).to.equal('16px');
    });

    it('should apply vertical with gap', async () => {
      element.vertical = true;
      element.gap = 24;
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.nr-flex') as HTMLElement;
      expect(container.getAttribute('data-direction')).to.equal('column');
      expect(container.style.gap).to.equal('24px');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty children', async () => {
      const emptyFlex = await fixture<NrFlexElement>(html`
        <nr-flex></nr-flex>
      `);

      expect(emptyFlex).to.exist;
      const container = emptyFlex.shadowRoot?.querySelector('.nr-flex');
      expect(container).to.exist;
    });

    it('should handle single child', async () => {
      const singleChildFlex = await fixture<NrFlexElement>(html`
        <nr-flex>
          <div>Single item</div>
        </nr-flex>
      `);

      expect(singleChildFlex.children.length).to.equal(1);
    });

    it('should handle many children', async () => {
      const manyChildrenFlex = await fixture<NrFlexElement>(html`
        <nr-flex>
          ${Array.from({ length: 20 }, (_, i) => html`<div>Item ${i}</div>`)}
        </nr-flex>
      `);

      expect(manyChildrenFlex.children.length).to.equal(20);
    });

    it('should handle rapid property changes', async () => {
      element.direction = FlexDirection.Row;
      element.direction = FlexDirection.Column;
      element.direction = FlexDirection.RowReverse;
      await element.updateComplete;

      expect(element.direction).to.equal(FlexDirection.RowReverse);
    });

    it('should handle zero gap explicitly', async () => {
      element.gap = 0;
      await element.updateComplete;

      expect(element.gap).to.equal(0);
    });
  });

  describe('Accessibility', () => {
    it('should render proper flex structure', async () => {
      const container = element.shadowRoot?.querySelector('.nr-flex');
      expect(container).to.exist;
    });

    it('should pass through slotted content', async () => {
      expect(element.children.length).to.equal(3);
    });
  });
});
