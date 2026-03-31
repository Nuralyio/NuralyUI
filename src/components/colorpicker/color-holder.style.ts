import { css } from 'lit';

/**
 * Color Holder component styles
 * Using shared CSS variables from /src/shared/themes/
 */
const colorHolderStyles = css`
  :host {
    display: inline-block;
    cursor: pointer;
    
    /* Ensure clean state transitions */
    * {
      transition: all 0.15s ease;
    }
  }

  .color-holder-container {
    width: 30px;
    height: 25px;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    border-radius: 4px;
  }
  
  :host([size='small']) .color-holder-container {
    width: 20px;
    height: 15px;
  }
  
  :host([size='large']) .color-holder-container {
    width: 35px;
    height: 30px;
  }
  
  .color-holder-container--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  :host(:hover:not([disabled])) .color-holder-container {
    border-color: rgba(0, 0, 0, 0.4);
  }
`;

export const styles = colorHolderStyles;
