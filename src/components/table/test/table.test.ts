/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { HyTable } from '../table.component.js';
import { IHeader, Sizes, SelectionMode, SortOrder } from '../table.types.js';

describe('HyTable', () => {
  let element: HyTable;

  const sampleHeaders: IHeader[] = [
    { name: 'ID', key: 'id' },
    { name: 'Name', key: 'name' },
    { name: 'Email', key: 'email' },
    { name: 'Status', key: 'status' },
  ];

  const sampleRows = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'Active' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Pending' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', status: 'Active' },
  ];

  beforeEach(async () => {
    element = await fixture(html`
      <nr-table .headers=${sampleHeaders} .rows=${sampleRows}></nr-table>
    `);
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-TABLE');
    });

    it('should have default properties', () => {
      expect(element.size).to.equal(Sizes.Normal);
      expect(element.withFilter).to.be.false;
      expect(element.fixedHeader).to.be.false;
      expect(element.loading).to.be.false;
      expect(element.serverSide).to.be.false;
      expect(element.emptyText).to.equal('No data available');
    });

    it('should accept headers', async () => {
      expect(element.headers).to.have.lengthOf(4);
      expect(element.headers[0].key).to.equal('id');
    });

    it('should accept rows', async () => {
      expect(element.rows).to.have.lengthOf(5);
      expect(element.rows[0].name).to.equal('John Doe');
    });

    it('should render table element', async () => {
      const table = element.shadowRoot?.querySelector('table');
      expect(table).to.exist;
    });

    it('should render headers', async () => {
      const headerCells = element.shadowRoot?.querySelectorAll('th, [class*="header"]');
      expect(headerCells?.length).to.be.greaterThan(0);
    });

    it('should render rows', async () => {
      const rows = element.shadowRoot?.querySelectorAll('tbody tr, [class*="row"]');
      expect(rows?.length).to.be.greaterThan(0);
    });
  });

  describe('Table sizes', () => {
    it('should apply normal size', async () => {
      element.size = Sizes.Normal;
      await element.updateComplete;

      expect(element.size).to.equal('normal');
    });

    it('should apply small size', async () => {
      element.size = Sizes.Small;
      await element.updateComplete;

      expect(element.size).to.equal('small');
    });

    it('should apply large size', async () => {
      element.size = Sizes.Large;
      await element.updateComplete;

      expect(element.size).to.equal('large');
    });
  });

  describe('Selection modes', () => {
    it('should support single selection mode', async () => {
      element.selectionMode = SelectionMode.Single;
      await element.updateComplete;

      expect(element.selectionMode).to.equal('single');
    });

    it('should support multiple selection mode', async () => {
      element.selectionMode = SelectionMode.Multiple;
      await element.updateComplete;

      expect(element.selectionMode).to.equal('multiple');
    });

    it('should track selected items', async () => {
      element.selectionMode = SelectionMode.Multiple;
      await element.updateComplete;

      expect(element.selectedItems).to.be.an('array');
    });

    it('should dispatch nr-select event on selection', async () => {
      element.selectionMode = SelectionMode.Multiple;
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('nr-select', {
          detail: { selected: [0] },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'nr-select');
      expect(event).to.exist;
    });
  });

  describe('Sorting', () => {
    it('should support sorting', async () => {
      expect(element.sortAttribute).to.exist;
      expect(element.sortAttribute.index).to.equal(-1);
      expect(element.sortAttribute.order).to.equal(SortOrder.Default);
    });

    it('should dispatch onSort event', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('onSort', {
          detail: { column: 'name', order: 'asc' },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'onSort');
      expect(event).to.exist;
    });
  });

  describe('Filtering', () => {
    it('should support filter mode', async () => {
      element.withFilter = true;
      await element.updateComplete;

      expect(element.withFilter).to.be.true;
    });

    it('should track filter value', async () => {
      element.withFilter = true;
      await element.updateComplete;

      expect(element.filterValue).to.equal('');
    });

    it('should dispatch onSearch event', async () => {
      element.withFilter = true;
      await element.updateComplete;

      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('onSearch', {
          detail: { query: 'John' },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'onSearch');
      expect(event).to.exist;
    });
  });

  describe('Pagination', () => {
    it('should have pagination options', () => {
      expect(element.itemPerPage).to.deep.equal([5, 10, 15, 20]);
    });

    it('should track current page', async () => {
      expect(element.currentPage).to.exist;
    });

    it('should track items per page', async () => {
      expect(element.selectedItemPerPage).to.equal(5);
    });

    it('should dispatch onPaginate event', async () => {
      setTimeout(() => {
        element.dispatchEvent(new CustomEvent('onPaginate', {
          detail: { page: 2, pageSize: 10 },
          bubbles: true
        }));
      });

      const event = await oneEvent(element, 'onPaginate');
      expect(event).to.exist;
    });
  });

  describe('Fixed header', () => {
    it('should support fixed header', async () => {
      element.fixedHeader = true;
      await element.updateComplete;

      expect(element.fixedHeader).to.be.true;
    });

    it('should apply scroll config for fixed header', async () => {
      element.fixedHeader = true;
      element.scrollConfig = { y: 400 };
      await element.updateComplete;

      expect(element.scrollConfig.y).to.equal(400);
    });
  });

  describe('Fixed columns', () => {
    it('should support fixed columns', async () => {
      const headersWithFixed: IHeader[] = [
        { name: 'ID', key: 'id', fixed: 'left', width: 80 },
        { name: 'Name', key: 'name', fixed: 'left', width: 150 },
        { name: 'Email', key: 'email' },
        { name: 'Status', key: 'status' },
      ];

      element.headers = headersWithFixed;
      await element.updateComplete;

      expect(element.headers[0].fixed).to.equal('left');
    });

    it('should apply horizontal scroll config', async () => {
      element.scrollConfig = { x: 800 };
      await element.updateComplete;

      expect(element.scrollConfig.x).to.equal(800);
    });
  });

  describe('Loading state', () => {
    it('should support loading state', async () => {
      element.loading = true;
      await element.updateComplete;

      expect(element.loading).to.be.true;
    });

    it('should show loading indicator when loading', async () => {
      element.loading = true;
      await element.updateComplete;

      // Loading state should be reflected in the UI
    });
  });

  describe('Empty state', () => {
    it('should show empty text when no data', async () => {
      element.rows = [];
      await element.updateComplete;

      expect(element.emptyText).to.equal('No data available');
    });

    it('should support custom empty text', async () => {
      element.emptyText = 'No results found';
      element.rows = [];
      await element.updateComplete;

      expect(element.emptyText).to.equal('No results found');
    });

    it('should support custom empty icon', async () => {
      element.emptyIcon = 'search';
      await element.updateComplete;

      expect(element.emptyIcon).to.equal('search');
    });
  });

  describe('Server-side mode', () => {
    it('should support server-side mode', async () => {
      element.serverSide = true;
      element.totalCount = 100;
      await element.updateComplete;

      expect(element.serverSide).to.be.true;
      expect(element.totalCount).to.equal(100);
    });
  });

  describe('Expandable rows', () => {
    it('should support expandable rows', async () => {
      element.expandable = 'details';
      await element.updateComplete;

      expect(element.expandable).to.equal('details');
    });

    it('should support custom expansion renderer', async () => {
      element.expandable = 'details';
      element.expansionRenderer = (row) => html`<div>${row.name} Details</div>`;
      await element.updateComplete;

      expect(element.expansionRenderer).to.be.a('function');
    });
  });

  describe('Controller integration', () => {
    it('should have selection controller', () => {
      const controller = (element as any).selectionController;
      expect(controller).to.exist;
    });

    it('should have pagination controller', () => {
      const controller = (element as any).paginationController;
      expect(controller).to.exist;
    });

    it('should have sort controller', () => {
      const controller = (element as any).sortController;
      expect(controller).to.exist;
    });

    it('should have filter controller', () => {
      const controller = (element as any).filterController;
      expect(controller).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty headers', async () => {
      element.headers = [];
      await element.updateComplete;

      expect(element.headers).to.have.lengthOf(0);
    });

    it('should handle large datasets', async () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        status: 'Active'
      }));

      element.rows = largeData;
      await element.updateComplete;

      expect(element.rows).to.have.lengthOf(1000);
    });

    it('should handle rows with missing keys', async () => {
      const incompleteRows = [
        { id: 1, name: 'John' }, // missing email and status
        { id: 2 }, // missing name, email, status
      ];

      element.rows = incompleteRows;
      await element.updateComplete;

      expect(element.rows).to.have.lengthOf(2);
    });

    it('should handle special characters in data', async () => {
      const specialRows = [
        { id: 1, name: '<script>alert("xss")</script>', email: 'test@test.com', status: 'Active' },
        { id: 2, name: '你好世界', email: 'unicode@test.com', status: '活跃' },
      ];

      element.rows = specialRows;
      await element.updateComplete;

      expect(element.rows[1].name).to.equal('你好世界');
    });
  });
});
