import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './index.js';

const sampleJS = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');`;

const sampleTS = `interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): Promise<User> {
  return fetch(\`/api/users/\${id}\`).then(res => res.json());
}`;

const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`;

const sampleJSON = `{
  "name": "nuraly-ui",
  "version": "1.0.0",
  "dependencies": {
    "lit": "^3.0.0",
    "monaco-editor": "^0.45.0"
  }
}`;

const sampleCSS = `/* Theme variables */
:root {
  --primary-color: #1677ff;
  --border-radius: 4px;
}

.container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius);
}`;

const longContent = `// This is a very long line that demonstrates word wrap behavior in the code editor component — it should wrap when word wrap is enabled and extend beyond the viewport when disabled, allowing the user to scroll horizontally to see the rest of the content.

function processData(input: string): string {
  const result = input
    .split('\\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join(' ');
  return result;
}`;

const editorHeight = '350px';

const meta: Meta = {
  title: 'Specialized/CodeEditor',
  component: 'nr-code-editor',
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: { type: 'select' },
      options: ['javascript', 'typescript', 'html', 'json', 'css', 'markdown', 'python', 'plaintext'],
    },
    theme: {
      control: { type: 'select' },
      options: ['vs', 'vs-dark', 'hc-black', 'hc-light'],
    },
    readonly: { control: 'boolean' },
    lineNumbers: { control: 'boolean' },
    minimap: { control: 'boolean' },
    wordWrap: { control: 'boolean' },
    fontSize: { control: { type: 'number', min: 8, max: 32 } },
    code: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <nr-code-editor
      style="height: ${editorHeight}"
      language="javascript"
      theme="vs-dark"
      .code=${sampleJS}
    ></nr-code-editor>
  `,
};

export const Languages: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <strong>JavaScript</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="vs-dark" .code=${sampleJS}></nr-code-editor>
      </div>
      <div>
        <strong>TypeScript</strong>
        <nr-code-editor style="height: ${editorHeight}" language="typescript" theme="vs-dark" .code=${sampleTS}></nr-code-editor>
      </div>
      <div>
        <strong>HTML</strong>
        <nr-code-editor style="height: ${editorHeight}" language="html" theme="vs-dark" .code=${sampleHTML}></nr-code-editor>
      </div>
      <div>
        <strong>JSON</strong>
        <nr-code-editor style="height: ${editorHeight}" language="json" theme="vs-dark" .code=${sampleJSON}></nr-code-editor>
      </div>
      <div>
        <strong>CSS</strong>
        <nr-code-editor style="height: ${editorHeight}" language="css" theme="vs-dark" .code=${sampleCSS}></nr-code-editor>
      </div>
    </div>
  `,
};

export const Themes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <strong>vs (Light)</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="vs" .code=${sampleJS}></nr-code-editor>
      </div>
      <div>
        <strong>vs-dark (Dark)</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="vs-dark" .code=${sampleJS}></nr-code-editor>
      </div>
      <div>
        <strong>hc-black (High Contrast Dark)</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="hc-black" .code=${sampleJS}></nr-code-editor>
      </div>
      <div>
        <strong>hc-light (High Contrast Light)</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="hc-light" .code=${sampleJS}></nr-code-editor>
      </div>
    </div>
  `,
};

export const ReadOnly: Story = {
  render: () => html`
    <nr-code-editor
      style="height: ${editorHeight}"
      language="typescript"
      theme="vs-dark"
      readonly
      .code=${sampleTS}
    ></nr-code-editor>
  `,
};

export const WithLineNumbers: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <strong>Line Numbers On (default)</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="vs-dark" line-numbers .code=${sampleJS}></nr-code-editor>
      </div>
      <div>
        <strong>Line Numbers Off</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="vs-dark" ?line-numbers=${false} .code=${sampleJS}></nr-code-editor>
      </div>
    </div>
  `,
};

export const WithMinimap: Story = {
  render: () => html`
    <nr-code-editor
      style="height: ${editorHeight}"
      language="typescript"
      theme="vs-dark"
      minimap
      .code=${sampleTS}
    ></nr-code-editor>
  `,
};

export const WordWrap: Story = {
  render: () => html`
    <nr-code-editor
      style="height: ${editorHeight}"
      language="typescript"
      theme="vs-dark"
      word-wrap
      .code=${longContent}
    ></nr-code-editor>
  `,
};

export const FontSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <strong>12px</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="vs-dark" font-size="12" .code=${sampleJS}></nr-code-editor>
      </div>
      <div>
        <strong>14px</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="vs-dark" font-size="14" .code=${sampleJS}></nr-code-editor>
      </div>
      <div>
        <strong>16px</strong>
        <nr-code-editor style="height: ${editorHeight}" language="javascript" theme="vs-dark" font-size="16" .code=${sampleJS}></nr-code-editor>
      </div>
    </div>
  `,
};
