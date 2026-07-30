/**
 * @license
 * Copyright 2026 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

export const styles = css`
  :host {
    /* Every colour and measure is a variable, so a host restyles the overlay
       to its own vocabulary without reaching into the shadow root. */
    --nuraly-color-overlay-scrim: rgba(23, 23, 26, 0.32);
    --nuraly-color-overlay-surface: #ffffff;
    --nuraly-color-overlay-border: #e7e7ec;
    --nuraly-color-overlay-text: #17171a;
    --nuraly-color-overlay-muted: #6b6b76;
    --nuraly-color-overlay-hover: #f4f4f6;
    --nuraly-radius-overlay: 14px;
    --nuraly-shadow-overlay: 0 24px 60px rgba(23, 23, 26, 0.22);
    --nuraly-overlay-width: min(1040px, 94vw);
    --nuraly-overlay-height: min(680px, 90vh);

    display: none;
    position: fixed;
    inset: 0;
    z-index: 40;
  }

  :host([open]) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scrim {
    position: absolute;
    inset: 0;
    background: var(--nuraly-color-overlay-scrim);
  }

  .surface {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: var(--nuraly-overlay-width);
    height: var(--nuraly-overlay-height);
    background: var(--nuraly-color-overlay-surface);
    color: var(--nuraly-color-overlay-text);
    border-radius: var(--nuraly-radius-overlay);
    box-shadow: var(--nuraly-shadow-overlay);
  }

  /* Large and full are the same panel at different scales; full gives up its
     corners and its shadow because there is nothing left behind it to sit on. */
  :host([size='large']) .surface {
    width: 96vw;
    height: 94vh;
  }

  :host([size='full']) .surface,
  :host([fullscreen]) .surface {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }

  /* Anchored to an edge: full height, and only the inner corners rounded. */
  :host([placement='right']) { justify-content: flex-end; }
  :host([placement='left']) { justify-content: flex-start; }
  :host([placement='right']) .surface,
  :host([placement='left']) .surface {
    height: 100vh;
    border-radius: 0;
  }

  header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--nuraly-color-overlay-border);
    flex: none;
  }

  .title {
    flex: 1;
    min-width: 0;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--nuraly-color-overlay-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  header button {
    background: none;
    border: 0;
    border-radius: 6px;
    padding: 4px 6px;
    font: inherit;
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
    color: var(--nuraly-color-overlay-muted);
  }

  header button:hover {
    background: var(--nuraly-color-overlay-hover);
    color: var(--nuraly-color-overlay-text);
  }

  header button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 1px;
  }

  .content {
    flex: 1;
    min-height: 0;
    display: flex;
    overflow: auto;
  }

  /* The panel arrives rather than appearing, unless the reader has asked for
     less motion — in which case it simply is there. */
  @media (prefers-reduced-motion: no-preference) {
    :host([open]) .surface {
      animation: nr-overlay-in 140ms ease-out;
    }
    @keyframes nr-overlay-in {
      from { opacity: 0; transform: translateY(6px) scale(0.995); }
      to { opacity: 1; transform: none; }
    }
  }
`;
