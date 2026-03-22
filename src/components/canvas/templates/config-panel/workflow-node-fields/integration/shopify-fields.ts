/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';
import type { KvEntryLike } from '../shared/kv-credential-utils.js';

// Import KV secret select component
import '../../../../../kv-secret-select/kv-secret-select.component.js';


const RESOURCES = [
  { value: 'ORDER', label: 'Order' },
  { value: 'DRAFT_ORDER', label: 'Draft Order' },
  { value: 'PRODUCT', label: 'Product' },
  { value: 'PRODUCT_VARIANT', label: 'Product Variant' },
  { value: 'PRODUCT_IMAGE', label: 'Product Image' },
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'INVENTORY', label: 'Inventory' },
  { value: 'FULFILLMENT', label: 'Fulfillment' },
  { value: 'COLLECTION', label: 'Collection' },
  { value: 'SMART_COLLECTION', label: 'Smart Collection' },
];

const OPERATIONS = [
  { value: 'LIST', label: 'List' },
  { value: 'READ', label: 'Read' },
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
];

const API_VERSIONS = [
  { value: '2025-01', label: '2025-01' },
  { value: '2024-10', label: '2024-10' },
  { value: '2024-07', label: '2024-07' },
  { value: '2024-04', label: '2024-04' },
  { value: '2024-01', label: '2024-01' },
  { value: '2023-10', label: '2023-10' },
];

const SORT_FIELDS = [
  { value: '', label: 'None' },
  { value: 'created_at', label: 'Created At' },
  { value: 'updated_at', label: 'Updated At' },
  { value: 'id', label: 'ID' },
];

const SORT_ORDERS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const ORDER_STATUSES = [
  { value: 'any', label: 'Any' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const FINANCIAL_STATUSES = [
  { value: 'any', label: 'Any' },
  { value: 'authorized', label: 'Authorized' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'voided', label: 'Voided' },
];

const FULFILLMENT_STATUSES = [
  { value: 'any', label: 'Any' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'partial', label: 'Partial' },
  { value: 'unshipped', label: 'Unshipped' },
  { value: 'unfulfilled', label: 'Unfulfilled' },
];

/**
 * Render Shopify node config fields
 */
export function renderShopifyFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void,
  kvEntries?: KvEntryLike[],
  onCreateKvEntry?: (detail: { keyPath: string; value: any; scope: string; isSecret: boolean }) => void,
): TemplateResult {
  const operation = (config as any).operation || 'LIST';
  const resource = (config as any).resource || 'ORDER';
  const needsId = operation === 'READ' || operation === 'UPDATE' || operation === 'DELETE';

  const providerEntries = (kvEntries || []).filter(
    e => e.keyPath.startsWith('shopify/')
  );

  const handleCreateEntry = (e: CustomEvent) => {
    if (onCreateKvEntry) {
      onCreateKvEntry(e.detail);
    }
  };

  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Connection</span>
        <span class="config-section-desc">Shopify store credentials</span>
      </div>
      <div class="config-field">
        <label>Shop Domain</label>
        <nr-input
          value=${(config as any).shopDomain || ''}
          placeholder="mystore.myshopify.com"
          @nr-input=${(e: CustomEvent) => onUpdate('shopDomain', e.detail.value)}
        ></nr-input>
        <span class="field-description">Your Shopify store domain</span>
      </div>
      <div class="config-field">
        <label>Access Token</label>
        <nr-kv-secret-select
          .provider=${'shopify'}
          .entries=${providerEntries}
          .value=${(config as any).accessTokenPath || ''}
          placeholder="Select Shopify access token..."
          @value-change=${(e: CustomEvent) => onUpdate('accessTokenPath', e.detail.value)}
          @create-entry=${handleCreateEntry}
        ></nr-kv-secret-select>
        <span class="field-description">Shopify Admin API access token from the KV secret store</span>
      </div>
      <div class="config-field">
        <label>API Version</label>
        <nr-select
          value=${(config as any).apiVersion || '2025-01'}
          @nr-change=${(e: CustomEvent) => onUpdate('apiVersion', e.detail.value)}
        >
          ${API_VERSIONS.map(v => html`
            <nr-option value=${v.value}>${v.label}</nr-option>
          `)}
        </nr-select>
        <span class="field-description">Shopify Admin API version</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Operation</span>
        <span class="config-section-desc">Resource and action to perform</span>
      </div>
      <div class="config-field">
        <label>Resource</label>
        <nr-select
          value=${(config as any).resource || 'ORDER'}
          @nr-change=${(e: CustomEvent) => onUpdate('resource', e.detail.value)}
        >
          ${RESOURCES.map(r => html`
            <nr-option value=${r.value}>${r.label}</nr-option>
          `)}
        </nr-select>
      </div>
      <div class="config-field">
        <label>Operation</label>
        <nr-select
          value=${operation}
          @nr-change=${(e: CustomEvent) => onUpdate('operation', e.detail.value)}
        >
          ${OPERATIONS.map(o => html`
            <nr-option value=${o.value}>${o.label}</nr-option>
          `)}
        </nr-select>
      </div>
      ${needsId ? html`
        <div class="config-field">
          <label>Resource ID</label>
          <nr-input
            value=${(config as any).resourceId || ''}
            placeholder="e.g., 450789469"
            @nr-input=${(e: CustomEvent) => onUpdate('resourceId', e.detail.value)}
          ></nr-input>
          <span class="field-description">ID of the specific resource. Use \${variableName} for dynamic values.</span>
        </div>
      ` : nothing}
    </div>

    ${operation === 'LIST' ? html`
      <div class="config-section">
        <div class="config-section-header">
          <span class="config-section-title">List Options</span>
          <span class="config-section-desc">Pagination, sorting, and date filters</span>
        </div>
        <div class="config-field">
          <label>Limit</label>
          <nr-input
            type="number"
            value=${String((config as any).limit ?? 50)}
            min="1"
            max="250"
            placeholder="50"
            @nr-input=${(e: CustomEvent) => onUpdate('limit', parseInt(e.detail.value, 10) || 50)}
          ></nr-input>
          <span class="field-description">Maximum number of results to return (max 250)</span>
        </div>
        <div class="config-field">
          <label>Sort By</label>
          <nr-select
            value=${(config as any).sortField || ''}
            @nr-change=${(e: CustomEvent) => onUpdate('sortField', e.detail.value)}
          >
            ${SORT_FIELDS.map(f => html`
              <nr-option value=${f.value}>${f.label}</nr-option>
            `)}
          </nr-select>
        </div>
        ${(config as any).sortField ? html`
          <div class="config-field">
            <label>Sort Order</label>
            <nr-select
              value=${(config as any).sortOrder || 'asc'}
              @nr-change=${(e: CustomEvent) => onUpdate('sortOrder', e.detail.value)}
            >
              ${SORT_ORDERS.map(o => html`
                <nr-option value=${o.value}>${o.label}</nr-option>
              `)}
            </nr-select>
          </div>
        ` : nothing}
        <div class="config-field">
          <label>Created After</label>
          <nr-input
            value=${(config as any).createdAtMin || ''}
            placeholder="2024-01-01T00:00:00Z"
            @nr-input=${(e: CustomEvent) => onUpdate('createdAtMin', e.detail.value)}
          ></nr-input>
          <span class="field-description">Filter by created_at_min (ISO 8601)</span>
        </div>
        <div class="config-field">
          <label>Updated After</label>
          <nr-input
            value=${(config as any).updatedAtMin || ''}
            placeholder="2024-01-01T00:00:00Z"
            @nr-input=${(e: CustomEvent) => onUpdate('updatedAtMin', e.detail.value)}
          ></nr-input>
          <span class="field-description">Filter by updated_at_min (ISO 8601)</span>
        </div>
        ${resource === 'ORDER' ? html`
          <div class="config-field">
            <label>Order Status</label>
            <nr-select
              value=${(config as any).orderStatus || 'any'}
              @nr-change=${(e: CustomEvent) => onUpdate('orderStatus', e.detail.value)}
            >
              ${ORDER_STATUSES.map(s => html`
                <nr-option value=${s.value}>${s.label}</nr-option>
              `)}
            </nr-select>
            <span class="field-description">Filter orders by status</span>
          </div>
          <div class="config-field">
            <label>Financial Status</label>
            <nr-select
              value=${(config as any).financialStatus || 'any'}
              @nr-change=${(e: CustomEvent) => onUpdate('financialStatus', e.detail.value)}
            >
              ${FINANCIAL_STATUSES.map(s => html`
                <nr-option value=${s.value}>${s.label}</nr-option>
              `)}
            </nr-select>
            <span class="field-description">Filter orders by financial status</span>
          </div>
          <div class="config-field">
            <label>Fulfillment Status</label>
            <nr-select
              value=${(config as any).fulfillmentStatus || 'any'}
              @nr-change=${(e: CustomEvent) => onUpdate('fulfillmentStatus', e.detail.value)}
            >
              ${FULFILLMENT_STATUSES.map(s => html`
                <nr-option value=${s.value}>${s.label}</nr-option>
              `)}
            </nr-select>
            <span class="field-description">Filter orders by fulfillment status</span>
          </div>
        ` : nothing}
        <div class="config-field">
          <label>Additional Filters (JSON)</label>
          <nr-textarea
            value=${(config as any).filters || ''}
            placeholder='{"status": "open"}'
            rows="3"
            @nr-input=${(e: CustomEvent) => onUpdate('filters', e.detail.value)}
          ></nr-textarea>
          <span class="field-description">Optional JSON query params for the Shopify API</span>
        </div>
      </div>
    ` : nothing}

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Output</span>
      </div>
      <div class="config-field">
        <label>Output Variable</label>
        <nr-input
          value=${(config as any).outputVariable || ''}
          placeholder="shopifyResult"
          @nr-input=${(e: CustomEvent) => onUpdate('outputVariable', e.detail.value)}
        ></nr-input>
        <span class="field-description">Variable name to store the Shopify response</span>
      </div>
    </div>
  `;
}
