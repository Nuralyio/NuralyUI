import { css } from 'lit';

/**
 * Container component styles
 * Using shared CSS variables from /src/shared/themes/
 */
export const styles = css`
  :host {
    display: block;
    box-sizing: border-box;
  }

  .nr-container {
    display: flex;
    box-sizing: border-box;
    min-height: inherit;

    /* Theme-aware */
    color: #161616;
    background: transparent;
  }

  /* Direction */
  .nr-container[data-direction="row"] {
    flex-direction: row;
  }

  .nr-container[data-direction="column"] {
    flex-direction: column;
  }

  /* Layout: Fluid (full width) - applies to both directions */
  .nr-container[data-layout="fluid"] {
    width: 100%;
    max-width: none;
  }

  /* Layout: Boxed (centered with max-width) */
  .nr-container[data-layout="boxed"] {
    margin-inline: auto;
  }

  /* Layout: Fixed */
  .nr-container[data-layout="fixed"] {
    margin-inline: auto;
  }

  /* Row direction with non-fluid layout should be fit-content */
  .nr-container[data-direction="row"][data-layout="boxed"],
  .nr-container[data-direction="row"][data-layout="fixed"] {
    width: fit-content;
  }

  /* Boxed/Fixed sizes */
  .nr-container[data-size="sm"] {
    max-width: 640px;
  }

  .nr-container[data-size="md"] {
    max-width: 768px;
  }

  .nr-container[data-size="lg"] {
    max-width: 1024px;
  }

  .nr-container[data-size="xl"] {
    max-width: 1280px;
  }

  .nr-container[data-size="full"] {
    max-width: 100%;
  }

  /* Padding presets */
  .nr-container[data-padding="none"] {
    padding: 0;
  }

  .nr-container[data-padding="sm"] {
    padding: 8px;
  }

  .nr-container[data-padding="md"] {
    padding: 16px;
  }

  .nr-container[data-padding="lg"] {
    padding: 24px;
  }

  /* Wrap */
  .nr-container[data-wrap="true"] {
    flex-wrap: wrap;
  }

  .nr-container[data-wrap="false"] {
    flex-wrap: nowrap;
  }

  /* Justify content */
  .nr-container[data-justify="flex-start"] {
    justify-content: flex-start;
  }

  .nr-container[data-justify="flex-end"] {
    justify-content: flex-end;
  }

  .nr-container[data-justify="center"] {
    justify-content: center;
  }

  .nr-container[data-justify="space-between"] {
    justify-content: space-between;
  }

  .nr-container[data-justify="space-around"] {
    justify-content: space-around;
  }

  .nr-container[data-justify="space-evenly"] {
    justify-content: space-evenly;
  }

  /* Align items */
  .nr-container[data-align="flex-start"] {
    align-items: flex-start;
  }

  .nr-container[data-align="flex-end"] {
    align-items: flex-end;
  }

  .nr-container[data-align="center"] {
    align-items: center;
  }

  .nr-container[data-align="baseline"] {
    align-items: baseline;
  }

  .nr-container[data-align="stretch"] {
    align-items: stretch;
  }
`;
