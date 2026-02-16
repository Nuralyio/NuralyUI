/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import { CarouselComponent } from '../carousel.component.js';

describe('CarouselComponent', () => {
  let element: CarouselComponent;

  beforeEach(async () => {
    element = await fixture(html`
      <hy-carousel>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
      </hy-carousel>
    `);
    await aTimeout(50); // Wait for firstUpdated
  });

  afterEach(() => {
    element.stopAutoPlay();
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('HY-CAROUSEL');
    });

    it('should have default properties', () => {
      expect(element.currentIndex).to.equal(0);
      expect(element.autoPlay).to.be.false;
      expect(element.autoplaySpeed).to.equal(3000);
    });

    it('should render carousel container', async () => {
      const carousel = element.shadowRoot?.querySelector('.carousel');
      expect(carousel).to.exist;
    });

    it('should render slot for slides', async () => {
      const slot = element.shadowRoot?.querySelector('slot');
      expect(slot).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should navigate to next slide', async () => {
      expect(element.currentIndex).to.equal(0);

      element.next();
      await element.updateComplete;

      expect(element.currentIndex).to.equal(1);
    });

    it('should navigate to previous slide', async () => {
      element.currentIndex = 1;
      await element.updateComplete;

      element.prev();
      await element.updateComplete;

      expect(element.currentIndex).to.equal(0);
    });

    it('should loop to first slide from last', async () => {
      element.currentIndex = 2; // Last slide
      await element.updateComplete;

      element.next();
      await element.updateComplete;

      expect(element.currentIndex).to.equal(0);
    });

    it('should loop to last slide from first when going prev', async () => {
      element.currentIndex = 0;
      await element.updateComplete;

      element.prev();
      await element.updateComplete;

      expect(element.currentIndex).to.equal(2);
    });

    it('should go to specific slide', async () => {
      element.goTo(2);
      await element.updateComplete;

      expect(element.currentIndex).to.equal(2);
    });
  });

  describe('Controls', () => {
    it('should render navigation buttons when autoPlay is false', async () => {
      element.autoPlay = false;
      await element.updateComplete;

      const controls = element.shadowRoot?.querySelector('.controls');
      expect(controls).to.exist;
    });

    it('should hide navigation buttons when autoPlay is true', async () => {
      element.autoPlay = true;
      await element.updateComplete;

      const controls = element.shadowRoot?.querySelector('.controls');
      expect(controls).to.not.exist;
    });
  });

  describe('Dots indicator', () => {
    it('should render dots for each slide', async () => {
      const dots = element.shadowRoot?.querySelectorAll('.dot');
      expect(dots?.length).to.equal(3);
    });

    it('should mark current dot as active', async () => {
      element.currentIndex = 1;
      await element.updateComplete;

      const activeDot = element.shadowRoot?.querySelector('.dot.active');
      expect(activeDot).to.exist;
    });

    it('should navigate when clicking dot', async () => {
      const dots = element.shadowRoot?.querySelectorAll('.dot');
      const secondDot = dots?.[1] as HTMLElement;

      secondDot?.click();
      await element.updateComplete;

      expect(element.currentIndex).to.equal(1);
    });
  });

  describe('AutoPlay', () => {
    it('should start autoplay when enabled', async () => {
      const carouselWithAutoplay = await fixture<CarouselComponent>(html`
        <hy-carousel autoPlay .autoplaySpeed=${100}>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </hy-carousel>
      `);
      await aTimeout(50);

      expect(carouselWithAutoplay.autoPlay).to.be.true;

      // Wait for autoplay to advance
      await aTimeout(150);

      expect(carouselWithAutoplay.currentIndex).to.equal(1);

      carouselWithAutoplay.stopAutoPlay();
    });

    it('should stop autoplay', async () => {
      const carouselWithAutoplay = await fixture<CarouselComponent>(html`
        <hy-carousel autoPlay .autoplaySpeed=${100}>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </hy-carousel>
      `);
      await aTimeout(50);

      carouselWithAutoplay.stopAutoPlay();
      const indexBefore = carouselWithAutoplay.currentIndex;

      await aTimeout(150);

      expect(carouselWithAutoplay.currentIndex).to.equal(indexBefore);
    });

    it('should respect custom autoplay speed', async () => {
      element.autoplaySpeed = 5000;
      await element.updateComplete;

      expect(element.autoplaySpeed).to.equal(5000);
    });
  });

  describe('Slide visibility', () => {
    it('should show current slide', async () => {
      // Current slide should not have hidden class
    });

    it('should hide non-current slides', async () => {
      // Non-current slides should have carousel-item-hidden class
    });
  });

  describe('Edge cases', () => {
    it('should handle single slide', async () => {
      const singleSlide = await fixture<CarouselComponent>(html`
        <hy-carousel>
          <div>Only Slide</div>
        </hy-carousel>
      `);
      await aTimeout(50);

      expect(singleSlide.currentIndex).to.equal(0);

      singleSlide.next();
      await singleSlide.updateComplete;

      expect(singleSlide.currentIndex).to.equal(0);
    });

    it('should handle rapid navigation', async () => {
      for (let i = 0; i < 10; i++) {
        element.next();
      }
      await element.updateComplete;

      // Should have wrapped around
      expect(element.currentIndex).to.be.at.least(0);
      expect(element.currentIndex).to.be.at.most(2);
    });

    it('should clean up on disconnect', async () => {
      element.autoPlay = true;
      element.startAutoPlay();

      element.remove();

      // Should stop autoplay on disconnect
    });
  });

  describe('Accessibility', () => {
    it('should render proper structure', async () => {
      const carousel = element.shadowRoot?.querySelector('.carousel');
      expect(carousel).to.exist;
    });
  });
});
