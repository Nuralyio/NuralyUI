/**
 * @license
 * Copyright 2024 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { io, Socket } from 'socket.io-client';
import type {
  ChatbotProvider,
  ProviderCapabilities,
  ProviderConfig,
  ChatbotContext
} from '../core/types.js';
import type { ChatbotFile } from '../chatbot.types.js';
import { ChatbotFileType } from '../chatbot.types.js';

/**
 * Workflow socket provider configuration
 */
export interface WorkflowSocketProviderConfig extends ProviderConfig {
  /** Socket.io server URL (default: window.location.origin) */
  socketUrl?: string;
  /** Socket.io path (default: /socket.io/workflow) */
  socketPath?: string;
  /** Workflow ID to trigger */
  workflowId: string;
  /** HTTP trigger endpoint template (default: /api/v1/workflows/{workflowId}/trigger/chat) */
  triggerEndpoint?: string;
  /** Custom headers for HTTP trigger */
  headers?: Record<string, string>;
  /** Response timeout in ms (default: 60000) */
  responseTimeout?: number;
  /** Build custom input payload */
  buildInput?: (text: string, context: ChatbotContext) => any;
  /** Extract final response from execution completed data */
  extractResponse?: (data: any) => string;
  /** Callback when execution starts with executionId */
  onExecutionStart?: (executionId: string, workflowId: string) => void;
  /** Callback when a chat message is received (for real-time display, including retries) */
  onMessage?: (message: string) => void;
}

/**
 * Workflow Socket Provider for chatbot
 *
 * Triggers workflows via HTTP and receives real-time updates via socket.io.
 * CHAT_OUTPUT nodes in the workflow send messages to the chatbot in real-time.
 *
 * @example Basic usage
 * ```typescript
 * const provider = new WorkflowSocketProvider();
 * await provider.connect({
 *   workflowId: 'abc-123-def'
 * });
 *
 * const controller = new ChatbotCoreController({
 *   provider
 * });
 * ```
 *
 * @example With custom input builder
 * ```typescript
 * const provider = new WorkflowSocketProvider();
 * await provider.connect({
 *   workflowId: 'abc-123-def',
 *   buildInput: (text, context) => ({
 *     message: text,
 *     threadId: context.currentThread?.id,
 *     userId: context.metadata.userId
 *   })
 * });
 * ```
 */
export class WorkflowSocketProvider implements ChatbotProvider {
  readonly id = 'workflow-socket';
  readonly name = 'Workflow Socket Provider';
  readonly capabilities: ProviderCapabilities = {
    streaming: true,
    fileUpload: true,
    modules: true,
    functions: false
  };

  protected socket: Socket | null = null;
  protected config: WorkflowSocketProviderConfig | null = null;
  protected connected: boolean = false;

  /** Called when a workflow node starts executing */
  public onNodeStarted?: (nodeName: string) => void;
  /** Called when a workflow node completes */
  public onNodeCompleted?: (nodeName: string) => void;

  // Session ID for this provider instance - used as threadId fallback for context memory
  protected readonly sessionId: string = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

  // Track active executions and their message handlers
  protected activeExecutions: Map<string, {
    messages: string[];
    resolve: (value: string) => void;
    reject: (error: Error) => void;
    completed: boolean;
  }> = new Map();

  async connect(config: WorkflowSocketProviderConfig): Promise<void> {
    if (!config.workflowId) {
      throw new Error('Workflow ID is required');
    }

    this.config = {
      socketUrl: config.socketUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000'),
      socketPath: config.socketPath || '/__nk_socketio/',
      triggerEndpoint: config.triggerEndpoint || '/api/v1/workflows/{workflowId}/trigger/chat',
      responseTimeout: config.responseTimeout || 60000,
      ...config
    };

    // Connect to the workflow socket namespace so socket.ts handler runs and
    // registers this socket in the execution bridge's subscriber map.
    const socketNs = `${this.config.socketUrl}/nk/apps/workflows/socket`;
    this.socket = io(socketNs, {
      path: this.config.socketPath,
      query: { __params: JSON.stringify({ workflowId: this.config.workflowId }) },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5
    });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 10000);

      this.socket!.on('connect', () => {
        clearTimeout(timeout);
        this.connected = true;
        console.log('[WorkflowSocketProvider] Connected:', this.socket!.id);
        // Subscribe to workflow room so the execution bridge routes events to this socket
        this.subscribeToWorkflow(this.config!.workflowId);
        resolve();
      });

      this.socket!.on('connect_error', (error) => {
        clearTimeout(timeout);
        console.error('[WorkflowSocketProvider] Connection error:', error);
        reject(error);
      });

      this.socket!.on('disconnect', (reason) => {
        this.connected = false;
        console.log('[WorkflowSocketProvider] Disconnected:', reason);
      });

      // Setup event listeners
      this.setupEventListeners();
    });
  }

  protected subscribeToWorkflow(workflowId: string): void {
    if (this.socket) {
      this.socket.emit('nk:subscribe:workflow', { workflowId });
      console.log('[WorkflowSocketProvider] Subscribed to workflow:', workflowId);
    }
  }

  protected subscribeToExecution(executionId: string): void {
    if (this.socket) {
      this.socket.emit('nk:subscribe:execution', { executionId });
      console.log('[WorkflowSocketProvider] Subscribed to execution:', executionId);
    }
  }

  protected setupEventListeners(): void {
    if (!this.socket) return;

    // Log every incoming event for diagnostics
    (this.socket as any).onAny((event: string, ...args: any[]) => {
      console.log('[WorkflowSocketProvider] RAW event:', event, args[0]);
    });

    // LumenJS wraps server→client pushes as 'nk:data' { event, data }.
    // Handle them here directly — rawSocket.emit also delivers direct events below.
    this.socket.on('nk:data', (wrapper: any) => {
      if (wrapper?.event && wrapper.data) {
        this._handleEvent(wrapper.event, wrapper.data);
      }
    });

    // Direct events emitted via rawSocket.emit(event, data) in socket.ts
    this.socket.on('execution:chat-message',  (d: any) => this._handleEvent('execution:chat-message', d));
    this.socket.on('execution:started',        (d: any) => this._handleEvent('execution:started', d));
    this.socket.on('execution:completed',      (d: any) => this._handleEvent('execution:completed', d));
    this.socket.on('execution:failed',         (d: any) => this._handleEvent('execution:failed', d));
    this.socket.on('execution:node-started',   (d: any) => this._handleEvent('execution:node-started', d));
    this.socket.on('execution:node-completed', (d: any) => this._handleEvent('execution:node-completed', d));
  }

  protected _handleEvent(event: string, data: any): void {
    switch (event) {

      case 'execution:chat-message': {
        const executionId = data.executionId;
        const message = data.message;
        console.log('[WorkflowSocketProvider] Chat message received:', executionId, message);
        if (!executionId || !message) return;
        const execution = this.activeExecutions.get(executionId);
        if (!execution) {
          this.config?.onMessage?.(message);
          return;
        }
        if (!execution.completed) execution.messages.push(message);
        break;
      }

      case 'execution:started':
        console.log('[WorkflowSocketProvider] Execution started (event):', data.executionId);
        break;

      case 'execution:completed': {
        const executionId = data.executionId;
        console.log('[WorkflowSocketProvider] Execution completed:', executionId);
        if (!executionId) return;
        const execution = this.activeExecutions.get(executionId);
        if (!execution || execution.completed) return;
        execution.completed = true;
        let finalResponse = '';
        if (this.config?.extractResponse) {
          finalResponse = this.config.extractResponse(data);
        } else if (execution.messages.length > 0) {
          finalResponse = execution.messages.join('\n\n');
        } else if (data.outputData) {
          try {
            const out = typeof data.outputData === 'string' ? JSON.parse(data.outputData) : data.outputData;
            finalResponse = out.response || out.message || out.result || JSON.stringify(out);
          } catch { finalResponse = data.outputData; }
        }
        execution.resolve(finalResponse || 'Workflow completed');
        this.activeExecutions.delete(executionId);
        break;
      }

      case 'execution:failed': {
        const executionId = data.executionId;
        const errorMessage = data.errorMessage || data.error || 'Workflow execution failed';
        console.error('[WorkflowSocketProvider] Execution failed:', executionId, errorMessage);
        if (!executionId) return;
        const execution = this.activeExecutions.get(executionId);
        if (!execution || execution.completed) return;
        execution.completed = true;
        execution.reject(new Error(errorMessage));
        this.activeExecutions.delete(executionId);
        break;
      }

      case 'execution:node-started':
        console.log('[WorkflowSocketProvider] Node started:', data.nodeName);
        if (data.nodeName) this.onNodeStarted?.(data.nodeName);
        break;

      case 'execution:node-completed':
        console.log('[WorkflowSocketProvider] Node completed:', data.nodeName);
        if (data.nodeName) this.onNodeCompleted?.(data.nodeName);
        break;
    }
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      // Unsubscribe from workflow
      if (this.config?.workflowId) {
        this.socket.emit('nk:unsubscribe:workflow', { workflowId: this.config.workflowId });
      }

      this.socket.disconnect();
      this.socket = null;
    }

    this.connected = false;
    this.activeExecutions.clear();
    console.log('[WorkflowSocketProvider] Disconnected');
  }

  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  async *sendMessage(text: string, context: ChatbotContext): AsyncIterator<string> {
    if (!this.connected || !this.socket || !this.config) {
      yield this.formatError('Not Connected', 'Socket is not connected. Please check your connection.');
      return;
    }

    try {
      // Build input payload
      const input = this.buildInput(text, context);

      // Trigger workflow via HTTP
      const triggerUrl = this.config.triggerEndpoint!.replace('{workflowId}', this.config.workflowId);
      const fullUrl = `${this.config.socketUrl}${triggerUrl}`;

      console.log('[WorkflowSocketProvider] Triggering workflow:', fullUrl, input);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        yield this.formatError(`${response.status} ${response.statusText}`, errorText);
        return;
      }

      // Get execution ID from response header or body
      const executionId = response.headers.get('X-Execution-Id') ||
                          (await response.json().catch(() => ({})))?.executionId;

      if (!executionId) {
        yield this.formatError('Execution Error', 'No execution ID received from server');
        return;
      }

      console.log('[WorkflowSocketProvider] Execution started:', executionId);

      // Notify listener about execution start
      if (this.config?.onExecutionStart) {
        this.config.onExecutionStart(executionId, this.config.workflowId);
      }

      // Subscribe to this specific execution
      this.subscribeToExecution(executionId);

      // Create a promise that will resolve when execution completes
      const resultPromise = new Promise<string>((resolve, reject) => {
        this.activeExecutions.set(executionId, {
          messages: [],
          resolve,
          reject,
          completed: false
        });

        // Timeout
        setTimeout(() => {
          const execution = this.activeExecutions.get(executionId);
          if (execution && !execution.completed) {
            execution.completed = true;
            // If we have messages, return them instead of timeout error
            if (execution.messages.length > 0) {
              resolve(execution.messages.join('\n\n'));
            } else {
              reject(new Error('Execution timeout'));
            }
            this.activeExecutions.delete(executionId);
          }
        }, this.config!.responseTimeout);
      });

      // Stream messages as they come in
      const execution = this.activeExecutions.get(executionId)!;
      let lastYieldedCount = 0;

      // Poll for new messages while waiting for completion
      const pollInterval = setInterval(() => {
        if (execution.messages.length > lastYieldedCount) {
          // New messages available - will be yielded in the loop below
          lastYieldedCount = execution.messages.length;
        }
      }, 100);

      try {
        // Yield messages as they arrive
        while (!execution.completed) {
          if (execution.messages.length > 0) {
            // Yield all accumulated messages so far
            const currentMessages = execution.messages.join('\n\n');
            yield currentMessages;
          }
          // Small delay to prevent tight loop
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        clearInterval(pollInterval);

        // Wait for final result
        const finalResult = await resultPromise;
        yield finalResult;

      } catch (error) {
        clearInterval(pollInterval);
        throw error;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      yield this.formatError('Workflow Error', errorMessage);
      this.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  protected buildInput(text: string, context: ChatbotContext): any {
    if (this.config?.buildInput) {
      return this.config.buildInput(text, context);
    }

    // Debug: log context to see if files are being passed
    console.log('[WorkflowSocketProvider] buildInput context.uploadedFiles:', context.uploadedFiles);

    // Use thread ID if available, otherwise fall back to session ID for context memory
    const threadId = context.currentThread?.id || this.sessionId;

    // Default input structure for chat workflows
    const input = {
      message: text,
      threadId,
      modules: context.selectedModules,
      metadata: context.metadata,
      files: context.uploadedFiles?.map(f => ({
        id: f.id,
        name: f.name,
        type: f.type,
        mimeType: f.mimeType,
        url: f.url,
        base64: f.metadata?.base64 // Include base64 for backend processing (OCR, etc.)
      })) || []
    };

    console.log('[WorkflowSocketProvider] buildInput threadId:', threadId, 'files count:', input.files.length);
    return input;
  }

  /**
   * Change the workflow ID (useful for switching between workflows)
   */
  setWorkflowId(workflowId: string): void {
    if (this.config) {
      // Unsubscribe from old workflow
      if (this.socket && this.config.workflowId) {
        this.socket.emit('nk:unsubscribe:workflow', { workflowId: this.config.workflowId });
      }

      this.config.workflowId = workflowId;

      // Subscribe to new workflow
      if (this.socket && this.connected) {
        this.subscribeToWorkflow(workflowId);
      }
    }
  }

  /**
   * Get the underlying socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Upload file - for workflow provider, files are sent with the message payload
   * Converts file to base64 for backend processing (e.g., OCR)
   */
  async uploadFile(file: File): Promise<ChatbotFile> {
    // Generate a local ID for the file
    const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create a local blob URL for preview purposes
    const previewUrl = URL.createObjectURL(file);

    // Convert file to base64 for backend processing
    const base64 = await this.fileToBase64(file);

    // Determine file type from mime type
    const mimeType = file.type || 'application/octet-stream';
    const fileType = this.determineFileType(mimeType);

    console.log(`[WorkflowSocketProvider] File prepared: ${file.name} (${file.size} bytes)`);

    return {
      id,
      name: file.name,
      size: file.size,
      type: fileType,
      mimeType,
      url: previewUrl, // For UI preview
      previewUrl: fileType === ChatbotFileType.Image ? previewUrl : undefined,
      uploadProgress: 100,
      metadata: {
        provider: 'workflow-socket',
        uploadedAt: new Date().toISOString(),
        base64, // Include base64 data for backend processing
      },
    };
  }

  /**
   * Convert a File to base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Determine ChatbotFileType from mime type
   */
  private determineFileType(mimeType: string): ChatbotFileType {
    if (mimeType.startsWith('image/')) return ChatbotFileType.Image;
    if (mimeType.startsWith('video/')) return ChatbotFileType.Video;
    if (mimeType.startsWith('audio/')) return ChatbotFileType.Audio;
    if (mimeType.startsWith('application/pdf') ||
        mimeType.includes('document') ||
        mimeType.startsWith('text/')) return ChatbotFileType.Document;
    if (mimeType.includes('zip') ||
        mimeType.includes('rar') ||
        mimeType.includes('tar')) return ChatbotFileType.Archive;
    if (mimeType.includes('javascript') ||
        mimeType.includes('json') ||
        mimeType.includes('xml')) return ChatbotFileType.Code;
    return ChatbotFileType.Unknown;
  }

  protected formatError(title: string, description: string): string {
    return `[ERROR_START][ERROR_TITLE_START]${title}[ERROR_TITLE_END]${description}[ERROR_END]`;
  }

  onError(error: Error): void {
    console.error('[WorkflowSocketProvider] Error:', error);
  }
}
