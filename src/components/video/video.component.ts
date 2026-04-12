import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { NuralyUIBaseMixin } from '@nuralyui/common/mixins';
import styles from "./video.style.js";
import { VideoPreload } from "./video.types.js";

// hls.js module specifier — stored as a variable so bundlers (Vite/Rollup)
// cannot statically resolve it and fail if the package is not installed.
// eslint-disable-next-line prefer-const
let _hlsModule = 'hls.js';
const importHls = (): Promise<any> => import(/* @vite-ignore */ _hlsModule);

/**
 * Video player component with poster, autoplay, loop, fullscreen preview, and HLS streaming support.
 *
 * When the `src` is an HLS manifest (.m3u8), the component automatically uses hls.js for
 * adaptive bitrate streaming. Safari uses native HLS support. Falls back to a direct <source>
 * for non-HLS sources.
 *
 * @csspart container - The root wrapper div of the video player
 * @csspart video - The native video element
 * @csspart preview-button - The button that opens the fullscreen preview modal
 * @csspart preview-modal - The fullscreen preview overlay
 * @csspart preview-close - The close button inside the preview modal
 * @csspart error-message - The error state container shown when the video fails to load
 */
@customElement('nr-video')
export class NrVideoElement extends NuralyUIBaseMixin(LitElement) {
  static override styles = styles;
  static useShadowDom = true;

  @property({ type: String })
  src!: string;

  @property({ type: String })
  poster?: string;

  @property({ type: String })
  width = 'auto';

  @property({ type: String })
  height = 'auto';

  @property({ type: Boolean })
  autoplay = false;

  @property({ type: Boolean })
  loop = false;

  @property({ type: Boolean })
  muted = false;

  @property({ type: Boolean })
  controls = true;

  @property({ type: String })
  preload: VideoPreload = VideoPreload.Metadata;

  @property({ type: Boolean })
  previewable = false;

  @property({ type: Boolean, reflect: true })
  block = false;

  @state()
  private showPreview = false;

  @state()
  private hasError = false;

  private readonly defaultFallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI0MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTg4IDY5TDE2OCA4OU0xNjggNjlMMTg4IDg5IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+';

  private hlsInstance: any = null;
  private previewHlsInstance: any = null;

  private get isHLS(): boolean {
    return !!this.src && (this.src.endsWith('.m3u8') || this.src.includes('.m3u8?'));
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.destroyHls();
    this.destroyPreviewHls();
  }

  override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has('src') && this.src) {
      this.hasError = false;
      this.attachHlsIfNeeded();
    }
  }

  private destroyHls() {
    if (this.hlsInstance) {
      this.hlsInstance.destroy();
      this.hlsInstance = null;
    }
  }

  private destroyPreviewHls() {
    if (this.previewHlsInstance) {
      this.previewHlsInstance.destroy();
      this.previewHlsInstance = null;
    }
  }

  private async attachHlsIfNeeded() {
    const video = this.renderRoot?.querySelector('video[part="video"]') as HTMLVideoElement | null;
    if (!video || !this.isHLS) {
      this.destroyHls();
      return;
    }

    // Safari supports HLS natively
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.src;
      return;
    }

    // Dynamic import of hls.js — it's an optional peer dep
    try {
      const { default: Hls } = await importHls();
      if (!Hls.isSupported()) {
        this.handleError();
        return;
      }

      this.destroyHls();
      const hls = new Hls({ enableWorker: true });
      this.hlsInstance = hls;

      hls.loadSource(this.src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              this.handleError();
              break;
          }
        }
      });
    } catch {
      // hls.js not installed — fall back to direct source (will likely fail for HLS)
      video.src = this.src;
    }
  }

  private handleError() {
    this.hasError = true;
    this.dispatchEvent(new CustomEvent('nr-video-error', {
      bubbles: true,
      composed: true,
      detail: { error: `Error loading video: ${this.src}`, src: this.src }
    }));
  }

  private handlePlay() {
    this.dispatchEvent(new CustomEvent('nr-video-play', {
      bubbles: true,
      composed: true,
      detail: { src: this.src }
    }));
  }

  private handlePause() {
    this.dispatchEvent(new CustomEvent('nr-video-pause', {
      bubbles: true,
      composed: true,
      detail: { src: this.src }
    }));
  }

  private handleEnded() {
    this.dispatchEvent(new CustomEvent('nr-video-ended', {
      bubbles: true,
      composed: true,
      detail: { src: this.src }
    }));
  }

  private showPreviewModal() {
    if (this.previewable && !this.hasError) {
      this.showPreview = true;
      this.dispatchEvent(new CustomEvent('nr-video-preview-open', {
        bubbles: true,
        composed: true,
        detail: { src: this.src }
      }));
      // Attach HLS to preview video after render
      this.updateComplete.then(() => this.attachPreviewHls());
    }
  }

  private closePreviewModal() {
    this.showPreview = false;
    this.destroyPreviewHls();
    this.dispatchEvent(new CustomEvent('nr-video-preview-close', {
      bubbles: true,
      composed: true,
      detail: { src: this.src }
    }));
  }

  private async attachPreviewHls() {
    const video = this.renderRoot?.querySelector('video[part="preview-video"]') as HTMLVideoElement | null;
    if (!video || !this.isHLS) return;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.src;
      return;
    }
    try {
      const { default: Hls } = await importHls();
      if (!Hls.isSupported()) return;
      this.destroyPreviewHls();
      const hls = new Hls({ enableWorker: true });
      this.previewHlsInstance = hls;
      hls.loadSource(this.src);
      hls.attachMedia(video);
    } catch {
      video.src = this.src;
    }
  }

  override firstUpdated() {
    if (this.src) {
      this.attachHlsIfNeeded();
    }
  }

  override render() {
    const containerClasses = {
      'video-container': true,
      'video--error': this.hasError
    };

    const videoStyles: Record<string, string> = {
      width: typeof this.width === 'number' ? `${this.width}px` : this.width,
      height: typeof this.height === 'number' ? `${this.height}px` : this.height,
    };

    if (this.hasError) {
      return html`
        <div part="container" class=${classMap(containerClasses)}>
          <div part="error-message" class="error-message">
            <img class="error-icon" src=${this.defaultFallback} alt="Video error" />
            <p>Unable to load video</p>
          </div>
        </div>
      `;
    }

    return html`
      <div part="container" class=${classMap(containerClasses)}>
        <video
          part="video"
          style=${styleMap(videoStyles)}
          ?autoplay=${this.autoplay}
          ?loop=${this.loop}
          ?muted=${this.muted}
          ?controls=${this.controls}
          preload=${this.preload}
          poster=${this.poster || ''}
          @error=${this.handleError}
          @play=${this.handlePlay}
          @pause=${this.handlePause}
          @ended=${this.handleEnded}
        >
          ${!this.isHLS ? html`<source src=${this.src} />` : ''}
          Your browser does not support the video tag.
        </video>
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
          <div part="preview-modal" class="preview-modal" @click=${this.closePreviewModal}>
            <button part="preview-close" class="preview-close" @click=${this.closePreviewModal} aria-label="Close preview">×</button>
            <video
              part="preview-video"
              ?autoplay=${true}
              ?loop=${this.loop}
              ?muted=${this.muted}
              controls
              poster=${this.poster || ''}
            >
              ${!this.isHLS ? html`<source src=${this.src} />` : ''}
            </video>
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nr-video': NrVideoElement;
  }
}
