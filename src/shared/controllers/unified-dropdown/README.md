# Unified Dropdown Controller

A comprehensive, reusable dropdown controller for all NuralyUI components that require dropdown functionality.

## Overview

The `UnifiedDropdownController` consolidates dropdown behavior across all UI components, providing:

- **Positioning**: Fixed and absolute positioning strategies
- **Auto-placement**: Smart placement based on viewport space
- **Triggers**: Click, hover, focus, and manual modes
- **Interactions**: Click-outside detection, escape key handling
- **Scroll behavior**: Reposition or close on scroll
- **Accessibility**: Keyboard navigation support
- **Performance**: Debounced scroll/resize handlers

## Architecture

```
UnifiedDropdownController
├── Types & Interfaces (types/dropdown.types.ts)
├── DOM Utilities (utils/dom.utils.ts)
│   ├── Shadow DOM traversal
│   ├── Element detection
│   └── Viewport calculations
├── Positioning Utilities (utils/positioning.utils.ts)
│   ├── Fixed positioning
│   ├── Absolute positioning
│   └── Constraint calculations
└── Main Controller (unified-dropdown.controller.ts)
    ├── State management
    ├── Event handling
    └── Position calculation
```

## Features

### 1. Positioning Strategies

#### Fixed Positioning
```typescript
new UnifiedDropdownController(this, {
  positioning: 'fixed',
  // Dropdown positioned relative to viewport
});
```

#### Absolute Positioning
```typescript
new UnifiedDropdownController(this, {
  positioning: 'absolute',
  // Dropdown positioned relative to trigger
});
```

### 2. Smart Auto-Placement

The controller automatically determines optimal placement based on available viewport space:

- **Vertical**: `top` or `bottom` based on space
- **Horizontal**: `left`, `center`, or `right` alignment
- **Flip**: Automatically flips when out of viewport

### 3. Trigger Modes

#### Click Trigger (Default)
```typescript
new UnifiedDropdownController(this, {
  trigger: 'click',
});
```

#### Hover Trigger
```typescript
new UnifiedDropdownController(this, {
  trigger: 'hover',
  hoverDelay: 200, // ms
});
```

#### Focus Trigger
```typescript
new UnifiedDropdownController(this, {
  trigger: 'focus',
});
```

#### Manual Trigger
```typescript
new UnifiedDropdownController(this, {
  trigger: 'manual',
  // Control via open()/close() methods
});
```

### 4. Scroll Behavior

```typescript
new UnifiedDropdownController(this, {
  scrollBehavior: 'reposition', // or 'close' or 'none'
});
```

- `reposition`: Update position on scroll
- `close`: Close when scrolled out of view
- `none`: No action on scroll

### 5. Constraints

```typescript
new UnifiedDropdownController(this, {
  constrainToViewport: true,
  minWidth: 'trigger', // Match trigger width
  maxWidth: 400,
  maxHeight: 300,
});
```

## Usage

### Basic Example

```typescript
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { UnifiedDropdownController } from '@nuralyui/common/controllers/unified-dropdown';

@customElement('my-dropdown')
export class MyDropdown extends LitElement {
  private dropdownController = new UnifiedDropdownController(this, {
    positioning: 'fixed',
    placement: 'auto',
    trigger: 'click',
    closeOnClickOutside: true,
    closeOnEscape: true,
  });

  firstUpdated() {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const trigger = this.shadowRoot.querySelector('.trigger');
    this.dropdownController.setElements(dropdown, trigger);
  }

  render() {
    return html`
      <button class="trigger" @click=${() => this.dropdownController.toggle()}>
        Toggle
      </button>

      ${this.dropdownController.isOpen ? html`
        <div class="dropdown">
          Dropdown content
        </div>
      ` : ''}
    `;
  }
}
```

### Advanced Example with Custom Position

```typescript
private dropdownController = new UnifiedDropdownController(this, {
  positioning: 'fixed',
  placement: 'auto',
  alignment: 'left',
  offset: { x: 0, y: 8 },
  trigger: 'click',
  closeOnClickOutside: true,
  closeOnEscape: true,
  scrollBehavior: 'reposition',
  constrainToViewport: true,
  minWidth: 'trigger',
  zIndex: 9999,
  customPositionFn: (position) => {
    // Custom positioning logic
    return {
      ...position,
      left: position.left + 10,
    };
  },
});
```

### Event Handling

```typescript
connectedCallback() {
  super.connectedCallback();

  this.addEventListener('dropdown-open', (e) => {
    console.log('Dropdown opened');
  });

  this.addEventListener('dropdown-close', (e) => {
    console.log('Dropdown closed');
  });

  this.addEventListener('dropdown-reposition', (e) => {
    console.log('Dropdown repositioned', e.detail.position);
  });
}
```

### Available Events

- `dropdown-before-open`: Before dropdown opens (cancelable)
- `dropdown-open`: After dropdown opens
- `dropdown-before-close`: Before dropdown closes (cancelable)
- `dropdown-close`: After dropdown closes
- `dropdown-reposition`: After dropdown repositions

## Configuration Options

```typescript
interface UnifiedDropdownConfig {
  // Positioning
  positioning?: 'fixed' | 'absolute';
  placement?: 'top' | 'bottom' | 'auto';
  alignment?: 'left' | 'center' | 'right' | 'auto';
  offset?: { x: number; y: number };

  // Triggers
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  hoverDelay?: number;

  // Behavior
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  scrollBehavior?: 'reposition' | 'close' | 'none';

  // Constraints
  constrainToViewport?: boolean;
  minWidth?: number | 'trigger';
  maxWidth?: number;
  maxHeight?: number;

  // Advanced
  cascading?: boolean;
  customPositionFn?: (position: DropdownPosition) => DropdownPosition;
  excludeClickOutside?: string[];
  autoClose?: boolean;
  disabled?: boolean;
  zIndex?: number;
}
```

### Default Configuration

```typescript
{
  positioning: 'fixed',
  placement: 'auto',
  alignment: 'auto',
  offset: { x: 0, y: 0 },
  trigger: 'click',
  hoverDelay: 200,
  closeOnClickOutside: true,
  closeOnEscape: true,
  scrollBehavior: 'reposition',
  constrainToViewport: true,
  cascading: false,
  autoClose: true,
  disabled: false,
  zIndex: 9999,
}
```

## API Reference

### Methods

#### `open(): void`
Opens the dropdown.

#### `close(): void`
Closes the dropdown.

#### `toggle(): void`
Toggles the dropdown state.

#### `calculatePosition(): void`
Recalculates and applies the dropdown position.

#### `resetPosition(): void`
Resets all position-related styles.

#### `setElements(dropdownElement: HTMLElement, triggerElement: HTMLElement): void`
Sets the dropdown and trigger elements for positioning.

#### `updateConfig(config: Partial<UnifiedDropdownConfig>): void`
Updates the controller configuration.

### Properties

#### `isOpen: boolean`
Current open/closed state.

#### `position: DropdownPosition`
Current position information.

### Position Information

```typescript
interface DropdownPosition {
  top: number;
  left: number;
  width: number;
  placement: 'top' | 'bottom';
  alignment?: 'left' | 'center' | 'right';
}
```

## Migrated Components

The following components have been migrated to use the `UnifiedDropdownController`:

- ✅ **Timepicker** - Absolute positioning, close on scroll
- ✅ **Colorpicker** - Fixed positioning, reposition on scroll
- 🔄 **Select** - Coming soon
- 🔄 **Datepicker** - Coming soon
- 🔄 **Dropdown** - Coming soon

## Migration Guide

### From SharedDropdownController

```typescript
// Before
import { SharedDropdownController } from '@nuralyui/common/controllers';
private dropdownController = new SharedDropdownController(this);

// After
import { UnifiedDropdownController } from '@nuralyui/common/controllers/unified-dropdown';
private dropdownController = new UnifiedDropdownController(this, {
  positioning: 'absolute',
  trigger: 'manual',
  closeOnClickOutside: true,
  closeOnEscape: true,
  scrollBehavior: 'close',
  minWidth: 'trigger',
});
```

### From Component-Specific Controllers

```typescript
// Before (ColorPickerDropdownController)
import { ColorPickerDropdownController } from './controllers';
private dropdownController = new ColorPickerDropdownController(this);

// After
import { UnifiedDropdownController } from '@nuralyui/common/controllers/unified-dropdown';
private dropdownController = new UnifiedDropdownController(this, {
  positioning: 'fixed',
  trigger: 'manual',
  closeOnClickOutside: true,
  closeOnEscape: true,
  scrollBehavior: 'reposition',
  zIndex: 9999,
});
```

## Benefits

### For Components
- **Consistency**: All dropdowns behave the same way
- **Less Code**: No need to implement dropdown logic
- **Flexibility**: Highly configurable for different use cases
- **Reliability**: Battle-tested across multiple components

### For Developers
- **Single Source of Truth**: One place to fix bugs
- **Better Testing**: Centralized test coverage
- **Easier Maintenance**: Update once, fix everywhere
- **Smaller Bundle**: Eliminate duplicate code

### For Users
- **Better UX**: Consistent dropdown behavior
- **Better Performance**: Optimized positioning calculations
- **Better Accessibility**: Centralized ARIA support
- **Fewer Bugs**: Well-tested implementation

## Positioning Utilities

The controller includes comprehensive positioning utilities:

### Calculate Available Space
```typescript
import { calculateAvailableSpace } from './utils/positioning.utils';

const space = calculateAvailableSpace(triggerElement);
// { above: number, below: number, left: number, right: number }
```

### Determine Optimal Placement
```typescript
import { determineVerticalPlacement } from './utils/positioning.utils';

const placement = determineVerticalPlacement('auto', dropdownHeight, space);
// 'top' or 'bottom'
```

### Calculate Position
```typescript
import { calculateFixedPosition } from './utils/positioning.utils';

const position = calculateFixedPosition(
  triggerElement,
  dropdownElement,
  'bottom',
  'left',
  { x: 0, y: 8 }
);
```

## DOM Utilities

Helper functions for DOM operations:

### Shadow DOM Support
```typescript
import { isElementWithin, getComposedPath } from './utils/dom.utils';

// Check if element is within container (works with shadow DOM)
const isWithin = isElementWithin(target, container);

// Get composed path including shadow DOM
const path = getComposedPath(element);
```

### Viewport Utilities
```typescript
import {
  getViewportDimensions,
  isElementInViewport
} from './utils/dom.utils';

const viewport = getViewportDimensions();
const isVisible = isElementInViewport(element);
```

### Performance Utilities
```typescript
import { debounce, throttle } from './utils/dom.utils';

const debouncedFn = debounce(myFunction, 100);
const throttledFn = throttle(myFunction, 100);
```

## Best Practices

### 1. Set Elements After Render
```typescript
override updated() {
  const dropdown = this.shadowRoot.querySelector('.dropdown');
  const trigger = this.shadowRoot.querySelector('.trigger');

  if (dropdown && trigger) {
    this.dropdownController.setElements(dropdown, trigger);
  }
}
```

### 2. Use Appropriate Positioning
- Use `fixed` for overlays that should stay in viewport
- Use `absolute` for dropdowns relative to parent

### 3. Configure Scroll Behavior
- Use `reposition` for fixed positioning
- Use `close` for absolute positioning when scrolled out

### 4. Optimize Performance
- The controller already uses debounced handlers
- Avoid calling `calculatePosition()` manually unless needed

### 5. Handle Events
- Listen to dropdown events for custom logic
- Use `before-open` and `before-close` for validation

## Troubleshooting

### Dropdown Not Positioning Correctly
- Ensure `setElements()` is called after render
- Check that elements exist in shadow DOM
- Verify positioning strategy matches use case

### Dropdown Not Closing on Outside Click
- Ensure `closeOnClickOutside` is `true`
- Check for `excludeClickOutside` selectors
- Verify event propagation isn't stopped

### Dropdown Flickers on Scroll
- Use appropriate `scrollBehavior`
- Consider using `fixed` positioning

## Future Enhancements

- [ ] Animation support
- [ ] Virtual scrolling integration
- [ ] Multi-dropdown coordination
- [ ] RTL support
- [ ] Improved accessibility (ARIA)
- [ ] Mobile touch support
- [ ] Nested dropdown support

## License

MIT License - See LICENSE file for details
