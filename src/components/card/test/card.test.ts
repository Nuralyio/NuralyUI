/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { NrCardElement } from '../card.component.js';
import { CardSize } from '../card.types.js';

describe('NrCardElement', () => {
  let element: NrCardElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-card></nr-card>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-CARD');
    });

    it('should have default properties', () => {
      expect(element.header).to.equal('');
      expect(element.size).to.equal(CardSize.Default);
    });

    it('should render card element', async () => {
      const card = element.shadowRoot?.querySelector('.card');
      expect(card).to.exist;
    });

    it('should render content slot', async () => {
      const contentSlot = element.shadowRoot?.querySelector('slot[name="content"]');
      expect(contentSlot).to.exist;
    });
  });

  describe('Header', () => {
    it('should display header text', async () => {
      element.header = 'Card Title';
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.card__header');
      expect(header).to.exist;
      expect(header?.textContent).to.equal('Card Title');
    });

    it('should not render header when empty', async () => {
      element.header = '';
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.card__header');
      expect(header).to.not.exist;
    });

    it('should handle long header text', async () => {
      element.header = 'This is a very long header text that might overflow';
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.card__header');
      expect(header?.textContent).to.include('This is a very long header');
    });
  });

  describe('Card sizes', () => {
    it('should apply default size', async () => {
      element.size = CardSize.Default;
      await element.updateComplete;

      expect(element.size).to.equal('default');
      const card = element.shadowRoot?.querySelector('.card');
      expect(card?.classList.contains('card--small')).to.be.false;
      expect(card?.classList.contains('card--large')).to.be.false;
    });

    it('should apply small size', async () => {
      element.size = CardSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
      const card = element.shadowRoot?.querySelector('.card--small');
      expect(card).to.exist;
    });

    it('should apply large size', async () => {
      element.size = CardSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
      const card = element.shadowRoot?.querySelector('.card--large');
      expect(card).to.exist;
    });
  });

  describe('Content slot', () => {
    it('should render slotted content', async () => {
      const cardWithContent = await fixture<NrCardElement>(html`
        <nr-card header="Test Card">
          <div slot="content">Card content goes here</div>
        </nr-card>
      `);

      const contentSlot = cardWithContent.shadowRoot?.querySelector('slot[name="content"]');
      expect(contentSlot).to.exist;
    });

    it('should render multiple elements in content slot', async () => {
      const cardWithContent = await fixture<NrCardElement>(html`
        <nr-card header="Multi Content">
          <p slot="content">Paragraph 1</p>
          <p slot="content">Paragraph 2</p>
        </nr-card>
      `);

      const contentSlot = cardWithContent.shadowRoot?.querySelector('slot[name="content"]') as HTMLSlotElement;
      const assignedElements = contentSlot?.assignedElements();
      expect(assignedElements?.length).to.be.greaterThan(0);
    });
  });

  describe('Card structure', () => {
    it('should have card content wrapper', async () => {
      const content = element.shadowRoot?.querySelector('.card__content');
      expect(content).to.exist;
    });

    it('should maintain proper hierarchy', async () => {
      element.header = 'Test';
      await element.updateComplete;

      const card = element.shadowRoot?.querySelector('.card');
      const header = card?.querySelector('.card__header');
      const content = card?.querySelector('.card__content');

      expect(header).to.exist;
      expect(content).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in header', async () => {
      element.header = '<script>alert("xss")</script>';
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.card__header');
      expect(header?.textContent).to.include('alert');
      // XSS should be escaped
    });

    it('should handle unicode in header', async () => {
      element.header = '你好世界 🌍';
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.card__header');
      expect(header?.textContent).to.include('你好世界');
    });

    it('should handle empty content', async () => {
      const emptyCard = await fixture<NrCardElement>(html`
        <nr-card header="Empty Card"></nr-card>
      `);

      expect(emptyCard).to.exist;
      const content = emptyCard.shadowRoot?.querySelector('.card__content');
      expect(content).to.exist;
    });

    it('should handle rapid property changes', async () => {
      element.header = 'First';
      element.size = CardSize.Small;
      element.header = 'Second';
      element.size = CardSize.Large;
      await element.updateComplete;

      expect(element.header).to.equal('Second');
      expect(element.size).to.equal('large');
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', async () => {
      element.header = 'Accessible Card';
      await element.updateComplete;

      const card = element.shadowRoot?.querySelector('.card');
      expect(card).to.exist;
    });
  });

  describe('Complex card scenarios', () => {
    it('should render card with all features', async () => {
      const fullCard = await fixture<NrCardElement>(html`
        <nr-card header="Full Featured Card" size="large">
          <div slot="content">
            <p>Main content paragraph</p>
            <button>Action Button</button>
          </div>
        </nr-card>
      `);

      expect(fullCard.header).to.equal('Full Featured Card');
      expect(fullCard.size).to.equal('large');

      const header = fullCard.shadowRoot?.querySelector('.card__header');
      expect(header?.textContent).to.equal('Full Featured Card');

      const card = fullCard.shadowRoot?.querySelector('.card--large');
      expect(card).to.exist;
    });

    it('should handle dynamic content updates', async () => {
      element.header = 'Initial Header';
      await element.updateComplete;

      let header = element.shadowRoot?.querySelector('.card__header');
      expect(header?.textContent).to.equal('Initial Header');

      element.header = 'Updated Header';
      await element.updateComplete;

      header = element.shadowRoot?.querySelector('.card__header');
      expect(header?.textContent).to.equal('Updated Header');
    });

    it('should handle size changes dynamically', async () => {
      element.size = CardSize.Small;
      await element.updateComplete;

      let smallCard = element.shadowRoot?.querySelector('.card--small');
      expect(smallCard).to.exist;

      element.size = CardSize.Large;
      await element.updateComplete;

      const largeCard = element.shadowRoot?.querySelector('.card--large');
      expect(largeCard).to.exist;

      smallCard = element.shadowRoot?.querySelector('.card--small');
      expect(smallCard).to.not.exist;
    });
  });
});
