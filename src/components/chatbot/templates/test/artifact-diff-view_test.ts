import { expect, fixture, html } from '@open-wc/testing';
import '../artifact-diff-view.component.js';
import type { NrArtifactDiffViewElement } from '../artifact-diff-view.component.js';
import { diffLines, canonicalizeJson, hasRealDiff } from '../artifact-diff.js';
import type { ChatbotArtifact, ChatbotArtifactMetadata } from '../../chatbot.types.js';

function artifact(content: string, metadata?: ChatbotArtifactMetadata): ChatbotArtifact {
  return { id: 'a1', language: 'json', content, title: 't', messageId: 'm1', index: 0, metadata };
}

async function mount(a: ChatbotArtifact): Promise<NrArtifactDiffViewElement> {
  const el = await fixture<NrArtifactDiffViewElement>(html`<nr-artifact-diff-view .artifact=${a}></nr-artifact-diff-view>`);
  await el.updateComplete;
  return el;
}

function tabLabels(el: NrArtifactDiffViewElement): string[] {
  return Array.from(el.shadowRoot!.querySelectorAll('.tab')).map(t => (t.textContent || '').trim());
}

function activeTab(el: NrArtifactDiffViewElement): string {
  const sel = el.shadowRoot!.querySelector('.tab[aria-selected="true"]');
  return sel ? (sel.textContent || '').trim() : '';
}

suite('artifact-diff utilities', () => {
  test('diffLines marks one removed and one added line for a single-line change', () => {
    const rows = diffLines('{"a":1}', '{"a":2}');
    expect(rows.filter(r => r.kind === 'del')).to.have.length(1);
    expect(rows.filter(r => r.kind === 'add')).to.have.length(1);
  });

  test('canonicalizeJson key-sorts so reordered objects are byte-identical', () => {
    expect(canonicalizeJson('{"b":2,"a":1}')).to.equal(canonicalizeJson('{"a":1,"b":2}'));
  });

  test('hasRealDiff is false for reordered keys under json canonicalization', () => {
    expect(hasRealDiff('{"b":2,"a":1}', '{"a":1,"b":2}', 'json')).to.equal(false);
    expect(hasRealDiff('{"b":2,"a":1}', '{"a":1,"b":2}', 'none')).to.equal(true);
  });
});

suite('nr-artifact-diff-view', () => {
  test('renders JSON tab only (no tab bar) when there is no previousContent', async () => {
    const el = await mount(artifact('{"a":1}'));
    expect(el.shadowRoot!.querySelector('.tabbar')).to.equal(null);
    expect(el.shadowRoot!.querySelector('.code')).to.not.equal(null);
  });

  test('renders JSON + Diff tabs when previousContent is present', async () => {
    const el = await mount(artifact('{"a":2}', { previousContent: '{"a":1}', isEdit: true }));
    expect(tabLabels(el)).to.eql(['JSON', 'Diff']);
  });

  test('Diff tab is selected by default when isEdit', async () => {
    const el = await mount(artifact('{"a":2}', { previousContent: '{"a":1}', isEdit: true }));
    expect(activeTab(el)).to.equal('Diff');
    expect(el.shadowRoot!.querySelector('.diff__line--add')).to.not.equal(null);
    expect(el.shadowRoot!.querySelector('.diff__line--del')).to.not.equal(null);
  });

  test('canonicalize "json" hides the Diff tab when only key order changed', async () => {
    const el = await mount(artifact('{"b":2,"a":1}', {
      previousContent: '{"a":1,"b":2}', isEdit: true, canonicalize: 'json'
    }));
    expect(tabLabels(el)).to.eql([]);
    expect(el.shadowRoot!.querySelector('.tabbar')).to.equal(null);
  });

  test('Patch tab appears and renders a table for an RFC 6902 patch', async () => {
    const el = await mount(artifact('{"a":2}', {
      previousContent: '{"a":1}', isEdit: true, patch: [{ op: 'replace', path: '/a', value: 2 }]
    }));
    expect(tabLabels(el)).to.eql(['JSON', 'Diff', 'Patch']);
    const patchBtn = Array.from(el.shadowRoot!.querySelectorAll('.tab')).find(t => (t.textContent || '').trim() === 'Patch') as HTMLElement;
    patchBtn.click();
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('table.patch')).to.not.equal(null);
    expect(el.shadowRoot!.querySelector('table.patch td')!.textContent).to.contain('replace');
  });

  test('falls back to JSON only when previousContent equals content', async () => {
    const el = await mount(artifact('{"a":1}', { previousContent: '{"a":1}', isEdit: true }));
    expect(tabLabels(el)).to.eql([]);
  });

  test('highlightByText marks the matching diff line and clearHighlight removes it', async () => {
    const a = artifact('{\n  "SendMail": 2\n}', { previousContent: '{\n  "SendMail": 1\n}', isEdit: true });
    const el = await fixture<NrArtifactDiffViewElement>(
      html`<nr-artifact-diff-view .artifact=${a} view="diff"></nr-artifact-diff-view>`
    );
    await el.updateComplete;

    const found = el.highlightByText('"SendMail"');
    expect(found).to.equal(true);
    const hl = el.shadowRoot!.querySelector('.diff__line--hl');
    expect(hl).to.not.equal(null);
    expect(hl!.textContent).to.contain('SendMail');

    el.clearHighlight();
    expect(el.shadowRoot!.querySelector('.diff__line--hl')).to.equal(null);
  });

  test('highlightByText returns false when nothing matches', async () => {
    const a = artifact('{"a":2}', { previousContent: '{"a":1}', isEdit: true });
    const el = await fixture<NrArtifactDiffViewElement>(
      html`<nr-artifact-diff-view .artifact=${a} view="diff"></nr-artifact-diff-view>`
    );
    await el.updateComplete;
    expect(el.highlightByText('"nope"')).to.equal(false);
  });

  test('highlightObjectByKey highlights the full object block, not just the key line', async () => {
    const prev = JSON.stringify({ Steps: { A: { x: 1 } } }, null, 2);
    const next = JSON.stringify({ Steps: { A: { x: 1 }, B: { y: 2, z: 3 } } }, null, 2);
    const a = artifact(next, { previousContent: prev, isEdit: true });
    const el = await fixture<NrArtifactDiffViewElement>(
      html`<nr-artifact-diff-view .artifact=${a} view="diff"></nr-artifact-diff-view>`
    );
    await el.updateComplete;

    expect(el.highlightObjectByKey('B')).to.equal(true);
    const hl = Array.from(el.shadowRoot!.querySelectorAll('.diff__line--hl'))
      .map(l => (l.querySelector('.diff__text')?.textContent ?? '').trim());
    // opening "B": { ... "y", "z", and the closing } — the whole object
    expect(hl.length).to.be.greaterThan(1);
    expect(hl.some(t => t.includes('"B"'))).to.equal(true);
    expect(hl.some(t => t.includes('"y"'))).to.equal(true);
    expect(hl.some(t => t.includes('"z"'))).to.equal(true);
    expect(hl[hl.length - 1].startsWith('}')).to.equal(true);
  });

  test('view="diff" renders the diff directly with no tab bar', async () => {
    const a = artifact('{"a":2}', { previousContent: '{"a":1}', isEdit: true });
    const el = await fixture<NrArtifactDiffViewElement>(
      html`<nr-artifact-diff-view .artifact=${a} view="diff"></nr-artifact-diff-view>`
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.tabbar')).to.equal(null);
    expect(el.shadowRoot!.querySelector('.diff__line--add')).to.not.equal(null);
    expect(el.shadowRoot!.querySelector('.diff__line--del')).to.not.equal(null);
  });
});
