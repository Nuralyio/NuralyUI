/**
 * @license
 * Copyright 2025 Nuraly
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    nr-tag { display: inline-block; }

    nr-tag .tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: auto;
      padding: 0px 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 0.75rem;
      line-height: 1;
      color: var(--nr-text);
      background-color: var(--nr-bg);
      border: 1px solid var(--nr-border);
      border-radius: 4px;
      transition: all 0.15s ease;
      user-select: none;
    }

    nr-tag .tag--borderless { border-color: transparent; }

    nr-tag .tag--small {
      padding: 0px 6px;
      font-size: 0.625rem;
    }

    nr-tag .tag--checkable { cursor: pointer; }
    nr-tag .tag--checkable:not(.tag--disabled):hover {
      background-color: var(--nr-bg-hover);
    }
    nr-tag .tag--checkable.tag--checked {
      background-color: #e6f0ff;
      color: #0353e9;
      border-color: #a6c8ff;
    }

    nr-tag .tag--disabled { opacity: 0.6; cursor: not-allowed; }

    nr-tag .tag__icon { display: inline-flex; align-items: center; }
    nr-tag .tag__content { display: inline-flex; align-items: center; }

    nr-tag .tag__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      line-height: 1;
      padding: 0;
      border: none;
      background: transparent;
      color: currentColor;
      cursor: pointer;
      border-radius: 2px;
      transition: background-color 0.15s ease, opacity 0.15s ease;
    }
    nr-tag .tag__close:hover { background-color: var(--nr-bg-hover); }
    nr-tag .tag__close:disabled { cursor: not-allowed; opacity: 0.6; }

    @keyframes tagFadeOut { from { opacity: 1; } to { opacity: 0; } }
    nr-tag .tag--closing { animation: tagFadeOut 0.2s ease forwards; }

    nr-tag .tag--magenta { background-color: #f759ab; border-color: #f759ab; color: #fff; }
    nr-tag .tag--red { background-color: #ff4d4f; border-color: #ff4d4f; color: #fff; }
    nr-tag .tag--volcano { background-color: #fa541c; border-color: #fa541c; color: #fff; }
    nr-tag .tag--orange { background-color: #fa8c16; border-color: #fa8c16; color: #fff; }
    nr-tag .tag--gold { background-color: #faad14; border-color: #faad14; color: rgba(0,0,0,0.88); }
    nr-tag .tag--lime { background-color: #a0d911; border-color: #a0d911; color: rgba(0,0,0,0.88); }
    nr-tag .tag--green { background-color: #52c41a; border-color: #52c41a; color: #fff; }
    nr-tag .tag--cyan { background-color: #13c2c2; border-color: #13c2c2; color: #fff; }
    nr-tag .tag--blue { background-color: #1677ff; border-color: #1677ff; color: #fff; }
    nr-tag .tag--geekblue { background-color: #2f54eb; border-color: #2f54eb; color: #fff; }
    nr-tag .tag--purple { background-color: #722ed1; border-color: #722ed1; color: #fff; }

    nr-tag .tag--custom { background-color: var(--nr-tag-custom-bg); border-color: var(--nr-tag-custom-bg); color: #fff; }
  }
`;
