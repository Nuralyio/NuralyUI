import { css } from 'lit';

export const headerStyles = css`
  :host {
    display: block;
  }

  .nr-header {
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    height: 64px;
    line-height: 64px;
    background: #ffffff;
    color: #161616;
    border-bottom: 1px solid #e0e0e0;
    transition: all 0.2s;
  }
`;
