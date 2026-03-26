import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import type { KvConnectionEntry } from './db-connection-select.component.js';
import '../select/index.js';
import '../input/index.js';
import '../icon/index.js';
import './index.js';

const mockPostgresqlEntries: KvConnectionEntry[] = [
  { keyPath: 'database/production', isSecret: true },
  { keyPath: 'database/staging', isSecret: true },
  { keyPath: 'database/dev-local', isSecret: true },
];

const mockMysqlEntries: KvConnectionEntry[] = [
  { keyPath: 'database/mysql-prod', isSecret: true },
  { keyPath: 'database/mysql-dev', isSecret: true },
];

const mockMongodbEntries: KvConnectionEntry[] = [
  { keyPath: 'database/mongo-atlas', isSecret: true },
  { keyPath: 'database/mongo-local', isSecret: true },
];

const meta: Meta = {
  title: 'Specialized/DbConnectionSelect',
  component: 'nr-db-connection-select',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    dbType: { control: { type: 'select' }, options: ['postgresql', 'mysql', 'mongodb', 'mssql', 'oracle', 'sqlite'] },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-db-connection-select
        dbType="postgresql"
        .entries=${mockPostgresqlEntries}
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
        @test-connection=${(e: CustomEvent) => console.log('test-connection', e.detail)}
      ></nr-db-connection-select>
    </div>
  `,
};

export const Empty: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-db-connection-select
        dbType="postgresql"
        .entries=${[]}
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
        @test-connection=${(e: CustomEvent) => console.log('test-connection', e.detail)}
      ></nr-db-connection-select>
    </div>
  `,
};

export const WithSelectedValue: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-db-connection-select
        dbType="postgresql"
        value="database/production"
        .entries=${mockPostgresqlEntries}
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
        @test-connection=${(e: CustomEvent) => console.log('test-connection', e.detail)}
      ></nr-db-connection-select>
    </div>
  `,
};

export const Loading: Story = {
  render: () => html`
    <div style="width: 300px;">
      <nr-db-connection-select
        dbType="postgresql"
        .entries=${mockPostgresqlEntries}
        loading
        @value-change=${(e: CustomEvent) => console.log('value-change', e.detail)}
        @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
        @test-connection=${(e: CustomEvent) => console.log('test-connection', e.detail)}
      ></nr-db-connection-select>
    </div>
  `,
};

export const DifferentDbTypes: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <div style="width: 260px;">
        <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">PostgreSQL (port 5432)</label>
        <nr-db-connection-select
          dbType="postgresql"
          .entries=${mockPostgresqlEntries}
        ></nr-db-connection-select>
      </div>
      <div style="width: 260px;">
        <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">MySQL (port 3306)</label>
        <nr-db-connection-select
          dbType="mysql"
          .entries=${mockMysqlEntries}
        ></nr-db-connection-select>
      </div>
      <div style="width: 260px;">
        <label style="display: block; margin-bottom: 4px; font-size: 13px; font-weight: 500;">MongoDB (port 27017)</label>
        <nr-db-connection-select
          dbType="mongodb"
          .entries=${mockMongodbEntries}
        ></nr-db-connection-select>
      </div>
    </div>
  `,
};

export const CreateFormOpen: Story = {
  render: () => {
    const handleRendered = (e: Event) => {
      const el = e.target as HTMLElement;
      requestAnimationFrame(() => {
        const addBtn = el.shadowRoot?.querySelector('.add-btn') as HTMLButtonElement;
        addBtn?.click();
      });
    };

    return html`
      <div style="width: 360px;">
        <nr-db-connection-select
          dbType="postgresql"
          .entries=${mockPostgresqlEntries}
          @lit-first-updated=${handleRendered}
          @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
          @test-connection=${(e: CustomEvent) => console.log('test-connection', e.detail)}
        ></nr-db-connection-select>
      </div>
    `;
  },
};

export const TestResultSuccess: Story = {
  render: () => {
    const testResult = { success: true, message: 'Connection successful — PostgreSQL 15.2' };

    return html`
      <div style="width: 360px;">
        <nr-db-connection-select
          dbType="postgresql"
          .entries=${mockPostgresqlEntries}
          .testResult=${testResult}
          @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
          @test-connection=${(e: CustomEvent) => console.log('test-connection', e.detail)}
        ></nr-db-connection-select>
      </div>
    `;
  },
};

export const TestResultError: Story = {
  render: () => {
    const testResult = { success: false, message: 'Connection refused — could not connect to localhost:5432' };

    return html`
      <div style="width: 360px;">
        <nr-db-connection-select
          dbType="postgresql"
          .entries=${mockPostgresqlEntries}
          .testResult=${testResult}
          @create-entry=${(e: CustomEvent) => console.log('create-entry', e.detail)}
          @test-connection=${(e: CustomEvent) => console.log('test-connection', e.detail)}
        ></nr-db-connection-select>
      </div>
    `;
  },
};
