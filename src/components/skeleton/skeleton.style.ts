import { css } from 'lit';

export const styles = css`
  :host { display: block; }

  .skeleton {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .skeleton-header {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .skeleton-content { flex: 1; }

  /* Avatar */
  .skeleton-avatar {
    flex-shrink: 0;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
  }

  .skeleton-avatar--circle { border-radius: 50%; }
  .skeleton-avatar--square { border-radius: 4px; }
  .skeleton-avatar--small { width: 32px; height: 32px; }
  .skeleton-avatar--default { width: 40px; height: 40px; }
  .skeleton-avatar--large { width: 48px; height: 48px; }

  /* Title */
  .skeleton-title {
    height: 16px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    margin-bottom: 12px;
  }

  .skeleton-title--round { border-radius: 8px; }

  /* Paragraph */
  .skeleton-paragraph {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .skeleton-paragraph-line {
    height: 16px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
  }

  .skeleton-paragraph-line--round { border-radius: 8px; }

  /* Button */
  .skeleton-button {
    display: inline-block;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
  }

  .skeleton-button--block { display: block; width: 100%; }
  .skeleton-button--circle { border-radius: 50%; }
  .skeleton-button--round { border-radius: 16px; }
  .skeleton-button--square { border-radius: 4px; }
  .skeleton-button--small { width: 64px; height: 24px; }
  .skeleton-button--default { width: 80px; height: 32px; }
  .skeleton-button--large { width: 96px; height: 40px; }

  /* Input */
  .skeleton-input {
    display: block;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
  }

  .skeleton-input--small { height: 24px; }
  .skeleton-input--default { height: 32px; }
  .skeleton-input--large { height: 40px; }
  .skeleton-input--block { width: 100%; }

  /* Image */
  .skeleton-image {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    width: 100%;
    height: 200px;
  }

  .skeleton-image-icon {
    font-size: 48px;
    color: rgba(0, 0, 0, 0.15);
  }

  /* Active animation */
  @keyframes skeleton-loading {
    0% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
  }

  .skeleton--active .skeleton-avatar,
  .skeleton--active .skeleton-title,
  .skeleton--active .skeleton-paragraph-line,
  .skeleton--active .skeleton-button,
  .skeleton--active .skeleton-input,
  .skeleton--active .skeleton-image {
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.06) 25%,
      rgba(0, 0, 0, 0.15) 37%,
      rgba(0, 0, 0, 0.06) 63%
    );
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
  }

  .skeleton-wrapper { display: block; }
  .skeleton-wrapper--hidden { display: none; }
`;
