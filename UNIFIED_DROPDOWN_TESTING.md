# UnifiedDropdownController Testing Guide

## 🎯 Overview

This guide provides comprehensive testing instructions for the migrated components using the new `UnifiedDropdownController`.

---

## 📊 Migration Status

### ✅ Completed Migrations

| Component | Branch | Controller Used | Status |
|-----------|--------|----------------|--------|
| **Timepicker** | base | UnifiedDropdownController | ✅ Migrated |
| **Colorpicker** | base | UnifiedDropdownController | ✅ Migrated |
| **Select** | separate | UnifiedDropdownController | ✅ Migrated |
| **Datepicker** | separate | UnifiedDropdownController | ✅ Migrated |
| **Dropdown** | separate | UnifiedDropdownController | ✅ Migrated |
| **Tooltip** | separate | UnifiedDropdownController | ✅ Migrated |

---

## 🚀 Quick Start - Testing in Storybook

### Option 1: Full Storybook (Recommended)

```bash
# Build and start Storybook
npm run storybook

# This will:
# 1. Build all packages
# 2. Compile TypeScript
# 3. Start Storybook on http://localhost:6006
```

**Note:** This requires all TypeScript compilation to succeed. If there are errors in the common package, you may need to fix those first.

### Option 2: Individual Component Testing

If the full build fails, you can test individual components:

```bash
# Navigate to the component directory
cd src/components/timepicker

# Start a simple dev server (if you have one)
# Or use the Storybook story files directly
```

---

## 🧪 Testing Checklist

### For Each Component

#### 1. **Basic Functionality** ✓
- [ ] Component renders correctly
- [ ] Click trigger opens dropdown
- [ ] Dropdown displays with correct content
- [ ] Selecting a value updates the component
- [ ] Component emits correct events

#### 2. **Dropdown Behavior** ✓
- [ ] **Open/Close**
  - [ ] Opens on trigger action (click/hover)
  - [ ] Closes on selection (if autoClose enabled)
  - [ ] Closes on outside click
  - [ ] Closes on Escape key

- [ ] **Positioning**
  - [ ] Dropdown appears in correct position
  - [ ] Auto-placement works (switches top/bottom based on space)
  - [ ] Horizontal alignment correct (left/center/right)
  - [ ] Stays within viewport boundaries

- [ ] **Scroll Behavior**
  - [ ] Timepicker: Dropdown closes when scrolled out of view
  - [ ] Colorpicker: Dropdown repositions when scrolled
  - [ ] Datepicker: Calendar repositions on scroll
  - [ ] Select: Dropdown closes when scrolled out
  - [ ] Dropdown: Repositions on scroll
  - [ ] Tooltip: Repositions on scroll

#### 3. **Interactions** ✓
- [ ] Click inside dropdown doesn't close it
- [ ] Keyboard navigation works (if applicable)
- [ ] Tab/Shift+Tab behavior correct
- [ ] Focus management works properly
- [ ] Hover interactions work (for hover trigger)

#### 4. **Edge Cases** ✓
- [ ] Works near viewport edges (top, bottom, left, right)
- [ ] Works with scrollable containers
- [ ] Works with shadow DOM boundaries
- [ ] Multiple instances don't interfere with each other
- [ ] Disabled state prevents interaction

---

## 📝 Component-Specific Tests

### 1. Timepicker (`nr-timepicker`)

**Storybook Path:** `Data Entry > TimePicker`

**Configuration:**
```typescript
positioning: 'absolute'
placement: 'auto'
scrollBehavior: 'close'
minWidth: 'trigger'
```

**Tests:**
```javascript
// Basic time selection
<nr-timepicker value="14:30" format="12h"></nr-timepicker>

// With seconds
<nr-timepicker value="09:15:30" show-seconds></nr-timepicker>

// With constraints
<nr-timepicker min-time="09:00" max-time="17:00"></nr-timepicker>
```

**Expected Behavior:**
- ✅ Dropdown closes when scrolled out of view
- ✅ Dropdown matches input width
- ✅ Clicking "OK" closes dropdown and emits change event
- ✅ Clicking outside closes without changing value

---

### 2. Colorpicker (`nr-color-picker`)

**Storybook Path:** `Data Entry > ColorPicker`

**Configuration:**
```typescript
positioning: 'fixed'
placement: 'auto'
scrollBehavior: 'reposition'
zIndex: 9999
```

**Tests:**
```javascript
// Basic color picker
<nr-color-picker color="#3498db"></nr-color-picker>

// With preset colors
<nr-color-picker
  color="#e74c3c"
  .defaultColorSets="${['#3498db', '#e74c3c', '#2ecc71']}">
</nr-color-picker>

// With input and copy button
<nr-color-picker
  color="#9b59b6"
  show-input
  show-copy-button>
</nr-color-picker>
```

**Expected Behavior:**
- ✅ Dropdown repositions when scrolled (stays visible)
- ✅ High z-index keeps it above other content
- ✅ Color changes update the trigger button
- ✅ Escape key closes without changing color

---

### 3. Select (`nr-select`)

**Storybook Path:** `Data Entry > Select`

**Configuration:**
```typescript
positioning: 'absolute'
placement: 'auto'
scrollBehavior: 'close'
minWidth: 'trigger'
```

**Tests:**
```javascript
// Basic select
<nr-select placeholder="Choose option">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</nr-select>

// Searchable select
<nr-select searchable search-placeholder="Search...">
  <!-- options -->
</nr-select>

// Multiple selection
<nr-select multiple>
  <!-- options -->
</nr-select>
```

**Expected Behavior:**
- ✅ Search input auto-focuses when dropdown opens
- ✅ Keyboard navigation works (up/down arrows)
- ✅ Enter selects highlighted option
- ✅ Custom maxHeight respected

---

### 4. Datepicker (`nr-datepicker`)

**Storybook Path:** `Data Entry > DatePicker`

**Configuration:**
```typescript
// Calendar dropdown
positioning: 'fixed'
placement: 'auto'
scrollBehavior: 'reposition'
zIndex: 9999
```

**Tests:**
```javascript
// Basic date picker
<nr-datepicker label="Select Date"></nr-datepicker>

// Date range
<nr-datepicker range label="Select Date Range"></nr-datepicker>

// With constraints
<nr-datepicker
  min-date="2024-01-01"
  max-date="2024-12-31">
</nr-datepicker>
```

**Expected Behavior:**
- ✅ Calendar repositions on scroll
- ✅ Month/Year dropdowns work (using SharedDropdownController)
- ✅ Date selection updates input field
- ✅ Range selection works correctly

---

### 5. Dropdown (`nr-dropdown`)

**Storybook Path:** `Navigation > Dropdown`

**Configuration:**
```typescript
positioning: 'fixed'
trigger: 'hover' (configurable)
scrollBehavior: 'reposition'
cascading: true
```

**Tests:**
```javascript
// Click trigger
<nr-dropdown trigger="click">
  <button slot="trigger">Menu</button>
  <div slot="content">Content</div>
</nr-dropdown>

// Hover trigger
<nr-dropdown trigger="hover">
  <span slot="trigger">Hover me</span>
  <div slot="content">Tooltip</div>
</nr-dropdown>

// With cascading items
<nr-dropdown .items="${cascadingItems}">
  <button slot="trigger">Cascading Menu</button>
</nr-dropdown>
```

**Expected Behavior:**
- ✅ Trigger mode changes work dynamically
- ✅ Cascading submenus open on hover
- ✅ Configuration updates reactively
- ✅ All trigger modes work (click, hover, focus, manual)

---

### 6. Tooltip (`hy-tooltip`)

**Storybook Path:** `Feedback > Tooltip`

**Configuration:**
```typescript
positioning: 'fixed'
trigger: 'manual'
scrollBehavior: 'reposition'
customPositionFn: custom logic
```

**Tests:**
```javascript
// Basic tooltip
<button>Hover me</button>
<hy-tooltip position="top">Tooltip content</hy-tooltip>

// Popconfirm
<button>Delete</button>
<hy-tooltip
  isPopConfirm
  popConfirmTitle="Are you sure?"
  popConfirmDescription="This action cannot be undone">
</hy-tooltip>
```

**Expected Behavior:**
- ✅ Shows on hover (tooltip mode)
- ✅ Shows on click (popconfirm mode)
- ✅ Custom positioning logic works
- ✅ Click outside closes popconfirm

---

## 🔍 Browser DevTools Testing

### Console Events

Open browser console and look for these events:

```javascript
// Dropdown events
dropdown-open
dropdown-close
dropdown-reposition
dropdown-before-open
dropdown-before-close

// Component-specific events
nr-time-change
nr-color-change
nr-date-change
nr-change (select)
nr-dropdown-item-click
```

### Network Tab

Check that only the necessary controllers are loaded:
- `unified-dropdown.controller.js` should be loaded once
- Old controller files should NOT be loaded (if migration complete)

### Performance Tab

- Check for excessive reflows/repaints
- Verify debounced scroll/resize handlers work
- No memory leaks when opening/closing repeatedly

---

## 📊 Visual Regression Testing

### Screenshots to Compare

Take screenshots of:
1. ✓ Dropdown opened (default position)
2. ✓ Dropdown at viewport edge (top)
3. ✓ Dropdown at viewport edge (bottom)
4. ✓ Dropdown at viewport edge (left)
5. ✓ Dropdown at viewport edge (right)
6. ✓ Multiple dropdowns open simultaneously
7. ✓ Dropdown on scroll
8. ✓ Responsive behavior (mobile/tablet/desktop)

### Visual Checks

- [ ] Animations work smoothly
- [ ] Shadows render correctly
- [ ] Z-index layering correct
- [ ] Borders and spacing unchanged
- [ ] Colors and themes work
- [ ] Icons display correctly

---

## 🐛 Known Issues to Watch For

### Potential Issues

1. **Shadow DOM Click Outside**
   - Issue: Click outside not working in shadow DOM
   - Fix: Ensure `composedPath()` is used
   - Status: ✅ Fixed in UnifiedDropdownController

2. **Scroll Positioning**
   - Issue: Dropdown jumps during scroll
   - Fix: Use debounced handlers
   - Status: ✅ Implemented

3. **Multiple Instances**
   - Issue: One dropdown affects another
   - Fix: Proper element reference management
   - Status: ✅ Uses `setElements()` per instance

4. **Z-index Conflicts**
   - Issue: Dropdown appears behind other elements
   - Fix: Configurable z-index
   - Status: ✅ Configurable per component

---

## ✅ Verification Checklist

### Before Merging

- [ ] All Storybook stories work correctly
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All tests pass (if unit tests exist)
- [ ] Visual regression tests pass
- [ ] Performance is acceptable
- [ ] Accessibility (keyboard navigation) works
- [ ] Mobile/responsive behavior correct
- [ ] All events fire correctly
- [ ] Documentation updated

### Post-Merge Monitoring

- [ ] No user-reported issues
- [ ] Bundle size reduced as expected (~5-8KB)
- [ ] Performance metrics acceptable
- [ ] No regression in existing functionality

---

## 🔧 Debugging Tips

### If Dropdown Won't Open

```javascript
// Check in console:
dropdownController.isOpen // Should toggle
dropdownController.position // Should show calculated position

// Check elements are set:
dropdownController._dropdownElement // Should be HTMLElement
dropdownController._triggerElement // Should be HTMLElement
```

### If Positioning is Wrong

```javascript
// Check configuration:
console.log(dropdownController.config);

// Force recalculation:
dropdownController.calculatePosition();

// Check available space:
const space = dropdownController.getAvailableSpace();
console.log('Space:', space);
```

### If Click Outside Doesn't Work

```javascript
// Test click-outside manually:
document.addEventListener('click', (e) => {
  console.log('Click path:', e.composedPath());
});
```

---

## 📚 Additional Resources

- **README:** `src/shared/controllers/unified-dropdown/README.md`
- **Types:** `src/shared/controllers/unified-dropdown/types/dropdown.types.ts`
- **DOM Utils:** `src/shared/controllers/unified-dropdown/utils/dom.utils.ts`
- **Positioning Utils:** `src/shared/controllers/unified-dropdown/utils/positioning.utils.ts`

---

## 🎯 Success Criteria

The migration is successful if:

1. ✅ All 6 components work identically to before
2. ✅ No visual regressions
3. ✅ No functional regressions
4. ✅ Performance is same or better
5. ✅ Bundle size reduced
6. ✅ Code maintainability improved
7. ✅ All tests pass
8. ✅ Documentation complete

---

## 📞 Support

If you encounter issues:

1. Check this testing guide
2. Review the README.md in `unified-dropdown/`
3. Check component-specific controllers
4. Review commit messages for migration details
5. Test with console logging enabled

---

**Last Updated:** 2025-11-22
**Migration Version:** 1.0.0
**Components Migrated:** 6/6 (100%)
