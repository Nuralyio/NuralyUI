import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./label.style.js";
import { LabelSize, LabelVariant } from './label.types.js';
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';

/**
 * A flexible label component for form fields and descriptive text.
 *
 * @csspart label - The root native label element
 * @csspart required-asterisk - The asterisk span shown when required is true
 */
@customElement('nr-label')
export class HyTextLabel extends NuralyUIBaseMixin(LitElement) {
    static override styles = styles;
    static useShadowDom = true;

    @property({ reflect: true })
    size: LabelSize = 'medium';

    @property({ reflect: true })
    variant: LabelVariant = 'default';

    @property({ type: Boolean, reflect: true })
    required = false;

    @property({ type: Boolean, reflect: true })
    disabled = false;

    @property()
    for?: string;

    @property()
    value = '';

    override render() {
        return html`
            <label part="label" for=${this.for || ''}>
                <slot></slot>
                ${this.required ? html`<span part="required-asterisk" class="required-asterisk">*</span>` : ''}
            </label>
        `;
    }
}