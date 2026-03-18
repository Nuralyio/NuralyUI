import { css } from 'lit';

export default css`
  @layer nuraly.components {
    nr-divider {
      display: block;
      box-sizing: border-box;
    }

    nr-divider[type="vertical"] {
      display: inline-flex;
      align-self: stretch;
      height: auto;
    }

    nr-divider .divider {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: var(--nr-text);
      font-size: 1rem;
      line-height: 1.5715;
      list-style: none;
      font-family: inherit;
    }

    /* Horizontal Divider */
    nr-divider .divider--horizontal {
      display: flex;
      clear: both;
      width: 100%;
      min-width: 100%;
      margin: 10px 0;
      border-block-start: 1px solid var(--nr-border);
    }

    /* Horizontal with text */
    nr-divider .divider--horizontal.divider--with-text {
      display: flex;
      align-items: center;
      margin: 10px 0;
      color: var(--nr-text);
      font-weight: 500;
      font-size: 1rem;
      white-space: nowrap;
      text-align: center;
      border-block-start: 0;
    }

    nr-divider .divider--horizontal.divider--with-text::before,
    nr-divider .divider--horizontal.divider--with-text::after {
      position: relative;
      width: 50%;
      border-block-start: 1px solid var(--nr-border);
      border-block-end: 0;
      transform: translateY(50%);
      content: '';
    }

    /* Text positioning */
    nr-divider .divider--start::before {
      width: var(--nuraly-divider-orientation-margin-left, 5%);
    }

    nr-divider .divider--start::after {
      width: 95%;
    }

    nr-divider .divider--end::before {
      width: 95%;
    }

    nr-divider .divider--end::after {
      width: var(--nuraly-divider-orientation-margin-right, 5%);
    }

    /* Text wrapper */
    nr-divider .divider__text {
      display: inline-block;
      padding: 0 1em;
      color: var(--nr-text);
      font-size: 1rem;
    }

    /* Plain text style */
    nr-divider .divider--plain .divider__text {
      font-weight: normal;
    }

    /* Vertical Divider */
    nr-divider .divider--vertical {
      position: relative;
      top: -0.06em;
      display: inline-block;
      height: 0.9em;
      margin: 0 8px;
      vertical-align: middle;
      border-top: 0;
      border-inline-start: 1px solid var(--nr-border);
    }

    /* Full height vertical divider when in flex container */
    nr-divider[type="vertical"] .divider--vertical {
      height: 100%;
      align-self: stretch;
      top: 0;
      vertical-align: top;
      border-inline-start-color: var(--nr-border);
    }

    /* Variant styles */
    nr-divider .divider--dashed.divider--horizontal {
      border-block-start-style: dashed;
    }

    nr-divider .divider--dashed.divider--with-text::before,
    nr-divider .divider--dashed.divider--with-text::after {
      border-block-start-style: dashed;
    }

    nr-divider .divider--dashed.divider--vertical {
      border-inline-start-style: dashed;
    }

    nr-divider .divider--dotted.divider--horizontal {
      border-block-start-style: dotted;
    }

    nr-divider .divider--dotted.divider--with-text::before,
    nr-divider .divider--dotted.divider--with-text::after {
      border-block-start-style: dotted;
    }

    nr-divider .divider--dotted.divider--vertical {
      border-inline-start-style: dotted;
    }

    /* Size variations (horizontal only) */
    nr-divider .divider--horizontal.divider--small {
      margin: 4px 0;
    }

    nr-divider .divider--horizontal.divider--middle {
      margin: 16px 0;
    }

    nr-divider .divider--horizontal.divider--large {
      margin: 24px 0;
    }
  }
`;
