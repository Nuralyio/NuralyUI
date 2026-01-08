/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { SocketIOEvents, ConversationEvent } from './socketio-provider.js';
import { SocketIOProvider } from './socketio-provider.js';
import { ChatbotCoreController } from '../core/chatbot-core.controller.js';
import type { ChatbotSuggestion } from '../chatbot.types.js';

// Import components
import '../../input/input.component.js';
import '../../button/button.component.js';
import '../../icon/icon.component.js';
import '../../dropdown/dropdown.component.js';
import '../../select/select.component.js';
import '../../tag/tag.component.js';
import '../../modal/modal.component.js';
import '../chatbot.component.js';

// ===== MOCK SOCKET.IO CLIENT =====

/**
 * Mock Socket.IO client for Storybook demonstrations
 * Simulates a real Socket.IO server with streaming responses
 */
class MockSocketIOClient {
  connected = false;
  id = 'mock-socket-' + Math.random().toString(36).substr(2, 9);

  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private events: Required<SocketIOEvents>;
  private currentConversation: string | null = null;
  private config: MockSocketIOConfig;

  constructor(
    private url: string,
    private options: any = {},
    config: MockSocketIOConfig = {}
  ) {
    this.events = {
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
      conversationEvent: 'conversation:event',
      ...options?.events
    };
    this.config = {
      streamingDelay: 30,
      responseDelay: 500,
      streaming: true,
      ...config
    };
  }

  connect(): void {
    setTimeout(() => {
      this.connected = true;
      this.emit('connect');
    }, 100);
  }

  disconnect(): void {
    this.connected = false;
    this.emit('disconnect', 'client disconnect');
  }

  on(event: string, callback: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
    } else {
      this.listeners.delete(event);
    }
  }

  once(event: string, callback: (...args: any[]) => void): void {
    const wrapper = (...args: any[]) => {
      this.off(event, wrapper);
      callback(...args);
    };
    this.on(event, wrapper);
  }

  emit(event: string, ...args: any[]): void {
    // Handle internal events
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(...args));
    }

    // Handle client-to-server events (simulate server response)
    this.handleClientEvent(event, args[0]);
  }

  private handleClientEvent(event: string, data: any): void {
    switch (event) {
      case this.events.sendMessage:
        this.handleSendMessage(data);
        break;
      case this.events.joinConversation:
        this.handleJoinConversation(data);
        break;
      case this.events.leaveConversation:
        this.handleLeaveConversation(data);
        break;
    }
  }

  private handleSendMessage(data: { text: string; conversationId?: string }): void {
    const response = this.generateResponse(data.text);

    setTimeout(() => {
      if (this.config.streaming) {
        // Stream the response character by character
        let index = 0;
        const streamInterval = setInterval(() => {
          if (index < response.length) {
            const chunk = response.slice(index, index + 3);
            index += 3;
            this.emitToListeners(this.events.receiveChunk, chunk);
          } else {
            clearInterval(streamInterval);
            this.emitToListeners(this.events.streamEnd);
          }
        }, this.config.streamingDelay);
      } else {
        // Send complete response
        this.emitToListeners(this.events.receiveMessage, response);
      }
    }, this.config.responseDelay);
  }

  private handleJoinConversation(data: { conversationId: string; metadata?: any }): void {
    setTimeout(() => {
      this.currentConversation = data.conversationId;

      // Emit joined acknowledgment
      this.emitToListeners(this.events.conversationJoined, {
        conversationId: data.conversationId,
        participants: [
          { id: 'user-1', username: 'You' },
          { id: 'bot-1', username: 'AI Assistant' }
        ],
        messages: []
      });

      // Emit user joined event to simulate real-time
      setTimeout(() => {
        this.emitToListeners(this.events.conversationEvent, {
          type: 'user_joined',
          conversationId: data.conversationId,
          userId: 'user-1',
          username: 'You',
          timestamp: Date.now()
        } as ConversationEvent);
      }, 200);
    }, 100);
  }

  private handleLeaveConversation(data: { conversationId: string }): void {
    setTimeout(() => {
      this.currentConversation = null;
      this.emitToListeners(this.events.conversationLeft, {
        conversationId: data.conversationId
      });
    }, 100);
  }

  private emitToListeners(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  private generateResponse(input: string): string {
    const lowercaseInput = input.toLowerCase();

    // Contextual responses
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
      return 'Hello! I\'m connected via Socket.IO. This demonstrates real-time bidirectional communication. How can I help you today?';
    }

    if (lowercaseInput.includes('socket')) {
      return 'Socket.IO enables real-time, bidirectional communication between web clients and servers. It\'s perfect for chat applications, live notifications, and collaborative tools. The connection you\'re using right now supports:\n\n- **Streaming responses** (like this one)\n- **Conversation rooms** (join/leave)\n- **Real-time events** (user joined/left)\n- **Auto-reconnection**';
    }

    if (lowercaseInput.includes('conversation') || lowercaseInput.includes('room')) {
      return `You're currently in conversation: **${this.currentConversation || 'None'}**\n\nSocket.IO rooms allow multiple users to join the same conversation. Messages are broadcast to all participants in real-time. Try joining a different conversation using the controls!`;
    }

    if (lowercaseInput.includes('streaming')) {
      return 'This response is being streamed to you in real-time! Each character arrives as a separate Socket.IO event, creating a smooth typing effect. This is similar to how ChatGPT and other AI assistants deliver their responses.\n\nStreaming provides:\n- Better user experience\n- Lower perceived latency\n- Ability to cancel mid-response';
    }

    if (lowercaseInput.includes('help')) {
      return 'Here\'s what you can try:\n\n1. **Say hello** - Get a friendly greeting\n2. **Ask about Socket.IO** - Learn about the technology\n3. **Ask about conversations** - See room features\n4. **Ask about streaming** - Understand real-time delivery\n5. **Join/leave conversations** - Use the controls below\n\nThis is a mock demonstration - in production, you\'d connect to a real Socket.IO server!';
    }

    // Default response
    return `I received your message via Socket.IO: "${input}"\n\nThis mock server simulates real-time communication. In a production environment, your Socket.IO server would process this message and stream back an AI-generated response.\n\nTry asking about:\n- Socket.IO features\n- Conversation rooms\n- Streaming responses`;
  }
}

interface MockSocketIOConfig {
  streamingDelay?: number;
  responseDelay?: number;
  streaming?: boolean;
}

/**
 * Create a mock Socket.IO manager function
 */
function createMockSocketIO(config: MockSocketIOConfig = {}) {
  return (url: string, options?: any) => {
    const socket = new MockSocketIOClient(url, options, config);
    // Auto-connect
    setTimeout(() => socket.connect(), 50);
    return socket;
  };
}

// ===== STORY CONFIGURATION =====

const meta: Meta = {
  title: 'Components/Chatbot/Providers/SocketIO',
  component: 'nr-chatbot',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Socket.IO Provider

Real-time bidirectional communication provider for the Chatbot component.

## Features

- **WebSocket Communication**: True bidirectional real-time messaging
- **Streaming Responses**: Character-by-character message delivery
- **Conversation Rooms**: Join/leave conversation channels
- **Real-time Events**: User joined/left notifications
- **Auto-reconnection**: Handles connection drops gracefully

## Usage

\`\`\`typescript
import { SocketIOProvider } from '@nuraly/chatbot';

const provider = new SocketIOProvider();

await provider.connect({
  serverUrl: 'https://your-socketio-server.com',
  auth: { token: 'your-jwt-token' },
  events: {
    sendMessage: 'chat:message',
    receiveChunk: 'chat:chunk',
    streamEnd: 'chat:end'
  }
});

// Join a conversation
await provider.joinConversation('room-123');

// Listen for events
provider.onConversationEvent((event) => {
  console.log('Event:', event.type, event.userId);
});

// Use with controller
const controller = new ChatbotCoreController({
  provider: provider,
  // ...
});
\`\`\`

## Server Protocol

### Client → Server Events
| Event | Payload |
|-------|---------|
| \`chat:message\` | \`{ text, conversationId?, context }\` |
| \`conversation:join\` | \`{ conversationId, metadata? }\` |
| \`conversation:leave\` | \`{ conversationId }\` |

### Server → Client Events
| Event | Payload |
|-------|---------|
| \`chat:chunk\` | \`string\` (streaming chunk) |
| \`chat:end\` | \`void\` (stream complete) |
| \`conversation:joined\` | \`{ conversationId, participants?, messages? }\` |
| \`conversation:event\` | \`{ type, conversationId, userId? }\` |
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj;

// ===== SAMPLE DATA =====

const socketIOSuggestions: ChatbotSuggestion[] = [
  { id: 'sugg1', text: 'Tell me about Socket.IO', enabled: true },
  { id: 'sugg2', text: 'How does streaming work?', enabled: true },
  { id: 'sugg3', text: 'What conversations can I join?', enabled: true },
  { id: 'sugg4', text: 'Help', enabled: true }
];

// ===== STORIES =====

/**
 * Basic Socket.IO connection with streaming responses
 */
export const BasicConnection: Story = {
  render: () => {
    const containerId = 'socketio-basic-' + Math.random().toString(36).substr(2, 9);

    setTimeout(() => {
      const container = document.getElementById(containerId);
      const chatbot = container?.querySelector('nr-chatbot') as any;
      const statusEl = container?.querySelector('.connection-status') as HTMLElement;

      if (chatbot && !chatbot.controller) {
        // Create Socket.IO provider with mock
        const provider = new SocketIOProvider(createMockSocketIO({
          streaming: true,
          streamingDelay: 25,
          responseDelay: 300
        }));

        // Create controller
        const controller = new ChatbotCoreController({
          provider,
          ui: {
            onStateChange: (state) => {
              chatbot.messages = state.messages;
              chatbot.isBotTyping = state.isTyping;
              chatbot.chatStarted = state.messages.length > 0;
            },
            onTypingStart: () => { chatbot.isBotTyping = true; },
            onTypingEnd: () => { chatbot.isBotTyping = false; }
          }
        });

        // Connect provider
        provider.connect({
          serverUrl: 'wss://mock-socketio-server.example.com',
          transports: ['websocket']
        }).then(() => {
          if (statusEl) {
            statusEl.textContent = 'Connected';
            statusEl.style.color = '#22c55e';
          }
        });

        chatbot.controller = controller;
        chatbot.suggestions = socketIOSuggestions;
      }
    }, 0);

    return html`
      <div id="${containerId}" style="width: 500px;">
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: var(--nr-color-surface-secondary, #f5f5f5);
          border-radius: 8px;
          font-size: 14px;
        ">
          <span style="font-weight: 500;">Socket.IO Status:</span>
          <span class="connection-status" style="color: #f59e0b;">Connecting...</span>
        </div>
        <div style="height: 550px;">
          <nr-chatbot></nr-chatbot>
        </div>
      </div>
    `;
  }
};

/**
 * Socket.IO with conversation/room management
 */
export const ConversationRooms: Story = {
  render: () => {
    const containerId = 'socketio-rooms-' + Math.random().toString(36).substr(2, 9);

    setTimeout(() => {
      const container = document.getElementById(containerId);
      const chatbot = container?.querySelector('nr-chatbot') as any;
      const statusEl = container?.querySelector('.connection-status') as HTMLElement;
      const roomEl = container?.querySelector('.current-room') as HTMLElement;
      const eventsEl = container?.querySelector('.events-log') as HTMLElement;
      const joinBtn = container?.querySelector('.join-btn') as HTMLButtonElement;
      const leaveBtn = container?.querySelector('.leave-btn') as HTMLButtonElement;
      const roomInput = container?.querySelector('.room-input') as HTMLInputElement;

      if (chatbot && !chatbot.controller) {
        // Create Socket.IO provider
        const provider = new SocketIOProvider(createMockSocketIO({
          streaming: true,
          streamingDelay: 30,
          responseDelay: 400
        }));

        // Create controller
        const controller = new ChatbotCoreController({
          provider,
          ui: {
            onStateChange: (state) => {
              chatbot.messages = state.messages;
              chatbot.isBotTyping = state.isTyping;
              chatbot.chatStarted = state.messages.length > 0;
            },
            onTypingStart: () => { chatbot.isBotTyping = true; },
            onTypingEnd: () => { chatbot.isBotTyping = false; }
          }
        });

        // Connect and set up event handlers
        provider.connect({
          serverUrl: 'wss://mock-socketio-server.example.com'
        }).then(() => {
          if (statusEl) {
            statusEl.textContent = 'Connected';
            statusEl.style.color = '#22c55e';
          }

          // Listen for conversation events
          provider.onConversationEvent((event) => {
            if (eventsEl) {
              const eventItem = document.createElement('div');
              eventItem.style.cssText = 'padding: 4px 0; border-bottom: 1px solid #eee; font-size: 12px;';
              eventItem.innerHTML = `<strong>${event.type}</strong>: ${event.userId || event.conversationId}`;
              eventsEl.insertBefore(eventItem, eventsEl.firstChild);

              // Keep only last 5 events
              while (eventsEl.children.length > 5) {
                eventsEl.removeChild(eventsEl.lastChild!);
              }
            }
          });
        });

        // Join room handler
        joinBtn?.addEventListener('click', async () => {
          const roomId = roomInput?.value || 'general';
          try {
            await provider.joinConversation(roomId);
            if (roomEl) {
              roomEl.textContent = roomId;
              roomEl.style.color = '#22c55e';
            }
          } catch (err) {
            console.error('Failed to join room:', err);
          }
        });

        // Leave room handler
        leaveBtn?.addEventListener('click', async () => {
          const currentRoom = provider.getCurrentConversation();
          if (currentRoom) {
            await provider.leaveConversation(currentRoom);
            if (roomEl) {
              roomEl.textContent = 'None';
              roomEl.style.color = '#6b7280';
            }
          }
        });

        chatbot.controller = controller;
        chatbot.suggestions = socketIOSuggestions;
      }
    }, 0);

    return html`
      <div id="${containerId}" style="width: 550px;">
        <!-- Status Panel -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
          padding: 12px;
          background: var(--nr-color-surface-secondary, #f5f5f5);
          border-radius: 8px;
          font-size: 13px;
        ">
          <div>
            <div style="font-weight: 500; margin-bottom: 4px;">Connection</div>
            <span class="connection-status" style="color: #f59e0b;">Connecting...</span>
          </div>
          <div>
            <div style="font-weight: 500; margin-bottom: 4px;">Current Room</div>
            <span class="current-room" style="color: #6b7280;">None</span>
          </div>
        </div>

        <!-- Room Controls -->
        <div style="
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          align-items: center;
        ">
          <input
            type="text"
            class="room-input"
            placeholder="Room ID (e.g., general)"
            value="general"
            style="
              flex: 1;
              padding: 8px 12px;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              font-size: 14px;
            "
          />
          <button class="join-btn" style="
            padding: 8px 16px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">Join</button>
          <button class="leave-btn" style="
            padding: 8px 16px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">Leave</button>
        </div>

        <!-- Events Log -->
        <div style="
          margin-bottom: 12px;
          padding: 8px 12px;
          background: #1e293b;
          border-radius: 6px;
          color: #e2e8f0;
          font-family: monospace;
          font-size: 12px;
          max-height: 80px;
          overflow-y: auto;
        ">
          <div style="color: #94a3b8; margin-bottom: 4px;">Events Log:</div>
          <div class="events-log">
            <div style="color: #64748b;">Waiting for events...</div>
          </div>
        </div>

        <!-- Chatbot -->
        <div style="height: 450px;">
          <nr-chatbot></nr-chatbot>
        </div>
      </div>
    `;
  }
};

/**
 * Socket.IO with custom event names
 */
export const CustomEvents: Story = {
  render: () => {
    const containerId = 'socketio-custom-' + Math.random().toString(36).substr(2, 9);

    setTimeout(() => {
      const container = document.getElementById(containerId);
      const chatbot = container?.querySelector('nr-chatbot') as any;
      const statusEl = container?.querySelector('.connection-status') as HTMLElement;
      const configEl = container?.querySelector('.config-display') as HTMLElement;

      if (chatbot && !chatbot.controller) {
        // Custom event names
        const customEvents: SocketIOEvents = {
          sendMessage: 'ai:query',
          receiveChunk: 'ai:stream',
          streamEnd: 'ai:complete',
          error: 'ai:error',
          joinConversation: 'room:enter',
          leaveConversation: 'room:exit',
          conversationJoined: 'room:entered',
          conversationLeft: 'room:exited',
          conversationEvent: 'room:event',
          conversationError: 'room:error'
        };

        // Display config
        if (configEl) {
          configEl.innerHTML = Object.entries(customEvents)
            .map(([key, value]) => `<div><span style="color:#94a3b8">${key}:</span> <span style="color:#22d3ee">"${value}"</span></div>`)
            .join('');
        }

        // Create provider with custom events
        const mockIO = createMockSocketIO({ streaming: true, streamingDelay: 20 });
        const provider = new SocketIOProvider((url, options) => {
          // Inject custom events into mock
          return mockIO(url, { ...options, events: customEvents });
        });

        const controller = new ChatbotCoreController({
          provider,
          ui: {
            onStateChange: (state) => {
              chatbot.messages = state.messages;
              chatbot.isBotTyping = state.isTyping;
              chatbot.chatStarted = state.messages.length > 0;
            },
            onTypingStart: () => { chatbot.isBotTyping = true; },
            onTypingEnd: () => { chatbot.isBotTyping = false; }
          }
        });

        provider.connect({
          serverUrl: 'wss://custom-server.example.com',
          events: customEvents
        }).then(() => {
          if (statusEl) {
            statusEl.textContent = 'Connected with custom events';
            statusEl.style.color = '#22c55e';
          }
        });

        chatbot.controller = controller;
        chatbot.suggestions = [
          { id: 's1', text: 'Test custom events', enabled: true },
          { id: 's2', text: 'Hello!', enabled: true }
        ];
      }
    }, 0);

    return html`
      <div id="${containerId}" style="width: 500px;">
        <!-- Status -->
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: var(--nr-color-surface-secondary, #f5f5f5);
          border-radius: 8px;
          font-size: 14px;
        ">
          <span style="font-weight: 500;">Status:</span>
          <span class="connection-status" style="color: #f59e0b;">Connecting...</span>
        </div>

        <!-- Custom Events Config -->
        <div style="
          margin-bottom: 12px;
          padding: 12px;
          background: #1e293b;
          border-radius: 8px;
          font-family: monospace;
          font-size: 12px;
        ">
          <div style="color: #f8fafc; margin-bottom: 8px; font-weight: 500;">Custom Event Configuration:</div>
          <div class="config-display" style="color: #e2e8f0; line-height: 1.6;">
            Loading...
          </div>
        </div>

        <!-- Chatbot -->
        <div style="height: 450px;">
          <nr-chatbot></nr-chatbot>
        </div>
      </div>
    `;
  }
};

/**
 * Socket.IO without streaming (complete responses)
 */
export const NonStreaming: Story = {
  render: () => {
    const containerId = 'socketio-nonstream-' + Math.random().toString(36).substr(2, 9);

    setTimeout(() => {
      const container = document.getElementById(containerId);
      const chatbot = container?.querySelector('nr-chatbot') as any;
      const statusEl = container?.querySelector('.connection-status') as HTMLElement;

      if (chatbot && !chatbot.controller) {
        // Non-streaming provider
        const provider = new SocketIOProvider(createMockSocketIO({
          streaming: false,
          responseDelay: 800
        }));

        const controller = new ChatbotCoreController({
          provider,
          ui: {
            onStateChange: (state) => {
              chatbot.messages = state.messages;
              chatbot.isBotTyping = state.isTyping;
              chatbot.chatStarted = state.messages.length > 0;
            },
            onTypingStart: () => { chatbot.isBotTyping = true; },
            onTypingEnd: () => { chatbot.isBotTyping = false; }
          }
        });

        provider.connect({
          serverUrl: 'wss://mock-server.example.com'
        }).then(() => {
          if (statusEl) {
            statusEl.textContent = 'Connected (Non-streaming mode)';
            statusEl.style.color = '#22c55e';
          }
        });

        chatbot.controller = controller;
        chatbot.suggestions = [
          { id: 's1', text: 'Send a message', enabled: true },
          { id: 's2', text: 'Hello!', enabled: true }
        ];
      }
    }, 0);

    return html`
      <div id="${containerId}" style="width: 500px;">
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding: 8px 12px;
          background: var(--nr-color-surface-secondary, #f5f5f5);
          border-radius: 8px;
          font-size: 14px;
        ">
          <span style="font-weight: 500;">Status:</span>
          <span class="connection-status" style="color: #f59e0b;">Connecting...</span>
        </div>
        <div style="
          margin-bottom: 12px;
          padding: 8px 12px;
          background: #fef3c7;
          border-radius: 8px;
          font-size: 13px;
          color: #92400e;
        ">
          <strong>Note:</strong> This example uses non-streaming mode. Responses arrive complete rather than character-by-character.
        </div>
        <div style="height: 500px;">
          <nr-chatbot></nr-chatbot>
        </div>
      </div>
    `;
  }
};

/**
 * Socket.IO with authentication
 */
export const WithAuthentication: Story = {
  render: () => {
    const containerId = 'socketio-auth-' + Math.random().toString(36).substr(2, 9);

    setTimeout(() => {
      const container = document.getElementById(containerId);
      const chatbot = container?.querySelector('nr-chatbot') as any;
      const statusEl = container?.querySelector('.connection-status') as HTMLElement;
      const authEl = container?.querySelector('.auth-info') as HTMLElement;

      if (chatbot && !chatbot.controller) {
        // Simulated auth data
        const authData = {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          userId: 'user-12345',
          username: 'demo_user',
          role: 'member'
        };

        // Display auth info
        if (authEl) {
          authEl.innerHTML = `
            <div><span style="color:#94a3b8">userId:</span> ${authData.userId}</div>
            <div><span style="color:#94a3b8">username:</span> ${authData.username}</div>
            <div><span style="color:#94a3b8">role:</span> ${authData.role}</div>
            <div><span style="color:#94a3b8">token:</span> ${authData.token.slice(0, 20)}...</div>
          `;
        }

        const provider = new SocketIOProvider(createMockSocketIO({
          streaming: true,
          streamingDelay: 25
        }));

        const controller = new ChatbotCoreController({
          provider,
          ui: {
            onStateChange: (state) => {
              chatbot.messages = state.messages;
              chatbot.isBotTyping = state.isTyping;
              chatbot.chatStarted = state.messages.length > 0;
            },
            onTypingStart: () => { chatbot.isBotTyping = true; },
            onTypingEnd: () => { chatbot.isBotTyping = false; }
          }
        });

        provider.connect({
          serverUrl: 'wss://secure-server.example.com',
          auth: authData,
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 10
        }).then(() => {
          if (statusEl) {
            statusEl.textContent = 'Authenticated & Connected';
            statusEl.style.color = '#22c55e';
          }
        });

        chatbot.controller = controller;
        chatbot.suggestions = socketIOSuggestions;
      }
    }, 0);

    return html`
      <div id="${containerId}" style="width: 500px;">
        <!-- Status -->
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: var(--nr-color-surface-secondary, #f5f5f5);
          border-radius: 8px;
          font-size: 14px;
        ">
          <span style="font-weight: 500;">Status:</span>
          <span class="connection-status" style="color: #f59e0b;">Authenticating...</span>
        </div>

        <!-- Auth Info -->
        <div style="
          margin-bottom: 12px;
          padding: 12px;
          background: #1e293b;
          border-radius: 8px;
          font-family: monospace;
          font-size: 12px;
        ">
          <div style="color: #f8fafc; margin-bottom: 8px; font-weight: 500;">
            Authentication Data:
          </div>
          <div class="auth-info" style="color: #e2e8f0; line-height: 1.6;">
            Loading...
          </div>
        </div>

        <!-- Chatbot -->
        <div style="height: 450px;">
          <nr-chatbot></nr-chatbot>
        </div>
      </div>
    `;
  }
};

/**
 * Multi-user conversation simulation
 */
export const MultiUserConversation: Story = {
  render: () => {
    const containerId = 'socketio-multiuser-' + Math.random().toString(36).substr(2, 9);

    setTimeout(() => {
      const container = document.getElementById(containerId);
      const chatbot = container?.querySelector('nr-chatbot') as any;
      const statusEl = container?.querySelector('.connection-status') as HTMLElement;
      const participantsEl = container?.querySelector('.participants') as HTMLElement;
      const simulateBtn = container?.querySelector('.simulate-btn') as HTMLButtonElement;

      if (chatbot && !chatbot.controller) {
        const provider = new SocketIOProvider(createMockSocketIO({
          streaming: true,
          streamingDelay: 30
        }));

        const controller = new ChatbotCoreController({
          provider,
          ui: {
            onStateChange: (state) => {
              chatbot.messages = state.messages;
              chatbot.isBotTyping = state.isTyping;
              chatbot.chatStarted = state.messages.length > 0;
            },
            onTypingStart: () => { chatbot.isBotTyping = true; },
            onTypingEnd: () => { chatbot.isBotTyping = false; }
          }
        });

        const participants = new Set(['You']);

        const updateParticipants = () => {
          if (participantsEl) {
            participantsEl.innerHTML = Array.from(participants)
              .map(p => `<span style="
                display: inline-block;
                padding: 2px 8px;
                margin: 2px;
                background: ${p === 'You' ? '#3b82f6' : '#6b7280'};
                color: white;
                border-radius: 12px;
                font-size: 12px;
              ">${p}</span>`)
              .join('');
          }
        };

        // Listen for conversation events
        provider.onConversationEvent((event) => {
          if (event.type === 'user_joined' && event.username) {
            participants.add(event.username);
            updateParticipants();
          } else if (event.type === 'user_left' && event.username) {
            participants.delete(event.username);
            updateParticipants();
          }
        });

        // Simulate button
        simulateBtn?.addEventListener('click', () => {
          const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
          const randomName = names[Math.floor(Math.random() * names.length)];

          if (participants.has(randomName)) {
            // User leaves
            participants.delete(randomName);
            provider['conversationEventCallbacks'].forEach(cb => cb({
              type: 'user_left',
              conversationId: 'demo-room',
              userId: randomName.toLowerCase(),
              username: randomName,
              timestamp: Date.now()
            }));
          } else {
            // User joins
            participants.add(randomName);
            provider['conversationEventCallbacks'].forEach(cb => cb({
              type: 'user_joined',
              conversationId: 'demo-room',
              userId: randomName.toLowerCase(),
              username: randomName,
              timestamp: Date.now()
            }));
          }

          updateParticipants();
        });

        provider.connect({
          serverUrl: 'wss://multiuser-server.example.com',
          autoJoinConversation: 'demo-room'
        }).then(() => {
          if (statusEl) {
            statusEl.textContent = 'Connected to demo-room';
            statusEl.style.color = '#22c55e';
          }
          updateParticipants();
        });

        chatbot.controller = controller;
        chatbot.suggestions = [
          { id: 's1', text: 'Who else is here?', enabled: true },
          { id: 's2', text: 'Say hello to everyone', enabled: true }
        ];
      }
    }, 0);

    return html`
      <div id="${containerId}" style="width: 500px;">
        <!-- Status & Room -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 8px 12px;
          background: var(--nr-color-surface-secondary, #f5f5f5);
          border-radius: 8px;
          font-size: 14px;
        ">
          <div>
            <span style="font-weight: 500;">Status:</span>
            <span class="connection-status" style="color: #f59e0b; margin-left: 8px;">Connecting...</span>
          </div>
          <button class="simulate-btn" style="
            padding: 4px 12px;
            background: #8b5cf6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          ">Simulate User Join/Leave</button>
        </div>

        <!-- Participants -->
        <div style="
          margin-bottom: 12px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
        ">
          <div style="font-weight: 500; margin-bottom: 8px; font-size: 13px; color: #166534;">
            Participants in Room:
          </div>
          <div class="participants">
            Loading...
          </div>
        </div>

        <!-- Chatbot -->
        <div style="height: 420px;">
          <nr-chatbot></nr-chatbot>
        </div>
      </div>
    `;
  }
};
