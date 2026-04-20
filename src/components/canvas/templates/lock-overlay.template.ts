/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { NodeLock } from '../interfaces/collaboration.interface.js';

export interface LockedNodeEntry {
  nodeId: string;
  x: number;
  y: number;
  lock: NodeLock;
}

/**
 * Renders "{displayName} is editing" pills above each remotely-locked node.
 * Rendered inside `.nodes-layer`, which is already viewport-transformed, so
 * coordinates are in canvas space — no zoom/pan math needed here.
 */
export function renderLockOverlayTemplate(entries: LockedNodeEntry[]) {
  if (entries.length === 0) return nothing;
  return entries.map(({ nodeId, x, y, lock }) => {
    const pillStyles = {
      left: `${x}px`,
      top: `${y - 28}px`,
      background: lock.color,
    };
    return html`
      <div class="node-lock-pill" data-for-node-id=${nodeId} style=${styleMap(pillStyles)}>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>${lock.displayName} is editing</span>
      </div>
    `;
  });
}
