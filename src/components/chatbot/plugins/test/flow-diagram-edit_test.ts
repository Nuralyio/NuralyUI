import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { FlowDiagramPlugin } from '../flow-diagram-plugin.js';
import type { ChatbotArtifact } from '../../chatbot.types.js';

const PREV = JSON.stringify({
  Name: 'W',
  Steps: { A: { StepType: 'Worker' } },
  Transitions: { t: { Source: 'A', Target: 'EndEvent' } }
}, null, 2);

const NEXT = JSON.stringify({
  Name: 'W',
  Steps: { A: { StepType: 'Worker' }, B: { StepType: 'System' } },
  Transitions: {
    t: { Source: 'A', Target: 'B' },
    t2: { Source: 'B', Target: 'EndEvent' }
  }
}, null, 2);

function artifact(content: string, metadata?: ChatbotArtifact['metadata']): ChatbotArtifact {
  return { id: 'a1', language: 'json', content, title: 't', messageId: 'm1', index: 0, metadata };
}

function mountEditor(htmlStr: string): Promise<HTMLElement> {
  const tpl = document.createElement('template');
  tpl.innerHTML = htmlStr.trim();
  const el = tpl.content.firstElementChild as HTMLElement;
  return fixture(html`${el}`);
}

suite('FlowDiagramPlugin diff integration', () => {
  let plugin: FlowDiagramPlugin;

  setup(() => {
    plugin = new FlowDiagramPlugin();
    plugin.onInit();
  });

  test('renderArtifactContent adds previous-content for an edit artifact', () => {
    const out = plugin.renderArtifactContent(artifact(NEXT, { previousContent: PREV, isEdit: true }));
    expect(out).to.contain('<nr-flow-diagram-editor');
    expect(out).to.contain('previous-content=');
  });

  test('renderArtifactContent omits previous-content for a non-edit artifact', () => {
    const out = plugin.renderArtifactContent(artifact(NEXT));
    expect(out).to.contain('<nr-flow-diagram-editor');
    expect(out).to.not.contain('previous-content=');
  });

  test('editor renders the shared diff view (not a textarea) when previous-content is present', async () => {
    const out = plugin.renderArtifactContent(artifact(NEXT, { previousContent: PREV, isEdit: true }));
    const el = await mountEditor(out);
    await waitUntil(() => !!el.shadowRoot?.querySelector('nr-artifact-diff-view'), 'diff view mounts');

    const diffView = el.shadowRoot!.querySelector('nr-artifact-diff-view') as any;
    expect(diffView).to.not.equal(null);
    expect(el.shadowRoot!.querySelector('.editor-textarea')).to.equal(null);
    // diagram side still renders from the current content
    expect(el.shadowRoot!.querySelector('.diagram')).to.not.equal(null);

    await diffView.updateComplete;
    expect(diffView.shadowRoot.querySelector('.diff__line--add')).to.not.equal(null);
    // diff shown directly: no JSON/Diff tab bar in the docflow editor
    expect(diffView.shadowRoot.querySelector('.tabbar')).to.equal(null);
  });

  test('highlights the added step node in the diagram', async () => {
    const out = plugin.renderArtifactContent(artifact(NEXT, { previousContent: PREV, isEdit: true }));
    const el = await mountEditor(out);
    await waitUntil(() => !!el.shadowRoot?.querySelector('.diagram'), 'diagram mounts');

    const added = el.shadowRoot!.querySelector('.step-node--added');
    expect(added).to.not.equal(null);
    expect(added!.textContent).to.contain('B');
    expect(added!.querySelector('.step-change--added')).to.not.equal(null);
    // step A is unchanged → not highlighted
    expect(el.shadowRoot!.querySelectorAll('.step-node--added').length).to.equal(1);
  });

  test('marks a step modified when its config or transition target changed', async () => {
    const prevMod = JSON.stringify({
      Name: 'W',
      Steps: { A: { StepType: 'Worker', Description: 'old' } },
      Transitions: { t: { Source: 'A', Target: 'EndEvent' } }
    });
    const nextMod = JSON.stringify({
      Name: 'W',
      Steps: { A: { StepType: 'Worker', Description: 'new' } },
      Transitions: { t: { Source: 'A', Target: 'EndEvent' } }
    });
    const out = plugin.renderArtifactContent(artifact(nextMod, { previousContent: prevMod, isEdit: true }));
    const el = await mountEditor(out);
    await waitUntil(() => !!el.shadowRoot?.querySelector('.diagram'), 'diagram mounts');
    expect(el.shadowRoot!.querySelector('.step-node--modified')).to.not.equal(null);
  });

  test('renders a removed step as a deleted ghost node anchored after its survivor', async () => {
    const prevDel = JSON.stringify({
      Name: 'W',
      Steps: { A: { StepType: 'Worker' }, B: { StepType: 'Worker' }, C: { StepType: 'System' } },
      Transitions: {
        s: { Source: 'StartEvent', Target: 'A' },
        a: { Source: 'A', Target: 'B' },
        b: { Source: 'B', Target: 'C' },
        c: { Source: 'C', Target: 'EndEvent' }
      }
    });
    const nextDel = JSON.stringify({
      Name: 'W',
      Steps: { A: { StepType: 'Worker' }, C: { StepType: 'System' } },
      Transitions: {
        s: { Source: 'StartEvent', Target: 'A' },
        a: { Source: 'A', Target: 'C' },
        c: { Source: 'C', Target: 'EndEvent' }
      }
    });
    const out = plugin.renderArtifactContent(artifact(nextDel, { previousContent: prevDel, isEdit: true }));
    const el = await mountEditor(out);
    await waitUntil(() => !!el.shadowRoot?.querySelector('.diagram'), 'diagram mounts');

    const ghost = el.shadowRoot!.querySelector('.step-node--deleted');
    expect(ghost).to.not.equal(null);
    expect(ghost!.textContent).to.contain('B');
    expect(ghost!.querySelector('.step-change--deleted')).to.not.equal(null);

    // B (ghost) sits between A and C in the diagram
    const stepNames = Array.from(el.shadowRoot!.querySelectorAll('.step-node .step-name'))
      .map(n => (n.textContent || '').trim());
    expect(stepNames).to.eql(['A', 'B', 'C']);
  });

  test('hovering a diagram node highlights the matching JSON line in the diff', async () => {
    const out = plugin.renderArtifactContent(artifact(NEXT, { previousContent: PREV, isEdit: true }));
    const el = await mountEditor(out);
    await waitUntil(() => !!el.shadowRoot?.querySelector('.diagram .step-node[data-step]'), 'nodes mount');

    const diffView = el.shadowRoot!.querySelector('nr-artifact-diff-view') as any;
    await diffView.updateComplete;

    const nodeB = el.shadowRoot!.querySelector('.step-node[data-step="B"]') as HTMLElement;
    expect(nodeB).to.not.equal(null);
    nodeB.dispatchEvent(new MouseEvent('mouseenter'));

    // the whole "B" object block is highlighted, not just the key line
    const hl = Array.from(diffView.shadowRoot.querySelectorAll('.diff__line--hl'))
      .map((l: any) => (l.querySelector('.diff__text')?.textContent ?? '').trim());
    expect(hl.length).to.be.greaterThan(1);
    expect(hl.some((t: string) => t.includes('"B"'))).to.equal(true);
    expect(hl.some((t: string) => t.includes('StepType'))).to.equal(true);

    nodeB.dispatchEvent(new MouseEvent('mouseleave'));
    expect(diffView.shadowRoot.querySelector('.diff__line--hl')).to.equal(null);
  });

  test('editor keeps the editable textarea when there is no previous-content', async () => {
    const out = plugin.renderArtifactContent(artifact(NEXT));
    const el = await mountEditor(out);
    await waitUntil(() => !!el.shadowRoot?.querySelector('.editor-textarea'), 'textarea mounts');
    expect(el.shadowRoot!.querySelector('.editor-textarea')).to.not.equal(null);
    expect(el.shadowRoot!.querySelector('nr-artifact-diff-view')).to.equal(null);
  });
});
