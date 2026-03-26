import { css } from 'lit';

export const layoutStyles = css`
  @layer nuraly.components {
    nr-layout {
      display: flex;
      flex: auto;
      flex-direction: column;
      min-height: 0;
      background: var(--nuraly-layout-background);
    }

    nr-layout[has-sider] {
      flex-direction: row;
    }

    .nr-layout {
      display: flex;
      flex: auto;
      flex-direction: inherit;
      min-height: 0;
      width: 100%;
    }
  }
`;
