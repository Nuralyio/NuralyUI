import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
    width: fit-content;
  }

  label {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 0.875rem;
    font-weight: 300;
    line-height: normal;
    color: var(--nr-text, #161616);
    margin: 0;
    margin-bottom: 4px;
    display: block;
    user-select: none;
    cursor: pointer;
    transition: color 150ms ease;
  }

  /* Size variants */
  :host([size="small"]) label {
    font-size: 0.75rem;
  }

  :host([size="large"]) label {
    font-size: 1rem;
  }

  /* Variant colors */
  :host([variant="secondary"]) label {
    color: var(--nr-text-secondary, #525252);
  }

  :host([variant="error"]) label {
    color: #da1e28;
  }

  :host([variant="warning"]) label {
    color: #f1c21b;
  }

  :host([variant="success"]) label {
    color: #198038;
  }

  /* Disabled state */
  :host([disabled]) label {
    color: var(--nr-disabled, #c6c6c6);
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Required asterisk */
  .required-asterisk {
    color: #da1e28;
    margin-left: 2px;
    font-weight: normal;
  }
`;
