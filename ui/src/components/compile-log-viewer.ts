import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { api } from '../api/client';
import { shared } from '../styles/shared';

const MAX_LOG_LINES = 800;
const LOG_FLUSH_MS = 100;

@customElement('esp-compile-log-viewer')
export class EspCompileLogViewer extends LitElement {
  @property({ type: String }) mac = '';
  @property({ type: Boolean }) visible = true;
  @property({ type: Boolean }) stopped = false;
  @state() private logs: string[] = [];
  @state() private autoScroll = true;
  private eventSource: EventSource | null = null;
  private _macObserved = '';
  private reconnectAttempts = 0;
  private reconnectDelay = 1000;
  private pendingLogs: string[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  private scrollTarget: HTMLElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.visible) {
      this.connect();
    }
  }

  disconnectedCallback(): void {
    this.disconnect();
    super.disconnectedCallback();
  }

  updated(changed: Map<string, unknown>): void {
    this.hidden = !this.visible;
    if (changed.has('visible')) {
      if (this.visible) {
        this.connect();
      } else {
        this.flushLogs();
        this.disconnect();
      }
    }
    if (changed.has('stopped') && this.stopped) {
      this.flushLogs();
      this.disconnect();
    }
    if (changed.has('mac') && this.mac !== this._macObserved) {
      this.logs = [];
      this.pendingLogs = [];
      this.reconnectAttempts = 0;
      if (this.visible) {
        this.connect();
      }
    }
  }

  private connect(): void {
    if (this.stopped || !this.visible) return;
    this.disconnect();
    if (!this.mac) return;
    this._macObserved = this.mac;

    this.eventSource = api.streamCompileLogs(
      this.mac,
      (line: string) => {
        this.pendingLogs.push(line);
        if (
          line === '[build exited with code 0]' ||
          line === '[build exited with code 1]' ||
          line === '[status: idle]'
        ) {
          this.flushLogs();
          this.stopped = true;
          this.disconnect();
          return;
        }
        this.scheduleFlush();
      },
      (err: Event) => {
        this.handleStreamError(err);
      }
    );
  }

  private handleStreamError(_err: Event): void {
    if (this.stopped || !this.visible) return;
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, Math.min(this.reconnectAttempts - 1, 10));
    setTimeout(() => this.connect(), delay);
  }

  private disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.reconnectAttempts = 0;
  }

  private scrollToBottom(): void {
    if (this.scrollTarget) {
      this.scrollTarget.scrollTop = this.scrollTarget.scrollHeight;
    }
  }

  private toggleAutoScroll(): void {
    this.autoScroll = !this.autoScroll;
  }

  private clearLogs(): void {
    this.logs = [];
    this.pendingLogs = [];
  }

  private scheduleFlush(): void {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => this.flushLogs(), LOG_FLUSH_MS);
  }

  private flushLogs(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.pendingLogs.length === 0) return;
    const next = [...this.logs, ...this.pendingLogs].slice(-MAX_LOG_LINES);
    this.pendingLogs = [];
    this.logs = next;
    if (this.autoScroll && this.visible) {
      this.updateComplete.then(() => this.scrollToBottom());
    }
  }

  render() {
    return html`
      <div class="log-header">
        <span class="label">Build log</span>
        <div class="controls">
          <button class="ctrl-btn" @click=${this.clearLogs}>Clear</button>
          <button class="ctrl-btn ${this.autoScroll ? 'active' : ''}" @click=${this.toggleAutoScroll}>
            ${this.autoScroll ? 'Following output' : 'Paused, click to follow'}
          </button>
        </div>
      </div>
      <div class="log-body" ${ref((el) => { this.scrollTarget = el as HTMLElement; })}>
        ${this.logs.length === 0
          ? html`<span class="empty">Waiting for build output…</span>`
          : html`<pre>${this.logs.join('\n')}</pre>`}
      </div>
    `;
  }

  static styles = [shared, css`
    :host {
      display: flex;
      flex-direction: column;
      background: var(--log-bg);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    :host([hidden]) { display: none; }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 6px 8px 6px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--log-muted);
      font-size: var(--text-xs);
    }
    .label { font-weight: 500; }
    .controls { display: flex; gap: 4px; }
    .ctrl-btn {
      min-height: 28px;
      padding: 0 10px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--log-ink);
      font: inherit;
      font-size: var(--text-xs);
      cursor: pointer;
    }
    .ctrl-btn:hover { background: rgba(255, 255, 255, 0.08); }
    .ctrl-btn.active { border-color: rgba(255, 255, 255, 0.3); }
    .log-body {
      flex: 1;
      min-height: 160px;
      max-height: 480px;
      overflow: auto;
      padding: 10px 14px;
      color: var(--log-ink);
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      line-height: 1.6;
    }
    pre { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }
    .empty { color: var(--log-muted); }
  `];
}
