/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { HyIconElement } from '../icon.component.js';
import { IconTypes } from '../icon.types.js';

describe('HyIconElement', () => {
  let element: HyIconElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-icon name="home"></nr-icon>`);
    await aTimeout(50); // Wait for icon to mount
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-ICON');
    });

    it('should have default properties', () => {
      expect(element.name).to.equal('home');
      expect(element.type).to.equal(IconTypes.Regular);
      expect(element.alt).to.equal('');
    });

    it('should render icon container', async () => {
      const container = element.shadowRoot?.querySelector('.icon-container');
      expect(container).to.exist;
    });

    it('should mount SVG icon', async () => {
      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).to.exist;
    });
  });

  describe('Icon names', () => {
    it('should render different icon names', async () => {
      element.name = 'mail';
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg).to.exist;
    });

    it('should handle icon name change', async () => {
      element.name = 'settings';
      await element.updateComplete;
      await aTimeout(50);

      expect(element.name).to.equal('settings');
    });
  });

  describe('Icon types', () => {
    it('should apply regular type by default', () => {
      expect(element.type).to.equal('regular');
    });

    it('should apply solid type', async () => {
      element.type = IconTypes.Solid;
      await element.updateComplete;

      expect(element.type).to.equal('solid');
    });
  });

  describe('Icon sizes', () => {
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

    it('should apply xlarge size', async () => {
      element.size = 'xlarge';
      await element.updateComplete;

      expect(element.size).to.equal('xlarge');
    });

    it('should apply xxlarge size', async () => {
      element.size = 'xxlarge';
      await element.updateComplete;

      expect(element.size).to.equal('xxlarge');
    });
  });

  describe('Custom styling', () => {
    it('should apply custom color', async () => {
      element.color = '#ff5500';
      await element.updateComplete;

      expect(element.color).to.equal('#ff5500');
    });

    it('should apply custom width', async () => {
      element.width = '32px';
      await element.updateComplete;

      expect(element.width).to.equal('32px');
    });

    it('should apply custom height', async () => {
      element.height = '32px';
      await element.updateComplete;

      expect(element.height).to.equal('32px');
    });
  });

  describe('Clickable functionality', () => {
    it('should support clickable mode', async () => {
      element.clickable = true;
      await element.updateComplete;

      expect(element.clickable).to.be.true;
      const container = element.shadowRoot?.querySelector('.icon-container.clickable');
      expect(container).to.exist;
    });

    it('should dispatch icon-click event when clicked', async () => {
      element.clickable = true;
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg') as SVGElement;

      setTimeout(() => {
        svg?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const event = await oneEvent(element, 'icon-click');
      expect(event).to.exist;
    });

    it('should have button role when clickable', async () => {
      element.clickable = true;
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('role')).to.equal('button');
    });

    it('should have tabindex 0 when clickable', async () => {
      element.clickable = true;
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('tabindex')).to.equal('0');
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
      const container = element.shadowRoot?.querySelector('.icon-container.disabled');
      expect(container).to.exist;
    });

    it('should have tabindex -1 when disabled', async () => {
      element.clickable = true;
      element.disabled = true;
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('tabindex')).to.equal('-1');
    });

    it('should have aria-disabled when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-disabled')).to.equal('true');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label from alt text', async () => {
      element.alt = 'Home icon';
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-label')).to.equal('Home icon');
    });

    it('should fall back to name for aria-label', async () => {
      element.name = 'settings';
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-label')).to.equal('settings');
    });

    it('should have img role when alt is provided', async () => {
      element.alt = 'Decorative icon';
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('role')).to.equal('img');
    });

    it('should have presentation role when no alt', async () => {
      element.alt = '';
      element.clickable = false;
      await element.updateComplete;
      await aTimeout(50);

      const svg = element.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('role')).to.equal('presentation');
    });
  });

  describe('Edge cases', () => {
    it('should handle missing icon name gracefully', async () => {
      const iconWithoutName = await fixture<HyIconElement>(html`
        <nr-icon></nr-icon>
      `);
      await aTimeout(50);

      // Should not throw error
      expect(iconWithoutName).to.exist;
    });

    it('should handle invalid icon name gracefully', async () => {
      element.name = 'nonexistent-icon-12345';
      await element.updateComplete;
      await aTimeout(50);

      // Should not throw error
      expect(element).to.exist;
    });

    it('should handle rapid property changes', async () => {
      element.name = 'mail';
      element.name = 'settings';
      element.name = 'user';
      await element.updateComplete;

      expect(element.name).to.equal('user');
    });
  });
});
