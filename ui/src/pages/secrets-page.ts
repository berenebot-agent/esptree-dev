import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { api } from '../api/client';

@customElement('esp-secrets-page')
export class EspSecretsPage extends LitElement {
  @property({ type: String }) from = '/';
  @state() private content = '';
  @state() private saved = false;
  @state() private loading = true;
  @state() private error = '';

  connectedCallback(): void {
    super.connectedCallback();
    void this.load();
  }

  private async load(): Promise<void> {
    this.loading = true;
    try {
      const data = await api.getSecrets();
      this.content = data.content;
      this.error = '';
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.loading = false;
    }
  }

  private async save(): Promise<void> {
    this.saved = false;
    try {
      await api.saveSecrets(this.content);
      this.saved = true;
      this.error = '';
      setTimeout(() => { this.saved = false; this.requestUpdate(); }, 2000);
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  private onInput(e: Event): void {
    this.content = (e.target as HTMLTextAreaElement).value;
  }

  private goBack(): void {
    window.location.hash = this.from;
  }

  render() {
    return html`
      <div class="secrets-page">
        <div class="page-head">
          <div class="page-heading">
            <span class="eyebrow">Security</span>
            <h1>Network secrets</h1>
            <p>Shared Wi-Fi, OTA, and ESP-NOW credentials used when compiling firmware.</p>
          </div>
          <div class="page-actions">
            <button class="btn" @click=${this.goBack}>Back</button>
            <button class="btn primary" @click=${this.save} ?disabled=${this.loading}>Save secrets</button>
          </div>
        </div>
        <div class="notice" role="note">
          <span class="notice-mark" aria-hidden="true">!</span>
          <div><strong>Treat this file as sensitive.</strong><p>Values are stored in plaintext and protected by Home Assistant ingress authentication. Changes apply to the next compile; missing keys will fail device builds.</p></div>
        </div>
        ${this.loading
          ? html`<div class="loading" aria-live="polite"><span class="spinner"></span>Loading secrets…</div>`
          : html`
              <section class="editor-card">
                <div class="editor-head">
                  <span class="file-label"><span class="file-dot" aria-hidden="true"></span>secrets.yaml</span>
                  <span class="file-meta">${this.content.split('\n').length} lines · plain text</span>
                </div>
                <label class="sr-only" for="secrets-editor">Edit secrets.yaml</label>
                <textarea id="secrets-editor" class="secrets-textarea" .value=${this.content} @input=${this.onInput} spellcheck="false" aria-describedby="secret-help"></textarea>
                <div class="editor-foot" id="secret-help">
                  <span class="hint">Use the same network ID and PSK on the bridge and every remote.</span>
                  <span class="feedback" role="status">
                    ${this.saved ? html`<span class="saved">Saved successfully</span>` : nothing}
                    ${this.error ? html`<span class="error">${this.error}</span>` : nothing}
                  </span>
                </div>
              </section>
            `}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; color: var(--ink); }
    * { box-sizing: border-box; }
    .secrets-page { display: flex; flex-direction: column; gap: 16px; }
    .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
    .page-heading { display: flex; flex-direction: column; gap: 5px; }
    .eyebrow { color: var(--primary); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    h1 { margin: 0; font-size: 27px; line-height: 1.15; letter-spacing: -.035em; font-weight: 700; }
    .page-heading p { margin: 2px 0 0; color: var(--muted); font-size: 13px; line-height: 1.5; }
    .page-actions { display: flex; gap: 7px; flex-shrink: 0; }
    .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 35px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); color: var(--ink-2); font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; }
    .btn:hover { background: var(--surface-subtle); border-color: var(--faint); }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .btn.primary { border-color: var(--primary); background: var(--primary); color: #fff; }
    .btn.primary:hover { background: var(--primary-strong); }
    .btn:disabled { opacity: .55; cursor: default; }
    .notice { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border: 1px solid #e5d3ae; border-radius: 8px; background: var(--accent-soft); color: #72531d; }
    .notice-mark { display: grid; place-items: center; width: 18px; height: 18px; flex: 0 0 18px; border: 1px solid #d3b471; border-radius: 50%; font-size: 10px; font-weight: 800; }
    .notice strong { display: block; font-size: 11px; font-weight: 700; }
    .notice p { margin: 2px 0 0; font-size: 10px; line-height: 1.5; }
    .editor-card { overflow: hidden; border: 1px solid #223b35; border-radius: var(--radius-lg); background: #101f1c; box-shadow: var(--shadow-sm); }
    .editor-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 15px; border-bottom: 1px solid rgba(255,255,255,.08); background: #142a25; }
    .file-label { display: inline-flex; align-items: center; gap: 7px; color: #d6e3dd; font-family: var(--font-mono); font-size: 10px; font-weight: 600; }
    .file-dot { width: 6px; height: 6px; border-radius: 50%; background: #d6b15c; }
    .file-meta { color: #738981; font-size: 9px; }
    .secrets-textarea { display: block; width: 100%; min-height: 430px; padding: 14px 16px; border: 0; border-radius: 0; background: #101f1c; color: #c8d8d0; font: 11px/1.65 var(--font-mono); resize: vertical; outline: none; }
    .secrets-textarea:focus { box-shadow: inset 0 0 0 1px #d6b15c; }
    .editor-foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 42px; padding: 8px 15px; border-top: 1px solid rgba(255,255,255,.08); background: #142a25; }
    .hint { color: #829a90; font-size: 9px; }
    .feedback { display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 600; }
    .saved { color: #8fd9a5; }
    .error { color: #ffc2c4; }
    .loading { display: flex; align-items: center; gap: 9px; min-height: 120px; padding: 24px; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); color: var(--muted); font-size: 12px; }
    .spinner { width: 14px; height: 14px; border: 2px solid var(--line); border-top-color: var(--primary); border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
    @media (max-width: 760px) {
      .page-head { align-items: flex-start; flex-direction: column; gap: 13px; }
      h1 { font-size: 24px; }
      .page-actions { width: 100%; }
      .page-actions .btn { flex: 1; }
      .secrets-textarea { min-height: 340px; }
      .editor-foot { align-items: flex-start; flex-direction: column; gap: 5px; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; } }
  `;
}
