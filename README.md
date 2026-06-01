<h1 align="center">Nuraly UI</h1>

<p align="center">
  A comprehensive collection of enterprise-class web components built with Lit and TypeScript.
</p>

<p align="center">
  <a href="https://www.npmjs.com/packag## 🤝 Contributing

We welcome contributions! Here's how to help:

- 🐛 Report bugs via [GitHub Issues](https://github.com/Nuralyio/NuralyUI/issues)
- 💡 Suggest features in [Discussions](https://github.com/Nuralyio/NuralyUI/discussions)
- 🔧 Submit pull requests for bug fixes or new components
- 📝 Improve documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.i/common"><img src="https://img.shields.io/npm/v/@nuralyui/common?label=common&color=blue" alt="common" /></a>
  <a href="https://www.npmjs.com/package/@nuralyui/forms"><img src="https://img.shields.io/npm/v/@nuralyui/forms?label=forms&color=green" alt="forms" /></a>
  <a href="https://www.npmjs.com/package/@nuralyui/layout"><img src="https://img.shields.io/npm/v/@nuralyui/layout?label=layout&color=orange" alt="layout" /></a>
  <a href="https://www.npmjs.com/package/@nuralyui/themes"><img src="https://img.shields.io/npm/v/@nuralyui/themes?label=themes&color=purple" alt="themes" /></a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/BSD-3-Clause"><img src="https://img.shields.io/badge/license-BSD--3--Clause-blue.svg" alt="License" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/built%20with-TypeScript-blue" alt="TypeScript" /></a>
</p>

<p align="center">
  <a href="http://ui-opensource.nuraly.io"><strong>Documentation & Demo</strong></a> •
  <a href="https://github.com/Nuralyio/NuralyUI"><strong>GitHub</strong></a> •
  <a href="https://www.npmjs.com/org/nuralyui"><strong>NPM</strong></a>
</p>

---

## ✨ Features

- 🌈 **Enterprise-grade Components** - Professional UI components for modern web applications
- 📦 **40+ Components** - Complete library of ready-to-use web components
- 🛡 **TypeScript First** - Full type safety and excellent developer experience
- ⚙️ **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JavaScript
- 🎨 **Themeable** - Easy customization with CSS custom properties
- 📱 **Responsive** - Mobile-first design that works everywhere
- ♿ **Accessible** - ARIA-compliant and keyboard navigable
- 🚀 **Lightweight** - Minimal bundle size, maximum performance

## 📦 Installation

### Install Package Bundles

```bash
# Shared utilities (mixins, controllers, themes, utils)
npm install @nuralyui/common

# Form components (input, select, checkbox, radio, etc.)
npm install @nuralyui/forms

# Layout components (grid, flex, card, layout)
npm install @nuralyui/layout

# Theme CSS bundles
npm install @nuralyui/themes
```

### Or Install Individual Components

```bash
npm install @nuralyui/button
npm install @nuralyui/input
npm install @nuralyui/datepicker
```

## 🚀 Quick Start

### Vanilla JavaScript/HTML

```html
<script type="module">
  import '@nuralyui/button';
  import '@nuralyui/input';
</script>

<nr-button variant="primary">Click me</nr-button>
<nr-input placeholder="Enter text" label="Name"></nr-input>
```

### React

```jsx
import { NrButton } from "@nuralyui/button/react";
import { NrInput } from "@nuralyui/input/react";

function App() {
  return (
    <>
      <NrButton variant="primary" onClick={() => alert('Clicked!')}>
        Click me
      </NrButton>
      <NrInput 
        placeholder="Enter text" 
        label="Name"
        onInput={(e) => console.log(e.target.value)}
      />
    </>
  );
}
```

### Vue

```vue
<template>
  <nr-button variant="primary" @click="handleClick">Click me</nr-button>
  <nr-input placeholder="Enter text" label="Name" @input="handleInput" />
</template>

<script>
import '@nuralyui/button';
import '@nuralyui/input';

export default {
  methods: {
    handleClick() { alert('Clicked!'); },
    handleInput(e) { console.log(e.target.value); }
  }
}
</script>
```

## � Available Components

### 📦 Package Bundles

- **[@nuralyui/common](https://www.npmjs.com/package/@nuralyui/common)** - Mixins, Controllers, Themes, Utilities
- **[@nuralyui/forms](https://www.npmjs.com/package/@nuralyui/forms)** - Input, Textarea, Checkbox, Radio, Select, Datepicker, Timepicker, Colorpicker, File Upload, Form, Slider
- **[@nuralyui/layout](https://www.npmjs.com/package/@nuralyui/layout)** - Layout, Grid, Flex, Card
- **[@nuralyui/themes](https://www.npmjs.com/package/@nuralyui/themes)** - Carbon & Default theme CSS

### 🧩 All Components

**Form & Input**
- Button, Input, Textarea, Checkbox, Radio, Radio Group, Select, Slider Input, File Upload, Form, Datepicker, Timepicker, Colorpicker

**Layout & Structure**
- Layout, Grid, Flex, Card, Divider

**Navigation**
- Tabs, Menu, Dropdown, Breadcrumb

**Feedback**
- Modal, Toast, Tooltips, Popconfirm, Alert

**Display**
- Table, Collapse, Carousel, Timeline, Badge, Label, Icon, Image, Video, Canvas, Skeleton

**Advanced**
- Chatbot, Document, Console

## 🎨 Theming

Customize components with CSS custom properties:

```css
:root {
  --nr-primary-color: #4F46E5;
  --nr-font-family: 'Inter', sans-serif;
  --nr-border-radius: 6px;
}
```

Or use our pre-built themes:

```html
<link rel="stylesheet" href="node_modules/@nuralyui/themes/carbon.css">
```

### Required CSS (CDN consumers)

Components rely on theme tokens shipped in `@nuraly/lumenui` at `packages/themes/dist/default.css`. Pin the same `${VERSION}` you use for the JS bundle:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nuraly/lumenui@${VERSION}/packages/themes/dist/default.css"
/>
```

Concrete example with the current version:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@nuraly/lumenui@0.7.0/packages/themes/dist/default.css"
/>
```

The `dist/cdn.js` loader auto-injects this `<link>` (tagged `data-nuralyui-themes`) when no `@nuraly/lumenui` or `@nuralyui/themes` stylesheet is already present. Link your own themes CSS first to override the default (for example to pick `carbon.css`) and the auto-inject is skipped.

## 🌍 Browser Support

| Chrome | Firefox | Safari | Edge |
| --- | --- | --- | --- |
| ✅ 88+ | ✅ 78+ | ✅ 14+ | ✅ 88+ |

## � Development

### Local Setup

```bash
# Clone the repository
git clone https://github.com/Nuralyio/NuralyUI.git
cd NuralyUI

# Install dependencies
npm install

# Start development server
npm start
```

### Available Scripts

```bash
npm start              # Start dev server with watch mode
npm run build          # Build all components
npm run test           # Run tests
npm run lint           # Lint code
npm run format         # Format with Prettier
```

### Project Structure

```
hybrid-ui/
├── src/
│   └── components/     # All web components
├── packages/           # Package bundles
│   ├── common/
│   ├── forms/
│   ├── layout/
│   └── themes/
└── dist/              # Built components
```

## 🤝 Contributing

We welcome contributions! Here's how to help:

- 🐛 Report bugs via [GitHub Issues](https://github.com/NuralyUI/NuralyUI/issues)
- 💡 Suggest features in [Discussions](https://github.com/NuralyUI/NuralyUI/discussions)
- 🔧 Submit pull requests for bug fixes or new components
- � Improve documentation

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

BSD 3-Clause License - see [LICENSE](./LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ by the Nuraly Team</strong>
</p>

<p align="center">
  <a href="http://ui-opensource.nuraly.io">Documentation</a> •
  <a href="https://github.com/Nuralyio/NuralyUI">GitHub</a> •
  <a href="https://www.npmjs.com/org/nuralyui">NPM</a>
</p>
