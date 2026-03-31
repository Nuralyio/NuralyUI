import { css } from 'lit';

const dropdownItemStyle = css`
    div {
        padding: 0;
        cursor: pointer;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        color: #161616;
        font-size: 0.875rem; /* Default value added */

    }
    nr-icon {
        display: flex;
    }
    :host(:not([disabled])) div:hover {
        background-color: #f4f4f4;
        margin-left: -1px;
    }
    :host([disabled]) div {
        background-color: #f4f4f4;
        cursor: not-allowed;
        color: #c6c6c6;
    }

    :host(:not([icon])) .option-label {
        padding-left: 1rem;
    }
    :host([icon]) .option-label {
        padding-left: 0.5rem;
    }
`;

export const styles = [dropdownItemStyle];