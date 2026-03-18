import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    nr-skeleton { display: block; }

    nr-skeleton .skeleton {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    nr-skeleton .skeleton-header {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    nr-skeleton .skeleton-content { flex: 1; }

    /* Avatar */
    nr-skeleton .skeleton-avatar {
      flex-shrink: 0;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 4px;
    }

    nr-skeleton .skeleton-avatar--circle { border-radius: 50%; }
    nr-skeleton .skeleton-avatar--square { border-radius: 4px; }
    nr-skeleton .skeleton-avatar--small { width: 32px; height: 32px; }
    nr-skeleton .skeleton-avatar--default { width: 40px; height: 40px; }
    nr-skeleton .skeleton-avatar--large { width: 48px; height: 48px; }

    /* Title */
    nr-skeleton .skeleton-title {
      height: 16px;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      margin-bottom: 12px;
    }

    nr-skeleton .skeleton-title--round { border-radius: 8px; }

    /* Paragraph */
    nr-skeleton .skeleton-paragraph {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    nr-skeleton .skeleton-paragraph-line {
      height: 16px;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 4px;
    }

    nr-skeleton .skeleton-paragraph-line--round { border-radius: 8px; }

    /* Button */
    nr-skeleton .skeleton-button {
      display: inline-block;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 4px;
    }

    nr-skeleton .skeleton-button--block { display: block; width: 100%; }
    nr-skeleton .skeleton-button--circle { border-radius: 50%; }
    nr-skeleton .skeleton-button--round { border-radius: 16px; }
    nr-skeleton .skeleton-button--square { border-radius: 4px; }
    nr-skeleton .skeleton-button--small { width: 64px; height: 24px; }
    nr-skeleton .skeleton-button--default { width: 80px; height: 32px; }
    nr-skeleton .skeleton-button--large { width: 96px; height: 40px; }

    /* Input */
    nr-skeleton .skeleton-input {
      display: block;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 4px;
    }

    nr-skeleton .skeleton-input--small { height: 24px; }
    nr-skeleton .skeleton-input--default { height: 32px; }
    nr-skeleton .skeleton-input--large { height: 40px; }
    nr-skeleton .skeleton-input--block { width: 100%; }

    /* Image */
    nr-skeleton .skeleton-image {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      width: 100%;
      height: 200px;
    }

    nr-skeleton .skeleton-image-icon {
      font-size: 48px;
      color: rgba(0, 0, 0, 0.15);
    }

    /* Active animation */
    @keyframes skeleton-loading {
      0% { background-position: 100% 50%; }
      100% { background-position: 0 50%; }
    }

    nr-skeleton .skeleton--active .skeleton-avatar,
    nr-skeleton .skeleton--active .skeleton-title,
    nr-skeleton .skeleton--active .skeleton-paragraph-line,
    nr-skeleton .skeleton--active .skeleton-button,
    nr-skeleton .skeleton--active .skeleton-input,
    nr-skeleton .skeleton--active .skeleton-image {
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.06) 25%,
        rgba(0, 0, 0, 0.15) 37%,
        rgba(0, 0, 0, 0.06) 63%
      );
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease infinite;
    }

    nr-skeleton .skeleton-wrapper { display: block; }
    nr-skeleton .skeleton-wrapper--hidden { display: none; }
  }
`;
