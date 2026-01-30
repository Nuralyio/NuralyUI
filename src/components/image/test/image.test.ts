/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrImageElement } from '../image.component.js';
import { ImageFit } from '../image.types.js';

describe('NrImageElement', () => {
  let element: NrImageElement;

  // Use a valid base64 image for testing
  const testImageSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  beforeEach(async () => {
    element = await fixture(html`
      <nr-image src="${testImageSrc}" alt="Test image"></nr-image>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-IMAGE');
    });

    it('should have default properties', () => {
      expect(element.width).to.equal('auto');
      expect(element.height).to.equal('auto');
      expect(element.previewable).to.be.false;
      expect(element.block).to.be.false;
    });

    it('should render image container', async () => {
      const container = element.shadowRoot?.querySelector('.image-container');
      expect(container).to.exist;
    });

    it('should render img element', async () => {
      const img = element.shadowRoot?.querySelector('img');
      expect(img).to.exist;
    });
  });

  describe('Image source', () => {
    it('should set image src', async () => {
      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.src).to.include('data:image/gif');
    });

    it('should update src when changed', async () => {
      const newSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      element.src = newSrc;
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.src).to.include('data:image/png');
    });
  });

  describe('Alt text', () => {
    it('should set alt attribute', async () => {
      element.alt = 'My custom image';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.alt).to.equal('My custom image');
    });

    it('should handle empty alt', async () => {
      element.alt = '';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.alt).to.equal('');
    });
  });

  describe('Dimensions', () => {
    it('should set custom width', async () => {
      element.width = '200px';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.style.width).to.equal('200px');
    });

    it('should set custom height', async () => {
      element.height = '150px';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.style.height).to.equal('150px');
    });

    it('should handle numeric dimensions', async () => {
      element.width = '100';
      element.height = '100';
      await element.updateComplete;

      // Width and height should be applied
      expect(element.width).to.equal('100');
    });
  });

  describe('Object fit', () => {
    it('should apply cover fit', async () => {
      element.fit = ImageFit.Cover;
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.style.objectFit).to.equal('cover');
    });

    it('should apply contain fit', async () => {
      element.fit = ImageFit.Contain;
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.style.objectFit).to.equal('contain');
    });

    it('should apply fill fit', async () => {
      element.fit = ImageFit.Fill;
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.style.objectFit).to.equal('fill');
    });
  });

  describe('Block mode', () => {
    it('should not be block by default', () => {
      expect(element.block).to.be.false;
    });

    it('should support block mode', async () => {
      element.block = true;
      await element.updateComplete;

      expect(element.block).to.be.true;
      expect(element.getAttribute('block')).to.exist;
    });
  });

  describe('Preview functionality', () => {
    it('should not be previewable by default', () => {
      expect(element.previewable).to.be.false;
    });

    it('should support previewable mode', async () => {
      element.previewable = true;
      await element.updateComplete;

      expect(element.previewable).to.be.true;
      const container = element.shadowRoot?.querySelector('.image--previewable');
      expect(container).to.exist;
    });

    it('should show preview modal on click when previewable', async () => {
      element.previewable = true;
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      img?.click();
      await element.updateComplete;

      const preview = element.shadowRoot?.querySelector('.preview-modal');
      expect(preview).to.exist;
    });

    it('should dispatch nr-image-preview-open event', async () => {
      element.previewable = true;
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;

      setTimeout(() => {
        img?.click();
      });

      const event = await oneEvent(element, 'nr-image-preview-open');
      expect(event).to.exist;
    });

    it('should close preview on click', async () => {
      element.previewable = true;
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      img?.click();
      await element.updateComplete;

      const previewModal = element.shadowRoot?.querySelector('.preview-modal') as HTMLElement;
      previewModal?.click();
      await element.updateComplete;

      const preview = element.shadowRoot?.querySelector('.preview-modal');
      expect(preview).to.not.exist;
    });

    it('should dispatch nr-image-preview-close event', async () => {
      element.previewable = true;
      await element.updateComplete;

      // Open preview
      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      img?.click();
      await element.updateComplete;

      setTimeout(() => {
        const previewModal = element.shadowRoot?.querySelector('.preview-modal') as HTMLElement;
        previewModal?.click();
      });

      const event = await oneEvent(element, 'nr-image-preview-close');
      expect(event).to.exist;
    });
  });

  describe('Fallback handling', () => {
    it('should support fallback image', async () => {
      element.fallback = testImageSrc;
      await element.updateComplete;

      expect(element.fallback).to.equal(testImageSrc);
    });
  });

  describe('Load events', () => {
    it('should dispatch nr-image-load event on successful load', async () => {
      const newElement = await fixture<NrImageElement>(html`
        <nr-image src="${testImageSrc}" alt="Test"></nr-image>
      `);

      setTimeout(() => {
        const img = newElement.shadowRoot?.querySelector('img') as HTMLImageElement;
        img?.dispatchEvent(new Event('load'));
      });

      const event = await oneEvent(newElement, 'nr-image-load');
      expect(event).to.exist;
    });
  });

  describe('Error handling', () => {
    it('should dispatch nr-image-error event on error', async () => {
      setTimeout(() => {
        const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
        img?.dispatchEvent(new Event('error'));
      });

      const event = await oneEvent(element, 'nr-image-error');
      expect(event).to.exist;
    });

    it('should add error class on error', async () => {
      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      img?.dispatchEvent(new Event('error'));
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.image--error');
      expect(container).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle missing src gracefully', async () => {
      const imageWithoutSrc = await fixture<NrImageElement>(html`
        <nr-image alt="No source"></nr-image>
      `);

      expect(imageWithoutSrc).to.exist;
    });

    it('should handle special characters in alt', async () => {
      element.alt = '<script>alert("xss")</script>';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.alt).to.include('alert');
    });

    it('should handle unicode in alt', async () => {
      element.alt = '图片描述 🖼️';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.alt).to.include('图片描述');
    });

    it('should handle rapid property changes', async () => {
      element.width = '100px';
      element.height = '100px';
      element.width = '200px';
      element.height = '200px';
      await element.updateComplete;

      expect(element.width).to.equal('200px');
      expect(element.height).to.equal('200px');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt attribute', async () => {
      element.alt = 'Accessible image';
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      expect(img.alt).to.equal('Accessible image');
    });

    it('should have close button with aria-label in preview', async () => {
      element.previewable = true;
      await element.updateComplete;

      const img = element.shadowRoot?.querySelector('img') as HTMLImageElement;
      img?.click();
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.preview-close');
      expect(closeButton?.getAttribute('aria-label')).to.equal('Close preview');
    });
  });
});
