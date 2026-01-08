/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type {
  ChatbotProvider,
  ProviderCapabilities,
  ProviderConfig,
  ChatbotContext
} from '../core/types.js';

/**
 * Socket.IO event names configuration
 */
export interface SocketIOEvents {
  /** Event to emit when sending a message (default: 'chat:message') */
  sendMessage?: string;
  /** Event to listen for complete responses (default: 'chat:response') */
  receiveMessage?: string;
  /** Event to listen for streaming chunks (default: 'chat:chunk') */
  receiveChunk?: string;
  /** Event signaling stream end (default: 'chat:end') */
  streamEnd?: string;
  /** Event for errors (default: 'chat:error') */
  error?: string;
  /** Event to join a conversation room (default: 'conversation:join') */
  joinConversation?: string;
  /** Event to leave a conversation room (default: 'conversation:leave') */
  leaveConversation?: string;
  /** Acknowledgment of joining a conversation (default: 'conversation:joined') */
  conversationJoined?: string;
  /** Acknowledgment of leaving a conversation (default: 'conversation:left') */
  conversationLeft?: string;
  /** Event for conversation-related errors (default: 'conversation:error') */
  conversationError?: string;
  /** Event for conversation updates (default: 'conversation:event') */
  conversationEvent?: string;
}

/**
 * Socket.IO provider configuration
 */
export interface SocketIOProviderConfig extends ProviderConfig {
  /** Socket.IO server URL (required) */
  serverUrl: string;
  /** Socket.IO path (default: '/socket.io') */
  path?: string;
  /** Transport methods to use */
  transports?: ('websocket' | 'polling')[];
  /** Authentication data sent on connection */
  auth?: Record<string, any>;
  /** Custom event names */
  events?: SocketIOEvents;
  /** Enable auto-reconnection (default: true) */
  reconnection?: boolean;
  /** Maximum reconnection attempts (default: 5) */
  reconnectionAttempts?: number;
  /** Reconnection delay in ms (default: 1000) */
  reconnectionDelay?: number;
  /** Connection timeout in ms (default: 20000) */
  timeout?: number;
  /** Auto-join conversation on connect */
  autoJoinConversation?: string;
}

/**
 * Conversation event types
 */
export type ConversationEventType =
  | 'user_joined'
  | 'user_left'
  | 'conversation_updated'
  | 'conversation_deleted'
  | 'message_received';

/**
 * Conversation event data
 */
export interface ConversationEvent {
  type: ConversationEventType;
  conversationId: string;
  userId?: string;
  username?: string;
  data?: Record<string, any>;
  timestamp?: number;
}

/**
 * Join conversation response
 */
export interface JoinConversationResponse {
  conversationId: string;
  participants?: Array<{ id: string; username?: string }>;
  messages?: any[];
  metadata?: Record<string, any>;
}

/**
 * Socket.IO client interface (minimal subset we need)
 */
interface SocketIOClient {
  connected: boolean;
  id?: string;
  connect(): void;
  disconnect(): void;
  on(event: string, callback: (...args: any[]) => void): void;
  off(event: string, callback?: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  once(event: string, callback: (...args: any[]) => void): void;
}

/**
 * Socket.IO manager function type
 */
type SocketIOManagerFn = (url: string, options?: any) => SocketIOClient;

/**
 * Default event names
 */
const DEFAULT_EVENTS: Required<SocketIOEvents> = {
  sendMessage: 'chat:message',
  receiveMessage: 'chat:response',
  receiveChunk: 'chat:chunk',
  streamEnd: 'chat:end',
  error: 'chat:error',
  joinConversation: 'conversation:join',
  leaveConversation: 'conversation:leave',
  conversationJoined: 'conversation:joined',
  conversationLeft: 'conversation:left',
  conversationError: 'conversation:error',
  conversationEvent: 'conversation:event'
};

/**
 * Socket.IO Provider for real-time bidirectional communication
 *
 * @example Basic usage
 * ```typescript
 * const provider = new SocketIOProvider();
 * await provider.connect({
 *   serverUrl: 'https://your-socketio-server.com',
 *   auth: { token: 'your-auth-token' }
 * });
 * ```
 *
 * @example With conversation management
 * ```typescript
 * const provider = new SocketIOProvider();
 * await provider.connect({ serverUrl: 'https://api.example.com' });
 *
 * // Join a conversation
 * await provider.joinConversation('conv-123');
 *
 * // Listen for events
 * provider.onConversationEvent((event) => {
 *   console.log('Event:', event);
 * });
 *
 * // Leave when done
 * await provider.leaveConversation('conv-123');
 * ```
 */
export class SocketIOProvider implements ChatbotProvider {
  readonly id = 'socketio';
  readonly name = 'Socket.IO';
  readonly capabilities: ProviderCapabilities = {
    streaming: true,
    fileUpload: false,
    modules: false,
    functions: false
  };

  private socket: SocketIOClient | null = null;
  private config: SocketIOProviderConfig | null = null;
  private events: Required<SocketIOEvents> = { ...DEFAULT_EVENTS };
  private currentConversationId: string | null = null;
  private conversationEventCallbacks: Set<(event: ConversationEvent) => void> = new Set();
  private serverMessageCallbacks: Set<(message: string) => void> = new Set();
  private ioManager: SocketIOManagerFn | null = null;

  /**
   * Create a new SocketIOProvider
   * @param io - Optional Socket.IO client manager function (for dependency injection)
   */
  constructor(io?: SocketIOManagerFn) {
    this.ioManager = io || null;
  }

  /**
   * Connect to the Socket.IO server
   */
  async connect(config: SocketIOProviderConfig): Promise<void> {
    if (!config.serverUrl) {
      throw new Error('Socket.IO server URL is required');
    }

    this.config = config;
    this.events = { ...DEFAULT_EVENTS, ...config.events };

    // Get Socket.IO client
    const io = await this.getSocketIO();

    // Create socket connection
    this.socket = io(config.serverUrl, {
      path: config.path || '/socket.io',
      transports: config.transports || ['websocket', 'polling'],
      auth: config.auth,
      reconnection: config.reconnection !== false,
      reconnectionAttempts: config.reconnectionAttempts ?? 5,
      reconnectionDelay: config.reconnectionDelay ?? 1000,
      timeout: config.timeout ?? 20000
    });

    // Wait for connection
    await this.waitForConnection();

    // Set up event listeners
    this.setupEventListeners();

    // Auto-join conversation if specified
    if (config.autoJoinConversation) {
      await this.joinConversation(config.autoJoinConversation);
    }

    console.log('[SocketIOProvider] Connected to', config.serverUrl);
  }

  /**
   * Disconnect from the Socket.IO server
   */
  async disconnect(): Promise<void> {
    if (this.currentConversationId) {
      await this.leaveConversation(this.currentConversationId).catch(() => {});
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.config = null;
    this.currentConversationId = null;
    console.log('[SocketIOProvider] Disconnected');
  }

  /**
   * Check if connected to the server
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Send a message and receive streaming response
   */
  async *sendMessage(text: string, context: ChatbotContext): AsyncIterator<string> {
    if (!this.socket || !this.isConnected()) {
      yield this.formatError('Connection Error', 'Not connected to Socket.IO server');
      return;
    }

    // Create a promise-based queue for streaming chunks
    const chunks: string[] = [];
    let resolveNext: ((result: IteratorResult<string>) => void) | null = null;
    let done = false;
    let error: Error | null = null;
    let fullText = ''; // Track cumulative text for consistency with other providers

    // Chunk handler
    const onChunk = (chunk: string) => {
      fullText += chunk;
      if (resolveNext) {
        resolveNext({ value: fullText, done: false });
        resolveNext = null;
      } else {
        chunks.push(fullText);
      }
    };

    // Complete response handler (non-streaming)
    const onResponse = (response: string) => {
      fullText = response;
      if (resolveNext) {
        resolveNext({ value: fullText, done: false });
        resolveNext = null;
      } else {
        chunks.push(fullText);
      }
      done = true;
      if (resolveNext) {
        resolveNext({ value: '', done: true });
      }
    };

    // Stream end handler
    const onStreamEnd = () => {
      done = true;
      if (resolveNext) {
        resolveNext({ value: '', done: true });
      }
    };

    // Error handler
    const onError = (err: any) => {
      error = err instanceof Error ? err : new Error(err?.message || String(err));
      done = true;
      if (resolveNext) {
        resolveNext({ value: this.formatError('Server Error', error.message), done: false });
        resolveNext = null;
        // Mark done after error
        setTimeout(() => {
          if (resolveNext) {
            resolveNext({ value: '', done: true });
          }
        }, 0);
      }
    };

    // Set up listeners
    this.socket.on(this.events.receiveChunk, onChunk);
    this.socket.on(this.events.receiveMessage, onResponse);
    this.socket.on(this.events.streamEnd, onStreamEnd);
    this.socket.on(this.events.error, onError);

    try {
      // Emit the message
      this.socket.emit(this.events.sendMessage, {
        text,
        conversationId: this.currentConversationId,
        context: this.serializeContext(context)
      });

      // Yield chunks as they arrive
      while (!done) {
        if (chunks.length > 0) {
          yield chunks.shift()!;
        } else {
          const result = await new Promise<IteratorResult<string>>((resolve) => {
            resolveNext = resolve;
            // Check if we completed while waiting
            if (done) {
              resolve({ value: '', done: true });
            }
          });

          if (result.done) break;
          yield result.value;
        }
      }

      // Yield any remaining chunks
      while (chunks.length > 0) {
        yield chunks.shift()!;
      }
    } finally {
      // Clean up listeners
      this.socket?.off(this.events.receiveChunk, onChunk);
      this.socket?.off(this.events.receiveMessage, onResponse);
      this.socket?.off(this.events.streamEnd, onStreamEnd);
      this.socket?.off(this.events.error, onError);
    }
  }

  /**
   * Join a conversation/room
   * @param conversationId - The conversation ID to join
   * @param metadata - Optional metadata to send when joining
   */
  async joinConversation(
    conversationId: string,
    metadata?: Record<string, any>
  ): Promise<JoinConversationResponse> {
    if (!this.socket || !this.isConnected()) {
      throw new Error('Not connected to Socket.IO server');
    }

    // Leave current conversation if any
    if (this.currentConversationId && this.currentConversationId !== conversationId) {
      await this.leaveConversation(this.currentConversationId);
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.socket?.off(this.events.conversationJoined, onJoined);
        this.socket?.off(this.events.conversationError, onError);
        reject(new Error('Join conversation timeout'));
      }, this.config?.timeout ?? 20000);

      const onJoined = (response: JoinConversationResponse) => {
        clearTimeout(timeout);
        this.socket?.off(this.events.conversationJoined, onJoined);
        this.socket?.off(this.events.conversationError, onError);
        this.currentConversationId = conversationId;
        console.log('[SocketIOProvider] Joined conversation:', conversationId);
        resolve(response);
      };

      const onError = (err: any) => {
        clearTimeout(timeout);
        this.socket?.off(this.events.conversationJoined, onJoined);
        this.socket?.off(this.events.conversationError, onError);
        reject(new Error(err?.message || 'Failed to join conversation'));
      };

      this.socket!.on(this.events.conversationJoined, onJoined);
      this.socket!.on(this.events.conversationError, onError);

      this.socket!.emit(this.events.joinConversation, {
        conversationId,
        metadata
      });
    });
  }

  /**
   * Leave a conversation/room
   * @param conversationId - The conversation ID to leave
   */
  async leaveConversation(conversationId: string): Promise<void> {
    if (!this.socket || !this.isConnected()) {
      throw new Error('Not connected to Socket.IO server');
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.socket?.off(this.events.conversationLeft, onLeft);
        this.socket?.off(this.events.conversationError, onError);
        // Resolve anyway after timeout - server might not send acknowledgment
        if (this.currentConversationId === conversationId) {
          this.currentConversationId = null;
        }
        resolve();
      }, 5000);

      const onLeft = (response: { conversationId: string }) => {
        clearTimeout(timeout);
        this.socket?.off(this.events.conversationLeft, onLeft);
        this.socket?.off(this.events.conversationError, onError);
        if (this.currentConversationId === conversationId) {
          this.currentConversationId = null;
        }
        console.log('[SocketIOProvider] Left conversation:', conversationId);
        resolve();
      };

      const onError = (err: any) => {
        clearTimeout(timeout);
        this.socket?.off(this.events.conversationLeft, onLeft);
        this.socket?.off(this.events.conversationError, onError);
        reject(new Error(err?.message || 'Failed to leave conversation'));
      };

      this.socket!.on(this.events.conversationLeft, onLeft);
      this.socket!.on(this.events.conversationError, onError);

      this.socket!.emit(this.events.leaveConversation, { conversationId });
    });
  }

  /**
   * Get the current conversation ID
   */
  getCurrentConversation(): string | null {
    return this.currentConversationId;
  }

  /**
   * Register a callback for conversation events
   * @param callback - Function to call when a conversation event occurs
   * @returns Unsubscribe function
   */
  onConversationEvent(callback: (event: ConversationEvent) => void): () => void {
    this.conversationEventCallbacks.add(callback);
    return () => {
      this.conversationEventCallbacks.delete(callback);
    };
  }

  /**
   * Register a callback for server-initiated messages
   * @param callback - Function to call when server sends a message
   * @returns Unsubscribe function
   */
  onServerMessage(callback: (message: string) => void): () => void {
    this.serverMessageCallbacks.add(callback);
    return () => {
      this.serverMessageCallbacks.delete(callback);
    };
  }

  /**
   * Error handler
   */
  onError(error: Error): void {
    console.error('[SocketIOProvider] Error:', error);
  }

  /**
   * Get the underlying Socket.IO client (for advanced use cases)
   */
  getSocket(): SocketIOClient | null {
    return this.socket;
  }

  // ===== Private Methods =====

  /**
   * Get Socket.IO client library
   */
  private async getSocketIO(): Promise<SocketIOManagerFn> {
    if (this.ioManager) {
      return this.ioManager;
    }

    // Dynamic import of socket.io-client
    try {
      const module = await import('socket.io-client');
      return module.io || module.default;
    } catch (e) {
      throw new Error(
        'socket.io-client is not installed. Please install it: npm install socket.io-client'
      );
    }
  }

  /**
   * Wait for socket connection
   */
  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      if (this.socket.connected) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        this.socket?.off('connect', onConnect);
        this.socket?.off('connect_error', onError);
        reject(new Error('Connection timeout'));
      }, this.config?.timeout ?? 20000);

      const onConnect = () => {
        clearTimeout(timeout);
        this.socket?.off('connect', onConnect);
        this.socket?.off('connect_error', onError);
        resolve();
      };

      const onError = (err: Error) => {
        clearTimeout(timeout);
        this.socket?.off('connect', onConnect);
        this.socket?.off('connect_error', onError);
        reject(err);
      };

      this.socket.on('connect', onConnect);
      this.socket.on('connect_error', onError);
    });
  }

  /**
   * Set up event listeners for conversation events
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Conversation events
    this.socket.on(this.events.conversationEvent, (event: ConversationEvent) => {
      this.conversationEventCallbacks.forEach(cb => cb(event));
    });

    // Server-initiated messages
    this.socket.on(this.events.receiveMessage, (message: string) => {
      // Only notify if not in a streaming context
      if (this.serverMessageCallbacks.size > 0) {
        this.serverMessageCallbacks.forEach(cb => cb(message));
      }
    });

    // Connection events
    this.socket.on('disconnect', (reason: string) => {
      console.log('[SocketIOProvider] Disconnected:', reason);
      this.conversationEventCallbacks.forEach(cb => cb({
        type: 'user_left',
        conversationId: this.currentConversationId || '',
        data: { reason }
      }));
    });

    this.socket.on('reconnect', () => {
      console.log('[SocketIOProvider] Reconnected');
      // Re-join conversation if was in one
      if (this.currentConversationId) {
        this.joinConversation(this.currentConversationId).catch(err => {
          console.error('[SocketIOProvider] Failed to rejoin conversation:', err);
        });
      }
    });
  }

  /**
   * Serialize context for sending over socket
   */
  private serializeContext(context: ChatbotContext): any {
    return {
      messageCount: context.messages.length,
      recentMessages: context.messages.slice(-10).map(m => ({
        id: m.id,
        text: m.text,
        sender: m.sender,
        timestamp: m.timestamp
      })),
      selectedModules: context.selectedModules,
      threadId: context.currentThread?.id,
      metadata: context.metadata
    };
  }

  /**
   * Format error messages
   */
  private formatError(title: string, description: string): string {
    return `[ERROR_START][ERROR_TITLE_START]${title}[ERROR_TITLE_END]${description}[ERROR_END]`;
  }
}
