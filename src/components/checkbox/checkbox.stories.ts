import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index.js';

const meta: Meta = {
  title: 'Data Entry/Checkbox',
  component: 'nr-checkbox',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is in an indeterminate state',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the checkbox',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'toggle'],
      description: 'The visual variant of the checkbox (default or toggle switch)',
    },
    value: {
      control: { type: 'text' },
      description: 'The value of the checkbox',
    },
    name: {
      control: { type: 'text' },
      description: 'The name attribute of the checkbox',
    },
    label: {
      control: { type: 'text' },
      description: 'The label text for the checkbox',
    },
    required: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is required',
    },
    autoFocus: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox should be focused when mounted',
    },
    title: {
      control: { type: 'text' },
      description: 'The title attribute (tooltip) of the checkbox',
    },
    id: {
      control: { type: 'text' },
      description: 'The ID attribute of the checkbox',
    },
    tabIndex: {
      control: { type: 'number' },
      description: 'The tab index of the checkbox',
    },
  },
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    size: 'medium',
    variant: 'default',
    value: 'checkbox-value',
    name: 'checkbox-name',
    label: 'Checkbox Label',
    required: false,
    autoFocus: false,
    title: '',
    id: '',
    tabIndex: 0,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    label: 'Default Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const Checked: Story = {
  args: {
    checked: true,
    label: 'Checked Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Indeterminate Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Disabled Checked Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

// Size variations
export const SmallSize: Story = {
  args: {
    size: 'small',
    label: 'Small Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      size="${args.size}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const MediumSize: Story = {
  args: {
    size: 'medium',
    label: 'Medium Checkbox (Default)',
  },
  render: (args) => html`
    <nr-checkbox
      size="${args.size}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const LargeSize: Story = {
  args: {
    size: 'large',
    label: 'Large Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      size="${args.size}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

// Combined states
export const DisabledIndeterminate: Story = {
  args: {
    disabled: true,
    indeterminate: true,
    label: 'Disabled Indeterminate Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

// Form attributes
export const WithFormAttributes: Story = {
  args: {
    name: 'terms',
    value: 'accepted',
    required: true,
    label: 'I accept the terms and conditions (Required)',
  },
  render: (args) => html`
    <form style="display: flex; flex-direction: column; gap: 1rem;">
      <nr-checkbox
        ?checked="${args.checked}"
        ?disabled="${args.disabled}"
        ?indeterminate="${args.indeterminate}"
        ?required="${args.required}"
        name="${args.name}"
        value="${args.value}"
      >
        ${args.label}
      </nr-checkbox>
      <button type="submit" style="align-self: flex-start;">Submit</button>
    </form>
  `,
};

// AutoFocus
export const WithAutoFocus: Story = {
  args: {
    autoFocus: true,
    label: 'Auto-focused Checkbox',
  },
  render: (args) => html`
    <nr-checkbox
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      ?autoFocus="${args.autoFocus}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

// Custom title and id
export const WithCustomAttributes: Story = {
  args: {
    id: 'custom-checkbox',
    title: 'This is a custom tooltip title',
    label: 'Checkbox with custom ID and title',
  },
  render: (args) => html`
    <nr-checkbox
      id="${args.id}"
      title="${args.title}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

// All sizes comparison
export const SizesComparison: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h3>Size Comparison</h3>
      <div style="display: flex; align-items: center; gap: 2rem;">
        <nr-checkbox size="small" checked>Small</nr-checkbox>
        <nr-checkbox size="medium" checked>Medium (Default)</nr-checkbox>
        <nr-checkbox size="large" checked>Large</nr-checkbox>
      </div>
      <div style="display: flex; align-items: center; gap: 2rem;">
        <nr-checkbox size="small" indeterminate>Small</nr-checkbox>
        <nr-checkbox size="medium" indeterminate>Medium</nr-checkbox>
        <nr-checkbox size="large" indeterminate>Large</nr-checkbox>
      </div>
      <div style="display: flex; align-items: center; gap: 2rem;">
        <nr-checkbox size="small" disabled>Small</nr-checkbox>
        <nr-checkbox size="medium" disabled>Medium</nr-checkbox>
        <nr-checkbox size="large" disabled>Large</nr-checkbox>
      </div>
    </div>
  `,
};

// Theme variations (light/dark)
export const ThemeVariations: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <div data-theme="light" style="padding: 1rem; background: #ffffff; color: #000000; border: 1px solid #e5e7eb;">
        <h4>Light Theme</h4>
        <div style="display: flex; gap: 1rem;">
          <nr-checkbox checked>Checked</nr-checkbox>
          <nr-checkbox indeterminate>Indeterminate</nr-checkbox>
          <nr-checkbox>Unchecked</nr-checkbox>
          <nr-checkbox disabled checked>Disabled</nr-checkbox>
        </div>
      </div>
      <div data-theme="dark" style="padding: 1rem; background: #1f2937; color: #ffffff; border: 1px solid #374151;">
        <h4>Dark Theme</h4>
        <div style="display: flex; gap: 1rem;">
          <nr-checkbox checked>Checked</nr-checkbox>
          <nr-checkbox indeterminate>Indeterminate</nr-checkbox>
          <nr-checkbox>Unchecked</nr-checkbox>
          <nr-checkbox disabled checked>Disabled</nr-checkbox>
        </div>
      </div>
    </div>
  `,
};

export const CheckboxGroup: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h3>Select your preferences:</h3>
      <nr-checkbox name="notifications" value="email">Email notifications</nr-checkbox>
      <nr-checkbox name="notifications" value="sms" checked>SMS notifications</nr-checkbox>
      <nr-checkbox name="notifications" value="push">Push notifications</nr-checkbox>
      <nr-checkbox name="notifications" value="newsletter" indeterminate>Newsletter subscription</nr-checkbox>
    </div>
  `,
};

// Interactive demo with event handling
export const InteractiveDemo: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h3>Interactive Checkbox Demo</h3>
      <nr-checkbox 
        @nr-change=${(e: Event) => {
          const target = e.target as HTMLInputElement;
          const output = document.getElementById('event-output');
          if (output) {
            output.textContent = `Change event: checked=${target.checked}, value=${target.value}`;
          }
        }}
        @nr-focus=${() => {
          const output = document.getElementById('focus-output');
          if (output) {
            output.textContent = 'Checkbox focused';
          }
        }}
        @nr-blur=${() => {
          const output = document.getElementById('focus-output');
          if (output) {
            output.textContent = 'Checkbox blurred';
          }
        }}
        name="interactive"
        value="demo"
      >
        Click me to trigger events
      </nr-checkbox>
      <div style="padding: 0.5rem; background: #f3f4f6; border-radius: 4px;">
        <p><strong>Change events:</strong> <span id="event-output">No events yet</span></p>
        <p><strong>Focus events:</strong> <span id="focus-output">No focus events yet</span></p>
      </div>
    </div>
  `,
};

export const ThemeIntegrationTest: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 800px;">
      <h3>Checkbox Theme Integration Test</h3>
      
      <!-- Default/Light Theme -->
      <div data-theme="default-light" style="padding: 1rem; border: 2px solid #1890ff; border-radius: 8px;">
        <h4 style="margin-top: 0; color: #1890ff;">🌞 Default Light Theme</h4>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <nr-checkbox>Default checkbox</nr-checkbox>
          <nr-checkbox checked>Checked checkbox</nr-checkbox>
          <nr-checkbox indeterminate>Indeterminate checkbox</nr-checkbox>
          <nr-checkbox disabled>Disabled checkbox</nr-checkbox>
          <nr-checkbox checked disabled>Checked disabled checkbox</nr-checkbox>
        </div>
        
        <h5>Size Variants:</h5>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <nr-checkbox size="small">Small</nr-checkbox>
          <nr-checkbox size="medium" checked>Medium</nr-checkbox>
          <nr-checkbox size="large" indeterminate>Large</nr-checkbox>
        </div>
      </div>

      <!-- Dark Theme -->
      <div data-theme="default-dark" style="padding: 1rem; border: 2px solid #177ddc; border-radius: 8px; background: #1f1f1f; color: white;">
        <h4 style="margin-top: 0; color: #177ddc;">🌙 Default Dark Theme</h4>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <nr-checkbox>Default checkbox</nr-checkbox>
          <nr-checkbox checked>Checked checkbox</nr-checkbox>
          <nr-checkbox indeterminate>Indeterminate checkbox</nr-checkbox>
          <nr-checkbox disabled>Disabled checkbox</nr-checkbox>
          <nr-checkbox checked disabled>Checked disabled checkbox</nr-checkbox>
        </div>
        
        <h5 style="color: white;">Size Variants:</h5>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <nr-checkbox size="small">Small</nr-checkbox>
          <nr-checkbox size="medium" checked>Medium</nr-checkbox>
          <nr-checkbox size="large" indeterminate>Large</nr-checkbox>
        </div>
      </div>

      <!-- Carbon Light Theme -->
      <div data-theme="carbon-light" style="padding: 1rem; border: 2px solid #0f62fe; border-radius: 4px; background: #f4f4f4;">
        <h4 style="margin-top: 0; color: #0f62fe; font-family: 'IBM Plex Sans', sans-serif;">⚡ Carbon Light Theme</h4>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <nr-checkbox>Default checkbox</nr-checkbox>
          <nr-checkbox checked>Checked checkbox</nr-checkbox>
          <nr-checkbox indeterminate>Indeterminate checkbox</nr-checkbox>
          <nr-checkbox disabled>Disabled checkbox</nr-checkbox>
          <nr-checkbox checked disabled>Checked disabled checkbox</nr-checkbox>
        </div>
        
        <h5>Size Variants:</h5>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <nr-checkbox size="small">Small</nr-checkbox>
          <nr-checkbox size="medium" checked>Medium</nr-checkbox>
          <nr-checkbox size="large" indeterminate>Large</nr-checkbox>
        </div>
      </div>

      <!-- Carbon Dark Theme -->
      <div data-theme="carbon-dark" style="padding: 1rem; border: 2px solid #0f62fe; border-radius: 4px; background: #161616; color: #f4f4f4;">
        <h4 style="margin-top: 0; color: #0f62fe; font-family: 'IBM Plex Sans', sans-serif;">🌙 Carbon Dark Theme</h4>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <nr-checkbox>Default checkbox</nr-checkbox>
          <nr-checkbox checked>Checked checkbox</nr-checkbox>
          <nr-checkbox indeterminate>Indeterminate checkbox</nr-checkbox>
          <nr-checkbox disabled>Disabled checkbox</nr-checkbox>
          <nr-checkbox checked disabled>Checked disabled checkbox</nr-checkbox>
        </div>
        
        <h5 style="color: #f4f4f4;">Size Variants:</h5>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <nr-checkbox size="small">Small</nr-checkbox>
          <nr-checkbox size="medium" checked>Medium</nr-checkbox>
          <nr-checkbox size="large" indeterminate>Large</nr-checkbox>
        </div>
      </div>

      <!-- Test Section -->
      <div style="padding: 1rem; background: #f5f5f5; border-radius: 8px;">
        <h4>Interactive Test</h4>
        <p style="font-size: 0.875rem; color: #666;">
          Click the checkboxes above to test interaction. Labels should be clickable, 
          hover states should work, and themes should apply correctly.
        </p>
        <p style="font-size: 0.875rem; color: #666;">
          <strong>Expected behavior:</strong>
        </p>
        <ul style="font-size: 0.875rem; color: #666;">
          <li><strong>Default Light:</strong> Blue checked state (#1890ff), gray borders</li>
          <li><strong>Default Dark:</strong> Gray checked state (#8c8c8c), light borders, white text</li>
          <li><strong>Carbon Light:</strong> Blue checked state (#0f62fe), square borders, IBM Plex font</li>
          <li><strong>Carbon Dark:</strong> Blue checked state (#0f62fe), light borders, IBM Plex font</li>
          <li>Checkmarks should be visible in checked state</li>
          <li>Indeterminate should show minus symbol</li>
          <li>Disabled checkboxes should appear grayed out</li>
          <li>Labels should be clickable and toggle the checkbox</li>
        </ul>
      </div>
    </div>
  `,
};

// Toggle Variant Stories
export const Toggle: Story = {
  args: {
    variant: 'toggle',
    label: 'Toggle Switch',
  },
  render: (args) => html`
    <nr-checkbox
      variant="${args.variant}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const ToggleChecked: Story = {
  args: {
    variant: 'toggle',
    checked: true,
    label: 'Toggle On',
  },
  render: (args) => html`
    <nr-checkbox
      variant="${args.variant}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const ToggleDisabled: Story = {
  args: {
    variant: 'toggle',
    disabled: true,
    label: 'Disabled Toggle',
  },
  render: (args) => html`
    <nr-checkbox
      variant="${args.variant}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const ToggleDisabledChecked: Story = {
  args: {
    variant: 'toggle',
    disabled: true,
    checked: true,
    label: 'Disabled Toggle On',
  },
  render: (args) => html`
    <nr-checkbox
      variant="${args.variant}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const ToggleSizesComparison: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <h3>Toggle Size Comparison</h3>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 2rem;">
          <nr-checkbox variant="toggle" size="small">Small Toggle</nr-checkbox>
          <nr-checkbox variant="toggle" size="small" checked>Small On</nr-checkbox>
        </div>
        <div style="display: flex; align-items: center; gap: 2rem;">
          <nr-checkbox variant="toggle" size="medium">Medium Toggle</nr-checkbox>
          <nr-checkbox variant="toggle" size="medium" checked>Medium On</nr-checkbox>
        </div>
        <div style="display: flex; align-items: center; gap: 2rem;">
          <nr-checkbox variant="toggle" size="large">Large Toggle</nr-checkbox>
          <nr-checkbox variant="toggle" size="large" checked>Large On</nr-checkbox>
        </div>
      </div>
      <h4>Disabled States</h4>
      <div style="display: flex; align-items: center; gap: 2rem;">
        <nr-checkbox variant="toggle" size="small" disabled>Small Disabled</nr-checkbox>
        <nr-checkbox variant="toggle" size="medium" disabled>Medium Disabled</nr-checkbox>
        <nr-checkbox variant="toggle" size="large" disabled>Large Disabled</nr-checkbox>
      </div>
      <div style="display: flex; align-items: center; gap: 2rem;">
        <nr-checkbox variant="toggle" size="small" disabled checked>Small On Disabled</nr-checkbox>
        <nr-checkbox variant="toggle" size="medium" disabled checked>Medium On Disabled</nr-checkbox>
        <nr-checkbox variant="toggle" size="large" disabled checked>Large On Disabled</nr-checkbox>
      </div>
    </div>
  `,
};

export const ToggleIndeterminate: Story = {
  args: {
    variant: 'toggle',
    indeterminate: true,
    label: 'Indeterminate Toggle',
  },
  render: (args) => html`
    <nr-checkbox
      variant="${args.variant}"
      ?checked="${args.checked}"
      ?disabled="${args.disabled}"
      ?indeterminate="${args.indeterminate}"
      value="${args.value}"
      name="${args.name}"
    >
      ${args.label}
    </nr-checkbox>
  `,
};

export const ToggleGroup: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h3>Settings</h3>
      <nr-checkbox variant="toggle" name="settings" value="notifications" checked>Enable notifications</nr-checkbox>
      <nr-checkbox variant="toggle" name="settings" value="darkMode">Dark mode</nr-checkbox>
      <nr-checkbox variant="toggle" name="settings" value="autoSave" checked>Auto-save</nr-checkbox>
      <nr-checkbox variant="toggle" name="settings" value="analytics" disabled>Analytics (coming soon)</nr-checkbox>
    </div>
  `,
};

export const VariantComparison: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <h3>Checkbox vs Toggle Comparison</h3>
      <div style="display: flex; gap: 4rem;">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h4>Default Checkbox</h4>
          <nr-checkbox>Unchecked</nr-checkbox>
          <nr-checkbox checked>Checked</nr-checkbox>
          <nr-checkbox indeterminate>Indeterminate</nr-checkbox>
          <nr-checkbox disabled>Disabled</nr-checkbox>
          <nr-checkbox disabled checked>Disabled Checked</nr-checkbox>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h4>Toggle Variant</h4>
          <nr-checkbox variant="toggle">Off</nr-checkbox>
          <nr-checkbox variant="toggle" checked>On</nr-checkbox>
          <nr-checkbox variant="toggle" indeterminate>Indeterminate</nr-checkbox>
          <nr-checkbox variant="toggle" disabled>Disabled</nr-checkbox>
          <nr-checkbox variant="toggle" disabled checked>Disabled On</nr-checkbox>
        </div>
      </div>
    </div>
  `,
};