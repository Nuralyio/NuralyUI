/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { EventBus } from '../event-bus.js';
import { StateHandler } from './state-handler.js';
import type { ChatbotFile, ChatbotFileType } from '../../chatbot.types.js';

/**
 * FileHandler - Handles file operations
 * Manages file uploads, removal, and file list
 */
export class FileHandler {
  constructor(
    private stateHandler: StateHandler,
    private eventBus: EventBus
  ) {}

  addFile(file: ChatbotFile): void {
    const state = this.stateHandler.getState();
    this.stateHandler.updateState({
      uploadedFiles: [...state.uploadedFiles, file]
    });
    this.eventBus.emit('file:uploaded', file);
  }

  updateFile(fileId: string, updates: Partial<ChatbotFile>): void {
    const state = this.stateHandler.getState();
    this.stateHandler.updateState({
      uploadedFiles: state.uploadedFiles.map(f =>
        f.id === fileId ? { ...f, ...updates } : f
      )
    });
  }

  removeFile(fileId: string): void {
    const state = this.stateHandler.getState();
    const removed = state.uploadedFiles.find(f => f.id === fileId);
    this.revokePreviewUrl(removed);
    this.stateHandler.updateState({
      uploadedFiles: state.uploadedFiles.filter(f => f.id !== fileId)
    });
    this.eventBus.emit('file:removed', fileId);
  }

  private revokePreviewUrl(file?: ChatbotFile): void {
    if (!file || !file.previewUrl) return;
    if (typeof URL === 'undefined' || !URL.revokeObjectURL) return;
    if (file.previewUrl.startsWith('blob:')) {
      try { URL.revokeObjectURL(file.previewUrl); } catch { /* noop */ }
    }
  }

  clearFiles(): void {
    this.stateHandler.updateState({ uploadedFiles: [] });
  }

  getUploadedFiles(): ChatbotFile[] {
    const state = this.stateHandler.getState();
    return [...state.uploadedFiles];
  }

  getFileById(fileId: string): ChatbotFile | undefined {
    const state = this.stateHandler.getState();
    return state.uploadedFiles.find(f => f.id === fileId);
  }

  /**
   * Create ChatbotFile from browser File object.
   * For images, generates a local object URL so the thumbnail
   * is visible immediately while the upload is in flight.
   */
  async createChatbotFile(file: File): Promise<ChatbotFile> {
    const chatbotFile: ChatbotFile = {
      id: this.generateId('file'),
      name: file.name,
      size: file.size,
      type: this.determineFileType(file.type),
      mimeType: file.type,
      uploadProgress: 0,
      isUploading: true
    };

    if (file.type.startsWith('image/') && typeof URL !== 'undefined' && URL.createObjectURL) {
      try {
        chatbotFile.previewUrl = URL.createObjectURL(file);
      } catch {
        // noop - preview just won't be available
      }
    }

    return chatbotFile;
  }

  private determineFileType(mimeType: string): ChatbotFileType {
    if (mimeType.startsWith('image/')) return 'image' as ChatbotFileType;
    if (mimeType.startsWith('video/')) return 'video' as ChatbotFileType;
    if (mimeType.startsWith('audio/')) return 'audio' as ChatbotFileType;
    if (mimeType.includes('pdf')) return 'pdf' as ChatbotFileType;
    if (mimeType.includes('text/')) return 'text' as ChatbotFileType;
    return 'document' as ChatbotFileType;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
