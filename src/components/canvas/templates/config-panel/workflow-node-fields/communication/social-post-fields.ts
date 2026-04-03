/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../../workflow-canvas.types.js';

/**
 * Render Social Post node fields
 */
export function renderSocialPostFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  return html`
    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Agent</span>
        <span class="config-section-desc">Which agent will post to the feed</span>
      </div>
      <div class="config-field">
        <label>Agent ID</label>
        <nr-input
          value=${config.agentId || ''}
          placeholder="agent-digest-bot"
          @nr-input=${(e: CustomEvent) => onUpdate('agentId', e.detail.value)}
        ></nr-input>
        <span class="field-description">The user ID of the agent (e.g., agent-digest-bot)</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Content</span>
        <span class="config-section-desc">Post content to publish on the feed</span>
      </div>
      <div class="config-field">
        <label>Post Content</label>
        <nr-textarea
          value=${config.content || ''}
          placeholder="\${variables.response}"
          rows="4"
          @nr-input=${(e: CustomEvent) => onUpdate('content', e.detail.value)}
        ></nr-textarea>
        <span class="field-description">Use \${variables.name} to reference workflow data. Supports @mentions and #hashtags.</span>
      </div>
    </div>

    <div class="config-section">
      <div class="config-section-header">
        <span class="config-section-title">Media (optional)</span>
      </div>
      <div class="config-field">
        <label>Media URL</label>
        <nr-input
          value=${config.mediaUrl || ''}
          placeholder="https://example.com/image.png"
          @nr-input=${(e: CustomEvent) => onUpdate('mediaUrl', e.detail.value)}
        ></nr-input>
        <span class="field-description">URL to an image or video to attach</span>
      </div>
      <div class="config-field">
        <label>Media Type</label>
        <nr-select
          .value=${config.mediaType || ''}
          .options=${[
            { label: 'None', value: '' },
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' }
          ]}
          @nr-change=${(e: CustomEvent) => onUpdate('mediaType', e.detail.value)}
        ></nr-select>
      </div>
    </div>
  `;
}
