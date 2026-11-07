import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { api } from '../api/client';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';

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

  render() {
    const raw = (this.from || '').replace(/^#/, '');
    const from = raw && raw !== '/' ? raw : '/settings';
    const fromLabel = from.startsWith('/device/') ? 'YAML' : from.startsWith('/settings') ? 'Settings' : 'Back';
    return html`
      <div class="page">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#${from}">${fromLabel}</a>${icon('chevronRight')}<span aria-current="page">Secrets</span></nav>
          <div class="page-head">
            <div>
              <h1>Secrets</h1>
              <p class="sub">WiFi, OTA and ESP-NOW credentials shared by every build. Changes apply to the next compile.</p>
            </div>
          </div>
        </div>
        ${this.loading
          ? html`<div class="card loading" aria-live="polite"><span class="spinner"></span>Loading secrets…</div>`
          : html`
              <section class="card editor-card">
                <div class="editor-head">
                  <span class="file-label">${icon('lock')}secrets.yaml</span>
                  <span class="hint">${this.content.split('\n').length} lines</span>
                </div>
                <label class="sr-only" for="secrets-editor">Edit secrets.yaml</label>
                <textarea id="secrets-editor" class="secrets-textarea" .value=${this.content} @input=${this.onInput} spellcheck="false" autocomplete="off" aria-describedby="secret-help"></textarea>
                <div class="editor-foot">
                  <span class="hint" id="secret-help">${icon('info')}Stored as plain text, protected by Home Assistant sign-in. The bridge and every remote must share the same network ID and PSK.</span>
                  <span class="foot-actions">
                    <span role="status">
                      ${this.saved ? html`<span class="saved">${icon('check')}Saved</span>` : nothing}
                      ${this.error ? html`<span class="error-text">${this.error}</span>` : nothing}
                    </span>
                    <button class="btn primary" @click=${this.save} ?disabled=${this.loading}>Save</button>
                  </span>
                </div>
              </section>
            `}
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }
    .editor-card { overflow: hidden; }
    .editor-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 16px; border-bottom: 1px solid var(--line); }
    .file-label { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: var(--text-sm); font-weight: 500; }
    .file-label svg { width: 16px; height: 16px; color: var(--muted); }
    .secrets-textarea {
      display: block; width: 100%; min-height: 420px; padding: 14px 16px; border: 0; border-radius: 0;
      background: var(--surface); color: var(--ink); font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.6; resize: vertical; tab-size: 2;
    }
    .secrets-textarea:focus { box-shadow: inset 0 0 0 2px var(--primary); }
    .editor-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px 20px; flex-wrap: wrap; padding: 12px 16px; border-top: 1px solid var(--line); }
    .editor-foot .hint { display: inline-flex; gap: 8px; align-items: flex-start; max-width: 70ch; }
    .editor-foot .hint svg { width: 16px; height: 16px; flex: none; margin-top: 2px; }
    .foot-actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
    .saved { display: inline-flex; align-items: center; gap: 4px; color: var(--ok); font-size: var(--text-sm); font-weight: 500; }
    .saved svg { width: 16px; height: 16px; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  `];
}
