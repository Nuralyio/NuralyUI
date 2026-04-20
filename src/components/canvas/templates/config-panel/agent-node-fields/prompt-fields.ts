/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';
import { NodeConfiguration } from '../../../workflow-canvas.types.js';
import type { CodeEditorChangeEventDetail } from '../../../../code-editor/code-editor.types.js';

/**
 * Render Prompt node fields
 */
export function renderPromptFields(
  config: NodeConfiguration,
  onUpdate: (key: string, value: unknown) => void
): TemplateResult {
  const template = (config as any).template || '';

  return html`
    <style>
      .prompt-editor-wrapper {
        position: relative;
        height: 220px;
        border: 1px solid var(--border-color, #e0e0e0);
        border-radius: 4px;
        overflow: hidden;
      }
      .prompt-editor-wrapper nr-code-editor {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        --nuraly-code-editor-height: 100%;
        --nuraly-code-editor-width: 100%;
        --nuraly-code-editor-border-radius: 4px;
        --nuraly-code-editor-border: none;
      }
    </style>
    <div class="config-field">
      <label>Template</label>
      <div class="prompt-editor-wrapper">
        <nr-code-editor
          language="javascript"
          theme="vs-dark"
          .code=${template}
          @nr-change=${(e: CustomEvent<CodeEditorChangeEventDetail>) =>
            onUpdate('template', e.detail.value)}
        ></nr-code-editor>
      </div>
      <span class="field-description">Use <code>\${variables.name}</code> or <code>\${inputs.name}</code> to reference values</span>
    </div>
  `;
}
