import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import styles from "./document.style.js";
import { DocumentType } from "./document.types.js";

/**
 * Document viewer component for embedding PDFs and other documents via iframe.
 *
 * @csspart container - The root wrapper div of the document viewer
 * @csspart iframe - The native iframe element rendering the document
 * @csspart preview-button - The button that opens the fullscreen preview modal
 * @csspart preview-modal - The fullscreen preview overlay
 * @csspart preview-close - The close button inside the preview modal
 * @csspart error-message - The error state container shown when the document fails to load
 */
@customElement('nr-document')
export class NrDocumentElement extends NuralyUIBaseMixin(LitElement) {
  static override styles = styles;
  static useShadowDom = true;

  @property({ type: String })
  src!: string;

  @property({ type: String })
  type: DocumentType = DocumentType.PDF;

  @property({ type: String })
  width = 'auto';

  @property({ type: String })
  height = '500px';

  @property({ type: Boolean })
  previewable = false;

  @property({ type: Boolean, reflect: true })
  block = false;

  @state()
  private showPreview = false;

  @state()
  private hasError = false;

  private readonly defaultFallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNFRkYxRjMiLz48cGF0aCBkPSJNNTkuNCA2Mi44VjgwLjRINDguMlY0MS42SDYzLjRDNjcuMSA0MS42IDcwLjEgNDIuNiA3Mi40IDQ0LjdDNzQuNyA0Ni44IDc1LjggNDkuNiA3NS44IDUzQzc1LjggNTYuNSA3NC43IDU5LjIgNzIuNCA2MS4zQzcwLjIgNjMuNCA2Ny4yIDY0LjQgNjMuNCA2NC40SDU5LjRWNjIuOFpNNTkuNCA1NC42SDYzLjRDNjUgNTQuNiA2Ni4zIDU0LjEgNjcuMiA1M0M2OC4xIDUxLjkgNjguNiA1MC42IDY4LjYgNDlDNjguNiA0Ny41IDY4LjEgNDYuMiA2Ny4yIDQ1LjFDNjYuMyA0NCA2NSA0My40IDYzLjQgNDMuNEg1OS40VjU0LjZaIiBmaWxsPSIjNjg3Nzg3Ii8+PC9zdmc+';

  private handleError() {
    this.hasError = true;
    this.dispatchEvent(new CustomEvent('nr-document-error', {
      bubbles: true,
      composed: true,
      detail: { error: `Error loading document: ${this.src}`, src: this.src, type: this.type }
    }));
  }

  private handleLoad() {
    this.dispatchEvent(new CustomEvent('nr-document-load', {
      bubbles: true,
      composed: true,
      detail: { src: this.src, type: this.type }
    }));
  }

  private showPreviewModal() {
    if (this.previewable && !this.hasError) {
      this.showPreview = true;
      this.dispatchEvent(new CustomEvent('nr-document-preview-open', {
        bubbles: true,
        composed: true,
        detail: { src: this.src, type: this.type }
      }));
    }
  }

  private closePreviewModal() {
    this.showPreview = false;
    this.dispatchEvent(new CustomEvent('nr-document-preview-close', {
      bubbles: true,
      composed: true,
      detail: { src: this.src, type: this.type }
    }));
  }

  override render() {
    const containerClasses = {
      'document-container': true,
      'document--error': this.hasError
    };

    const containerStyles: Record<string, string> = {
      width: typeof this.width === 'number' ? `${this.width}px` : this.width,
      height: typeof this.height === 'number' ? `${this.height}px` : this.height,
    };

    if (this.hasError) {
      return html`
        <div part="container" class=${classMap(containerClasses)} style=${styleMap(containerStyles)}>
          <div part="error-message" class="error-message">
            <img class="error-icon" src=${this.defaultFallback} alt="Document error" />
            <p>Unable to load document</p>
          </div>
        </div>
      `;
    }

    return html`
      <div part="container" class=${classMap(containerClasses)} style=${styleMap(containerStyles)}>
        <iframe
          part="iframe"
          class="document-iframe"
          src=${this.src}
          @error=${this.handleError}
          @load=${this.handleLoad}
          title="Document viewer"
        ></iframe>
        ${this.previewable ? html`
          <button part="preview-button" class="preview-button" @click=${this.showPreviewModal}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v3a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v3a.5.5 0 0 0 1 0V6z"/>
              <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zM1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2z"/>
            </svg>
            Fullscreen
          </button>
        ` : ''}
        ${this.showPreview ? html`
          <div part="preview-modal" class="preview-modal">
            <div class="preview-header">
              <button part="preview-close" class="preview-close" @click=${this.closePreviewModal} aria-label="Close preview">×</button>
            </div>
            <iframe src=${this.src} title="Document viewer fullscreen"></iframe>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-document': NrDocumentElement;
  }
}
