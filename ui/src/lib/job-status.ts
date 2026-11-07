import { html, type TemplateResult } from 'lit';

export type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'neutral';

const LABELS: Record<string, [string, Tone]> = {
  success: ['Succeeded', 'ok'],
  compile_success: ['Built', 'ok'],
  failed: ['Failed', 'danger'],
  aborted: ['Aborted', 'warn'],
  rejoin_timeout: ['Rejoin timeout', 'danger'],
  version_mismatch: ['Version mismatch', 'warn'],
  rejoined_unverified: ['Build unconfirmed', 'warn'],
  queued: ['Queued', 'warn'],
  compile_queued: ['Build queued', 'warn'],
  compiling: ['Building', 'info'],
  pending_confirm: ['Awaiting confirmation', 'warn'],
  starting: ['Starting', 'info'],
  announcing: ['Connecting', 'info'],
  transferring: ['Uploading', 'info'],
  verifying: ['Verifying', 'info'],
  transfer_success_waiting_rejoin: ['Waiting for rejoin', 'info'],
};

export const TERMINAL_JOB_STATUSES = ['success', 'compile_success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch', 'rejoined_unverified'];

export function jobStatus(status: string): { label: string; tone: Tone } {
  const hit = LABELS[status];
  if (hit) return { label: hit[0], tone: hit[1] };
  const text = status.replace(/_/g, ' ');
  return { label: text.charAt(0).toUpperCase() + text.slice(1), tone: 'neutral' };
}

/** Status chip with a running indicator for in-flight states. */
export function jobChip(status: string, suffix = ''): TemplateResult {
  const { label, tone } = jobStatus(status);
  const live = tone === 'info';
  return html`<span class="chip ${tone === 'neutral' ? '' : tone}">${live ? html`<span class="spinner chip-spin"></span>` : tone === 'ok' || tone === 'danger' ? html`<span class="dot ${tone}"></span>` : ''}${label}${suffix}</span>`;
}
