import { css } from 'lit';

const checkBoxStyles = css`
  @layer nuraly.components {
    nr-checkbox {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5715;
      color: var(--nr-text);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    /* Input base */
    nr-checkbox input {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      position: relative;
      border-radius: 2px;
      background-color: #ffffff;
      border: 1px solid #d9d9d9;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      margin: 0;
      outline: none;
    }

    /* Sizes */
    nr-checkbox input {
      width: 16px;
      height: 16px;
    }
    nr-checkbox[size="small"] input {
      width: 14px;
      height: 14px;
    }
    nr-checkbox[size="large"] input {
      width: 18px;
      height: 18px;
    }

    /* Unchecked state */
    nr-checkbox:not([checked]):not([indeterminate]):not([disabled]) input {
      background-color: #ffffff;
      border: 1px solid #d9d9d9;
    }

    /* Checked / indeterminate */
    nr-checkbox:not([disabled])[checked] input,
    nr-checkbox:not([disabled])[indeterminate] input {
      background-color: #1890ff;
      border: 1px solid #1890ff;
    }

    /* Hover */
    nr-checkbox:not([disabled]):hover input {
      border: 1px solid #40a9ff;
    }
    nr-checkbox:not([disabled]):hover[checked] input,
    nr-checkbox:not([disabled]):hover[indeterminate] input {
      background-color: #1890ff;
      border: 1px solid #40a9ff;
      filter: brightness(1.1);
    }

    /* Focus */
    nr-checkbox input:focus,
    nr-checkbox input:focus-visible {
      border: 1px solid #1890ff;
      outline: 2px solid rgba(24, 144, 255, 0.2);
      outline-offset: 2px;
    }

    /* Disabled */
    nr-checkbox[disabled] {
      color: rgba(0, 0, 0, 0.25);
      cursor: not-allowed;
    }
    nr-checkbox[disabled] input {
      background-color: #f5f5f5;
      border: 1px solid #d9d9d9;
      cursor: not-allowed;
    }

    /* Checkmark base */
    nr-checkbox input:after {
      color: #ffffff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -51%);
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    /* Checked checkmark */
    nr-checkbox[checked] input:after {
      border: solid #ffffff;
      border-width: 0 2px 2px 0;
      transform: translate(-50%, -51%) rotate(45deg);
      content: '';
    }
    nr-checkbox[checked] input:after { width: 3px; height: 9px; }
    nr-checkbox[checked][size="small"] input:after { width: 2px; height: 7px; }
    nr-checkbox[checked][size="large"] input:after { width: 4px; height: 10px; }

    /* Indeterminate */
    nr-checkbox[indeterminate]:not([checked]) input:after {
      content: '-';
      color: #ffffff;
      font-weight: bold;
      transform: translate(-50%, -51%);
    }
    nr-checkbox[indeterminate][size="small"] input:after { font-size: 10px; }
    nr-checkbox[indeterminate][size="medium"] input:after { font-size: 11px; }
    nr-checkbox[indeterminate][size="large"] input:after { font-size: 13px; }

    /* Empty state */
    nr-checkbox:not([checked]):not([indeterminate]) input:after {
      content: '';
    }

    /* Disabled checkmark */
    nr-checkbox[disabled] input:after {
      color: rgba(0, 0, 0, 0.25);
      border-color: rgba(0, 0, 0, 0.25);
    }

    /* Label */
    nr-checkbox .checkbox-label {
      flex: 1;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    nr-checkbox[disabled] .checkbox-label {
      cursor: not-allowed;
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      nr-checkbox,
      nr-checkbox input,
      nr-checkbox input:after,
      nr-checkbox .checkbox-label {
        transition: none;
      }
    }

    @media (prefers-contrast: high) {
      nr-checkbox input { border-width: 2px; }
      nr-checkbox[checked] input:after,
      nr-checkbox[indeterminate] input:after { font-weight: 900; }
    }
  }
`;

export const styles = checkBoxStyles;
