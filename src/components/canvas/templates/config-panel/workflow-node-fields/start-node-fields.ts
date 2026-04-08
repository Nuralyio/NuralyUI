/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';

/**
 * Render Start node config fields — provides a "Start Now" button to
 * manually trigger the workflow for testing.
 */
export function renderStartNodeFields(
  onRunWorkflow?: () => void,
): TemplateResult {
  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Manual Trigger</span>
        <span class="config-section-desc">Run this workflow immediately for testing</span>
      </div>
      <div class="trigger-actions">
        <nr-button
          type="primary"
          size="small"
          .iconLeft=${'play'}
          ?disabled=${!onRunWorkflow}
          @click=${() => onRunWorkflow?.()}
        >
          Start Now
        </nr-button>
      </div>
    </div>
  `;
}
