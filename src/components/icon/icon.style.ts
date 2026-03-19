import { css } from 'lit';

const iconStyle = css`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    vertical-align: baseline;
    position: relative;
    font-family: 'IBM Plex Sans', ui-sans-serif, system-ui;
    color: var(--nr-text, currentColor);
  }

  .icon-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .svg-icon {
    stroke: currentColor;
    fill: none;
    width: 18px;
    height: 18px;
    min-width: 12px;
    min-height: 12px;
    transition: opacity 0.2s ease, transform 0.2s ease, stroke 0.2s ease;
    display: block;
    flex-shrink: 0;
    cursor: default;
  }

  .svg-icon path,
  .svg-icon line,
  .svg-icon polyline,
  .svg-icon polygon,
  .svg-icon circle,
  .svg-icon rect,
  .svg-icon ellipse {
    stroke: currentColor;
    fill: none;
  }

  /* Clickable states */
  .svg-icon.clickable { cursor: pointer; }

  .svg-icon.clickable:hover {
    opacity: 0.8;
    transform: scale(1.05);
    stroke: #0f62fe;
    color: #0f62fe;
  }

  .svg-icon.clickable:active {
    opacity: 0.6;
    transform: scale(0.95);
    stroke: #054ada;
    color: #054ada;
  }

  .svg-icon.clickable:focus {
    outline: 2px solid var(--nr-focus, #0f62fe);
    outline-offset: 2px;
    background: rgba(15, 98, 254, 0.1);
    border-radius: 4px;
  }

  /* Disabled state */
  .svg-icon.disabled {
    opacity: 0.25;
    stroke: var(--nr-disabled, #c6c6c6);
    color: var(--nr-disabled, #c6c6c6);
    cursor: not-allowed;
  }

  .svg-icon.clickable.disabled:hover,
  .svg-icon.clickable.disabled:active {
    opacity: 0.25;
    stroke: var(--nr-disabled, #c6c6c6);
    color: var(--nr-disabled, #c6c6c6);
    transform: none;
  }

  .svg-icon.clickable.disabled:focus {
    outline: none;
    background: none;
    box-shadow: none;
  }

  /* Size variations */
  :host([size="small"]) .svg-icon { width: 14px; height: 14px; }
  :host([size="medium"]) .svg-icon { width: 20px; height: 20px; }
  :host([size="large"]) .svg-icon { width: 24px; height: 24px; }
  :host([size="xlarge"]) .svg-icon { width: 32px; height: 32px; }
  :host([size="xxlarge"]) .svg-icon { width: 40px; height: 40px; }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-contrast: high) {
    .svg-icon { stroke: CanvasText; color: CanvasText; }
    .svg-icon.disabled { opacity: 0.5; }
  }

  @media (prefers-reduced-motion: reduce) {
    .svg-icon { transition: none; }
    .svg-icon.clickable:hover,
    .svg-icon.clickable:active { transform: none; }
  }
`;

export const styles = [iconStyle];
