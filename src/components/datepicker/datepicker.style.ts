import { css } from 'lit';
import { styleVariables } from './datepicker.style.variables.js';

/**
 * Datepicker component styles for the Hybrid UI Library
 * 
 * This file contains all the styling for the nr-datepicker component, including:
 * - Base datepicker styles with CSS custom properties for theming
 * - Multiple datepicker states (default, disabled, focused)
 * - Size variations (small, medium, large)
 * - Calendar styling and positioning
 * - Date selection states and range highlighting
 * - Focus, disabled, and validation states
 * - Dark theme support
 * 
 * The styling system uses CSS custom properties with fallbacks to allow
 * for both global and local customization of datepicker appearance.
 */

export const styles = css`
  ${styleVariables}

  :host {
    width: fit-content;
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Host attribute selectors for configuration */
  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  :host([range]) {
    --nuraly-datepicker-local-calendar-width: 600px;
  }

  /* Container styles */
  .datepicker-container {
    position: relative;
    display: block;
    width: 280px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    /* Allow calendar to overflow container without causing scroll */
    overflow: visible;
  }

  .datepicker-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Size variants */
  .datepicker-size-small {
    --nuraly-datepicker-local-day-size: 1.75rem;
    --nuraly-datepicker-local-font-size: 0.75rem;
  }

  .datepicker-size-medium {
    --nuraly-datepicker-local-day-size: 2rem;
    --nuraly-datepicker-local-font-size: 0.875rem;
  }

  .datepicker-size-large {
    --nuraly-datepicker-local-day-size: 2.5rem;
    --nuraly-datepicker-local-font-size: 1rem;
  }

  /* Calendar container */
  .calendar-container {
    position: fixed;
    z-index: 1000;
    user-select: none;
    padding: 0.75rem;
    width: 280px;
    height: auto;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    animation: calendar-slide-in 0.2s ease;
  }

  .calendar-range {
    width: calc(280px * 2);
  }

  /* Calendar header */
  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    height: 2.5rem;
    border-bottom: 1px solid #e0e0e0;
    background: transparent;
  }

  .year-month-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
  }

  .current-year-container {
    display: inline-flex;
    align-items: center;
    gap: calc(0.25rem / 2);
  }

  .year-icons-toggler {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* Calendar content */
  .calendar-content {
    padding: 0.25rem;
    padding-bottom: calc(0.25rem / 2);
  }

  /* Button customizations */
  nr-button {
    --nuraly-button-border-color: transparent;
    --nuraly-button-background-color: transparent;
    --nuraly-button-text-color: #161616;
    --nuraly-button-hover-background-color: #7c3aed;
    --nuraly-button-transition-duration: 0.2s;
  }

  .toggle-year-view,
  .toggle-month-view {
    --nuraly-button-font-weight: 600;
    --nuraly-button-font-size: 0.875rem;
    --nuraly-button-padding: 4px 20px 4px 8px;
    --nuraly-button-border-radius: 6px;
    --nuraly-button-border: 1px solid #e0e0e0;
    --nuraly-button-background-color: #ffffff;
    --nuraly-button-hover-border-color: #7c3aed;
    --nuraly-button-hover-background-color: #ffffff;
    --nuraly-button-active-background-color: #f4f4f4;
    --nuraly-button-transition: all 0.2s;
    position: relative;
    min-width: 80px;
  }

  .toggle-month-view::after,
  .toggle-year-view::after {
    content: '';
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 3px solid rgba(0, 0, 0, 0.45);
    transition: all 0.2s;
  }

  .toggle-month-view:hover::after,
  .toggle-year-view:hover::after {
    border-top-color: #7c3aed;
  }

  .next-year,
  .previous-year {
    --nuraly-button-width: 16px;
    --nuraly-button-height: 12px;
    --nuraly-button-padding: 0;
    --nuraly-button-min-width: auto;
    --nuraly-button-border-radius: 2px;
    --nuraly-button-text-color: rgba(0, 0, 0, 0.45);
    --nuraly-button-hover-text-color: rgba(0, 0, 0, 0.85);
    --nuraly-button-hover-background-color: rgba(0, 0, 0, 0.06);
  }

  .header-prev-button,
  .header-next-button {
    --nuraly-button-width: 24px;
    --nuraly-button-height: 24px;
    --nuraly-button-padding: 0;
    --nuraly-button-min-width: auto;
    --nuraly-button-border-radius: 2px;
    --nuraly-button-text-color: rgba(0, 0, 0, 0.45);
    --nuraly-button-hover-text-color: rgba(0, 0, 0, 0.85);
    --nuraly-button-hover-background-color: rgba(0, 0, 0, 0.06);
    --nuraly-button-transition: all 0.2s;
  }

  .header-prev-button:hover,
  .header-next-button:hover {
    --nuraly-button-background-color: rgba(0, 0, 0, 0.06);
  }

  /* Placement variants */
  .placement-top {
    animation: calendar-slide-down 0.2s ease;
  }

  .placement-bottom {
    animation: calendar-slide-up 0.2s ease;
  }

  /* Animations */
  @keyframes calendar-slide-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes calendar-slide-up {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes calendar-slide-down {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Legacy compatibility styles */
  .calendar-container-range {
    width: 600px;
  }

  /* Accessibility improvements */
  .calendar-container:focus-within {
    outline: 2px solid #7c3aed;
    outline-offset: 2px;
  }

  /* Focus management */
  [tabindex="-1"]:focus {
    outline: none;
  }

  /* Days grid layout */
  .days-grid {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .weekdays-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    margin-bottom: 0.25rem;
  }

  .weekday-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
    font-size: 12px;
    font-weight: 500;
    color: #525252;
    text-align: center;
  }

  .days-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
  }

  /* Day cell base styles */
  .day-cell {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 400;
    color: #161616;
    margin: 1px;
    position: relative;
  }

  .day-cell:hover:not(.disabled):not(.selected) {
    background-color: #7c3aed;
    scale: 1.05;
  }

  .day-cell.selected {
    background-color: #7c3aed !important;
    color: #ffffff !important;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .day-cell.today {
    border: 2px solid #7c3aed;
    font-weight: 600;
  }

  .day-cell.today.selected {
    border-color: #ffffff;
  }

  .day-cell.disabled {
    background-color: #f4f4f4;
    color: #c6c6c6;
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.4;
  }

  .day-cell.in-range {
    background-color: #f4f0fd;
    border-radius: 0;
  }

  .day-cell.in-range:first-of-type {
    border-radius: 6px 0 0 6px;
  }

  .day-cell.in-range:last-of-type {
    border-radius: 0 6px 6px 0;
  }

  .day-cell.in-range.selected {
    border-radius: 6px;
  }

  /* Error states */
  :host([state="error"]) .datepicker-container {
    --nuraly-datepicker-local-input-border-color: #dc2626;
  }

  :host([state="warning"]) .datepicker-container {
    --nuraly-datepicker-local-input-border-color: #f1c21b;
  }

  :host([state="success"]) .datepicker-container {
    --nuraly-datepicker-local-input-border-color: #198038;
  }

  /* Month/Year Dropdown Styles */
  .month-dropdown,
  .year-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    width: 120px;
    z-index: 1001;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    max-height: 200px;
    overflow-y: auto;
    animation: dropdown-slide-in 0.15s ease-out;
  }

  .year-dropdown {
    width: 80px;
  }

  .dropdown-content {
    padding: 4px 0;
  }

  .dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    color: #161616;
    font-size: 0.875rem;
    transition: all 0.2s;
    border-radius: 0;
  }

  .dropdown-item:hover {
    background-color: #f4f4f4;
  }

  .dropdown-item.selected {
    background-color: #7c3aed;
    color: #ffffff;
    font-weight: 600;
  }

  .dropdown-item.selected:hover {
    background-color: #7c3aed;
    opacity: 0.9;
  }

  /* Dropdown animation */
  @keyframes dropdown-slide-in {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Year/Month button container positioning */
  .current-year-container,
  .month-selector {
    position: relative;
    z-index: 1000;
  }

  .toggle-month-view,
  .toggle-year-view {
    position: relative;
    z-index: 1001;
  }

  /* Select component styling - Override the default 300px width */
  .month-select {
    --nuraly-select-width: 110px !important;
    width: 110px !important;
    max-width: 110px !important;
  }

  .year-select {
    --nuraly-select-width: 80px !important;
    width: 80px !important;
    max-width: 80px !important;
  }
`;
