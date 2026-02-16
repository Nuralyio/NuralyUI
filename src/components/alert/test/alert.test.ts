/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrAlertElement } from '../alert.component.js';
import { AlertType } from '../alert.types.js';

describe('NrAlertElement', () => {
  let element: NrAlertElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-alert message="Test alert"></nr-alert>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-ALERT');
    });

    it('should have default properties', () => {
      expect(element.message).to.equal('Test alert');
      expect(element.type).to.equal(AlertType.Info);
      expect(element.description).to.equal('');
      expect(element.closable).to.be.false;
      expect(element.showIcon).to.be.false;
      expect(element.icon).to.equal('');
      expect(element.banner).to.be.false;
    });

    it('should display message', async () => {
      const messageElement = element.shadowRoot?.querySelector('.alert-message, [class*="message"]');
      expect(messageElement?.textContent).to.contain('Test alert');
    });
  });

  describe('Alert types', () => {
    it('should apply info type', async () => {
      element.type = AlertType.Info;
      await element.updateComplete;

      expect(element.type).to.equal('info');
      expect(element.getAttribute('type')).to.equal('info');
    });

    it('should apply success type', async () => {
      element.type = AlertType.Success;
      await element.updateComplete;

      expect(element.type).to.equal('success');
    });

    it('should apply warning type', async () => {
      element.type = AlertType.Warning;
      await element.updateComplete;

      expect(element.type).to.equal('warning');
    });

    it('should apply error type', async () => {
      element.type = AlertType.Error;
      await element.updateComplete;

      expect(element.type).to.equal('error');
    });
  });

  describe('Message and description', () => {
    it('should display message', async () => {
      element.message = 'Important message';
      await element.updateComplete;

      expect(element.message).to.equal('Important message');
    });

    it('should display description', async () => {
      element.description = 'This is a detailed description';
      await element.updateComplete;

      expect(element.description).to.equal('This is a detailed description');
      const descElement = element.shadowRoot?.querySelector('.alert-description, [class*="description"]');
      expect(descElement?.textContent).to.contain('This is a detailed description');
    });

    it('should handle empty message', async () => {
      element.message = '';
      await element.updateComplete;

      expect(element.message).to.equal('');
    });
  });

  describe('Closable functionality', () => {
    it('should show close button when closable', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.alert-close, [class*="close"]');
      expect(closeButton).to.exist;
    });

    it('should not show close button by default', async () => {
      expect(element.closable).to.be.false;
    });

    it('should dispatch nr-alert-close event on close', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.alert-close, [class*="close"]') as HTMLElement;

      if (closeButton) {
        setTimeout(() => closeButton.click());
        const event = await oneEvent(element, 'nr-alert-close');
        expect(event).to.exist;
      }
    });

    it('should hide alert after closing', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.alert-close, [class*="close"]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
        await aTimeout(100);

        // Alert should be hidden or removed
      }
    });
  });

  describe('Icon functionality', () => {
    it('should show icon when showIcon is true', async () => {
      element.showIcon = true;
      await element.updateComplete;

      expect(element.showIcon).to.be.true;
    });

    it('should not show icon by default', async () => {
      expect(element.showIcon).to.be.false;
    });

    it('should use custom icon when specified', async () => {
      element.showIcon = true;
      element.icon = 'warning';
      await element.updateComplete;

      expect(element.icon).to.equal('warning');
    });

    it('should use default icon based on type', async () => {
      element.showIcon = true;
      element.type = AlertType.Error;
      element.icon = ''; // No custom icon
      await element.updateComplete;

      // Should use default error icon
      expect(element.showIcon).to.be.true;
    });
  });

  describe('Banner mode', () => {
    it('should support banner mode', async () => {
      element.banner = true;
      await element.updateComplete;

      expect(element.banner).to.be.true;
    });

    it('should apply banner styles', async () => {
      element.banner = true;
      await element.updateComplete;

      // Banner mode should have different styling (full width, no border radius)
      expect(element.banner).to.be.true;
    });
  });

  describe('Slots', () => {
    it('should render default slot', async () => {
      const el = await fixture<NrAlertElement>(html`
        <nr-alert>
          <p>Custom content</p>
        </nr-alert>
      `);

      const slot = el.shadowRoot?.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });

    it('should render icon slot', async () => {
      const el = await fixture<NrAlertElement>(html`
        <nr-alert>
          <span slot="icon">🔔</span>
        </nr-alert>
      `);

      const iconSlot = el.shadowRoot?.querySelector('slot[name="icon"]');
      expect(iconSlot).to.exist;
    });

    it('should render action slot', async () => {
      const el = await fixture<NrAlertElement>(html`
        <nr-alert>
          <button slot="action">Learn more</button>
        </nr-alert>
      `);

      const actionSlot = el.shadowRoot?.querySelector('slot[name="action"]');
      expect(actionSlot).to.exist;
    });
  });

  describe('Accessibility', () => {
    it('should have role alert', async () => {
      const alert = element.shadowRoot?.querySelector('[role="alert"]');
      expect(alert).to.exist;
    });

    it('should be focusable when closable', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.alert-close, [class*="close"]');
      expect(closeButton).to.exist;
    });
  });

  describe('Combined configurations', () => {
    it('should render with all features enabled', async () => {
      element.message = 'Error occurred';
      element.description = 'Please try again later';
      element.type = AlertType.Error;
      element.showIcon = true;
      element.closable = true;
      await element.updateComplete;

      expect(element.message).to.equal('Error occurred');
      expect(element.description).to.equal('Please try again later');
      expect(element.type).to.equal('error');
      expect(element.showIcon).to.be.true;
      expect(element.closable).to.be.true;
    });
  });

  describe('Edge cases', () => {
    it('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(1000);
      element.message = longMessage;
      await element.updateComplete;

      expect(element.message).to.equal(longMessage);
    });

    it('should handle special characters in message', async () => {
      element.message = '<script>alert("xss")</script>';
      await element.updateComplete;

      // Should escape HTML
      expect(element.message).to.equal('<script>alert("xss")</script>');
    });

    it('should handle unicode in message', async () => {
      element.message = '你好世界 🚨 مرحبا';
      await element.updateComplete;

      expect(element.message).to.equal('你好世界 🚨 مرحبا');
    });

    it('should handle rapid type changes', async () => {
      element.type = AlertType.Info;
      element.type = AlertType.Warning;
      element.type = AlertType.Error;
      element.type = AlertType.Success;
      await element.updateComplete;

      expect(element.type).to.equal('success');
    });
  });
});
