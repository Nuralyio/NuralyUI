import { css } from 'lit';

export const styles = css`
  @layer nuraly.components {
    nr-card {
      display: block;
      color: var(--nr-text);
      background-color: var(--nr-bg);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    nr-card .card {
      background-color: var(--nr-surface);
      border-radius: 4px;
      border: 1px solid var(--nr-border);
      overflow: hidden;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    nr-card .card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    nr-card .card__header {
      font-weight: 600;
      border-bottom: 1px solid var(--nr-border);
      padding: 1rem;
      font-size: 0.875rem;
      color: var(--nr-text);
      line-height: 1.5;
    }

    nr-card .card__content {
      padding: 1rem;
      color: var(--nr-text);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* Size variants */
    nr-card .card--small .card__header,
    nr-card .card--small .card__content {
      padding: 0.75rem;
      font-size: 0.75rem;
    }

    nr-card .card--large .card__header,
    nr-card .card--large .card__content {
      padding: 1.5rem;
      font-size: 1rem;
    }

    /* Focus */
    nr-card .card:focus-within {
      outline: 2px solid var(--nr-focus);
      outline-offset: 2px;
    }
  }
`;
