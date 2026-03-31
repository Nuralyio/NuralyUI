import { css } from 'lit';

export const styleVariables = css`
  :host {
    /* Typography */
    --nuraly-label-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    --nuraly-label-font-weight: 300;
    --nuraly-label-line-height: auto;

    /* Size variants */
    --nuraly-label-small-font-size: 12px;
    --nuraly-label-medium-font-size: 14px;
    --nuraly-label-large-font-size: 16px;

    /* Default font size */
    --nuraly-label-font-size: 14px;

    /* Colors */
    --nuraly-label-text-color: #000000;
    --nuraly-label-secondary-color: #666666;
    --nuraly-label-error-color: #ff4d4f;
    --nuraly-label-warning-color: #faad14;
    --nuraly-label-success-color: #52c41a;
    --nuraly-label-required-color: #ff4d4f;
    --nuraly-label-disabled-color: #bfbfbf;

    /* Spacing */
    --nuraly-label-margin-bottom: 4px;
    --nuraly-label-required-margin: 2px;

    /* Transitions */
    --nuraly-label-transition-duration: 150ms;
    --nuraly-label-transition-timing: ease;
  }
`;
