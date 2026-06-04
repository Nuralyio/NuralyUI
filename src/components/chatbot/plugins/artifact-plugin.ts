/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import type { ChatbotPlugin } from '../core/types.js';
import type { ChatbotMessage, ChatbotArtifact, ChatbotArtifactMetadata, ChatbotMessageArtifact } from '../chatbot.types.js';
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

    const rawText = message.text ?? '';
    const rows: ChatbotMessageArtifact[] = Array.isArray(message.artifacts) ? message.artifacts : [];
    if (!rawText && rows.length === 0) return;

    // Match fenced code blocks: ```lang\n...\n```. Each fence becomes an inline
    // card; a matching host row supplies authoritative metadata/title/id.
    const fenceRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;
    const extracted: ChatbotArtifact[] = [];
    const fenceIds: string[] = [];
    const usedRows = new Set<number>();
    let index = 0;

    while ((match = fenceRegex.exec(rawText)) !== null) {
      const language = (match[1] || 'text').toLowerCase();
      const content = match[2];
      const row = this.matchArtifactRow(rows, index, language, content, usedRows);
      const id = row?.id ?? `artifact-${message.id}-${index}`;
      const titleProvided = !!row?.title;
      const stored = this.upsertArtifact({
        id,
        language,
        content,
        title: row?.title || this.extractTitle(content, language, index),
        messageId: message.id,
        index,
        metadata: row?.metadata
      }, { titleGenerated: !titleProvided }).artifact;

      extracted.push(stored);
      fenceIds.push(id);
      index++;
    }

    // Host rows with no matching fence: register them (no inline card) so the
    // side panel can render them, e.g. the live-diff path on an empty message.
    rows.forEach((row, i) => {
      if (usedRows.has(i) || !row.content) return;
      const language = (row.language || 'text').toLowerCase();
      const id = row.id ?? `artifact-${message.id}-row-${i}`;
      const titleProvided = !!row.title;
      const stored = this.upsertArtifact({
        id,
        language,
        content: row.content,
        title: row.title || this.extractTitle(row.content, language, index),
        messageId: message.id,
        index: index++,
        metadata: row.metadata
      }, { titleGenerated: !titleProvided }).artifact;
      extracted.push(stored);
    });

    if (extracted.length === 0) return;

    // Build the card-injected text only when there were actual fences.
    let textUpdate: string | undefined;
    if (fenceIds.length > 0) {
      let transformed = rawText;
      let cardIndex = 0;
      transformed = transformed.replaceAll(fenceRegex, () =>
        `\x00ARTIFACT_CARD_${fenceIds[cardIndex++]}\x00`
      );
      transformed = renderMarkdown(transformed);
      for (const id of fenceIds) {
        const art = this.artifacts.get(id);
        if (art) {
          transformed = transformed.replace(
            `\x00ARTIFACT_CARD_${id}\x00`,
            this.renderPlaceholderCard(art)
          );
        }
      }
      const styleTag = this.getOncePerConversationStyleTag(this.getStyles());
      textUpdate = styleTag + transformed;
    }

    if (this.controller && typeof this.controller.updateMessage === 'function') {
      this.controller.updateMessage(message.id, {
        ...(textUpdate != null ? { text: textUpdate } : {}),
        metadata: {
          ...message.metadata,
          ...(textUpdate != null ? { renderAsHtml: true } : {}),
          hasArtifacts: true,
          artifactIds: extracted.map(a => a.id),
          // Preserve original text + full entries (incl. metadata) so artifacts
          // and their host-set metadata survive a thread switch.
          artifactOriginalText: rawText,
          artifactEntries: extracted
        }
      });
    }
  }

  /**
   * Match a fenced block to a host-supplied artifact row: by position first,
   * then by language + content, then by content alone. Returns undefined when
   * no row corresponds (fence is then a plain auto-extracted artifact).
   */
  private matchArtifactRow(
    rows: ChatbotMessageArtifact[],
    index: number,
    language: string,
    content: string,
    used: Set<number>
  ): ChatbotMessageArtifact | undefined {
    const sameContent = (r: ChatbotMessageArtifact) => (r.content ?? '').trim() === content.trim();
    const sameLang = (r: ChatbotMessageArtifact) => (r.language ?? '').toLowerCase() === language;

    const positional = rows[index];
    if (positional && !used.has(index) && (!positional.language || sameLang(positional) || sameContent(positional))) {
      used.add(index);
      return positional;
    }
    for (let i = 0; i < rows.length; i++) {
      if (!used.has(i) && sameLang(rows[i]) && sameContent(rows[i])) { used.add(i); return rows[i]; }
    }
    for (let i = 0; i < rows.length; i++) {
      if (!used.has(i) && sameContent(rows[i])) { used.add(i); return rows[i]; }
    }
    return undefined;
  }

  /**
   * Insert or merge an artifact by id. Existing metadata is preserved and the
   * incoming metadata merged on top (incoming key wins; an absent incoming key
   * keeps the existing value). A non-default title is never overwritten by a
   * generated "<Lang> Snippet N".
   */
  private upsertArtifact(
    entry: ChatbotArtifact,
    opts: { titleGenerated: boolean }
  ): { artifact: ChatbotArtifact; created: boolean } {
    const existing = this.artifacts.get(entry.id);
    if (!existing) {
      this.artifacts.set(entry.id, entry);
      return { artifact: entry, created: true };
    }

    const mergedMetadata = existing.metadata || entry.metadata
      ? { ...(existing.metadata ?? {}), ...(entry.metadata ?? {}) }
      : undefined;
    const keepTitle = opts.titleGenerated && !this.isGeneratedTitle(existing.title);

    const merged: ChatbotArtifact = {
      ...existing,
      language: entry.language || existing.language,
      content: entry.content || existing.content,
      title: keepTitle ? existing.title : (entry.title || existing.title),
      messageId: existing.messageId || entry.messageId,
      index: existing.index,
      metadata: mergedMetadata
    };
    this.artifacts.set(entry.id, merged);
    return { artifact: merged, created: false };
  }

  private isGeneratedTitle(title: string): boolean {
    return / Snippet \d+$/.test(title);
  }

  /** Reflect a merged artifact back into its message's stored entries. */
  private syncStoredEntry(artifact: ChatbotArtifact): void {
    if (!this.controller || typeof this.controller.getMessages !== 'function'
        || typeof this.controller.updateMessage !== 'function') return;
    const messages: ChatbotMessage[] = this.controller.getMessages() || [];
    const message = messages.find(m => m.id === artifact.messageId);
    if (!message) return;
    const prev: ChatbotArtifact[] = Array.isArray(message.metadata?.artifactEntries)
      ? message.metadata!.artifactEntries
      : [];
    const next = prev.some(e => e.id === artifact.id)
      ? prev.map(e => e.id === artifact.id ? artifact : e)
      : [...prev, artifact];
    this.controller.updateMessage(artifact.messageId, {
      metadata: { ...message.metadata, artifactEntries: next }
    });
  }

  /**
   * Rebuild the artifact Map entries from a message that was already processed.
   * This is needed after thread switches: the message text/metadata are persisted
   * in the thread, but the in-memory artifact Map is not.
   */
  private rebuildArtifactsFromMetadata(message: ChatbotMessage): void {
    // Preferred path: full entries were stored (carry host-set metadata), so
    // the diff view survives a thread switch without re-extraction.
    const entries: ChatbotArtifact[] | undefined = message.metadata?.artifactEntries;
    if (Array.isArray(entries) && entries.length) {
      for (const entry of entries) {
        if (!this.artifacts.has(entry.id)) this.artifacts.set(entry.id, entry);
      }
      return;
    }

    const ids: string[] | undefined = message.metadata?.artifactIds;
    if (!ids?.length) return;

    // Check if artifacts are already in the Map (no work needed)
    if (ids.every(id => this.artifacts.has(id))) return;

    // Legacy fallback: re-extract from the preserved original text (no metadata)
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

  /**
   * Upsert an artifact, by `id`. Two modes:
   *
   * - **New id** (or no id): creates the artifact and drops a clickable card
   *   into the target bot message. Requires `messageId` and `content`.
   * - **Existing id**: MERGES the supplied `metadata` onto the stored entry and
   *   keeps a non-default `title`; it does NOT add a second card. This lets a
   *   host attach `metadata.previousContent` after fence extraction already
   *   created the artifact, so the diff view sticks. Precedence:
   *   `message.artifacts[].metadata` > host `addArtifact` metadata > `{}`.
   *
   * The consumer ships pure data; lumenui renders the diff.
   *
   * @returns the stored artifact, or undefined when a new artifact cannot be
   *          created (no/invalid target message or missing content).
   */
  addArtifact(input: {
    id?: string;
    messageId?: string;
    language?: string;
    content?: string;
    title?: string;
    metadata?: ChatbotArtifactMetadata;
  }): ChatbotArtifact | undefined {
    // Upsert path: merge onto an existing entry, no new card.
    if (input.id && this.artifacts.has(input.id)) {
      const existing = this.artifacts.get(input.id)!;
      const { artifact } = this.upsertArtifact({
        ...existing,
        language: (input.language || existing.language).toLowerCase(),
        content: input.content ?? existing.content,
        title: input.title || existing.title,
        messageId: input.messageId || existing.messageId,
        index: existing.index,
        metadata: input.metadata
      }, { titleGenerated: !input.title });
      this.syncStoredEntry(artifact);
      return artifact;
    }

    // Create path: needs a real bot message and content.
    if (input.content == null || !input.messageId) return undefined;
    if (!this.controller || typeof this.controller.getMessages !== 'function') return undefined;
    const messages: ChatbotMessage[] = this.controller.getMessages() || [];
    const message = messages.find(m => m.id === input.messageId);
    if (!message || message.sender !== ChatbotSender.Bot) return undefined;

    const index = this.getArtifactsForMessage(input.messageId).length;
    const language = (input.language || 'text').toLowerCase();
    const id = input.id ?? `artifact-${input.messageId}-${index}`;
    const titleProvided = !!input.title;
    const artifact = this.upsertArtifact({
      id,
      language,
      content: input.content,
      title: input.title || this.extractTitle(input.content, language, index),
      messageId: input.messageId,
      index,
      metadata: input.metadata
    }, { titleGenerated: !titleProvided }).artifact;

    const alreadyHtml = !!message.metadata?.renderAsHtml;
    const styleTag = this.getOncePerConversationStyleTag(this.getStyles());
    const body = alreadyHtml ? message.text : styleTag + renderMarkdown(message.text || '');
    const existingIds: string[] = message.metadata?.artifactIds || [];
    const existingEntries: ChatbotArtifact[] = Array.isArray(message.metadata?.artifactEntries)
      ? message.metadata!.artifactEntries
      : [];

    if (typeof this.controller.updateMessage === 'function') {
      this.controller.updateMessage(input.messageId, {
        text: body + this.renderPlaceholderCard(artifact),
        metadata: {
          ...message.metadata,
          renderAsHtml: true,
          hasArtifacts: true,
          artifactIds: existingIds.includes(id) ? existingIds : [...existingIds, id],
          artifactEntries: existingEntries.some(e => e.id === id)
            ? existingEntries.map(e => e.id === id ? artifact : e)
            : [...existingEntries, artifact]
        }
      });
    }

    return artifact;
  }

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
