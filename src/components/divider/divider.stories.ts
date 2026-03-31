import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './divider.component.js';
import { DividerType, DividerOrientation, DividerVariant, DividerSize } from './divider.types.js';

const meta: Meta = {
  title: 'Components/Divider',
  component: 'nr-divider',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The direction type of divider',
      table: {
        defaultValue: { summary: 'horizontal' },
        type: { summary: 'horizontal | vertical' }
      }
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
      description: 'Line style variant',
      table: {
        defaultValue: { summary: 'solid' },
        type: { summary: 'solid | dashed | dotted' }
      }
    },
    orientation: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Position of title inside divider',
      table: {
        defaultValue: { summary: 'center' },
        type: { summary: 'start | center | end' }
      }
    },
    size: {
      control: 'select',
      options: [undefined, 'small', 'middle', 'large'],
      description: 'Size of divider (only for horizontal)',
      table: {
        type: { summary: 'small | middle | large' }
      }
    },
    orientationMargin: {
      control: 'text',
      description: 'Margin between title and closest border',
      table: {
        type: { summary: 'string | number' }
      }
    },
    plain: {
      control: 'boolean',
      description: 'Divider text show as plain style',
      table: {
        defaultValue: { summary: 'true' },
        type: { summary: 'boolean' }
      }
    },
    dashed: {
      control: 'boolean',
      description: 'Whether line is dashed (deprecated, use variant instead)',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
        category: 'Deprecated'
      }
    }
  },
  parameters: {
    docs: {
      description: {
        component: 'A divider line separates different content. Based on Ant Design Divider component.'
      }
    }
  }
};

export default meta;
type Story = StoryObj;

// Sample text for examples
const loremText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti
licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.`;

export const Horizontal: Story = {
  args: {
    type: DividerType.Horizontal
  },
  render: (args) => html`
    <div>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        variant=${args.variant || DividerVariant.Solid}
      ></nr-divider>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        variant=${args.variant || DividerVariant.Solid}
      >Text</nr-divider>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        variant=${args.variant || DividerVariant.Solid}
        orientation=${DividerOrientation.Start}
      >Left Text</nr-divider>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        variant=${args.variant || DividerVariant.Solid}
        orientation=${DividerOrientation.End}
      >Right Text</nr-divider>
      <p>${loremText}</p>
    </div>
  `
};

export const WithText: Story = {
  args: {
    type: DividerType.Horizontal,
    orientation: DividerOrientation.Center
  },
  render: (args) => html`
    <div>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        orientation=${args.orientation}
      >Text</nr-divider>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        orientation=${DividerOrientation.Start}
      >Left Text</nr-divider>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        orientation=${DividerOrientation.End}
      >Right Text</nr-divider>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        orientation=${DividerOrientation.Start}
        orientation-margin="0"
      >Left Text with 0 orientationMargin</nr-divider>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        orientation=${DividerOrientation.End}
        orientation-margin="50"
      >Right Text with 50px orientationMargin</nr-divider>
      <p>${loremText}</p>
    </div>
  `
};

export const Vertical: Story = {
  args: {
    type: DividerType.Vertical
  },
  render: (args) => html`
    <div>
      <span>Text</span>
      <nr-divider type=${args.type}></nr-divider>
      <a href="#">Link</a>
      <nr-divider type=${args.type}></nr-divider>
      <a href="#">Link</a>
    </div>
  `
};

export const PlainText: Story = {
  args: {
    plain: true
  },
  render: (args) => html`
    <div>
      <p>${loremText}</p>
      <nr-divider ?plain=${args.plain}>Text</nr-divider>
      <p>${loremText}</p>
      <nr-divider ?plain=${!args.plain}>Text</nr-divider>
      <p>${loremText}</p>
    </div>
  `
};

export const Variant: Story = {
  args: {
    variant: DividerVariant.Solid
  },
  render: (args) => html`
    <div>
      <p>${loremText}</p>
      <nr-divider variant=${DividerVariant.Solid}>Solid</nr-divider>
      <p>${loremText}</p>
      <nr-divider variant=${DividerVariant.Dotted}>Dotted</nr-divider>
      <p>${loremText}</p>
      <nr-divider variant=${DividerVariant.Dashed}>Dashed</nr-divider>
      <p>${loremText}</p>
    </div>
  `
};

export const Size: Story = {
  args: {
    size: DividerSize.Middle
  },
  render: (args) => html`
    <div>
      <p>${loremText}</p>
      <nr-divider size=${DividerSize.Small}>Small</nr-divider>
      <p>${loremText}</p>
      <nr-divider size=${DividerSize.Middle}>Middle</nr-divider>
      <p>${loremText}</p>
      <nr-divider size=${DividerSize.Large}>Large</nr-divider>
      <p>${loremText}</p>
    </div>
  `
};

export const Dashed: Story = {
  args: {
    dashed: true
  },
  render: (args) => html`
    <div>
      <p>${loremText}</p>
      <nr-divider ?dashed=${args.dashed}>Dashed (deprecated prop)</nr-divider>
      <p>${loremText}</p>
      <nr-divider variant=${DividerVariant.Dashed}>Dashed (variant prop)</nr-divider>
      <p>${loremText}</p>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'The `dashed` property is deprecated. Use `variant="dashed"` instead.'
      }
    }
  }
};

export const Playground: Story = {
  args: {
    type: DividerType.Horizontal,
    variant: DividerVariant.Solid,
    orientation: DividerOrientation.Center,
    plain: true,
    dashed: false
  },
  render: (args) => html`
    <div>
      <p>${loremText}</p>
      <nr-divider
        type=${args.type}
        variant=${args.variant}
        orientation=${args.orientation}
        ?plain=${args.plain}
        ?dashed=${args.dashed}
        orientation-margin=${args.orientationMargin || ''}
        size=${args.size || ''}
      >
        ${args.type === DividerType.Horizontal ? 'Divider Text' : ''}
      </nr-divider>
      <p>${loremText}</p>
    </div>
  `
};


export const PartOverrides: Story = {
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Override `nr-divider` styles from outside the shadow root using `::part()` selectors. No CSS variables needed — just plain CSS targeting the exposed parts.',
      },
    },
  },
  render: () => html`
    <style>
      nr-divider.thick-red::part(divider) { border-color: #e53e3e; border-top-width: 3px; }
      nr-divider.dotted-purple::part(divider) { border-color: #6c63ff; border-top-style: dotted; border-top-width: 2px; }
      nr-divider.pill-text::part(text) { color: #2d9cdb; font-weight: 700; font-size: 0.95rem; background: #ebf8ff; padding: 2px 14px; border-radius: 99px; }
    </style>
    <div style="display: flex; flex-direction: column; gap: 2rem; min-width: 400px;">
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">nr-divider.thick-red::part(divider) { border-color: #e53e3e; border-top-width: 3px; }</p>
        <nr-divider class="thick-red"></nr-divider>
      </div>
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">nr-divider.dotted-purple::part(divider) { border-color: #6c63ff; border-top-style: dotted; }</p>
        <nr-divider class="dotted-purple"></nr-divider>
      </div>
      <div>
        <p style="font-family: monospace; font-size: 0.8rem; color: #888; margin: 0 0 8px;">nr-divider.pill-text::part(text) { color: #2d9cdb; background: #ebf8ff; border-radius: 99px; }</p>
        <nr-divider class="pill-text" type="horizontal">Section Title</nr-divider>
      </div>
    </div>
  `,
};
