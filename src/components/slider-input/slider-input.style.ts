import { css } from "lit";
import { styleVariables } from './slider-input.style.variables.js';

export default css`
  ${styleVariables}

  :host {
    display: inline-block;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 400;
  }

  /* Host attribute selectors for configuration */
  :host([disabled]) {
    opacity: 0.6;
    pointer-events: none;
  }

  .slider-wrapper {
    position: relative;
    padding: calc(20px / 2) 0;
  }

  .range-container {
    position: relative;
    width: 100%;
  }

  .range-slider,
  .range-slider-value {
    border-radius: 6px;
    height: 8px;
    position: absolute;
    top: calc((20px - 8px) / 2);
    transition: all 150ms ease;
  }

  .range-slider {
    background: #e5e7eb;
    width: 100%;
    border: 1px solid #d1d5db;
  }

  .range-slider-value {
    background: #3b82f6;
    width: var(--nr-slider-value-width, 0%);
    z-index: calc(1 + 1);
  }

  .range-thumb {
    background: #ffffff;
    border: 2px solid #3b82f6;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    position: absolute;
    top: calc((8px - 20px) / 2);
    left: var(--nr-slider-thumb-offset, 0px);
    cursor: pointer;
    z-index: calc(1 + 2);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 150ms ease;
  }

  .range-thumb:hover {
    background: #eff6ff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .range-thumb:active {
    background: #dbeafe;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    margin: 0;
    opacity: 0;
    width: 100%;
    cursor: pointer;
    z-index: calc(1 + 3);
    appearance: none;
    background: transparent;
    pointer-events: auto;
  }

  input::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: transparent;
    cursor: pointer;
  }

  input::-moz-range-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  input:focus-visible + .range-container .range-thumb {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  /* Disabled state styling */
  :host([disabled]) .range-slider {
    background: #f5f5f5;
    border-color: #e5e7eb;
  }

  :host([disabled]) .range-slider-value {
    background: #d1d5db;
  }

  :host([disabled]) .range-thumb {
    background: #e5e7eb;
    border-color: #e5e7eb;
    cursor: not-allowed;
    box-shadow: none;
  }

  :host([disabled]) input {
    cursor: not-allowed;
  }

  /* Size variants */
  :host([size="small"]) {
    --nuraly-slider-input-local-track-height: 6px;
    --nuraly-slider-input-local-thumb-diameter: 16px;
  }

  :host([size="large"]) {
    --nuraly-slider-input-local-track-height: 10px;
    --nuraly-slider-input-local-thumb-diameter: 24px;
  }

  /* Error state */
  :host([error]) .range-slider-value {
    background: #ef4444;
  }

  :host([error]) .range-thumb {
    border-color: #ef4444;
  }

  /* Warning state */
  :host([warning]) .range-slider-value {
    background: #f59e0b;
  }

  :host([warning]) .range-thumb {
    border-color: #f59e0b;
  }

  /* Success state */
  :host([success]) .range-slider-value {
    background: #10b981;
  }

  :host([success]) .range-thumb {
    border-color: #10b981;
  }
`;
