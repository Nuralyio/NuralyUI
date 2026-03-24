import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import type { KvSecretEntry } from './kv-secret-select.component.js';
import '../select/index.js';
import '../input/index.js';
import '../icon/index.js';
import './index.js';

const mockEntries: KvSecretEntry[] = [
  { keyPath: 'openai/production', isSecret: true },
  { keyPath: 'openai/dev-key', isSecret: true },
  { keyPath: 'openai/test', isSecret: true },
];

const mockAnthropicEntries: KvSecretEntry[] = [
  { keyPath: 'anthropic/production', isSecret: true },
  { keyPath: 'anthropic/staging', isSecret: true },
];

const mockGoogleEntries: KvSecretEntry[] = [
  { keyPath: 'google/vertex-ai', isSecret: true },
  { keyPath: 'google/gemini-dev', isSecret: true },
];

const mockUrlEntries: KvSecretEntry[] = [
  { keyPath: 'ollama/local-server', isSecret: true },
  { keyPath: 'ollama/remote', isSecret: true },
];

const meta: Meta = {
  title: 'Specialized/KvSecretSelect',
  component: 'nr-kv-secret-select',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    provider: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: { type: 'select' }, options: ['api-key', 'url'] },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-kv-secret-select
        provider="openai"
        .entries=${mockEntries}
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
      ></nr-kv-secret-select>
    </div>
  `,
};

export const Empty: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-kv-secret-select
        provider="openai"
        .entries=${[]}
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
      ></nr-kv-secret-select>
    </div>
  `,
};

export const WithSelectedValue: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-kv-secret-select
        provider="openai"
        value="openai/production"
        .entries=${mockEntries}
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
      ></nr-kv-secret-select>
    </div>
  `,
};

export const Loading: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-kv-secret-select
        provider="openai"
        .entries=${mockEntries}
        loading
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
      ></nr-kv-secret-select>
    </div>
  `,
};

export const URLType: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-kv-secret-select
        provider="ollama"
        type="url"
        placeholder="Select URL..."
        .entries=${mockUrlEntries}
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
      ></nr-kv-secret-select>
    </div>
  `,
};

export const DifferentProviders: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <div style="width: 260px;">
        <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">OpenAI</label>
        <nr-kv-secret-select
          provider="openai"
          .entries=${mockEntries}
        ></nr-kv-secret-select>
      </div>
      <div style="width: 260px;">
        <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">Anthropic</label>
        <nr-kv-secret-select
          provider="anthropic"
          .entries=${mockAnthropicEntries}
        ></nr-kv-secret-select>
      </div>
      <div style="width: 260px;">
        <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">Google</label>
        <nr-kv-secret-select
          provider="google"
          .entries=${mockGoogleEntries}
        ></nr-kv-secret-select>
      </div>
    </div>
  `,
};
