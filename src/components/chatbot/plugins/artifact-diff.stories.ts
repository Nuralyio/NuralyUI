/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { html } from 'lit';
import { ArtifactPlugin } from './artifact-plugin.js';
import { MarkdownPlugin } from './markdown-plugin.js';
import { ChatbotCoreController } from '../core/chatbot-core.controller.js';
import { MockProvider } from '../providers/mock-provider.js';
import { ChatbotSender } from '../chatbot.types.js';
import type { ChatbotArtifactMetadata } from '../chatbot.types.js';
import '../chatbot.component.js';
import '.././../skeleton/index.js';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Chatbot/Plugins/Artifact Diff',
  component: 'nr-chatbot',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Artifact Panel — Diff View

The consumer ships pure data; lumenui owns the render. Pass
\`metadata.previousContent\` (and optionally \`metadata.patch\`) to
\`artifactPlugin.addArtifact(...)\` and the panel renders a **JSON / Diff / Patch**
tab toggle. No subclassing, no diff library, no Lit templates in the consumer.

## What to check

- **JsonEdit**: the panel opens on the **Diff** tab (red removed / green added lines).
  Toggle to **JSON** to see the formatted current content.
- **CanonicalizeJsonNoise**: keys reordered but values unchanged. With
  \`metadata.canonicalize: 'json'\` the Diff tab disappears (no real change),
  leaving only JSON.
- **PatchTab**: an RFC 6902 patch adds a third **Patch** tab rendered as a table.
- **NoPreviousContent**: a plain artifact shows only JSON, no tab bar.
        `
      }
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

interface EditArtifactSeed {
  question: string;
  reply: string;
  language: string;
  title?: string;
  content: string;
  metadata?: ChatbotArtifactMetadata;
  autoOpen?: boolean;
}

function renderDiffStory(elementId: string, seed: EditArtifactSeed) {
  setTimeout(() => {
    const chatbot = document.querySelector(`#${elementId}`) as any;
    if (!chatbot || chatbot.controller) return;

    const artifactPlugin = new ArtifactPlugin();
    const controller = new ChatbotCoreController({
      provider: new MockProvider({ delay: 0, streaming: false, contextualResponses: false }),
      plugins: [new MarkdownPlugin(), artifactPlugin],
      ui: {
        onStateChange: (state: any) => {
          chatbot.messages = state.messages;
          chatbot.isBotTyping = state.isTyping;
          chatbot.chatStarted = state.messages.length > 0;
        },
        onTypingStart: () => { chatbot.isBotTyping = true; },
        onTypingEnd: () => { chatbot.isBotTyping = false; }
      }
    });
    chatbot.controller = controller;
    chatbot.enableArtifacts = true;

    const mh = (controller as any).messageHandler;
    mh.addMessage({ sender: ChatbotSender.User, text: seed.question });
    const botMsg = mh.addMessage({ sender: ChatbotSender.Bot, text: seed.reply });

    artifactPlugin.addArtifact({
      messageId: botMsg.id,
      language: seed.language,
      title: seed.title,
      content: seed.content,
      metadata: seed.metadata
    });

    if (seed.autoOpen !== false) {
      setTimeout(() => {
        const card = chatbot.shadowRoot?.querySelector(
          `[data-artifact-id="artifact-${botMsg.id}-0"]`
        ) as HTMLElement | null;
        card?.click();
      }, 50);
    }
  }, 0);

  return html`
    <div style="width: 100%; height: 100vh;">
      <nr-chatbot
        id="${elementId}"
        size="full"
        variant="default"
        .showSendButton=${true}
        .autoScroll=${true}
        .enableArtifacts=${true}
        placeholder="The diff demo runs automatically — click the artifact card."
      ></nr-chatbot>
    </div>
  `;
}

const PREV_DOCFLOW = JSON.stringify({
  name: 'invoice-pipeline',
  version: '1.0.0',
  steps: ['fetch', 'validate', 'store'],
  retries: 1,
  notify: false
}, null, 2);

const NEXT_DOCFLOW = JSON.stringify({
  name: 'invoice-pipeline',
  version: '1.1.0',
  steps: ['fetch', 'validate', 'transform', 'store'],
  retries: 3,
  notify: true
}, null, 2);

/**
 * A docflow JSON is edited. The panel opens on the Diff tab showing the
 * version bump, the inserted "transform" step, and the changed flags.
 */
export const JsonEdit: Story = {
  render: () => renderDiffStory('artifact-diff-json', {
    question: 'Add a transform step and bump the version.',
    reply: 'Done — here is the updated docflow:',
    language: 'json',
    title: 'invoice-pipeline.json',
    content: NEXT_DOCFLOW,
    metadata: { previousContent: PREV_DOCFLOW, isEdit: true }
  })
};

/**
 * Same values, reordered keys. `canonicalize: 'json'` key-sorts both sides
 * before diffing, so the Diff tab recognises there is no real change and
 * hides itself — only the JSON tab remains.
 */
export const CanonicalizeJsonNoise: Story = {
  render: () => renderDiffStory('artifact-diff-canon', {
    question: 'Re-serialise the config (no semantic change).',
    reply: 'Re-serialised. The keys moved but nothing actually changed:',
    language: 'json',
    title: 'config.json',
    content: JSON.stringify({ b: 2, a: 1, nested: { y: 2, x: 1 } }, null, 2),
    metadata: {
      previousContent: JSON.stringify({ a: 1, b: 2, nested: { x: 1, y: 2 } }, null, 2),
      isEdit: true,
      canonicalize: 'json'
    }
  })
};

/**
 * The consumer also ships an RFC 6902 patch. A third "Patch" tab renders it as
 * a small op / path / value table alongside JSON and Diff.
 */
export const PatchTab: Story = {
  render: () => renderDiffStory('artifact-diff-patch', {
    question: 'Enable notifications and add a retry.',
    reply: 'Applied the following patch:',
    language: 'json',
    title: 'settings.json',
    content: JSON.stringify({ retries: 3, notify: true }, null, 2),
    metadata: {
      previousContent: JSON.stringify({ retries: 1, notify: false }, null, 2),
      isEdit: true,
      patch: [
        { op: 'replace', path: '/retries', value: 3 },
        { op: 'replace', path: '/notify', value: true }
      ]
    }
  })
};

/**
 * No `previousContent` — a plain generated artifact. The panel shows only the
 * JSON view with no tab bar (backward-compatible with today's behaviour).
 */
export const NoPreviousContent: Story = {
  render: () => renderDiffStory('artifact-diff-plain', {
    question: 'Generate a fresh config.',
    reply: 'Here is a new config:',
    language: 'json',
    title: 'fresh.json',
    content: JSON.stringify({ name: 'brand-new', enabled: true }, null, 2)
  })
};
