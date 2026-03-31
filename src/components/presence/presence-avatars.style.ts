/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host { display: flex; align-items: center; }

  .presence {
    display: flex;
    align-items: center;
    padding: 0 2px;
  }

  .pa {
    position: relative;
    margin-left: -7px;
  }

  .pa:first-child {
    margin-left: 0;
  }

  .pa-avatar {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    border: 2px solid var(--nr-presence-bg, #fff);
    cursor: pointer;
    overflow: hidden;
    flex-shrink: 0;
    transition: transform 120ms;
  }

  .pa-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .pa:hover .pa-avatar {
    transform: scale(1.12);
    z-index: 2;
  }

  .pa-dot {
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    border: 2px solid var(--nr-presence-bg, #fff);
  }

  .pa-tip {
    position: absolute;
    top: calc(100% + 7px);
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a2e;
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 6px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 120ms;
    z-index: 100;
  }

  .pa-tip::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-bottom-color: #1a1a2e;
  }

  .pa:hover .pa-tip {
    opacity: 1;
  }

  .pa-extra .pa-avatar {
    background: var(--nr-presence-extra-bg, #e0e0e8);
    color: var(--nr-presence-extra-color, #5c5c7c);
    font-size: 9px;
    font-weight: 700;
    cursor: default;
  }
`;
