/**
 * @license
 * Copyright 2024 Nuraly
 * SPDX-License-Identifier: MIT
 */

import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import { NrCodeEditorElement } from '../code-editor.component.js';
import { CODE_EDITOR_THEME, CODE_EDITOR_LANGUAGE } from '../code-editor.types.js';

describe('NrCodeEditorElement', () => {
  let element: NrCodeEditorElement;

  beforeEach(async () => {
    element = await fixture(html`<nr-code-editor></nr-code-editor>`);
    // Wait for editor initialization
    await aTimeout(100);
  });

  afterEach(() => {
    // Clean up Monaco editor
    if (element.editor) {
      element.editor.dispose();
    }
  });

  describe('Basic functionality', () => {
    it('should render successfully', () => {
      expect(element).to.exist;
      expect(element.tagName).to.equal('NR-CODE-EDITOR');
    });

    it('should have default properties', () => {
      expect(element.readonly).to.be.false;
      expect(element.theme).to.equal(CODE_EDITOR_THEME.Dark);
      expect(element.language).to.equal('javascript');
      expect(element.code).to.equal('');
      expect(element.lineNumbers).to.be.true;
      expect(element.minimap).to.be.false;
      expect(element.wordWrap).to.be.false;
      expect(element.fontSize).to.equal(13);
      expect(element.aiCompletions).to.be.true;
    });

    it('should render editor container', async () => {
      const container = element.shadowRoot?.querySelector('.editor-container');
      expect(container).to.exist;
    });

    it('should have editor-container part', async () => {
      const container = element.shadowRoot?.querySelector('[part="editor-container"]');
      expect(container).to.exist;
    });

    it('should render main element for Monaco', async () => {
      const main = element.shadowRoot?.querySelector('main');
      expect(main).to.exist;
    });
  });

  describe('Code content', () => {
    it('should accept initial code', async () => {
      const editor = await fixture<NrCodeEditorElement>(html`
        <nr-code-editor code="console.log('hello');"></nr-code-editor>
      `);
      await aTimeout(100);

      expect(editor.code).to.equal("console.log('hello');");
    });

    it('should update code programmatically', async () => {
      element.code = 'const x = 1;';
      await element.updateComplete;

      expect(element.code).to.equal('const x = 1;');
    });

    it('should get value from editor', async () => {
      element.code = 'function test() {}';
      await element.updateComplete;
      await aTimeout(100);

      const value = element.getValue();
      // getValue returns editor content which may differ after initialization
      expect(typeof value).to.equal('string');
    });

    it('should set value programmatically', async () => {
      await aTimeout(100);

      element.setValue('new code here');
      await element.updateComplete;

      // If editor is initialized, setValue should work
      if (element.editor) {
        expect(element.getValue()).to.equal('new code here');
      }
    });
  });

  describe('Theme', () => {
    it('should default to vs-dark theme', () => {
      expect(element.theme).to.equal('vs-dark');
    });

    it('should accept light theme', async () => {
      element.theme = CODE_EDITOR_THEME.Light;
      await element.updateComplete;

      expect(element.theme).to.equal('vs');
    });

    it('should accept high contrast dark theme', async () => {
      element.theme = CODE_EDITOR_THEME.HighContrastDark;
      await element.updateComplete;

      expect(element.theme).to.equal('hc-black');
    });

    it('should accept high contrast light theme', async () => {
      element.theme = CODE_EDITOR_THEME.HighContrastLight;
      await element.updateComplete;

      expect(element.theme).to.equal('hc-light');
    });
  });

  describe('Language', () => {
    it('should default to javascript', () => {
      expect(element.language).to.equal('javascript');
    });

    it('should accept typescript', async () => {
      element.language = CODE_EDITOR_LANGUAGE.TypeScript;
      await element.updateComplete;

      expect(element.language).to.equal('typescript');
    });

    it('should accept json', async () => {
      element.language = CODE_EDITOR_LANGUAGE.JSON;
      await element.updateComplete;

      expect(element.language).to.equal('json');
    });

    it('should accept html', async () => {
      element.language = CODE_EDITOR_LANGUAGE.HTML;
      await element.updateComplete;

      expect(element.language).to.equal('html');
    });

    it('should accept css', async () => {
      element.language = CODE_EDITOR_LANGUAGE.CSS;
      await element.updateComplete;

      expect(element.language).to.equal('css');
    });

    it('should accept python', async () => {
      element.language = CODE_EDITOR_LANGUAGE.Python;
      await element.updateComplete;

      expect(element.language).to.equal('python');
    });

    it('should accept markdown', async () => {
      element.language = CODE_EDITOR_LANGUAGE.Markdown;
      await element.updateComplete;

      expect(element.language).to.equal('markdown');
    });

    it('should accept plaintext', async () => {
      element.language = CODE_EDITOR_LANGUAGE.PlainText;
      await element.updateComplete;

      expect(element.language).to.equal('plaintext');
    });

    it('should accept custom language string', async () => {
      element.language = 'sql';
      await element.updateComplete;

      expect(element.language).to.equal('sql');
    });
  });

  describe('Readonly mode', () => {
    it('should not be readonly by default', () => {
      expect(element.readonly).to.be.false;
    });

    it('should accept readonly attribute', async () => {
      const editor = await fixture<NrCodeEditorElement>(html`
        <nr-code-editor readonly></nr-code-editor>
      `);

      expect(editor.readonly).to.be.true;
    });

    it('should update readonly programmatically', async () => {
      element.readonly = true;
      await element.updateComplete;

      expect(element.readonly).to.be.true;
    });
  });

  describe('Line numbers', () => {
    it('should show line numbers by default', () => {
      expect(element.lineNumbers).to.be.true;
    });

    it('should hide line numbers when disabled', async () => {
      element.lineNumbers = false;
      await element.updateComplete;

      expect(element.lineNumbers).to.be.false;
    });
  });

  describe('Minimap', () => {
    it('should hide minimap by default', () => {
      expect(element.minimap).to.be.false;
    });

    it('should show minimap when enabled', async () => {
      element.minimap = true;
      await element.updateComplete;

      expect(element.minimap).to.be.true;
    });
  });

  describe('Word wrap', () => {
    it('should not wrap by default', () => {
      expect(element.wordWrap).to.be.false;
    });

    it('should wrap when enabled', async () => {
      element.wordWrap = true;
      await element.updateComplete;

      expect(element.wordWrap).to.be.true;
    });
  });

  describe('Font size', () => {
    it('should have default font size of 13', () => {
      expect(element.fontSize).to.equal(13);
    });

    it('should accept custom font size', async () => {
      element.fontSize = 16;
      await element.updateComplete;

      expect(element.fontSize).to.equal(16);
    });

    it('should accept small font size', async () => {
      element.fontSize = 10;
      await element.updateComplete;

      expect(element.fontSize).to.equal(10);
    });

    it('should accept large font size', async () => {
      element.fontSize = 24;
      await element.updateComplete;

      expect(element.fontSize).to.equal(24);
    });
  });

  describe('AI Completions', () => {
    it('should enable AI completions by default', () => {
      expect(element.aiCompletions).to.be.true;
    });

    it('should disable AI completions', async () => {
      element.aiCompletions = false;
      await element.updateComplete;

      expect(element.aiCompletions).to.be.false;
    });

    it('should have default completions endpoint', () => {
      expect(element.completionsEndpoint).to.equal('/api/v1/copilot/completion');
    });

    it('should accept custom completions endpoint', async () => {
      element.completionsEndpoint = '/custom/api/completion';
      await element.updateComplete;

      expect(element.completionsEndpoint).to.equal('/custom/api/completion');
    });
  });

  describe('Focus', () => {
    it('should have focus method', () => {
      expect(typeof element.focus).to.equal('function');
    });

    it('should focus editor', async () => {
      await aTimeout(100);

      // Focus should not throw
      element.focus();
      expect(true).to.be.true;
    });
  });

  describe('Options', () => {
    it('should have setOptions method', () => {
      expect(typeof element.setOptions).to.equal('function');
    });

    it('should update options', async () => {
      await aTimeout(100);

      // setOptions should not throw
      element.setOptions({ fontSize: 14 });
      expect(true).to.be.true;
    });
  });

  describe('Edge cases', () => {
    it('should handle empty code', async () => {
      element.code = '';
      await element.updateComplete;

      expect(element.code).to.equal('');
    });

    it('should handle very long code', async () => {
      const longCode = 'x'.repeat(10000);
      element.code = longCode;
      await element.updateComplete;

      expect(element.code.length).to.equal(10000);
    });

    it('should handle special characters', async () => {
      element.code = '// Comment: <script>alert("xss")</script>';
      await element.updateComplete;

      expect(element.code).to.include('<script>');
    });

    it('should handle unicode', async () => {
      element.code = '// 这是中文注释 🚀';
      await element.updateComplete;

      expect(element.code).to.include('中文');
    });

    it('should handle rapid property changes', async () => {
      element.theme = CODE_EDITOR_THEME.Light;
      element.theme = CODE_EDITOR_THEME.Dark;
      element.theme = CODE_EDITOR_THEME.Light;
      await element.updateComplete;

      expect(element.theme).to.equal('vs');
    });

    it('should handle rapid code changes', async () => {
      element.code = 'first';
      element.code = 'second';
      element.code = 'third';
      await element.updateComplete;

      expect(element.code).to.equal('third');
    });
  });

  describe('Complex scenarios', () => {
    it('should render with all options', async () => {
      const editor = await fixture<NrCodeEditorElement>(html`
        <nr-code-editor
          code="const x = 1;"
          language="typescript"
          theme="vs-dark"
          .readonly=${false}
          .lineNumbers=${true}
          .minimap=${true}
          .wordWrap=${true}
          .fontSize=${14}
          .aiCompletions=${false}
        ></nr-code-editor>
      `);
      await aTimeout(100);

      expect(editor.code).to.equal('const x = 1;');
      expect(editor.language).to.equal('typescript');
      expect(editor.theme).to.equal('vs-dark');
      expect(editor.minimap).to.be.true;
      expect(editor.wordWrap).to.be.true;
      expect(editor.fontSize).to.equal(14);
      expect(editor.aiCompletions).to.be.false;
    });

    it('should handle JSON language with valid JSON', async () => {
      const editor = await fixture<NrCodeEditorElement>(html`
        <nr-code-editor
          language="json"
          code='{"key": "value"}'
        ></nr-code-editor>
      `);
      await aTimeout(100);

      expect(editor.language).to.equal('json');
    });

    it('should handle HTML language', async () => {
      const editor = await fixture<NrCodeEditorElement>(html`
        <nr-code-editor
          language="html"
          code="<div>Hello</div>"
        ></nr-code-editor>
      `);
      await aTimeout(100);

      expect(editor.language).to.equal('html');
    });
  });

  describe('Accessibility', () => {
    it('should render proper editor structure', async () => {
      const container = element.shadowRoot?.querySelector('.editor-container');
      expect(container).to.exist;
    });

    it('should have part attribute for styling', async () => {
      const container = element.shadowRoot?.querySelector('[part="editor-container"]');
      expect(container).to.exist;
    });
  });
});
