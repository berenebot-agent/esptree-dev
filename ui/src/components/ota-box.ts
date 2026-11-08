import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { OtaJob, PreflightComparison, TopologyNode, api, fmtBytes, fmtTime, normalizeMac } from '../api/client';
import './ota-progress';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';

const TERMINAL_STATUSES = new Set(['success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch', 'rejoined_unverified']);

@customElement('esp-ota-box')
export class EspOtaBox extends LitElement {
  @property({ type: String }) mac = '';
  @property({ type: Object }) node!: TopologyNode;
  @property({ type: Boolean }) showEditYaml = false;
  @property({ type: Object }) currentJob: OtaJob | null = null;
  @state() private pendingJob: OtaJob | null = null;
  @state() preflight: PreflightComparison | null = null;
  @state() private acceptedWarnings = false;
  @state() private busy = false;
  @state() private error = '';
  
  @state() private showAbortModal = false;

  private async upload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.busy = true;
    this.error = '';
    this.acceptedWarnings = false;
    try {
      const result = await api.uploadFirmware(this.mac, file);
      this.pendingJob = result.job;
      this.preflight = result.preflight || null;
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
      input.value = '';
    }
  }

private async start(): Promise<void> {
    if (!this.pendingJob) return;
    this.busy = true;
    this.error = '';
    try {
      const result = await api.startOta(this.pendingJob.id);
      if (result.job.status === 'queued') {
        this.pendingJob = null;
        this.preflight = null;
        this.dispatchChanged();
      } else {
        this.pendingJob = null;
        this.preflight = null;
        this.dispatchChanged();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private goToConfig(): void {
    window.location.hash = `/device/${encodeURIComponent(this.mac)}/config`;
  }

  private async abort(): Promise<void> {
    const pendingId = this.pendingJob?.id ?? (this.currentJob?.status === 'pending_confirm' ? this.currentJob?.id : null);
    if (pendingId) {
      this.pendingJob = null;
      this.preflight = null;
      this.acceptedWarnings = false;
      this.busy = true;
      this.error = '';
      try {
        await api.cancelPending(pendingId);
        this.dispatchChanged();
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error);
      } finally {
        this.busy = false;
      }
      return;
    }
    try {
      const queue = await api.getQueue();
      if (queue.count > 0) {
        this.showAbortModal = true;
        return;
      }
    } catch { /* if queue check fails, proceed with normal abort */ }
    this.pendingJob = null;
    this.preflight = null;
    this.acceptedWarnings = false;
    this.busy = true;
    this.error = '';
    try {
      await api.abortOta();
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private async abortQueued(): Promise<void> {
    if (!this.currentJob) return;
    this.busy = true;
    this.error = '';
    try {
      await api.abortQueuedJob(this.currentJob.id);
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private isJobDismissed(jobId: number): boolean {
    return sessionStorage.getItem(`esp_tree_ota_dismissed_${jobId}`) === '1';
  }

  private dismissAndClear(): void {
    if (this.currentJob?.id != null) {
      sessionStorage.setItem(`esp_tree_ota_dismissed_${this.currentJob.id}`, '1');
    }
    this.requestUpdate();
  }

  private dispatchChanged(): void {
    this.dispatchEvent(new CustomEvent('ota-changed', { bubbles: true, composed: true }));
  }

  render() {
    const activeForThis = this.currentJob && normalizeMac(this.currentJob.mac) === normalizeMac(this.mac);
    const terminalJob = activeForThis && this.currentJob && TERMINAL_STATUSES.has(this.currentJob.status) ? this.currentJob : null;
    const isCompileQueued = activeForThis && this.currentJob?.status === 'compile_queued';
    const isCompiling = activeForThis && this.currentJob?.status === 'compiling';
    const isQueued = activeForThis && this.currentJob?.status === 'queued';
    const isFlashing = activeForThis && this.currentJob && !isQueued && !isCompileQueued && !isCompiling && this.currentJob.status !== 'pending_confirm' && !TERMINAL_STATUSES.has(this.currentJob.status);
    const pending = this.pendingJob;
    const canStart = !!pending && (!this.preflight?.has_warnings || this.acceptedWarnings) && !this.busy;
    const showResult = !!terminalJob && !this.isJobDismissed(terminalJob.id);

    return html`
      <section class="ota">
        <div class="card-head">
          <h2>Firmware</h2>
          ${activeForThis && this.currentJob && !terminalJob && !showResult && !isQueued && !isCompileQueued && !isCompiling && !pending && !isFlashing ? html`<button class="btn sm danger" ?disabled=${this.busy} @click=${this.abort}>Abort</button>` : nothing}
        </div>

        ${showResult && terminalJob
          ? this.renderFlashResult(terminalJob)
          : html`
              ${isCompileQueued && this.currentJob
                ? this.renderCompileQueued(this.currentJob)
                : nothing}
              ${isCompiling && this.currentJob
                ? this.renderCompiling(this.currentJob)
                : nothing}
              ${isQueued && this.currentJob
                ? this.renderQueued(this.currentJob)
                : isFlashing && this.currentJob
                  ? html`<esp-ota-progress .job=${this.currentJob} .showAbort=${true} @abort=${this.abort}></esp-ota-progress>`
                  : nothing}

              ${!pending && !isQueued && !isFlashing && !isCompileQueued && !isCompiling
                ? html`
                    ${this.renderRunning()}
                    <div class="idle-controls">
                      ${this.showEditYaml ? html`<button class="btn" @click=${this.goToConfig}>${icon('code')}Edit YAML &amp; compile</button>` : nothing}
                      <label class="btn upload ${this.busy ? 'busy' : ''}">
                        <input type="file" accept=".ota.bin" ?disabled=${this.busy} @change=${this.upload} />
                        ${this.busy ? html`<span class="spinner"></span>Reading firmware…` : html`${icon('upload')}Upload .ota.bin`}
                      </label>
                    </div>
                  `
                : nothing}

              ${pending ? this.renderPending(pending, canStart) : nothing}
            `}
        ${this.showAbortModal ? this.renderAbortModal() : nothing}
        ${this.error ? html`<div class="notice danger error" role="alert">${icon('alert')}<span>${this.error}</span></div>` : nothing}
      </section>
    `;
  }

  private renderRunning() {
    const n = this.node;
    if (!n) return nothing;
    const version = n.project_version || n.firmware_version;
    return html`
      <dl class="facts running">
        <div><dt>Running</dt><dd>${version || 'Unknown'}${n.project_name ? html` <span class="sub">${n.project_name}</span>` : nothing}</dd></div>
        <div><dt>Built</dt><dd>${n.firmware_build_date || '—'}</dd></div>
        ${n.firmware_version && n.project_version ? html`<div><dt>ESPHome</dt><dd>${n.firmware_version}</dd></div>` : nothing}
      </dl>
    `;
  }

  private renderQueued(job: OtaJob) {
    const position = job.queue_position ?? 1;
    return html`
      <div class="queued-wrapper">
        <esp-ota-progress .job=${job}></esp-ota-progress>
        <div class="queued-overlay">
          <span class="queued-icon">${icon('clock')}</span>
          <strong>Upload queued</strong>
          <small>Position ${position} in the upload queue</small>
          <button class="btn sm danger" ?disabled=${this.busy} @click=${this.abortQueued}>Abort</button>
        </div>
      </div>
    `;
  }

  private renderCompileQueued(job: OtaJob) {
    const position = (job.queue_position ?? 0) + 1;
    return html`
      <div class="queued-wrapper">
        <div class="queued-overlay compile-overlay">
          <span class="queued-icon">${icon('clock')}</span>
          <strong>Build queued</strong>
          <small>Position ${position} in the build queue</small>
          <button class="btn sm danger" ?disabled=${this.busy} @click=${this.abortCompileQueuedJob}>Cancel</button>
        </div>
      </div>
    `;
  }

  private renderCompiling(_job: OtaJob) {
    return html`
      <div class="queued-wrapper">
        <div class="queued-overlay compile-overlay compiling-overlay">
          <span class="queued-icon"><span class="spinner"></span></span>
          <strong>Building firmware</strong>
          <a class="view-logs-link" href=${`#/device/${encodeURIComponent(this.mac)}/config`}>View build log</a>
          <button class="btn sm danger" ?disabled=${this.busy} @click=${this.cancelCompile}>Cancel</button>
        </div>
      </div>
    `;
  }

  private async abortCompileQueuedJob(): Promise<void> {
    if (!this.currentJob) return;
    this.busy = true;
    this.error = '';
    try {
      await api.cancelCompile(this.mac);
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private async cancelCompile(): Promise<void> {
    this.busy = true;
    this.error = '';
    try {
      await api.cancelCompile(this.mac);
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private renderAbortModal() {
    return html`
      <div class="modal-backdrop" @click=${() => { this.showAbortModal = false; this.pendingJob = null; this.preflight = null; }}>
        <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
          <h3>Other uploads are waiting</h3>
          <p>After aborting this upload, should the next queued job start, or should the queue pause?</p>
          <div class="actions">
            <button class="btn primary" @click=${this.abortAndContinue}>Abort, keep queue running</button>
            <button class="btn" @click=${this.abortAndPause}>Abort and pause queue</button>
            <button @click=${() => { this.showAbortModal = false; this.pendingJob = null; this.preflight = null; }}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  private async abortAndContinue(): Promise<void> {
    this.showAbortModal = false;
    this.pendingJob = null;
    this.preflight = null;
    this.busy = true;
    try {
      await api.abortOta();
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private async abortAndPause(): Promise<void> {
    this.showAbortModal = false;
    this.pendingJob = null;
    this.preflight = null;
    this.busy = true;
    try {
      await api.abortOta();
      await api.pauseQueue();
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busy = false;
    }
  }

  private renderPending(job: OtaJob, canStart: boolean) {
    const p = this.preflight;
    const jobLabel = job.parsed_esphome_name || job.esphome_name || job.firmware_name || 'Selected firmware';
    const nameBadge = p?.name.match ? 'match' : 'mismatch';
    const nameBadgeClass = `chip ${nameBadge === 'match' ? 'ok' : 'danger'}`;
    const nameBadgeText = p?.name.match ? 'Match' : 'Different';

    const chipBadge = p?.chip.match ? 'match' : 'mismatch';
    const chipBadgeClass = `chip ${chipBadge === 'match' ? 'ok' : 'danger'}`;
    const chipBadgeText = p?.chip.match ? 'Match' : 'Different';

    const dateStatus = p?.build_date.status || 'unknown';
    let dateBadgeClass = 'chip ';
    let dateBadgeText = '';
    if (dateStatus === 'same') {
      dateBadgeClass += '';
      dateBadgeText = 'Same build';
    } else if (dateStatus === 'newer') {
      dateBadgeClass += 'ok';
      dateBadgeText = `Newer · ${p?.build_date.delta}`;
    } else if (dateStatus === 'older') {
      dateBadgeClass += 'warn';
      dateBadgeText = `Older · ${p?.build_date.delta}`;
    }

    if (p?.metadata_unavailable) {
      return html`
        <div class="pending">
          <h3>${jobLabel}</h3>
          <p class="meta-unavailable">ESP8266 Arduino builds carry no metadata, so name, date and chip can't be checked before flashing.</p>
          <div class="meta-info">
            <span>Size: ${fmtBytes(job.firmware_size)}</span>
            <span>MD5: ${job.firmware_md5 || '-'}</span>
          </div>
          <div class="actions">
            <button class="btn primary" ?disabled=${!canStart} @click=${this.start}>Flash</button>
            <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="pending">
        <h3>${jobLabel}</h3>
        <table class="compare-table">
          <thead>
            <tr><th></th><th>On the remote</th><th>New firmware</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${p?.name.current || '-'}</td>
              <td>${p?.name.new || '-'}<br><span class="${nameBadgeClass}">${nameBadgeText}</span></td>
            </tr>
            <tr>
              <td>Build date</td>
              <td>${p?.build_date.current || '-'}</td>
              <td>${p?.build_date.new || '-'}<br><span class="${dateBadgeClass}">${dateBadgeText}</span></td>
            </tr>
            <tr>
              <td>Chip</td>
              <td>${p?.chip.current || '-'}</td>
              <td>${p?.chip.new || '-'}<br><span class="${chipBadgeClass}">${chipBadgeText}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${fmtBytes(job.firmware_size)}</span>
          <span>MD5: ${job.firmware_md5 || '-'}</span>
        </div>
        ${p?.has_warnings
          ? html`
              <div class="warnings">
                ${p.warnings.map((warning) => html`<p>${warning}</p>`)}
                <label>
                  <input type="checkbox" .checked=${this.acceptedWarnings} @change=${(event: Event) => (this.acceptedWarnings = (event.target as HTMLInputElement).checked)} />
                  Flash anyway, I understand the warnings
                </label>
              </div>
            `
          : nothing}
        <div class="actions">
          <button class="btn primary" ?disabled=${!canStart} @click=${this.start}>Flash</button>
          <button class="btn" ?disabled=${this.busy} @click=${this.abort}>Cancel</button>
        </div>
      </div>
    `;
  }

  private renderFlashResult(job: OtaJob) {
    const isSuccess = job.status === 'success';
    // A flash that delivered the image but could not prove which build the device
    // booted is NOT a failure: the transfer succeeded and the device came back. It
    // used to fall into the `failure` branch below purely because its status was not
    // `success`, so the card showed a red banner and the user read "your update
    // failed" while the add-on's own log said the upload had landed fine.
    const isUnverified = job.status === 'rejoined_unverified';
    const resultClass = isSuccess ? 'success' : isUnverified ? 'unverified' : 'failure';
    const resultLabel = isSuccess
      ? 'Update complete'
      : isUnverified
        ? 'Delivered \u2014 build unconfirmed'
        : (() => { const t = job.status.replaceAll('_', ' '); return t.charAt(0).toUpperCase() + t.slice(1); })();
    const resultMessage = isSuccess
      ? 'The device accepted the new firmware and rejoined the network.'
      : isUnverified
        ? (job.error_msg || 'The device accepted the firmware and rejoined, but its reported build could not confirm which image it booted.')
        : job.error_msg || 'The firmware update did not complete successfully.';

    const jobName = job.parsed_esphome_name || job.esphome_name || job.firmware_name || '-';
    const nodeName = this.node.esphome_name || '-';
    const nameMatch = jobName === nodeName || (jobName === '-' && nodeName === '-');

    const jobDate = job.parsed_build_date || '-';
    const nodeDate = this.node.firmware_build_date || '-';
    const dateMatch = jobDate === nodeDate || (jobDate === '-' && nodeDate === '-');

    const jobChip = job.parsed_chip_name || '-';
    const nodeChip = this.node.chip_name || '-';
    const chipMatch = jobChip === nodeChip || (jobChip === '-' && nodeChip === '-');

    const jobMd5 = job.firmware_md5 || '-';
    const nodeMd5 = this.node.firmware_md5 || '-';
    const md5Match = jobMd5 === nodeMd5 || (jobMd5 === '-' && nodeMd5 === '-');

    if (isSuccess) {
      return html`
        <div class="flash-result ${resultClass}">
          <div class="result-banner">
            <span class="result-icon">${icon('checkCircle')}</span>
            <span class="result-label">${resultLabel}</span>
          </div>
          <h3>${jobName}</h3>
          <p class="result-message">${resultMessage}</p>
          <div class="actions">
            <button class="btn primary" @click=${this.dismissAndClear}>Done</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="flash-result ${resultClass}">
        <div class="result-banner">
          <span class="result-icon">${isUnverified ? icon('checkCircle') : icon('alert')}</span>
          <span class="result-label">${resultLabel}</span>
        </div>
        <h3>${jobName}</h3>
        <p class="result-message">${resultMessage}</p>
        <table class="compare-table">
          <thead>
            <tr><th></th><th>Flashed</th><th>${isUnverified ? 'Device reports' : 'Remote now'}</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>${jobName}</td>
              <td>${nodeName} ${!nameMatch ? html`<span class="chip warn">Changed</span>` : nothing}</td>
            </tr>
            <tr>
              <td>Build date</td>
              <td>${jobDate}</td>
              <td>${nodeDate} ${!dateMatch ? html`<span class="chip warn">Changed</span>` : nothing}</td>
            </tr>
            <tr>
              <td>Chip</td>
              <td>${jobChip}</td>
              <td>${nodeChip} ${!chipMatch ? html`<span class="chip warn">Changed</span>` : nothing}</td>
            </tr>
            <tr>
              <td>MD5</td>
              <td>${jobMd5}</td>
              <td>${nodeMd5} ${!md5Match ? html`<span class="chip warn">Changed</span>` : nothing}</td>
            </tr>
          </tbody>
        </table>
        <div class="meta-info">
          <span>Size: ${fmtBytes(job.firmware_size)}</span>
          ${job.completed_at ? html`<span>Completed: ${fmtTime(job.completed_at)}</span>` : nothing}
        </div>
        <div class="actions">
          <button class="btn primary" @click=${this.dismissAndClear}>Done</button>
        </div>
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .ota { display: grid; }
    .card-head { border-bottom: 0; padding-bottom: 4px; }
    .ota > :not(.card-head) { margin: 0 16px 16px; }
    .running { margin-bottom: 16px; }
    .running .sub { color: var(--muted); font-size: var(--text-sm); }
    .idle-controls { display: flex; flex-wrap: wrap; gap: 8px; }
    .upload { position: relative; overflow: hidden; }
    .upload input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .upload:focus-within { outline: 2px solid var(--primary); outline-offset: 2px; }
    .upload .spinner { width: 14px; height: 14px; }

    .queued-wrapper { display: grid; gap: 12px; }
    .queued-overlay {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-template-areas: 'icon title action' 'icon sub action';
      align-items: center;
      column-gap: 12px;
      padding: 14px 16px;
      border-top: 1px solid var(--line);
      padding-left: 0; padding-right: 0;
    }
    .compiling-overlay { grid-template-areas: 'icon title action' 'icon sub action'; }
    .queued-icon { grid-area: icon; display: grid; place-items: center; width: 32px; height: 32px; color: var(--accent); }
    .compiling-overlay .queued-icon { color: var(--info); }
    .queued-icon svg { width: 24px; height: 24px; }
    .queued-overlay strong { grid-area: title; font-weight: 500; }
    .queued-overlay small, .queued-overlay .view-logs-link { grid-area: sub; color: var(--muted); font-size: var(--text-sm); }
    .queued-overlay .view-logs-link { color: var(--primary); }
    .queued-overlay .btn { grid-area: action; }

    .pending, .flash-result { display: grid; gap: 12px; }
    .pending h3, .flash-result h3 { font-size: var(--text-lg); font-weight: 500; }
    .compare-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
    .compare-table th { text-align: left; font-weight: 500; color: var(--muted); font-size: var(--text-xs); padding: 6px 8px; border-bottom: 1px solid var(--line); }
    .compare-table td { padding: 8px; border-bottom: 1px solid var(--line); vertical-align: top; overflow-wrap: anywhere; }
    .compare-table td:first-child { color: var(--muted); white-space: nowrap; }
    .compare-table .chip { margin-top: 4px; }
    .meta-info { display: flex; flex-wrap: wrap; gap: 4px 16px; color: var(--muted); font-size: var(--text-sm); overflow-wrap: anywhere; }
    .meta-unavailable { color: var(--muted); }
    .warnings { display: grid; gap: 8px; padding: 12px 14px; border-radius: var(--radius-md); background: var(--accent-soft); color: var(--ink); }
    .warnings label { display: flex; gap: 8px; align-items: center; font-weight: 500; }
    .warnings input { accent-color: var(--primary); width: 16px; height: 16px; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }

    .result-banner { display: flex; align-items: center; gap: 8px; font-weight: 500; }
    .result-icon { display: inline-flex; }
    .result-icon svg { width: 22px; height: 22px; }
    .flash-result.success .result-banner { color: var(--ok); }
    .flash-result.unverified .result-banner { color: var(--accent); }
    .flash-result.failure .result-banner { color: var(--danger); }
    .result-message { color: var(--ink-2); }

    .modal-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: var(--scrim); }
    .modal { display: grid; gap: 12px; width: min(460px, 100%); padding: 22px; border-radius: var(--radius-lg); background: var(--surface-raised); box-shadow: var(--shadow-md); }
    .modal h3 { font-size: var(--text-xl); font-weight: 500; }
    .modal p { color: var(--ink-2); }
    .modal .actions { justify-content: flex-end; margin-top: 4px; }
  `];
}
