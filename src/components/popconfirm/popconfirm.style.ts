import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
  }

  .popconfirm-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
    min-width: 200px;
    max-width: 400px;
  }

  .popconfirm-message {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .popconfirm-icon {
    flex-shrink: 0;
    font-size: 16px;
    line-height: 1.5;
    margin-top: 2px;
  }

  .popconfirm-icon--warning {
    color: #f1c21b;
  }

  .popconfirm-icon--question {
    color: #0043ce;
  }

  .popconfirm-icon--info {
    color: #0043ce;
  }

  .popconfirm-icon--error {
    color: #dc2626;
  }

  .popconfirm-icon--success {
    color: #198038;
  }

  .popconfirm-icon--custom {
    color: #161616;
  }

  .popconfirm-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .popconfirm-title {
    color: #161616;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;
    margin: 0;
  }

  .popconfirm-description {
    color: #525252;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
  }

  .popconfirm-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
  }

  .popconfirm-button {
    padding: 4px 15px;
    font-size: 0.875rem;
    border-radius: 6px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 400;
    line-height: 1.5;
    white-space: nowrap;
    user-select: none;
  }

  .popconfirm-button:focus-visible {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
  }

  .popconfirm-button--cancel {
    background: #ffffff;
    color: #161616;
    border-color: #e0e0e0;
  }

  .popconfirm-button--cancel:hover:not(:disabled) {
    background: #f4f4f4;
    color: #161616;
    border-color: #c6c6c6;
  }

  .popconfirm-button--ok-primary {
    background: #7c3aed;
    color: #ffffff;
    border-color: #7c3aed;
  }

  .popconfirm-button--ok-primary:hover:not(:disabled) {
    background: #6d28d9;
    color: #ffffff;
    border-color: #6d28d9;
  }

  .popconfirm-button--ok-danger {
    background: #dc2626;
    color: #ffffff;
    border-color: #dc2626;
  }

  .popconfirm-button--ok-danger:hover:not(:disabled) {
    background: #b91c1c;
    color: #ffffff;
    border-color: #b91c1c;
  }

  .popconfirm-button--ok-secondary {
    background: transparent;
    color: #7c3aed;
    border-color: #7c3aed;
  }

  .popconfirm-button--ok-secondary:hover:not(:disabled) {
    background: #f4f0fd;
    color: #6d28d9;
    border-color: #6d28d9;
  }

  .popconfirm-button--ok-default {
    background: #ffffff;
    color: #161616;
    border-color: #e0e0e0;
  }

  .popconfirm-button--ok-default:hover:not(:disabled) {
    background: #f4f4f4;
    color: #161616;
    border-color: #c6c6c6;
  }

  .popconfirm-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .popconfirm-button--loading {
    position: relative;
    pointer-events: none;
  }

  .popconfirm-button--loading::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 14px;
    height: 14px;
    margin-left: -7px;
    margin-top: -7px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: popconfirm-spin 0.6s linear infinite;
  }

  .popconfirm-button--loading > * {
    visibility: hidden;
  }

  @keyframes popconfirm-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* RTL Support */
  :host([dir='rtl']) .popconfirm-message {
    direction: rtl;
  }

  :host([dir='rtl']) .popconfirm-buttons {
    flex-direction: row-reverse;
  }
`;
