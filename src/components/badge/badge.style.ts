/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 12px;
    line-height: 1;
    vertical-align: middle;
  }

  .badge-wrapper {
    position: relative;
    display: inline-block;
  }

  .badge-indicator {
    top: 0;
    right: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    font-size: 12px;
    font-weight: normal;
    line-height: 20px;
    white-space: nowrap;
    text-align: center;
    background-color: #ff4d4f;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 0 1px var(--nr-bg, #ffffff);
    transition: all 0.15s ease;
  }

  .badge-indicator.small {
    min-width: 14px;
    height: 14px;
    padding: 0 4px;
    font-size: 12px;
    line-height: 14px;
    border-radius: 7px;
  }

  .badge-indicator.dot {
    min-width: 6px;
    width: 6px;
    height: 6px;
    padding: 0;
    border-radius: 50%;
  }

  .badge-standalone {
    position: relative;
    display: inline-block;
    transform: none;
  }

  .badge-status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .badge-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
  }

  .badge-status-text {
    color: var(--nr-text, #161616);
    font-size: 14px;
  }

  .badge-status-dot.success { background-color: #52c41a; }

  .badge-status-dot.processing {
    background-color: var(--nr-primary, #7c3aed);
    position: relative;
  }

  .badge-status-dot.processing::after {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 100%;
    height: 100%;
    border: 1px solid var(--nr-primary, #7c3aed);
    border-radius: 50%;
    animation: badge-processing 1.2s infinite ease-in-out;
  }

  @keyframes badge-processing {
    0% { transform: scale(0.8); opacity: 0.5; }
    100% { transform: scale(2.4); opacity: 0; }
  }

  .badge-status-dot.default { background-color: #8c8c8c; }
  .badge-status-dot.error { background-color: #ff4d4f; }
  .badge-status-dot.warning { background-color: #faad14; }

  .badge-indicator.pink { background-color: #eb2f96; }
  .badge-indicator.red { background-color: #f5222d; }
  .badge-indicator.yellow { background-color: #fadb14; color: rgba(0, 0, 0, 0.85); }
  .badge-indicator.orange { background-color: #fa8c16; }
  .badge-indicator.cyan { background-color: #13c2c2; }
  .badge-indicator.green { background-color: #52c41a; }
  .badge-indicator.blue { background-color: #1890ff; }
  .badge-indicator.purple { background-color: #722ed1; }
  .badge-indicator.geekblue { background-color: #2f54eb; }
  .badge-indicator.magenta { background-color: #eb2f96; }
  .badge-indicator.volcano { background-color: #fa541c; }
  .badge-indicator.gold { background-color: #faad14; color: rgba(0, 0, 0, 0.85); }
  .badge-indicator.lime { background-color: #a0d911; color: rgba(0, 0, 0, 0.85); }

  .badge-ribbon-wrapper { position: relative; }

  .badge-ribbon {
    position: absolute;
    top: 0.5rem;
    height: 22px;
    padding: 0 0.5rem;
    color: #fff;
    line-height: 22px;
    white-space: nowrap;
    background-color: var(--nr-primary, #7c3aed);
    border-radius: 2px;
  }

  .badge-ribbon.start { left: -0.25rem; padding-left: 0.5rem; }
  .badge-ribbon.end { right: -0.25rem; padding-right: 0.5rem; }

  .badge-ribbon::after {
    content: '';
    position: absolute;
    top: 100%;
    width: 0;
    height: 0;
    border: 4px solid transparent;
  }

  .badge-ribbon.start::after {
    left: 0;
    border-top-color: currentColor;
    border-left-color: currentColor;
    filter: brightness(0.7);
  }

  .badge-ribbon.end::after {
    right: 0;
    border-top-color: currentColor;
    border-right-color: currentColor;
    filter: brightness(0.7);
  }

  .badge-ribbon.pink { background-color: #eb2f96; }
  .badge-ribbon.red { background-color: #f5222d; }
  .badge-ribbon.yellow { background-color: #fadb14; color: rgba(0, 0, 0, 0.85); }
  .badge-ribbon.orange { background-color: #fa8c16; }
  .badge-ribbon.cyan { background-color: #13c2c2; }
  .badge-ribbon.green { background-color: #52c41a; }
  .badge-ribbon.blue { background-color: #1890ff; }
  .badge-ribbon.purple { background-color: #722ed1; }
  .badge-ribbon.geekblue { background-color: #2f54eb; }
  .badge-ribbon.magenta { background-color: #eb2f96; }
  .badge-ribbon.volcano { background-color: #fa541c; }
  .badge-ribbon.gold { background-color: #faad14; color: rgba(0, 0, 0, 0.85); }
  .badge-ribbon.lime { background-color: #a0d911; color: rgba(0, 0, 0, 0.85); }

  .badge-hidden { display: none; }

  :host([dir="rtl"]) .badge-indicator {
    right: auto;
    left: 0;
    transform: translate(-50%, -50%);
    transform-origin: 0% 0%;
  }

  :host([dir="rtl"]) .badge-ribbon.start { left: auto; right: -0.25rem; }
  :host([dir="rtl"]) .badge-ribbon.end { right: auto; left: -0.25rem; }
`;
