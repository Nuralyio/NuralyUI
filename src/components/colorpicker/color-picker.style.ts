import { css } from 'lit';

/**
 * Color Picker component styles for the Hybrid UI Library
 * Using shared CSS variables from /src/shared/themes/
 * 
 * This file contains all the styling for the nr-colorpicker component with
 * clean CSS variable usage without local fallbacks and proper theme switching support.
 */
export default css`
  :host {
    display: inline-block;
    vertical-align: middle;
    
    /* Force CSS custom property inheritance to ensure theme switching works properly */
    color: #161616;
    background-color: #ffffff;
    
    /* Ensure clean state transitions when theme changes */
    * {
      transition: all 0.15s ease;
    }
  }

  /* Force re-evaluation of theme-dependent properties on theme change */
  :host([data-theme]) {
    color: inherit;
    background-color: inherit;
  }

  .color-picker-container {
    display: inline-flex;
    flex-direction: column;
  }
  
  hex-color-picker {
    width: 100%;
  }
  
  .dropdown-container {
    display: none;
  }
  
  hex-color-picker::part(saturation) {
    border-radius: 0px;
  }
  
  hex-color-picker::part(hue) {
    border-radius: 0px;
  }
  
  hex-color-picker::part(saturation-pointer),
  hex-color-picker::part(hue-pointer) {
    cursor: pointer;
  }
  
  .color-holder {
    cursor: pointer;
  }
  
  :host([disabled]) .color-holder {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :host([show]) .dropdown-container {
    display: block;
    position: fixed;
    width: 180px;
    z-index: 1000;
    padding: 0.5rem;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s ease-in-out,
                visibility 0.15s ease-in-out;
  }

  :host([show]) .dropdown-container.positioned {
    opacity: 1;
    visibility: visible;
  }
`;
