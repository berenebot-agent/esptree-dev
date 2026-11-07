import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';

export interface ConfirmRequest {
  title: string;
  message: string;
  /** Consequence detail shown in a highlighted block. */
  detail?: string;
  confirmLabel: string;
  danger?: boolean;
  run: () => Promise<void>;
}

/**
 * The one confirmation dialog for consequential actions. Built on the native
 * <dialog> (modal top layer, focus containment, Escape) so every page gets the
 * same behaviour. Set `.request` to open it; it clears itself on close and
 * reports a failed action through the `error` event.
 */
@customElement('esp-confirm-dialog')
export class EspConfirmDialog extends LitElement {
  @property({ attribute: false }) request: ConfirmRequest | null = null;
  @state() private busy = false;
  @state() private failure = '';
  @query('dialog') private dialog!: HTMLDialogElement;

  protected updated(changed: Map<string, unknown>): void {
    if (!changed.has('request')) return;
    if (this.request && !this.dialog.open) {
      this.failure = '';
      this.dialog.showModal();
      requestAnimationFrame(() => (this.renderRoot.querySelector('.confirm') as HTMLElement | null)?.focus());
    } else if (!this.request && this.dialog.open) {
      this.dialog.close();
    }
  }

  private close(): void {
    if (this.busy) return;
    this.request = null;
    this.dispatchEvent(new CustomEvent('closed'));
  }

  private async confirm(): Promise<void> {
    if (!this.request) return;
    this.busy = true;
    this.failure = '';
    try {
      await this.request.run();
      this.busy = false;
      this.close();
    } catch (err) {
      this.failure = err instanceof Error ? err.message : String(err);
      this.busy = false;
    }
  }

  render() {
    const r = this.request;
    return html`
      <dialog
        aria-labelledby="t"
        aria-describedby="m"
        @cancel=${(e: Event) => { e.preventDefault(); this.close(); }}
        @click=${(e: Event) => { if (e.target === this.dialog) this.close(); }}
      >
        ${r ? html`
          <div class="body">
            <h2 id="t">${r.title}</h2>
            <p id="m">${r.message}</p>
            ${r.detail ? html`<div class="notice ${r.danger ? 'danger' : 'warn'}">${icon('alert')}<span>${r.detail}</span></div>` : nothing}
            ${this.failure ? html`<p class="error-text" role="alert">${this.failure}</p>` : nothing}
          </div>
          <div class="actions">
            <button class="btn" @click=${() => this.close()} ?disabled=${this.busy}>Cancel</button>
            <button class="btn confirm ${r.danger ? 'danger-solid' : 'primary'}" @click=${() => void this.confirm()} ?disabled=${this.busy}>
              ${this.busy ? html`<span class="spinner"></span>Working…` : r.confirmLabel}
            </button>
          </div>
        ` : nothing}
      </dialog>
    `;
  }

  static styles = [shared, css`
    .body { display: grid; gap: 12px; padding: 22px 22px 8px; }
    h2 { font-size: var(--text-xl); font-weight: 500; line-height: 1.3; }
    p { color: var(--ink-2); }
    .actions { display: flex; justify-content: flex-end; gap: 8px; padding: 16px 22px 20px; }
    .btn .spinner { width: 14px; height: 14px; border-color: currentColor; border-top-color: transparent; }
  `];
}
