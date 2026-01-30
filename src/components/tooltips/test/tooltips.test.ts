/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { TooltipElement } from '../tooltips.component.js';
import { TooltipPosition, TooltipAlignment } from '../tooltips.constant.js';

describe('TooltipElement', () => {
  let element: TooltipElement;
  let targetElement: HTMLElement;

  beforeEach(async () => {
    // Create a target element first, then the tooltip
    const container = await fixture(html`
      <div>
        <button id="target">Hover me</button>
        <hy-tooltip>Tooltip content</hy-tooltip>
      </div>
    `);
    targetElement = container.querySelector('#target') as HTMLElement;
    element = container.querySelector('hy-tooltip') as TooltipElement;
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('HY-TOOLTIP');
    });

    it('should have default properties', () => {
      expect(element.position).to.equal(TooltipPosition.Bottom);
      expect(element.alignement).to.equal(TooltipAlignment.Center);
      expect(element.show).to.be.false;
      expect(element.isPopConfirm).to.be.false;
    });

    it('should find target from previous sibling', () => {
      expect(element.target).to.equal(targetElement);
    });

    it('should not render content when hidden', async () => {
      element.show = false;
      await element.updateComplete;

      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.not.exist;
    });

    it('should render content when shown', async () => {
      element.show = true;
      await element.updateComplete;

      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Position options', () => {
    it('should default to bottom position', () => {
      expect(element.position).to.equal('bottom');
    });

    it('should accept top position', async () => {
      element.position = TooltipPosition.Top;
      await element.updateComplete;

      expect(element.position).to.equal('top');
    });

    it('should accept bottom position', async () => {
      element.position = TooltipPosition.Bottom;
      await element.updateComplete;

      expect(element.position).to.equal('bottom');
    });

    it('should accept left position', async () => {
      element.position = TooltipPosition.Left;
      await element.updateComplete;

      expect(element.position).to.equal('left');
    });

    it('should accept right position', async () => {
      element.position = TooltipPosition.Right;
      await element.updateComplete;

      expect(element.position).to.equal('right');
    });
  });

  describe('Alignment options', () => {
    it('should default to center alignment', () => {
      expect(element.alignement).to.equal('center');
    });

    it('should accept start alignment', async () => {
      element.alignement = TooltipAlignment.Start;
      await element.updateComplete;

      expect(element.alignement).to.equal('start');
    });

    it('should accept center alignment', async () => {
      element.alignement = TooltipAlignment.Center;
      await element.updateComplete;

      expect(element.alignement).to.equal('center');
    });

    it('should accept end alignment', async () => {
      element.alignement = TooltipAlignment.End;
      await element.updateComplete;

      expect(element.alignement).to.equal('end');
    });
  });

  describe('Show/Hide behavior', () => {
    it('should be hidden by default', () => {
      expect(element.show).to.be.false;
    });

    it('should show on mouseover', async () => {
      targetElement.dispatchEvent(new MouseEvent('mouseover'));
      await element.updateComplete;

      expect(element.show).to.be.true;
    });

    it('should hide on mouseleave', async () => {
      element.show = true;
      await element.updateComplete;

      targetElement.dispatchEvent(new MouseEvent('mouseleave'));
      await element.updateComplete;

      expect(element.show).to.be.false;
    });

    it('should toggle show programmatically', async () => {
      element.show = true;
      await element.updateComplete;
      expect(element.show).to.be.true;

      element.show = false;
      await element.updateComplete;
      expect(element.show).to.be.false;
    });
  });

  describe('PopConfirm mode', () => {
    let popconfirmElement: TooltipElement;
    let popconfirmTarget: HTMLElement;

    beforeEach(async () => {
      const container = await fixture(html`
        <div>
          <button id="pop-target">Click me</button>
          <hy-tooltip
            .isPopConfirm=${true}
            popConfirmTitle="Are you sure?"
            popConfirmDescription="This action cannot be undone."
            okText="Yes"
            cancelText="No"
          ></hy-tooltip>
        </div>
      `);
      popconfirmTarget = container.querySelector('#pop-target') as HTMLElement;
      popconfirmElement = container.querySelector('hy-tooltip') as TooltipElement;
    });

    it('should be in popconfirm mode', () => {
      expect(popconfirmElement.isPopConfirm).to.be.true;
    });

    it('should have popconfirm title', () => {
      expect(popconfirmElement.popConfirmTitle).to.equal('Are you sure?');
    });

    it('should have popconfirm description', () => {
      expect(popconfirmElement.popConfirmDescription).to.equal('This action cannot be undone.');
    });

    it('should have custom ok text', () => {
      expect(popconfirmElement.okText).to.equal('Yes');
    });

    it('should have custom cancel text', () => {
      expect(popconfirmElement.cancelText).to.equal('No');
    });

    it('should toggle on click in popconfirm mode', async () => {
      popconfirmTarget.click();
      await popconfirmElement.updateComplete;

      expect(popconfirmElement.show).to.be.true;

      popconfirmTarget.click();
      await popconfirmElement.updateComplete;

      expect(popconfirmElement.show).to.be.false;
    });

    it('should render popconfirm container when shown', async () => {
      popconfirmElement.show = true;
      await popconfirmElement.updateComplete;

      const popconfirmContainer = popconfirmElement.shadowRoot?.querySelector('.popconfirm-container');
      expect(popconfirmContainer).to.exist;
    });

    it('should render popconfirm title', async () => {
      popconfirmElement.show = true;
      await popconfirmElement.updateComplete;

      const title = popconfirmElement.shadowRoot?.querySelector('.popconfirm-title');
      expect(title?.textContent).to.include('Are you sure?');
    });

    it('should render popconfirm description', async () => {
      popconfirmElement.show = true;
      await popconfirmElement.updateComplete;

      const description = popconfirmElement.shadowRoot?.querySelector('.popconfirm-description');
      expect(description?.textContent).to.include('This action cannot be undone.');
    });

    it('should render buttons in popconfirm mode', async () => {
      popconfirmElement.show = true;
      await popconfirmElement.updateComplete;

      const btnBlock = popconfirmElement.shadowRoot?.querySelector('.btn-block');
      expect(btnBlock).to.exist;
    });

    it('should dispatch onCancel event', async () => {
      popconfirmElement.show = true;
      await popconfirmElement.updateComplete;

      setTimeout(() => {
        popconfirmElement.onPopConfirmCancel();
      });

      const event = await oneEvent(popconfirmElement, 'onCancel');
      expect(event).to.exist;
      expect(popconfirmElement.show).to.be.false;
    });

    it('should dispatch onConfirm event', async () => {
      popconfirmElement.show = true;
      await popconfirmElement.updateComplete;

      setTimeout(() => {
        popconfirmElement.onPopConfirmConfirm();
      });

      const event = await oneEvent(popconfirmElement, 'onConfirm');
      expect(event).to.exist;
      expect(popconfirmElement.show).to.be.false;
    });
  });

  describe('Outside click handling', () => {
    let popElement: TooltipElement;

    beforeEach(async () => {
      const container = await fixture(html`
        <div>
          <button id="trigger">Trigger</button>
          <hy-tooltip .isPopConfirm=${true}></hy-tooltip>
          <button id="outside">Outside</button>
        </div>
      `);
      popElement = container.querySelector('hy-tooltip') as TooltipElement;
    });

    it('should close on outside click in popconfirm mode', async () => {
      popElement.show = true;
      await popElement.updateComplete;

      // Simulate outside click
      const outsideEvent = new MouseEvent('click', { bubbles: true, composed: true });
      document.body.dispatchEvent(outsideEvent);
      await aTimeout(50);

      expect(popElement.show).to.be.false;
    });
  });

  describe('Default values', () => {
    it('should have default okText', async () => {
      const tooltip = await fixture<TooltipElement>(html`
        <div>
          <button>Target</button>
          <hy-tooltip .isPopConfirm=${true}></hy-tooltip>
        </div>
      `);
      const el = tooltip.querySelector('hy-tooltip') as TooltipElement;

      expect(el.okText).to.equal('Yes');
    });

    it('should have default cancelText', async () => {
      const tooltip = await fixture<TooltipElement>(html`
        <div>
          <button>Target</button>
          <hy-tooltip .isPopConfirm=${true}></hy-tooltip>
        </div>
      `);
      const el = tooltip.querySelector('hy-tooltip') as TooltipElement;

      expect(el.cancelText).to.equal('No');
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid show/hide', async () => {
      element.show = true;
      element.show = false;
      element.show = true;
      element.show = false;
      await element.updateComplete;

      expect(element.show).to.be.false;
    });

    it('should handle empty popconfirm title', async () => {
      const container = await fixture(html`
        <div>
          <button>Target</button>
          <hy-tooltip .isPopConfirm=${true} popConfirmTitle=""></hy-tooltip>
        </div>
      `);
      const el = container.querySelector('hy-tooltip') as TooltipElement;

      el.show = true;
      await el.updateComplete;

      expect(el.popConfirmTitle).to.equal('');
    });

    it('should handle special characters in title', async () => {
      const container = await fixture(html`
        <div>
          <button>Target</button>
          <hy-tooltip
            .isPopConfirm=${true}
            popConfirmTitle="<script>alert('xss')</script>"
          ></hy-tooltip>
        </div>
      `);
      const el = container.querySelector('hy-tooltip') as TooltipElement;

      el.show = true;
      await el.updateComplete;

      // Content should be safely rendered
      const title = el.shadowRoot?.querySelector('.popconfirm-title');
      expect(title).to.exist;
    });

    it('should handle unicode content', async () => {
      const container = await fixture(html`
        <div>
          <button>Target</button>
          <hy-tooltip
            .isPopConfirm=${true}
            popConfirmTitle="确定删除吗？"
            popConfirmDescription="此操作不可撤销 🗑️"
          ></hy-tooltip>
        </div>
      `);
      const el = container.querySelector('hy-tooltip') as TooltipElement;

      el.show = true;
      await el.updateComplete;

      expect(el.popConfirmTitle).to.include('确定删除吗');
    });
  });

  describe('Offset values', () => {
    it('should have default horizontal offset', () => {
      expect(element.horizontalOffset).to.equal(10);
    });

    it('should have default vertical offset', () => {
      expect(element.verticalOffset).to.equal(10);
    });
  });

  describe('Accessibility', () => {
    it('should render tooltip content in slot', async () => {
      element.show = true;
      await element.updateComplete;

      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });

    it('should render popconfirm with semantic structure', async () => {
      const container = await fixture(html`
        <div>
          <button>Target</button>
          <hy-tooltip .isPopConfirm=${true} popConfirmTitle="Confirm?"></hy-tooltip>
        </div>
      `);
      const el = container.querySelector('hy-tooltip') as TooltipElement;

      el.show = true;
      await el.updateComplete;

      const popContainer = el.shadowRoot?.querySelector('.popconfirm-container');
      expect(popContainer).to.exist;
    });
  });
});
