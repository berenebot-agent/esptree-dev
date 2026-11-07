import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { api } from '../api/client';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';

type Level = 'all' | 'warn' | 'error';

function levelOf(line: string): 'error' | 'warn' | 'info' | 'debug' {
  if (/\b(ERROR|CRITICAL|FATAL)\b/.test(line)) return 'error';
  if (/\bWARN(ING)?\b/.test(line)) return 'warn';
  if (/\bDEBUG\b/.test(line)) return 'debug';
  return 'info';
}

@customElement('esp-activity-log-page')
export class EspActivityLogPage extends LitElement {
  @state() private logs: string[] = [];
  @state() private error = '';
  @state() private loading = true;
  @state() private fullscreen = false;
  @state() private connected = false;
  @state() private query = '';
  @state() private level: Level = 'all';
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
    return html`<pre class="log-line ${levelOf(line)}">${line}</pre>`;
  }

  render() {
    const q = this.query.trim().toLowerCase();
    const shown = this.logs.filter((line) => {
      const lvl = levelOf(line);
      if (this.level === 'error' && lvl !== 'error') return false;
      if (this.level === 'warn' && lvl !== 'warn' && lvl !== 'error') return false;
      return !q || line.toLowerCase().includes(q);
    });
    const filtered = shown.length !== this.logs.length;
    return html`
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Activity</h1>
            <p class="sub">Live events from the bridge, remotes and the Home Assistant integration. Newest first.</p>
          </div>
          <div class="page-actions">
            <button class="btn" @click=${this.downloadLog} ?disabled=${this.logs.length === 0}>${icon('download')}Download</button>
            <button class="btn icon" aria-label=${this.fullscreen ? 'Exit full screen' : 'Full screen'} title=${this.fullscreen ? 'Exit full screen' : 'Full screen'} @click=${this.toggleFullscreen}>${icon('fullscreen')}</button>
          </div>
        </div>
        <section class="card log-panel">
          <div class="filters">
            <span class="state"><span class="dot ${this.connected ? 'ok' : ''}"></span>${this.connected ? 'Live' : this.loading ? 'Connecting…' : 'Disconnected'}</span>
            <label class="search">
              ${icon('search')}
              <input type="search" aria-label="Filter events" placeholder="Filter events" .value=${this.query} @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; }} />
            </label>
            <div class="segmented" role="group" aria-label="Level">
              ${(['all', 'warn', 'error'] as const).map((v) => html`<button aria-pressed=${this.level === v ? 'true' : 'false'} @click=${() => { this.level = v; }}>${v === 'all' ? 'All' : v === 'warn' ? 'Warnings' : 'Errors'}</button>`)}
            </div>
            <span class="count">${filtered ? `${shown.length} of ${this.logs.length}` : `${this.logs.length} events`}</span>
            <button class="btn sm text" @click=${this.clearLogs} ?disabled=${this.logs.length === 0}>Clear</button>
          </div>
          <div class="log-body" aria-live="polite">
            ${this.error
              ? html`<div class="log-empty"><strong>${this.error}</strong><span>Check that the add-on is running, then retry.</span><button class="btn sm" @click=${() => this.connect()}>Retry</button></div>`
              : this.loading && this.logs.length === 0
              ? html`<div class="log-empty"><span class="spinner"></span><span>Opening the event stream…</span></div>`
              : this.logs.length === 0
              ? html`<div class="log-empty"><strong>No activity yet</strong><span>Events stream in here as remotes connect, update and report state.</span></div>`
              : shown.length === 0
              ? html`<div class="log-empty"><strong>No events match</strong><span>Clear the filter to see all ${this.logs.length} events.</span></div>`
              : shown.map((line) => this.renderLine(line))}
          </div>
        </section>
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .page-actions .btn svg { width: 18px; height: 18px; }
    .log-panel { display: flex; flex-direction: column; min-height: 420px; max-height: calc(100vh - 220px); overflow: hidden; }
    .filters { display: flex; align-items: center; gap: 10px 14px; flex-wrap: wrap; padding: 10px 16px; border-bottom: 1px solid var(--line); }
    .state { display: inline-flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: 500; color: var(--ink-2); min-width: 92px; }
    .search { position: relative; flex: 1 1 200px; max-width: 320px; }
    .search svg { position: absolute; left: 10px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: var(--faint); pointer-events: none; }
    .search input { padding-left: 36px; min-height: 36px; }
    .count { margin-left: auto; color: var(--muted); font-size: var(--text-sm); font-variant-numeric: tabular-nums; }
    .log-body { flex: 1; overflow: auto; padding: 8px 0 12px; background: var(--log-bg); }
    .log-line { margin: 0; padding: 1px 16px; color: var(--log-ink); font-family: var(--font-mono); font-size: var(--text-xs); line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
    .log-line:hover { background: rgba(255, 255, 255, 0.04); }
    .log-line.warn { color: #f5c46b; }
    .log-line.error { color: #ff9a92; background: rgba(255, 90, 80, 0.08); }
    .log-line.debug { color: var(--log-muted); }
    .log-empty { display: grid; justify-items: center; gap: 6px; min-height: 300px; align-content: center; padding: 30px; text-align: center; color: var(--log-muted); }
    .log-empty strong { color: var(--log-ink); font-weight: 500; font-size: var(--text-lg); }
    .log-empty .btn { margin-top: 8px; }
    :host(:fullscreen) { background: var(--canvas); }
    :host(:fullscreen) .page { height: 100vh; padding: 14px; }
    :host(:fullscreen) .page-head { display: none; }
    :host(:fullscreen) .log-panel { max-height: none; height: 100%; }
    @media (max-width: 760px) {
      .search { max-width: none; order: 5; flex-basis: 100%; }
      .log-panel { max-height: calc(100vh - 260px); min-height: 340px; }
    }
  `];
}
