import { expect } from '@open-wc/testing';
import { ChatbotCoreController } from '../../core/chatbot-core.controller.js';
import { ArtifactPlugin } from '../artifact-plugin.js';
import { ChatbotSender } from '../../chatbot.types.js';
import type { ChatbotProvider } from '../../core/types.js';

const flush = () => new Promise<void>(r => setTimeout(r, 0));

function makeProvider(): ChatbotProvider {
  return {
    id: 'p', name: 'P', capabilities: {} as any,
    connect: async () => {}, disconnect: async () => {},
    isConnected: () => false,
    sendMessage: (() => ({ next: async () => ({ done: true, value: undefined }) })) as any,
  };
}

function setup() {
  const artifactPlugin = new ArtifactPlugin();
  const controller = new ChatbotCoreController({
    provider: makeProvider(),
    plugins: [artifactPlugin],
  } as any) as any;
  return { artifactPlugin, controller };
}

function loadBot(controller: any, message: any) {
  controller.loadConversations([
    { id: 't1', title: 'T', messages: [message], messagesLoaded: true },
  ]);
}

const PREV = '{"a":1}';
const NEXT = '{"a":2}';

suite('ArtifactPlugin upsert + structured artifacts', () => {
  test('a host artifacts row supplies metadata to the fence-extracted artifact', async () => {
    const { artifactPlugin, controller } = setup();
    await flush();
    loadBot(controller, {
      id: 'b1', sender: ChatbotSender.Bot, timestamp: '0',
      text: 'Updated.\n```json\n' + NEXT + '\n```',
      artifacts: [{ id: 'art-1', language: 'json', content: NEXT, title: 'docflow.json',
        metadata: { previousContent: PREV, isEdit: true, canonicalize: 'json' } }],
    });
    await flush();

    const art = artifactPlugin.getArtifact('art-1');
    expect(art, 'artifact registered under host id').to.not.equal(undefined);
    expect(art!.metadata?.previousContent).to.equal(PREV);
    expect(art!.metadata?.isEdit).to.equal(true);
    expect(art!.title).to.equal('docflow.json');

    // exactly one inline card, carrying the host id
    const msg = controller.getMessages().find((m: any) => m.id === 'b1');
    expect((msg.text.match(/data-artifact-id/g) || []).length).to.equal(1);
    expect(msg.text).to.contain('data-artifact-id="art-1"');
  });

  test('addArtifact merges metadata onto an existing id and adds no second card', async () => {
    const { artifactPlugin, controller } = setup();
    await flush();
    loadBot(controller, {
      id: 'b1', sender: ChatbotSender.Bot, timestamp: '0',
      text: 'Here:\n```json\n' + NEXT + '\n```',
    });
    await flush();

    const id = 'artifact-b1-0';
    expect(artifactPlugin.getArtifact(id)).to.not.equal(undefined);

    const merged = artifactPlugin.addArtifact({ id, metadata: { previousContent: PREV, isEdit: true } });
    expect(merged!.metadata?.previousContent).to.equal(PREV);
    expect(artifactPlugin.getArtifact(id)!.metadata?.isEdit).to.equal(true);

    const msg = controller.getMessages().find((m: any) => m.id === 'b1');
    expect((msg.text.match(/data-artifact-id/g) || []).length).to.equal(1);
  });

  test('upsert merges per-key: existing keys survive, incoming keys win', async () => {
    const { artifactPlugin, controller } = setup();
    await flush();
    loadBot(controller, {
      id: 'b1', sender: ChatbotSender.Bot, timestamp: '0',
      text: 'x\n```json\n' + NEXT + '\n```',
      artifacts: [{ id: 'a', language: 'json', content: NEXT,
        metadata: { previousContent: PREV, isEdit: true } }],
    });
    await flush();

    artifactPlugin.addArtifact({ id: 'a', metadata: { isEdit: false, canonicalize: 'json' } });
    const m = artifactPlugin.getArtifact('a')!.metadata!;
    expect(m.previousContent).to.equal(PREV); // existing key survived
    expect(m.isEdit).to.equal(false);          // incoming key won
    expect(m.canonicalize).to.equal('json');   // incoming key added
  });

  test('a non-default title is not overwritten by a generated one', async () => {
    const { artifactPlugin } = setup();
    await flush();
    // seed via addArtifact upsert is not possible without a message; use a row load instead
    const { artifactPlugin: ap2, controller } = setup();
    await flush();
    loadBot(controller, {
      id: 'b1', sender: ChatbotSender.Bot, timestamp: '0',
      text: 'x\n```json\n' + NEXT + '\n```',
      artifacts: [{ id: 'a', language: 'json', content: NEXT, title: 'invoice.json',
        metadata: { previousContent: PREV, isEdit: true } }],
    });
    await flush();
    // host updates metadata only (no title) -> generated title must not clobber
    ap2.addArtifact({ id: 'a', metadata: { isEdit: false } });
    expect(ap2.getArtifact('a')!.title).to.equal('invoice.json');
    void artifactPlugin;
  });

  test('a host artifacts row with no fence is registered without an inline card', async () => {
    const { artifactPlugin, controller } = setup();
    await flush();
    loadBot(controller, {
      id: 'b1', sender: ChatbotSender.Bot, timestamp: '0',
      text: 'No code in this message.',
      artifacts: [{ id: 'only-1', language: 'json', content: NEXT,
        metadata: { previousContent: PREV, isEdit: true } }],
    });
    await flush();

    const art = artifactPlugin.getArtifact('only-1');
    expect(art).to.not.equal(undefined);
    expect(art!.metadata?.isEdit).to.equal(true);

    const msg = controller.getMessages().find((m: any) => m.id === 'b1');
    expect((msg.text.match(/data-artifact-id/g) || []).length).to.equal(0);
  });

  test('metadata survives a rebuild (thread switch) via stored entries', async () => {
    const { artifactPlugin, controller } = setup();
    await flush();
    loadBot(controller, {
      id: 'b1', sender: ChatbotSender.Bot, timestamp: '0',
      text: 'x\n```json\n' + NEXT + '\n```',
      artifacts: [{ id: 'a', language: 'json', content: NEXT,
        metadata: { previousContent: PREV, isEdit: true } }],
    });
    await flush();

    // simulate the in-memory map being lost on a thread switch
    (artifactPlugin as any).artifacts.clear();
    expect(artifactPlugin.getArtifact('a')).to.equal(undefined);

    const msg = controller.getMessages().find((m: any) => m.id === 'b1');
    await artifactPlugin.onMessageReceived(msg);

    const art = artifactPlugin.getArtifact('a');
    expect(art).to.not.equal(undefined);
    expect(art!.metadata?.previousContent).to.equal(PREV);
  });
});
