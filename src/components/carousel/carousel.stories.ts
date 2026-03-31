import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index.js';
import '../button/index.js';

const meta: Meta = {
  title: 'Data Display/Carousel',
  component: 'hy-carousel',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    autoPlay: {
      control: { type: 'boolean' },
      description: 'Enable automatic slide rotation',
    },
    autoplaySpeed: {
      control: { type: 'number' },
      description: 'Auto-play interval in milliseconds',
    },
    currentIndex: {
      control: { type: 'number' },
      description: 'Currently active slide index',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    autoPlay: false,
    autoplaySpeed: 3000,
    currentIndex: 0,
  },
  render: (args) => html`
    <hy-carousel
      ?autoPlay=${args.autoPlay}
      .autoplaySpeed=${args.autoplaySpeed}
      style="width: 400px; height: 200px; position: relative;"
    >
      <div style="background: #7c3aed; color: white; display: flex; align-items: center; justify-content: center; height: 160px; font-size: 1.5rem;">Slide 1</div>
      <div style="background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; height: 160px; font-size: 1.5rem;">Slide 2</div>
      <div style="background: #16a34a; color: white; display: flex; align-items: center; justify-content: center; height: 160px; font-size: 1.5rem;">Slide 3</div>
    </hy-carousel>
  `,
};

export const AutoPlay: Story = {
  args: {
    autoPlay: true,
    autoplaySpeed: 2000,
  },
  render: (args) => html`
    <hy-carousel
      ?autoPlay=${args.autoPlay}
      .autoplaySpeed=${args.autoplaySpeed}
      style="width: 400px; height: 200px; position: relative;"
    >
      <div style="background: #dc2626; color: white; display: flex; align-items: center; justify-content: center; height: 160px; font-size: 1.5rem;">Auto 1</div>
      <div style="background: #d97706; color: white; display: flex; align-items: center; justify-content: center; height: 160px; font-size: 1.5rem;">Auto 2</div>
      <div style="background: #0891b2; color: white; display: flex; align-items: center; justify-content: center; height: 160px; font-size: 1.5rem;">Auto 3</div>
    </hy-carousel>
  `,
};

export const PartOverrides: Story = {
  render: () => html`
    <style>
      .part-demo hy-carousel::part(carousel) {
        border: 3px solid #7c3aed;
        border-radius: 16px;
        overflow: hidden;
      }
      .part-demo hy-carousel::part(dots) {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        padding: 4px 8px;
      }
      .part-demo hy-carousel::part(controls) {
        padding: 0 8px;
      }
    </style>
    <div class="part-demo" style="width: 420px; position: relative;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #555;">
        Styled via <code>::part()</code> — purple border/radius on carousel, tinted dot bar.
      </p>
      <hy-carousel style="width: 400px; height: 220px; position: relative;">
        <div style="background: #7c3aed; color: white; display: flex; align-items: center; justify-content: center; height: 180px; font-size: 1.5rem;">Slide A</div>
        <div style="background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; height: 180px; font-size: 1.5rem;">Slide B</div>
        <div style="background: #16a34a; color: white; display: flex; align-items: center; justify-content: center; height: 180px; font-size: 1.5rem;">Slide C</div>
      </hy-carousel>
    </div>
  `,
};
