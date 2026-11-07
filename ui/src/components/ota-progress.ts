import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { OtaJob, fmtBytes, fmtTime } from '../api/client';
import { shared } from '../styles/shared';
import { jobChip, TERMINAL_JOB_STATUSES } from '../lib/job-status';

@customElement('esp-ota-progress')
export class EspOtaProgress extends LitElement {
  @property({ type: Object }) job!: OtaJob;
  @property({ type: Boolean }) showAbort = false;

  private abort() {
    this.dispatchEvent(new CustomEvent('abort', { bubbles: true, composed: true }));
  }

  render() {
    const percent = Math.max(0, Math.min(100, Number(this.job.percent || 0)));
    const terminal = TERMINAL_JOB_STATUSES.includes(this.job.status);
    const jobLabel = this.job.parsed_esphome_name || this.job.esphome_name || this.job.firmware_name || 'firmware.ota.bin';
    const increments = this.job.current_increment != null && this.job.total_increments != null ? `${this.job.current_increment} of ${this.job.total_increments}` : '';
    return html`
      <section class="panel ${terminal ? (this.job.status === 'success' ? 'success' : 'failure') : ''}">
        <div class="head">
          <div>
            <span class="what">Uploading ${jobLabel}</span>
            <span class="pct">${percent}%</span>
          </div>
          ${jobChip(this.job.status)}
        </div>
        <div class="progress" role="progressbar" aria-label="Upload progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow=${percent}>
          <span style="width:${percent}%"></span>
        </div>
        <dl class="facts">
          <div><dt>Chunks</dt><dd>${this.job.chunks_sent ?? 0} of ${this.job.total_chunks ?? '—'}</dd></div>
          <div><dt>Size</dt><dd>${fmtBytes(this.job.firmware_size)}</dd></div>
          <div><dt>Started</dt><dd>${fmtTime(this.job.started_at)}</dd></div>
          ${this.job.bridge_state ? html`<div><dt>Bridge state</dt><dd>${this.job.bridge_state}</dd></div>` : nothing}
          ${increments ? html`<div><dt>Increment</dt><dd>${increments}</dd></div>` : nothing}
          ${this.job.retransmit_round ? html`<div><dt>Retransmit round</dt><dd>${this.job.retransmit_round}</dd></div>` : nothing}
        </dl>
        ${this.job.error_msg ? html`<p class="error-text">${this.job.error_msg}</p>` : nothing}
        ${this.showAbort ? html`<div><button class="btn sm danger" @click=${this.abort}>Abort upload</button></div>` : nothing}
      </section>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .panel { display: grid; gap: 12px; padding-top: 14px; border-top: 1px solid var(--line); }
    .head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .head > div { display: grid; gap: 2px; min-width: 0; }
    .what { font-weight: 500; overflow-wrap: anywhere; }
    .pct { font-size: var(--text-2xl); font-weight: 400; font-variant-numeric: tabular-nums; line-height: 1.1; }
    .facts { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  `];
}
