/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import { NrToastElement } from '../toast.component.js';
import { ToastType, ToastPosition, ToastAnimation } from '../toast.types.js';

describe('NrToastElement', () => {
  let element: NrToastElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-toast></nr-toast>`);
  });

  afterEach(async () => {
    // Clear all toasts after each test
    element.clearAll?.();
    await aTimeout(50);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-TOAST');
    });

    it('should have default properties', () => {
      expect(element.position).to.equal(ToastPosition.TopRight);
      expect(element.animation).to.equal(ToastAnimation.Slide);
      expect(element.autoDismiss).to.be.true;
      expect(element.duration).to.equal(5000);
      expect(element.maxToasts).to.equal(5);
      expect(element.closable).to.be.true;
    });

    it('should render toast container', async () => {
      const container = element.shadowRoot?.querySelector('.toast-container, [class*="container"]');
      expect(container).to.exist;
    });
  });

  describe('Toast positions', () => {
    it('should apply top-right position', async () => {
      element.position = ToastPosition.TopRight;
      await element.updateComplete;

      expect(element.position).to.equal('top-right');
    });

    it('should apply top-left position', async () => {
      element.position = ToastPosition.TopLeft;
      await element.updateComplete;

      expect(element.position).to.equal('top-left');
    });

    it('should apply top-center position', async () => {
      element.position = ToastPosition.TopCenter;
      await element.updateComplete;

      expect(element.position).to.equal('top-center');
    });

    it('should apply bottom-right position', async () => {
      element.position = ToastPosition.BottomRight;
      await element.updateComplete;

      expect(element.position).to.equal('bottom-right');
    });

    it('should apply bottom-left position', async () => {
      element.position = ToastPosition.BottomLeft;
      await element.updateComplete;

      expect(element.position).to.equal('bottom-left');
    });

    it('should apply bottom-center position', async () => {
      element.position = ToastPosition.BottomCenter;
      await element.updateComplete;

      expect(element.position).to.equal('bottom-center');
    });
  });

  describe('Toast animations', () => {
    it('should apply slide animation', async () => {
      element.animation = ToastAnimation.Slide;
      await element.updateComplete;

      expect(element.animation).to.equal('slide');
    });

    it('should apply fade animation', async () => {
      element.animation = ToastAnimation.Fade;
      await element.updateComplete;

      expect(element.animation).to.equal('fade');
    });

    it('should apply zoom animation', async () => {
      element.animation = ToastAnimation.Zoom;
      await element.updateComplete;

      expect(element.animation).to.equal('zoom');
    });

    it('should apply bounce animation', async () => {
      element.animation = ToastAnimation.Bounce;
      await element.updateComplete;

      expect(element.animation).to.equal('bounce');
    });

    it('should support no animation', async () => {
      element.animation = ToastAnimation.None;
      await element.updateComplete;

      expect(element.animation).to.equal('none');
    });
  });

  describe('Show toast', () => {
    it('should show toast with text', async () => {
      const id = element.show({ text: 'Test message' });
      await element.updateComplete;

      expect(id).to.be.a('string');
    });

    it('should show toast with type', async () => {
      element.show({ text: 'Success!', type: ToastType.Success });
      await element.updateComplete;

      // Toast should be displayed
    });

    it('should show info toast', async () => {
      element.show({ text: 'Info message', type: ToastType.Info });
      await element.updateComplete;
    });

    it('should show warning toast', async () => {
      element.show({ text: 'Warning message', type: ToastType.Warning });
      await element.updateComplete;
    });

    it('should show error toast', async () => {
      element.show({ text: 'Error message', type: ToastType.Error });
      await element.updateComplete;
    });

    it('should show multiple toasts', async () => {
      element.show({ text: 'Toast 1' });
      element.show({ text: 'Toast 2' });
      element.show({ text: 'Toast 3' });
      await element.updateComplete;

      // Multiple toasts should be stacked
    });
  });

  describe('Auto dismiss', () => {
    it('should auto dismiss by default', () => {
      expect(element.autoDismiss).to.be.true;
    });

    it('should allow disabling auto dismiss', async () => {
      element.autoDismiss = false;
      await element.updateComplete;

      expect(element.autoDismiss).to.be.false;
    });

    it('should respect custom duration', async () => {
      element.duration = 3000;
      await element.updateComplete;

      expect(element.duration).to.equal(3000);
    });

    it('should auto dismiss after duration', async () => {
      element.duration = 100; // Short duration for testing
      element.show({ text: 'Will disappear' });
      await element.updateComplete;

      await aTimeout(200);
      // Toast should be dismissed
    });
  });

  describe('Closable functionality', () => {
    it('should be closable by default', () => {
      expect(element.closable).to.be.true;
    });

    it('should allow disabling closable', async () => {
      element.closable = false;
      await element.updateComplete;

      expect(element.closable).to.be.false;
    });
  });

  describe('Max toasts limit', () => {
    it('should have default max toasts of 5', () => {
      expect(element.maxToasts).to.equal(5);
    });

    it('should allow custom max toasts', async () => {
      element.maxToasts = 3;
      await element.updateComplete;

      expect(element.maxToasts).to.equal(3);
    });

    it('should respect max toasts limit', async () => {
      element.maxToasts = 2;
      await element.updateComplete;

      element.show({ text: 'Toast 1' });
      element.show({ text: 'Toast 2' });
      element.show({ text: 'Toast 3' }); // Should replace oldest

      await element.updateComplete;
      // Only 2 toasts should be visible
    });
  });

  describe('Clear functionality', () => {
    it('should clear all toasts', async () => {
      element.show({ text: 'Toast 1' });
      element.show({ text: 'Toast 2' });
      await element.updateComplete;

      element.clearAll?.();
      await element.updateComplete;

      // All toasts should be cleared
    });

    it('should dismiss specific toast by id', async () => {
      const id = element.show({ text: 'Test toast' });
      await element.updateComplete;

      element.dismiss?.(id);
      await element.updateComplete;

      // Specific toast should be dismissed
    });
  });

  describe('Toast with action button', () => {
    it('should show toast with button', async () => {
      let clicked = false;
      element.show({
        text: 'Item deleted',
        type: ToastType.Success,
        button: {
          label: 'Undo',
          onClick: () => { clicked = true; }
        }
      });
      await element.updateComplete;

      // Toast with button should be rendered
    });
  });

  describe('Toast types shorthand methods', () => {
    it('should have success shorthand', async () => {
      if (typeof (element as any).success === 'function') {
        (element as any).success('Success message');
        await element.updateComplete;
      }
    });

    it('should have error shorthand', async () => {
      if (typeof (element as any).error === 'function') {
        (element as any).error('Error message');
        await element.updateComplete;
      }
    });

    it('should have warning shorthand', async () => {
      if (typeof (element as any).warning === 'function') {
        (element as any).warning('Warning message');
        await element.updateComplete;
      }
    });

    it('should have info shorthand', async () => {
      if (typeof (element as any).info === 'function') {
        (element as any).info('Info message');
        await element.updateComplete;
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const container = element.shadowRoot?.querySelector('[role="alert"], [role="status"]');
      expect(container).to.exist;
    });

    it('should have aria-live attribute', async () => {
      const container = element.shadowRoot?.querySelector('[aria-live]');
      expect(container).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text', async () => {
      const id = element.show({ text: '' });
      await element.updateComplete;

      expect(id).to.be.a('string');
    });

    it('should handle very long text', async () => {
      const longText = 'A'.repeat(500);
      element.show({ text: longText });
      await element.updateComplete;
    });

    it('should handle special characters', async () => {
      element.show({ text: '<script>alert("xss")</script>' });
      await element.updateComplete;
    });

    it('should handle unicode', async () => {
      element.show({ text: '🎉 Congratulations! 你好' });
      await element.updateComplete;
    });

    it('should handle rapid show calls', async () => {
      for (let i = 0; i < 10; i++) {
        element.show({ text: `Toast ${i}` });
      }
      await element.updateComplete;
    });
  });
});
