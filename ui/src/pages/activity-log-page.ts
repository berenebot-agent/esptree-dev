import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { api } from '../api/client';

@customElement('esp-activity-log-page')
export class EspActivityLogPage extends LitElement {
  @state() private logs: string[] = [];
  @state() private error = '';
  @state() private loading = true;
  @state() private fullscreen = false;
  @state() private connected = false;
  private eventSource: EventSource | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.connect();
  }

  private connect(): void {
    this.disconnect();
    this.loading = true;
    this.error = '';
    this.logs = [];

    this.eventSource = api.activityLog(
      (line: string) => {
        this.logs = [line, ...this.logs];
        this.loading = false;
        this.connected = true;
        void this.requestUpdate();
      },
      () => {
        this.loading = false;
      },
      (_err: Event) => {
        this.loading = false;
        if (this.logs.length === 0) {
          this.error = 'Could not load activity log';
        }
      }
    );
  }

  private disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.connected = false;
    }
  }

  private clearLogs(): void {
    this.logs = [];
  }

  private downloadLog(): void {
    const content = this.logs.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activity.log';
    a.click();
    URL.revokeObjectURL(url);
  }

  private toggleFullscreen(): void {
    if (!this.fullscreen) {
      this.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  private handleFullscreenChange = (): void => {
    this.fullscreen = !!document.fullscreenElement;
  };

  firstUpdated(): void {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
  }

  disconnectedCallback(): void {
    this.disconnect();
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    super.disconnectedCallback();
  }

  private renderLine(line: string) {
    return html`<pre class="log-line">${line}</pre>`;
  }

  render() {
    return html`
      <div class="activity-page">
        <div class="page-head">
          <div class="page-heading">
            <span class="eyebrow">Diagnostics</span>
            <h1>Activity log</h1>
            <p>Live bridge, remote, and protobuf events. Newest events appear first.</p>
          </div>
          <div class="page-actions">
            <button class="btn" @click=${this.clearLogs}>Clear view</button>
            <button class="btn" @click=${this.downloadLog} ?disabled=${this.logs.length === 0}>Download</button>
            <button class="btn" @click=${this.toggleFullscreen}>${this.fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button>
          </div>
        </div>
        <section class="log-panel">
          <div class="log-head">
            <span class="log-title"><span class="live-dot ${this.connected ? 'on' : ''}" aria-hidden="true"></span>${this.connected ? 'Live stream' : 'Stream disconnected'}</span>
            <span class="log-count">${this.logs.length} ${this.logs.length === 1 ? 'event' : 'events'}</span>
          </div>
          <div class="log-body" aria-live="polite">
            ${this.error
              ? html`<div class="log-empty error"><strong>${this.error}</strong><span>Check the add-on connection, then reload this page.</span><button class="btn" @click=${() => this.connect()}>Retry</button></div>`
              : this.loading && this.logs.length === 0
              ? html`<div class="log-empty"><span class="spinner"></span><span>Opening the event stream…</span></div>`
              : this.logs.length === 0
              ? html`<div class="log-empty"><strong>No activity yet</strong><span>Bridge events will stream here as devices connect, update, and report state.</span></div>`
              : this.logs.map((line) => this.renderLine(line))}
          </div>
        </section>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; color: var(--ink); }
    * { box-sizing: border-box; }
    .activity-page { display: flex; flex-direction: column; gap: 16px; }
    .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
    .page-heading { display: flex; flex-direction: column; gap: 5px; }
    .eyebrow { color: var(--primary); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    h1 { margin: 0; font-size: 27px; line-height: 1.15; letter-spacing: -.035em; font-weight: 700; }
    .page-heading p { margin: 2px 0 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
    .page-actions { display: flex; gap: 7px; flex-shrink: 0; }
    .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 34px; padding: 0 11px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); color: var(--ink-2); font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .btn:hover { background: var(--surface-subtle); border-color: var(--faint); }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .btn:disabled { opacity: .5; cursor: default; }
    .log-panel { display: flex; flex-direction: column; min-height: 420px; max-height: calc(100vh - 250px); overflow: hidden; border: 1px solid #223b35; border-radius: var(--radius-lg); background: #101f1c; box-shadow: var(--shadow-sm); }
    .log-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,.08); background: #142a25; }
    .log-title { display: inline-flex; align-items: center; gap: 7px; color: #c5d5ce; font-size: 10px; font-weight: 650; }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #72867e; }
    .live-dot.on { background: #67c486; box-shadow: 0 0 0 3px rgba(103,196,134,.10); }
    .log-count { color: #738981; font-family: var(--font-mono); font-size: 9px; }
    .log-body { flex: 1; overflow: auto; padding: 10px 0 14px; }
    .log-line { margin: 0; padding: 2px 17px; color: #b9cdc4; font-family: var(--font-mono); font-size: 10px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
    .log-line:hover { background: rgba(255,255,255,.035); }
    .log-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; min-height: 320px; padding: 30px; text-align: center; color: #8fa89d; font-size: 11px; line-height: 1.5; }
    .log-empty strong { color: #d8e4de; font-size: 13px; font-weight: 650; }
    .log-empty.error strong { color: #ffc4c7; }
    .log-empty .btn { margin-top: 8px; border-color: rgba(255,255,255,.16); background: rgba(255,255,255,.06); color: #e2ece7; }
    .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.12); border-top-color: #d6b15c; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    :host(:fullscreen) { background: #101f1c; }
    :host(:fullscreen) .activity-page { height: 100vh; padding: 14px; background: #101f1c; }
    :host(:fullscreen) .page-head { display: none; }
    :host(:fullscreen) .log-panel { max-height: none; height: 100%; border-color: #314b43; }
    @media (max-width: 760px) {
      .page-head { align-items: flex-start; flex-direction: column; gap: 13px; }
      h1 { font-size: 24px; }
      .page-actions { width: 100%; }
      .page-actions .btn { flex: 1; padding: 0 7px; font-size: 10px; }
      .log-panel { max-height: calc(100vh - 330px); min-height: 340px; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; } }
  `;
}
