import { css } from 'lit';

export default css`
  :host {
    display: block;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #161616;
    background-color: #ffffff;
  }

  /* Filter Container Styles */
  .filter-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 0.5rem 0;
    position: relative;
    margin-bottom: 5px;
  }

  .filter-container input {
    padding: 5px;
    padding-left: 30px;
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
    color: #000000;
  }

  .filter-container input:focus {
    outline-style: none;
    border: 1px solid #1890ff;
  }

  .filter-container .icon-container {
    height: 25px;
    width: 35px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .filter-container .search-icon {
    position: absolute;
    left: 10px;
    top: 25%;
  }

  /* Actions Bar Styles */
  .actions-container {
    background-color: #0f62fe;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    color: #ffffff;
  }

  /* Fixed Header Styles */
  .table-content-wrapper.fixed-header {
    overflow-y: auto;
    overflow-x: auto;
  }

  .table-content-wrapper.fixed-header table {
    border-collapse: separate;
    border-spacing: 0;
  }

  .table-content-wrapper.fixed-header thead {
    background-color: #fafafa;
  }

  .table-content-wrapper.fixed-header thead th {
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }

  .table-content-wrapper.fixed-header thead tr {
    box-shadow: 0 1px 0 0 #f0f0f0;
  }

  .actions-container button {
    cursor: pointer;
    border: none;
    color: #ffffff;
    background-color: #0f62fe;
  }

  .actions-container[data-size='small'] {
    padding: 5px;
  }

  .actions-container[data-size='large'] {
    padding: 15px;
  }

  /* Table Content Wrapper Styles */
  .table-content-wrapper {
    display: block;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  input[type='checkbox'][data-indeterminate='true']::after {
    width: 13px;
    height: 13px;
    background-color: #161616;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    content: '-';
  }

  /* Table Styles */
  table {
    width: 100%;
    border-spacing: 0px;
    color: #161616;
  }

  td {
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px;
    font-size: 14px;
  }

  th {
    cursor: pointer;
    padding: 10px;
    font-size: 14px;
  }

  th span {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  nr-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    --nuraly-icon-color: #161616;
  }

  tbody tr {
    background-color: #ffffff;
  }

  tbody tr:hover {
    background-color: #f5f5f5;
  }

  tbody tr.clickable {
    cursor: pointer;
  }

  thead tr {
    background-color: #fafafa;
  }

  tbody tr:has(input:checked) {
    background-color: #e6f7ff;
  }

  input,
  .expand-icon {
    cursor: pointer;
    accent-color: #1890ff;
  }

  /* Size Variants for Table Content */
  :host([size='small']) td,
  :host([size='small']) th {
    padding: 8px 16px;
    font-size: 12px;
  }

  :host([size='large']) td,
  :host([size='large']) th {
    padding: 15px;
    font-size: 16px;
  }

  /* Pagination Styles */
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    color: #161616;
  }

  .pagination-container .left-content {
    display: flex;
    align-items: center;
  }

  .pagination-container .left-content .items-details {
    border-left: 1px solid #e0e0e0;
    padding: 10px;
  }

  .pagination-container .left-content .select-details {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
  }

  .pagination-container .left-content .select-details label {
    font-size: 14px;
    color: #000000;
    white-space: nowrap;
  }

  .pagination-container .left-content .select-details nr-select {
    min-width: 60px;
    max-width: 80px;
    --select-border-color: #d9d9d9;
    --select-background: #fafafa;
    --select-text-color: #000000;
  }

  .pagination-container .right-content {
    display: flex;
    align-items: center;
    border-left: 1px solid #e0e0e0;
  }

  .pagination-container .right-content .icon-container {
    display: flex;
    align-items: center;
    border-left: 1px solid #e0e0e0;
  }

  .pagination-container .right-content .page-details {
    padding: 10px;
  }

  .pagination-container .icon-container .left-arrow,
  .pagination-container .icon-container .right-arrow {
    padding: 10px;
    --nuraly-icon-color: #161616;
  }

  .pagination-container .icon-container .left-arrow {
    border-right: 1px solid #e0e0e0;
  }

  .pagination-container nr-icon[data-enabled='false'] {
    cursor: not-allowed;
  }

  .pagination-container nr-icon[data-enabled='true'] {
    cursor: pointer;
  }

  /* Size Variants for Pagination */
  .pagination-container[data-size='small'] .left-content .items-details {
    padding: 5px;
    font-size: 12px;
  }

  .pagination-container[data-size='large'] .left-content .items-details {
    padding: 15px;
    font-size: 16px;
  }

  .pagination-container[data-size='small'] .left-content .select-details {
    padding: 5px;
    gap: 6px;
    font-size: 12px;
  }

  .pagination-container[data-size='large'] .left-content .select-details {
    padding: 15px;
    gap: 10px;
  }

  .pagination-container[data-size='small'] .right-content .page-details {
    padding: 5px;
    font-size: 12px;
  }

  .pagination-container[data-size='large'] .right-content .page-details {
    padding: 15px;
  }

  .pagination-container[data-size='small'] .icon-container .left-arrow,
  .pagination-container[data-size='small'] .icon-container .right-arrow {
    padding: 5px;
  }

  .pagination-container[data-size='large'] .icon-container .left-arrow,
  .pagination-container[data-size='large'] .icon-container .right-arrow {
    padding: 15px;
  }

  /* Column Filter Styles */
  th .th-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    position: relative;
  }

  th .th-text {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  th .filter-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .filter-trigger {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .filter-trigger:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .filter-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .filter-icon.has-filter {
    color: #1890ff;
  }

  .filter-indicator {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #1890ff;
  }

  .column-filter-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background: #ffffff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 100;
    min-width: 200px;
    padding: 8px;
  }

  .column-filter-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .column-filter-input {
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }

  .column-filter-input:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .column-filter-clear {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    align-self: flex-end;
  }

  .column-filter-clear:hover {
    color: #1890ff;
  }

  /* Fixed Columns Styles */
  th.fixed-column,
  td.fixed-column {
    position: sticky;
    background-color: #ffffff;
  }

  /* Fixed columns in header - highest priority */
  thead th.fixed-column {
    z-index: 20;
    background-color: #fafafa;
  }

  /* When table has fixed header, fixed columns in header need even higher z-index */
  .table-content-wrapper.fixed-header thead th.fixed-column {
    z-index: 25;
    background-color: #fafafa;
  }

  /* Fixed columns in body */
  tbody td.fixed-column {
    z-index: 8;
    background-color: #ffffff;
  }

  /* Ensure fixed columns in tbody have proper background */
  tbody tr td.fixed-column {
    background-color: #ffffff;
  }

  tbody tr:hover td.fixed-column {
    background-color: #f5f5f5;
  }

  th.fixed-column-left,
  td.fixed-column-left {
    left: 0;
    border-right: 1px solid #f0f0f0;
  }

  th.fixed-column-right,
  td.fixed-column-right {
    right: 0;
    border-left: 1px solid #f0f0f0;
  }

  /* Shadow effect for fixed columns */
  th.fixed-column-left::after,
  td.fixed-column-left::after {
    content: '';
    position: absolute;
    top: 0;
    right: -10px;
    bottom: 0;
    width: 10px;
    pointer-events: none;
    transition: box-shadow 0.3s;
    box-shadow: none;
  }

  .table-content-wrapper.has-scroll th.fixed-column-left::after,
  .table-content-wrapper.has-scroll td.fixed-column-left::after {
    box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
  }

  th.fixed-column-right::before,
  td.fixed-column-right::before {
    content: '';
    position: absolute;
    top: 0;
    left: -10px;
    bottom: 0;
    width: 10px;
    pointer-events: none;
    transition: box-shadow 0.3s;
    box-shadow: none;
  }

  .table-content-wrapper.has-scroll th.fixed-column-right::before,
  .table-content-wrapper.has-scroll td.fixed-column-right::before {
    box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.15);
  }

  /* ============================================ */
  /* Loading State Styles */
  /* ============================================ */
  
  /* Skeleton Loading Rows */
  .skeleton-row {
    animation: skeleton-pulse 1.5s ease-in-out infinite;
  }

  .skeleton-cell {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .skeleton-cell.selection-skeleton {
    width: 48px;
    text-align: center;
  }

  .skeleton-checkbox {
    width: 16px;
    height: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    border-radius: 2px;
    margin: 0 auto;
  }

  .skeleton-content {
    height: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
    border-radius: 4px;
    width: 80%;
  }

  @keyframes skeleton-shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @keyframes skeleton-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  /* Spinner Loading */
  .loading-row {
    background-color: #ffffff;
  }

  .loading-cell {
    padding: 2rem 1rem;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }

  .loading-spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f0f0f0;
    border-top-color: #7c3aed;
    border-radius: 50%;
    animation: spinner-rotate 0.8s linear infinite;
  }

  @keyframes spinner-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    margin: 0;
    color: #525252;
    font-size: 14px;
  }

  /* Empty State Styles */
  .empty-row {
    background: #ffffff;
  }

  .empty-row:hover {
    background: #ffffff;
  }

  .empty-cell {
    padding: 64px 24px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    color: #bfbfbf;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-icon svg {
    width: 100%;
    height: 100%;
  }

  .empty-icon nr-icon {
    font-size: 64px;
  }

  .empty-text {
    margin: 0;
    color: #525252;
    font-size: 14px;
    line-height: 1.5;
  }

  /* Expansion Row Styles */
  .expand-icon {
    text-align: center;
    vertical-align: middle;
    transition: transform 0.3s ease;
    outline: none;
  }

  .expand-icon:hover {
    background-color: #f5f5f5;
  }

  .expand-icon:focus {
    background-color: #f5f5f5;
    box-shadow: inset 0 0 0 2px #7c3aed;
  }

  .expand-icon nr-icon {
    transition: transform 0.3s ease;
  }

  .expand-icon.expanded nr-icon {
    transform: rotate(180deg);
  }

  .expansion-row {
    transition: all 0.3s ease;
  }

  .expansion-row.collapsed {
    opacity: 0;
    height: 0;
    overflow: hidden;
  }

  .expansion-row.expanded {
    opacity: 1;
    animation: slideDown 0.3s ease;
  }

  .expansion-content {
    padding: 16px;
    background-color: #fafafa;
    border-top: 1px solid #e0e0e0;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

