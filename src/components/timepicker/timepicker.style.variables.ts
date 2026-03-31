import { css } from 'lit';

export const styleVariables = css`
  :host {
    /* ========================================
     * TIMEPICKER THEME-AWARE VARIABLES
     * Uses CSS custom properties from theme files
     * ======================================== */

    /* Base timepicker styling - uses theme variables with fallbacks */
    --nuraly-timepicker-local-background-color: #ffffff;
    --nuraly-timepicker-local-text-color: rgba(0, 0, 0, 0.88);
    --nuraly-timepicker-local-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
    --nuraly-timepicker-local-font-size: 14px;

    /* Timepicker borders - theme-aware */
    --nuraly-timepicker-local-border-color: #d9d9d9;
    --nuraly-timepicker-local-border-width: 1px;
    --nuraly-timepicker-local-border-radius: 6px;
    --nuraly-timepicker-local-border-radius-sm: calc(6px * 0.5);

    /* Primary and selection colors - theme-aware */
    --nuraly-timepicker-local-primary-color: #1890ff;
    --nuraly-timepicker-local-focus-color: #1890ff;
    --nuraly-timepicker-local-border-color-hover: #1890ff;
    --nuraly-timepicker-local-selected-color: #1890ff;
    --nuraly-timepicker-local-selected-text-color: #ffffff;
    --nuraly-timepicker-local-hover-color: #f5f5f5;
    --nuraly-timepicker-local-clock-hand-color: #1890ff;

    /* Control item states - theme-aware */
    --nuraly-timepicker-local-control-item-bg-hover: #f5f5f5;
    --nuraly-timepicker-local-control-item-bg-active: #e6f7ff;

    /* Text colors - theme-aware */
    --nuraly-timepicker-local-text-color-secondary: rgba(0, 0, 0, 0.45);
    --nuraly-timepicker-local-text-color-disabled: rgba(0, 0, 0, 0.25);

    /* Disabled states - theme-aware */
    --nuraly-timepicker-local-disabled-color: #f5f5f5;
    --nuraly-timepicker-local-disabled-bg: #f5f5f5;
    --nuraly-timepicker-local-disabled-text-color: rgba(0, 0, 0, 0.25);
    --nuraly-timepicker-local-disabled-opacity: 1;

    /* Input field colors - theme-aware */
    --nuraly-timepicker-local-input-background: #ffffff;
    --nuraly-timepicker-local-input-border-color: #d9d9d9;
    --nuraly-timepicker-local-input-focus-border-color: #1890ff;
    --nuraly-timepicker-local-input-text-color: rgba(0, 0, 0, 0.88);
    --nuraly-timepicker-local-input-placeholder-color: rgba(0, 0, 0, 0.25);

    /* Dropdown and clock colors - theme-aware */
    --nuraly-timepicker-local-dropdown-background: #ffffff;
    --nuraly-timepicker-local-clock-background: #ffffff;
    --nuraly-timepicker-local-clock-text-color: rgba(0, 0, 0, 0.88);
    --nuraly-timepicker-local-clock-face-color: rgba(0, 0, 0, 0.45);
    --nuraly-timepicker-local-clock-border-color: #f0f0f0;

    /* Item selection colors - theme-aware */
    --nuraly-timepicker-local-item-hover-color: #f5f5f5;
    --nuraly-timepicker-local-item-active-color: #e6f7ff;
    --nuraly-timepicker-local-item-selected-color: #1890ff;
    --nuraly-timepicker-local-item-selected-text-color: #ffffff;

    /* Error/warning/success colors - theme-aware */
    --nuraly-timepicker-local-error-color: #ff4d4f;
    --nuraly-timepicker-local-warning-color: #faad14;
    --nuraly-timepicker-local-success-color: #52c41a;

    /* Layout and sizing - theme-aware */
    --nuraly-timepicker-local-width: 120px;
    --nuraly-timepicker-local-height: 32px;
    --nuraly-timepicker-local-dropdown-width: 180px;
    --nuraly-timepicker-local-clock-size: 200px;

    /* Typography - theme-aware */
    --nuraly-timepicker-local-font-weight: 400;
    --nuraly-timepicker-local-line-height: 1.5715;
    --nuraly-timepicker-local-clock-font-size: 14px;

    /* Spacing - theme-aware */
    --nuraly-timepicker-local-gap: 4px;
    --nuraly-timepicker-local-dropdown-padding: 8px;
    --nuraly-timepicker-local-input-padding: 4px 11px;
    --nuraly-timepicker-local-padding: 4px 11px;

    /* Borders - theme-aware */
    --nuraly-timepicker-local-input-border-width: 1px;
    --nuraly-timepicker-local-focus-border-width: 2px;

    /* Shadows - theme-aware */
    --nuraly-timepicker-local-shadow-color: rgba(0, 0, 0, 0.15);
    --nuraly-timepicker-local-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    --nuraly-timepicker-local-input-focus-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);

    /* States - theme-aware */
    --nuraly-timepicker-local-hover-opacity: 1;

    /* Animation and transitions - theme-aware */
    --nuraly-timepicker-local-transition-duration: 0.2s;
    --nuraly-timepicker-local-transition-timing: ease-in-out;

    /* Z-index - theme-aware */
    --nuraly-timepicker-local-dropdown-z-index: 1050;

    /* Icon sizes - theme-aware */
    --nuraly-timepicker-local-icon-size: 14px;

    /* Size variants - theme-aware */
    --nuraly-timepicker-local-small-font-size: 12px;
    --nuraly-timepicker-local-small-padding: 0px 7px;
    --nuraly-timepicker-local-small-height: 24px;

    --nuraly-timepicker-local-medium-font-size: 14px;
    --nuraly-timepicker-local-medium-padding: 4px 11px;
    --nuraly-timepicker-local-medium-height: 32px;

    --nuraly-timepicker-local-large-font-size: 16px;
    --nuraly-timepicker-local-large-padding: 6px 11px;
    --nuraly-timepicker-local-large-height: 40px;
  }
`;
