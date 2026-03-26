import { css } from 'lit';

export const contentStyles = css`
  @layer nuraly.components {
    nr-content {
      display: block;
      flex: auto;
      min-height: 0;
    }

    .nr-content {
      flex: auto;
      min-height: 0;
      background: var(--nuraly-layout-content-background);
      color: var(--nuraly-layout-content-text);
      transition: var(--nuraly-layout-transition);
    }
  }
`;
