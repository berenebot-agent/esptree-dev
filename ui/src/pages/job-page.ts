import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { api, fmtBytes, fmtTime, fmtDuration, type OtaJob, type JobLogResponse, type LogEvent } from '../api/client';

const STATUS_LABELS: Record<string, string> = {
  compile_queued: 'Queued for compile',
  compiling: 'Compiling',
  compile_success: 'Compile success',
  queued: 'Queued for flash',
  starting: 'Starting',
  announcing: 'Waiting for device accept',
  transferring: 'Transferring',
  verifying: 'Verifying',
  transfer_success_waiting_rejoin: 'Waiting for device rejoin',
  success: 'Success',
  failed: 'Failed',
  aborted: 'Aborted',
  rejoin_timeout: 'Rejoin timeout',
  version_mismatch: 'Version mismatch',
};

const EVENT_ICONS: Record<string, string> = {
  compile_queued: '\u2699',
  compile_dequeued: '\u2699',
  compiling: '\u2699',
  compile_success: '\u2705',
  compile_failed: '\u274C',
  compile_output: '\u{1F4CB}',
  compile_cancelled: '\u274C',
  flash_queued: '\u{1F4E6}',
  flash_dequeued: '\u{1F4E6}',
  flash_starting: '\u25B6',
  flash_announcing: '\u23F3',
  flash_transferring: '\u{1F4E4}',
  flash_progress: '\u{1F4C8}',
  flash_verifying: '\u2705',
  flash_rejoin_waiting: '\u23F3',
  flash_rejoined: '\u{1F504}',
  flash_version_mismatch: '\u26A0',
  flash_rejoin_timeout: '\u23F0',
  flash_success: '\u2705',
  flash_failed: '\u274C',
  flash_aborted: '\u{1F6D1}',
  flash_start_failed: '\u274C',
  dequeue_retry: '\u{1F504}',
  dequeue_moved_back: '\u{1F504}',
  ota_start_retry: '\u{1F504}',
};

const TERMINAL_STATUSES = ['compile_success', 'success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch'];

@customElement('esp-job-page')
export class EspJobPage extends LitElement {
  @property({ type: Number }) jobId = 0;
  @property({ type: String }) from = '/queue';
  @state() private job: OtaJob | null = null;
  @state() private logData: JobLogResponse | null = null;
  @state() private error = '';
  @state() private loading = true;
  @state() private expandedOutput: Set<number> = new Set();
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.stopPolling();
    super.disconnectedCallback();
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has('jobId') && this.jobId) {
      this.loading = true;
      this.error = '';
      this.fetchLog();
    }
  }

  private startPolling(): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(() => this.fetchLog(), 2000);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async fetchJob(): Promise<void> {
    if (!this.jobId) return;
    try {
      const mac = this.logData?.mac;
      if (mac) {
        const resp = await api.history(mac);
        const found = resp.jobs.find(j => j.id === this.jobId);
        this.job = found || null;
      }
    } catch {
      // job info may not be available via log endpoint alone
    }
  }

  private async fetchLog(): Promise<void> {
    if (!this.jobId) return;
    try {
      this.logData = await api.jobLog(this.jobId);
      this.loading = false;
      if (!this.job && this.logData?.mac) {
        await this.fetchJob();
      }
      if (this.logData?.is_terminal) {
        this.stopPolling();
      } else {
        this.startPolling();
      }
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
      this.loading = false;
      this.stopPolling();
    }
  }

  private toggleOutput(idx: number): void {
    const next = new Set(this.expandedOutput);
    if (next.has(idx)) {
      next.delete(idx);
    } else {
      next.add(idx);
    }
    this.expandedOutput = next;
  }

  private formatEventTime(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString();
  }

  private renderEvent(ev: LogEvent, idx: number): unknown {
    const icon = EVENT_ICONS[ev.type] || '\u2022';
    const time = this.formatEventTime(ev.ts);
    const isOutput = ev.type === 'compile_output';
    const isExpanded = this.expandedOutput.has(idx);

    const statusColors: Record<string, string> = {
      compile_success: 'ok',
      flash_success: 'ok',
      compile_failed: 'danger',
      flash_failed: 'danger',
      flash_aborted: 'danger',
      flash_version_mismatch: 'warn',
      flash_rejoin_timeout: 'warn',
    };
    const colorClass = statusColors[ev.type] || '';

    return html`
      <div class="event ${isOutput ? 'event-output' : ''} ${colorClass}">
        <div class="event-header" @click=${isOutput ? (() => this.toggleOutput(idx)) : undefined}>
          <span class="event-icon">${icon}</span>
          <span class="event-time">${time}</span>
          <span class="event-type">${ev.type.replaceAll('_', ' ')}</span>
          ${ev.percent != null ? html`<span class="event-detail">${ev.percent}%</span>` : nothing}
          ${ev.error ? html`<span class="event-error">${ev.error}</span>` : nothing}
          ${ev.reason ? html`<span class="event-detail">${ev.reason}</span>` : nothing}
          ${ev.esphome_name ? html`<span class="event-detail">${ev.esphome_name}</span>` : nothing}
          ${ev.host ? html`<span class="event-detail">at ${ev.host}</span>` : nothing}
          ${ev.current_build_date ? html`<span class="event-detail">running build: ${ev.current_build_date}</span>` : nothing}
          ${ev.firmware_name ? html`<span class="event-detail">${ev.firmware_name}</span>` : nothing}
          ${ev.duration_s != null ? html`<span class="event-detail">took ${fmtDuration(ev.duration_s as number)}</span>` : nothing}
          ${ev.current_md5 ? html`<span class="event-detail">current running firmware MD5: ${ev.current_md5}</span>` : nothing}
          ${ev.md5 ? html`<span class="event-detail">New firmware MD5: ${ev.md5}</span>` : nothing}
          ${ev.rejoined_md5 && ev.expected_md5 ? html`<span class="event-detail">running firmware MD5: ${ev.rejoined_md5} expected MD5: ${ev.expected_md5}</span>` : nothing}
          ${ev.rejoined_md5 && !ev.expected_md5 ? html`<span class="event-detail">running firmware MD5: ${ev.rejoined_md5}</span>` : nothing}
          ${ev.expected_md5 && !ev.rejoined_md5 ? html`<span class="event-detail">expected MD5: ${ev.expected_md5}</span>` : nothing}
          ${ev.md5_match ? html`<span class="event-tag ${ev.md5_match === 'match' ? 'ok' : 'warn'}">MD5 ${ev.md5_match}</span>` : nothing}
          ${isOutput ? html`<span class="toggle">${isExpanded ? 'hide' : 'show output'}</span>` : nothing}
        </div>
        ${isOutput && isExpanded
          ? html`<pre class="compile-output">${ev.output || ''}</pre>`
          : nothing}
      </div>
    `;
  }

  render() {
    const log = this.logData;
    const job = this.job;
    const events = log?.log_events || [];
    const status = log?.status || job?.status || '';
    const isTerminal = log?.is_terminal ?? (job ? TERMINAL_STATUSES.includes(job.status) : false);
    const jobLabel = job?.parsed_esphome_name || job?.esphome_name || job?.firmware_name || 'Firmware';

    const backPath = this.from || '/queue';
    const backLabel = backPath.startsWith('/device/') ? 'Device' : backPath === '/queue' ? 'Queue' : backPath.replace(/^\//, '');

    return html`
      <div class="job-page">
        <div class="page-head">
          <div class="page-heading">
            <span class="eyebrow">Job #${this.jobId}</span>
            <h1>${jobLabel}</h1>
            <p>Compile and upload trace for this firmware operation.</p>
          </div>
          <div class="page-actions">
            ${!isTerminal ? html`<span class="live-indicator"><span class="pulse"></span>Live</span>` : nothing}
            <a class="btn" href="#${backPath}">← ${backLabel}</a>
          </div>
        </div>

        ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}

        ${job ? html`
          <div class="meta">
            <div class="meta-item">
              <small>Status</small>
              <span class="status-chip ${status}">${STATUS_LABELS[status] || status.replaceAll('_', ' ')}</span>
            </div>
            <div class="meta-item">
              <small>Device</small>
              <span>${job.mac}</span>
            </div>
            <div class="meta-item">
              <small>Size</small>
              <span>${fmtBytes(job.firmware_size)}</span>
            </div>
            ${job.started_at ? html`
              <div class="meta-item">
                <small>Started</small>
                <span>${fmtTime(job.started_at)}</span>
              </div>
            ` : nothing}
            ${job.completed_at ? html`
              <div class="meta-item">
                <small>Completed</small>
                <span>${fmtTime(job.completed_at)}</span>
              </div>
            ` : nothing}
            ${job.started_at && job.completed_at ? html`
              <div class="meta-item">
                <small>Duration</small>
                <span>${fmtDuration(job.completed_at - job.started_at)}</span>
              </div>
            ` : nothing}
            ${job.error_msg ? html`
              <div class="meta-item meta-full">
                <small>Error</small>
                <span class="error">${job.error_msg}</span>
              </div>
            ` : nothing}
          </div>
        ` : nothing}

        ${!isTerminal ? html`<div class="live-indicator">Live<span class="pulse"></span></div>` : nothing}

        <div class="log-header">
          <span class="label">Event Log</span>
          <span class="count">${events.length} events</span>
        </div>
        <div class="log-body">
          ${this.loading
            ? html`<span class="empty">Loading…</span>`
            : events.length === 0
              ? html`<span class="empty">No events recorded for this job.</span>`
              : events.map((ev, idx) => this.renderEvent(ev, idx))}
        </div>
      </div>
    `;
  }

  static styles = css`
    section {
      display: grid;
      gap: 12px;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 8px;
    }

    .back-link {
      color: var(--primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .title-row span {
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    h2 {
      margin: 2px 0 0;
      font-size: 16px;
      font-weight: 600;
    }

    .meta {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 8px 16px;
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 8px;
      padding: 12px 16px;
    }

    .meta-item {
      display: grid;
      gap: 2px;
    }

    .meta-item small {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
    }

    .meta-item span {
      font-size: 13px;
    }

    .meta-full {
      grid-column: 1 / -1;
    }

    .status-chip {
      border: 1px solid var(--line);
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 11px;
    }

    .success {
      color: var(--ok);
    }

    .failed,
    .aborted {
      color: var(--danger);
    }

    .rejoin_timeout,
    .version_mismatch {
      color: var(--accent);
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: var(--ok);
    }

    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--ok);
      animation: blink 1.2s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #25262b;
      border: 1px solid var(--line);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      margin-top: 4px;
    }

    .label {
      color: #9ba1a7;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
    }

    .count {
      color: #64748b;
      font-size: 11px;
    }

    .log-body {
      background: #1a1b1e;
      border: 1px solid var(--line);
      border-top: none;
      border-radius: 0 0 8px 8px;
      max-height: 600px;
      overflow-y: auto;
      padding: 8px 0;
    }

    .empty {
      color: var(--muted);
      font-style: italic;
      font-size: 13px;
      display: block;
      padding: 16px 12px;
    }

    .event {
      padding: 4px 12px;
    }

    .event:hover {
      background: rgba(255,255,255,0.03);
    }

    .event.ok .event-type {
      color: var(--ok);
    }

    .event.danger .event-type,
    .event.danger .event-error {
      color: var(--danger);
    }

    .event.warn .event-type {
      color: var(--accent);
    }

    .event-output .event-header {
      cursor: pointer;
    }

    .event-header {
      display: flex;
      align-items: baseline;
      gap: 8px;
      flex-wrap: wrap;
    }

    .event-icon {
      font-size: 12px;
      width: 18px;
      text-align: center;
    }

    .event-time {
      color: #64748b;
      font-family: ui-monospace, 'SFMono-Regular', 'Cascadia Code', monospace;
      font-size: 12px;
    }

    .event-type {
      color: #c0c5ce;
      font-weight: 600;
      font-size: 12px;
    }

    .event-detail {
      color: #9ba1a7;
      font-size: 11px;
    }

    .event-tag {
      font-size: 11px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
    }

    .event-tag.ok {
      color: var(--ok);
      background: color-mix(in srgb, var(--ok) 15%, transparent);
    }

    .event-tag.warn {
      color: var(--accent);
      background: color-mix(in srgb, var(--accent) 15%, transparent);
    }

    .event-error {
      color: var(--danger);
      font-size: 12px;
    }

    .toggle {
      color: var(--primary);
      font-size: 11px;
      cursor: pointer;
    }

    .compile-output {
      margin: 4px 0 4px 26px;
      color: #9ba1a7;
      font-family: ui-monospace, 'SFMono-Regular', 'Cascadia Code', monospace;
      font-size: 11px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 400px;
      overflow-y: auto;
      background: #111216;
      border-radius: 4px;
      padding: 8px;
    }

    .error {
      color: var(--danger);
      font-weight: 500;
      margin: 0;
    }

    @media (max-width: 720px) {
      .meta {
        grid-template-columns: 1fr;
      }
    }

    /* ---- Job page header and meta ---- */
    :host { display: block; color: var(--ink); }
    * { box-sizing: border-box; }
    .job-page { display: flex; flex-direction: column; gap: 13px; }
    .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
    .page-heading { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
    .eyebrow { color: var(--primary); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    .page-head h1 { margin: 0; color: var(--ink); font-size: 25px; line-height: 1.18; letter-spacing: -.03em; font-weight: 700; overflow-wrap: anywhere; }
    .page-heading p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.45; }
    .page-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
    .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 34px; padding: 0 11px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); color: var(--ink-2); font: inherit; font-size: 11px; font-weight: 600; text-decoration: none; white-space: nowrap; }
    .btn:hover { background: var(--surface-subtle); border-color: var(--faint); }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .live-indicator { display: inline-flex; align-items: center; gap: 6px; color: var(--ok); font-size: 10px; font-weight: 650; }
    .pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 3px var(--ok-soft); }
    .job-page .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1px; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--line); overflow: hidden; padding: 0; }
    .job-page .meta-item { min-height: 68px; padding: 11px 14px; background: var(--surface); gap: 4px; }
    .job-page .meta-item small { color: var(--faint); font-size: 8px; letter-spacing: .07em; }
    .job-page .meta-item span { color: var(--ink); font-size: 11px; font-weight: 600; overflow-wrap: anywhere; }
    .job-page .meta-item span.error { color: var(--danger); }
    .job-page .meta-full { grid-column: 1 / -1; }
    .job-page .status-chip { width: fit-content; padding: 2px 6px; border: 1px solid var(--line); border-radius: 4px; font-size: 9px; }
    .job-page .log-header { margin-top: 3px; padding: 10px 14px; background: #142a25; border-color: #223b35; border-radius: var(--radius-lg) var(--radius-lg) 0 0; }
    .job-page .label { color: #c5d5ce; font-size: 9px; letter-spacing: .06em; }
    .job-page .count { color: #7f978d; font-size: 9px; }
    .job-page .log-body { max-height: 620px; padding: 9px 0 13px; background: #101f1c; border-color: #223b35; border-radius: 0 0 var(--radius-lg) var(--radius-lg); }
    .job-page .event { padding: 4px 15px; }
    .job-page .event-time { color: #6f887e; font-size: 10px; }
    .job-page .event-type { color: #c4d5cc; font-size: 10px; }
    .job-page .event-detail { color: #91a79d; font-size: 9px; }
    .job-page .event-icon { font-size: 10px; width: 15px; }
    .job-page .compile-output { margin-left: 22px; padding: 9px; background: #0b1714; color: #a8bdb3; font-size: 10px; }
    .job-page .empty { color: #8fa79c; font-size: 11px; font-style: normal; padding: 18px 15px; }
    .job-page > .error { margin: 0; padding: 10px 12px; border: 1px solid #e7c2c5; border-radius: 7px; background: var(--danger-soft); color: #8c3037; font-size: 11px; }
    @media (max-width: 760px) {
      .page-head { align-items: flex-start; flex-direction: column; gap: 12px; }
      .page-head h1 { font-size: 21px; }
      .page-actions { width: 100%; justify-content: space-between; }
      .job-page .meta { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; } }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'esp-job-page': EspJobPage;
  }
}
