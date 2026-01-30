/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrTagElement } from '../tag.component.js';
import { TagPresetColor, TagSize } from '../tag.types.js';

describe('NrTagElement', () => {
  let element: NrTagElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-tag>Default Tag</nr-tag>`);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-TAG');
    });

    it('should have default properties', () => {
      expect(element.bordered).to.be.true;
      expect(element.size).to.equal(TagSize.Default);
      expect(element.closable).to.be.false;
      expect(element.checkable).to.be.false;
      expect(element.checked).to.be.false;
      expect(element.disabled).to.be.false;
    });

    it('should render tag element', async () => {
      const tag = element.shadowRoot?.querySelector('.tag');
      expect(tag).to.exist;
    });

    it('should render content', async () => {
      const content = element.shadowRoot?.querySelector('.tag__content');
      expect(content).to.exist;
    });
  });

  describe('Tag sizes', () => {
    it('should apply default size', async () => {
      element.size = TagSize.Default;
      await element.updateComplete;

      expect(element.size).to.equal('default');
      const tag = element.shadowRoot?.querySelector('.tag--small');
      expect(tag).to.not.exist;
    });

    it('should apply small size', async () => {
      element.size = TagSize.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
      const tag = element.shadowRoot?.querySelector('.tag--small');
      expect(tag).to.exist;
    });
  });

  describe('Bordered style', () => {
    it('should have border by default', async () => {
      expect(element.bordered).to.be.true;
      const tag = element.shadowRoot?.querySelector('.tag--borderless');
      expect(tag).to.not.exist;
    });

    it('should support borderless style', async () => {
      element.bordered = false;
      await element.updateComplete;

      expect(element.bordered).to.be.false;
      const tag = element.shadowRoot?.querySelector('.tag--borderless');
      expect(tag).to.exist;
    });
  });

  describe('Preset colors', () => {
    it('should apply magenta color', async () => {
      element.color = TagPresetColor.Magenta;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--magenta');
      expect(tag).to.exist;
    });

    it('should apply red color', async () => {
      element.color = TagPresetColor.Red;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--red');
      expect(tag).to.exist;
    });

    it('should apply volcano color', async () => {
      element.color = TagPresetColor.Volcano;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--volcano');
      expect(tag).to.exist;
    });

    it('should apply orange color', async () => {
      element.color = TagPresetColor.Orange;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--orange');
      expect(tag).to.exist;
    });

    it('should apply gold color', async () => {
      element.color = TagPresetColor.Gold;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--gold');
      expect(tag).to.exist;
    });

    it('should apply lime color', async () => {
      element.color = TagPresetColor.Lime;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--lime');
      expect(tag).to.exist;
    });

    it('should apply green color', async () => {
      element.color = TagPresetColor.Green;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--green');
      expect(tag).to.exist;
    });

    it('should apply cyan color', async () => {
      element.color = TagPresetColor.Cyan;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--cyan');
      expect(tag).to.exist;
    });

    it('should apply blue color', async () => {
      element.color = TagPresetColor.Blue;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--blue');
      expect(tag).to.exist;
    });

    it('should apply geekblue color', async () => {
      element.color = TagPresetColor.Geekblue;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--geekblue');
      expect(tag).to.exist;
    });

    it('should apply purple color', async () => {
      element.color = TagPresetColor.Purple;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--purple');
      expect(tag).to.exist;
    });
  });

  describe('Custom colors', () => {
    it('should support custom hex color', async () => {
      element.color = '#ff5500';
      await element.updateComplete;

      expect(element.color).to.equal('#ff5500');
      const tag = element.shadowRoot?.querySelector('.tag--custom');
      expect(tag).to.exist;
    });

    it('should support custom rgb color', async () => {
      element.color = 'rgb(255, 100, 50)';
      await element.updateComplete;

      expect(element.color).to.equal('rgb(255, 100, 50)');
    });
  });

  describe('Closable tag', () => {
    it('should support closable mode', async () => {
      element.closable = true;
      await element.updateComplete;

      expect(element.closable).to.be.true;
      const tag = element.shadowRoot?.querySelector('.tag--closable');
      expect(tag).to.exist;
    });

    it('should render close button', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.tag__close');
      expect(closeButton).to.exist;
    });

    it('should dispatch nr-tag-close event on close click', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.tag__close') as HTMLButtonElement;

      setTimeout(() => {
        closeButton?.click();
      });

      const event = await oneEvent(element, 'nr-tag-close');
      expect(event).to.exist;
    });

    it('should not dispatch close event when disabled', async () => {
      element.closable = true;
      element.disabled = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.tag__close') as HTMLButtonElement;
      expect(closeButton?.disabled).to.be.true;
    });
  });

  describe('Checkable tag', () => {
    it('should support checkable mode', async () => {
      element.checkable = true;
      await element.updateComplete;

      expect(element.checkable).to.be.true;
      const tag = element.shadowRoot?.querySelector('.tag--checkable');
      expect(tag).to.exist;
    });

    it('should toggle checked state on click', async () => {
      element.checkable = true;
      await element.updateComplete;

      expect(element.checked).to.be.false;

      const tag = element.shadowRoot?.querySelector('.tag') as HTMLElement;
      tag?.click();
      await element.updateComplete;

      expect(element.checked).to.be.true;
    });

    it('should dispatch nr-tag-checked-change event', async () => {
      element.checkable = true;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag') as HTMLElement;

      setTimeout(() => {
        tag?.click();
      });

      const event = await oneEvent(element, 'nr-tag-checked-change');
      expect(event).to.exist;
      expect((event as CustomEvent).detail.checked).to.be.true;
    });

    it('should apply checked class when checked', async () => {
      element.checkable = true;
      element.checked = true;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag--checked');
      expect(tag).to.exist;
    });

    it('should not toggle when disabled', async () => {
      element.checkable = true;
      element.disabled = true;
      await element.updateComplete;

      const initialChecked = element.checked;
      const tag = element.shadowRoot?.querySelector('.tag') as HTMLElement;
      tag?.click();
      await element.updateComplete;

      expect(element.checked).to.equal(initialChecked);
    });
  });

  describe('Disabled state', () => {
    it('should support disabled state', async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).to.be.true;
      const tag = element.shadowRoot?.querySelector('.tag--disabled');
      expect(tag).to.exist;
    });

    it('should have aria-disabled when disabled', async () => {
      element.disabled = true;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag');
      expect(tag?.getAttribute('aria-disabled')).to.equal('true');
    });
  });

  describe('Icon slot', () => {
    it('should render icon slot when provided', async () => {
      const tagWithIcon = await fixture<NrTagElement>(html`
        <nr-tag>
          <span slot="icon">🏷️</span>
          Tagged Item
        </nr-tag>
      `);

      const iconSlot = tagWithIcon.shadowRoot?.querySelector('.tag__icon');
      expect(iconSlot).to.exist;
    });

    it('should not render icon wrapper when no icon', async () => {
      const iconWrapper = element.shadowRoot?.querySelector('.tag__icon');
      expect(iconWrapper).to.not.exist;
    });
  });

  describe('Accessibility', () => {
    it('should have role="button" by default', async () => {
      const tag = element.shadowRoot?.querySelector('.tag');
      expect(tag?.getAttribute('role')).to.equal('button');
    });

    it('should have role="switch" when checkable', async () => {
      element.checkable = true;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag');
      expect(tag?.getAttribute('role')).to.equal('switch');
    });

    it('should have aria-pressed when checkable', async () => {
      element.checkable = true;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag');
      expect(tag?.getAttribute('aria-pressed')).to.equal('false');
    });

    it('should update aria-pressed when checked', async () => {
      element.checkable = true;
      element.checked = true;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag');
      expect(tag?.getAttribute('aria-pressed')).to.equal('true');
    });

    it('should have aria-label on close button', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.tag__close');
      expect(closeButton?.getAttribute('aria-label')).to.equal('close');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content', async () => {
      const emptyTag = await fixture<NrTagElement>(html`<nr-tag></nr-tag>`);
      expect(emptyTag).to.exist;
    });

    it('should handle special characters in content', async () => {
      const specialTag = await fixture<NrTagElement>(html`
        <nr-tag><script>alert("xss")</script></nr-tag>
      `);
      expect(specialTag).to.exist;
    });

    it('should handle unicode content', async () => {
      const unicodeTag = await fixture<NrTagElement>(html`
        <nr-tag>标签 🏷️ العلامة</nr-tag>
      `);
      expect(unicodeTag).to.exist;
    });

    it('should handle long content', async () => {
      const longContent = 'A'.repeat(100);
      const longTag = await fixture<NrTagElement>(html`
        <nr-tag>${longContent}</nr-tag>
      `);
      expect(longTag).to.exist;
    });

    it('should handle rapid property changes', async () => {
      element.color = 'red';
      element.size = TagSize.Small;
      element.closable = true;
      element.checkable = true;
      await element.updateComplete;

      expect(element.color).to.equal('red');
      expect(element.size).to.equal('small');
      expect(element.closable).to.be.true;
      expect(element.checkable).to.be.true;
    });

    it('should handle rapid checked toggles', async () => {
      element.checkable = true;
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector('.tag') as HTMLElement;

      for (let i = 0; i < 5; i++) {
        tag?.click();
        await aTimeout(10);
      }

      // After 5 clicks, should be checked (odd number)
      expect(element.checked).to.be.true;
    });
  });

  describe('Combined features', () => {
    it('should support closable with color', async () => {
      const tag = await fixture<NrTagElement>(html`
        <nr-tag color="blue" closable>Blue Closable</nr-tag>
      `);

      expect(tag.color).to.equal('blue');
      expect(tag.closable).to.be.true;

      const closeButton = tag.shadowRoot?.querySelector('.tag__close');
      expect(closeButton).to.exist;
    });

    it('should support checkable with color', async () => {
      const tag = await fixture<NrTagElement>(html`
        <nr-tag color="green" checkable>Green Checkable</nr-tag>
      `);

      expect(tag.color).to.equal('green');
      expect(tag.checkable).to.be.true;
    });

    it('should support small size with icon', async () => {
      const tag = await fixture<NrTagElement>(html`
        <nr-tag size="small">
          <span slot="icon">✓</span>
          Small with Icon
        </nr-tag>
      `);

      expect(tag.size).to.equal('small');
      const iconSlot = tag.shadowRoot?.querySelector('.tag__icon');
      expect(iconSlot).to.exist;
    });

    it('should support all features together', async () => {
      const tag = await fixture<NrTagElement>(html`
        <nr-tag
          color="purple"
          size="small"
          closable
          bordered
        >
          <span slot="icon">🎉</span>
          Full Featured Tag
        </nr-tag>
      `);

      expect(tag.color).to.equal('purple');
      expect(tag.size).to.equal('small');
      expect(tag.closable).to.be.true;
      expect(tag.bordered).to.be.true;
    });
  });

  describe('Dynamic updates', () => {
    it('should update color dynamically', async () => {
      element.color = 'red';
      await element.updateComplete;

      let tag = element.shadowRoot?.querySelector('.tag--red');
      expect(tag).to.exist;

      element.color = 'blue';
      await element.updateComplete;

      tag = element.shadowRoot?.querySelector('.tag--blue');
      expect(tag).to.exist;
    });

    it('should update size dynamically', async () => {
      element.size = TagSize.Small;
      await element.updateComplete;

      let tag = element.shadowRoot?.querySelector('.tag--small');
      expect(tag).to.exist;

      element.size = TagSize.Default;
      await element.updateComplete;

      tag = element.shadowRoot?.querySelector('.tag--small');
      expect(tag).to.not.exist;
    });

    it('should update closable dynamically', async () => {
      element.closable = false;
      await element.updateComplete;

      let closeButton = element.shadowRoot?.querySelector('.tag__close');
      expect(closeButton).to.not.exist;

      element.closable = true;
      await element.updateComplete;

      closeButton = element.shadowRoot?.querySelector('.tag__close');
      expect(closeButton).to.exist;
    });
  });
});
