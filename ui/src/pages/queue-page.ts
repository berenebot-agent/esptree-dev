import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { OtaJob, QueueResponse, CompileQueueResponse, api, fmtBytes, fmtTime, fmtDuration, fmtTimeAgo } from '../api/client';

interface HistoryDisplayEntry {
  type: 'flash' | 'compile' | 'combined';
  compileJob?: OtaJob;
  flashJob?: OtaJob;
  job?: OtaJob;
  label: string;
  status: string;
  statusLabel: string;
  created_at: number;
}

const COMBINE_WINDOW_S = 300;
const FLASH_RESULT_STATUSES = new Set(['success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch']);

@customElement('esp-queue-page')
export class EspQueuePage extends LitElement {
  @state() private queueData: QueueResponse | null = null;
  @state() private compileData: CompileQueueResponse | null = null;
  @state() private historyJobs: OtaJob[] = [];
  @state() private error = '';
  @state() private busyJob: number | null = null;
  @state() private busyAction = '';
  @state() private showAbortModal = false;
  @state() private historyFilter: 'all' | 'flash' | 'compile' = 'all';
  @state() private historyLimit = 10;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private historyTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.fetchQueue();
    this.pollTimer = setInterval(() => this.fetchQueue(), 2000);
    this.fetchHistory();
    this.historyTimer = setInterval(() => this.fetchHistory(), 5000);
  }

  disconnectedCallback(): void {
    if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null; }
    if (this.historyTimer) { clearInterval(this.historyTimer); this.historyTimer = null; }
    super.disconnectedCallback();
  }

  private async fetchQueue(): Promise<void> {
    try {
      const [flash, compile] = await Promise.all([
        api.getQueue(),
        api.getCompileQueue(),
      ]);
      this.queueData = flash;
      this.compileData = compile;
    } catch {
      // ignore poll errors
    }
  }

  private async fetchHistory(): Promise<void> {
    try {
      const resp = await api.getAllHistory(100);
      this.historyJobs = resp.jobs;
    } catch {
      // ignore poll errors
    }
  }

  private async pauseQueue(): Promise<void> {
    this.busyAction = 'pause';
    this.error = '';
    try {
      await api.pauseQueue();
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.busyAction = '';
    }
  }

  private async resumeQueue(): Promise<void> {
    this.busyAction = 'resume';
    this.error = '';
    try {
      await api.resumeQueue();
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.busyAction = '';
    }
  }

  private async abortQueuedJob(jobId: number): Promise<void> {
    this.busyJob = jobId;
    this.error = '';
    try {
      await api.abortQueuedJob(jobId);
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.busyJob = null;
    }
  }

  private async abortCompileJob(jobId: number): Promise<void> {
    this.busyJob = jobId;
    this.error = '';
    try {
      await api.abortCompileJob(jobId);
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.busyJob = null;
    }
  }

  private async moveUp(jobId: number): Promise<void> {
    this.busyJob = jobId;
    this.error = '';
    try {
      await api.reorderJobUp(jobId);
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.busyJob = null;
    }
  }

  private async moveDown(jobId: number): Promise<void> {
    this.busyJob = jobId;
    this.error = '';
    try {
      await api.reorderJobDown(jobId);
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.busyJob = null;
    }
  }

  private async abortActiveJob(): Promise<void> {
    this.busyAction = 'abort-active';
    this.error = '';
    try {
      const queue = await api.getQueue();
      if (queue.count > 0) {
        this.showAbortModal = true;
        return;
      }
      await api.abortOta();
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    } finally {
      this.busyAction = '';
    }
  }

  private async abortActiveAndContinue(): Promise<void> {
    this.showAbortModal = false;
    try {
      await api.abortOta();
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    }
  }

  private async abortActiveAndPause(): Promise<void> {
    this.showAbortModal = false;
    try {
      await api.abortOta();
      await api.pauseQueue();
      await this.fetchQueue();
    } catch (e) {
      this.error = e instanceof Error ? e.message : String(e);
    }
  }

  private navigateToDevice(mac: string): void {
    window.location.hash = `/device/${encodeURIComponent(mac)}`;
  }

  private navigateToJob(job: OtaJob): void {
    window.location.hash = `/job/${job.id}?from=${encodeURIComponent('/queue')}`;
  }

  private labelFor(job: OtaJob): string {
    return job.device_label || job.parsed_esphome_name || job.esphome_name || job.mac;
  }

  private buildDisplayEntries(): HistoryDisplayEntry[] {
    const filtered = this.historyJobs.filter(j => {
      if (this.historyFilter === 'all') return true;
      return (j.job_type || this.inferJobType(j)) === this.historyFilter;
    });

    const sorted = [...filtered].sort((a, b) => (a.created_at ?? 0) - (b.created_at ?? 0));
    const result: HistoryDisplayEntry[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      const curType: 'flash' | 'compile' = (current.job_type || this.inferJobType(current)) as 'flash' | 'compile';

      if (next && curType === 'compile' && (next.job_type || this.inferJobType(next)) === 'flash'
          && current.mac === next.mac
          && (next.created_at - current.created_at) <= COMBINE_WINDOW_S) {
        const status = next.status === 'success' && current.status === 'compile_success' ? 'success' : 'failed';
        result.push({
          type: 'combined',
          compileJob: current,
          flashJob: next,
          label: this.labelFor(current),
          status,
          statusLabel: status === 'success' ? 'Success' : 'Failed',
          created_at: next.created_at,
        });
        i++;
      } else {
        result.push({
          type: curType,
          job: current,
          label: this.labelFor(current),
          status: current.status,
          statusLabel: current.status === 'success' && curType === 'flash'
            ? 'OTA Upload Success'
            : current.status.replaceAll('_', ' '),
          created_at: current.created_at,
        });
      }
    }

    result.sort((a, b) => b.created_at - a.created_at);
    return result;
  }

  private inferJobType(job: OtaJob): 'flash' | 'compile' {
    if (job.status === 'compile_success' || job.status === 'compile_queued' || job.status === 'compiling') return 'compile';
    if (FLASH_RESULT_STATUSES.has(job.status)) return 'flash';
    return 'flash';
  }

  private get statusStyles(): Record<string, string> {
    return {
      'success': `background:#dcfce7;color:#15803d;`,
      'failed': `background:#fef2f2;color:#dc2626;`,
      'aborted': `background:#fef3c7;color:#b45309;`,
      'rejoin_timeout': `background:#fef3c7;color:#b45309;`,
      'version_mismatch': `background:#fef3c7;color:#b45309;`,
      'compile_success': `background:#dcfce7;color:#15803d;`,
    };
  }

  render() {
    const data = this.queueData;
    const hasActive = !!data?.active_job && !FLASH_RESULT_STATUSES.has(data.active_job.status);
    const queued = data?.queued_jobs ?? [];
    const paused = data?.paused ?? false;
    const totalCount = queued.length + (hasActive ? 1 : 0);

    const compileActive = this.compileData?.active_job ?? null;
    const compileQueued = this.compileData?.queued_jobs ?? [];
    const compileCount = this.compileData?.count ?? 0;

    const displayEntries = this.buildDisplayEntries();
    const shownEntries = displayEntries.slice(0, this.historyLimit);
    const totalHistory = displayEntries.length;

    return html`
      <div class="queue-page">
        <div class="page-head">
          <div class="page-heading">
            <span class="eyebrow">Firmware operations</span>
            <h1>Build &amp; deployment</h1>
            <p>Follow compile and OTA work from queued to confirmed. Jobs are serialized so the mesh and build host are never overloaded.</p>
          </div>
          <div class="page-actions">
            ${paused
              ? html`<button class="btn resume" ?disabled=${this.busyAction === 'resume'} @click=${this.resumeQueue}>Resume queue</button>`
              : html`<button class="btn pause" ?disabled=${this.busyAction === 'pause'} @click=${this.pauseQueue}>Pause queue</button>`
            }
          </div>
        </div>

        ${this.error ? html`<div class="callout error" role="alert"><strong>Queue action failed</strong><span>${this.error}</span></div>` : nothing}

        <section class="summary-strip" aria-label="Queue summary">
          <div class="summary-item">
            <span class="summary-label">Queue state</span>
            <strong class=${paused ? 'state-paused' : 'state-running'}>${paused ? 'Paused' : 'Running'}</strong>
            <span class="summary-note">${paused ? 'New jobs wait until resumed' : 'Next job starts automatically'}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Active upload</span>
            <strong>${hasActive && data?.active_job ? `${data.active_job.percent ?? 0}%` : 'None'}</strong>
            <span class="summary-note">${hasActive && data?.active_job ? this.labelFor(data.active_job) : 'No OTA in progress'}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Waiting</span>
            <strong>${queued.length + compileCount}</strong>
            <span class="summary-note">${queued.length} upload${queued.length === 1 ? '' : 's'} · ${compileCount} compile${compileCount === 1 ? '' : 's'}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">History</span>
            <strong>${this.historyJobs.length}</strong>
            <span class="summary-note">Recent jobs kept for recovery</span>
          </div>
        </section>

        <div class="pipeline-grid">
          <section class="panel pipeline">
            <div class="panel-head">
              <div class="panel-title">
                <span class="pipeline-mark compile" aria-hidden="true">⌘</span>
                <span><h2>Compile pipeline</h2><p>ESPHome builds before an upload</p></span>
              </div>
              <span class="panel-count">${compileCount}</span>
            </div>
            <div class="panel-body">
              ${compileCount === 0
                ? html`<div class="empty"><strong>No compile work</strong><p>Create or update a remote configuration to start a build.</p></div>`
                : nothing}
              ${compileActive ? this.renderCompileRow(compileActive, true) : nothing}
              ${compileQueued.map(job => this.renderCompileRow(job, false))}
            </div>
          </section>

          <section class="panel pipeline">
            <div class="panel-head">
              <div class="panel-title">
                <span class="pipeline-mark ota" aria-hidden="true">⇪</span>
                <span><h2>OTA upload pipeline</h2><p>Firmware delivery and rejoin confirmation</p></span>
              </div>
              <span class="panel-count ${hasActive ? 'active' : ''}">${queued.length + (hasActive ? 1 : 0)}</span>
            </div>
            <div class="panel-body">
              ${totalCount === 0
                ? html`<div class="empty"><strong>Queue is clear</strong><p>Start an upload from a remote’s detail page.</p></div>`
                : html`
                    <div class="rows">
                      ${hasActive && data!.active_job
                        ? this.renderOtaRow(data!.active_job, 1, queued.length + 1, true)
                        : nothing}
                      ${queued.map((job, i) => this.renderOtaRow(job, i + (hasActive ? 2 : 1), queued.length + (hasActive ? 1 : 0), false))}
                    </div>
                  `}
            </div>
          </section>
        </div>

        <section class="panel history-panel">
          <div class="panel-head history-head">
            <div class="panel-title">
              <span class="pipeline-mark history" aria-hidden="true">↺</span>
              <span><h2>Job history</h2><p>Compile and upload outcomes, newest first</p></span>
            </div>
            <div class="history-tools">
              <div class="history-tabs" role="group" aria-label="Filter job history">
                ${(['all', 'flash', 'compile'] as const).map((value) => html`
                  <button class=${this.historyFilter === value ? 'active' : ''} aria-pressed=${this.historyFilter === value ? 'true' : 'false'} @click=${() => { this.historyFilter = value; this.historyLimit = 10; }}>${value === 'all' ? 'All' : value === 'flash' ? 'Uploads' : 'Compiles'}</button>
                `)}
              </div>
              <span class="history-total">${totalHistory} shown</span>
            </div>
          </div>
          <div class="panel-body">
            ${totalHistory === 0
              ? html`<div class="empty"><strong>No job history yet</strong><p>Completed compiles and uploads will appear here, including retained firmware for rollback.</p></div>`
              : html`
                  <div class="history-table">
                    ${shownEntries.map(entry => {
                      if (entry.type === 'combined') return this.renderCombinedRow(entry);
                      return this.renderHistoryRow(entry);
                    })}
                  </div>
                  ${totalHistory > this.historyLimit
                    ? html`<div class="show-more"><button @click=${() => { this.historyLimit += 10; }}>Show ${Math.min(10, totalHistory - this.historyLimit)} older entries</button></div>`
                    : nothing}
                `}
          </div>
        </section>

        ${this.showAbortModal ? this.renderAbortModal() : nothing}
      </div>
    `;
  }

  private renderCompileRow(job: OtaJob, isActive: boolean) {
    const isBusy = this.busyJob === job.id;
    const label = this.labelFor(job);
    return html`
      <article class="${isActive ? 'compile-active-row' : 'compile-queued-row'}">
        <div class="device-info clickable" @click=${() => this.navigateToDevice(job.mac)}>
          <strong>${isActive ? '⚙' : ''} ${label}</strong>
          <small>${isActive ? 'Compiling...' : 'Queued to compile'}</small>
        </div>
        <div class="progress-cell">
          <span class="status-pill ${isActive ? 'compiling' : 'queued'}">${isActive ? 'Compiling' : 'Queued'}</span>
        </div>
        <div class="actions">
          <button class="btn" @click=${() => this.navigateToJob(job)}>View log</button>
          <button class="btn btn-abort" ?disabled=${isBusy} @click=${() => this.abortCompileJob(job.id)}>Abort</button>
          <button class="btn btn-icon" disabled title="Move up">▲</button>
          <button class="btn btn-icon" disabled title="Move down">▼</button>
        </div>
      </article>
    `;
  }

  private renderOtaRow(job: OtaJob, position: number, total: number, isActive: boolean) {
    const isBusy = this.busyJob === job.id;
    const label = this.labelFor(job);
    if (isActive) {
      const statusText = (job.bridge_state || job.status).replaceAll('_', ' ');
      const percent = job.percent ?? 0;
      return html`
        <article class="active-row">
          <div class="device-info clickable" @click=${() => this.navigateToDevice(job.mac)}>
            <strong>① ${label}</strong>
            <small>${job.firmware_name || 'firmware.ota.bin'}</small>
          </div>
          <div class="progress-cell">
            <div class="progress-wrap"><div class="progress-fill" style="width: ${percent}%"></div></div>
            <span class="status-pill flashing">${statusText}</span> <span class="percent">${percent}%</span>
          </div>
          <div class="actions">
            <button class="btn" @click=${() => this.navigateToJob(job)}>View log</button>
            <button class="btn btn-abort" ?disabled=${this.busyAction === 'abort-active'} @click=${this.abortActiveJob}>Abort</button>
            <button class="btn btn-icon" disabled title="Move up">▲</button>
            <button class="btn btn-icon" disabled title="Move down">▼</button>
          </div>
        </article>
      `;
    }
    return html`
      <article class="queued-row">
        <div class="device-info clickable" @click=${() => this.navigateToDevice(job.mac)}>
          <strong><span class="position-num">${position}.</span> ${label}</strong>
          <small>${job.firmware_name || 'firmware.ota.bin'}${job.firmware_size ? html` · ${fmtBytes(job.firmware_size)}` : nothing}</small>
        </div>
        <div class="progress-cell">
          <div class="progress-wrap queued"><div class="progress-fill queued" style="width: 0%"></div></div>
          <span class="status-pill queued">Queued</span>
        </div>
        <div class="actions">
          <button class="btn" @click=${() => this.navigateToJob(job)}>View log</button>
          <button class="btn btn-abort" ?disabled=${isBusy} @click=${() => this.abortQueuedJob(job.id)}>Abort</button>
          <button class="btn btn-icon" ?disabled=${isBusy || position <= 2} @click=${() => this.moveUp(job.id)}>▲</button>
          <button class="btn btn-icon" ?disabled=${isBusy || position >= total} @click=${() => this.moveDown(job.id)}>▼</button>
        </div>
      </article>
    `;
  }

  private renderHistoryRow(entry: HistoryDisplayEntry) {
    const job = entry.job!;
    const style = this.statusStyles[entry.status] || '';
    const duration = job.completed_at && job.started_at ? fmtDuration(job.completed_at - job.started_at) : '';
    return html`
      <div class="history-row">
        <span class="type-badge type-${entry.type}">${entry.type.toUpperCase()}</span>
        <span class="device-label clickable" @click=${() => this.navigateToDevice(job.mac)}>${entry.label}</span>
        <span class="device-meta">${job.parsed_version ? `v${job.parsed_version}` : job.firmware_name || ''}</span>
        <span class="status-pill history-status" style=${style}>${entry.statusLabel}</span>
        <span class="timestamp" title=${fmtTime(job.created_at)}>${fmtTimeAgo(job.created_at)}</span>
        <span class="duration">${duration}</span>
        <button class="btn btn-sm" @click=${() => this.navigateToJob(job)}>View log</button>
      </div>
    `;
  }

  private renderCombinedRow(entry: HistoryDisplayEntry) {
    const compile = entry.compileJob!;
    const flash = entry.flashJob!;
    const durC = compile.completed_at && compile.started_at ? fmtDuration(compile.completed_at - compile.started_at) : '';
    const durF = flash.completed_at && flash.started_at ? fmtDuration(flash.completed_at - flash.started_at) : '';
    const style = this.statusStyles[entry.status] || '';
    return html`
      <div class="history-row combined-row">
        <span class="type-badge type-combined">
          <span class="c-compile">COMPILE</span><span class="c-flash">FLASH</span>
        </span>
        <span class="device-label clickable" @click=${() => this.navigateToDevice(compile.mac)}>${entry.label}</span>
        <span class="device-meta">${compile.parsed_version ? `v${compile.parsed_version}` : ''} → OTA upload · ${durC} + ${durF}</span>
        <span class="status-pill history-status" style=${style}>${entry.statusLabel}</span>
        <span class="timestamp" title=${fmtTime(flash.created_at)}>${fmtTimeAgo(flash.created_at)}</span>
        <span class="duration">${durF}</span>
        <button class="btn btn-sm" @click=${() => this.navigateToJob(flash)}>View log</button>
      </div>
    `;
  }

  private renderAbortModal() {
    return html`
      <div class="modal-backdrop" @click=${() => { this.showAbortModal = false; }}>
        <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
          <h3>Other queued jobs waiting</h3>
          <p>Continue running the next queued job after aborting this one?</p>
          <div class="modal-actions">
            <button class="btn continue" @click=${this.abortActiveAndContinue}>Yes, continue queue</button>
            <button class="btn btn-abort" @click=${this.abortActiveAndPause}>No, pause queue</button>
            <button class="btn" @click=${() => { this.showAbortModal = false; }}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host { display: block; color: var(--ink); }
    * { box-sizing: border-box; }
    .queue-page { display: flex; flex-direction: column; gap: 18px; }

    .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
    .page-heading { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
    .eyebrow { color: var(--primary); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    h1 { margin: 0; font-size: 27px; line-height: 1.15; letter-spacing: -.035em; font-weight: 700; }
    .page-heading p { margin: 2px 0 0; max-width: 68ch; color: var(--muted); font-size: 13px; line-height: 1.5; }
    .page-actions { display: flex; gap: 8px; flex-shrink: 0; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 5px;
      min-height: 32px; padding: 0 10px; border: 1px solid var(--line-strong);
      border-radius: 6px; background: var(--surface); color: var(--ink-2);
      font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap;
      transition: background .15s, border-color .15s, color .15s;
    }
    .btn:hover { background: var(--surface-subtle); border-color: var(--faint); }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .btn:disabled { opacity: .5; cursor: default; }
    .btn.pause { min-height: 36px; padding: 0 13px; border-color: #e4d2ae; background: var(--accent-soft); color: #855d15; }
    .btn.pause:hover { background: #f8ecd2; }
    .btn.resume { min-height: 36px; padding: 0 13px; border-color: var(--primary); background: var(--primary); color: #fff; }
    .btn.resume:hover { background: var(--primary-strong); }
    .btn-abort { color: var(--danger); border-color: #e8c8ca; background: var(--danger-soft); }
    .btn-abort:hover { background: #fbe0e1; border-color: #db9fa2; }
    .btn-icon { min-width: 28px; padding: 0; color: var(--muted); }

    .callout { display: flex; flex-direction: column; gap: 2px; padding: 11px 13px; border: 1px solid #e7c2c5; border-radius: 8px; background: var(--danger-soft); color: #8c3037; font-size: 12px; line-height: 1.4; }
    .callout strong { font-size: 12px; }

    .summary-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--line); box-shadow: var(--shadow-sm); }
    .summary-item { display: flex; flex-direction: column; gap: 5px; min-height: 102px; padding: 15px 18px; background: var(--surface); }
    .summary-label { color: var(--muted); font-size: 10px; font-weight: 600; }
    .summary-item strong { color: var(--ink); font-size: 25px; line-height: 1; letter-spacing: -.03em; font-weight: 650; }
    .summary-item .state-running { color: var(--ok); font-size: 17px; letter-spacing: -.01em; }
    .summary-item .state-paused { color: #91671b; font-size: 17px; letter-spacing: -.01em; }
    .summary-note { margin-top: auto; overflow: hidden; text-overflow: ellipsis; color: var(--muted); font-size: 10px; line-height: 1.35; white-space: nowrap; }

    .pipeline-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .panel { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; }
    .panel-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 17px 18px 13px; border-bottom: 1px solid var(--line); }
    .panel-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .panel-title > span:last-child { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .panel-head h2 { margin: 0; font-size: 14px; line-height: 1.3; font-weight: 650; letter-spacing: -.01em; }
    .panel-head p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.35; }
    .pipeline-mark { display: grid; place-items: center; width: 28px; height: 28px; flex: 0 0 28px; border-radius: 7px; font-size: 14px; }
    .pipeline-mark.compile { background: #f3edf9; color: #6c3e91; }
    .pipeline-mark.ota { background: var(--info-soft); color: var(--info); }
    .pipeline-mark.history { background: var(--primary-soft); color: var(--primary); }
    .panel-count { display: inline-grid; place-items: center; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px; background: var(--surface-subtle); color: var(--muted); font-size: 10px; font-weight: 700; }
    .panel-count.active { background: var(--info-soft); color: var(--info); }
    .panel-body { display: flex; flex-direction: column; gap: 9px; padding: 12px 13px; min-height: 144px; }

    .rows { display: flex; flex-direction: column; gap: 8px; }
    article {
      position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 134px auto;
      gap: 10px; align-items: center; border: 1px solid var(--line);
      border-radius: 7px; padding: 11px 11px 11px 13px; background: var(--surface);
    }
    article::before { content: ''; position: absolute; left: 0; top: 9px; bottom: 9px; width: 2px; border-radius: 2px; background: transparent; }
    .compile-active-row::before { background: #8b5bb0; }
    .compile-queued-row::before { background: #c5b2d6; }
    .active-row::before { background: var(--info); }
    .queued-row::before { background: #dfc08d; }
    .device-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .device-info.clickable { cursor: pointer; }
    .device-info.clickable:hover strong { text-decoration: underline; }
    .device-info strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 650; line-height: 1.35; }
    .device-info small { overflow: hidden; text-overflow: ellipsis; color: var(--muted); font-size: 9px; line-height: 1.3; white-space: nowrap; }
    .position-num { color: var(--muted); font-weight: 500; }
    .progress-cell { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
    .progress-wrap { width: 100%; height: 5px; overflow: hidden; border-radius: 3px; background: #edf1ed; }
    .progress-wrap.queued { background: var(--accent-soft); }
    .progress-fill { height: 100%; border-radius: 3px; background: var(--info); transition: width .3s ease; }
    .progress-fill.queued { background: #e2c68f; }
    .percent { color: var(--muted); font-family: var(--font-mono); font-size: 9px; }
    .status-pill { display: inline-flex; align-items: center; width: fit-content; min-height: 20px; padding: 0 6px; border-radius: 4px; font-size: 8px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; }
    .status-pill.flashing { background: var(--info-soft); color: var(--info); }
    .status-pill.compiling { background: #f3edf9; color: #6c3e91; }
    .status-pill.queued { background: var(--accent-soft); color: #8b6117; }
    .actions { display: flex; align-items: center; justify-content: flex-end; gap: 4px; flex-wrap: wrap; }
    .actions .btn { min-height: 27px; padding: 0 7px; font-size: 9px; }
    .actions .btn-icon { min-width: 25px; padding: 0; opacity: .55; }

    .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 132px; padding: 20px; text-align: center; }
    .empty strong { color: var(--ink-2); font-size: 12px; font-weight: 650; }
    .empty p { margin: 4px 0 0; max-width: 38ch; color: var(--muted); font-size: 10px; line-height: 1.5; }

    .history-panel { margin-top: 0; }
    .history-head { align-items: center; flex-wrap: wrap; }
    .history-tools { display: flex; align-items: center; gap: 10px; }
    .history-tabs { display: inline-flex; padding: 2px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-subtle); }
    .history-tab { min-height: 26px; padding: 0 9px; border: 0; border-radius: 4px; background: transparent; color: var(--muted); font: inherit; font-size: 9px; font-weight: 650; cursor: pointer; }
    .history-tab:hover { color: var(--ink); }
    .history-tab.active { background: var(--surface); color: var(--ink); box-shadow: 0 1px 2px rgba(20,40,32,.1); }
    .history-tab:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
    .history-total { color: var(--faint); font-size: 9px; font-weight: 600; white-space: nowrap; }
    .history-panel .panel-body { gap: 0; padding: 0; min-height: 0; }

    .history-table { display: flex; flex-direction: column; }
    .history-row { display: grid; grid-template-columns: 72px minmax(150px, 1fr) 96px 108px 75px 58px auto; gap: 10px; align-items: center; min-height: 48px; padding: 7px 16px; border-bottom: 1px solid var(--line); font-size: 11px; }
    .history-row:last-child { border-bottom: 0; }
    .history-row:hover { background: #fbfcfa; }
    .history-row.combined-row { background: #fbfcfa; }
    .type-badge { display: inline-flex; align-items: center; justify-content: center; width: fit-content; min-width: 48px; padding: 2px 5px; border-radius: 3px; font-size: 8px; font-weight: 750; letter-spacing: .05em; text-transform: uppercase; }
    .type-flash { background: var(--info-soft); color: var(--info); }
    .type-compile { background: #f3edf9; color: #6c3e91; }
    .type-combined { display: flex; align-items: center; padding: 0; overflow: hidden; border-radius: 3px; }
    .type-combined span { padding: 2px 4px; font-size: 7px; font-weight: 750; white-space: nowrap; }
    .type-combined .c-compile { background: #f3edf9; color: #6c3e91; }
    .type-combined .c-flash { background: var(--info-soft); color: var(--info); }
    .device-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); font-size: 11px; font-weight: 600; }
    .device-label.clickable { cursor: pointer; }
    .device-label.clickable:hover { text-decoration: underline; }
    .device-meta { overflow: hidden; text-overflow: ellipsis; color: var(--muted); font-size: 9px; white-space: nowrap; }
    .history-status { font-size: 8px; }
    .timestamp, .duration { color: var(--muted); font-size: 9px; white-space: nowrap; }
    .history-row .btn { min-height: 27px; padding: 0 9px; font-size: 9px; justify-self: end; }
    .show-more { display: flex; justify-content: center; padding: 12px; border-top: 1px solid var(--line); }
    .show-more button { min-height: 30px; padding: 0 12px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--muted); font: inherit; font-size: 10px; font-weight: 600; cursor: pointer; }
    .show-more button:hover { background: var(--surface-subtle); color: var(--ink); }

    .modal-backdrop { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(13,30,26,.58); }
    .modal { width: min(430px, 100%); padding: 22px; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); box-shadow: 0 24px 60px rgba(10,25,20,.25); }
    .modal h3 { margin: 0 0 6px; color: var(--ink); font-size: 16px; font-weight: 650; letter-spacing: -.015em; }
    .modal p { margin: 0 0 18px; color: var(--muted); font-size: 12px; line-height: 1.5; }
    .modal-actions { display: flex; flex-wrap: wrap; gap: 7px; }
    .modal-actions .btn { min-height: 34px; padding: 0 11px; }
    .btn.continue { background: var(--primary); border-color: var(--primary); color: #fff; }
    .btn.continue:hover { background: var(--primary-strong); }

    @media (max-width: 1120px) {
      .pipeline-grid { grid-template-columns: 1fr; }
      .history-row { grid-template-columns: 66px minmax(130px, 1fr) 88px 96px 68px 52px auto; gap: 8px; }
    }
    @media (max-width: 900px) {
      .summary-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .history-head { align-items: flex-start; flex-direction: column; }
      .history-tools { width: 100%; justify-content: space-between; }
    }
    @media (max-width: 760px) {
      .queue-page { gap: 14px; }
      .page-head { align-items: flex-start; flex-direction: column; gap: 14px; }
      h1 { font-size: 24px; }
      .page-actions { width: 100%; }
      .page-actions .btn { flex: 1; }
      .summary-item { min-height: 92px; padding: 13px 14px; }
      .summary-item strong { font-size: 22px; }
      .panel-head { padding: 15px 14px 12px; }
      .panel-body { padding: 10px; }
      article { grid-template-columns: minmax(0, 1fr) auto; }
      .progress-cell { grid-column: 1 / -1; order: 3; }
      .actions { grid-row: 1; grid-column: 2; }
      .history-row { grid-template-columns: 1fr auto; grid-template-areas: 'type time' 'label label' 'meta status' 'duration action'; gap: 4px 8px; padding: 10px 13px; }
      .history-row .type-badge { grid-area: type; }
      .history-row .device-label { grid-area: label; white-space: normal; font-size: 12px; }
      .history-row .device-meta { grid-area: meta; white-space: normal; }
      .history-row .history-status { grid-area: status; justify-self: end; }
      .history-row .timestamp { grid-area: time; text-align: right; }
      .history-row .duration { grid-area: duration; }
      .history-row .btn { grid-area: action; }
    }
    @media (max-width: 420px) {
      .summary-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .summary-item { min-height: 82px; }
      .summary-note { white-space: normal; }
      .pipeline-grid { gap: 12px; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'esp-queue-page': EspQueuePage;
  }
}
