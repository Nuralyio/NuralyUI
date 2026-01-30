/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { NrSkeletonElement } from '../skeleton.component.js';
import {
  SkeletonShape,
  SkeletonSize,
  SkeletonElementType
} from '../skeleton.types.js';

describe('NrSkeletonElement', () => {
  let element: NrSkeletonElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-skeleton></nr-skeleton>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-SKELETON');
    });

    it('should have default properties', () => {
      expect(element.active).to.be.false;
      expect(element.avatar).to.be.false;
      expect(element.loading).to.be.true;
      expect(element.paragraph).to.be.true;
      expect(element.round).to.be.false;
      expect(element.showTitle).to.be.true;
      expect(element.block).to.be.false;
      expect(element.shape).to.equal(SkeletonShape.Default);
      expect(element.size).to.equal(SkeletonSize.Default);
    });

    it('should render skeleton container', async () => {
      const skeleton = element.shadowRoot?.querySelector('.skeleton');
      expect(skeleton).to.exist;
    });
  });

  describe('Loading state', () => {
    it('should show skeleton when loading is true', async () => {
      element.loading = true;
      await element.updateComplete;

      const skeleton = element.shadowRoot?.querySelector('.skeleton');
      expect(skeleton).to.exist;
    });

    it('should show content when loading is false', async () => {
      element.loading = false;
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector('.skeleton-wrapper');
      expect(wrapper).to.exist;

      const skeleton = element.shadowRoot?.querySelector('.skeleton');
      expect(skeleton).to.not.exist;
    });

    it('should render slotted content when not loading', async () => {
      const skeletonWithContent = await fixture<NrSkeletonElement>(html`
        <nr-skeleton .loading=${false}>
          <div slot="content">Actual content</div>
        </nr-skeleton>
      `);

      const contentSlot = skeletonWithContent.shadowRoot?.querySelector('slot[name="content"]');
      expect(contentSlot).to.exist;
    });
  });

  describe('Active animation', () => {
    it('should not have active animation by default', async () => {
      const skeleton = element.shadowRoot?.querySelector('.skeleton--active');
      expect(skeleton).to.not.exist;
    });

    it('should apply active animation', async () => {
      element.active = true;
      await element.updateComplete;

      const skeleton = element.shadowRoot?.querySelector('.skeleton--active');
      expect(skeleton).to.exist;
    });
  });

  describe('Title skeleton', () => {
    it('should render title by default', async () => {
      const title = element.shadowRoot?.querySelector('.skeleton-title');
      expect(title).to.exist;
    });

    it('should hide title when showTitle is false', async () => {
      element.showTitle = false;
      await element.updateComplete;

      const title = element.shadowRoot?.querySelector('.skeleton-title');
      expect(title).to.not.exist;
    });

    it('should apply custom title width', async () => {
      element.titleConfig = { width: '50%' };
      await element.updateComplete;

      const title = element.shadowRoot?.querySelector('.skeleton-title') as HTMLElement;
      expect(title?.style.width).to.equal('50%');
    });

    it('should apply round style to title', async () => {
      element.round = true;
      await element.updateComplete;

      const title = element.shadowRoot?.querySelector('.skeleton-title--round');
      expect(title).to.exist;
    });
  });

  describe('Paragraph skeleton', () => {
    it('should render paragraph by default', async () => {
      const paragraph = element.shadowRoot?.querySelector('.skeleton-paragraph');
      expect(paragraph).to.exist;
    });

    it('should hide paragraph when paragraph is false', async () => {
      element.paragraph = false;
      await element.updateComplete;

      const paragraph = element.shadowRoot?.querySelector('.skeleton-paragraph');
      expect(paragraph).to.not.exist;
    });

    it('should render default 3 rows', async () => {
      const lines = element.shadowRoot?.querySelectorAll('.skeleton-paragraph-line');
      expect(lines?.length).to.equal(3);
    });

    it('should apply custom row count', async () => {
      element.paragraphConfig = { rows: 5 };
      await element.updateComplete;

      const lines = element.shadowRoot?.querySelectorAll('.skeleton-paragraph-line');
      expect(lines?.length).to.equal(5);
    });

    it('should apply round style to paragraph lines', async () => {
      element.round = true;
      await element.updateComplete;

      const roundLines = element.shadowRoot?.querySelectorAll('.skeleton-paragraph-line--round');
      expect(roundLines?.length).to.be.greaterThan(0);
    });
  });

  describe('Avatar skeleton', () => {
    it('should not render avatar by default', async () => {
      const avatar = element.shadowRoot?.querySelector('.skeleton-avatar');
      expect(avatar).to.not.exist;
    });

    it('should render avatar when enabled', async () => {
      element.avatar = true;
      await element.updateComplete;

      const avatar = element.shadowRoot?.querySelector('.skeleton-avatar');
      expect(avatar).to.exist;
    });

    it('should apply circle shape to avatar', async () => {
      element.avatar = true;
      element.avatarConfig = { shape: SkeletonShape.Circle };
      await element.updateComplete;

      const avatar = element.shadowRoot?.querySelector('.skeleton-avatar--circle');
      expect(avatar).to.exist;
    });

    it('should apply square shape to avatar', async () => {
      element.avatar = true;
      element.avatarConfig = { shape: SkeletonShape.Square };
      await element.updateComplete;

      const avatar = element.shadowRoot?.querySelector('.skeleton-avatar--square');
      expect(avatar).to.exist;
    });

    it('should apply avatar size', async () => {
      element.avatar = true;
      element.avatarConfig = { size: SkeletonSize.Large };
      await element.updateComplete;

      const avatar = element.shadowRoot?.querySelector('.skeleton-avatar--large');
      expect(avatar).to.exist;
    });
  });

  describe('Standalone button element', () => {
    it('should render button skeleton', async () => {
      element.element = SkeletonElementType.Button;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('.skeleton-button');
      expect(button).to.exist;
    });

    it('should apply button size', async () => {
      element.element = SkeletonElementType.Button;
      element.size = SkeletonSize.Large;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('.skeleton-button--large');
      expect(button).to.exist;
    });

    it('should apply button shape', async () => {
      element.element = SkeletonElementType.Button;
      element.shape = SkeletonShape.Round;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('.skeleton-button--round');
      expect(button).to.exist;
    });

    it('should apply block style to button', async () => {
      element.element = SkeletonElementType.Button;
      element.block = true;
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector('.skeleton-button--block');
      expect(button).to.exist;
    });
  });

  describe('Standalone input element', () => {
    it('should render input skeleton', async () => {
      element.element = SkeletonElementType.Input;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('.skeleton-input');
      expect(input).to.exist;
    });

    it('should apply input size', async () => {
      element.element = SkeletonElementType.Input;
      element.size = SkeletonSize.Small;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('.skeleton-input--small');
      expect(input).to.exist;
    });

    it('should apply block style to input', async () => {
      element.element = SkeletonElementType.Input;
      element.block = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('.skeleton-input--block');
      expect(input).to.exist;
    });
  });

  describe('Standalone image element', () => {
    it('should render image skeleton', async () => {
      element.element = SkeletonElementType.Image;
      await element.updateComplete;

      const image = element.shadowRoot?.querySelector('.skeleton-image');
      expect(image).to.exist;
    });

    it('should render image icon placeholder', async () => {
      element.element = SkeletonElementType.Image;
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector('.skeleton-image-icon');
      expect(icon).to.exist;
    });
  });

  describe('Standalone avatar element', () => {
    it('should render avatar as standalone element', async () => {
      element.element = SkeletonElementType.Avatar;
      await element.updateComplete;

      const avatar = element.shadowRoot?.querySelector('.skeleton-avatar');
      expect(avatar).to.exist;
    });
  });

  describe('Size variants', () => {
    it('should apply small size', async () => {
      element.size = SkeletonSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
    });

    it('should apply default size', async () => {
      element.size = SkeletonSize.Default;
      await element.updateComplete;

      expect(element.size).to.equal('default');
    });

    it('should apply large size', async () => {
      element.size = SkeletonSize.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Shape variants', () => {
    it('should apply circle shape', async () => {
      element.shape = SkeletonShape.Circle;
      await element.updateComplete;

      expect(element.shape).to.equal('circle');
    });

    it('should apply square shape', async () => {
      element.shape = SkeletonShape.Square;
      await element.updateComplete;

      expect(element.shape).to.equal('square');
    });

    it('should apply round shape', async () => {
      element.shape = SkeletonShape.Round;
      await element.updateComplete;

      expect(element.shape).to.equal('round');
    });
  });

  describe('Complex skeleton', () => {
    it('should render skeleton with avatar and content', async () => {
      element.avatar = true;
      element.showTitle = true;
      element.paragraph = true;
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.skeleton-header');
      expect(header).to.exist;

      const avatar = element.shadowRoot?.querySelector('.skeleton-avatar');
      expect(avatar).to.exist;

      const content = element.shadowRoot?.querySelector('.skeleton-content');
      expect(content).to.exist;
    });

    it('should render content without avatar', async () => {
      element.avatar = false;
      element.showTitle = true;
      element.paragraph = true;
      await element.updateComplete;

      const content = element.shadowRoot?.querySelector('.skeleton-content');
      expect(content).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid loading state changes', async () => {
      element.loading = true;
      element.loading = false;
      element.loading = true;
      await element.updateComplete;

      expect(element.loading).to.be.true;
    });

    it('should handle all elements disabled', async () => {
      element.avatar = false;
      element.showTitle = false;
      element.paragraph = false;
      await element.updateComplete;

      // Should still render skeleton container
      const skeleton = element.shadowRoot?.querySelector('.skeleton');
      expect(skeleton).to.exist;
    });

    it('should handle custom paragraph widths', async () => {
      element.paragraphConfig = { rows: 3, width: ['100%', '80%', '60%'] };
      await element.updateComplete;

      const lines = element.shadowRoot?.querySelectorAll('.skeleton-paragraph-line');
      expect(lines?.length).to.equal(3);
    });

    it('should handle numeric avatar size', async () => {
      element.avatar = true;
      element.avatarConfig = { size: 64 };
      await element.updateComplete;

      const avatar = element.shadowRoot?.querySelector('.skeleton-avatar') as HTMLElement;
      expect(avatar?.style.width).to.equal('64px');
    });
  });

  describe('Accessibility', () => {
    it('should render proper skeleton structure', async () => {
      const skeleton = element.shadowRoot?.querySelector('.skeleton');
      expect(skeleton).to.exist;
    });
  });
});
