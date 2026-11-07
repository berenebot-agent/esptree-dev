import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { OtaJob, api, fmtBytes, fmtTime, fmtTimeAgo, fmtDuration } from '../api/client';
import { shared, historyStyles } from '../styles/shared';
import { icon } from '../styles/icons';
import { jobChip } from '../lib/job-status';

@customElement('esp-flash-history')
export class EspFlashHistory extends LitElement {
  @property({ type: Array }) jobs: OtaJob[] = [];
  @property({ type: String }) mac = '';
  @state() private busyJob: number | null = null;
  @state() private error = '';

  private retained(job: OtaJob): boolean {
    return !!job.firmware_path && !!job.retained_until && job.retained_until > Math.floor(Date.now() / 1000);
  }

  private viewLog(job: OtaJob): void {
    const from = `/device/${encodeURIComponent(this.mac || job.mac)}`;
    window.location.hash = `/job/${job.id}?from=${encodeURIComponent(from)}`;
  }

  private async reflash(job: OtaJob): Promise<void> {
    this.busyJob = job.id;
    this.error = '';
    try {
      const result = await api.reflash(job.id);
      this.dispatchEvent(new CustomEvent('ota-reflash-result', {
        bubbles: true,
        composed: true,
        detail: { job: result.job, preflight: result.preflight },
      }));
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busyJob = null;
    }
  }

  private async deleteRetained(job: OtaJob): Promise<void> {
    this.busyJob = job.id;
    this.error = '';
    try {
      await api.deleteRetained(job.id);
      this.dispatchChanged();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.busyJob = null;
    }
  }

  private dispatchChanged(): void {
    this.dispatchEvent(new CustomEvent('ota-changed', { bubbles: true, composed: true }));
  }



  render() {
    return html`
      <div class="card-head"><h2>Upload history</h2></div>
      ${this.error ? html`<div class="notice danger pad" role="alert">${icon('alert')}<span>${this.error}</span></div>` : nothing}
      ${this.jobs.length
        ? html`<ul class="hist">
            ${this.jobs.map((job) => {
              const duration = job.completed_at && job.started_at ? fmtDuration(job.completed_at - job.started_at) : '';
              return html`
                <li>
                  <span class="what">
                    <strong>${job.parsed_esphome_name || job.esphome_name || job.firmware_name || 'firmware.ota.bin'}</strong>
                    <small>${[job.parsed_version ? `v${job.parsed_version}` : '', job.parsed_build_date || job.firmware_name || '', job.firmware_size ? fmtBytes(job.firmware_size) : '', duration ? `took ${duration}` : ''].filter(Boolean).join(' · ')}</small>
                    ${job.error_msg ? html`<small class="err">${job.error_msg}</small>` : nothing}
                  </span>
                  ${jobChip(job.status)}
                  <span class="when" title=${fmtTime(job.created_at)}>${fmtTimeAgo(job.created_at)}</span>
                  <span class="row-actions">
                    <button class="btn sm text" @click=${() => this.viewLog(job)}>View log</button>
                    ${this.retained(job)
                      ? html`
                          <button class="btn sm" ?disabled=${this.busyJob === job.id} @click=${() => this.reflash(job)}>Flash again</button>
                          <button class="btn sm text" ?disabled=${this.busyJob === job.id} @click=${() => this.deleteRetained(job)}>Delete binary</button>`
                      : nothing}
                  </span>
                </li>`;
            })}
          </ul>`
        : html`<p class="none">No uploads to this remote yet.</p>`}
    `;
  }

  static styles = [shared, historyStyles, css`
    :host { display: block; }
    .none { padding: 12px 16px 16px; color: var(--muted); }
    .pad { margin: 12px 16px; }
  `];
}
