import { css } from 'lit';

const dropdownMenuStyle = css`
  div {
    padding: 0;
    position: relative;
    cursor: pointer;
    background-color: #ffffff;
    display: flex;
    align-items: center;
  }
  nr-icon {
    display: flex;
  }
  #caret-icon {
    flex-grow: 1;
    justify-content: flex-end;
  }

  :host(:not([disabled])) div:hover {
    background-color: #f4f4f4;
  }
  :host([disabled]) div {
    cursor: not-allowed;
    background-color: #f4f4f4;
    color: #c6c6c6;
  }

  ::slotted(*) {
    z-index: 1000;
    top: 0;
    cursor: pointer;
  }
  :host([direction='left']) ::slotted(*) {
    right: calc(200px - 0px);
  }

  :host([direction='right']) ::slotted(*) {
    left: calc(200px - 0px);
  }

  :host(:not([icon])) .menu-label {
    padding-left: 1rem;
  }
  :host([icon]) .menu-label {
    padding-left: 0.5rem;
  }
`;

export const styles = [dropdownMenuStyle];
