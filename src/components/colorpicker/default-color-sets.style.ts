import { css } from 'lit';

/**
 * Default Color Sets component styles
 * Using shared CSS variables from /src/shared/themes/
 */
const defaultColorSetsStyle = css`
  .default-color-sets-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .default-color-sets-container * {
    margin: 0.25rem;
  }
  
  .color-set-container {
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease-in-out;
  }
  
  .color-set-container:hover {
    box-shadow: 0 0 0 2px #7c3aed;
    opacity: 0.9;
  }
  
  .color-set-container:active {
    box-shadow: 0 0 0 2px rgba(15, 98, 254, 0.8);
    opacity: 1;
  }
`;

export const styles = defaultColorSetsStyle;
