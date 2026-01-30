/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { HyTextLabel } from '../label.component.js';

describe('HyTextLabel', () => {
  let element: HyTextLabel;

  beforeEach(async () => {
    element = await fixture(html`<nr-label>Label Text</nr-label>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-LABEL');
    });

    it('should have default properties', () => {
      expect(element.size).to.equal('medium');
      expect(element.variant).to.equal('default');
      expect(element.required).to.be.false;
      expect(element.disabled).to.be.false;
    });

    it('should render label element', async () => {
      const label = element.shadowRoot?.querySelector('label');
      expect(label).to.exist;
    });

    it('should render slotted content', async () => {
      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Label sizes', () => {
    it('should apply small size', async () => {
      element.size = 'small';
      await element.updateComplete;

      expect(element.size).to.equal('small');
      expect(element.getAttribute('size')).to.equal('small');
    });

    it('should apply medium size', async () => {
      element.size = 'medium';
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = 'large';
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Label variants', () => {
    it('should apply default variant', async () => {
      element.variant = 'default';
      await element.updateComplete;

      expect(element.variant).to.equal('default');
    });

    it('should apply secondary variant', async () => {
      element.variant = 'secondary';
      await element.updateComplete;

      expect(element.variant).to.equal('secondary');
    });
  });

  describe('Required indicator', () => {
    it('should not show asterisk by default', async () => {
      const asterisk = element.shadowRoot?.querySelector('.required-asterisk');
      expect(asterisk).to.not.exist;
    });

    it('should show asterisk when required', async () => {
      element.required = true;
      await element.updateComplete;

      const asterisk = element.shadowRoot?.querySelector('.required-asterisk');
      expect(asterisk).to.exist;
      expect(asterisk?.textContent).to.equal('*');
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
      expect(element.getAttribute('disabled')).to.exist;
    });
  });

  describe('For attribute', () => {
    it('should set for attribute on label', async () => {
      element.for = 'input-id';
      await element.updateComplete;

      const label = element.shadowRoot?.querySelector('label');
      expect(label?.getAttribute('for')).to.equal('input-id');
    });

    it('should handle empty for attribute', async () => {
      element.for = '';
      await element.updateComplete;

      const label = element.shadowRoot?.querySelector('label');
      expect(label?.getAttribute('for')).to.equal('');
    });
  });

  describe('Value property', () => {
    it('should support value property', async () => {
      element.value = 'test value';
      await element.updateComplete;

      expect(element.value).to.equal('test value');
    });
  });

  describe('Content rendering', () => {
    it('should render text content', async () => {
      const labelWithText = await fixture<HyTextLabel>(html`
        <nr-label>Username</nr-label>
      `);

      expect(labelWithText.textContent).to.include('Username');
    });

    it('should render HTML content', async () => {
      const labelWithHtml = await fixture<HyTextLabel>(html`
        <nr-label><strong>Bold Label</strong></nr-label>
      `);

      const strong = labelWithHtml.querySelector('strong');
      expect(strong).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content', async () => {
      const emptyLabel = await fixture<HyTextLabel>(html`
        <nr-label></nr-label>
      `);

      expect(emptyLabel).to.exist;
    });

    it('should handle special characters', async () => {
      const specialLabel = await fixture<HyTextLabel>(html`
        <nr-label><script>alert("xss")</script></nr-label>
      `);

      // Content should be safely rendered
      expect(specialLabel).to.exist;
    });

    it('should handle unicode', async () => {
      const unicodeLabel = await fixture<HyTextLabel>(html`
        <nr-label>标签文字 🏷️</nr-label>
      `);

      expect(unicodeLabel.textContent).to.include('标签文字');
    });

    it('should handle rapid property changes', async () => {
      element.size = 'small';
      element.variant = 'secondary';
      element.required = true;
      element.size = 'large';
      await element.updateComplete;

      expect(element.size).to.equal('large');
      expect(element.required).to.be.true;
    });
  });

  describe('Accessibility', () => {
    it('should render proper label element', async () => {
      const label = element.shadowRoot?.querySelector('label');
      expect(label).to.exist;
    });

    it('should associate with input via for attribute', async () => {
      element.for = 'my-input';
      await element.updateComplete;

      const label = element.shadowRoot?.querySelector('label');
      expect(label?.getAttribute('for')).to.equal('my-input');
    });
  });
});
