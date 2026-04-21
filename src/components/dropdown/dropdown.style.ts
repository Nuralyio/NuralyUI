import { css } from 'lit';

export const styles = css`
  :host {
    display: inline-block;
    position: relative;
    color: #161616;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown__trigger {
    display: inline-block;
    cursor: pointer;
  }

  .dropdown__trigger:focus-within {
    outline: 2px solid #0f62fe;
    outline-offset: 1px;
  }

  .dropdown__panel {
    position: fixed;
    z-index: var(--nuraly-dropdown-z-index, 9999);
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    min-width: 10rem;
    max-width: 20rem;
    max-height: 200px;
    overflow: auto;
    /* Use display none to fully hide when closed */
    display: none;
    /* Use opacity and visibility for smooth animations */
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: opacity 0.15s ease,
                visibility 0.15s ease,
                transform 0.15s ease;
    /* Ensure proper containment */
    box-sizing: border-box;
    /* Create new stacking context to prevent layering issues */
    isolation: isolate;
    /* Force above other elements */
    transform-origin: top center;
    /* Prevent clipping by overflow containers */
    pointer-events: none;
  }

  .dropdown__panel--open {
    display: block;
    opacity: 1;
    visibility: visible;
    transform: none;
    pointer-events: auto;
  }

  /* Alternative attribute-based selector (like select component) */
  :host([open]) .dropdown__panel {
    display: block;
    opacity: 1;
    visibility: visible;
    transform: none;
    pointer-events: auto;
  }

  /* Placement variants - transform origin adjustments */
  .dropdown__panel--top,
  .dropdown__panel--top-start,
  .dropdown__panel--top-end {
    transform-origin: bottom center;
    transform: translateY(8px);
  }

  .dropdown__panel--top.dropdown__panel--open,
  .dropdown__panel--top-start.dropdown__panel--open,
  .dropdown__panel--top-end.dropdown__panel--open {
    transform: none;
  }

  .dropdown__panel--bottom,
  .dropdown__panel--bottom-start,
  .dropdown__panel--bottom-end {
    transform-origin: top center;
  }

  /* Size variants */
  .dropdown__panel--small {
    font-size: 0.75rem;
  }

  .dropdown__panel--medium {
    font-size: 0.875rem;
  }

  .dropdown__panel--large {
    font-size: 1rem;
  }

  /* Animation variants */
  
  /* No animation - instant show/hide */
  .dropdown__panel--none {
    transition: none;
  }

  .dropdown__panel--none:not(.dropdown__panel--open) {
    opacity: 0;
    visibility: hidden;
    transform: none;
  }

  .dropdown__panel--none.dropdown__panel--open {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  /* Fade animation - opacity only */
  .dropdown__panel--fade {
    transition: opacity 0.15s ease,
                visibility 0.15s ease;
  }

  .dropdown__panel--fade:not(.dropdown__panel--open) {
    opacity: 0;
    visibility: hidden;
    transform: none;
  }

  .dropdown__panel--fade.dropdown__panel--open {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  /* Slide animation - slide down/up with opacity */
  .dropdown__panel--slide {
    transition: opacity 0.15s ease,
                visibility 0.15s ease,
                transform 0.15s ease;
  }

  .dropdown__panel--slide:not(.dropdown__panel--open) {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-12px);
  }

  .dropdown__panel--slide.dropdown__panel--open {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  /* For top-positioned dropdowns, slide direction is reversed */
  .dropdown__panel--slide.dropdown__panel--top:not(.dropdown__panel--open),
  .dropdown__panel--slide.dropdown__panel--top-start:not(.dropdown__panel--open),
  .dropdown__panel--slide.dropdown__panel--top-end:not(.dropdown__panel--open) {
    transform: translateY(12px);
  }

  /* Scale animation - scale and opacity */
  .dropdown__panel--scale {
    transition: opacity 0.15s ease,
                visibility 0.15s ease,
                transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .dropdown__panel--scale:not(.dropdown__panel--open) {
    opacity: 0;
    visibility: hidden;
    transform: scale(0.9) translateY(-8px);
  }

  .dropdown__panel--scale.dropdown__panel--open {
    opacity: 1;
    visibility: visible;
    transform: none;
  }

  /* For top-positioned scale dropdowns */
  .dropdown__panel--scale.dropdown__panel--top:not(.dropdown__panel--open),
  .dropdown__panel--scale.dropdown__panel--top-start:not(.dropdown__panel--open),
  .dropdown__panel--scale.dropdown__panel--top-end:not(.dropdown__panel--open) {
    transform: scale(0.9) translateY(8px);
  }

  .dropdown__panel--scale.dropdown__panel--top.dropdown__panel--open,
  .dropdown__panel--scale.dropdown__panel--top-start.dropdown__panel--open,
  .dropdown__panel--scale.dropdown__panel--top-end.dropdown__panel--open {
    transform: none;
  }

  /* Arrow */
  .dropdown__arrow {
    position: absolute;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-bottom-color: #ffffff;
    top: calc(-1 * 5px * 2);
    left: 50%;
    transform: translateX(-50%);
  }

  .dropdown__arrow::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: calc(5px + 1px) solid transparent;
    border-bottom-color: #e0e0e0;
    top: calc(-1 * 5px - 1px);
    left: calc(-1 * 5px - 1px);
  }

  /* Content areas */
  .dropdown__content {
    overflow: auto;
  }

  .dropdown__items {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: visible; /* Allow submenus to extend outside */
  }

  .dropdown__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    color: #161616;
    cursor: pointer;
    text-align: left;
    width: 100%;
    min-height: 2.5rem;
    transition: background-color 0.15s ease;
    font-size: inherit;
    font-family: inherit;
    line-height: 1.5;
    position: relative;
  }

  .dropdown__item:hover:not(.dropdown__item--disabled) {
    background: #f4f4f4;
    color: #161616;
  }

  .dropdown__item:focus {
    outline: none;
    background: #f4f4f4;
    color: #161616;
  }

  .dropdown__item:focus-visible {
    outline: 2px solid #0f62fe;
    outline-offset: -2px;
    background: #f4f4f4;
    color: #161616;
  }

  .dropdown__item:active:not(.dropdown__item--disabled) {
    background: #f4f4f4;
    color: #161616;
  }

  .dropdown__item--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .dropdown__item-icon {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }

  .dropdown__item-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropdown__divider {
    height: 1px;
    background: #e0e0e0;
    margin: 0.25rem 0;
  }

  /* Cascading dropdown styles */
  .dropdown__item-container {
    position: relative;
  }

  /* Allow submenus to overflow when dropdown has cascading items */
  :host([has-cascading]) .dropdown__panel {
    overflow: visible !important;
    max-height: none !important; /* Remove height restriction for cascading */
  }

  :host([has-cascading]) .dropdown__items {
    overflow: visible !important;
  }

  /* For cascading dropdowns, we need to handle scrolling differently */
  :host([has-cascading]) .dropdown__content {
    overflow: visible !important;
  }

  .dropdown__item--has-submenu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dropdown__submenu-arrow {
    margin-left: auto;
    font-size: 0.75em;
    opacity: 0.6;
    transition: transform 0.15s ease;
  }

  .dropdown__item--has-submenu:hover .dropdown__submenu-arrow {
    opacity: 1;
  }

  .dropdown__submenu {
    position: absolute;
    top: 0;
    z-index: calc(var(--nuraly-dropdown-z-index, 9999) + 1);
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    min-width: 10rem;
    max-width: 20rem;
    max-height: auto;
    overflow: auto;
    box-sizing: border-box;
    animation: fadeInSubmenu 0.15s ease;
    /* Ensure submenu is visible */
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .dropdown__custom-content {
    padding: 8px 12px;
    max-width: 100%;
    box-sizing: border-box;
  }

  /* Custom content styling */
  .dropdown__custom-content h3,
  .dropdown__custom-content h4 {
    margin: 0 0 8px 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #161616;
  }

  .dropdown__custom-content p {
    margin: 0 0 8px 0;
    font-size: 0.75rem;
    color: #525252;
    line-height: 1.4;
  }

  .dropdown__custom-content button,
  .dropdown__custom-content input,
  .dropdown__custom-content select {
    width: 100%;
    margin-bottom: 8px;
  }

  .dropdown__custom-content button:last-child,
  .dropdown__custom-content input:last-child,
  .dropdown__custom-content p:last-child {
    margin-bottom: 0;
  }

  .dropdown__submenu--right {
    left: 100%;
    margin-left: 4px;
  }

  .dropdown__submenu--left {
    right: 100%;
    margin-right: 4px;
  }

  @keyframes fadeInSubmenu {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .dropdown__submenu--left {
    animation-name: fadeInSubmenuLeft;
  }

  @keyframes fadeInSubmenuLeft {
    from {
      opacity: 0;
      transform: translateX(8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Focus styles for accessibility */
  :host(:focus-within) .dropdown__trigger {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
  }

  /* Disabled state */
  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Allow overflow for nested dropdowns/selects */
  :host([allow-overflow]) .dropdown__panel {
    overflow: visible !important;
    max-height: none !important;
  }

  :host([allow-overflow]) .dropdown__content {
    overflow: visible !important;
  }

  /* Hidden state */
  [hidden] {
    display: none !important;
  }

`;