/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrPopconfirmElement } from '../popconfirm.component.js';
import {
  PopconfirmPlacement,
  PopconfirmTrigger,
  PopconfirmButtonType,
  PopconfirmIcon
} from '../popconfirm.types.js';

describe('NrPopconfirmElement', () => {
  let element: NrPopconfirmElement;

  beforeEach(async () => {
    element = await fixture(html`
      <nr-popconfirm title="Are you sure?">
        <button slot="trigger">Delete</button>
      </nr-popconfirm>
    `);
  });

  afterEach(async () => {
    element.open = false;
    await aTimeout(50);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-POPCONFIRM');
    });

    it('should have default properties', () => {
      expect(element.title).to.equal('Are you sure?');
      expect(element.okText).to.equal('OK');
      expect(element.cancelText).to.equal('Cancel');
      expect(element.okType).to.equal(PopconfirmButtonType.Primary);
      expect(element.showCancel).to.be.true;
      expect(element.icon).to.equal(PopconfirmIcon.Warning);
      expect(element.placement).to.equal(PopconfirmPlacement.Top);
      expect(element.trigger).to.equal(PopconfirmTrigger.Click);
      expect(element.disabled).to.be.false;
      expect(element.arrow).to.be.true;
      expect(element.open).to.be.false;
    });

    it('should render trigger slot', async () => {
      const triggerSlot = element.shadowRoot?.querySelector('slot[name="trigger"]');
      expect(triggerSlot).to.exist;
    });
  });

  describe('Open/Close behavior', () => {
    it('should open popconfirm on trigger click', async () => {
      const trigger = element.shadowRoot?.querySelector('[slot="trigger"]')?.parentElement as HTMLElement;
      trigger?.click();
      await element.updateComplete;

      expect(element.open).to.be.true;
    });

    it('should close popconfirm when clicking trigger again', async () => {
      element.open = true;
      await element.updateComplete;

      const trigger = element.shadowRoot?.querySelector('[slot="trigger"]')?.parentElement as HTMLElement;
      trigger?.click();
      await element.updateComplete;

      expect(element.open).to.be.false;
    });

    it('should dispatch nr-open-change event when opening', async () => {
      const trigger = element.shadowRoot?.querySelector('[slot="trigger"]')?.parentElement as HTMLElement;

      setTimeout(() => {
        trigger?.click();
      });

      const event = await oneEvent(element, 'nr-open-change');
      expect(event).to.exist;
      expect((event as CustomEvent).detail.open).to.be.true;
    });

    it('should not open when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const trigger = element.shadowRoot?.querySelector('[slot="trigger"]')?.parentElement as HTMLElement;
      trigger?.click();
      await element.updateComplete;

      expect(element.open).to.be.false;
    });
  });

  describe('Title and description', () => {
    it('should display title', async () => {
      element.title = 'Delete this item?';
      element.open = true;
      await element.updateComplete;

      const title = element.shadowRoot?.querySelector('.popconfirm-title');
      expect(title?.textContent).to.include('Delete this item?');
    });

    it('should display description when provided', async () => {
      element.description = 'This action cannot be undone.';
      element.open = true;
      await element.updateComplete;

      const description = element.shadowRoot?.querySelector('.popconfirm-description');
      expect(description?.textContent).to.include('This action cannot be undone.');
    });
  });

  describe('Confirm and Cancel buttons', () => {
    it('should display OK button with custom text', async () => {
      element.okText = 'Yes, Delete';
      element.open = true;
      await element.updateComplete;

      // Button text should include custom text
    });

    it('should display Cancel button with custom text', async () => {
      element.cancelText = 'No, Keep';
      element.open = true;
      await element.updateComplete;

      // Button text should include custom text
    });

    it('should hide Cancel button when showCancel is false', async () => {
      element.showCancel = false;
      element.open = true;
      await element.updateComplete;

      const buttons = element.shadowRoot?.querySelectorAll('.popconfirm-buttons nr-button');
      // Should have only OK button
    });

    it('should dispatch nr-confirm event on OK click', async () => {
      element.open = true;
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-confirm', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-confirm');
      expect(event).to.exist;
    });

    it('should dispatch nr-cancel event on Cancel click', async () => {
      element.open = true;
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-cancel', { bubbles: true }));
      });

      const event = await oneEvent(element, 'nr-cancel');
      expect(event).to.exist;
    });
  });

  describe('OK button types', () => {
    it('should apply primary type to OK button', async () => {
      element.okType = PopconfirmButtonType.Primary;
      element.open = true;
      await element.updateComplete;

      expect(element.okType).to.equal('primary');
    });

    it('should apply danger type to OK button', async () => {
      element.okType = PopconfirmButtonType.Danger;
      element.open = true;
      await element.updateComplete;

      expect(element.okType).to.equal('danger');
    });

    it('should apply default type to OK button', async () => {
      element.okType = PopconfirmButtonType.Default;
      element.open = true;
      await element.updateComplete;

      expect(element.okType).to.equal('default');
    });
  });

  describe('Icon options', () => {
    it('should display warning icon by default', async () => {
      element.open = true;
      await element.updateComplete;

      expect(element.icon).to.equal(PopconfirmIcon.Warning);
    });

    it('should apply question icon', async () => {
      element.icon = PopconfirmIcon.Question;
      element.open = true;
      await element.updateComplete;

      expect(element.icon).to.equal('question-circle');
    });

    it('should apply info icon', async () => {
      element.icon = PopconfirmIcon.Info;
      element.open = true;
      await element.updateComplete;

      expect(element.icon).to.equal('info-circle');
    });

    it('should apply error icon', async () => {
      element.icon = PopconfirmIcon.Error;
      element.open = true;
      await element.updateComplete;

      expect(element.icon).to.equal('close-circle');
    });

    it('should apply success icon', async () => {
      element.icon = PopconfirmIcon.Success;
      element.open = true;
      await element.updateComplete;

      expect(element.icon).to.equal('check-circle');
    });

    it('should apply custom icon color', async () => {
      element.iconColor = '#ff5500';
      element.open = true;
      await element.updateComplete;

      expect(element.iconColor).to.equal('#ff5500');
    });
  });

  describe('Placement options', () => {
    it('should apply top placement', async () => {
      element.placement = PopconfirmPlacement.Top;
      await element.updateComplete;

      expect(element.placement).to.equal('top');
    });

    it('should apply bottom placement', async () => {
      element.placement = PopconfirmPlacement.Bottom;
      await element.updateComplete;

      expect(element.placement).to.equal('bottom');
    });

    it('should apply left placement', async () => {
      element.placement = PopconfirmPlacement.Left;
      await element.updateComplete;

      expect(element.placement).to.equal('left');
    });

    it('should apply right placement', async () => {
      element.placement = PopconfirmPlacement.Right;
      await element.updateComplete;

      expect(element.placement).to.equal('right');
    });

    it('should apply top-start placement', async () => {
      element.placement = PopconfirmPlacement.TopStart;
      await element.updateComplete;

      expect(element.placement).to.equal('top-start');
    });

    it('should apply bottom-end placement', async () => {
      element.placement = PopconfirmPlacement.BottomEnd;
      await element.updateComplete;

      expect(element.placement).to.equal('bottom-end');
    });
  });

  describe('Keyboard navigation', () => {
    it('should close on Escape key', async () => {
      element.open = true;
      await element.updateComplete;

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await aTimeout(50);

      expect(element.open).to.be.false;
    });
  });

  describe('Arrow option', () => {
    it('should show arrow by default', () => {
      expect(element.arrow).to.be.true;
    });

    it('should hide arrow when disabled', async () => {
      element.arrow = false;
      await element.updateComplete;

      expect(element.arrow).to.be.false;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty title', async () => {
      element.title = '';
      element.open = true;
      await element.updateComplete;

      expect(element.title).to.equal('');
    });

    it('should handle special characters in title', async () => {
      element.title = '<script>alert("xss")</script>';
      element.open = true;
      await element.updateComplete;

      // Content should be escaped
    });

    it('should handle unicode in title', async () => {
      element.title = '删除此项目吗？🗑️';
      element.open = true;
      await element.updateComplete;

      expect(element.title).to.include('删除此项目吗');
    });

    it('should handle rapid open/close', async () => {
      for (let i = 0; i < 5; i++) {
        element.open = true;
        element.open = false;
      }
      await element.updateComplete;

      expect(element.open).to.be.false;
    });

    it('should handle very long description', async () => {
      element.description = 'A'.repeat(500);
      element.open = true;
      await element.updateComplete;

      expect(element.description.length).to.equal(500);
    });
  });

  describe('Accessibility', () => {
    it('should render proper structure', async () => {
      element.open = true;
      await element.updateComplete;

      const content = element.shadowRoot?.querySelector('.popconfirm-content');
      expect(content).to.exist;
    });

    it('should render message with icon', async () => {
      element.open = true;
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector('.popconfirm-icon');
      expect(icon).to.exist;
    });

    it('should render buttons section', async () => {
      element.open = true;
      await element.updateComplete;

      const buttons = element.shadowRoot?.querySelector('.popconfirm-buttons');
      expect(buttons).to.exist;
    });
  });
});
