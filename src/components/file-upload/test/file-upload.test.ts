/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, oneEvent, aTimeout } from '@open-wc/testing';
import { FileUpload } from '../file-upload.component.js';

describe('FileUpload', () => {
  let element: FileUpload;

  beforeEach(async () => {
    element = await fixture(html`<nr-file-upload></nr-file-upload>`);
  });

  afterEach(() => {
    // Clean up any document-level event listeners
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-FILE-UPLOAD');
    });

    it('should have default properties', () => {
      expect(element.accept).to.equal('');
      expect(element.multiple).to.be.false;
      expect(element.drag).to.be.true;
      expect(element.tip).to.equal('');
      expect(element.limit).to.equal(0);
      expect(element.preview).to.be.true;
      expect(element.generatePreviewOnUpload).to.be.false;
    });

    it('should render upload container', async () => {
      const upload = element.shadowRoot?.querySelector('.upload');
      expect(upload).to.exist;
    });

    it('should render hidden file input', async () => {
      const input = element.shadowRoot?.querySelector('input[type="file"]');
      expect(input).to.exist;
      expect(input?.classList.contains('hidden')).to.be.true;
    });

    it('should render upload button', async () => {
      const button = element.shadowRoot?.querySelector('nr-button');
      expect(button).to.exist;
    });

    it('should render file list container', async () => {
      const fileList = element.shadowRoot?.querySelector('.file-list');
      expect(fileList).to.exist;
    });
  });

  describe('Accept attribute', () => {
    it('should accept custom accept types', async () => {
      const uploader = await fixture<FileUpload>(html`
        <nr-file-upload accept=".jpg,.png,.gif"></nr-file-upload>
      `);

      expect(uploader.accept).to.equal('.jpg,.png,.gif');
    });

    it('should reflect accept in input element', async () => {
      element.accept = 'image/*';
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input.accept).to.equal('image/*');
    });
  });

  describe('Multiple files', () => {
    it('should not allow multiple by default', () => {
      expect(element.multiple).to.be.false;
    });

    it('should allow multiple when enabled', async () => {
      element.multiple = true;
      await element.updateComplete;

      const input = element.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input.multiple).to.be.true;
    });
  });

  describe('Drag and drop', () => {
    it('should enable drag by default', () => {
      expect(element.drag).to.be.true;
    });

    it('should not show drag area initially', () => {
      expect(element.showDragArea).to.be.false;
    });

    it('should track drag over state', () => {
      expect(element.isDragOver).to.be.false;
    });

    it('should show drag area on document drag enter', async () => {
      const dragEvent = new DragEvent('dragenter', { bubbles: true });
      document.dispatchEvent(dragEvent);
      await element.updateComplete;

      expect(element.showDragArea).to.be.true;
    });

    it('should render drag area when showDragArea is true', async () => {
      element.showDragArea = true;
      await element.updateComplete;

      const dragArea = element.shadowRoot?.querySelector('.upload-dragger');
      expect(dragArea).to.exist;
    });
  });

  describe('Tip text', () => {
    it('should not render tip when empty', async () => {
      element.tip = '';
      await element.updateComplete;

      const tip = element.shadowRoot?.querySelector('.upload-tip');
      expect(tip).to.not.exist;
    });

    it('should render tip when provided', async () => {
      element.tip = 'Only JPG files allowed';
      await element.updateComplete;

      const tip = element.shadowRoot?.querySelector('.upload-tip');
      expect(tip?.textContent).to.include('Only JPG files allowed');
    });
  });

  describe('File limit', () => {
    it('should have no limit by default', () => {
      expect(element.limit).to.equal(0);
    });

    it('should accept custom limit', async () => {
      element.limit = 5;
      await element.updateComplete;

      expect(element.limit).to.equal(5);
    });
  });

  describe('File list', () => {
    it('should start with empty file list', () => {
      expect(element.fileList).to.deep.equal([]);
    });

    it('should render file items when files are added', async () => {
      // Simulate adding a file to the list
      element.fileList = [{
        name: 'test.txt',
        size: '1 KB',
        raw: new File(['test'], 'test.txt', { type: 'text/plain' }),
        status: 'ready',
        percentage: 0,
        uid: 'test-uid-1',
        isImage: false
      }];
      await element.updateComplete;

      const fileItem = element.shadowRoot?.querySelector('.file-item');
      expect(fileItem).to.exist;
    });

    it('should display file name', async () => {
      element.fileList = [{
        name: 'document.pdf',
        size: '2 MB',
        raw: new File([''], 'document.pdf', { type: 'application/pdf' }),
        status: 'ready',
        percentage: 0,
        uid: 'test-uid-2',
        isImage: false
      }];
      await element.updateComplete;

      const fileName = element.shadowRoot?.querySelector('.file-name');
      expect(fileName?.textContent).to.include('document.pdf');
    });

    it('should display file size', async () => {
      element.fileList = [{
        name: 'test.txt',
        size: '5 KB',
        raw: new File([''], 'test.txt'),
        status: 'ready',
        percentage: 0,
        uid: 'test-uid-3',
        isImage: false
      }];
      await element.updateComplete;

      const fileSize = element.shadowRoot?.querySelector('.file-size');
      expect(fileSize?.textContent).to.include('5 KB');
    });
  });

  describe('File status', () => {
    it('should show success icon for completed files', async () => {
      element.fileList = [{
        name: 'test.txt',
        size: '1 KB',
        raw: new File([''], 'test.txt'),
        status: 'success',
        percentage: 100,
        uid: 'test-uid-4',
        isImage: false
      }];
      await element.updateComplete;

      const status = element.shadowRoot?.querySelector('.file-status svg');
      expect(status).to.exist;
    });

    it('should show error icon for failed files', async () => {
      element.fileList = [{
        name: 'test.txt',
        size: '1 KB',
        raw: new File([''], 'test.txt'),
        status: 'error',
        percentage: 0,
        uid: 'test-uid-5',
        isImage: false
      }];
      await element.updateComplete;

      const status = element.shadowRoot?.querySelector('.file-status svg');
      expect(status).to.exist;
    });

    it('should show percentage for uploading files', async () => {
      element.fileList = [{
        name: 'test.txt',
        size: '1 KB',
        raw: new File([''], 'test.txt'),
        status: 'uploading',
        percentage: 50,
        uid: 'test-uid-6',
        isImage: false
      }];
      await element.updateComplete;

      const status = element.shadowRoot?.querySelector('.file-status');
      expect(status?.textContent).to.include('50%');
    });

    it('should show progress bar for uploading files', async () => {
      element.fileList = [{
        name: 'test.txt',
        size: '1 KB',
        raw: new File([''], 'test.txt'),
        status: 'uploading',
        percentage: 75,
        uid: 'test-uid-7',
        isImage: false
      }];
      await element.updateComplete;

      const progressBar = element.shadowRoot?.querySelector('.progress-bar');
      expect(progressBar).to.exist;
    });
  });

  describe('Update file status', () => {
    it('should update file status programmatically', async () => {
      element.fileList = [{
        name: 'test.txt',
        size: '1 KB',
        raw: new File([''], 'test.txt'),
        status: 'ready',
        percentage: 0,
        uid: 'update-test-uid',
        isImage: false
      }];
      await element.updateComplete;

      element.updateFileStatus('update-test-uid', 'uploading', 50);
      await element.updateComplete;

      const file = element.fileList.find(f => f.uid === 'update-test-uid');
      expect(file?.status).to.equal('uploading');
      expect(file?.percentage).to.equal(50);
    });

    it('should update to success status', async () => {
      element.fileList = [{
        name: 'test.txt',
        size: '1 KB',
        raw: new File([''], 'test.txt'),
        status: 'uploading',
        percentage: 50,
        uid: 'success-test-uid',
        isImage: false
      }];

      element.updateFileStatus('success-test-uid', 'success', 100);
      await element.updateComplete;

      const file = element.fileList.find(f => f.uid === 'success-test-uid');
      expect(file?.status).to.equal('success');
    });
  });

  describe('Image files', () => {
    it('should identify image files', async () => {
      element.fileList = [{
        name: 'photo.jpg',
        size: '500 KB',
        raw: new File([''], 'photo.jpg', { type: 'image/jpeg' }),
        status: 'ready',
        percentage: 0,
        uid: 'image-uid',
        isImage: true
      }];
      await element.updateComplete;

      const file = element.fileList[0];
      expect(file.isImage).to.be.true;
    });

    it('should render preview for images with URL', async () => {
      element.preview = true;
      element.fileList = [{
        name: 'photo.jpg',
        size: '500 KB',
        raw: new File([''], 'photo.jpg', { type: 'image/jpeg' }),
        status: 'ready',
        percentage: 0,
        uid: 'preview-uid',
        isImage: true,
        url: 'data:image/jpeg;base64,/9j/4AAQ'
      }];
      await element.updateComplete;

      const preview = element.shadowRoot?.querySelector('.file-preview');
      expect(preview).to.exist;
    });

    it('should show preview icon for images', async () => {
      element.fileList = [{
        name: 'photo.jpg',
        size: '500 KB',
        raw: new File([''], 'photo.jpg', { type: 'image/jpeg' }),
        status: 'ready',
        percentage: 0,
        uid: 'icon-uid',
        isImage: true,
        url: 'data:image/jpeg;base64,/9j/4AAQ'
      }];
      await element.updateComplete;

      const previewIcon = element.shadowRoot?.querySelector('.preview-icon');
      expect(previewIcon).to.exist;
    });
  });

  describe('Preview modal', () => {
    it('should not show preview modal by default', () => {
      expect(element.previewImage).to.be.null;
    });

    it('should render preview modal when previewImage is set', async () => {
      element.previewImage = 'data:image/jpeg;base64,/9j/4AAQ';
      await element.updateComplete;

      const modal = element.shadowRoot?.querySelector('.preview-modal');
      expect(modal).to.exist;
    });

    it('should render close button in preview modal', async () => {
      element.previewImage = 'data:image/jpeg;base64,/9j/4AAQ';
      await element.updateComplete;

      const closeButton = element.shadowRoot?.querySelector('.preview-close');
      expect(closeButton).to.exist;
    });
  });

  describe('Events', () => {
    it('should dispatch files-changed event on file drop', async () => {
      const dataTransfer = new DataTransfer();
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      dataTransfer.items.add(file);

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        dataTransfer
      });

      setTimeout(() => {
        element.dispatchEvent(dropEvent);
      });

      const event = await oneEvent(element, 'files-changed');
      expect(event).to.exist;
    });

    it('should dispatch file-drop event on file drop', async () => {
      const dataTransfer = new DataTransfer();
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      dataTransfer.items.add(file);

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        dataTransfer
      });

      setTimeout(() => {
        element.dispatchEvent(dropEvent);
      });

      const event = await oneEvent(element, 'file-drop');
      expect(event).to.exist;
    });

    it('should dispatch file-remove event when file is removed', async () => {
      element.fileList = [{
        name: 'test.txt',
        size: '1 KB',
        raw: new File([''], 'test.txt'),
        status: 'ready',
        percentage: 0,
        uid: 'remove-uid',
        isImage: false
      }];
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector('.file-actions button') as HTMLButtonElement;

      setTimeout(() => {
        removeButton?.click();
      });

      const event = await oneEvent(element, 'file-remove');
      expect(event).to.exist;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty file list', async () => {
      element.fileList = [];
      await element.updateComplete;

      const fileItems = element.shadowRoot?.querySelectorAll('.file-item');
      expect(fileItems?.length).to.equal(0);
    });

    it('should handle rapid file additions', async () => {
      element.fileList = [
        { name: 'file1.txt', size: '1 KB', raw: new File([''], 'file1.txt'), status: 'ready', percentage: 0, uid: 'uid1', isImage: false },
        { name: 'file2.txt', size: '2 KB', raw: new File([''], 'file2.txt'), status: 'ready', percentage: 0, uid: 'uid2', isImage: false },
        { name: 'file3.txt', size: '3 KB', raw: new File([''], 'file3.txt'), status: 'ready', percentage: 0, uid: 'uid3', isImage: false }
      ];
      await element.updateComplete;

      const fileItems = element.shadowRoot?.querySelectorAll('.file-item');
      expect(fileItems?.length).to.equal(3);
    });

    it('should handle special characters in file names', async () => {
      element.fileList = [{
        name: 'test file (1) [copy].txt',
        size: '1 KB',
        raw: new File([''], 'test file (1) [copy].txt'),
        status: 'ready',
        percentage: 0,
        uid: 'special-uid',
        isImage: false
      }];
      await element.updateComplete;

      const fileName = element.shadowRoot?.querySelector('.file-name');
      expect(fileName?.textContent).to.include('test file (1) [copy].txt');
    });

    it('should handle unicode file names', async () => {
      element.fileList = [{
        name: '文档.txt',
        size: '1 KB',
        raw: new File([''], '文档.txt'),
        status: 'ready',
        percentage: 0,
        uid: 'unicode-uid',
        isImage: false
      }];
      await element.updateComplete;

      const fileName = element.shadowRoot?.querySelector('.file-name');
      expect(fileName?.textContent).to.include('文档.txt');
    });
  });

  describe('Accessibility', () => {
    it('should render proper file input', async () => {
      const input = element.shadowRoot?.querySelector('input[type="file"]');
      expect(input).to.exist;
    });

    it('should have clickable upload button', async () => {
      const button = element.shadowRoot?.querySelector('nr-button');
      expect(button).to.exist;
    });
  });
});
