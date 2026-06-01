# Chatbot Component

A versatile chatbot component with message handling, suggestions, typing indicators, and multi-language support. Built using NuralyUI components for consistent styling and behavior.

## Required CSS

The chatbot relies on theme CSS custom properties shipped by `@nuraly/lumenui` in the `packages/themes/dist/default.css` file. Without that stylesheet, colors, spacing tokens, and component variables resolve to their inline fallbacks only and the component will look unstyled.

Pin the version to the same `${VERSION}` you use for the JS bundle:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nuraly/lumenui@${VERSION}/packages/themes/dist/default.css"
/>
```

Concrete example with the current version:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nuraly/lumenui@0.7.0/packages/themes/dist/default.css"
/>
```

When you load the component via the CDN bundle (`dist/cdn.js`), the loader will auto-inject a `<link data-nuralyui-themes>` pointing at `default.css` derived from the bundle URL if no `@nuraly/lumenui` or `@nuralyui/themes` stylesheet is already present in `document.head`. The auto-link is a fallback for zero-config setups: link your own themes CSS (for example to pin a specific version or pick a different theme such as `carbon.css`) before loading `cdn.js` and the auto-inject is skipped.

## Features

- **Message Management**: Handle user and bot messages with timestamps
- **Suggestions**: Interactive suggestion chips using nr-button for quick responses
- **Typing Indicators**: Visual feedback when bot is processing
- **Module Selection**: Multi-select dropdown for selecting AI modules/tools that interact with the chatbot
- **RTL Support**: Full right-to-left text direction support
- **Theme Aware**: Automatic theme detection and styling
- **Accessibility**: Full keyboard navigation and screen reader support
- **Validation**: Message validation with custom rules
- **Multiple Variants**: Different visual styles and sizes
- **Event System**: Comprehensive event handling for integration
- **Component Integration**: Uses nr-input and nr-button for consistent UX

## Installation

```bash
npm install @nuralyui/chatbot
```

## Loading

When loaded via the CDN bundle (`dist/cdn.js`), NuralyUI ships an automatic FOUC guard that hides `nr-chatbot` and its slotted children until the custom element is defined. Consumers do not need to add their own `visibility: hidden` rule. The guard is a single `<style data-nuralyui-fouc>` tag injected once into `document.head`, alongside the importmap and module preload.

## Basic Usage

### HTML

```html
<nr-chatbot 
  id="chatbot"
  size="medium"
  variant="default">
</nr-chatbot>

<script>
  const chatbot = document.getElementById('chatbot');
  
  // Set initial messages
  chatbot.messages = [
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! How can I help you today?',
      timestamp: new Date().toLocaleTimeString(),
      introduction: true
    }
  ];
  
  // Set suggestions
  chatbot.suggestions = [
    { id: 'help', text: 'Get help', enabled: true },
    { id: 'support', text: 'Contact support', enabled: true }
  ];
  
  // Listen for events
  chatbot.addEventListener('nr-chatbot-message-sent', (e) => {
    console.log('User sent:', e.detail.message);
  });
</script>
```

### React

```jsx
import { NrChatbot } from '@nuralyui/chatbot/react';
import { useState } from 'react';

function ChatExample() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! How can I help you today?',
      timestamp: new Date().toLocaleTimeString(),
      introduction: true
    }
  ]);
  
  const [suggestions] = useState([
    { id: 'help', text: 'Get help', enabled: true },
    { id: 'support', text: 'Contact support', enabled: true }
  ]);

  const handleMessageSent = (event) => {
    const userMessage = event.detail.message;
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: 'I received your message. How else can I help?',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <NrChatbot
      messages={messages}
      suggestions={suggestions}
      size="medium"
      variant="default"
      onChatbotMessageSent={handleMessageSent}
    />
  );
}
```

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `messages` | `ChatbotMessage[]` | `[]` | Array of chat messages |
| `suggestions` | `ChatbotSuggestion[]` | `[]` | Array of suggestion objects |
| `currentInput` | `string` | `''` | Current input value |
| `isBotTyping` | `boolean` | `false` | Show typing indicator |
| `chatStarted` | `boolean` | `false` | Whether chat has started |
| `isRTL` | `boolean` | `false` | Right-to-left text direction |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Component size |
| `variant` | `'default' \| 'minimal' \| 'rounded'` | `'default'` | Visual variant |
| `loadingIndicator` | `'dots' \| 'spinner' \| 'wave'` | `'dots'` | Loading animation type |
| `loadingText` | `string` | `'Agent is working...'` | Loading text message |
| `disabled` | `boolean` | `false` | Disable input and interactions |
| `placeholder` | `string` | `'Type your message...'` | Input placeholder text |
| `showSendButton` | `boolean` | `true` | Show send button |
| `autoScroll` | `boolean` | `true` | Auto-scroll to new messages |
| `enableModuleSelection` | `boolean` | `false` | Enable module selection dropdown |
| `modules` | `ChatbotModule[]` | `[]` | Available modules for selection |
| `selectedModules` | `string[]` | `[]` | Selected module IDs |
| `moduleSelectionLabel` | `string` | `'Select Modules'` | Label for module selection |
| `enableFileUpload` | `boolean` | `false` | Show the paperclip attach button and accept drag-and-drop uploads. Setting this alone is enough to surface the attach button: an `attach` entry is auto-added to the resolved action buttons. |
| `actionButtons` | `ChatbotAction[]` | `[]` (auto-derived) | Explicit list of input-row action buttons. Setting this overrides the default derived from `enableFileUpload`, giving the consumer full control: pass `[]` to suppress the attach button or include `{ type: 'attach', enabled: true }` to keep it. |
| `activeThreadId` (attr: `active-thread-id`) | `string \| undefined` | `undefined` | Pre-select a conversation. When set and a `controller` is attached, the chatbot calls `controller.switchThread(activeThreadId)` to load that thread's messages. If the thread is not yet in the loaded list, the chatbot renders a loading state and switches automatically as soon as a controller update includes the thread (useful when the route loader runs in parallel with the threads fetch). Set this from a route loader to open the chatbot directly on a specific conversation. |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `nr-chatbot-message-sent` | `{ message: ChatbotMessage }` | User sent a message |
| `nr-chatbot-suggestion-clicked` | `{ suggestion: ChatbotSuggestion }` | Suggestion was selected |
| `nr-chatbot-retry-requested` | `{ message: ChatbotMessage }` | Retry requested for failed message |
| `nr-chatbot-input-changed` | `{ value: string }` | Input value changed |
| `nr-chatbot-input-focused` | `{ event: Event }` | Input received focus |
| `nr-chatbot-input-blurred` | `{ event: Event }` | Input lost focus |
| `nr-chatbot-modules-selected` | `{ metadata: { selectedModules, selectedModuleIds } }` | Module selection changed |
| `nr-thread-change` | `{ threadId: string }` | User selected a different thread in the sidebar. Fires only on the explicit click and only when the id actually differs from the current active thread. Setting `activeThreadId` programmatically (or initial load) does NOT dispatch this event. Subscribe to push the new id into your router. |

### Routing example

```ts
// LumenJS / Vue Router / React Router — the pattern is the same
chatbot.activeThreadId = route.params.threadId;     // open this conversation
chatbot.addEventListener('nr-thread-change', (e) => {
  router.push(`/chat/${e.detail.threadId}`);        // user clicked another thread
});
```

## Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `sendMessage(text: string)` | `text` | Programmatically send a message |
| `clearMessages()` | - | Clear all messages |
| `addMessage(message)` | `message` | Add a message programmatically |
| `setTyping(isTyping: boolean)` | `isTyping` | Set typing indicator state |
| `setModules(modules)` | `modules` | Set available modules |
| `getSelectedModules()` | - | Get selected module objects |
| `setSelectedModules(moduleIds)` | `moduleIds` | Set selected modules by IDs |
| `clearModuleSelection()` | - | Clear all module selections |
| `toggleModule(moduleId)` | `moduleId` | Toggle a single module |
| `focusInput()` | - | Focus the input field |

## Types

### ChatbotMessage

```typescript
interface ChatbotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  error?: boolean;
  introduction?: boolean;
  state?: 'default' | 'error' | 'success' | 'loading';
  metadata?: Record<string, any>;
}
```

### ChatbotSuggestion

```typescript
interface ChatbotSuggestion {
  id: string;
  text: string;
  category?: string;
  enabled?: boolean;
  metadata?: Record<string, any>;
}
```

## Styling

The component supports CSS custom properties for theming:

```css
nr-chatbot {
  --nuraly-color-primary: #0066cc;
  --nuraly-color-text: #333;
  --nuraly-color-background: #fff;
  --nuraly-color-border: #e0e0e0;
  --nuraly-border-radius: 8px;
  --nuraly-spacing-sm: 8px;
  --nuraly-spacing-md: 16px;
}
```

## Theming

The chatbot reads its colors, spacing, and typography from CSS custom properties resolved on any ancestor element. The `@nuralyui/themes` default theme defines values for the `--nuraly-color-*` tokens listed below; tokens prefixed with `--chatbot-*` fall back to inline defaults declared in the component's style sheet, so consumers can override them at any scope (host, page, or section wrapper) without touching internal selectors.

### CSS custom properties

#### Color tokens (provided by the default theme)

| Token | Default | Controls |
|-------|---------|----------|
| `--nuraly-color-user-bubble-bg` | `rgb(124, 58, 237)` | Background color of the user message bubble |
| `--nuraly-color-user-bubble-fg` | `rgb(255, 255, 255)` | Text color inside the user message bubble |
| `--nuraly-color-bot-bubble-bg` | `transparent` | Background color of the bot message bubble |
| `--nuraly-color-bot-bubble-fg` | `inherit` | Text color inside the bot message bubble |
| `--nuraly-color-divider` | `rgb(224, 224, 224)` | Border under the chatbot header and the file drop zone |

#### Chatbot-scoped tokens (inline defaults)

| Token | Default | Controls |
|-------|---------|----------|
| `--chatbot-messages-bg` | `transparent` | Background of the messages scroll area |
| `--chatbot-radius` | `8px` | Border radius of message bubbles |
| `--chatbot-font-family` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif` | Component-wide font stack |
| `--chatbot-font-size-sm` | `0.8125rem` | Loading label / helper font size |
| `--chatbot-accent` | `#7c3aed` | Accent color used for module pill, focus ring, send button |
| `--chatbot-bg` | `#fff` | Surface behind the input row |
| `--chatbot-input-bg` | `#f5f5f8` | Background of selected module chip in the input |
| `--chatbot-text` | `#0f0f3c` | Primary text inside input chrome |
| `--chatbot-text-primary` | (none) | Primary text used by the file drop zone |
| `--chatbot-text-secondary` | `#8c8ca8` | Secondary / helper text |
| `--chatbot-text-helper` | (none) | Validation helper text under inputs |
| `--chatbot-surface` | (none) | Surface color for attachment thumbnails |
| `--chatbot-surface-hover` | (none) | Hover-state surface for skeleton gradients |
| `--chatbot-background` | (none) | Background of attached file rows |
| `--chatbot-border` | (none) | Borders for attachments and the artifact-panel divider |
| `--chatbot-user-message-bg` | (none) | Drop-zone border and outline when dragging files |
| `--chatbot-error-text` | (none) | Color of inline validation error text |
| `--chatbot-loading-indicator-color` | `var(--chatbot-text-secondary)` | Color of the loading indicator |
| `--chatbot-spinner-size` | `1.25rem` | Diameter of the spinner loading indicator |
| `--chatbot-spinner-border-width` | `2px` | Stroke width of the spinner |
| `--chatbot-spinner-color` | `currentColor` | Spinner color |
| `--chatbot-spinner-speed` | `0.8s` | Spinner rotation duration |
| `--chatbot-spacing-xs` | (none) | Extra-small spacing scale (gaps, padding) |
| `--chatbot-spacing-sm` | (none) | Small spacing scale |
| `--chatbot-spacing-md` | (none) | Medium spacing scale |
| `--chatbot-spacing-xl` | (none) | Extra-large spacing for the empty file-drop zone |

Tokens marked `(none)` have no inline fallback and rely on values supplied by an ancestor stylesheet or the active theme.

### CSS parts

The component exposes the following shadow parts. Per-role variants are suffixed with the message `sender` (`user` or `bot`); the base part continues to match both roles.

#### Message parts (per-role variants available)

| Part | Per-role variants | Description |
|------|-------------------|-------------|
| `message` | `message-user`, `message-bot` | Outer message row |
| `message-content` | `message-content-user`, `message-content-bot` | Message bubble |

#### Message internals

| Part | Description |
|------|-------------|
| `message-error` | Error block inside a message |
| `message-error-title` | Title of the error block |
| `message-error-description` | Description of the error block |
| `message-attachments` | Container for attached files in a message |
| `message-footer` | Footer row (timestamp + actions) |
| `message-timestamp` | Timestamp text |
| `message-copy` | Copy-to-clipboard button |
| `retry-button` | Retry button on failed messages |

#### Typing indicator

| Part | Description |
|------|-------------|
| `typing-indicator` | Outer wrapper for the typing indicator row |
| `typing-content` | Inner content wrapper |
| `typing-dots` | Dot-animation variant |
| `typing-spinner` | Spinner variant |
| `typing-text` | Loading label text |

#### Layout

| Part | Description |
|------|-------------|
| `container` | Root chat container |
| `main` | Main column wrapping header, content, and input |
| `chatbot-header` | Header bar above the messages |
| `content` | Content area between header and input |
| `messages` | Scrollable messages list |
| `empty-state` | Empty-state wrapper shown when there are no messages |
| `empty-state-content` | Empty-state body text |
| `input-only-suggestions` | Suggestion strip rendered above the input |

#### Input box

| Part | Description |
|------|-------------|
| `input-box` | Outer wrapper of the input area |
| `input-container` | Inner container of the input |
| `input-row` | Row holding the textarea and primary controls |
| `input` | The textarea / contenteditable input itself |
| `context-tags` | Row of contextual tags below the input |
| `actions` | Row of action buttons (toolbar) |
| `actions-left` | Left-aligned action button group |
| `actions-right` | Right-aligned action button group |
| `file-button` | Paperclip / attach file button |
| `module-select` | Module selector control |
| `send-button` | Send-message button |

#### Audio recording

| Part | Description |
|------|-------------|
| `audio-recording-bar` | Recording state bar shown in place of the input |
| `audio-cancel-button` | Cancel-recording button |
| `audio-indicator` | Wrapper for the live audio level indicator |
| `audio-dot` | Recording status dot |
| `audio-wave` | Container for the live waveform bars |
| `audio-bar` | Individual bar inside the waveform |
| `audio-time` | Elapsed recording time text |
| `audio-mode-label` | Mode label (transcribe / voice) |
| `audio-send-button` | Send-audio button |
| `audio-mic-button` | Microphone button (also applies `audio-mic-transcribe` or `audio-mic-voice` for the mode variants) |
| `audio-mic-transcribe` | Transcribe-mode microphone variant |
| `audio-mic-voice` | Voice-mode microphone variant |

#### File upload

| Part | Description |
|------|-------------|
| `file-upload-area` | Drop zone wrapper |
| `file-upload-area-content` | Inner content of the drop zone |
| `file-upload-area-icon` | Icon shown inside the drop zone |
| `file-upload-area-text` | Text shown inside the drop zone |
| `file-thumb` | File attachment thumbnail |
| `file-thumb-image` | Image preview inside a thumbnail |
| `file-thumb-ext` | Extension badge wrapper |
| `file-thumb-ext-label` | Extension badge label |
| `file-thumb-spinner` | Upload-in-progress spinner |
| `file-thumb-remove` | Remove-attachment button |

#### Artifact panel

| Part | Description |
|------|-------------|
| `artifact-panel` | Outer artifact panel wrapper |
| `artifact-panel-resize-handle` | Resize handle on the panel edge |
| `artifact-panel-resize-bar` | Visible resize bar inside the handle |
| `artifact-panel-body` | Body area of the artifact panel |
| `artifact-panel-header` | Header bar inside the artifact panel |
| `artifact-panel-header-info` | Info group inside the header |
| `artifact-panel-lang` | Language label in the header |
| `artifact-panel-title` | Title text in the header |
| `artifact-panel-actions` | Action buttons in the header |
| `artifact-panel-content` | Rendered artifact body |
| `artifact-panel-code` | Code-artifact variant |
| `artifact-panel-md` | Markdown-artifact variant |
| `artifact-panel-html` | HTML-artifact variant |
| `artifact-panel-text` | Plain-text-artifact variant |

#### Thread sidebar

| Part | Description |
|------|-------------|
| `thread-sidebar` | Sidebar wrapper |
| `thread-sidebar-header` | Sidebar header bar |
| `thread-sidebar-title` | Sidebar title text |
| `thread-list` | Scrollable list of threads |
| `thread-section` | Section group inside the list (e.g. `thread-section thread-section-bookmarks`) |
| `thread-section-bookmarks` | Bookmarks-section variant |
| `thread-section-label` | Section heading text |
| `thread-empty` | Empty-list placeholder |
| `thread-item` | Individual thread row |
| `thread-title` | Thread title text |
| `thread-preview` | Thread preview snippet |
| `thread-timestamp` | Thread timestamp |
| `thread-actions` | Thread row action buttons |
| `thread-bookmark` | Bookmark toggle button |
| `thread-menu` | Thread row overflow menu |
| `thread-rename-input` | Inline rename input |

#### Suggestions and modals

| Part | Description |
|------|-------------|
| `suggestions` | Suggestion list wrapper |
| `suggestion` | Single suggestion chip |
| `url-modal` | URL-attachment modal wrapper |

### Example

Override three tokens on a wrapping `.chatbot-shell` element so the chatbot picks them up via the cascade:

```css
.chatbot-shell {
  --nuraly-color-user-bubble-bg: #0f62fe;
  --nuraly-color-user-bubble-fg: #ffffff;
  --chatbot-messages-bg: #f4f4f4;
}
```

```html
<div class="chatbot-shell">
  <nr-chatbot></nr-chatbot>
</div>
```

## Accessibility

- Full keyboard navigation support
- Screen reader compatible
- ARIA labels and descriptions
- High contrast support
- Focus management

## Examples

### Custom Styling

```html
<nr-chatbot 
  class="custom-chatbot"
  variant="rounded">
</nr-chatbot>

<style>
  .custom-chatbot {
    --nuraly-color-primary: #ff6b6b;
    --nuraly-border-radius: 16px;
  }
</style>
```

### With Custom Validation

```javascript
const chatbot = document.querySelector('nr-chatbot');

// Add validation rule
chatbot.addValidationRule({
  id: 'length-check',
  validator: (text) => text.length >= 3,
  errorMessage: 'Message must be at least 3 characters long'
});
```

### Integration with Chat Service

```javascript
import { chatServiceInstance } from '@nuralyui/chatbot';

const chatbot = document.querySelector('nr-chatbot');

chatbot.addEventListener('nr-chatbot-message-sent', async (e) => {
  const userMessage = e.detail.message;
  
  // Set typing indicator
  chatbot.setTyping(true);
  
  try {
    // Stream response from service
    const responseGenerator = chatServiceInstance.streamResponse(userMessage.text);
    
    for await (const chunk of responseGenerator) {
      // Handle streaming response
      chatbot.addMessage({
        sender: 'bot',
        text: chunk,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  } catch (error) {
    chatbot.addMessage({
      sender: 'bot',
      text: 'Sorry, there was an error processing your request.',
      timestamp: new Date().toLocaleTimeString(),
      error: true
    });
  } finally {
    chatbot.setTyping(false);
  }
});
```

### Module Selection (Multi-Select)

The chatbot supports module selection via an integrated `nr-select` component with multi-select functionality. This allows users to choose which AI modules/tools should interact with the conversation.

**Custom Display Slot:** Use the `module-selected-display` slot to fully customize how selected modules are displayed. This gives you complete control over the UI.

```html
<nr-chatbot 
  id="chatbot"
  enableModuleSelection
  .modules=${modules}
  .selectedModules=${['nlp', 'search']}>
  
  <!-- Custom display for selected modules -->
  <span slot="module-selected-display" id="module-display">
    <!-- Your custom content here -->
  </span>
</nr-chatbot>

<script>
  const modules = [
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      description: 'Advanced text analysis and understanding',
      icon: 'chat',
      enabled: true,
      metadata: { category: 'AI', version: '2.0' }
    },
    {
      id: 'vision',
      name: 'Computer Vision',
      description: 'Image and video analysis',
      icon: 'eye',
      enabled: true
    },
    {
      id: 'search',
      name: 'Web Search',
      description: 'Search the web for information',
      icon: 'search',
      enabled: true
    },
    {
      id: 'code',
      name: 'Code Analysis',
      description: 'Analyze and generate code',
      icon: 'code',
      enabled: true
    }
  ];

  const chatbot = document.getElementById('chatbot');
  chatbot.modules = modules;

  // Update display based on selection
  function updateModuleDisplay() {
    const selected = chatbot.getSelectedModules();
    const display = document.getElementById('module-display');
    
    if (selected.length === 0) {
      display.innerHTML = '<span style="color: #6f6f6f;">Select Modules</span>';
    } else if (selected.length === 1) {
      const module = selected[0];
      display.innerHTML = `
        ${module.icon ? `<nr-icon name="${module.icon}" style="font-size: 16px;"></nr-icon>` : ''}
        <span>${module.name}</span>
      `;
      display.style.display = 'flex';
      display.style.alignItems = 'center';
      display.style.gap = '6px';
    } else {
      display.innerHTML = `<strong style="color: var(--nuraly-color-primary);">${selected.length} modules selected</strong>`;
    }
  }

  // Listen for module selection changes
  chatbot.addEventListener('nr-chatbot-modules-selected', (e) => {
    console.log('Selected modules:', e.detail.metadata.selectedModules);
    console.log('Selected IDs:', e.detail.metadata.selectedModuleIds);
    
    // Update display
    updateModuleDisplay();
    
    // Update your backend or AI service with selected modules
    updateAIModules(e.detail.metadata.selectedModuleIds);
  });

  // Initial display
  updateModuleDisplay();

  // Programmatically set selected modules
  chatbot.setSelectedModules(['nlp', 'vision']);
  updateModuleDisplay();

  // Get current selected modules
  const selected = chatbot.getSelectedModules();
  console.log('Currently selected:', selected);

  // Clear selection
  chatbot.clearModuleSelection();
  updateModuleDisplay();
</script>
```

**Alternative: Using Reactive Frameworks (Lit, React, etc.)**

```html
<!-- Lit example -->
<nr-chatbot 
  .modules=${this.modules}
  .selectedModules=${this.selectedModules}
  enableModuleSelection
  @nr-chatbot-modules-selected=${this.handleModulesChanged}>
  
  <span slot="module-selected-display">
    ${this.renderModuleDisplay()}
  </span>
</nr-chatbot>

<script>
  renderModuleDisplay() {
    const count = this.selectedModules.length;
    const selected = this.selectedModules.map(id => 
      this.modules.find(m => m.id === id)
    ).filter(Boolean);
    
    if (count === 0) {
      return html`<span class="placeholder">Select Modules</span>`;
    }
    
    if (count === 1) {
      const module = selected[0];
      return html`
        ${module.icon ? html`<nr-icon name="${module.icon}"></nr-icon>` : nothing}
        <span>${module.name}</span>
      `;
    }
    
    return html`<strong>${count} modules selected</strong>`;
  }
</script>
```

**Module Selection Properties:**
- `enableModuleSelection` - Enable module selection dropdown
- `modules` - Array of available modules
- `selectedModules` - Array of selected module IDs
- `moduleSelectionLabel` - Label for the select button (default: "Select Modules")

**Module Selection Slots:**
- `module-selected-display` - Custom content for displaying selected modules

**Module Selection Events:**
- `nr-chatbot-modules-selected` - Fired when module selection changes

**Module Selection Methods:**
- `setModules(modules)` - Set available modules
- `getSelectedModules()` - Get selected module objects
- `setSelectedModules(moduleIds)` - Set selected modules by IDs
- `clearModuleSelection()` - Clear all selections
- `toggleModule(moduleId)` - Toggle a single module

**Custom Display Examples:**

1. **Simple Count Display:**
```html
<span slot="module-selected-display" id="count-display">0 selected</span>

<script>
  chatbot.addEventListener('nr-chatbot-modules-selected', updateDisplay);

  function updateDisplay() {
    const count = chatbot.getSelectedModules().length;
    document.getElementById('count-display').textContent = 
      count === 0 ? 'Select modules' : `${count} selected`;
  }
</script>
```

2. **Module Names List:**
```html
<span slot="module-selected-display" id="names-display"></span>

<script>
  function updateDisplay() {
    const selected = chatbot.getSelectedModules();
    const display = document.getElementById('names-display');
    
    if (selected.length === 0) {
      display.textContent = 'No modules selected';
    } else {
      display.textContent = selected.map(m => m.name).join(', ');
    }
  }
  
  chatbot.addEventListener('nr-chatbot-modules-selected', updateDisplay);
  updateDisplay();
</script>
```

3. **With Icons and Styling:**
```html
<div slot="module-selected-display" id="rich-display" 
     style="display: flex; align-items: center; gap: 8px;">
</div>

<script>
  function updateRichDisplay() {
    const selected = chatbot.getSelectedModules();
    const display = document.getElementById('rich-display');
    
    if (selected.length === 1) {
      const module = selected[0];
      display.innerHTML = `
        <nr-icon name="${module.icon || 'cube'}" 
                 style="color: var(--nuraly-color-primary);"></nr-icon>
        <span style="font-weight: 500;">${module.name}</span>
      `;
    } else if (selected.length > 1) {
      display.innerHTML = `
        <nr-icon name="cube" 
                 style="color: var(--nuraly-color-primary);"></nr-icon>
        <span style="font-weight: 500;">${selected.length} Active Modules</span>
      `;
    } else {
      display.innerHTML = `
        <span style="color: #9ca3af;">Choose modules...</span>
      `;
    }
  }
  
  chatbot.addEventListener('nr-chatbot-modules-selected', updateRichDisplay);
  updateRichDisplay();
</script>
```

## Browser Support

- Chrome 63+
- Firefox 63+
- Safari 12+
- Edge 79+