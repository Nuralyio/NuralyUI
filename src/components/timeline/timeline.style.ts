/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    nr-timeline {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 14px;
      line-height: 1.5715;
      color: var(--nr-text);
      min-height: 0;
    }

    nr-timeline .timeline {
      margin: 0;
      padding: 8px 0 0 8px;
      list-style: none;
    }

    nr-timeline .timeline-item {
      position: relative;
      padding-bottom: 20px;
      list-style: none;
    }
    nr-timeline .timeline-item:last-child { padding-bottom: 0; }

    /* Tail */
    nr-timeline .timeline-item-tail {
      position: absolute;
      top: 10px;
      left: 4px;
      height: calc(100% - 10px);
      border-left: 2px solid rgba(5, 5, 5, 0.06);
    }
    nr-timeline .timeline-item:last-child .timeline-item-tail { display: none; }
    nr-timeline .timeline-item.pending .timeline-item-tail { display: block; }

    /* Dot */
    nr-timeline .timeline-item-head {
      position: absolute;
      top: 5.5px;
      left: 0;
      width: 10px;
      height: 10px;
      background-color: var(--nr-bg);
      border: 2px solid transparent;
      border-radius: 50%;
    }

    nr-timeline .timeline-item-head.blue { border-color: var(--nr-primary); }
    nr-timeline .timeline-item-head.red { border-color: var(--nr-danger); }
    nr-timeline .timeline-item-head.green { border-color: var(--nr-success); }
    nr-timeline .timeline-item-head.gray { border-color: var(--nr-disabled); }

    /* Custom head (icon) */
    nr-timeline .timeline-item-head-custom {
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
    nr-timeline .timeline-item-head-custom nr-icon {
      font-size: 16px;
      vertical-align: middle;
    }

    /* Content */
    nr-timeline .timeline-item-content {
      position: relative;
      margin: 0 0 0 26px;
      word-break: break-word;
    }

    /* Label */
    nr-timeline .timeline-item-label {
      position: absolute;
      top: calc(-1 * 14px * 1.5715 / 2);
      width: calc(50% - 12px);
      text-align: right;
      color: var(--nr-text-secondary);
    }

    /* Pending */
    nr-timeline .timeline-item.pending .timeline-item-head { border-color: var(--nr-primary); }
    nr-timeline .timeline-item.pending .timeline-item-content { color: var(--nr-text-secondary); }

    /* Right mode */
    nr-timeline[mode="right"] .timeline-item-tail { left: auto; right: 4px; }
    nr-timeline[mode="right"] .timeline-item-head,
    nr-timeline[mode="right"] .timeline-item-head-custom { left: auto; right: 0; }
    nr-timeline[mode="right"] .timeline-item-head-custom { right: 5px; }
    nr-timeline[mode="right"] .timeline-item-content { margin: 0 26px 0 0; text-align: right; }

    /* Alternate mode */
    nr-timeline[mode="alternate"] .timeline,
    nr-timeline[mode="alternate"] .timeline-item { display: block; }

    nr-timeline[mode="alternate"] .timeline-item-tail,
    nr-timeline[mode="alternate"] .timeline-item-head,
    nr-timeline[mode="alternate"] .timeline-item-head-custom {
      left: 50%;
      margin-left: -1px;
    }
    nr-timeline[mode="alternate"] .timeline-item-head { margin-left: -5px; }
    nr-timeline[mode="alternate"] .timeline-item-head-custom { margin-left: -5px; }

    nr-timeline[mode="alternate"] .timeline-item-left .timeline-item-content {
      left: calc(50% - 4px);
      width: calc(50% - 14px);
      text-align: left;
    }
    nr-timeline[mode="alternate"] .timeline-item-right .timeline-item-content {
      left: auto;
      right: calc(50% - 4px);
      width: calc(50% - 14px);
      text-align: right;
    }

    nr-timeline[mode="alternate"] .timeline-item-left .timeline-item-label {
      left: calc(50% + 14px);
      width: calc(50% - 14px);
      text-align: left;
    }
    nr-timeline[mode="alternate"] .timeline-item-right .timeline-item-label {
      right: calc(50% + 14px);
      width: calc(50% - 14px);
      text-align: right;
    }

    /* Reverse */
    nr-timeline[reverse] .timeline {
      display: flex;
      flex-direction: column-reverse;
    }

    /* RTL */
    nr-timeline[dir="rtl"] .timeline-item-tail { left: auto; right: 4px; }
    nr-timeline[dir="rtl"] .timeline-item-head,
    nr-timeline[dir="rtl"] .timeline-item-head-custom { left: auto; right: 0; }
    nr-timeline[dir="rtl"] .timeline-item-content { margin: 0 26px 0 0; }
    nr-timeline[dir="rtl"] .timeline-item-label { text-align: left; }
  }
`;
