import { html } from 'lit';
import { icon } from '../styles/icons';

/**
 * The firmware pipeline's progress row (`.steps` in shared styles), used by the
 * remote wizard and the bridge flash in setup so both read the same way.
 * `at` is the index of the current stage; `labels.length` means all are done.
 */
export function renderStages(labels: readonly string[], at: number) {
  return html`<ol class="steps" aria-label="Progress">
    ${labels.map((label, i) => html`<li class=${i < at ? 'done' : i === at ? 'current' : ''} aria-current=${i === at ? 'step' : 'false'}>
      <span class="n">${i < at ? icon('check') : i + 1}</span>${label}</li>`)}
  </ol>`;
}
