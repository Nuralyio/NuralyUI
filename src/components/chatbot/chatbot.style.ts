import { css } from 'lit';

export default css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    min-width: 320px;
    box-sizing: border-box;
    overflow: visible;
    
    font-family: var(--chatbot-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif);
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .chat-container {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 8px;
    position: relative;
    border: 1px solid #e0e0e0;
  }

  .chatbot-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    min-width: 300px;
  }

  .chatbot-container--with-sidebar,
  .chatbot-container--with-artifact-panel {
    flex-direction: row;
  }

  .chatbot-main {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }

  .chatbot-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .chatbot-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  :host([boxed]) .chat-container {
    background-color: #ffffff;
    border: none;
    border-radius: 0;
  }

  :host([boxed]) .chatbot-container {
    width: 100%;
  }

  :host([boxed]) .chatbot-main {
    width: 100%;
    max-width: 768px;
    margin: 0 auto;
    background-color: #ffffff;
    border: none;
    border-radius: 0;
    box-shadow: none;
    height: 100%;
  }

  /* Boxed layout with threads: background comes from theme variable with white fallback */
  :host([boxed]) .chat-container--boxed.chat-container--with-threads {
    background-color: #ffffff;
  }

  .chat-container--boxed.chat-container--with-threads .chatbot-main {
    background-color: #ffffff;
  }

  .chat-container--boxed.chat-container--with-threads .chat-box {
    background-color: #ffffff;
  }

  .chat-container--boxed.chat-container--with-threads .messages {
    background-color: #ffffff;
  }

  .chat-container--boxed.chat-container--with-threads .input-container {
    background-color: #ffffff;
  }

  :host([boxed]) .chatbot-header {
    /* Keep header at the top */
    flex: 0 0 auto;
    border-bottom: none;
  }

  :host([boxed]) .chatbot-content:has(.empty-state) {
    /* Don't let content flex grow when empty */
    flex: 0 0 auto;
  }

  :host([boxed]) .chatbot-content:not(:has(.empty-state)) {
    /* Normal flex behavior when messages exist */
    flex: 1;
    min-height: 0;
  }

  :host([boxed]) .chatbot-main:has(.empty-state) {
    /* Make main container relative for absolute positioning */
    position: relative;
  }

  :host([boxed]) .empty-state {
    /* Position empty state in the center - moved up */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 80px));
    width: 100%;
    max-width: 768px;
    height: auto;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  :host([boxed]) .empty-state__content {
    margin-bottom: 0;
  }

  :host([boxed]) .chatbot-content:has(.empty-state) + .input-box {
    /* Position input-box in the middle with empty state - moved up */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + 40px));
    width: 100%;
    max-width: 768px;
  }

  :host([boxed]) .suggestion-container {
    margin-top: 0;
  }

  :host([boxed]) .messages {
    box-shadow: none;
    margin-bottom: 0;
    background-color: #ffffff;
    align-items: stretch;
    width: 98%;
    padding: 8px 1.5rem;
  }

  :host([boxed]) .input-container {
    box-shadow: none;
    margin: 0;
    background-color: #ffffff;
  }

  .chat-container--with-threads {
    grid-template-columns: 240px 1fr;
  }

  .chat-container--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .chat-container--drag-over {
    background-color: #f4f4f4;
    border: 0.25rem dashed #7c3aed;
    border-radius: 8px;
  }

  .thread-sidebar {
    width: 260px;
    flex-shrink: 0;
    background-color: #f4f4f4;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .thread-sidebar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .thread-sidebar__header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #161616;
  }

  .thread-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem;
  }

  .thread-section {
    margin-bottom: 8px;
  }

  .thread-section__label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(128, 128, 128, 0.6);
    padding: 8px 12px 4px;
  }

  .thread-section__label svg {
    color: #f59e0b;
  }

  .thread-item {
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 0.5rem;
    transition: background-color 0.15s;
    border: 1px solid transparent;
    line-height: 1.6;
  }

  .thread-item:hover {
    background-color: #f4f4f4;
  }

  .thread-item--active {
    background-color: #f4f0fd;
    color: #7c3aed;
    border-color: #7c3aed;
  }

  .thread-item--active:hover {
    background-color: #f4f0fd;
    opacity: 0.95;
  }

  .thread-item__header {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 0.5rem;
  }

  .thread-item__title {
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    flex: 1;
    min-width: 0;
  }

  .thread-item__actions {
    display: none;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
  }

  .thread-item:hover .thread-item__actions {
    display: flex;
  }

  .thread-item__action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    margin: 0;
    background: none;
    border: none;
    border-radius: 4px;
    color: rgba(128, 128, 128, 0.6);
    cursor: pointer;
    flex-shrink: 0;
    line-height: 0;
    transition: color 0.15s, background-color 0.15s;
  }

  .thread-item__action-btn svg {
    display: block;
  }

  .thread-item__action-btn:hover {
    color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.1);
  }

  .thread-item__actions nr-popconfirm {
    margin-top: 4px;
  }

  .thread-item__delete:hover {
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
  }

  .thread-item--active .thread-item__action-btn {
    color: rgba(255, 255, 255, 0.55);
  }

  .thread-item--active .thread-item__action-btn:hover {
    color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.15);
  }

  .thread-item--active .thread-item__delete:hover {
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.15);
  }

  .thread-item__bookmark--active {
    color: #f59e0b !important;
    display: flex !important;
  }

  .thread-item__bookmark--active:hover {
    color: #d97706 !important;
    background-color: rgba(245, 158, 11, 0.1);
  }

  .thread-item--active .thread-item__bookmark--active {
    color: #f59e0b !important;
  }

  .thread-item__rename-input {
    flex: 1;
    min-width: 0;
    padding: 2px 6px;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    color: inherit;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid #3b82f6;
    border-radius: 4px;
    outline: none;
    line-height: 1.4;
  }

  .thread-item--active .thread-item__rename-input {
    background: rgba(255, 255, 255, 0.1);
  }

  .thread-item__preview {
    font-size: 13px;
    color: rgba(128, 128, 128, 0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  .thread-item--active .thread-item__preview {
    color: rgba(255, 255, 255, 0.65);
  }

  .thread-item__timestamp {
    font-size: 0.75rem;
    color: rgba(128, 128, 128, 0.6);
    line-height: 1.4;
  }

  .thread-item--active .thread-item__timestamp {
    color: rgba(255, 255, 255, 0.55);
  }

  .chat-box {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
    background-color: #ffffff;
    padding: 8px 12px;
    justify-content: flex-start; /* Always align messages to top */
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1; /* Take full height when empty */
    text-align: center;
    padding: 3rem 1.5rem;
  }

  .empty-state__content {
    color: #161616;
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 3rem;
    letter-spacing: -0.02em;
  }

  .message {
    display: flex;
    flex-direction: column;
    max-width: 75%;
    word-wrap: break-word;
    word-break: break-word;
    margin-bottom: 0.5rem;
    position: relative;
    min-width: 0;
    flex-shrink: 0;
  }

  .message.user {
    align-self: flex-end;
    align-items: flex-end;
  }

  .message.bot {
    align-self: flex-start;
    align-items: flex-start;
  }

  .message__content {
    padding: 8px 12px;
    border-radius: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    position: relative;
    font-weight: 400;
    box-shadow: none;
    box-sizing: border-box;
    overflow-wrap: break-word;
    white-space: normal;
    background-color: transparent;
    color: inherit;
    border: 0 solid transparent;
  }

  /* Message attachments (file tags) */
  .message__attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.25rem;
    position: relative;
    z-index: 1;
  }

  .message-file-preview-dropdown {
    display: inline-block;
    position: relative;
  }

  /* Ensure dropdown panel appears above everything */
  .message-file-preview-dropdown nr-dropdown {
    --nuraly-dropdown-z-index: 10000;
  }

  .message__attachment-tag {
    --nuraly-tag-font-size: 0.75rem;
    --nuraly-tag-padding-x: 4px;
    --nuraly-tag-padding-y: 0px;
    cursor: help;
  }

  /* Message file preview dropdown content */
  .message-file-preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    min-width: 200px;
    max-width: 300px;
  }

  .message-file-preview-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    object-fit: contain;
  }

  .message-file-preview-icon {
    color: #6c757d;
    opacity: 0.6;
  }

  .message-file-preview-info {
    width: 100%;
    text-align: center;
  }

  .message-file-preview-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.25rem;
  }

  .message-file-preview-details {
    font-size: 0.75rem;
    color: #6c757d;
  }

  .message.user .message__content {
    background-color: #7c3aed;
    color: #ffffff;
    border-radius: 0;
    border: 0 solid transparent;
    box-shadow: none;
  }

  .message.bot .message__content {
    background-color: transparent;
    color: inherit;
    border-radius: 0;
    border: 0 solid transparent;
    box-shadow: none;
  }

  .message.error .message__content {
    background-color: transparent;
    color: inherit;
    border-radius: 0;
    border: 0 solid transparent;
    box-shadow: none;
  }

  /* Styled error message container */
  .message__error-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-radius: 0.75rem;
  }

  .message__error-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: #c00;
    margin: 0;
  }

  .message__error-description {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
    line-height: 1.5;
  }

  /* Message footer - contains timestamp and copy icon */
  .message__footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .message.user .message__footer {
    justify-content: flex-end;
  }

  .message.bot .message__footer {
    justify-content: flex-start;
  }

  .message__timestamp {
    font-size: 0.75rem;
    color: #a8a8a8;
    font-weight: 400;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease, visibility 0.15s ease;
  }

  .message__copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer !important;
    --nuraly-cursor-default: pointer;
    pointer-events: auto !important;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease, visibility 0.15s ease;
    color: #a8a8a8;
  }

  .message:hover .message__copy {
    opacity: 1;
    visibility: visible;
  }

  .message:hover .message__timestamp {
    opacity: 1;
    visibility: visible;
  }

  .message__copy:hover {
    cursor: pointer !important;
  }

  .message__copy:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  .message__retry {
    margin-top: 0.5rem;
    align-self: flex-start;
  }

  .message.loading .message__content {
    display: flex;
    align-items: center;
    gap: var(--chatbot-spacing-sm);
    background-color: transparent;
    /* Set indicator color (affects spinner currentColor) */
    color: var(--chatbot-loading-indicator-color, var(--chatbot-text-secondary));
  }

  .dots {
    display: flex;
    gap: 0.125rem;
  }

  .dots span {
    width: 0.5rem;
    height: 0.5rem;
    background-color: currentColor;
    border-radius: 50%;
    animation: typing-dots 1.4s infinite;
  }

  .dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  .loading-text {
    font-style: italic;
    color: var(--chatbot-text-secondary);
    font-size: var(--chatbot-font-size-sm, 0.8125rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 280px;
    display: inline-flex;
    padding-left: 0.5rem;
  }

  .loading-text__char {
    display: inline-block;
    animation: chatbot-status-wave 1.4s ease-in-out infinite;
    opacity: 0.4;
  }

  @keyframes chatbot-status-wave {
    0%, 100% { opacity: 0.4; }
    50%      { opacity: 1; }
  }

  /* Spinner indicator (for loadingIndicator = Spinner) */
  .spinner {
    --_size: var(--chatbot-spinner-size, 1.25rem);
    --_bw: var(--chatbot-spinner-border-width, 2px);
    --_color: var(--chatbot-spinner-color, currentColor);
    --_speed: var(--chatbot-spinner-speed, 0.8s);

    display: inline-block;
    width: var(--_size);
    height: var(--_size);
    border: var(--_bw) solid transparent;
    border-top-color: var(--_color);
    border-radius: 50%;
    animation: chatbot-spin var(--_speed) linear infinite;
  }

  @keyframes chatbot-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes typing-dots {
    0%, 60%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    30% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Suggestions - styled pills */
    .suggestion-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
      justify-content: center;
      padding: 0 1rem;
      overflow: hidden;
      box-sizing: border-box;
    }

    .suggestion {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 12px;
      background-color: #ffffff;
      color: #161616;
      border: 1px solid #e0e0e0;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.3;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;
      white-space: normal;
      word-break: break-word;
      text-decoration: none;
      outline: none;
      max-width: 100%;
      text-align: center;
    }

    .suggestion:hover {
      background-color: #f4f4f4;
      border-color: #c6c6c6;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .suggestion:focus {
      outline: none;
    }

    .suggestion:active {
      transform: translateY(0);
      background-color: #f4f0fd;
    }

    .suggestion--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

  /* Input-only mode styles - suggestions float above the container */
  .chat-container:has(.input-only-suggestions) {
    position: relative;
    overflow: visible;
  }

  .chatbot-container:has(.input-only-suggestions) {
    overflow: visible;
  }

  .chatbot-main:has(.input-only-suggestions) {
    overflow: visible;
  }

  .input-only-suggestions {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }

  .input-only-suggestions .suggestion-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    pointer-events: auto;
  }

  .file-upload-area {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.95);
    border: 0.25rem dashed var(--chatbot-user-message-bg);
    border-radius: var(--chatbot-radius);
    z-index: 10;
  }

  .file-upload-area--visible {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-upload-area--drag-over {
    background-color: rgba(15, 98, 254, 0.1);
    border-color: var(--chatbot-user-message-bg);
  }

  .file-upload-area__content {
    text-align: center;
    padding: var(--chatbot-spacing-xl);
    color: var(--chatbot-text-primary);
  }

  .file-upload-area__content nr-icon {
    color: var(--chatbot-user-message-bg);
    margin-bottom: var(--chatbot-spacing-md);
  }

  .file-upload-area__help {
    font-size: 0.75rem;
    color: var(--chatbot-text-secondary);
    margin: var(--chatbot-spacing-xs) 0;
  }

  .uploaded-files {
    display: flex;
    flex-wrap: wrap;
    gap: var(--chatbot-spacing-sm);
    padding: var(--chatbot-spacing-sm);
    background-color: var(--chatbot-surface);
  }

  .uploaded-file {
    display: flex;
    align-items: center;
    gap: var(--chatbot-spacing-sm);
    padding: var(--chatbot-spacing-sm);
    background-color: var(--chatbot-background);
    border: 1px solid var(--chatbot-border);
    border-radius: var(--chatbot-radius);
    max-width: 200px;
  }

  .uploaded-file__preview {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: var(--chatbot-spacing-xs);
  }

  .uploaded-file__icon {
    color: var(--chatbot-text-secondary);
  }

  .uploaded-file__info {
    flex: 1;
    min-width: 0;
  }

  .uploaded-file__name {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--chatbot-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .uploaded-file__size {
    font-size: 11px;
    color: var(--chatbot-text-secondary);
  }

  .uploaded-file__progress {
    height: 0.125rem;
    background-color: var(--chatbot-border);
    border-radius: 0.125rem;
    overflow: hidden;
    margin-top: var(--chatbot-spacing-xs);
  }

  .uploaded-file__progress-bar {
    height: 100%;
    background-color: var(--chatbot-user-message-bg);
    transition: width 0.3s ease;
  }

  .uploaded-file__error {
    font-size: 11px;
    color: var(--chatbot-error-text);
    margin-top: var(--chatbot-spacing-xs);
  }

  .uploaded-file__remove {
    color: var(--chatbot-text-helper);
  }

  

  .input-container {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: visible;
    position: relative;
    min-width: 280px;
  }

  .context-tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.75rem 1rem 0 1rem;
    position: relative;
    z-index: 2;
  }

  .file-preview-dropdown {
    display: inline-block;
    position: relative;
  }


  .context-tag {
    --nuraly-tag-font-size: 0.75rem;
    --nuraly-tag-padding-x: 0.5rem;
    --nuraly-tag-padding-y: 0;
    cursor: help;
  }

  /* File preview dropdown content */
  .file-preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    min-width: 200px;
    max-width: 300px;
  }

  .file-preview-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    object-fit: contain;
  }

  .file-preview-icon {
    color: #6c757d;
    opacity: 0.6;
  }

  .file-preview-info {
    width: 100%;
    text-align: center;
  }

  .file-preview-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.25rem;
  }

  .file-preview-details {
    font-size: 0.75rem;
    color: #6c757d;
  }

  .input-container:focus-within {
    border-color: #7c3aed;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .input-row {
    display: flex;
    align-items: flex-start;
    padding: 1rem 1rem 0.5rem 1rem;
    min-height: 1.5rem;
  }

  .chat-container--boxed .input-box {
    background-color: transparent;
    padding: 1rem 0;
    width: 100%;
    box-sizing: border-box;
  }

  .chat-container--boxed .input-container {
    width: 100%;
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .chat-container--boxed .messages {
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
  }

  :host(:not([boxed])) .input-container {
    border-radius: 12px;
    margin: 1rem;
    box-sizing: border-box;
    width: calc(100% - 2 * 1rem);
  }

  :host(:not([boxed])) .action-buttons-row {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  :host(:not([boxed])) .messages {
    padding: 1rem !important;
    width: 100%;
    box-sizing: border-box;
  }

  .action-buttons-row {
    display: flex;
    align-items: center;
    justify-content: space-between; 
    gap: 0.75rem;
    padding: 0.5rem 1rem 1rem 1rem;
    background-color: transparent;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    min-width: 240px;
  }

  .action-buttons-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .action-buttons-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: calc(40px + 0.5rem);
    justify-content: flex-end;
  }

  .action-buttons-row nr-dropdown {
    display: inline-flex;
    align-items: center;
    --nuraly-size-md: 40px; /* Match select height */
  }

  /* Module select styling */
  .module-select {
    max-width: 300px;
  }

  /* Ensure buttons in action row match select height */
  .action-buttons-row nr-button {
    --nuraly-size-md: 40px; /* Match select height */
  }

  .module-display-placeholder {
    color: #6f6f6f;
    font-size: 0.875rem; /* 14px */
  }

  .module-display-single,
  .module-display-multiple {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* 6px */
    font-size: 0.875rem; /* 14px */
    color: inherit;
  }

  .module-display-single nr-icon {
    font-size: 1rem; /* 16px */
  }

  .module-display-multiple {
    font-weight: 500;
    color: #7c3aed;
  }

    /* Dropdown styling inside chatbot */
  .input-box__upload-dropdown {
    position: relative;
    z-index: 100;
  }

  .input-box__upload-dropdown ::part(panel) {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    min-width: 200px;
    position: fixed !important; /* Use fixed positioning to break out of containers */
    z-index: 100;
    transform: none !important;
  }

  .input-box__input {
    flex: 1;
    width: 100%;
    min-height: 1.5rem; /* 24px */
    max-height: 120px;
    overflow-y: auto;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: #161616;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    line-height: 1.4;
    resize: none;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .input-box__input:empty::before {
    content: attr(data-placeholder);
    color: #a8a8a8;
    pointer-events: none;
  }

  .input-box__input:focus {
    outline: none;
  }

  /* Styled action buttons using nr-button with CSS variable overrides */
  .input-box__file-button,
  .input-box__send-button {
    /* Remove any default margins */
    margin: 0;
  }

  /* Target the actual button element inside nr-button components */
  .input-box__file-button button,
  .input-box__send-button button {
    background: transparent !important;
    border: 1px solid #e0e0e0 !important;
    color: #161616 !important;
    padding: 0.5rem 0.75rem !important; /* 8px 12px */
    border-radius: 6px !important;
    font-size: 0.875rem !important; /* 14px */
    font-weight: 500 !important;
    min-width: auto !important;
    height: auto !important;
    gap: 0.5rem !important; /* 8px */
    transition: all 0.2s ease !important;
    white-space: nowrap !important;
  }

  /* Send button specific styling for more rounded appearance */
  .input-box__send-button button {
    border-radius: 6px !important;
    background-color: #7c3aed !important;
    color: #ffffff !important;
    border-color: #7c3aed !important;
    width: 40px !important; /* Match other button widths */
    height: 40px !important; /* Match other button heights */
    min-width: 40px !important; /* Prevent shrinking */
  }

  .input-box__file-button:hover button,
  .input-box__send-button:hover button {
    background-color: #f4f4f4 !important;
    border-color: #c6c6c6 !important;
    transform: scale(1.05);
  }

  /* Send button hover specific styling */
  .input-box__send-button:hover button {
    background-color: #6d28d9 !important;
    border-color: #6d28d9 !important;
  }

  .input-box__file-button:focus-within,
  .input-box__send-button:focus-within {
    outline: 0.25rem solid #7c3aed; /* 2px */
    outline-offset: 0.25rem; /* 2px */
  }

  .input-box__send-button[disabled] button,
  .input-box__file-button[disabled] button {
    background-color: #f4f4f4 !important;
    color: #c6c6c6 !important;
    border-color: #e0e0e0 !important;
    opacity: 0.6 !important;
    cursor: not-allowed !important;
  }

  /* Ensure icons are properly styled within the buttons */
  .input-box__send-button nr-icon,
  .input-box__file-button nr-icon {
    pointer-events: none;
  }

  /* RTL support */
  :host([dir='rtl']) .chat-container--with-threads {
    grid-template-columns: 1fr 280px;
  }

  :host([dir='rtl']) .thread-sidebar {
    border-right: none;
    border-left: 1px solid var(--chatbot-border);
  }

  :host([dir='rtl']) .message.user {
    align-self: flex-start;
  }

  :host([dir='rtl']) .message.bot {
    align-self: flex-end;
  }

  :host([dir='rtl']) .message.user .message__content {
    border-radius: 0;
  }

  :host([dir='rtl']) .message.bot .message__content {
    border-radius: 0;
  }

  :host([dir='rtl']) .message.user .message__timestamp {
    text-align: left;
  }

  :host([dir='rtl']) .message.bot .message__timestamp {
    text-align: right;
  }

  :host([dir='rtl']) .input-row {
    flex-direction: row-reverse;
  }

  /* Size variants */
  :host([data-size='small']) {
    --chatbot-spacing-md: 0.75rem; /* 12px */
    font-size: 13px;
  }

  :host([data-size='large']) {
    --chatbot-spacing-md: 20px;
    font-size: 15px;
  }

  /* Variant styles */
  :host([data-variant='rounded']) {
    --chatbot-radius: 16px;
  }

  :host([data-variant='squared']) {
    --chatbot-radius: 4px;
  }

  /* Mode-specific styles */
  :host([data-mode='assistant']) .message.bot .message__content {
    background: linear-gradient(135deg, transparent, #f1f1f1);
  }

  :host([data-mode='assistant']) .suggestion {
    background: linear-gradient(135deg, var(--chatbot-surface), var(--chatbot-surface-hover));
  }

  /* Focus states */
  .chat-container--focused {
    outline: 2px solid var(--chatbot-user-message-bg);
    outline-offset: 2px;
  }

  /* Artifact panel */
  .artifact-panel {
    width: 400px;
    min-width: 300px;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    background-color: #ffffff;
    overflow: hidden;
    position: relative;
  }

  .artifact-panel__resize-handle {
    flex-shrink: 0;
    width: 8px;
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e0e0e0;
    transition: background 0.15s;
    z-index: 1;
  }
  .artifact-panel__resize-handle:hover,
  .artifact-panel__resize-handle--active {
    background: #9ca3af;
  }
  .artifact-panel__resize-bar {
    width: 2px;
    height: 24px;
    border-radius: 1px;
    background: #9ca3af;
    transition: background 0.15s;
  }
  .artifact-panel__resize-handle:hover .artifact-panel__resize-bar,
  .artifact-panel__resize-handle--active .artifact-panel__resize-bar {
    background: #1f2937;
  }

  .artifact-panel__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    border-left: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .artifact-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0;
  }

  .artifact-panel__header-info {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .artifact-panel__lang-badge {
    flex-shrink: 0;
    --nuraly-tag-font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .artifact-panel__title {
    font-size: 13px;
    font-weight: 500;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .artifact-panel__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .artifact-panel__content {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }

  .artifact-panel__code {
    margin: 0;
    padding: 16px;
    background: #f6f8fa;
    border-radius: 8px;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 1.5;
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #1f2937;
    tab-size: 2;
  }

  .artifact-panel__code code {
    font-family: inherit;
    font-size: inherit;
  }

  .artifact-panel__rendered-md {
    font-size: 14px;
    line-height: 1.6;
    color: #1f2937;
  }

  .artifact-panel__rendered-md h1,
  .artifact-panel__rendered-md h2,
  .artifact-panel__rendered-md h3 {
    margin: 0.6em 0 0.4em;
    font-weight: 600;
  }

  .artifact-panel__rendered-md p {
    margin: 0.5em 0;
  }

  .artifact-panel__rendered-md pre {
    background: #f6f8fa;
    padding: 12px;
    border-radius: 6px;
    overflow: auto;
  }

  .artifact-panel__rendered-html {
    font-size: 14px;
    line-height: 1.6;
    color: #1f2937;
  }

  .artifact-panel__rendered-text {
    font-size: 14px;
    line-height: 1.6;
    color: #1f2937;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: system-ui, -apple-system, sans-serif;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    :host {
      min-width: 0;
    }

    .chatbot-container {
      min-width: 0;
    }

    .chatbot-container--with-artifact-panel {
      position: relative;
    }

    .artifact-panel {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100% !important;
      min-width: 0;
      z-index: 20;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    }

    .artifact-panel__resize-handle {
      display: none;
    }

    .thread-sidebar {
      width: 200px;
    }

    .input-container {
      min-width: 0;
    }

    .action-buttons-row {
      min-width: 0;
    }

    .message {
      max-width: 90%;
    }

    .input-row {
      flex-wrap: wrap;
    }

    /* Boxed mode responsive fixes */
    :host([boxed]) .chatbot-main {
      max-width: 100%;
    }

    :host([boxed]) .messages {
      width: 100%;
      padding: 8px 0.75rem;
    }

    .chat-container--boxed .input-container {
      width: 100%;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }

    .chat-container--boxed .input-box {
      padding: 0.75rem 0;
    }

    :host([boxed]) .chatbot-content:has(.empty-state) + .input-box {
      max-width: 100%;
      padding: 0 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .chatbot-container--with-sidebar {
      position: relative;
    }

    .thread-sidebar {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 260px;
      z-index: 10;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    }

    .message {
      max-width: 95%;
    }

    .uploaded-file {
      max-width: 150px;
    }

    .input-container {
      min-width: 0;
      width: 100%;
    }

    /* Boxed mode mobile fixes */
    :host([boxed]) .messages {
      padding: 8px 0.5rem;
    }

    .chat-container--boxed .input-container {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }

    .chat-container--boxed .input-box {
      padding: 0.5rem 0;
    }

    :host([boxed]) .chatbot-content:has(.empty-state) + .input-box {
      padding: 0 0.5rem;
    }

    .input-row {
      padding: 0.75rem;
    }
  }

  
  /* High contrast mode */
  @media (prefers-contrast: high) {
    :host {
      --chatbot-border: #000000;
      --chatbot-text-primary: #000000;
      --chatbot-user-message-bg: #0000ff;
      --chatbot-error-border: #ff0000;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

`;