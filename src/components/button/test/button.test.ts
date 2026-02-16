/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrButtonElement } from '../button.component.js';
import {
  ButtonType,
  ButtonSize,
  ButtonShape,
  IconPosition
} from '../button.types.js';

describe('NrButtonElement', () => {
  let element: NrButtonElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-button>Click me</nr-button>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-BUTTON');
    });

    it('should have default properties', () => {
      expect(element.type).to.equal(ButtonType.Default);
      expect(element.shape).to.equal(ButtonShape.Default);
      expect(element.size).to.equal('');
      expect(element.disabled).to.be.false;
      expect(element.loading).to.be.false;
      expect(element.block).to.be.false;
      expect(element.dashed).to.be.false;
      expect(element.ripple).to.be.true;
    });

    it('should render a button element by default', async () => {
      const button = element.shadowRoot?.querySelector('button');
      expect(button).to.exist;
      expect(button?.tagName).to.equal('BUTTON');
    });

    it('should render slot content', async () => {
      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should have button type attribute', async () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(button.type).to.equal('button');
    });
  });

  describe('Button types', () => {
    it('should apply primary type', async () => {
      element.type = ButtonType.Primary;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-type')).to.equal('primary');
    });

    it('should apply secondary type', async () => {
      element.type = ButtonType.Secondary;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-type')).to.equal('secondary');
    });

    it('should apply danger type', async () => {
      element.type = ButtonType.Danger;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-type')).to.equal('danger');
    });

    it('should apply ghost type', async () => {
      element.type = ButtonType.Ghost;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-type')).to.equal('ghost');
    });

    it('should apply link type', async () => {
      element.type = ButtonType.Link;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-type')).to.equal('link');
    });

    it('should apply text type', async () => {
      element.type = ButtonType.Text;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-type')).to.equal('text');
    });
  });

  describe('Button sizes', () => {
    it('should apply small size', async () => {
      element.size = ButtonSize.Small;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-size')).to.equal('small');
    });

    it('should apply medium size', async () => {
      element.size = ButtonSize.Medium;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-size')).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = ButtonSize.Large;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-size')).to.equal('large');
    });
  });

  describe('Button shapes', () => {
    it('should apply default shape', async () => {
      element.shape = ButtonShape.Default;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-shape')).to.equal('default');
    });

    it('should apply circle shape', async () => {
      element.shape = ButtonShape.Circle;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-shape')).to.equal('circle');
    });

    it('should apply round shape', async () => {
      element.shape = ButtonShape.Round;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-shape')).to.equal('round');
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(button.disabled).to.be.true;
      expect(button.getAttribute('aria-disabled')).to.equal('true');
    });

    it('should have tabindex -1 when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('tabindex')).to.equal('-1');
    });

    it('should not dispatch click event when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      let eventFired = false;
      element.addEventListener('button-clicked', () => {
        eventFired = true;
      });

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      button.click();
      await aTimeout(50);

      expect(eventFired).to.be.false;
    });
  });

  describe('Loading state', () => {
    it('should support loading state', async () => {
      element.loading = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-state')).to.equal('loading');
    });

    it('should not have loading state when not loading', async () => {
      element.loading = false;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-state')).to.not.equal('loading');
    });
  });

  describe('Block mode', () => {
    it('should apply block mode', async () => {
      element.block = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-block')).to.equal('true');
    });
  });

  describe('Dashed style', () => {
    it('should apply dashed style', async () => {
      element.dashed = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.classList.contains('button-dashed')).to.be.true;
    });
  });

  describe('Event handling', () => {
    it('should dispatch button-clicked event on click', async () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

      setTimeout(() => button.click());

      const event = await oneEvent(element, 'button-clicked');
      expect(event).to.exist;
      expect((event as CustomEvent).detail).to.have.property('type');
    });

    it('should include button metadata in click event', async () => {
      element.type = ButtonType.Primary;
      element.loading = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

      setTimeout(() => button.click());

      const event = await oneEvent(element, 'button-clicked');
      const detail = (event as CustomEvent).detail;

      expect(detail.type).to.equal('primary');
      expect(detail.loading).to.be.true;
      expect(detail.disabled).to.be.false;
    });

    it('should handle keyboard Enter key', async () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

      setTimeout(() => {
        button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      });

      const event = await oneEvent(element, 'button-clicked');
      expect(event).to.exist;
    });

    it('should handle keyboard Space key', async () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

      setTimeout(() => {
        button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      });

      const event = await oneEvent(element, 'button-clicked');
      expect(event).to.exist;
    });
  });

  describe('Link button', () => {
    it('should render as anchor when href is provided', async () => {
      element.href = 'https://example.com';
      await element.updateComplete;

      const anchor = element.shadowRoot?.querySelector('a');
      expect(anchor).to.exist;
      expect(anchor?.getAttribute('href')).to.equal('https://example.com');
    });

    it('should set target attribute for links', async () => {
      element.href = 'https://example.com';
      element.target = '_blank';
      await element.updateComplete;

      const anchor = element.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('target')).to.equal('_blank');
    });

    it('should add noopener rel for _blank target', async () => {
      element.href = 'https://example.com';
      element.target = '_blank';
      await element.updateComplete;

      const anchor = element.shadowRoot?.querySelector('a');
      expect(anchor?.getAttribute('rel')).to.contain('noopener');
    });
  });

  describe('Icons', () => {
    it('should support icon array with single icon', async () => {
      element.icon = ['home'];
      await element.updateComplete;

      // Icon should be resolved as left icon
      const leftIcon = (element as any).getResolvedLeftIcon();
      expect(leftIcon).to.equal('home');
    });

    it('should support icon array with two icons', async () => {
      element.icon = ['home', 'arrow-right'];
      await element.updateComplete;

      const leftIcon = (element as any).getResolvedLeftIcon();
      const rightIcon = (element as any).getResolvedRightIcon();

      expect(leftIcon).to.equal('home');
      expect(rightIcon).to.equal('arrow-right');
    });

    it('should support iconLeft property', async () => {
      element.iconLeft = 'home';
      await element.updateComplete;

      const leftIcon = (element as any).getResolvedLeftIcon();
      expect(leftIcon).to.equal('home');
    });

    it('should support iconRight property', async () => {
      element.iconRight = 'arrow-right';
      await element.updateComplete;

      const rightIcon = (element as any).getResolvedRightIcon();
      expect(rightIcon).to.equal('arrow-right');
    });

    it('should support icons object', async () => {
      element.icons = { left: 'home', right: 'arrow-right' };
      await element.updateComplete;

      const leftIcon = (element as any).getResolvedLeftIcon();
      const rightIcon = (element as any).getResolvedRightIcon();

      expect(leftIcon).to.equal('home');
      expect(rightIcon).to.equal('arrow-right');
    });

    it('should prioritize iconLeft over icon array', async () => {
      element.iconLeft = 'star';
      element.icon = ['home'];
      await element.updateComplete;

      const leftIcon = (element as any).getResolvedLeftIcon();
      expect(leftIcon).to.equal('star');
    });

    it('should support enhanced icon config object', async () => {
      element.iconLeft = { name: 'home', color: 'blue', type: 'solid' };
      await element.updateComplete;

      const leftIcon = (element as any).getResolvedLeftIcon();
      expect(leftIcon).to.deep.equal({ name: 'home', color: 'blue', type: 'solid' });
    });

    it('should set icon position', async () => {
      element.iconPosition = IconPosition.Right;
      await element.updateComplete;

      expect(element.iconPosition).to.equal('right');
    });
  });

  describe('HTML type', () => {
    it('should set htmlType to submit', async () => {
      element.htmlType = 'submit';
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(button.type).to.equal('submit');
    });

    it('should set htmlType to reset', async () => {
      element.htmlType = 'reset';
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(button.type).to.equal('reset');
    });

    it('should default to button type', async () => {
      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
      expect(button.type).to.equal('button');
    });
  });

  describe('Accessibility', () => {
    it('should have role attribute', async () => {
      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('role')).to.equal('button');
    });

    it('should support custom aria-label', async () => {
      element.buttonAriaLabel = 'Custom label';
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('aria-label')).to.equal('Custom label');
    });

    it('should support aria-describedby', async () => {
      element.ariaDescribedBy = 'description-id';
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('aria-describedby')).to.equal('description-id');
    });

    it('should have tabindex 0 when not disabled', async () => {
      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('tabindex')).to.equal('0');
    });
  });

  describe('Controller integration', () => {
    it('should have ripple controller', () => {
      const controller = (element as any).rippleController;
      expect(controller).to.exist;
      expect(typeof controller.handleRippleClick).to.equal('function');
    });

    it('should have keyboard controller', () => {
      const controller = (element as any).keyboardController;
      expect(controller).to.exist;
      expect(typeof controller.handleKeydown).to.equal('function');
    });

    it('should have link controller', () => {
      const controller = (element as any).linkController;
      expect(controller).to.exist;
      expect(typeof controller.getElementTag).to.equal('function');
    });
  });

  describe('Ripple effect', () => {
    it('should have ripple enabled by default', () => {
      expect(element.ripple).to.be.true;
    });

    it('should allow disabling ripple', async () => {
      element.ripple = false;
      await element.updateComplete;

      expect(element.ripple).to.be.false;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text content', async () => {
      const el = await fixture<NrButtonElement>(html`<nr-button></nr-button>`);
      const button = el.shadowRoot?.querySelector('button');
      expect(button).to.exist;
    });

    it('should handle rapid clicks', async () => {
      let clickCount = 0;
      element.addEventListener('button-clicked', () => clickCount++);

      const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

      for (let i = 0; i < 10; i++) {
        button.click();
      }
      await aTimeout(50);

      expect(clickCount).to.equal(10);
    });

    it('should handle property changes during loading', async () => {
      element.loading = true;
      await element.updateComplete;

      element.type = ButtonType.Primary;
      element.size = ButtonSize.Large;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('button');
      expect(button?.getAttribute('data-type')).to.equal('primary');
      expect(button?.getAttribute('data-size')).to.equal('large');
      expect(button?.getAttribute('data-state')).to.equal('loading');
    });

    it('should handle switching from button to link', async () => {
      // Start as button
      let button = element.shadowRoot?.querySelector('button');
      expect(button).to.exist;

      // Switch to link
      element.href = 'https://example.com';
      await element.updateComplete;

      const anchor = element.shadowRoot?.querySelector('a');
      button = element.shadowRoot?.querySelector('button');

      expect(anchor).to.exist;
      expect(button).to.not.exist;
    });
  });
});
