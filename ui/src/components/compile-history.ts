import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { api, OtaJob, fmtTimeAgo, fmtDuration } from '../api/client';
import { shared, historyStyles } from '../styles/shared';
import { icon } from '../styles/icons';
import { jobChip } from '../lib/job-status';

@customElement('esp-compile-history')
export class EspCompileHistory extends LitElement {
  @property({ type: Array }) jobs: OtaJob[] = [];
  @property({ type: String }) mac = '';

  private viewJobLog(job: OtaJob): void {
    const from = `/device/${encodeURIComponent(this.mac)}`;
    window.location.hash = `/job/${job.id}?from=${encodeURIComponent(from)}`;
  }



  render() {
    const compileJobs = this.jobs.filter(j => j.status === 'compile_success' || j.status === 'failed');
    return html`
      <div class="card-head"><h2>Build history</h2></div>
      ${compileJobs.length
        ? html`<ul class="hist">
            ${compileJobs.map((job) => {
              const duration = job.completed_at && job.started_at ? fmtDuration(job.completed_at - job.started_at) : '';
              return html`
                <li>
                  <span class="what">
                    <strong>${job.parsed_esphome_name || job.firmware_name || 'Build'}</strong>
                    <small>${[job.parsed_version ? `v${job.parsed_version}` : '', job.parsed_build_date || '', duration ? `took ${duration}` : ''].filter(Boolean).join(' · ')}</small>
                    ${job.error_msg ? html`<small class="err">${job.error_msg}</small>` : nothing}
                  </span>
                  ${jobChip(job.status)}
                  <span class="when">${fmtTimeAgo(job.created_at)}</span>
                  <span class="row-actions">
                    <button class="btn sm text" @click=${() => this.viewJobLog(job)}>View log</button>
                    ${job.status === 'compile_success' ? html`<a class="btn sm text" href=${api.downloadJobBinary(job.id)} target="_blank" rel="noopener">${icon('download')}.bin</a>` : nothing}
                  </span>
                </li>`;
            })}
          </ul>`
        : html`<p class="none">No builds for this remote yet. Edit its YAML and compile to create one.</p>`}
    `;
  }

  static styles = [shared, historyStyles, css`
    :host { display: block; }
    .none { padding: 12px 16px 16px; color: var(--muted); }
    .btn svg { width: 16px; height: 16px; }
  `];
}
