/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import '../../../../../file-upload/file-upload.component.js';

/**
 * Shared file handling utilities for workflow node config panels.
 * Used by file-storage and document-loader nodes.
 */

/**
 * Handle file selection from nr-file-upload and convert to base64
 */
export function handleFileSelect(
  event: CustomEvent,
  onUpdate: (key: string, value: unknown) => void,
  updateKey: string = 'testFile',
): void {
  const files = event.detail?.files;
  if (!files || files.length === 0) return;

  const uploadFile = files[0];
  const file = uploadFile.raw as File;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result as string;
    // Extract just the base64 data (remove data:...;base64, prefix)
    const base64Data = base64.split(',')[1] || base64;

    onUpdate(updateKey, {
      filename: file.name,
      contentType: file.type,
      size: file.size,
      base64: base64Data,
    });
  };
  reader.readAsDataURL(file);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
