import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    color: var(--nr-text);
    background-color: var(--nr-bg);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .card {
    background-color: var(--nr-surface);
    border-radius: 4px;
    border: 1px solid var(--nr-border);
    overflow: hidden;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .card__header {
    font-weight: 600;
    border-bottom: 1px solid var(--nr-border);
    padding: 1rem;
    font-size: 0.875rem;
    color: var(--nr-text);
    line-height: 1.5;
  }

  .card__content {
    padding: 1rem;
    color: var(--nr-text);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* Size variants */
  .card--small .card__header,
  .card--small .card__content {
    padding: 0.75rem;
    font-size: 0.75rem;
  }

  .card--large .card__header,
  .card--large .card__content {
    padding: 1.5rem;
    font-size: 1rem;
  }

  /* Focus */
  .card:focus-within {
    outline: 2px solid var(--nr-focus);
    outline-offset: 2px;
  }
`;
