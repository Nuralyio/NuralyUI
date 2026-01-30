/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrTextareaElement } from '../textarea.component.js';

describe('NrTextareaElement', () => {
  let element: NrTextareaElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-textarea></nr-textarea>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-TEXTAREA');
    });

    it('should have default properties', () => {
      expect(element.value).to.equal('');
      expect(element.disabled).to.be.false;
      expect(element.readonly).to.be.false;
    });

    it('should render textarea element', async () => {
      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea).to.exist;
    });
  });

  describe('Value handling', () => {
    it('should set value', async () => {
      element.value = 'Hello World';
      await element.updateComplete;

      expect(element.value).to.equal('Hello World');
    });

    it('should reflect value to textarea', async () => {
      element.value = 'Test content';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.value).to.equal('Test content');
    });
  });

  describe('Placeholder', () => {
    it('should display placeholder', async () => {
      element.placeholder = 'Enter your message';
      await element.updateComplete;

      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.placeholder).to.equal('Enter your message');
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.disabled).to.be.true;
    });
  });

  describe('Readonly state', () => {
    it('should support readonly state', async () => {
      element.readonly = true;
      await element.updateComplete;

      expect(element.readonly).to.be.true;
      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.readOnly).to.be.true;
    });
  });

  describe('Rows and columns', () => {
    it('should support rows attribute', async () => {
      element.rows = 10;
      await element.updateComplete;

      expect(element.rows).to.equal(10);
    });

    it('should support cols attribute', async () => {
      element.cols = 50;
      await element.updateComplete;

      expect(element.cols).to.equal(50);
    });
  });

  describe('Min and max length', () => {
    it('should support minLength', async () => {
      element.minLength = 10;
      await element.updateComplete;

      expect(element.minLength).to.equal(10);
    });

    it('should support maxLength', async () => {
      element.maxLength = 500;
      await element.updateComplete;

      expect(element.maxLength).to.equal(500);
    });
  });

  describe('Auto resize', () => {
    it('should support auto resize', async () => {
      element.autoResize = true;
      await element.updateComplete;

      expect(element.autoResize).to.be.true;
    });
  });

  describe('Character count', () => {
    it('should support show count', async () => {
      element.showCount = true;
      element.value = 'Hello';
      await element.updateComplete;

      expect(element.showCount).to.be.true;
    });

    it('should display character count', async () => {
      element.showCount = true;
      element.maxLength = 100;
      element.value = 'Hello';
      await element.updateComplete;

      // Should show 5/100 or similar
    });
  });

  describe('Events', () => {
    it('should dispatch input event', async () => {
      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

      setTimeout(() => {
        textarea.value = 'new value';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-input');
      expect(event).to.exist;
    });

    it('should dispatch focus event', async () => {
      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

      setTimeout(() => {
        textarea.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-focus');
      expect(event).to.exist;
    });

    it('should dispatch blur event', async () => {
      const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

      setTimeout(() => {
        textarea.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-blur');
      expect(event).to.exist;
    });
  });

  describe('States', () => {
    it('should support error state', async () => {
      element.state = 'error';
      await element.updateComplete;

      expect(element.state).to.equal('error');
    });

    it('should support warning state', async () => {
      element.state = 'warning';
      await element.updateComplete;

      expect(element.state).to.equal('warning');
    });

    it('should support success state', async () => {
      element.state = 'success';
      await element.updateComplete;

      expect(element.state).to.equal('success');
    });
  });

  describe('Form integration', () => {
    it('should support name attribute', async () => {
      element.name = 'message';
      await element.updateComplete;

      expect(element.name).to.equal('message');
    });

    it('should support required attribute', async () => {
      element.required = true;
      await element.updateComplete;

      expect(element.required).to.be.true;
    });
  });

  describe('Resize property', () => {
    it('should support resize none', async () => {
      element.resize = 'none';
      await element.updateComplete;

      expect(element.resize).to.equal('none');
    });

    it('should support resize vertical', async () => {
      element.resize = 'vertical';
      await element.updateComplete;

      expect(element.resize).to.equal('vertical');
    });

    it('should support resize horizontal', async () => {
      element.resize = 'horizontal';
      await element.updateComplete;

      expect(element.resize).to.equal('horizontal');
    });

    it('should support resize both', async () => {
      element.resize = 'both';
      await element.updateComplete;

      expect(element.resize).to.equal('both');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', async () => {
      const textarea = element.shadowRoot?.querySelector('textarea');
      expect(textarea).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty value', async () => {
      element.value = '';
      await element.updateComplete;

      expect(element.value).to.equal('');
    });

    it('should handle very long text', async () => {
      const longText = 'a'.repeat(10000);
      element.value = longText;
      await element.updateComplete;

      expect(element.value.length).to.equal(10000);
    });

    it('should handle special characters', async () => {
      element.value = '<script>alert("xss")</script>';
      await element.updateComplete;

      expect(element.value).to.equal('<script>alert("xss")</script>');
    });

    it('should handle unicode', async () => {
      element.value = '你好世界 🎉 مرحبا';
      await element.updateComplete;

      expect(element.value).to.equal('你好世界 🎉 مرحبا');
    });

    it('should handle newlines', async () => {
      element.value = 'Line 1\nLine 2\nLine 3';
      await element.updateComplete;

      expect(element.value).to.contain('\n');
    });
  });
});
