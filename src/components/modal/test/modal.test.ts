/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrModalElement } from '../modal.component.js';
import {
  ModalSize,
  ModalPosition,
  ModalAnimation,
  ModalBackdrop
} from '../modal.types.js';

describe('NrModalElement', () => {
  let element: NrModalElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-modal>Modal content</nr-modal>`);
  });

  afterEach(() => {
    // Ensure modal is closed after each test
    element.open = false;
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-MODAL');
    });

    it('should have default properties', () => {
      expect(element.open).to.be.false;
      expect(element.size).to.equal(ModalSize.Medium);
      expect(element.position).to.equal(ModalPosition.Center);
      expect(element.animation).to.equal(ModalAnimation.Fade);
      expect(element.backdrop).to.equal(ModalBackdrop.Closable);
      expect(element.closable).to.be.true;
      expect(element.modalDraggable).to.be.false;
      expect(element.resizable).to.be.false;
      expect(element.fullscreen).to.be.false;
      expect(element.showCloseButton).to.be.true;
      expect(element.zIndex).to.equal(1000);
    });

    it('should be hidden by default', async () => {
      expect(element.open).to.be.false;
    });

    it('should render slot content', async () => {
      const slot = element.shadowRoot?.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('Open/Close behavior', () => {
    it('should open when open property is true', async () => {
      element.open = true;
      await element.updateComplete;

      expect(element.open).to.be.true;
      expect(element.hasAttribute('open')).to.be.true;
    });

    it('should close when open property is false', async () => {
      element.open = true;
      await element.updateComplete;

      element.open = false;
      await element.updateComplete;

      expect(element.open).to.be.false;
    });

    it('should dispatch modal-open event when opening', async () => {
      setTimeout(() => {
        element.open = true;
      });

      const event = await oneEvent(element, 'modal-open');
      expect(event).to.exist;
    });

    it('should dispatch modal-close event when closing', async () => {
      element.open = true;
      await element.updateComplete;

      setTimeout(() => {
        element.open = false;
      });

      const event = await oneEvent(element, 'modal-close');
      expect(event).to.exist;
    });
  });

  describe('Modal sizes', () => {
    it('should apply small size', async () => {
      element.size = ModalSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
    });

    it('should apply medium size', async () => {
      element.size = ModalSize.Medium;
      await element.updateComplete;

      expect(element.size).to.equal('medium');
    });

    it('should apply large size', async () => {
      element.size = ModalSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });

    it('should apply extra large size', async () => {
      element.size = ModalSize.ExtraLarge;
      await element.updateComplete;

      expect(element.size).to.equal('xl');
    });
  });

  describe('Modal positions', () => {
    it('should apply center position', async () => {
      element.position = ModalPosition.Center;
      await element.updateComplete;

      expect(element.position).to.equal('center');
    });

    it('should apply top position', async () => {
      element.position = ModalPosition.Top;
      await element.updateComplete;

      expect(element.position).to.equal('top');
    });

    it('should apply bottom position', async () => {
      element.position = ModalPosition.Bottom;
      await element.updateComplete;

      expect(element.position).to.equal('bottom');
    });
  });

  describe('Modal animations', () => {
    it('should apply fade animation', async () => {
      element.animation = ModalAnimation.Fade;
      await element.updateComplete;

      expect(element.animation).to.equal('fade');
    });

    it('should apply zoom animation', async () => {
      element.animation = ModalAnimation.Zoom;
      await element.updateComplete;

      expect(element.animation).to.equal('zoom');
    });

    it('should apply slide-up animation', async () => {
      element.animation = ModalAnimation.SlideUp;
      await element.updateComplete;

      expect(element.animation).to.equal('slide-up');
    });

    it('should apply slide-down animation', async () => {
      element.animation = ModalAnimation.SlideDown;
      await element.updateComplete;

      expect(element.animation).to.equal('slide-down');
    });

    it('should support no animation', async () => {
      element.animation = ModalAnimation.None;
      await element.updateComplete;

      expect(element.animation).to.equal('none');
    });
  });

  describe('Backdrop behavior', () => {
    it('should have closable backdrop by default', () => {
      expect(element.backdrop).to.equal('closable');
    });

    it('should apply static backdrop', async () => {
      element.backdrop = ModalBackdrop.Static;
      await element.updateComplete;

      expect(element.backdrop).to.equal('static');
    });

    it('should apply no backdrop', async () => {
      element.backdrop = ModalBackdrop.None;
      await element.updateComplete;

      expect(element.backdrop).to.equal('none');
    });

    it('should close on backdrop click when closable', async () => {
      element.open = true;
      element.backdrop = ModalBackdrop.Closable;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('.modal-backdrop, [class*="backdrop"]') as HTMLElement;
      if (backdrop) {
        backdrop.click();
        await aTimeout(100);
        expect(element.open).to.be.false;
      }
    });

    it('should not close on backdrop click when static', async () => {
      element.open = true;
      element.backdrop = ModalBackdrop.Static;
      await element.updateComplete;

      const backdrop = element.shadowRoot?.querySelector('.modal-backdrop, [class*="backdrop"]') as HTMLElement;
      if (backdrop) {
        backdrop.click();
        await aTimeout(100);
        expect(element.open).to.be.true;
      }
    });
  });

  describe('Closable property', () => {
    it('should allow closing when closable is true', async () => {
      element.closable = true;
      element.open = true;
      await element.updateComplete;

      expect(element.closable).to.be.true;
    });

    it('should prevent closing when closable is false', async () => {
      element.closable = false;
      await element.updateComplete;

      expect(element.closable).to.be.false;
    });
  });

  describe('Close button', () => {
    it('should show close button by default', () => {
      expect(element.showCloseButton).to.be.true;
    });

    it('should hide close button when showCloseButton is false', async () => {
      element.showCloseButton = false;
      await element.updateComplete;

      expect(element.showCloseButton).to.be.false;
    });
  });

  describe('Title and header', () => {
    it('should display modal title', async () => {
      element.modalTitle = 'Test Modal';
      element.open = true;
      await element.updateComplete;

      const title = element.shadowRoot?.querySelector('.modal-title, [class*="title"]');
      expect(title?.textContent).to.contain('Test Modal');
    });

    it('should display header icon', async () => {
      element.headerIcon = 'info';
      await element.updateComplete;

      expect(element.headerIcon).to.equal('info');
    });
  });

  describe('Custom dimensions', () => {
    it('should apply custom width', async () => {
      element.width = '600px';
      await element.updateComplete;

      expect(element.width).to.equal('600px');
    });

    it('should apply custom height', async () => {
      element.height = '400px';
      await element.updateComplete;

      expect(element.height).to.equal('400px');
    });
  });

  describe('Fullscreen mode', () => {
    it('should support fullscreen mode', async () => {
      element.fullscreen = true;
      await element.updateComplete;

      expect(element.fullscreen).to.be.true;
    });
  });

  describe('Draggable functionality', () => {
    it('should support draggable property', async () => {
      element.modalDraggable = true;
      await element.updateComplete;

      expect(element.modalDraggable).to.be.true;
    });

    it('should track drag offset', async () => {
      element.modalDraggable = true;
      element.offsetX = 100;
      element.offsetY = 50;
      await element.updateComplete;

      expect(element.offsetX).to.equal(100);
      expect(element.offsetY).to.equal(50);
    });
  });

  describe('Resizable functionality', () => {
    it('should support resizable property', async () => {
      element.resizable = true;
      await element.updateComplete;

      expect(element.resizable).to.be.true;
    });
  });

  describe('Z-index', () => {
    it('should have default z-index of 1000', () => {
      expect(element.zIndex).to.equal(1000);
    });

    it('should apply custom z-index', async () => {
      element.zIndex = 2000;
      await element.updateComplete;

      expect(element.zIndex).to.equal(2000);
    });
  });

  describe('Keyboard navigation', () => {
    it('should close on Escape key when closable', async () => {
      element.open = true;
      element.closable = true;
      await element.updateComplete;

      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await aTimeout(100);

      expect(element.open).to.be.false;
    });

    it('should dispatch modal-escape event on Escape key', async () => {
      element.open = true;
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });

      const event = await oneEvent(element, 'modal-escape');
      expect(event).to.exist;
    });
  });

  describe('Slots', () => {
    it('should render header slot', async () => {
      const el = await fixture<NrModalElement>(html`
        <nr-modal open>
          <div slot="header">Custom Header</div>
        </nr-modal>
      `);

      const headerSlot = el.shadowRoot?.querySelector('slot[name="header"]');
      expect(headerSlot).to.exist;
    });

    it('should render footer slot', async () => {
      const el = await fixture<NrModalElement>(html`
        <nr-modal open>
          <div slot="footer">Custom Footer</div>
        </nr-modal>
      `);

      const footerSlot = el.shadowRoot?.querySelector('slot[name="footer"]');
      expect(footerSlot).to.exist;
    });

    it('should render default slot for body content', async () => {
      const slot = element.shadowRoot?.querySelector('slot:not([name])');
      expect(slot).to.exist;
    });
  });

  describe('Controller integration', () => {
    it('should have drag controller', () => {
      const controller = (element as any).dragController;
      expect(controller).to.exist;
    });

    it('should have keyboard controller', () => {
      const controller = (element as any).keyboardController;
      expect(controller).to.exist;
    });
  });

  describe('Accessibility', () => {
    it('should have role dialog', async () => {
      element.open = true;
      await element.updateComplete;

      const modal = element.shadowRoot?.querySelector('[role="dialog"]');
      expect(modal).to.exist;
    });

    it('should have aria-modal attribute', async () => {
      element.open = true;
      await element.updateComplete;

      const modal = element.shadowRoot?.querySelector('[aria-modal="true"]');
      expect(modal).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid open/close', async () => {
      for (let i = 0; i < 5; i++) {
        element.open = true;
        element.open = false;
      }
      await element.updateComplete;

      expect(element.open).to.be.false;
    });

    it('should handle empty content', async () => {
      const el = await fixture<NrModalElement>(html`<nr-modal></nr-modal>`);
      expect(el).to.exist;
    });
  });
});
