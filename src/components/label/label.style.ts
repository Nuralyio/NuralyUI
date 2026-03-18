import { css } from 'lit';

export default css`
  @layer nuraly.components {
    nr-label {
      display: inline-block;
      width: fit-content;
    }

    nr-label label {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 0.875rem;
      font-weight: 300;
      line-height: normal;
      color: var(--nr-text);
      margin: 0;
      margin-bottom: 4px;
      display: block;
      user-select: none;
      cursor: pointer;
      transition: color 150ms ease;
    }

    /* Size variants */
    nr-label[size="small"] label {
      font-size: 0.75rem;
    }

    nr-label[size="large"] label {
      font-size: 1rem;
    }

    /* Variant colors */
    nr-label[variant="secondary"] label {
      color: var(--nr-text-secondary);
    }

    nr-label[variant="error"] label {
      color: #da1e28;
    }

    nr-label[variant="warning"] label {
      color: #f1c21b;
    }

    nr-label[variant="success"] label {
      color: #198038;
    }

    /* Disabled state */
    nr-label[disabled] label {
      color: var(--nr-disabled);
      cursor: not-allowed;
      opacity: 0.6;
    }

    /* Required asterisk */
    nr-label .required-asterisk {
      color: #da1e28;
      margin-left: 2px;
      font-weight: normal;
    }
  }
`;
