import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index.js';

const meta: Meta = {
  title: 'Data Display/Tag',
  component: 'nr-tag',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    color: { control: 'text' },
    bordered: { control: 'boolean' },
    size: { control: { type: 'select' }, options: ['default', 'small'] },
    closable: { control: 'boolean' },
    checkable: { control: 'boolean' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`<nr-tag>Tag</nr-tag>`,
};

export const Colors: Story = {
  render: () => html`
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      ${['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'].map(c => html`<nr-tag color=${c}>${c}</nr-tag>`)}
      <nr-tag color="#1677ff">custom</nr-tag>
    </div>
  `,
};

export const Closable: Story = {
  render: () => html`<nr-tag closable @nr-tag-close=${() => console.log('closed')}>Closable</nr-tag>`,
};

export const Checkable: Story = {
  render: () => html`
    <nr-tag checkable>Toggle me</nr-tag>
    <nr-tag checkable checked>Checked</nr-tag>
  `,
};

export const Small: Story = {
  render: () => html`<nr-tag size="small">Small</nr-tag>`,
};

export const PartOverrides: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Override `nr-tag` styles from outside the shadow root using `::part()` selectors. No CSS variables needed — just plain CSS targeting the exposed parts.',
      },
    },
  },
  render: () => html`
    <style>
      nr-tag.outlined::part(tag) { background: transparent; border: 2px solid #6c63ff; color: #6c63ff; font-weight: 600; }
      nr-tag.pill-green::part(tag) { background: #d1fae5; color: #065f46; border-color: #6ee7b7; border-radius: 99px; }
      nr-tag.icon-accent::part(icon) { color: #f59e0b; font-size: 1.1em; }
    </style>
    <div style="display: flex; flex-direction: column; gap: 2rem; align-items: flex-start;">
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">nr-tag.outlined::part(tag) { background: transparent; border: 2px solid #6c63ff; color: #6c63ff; }</p>
        <nr-tag class="outlined">Outlined Tag</nr-tag>
      </div>
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">nr-tag.pill-green::part(tag) { background: #d1fae5; color: #065f46; border-radius: 99px; }</p>
        <nr-tag class="pill-green">Pill Green</nr-tag>
      </div>
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">nr-tag.icon-accent::part(icon) { color: #f59e0b; }</p>
        <nr-tag class="icon-accent" icon="star">With Icon</nr-tag>
      </div>
    </div>
  `,
};
