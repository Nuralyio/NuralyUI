/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrDocumentElement } from '../document.component.js';
import { DocumentType } from '../document.types.js';

describe('NrDocumentElement', () => {
  let element: NrDocumentElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-document src="test.pdf"></nr-document>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-DOCUMENT');
    });

    it('should have default properties', () => {
      expect(element.type).to.equal(DocumentType.PDF);
      expect(element.width).to.equal('auto');
      expect(element.height).to.equal('500px');
      expect(element.previewable).to.be.false;
      expect(element.block).to.be.false;
    });

    it('should render document container', async () => {
      const container = element.shadowRoot?.querySelector('.document-container');
      expect(container).to.exist;
    });

    it('should render iframe for document', async () => {
      const iframe = element.shadowRoot?.querySelector('iframe.document-iframe');
      expect(iframe).to.exist;
    });

    it('should set iframe src', async () => {
      const iframe = element.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;
      expect(iframe?.src).to.include('test.pdf');
    });
  });

  describe('Source property', () => {
    it('should accept src attribute', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="document.pdf"></nr-document>
      `);

      expect(doc.src).to.equal('document.pdf');
    });

    it('should update src programmatically', async () => {
      element.src = 'new-document.pdf';
      await element.updateComplete;

      expect(element.src).to.equal('new-document.pdf');
    });

    it('should reflect src in iframe', async () => {
      element.src = 'updated.pdf';
      await element.updateComplete;

      const iframe = element.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;
      expect(iframe?.src).to.include('updated.pdf');
    });
  });

  describe('Document type', () => {
    it('should default to PDF type', () => {
      expect(element.type).to.equal('pdf');
    });

    it('should accept image type', async () => {
      element.type = DocumentType.Image;
      await element.updateComplete;

      expect(element.type).to.equal('image');
    });

    it('should accept other type', async () => {
      element.type = DocumentType.Other;
      await element.updateComplete;

      expect(element.type).to.equal('other');
    });
  });

  describe('Dimensions', () => {
    it('should have default width of auto', () => {
      expect(element.width).to.equal('auto');
    });

    it('should have default height of 500px', () => {
      expect(element.height).to.equal('500px');
    });

    it('should accept custom width', async () => {
      element.width = '800px';
      await element.updateComplete;

      expect(element.width).to.equal('800px');
    });

    it('should accept custom height', async () => {
      element.height = '600px';
      await element.updateComplete;

      expect(element.height).to.equal('600px');
    });

    it('should accept numeric width', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="test.pdf" width="500"></nr-document>
      `);

      expect(doc.width).to.equal('500');
    });

    it('should apply dimensions to container', async () => {
      element.width = '400px';
      element.height = '300px';
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.document-container') as HTMLElement;
      expect(container?.style.width).to.equal('400px');
      expect(container?.style.height).to.equal('300px');
    });
  });

  describe('Block mode', () => {
    it('should not be block by default', () => {
      expect(element.block).to.be.false;
    });

    it('should accept block attribute', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="test.pdf" block></nr-document>
      `);

      expect(doc.block).to.be.true;
    });

    it('should reflect block attribute', async () => {
      element.block = true;
      await element.updateComplete;

      expect(element.hasAttribute('block')).to.be.true;
    });
  });

  describe('Preview functionality', () => {
    it('should not be previewable by default', () => {
      expect(element.previewable).to.be.false;
    });

    it('should accept previewable attribute', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="test.pdf" previewable></nr-document>
      `);

      expect(doc.previewable).to.be.true;
    });

    it('should show preview button when previewable', async () => {
      element.previewable = true;
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button');
      expect(previewButton).to.exist;
    });

    it('should not show preview button when not previewable', async () => {
      element.previewable = false;
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button');
      expect(previewButton).to.not.exist;
    });

    it('should show preview modal when button clicked', async () => {
      element.previewable = true;
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button') as HTMLButtonElement;
      previewButton?.click();
      await element.updateComplete;

      const modal = element.shadowRoot?.querySelector('.preview-modal');
      expect(modal).to.exist;
    });

    it('should close preview modal when close button clicked', async () => {
      element.previewable = true;
      await element.updateComplete;

      // Open modal
      const previewButton = element.shadowRoot?.querySelector('.preview-button') as HTMLButtonElement;
      previewButton?.click();
      await element.updateComplete;

      // Close modal
      const closeButton = element.shadowRoot?.querySelector('.preview-close') as HTMLButtonElement;
      closeButton?.click();
      await element.updateComplete;

      const modal = element.shadowRoot?.querySelector('.preview-modal');
      expect(modal).to.not.exist;
    });
  });

  describe('Events', () => {
    it('should dispatch nr-document-load event on load', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="test.pdf"></nr-document>
      `);

      const iframe = doc.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;

      setTimeout(() => {
        iframe?.dispatchEvent(new Event('load'));
      });

      const event = await oneEvent(doc, 'nr-document-load');
      expect(event).to.exist;
      expect((event as CustomEvent).detail.src).to.equal('test.pdf');
    });

    it('should dispatch nr-document-error event on error', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="invalid.pdf"></nr-document>
      `);

      const iframe = doc.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;

      setTimeout(() => {
        iframe?.dispatchEvent(new Event('error'));
      });

      const event = await oneEvent(doc, 'nr-document-error');
      expect(event).to.exist;
      expect((event as CustomEvent).detail.src).to.equal('invalid.pdf');
    });

    it('should dispatch nr-document-preview-open event', async () => {
      element.previewable = true;
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button') as HTMLButtonElement;

      setTimeout(() => {
        previewButton?.click();
      });

      const event = await oneEvent(element, 'nr-document-preview-open');
      expect(event).to.exist;
    });

    it('should dispatch nr-document-preview-close event', async () => {
      element.previewable = true;
      await element.updateComplete;

      // Open modal first
      const previewButton = element.shadowRoot?.querySelector('.preview-button') as HTMLButtonElement;
      previewButton?.click();
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.preview-close') as HTMLButtonElement;

      setTimeout(() => {
        closeButton?.click();
      });

      const event = await oneEvent(element, 'nr-document-preview-close');
      expect(event).to.exist;
    });
  });

  describe('Error state', () => {
    it('should show error state on load failure', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="invalid.pdf"></nr-document>
      `);

      const iframe = doc.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;
      iframe?.dispatchEvent(new Event('error'));
      await doc.updateComplete;

      const errorContainer = doc.shadowRoot?.querySelector('.document--error');
      expect(errorContainer).to.exist;
    });

    it('should show error message', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="invalid.pdf"></nr-document>
      `);

      const iframe = doc.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;
      iframe?.dispatchEvent(new Event('error'));
      await doc.updateComplete;

      const errorMessage = doc.shadowRoot?.querySelector('.error-message');
      expect(errorMessage).to.exist;
    });

    it('should show error icon', async () => {
      const doc = await fixture<NrDocumentElement>(html`
        <nr-document src="invalid.pdf"></nr-document>
      `);

      const iframe = doc.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;
      iframe?.dispatchEvent(new Event('error'));
      await doc.updateComplete;

      const errorIcon = doc.shadowRoot?.querySelector('.error-icon');
      expect(errorIcon).to.exist;
    });

    it('should not show preview button in error state', async () => {
      element.previewable = true;
      await element.updateComplete;

      const iframe = element.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;
      iframe?.dispatchEvent(new Event('error'));
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button');
      expect(previewButton).to.not.exist;
    });
  });

  describe('Iframe attributes', () => {
    it('should have title attribute for accessibility', async () => {
      const iframe = element.shadowRoot?.querySelector('iframe') as HTMLIFrameElement;
      expect(iframe?.title).to.equal('Document viewer');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty src', async () => {
      element.src = '';
      await element.updateComplete;

      expect(element.src).to.equal('');
    });

    it('should handle special characters in src', async () => {
      element.src = 'document%20with%20spaces.pdf';
      await element.updateComplete;

      expect(element.src).to.include('spaces');
    });

    it('should handle URL with query params', async () => {
      element.src = 'document.pdf?page=1&zoom=100';
      await element.updateComplete;

      expect(element.src).to.include('page=1');
    });

    it('should handle rapid property changes', async () => {
      element.width = '100px';
      element.width = '200px';
      element.width = '300px';
      await element.updateComplete;

      expect(element.width).to.equal('300px');
    });
  });

  describe('Accessibility', () => {
    it('should have proper iframe structure', async () => {
      const iframe = element.shadowRoot?.querySelector('iframe');
      expect(iframe).to.exist;
      expect(iframe?.title).to.exist;
    });

    it('should have accessible close button in preview', async () => {
      element.previewable = true;
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button') as HTMLButtonElement;
      previewButton?.click();
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.preview-close');
      expect(closeButton?.getAttribute('aria-label')).to.equal('Close preview');
    });
  });
});
