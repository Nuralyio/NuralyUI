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
      font-size: 13px;
      font-weight: 500;
      line-height: 1;
      padding: 6px 16px;
      border: 1px solid transparent;
      border-radius: 9999px;
      background-color: var(--nr-bg);
      color: var(--nr-text);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: none;
      gap: 6px;
    }

    nr-button button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
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
      cursor: inherit;
      pointer-events: none;
    }

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
      background-color: var(--nr-primary, #7c3aed);
      border-color: var(--nr-primary, #7c3aed);
      color: #fff;
      font-weight: 500;
    }
    nr-button[type="primary"] button nr-icon {
      color: #fff !important;
    }
    nr-button[type="primary"] button:hover:not(:disabled) {
      background-color: var(--nr-primary-hover, #6d28d9);
      border-color: var(--nr-primary-hover, #6d28d9);
    }
    nr-button[type="primary"] button:active:not(:disabled) {
      background-color: var(--nr-primary-hover, #6d28d9);
      filter: brightness(0.9);
    }
    nr-button[type="primary"] button:disabled {
      background-color: var(--nr-disabled);
      border-color: var(--nr-disabled);
      color: var(--nr-text-secondary);
      opacity: 0.5;
    }

    /* ======== Type: Secondary ======== */
    nr-button[type="secondary"] button {
      background-color: #0f1419;
      border-color: #0f1419;
      color: #fff;
      font-weight: 500;
    }
    nr-button[type="secondary"] button:hover:not(:disabled) {
      background-color: #272c30;
      border-color: #272c30;
    }
    nr-button[type="secondary"] button:active:not(:disabled) {
      background-color: #3a3f44;
      border-color: #3a3f44;
    }
    nr-button[type="secondary"] button:disabled {
      opacity: 0.5;
    }

    /* ======== Type: Default ======== */
    nr-button[type="default"] button {
      background-color: var(--nr-bg, #fff);
      border-color: var(--nr-border, #eff3f4);
      color: var(--nr-text-secondary, #536471);
      font-weight: 500;
    }
    nr-button[type="default"] button:hover:not(:disabled) {
      border-color: var(--nr-primary, #7c3aed);
      color: var(--nr-primary, #7c3aed);
    }
    nr-button[type="default"] button:active:not(:disabled) {
      background-color: var(--nr-bg-hover, #f7f9f9);
    }
    nr-button[type="default"] button:disabled {
      opacity: 0.5;
    }

    /* ======== Type: Ghost ======== */
    nr-button[type="ghost"] button {
      background-color: transparent;
      border-color: var(--nr-primary, #7c3aed);
      color: var(--nr-primary, #7c3aed);
      font-weight: 500;
    }
    nr-button[type="ghost"] button:hover:not(:disabled) {
      background-color: rgba(124, 58, 237, 0.1);
    }
    nr-button[type="ghost"] button:active:not(:disabled) {
      background-color: rgba(124, 58, 237, 0.15);
    }
    nr-button[type="ghost"] button:disabled {
      opacity: 0.5;
    }

    /* ======== Type: Danger ======== */
    nr-button[type="danger"] button {
      background-color: var(--nr-danger, #dc2626);
      border-color: var(--nr-danger, #dc2626);
      color: #fff;
      font-weight: 500;
    }
    nr-button[type="danger"] button:hover:not(:disabled) {
      filter: brightness(0.9);
    }
    nr-button[type="danger"] button:active:not(:disabled) {
      filter: brightness(0.8);
    }
    nr-button[type="danger"] button:disabled {
      opacity: 0.5;
    }

    /* ======== Sizes ======== */
    nr-button[size="small"] button {
      padding: 5px 14px;
      font-size: 13px;
      gap: 4px;
    }
    nr-button[size="small"] button nr-icon {
      width: 0.875rem;
      height: 0.875rem;
      font-size: 0.875rem !important;
    }

    nr-button[size="medium"] button {
      padding: 7px 18px;
      font-size: 14px;
    }

    nr-button[size="large"] button {
      padding: 0.875rem 2rem;
      font-size: 1.0625rem;
      font-weight: 500;
    }
    nr-button[size="large"] button nr-icon {
      width: 1.25rem;
      height: 1.25rem;
      font-size: 1.25rem !important;
    }

    /* ======== Full width (block) ======== */
    nr-button[full-width],
    nr-button[block] {
      width: 100%;
    }
    nr-button[full-width] button,
    nr-button[block] button {
      width: 100%;
    }

    /* ======== Loading ======== */
    nr-button[loading] button {
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* ======== Shape: Round (already default pill) ======== */
    nr-button[shape="round"] button {
      border-radius: 9999px;
    }

    /* ======== Shape: Circle ======== */
    nr-button[shape="circle"] button {
      border-radius: 50%;
      min-width: auto;
      width: 36px;
      height: 36px;
      padding: 0;
    }
    nr-button[shape="circle"][size="small"] button {
      width: 28px;
      height: 28px;
    }
    nr-button[shape="circle"][size="large"] button {
      width: 44px;
      height: 44px;
    }

    /* ======== Shape: Square (opt-in for non-pill) ======== */
    nr-button[shape="default"] button {
      border-radius: 8px;
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

    nr-button[type="primary"] .ripple { background: rgba(255, 255, 255, 0.3); }
    nr-button[type="secondary"] .ripple { background: rgba(255, 255, 255, 0.3); }
    nr-button[type="default"] .ripple { background: rgba(0, 0, 0, 0.06); }
    nr-button[type="ghost"] .ripple { background: rgba(124, 58, 237, 0.15); }
    nr-button[type="danger"] .ripple { background: rgba(255, 255, 255, 0.3); }
  }
`;

export const styles = buttonStyles;
