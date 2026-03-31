import { css } from 'lit';

/**
 * Modal component styles for the Hybrid UI Library
 * Using shared CSS variables from /src/shared/themes/
 * 
 * This file contains all the styling for the nr-modal component with
 * clean CSS variable usage and proper theme switching support.
 */
export const styles = css`
  :host {
    display: contents;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    
    /* Force CSS custom property inheritance to ensure theme switching works properly */
    color: #161616;
    background-color: #ffffff;
    
    /* Ensure theme variables are properly inherited */
    --modal-border-radius: 8px;
    
    /* Ensure clean state transitions when theme changes */
    * {
      transition: all 0.15s ease;
    }
  }

  /* Force re-evaluation of theme-dependent properties on theme change */
  :host([data-theme]) {
    color: inherit;
    background-color: inherit;
  }

  /* Modal backdrop */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.45);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    backdrop-filter: none;
    
    &.modal-backdrop--hidden {
      display: none;
    }
    
    &.modal-backdrop--position-top {
      align-items: flex-start;
      padding-top: 2rem;
    }
    
    &.modal-backdrop--position-bottom {
      align-items: flex-end;
      padding-bottom: 2rem;
    }
  }

  /* Nested modals support */
  .modal-backdrop {
    /* Ensure each modal backdrop has its own stacking context */
    z-index: 1000;
  }

  /* Nested modal backdrop styling */
  .modal-backdrop + .modal-backdrop {
    /* Subsequent modals get slightly darker backdrop */
    background-color: rgba(0, 0, 0, 0.6);
  }

  /* Nested modal animation delay to avoid conflicts */
  .modal-backdrop:not(:first-of-type) {
    animation-delay: 0.1s;
  }

  /* Modal container */
  .modal {
    position: relative;
    background-color: #ffffff;
    border-radius: var(--modal-border-radius);
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e0e0e0;
    max-height: calc(100vh - 2rem * 2);
    max-width: calc(100vw - 2rem * 2);
    display: flex;
    flex-direction: column;
    outline: none;
    
    &:focus {
      outline: 2px solid #7c3aed;
      outline-offset: 1px;
    }
  }


  /* Modal sizes */
  .modal--size-small {
    width: 400px;
    min-height: 200px;
  }

  .modal--size-medium {
    width: 600px;
    min-height: 300px;
  }

  .modal--size-large {
    width: 800px;
    min-height: 400px;
  }

  .modal--size-xl {
    width: 1000px;
    min-height: 500px;
  }

  .modal--fullscreen {
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }

  /* Modal header */
  .modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 56px;
    flex-shrink: 0;
    
    &.modal-header--draggable {
      cursor: move;
      user-select: none;
    }
  }

  .modal-header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .modal-header-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: #525252;
  }

  .modal-title {
    font-size: 1.125rem;
    font-weight: 500;
    color: #161616;
    margin: 0;
    line-height: 1.375;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .modal-close-button {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #525252;
    transition: all 0.15s ease;
    
    &:hover {
      background-color: #f4f4f4;
      color: #161616;
    }
    
    &:focus {
      outline: 2px solid #7c3aed;
      outline-offset: 1px;
    }
    
    &:active {
      background-color: #c6c6c6;
    }
  }

  .modal-close-icon {
    width: 16px;
    height: 16px;
  }

  /* Carbon theme specific - sharp corners for close button */
  :host([data-theme="carbon"]) .modal-close-button,
  :host([data-theme="carbon-light"]) .modal-close-button,
  :host([data-theme="carbon-dark"]) .modal-close-button {
    border-radius: 0;
  }

  /* Modal body */
  .modal-body {
    flex: 1;
    padding: 1rem 1.5rem;
    overflow-y: auto;
    color: #161616;
    line-height: 1.5;
  }

  /* Modal footer */
  .modal-footer {
    padding: 0.5rem 1rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    min-height: 48px;
    flex-shrink: 0;
  }

  /* Animation keyframes */
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes modalZoomIn {
    from {
      opacity: 0;
      transform: scale(0.7);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes modalSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes modalSlideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes backdropFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Animation classes */
  .modal-backdrop--animation-fade {
    animation: backdropFadeIn 0.3s ease;
  }

  .modal--animation-fade {
    animation: modalFadeIn 0.3s ease;
  }

  .modal--animation-zoom {
    animation: modalZoomIn 0.3s ease;
  }

  .modal--animation-slide-up {
    animation: modalSlideUp 0.3s ease;
  }

  .modal--animation-slide-down {
    animation: modalSlideDown 0.3s ease;
  }

  /* Dragging state */
  .modal--dragging {
    user-select: none;
    cursor: move;
  }

  /* Resizing handles (when resizable) */
  .modal--resizable {
    resize: both;
    overflow: auto;
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    background: linear-gradient(
      -45deg,
      transparent 40%,
      #e0e0e0 40%,
      #e0e0e0 60%,
      transparent 60%
    );
  }

  /* Responsive behavior */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0.25rem;
    }
    
    .modal--size-small,
    .modal--size-medium,
    .modal--size-large,
    .modal--size-xl {
      width: 100%;
      max-width: none;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }
  }

  /* Dark theme support through CSS custom properties */
  @media (prefers-color-scheme: dark) {
    :host(:not([data-theme])) {
      --nuraly-color-modal-backdrop: rgba(0, 0, 0, 0.6);
    }
  }
`;