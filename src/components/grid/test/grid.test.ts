/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { NrRowElement } from '../row.component.js';
import { NrColElement } from '../col.component.js';
import { RowAlign, RowJustify } from '../grid.types.js';

describe('Grid System', () => {
  describe('NrRowElement', () => {
    let element: NrRowElement;

    beforeEach(async () => {
      element = await fixture(html`
        <nr-row>
          <nr-col span="12">Column 1</nr-col>
          <nr-col span="12">Column 2</nr-col>
        </nr-row>
      `);
    });

    describe('Basic functionality', () => {
      it('should render successfully', () => {
        expect(element).to.exist;
        expect(element.tagName).to.equal('NR-ROW');
      });

      it('should have default properties', () => {
        expect(element.align).to.equal('');
        expect(element.justify).to.equal('');
        expect(element.gutter).to.equal(0);
        expect(element.wrap).to.be.true;
      });

      it('should render row container', async () => {
        const row = element.shadowRoot?.querySelector('.nr-row');
        expect(row).to.exist;
      });

      it('should render slot for columns', async () => {
        const slot = element.shadowRoot?.querySelector('slot');
        expect(slot).to.exist;
      });
    });

    describe('Alignment', () => {
      it('should apply top alignment', async () => {
        element.align = RowAlign.Top;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-align="top"]');
        expect(row).to.exist;
      });

      it('should apply middle alignment', async () => {
        element.align = RowAlign.Middle;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-align="middle"]');
        expect(row).to.exist;
      });

      it('should apply bottom alignment', async () => {
        element.align = RowAlign.Bottom;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-align="bottom"]');
        expect(row).to.exist;
      });

      it('should apply stretch alignment', async () => {
        element.align = RowAlign.Stretch;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-align="stretch"]');
        expect(row).to.exist;
      });
    });

    describe('Justify', () => {
      it('should apply start justify', async () => {
        element.justify = RowJustify.Start;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-justify="start"]');
        expect(row).to.exist;
      });

      it('should apply end justify', async () => {
        element.justify = RowJustify.End;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-justify="end"]');
        expect(row).to.exist;
      });

      it('should apply center justify', async () => {
        element.justify = RowJustify.Center;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-justify="center"]');
        expect(row).to.exist;
      });

      it('should apply space-around justify', async () => {
        element.justify = RowJustify.SpaceAround;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-justify="space-around"]');
        expect(row).to.exist;
      });

      it('should apply space-between justify', async () => {
        element.justify = RowJustify.SpaceBetween;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-justify="space-between"]');
        expect(row).to.exist;
      });

      it('should apply space-evenly justify', async () => {
        element.justify = RowJustify.SpaceEvenly;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-justify="space-evenly"]');
        expect(row).to.exist;
      });
    });

    describe('Gutter', () => {
      it('should apply numeric gutter', async () => {
        element.gutter = 16;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-gutter="16"]');
        expect(row).to.exist;
      });

      it('should apply array gutter [horizontal, vertical]', async () => {
        element.gutter = [16, 24];
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('.nr-row') as HTMLElement;
        expect(row.style.rowGap).to.equal('24px');
      });

      it('should apply responsive gutter object', async () => {
        element.gutter = { xs: 8, sm: 16, md: 24 };
        await element.updateComplete;

        // Gutter should be applied based on current breakpoint
        const row = element.shadowRoot?.querySelector('.nr-row');
        expect(row).to.exist;
      });

      it('should apply negative margin for gutter', async () => {
        element.gutter = 16;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('.nr-row') as HTMLElement;
        expect(row.style.marginLeft).to.equal('-8px');
        expect(row.style.marginRight).to.equal('-8px');
      });
    });

    describe('Wrap', () => {
      it('should wrap by default', () => {
        expect(element.wrap).to.be.true;
      });

      it('should apply wrap data attribute', async () => {
        const row = element.shadowRoot?.querySelector('[data-wrap="true"]');
        expect(row).to.exist;
      });

      it('should disable wrap', async () => {
        element.wrap = false;
        await element.updateComplete;

        const row = element.shadowRoot?.querySelector('[data-wrap="false"]');
        expect(row).to.exist;
      });
    });
  });

  describe('NrColElement', () => {
    let element: NrColElement;

    beforeEach(async () => {
      element = await fixture(html`
        <nr-col span="12">Column content</nr-col>
      `);
    });

    describe('Basic functionality', () => {
      it('should render successfully', () => {
        expect(element).to.exist;
        expect(element.tagName).to.equal('NR-COL');
      });

      it('should have default properties', () => {
        expect(element.offset).to.equal(0);
        expect(element.pull).to.equal(0);
        expect(element.push).to.equal(0);
        expect(element.flex).to.equal('');
      });

      it('should render column container', async () => {
        const col = element.shadowRoot?.querySelector('.nr-col');
        expect(col).to.exist;
      });

      it('should render slot for content', async () => {
        const slot = element.shadowRoot?.querySelector('slot');
        expect(slot).to.exist;
      });
    });

    describe('Span', () => {
      it('should accept span value', async () => {
        element.span = 8;
        await element.updateComplete;

        expect(element.span).to.equal(8);
      });

      it('should set data-span attribute', async () => {
        element.span = 6;
        await element.updateComplete;

        expect(element.getAttribute('data-span')).to.equal('6');
      });

      it('should accept full width span', async () => {
        element.span = 24;
        await element.updateComplete;

        expect(element.span).to.equal(24);
      });
    });

    describe('Offset', () => {
      it('should have no offset by default', () => {
        expect(element.offset).to.equal(0);
      });

      it('should accept offset value', async () => {
        element.offset = 6;
        await element.updateComplete;

        expect(element.offset).to.equal(6);
        expect(element.getAttribute('data-offset')).to.equal('6');
      });
    });

    describe('Order', () => {
      it('should accept order value', async () => {
        element.order = 2;
        await element.updateComplete;

        expect(element.order).to.equal(2);
        expect(element.getAttribute('data-order')).to.equal('2');
      });
    });

    describe('Pull and Push', () => {
      it('should have no pull by default', () => {
        expect(element.pull).to.equal(0);
      });

      it('should have no push by default', () => {
        expect(element.push).to.equal(0);
      });

      it('should accept pull value', async () => {
        element.pull = 3;
        await element.updateComplete;

        expect(element.pull).to.equal(3);
        expect(element.getAttribute('data-pull')).to.equal('3');
      });

      it('should accept push value', async () => {
        element.push = 3;
        await element.updateComplete;

        expect(element.push).to.equal(3);
        expect(element.getAttribute('data-push')).to.equal('3');
      });
    });

    describe('Flex', () => {
      it('should accept flex auto', async () => {
        element.flex = 'auto';
        await element.updateComplete;

        const col = element.shadowRoot?.querySelector('.nr-col') as HTMLElement;
        expect(col.style.flex).to.include('auto');
      });

      it('should accept flex none', async () => {
        element.flex = 'none';
        await element.updateComplete;

        const col = element.shadowRoot?.querySelector('.nr-col') as HTMLElement;
        expect(col.style.flex).to.include('auto');
      });

      it('should accept flex number', async () => {
        element.flex = '1';
        await element.updateComplete;

        const col = element.shadowRoot?.querySelector('.nr-col') as HTMLElement;
        expect(col.style.flex).to.equal('1');
      });
    });

    describe('Responsive breakpoints', () => {
      it('should accept xs breakpoint', async () => {
        element.xs = 24;
        await element.updateComplete;

        expect(element.xs).to.equal(24);
      });

      it('should accept sm breakpoint', async () => {
        element.sm = 12;
        await element.updateComplete;

        expect(element.sm).to.equal(12);
      });

      it('should accept md breakpoint', async () => {
        element.md = 8;
        await element.updateComplete;

        expect(element.md).to.equal(8);
      });

      it('should accept lg breakpoint', async () => {
        element.lg = 6;
        await element.updateComplete;

        expect(element.lg).to.equal(6);
      });

      it('should accept xl breakpoint', async () => {
        element.xl = 4;
        await element.updateComplete;

        expect(element.xl).to.equal(4);
      });

      it('should accept xxl breakpoint', async () => {
        element.xxl = 3;
        await element.updateComplete;

        expect(element.xxl).to.equal(3);
      });

      it('should accept object breakpoint config', async () => {
        element.md = { span: 8, offset: 2 };
        await element.updateComplete;

        expect(element.md).to.deep.equal({ span: 8, offset: 2 });
      });
    });
  });

  describe('Grid integration', () => {
    it('should render row with multiple columns', async () => {
      const grid = await fixture(html`
        <nr-row>
          <nr-col span="8">Col 1</nr-col>
          <nr-col span="8">Col 2</nr-col>
          <nr-col span="8">Col 3</nr-col>
        </nr-row>
      `);

      expect(grid.children.length).to.equal(3);
    });

    it('should render row with gutter affecting columns', async () => {
      const grid = await fixture(html`
        <nr-row gutter="16">
          <nr-col span="12">Col 1</nr-col>
          <nr-col span="12">Col 2</nr-col>
        </nr-row>
      `);

      const row = grid.shadowRoot?.querySelector('.nr-row');
      expect(row?.getAttribute('data-gutter')).to.equal('16');
    });

    it('should render responsive grid', async () => {
      const grid = await fixture(html`
        <nr-row>
          <nr-col xs="24" sm="12" md="8" lg="6">Responsive</nr-col>
        </nr-row>
      `);

      const col = grid.querySelector('nr-col') as NrColElement;
      expect(col.xs).to.equal(24);
      expect(col.sm).to.equal(12);
      expect(col.md).to.equal(8);
      expect(col.lg).to.equal(6);
    });

    it('should render aligned and justified grid', async () => {
      const grid = await fixture<NrRowElement>(html`
        <nr-row align="middle" justify="center">
          <nr-col span="12">Centered</nr-col>
        </nr-row>
      `);

      expect(grid.align).to.equal('middle');
      expect(grid.justify).to.equal('center');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty row', async () => {
      const row = await fixture<NrRowElement>(html`
        <nr-row></nr-row>
      `);

      expect(row).to.exist;
    });

    it('should handle single column', async () => {
      const row = await fixture(html`
        <nr-row>
          <nr-col span="24">Full width</nr-col>
        </nr-row>
      `);

      expect(row.children.length).to.equal(1);
    });

    it('should handle many columns', async () => {
      const row = await fixture(html`
        <nr-row>
          ${Array.from({ length: 24 }, (_, i) => html`<nr-col span="1">${i + 1}</nr-col>`)}
        </nr-row>
      `);

      expect(row.children.length).to.equal(24);
    });

    it('should handle rapid property changes', async () => {
      const row = await fixture<NrRowElement>(html`
        <nr-row></nr-row>
      `);

      row.gutter = 8;
      row.gutter = 16;
      row.gutter = 24;
      await row.updateComplete;

      expect(row.gutter).to.equal(24);
    });
  });
});
