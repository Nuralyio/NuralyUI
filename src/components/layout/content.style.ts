import { css } from 'lit';

export const contentStyles = css`
  :host {
    display: block;
    flex: auto;
    min-height: 0;
  }

  .nr-content {
    flex: auto;
    min-height: 0;
    background: #f4f4f4;
    color: #161616;
    transition: all 0.2s;
  }
`;
