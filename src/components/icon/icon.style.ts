import { css } from 'lit';

const iconStyle = css`
  @layer nuraly.components {
    nr-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: baseline;
      position: relative;
      font-family: 'IBM Plex Sans', ui-sans-serif, system-ui;
      color: var(--nr-text);
    }

    nr-icon .icon-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    nr-icon .svg-icon {
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

    nr-icon .svg-icon path,
    nr-icon .svg-icon line,
    nr-icon .svg-icon polyline,
    nr-icon .svg-icon polygon,
    nr-icon .svg-icon circle,
    nr-icon .svg-icon rect,
    nr-icon .svg-icon ellipse {
      stroke: currentColor;
      fill: none;
    }

    /* Clickable states */
    nr-icon .svg-icon.clickable { cursor: pointer; }

    nr-icon .svg-icon.clickable:hover {
      opacity: 0.8;
      transform: scale(1.05);
      stroke: #0f62fe;
      color: #0f62fe;
    }

    nr-icon .svg-icon.clickable:active {
      opacity: 0.6;
      transform: scale(0.95);
      stroke: #054ada;
      color: #054ada;
    }

    nr-icon .svg-icon.clickable:focus {
      outline: 2px solid var(--nr-focus);
      outline-offset: 2px;
      background: rgba(15, 98, 254, 0.1);
      border-radius: 4px;
    }

    /* Disabled state */
    nr-icon .svg-icon.disabled {
      opacity: 0.25;
      stroke: var(--nr-disabled);
      color: var(--nr-disabled);
      cursor: not-allowed;
    }

    nr-icon .svg-icon.clickable.disabled:hover,
    nr-icon .svg-icon.clickable.disabled:active {
      opacity: 0.25;
      stroke: var(--nr-disabled);
      color: var(--nr-disabled);
      transform: none;
    }

    nr-icon .svg-icon.clickable.disabled:focus {
      outline: none;
      background: none;
      box-shadow: none;
    }

    /* Size variations */
    nr-icon[size="small"] .svg-icon { width: 14px; height: 14px; }
    nr-icon[size="medium"] .svg-icon { width: 20px; height: 20px; }
    nr-icon[size="large"] .svg-icon { width: 24px; height: 24px; }
    nr-icon[size="xlarge"] .svg-icon { width: 32px; height: 32px; }
    nr-icon[size="xxlarge"] .svg-icon { width: 40px; height: 40px; }

    /* Accessibility */
    nr-icon .sr-only {
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
      nr-icon .svg-icon { stroke: CanvasText; color: CanvasText; }
      nr-icon .svg-icon.disabled { opacity: 0.5; }
    }

    @media (prefers-reduced-motion: reduce) {
      nr-icon .svg-icon { transition: none; }
      nr-icon .svg-icon.clickable:hover,
      nr-icon .svg-icon.clickable:active { transform: none; }
    }
  }
`;

export const styles = [iconStyle];
