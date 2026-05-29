/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type { ChatbotPlugin } from '../core/types.js';
import type { ChatbotMessage, ChatbotArtifact } from '../chatbot.types.js';
import { ChatbotSender } from '../chatbot.types.js';
import { ChatPluginBase } from './chat-plugin.js';
import { escapeHtml, getLangDisplayName, renderMarkdown } from '../utils/index.js';

/**
 * Artifact Plugin - extracts fenced code blocks from bot messages and replaces
 * them with clickable placeholder cards.  Works with a right-side artifact
 * panel rendered by the chatbot component.
 *
 * The plugin operates on *completed* bot messages (`onMessageReceived`) so
 * that streaming chunk-splitting cannot break partially-received code fences.
 * While streaming is in progress the code blocks render normally via the
 * MarkdownPlugin; once the full message arrives the blocks are collapsed into
 * compact cards.
 *
 * @example
 * ```typescript
 * const artifactPlugin = new ArtifactPlugin();
 * const controller = new ChatbotCoreController({
 *   plugins: [new MarkdownPlugin(), artifactPlugin],
 *   // ...
 * });
 * ```
 */
export class ArtifactPlugin extends ChatPluginBase implements ChatbotPlugin {
  readonly id = 'artifact';
  readonly name = 'Artifact Plugin';
  readonly version = '1.0.0';

  /** All extracted artifacts keyed by their id */
  private readonly artifacts = new Map<string, ChatbotArtifact>();

  /** Reference to the core controller (set via onInit) */
  private controller: any;

  // ── Lifecycle ──────────────────────────────────────────────────────

  override onInit(controller: any): void {
    this.controller = controller;

    // For streamed messages, onMessageReceived() is NOT called (only
    // messageHandler.addMessage triggers it, while streaming uses
    // appendToBotMessage).  Listen for processing:end to post-process
    // the final bot message after the stream finishes.
    if (controller && typeof controller.on === 'function') {
      controller.on('processing:end', () => {
        try {
          const messages: ChatbotMessage[] = controller.getMessages?.() || [];
          const lastBotMsg = [...messages].reverse().find(
            (m: ChatbotMessage) => m.sender === ChatbotSender.Bot
          );
          if (lastBotMsg && !lastBotMsg.metadata?.hasArtifacts) {
            this.processMessage(lastBotMsg);
          }
        } catch {
          // best-effort
        }
      });
    }
  }

  /**
   * Post-process a complete bot message (called from both onMessageReceived
   * for addMessage()-based messages and from the processing:end listener
   * for streamed messages).
   */
  override async onMessageReceived(message: ChatbotMessage): Promise<void> {
    if (message.sender !== ChatbotSender.Bot) return;
    this.processMessage(message);
  }

  /**
   * Detect fenced code blocks, extract them as artifacts, and replace each
   * block in the message text with a compact clickable placeholder card.
   */
  private processMessage(message: ChatbotMessage): void {
    // If already processed, rebuild the artifact Map from stored metadata
    // so that artifact lookups work after thread switches.
    if (message.metadata?.hasArtifacts) {
      this.rebuildArtifactsFromMetadata(message);
      return;
    }

    const rawText = message.text;
    if (!rawText) return;

    // Match fenced code blocks: ```lang\n...\n```
    const fenceRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    const extracted: ChatbotArtifact[] = [];
    let index = 0;

    while ((match = fenceRegex.exec(rawText)) !== null) {
      const language = (match[1] || 'text').toLowerCase();
      const content = match[2];
      const id = `artifact-${message.id}-${index}`;
      const title = this.extractTitle(content, language, index);

      const artifact: ChatbotArtifact = {
        id,
        language,
        content,
        title,
        messageId: message.id,
        index
      };

      extracted.push(artifact);
      this.artifacts.set(id, artifact);
      index++;
    }

    if (extracted.length === 0) return;

    // Replace each fenced block with a placeholder card, and render basic
    // markdown for the surrounding prose (since afterReceive from the
    // MarkdownPlugin may not run for addMessage()-based messages).
    let transformed = rawText;
    let cardIndex = 0;
    transformed = transformed.replaceAll(fenceRegex, () => {
      const artifact = extracted[cardIndex++];
      // Temporarily mark card positions with a unique token so they survive
      // the markdown pass unscathed.
      return `\x00ARTIFACT_CARD_${artifact.id}\x00`;
    });

    // Render markdown on the surrounding prose
    transformed = renderMarkdown(transformed);

    // Swap the tokens back to actual card HTML
    for (const artifact of extracted) {
      transformed = transformed.replace(
        `\x00ARTIFACT_CARD_${artifact.id}\x00`,
        this.renderPlaceholderCard(artifact)
      );
    }

    // Inject styles (once per conversation)
    const styleTag = this.getOncePerConversationStyleTag(this.getStyles());

    // Update the message through the controller
    if (this.controller && typeof this.controller.updateMessage === 'function') {
      this.controller.updateMessage(message.id, {
        text: styleTag + transformed,
        metadata: {
          ...message.metadata,
          renderAsHtml: true,
          hasArtifacts: true,
          artifactIds: extracted.map(a => a.id),
          // Preserve original text so artifacts can be rebuilt after thread switch
          artifactOriginalText: rawText
        }
      });
    }
  }

  /**
   * Rebuild the artifact Map entries from a message that was already processed.
   * This is needed after thread switches: the message text/metadata are persisted
   * in the thread, but the in-memory artifact Map is not.
   */
  private rebuildArtifactsFromMetadata(message: ChatbotMessage): void {
    const ids: string[] | undefined = message.metadata?.artifactIds;
    if (!ids?.length) return;

    // Check if artifacts are already in the Map (no work needed)
    if (ids.every(id => this.artifacts.has(id))) return;

    // Re-extract from the preserved original text
    const originalText: string | undefined = message.metadata?.artifactOriginalText;
    if (!originalText) return;

    const fenceRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    let index = 0;

    while ((match = fenceRegex.exec(originalText)) !== null) {
      const language = (match[1] || 'text').toLowerCase();
      const content = match[2];
      const id = `artifact-${message.id}-${index}`;
      const title = this.extractTitle(content, language, index);

      this.artifacts.set(id, {
        id,
        language,
        content,
        title,
        messageId: message.id,
        index
      });
      index++;
    }
  }

  // ── Public API ─────────────────────────────────────────────────────

  /** Get an artifact by its id */
  getArtifact(id: string): ChatbotArtifact | undefined {
    return this.artifacts.get(id);
  }

  /** Get all stored artifacts */
  getAllArtifacts(): ChatbotArtifact[] {
    return Array.from(this.artifacts.values());
  }

  /** Get all artifacts belonging to a specific message */
  getArtifactsForMessage(messageId: string): ChatbotArtifact[] {
    return Array.from(this.artifacts.values()).filter(a => a.messageId === messageId);
  }

  /**
   * Force artifact extraction on a specific message NOW, regardless of
   * streaming state. Useful when structured content arrives via a
   * side-channel (e.g. tool result events delivered out-of-band) and the
   * caller wants the artifact card to appear before the stream's
   * `processing:end` fires.
   *
   * <p>Idempotent: if the message has already been processed
   * (`metadata.hasArtifacts === true`), this is a no-op. The regular
   * `processing:end` handler will also skip the message later for the
   * same reason, so calling this method early does NOT cause duplicate
   * processing on stream completion.
   *
   * <p>Typical usage from outside the plugin:
   * ```typescript
   * const artifactPlugin = new ArtifactPlugin();
   * const controller = new ChatbotCoreController({
   *   plugins: [new MarkdownPlugin(), artifactPlugin],
   *   // ...
   * });
   *
   * // When a tool result arrives via a custom side-channel:
   * provider.onMessage('TOOL_RESULT_JSON', (msg) => {
   *   const messages = controller.getMessages();
   *   const lastBotMsg = [...messages].reverse()
   *     .find(m => m.sender === ChatbotSender.Bot);
   *   if (lastBotMsg) {
   *     // 1) Append the fenced content to the bot message text
   *     controller.messageHandler.appendToBotMessage(
   *       lastBotMsg.id,
   *       '\n\n```json\n' + msg.content + '\n```\n\n'
   *     );
   *     // 2) Trigger artifact extraction right away
   *     artifactPlugin.processNow(lastBotMsg.id);
   *   }
   * });
   * ```
   *
   * @param messageId id of the bot message to process. If not found, or
   *                  not a bot message, returns false.
   * @returns true when the message was processed (or rebuilt from
   *          metadata); false when skipped or message not found.
   */
  processNow(messageId: string): boolean {
    if (!this.controller || typeof this.controller.getMessages !== 'function') {
      return false;
    }
    const messages: ChatbotMessage[] = this.controller.getMessages() || [];
    const message = messages.find(m => m.id === messageId);
    if (!message || message.sender !== ChatbotSender.Bot) {
      return false;
    }
    if (message.metadata?.hasArtifacts) {
      // Already processed — but rebuild the in-memory artifacts Map so
      // callers can immediately resolve artifact IDs via getArtifact().
      this.rebuildArtifactsFromMetadata(message);
      return true;
    }
    this.processMessage(message);
    return true;
  }

  // ── Private helpers ────────────────────────────────────────────────

  /**
   * Try to extract a meaningful title from the first comment line of the code.
   * Falls back to a generic "Code Snippet #N" title.
   */
  private extractTitle(content: string, language: string, index: number): string {
    const firstLine = content.trimStart().split('\n')[0] || '';

    // Single-line comment patterns: // ..., # ..., -- ..., /* ... */
    const commentPatterns = [
      /^\/\/\s*(.+)/,      // // comment
      /^#\s*(.+)/,         // # comment
      /^--\s*(.+)/,        // -- comment (SQL)
      /^\/\*\s*(.*?)\*\//,  // /* comment */ (no trailing \s* — trim in code)
      /^<!--\s*(.*?)-->/    // <!-- comment --> (no trailing \s* — trim in code)
    ];

    for (const pattern of commentPatterns) {
      const m = pattern.exec(firstLine);
      if (m?.[1]) {
        const title = m[1].trim();
        if (title.length > 0 && title.length <= 60) return title;
      }
    }

    // Fallback: use language + index
    const langLabel = getLangDisplayName(language);
    return `${langLabel} Snippet ${index + 1}`;
  }

  /** Render a compact clickable placeholder card for an artifact */
  private renderPlaceholderCard(artifact: ChatbotArtifact): string {
    const langLabel = getLangDisplayName(artifact.language);
    const title = escapeHtml(artifact.title);

    return `<div class="nr-artifact-card" data-artifact-id="${artifact.id}" role="button" tabindex="0" aria-label="View ${title}">
  <nr-icon name="code" size="small" class="nr-artifact-card__icon"></nr-icon>
  <span class="nr-artifact-card__info">
    <span class="nr-artifact-card__title">${title}</span>
    <nr-tag size="small" class="nr-artifact-card__lang">${langLabel}</nr-tag>
  </span>
  <nr-icon name="chevron-right" size="small" class="nr-artifact-card__chevron"></nr-icon>
</div>`;
  }

  /** CSS for the placeholder cards (injected once via style tag) */
  private getStyles(): string {
    return `
      .nr-artifact-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        margin: 8px 0;
        background: #f6f8fa;
        border: 1px solid #d0d7de;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;
        user-select: none;
        max-width: 100%;
      }
      .nr-artifact-card:hover {
        background: #eaeef2;
        border-color: #8b949e;
      }
      .nr-artifact-card:focus-visible {
        outline: 2px solid #0b5fff;
        outline-offset: 2px;
      }
      .nr-artifact-card__icon {
        flex-shrink: 0;
        color: #57606a;
      }
      .nr-artifact-card__info {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
        flex: 1;
      }
      .nr-artifact-card__title {
        font-size: 13px;
        font-weight: 500;
        color: #1f2937;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.3;
      }
      .nr-artifact-card__lang {
        align-self: flex-start;
      }
      .nr-artifact-card__chevron {
        flex-shrink: 0;
        color: #6c757d;
      }
    `;
  }
}
