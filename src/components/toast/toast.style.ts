/**
 * @license
 * Copyright 2023 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

import { css } from 'lit';

/**
 * Toast component styles for the Hybrid UI Library
 * Using shared CSS variables from /src/shared/themes/
 * 
 * This file contains all the styling for the nr-toast component with
 * clean CSS variable usage without local fallbacks and proper theme switching support.
 */
export const styles = css`
  :host {
    display: block;
    position: fixed;
    z-index: 1200;
    pointer-events: none;
    
    /* Force CSS custom property inheritance to ensure theme switching works properly */
    color: #161616;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Container positioning */
  :host([position="top-right"]) {
    top: 1rem;
    right: 1rem;
  }

  :host([position="top-left"]) {
    top: 1rem;
    left: 1rem;
  }

  :host([position="top-center"]) {
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  :host([position="bottom-right"]) {
    bottom: 1rem;
    right: 1rem;
  }

  :host([position="bottom-left"]) {
    bottom: 1rem;
    left: 1rem;
  }

  :host([position="bottom-center"]) {
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .toast-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 280px;
    max-width: 480px;
  }

  .toast {
    display: flex;
    align-items: start;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: #ffffff;
    color: #161616;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    pointer-events: auto;
    cursor: default;
    transition: all 0.15s ease;
    position: relative;
    overflow: hidden;
  }

  .toast:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  /* Toast type variants */
  .toast--default {
    background-color: #ffffff;
    border-color: #e0e0e0;
    color: #161616;
  }

  .toast--success {
    background-color: #defbe6;
    border-color: #198038;
    color: #0e6027;
  }

  .toast--error {
    background-color: #fff1f1;
    border-color: #dc2626;
    color: #a61a1a;
  }

  .toast--warning {
    background-color: #fdf4d3;
    border-color: #f1c21b;
    color: #75490a;
  }

  .toast--info {
    background-color: #edf5ff;
    border-color: #0043ce;
    color: #003087;
  }

  /* Toast icon */
  .toast__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.125rem; /* Slight adjustment for better visual alignment */
  }

  .toast__icon nr-icon {
    color: inherit;
  }

  /* Toast content */
  .toast__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
  }

  .toast__text {
    font-size: 0.875rem;
    line-height: 1.5;
    word-break: break-word;
  }

  /* Toast button */
  .toast__button {
    display: flex;
    align-items: center;
    margin-top: 0.25rem;
  }

  .toast__button nr-button {
    flex-shrink: 0;
  }

  /* Close button */
  .toast__close {
    flex-shrink: 0;
    min-width: 1.5rem;
    min-height: 1.5rem;
    padding: 0;
    border: none;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.15s ease;
    opacity: 0.6;
  }

  .toast__close:hover {
    opacity: 1;
    background-color: rgba(0,0,0,0.08);
  }

  .toast__close:focus {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
  }

  .toast__close nr-icon {
    color: inherit;
  }

  /* Animations */
  @keyframes toast-fade-in {
    from {
      opacity: 0;
      transform: translateY(-1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes toast-fade-out {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-1rem);
    }
  }

  @keyframes toast-slide-in-right {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes toast-slide-out-right {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  @keyframes toast-slide-in-left {
    from {
      opacity: 0;
      transform: translateX(-100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes toast-slide-out-left {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-100%);
    }
  }

  @keyframes toast-bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes toast-bounce-out {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(0.95);
    }
    50% {
      opacity: 1;
      transform: scale(1.1);
    }
    100% {
      opacity: 0;
      transform: scale(0.3);
    }
  }

  /* Animation classes */
  .toast--fade-in {
    animation: toast-fade-in 0.3s ease;
  }

  .toast--fade-out {
    animation: toast-fade-out 0.3s ease;
  }

  .toast--slide-in {
    animation: toast-slide-in-right 0.3s ease;
  }

  .toast--slide-out {
    animation: toast-slide-out-right 0.3s ease;
  }

  .toast--bounce-in {
    animation: toast-bounce-in 0.3s ease;
  }

  .toast--bounce-out {
    animation: toast-bounce-out 0.3s ease;
  }

  /* Position-specific slide animations */
  :host([position="top-left"]) .toast--slide-in,
  :host([position="bottom-left"]) .toast--slide-in {
    animation: toast-slide-in-left 0.3s ease;
  }

  :host([position="top-left"]) .toast--slide-out,
  :host([position="bottom-left"]) .toast--slide-out {
    animation: toast-slide-out-left 0.3s ease;
  }

  /* Progress bar for duration indicator */
  .toast__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background-color: currentColor;
    opacity: 0.4;
    transition: width linear;
  }
`;
