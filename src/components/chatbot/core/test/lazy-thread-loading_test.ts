import { expect } from '@open-wc/testing';
import { ChatbotCoreController } from '../chatbot-core.controller.js';
import type { ChatbotProvider } from '../types.js';

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const flush = () => new Promise<void>(r => setTimeout(r, 0));

interface MockProviderOptions {
  summaries: Array<{ id: string | number; title: string }>;
  detail?: (id: string | number) => any;
  loadConversationImpl?: (id: string | number) => Promise<any>;
}

interface MockProvider extends ChatbotProvider {
  loadConversationsCalls: number;
  loadConversationCalls: Array<string | number>;
}

function makeProvider(opts: MockProviderOptions): MockProvider {
  const provider: MockProvider = {
    id: 'mock',
    name: 'Mock',
    capabilities: {} as any,
    loadConversationsCalls: 0,
    loadConversationCalls: [],
    connect: async () => {},
    disconnect: async () => {},
    isConnected: () => true,
    sendMessage: (async function* () {})() as any,
    loadConversations: async () => {
      provider.loadConversationsCalls += 1;
      return opts.summaries;
    },
    loadConversation: async (id: string | number) => {
      provider.loadConversationCalls.push(id);
      if (opts.loadConversationImpl) return opts.loadConversationImpl(id);
      const messages = opts.detail
        ? opts.detail(id)
        : [{ id: `m-${id}`, text: `hi from ${id}`, sender: 'bot' }];
      return { id, title: `T${id}`, messages };
    },
  };
  return provider;
}

function makeController(provider: ChatbotProvider): ChatbotCoreController {
  return new ChatbotCoreController({ enableThreads: true, provider } as any);
}

suite('lazy thread loading', () => {
  test('autoLoadConversations fetches summaries once and does not fan out per conversation', async () => {
    const provider = makeProvider({
      summaries: [
        { id: 1, title: 'A' },
        { id: 2, title: 'B' },
        { id: 3, title: 'C' },
      ],
    });
    const controller = makeController(provider);
    await flush();

    expect(provider.loadConversationsCalls).to.equal(1);
    // Only the visible (auto-selected) thread is hydrated, not all three.
    expect(provider.loadConversationCalls.length).to.equal(1);

    const threads = controller.getState().threads;
    expect(threads.map(t => String(t.id))).to.eql(['1', '2', '3']);
    const visibleId = String(controller.getState().currentThreadId);
    for (const t of threads) {
      if (String(t.id) === visibleId) {
        expect(t.messagesLoaded, 'visible thread is hydrated').to.equal(true);
      } else {
        expect(t.messagesLoaded, 'other threads stay skeletons').to.equal(false);
        expect(t.messages.length).to.equal(0);
      }
    }
  });

  test('switchThread fetches messages on first open of a not-yet-loaded thread', async () => {
    const provider = makeProvider({
      summaries: [
        { id: 1, title: 'A' },
        { id: 2, title: 'B' },
      ],
    });
    const controller = makeController(provider);
    await flush();
    provider.loadConversationCalls.length = 0;

    controller.switchThread(2);
    await flush();

    expect(provider.loadConversationCalls).to.eql([2]);
    expect(controller.getState().currentThreadId).to.equal(2 as any);
    expect(controller.getState().messages.length).to.equal(1);
    const t2 = controller.getState().threads.find(t => String(t.id) === '2')!;
    expect(t2.messagesLoaded).to.equal(true);
  });

  test('does not refetch on a second switch back to the same thread', async () => {
    const provider = makeProvider({
      summaries: [
        { id: 1, title: 'A' },
        { id: 2, title: 'B' },
      ],
    });
    const controller = makeController(provider);
    await flush();
    provider.loadConversationCalls.length = 0;

    controller.switchThread(2);
    await flush();
    controller.switchThread(1);
    await flush();
    controller.switchThread(2);
    await flush();

    const twos = provider.loadConversationCalls.filter(id => String(id) === '2');
    expect(twos.length, 'thread 2 fetched exactly once').to.equal(1);
  });

  test('drops a late response when the user switches away mid-flight', async () => {
    const d1 = deferred<any>();
    const provider = makeProvider({
      summaries: [
        { id: 1, title: 'A' },
        { id: 2, title: 'B' },
      ],
      loadConversationImpl: (id) => {
        if (String(id) === '1') return d1.promise;
        return Promise.resolve({ id, messages: [{ id: `m-${id}`, text: 'fresh', sender: 'bot' }] });
      },
    });
    const controller = makeController(provider);
    await flush();

    controller.switchThread(1); // starts a fetch that will hang
    await flush();
    controller.switchThread(2); // race-click before #1 resolves
    await flush();

    d1.resolve({ id: 1, messages: [{ id: 'stale', text: 'stale', sender: 'bot' }] });
    await flush();

    expect(String(controller.getState().currentThreadId)).to.equal('2');
    const texts = controller.getState().messages.map(m => m.text);
    expect(texts).to.not.include('stale');
  });

  test('emits thread:loading-messages and thread:loaded-messages around the fetch', async () => {
    const provider = makeProvider({
      summaries: [
        { id: 1, title: 'A' },
        { id: 2, title: 'B' },
      ],
    });
    const controller = makeController(provider);
    await flush();

    const loading: Array<string | number> = [];
    const loaded: Array<string | number> = [];
    controller.on('thread:loading-messages', (id: string) => loading.push(id));
    controller.on('thread:loaded-messages', (id: string) => loaded.push(id));

    controller.switchThread(2);
    await flush();

    expect(loading.map(String)).to.include('2');
    expect(loaded.map(String)).to.include('2');
  });

  test('100 conversations cause one list request and no per-conversation fan-out', async () => {
    const summaries = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, title: `C${i + 1}` }));
    const provider = makeProvider({ summaries });
    const controller = makeController(provider);
    await flush();

    expect(provider.loadConversationsCalls).to.equal(1);
    // At most the single visible thread is hydrated; never all 100.
    expect(provider.loadConversationCalls.length).to.be.at.most(1);
    expect(controller.getState().threads.length).to.equal(100);
  });
});
