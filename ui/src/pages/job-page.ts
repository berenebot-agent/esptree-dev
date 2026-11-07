import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { api, fmtBytes, fmtTime, fmtDuration, type OtaJob, type JobLogResponse, type LogEvent } from '../api/client';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';
import { jobStatus } from '../lib/job-status';

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
  rejoined_unverified: 'Rejoined — build unconfirmed',
};

const TERMINAL_STATUSES = ['compile_success', 'success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch', 'rejoined_unverified'];

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
    const time = this.formatEventTime(ev.ts);
    const isOutput = ev.type === 'compile_output';
    const isExpanded = this.expandedOutput.has(idx);

    const statusColors: Record<string, string> = {
      compile_success: 'ok',
      flash_success: 'ok',
      flash_rejoined: 'ok',
      compile_failed: 'danger',
      flash_failed: 'danger',
      flash_aborted: 'danger',
      flash_version_mismatch: 'warn',
      flash_identity_unverified: 'warn',
      flash_rejoin_timeout: 'warn',
    };
    const colorClass = statusColors[ev.type] || '';

    return html`
      <div class="event ${isOutput ? 'event-output' : ''} ${colorClass}">
        <div class="event-header">
          <span class="event-dot" aria-hidden="true"></span>
          <span class="event-time">${time}</span>
          <span class="event-type">${(() => { const t = ev.type.replace(/^(flash|compile)_/, '$1 ').replaceAll('_', ' '); return t.charAt(0).toUpperCase() + t.slice(1); })()}</span>
          ${ev.percent != null ? html`<span class="event-detail">${ev.percent}%</span>` : nothing}
          ${ev.error ? html`<span class="event-error">${ev.error}</span>` : nothing}
          ${ev.reason ? html`<span class="event-detail">${ev.reason}</span>` : nothing}
          ${ev.esphome_name ? html`<span class="event-detail">${ev.esphome_name}</span>` : nothing}
          ${ev.host ? html`<span class="event-detail">at ${ev.host}</span>` : nothing}
          ${ev.current_build_date ? html`<span class="event-detail">running build: ${ev.current_build_date}</span>` : nothing}
          ${ev.expected_build_date ? html`<span class="event-detail">expected build: ${ev.expected_build_date}</span>` : nothing}
          ${ev.actual_build_date ? html`<span class="event-detail">reported build: ${ev.actual_build_date}</span>` : nothing}
          ${ev.firmware_name ? html`<span class="event-detail">${ev.firmware_name}</span>` : nothing}
          ${ev.duration_s != null ? html`<span class="event-detail">took ${fmtDuration(ev.duration_s as number)}</span>` : nothing}
          ${ev.current_md5 ? html`<span class="event-detail">current running firmware MD5: ${ev.current_md5}</span>` : nothing}
          ${ev.md5 ? html`<span class="event-detail">New firmware MD5: ${ev.md5}</span>` : nothing}
          ${ev.rejoined_md5 && ev.expected_md5 ? html`<span class="event-detail">running firmware MD5: ${ev.rejoined_md5} expected MD5: ${ev.expected_md5}</span>` : nothing}
          ${ev.rejoined_md5 && !ev.expected_md5 ? html`<span class="event-detail">running firmware MD5: ${ev.rejoined_md5}</span>` : nothing}
          ${ev.expected_md5 && !ev.rejoined_md5 ? html`<span class="event-detail">expected MD5: ${ev.expected_md5}</span>` : nothing}
          ${ev.md5_match ? html`<span class="chip ${ev.md5_match === 'match' ? 'ok' : 'warn'}">MD5 ${ev.md5_match}</span>` : nothing}
          ${isOutput ? html`<button class="btn sm text toggle" aria-expanded=${isExpanded ? 'true' : 'false'} @click=${() => this.toggleOutput(idx)}>${isExpanded ? 'Hide output' : 'Show output'}</button>` : nothing}
        </div>
        ${isOutput && isExpanded
          ? html`<pre class="log compile-output">${ev.output || ''}</pre>`
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
    const fromDevice = backPath.startsWith('/device/');
    const st = jobStatus(status);

    return html`
      <div class="page">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="#${backPath}">${fromDevice ? 'Device' : 'Jobs'}</a>${icon('chevronRight')}<span aria-current="page">Job ${this.jobId}</span>
          </nav>
          <div class="page-head">
            <div>
              <h1>${jobLabel}</h1>
              <p class="sub meta">
                ${status ? html`<span class="chip ${st.tone === 'neutral' ? '' : st.tone}">${STATUS_LABELS[status] || st.label}</span>` : nothing}
                ${!isTerminal ? html`<span class="live"><span class="pulse"></span>Live</span>` : nothing}
                ${job ? html`<a href=${`#/device/${encodeURIComponent(job.mac)}`} class="mono">${job.mac}</a>` : nothing}
              </p>
            </div>
          </div>
        </div>

        ${this.error ? html`<div class="notice danger" role="alert">${icon('alert')}<span>${this.error}</span></div>` : nothing}
        ${job?.error_msg ? html`<div class="notice ${st.tone === 'warn' ? 'warn' : 'danger'}" role="status">${icon('alert')}<span>${job.error_msg}</span><span class="notice-actions"><a class="btn sm" href=${`#/device/${encodeURIComponent(job.mac)}`}>Open device</a></span></div>` : nothing}

        ${job ? html`
          <section class="card">
            <dl class="facts pad">
              <div><dt>Firmware</dt><dd>${job.firmware_name || '—'}</dd></div>
              <div><dt>Size</dt><dd>${fmtBytes(job.firmware_size)}</dd></div>
              <div><dt>Started</dt><dd>${job.started_at ? fmtTime(job.started_at) : '—'}</dd></div>
              <div><dt>Finished</dt><dd>${job.completed_at ? fmtTime(job.completed_at) : '—'}</dd></div>
              <div><dt>Duration</dt><dd>${job.started_at && job.completed_at ? fmtDuration(job.completed_at - job.started_at) : '—'}</dd></div>
              ${job.parsed_version ? html`<div><dt>Version</dt><dd>${job.old_firmware_version ? `${job.old_firmware_version} → ` : ''}${job.parsed_version}</dd></div>` : nothing}
              ${job.parsed_build_date ? html`<div><dt>Image build</dt><dd>${job.parsed_build_date}</dd></div>` : nothing}
            </dl>
          </section>
        ` : nothing}

        <section class="card">
          <div class="card-head"><h2>Events</h2><span class="hint">${events.length} recorded</span></div>
          <div class="timeline">
            ${this.loading
              ? html`<p class="none"><span class="spinner"></span>Loading events…</p>`
              : events.length === 0
                ? html`<p class="none">No events recorded for this job.</p>`
                : events.map((ev, idx) => this.renderEvent(ev, idx))}
          </div>
        </section>
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
    .meta a { color: var(--muted); }
    .live { display: inline-flex; align-items: center; gap: 6px; color: var(--info); font-size: var(--text-sm); font-weight: 500; }
    .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--info); animation: pulse 1.6s ease-out infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--info) 60%, transparent); } 100% { box-shadow: 0 0 0 8px transparent; } }
    .pad { padding: 16px; }
    .none { display: flex; align-items: center; gap: 10px; padding: 16px; color: var(--muted); }
    .timeline { padding: 8px 0; }
    .event { position: relative; padding: 6px 16px 6px 40px; }
    .event::before { content: ''; position: absolute; left: 21px; top: 0; bottom: 0; border-left: 2px solid var(--line); }
    .event:first-child::before { top: 14px; }
    .event:last-child::before { bottom: calc(100% - 14px); }
    .event-dot { position: absolute; left: 16px; top: 10px; width: 12px; height: 12px; border-radius: 50%; background: var(--surface); border: 2px solid var(--line-strong); }
    .event.ok .event-dot { border-color: var(--ok-dot); background: var(--ok-dot); }
    .event.danger .event-dot { border-color: var(--danger); background: var(--danger); }
    .event.warn .event-dot { border-color: var(--accent-fill); background: var(--accent-fill); }
    .event-header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
    .event-time { color: var(--muted); font-size: var(--text-sm); font-variant-numeric: tabular-nums; min-width: 72px; }
    .event-type { font-weight: 500; }
    .event-detail { color: var(--ink-2); font-size: var(--text-sm); overflow-wrap: anywhere; }
    .event-error { color: var(--danger); font-size: var(--text-sm); }
    .event.danger .event-type { color: var(--danger); }
    .compile-output { margin: 8px 0 4px; max-height: 420px; }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    'esp-job-page': EspJobPage;
  }
}
