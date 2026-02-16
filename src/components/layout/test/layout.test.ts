/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrLayoutElement } from '../layout.component.js';
import { NrHeaderElement } from '../header.component.js';
import { NrFooterElement } from '../footer.component.js';
import { NrContentElement } from '../content.component.js';
import { NrSiderElement } from '../sider.component.js';
import { SiderTheme, LayoutBreakpoint } from '../layout.types.js';

describe('Layout System', () => {
  describe('NrLayoutElement', () => {
    let element: NrLayoutElement;

    beforeEach(async () => {
      element = await fixture(html`
        <nr-layout>
          <nr-content>Content</nr-content>
        </nr-layout>
      `);
    });

    describe('Basic functionality', () => {
      it('should render successfully', () => {
        expect(element).to.exist;
        expect(element.tagName).to.equal('NR-LAYOUT');
      });

      it('should have default properties', () => {
        expect(element.hasSider).to.be.false;
      });

      it('should render layout container', async () => {
        const layout = element.shadowRoot?.querySelector('.nr-layout');
        expect(layout).to.exist;
      });

      it('should render slot for children', async () => {
        const slot = element.shadowRoot?.querySelector('slot');
        expect(slot).to.exist;
      });

      it('should have layout part', async () => {
        const layout = element.shadowRoot?.querySelector('[part="layout"]');
        expect(layout).to.exist;
      });
    });

    describe('Sider detection', () => {
      it('should detect sider element', async () => {
        const layoutWithSider = await fixture<NrLayoutElement>(html`
          <nr-layout>
            <nr-sider>Sider</nr-sider>
            <nr-content>Content</nr-content>
          </nr-layout>
        `);
        await aTimeout(50);

        expect(layoutWithSider.hasSider).to.be.true;
      });

      it('should not have sider when not present', async () => {
        expect(element.hasSider).to.be.false;
      });

      it('should reflect hasSider attribute', async () => {
        const layoutWithSider = await fixture<NrLayoutElement>(html`
          <nr-layout>
            <nr-sider>Sider</nr-sider>
            <nr-content>Content</nr-content>
          </nr-layout>
        `);
        await aTimeout(50);

        expect(layoutWithSider.hasAttribute('has-sider')).to.be.true;
      });
    });

    describe('Nested layouts', () => {
      it('should support nested layouts', async () => {
        const nested = await fixture(html`
          <nr-layout>
            <nr-header>Header</nr-header>
            <nr-layout>
              <nr-sider>Sider</nr-sider>
              <nr-content>Content</nr-content>
            </nr-layout>
            <nr-footer>Footer</nr-footer>
          </nr-layout>
        `);

        const innerLayout = nested.querySelector('nr-layout');
        expect(innerLayout).to.exist;
      });
    });
  });

  describe('NrHeaderElement', () => {
    let element: NrHeaderElement;

    beforeEach(async () => {
      element = await fixture(html`
        <nr-header>Header Content</nr-header>
      `);
    });

    describe('Basic functionality', () => {
      it('should render successfully', () => {
        expect(element).to.exist;
        expect(element.tagName).to.equal('NR-HEADER');
      });

      it('should have default height', () => {
        expect(element.height).to.equal('64px');
      });

      it('should render header element', async () => {
        const header = element.shadowRoot?.querySelector('.nr-header');
        expect(header).to.exist;
      });

      it('should render header tag', async () => {
        const header = element.shadowRoot?.querySelector('header');
        expect(header).to.exist;
      });

      it('should have header part', async () => {
        const header = element.shadowRoot?.querySelector('[part="header"]');
        expect(header).to.exist;
      });

      it('should render slot for content', async () => {
        const slot = element.shadowRoot?.querySelector('slot');
        expect(slot).to.exist;
      });
    });

    describe('Height', () => {
      it('should apply default height', async () => {
        const header = element.shadowRoot?.querySelector('.nr-header') as HTMLElement;
        expect(header.style.height).to.equal('64px');
      });

      it('should accept custom height', async () => {
        element.height = '80px';
        await element.updateComplete;

        const header = element.shadowRoot?.querySelector('.nr-header') as HTMLElement;
        expect(header.style.height).to.equal('80px');
      });

      it('should accept height as number string', async () => {
        element.height = '100px';
        await element.updateComplete;

        expect(element.height).to.equal('100px');
      });
    });
  });

  describe('NrFooterElement', () => {
    let element: NrFooterElement;

    beforeEach(async () => {
      element = await fixture(html`
        <nr-footer>Footer Content</nr-footer>
      `);
    });

    describe('Basic functionality', () => {
      it('should render successfully', () => {
        expect(element).to.exist;
        expect(element.tagName).to.equal('NR-FOOTER');
      });

      it('should have default padding', () => {
        expect(element.padding).to.equal('24px 50px');
      });

      it('should render footer element', async () => {
        const footer = element.shadowRoot?.querySelector('.nr-footer');
        expect(footer).to.exist;
      });

      it('should render footer tag', async () => {
        const footer = element.shadowRoot?.querySelector('footer');
        expect(footer).to.exist;
      });

      it('should have footer part', async () => {
        const footer = element.shadowRoot?.querySelector('[part="footer"]');
        expect(footer).to.exist;
      });

      it('should render slot for content', async () => {
        const slot = element.shadowRoot?.querySelector('slot');
        expect(slot).to.exist;
      });
    });

    describe('Padding', () => {
      it('should apply default padding', async () => {
        const footer = element.shadowRoot?.querySelector('.nr-footer') as HTMLElement;
        expect(footer.style.padding).to.equal('24px 50px');
      });

      it('should accept custom padding', async () => {
        element.padding = '16px 32px';
        await element.updateComplete;

        const footer = element.shadowRoot?.querySelector('.nr-footer') as HTMLElement;
        expect(footer.style.padding).to.equal('16px 32px');
      });
    });
  });

  describe('NrContentElement', () => {
    let element: NrContentElement;

    beforeEach(async () => {
      element = await fixture(html`
        <nr-content>Main Content</nr-content>
      `);
    });

    describe('Basic functionality', () => {
      it('should render successfully', () => {
        expect(element).to.exist;
        expect(element.tagName).to.equal('NR-CONTENT');
      });

      it('should render content element', async () => {
        const content = element.shadowRoot?.querySelector('.nr-content');
        expect(content).to.exist;
      });

      it('should render main tag', async () => {
        const main = element.shadowRoot?.querySelector('main');
        expect(main).to.exist;
      });

      it('should have content part', async () => {
        const content = element.shadowRoot?.querySelector('[part="content"]');
        expect(content).to.exist;
      });

      it('should render slot for content', async () => {
        const slot = element.shadowRoot?.querySelector('slot');
        expect(slot).to.exist;
      });
    });
  });

  describe('NrSiderElement', () => {
    let element: NrSiderElement;

    beforeEach(async () => {
      element = await fixture(html`
        <nr-sider>Sider Content</nr-sider>
      `);
    });

    describe('Basic functionality', () => {
      it('should render successfully', () => {
        expect(element).to.exist;
        expect(element.tagName).to.equal('NR-SIDER');
      });

      it('should have default properties', () => {
        expect(element.collapsed).to.be.false;
        expect(element.collapsedWidth).to.equal(80);
        expect(element.collapsible).to.be.false;
        expect(element.defaultCollapsed).to.be.false;
        expect(element.reverseArrow).to.be.false;
        expect(element.theme).to.equal(SiderTheme.Dark);
        expect(element.trigger).to.equal('default');
        expect(element.width).to.equal(200);
      });

      it('should render sider element', async () => {
        const sider = element.shadowRoot?.querySelector('.nr-sider');
        expect(sider).to.exist;
      });

      it('should render aside tag', async () => {
        const aside = element.shadowRoot?.querySelector('aside');
        expect(aside).to.exist;
      });

      it('should have sider part', async () => {
        const sider = element.shadowRoot?.querySelector('[part="sider"]');
        expect(sider).to.exist;
      });

      it('should render slot for content', async () => {
        const slot = element.shadowRoot?.querySelector('slot:not([name])');
        expect(slot).to.exist;
      });
    });

    describe('Collapsed state', () => {
      it('should not be collapsed by default', () => {
        expect(element.collapsed).to.be.false;
      });

      it('should accept collapsed attribute', async () => {
        element.collapsed = true;
        await element.updateComplete;

        expect(element.collapsed).to.be.true;
      });

      it('should apply collapsed class', async () => {
        element.collapsed = true;
        await element.updateComplete;

        const sider = element.shadowRoot?.querySelector('.nr-sider-collapsed');
        expect(sider).to.exist;
      });

      it('should use collapsedWidth when collapsed', async () => {
        element.collapsed = true;
        element.collapsedWidth = 80;
        await element.updateComplete;

        const sider = element.shadowRoot?.querySelector('.nr-sider') as HTMLElement;
        expect(sider.style.width).to.equal('80px');
      });
    });

    describe('Collapsible', () => {
      it('should not be collapsible by default', () => {
        expect(element.collapsible).to.be.false;
      });

      it('should show trigger when collapsible', async () => {
        element.collapsible = true;
        await element.updateComplete;

        const trigger = element.shadowRoot?.querySelector('.nr-sider-trigger');
        expect(trigger).to.exist;
      });

      it('should not show trigger when not collapsible', async () => {
        element.collapsible = false;
        await element.updateComplete;

        const trigger = element.shadowRoot?.querySelector('.nr-sider-trigger');
        expect(trigger).to.not.exist;
      });

      it('should toggle collapse on trigger click', async () => {
        element.collapsible = true;
        await element.updateComplete;

        const trigger = element.shadowRoot?.querySelector('.nr-sider-trigger') as HTMLElement;
        trigger?.click();
        await element.updateComplete;

        expect(element.collapsed).to.be.true;
      });

      it('should dispatch collapse event', async () => {
        element.collapsible = true;
        await element.updateComplete;

        const trigger = element.shadowRoot?.querySelector('.nr-sider-trigger') as HTMLElement;

        setTimeout(() => {
          trigger?.click();
        });

        const event = await oneEvent(element, 'collapse') as CustomEvent;
        expect(event).to.exist;
        expect(event.detail.collapsed).to.be.true;
        expect(event.detail.type).to.equal('clickTrigger');
      });
    });

    describe('Width', () => {
      it('should have default width of 200', () => {
        expect(element.width).to.equal(200);
      });

      it('should accept custom width as number', async () => {
        element.width = 300;
        await element.updateComplete;

        const sider = element.shadowRoot?.querySelector('.nr-sider') as HTMLElement;
        expect(sider.style.width).to.equal('300px');
      });

      it('should accept custom width as string', async () => {
        element.width = '25%';
        await element.updateComplete;

        const sider = element.shadowRoot?.querySelector('.nr-sider') as HTMLElement;
        expect(sider.style.width).to.equal('25%');
      });
    });

    describe('Theme', () => {
      it('should default to dark theme', () => {
        expect(element.theme).to.equal('dark');
      });

      it('should accept light theme', async () => {
        element.theme = SiderTheme.Light;
        await element.updateComplete;

        expect(element.theme).to.equal('light');
      });
    });

    describe('Trigger', () => {
      it('should have default trigger', () => {
        expect(element.trigger).to.equal('default');
      });

      it('should hide trigger when set to null', async () => {
        element.collapsible = true;
        element.trigger = null;
        await element.updateComplete;

        const trigger = element.shadowRoot?.querySelector('.nr-sider-trigger');
        expect(trigger).to.not.exist;
      });

      it('should support custom trigger slot', async () => {
        const siderWithCustomTrigger = await fixture<NrSiderElement>(html`
          <nr-sider collapsible>
            <button slot="trigger">Custom Trigger</button>
            Content
          </nr-sider>
        `);

        const triggerSlot = siderWithCustomTrigger.shadowRoot?.querySelector('slot[name="trigger"]');
        expect(triggerSlot).to.exist;
      });
    });

    describe('Breakpoint', () => {
      it('should accept breakpoint', async () => {
        element.breakpoint = LayoutBreakpoint.LG;
        await element.updateComplete;

        expect(element.breakpoint).to.equal('lg');
      });
    });

    describe('Zero width trigger', () => {
      it('should show zero width trigger when collapsed width is 0', async () => {
        element.collapsible = true;
        element.collapsedWidth = 0;
        element.collapsed = true;
        await element.updateComplete;

        const zeroWidthTrigger = element.shadowRoot?.querySelector('.nr-sider-zero-width-trigger');
        expect(zeroWidthTrigger).to.exist;
      });

      it('should apply zero width class', async () => {
        element.collapsible = true;
        element.collapsedWidth = 0;
        element.collapsed = true;
        await element.updateComplete;

        const sider = element.shadowRoot?.querySelector('.nr-sider-zero-width');
        expect(sider).to.exist;
      });
    });

    describe('Reverse arrow', () => {
      it('should not reverse arrow by default', () => {
        expect(element.reverseArrow).to.be.false;
      });

      it('should accept reverse arrow', async () => {
        element.reverseArrow = true;
        await element.updateComplete;

        expect(element.reverseArrow).to.be.true;
      });
    });
  });

  describe('Full layout integration', () => {
    it('should render complete layout', async () => {
      const layout = await fixture(html`
        <nr-layout>
          <nr-header>Header</nr-header>
          <nr-layout>
            <nr-sider>Sider</nr-sider>
            <nr-content>Content</nr-content>
          </nr-layout>
          <nr-footer>Footer</nr-footer>
        </nr-layout>
      `);

      expect(layout.querySelector('nr-header')).to.exist;
      expect(layout.querySelector('nr-sider')).to.exist;
      expect(layout.querySelector('nr-content')).to.exist;
      expect(layout.querySelector('nr-footer')).to.exist;
    });

    it('should render layout without sider', async () => {
      const layout = await fixture(html`
        <nr-layout>
          <nr-header>Header</nr-header>
          <nr-content>Content</nr-content>
          <nr-footer>Footer</nr-footer>
        </nr-layout>
      `);

      expect(layout.querySelector('nr-sider')).to.not.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty layout', async () => {
      const layout = await fixture<NrLayoutElement>(html`
        <nr-layout></nr-layout>
      `);

      expect(layout).to.exist;
    });

    it('should handle rapid collapsed changes', async () => {
      const sider = await fixture<NrSiderElement>(html`
        <nr-sider collapsible></nr-sider>
      `);

      sider.collapsed = true;
      sider.collapsed = false;
      sider.collapsed = true;
      await sider.updateComplete;

      expect(sider.collapsed).to.be.true;
    });

    it('should handle special characters in content', async () => {
      const layout = await fixture(html`
        <nr-layout>
          <nr-header>&lt;script&gt;alert('xss')&lt;/script&gt;</nr-header>
        </nr-layout>
      `);

      expect(layout).to.exist;
    });
  });
});
