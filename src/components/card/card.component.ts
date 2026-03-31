import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from './card.style.js';
import { CardSize } from './card.types.js';
import { classMap } from 'lit/directives/class-map.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';

/**
 * Card component for displaying content in a structured container
 *
 * @element nr-card
 * @slot content - Content to be displayed in the card body
 *
 * @example
 * ```html
 * <nr-card header="Card Title" size="medium">
 *   <div slot="content">Card content goes here</div>
 * </nr-card>
 * ```
 *
 * @csspart card - The root card wrapper div
 * @csspart header - The header div shown when the header property is set
 * @csspart content - The body content div wrapping the content slot
 */
@customElement('nr-card')
export class NrCardElement extends NuralyUIBaseMixin(LitElement) {
  static override styles = styles;
  static useShadowDom = true;

  /**
   * Header text displayed at the top of the card
   */
  @property({ type: String }) header = '';

  /**
   * Size variant of the card
   */
  @property({ type: String }) size = CardSize.Default;

  override render() {
    return html`
      <div
        part="card"
        class="card ${classMap({
          'card--small': this.size === CardSize.Small,
          'card--large': this.size === CardSize.Large
        })}"
      >
        ${this.header ? html`<div part="header" class="card__header">${this.header}</div>` : ''}
        <div part="content" class="card__content">
          <slot name="content"></slot>
        </div>
      </div>
    `;
  }
}
