/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { NrPanelElement } from '../panel.component.js';
import {
  PanelMode,
  PanelSize,
  PanelPosition,
  MaximizePosition
} from '../panel.types.js';

describe('NrPanelElement', () => {
  let element: NrPanelElement;

  beforeEach(async () => {
    element = await fixture(html`
      <nr-panel title="Test Panel">
        <p>Panel content</p>
      </nr-panel>
    `);
    // Wait for animation to complete
    await aTimeout(350);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-PANEL');
    });

    it('should have default properties', () => {
      expect(element.mode).to.equal(PanelMode.Panel);
      expect(element.size).to.equal(PanelSize.Medium);
      expect(element.position).to.equal(PanelPosition.Right);
      expect(element.draggable).to.be.true;
      expect(element.resizable).to.be.false;
      expect(element.collapsible).to.be.false;
      expect(element.minimizable).to.be.true;
      expect(element.closable).to.be.false;
      expect(element.animated).to.be.false;
      expect(element.open).to.be.true;
    });

    it('should render panel container', async () => {
      const panel = element.shadowRoot?.querySelector('.panel');
      expect(panel).to.exist;
    });

    it('should render panel header', async () => {
      const header = element.shadowRoot?.querySelector('.panel-header');
      expect(header).to.exist;
    });

    it('should render panel body', async () => {
      const body = element.shadowRoot?.querySelector('.panel-body');
      expect(body).to.exist;
    });

    it('should render slot for content', async () => {
      const slot = element.shadowRoot?.querySelector('.panel-body slot');
      expect(slot).to.exist;
    });
  });

  describe('Title and Icon', () => {
    it('should display title', async () => {
      element.title = 'My Panel';
      await element.updateComplete;

      const titleEl = element.shadowRoot?.querySelector('.panel-title');
      expect(titleEl?.textContent).to.include('My Panel');
    });

    it('should display icon', async () => {
      element.icon = 'settings';
      await element.updateComplete;

      const iconEl = element.shadowRoot?.querySelector('.panel-header-icon');
      expect(iconEl).to.exist;
    });

    it('should handle empty title', async () => {
      element.title = '';
      await element.updateComplete;

      // Panel should still render
      const panel = element.shadowRoot?.querySelector('.panel');
      expect(panel).to.exist;
    });
  });

  describe('Panel modes', () => {
    it('should apply panel mode by default', async () => {
      const panel = element.shadowRoot?.querySelector('.panel--mode-panel');
      expect(panel).to.exist;
    });

    it('should apply window mode', async () => {
      element.mode = PanelMode.Window;
      await element.updateComplete;
      await aTimeout(350);

      const panel = element.shadowRoot?.querySelector('.panel--mode-window');
      expect(panel).to.exist;
    });

    it('should apply minimized mode', async () => {
      element.mode = PanelMode.Minimized;
      await element.updateComplete;
      await aTimeout(350);

      const panel = element.shadowRoot?.querySelector('.panel--mode-minimized');
      expect(panel).to.exist;
    });

    it('should apply embedded mode', async () => {
      element.mode = PanelMode.Embedded;
      await element.updateComplete;
      await aTimeout(350);

      const panel = element.shadowRoot?.querySelector('.panel--mode-embedded');
      expect(panel).to.exist;
    });

    it('should dispatch mode change event', async () => {
      setTimeout(() => {
        element.mode = PanelMode.Window;
      });

      const event = await oneEvent(element, 'panel-mode-change') as CustomEvent;
      expect(event).to.exist;
      expect(event.detail.mode).to.equal(PanelMode.Window);
    });
  });

  describe('Panel sizes', () => {
    it('should apply small size', async () => {
      element.size = PanelSize.Small;
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel--size-small');
      expect(panel).to.exist;
    });

    it('should apply medium size', async () => {
      element.size = PanelSize.Medium;
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel--size-medium');
      expect(panel).to.exist;
    });

    it('should apply large size', async () => {
      element.size = PanelSize.Large;
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel--size-large');
      expect(panel).to.exist;
    });

    it('should apply custom size with dimensions', async () => {
      element.size = PanelSize.Custom;
      element.width = '500px';
      element.height = '400px';
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel') as HTMLElement;
      expect(panel.style.width).to.equal('500px');
      expect(panel.style.height).to.equal('400px');
    });
  });

  describe('Panel positions', () => {
    it('should apply right position by default', async () => {
      const panel = element.shadowRoot?.querySelector('.panel--position-right');
      expect(panel).to.exist;
    });

    it('should apply left position', async () => {
      element.position = PanelPosition.Left;
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel--position-left');
      expect(panel).to.exist;
    });

    it('should apply top position', async () => {
      element.position = PanelPosition.Top;
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel--position-top');
      expect(panel).to.exist;
    });

    it('should apply bottom position', async () => {
      element.position = PanelPosition.Bottom;
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel--position-bottom');
      expect(panel).to.exist;
    });
  });

  describe('Open/Close behavior', () => {
    it('should be open by default', () => {
      expect(element.open).to.be.true;
    });

    it('should hide panel when closed', async () => {
      element.open = false;
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel');
      expect(panel).to.not.exist;
    });

    it('should show panel when opened', async () => {
      element.open = false;
      await element.updateComplete;

      element.open = true;
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel');
      expect(panel).to.exist;
    });

    it('should dispatch close event when closing', async () => {
      element.closable = true;
      await element.updateComplete;

      setTimeout(() => {
        element.close();
      });

      const event = await oneEvent(element, 'panel-close');
      expect(event).to.exist;
    });

    it('should not close when closable is false', async () => {
      element.closable = false;
      element.close();
      await element.updateComplete;

      expect(element.open).to.be.true;
    });
  });

  describe('Minimize behavior', () => {
    it('should minimize panel', async () => {
      element.mode = PanelMode.Window;
      await element.updateComplete;

      setTimeout(() => {
        element.minimize();
      });

      const event = await oneEvent(element, 'panel-minimize');
      expect(event).to.exist;
      expect(element.mode).to.equal(PanelMode.Minimized);
    });

    it('should not minimize when minimizable is false', async () => {
      element.minimizable = false;
      element.minimize();
      await element.updateComplete;

      expect(element.mode).to.not.equal(PanelMode.Minimized);
    });

    it('should maximize from minimized state', async () => {
      element.mode = PanelMode.Minimized;
      await element.updateComplete;

      setTimeout(() => {
        element.maximize();
      });

      const event = await oneEvent(element, 'panel-maximize');
      expect(event).to.exist;
    });
  });

  describe('Collapsible behavior', () => {
    it('should show collapse button when collapsible', async () => {
      element.collapsible = true;
      await element.updateComplete;

      const collapseButton = element.shadowRoot?.querySelector('.panel-action-button[title="Collapse"]');
      expect(collapseButton).to.exist;
    });

    it('should not show collapse button when not collapsible', async () => {
      element.collapsible = false;
      await element.updateComplete;

      const collapseButton = element.shadowRoot?.querySelector('.panel-action-button[title="Collapse"]');
      expect(collapseButton).to.not.exist;
    });

    it('should toggle collapsed state', async () => {
      element.collapsible = true;
      await element.updateComplete;

      element.toggleCollapse();
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel--collapsed');
      expect(panel).to.exist;
    });

    it('should not toggle when not collapsible', async () => {
      element.collapsible = false;
      element.toggleCollapse();
      await element.updateComplete;

      const panel = element.shadowRoot?.querySelector('.panel--collapsed');
      expect(panel).to.not.exist;
    });
  });

  describe('Draggable behavior', () => {
    it('should have draggable header in window mode', async () => {
      element.mode = PanelMode.Window;
      element.draggable = true;
      await element.updateComplete;
      await aTimeout(350);

      const header = element.shadowRoot?.querySelector('.panel-header--draggable');
      expect(header).to.exist;
    });

    it('should not have draggable header in panel mode', async () => {
      element.mode = PanelMode.Panel;
      element.draggable = true;
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector('.panel-header--draggable');
      expect(header).to.not.exist;
    });
  });

  describe('Resizable behavior', () => {
    it('should show resize handles when resizable in window mode', async () => {
      element.mode = PanelMode.Window;
      element.resizable = true;
      await element.updateComplete;
      await aTimeout(350);

      const handles = element.shadowRoot?.querySelectorAll('.resize-handle');
      expect(handles?.length).to.be.greaterThan(0);
    });

    it('should not show resize handles when not resizable', async () => {
      element.mode = PanelMode.Window;
      element.resizable = false;
      await element.updateComplete;
      await aTimeout(350);

      const handles = element.shadowRoot?.querySelectorAll('.resize-handle');
      expect(handles?.length).to.equal(0);
    });

    it('should not show resize handles in panel mode', async () => {
      element.mode = PanelMode.Panel;
      element.resizable = true;
      await element.updateComplete;

      const handles = element.shadowRoot?.querySelectorAll('.resize-handle');
      expect(handles?.length).to.equal(0);
    });
  });

  describe('Mode transformations', () => {
    it('should transform to window mode', async () => {
      element.mode = PanelMode.Panel;
      await element.updateComplete;

      element.transformToWindow();
      await element.updateComplete;
      await aTimeout(350);

      expect(element.mode).to.equal(PanelMode.Window);
    });

    it('should transform to panel mode', async () => {
      element.mode = PanelMode.Window;
      await element.updateComplete;
      await aTimeout(350);

      element.transformToPanel();
      await element.updateComplete;
      await aTimeout(350);

      expect(element.mode).to.equal(PanelMode.Panel);
    });

    it('should not transform if already in target mode', async () => {
      element.mode = PanelMode.Window;
      await element.updateComplete;
      await aTimeout(350);

      const initialMode = element.mode;
      element.transformToWindow();
      await element.updateComplete;

      expect(element.mode).to.equal(initialMode);
    });
  });

  describe('Maximize position', () => {
    it('should default to center maximize position', () => {
      expect(element.maximizePosition).to.equal(MaximizePosition.Center);
    });

    it('should accept different maximize positions', async () => {
      element.maximizePosition = MaximizePosition.TopRight;
      await element.updateComplete;

      expect(element.maximizePosition).to.equal('top-right');
    });
  });

  describe('Custom header slot', () => {
    it('should render custom header content', async () => {
      const panelWithHeader = await fixture<NrPanelElement>(html`
        <nr-panel>
          <div slot="header">Custom Header</div>
          <p>Content</p>
        </nr-panel>
      `);
      await aTimeout(350);

      const headerSlot = panelWithHeader.shadowRoot?.querySelector('slot[name="header"]');
      expect(headerSlot).to.exist;
    });
  });

  describe('Footer slot', () => {
    it('should render footer when provided', async () => {
      const panelWithFooter = await fixture<NrPanelElement>(html`
        <nr-panel title="Panel">
          <p>Content</p>
          <div slot="footer">Footer content</div>
        </nr-panel>
      `);
      await aTimeout(350);

      const footer = panelWithFooter.shadowRoot?.querySelector('.panel-footer');
      expect(footer).to.exist;
    });

    it('should not render footer when not provided', async () => {
      const footer = element.shadowRoot?.querySelector('.panel-footer');
      expect(footer).to.not.exist;
    });
  });

  describe('Panel actions', () => {
    it('should show close button when closable', async () => {
      element.closable = true;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.panel-action-button[title="Close"]');
      expect(closeButton).to.exist;
    });

    it('should not show close button when not closable', async () => {
      element.closable = false;
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.panel-action-button[title="Close"]');
      expect(closeButton).to.not.exist;
    });

    it('should show pop-out button in panel mode', async () => {
      element.mode = PanelMode.Panel;
      await element.updateComplete;

      const popOutButton = element.shadowRoot?.querySelector('.panel-action-button[title="Pop out to window"]');
      expect(popOutButton).to.exist;
    });

    it('should show dock button in window mode', async () => {
      element.mode = PanelMode.Window;
      await element.updateComplete;
      await aTimeout(350);

      const dockButton = element.shadowRoot?.querySelector('.panel-action-button[title="Dock to panel"]');
      expect(dockButton).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content', async () => {
      const emptyPanel = await fixture<NrPanelElement>(html`
        <nr-panel title="Empty"></nr-panel>
      `);
      await aTimeout(350);

      expect(emptyPanel).to.exist;
    });

    it('should handle rapid mode changes', async () => {
      element.mode = PanelMode.Panel;
      element.mode = PanelMode.Window;
      element.mode = PanelMode.Minimized;
      element.mode = PanelMode.Panel;
      await element.updateComplete;
      await aTimeout(350);

      expect(element.mode).to.equal(PanelMode.Panel);
    });

    it('should handle rapid open/close', async () => {
      element.open = true;
      element.open = false;
      element.open = true;
      await element.updateComplete;

      expect(element.open).to.be.true;
    });

    it('should handle special characters in title', async () => {
      element.title = '<script>alert("xss")</script>';
      await element.updateComplete;

      // Content should be safely rendered
      const panel = element.shadowRoot?.querySelector('.panel');
      expect(panel).to.exist;
    });

    it('should handle unicode in title', async () => {
      element.title = '面板标题 🎛️';
      await element.updateComplete;

      const titleEl = element.shadowRoot?.querySelector('.panel-title');
      expect(titleEl?.textContent).to.include('面板标题');
    });
  });

  describe('Accessibility', () => {
    it('should render proper panel structure', async () => {
      const panel = element.shadowRoot?.querySelector('.panel');
      expect(panel).to.exist;
    });

    it('should have header content', async () => {
      const headerContent = element.shadowRoot?.querySelector('.panel-header-content');
      expect(headerContent).to.exist;
    });

    it('should have panel actions', async () => {
      const actions = element.shadowRoot?.querySelector('.panel-actions');
      expect(actions).to.exist;
    });
  });
});
