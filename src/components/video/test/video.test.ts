/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrVideoElement } from '../video.component.js';
import { VideoPreload } from '../video.types.js';

describe('NrVideoElement', () => {
  let element: NrVideoElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-video src="test.mp4"></nr-video>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-VIDEO');
    });

    it('should have default properties', () => {
      expect(element.width).to.equal('auto');
      expect(element.height).to.equal('auto');
      expect(element.autoplay).to.be.false;
      expect(element.loop).to.be.false;
      expect(element.muted).to.be.false;
      expect(element.controls).to.be.true;
      expect(element.preload).to.equal(VideoPreload.Metadata);
      expect(element.previewable).to.be.false;
      expect(element.block).to.be.false;
    });

    it('should render video container', async () => {
      const container = element.shadowRoot?.querySelector('.video-container');
      expect(container).to.exist;
    });

    it('should render video element', async () => {
      const video = element.shadowRoot?.querySelector('video');
      expect(video).to.exist;
    });

    it('should render source element', async () => {
      const source = element.shadowRoot?.querySelector('source');
      expect(source).to.exist;
    });
  });

  describe('Source property', () => {
    it('should accept src attribute', async () => {
      const vid = await fixture<NrVideoElement>(html`
        <nr-video src="video.mp4"></nr-video>
      `);

      expect(vid.src).to.equal('video.mp4');
    });

    it('should update src programmatically', async () => {
      element.src = 'new-video.mp4';
      await element.updateComplete;

      expect(element.src).to.equal('new-video.mp4');
    });

    it('should reflect src in source element', async () => {
      element.src = 'updated.mp4';
      await element.updateComplete;

      const source = element.shadowRoot?.querySelector('source') as HTMLSourceElement;
      expect(source?.src).to.include('updated.mp4');
    });
  });

  describe('Dimensions', () => {
    it('should have default width of auto', () => {
      expect(element.width).to.equal('auto');
    });

    it('should have default height of auto', () => {
      expect(element.height).to.equal('auto');
    });

    it('should accept custom width', async () => {
      element.width = '640px';
      await element.updateComplete;

      expect(element.width).to.equal('640px');
    });

    it('should accept custom height', async () => {
      element.height = '360px';
      await element.updateComplete;

      expect(element.height).to.equal('360px');
    });

    it('should apply dimensions to video element', async () => {
      element.width = '800px';
      element.height = '450px';
      await element.updateComplete;

      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      expect(video?.style.width).to.equal('800px');
      expect(video?.style.height).to.equal('450px');
    });
  });

  describe('Autoplay', () => {
    it('should not autoplay by default', () => {
      expect(element.autoplay).to.be.false;
    });

    it('should accept autoplay attribute', async () => {
      const vid = await fixture<NrVideoElement>(html`
        <nr-video src="test.mp4" autoplay></nr-video>
      `);

      expect(vid.autoplay).to.be.true;
    });

    it('should set autoplay on video element', async () => {
      element.autoplay = true;
      await element.updateComplete;

      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      expect(video?.autoplay).to.be.true;
    });
  });

  describe('Loop', () => {
    it('should not loop by default', () => {
      expect(element.loop).to.be.false;
    });

    it('should accept loop attribute', async () => {
      const vid = await fixture<NrVideoElement>(html`
        <nr-video src="test.mp4" loop></nr-video>
      `);

      expect(vid.loop).to.be.true;
    });

    it('should set loop on video element', async () => {
      element.loop = true;
      await element.updateComplete;

      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      expect(video?.loop).to.be.true;
    });
  });

  describe('Muted', () => {
    it('should not be muted by default', () => {
      expect(element.muted).to.be.false;
    });

    it('should accept muted attribute', async () => {
      const vid = await fixture<NrVideoElement>(html`
        <nr-video src="test.mp4" muted></nr-video>
      `);

      expect(vid.muted).to.be.true;
    });

    it('should set muted on video element', async () => {
      element.muted = true;
      await element.updateComplete;

      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      expect(video?.muted).to.be.true;
    });
  });

  describe('Controls', () => {
    it('should show controls by default', () => {
      expect(element.controls).to.be.true;
    });

    it('should hide controls when disabled', async () => {
      element.controls = false;
      await element.updateComplete;

      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      expect(video?.controls).to.be.false;
    });
  });

  describe('Preload', () => {
    it('should default to metadata preload', () => {
      expect(element.preload).to.equal('metadata');
    });

    it('should accept none preload', async () => {
      element.preload = VideoPreload.None;
      await element.updateComplete;

      expect(element.preload).to.equal('none');
    });

    it('should accept auto preload', async () => {
      element.preload = VideoPreload.Auto;
      await element.updateComplete;

      expect(element.preload).to.equal('auto');
    });

    it('should set preload on video element', async () => {
      element.preload = VideoPreload.Auto;
      await element.updateComplete;

      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      expect(video?.preload).to.equal('auto');
    });
  });

  describe('Poster', () => {
    it('should not have poster by default', () => {
      expect(element.poster).to.be.undefined;
    });

    it('should accept poster attribute', async () => {
      const vid = await fixture<NrVideoElement>(html`
        <nr-video src="test.mp4" poster="thumbnail.jpg"></nr-video>
      `);

      expect(vid.poster).to.equal('thumbnail.jpg');
    });

    it('should set poster on video element', async () => {
      element.poster = 'poster.jpg';
      await element.updateComplete;

      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      expect(video?.poster).to.include('poster.jpg');
    });
  });

  describe('Block mode', () => {
    it('should not be block by default', () => {
      expect(element.block).to.be.false;
    });

    it('should accept block attribute', async () => {
      const vid = await fixture<NrVideoElement>(html`
        <nr-video src="test.mp4" block></nr-video>
      `);

      expect(vid.block).to.be.true;
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
      const vid = await fixture<NrVideoElement>(html`
        <nr-video src="test.mp4" previewable></nr-video>
      `);

      expect(vid.previewable).to.be.true;
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

    it('should autoplay video in preview modal', async () => {
      element.previewable = true;
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button') as HTMLButtonElement;
      previewButton?.click();
      await element.updateComplete;

      const modalVideo = element.shadowRoot?.querySelector('.preview-modal video') as HTMLVideoElement;
      expect(modalVideo?.autoplay).to.be.true;
    });
  });

  describe('Events', () => {
    it('should dispatch nr-video-play event on play', async () => {
      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;

      setTimeout(() => {
        video?.dispatchEvent(new Event('play'));
      });

      const event = await oneEvent(element, 'nr-video-play');
      expect(event).to.exist;
      expect((event as CustomEvent).detail.src).to.equal('test.mp4');
    });

    it('should dispatch nr-video-pause event on pause', async () => {
      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;

      setTimeout(() => {
        video?.dispatchEvent(new Event('pause'));
      });

      const event = await oneEvent(element, 'nr-video-pause');
      expect(event).to.exist;
    });

    it('should dispatch nr-video-ended event on ended', async () => {
      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;

      setTimeout(() => {
        video?.dispatchEvent(new Event('ended'));
      });

      const event = await oneEvent(element, 'nr-video-ended');
      expect(event).to.exist;
    });

    it('should dispatch nr-video-error event on error', async () => {
      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;

      setTimeout(() => {
        video?.dispatchEvent(new Event('error'));
      });

      const event = await oneEvent(element, 'nr-video-error');
      expect(event).to.exist;
    });

    it('should dispatch nr-video-preview-open event', async () => {
      element.previewable = true;
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button') as HTMLButtonElement;

      setTimeout(() => {
        previewButton?.click();
      });

      const event = await oneEvent(element, 'nr-video-preview-open');
      expect(event).to.exist;
    });

    it('should dispatch nr-video-preview-close event', async () => {
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

      const event = await oneEvent(element, 'nr-video-preview-close');
      expect(event).to.exist;
    });
  });

  describe('Error state', () => {
    it('should show error state on load failure', async () => {
      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      video?.dispatchEvent(new Event('error'));
      await element.updateComplete;

      const errorContainer = element.shadowRoot?.querySelector('.video--error');
      expect(errorContainer).to.exist;
    });

    it('should show error message', async () => {
      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      video?.dispatchEvent(new Event('error'));
      await element.updateComplete;

      const errorMessage = element.shadowRoot?.querySelector('.error-message');
      expect(errorMessage).to.exist;
    });

    it('should show error icon', async () => {
      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      video?.dispatchEvent(new Event('error'));
      await element.updateComplete;

      const errorIcon = element.shadowRoot?.querySelector('.error-icon');
      expect(errorIcon).to.exist;
    });

    it('should not show preview button in error state', async () => {
      element.previewable = true;
      await element.updateComplete;

      const video = element.shadowRoot?.querySelector('video') as HTMLVideoElement;
      video?.dispatchEvent(new Event('error'));
      await element.updateComplete;

      const previewButton = element.shadowRoot?.querySelector('.preview-button');
      expect(previewButton).to.not.exist;
    });
  });

  describe('Complex scenarios', () => {
    it('should render with all options', async () => {
      const vid = await fixture<NrVideoElement>(html`
        <nr-video
          src="video.mp4"
          poster="poster.jpg"
          width="640px"
          height="360px"
          autoplay
          loop
          muted
          previewable
        ></nr-video>
      `);

      expect(vid.src).to.equal('video.mp4');
      expect(vid.poster).to.equal('poster.jpg');
      expect(vid.width).to.equal('640px');
      expect(vid.height).to.equal('360px');
      expect(vid.autoplay).to.be.true;
      expect(vid.loop).to.be.true;
      expect(vid.muted).to.be.true;
      expect(vid.previewable).to.be.true;
    });

    it('should handle video without controls', async () => {
      const vid = await fixture<NrVideoElement>(html`
        <nr-video src="video.mp4" .controls=${false}></nr-video>
      `);

      const video = vid.shadowRoot?.querySelector('video') as HTMLVideoElement;
      expect(video?.controls).to.be.false;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty src', async () => {
      element.src = '';
      await element.updateComplete;

      expect(element.src).to.equal('');
    });

    it('should handle special characters in src', async () => {
      element.src = 'video%20with%20spaces.mp4';
      await element.updateComplete;

      expect(element.src).to.include('spaces');
    });

    it('should handle URL with query params', async () => {
      element.src = 'video.mp4?quality=high&start=10';
      await element.updateComplete;

      expect(element.src).to.include('quality=high');
    });

    it('should handle rapid property changes', async () => {
      element.width = '100px';
      element.width = '200px';
      element.width = '300px';
      await element.updateComplete;

      expect(element.width).to.equal('300px');
    });

    it('should handle multiple preload changes', async () => {
      element.preload = VideoPreload.None;
      element.preload = VideoPreload.Auto;
      element.preload = VideoPreload.Metadata;
      await element.updateComplete;

      expect(element.preload).to.equal('metadata');
    });
  });

  describe('Accessibility', () => {
    it('should have proper video structure', async () => {
      const video = element.shadowRoot?.querySelector('video');
      expect(video).to.exist;
    });

    it('should have fallback text for unsupported browsers', async () => {
      const video = element.shadowRoot?.querySelector('video');
      expect(video?.textContent).to.include('browser does not support');
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
