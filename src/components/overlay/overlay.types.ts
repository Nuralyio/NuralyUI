/**
 * @license
 * Copyright 2026 Nuraly, Laabidi Aymen
 * SPDX-License-Identifier: MIT
 */

/**
 * How much of the viewport the overlay takes.
 *
 * An overlay is a place to work, not a question to answer — the sizes are
 * proportions of the screen rather than the fixed dialog widths a modal uses.
 */
export const enum OverlaySize {
  /** Roomy panel, still clearly on top of the page behind it. */
  Default = 'default',
  /** Nearly the whole viewport, for a page's worth of content. */
  Large = 'large',
  /** Every pixel: no scrim showing, no rounded corners. */
  Full = 'full',
}

/** Which edge the overlay is anchored to. */
export const enum OverlayPlacement {
  /** Floating in the middle of the viewport. */
  Center = 'center',
  /** Flush to the right edge, full height — a working drawer. */
  Right = 'right',
  /** Flush to the left edge, full height. */
  Left = 'left',
}

export const EMPTY_STRING = '';
