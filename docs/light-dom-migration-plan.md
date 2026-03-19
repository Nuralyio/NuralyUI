## Context

NuralyUI has 47 components using Shadow DOM + 1684 CSS custom properties. This makes it nearly impossible for an LLM to generate style overrides because:
1. Shadow DOM blocks external CSS from reaching component internals
2. An LLM would need to know the exact variable name from 1684 options
3. Variable indirection hides actual applied values

**Goal**: Make component styling dead-simple so an LLM can write plain CSS overrides like:
```css
nr-button[type="primary"] button { background: red; border-radius: 8px; }
```

**How**:
- **Light DOM** — no shadow barrier, external CSS reaches internals
- **CSS `@layer`** — component defaults in a base layer, overrides always win
- **Direct CSS values** — no variable indirection, plain readable CSS
- **Hybrid** — ~25 components migrate to Light DOM, ~15 complex components stay Shadow DOM

---

## Architecture

### Layer structure
```css
@layer nuraly.base, nuraly.components;

/* Component defaults — lowest priority */
@layer nuraly.components {
  nr-button { display: inline-block; }
  nr-button button { background: #0f62fe; color: #fff; height: 2.5rem; ... }
}

/* LLM or user overrides — no @layer = automatic highest priority */
nr-button button { background: red; }
```

CSS outside any `@layer` always beats layered CSS — so LLM-generated overrides just work without knowing about layers at all.

### Dark mode

~15 CSS vars only for light/dark switching. Everything else is direct values.

```css
:root {
  --nr-text: #161616;
  --nr-text-secondary: #525252;
  --nr-text-on-color: #ffffff;
  --nr-bg: #ffffff;
  --nr-bg-hover: #f4f4f4;
  --nr-primary: #0f62fe;
  --nr-primary-hover: #0353e9;
  --nr-danger: #da1e28;
  --nr-success: #198038;
  --nr-warning: #f1c21b;
  --nr-border: #e0e0e0;
  --nr-surface: #ffffff;
  --nr-disabled: #c6c6c6;
  --nr-focus: #0f62fe;
}
[data-theme="dark"],
[data-theme="default-dark"],
[data-theme="carbon-dark"] {
  --nr-text: #f4f4f4;
  --nr-text-secondary: #c6c6c6;
  --nr-text-on-color: #ffffff;
  --nr-bg: #161616;
  --nr-bg-hover: #262626;
  --nr-primary: #78a9ff;
  --nr-primary-hover: #a6c8ff;
  --nr-danger: #ff8389;
  --nr-success: #42be65;
  --nr-warning: #f1c21b;
  --nr-border: #393939;
  --nr-surface: #262626;
  --nr-disabled: #525252;
  --nr-focus: #78a9ff;
}
```

### Content projection (replaces `<slot>`)

`<slot>` only works in Shadow DOM. Light DOM components use `lightChildren` / `lightChildrenNamed()` provided by the base mixin:

| Shadow DOM | Light DOM |
|---|---|
| `<slot></slot>` | `${this.lightChildren}` |
| `<slot name="icon"></slot>` | `${this.lightChildrenNamed('icon')}` |

The base mixin saves and removes original children in `connectedCallback` before Lit's first render, then exposes them via getters. Consumer API stays identical:

```html
<!-- Consumers write the same HTML regardless of Light/Shadow DOM -->
<nr-tag><nr-icon slot="icon" name="star"></nr-icon> Tagged</nr-tag>
```

---

## Phase 1: Light DOM Infrastructure — DONE

### 1.1 Base mixin — Light DOM + style injection + content projection

**File**: `packages/common/src/shared/base-mixin.ts`

```typescript
const LightDomMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class LightDomClass extends superClass {
    private __lightDomChildren: Node[] | null = null;

    override createRenderRoot() { return this; }

    override connectedCallback() {
      // Save and remove original children before Lit renders
      if (this.__lightDomChildren === null) {
        this.__lightDomChildren = [];
        while (this.firstChild) {
          this.__lightDomChildren.push(this.removeChild(this.firstChild));
        }
      }
      super.connectedCallback();
      // Inject styles into document.adoptedStyleSheets once per tag
      const ctor = this.constructor as typeof LitElement;
      const tag = this.tagName.toLowerCase();
      const componentStyles = ctor.styles;
      if (componentStyles) {
        injectStyles(tag, flattenStyles(componentStyles));
      }
    }

    get lightChildren(): Node[] { /* default-slot nodes */ }
    lightChildrenNamed(name: string): Element[] { /* named-slot elements */ }
  }
  return LightDomClass;
};

export const NuralyUIBaseMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  return DependencyValidationMixin(ThemeAwareMixin(EventHandlerMixin(LightDomMixin(superClass))));
};
```

### 1.2 Style injector

**File**: `packages/common/src/shared/style-injector.ts`

```typescript
const injected = new Set<string>();

export function injectStyles(tag: string, cssText: string) {
  if (injected.has(tag)) return;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  injected.add(tag);
}
```

### 1.3 Layer order + tokens

**File**: `packages/common/src/shared/layers.css`
```css
@layer nuraly.base, nuraly.components;
```

**File**: `packages/common/src/shared/tokens.css` — ~15 CSS vars (see Architecture section)

### 1.4 Theme mixin cleanup

- `this.closest('[data-theme]')` works in Light DOM — kept as-is
- `createThemeStyles()` deprecated (was `:host`-based)

### 1.5 Storybook preview

**File**: `.storybook/preview.ts` — imports `layers.css` + `tokens.css` before legacy theme CSS

---

## Phase 2: Minimal Theme Tokens — DONE

**File**: `packages/common/src/shared/tokens.css`

Old theme files (`carbon.css` 1684 vars, `default.css`, `editor.css`) kept for non-migrated components. Will be removed once all components are migrated.

---

## Phase 3: CSS Transformation

### Selector rules

| Before (Shadow DOM) | After (Light DOM @layer) |
|---|---|
| `:host { ... }` | `nr-{name} { ... }` |
| `:host([attr="x"]) el` | `nr-{name}[attr="x"] el` |
| `var(--nuraly-color-button-primary)` | `#0f62fe` (direct) |
| `var(--nuraly-color-text)` | `var(--nr-text)` (only for theme-flipping props) |

### Example: label.style.ts (migrated)

```typescript
export default css`
  @layer nuraly.components {
    nr-label { display: inline-block; width: fit-content; }
    nr-label label {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 0.875rem;
      color: var(--nr-text);
      cursor: pointer;
    }
    nr-label[size="small"] label { font-size: 0.75rem; }
    nr-label[variant="error"] label { color: #da1e28; }
    nr-label[disabled] label { color: var(--nr-disabled); cursor: not-allowed; opacity: 0.6; }
  }
`;
```

An LLM overrides: `nr-label label { font-size: 1.5rem; color: blue; }` — done.

---

## Phase 4: Component File Updates

Each Light DOM `*.component.ts`:
1. Keep `static styles` — base mixin injects it to document via `adoptedStyleSheets`
2. Remove manual `data-theme` attribute setting where present
3. Replace `<slot></slot>` with `${this.lightChildren}`
4. Replace `<slot name="x"></slot>` with `${this.lightChildrenNamed('x')}`
5. Replace `this.querySelector('[slot="x"]')` with `this.lightChildrenNamed('x').length > 0`
6. Replace `this.shadowRoot?.querySelector(...)` with `this.querySelector(...)`
7. Fix `slot.assignedNodes()` / `@queryAssignedElements()` usage

Shadow DOM components — no changes needed.

---

## Component Classification

### Light DOM (~25 components)

Simple leaf, layout, and presentation components. Low slot complexity, no floating UI.

| Wave | Components | Status |
|---|---|---|
| 1 | label, divider, badge, tag, icon, image, video, skeleton | **DONE** |
| 2 | button, alert, checkbox, radio, card, breadcrumb, timeline, document | |
| 3 | container, flex, grid, row, col, layout, header, footer, content, slider-input | |
| 4 | radio-group, menu | |

### Light DOM with moderate refactoring (~8 components)

Multiple named slots, `@query()` decorators, or animation controllers.

| Component | Issue | Action |
|---|---|---|
| input | 4 named slots + `@query()` | Convert `@query()` to `this.querySelector()` |
| textarea | 4 named slots + `@query()` | Same as input |
| select | Complex dropdown controller | Evaluate after simpler components done |
| tabs | Multiple content slots + controllers | Moderate refactoring |
| collapse | Animation controller + section slots | Moderate refactoring |
| carousel | Uses `@queryAssignedElements()` | Replace with lightChildren |
| tooltip | Target element detection | Evaluate positioning approach |
| toast | Stacked notification positioning | Evaluate positioning approach |
| form | Form validation + multiple slots | Moderate refactoring |

### Shadow DOM (~15 components) — styled via `::part()`

Complex components that need encapsulation, floating UI positioning, or external widget integration. These stay Shadow DOM but expose key internal elements via `part` attributes so LLMs can style them with `::part()` selectors.

#### How `::part()` works

```typescript
// Component template exposes parts:
render() {
  return html`
    <div part="container">
      <input part="input" />
      <div part="calendar">...</div>
    </div>
  `;
}
```

```css
/* LLM or consumer styles from outside: */
nr-datepicker::part(input) { border: 2px solid blue; font-size: 1rem; }
nr-datepicker::part(calendar) { background: #f0f0f0; }
```

No variable names needed — LLM targets the part name directly with plain CSS.

#### Part naming convention

- Use semantic names: `container`, `input`, `trigger`, `content`, `header`, `footer`, `overlay`, `backdrop`
- For repeated elements: `row`, `cell`, `item`
- For states within parts, use host attribute selectors: `nr-table[loading]::part(container)`

#### Components and their parts

| Component | Parts to expose | Reason for Shadow DOM |
|---|---|---|
| modal | `overlay`, `backdrop`, `container`, `header`, `body`, `footer`, `close-button` | Floating overlay, backdrop isolation |
| dropdown | `trigger`, `content`, `header`, `footer` | Floating UI positioning |
| popconfirm | `trigger`, `content`, `confirm-button`, `cancel-button` | Floating UI positioning |
| datepicker | `input`, `trigger`, `calendar`, `header`, `day-cell`, `nav-button` | Complex calendar + floating dropdown |
| timepicker | `input`, `trigger`, `panel`, `column`, `time-cell` | Complex time picker + floating dropdown |
| colorpicker | `input`, `trigger`, `panel`, `spectrum`, `hue-slider`, `alpha-slider`, `preview` | Complex embedded child components |
| select | `input`, `trigger`, `dropdown`, `option`, `tag` | Dropdown positioning + virtual scroll |
| table | `container`, `header`, `header-cell`, `body`, `row`, `cell`, `footer`, `pagination` | Complex features (sort, filter, select) |
| file-upload | `container`, `dropzone`, `input`, `file-list`, `file-item`, `progress` | Hidden file input + drag/drop |
| iconpicker | `input`, `trigger`, `panel`, `search`, `icon-grid`, `icon-item` | Virtual scrolling + complex search |
| panel | `container`, `header`, `body`, `footer`, `resize-handle` | Drag/resize controllers |
| collapse | `container`, `item`, `item-header`, `item-content`, `arrow` | Animation controller + nested sections |
| tabs | `container`, `tab-list`, `tab`, `tab-panel`, `indicator` | Keyboard navigation + drag reorder |
| canvas (all) | `container`, `viewport`, `toolbar` | Complex canvas rendering |
| chatbot | `container`, `messages`, `message`, `input`, `send-button` | Complex template system |
| code-editor | `container`, `editor`, `toolbar` | Monaco integration |
| db-connection-select | `input`, `dropdown`, `option` | Specialized |
| kv-secret-select | `input`, `dropdown`, `option` | Specialized |

#### Implementation pattern for Shadow DOM components

```typescript
@customElement('nr-modal')
export class NrModalElement extends NuralyUIBaseMixin(LitElement) {
  // Opt in to Shadow DOM — base mixin checks this flag
  static useShadowDom = true;

  render() {
    return html`
      <div part="backdrop" class="modal-backdrop" @click=${this.handleBackdropClick}></div>
      <div part="container" class="modal">
        <div part="header" class="modal-header">
          ${this.title}
          <button part="close-button" @click=${this.close}>×</button>
        </div>
        <div part="body" class="modal-body">
          <slot></slot>
        </div>
        <div part="footer" class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }
}
```

**Note**: Shadow DOM components set `static useShadowDom = true` — the base mixin skips Light DOM override and preserves Lit's default Shadow DOM behavior. They keep using `<slot>` and `::part()` for external styling.

---

## Phase 5: Test & Infrastructure Updates

### Tests
- Light DOM components: `el.shadowRoot!.querySelector(...)` → `el.querySelector(...)`
- Shadow DOM components: no changes
- Global find-replace across test files for migrated components

### React wrappers
- `@lit-labs/react` `createComponent()` works with Light DOM — no change

### Build
- `rollup.config.js` — optionally extract CSS to standalone `.css` files per component
- Theme build script — regenerate from minimal tokens
- Old theme files kept until all Light DOM components are migrated

### Storybook
- `.storybook/preview.ts` imports `layers.css` + `tokens.css` before legacy themes
- Theme switcher decorator sets `data-theme` on `document.documentElement` — works for both Light and Shadow DOM

---

## Key Decisions

1. **Hybrid approach** — not all components go Light DOM. Complex/floating components stay Shadow DOM.
2. **`<slot>` replaced by `lightChildren`** — `<slot>` only works in Shadow DOM. The base mixin captures children before Lit renders and exposes them via `lightChildren` / `lightChildrenNamed()`.
3. **Children captured once** — original children are saved on first `connectedCallback`. Dynamically adding children after mount is not supported (rarely needed in practice).
4. **No `slotchange` event** — components that need to react to content changes use property-driven rendering instead.
5. **`@layer` for scoping** — similar approach to Stencil's `scoped: true` but using web-standard CSS layers instead of data-attribute rewriting.
6. **Old themes preserved** — legacy `carbon.css`/`default.css`/`editor.css` kept for Shadow DOM components. New `tokens.css` used by Light DOM components.

---

## Verification

- [x] Foundation infrastructure (base mixin, style-injector, tokens, layers)
- [x] Wave 1 migrated (label, divider, badge, tag, icon, image, video, skeleton)
- [x] TypeScript compiles clean
- [x] Storybook builds successfully
- [ ] Verify Storybook runtime rendering for wave 1 components
- [ ] Write a plain CSS override outside `@layer` — confirm it wins
- [ ] Test dark mode toggle with `tokens.css`
- [ ] Migrate wave 2 components
- [ ] Migrate wave 3 layout components
- [ ] Run test suite (after `shadowRoot` query updates)
- [ ] Test in Studio runtime
