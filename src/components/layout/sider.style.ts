import { css } from 'lit';

export const siderStyles = css`
  :host {
    display: block;
    position: relative;
  }

  .nr-sider {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: #161616;
    color: #ffffff;
    border-right: 1px solid #e0e0e0;
    transition: all 0.2s;
  }

  :host([theme='light']) .nr-sider {
    background: #ffffff;
    color: #161616;
    border-right: 1px solid #e0e0e0;
  }

  .nr-sider-children {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  .nr-sider-trigger {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1f1f1f;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    border-top: 1px solid #e0e0e0;
    border-radius: 0;
  }

  :host([theme='light']) .nr-sider-trigger {
    background: #f4f4f4;
    color: #161616;
    border-top: 1px solid #e0e0e0;
  }

  .nr-sider-trigger:hover {
    background: #333333;
  }

  :host([theme='light']) .nr-sider-trigger:hover {
    background: #e8e8e8;
  }

  .nr-sider-zero-width-trigger {
    position: absolute;
    top: 64px;
    right: calc(-1 * 36px);
    width: 36px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1f1f1f;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 0 6px 6px 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 1;
  }

  :host([theme='light']) .nr-sider-zero-width-trigger {
    background: #1f1f1f;
    color: #ffffff;
  }

  .nr-sider-zero-width-trigger:hover {
    background: #333333;
  }

  .trigger-icon {
    font-size: 16px;
    line-height: 1;
  }

  .nr-sider-collapsed {
    overflow: hidden;
  }

  .nr-sider-zero-width {
    width: 0 !important;
    min-width: 0 !important;
    flex: 0 0 0 !important;
  }
`;
