/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect } from '@open-wc/testing';
import { NrBadgeElement } from '../badge.component.js';
import {
  BadgeStatus,
  BadgeSize,
  BadgeColor,
  RibbonPlacement
} from '../badge.types.js';

describe('NrBadgeElement', () => {
  let element: NrBadgeElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-badge></nr-badge>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-BADGE');
    });

    it('should have default properties', () => {
      expect(element.dot).to.be.false;
      expect(element.overflowCount).to.equal(99);
      expect(element.showZero).to.be.false;
      expect(element.size).to.equal(BadgeSize.Default);
      expect(element.ribbonPlacement).to.equal(RibbonPlacement.End);
    });

    it('should render badge wrapper', async () => {
      element.count = 5;
      await element.updateComplete;

      const wrapper = element.shadowRoot?.querySelector('.badge-wrapper, .badge-indicator');
      expect(wrapper).to.exist;
    });
  });

  describe('Count badge', () => {
    it('should display count', async () => {
      element.count = 5;
      await element.updateComplete;

      expect(element.count).to.equal(5);
    });

    it('should handle zero count with showZero', async () => {
      element.count = 0;
      element.showZero = true;
      await element.updateComplete;

      expect(element.count).to.equal(0);
      expect(element.showZero).to.be.true;
    });

    it('should hide badge when count is zero without showZero', async () => {
      element.count = 0;
      element.showZero = false;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator');
      expect(indicator?.classList.contains('badge-hidden')).to.be.true;
    });

    it('should handle overflow count', async () => {
      element.count = 150;
      element.overflowCount = 99;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator');
      expect(indicator?.textContent?.trim()).to.equal('99+');
    });

    it('should allow custom overflow count', async () => {
      element.count = 15;
      element.overflowCount = 10;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator');
      expect(indicator?.textContent?.trim()).to.equal('10+');
    });

    it('should display exact count when under overflow', async () => {
      element.count = 50;
      element.overflowCount = 99;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator');
      expect(indicator?.textContent?.trim()).to.equal('50');
    });
  });

  describe('Dot badge', () => {
    it('should support dot mode', async () => {
      element.dot = true;
      await element.updateComplete;

      expect(element.dot).to.be.true;
      const indicator = element.shadowRoot?.querySelector('.badge-indicator.dot');
      expect(indicator).to.exist;
    });

    it('should not show count in dot mode', async () => {
      element.dot = true;
      element.count = 10;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator.dot');
      expect(indicator?.textContent?.trim()).to.equal('');
    });
  });

  describe('Badge sizes', () => {
    it('should apply default size', async () => {
      element.size = BadgeSize.Default;
      element.count = 5;
      await element.updateComplete;

      expect(element.size).to.equal('default');
    });

    it('should apply small size', async () => {
      element.size = BadgeSize.Small;
      element.count = 5;
      await element.updateComplete;

      expect(element.size).to.equal('small');
      const indicator = element.shadowRoot?.querySelector('.badge-indicator.small');
      expect(indicator).to.exist;
    });
  });

  describe('Badge colors', () => {
    it('should apply preset color', async () => {
      element.color = BadgeColor.Red;
      element.count = 5;
      await element.updateComplete;

      expect(element.color).to.equal('red');
    });

    it('should apply pink preset color', async () => {
      element.color = BadgeColor.Pink;
      element.count = 5;
      await element.updateComplete;

      expect(element.color).to.equal('pink');
    });

    it('should apply blue preset color', async () => {
      element.color = BadgeColor.Blue;
      element.count = 5;
      await element.updateComplete;

      expect(element.color).to.equal('blue');
    });

    it('should apply green preset color', async () => {
      element.color = BadgeColor.Green;
      element.count = 5;
      await element.updateComplete;

      expect(element.color).to.equal('green');
    });

    it('should support custom hex color', async () => {
      element.color = '#ff5500';
      element.count = 5;
      await element.updateComplete;

      expect(element.color).to.equal('#ff5500');
    });

    it('should support custom rgb color', async () => {
      element.color = 'rgb(255, 100, 0)';
      element.count = 5;
      await element.updateComplete;

      expect(element.color).to.equal('rgb(255, 100, 0)');
    });
  });

  describe('Status badge', () => {
    it('should render status badge', async () => {
      element.status = BadgeStatus.Success;
      await element.updateComplete;

      expect(element.status).to.equal('success');
      const statusBadge = element.shadowRoot?.querySelector('.badge-status');
      expect(statusBadge).to.exist;
    });

    it('should apply success status', async () => {
      element.status = BadgeStatus.Success;
      await element.updateComplete;

      const statusDot = element.shadowRoot?.querySelector('.badge-status-dot.success');
      expect(statusDot).to.exist;
    });

    it('should apply error status', async () => {
      element.status = BadgeStatus.Error;
      await element.updateComplete;

      const statusDot = element.shadowRoot?.querySelector('.badge-status-dot.error');
      expect(statusDot).to.exist;
    });

    it('should apply warning status', async () => {
      element.status = BadgeStatus.Warning;
      await element.updateComplete;

      const statusDot = element.shadowRoot?.querySelector('.badge-status-dot.warning');
      expect(statusDot).to.exist;
    });

    it('should apply processing status', async () => {
      element.status = BadgeStatus.Processing;
      await element.updateComplete;

      const statusDot = element.shadowRoot?.querySelector('.badge-status-dot.processing');
      expect(statusDot).to.exist;
    });

    it('should apply default status', async () => {
      element.status = BadgeStatus.Default;
      await element.updateComplete;

      const statusDot = element.shadowRoot?.querySelector('.badge-status-dot.default');
      expect(statusDot).to.exist;
    });

    it('should display status text', async () => {
      element.status = BadgeStatus.Success;
      element.text = 'Online';
      await element.updateComplete;

      const statusText = element.shadowRoot?.querySelector('.badge-status-text');
      expect(statusText).to.exist;
      expect(statusText?.textContent).to.equal('Online');
    });
  });

  describe('Ribbon badge', () => {
    it('should render ribbon badge', async () => {
      element.ribbon = 'New';
      await element.updateComplete;

      const ribbonWrapper = element.shadowRoot?.querySelector('.badge-ribbon-wrapper');
      expect(ribbonWrapper).to.exist;
    });

    it('should display ribbon text', async () => {
      element.ribbon = 'Recommended';
      await element.updateComplete;

      const ribbon = element.shadowRoot?.querySelector('.badge-ribbon');
      expect(ribbon?.textContent?.trim()).to.equal('Recommended');
    });

    it('should apply end placement by default', async () => {
      element.ribbon = 'New';
      await element.updateComplete;

      const ribbon = element.shadowRoot?.querySelector('.badge-ribbon.end');
      expect(ribbon).to.exist;
    });

    it('should apply start placement', async () => {
      element.ribbon = 'New';
      element.ribbonPlacement = RibbonPlacement.Start;
      await element.updateComplete;

      const ribbon = element.shadowRoot?.querySelector('.badge-ribbon.start');
      expect(ribbon).to.exist;
    });

    it('should apply ribbon color', async () => {
      element.ribbon = 'Sale';
      element.color = BadgeColor.Red;
      await element.updateComplete;

      const ribbon = element.shadowRoot?.querySelector('.badge-ribbon.red');
      expect(ribbon).to.exist;
    });
  });

  describe('Offset positioning', () => {
    it('should support offset', async () => {
      element.count = 5;
      element.offset = [10, 5];
      await element.updateComplete;

      expect(element.offset).to.deep.equal([10, 5]);
    });
  });

  describe('Badge title', () => {
    it('should support badge title', async () => {
      element.count = 5;
      element.badgeTitle = 'You have 5 new messages';
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator');
      expect(indicator?.getAttribute('title')).to.equal('You have 5 new messages');
    });
  });

  describe('Standalone badge', () => {
    it('should render standalone without children', async () => {
      element.count = 25;
      await element.updateComplete;

      const standalone = element.shadowRoot?.querySelector('.badge-standalone');
      expect(standalone).to.exist;
    });
  });

  describe('Badge with children', () => {
    it('should wrap children', async () => {
      const badgeWithChild = await fixture<NrBadgeElement>(html`
        <nr-badge count="5">
          <button>Notifications</button>
        </nr-badge>
      `);

      const wrapper = badgeWithChild.shadowRoot?.querySelector('.badge-wrapper');
      expect(wrapper).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined count', async () => {
      element.count = undefined;
      await element.updateComplete;

      expect(element.count).to.be.undefined;
    });

    it('should handle negative count', async () => {
      element.count = -5;
      await element.updateComplete;

      // Implementation behavior for negative counts
    });

    it('should handle very large count', async () => {
      element.count = 99999;
      element.overflowCount = 99;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator');
      expect(indicator?.textContent?.trim()).to.equal('99+');
    });

    it('should handle count equal to overflow', async () => {
      element.count = 99;
      element.overflowCount = 99;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator');
      expect(indicator?.textContent?.trim()).to.equal('99');
    });

    it('should handle special characters in text', async () => {
      element.status = BadgeStatus.Success;
      element.text = '<script>alert("xss")</script>';
      await element.updateComplete;

      const statusText = element.shadowRoot?.querySelector('.badge-status-text');
      expect(statusText?.textContent).to.include('alert');
    });

    it('should handle unicode in ribbon', async () => {
      element.ribbon = '推荐 🎉';
      await element.updateComplete;

      const ribbon = element.shadowRoot?.querySelector('.badge-ribbon');
      expect(ribbon?.textContent?.trim()).to.include('推荐');
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure', async () => {
      element.count = 5;
      await element.updateComplete;

      const indicator = element.shadowRoot?.querySelector('.badge-indicator');
      expect(indicator).to.exist;
    });
  });
});
