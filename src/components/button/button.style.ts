import { css } from 'lit';

export const buttonStyles = css`
  @layer nuraly.components {
    nr-button {
      display: inline-block;
      vertical-align: middle;
    }

    nr-button[hidden] {
      display: none;
    }

    nr-button button,
    nr-button a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.125rem;
      letter-spacing: 0.16px;
      height: 2.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid transparent;
      border-radius: 0;
      background-color: var(--nr-bg);
      color: var(--nr-text);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: none;
      gap: 0.5rem;
    }

    nr-button button:disabled {
      cursor: not-allowed;
    }

    /* Icon styling inside button */
    nr-button button nr-icon,
    nr-button a nr-icon {
      flex-shrink: 0;
      width: 1rem;
      height: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      line-height: 1;
      color: inherit;
      font-size: 1rem !important;
      transition: all 0.15s ease;
      cursor: inherit;
      pointer-events: none;
    }

    nr-button button:hover:not(:disabled) nr-icon { opacity: 1; }
    nr-button button:focus:not(:disabled) nr-icon { opacity: 1; filter: brightness(1.1); }
    nr-button button:active:not(:disabled) nr-icon { opacity: 0.9; transform: scale(0.95); }

    /* Container span */
    nr-button button .button-container,
    nr-button a .button-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: inherit;
    }

    /* ======== Type: Primary ======== */
    nr-button[type="primary"] button {
      background-color: #0f62fe;
      border-color: #0f62fe;
      color: #fff;
    }
    nr-button[type="primary"] button nr-icon {
      fill: #fff !important;
      color: #fff !important;
    }
    nr-button[type="primary"] button:hover:not(:disabled) {
      background-color: #0353e9;
      border-color: #0353e9;
    }
    nr-button[type="primary"] button:active:not(:disabled) {
      background-color: #002d9c;
      border-color: #002d9c;
    }
    nr-button[type="primary"] button:disabled {
      background-color: var(--nr-disabled);
      border-color: var(--nr-disabled);
      color: var(--nr-text-secondary);
    }

    /* ======== Type: Secondary ======== */
    nr-button[type="secondary"] button {
      background-color: #393939;
      border-color: #393939;
      color: #fff;
    }
    nr-button[type="secondary"] button:hover:not(:disabled) {
      background-color: #4c4c4c;
      border-color: #4c4c4c;
    }
    nr-button[type="secondary"] button:active:not(:disabled) {
      background-color: #6f6f6f;
      border-color: #6f6f6f;
    }
    nr-button[type="secondary"] button:disabled {
      background-color: var(--nr-disabled);
      border-color: var(--nr-disabled);
      color: var(--nr-text-secondary);
    }

    /* ======== Type: Default ======== */
    nr-button[type="default"] button {
      background-color: var(--nr-bg);
      border-color: var(--nr-border);
      color: var(--nr-text);
    }
    nr-button[type="default"] button:hover:not(:disabled) {
      background-color: var(--nr-bg-hover);
      border-color: #a8a8a8;
    }
    nr-button[type="default"] button:active:not(:disabled) {
      background-color: #e0e0e0;
      border-color: #8d8d8d;
    }
    nr-button[type="default"] button:disabled {
      background-color: #f4f4f4;
      border-color: var(--nr-disabled);
      color: var(--nr-disabled);
    }

    /* ======== Type: Ghost ======== */
    nr-button[type="ghost"] button {
      background-color: transparent;
      border-color: var(--nr-border);
      color: var(--nr-primary);
    }
    nr-button[type="ghost"] button:hover:not(:disabled) {
      background-color: var(--nr-bg-hover);
      border-color: var(--nr-primary);
      color: #0353e9;
    }
    nr-button[type="ghost"] button:active:not(:disabled) {
      background-color: #e0e0e0;
      border-color: #002d9c;
      color: #002d9c;
    }
    nr-button[type="ghost"] button:disabled {
      background-color: transparent;
      border-color: var(--nr-disabled);
      color: var(--nr-disabled);
    }

    /* ======== Type: Danger ======== */
    nr-button[type="danger"] button {
      background-color: var(--nr-danger);
      border-color: var(--nr-danger);
      color: #fff;
    }
    nr-button[type="danger"] button:hover:not(:disabled) {
      background-color: #ba1b23;
      border-color: #ba1b23;
    }
    nr-button[type="danger"] button:active:not(:disabled) {
      background-color: #750e13;
      border-color: #750e13;
    }
    nr-button[type="danger"] button:disabled {
      background-color: var(--nr-disabled);
      border-color: var(--nr-disabled);
      color: var(--nr-text-secondary);
    }

    /* ======== Sizes ======== */
    nr-button[size="small"] button {
      height: 2rem;
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      min-width: 4.5rem;
      gap: 0.375rem;
    }
    nr-button[size="small"] button nr-icon {
      width: 0.875rem;
      height: 0.875rem;
      font-size: 0.875rem !important;
    }

    nr-button[size="medium"] button {
      height: 2.5rem;
      padding: 0.5rem 1rem;
      min-width: 5rem;
    }

    nr-button[size="large"] button {
      height: 3rem;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      min-width: 6rem;
    }
    nr-button[size="large"] button nr-icon {
      width: 1.25rem;
      height: 1.25rem;
      font-size: 1.25rem !important;
    }

    /* ======== Full width ======== */
    nr-button[full-width] {
      width: 100%;
    }
    nr-button[full-width] button {
      width: 100%;
    }

    /* ======== Loading ======== */
    nr-button[loading] button {
      cursor: not-allowed;
      opacity: 0.7;
    }

    /* ======== Shape: Round ======== */
    nr-button[shape="round"] button {
      border-radius: 9999px;
      padding: 0.5rem 1.25rem;
    }
    nr-button[shape="round"][size="small"] button {
      padding: 0.375rem 1rem;
    }
    nr-button[shape="round"][size="large"] button {
      padding: 0.75rem 1.5rem;
    }

    /* ======== Shape: Circle ======== */
    nr-button[shape="circle"] button {
      border-radius: 50%;
      min-width: auto;
      width: 2.5rem;
      height: 2.5rem;
      aspect-ratio: 1;
      padding: 0;
    }
    nr-button[shape="circle"][size="small"] button {
      width: 2rem;
      height: 2rem;
    }
    nr-button[shape="circle"][size="large"] button {
      width: 3rem;
      height: 3rem;
    }

    /* ======== Dashed ======== */
    nr-button button.button-dashed {
      border-style: dashed;
    }

    /* ======== Ripple ======== */
    nr-button .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: nr-ripple-animation 0.6s linear;
      pointer-events: none;
      z-index: 1;
    }

    @keyframes nr-ripple-animation {
      0% { transform: scale(0); opacity: 1; }
      70% { transform: scale(3); opacity: 0.5; }
      100% { transform: scale(4); opacity: 0; }
    }

    nr-button[type="primary"] .ripple { background: rgba(255, 255, 255, 0.4); }
    nr-button[type="secondary"] .ripple { background: rgba(255, 255, 255, 0.3); }
    nr-button[type="default"] .ripple { background: rgba(22, 22, 22, 0.1); }
    nr-button[type="ghost"] .ripple { background: rgba(15, 98, 254, 0.2); }
    nr-button[type="danger"] .ripple { background: rgba(255, 255, 255, 0.4); }
  }
`;

export const styles = buttonStyles;
