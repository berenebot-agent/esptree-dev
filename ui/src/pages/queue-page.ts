import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { OtaJob, QueueResponse, CompileQueueResponse, api, fmtBytes, fmtTime, fmtDuration, fmtTimeAgo } from '../api/client';
import { shared, historyStyles } from '../styles/shared';
import { icon } from '../styles/icons';
import { jobChip } from '../lib/job-status';

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
const FLASH_RESULT_STATUSES = new Set(['success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch', 'rejoined_unverified']);

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

  render() {
    const data = this.queueData;
    const hasActive = !!data?.active_job && !FLASH_RESULT_STATUSES.has(data.active_job.status);
    const queued = data?.queued_jobs ?? [];
    const paused = data?.paused ?? false;
    const uploadCount = queued.length + (hasActive ? 1 : 0);

    const compileActive = this.compileData?.active_job ?? null;
    const compileQueued = this.compileData?.queued_jobs ?? [];
    const buildCount = compileQueued.length + (compileActive ? 1 : 0);

    const displayEntries = this.buildDisplayEntries();
    const shownEntries = displayEntries.slice(0, this.historyLimit);
    const totalHistory = displayEntries.length;

    return html`
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Jobs</h1>
            <p class="sub">Builds and uploads run one at a time, so the mesh and the build host are never overloaded.</p>
          </div>
          <div class="page-actions">
            ${paused
              ? html`<button class="btn primary" ?disabled=${this.busyAction === 'resume'} @click=${this.resumeQueue}>${icon('play')}Resume uploads</button>`
              : html`<button class="btn" ?disabled=${this.busyAction === 'pause'} @click=${this.pauseQueue}>${icon('pause')}Pause uploads</button>`}
          </div>
        </div>

        ${this.error ? html`<div class="notice danger" role="alert">${icon('alert')}<span><strong>That didn't work.</strong> ${this.error}</span></div>` : nothing}
        ${paused ? html`<div class="notice warn" role="status">${icon('pause')}<span><strong>Uploads are paused.</strong> Queued uploads wait until you resume. Builds keep running.</span></div>` : nothing}

        <div class="queues">
          <section class="card">
            <div class="card-head">
              <h2>Builds</h2>
              <span class="chip ${compileActive ? 'info' : ''}">${this.countLabel(compileActive ? 1 : 0, compileQueued.length)}</span>
            </div>
            ${buildCount === 0
              ? html`<p class="none">No builds running. Compile from a remote's YAML page.</p>`
              : html`<ul class="hist">
                  ${compileActive ? this.renderCompileRow(compileActive, true) : nothing}
                  ${compileQueued.map((job) => this.renderCompileRow(job, false))}
                </ul>`}
          </section>

          <section class="card">
            <div class="card-head">
              <h2>Uploads</h2>
              <span class="chip ${hasActive ? 'info' : paused && uploadCount ? 'warn' : ''}">${this.countLabel(hasActive ? 1 : 0, queued.length)}</span>
            </div>
            ${uploadCount === 0
              ? html`<p class="none">Nothing to upload. Start one from a remote's page or its YAML.</p>`
              : html`<ul class="hist">
                  ${hasActive && data!.active_job ? this.renderOtaRow(data!.active_job, 1, uploadCount, true) : nothing}
                  ${queued.map((job, i) => this.renderOtaRow(job, i + (hasActive ? 2 : 1), uploadCount, false))}
                </ul>`}
          </section>
        </div>

        <section class="card">
          <div class="card-head">
            <h2>History</h2>
            <div class="segmented" role="group" aria-label="Show">
              ${(['all', 'flash', 'compile'] as const).map((value) => html`
                <button aria-pressed=${this.historyFilter === value ? 'true' : 'false'} @click=${() => { this.historyFilter = value; this.historyLimit = 10; }}>${value === 'all' ? 'All' : value === 'flash' ? 'Uploads' : 'Builds'}</button>
              `)}
            </div>
          </div>
          ${totalHistory === 0
            ? html`<div class="empty">${icon('jobs')}<strong>No finished jobs yet</strong><p>Completed builds and uploads appear here, with their logs and retained firmware for rollback.</p></div>`
            : html`
                <ul class="hist">
                  ${shownEntries.map((entry) => entry.type === 'combined' ? this.renderCombinedRow(entry) : this.renderHistoryRow(entry))}
                </ul>
                ${totalHistory > this.historyLimit
                  ? html`<div class="more"><button class="btn sm text" @click=${() => { this.historyLimit += 10; }}>Show ${Math.min(10, totalHistory - this.historyLimit)} older</button></div>`
                  : nothing}
              `}
        </section>

        ${this.showAbortModal ? this.renderAbortModal() : nothing}
      </div>
    `;
  }

  private countLabel(running: number, waiting: number): string {
    if (!running && !waiting) return 'Idle';
    return [running ? `${running} running` : '', waiting ? `${waiting} queued` : ''].filter(Boolean).join(' · ');
  }

  private deviceLink(mac: string, label: string) {
    return html`<a class="dev" href=${`#/device/${encodeURIComponent(mac)}`}>${label}</a>`;
  }

  private renderCompileRow(job: OtaJob, isActive: boolean) {
    const isBusy = this.busyJob === job.id;
    return html`
      <li>
        <span class="what">
          <strong>${this.deviceLink(job.mac, this.labelFor(job))}</strong>
          ${isActive ? html`<span class="progress indeterminate"><span></span></span>` : html`<small>Waiting for the build host</small>`}
        </span>
        ${jobChip(isActive ? 'compiling' : 'compile_queued')}
        <span></span>
        <span class="row-actions">
          <button class="btn sm text" @click=${() => this.navigateToJob(job)}>Log</button>
          <button class="btn sm danger" ?disabled=${isBusy} @click=${() => this.abortCompileJob(job.id)}>${isActive ? 'Cancel' : 'Remove'}</button>
        </span>
      </li>
    `;
  }

  private renderOtaRow(job: OtaJob, position: number, total: number, isActive: boolean) {
    const isBusy = this.busyJob === job.id;
    const label = this.labelFor(job);
    if (isActive) {
      const percent = job.percent ?? 0;
      return html`
        <li>
          <span class="what">
            <strong>${this.deviceLink(job.mac, label)} <span class="pct">${percent}%</span></strong>
            <span class="progress" role="progressbar" aria-label=${`Upload to ${label}`} aria-valuenow=${percent} aria-valuemin="0" aria-valuemax="100"><span style="width:${percent}%"></span></span>
            <small>${job.firmware_name || 'firmware.ota.bin'}${job.bridge_state ? ` · bridge ${job.bridge_state.replaceAll('_', ' ')}` : ''}</small>
          </span>
          ${jobChip(job.status)}
          <span></span>
          <span class="row-actions">
            <button class="btn sm text" @click=${() => this.navigateToJob(job)}>Log</button>
            <button class="btn sm danger" ?disabled=${this.busyAction === 'abort-active'} @click=${this.abortActiveJob}>Abort</button>
          </span>
        </li>
      `;
    }
    return html`
      <li>
        <span class="what">
          <strong><span class="pos">${position}</span>${this.deviceLink(job.mac, label)}</strong>
          <small>${job.firmware_name || 'firmware.ota.bin'}${job.firmware_size ? ` · ${fmtBytes(job.firmware_size)}` : ''}</small>
        </span>
        ${jobChip('queued')}
        <span class="reorder">
          <button class="btn sm icon text" aria-label=${`Move ${label} up`} ?disabled=${isBusy || position <= 2} @click=${() => this.moveUp(job.id)}>${icon('arrowUp')}</button>
          <button class="btn sm icon text" aria-label=${`Move ${label} down`} ?disabled=${isBusy || position >= total} @click=${() => this.moveDown(job.id)}>${icon('arrowDown')}</button>
        </span>
        <span class="row-actions">
          <button class="btn sm text" @click=${() => this.navigateToJob(job)}>Log</button>
          <button class="btn sm danger" ?disabled=${isBusy} @click=${() => this.abortQueuedJob(job.id)}>Remove</button>
        </span>
      </li>
    `;
  }

  private typeChip(type: HistoryDisplayEntry['type']) {
    return html`<span class="type">${type === 'compile' ? 'Build' : type === 'flash' ? 'Upload' : 'Build + upload'}</span>`;
  }

  private renderHistoryRow(entry: HistoryDisplayEntry) {
    const job = entry.job!;
    const duration = job.completed_at && job.started_at ? fmtDuration(job.completed_at - job.started_at) : '';
    return html`
      <li>
        <span class="what">
          <strong>${this.deviceLink(job.mac, entry.label)}</strong>
          <small>${this.typeChip(entry.type)}${[job.parsed_version ? `v${job.parsed_version}` : job.firmware_name || '', duration ? `took ${duration}` : ''].filter(Boolean).map((t) => html` · ${t}`)}</small>
          ${job.error_msg && FLASH_RESULT_STATUSES.has(entry.status) && entry.status !== 'success' ? html`<small class="err">${job.error_msg}</small>` : nothing}
        </span>
        ${jobChip(entry.status)}
        <span class="when" title=${fmtTime(job.created_at)}>${fmtTimeAgo(job.created_at)}</span>
        <span class="row-actions"><button class="btn sm text" @click=${() => this.navigateToJob(job)}>Log</button></span>
      </li>
    `;
  }

  private renderCombinedRow(entry: HistoryDisplayEntry) {
    const compile = entry.compileJob!;
    const flash = entry.flashJob!;
    const durC = compile.completed_at && compile.started_at ? fmtDuration(compile.completed_at - compile.started_at) : '';
    const durF = flash.completed_at && flash.started_at ? fmtDuration(flash.completed_at - flash.started_at) : '';
    return html`
      <li>
        <span class="what">
          <strong>${this.deviceLink(compile.mac, entry.label)}</strong>
          <small>${this.typeChip('combined')}${compile.parsed_version ? ` · v${compile.parsed_version}` : ''}${durC || durF ? ` · build ${durC || '—'}, upload ${durF || '—'}` : ''}</small>
          ${flash.error_msg && entry.status !== 'success' ? html`<small class="err">${flash.error_msg}</small>` : nothing}
        </span>
        ${jobChip(entry.status)}
        <span class="when" title=${fmtTime(flash.created_at)}>${fmtTimeAgo(flash.created_at)}</span>
        <span class="row-actions"><button class="btn sm text" @click=${() => this.navigateToJob(flash)}>Log</button></span>
      </li>
    `;
  }

  private renderAbortModal() {
    return html`
      <div class="scrim" @click=${(e: Event) => { if (e.target === e.currentTarget) this.showAbortModal = false; }}>
        <section class="modal" role="dialog" aria-modal="true" aria-labelledby="abort-title">
          <h2 id="abort-title">Other uploads are waiting</h2>
          <p>After aborting this upload, should the next queued one start, or should uploads pause?</p>
          <div class="modal-actions">
            <button class="btn" @click=${() => { this.showAbortModal = false; }}>Cancel</button>
            <button class="btn" @click=${this.abortActiveAndPause}>Abort and pause</button>
            <button class="btn primary" @click=${this.abortActiveAndContinue}>Abort, keep going</button>
          </div>
        </section>
      </div>
    `;
  }

  static styles = [shared, historyStyles, css`
    :host { display: block; }
    .page-actions .btn svg { width: 18px; height: 18px; }
    .queues { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: start; }
    .card { overflow: hidden; }
    .none { padding: 12px 16px 16px; color: var(--muted); }
    .hist li { grid-template-columns: minmax(0, 1fr) auto auto auto; }
    .hist .what .progress { margin: 4px 0 2px; }
    .dev { color: inherit; text-decoration: none; }
    .dev:hover { color: var(--primary); text-decoration: underline; }
    .pct { margin-left: 6px; color: var(--info); font-weight: 500; font-variant-numeric: tabular-nums; }
    .pos {
      display: inline-grid; place-items: center; min-width: 20px; height: 20px; margin-right: 8px;
      border-radius: 50%; background: var(--surface-subtle); color: var(--muted); font-size: var(--text-xs); font-weight: 500;
    }
    .reorder { display: flex; gap: 2px; }
    .reorder svg, .hist .btn svg { width: 16px; height: 16px; }
    .type { color: var(--ink-2); font-weight: 500; }
    .more { display: flex; justify-content: center; padding: 8px; border-top: 1px solid var(--line); }
    .empty svg { width: 32px; height: 32px; }

    .scrim { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: var(--scrim); }
    .modal { display: grid; gap: 12px; width: min(480px, 100%); padding: 22px; border-radius: var(--radius-lg); background: var(--surface-raised); box-shadow: var(--shadow-md); }
    .modal h2 { font-size: var(--text-xl); font-weight: 500; }
    .modal p { color: var(--ink-2); }
    .modal-actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin-top: 4px; }

    @media (max-width: 960px) {
      .queues { grid-template-columns: minmax(0, 1fr); }
    }
    @media (max-width: 640px) {
      .hist li { grid-template-columns: minmax(0, 1fr) auto; }
    }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    'esp-queue-page': EspQueuePage;
  }
}
