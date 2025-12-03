# Button Component Architecture

## Overview

The button component (`nr-button`) is a versatile, enterprise-grade UI component built with Lit and following IBM Carbon Design System patterns. It features a modular controller-based architecture that separates concerns and provides extensibility.

## Component Structure

```
src/components/button/
├── button.component.ts       # Main component implementation
├── button.types.ts           # Type definitions and enums
├── button.style.ts          # Component styles (CSS-in-JS)
├── button.stories.ts        # Storybook documentation
├── controllers/             # Behavior controllers
│   ├── index.ts
│   ├── base.controller.ts
│   ├── ripple.controller.ts
│   ├── keyboard.controller.ts
│   └── link.controller.ts
├── interfaces/              # TypeScript interfaces
│   ├── index.ts
│   └── base-controller.interface.ts
└── test/
    └── nr-button_test.ts
```

## Core Architecture Patterns

### 1. Controller-Based Architecture

The component uses **Lit Reactive Controllers** to modularize behavior:

#### Base Controller Pattern
```typescript
abstract class BaseButtonController implements ButtonBaseController, ReactiveController, ErrorHandler
```

**Responsibilities:**
- Lifecycle management (hostConnected, hostDisconnected, hostUpdate, hostUpdated)
- Error handling and event dispatching
- Safe interaction with host component
- Consistent error reporting via custom events

#### Specialized Controllers

**ButtonRippleController** (`ripple.controller.ts`)
- Manages Material Design ripple effects
- Creates animated ripple on click
- Cleans up after animation completes (600ms)
- Respects disabled and ripple property states

**ButtonKeyboardController** (`keyboard.controller.ts`)
- Handles keyboard accessibility (Enter/Space activation)
- Implements ARIA best practices
- Prevents interaction when disabled
- Allows navigation keys even when disabled

**ButtonLinkController** (`link.controller.ts`)
- Manages link vs button rendering
- Determines element tag (`<a>` vs `<button>`)
- Provides security attributes (noopener noreferrer for _blank)
- Dispatches navigation events

### 2. Type System

#### Button Variants (ButtonType enum)
```typescript
enum ButtonType {
  Primary = 'primary',      // Principal call to action
  Secondary = 'secondary',  // Secondary actions with primary
  Tertiary = 'tertiary',   // Less prominent actions
  Danger = 'danger',       // Destructive actions
  Ghost = 'ghost',         // Alias for tertiary
  Default = 'default',     // Standard button
  Text = 'text',          // Text-only style
  Link = 'link',          // Navigation style
}
```

#### Button Sizes (ButtonSize enum)
```typescript
enum ButtonSize {
  Small = 'small',    // 32px - compact layouts
  Medium = 'medium',  // 40px - default
  Large = 'large',    // 48px - mobile/prominence
}
```

#### Button Shapes (ButtonShape enum)
```typescript
enum ButtonShape {
  Default = 'default',  // Standard rounded corners
  Circle = 'circle',    // Perfect circle
  Round = 'round',      // Fully rounded ends
}
```

### 3. Enhanced Icon System

The button supports multiple icon configuration APIs:

#### Icon Types
```typescript
type ButtonIcon = string | ButtonIconConfig;

interface ButtonIconConfig {
  name: string;           // Icon name (required)
  type?: 'solid' | 'regular';
  size?: string;          // Size override
  color?: string;         // Color override
  alt?: string;           // Accessibility text
  attributes?: Record<string, string>;
}
```

#### Icon API Variations

**1. Array-based (Original API)**
```typescript
.icon = ['home']                    // Single icon
.icon = ['home', 'arrow-right']     // Two icons
```

**2. Separate Properties (Intuitive API)**
```typescript
iconLeft = 'home'
iconRight = 'arrow-right'
.iconLeft = {name: 'home', color: 'blue', size: '1.2em'}
```

**3. Object-based Configuration**
```typescript
.icons = {left: 'home', right: 'arrow-right'}
.icons = {
  left: {name: 'home', type: 'solid', color: '#fff'},
  right: {name: 'arrow', size: '0.9em'}
}
```

**Icon Resolution Priority:**
1. `iconLeft` / `iconRight` (highest priority)
2. `icons.left` / `icons.right`
3. `icon[0]` / `icon[1]` (lowest priority)

### 4. Host Interface Contract

```typescript
interface ButtonHost {
  // State properties
  disabled: boolean;
  loading: boolean;
  type: ButtonType;

  // Link properties
  href: string;
  target: string;

  // Interaction properties
  ripple: boolean;

  // Methods
  requestUpdate(): void;
  dispatchEvent(event: Event): boolean;
  click(): void;
  focus(): void;
  blur(): void;
  contains(element: Element): boolean;
}
```

This interface defines the contract between controllers and the host component, ensuring controllers have access to necessary properties and methods.

## Component Properties

### Core Properties
- `type: ButtonType` - Visual variant (default: 'default')
- `size: ButtonSize` - Size variant (default: 'medium')
- `shape: ButtonShape` - Shape style (default: 'default')
- `disabled: boolean` - Disables interaction (default: false)
- `loading: boolean` - Shows loading state (default: false)
- `block: boolean` - Full width display (default: false)
- `dashed: boolean` - Dashed border style (default: false)

### Icon Properties
- `icon: ButtonIcons` - Array-based icon config
- `iconLeft: ButtonIcon` - Left icon
- `iconRight: ButtonIcon` - Right icon
- `icons: ButtonIconsConfig` - Object-based icon config
- `iconPosition: IconPosition` - Icon positioning (default: 'left')

### Link Properties
- `href: string` - URL for link buttons
- `target: string` - Link target attribute

### Interaction Properties
- `ripple: boolean` - Enable ripple effect (default: true)
- `htmlType: string` - HTML button type (default: 'button')

### Accessibility Properties
- `buttonAriaLabel: string` - Custom aria-label
- `ariaDescribedBy: string` - References to descriptive elements

## Event System

### Dispatched Events

**button-clicked**
```typescript
detail: {
  type: ButtonType,
  disabled: boolean,
  loading: boolean,
  href: string | null
}
```

**link-navigation**
```typescript
detail: {
  href: string,
  target: string,
  timestamp: number,
  originalEvent: Event
}
```

**keyboard-activation**
```typescript
detail: {
  key: string,
  timestamp: number,
  target: ButtonHost
}
```

**button-click** (from ripple controller)
```typescript
detail: {
  disabled: boolean,
  timestamp: number,
  coordinates: { x: number, y: number }
}
```

**nr-button-error** (error handling)
```typescript
detail: {
  error: string,
  context: string,
  controller: string
}
```

## Styling Architecture

### CSS Variable System

The button uses a comprehensive CSS variable system for theming:

```css
/* Size variables */
--nuraly-size-sm: 32px
--nuraly-size-md: 40px
--nuraly-size-lg: 48px

/* Color variables (per variant) */
--nuraly-color-button-primary
--nuraly-color-button-primary-hover
--nuraly-color-button-primary-active
--nuraly-color-button-primary-text
--nuraly-color-button-disabled
--nuraly-color-button-disabled-text

/* Spacing variables */
--nuraly-spacing-1-5
--nuraly-spacing-2
--nuraly-spacing-3
--nuraly-spacing-4

/* Icon variables */
--nuraly-button-icon-size
--nuraly-button-icon-spacing

/* Border and effects */
--nuraly-border-radius-button
--nuraly-transition-fast
--nuraly-shadow-button-focus
```

### Theme Support

- Supports multiple themes via `data-theme` attribute
- Carbon Design System compliant (light/dark modes)
- Automatic theme switching without component re-render
- Theme-aware ripple effects

### State-Based Styling

Styling uses data attributes for state management:
```css
[data-type="primary"]      /* Button variant */
[data-size="small"]        /* Size variant */
[data-shape="round"]       /* Shape variant */
[data-state="loading"]     /* Loading state */
[data-theme="carbon-dark"] /* Theme variant */
[data-block="true"]        /* Full width */
```

## Rendering Logic

### Dynamic Element Selection

The button conditionally renders as either `<button>` or `<a>` based on type and href:

```typescript
const elementTag = this.linkController.getElementTag();
// Returns 'a' if type=link and href is set, otherwise 'button'
```

### Icon Resolution

Icons are resolved through a priority system:
```typescript
private getResolvedLeftIcon(): ButtonIcon | undefined {
  if (this.iconLeft) return this.iconLeft;
  if (this.icons?.left) return this.icons.left;
  if (this.icon?.length > 0) return this.icon[0];
  return undefined;
}
```

### Conditional Rendering

- Icons: Rendered only if available and `nr-icon` component is registered
- Content: Uses Lit's slot system for flexible content
- Attributes: Conditionally applied using `ifDefined` directive

## Accessibility Features

### ARIA Implementation
- Dynamic `aria-disabled` attribute
- Custom `aria-label` support
- `aria-describedby` for enhanced descriptions
- Proper `role` attributes (button/link)
- Tabindex management for disabled states

### Keyboard Support
- Enter key activation
- Space bar activation
- Navigation keys allowed when disabled
- Focus management

### Visual Feedback
- Focus indicators (outline/box-shadow)
- Hover states
- Active states
- Disabled states with reduced opacity
- Loading states

## Dependencies

### External Dependencies
- **Lit**: Web component framework
- **lit/decorators**: Property decorators (@property, @customElement)
- **lit/directives**: Template directives (ifDefined, nothing)

### Internal Dependencies
- **NuralyUIBaseMixin**: Base component functionality
- **nr-icon**: Icon component (optional, checked at runtime)

## Component Lifecycle

1. **Construction**
   - Properties initialized with defaults
   - Controllers instantiated and registered

2. **connectedCallback**
   - Base mixin connection
   - Dependency validation (nr-icon check)
   - Controller hostConnected lifecycle

3. **Render**
   - Icon resolution
   - Element tag selection
   - Attribute computation
   - Template rendering

4. **Event Handling**
   - Click events → ripple + custom events
   - Keyboard events → activation handling
   - Navigation events → link controller

5. **Update Cycle**
   - Controller hostUpdate/hostUpdated hooks
   - Reactive property changes
   - Style recalculation

## Error Handling

### Controller-Level Error Handling
```typescript
handleError(error: Error, context: string): void {
  console.error(`[ButtonController:${this.constructor.name}] Error in ${context}:`, error);
  this.dispatchEvent(new CustomEvent('nr-button-error', { /* ... */ }));
}
```

### Safe Operations
- Try-catch blocks in all controller methods
- Safe event dispatching
- Safe update requests
- Error events for external handling

## Extension Points

### Custom Controllers
Create new controllers by extending `BaseButtonController`:

```typescript
export class CustomController extends BaseButtonController {
  hostConnected() {
    // Custom initialization
  }

  customMethod() {
    // Custom behavior
  }
}
```

### Style Customization
Override CSS variables for custom themes:

```css
nr-button {
  --nuraly-color-button-primary: #your-color;
  --nuraly-button-icon-size: 1.5rem;
}
```

### Event Handling
Listen to custom events for extended functionality:

```typescript
button.addEventListener('button-clicked', (e) => {
  console.log('Button clicked:', e.detail);
});
```

## Best Practices

### Usage Guidelines

1. **Variant Selection**
   - Use only one primary button per screen
   - Pair secondary with primary for cancel/back actions
   - Use ghost/tertiary for less prominent actions
   - Reserve danger for destructive operations

2. **Icon Usage**
   - Use icons sparingly to avoid visual noise
   - Icons should clarify, not decorate
   - Provide alt text for icon-only buttons
   - Match icon color to button text color

3. **Accessibility**
   - Always provide aria-label for icon-only buttons
   - Use semantic HTML (button vs link) appropriately
   - Ensure sufficient color contrast
   - Test keyboard navigation

4. **Performance**
   - Icon components are lazy-loaded and validated
   - Ripple animations are GPU-accelerated
   - Controllers use reactive updates efficiently
   - Event handlers are properly scoped

## Carbon Design System Compliance

The button component follows IBM Carbon Design System specifications:

- **Sizing**: 32px (small), 40px (medium), 48px (large)
- **Spacing**: Uses Carbon spacing scale
- **Typography**: Carbon font family and weights
- **Colors**: Mapped to Carbon color tokens
- **Interactions**: Carbon interaction patterns
- **Accessibility**: WCAG 2.1 AA compliant

## Testing Considerations

### Unit Testing
- Test controller behavior in isolation
- Mock host interface for controller tests
- Verify event dispatching
- Test error handling paths

### Integration Testing
- Test controller interactions
- Verify icon resolution priority
- Test theme switching
- Verify accessibility attributes

### Visual Testing
- Storybook provides visual regression baselines
- All variants and states documented
- Interactive controls for manual testing

## Migration Path

### From Array-based Icons to Enhanced Icons
```typescript
// Old API (still supported)
<nr-button .icon="${['home']}">

// New API (recommended)
<nr-button iconLeft="home">
<nr-button .iconLeft="${{name: 'home', color: 'blue'}}">
```

### Backwards Compatibility
- All original APIs remain functional
- New properties have lower priority than old ones when both are set
- Gradual migration path available
- No breaking changes

## Future Considerations

### Potential Enhancements
1. Loading spinner component integration
2. Button group component for related actions
3. Icon animation configurations
4. Advanced theming via CSS Shadow Parts
5. Split button variant
6. Dropdown button integration

### Maintenance Notes
- Keep Carbon Design System alignment
- Monitor Lit framework updates
- Maintain backwards compatibility
- Document breaking changes clearly
