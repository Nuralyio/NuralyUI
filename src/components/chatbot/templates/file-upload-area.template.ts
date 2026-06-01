/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, TemplateResult } from 'lit';

export interface FileUploadAreaTemplateHandlers {
  onDragEnter: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
}

export interface FileUploadAreaTemplateData {
  isDragging: boolean;
  label: string;
}

export function renderFileUploadArea(
  data: FileUploadAreaTemplateData
): TemplateResult {
  return html`
    <div
      class="file-upload-area ${data.isDragging ? 'file-upload-area--dragging' : ''}"
      part="file-upload-area"
    >
      <div class="file-upload-area__content">
        <nr-icon name="upload" size="xlarge"></nr-icon>
        <div class="file-upload-area__text">
          ${data.label}
        </div>
      </div>
    </div>
  `;
}
