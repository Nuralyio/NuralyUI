import { css } from 'lit';

export const styleVariables = css`
  :host {
    /* Component dimensions */
    --nuraly-slider-input-local-width: 100%;
    --nuraly-slider-input-local-track-height: 8px;
    --nuraly-slider-input-local-thumb-diameter: 20px;
    --nuraly-slider-input-local-border-width: 1px;

    /* Size variants */
    --nuraly-slider-input-local-small-height: 6px;
    --nuraly-slider-input-local-small-thumb-diameter: 16px;
    --nuraly-slider-input-local-large-height: 10px;
    --nuraly-slider-input-local-large-thumb-diameter: 24px;

    /* Typography */
    --nuraly-slider-input-local-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    --nuraly-slider-input-local-font-size: 14px;
    --nuraly-slider-input-local-font-weight: 400;

    /* Border radius */
    --nuraly-slider-input-local-border-radius: 6px;
    --nuraly-slider-input-local-thumb-border-radius: 50%;

    /* Colors - Track */
    --nuraly-slider-input-local-track-color: #e5e7eb;
    --nuraly-slider-input-local-track-filled-color: #3b82f6;
    --nuraly-slider-input-local-border-color: #d1d5db;

    /* Colors - Thumb */
    --nuraly-slider-input-local-thumb-color: #ffffff;
    --nuraly-slider-input-local-thumb-border-color: #3b82f6;
    --nuraly-slider-input-local-thumb-hover-color: #eff6ff;
    --nuraly-slider-input-local-thumb-active-color: #dbeafe;

    /* Colors - Disabled states */
    --nuraly-slider-input-local-disabled-track-color: #f5f5f5;
    --nuraly-slider-input-local-disabled-color: #d1d5db;
    --nuraly-slider-input-local-disabled-thumb-color: #e5e7eb;
    --nuraly-slider-input-local-disabled-border-color: #e5e7eb;

    /* Colors - Status states */
    --nuraly-slider-input-local-error-color: #ef4444;
    --nuraly-slider-input-local-warning-color: #f59e0b;
    --nuraly-slider-input-local-success-color: #10b981;

    /* Shadows */
    --nuraly-slider-input-local-thumb-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --nuraly-slider-input-local-focus-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);

    /* Elevation */
    --nuraly-slider-input-local-z-index: 1;

    /* Transitions */
    --nuraly-slider-input-local-transition-duration: 150ms;
    --nuraly-slider-input-local-transition-timing: ease;
  }
`;
