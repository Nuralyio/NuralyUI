import { expect } from '@open-wc/testing';
import { ChatbotCoreController } from '../../core/chatbot-core.controller.js';
import { SelectionCardPlugin } from '../selection-card-plugin.js';

const PLACEHOLDER_RE = /data-placeholder-id="selection-skeleton/;

function makeController(): ChatbotCoreController {
  return new ChatbotCoreController({
    enableThreads: false,
    plugins: [new SelectionCardPlugin()],
  });
}

async function streamChunks(controller: ChatbotCoreController, chunks: string[]): Promise<void> {
  const provSvc = (controller as any).providerService;
  async function* gen(): AsyncGenerator<string> {
    let cumulative = '';
    for (const c of chunks) {
      cumulative += c;
      yield cumulative;
      await Promise.resolve();
    }
  }
  await provSvc.processStream(gen());
}

function lastBotText(controller: ChatbotCoreController): string {
  const msgs = controller.getState().messages;
  return msgs.length ? msgs[msgs.length - 1].text : '';
}

suite('SelectionCardPlugin', () => {
  test('replaces the skeleton with a selection card after [/SELECTION] arrives', async () => {
    const controller = makeController();
    await streamChunks(controller, [
      '<p>Choose:</p>\n\n[SELECTION]{"type":"selection","columns":1,"options":[{"label":"A","value":"A"',
      '},{"label":"B","value":"B"}]',
      '}[/SELECTION]',
    ]);

    const text = lastBotText(controller);
    expect(text, 'skeleton placeholder must be gone').to.not.match(PLACEHOLDER_RE);
    expect(text, 'rendered card markup present').to.contain('data-nr-selection-card="true"');
    const optionCount = (text.match(/data-selection-value="/g) || []).length;
    expect(optionCount).to.equal(2);
    expect(text, 'raw markers consumed').to.not.contain('[SELECTION]');
  });

  test('renders the card when the whole block arrives in one chunk', async () => {
    const controller = makeController();
    const json = JSON.stringify({
      type: 'selection',
      title: 'Pick',
      options: [{ label: 'X', value: 'X' }],
    });
    await streamChunks(controller, [`<p>Hi</p>\n\n[SELECTION]${json}[/SELECTION]`]);

    const text = lastBotText(controller);
    expect(text).to.not.match(PLACEHOLDER_RE);
    expect(text).to.contain('data-nr-selection-card="true"');
    expect((text.match(/data-selection-value="/g) || []).length).to.equal(1);
  });

  test('falls back to raw markers (no orphaned skeleton) when JSON is invalid', async () => {
    const controller = makeController();
    await streamChunks(controller, [
      '<p>Broken:</p>\n\n[SELECTION]{not valid',
      ' json,,,}[/SELECTION]',
    ]);

    const text = lastBotText(controller);
    expect(text, 'no orphaned skeleton').to.not.match(PLACEHOLDER_RE);
    expect(text, 'no rendered card').to.not.contain('data-nr-selection-card="true"');
    expect(text, 'raw markers preserved for consumer fallback').to.contain('[SELECTION]');
    expect(text).to.contain('[/SELECTION]');
  });

  test('does not leave a spinning skeleton when the closing marker never arrives', async () => {
    const controller = makeController();
    const json = JSON.stringify({ type: 'selection', options: [{ label: 'X', value: 'X' }] });
    await streamChunks(controller, [`<p>Cut off:</p>\n\n[SELECTION]${json}`]);

    const text = lastBotText(controller);
    expect(text, 'no orphaned skeleton').to.not.match(PLACEHOLDER_RE);
    expect(text, 'open marker + buffer restored').to.contain('[SELECTION]');
  });

  test('keeps the card after a re-render through processMessageThroughPlugins', async () => {
    const controller = makeController();
    const json = JSON.stringify({ type: 'selection', options: [{ label: 'A', value: 'A' }] });
    await streamChunks(controller, [`<p>Hi</p>\n\n[SELECTION]${json}[/SELECTION]`]);
    const before = lastBotText(controller);

    // Simulate a hot re-render (thread reload / artifact panel toggle) that
    // funnels persisted messages back through the plugin pipeline.
    const reprocess = (controller as any).processMessageThroughPlugins.bind(controller);
    const msg = controller.getState().messages.slice(-1)[0];
    const after = reprocess({ ...msg }).text;

    expect(after).to.not.match(PLACEHOLDER_RE);
    expect(after).to.contain('data-nr-selection-card="true"');
    expect(before).to.contain('data-nr-selection-card="true"');
  });
});
