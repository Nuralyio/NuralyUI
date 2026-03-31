/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 14px;
    line-height: 1.5715;
    color: var(--nr-text, #161616);
    min-height: 0;
  }

  .timeline {
    margin: 0;
    padding: 8px 0 0 8px;
    list-style: none;
  }

  .timeline-item {
    position: relative;
    padding-bottom: 20px;
    list-style: none;
  }
  .timeline-item:last-child { padding-bottom: 0; }

  /* Tail */
  .timeline-item-tail {
    position: absolute;
    top: 10px;
    left: 4px;
    height: calc(100% - 10px);
    border-left: 2px solid rgba(5, 5, 5, 0.06);
  }
  .timeline-item:last-child .timeline-item-tail { display: none; }
  .timeline-item.pending .timeline-item-tail { display: block; }

  /* Dot */
  .timeline-item-head {
    position: absolute;
    top: 5.5px;
    left: 0;
    width: 10px;
    height: 10px;
    background-color: var(--nr-bg, #ffffff);
    border: 2px solid transparent;
    border-radius: 50%;
  }

  .timeline-item-head.blue { border-color: var(--nr-primary, #7c3aed); }
  .timeline-item-head.red { border-color: var(--nr-danger, #da1e28); }
  .timeline-item-head.green { border-color: var(--nr-success, #198038); }
  .timeline-item-head.gray { border-color: var(--nr-disabled, #c6c6c6); }

  /* Custom head (icon) */
  .timeline-item-head-custom {
    position: absolute;
    top: 10px;
    left: 5px;
    width: auto;
    height: auto;
    padding: 3px 1px;
    line-height: 1;
    text-align: center;
    border: 0;
    border-radius: 0;
    transform: translate(-50%, -50%);
  }
  .timeline-item-head-custom nr-icon {
    font-size: 16px;
    vertical-align: middle;
  }

  /* Content */
  .timeline-item-content {
    position: relative;
    margin: 0 0 0 26px;
    word-break: break-word;
  }

  /* Label */
  .timeline-item-label {
    position: absolute;
    top: calc(-1 * 14px * 1.5715 / 2);
    width: calc(50% - 12px);
    text-align: right;
    color: var(--nr-text-secondary, #525252);
  }

  /* Pending */
  .timeline-item.pending .timeline-item-head { border-color: var(--nr-primary, #7c3aed); }
  .timeline-item.pending .timeline-item-content { color: var(--nr-text-secondary, #525252); }

  /* Right mode */
  :host([mode="right"]) .timeline-item-tail { left: auto; right: 4px; }
  :host([mode="right"]) .timeline-item-head,
  :host([mode="right"]) .timeline-item-head-custom { left: auto; right: 0; }
  :host([mode="right"]) .timeline-item-head-custom { right: 5px; }
  :host([mode="right"]) .timeline-item-content { margin: 0 26px 0 0; text-align: right; }

  /* Alternate mode */
  :host([mode="alternate"]) .timeline,
  :host([mode="alternate"]) .timeline-item { display: block; }

  :host([mode="alternate"]) .timeline-item-tail,
  :host([mode="alternate"]) .timeline-item-head,
  :host([mode="alternate"]) .timeline-item-head-custom {
    left: 50%;
    margin-left: -1px;
  }
  :host([mode="alternate"]) .timeline-item-head { margin-left: -5px; }
  :host([mode="alternate"]) .timeline-item-head-custom { margin-left: -5px; }

  :host([mode="alternate"]) .timeline-item-left .timeline-item-content {
    left: calc(50% - 4px);
    width: calc(50% - 14px);
    text-align: left;
  }
  :host([mode="alternate"]) .timeline-item-right .timeline-item-content {
    left: auto;
    right: calc(50% - 4px);
    width: calc(50% - 14px);
    text-align: right;
  }

  :host([mode="alternate"]) .timeline-item-left .timeline-item-label {
    left: calc(50% + 14px);
    width: calc(50% - 14px);
    text-align: left;
  }
  :host([mode="alternate"]) .timeline-item-right .timeline-item-label {
    right: calc(50% + 14px);
    width: calc(50% - 14px);
    text-align: right;
  }

  /* Reverse */
  :host([reverse]) .timeline {
    display: flex;
    flex-direction: column-reverse;
  }

  /* RTL */
  :host([dir="rtl"]) .timeline-item-tail { left: auto; right: 4px; }
  :host([dir="rtl"]) .timeline-item-head,
  :host([dir="rtl"]) .timeline-item-head-custom { left: auto; right: 0; }
  :host([dir="rtl"]) .timeline-item-content { margin: 0 26px 0 0; }
  :host([dir="rtl"]) .timeline-item-label { text-align: left; }
`;
