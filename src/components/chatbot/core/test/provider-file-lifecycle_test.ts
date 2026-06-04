import { expect } from '@open-wc/testing';
import { ChatbotCoreController } from '../chatbot-core.controller.js';
import type { ChatbotProvider } from '../types.js';

const flush = () => new Promise<void>(r => setTimeout(r, 0));

interface ScriptedStream {
  iterator: AsyncIterator<string>;
  push: (value: string) => void;
  end: () => void;
  fail: (err: unknown) => void;
}

function makeStream(): ScriptedStream {
  let pending: { resolve: (r: IteratorResult<string>) => void; reject: (e: unknown) => void } | null = null;
  const buffer: Array<IteratorResult<string> | { __error: unknown }> = [];

  const deliver = (r: IteratorResult<string>) => {
    if (pending) { const p = pending; pending = null; p.resolve(r); } else { buffer.push(r); }
  };
  const deliverError = (err: unknown) => {
    if (pending) { const p = pending; pending = null; p.reject(err); } else { buffer.push({ __error: err }); }
  };

  const iterator: AsyncIterator<string> = {
    next() {
      return new Promise<IteratorResult<string>>((resolve, reject) => {
        if (buffer.length) {
          const item = buffer.shift()!;
          if ((item as any).__error) reject((item as any).__error);
          else resolve(item as IteratorResult<string>);
        } else {
          pending = { resolve, reject };
        }
      });
    },
  };

  return {
    iterator,
    push: (value: string) => deliver({ value, done: false }),
    end: () => deliver({ value: undefined as any, done: true }),
    fail: (err: unknown) => deliverError(err),
  };
}

function makeProvider(): ChatbotProvider {
  const provider: ChatbotProvider = {
    id: 'capture',
    name: 'Capture',
    capabilities: {} as any,
    connect: async () => {},
    disconnect: async () => {},
    isConnected: () => true,
    sendMessage: (() => makeStream().iterator) as any,
  };
  return provider;
}

function makeController(provider: ChatbotProvider): ChatbotCoreController {
  return new ChatbotCoreController({ provider } as any);
}

const f1 = { id: 'f1', name: 'docflow.json', size: 1024, type: 'application/json' } as any;
const userMessage = () => ({ id: 'u1', text: 'edit this docflow', sender: 'user', timestamp: 0 } as any);

suite('processMessage file lifecycle', () => {
  test('clears the upload tray after a clean successful stream', async () => {
    const provider = makeProvider();
    const stream = makeStream();
    provider.sendMessage = (() => stream.iterator) as any;
    const controller = makeController(provider) as any;
    await flush();

    controller.fileHandler.addFile(f1);
    expect(controller.getState().uploadedFiles).to.have.length(1);

    const done = controller.providerService.processMessage(userMessage());
    await flush();
    stream.push('hello');
    await flush();
    stream.end();
    await done;

    expect(controller.getState().uploadedFiles).to.have.length(0);
  });

  test('keeps the tray intact when the user cancels mid-stream', async () => {
    const provider = makeProvider();
    const stream = makeStream();
    provider.sendMessage = (() => stream.iterator) as any;
    const controller = makeController(provider) as any;
    await flush();

    controller.fileHandler.addFile(f1);

    const done = controller.providerService.processMessage(userMessage());
    await flush();
    stream.push('hello');
    await flush();
    controller.stop();
    stream.end();
    await done;

    expect(controller.getState().uploadedFiles).to.have.length(1);
    expect(controller.providerService.cancelRequested).to.equal(true);
  });

  test('keeps the tray intact when the provider throws mid-stream', async () => {
    const provider = makeProvider();
    const stream = makeStream();
    provider.sendMessage = (() => stream.iterator) as any;
    const controller = makeController(provider) as any;
    await flush();

    controller.fileHandler.addFile(f1);

    const done = controller.providerService.processMessage(userMessage()).catch(() => {});
    await flush();
    stream.push('hello');
    await flush();
    stream.fail(new Error('socket reset'));
    await done;

    expect(controller.getState().uploadedFiles).to.have.length(1);
  });

  test('keeps the tray intact when the initial connect() fails', async () => {
    const provider = makeProvider();
    const controller = makeController(provider) as any;
    await flush();

    controller.fileHandler.addFile(f1);
    provider.isConnected = () => false;
    provider.connect = async () => { throw new Error('refused'); };

    await controller.providerService.processMessage(userMessage());

    expect(controller.getState().uploadedFiles).to.have.length(1);
  });

  test('emits processing:end exactly once on clean, cancel and throw paths', async () => {
    const provider = makeProvider();
    const controller = makeController(provider) as any;
    await flush();

    let ends = 0;
    controller.on('processing:end', () => { ends += 1; });

    const clean = makeStream();
    provider.sendMessage = (() => clean.iterator) as any;
    const p1 = controller.providerService.processMessage(userMessage());
    await flush();
    clean.push('ok');
    await flush();
    clean.end();
    await p1;

    const cancelled = makeStream();
    provider.sendMessage = (() => cancelled.iterator) as any;
    const p2 = controller.providerService.processMessage(userMessage());
    await flush();
    cancelled.push('ok');
    await flush();
    controller.stop();
    cancelled.end();
    await p2;

    const thrown = makeStream();
    provider.sendMessage = (() => thrown.iterator) as any;
    const p3 = controller.providerService.processMessage(userMessage()).catch(() => {});
    await flush();
    thrown.fail(new Error('boom'));
    await p3;

    expect(ends).to.equal(3);
  });

  test('a retry after a cancel re-sends the same staged files', async () => {
    const provider = makeProvider();
    const cancelled = makeStream();
    provider.sendMessage = (() => cancelled.iterator) as any;
    const controller = makeController(provider) as any;
    await flush();

    controller.fileHandler.addFile(f1);

    const first = controller.providerService.processMessage(userMessage());
    await flush();
    cancelled.push('hello');
    await flush();
    controller.stop();
    cancelled.end();
    await first;

    expect(controller.getState().uploadedFiles).to.have.length(1);

    const retry = makeStream();
    let capturedContext: any;
    provider.sendMessage = ((_text: string, context: any) => {
      capturedContext = context;
      return retry.iterator;
    }) as any;

    const second = controller.providerService.processMessage(userMessage());
    await flush();
    retry.push('ok');
    await flush();
    retry.end();
    await second;

    expect((capturedContext.uploadedFiles || []).map((f: any) => f.id)).to.eql(['f1']);
  });
});
