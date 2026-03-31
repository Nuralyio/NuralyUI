import { css } from 'lit';

export default css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  :host([type="vertical"]) {
    display: inline-flex;
    align-self: stretch;
    height: auto;
  }

  .divider {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: var(--nr-text, #161616);
    font-size: 1rem;
    line-height: 1.5715;
    list-style: none;
    font-family: inherit;
  }

  /* Horizontal Divider */
  .divider--horizontal {
    display: flex;
    clear: both;
    width: 100%;
    min-width: 100%;
    margin: 10px 0;
    border-block-start: 1px solid var(--nr-border, #e0e0e0);
  }

  /* Horizontal with text */
  .divider--horizontal.divider--with-text {
    display: flex;
    align-items: center;
    margin: 10px 0;
    color: var(--nr-text, #161616);
    font-weight: 500;
    font-size: 1rem;
    white-space: nowrap;
    text-align: center;
    border-block-start: 0;
  }

  .divider--horizontal.divider--with-text::before,
  .divider--horizontal.divider--with-text::after {
    position: relative;
    width: 50%;
    border-block-start: 1px solid var(--nr-border, #e0e0e0);
    border-block-end: 0;
    transform: translateY(50%);
    content: '';
  }

  /* Text positioning */
  .divider--start::before {
    width: 5%;
  }

  .divider--start::after {
    width: 95%;
  }

  .divider--end::before {
    width: 95%;
  }

  .divider--end::after {
    width: 5%;
  }

  /* Text wrapper */
  .divider__text {
    display: inline-block;
    padding: 0 1em;
    color: var(--nr-text, #161616);
    font-size: 1rem;
  }

  /* Plain text style */
  .divider--plain .divider__text {
    font-weight: normal;
  }

  /* Vertical Divider */
  .divider--vertical {
    position: relative;
    top: -0.06em;
    display: inline-block;
    height: 0.9em;
    margin: 0 8px;
    vertical-align: middle;
    border-top: 0;
    border-inline-start: 1px solid var(--nr-border, #e0e0e0);
  }

  /* Full height vertical divider when in flex container */
  :host([type="vertical"]) .divider--vertical {
    height: 100%;
    align-self: stretch;
    top: 0;
    vertical-align: top;
    border-inline-start-color: var(--nr-border, #e0e0e0);
  }

  /* Variant styles */
  .divider--dashed.divider--horizontal {
    border-block-start-style: dashed;
  }

  .divider--dashed.divider--with-text::before,
  .divider--dashed.divider--with-text::after {
    border-block-start-style: dashed;
  }

  .divider--dashed.divider--vertical {
    border-inline-start-style: dashed;
  }

  .divider--dotted.divider--horizontal {
    border-block-start-style: dotted;
  }

  .divider--dotted.divider--with-text::before,
  .divider--dotted.divider--with-text::after {
    border-block-start-style: dotted;
  }

  .divider--dotted.divider--vertical {
    border-inline-start-style: dotted;
  }

  /* Size variations (horizontal only) */
  .divider--horizontal.divider--small {
    margin: 4px 0;
  }

  .divider--horizontal.divider--middle {
    margin: 16px 0;
  }

  .divider--horizontal.divider--large {
    margin: 24px 0;
  }
`;
