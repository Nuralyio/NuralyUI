import { css } from 'lit';

export default css`
  :host {
    display: inline-block;
  }

  :host([block]) {
    display: block;
  }

  .image-container {
    position: relative;
  }

  img {
    display: block;
    max-width: 100%;
    border-radius: 4px;
  }

  .preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    animation: nr-image-fadeIn 0.3s ease;
  }

  .preview-modal img {
    max-width: 90%;
    max-height: 90%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    animation: nr-image-zoomIn 0.3s ease;
  }

  .preview-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: white;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s;
  }

  .preview-close:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  @keyframes nr-image-fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nr-image-zoomIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;
