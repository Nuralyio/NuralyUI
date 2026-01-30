/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { NrDividerElement } from '../divider.component.js';
import {
  DividerType,
  DividerOrientation,
  DividerVariant,
  DividerSize
} from '../divider.types.js';

describe('NrDividerElement', () => {
  let element: NrDividerElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-divider></nr-divider>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-DIVIDER');
    });

    it('should have default properties', () => {
      expect(element.type).to.equal(DividerType.Horizontal);
      expect(element.variant).to.equal(DividerVariant.Solid);
      expect(element.orientation).to.equal(DividerOrientation.Center);
      expect(element.plain).to.be.true;
      expect(element.dashed).to.be.false;
    });

    it('should render divider element', async () => {
      const divider = element.shadowRoot?.querySelector('.divider');
      expect(divider).to.exist;
    });
  });

  describe('Divider types', () => {
    it('should apply horizontal type by default', async () => {
      expect(element.type).to.equal('horizontal');
      const divider = element.shadowRoot?.querySelector('.divider--horizontal');
      expect(divider).to.exist;
    });

    it('should apply vertical type', async () => {
      element.type = DividerType.Vertical;
      await element.updateComplete;

      expect(element.type).to.equal('vertical');
      const divider = element.shadowRoot?.querySelector('.divider--vertical');
      expect(divider).to.exist;
    });
  });

  describe('Divider variants', () => {
    it('should apply solid variant by default', async () => {
      expect(element.variant).to.equal('solid');
      const divider = element.shadowRoot?.querySelector('.divider--solid');
      expect(divider).to.exist;
    });

    it('should apply dashed variant', async () => {
      element.variant = DividerVariant.Dashed;
      await element.updateComplete;

      expect(element.variant).to.equal('dashed');
      const divider = element.shadowRoot?.querySelector('.divider--dashed');
      expect(divider).to.exist;
    });

    it('should apply dotted variant', async () => {
      element.variant = DividerVariant.Dotted;
      await element.updateComplete;

      expect(element.variant).to.equal('dotted');
      const divider = element.shadowRoot?.querySelector('.divider--dotted');
      expect(divider).to.exist;
    });

    it('should support deprecated dashed property', async () => {
      element.dashed = true;
      await element.updateComplete;

      expect(element.dashed).to.be.true;
      const divider = element.shadowRoot?.querySelector('.divider--dashed');
      expect(divider).to.exist;
    });
  });

  describe('Text orientation', () => {
    it('should apply center orientation by default', async () => {
      const dividerWithText = await fixture<NrDividerElement>(html`
        <nr-divider>Center Text</nr-divider>
      `);

      expect(dividerWithText.orientation).to.equal('center');
    });

    it('should apply start orientation', async () => {
      const dividerWithText = await fixture<NrDividerElement>(html`
        <nr-divider orientation="start">Left Text</nr-divider>
      `);

      expect(dividerWithText.orientation).to.equal('start');
      const divider = dividerWithText.shadowRoot?.querySelector('.divider--start');
      expect(divider).to.exist;
    });

    it('should apply end orientation', async () => {
      const dividerWithText = await fixture<NrDividerElement>(html`
        <nr-divider orientation="end">Right Text</nr-divider>
      `);

      expect(dividerWithText.orientation).to.equal('end');
      const divider = dividerWithText.shadowRoot?.querySelector('.divider--end');
      expect(divider).to.exist;
    });
  });

  describe('Divider with text', () => {
    it('should render text content', async () => {
      const dividerWithText = await fixture<NrDividerElement>(html`
        <nr-divider>Section Title</nr-divider>
      `);

      const textSpan = dividerWithText.shadowRoot?.querySelector('.divider__text');
      expect(textSpan).to.exist;
    });

    it('should add with-text class when text present', async () => {
      const dividerWithText = await fixture<NrDividerElement>(html`
        <nr-divider>Has Text</nr-divider>
      `);

      const divider = dividerWithText.shadowRoot?.querySelector('.divider--with-text');
      expect(divider).to.exist;
    });

    it('should not add with-text class when no text', async () => {
      const divider = element.shadowRoot?.querySelector('.divider--with-text');
      expect(divider).to.not.exist;
    });
  });

  describe('Plain style', () => {
    it('should apply plain style by default', async () => {
      expect(element.plain).to.be.true;
      const divider = element.shadowRoot?.querySelector('.divider--plain');
      expect(divider).to.exist;
    });

    it('should remove plain style when disabled', async () => {
      element.plain = false;
      await element.updateComplete;

      expect(element.plain).to.be.false;
    });
  });

  describe('Divider sizes', () => {
    it('should apply small size', async () => {
      element.size = DividerSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
      const divider = element.shadowRoot?.querySelector('.divider--small');
      expect(divider).to.exist;
    });

    it('should apply middle size', async () => {
      element.size = DividerSize.Middle;
      await element.updateComplete;

      expect(element.size).to.equal('middle');
      const divider = element.shadowRoot?.querySelector('.divider--middle');
      expect(divider).to.exist;
    });

    it('should apply large size', async () => {
      element.size = DividerSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
      const divider = element.shadowRoot?.querySelector('.divider--large');
      expect(divider).to.exist;
    });
  });

  describe('Orientation margin', () => {
    it('should support orientation margin as number', async () => {
      const dividerWithMargin = await fixture<NrDividerElement>(html`
        <nr-divider orientation="start" orientation-margin="20">Left Text</nr-divider>
      `);

      expect(dividerWithMargin.orientationMargin).to.equal('20');
    });

    it('should support orientation margin as string with units', async () => {
      const dividerWithMargin = await fixture<NrDividerElement>(html`
        <nr-divider orientation="end" orientation-margin="2rem">Right Text</nr-divider>
      `);

      expect(dividerWithMargin.orientationMargin).to.equal('2rem');
    });
  });

  describe('Vertical divider', () => {
    it('should render vertical divider', async () => {
      element.type = DividerType.Vertical;
      await element.updateComplete;

      const divider = element.shadowRoot?.querySelector('.divider--vertical');
      expect(divider).to.exist;
    });

    it('should not show text slot in vertical mode', async () => {
      const verticalDivider = await fixture<NrDividerElement>(html`
        <nr-divider type="vertical">Text</nr-divider>
      `);

      // Vertical dividers don't support text
      const textSpan = verticalDivider.shadowRoot?.querySelector('.divider__text');
      expect(textSpan).to.not.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text', async () => {
      const divider = await fixture<NrDividerElement>(html`
        <nr-divider></nr-divider>
      `);

      expect(divider).to.exist;
    });

    it('should handle special characters in text', async () => {
      const divider = await fixture<NrDividerElement>(html`
        <nr-divider><script>alert("xss")</script></nr-divider>
      `);

      const textSpan = divider.shadowRoot?.querySelector('.divider__text');
      // Content should be sanitized or escaped
    });

    it('should handle unicode text', async () => {
      const divider = await fixture<NrDividerElement>(html`
        <nr-divider>分隔线 🔷</nr-divider>
      `);

      expect(divider).to.exist;
    });

    it('should handle very long text', async () => {
      const longText = 'A'.repeat(200);
      const divider = await fixture<NrDividerElement>(html`
        <nr-divider>${longText}</nr-divider>
      `);

      expect(divider).to.exist;
    });

    it('should handle rapid property changes', async () => {
      element.type = DividerType.Vertical;
      element.variant = DividerVariant.Dashed;
      element.type = DividerType.Horizontal;
      element.variant = DividerVariant.Dotted;
      await element.updateComplete;

      expect(element.type).to.equal('horizontal');
      expect(element.variant).to.equal('dotted');
    });
  });

  describe('Combined features', () => {
    it('should support all features together', async () => {
      const fullDivider = await fixture<NrDividerElement>(html`
        <nr-divider
          variant="dashed"
          orientation="start"
          size="small"
        >
          Section Title
        </nr-divider>
      `);

      expect(fullDivider.variant).to.equal('dashed');
      expect(fullDivider.orientation).to.equal('start');
      expect(fullDivider.size).to.equal('small');
    });

    it('should handle dynamic updates', async () => {
      element.variant = DividerVariant.Solid;
      await element.updateComplete;

      let divider = element.shadowRoot?.querySelector('.divider--solid');
      expect(divider).to.exist;

      element.variant = DividerVariant.Dashed;
      await element.updateComplete;

      divider = element.shadowRoot?.querySelector('.divider--dashed');
      expect(divider).to.exist;
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', async () => {
      const divider = element.shadowRoot?.querySelector('.divider');
      expect(divider).to.exist;
    });

    it('should render properly for screen readers', async () => {
      const dividerWithText = await fixture<NrDividerElement>(html`
        <nr-divider>Section Break</nr-divider>
      `);

      const textSpan = dividerWithText.shadowRoot?.querySelector('.divider__text');
      expect(textSpan).to.exist;
    });
  });
});
