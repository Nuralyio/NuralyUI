import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index.js';
import '../menu/index.js';
import '../card/index.js';
import '../breadcrumb/index.js';

/**
 * ## Layout
 * 
 * Complete layout system for building page structures. Includes Layout wrapper, Header, Footer, 
 * Sider (sidebar with collapsible functionality), and Content components.
 * 
 * ### When to use
 * - Creating application layouts with header, sidebar, content, and footer
 * - Building responsive layouts that adapt to different screen sizes
 * - Implementing collapsible navigation sidebars
 * - Creating admin dashboards, documentation sites, or any structured page layout
 * 
 * ### Features
 * - Flexible composition of Layout, Header, Footer, Sider, and Content
 * - Collapsible sidebar with customizable trigger
 * - Responsive breakpoints for auto-collapsing sidebar
 * - Light and dark theme support for sidebar
 * - Auto-detection of sidebar presence
 * - Custom trigger support for sidebar collapse
 */
const meta: Meta = {
  title: 'Layout/Layout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A complete layout system based on flexbox with Header, Footer, Sider, and Content components.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Shared demo styles
const demoStyles = html`
  <style>
    .demo-header {
      background: #001529;
      color: rgba(255, 255, 255, 0.85);
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .demo-logo {
      font-size: 20px;
      font-weight: bold;
    }
    .demo-nav {
      display: flex;
      gap: 24px;
    }
    .demo-nav a {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
    }
    .demo-content {
      padding: 24px;
      min-height: 280px;
      background: #fff;
    }
    .demo-footer {
      text-align: center;
      color: rgba(0, 0, 0, 0.65);
    }
    .full-height {
      height: 100vh;
    }
    nr-menu {
      --nuraly-menu-background: transparent;
      --nuraly-menu-item-color: rgba(255, 255, 255, 0.85);
      --nuraly-menu-item-hover-background: rgba(255, 255, 255, 0.1);
      --nuraly-menu-item-active-background: rgba(255, 255, 255, 0.15);
    }
    nr-sider[theme="light"] nr-menu {
      --nuraly-menu-item-color: rgba(0, 0, 0, 0.88);
      --nuraly-menu-item-hover-background: rgba(0, 0, 0, 0.06);
      --nuraly-menu-item-active-background: rgba(0, 0, 0, 0.1);
    }
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    nr-breadcrumb {
      margin-bottom: 16px;
    }
  </style>
`;

// Menu items for sidebar
const sidebarMenuItems = [
  { text: 'Dashboard', icon: 'dashboard', selected: true },
  { text: 'Users', icon: 'group' },
  { text: 'Settings', icon: 'settings' },
  { text: 'Reports', icon: 'assessment' },
];

// Breadcrumb items
const breadcrumbItems = [
  { title: 'Home', icon: 'home', href: '/' },
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Overview' },
];

/**
 * Basic layout with Header, Content, and Footer stacked vertically.
 */
export const BasicLayout: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout>
      <nr-header>
        <div class="demo-header">
          <div class="demo-logo">My App</div>
          <nav class="demo-nav">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">About</a>
          </nav>
        </div>
      </nr-header>
      <nr-content>
        <div class="demo-content">
          <h2>Content Area</h2>
          <p>This is the main content area.</p>
        </div>
      </nr-content>
      <nr-footer>
        <div class="demo-footer">
          Copyright © 2025 My Company. All rights reserved.
        </div>
      </nr-footer>
    </nr-layout>
  `,
};

/**
 * Layout with sidebar on the left side. The layout automatically detects the sidebar.
 */
export const WithSider: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout has-sider>
      <nr-sider width="200">
        <nr-menu .items=${sidebarMenuItems}></nr-menu>
      </nr-sider>
      <nr-layout>
        <nr-header>
          <div class="demo-header">
            <div class="demo-logo">Admin Panel</div>
          </div>
        </nr-header>
        <nr-content>
          <div class="demo-content">
            <nr-breadcrumb .items=${breadcrumbItems}></nr-breadcrumb>
            <h2>Dashboard</h2>
            <div class="content-grid">
              <nr-card header="Total Users">
                <div slot="content">
                  <h1 style="margin: 0; color: #1890ff;">1,234</h1>
                  <p style="margin: 8px 0 0; color: #666;">+12% from last month</p>
                </div>
              </nr-card>
              <nr-card header="Revenue">
                <div slot="content">
                  <h1 style="margin: 0; color: #52c41a;">$45,678</h1>
                  <p style="margin: 8px 0 0; color: #666;">+8% from last month</p>
                </div>
              </nr-card>
              <nr-card header="Active Sessions">
                <div slot="content">
                  <h1 style="margin: 0; color: #faad14;">456</h1>
                  <p style="margin: 8px 0 0; color: #666;">Currently online</p>
                </div>
              </nr-card>
            </div>
          </div>
        </nr-content>
        <nr-footer>
          <div class="demo-footer">Footer Content</div>
        </nr-footer>
      </nr-layout>
    </nr-layout>
  `,
};

/**
 * Collapsible sidebar that can be toggled by clicking the trigger at the bottom.
 */
export const CollapsibleSider: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout has-sider>
      <nr-sider collapsible width="250">
        <nr-menu .items=${[
          { text: 'Dashboard', icon: 'dashboard' },
          { text: 'Users', icon: 'group' },
          { text: 'Settings', icon: 'settings' },
          { text: 'Analytics', icon: 'analytics' },
          { text: 'Reports', icon: 'assessment' },
        ]}></nr-menu>
      </nr-sider>
      <nr-layout>
        <nr-header>
          <div class="demo-header">
            <div class="demo-logo">My Application</div>
          </div>
        </nr-header>
        <nr-content>
          <div class="demo-content">
            <nr-breadcrumb .items=${breadcrumbItems}></nr-breadcrumb>
            <h2>Main Content</h2>
            <p>Click the trigger at the bottom of the sidebar to collapse/expand it.</p>
            <div class="content-grid">
              <nr-card header="Quick Stats">
                <div slot="content">
                  <p>View your latest statistics and metrics here.</p>
                </div>
              </nr-card>
              <nr-card header="Recent Activity">
                <div slot="content">
                  <p>Track recent user activities and events.</p>
                </div>
              </nr-card>
            </div>
          </div>
        </nr-content>
      </nr-layout>
    </nr-layout>
  `,
};

/**
 * Responsive sidebar that auto-collapses when the window is below the 'lg' breakpoint (992px).
 */
export const ResponsiveSider: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout has-sider>
      <nr-sider 
        collapsible 
        breakpoint="lg"
        collapsed-width="80"
      >
        <nr-menu .items=${[
          { text: 'Dashboard', icon: 'dashboard' },
          { text: 'Users', icon: 'group' },
          { text: 'Settings', icon: 'settings' },
          { text: 'Analytics', icon: 'analytics' },
        ]}></nr-menu>
      </nr-sider>
      <nr-layout>
        <nr-header>
          <div class="demo-header">
            <div class="demo-logo">Responsive App</div>
          </div>
        </nr-header>
        <nr-content>
          <div class="demo-content">
            <nr-breadcrumb .items=${breadcrumbItems}></nr-breadcrumb>
            <h2>Responsive Layout</h2>
            <p>Resize the window to see the sidebar auto-collapse at the 'lg' breakpoint (992px).</p>
            <nr-card header="Responsive Design">
              <div slot="content">
                <p>The sidebar will automatically collapse when the screen size is below 992px.</p>
              </div>
            </nr-card>
          </div>
        </nr-content>
      </nr-layout>
    </nr-layout>
  `,
};

/**
 * Light theme sidebar with collapsible functionality.
 */
export const LightThemeSider: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout has-sider>
      <nr-sider 
        theme="light" 
        collapsible 
        width="220"
      >
        <nr-menu .items=${[
          { text: 'Dashboard', icon: 'dashboard' },
          { text: 'Team', icon: 'group' },
          { text: 'Projects', icon: 'folder' },
          { text: 'Settings', icon: 'settings' },
        ]}></nr-menu>
      </nr-sider>
      <nr-layout>
        <nr-header>
          <div class="demo-header">
            <div class="demo-logo">Light Theme</div>
          </div>
        </nr-header>
        <nr-content>
          <div class="demo-content">
            <nr-breadcrumb .items=${[
              { title: 'Home', icon: 'home', href: '/' },
              { title: 'Settings', href: '/settings' },
              { title: 'Profile' },
            ]}></nr-breadcrumb>
            <h2>Light Sidebar Theme</h2>
            <p>This layout uses a light-themed sidebar.</p>
            <nr-card header="Features">
              <div slot="content">
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Clean light design</li>
                  <li>Better visibility in bright environments</li>
                  <li>Professional appearance</li>
                </ul>
              </div>
            </nr-card>
          </div>
        </nr-content>
      </nr-layout>
    </nr-layout>
  `,
};

/**
 * Sidebar with collapsed width set to 0, showing a special trigger button.
 */
export const ZeroWidthCollapsed: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout has-sider>
      <nr-sider 
        collapsible 
        collapsed-width="0"
        width="250"
      >
        <nr-menu .items=${[
          { text: 'Dashboard', icon: 'dashboard' },
          { text: 'Users', icon: 'group' },
          { text: 'Settings', icon: 'settings' },
          { text: 'Reports', icon: 'assessment' },
        ]}></nr-menu>
      </nr-sider>
      <nr-layout>
        <nr-header>
          <div class="demo-header">
            <div class="demo-logo">Zero Width Collapse</div>
          </div>
        </nr-header>
        <nr-content>
          <div class="demo-content">
            <nr-breadcrumb .items=${[
              { title: 'Home', icon: 'home', href: '/' },
              { title: 'Products', href: '/products' },
              { title: 'Details' },
            ]}></nr-breadcrumb>
            <h2>Zero-Width Collapse</h2>
            <p>When collapsed, the sidebar has zero width and shows a special trigger button.</p>
            <nr-card header="Maximize Content Space">
              <div slot="content">
                <p>Zero-width collapse is ideal when you want to maximize content area space while keeping navigation accessible.</p>
              </div>
            </nr-card>
          </div>
        </nr-content>
      </nr-layout>
    </nr-layout>
  `,
};

/**
 * Sidebar starts in collapsed state by default.
 */
export const DefaultCollapsed: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout has-sider>
      <nr-sider 
        collapsible 
        default-collapsed
        width="250"
      >
        <nr-menu .items=${[
          { text: 'Dashboard', icon: 'dashboard' },
          { text: 'Users', icon: 'group' },
          { text: 'Settings', icon: 'settings' },
        ]}></nr-menu>
      </nr-sider>
      <nr-layout>
        <nr-header>
          <div class="demo-header">
            <div class="demo-logo">Default Collapsed</div>
          </div>
        </nr-header>
        <nr-content>
          <div class="demo-content">
            <nr-breadcrumb .items=${breadcrumbItems}></nr-breadcrumb>
            <h2>Initially Collapsed</h2>
            <p>The sidebar starts in a collapsed state.</p>
            <nr-card header="Initial State">
              <div slot="content">
                <p>Perfect for mobile-first designs or when content takes priority.</p>
              </div>
            </nr-card>
          </div>
        </nr-content>
      </nr-layout>
    </nr-layout>
  `,
};

/**
 * Header at top with sidebar layout below.
 */
export const HeaderSiderLayout: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout>
      <nr-header>
        <div class="demo-header">
          <div class="demo-logo">My Platform</div>
          <nav class="demo-nav">
            <a href="#">Dashboard</a>
            <a href="#">Analytics</a>
            <a href="#">Settings</a>
          </nav>
        </div>
      </nr-header>
      <nr-layout has-sider>
        <nr-sider collapsible width="200">
          <nr-menu .items=${[
            { text: 'Overview', icon: 'visibility' },
            { text: 'Statistics', icon: 'bar_chart' },
            { text: 'Reports', icon: 'assessment' },
            { text: 'Export', icon: 'download' },
          ]}></nr-menu>
        </nr-sider>
        <nr-content>
          <div class="demo-content">
            <nr-breadcrumb .items=${[
              { title: 'Home', icon: 'home', href: '/' },
              { title: 'Platform', href: '/platform' },
              { title: 'Analytics', href: '/platform/analytics' },
              { title: 'Overview' },
            ]}></nr-breadcrumb>
            <h2>Content Area</h2>
            <p>This is a common layout pattern with top navigation and side menu.</p>
            <div class="content-grid">
              <nr-card header="Overview">
                <div slot="content">
                  <p>General overview of your application.</p>
                </div>
              </nr-card>
              <nr-card header="Statistics">
                <div slot="content">
                  <p>Detailed statistics and analytics.</p>
                </div>
              </nr-card>
            </div>
          </div>
        </nr-content>
      </nr-layout>
    </nr-layout>
  `,
};

/**
 * Complex nested layout with multiple sections.
 */
export const ComplexLayout: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout has-sider style="height: 100vh;">
      <nr-sider collapsible width="250">
        <div style="padding: 16px; color: rgba(255,255,255,0.85);">
          <h3 style="margin: 0 0 16px 0;">Navigation</h3>
        </div>
        <nr-menu .items=${[
          { text: 'Dashboard', icon: 'dashboard' },
          { text: 'Team', icon: 'group' },
          { text: 'Projects', icon: 'folder' },
          { text: 'Analytics', icon: 'analytics' },
          { text: 'Settings', icon: 'settings' },
          { text: 'Reports', icon: 'assessment' },
        ]}></nr-menu>
      </nr-sider>
      <nr-layout>
        <nr-header>
          <div class="demo-header">
            <div class="demo-logo">Enterprise App</div>
            <nav class="demo-nav">
              <a href="#">Profile</a>
              <a href="#">Notifications</a>
              <a href="#">Logout</a>
            </nav>
          </div>
        </nr-header>
        <nr-content>
          <div class="demo-content">
            <nr-breadcrumb .items=${[
              { title: 'Home', icon: 'home', href: '/' },
              { title: 'Enterprise', href: '/enterprise' },
              { title: 'Dashboard', href: '/enterprise/dashboard' },
              { title: 'Overview' },
            ]}></nr-breadcrumb>
            <h1>Dashboard Overview</h1>
            <p>This is a complex layout with header, collapsible sidebar, content, and footer.</p>
            <div class="content-grid">
              <nr-card header="Total Revenue">
                <div slot="content">
                  <h2 style="margin: 0; color: #52c41a;">$124,567</h2>
                  <p style="margin: 8px 0 0; color: #666;">+18% from last month</p>
                </div>
              </nr-card>
              <nr-card header="Active Users">
                <div slot="content">
                  <h2 style="margin: 0; color: #1890ff;">8,456</h2>
                  <p style="margin: 8px 0 0; color: #666;">+23% increase</p>
                </div>
              </nr-card>
              <nr-card header="Conversion Rate">
                <div slot="content">
                  <h2 style="margin: 0; color: #722ed1;">3.24%</h2>
                  <p style="margin: 8px 0 0; color: #666;">+0.5% improvement</p>
                </div>
              </nr-card>
            </div>
          </div>
        </nr-content>
        <nr-footer>
          <div class="demo-footer">
            Copyright © 2025 Enterprise Corp. All rights reserved.
          </div>
        </nr-footer>
      </nr-layout>
    </nr-layout>
  `,
};

/**
 * Custom height header and padding configurations.
 */
export const CustomSizes: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout>
      <nr-header height="80px">
        <div class="demo-header" style="height: 80px;">
          <div class="demo-logo" style="font-size: 24px;">Large Header</div>
        </div>
      </nr-header>
      <nr-content>
        <div class="demo-content">
          <h2>Custom Sizes</h2>
          <p>This layout uses a custom header height of 80px and custom footer padding.</p>
        </div>
      </nr-content>
      <nr-footer padding="32px 80px">
        <div class="demo-footer">
          Footer with custom padding (32px 80px)
        </div>
      </nr-footer>
    </nr-layout>
  `,
};

/**
 * Right-side sidebar with reverse arrow direction.
 */
export const RightSider: Story = {
  render: () => html`
    ${demoStyles}
    <nr-layout has-sider>
      <nr-content>
        <div class="demo-content">
          <nr-breadcrumb .items=${[
            { title: 'Home', icon: 'home', href: '/' },
            { title: 'Settings', href: '/settings' },
            { title: 'Preferences' },
          ]}></nr-breadcrumb>
          <h2>Main Content</h2>
          <p>Content on the left with sidebar on the right.</p>
          <nr-card header="Primary Content">
            <div slot="content">
              <p>This layout demonstrates a right-aligned sidebar with reverse arrow direction.</p>
              <p>The sidebar collapse arrow points in the opposite direction.</p>
            </div>
          </nr-card>
        </div>
      </nr-content>
      <nr-sider 
        collapsible 
        reverse-arrow 
        width="200"
      >
        <nr-menu .items=${[
          { text: 'Settings', icon: 'settings' },
          { text: 'Help', icon: 'help' },
          { text: 'About', icon: 'info' },
        ]}></nr-menu>
      </nr-sider>
    </nr-layout>
  `,
};

export const PartOverrides: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Override `nr-layout`, `nr-header`, `nr-footer`, and `nr-content` styles from outside the shadow root using `::part()` selectors. No CSS variables needed — just plain CSS targeting the exposed parts.',
      },
    },
  },
  render: () => html`
    <style>
      .demo-layout nr-header::part(header) { background: #1a1a2e; color: #e0e0e0; border-bottom: 3px solid #6c63ff; }
      .demo-layout nr-content::part(content) { background: #f5f3ff; padding: 24px; }
      .demo-layout nr-footer::part(footer) { background: #16213e; color: #a0a0b0; border-top: 2px solid #6c63ff; font-size: 0.85rem; text-align: center; }

      .amber-layout nr-header::part(header) { background: #92400e; color: #fef3c7; font-weight: 700; }
      .amber-layout nr-content::part(content) { background: #fffbf0; }
      .amber-layout nr-footer::part(footer) { background: #fef3c7; color: #92400e; text-align: center; }

      .teal-layout nr-layout::part(layout) { border: 2px solid #0d9488; border-radius: 12px; overflow: hidden; }
      .teal-layout nr-header::part(header) { background: #0d9488; color: #ffffff; }
      .teal-layout nr-content::part(content) { background: #f0fdfa; }
      .teal-layout nr-footer::part(footer) { background: #ccfbf1; color: #065f46; text-align: center; }
    </style>
    <div style="display: flex; flex-direction: column; gap: 2rem; padding: 1rem;">
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">Dark header/footer with purple accents on header, content, footer parts</p>
        <div class="demo-layout" style="height: 160px;">
          <nr-layout>
            <nr-header>Dark Header</nr-header>
            <nr-content><p style="margin:0;">Purple-tinted content area</p></nr-content>
            <nr-footer>Dark Footer © 2025</nr-footer>
          </nr-layout>
        </div>
      </div>
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">Amber warm theme: header, content, footer parts</p>
        <div class="amber-layout" style="height: 160px;">
          <nr-layout>
            <nr-header>Amber Header</nr-header>
            <nr-content><p style="margin:0;">Warm amber content background</p></nr-content>
            <nr-footer>Amber Footer © 2025</nr-footer>
          </nr-layout>
        </div>
      </div>
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">Teal theme: nr-layout::part(layout) border-radius + header/content/footer teal tones</p>
        <div class="teal-layout" style="height: 160px;">
          <nr-layout>
            <nr-header>Teal Header</nr-header>
            <nr-content><p style="margin:0;">Fresh teal content area</p></nr-content>
            <nr-footer>Teal Footer © 2025</nr-footer>
          </nr-layout>
        </div>
      </div>
    </div>
  `,
};

export const SiderPartOverrides: Story = {
  render: () => html`
    <style>
      .sider-part-demo nr-sider::part(sider) {
        background: #1e1b4b;
        border-right: 3px solid #7c3aed;
      }
      .sider-part-demo nr-sider::part(trigger) {
        background: #7c3aed;
        color: #ffffff;
      }
      .sider-part-demo nr-sider::part(children) {
        padding: 16px;
      }
    </style>
    <div class="sider-part-demo" style="height: 300px;">
      <nr-layout has-sider style="height: 100%;">
        <nr-sider collapsible width="220" style="height: 100%;">
          <nav style="color: #c4b5fd; font-size: 14px; line-height: 2;">
            <div>Dashboard</div>
            <div>Users</div>
            <div>Settings</div>
          </nav>
        </nr-sider>
        <nr-content>
          <p style="padding: 16px; margin: 0; font-size: 14px; color: #374151;">
            <code>::part(sider)</code> dark indigo background + purple border,
            <code>::part(trigger)</code> purple trigger,
            <code>::part(children)</code> padded content area.
          </p>
        </nr-content>
      </nr-layout>
    </div>
  `,
};
