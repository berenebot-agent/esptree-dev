import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ConfigResult, TopologyNode, api, normalizeMac } from '../api/client';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';
import './confirm-dialog';
import type { ConfirmRequest } from './confirm-dialog';

type ToastTone = 'ok' | 'error';

const RESULT_MESSAGES: Record<string, string> = {
  rejected: 'The remote rejected the command.',
  busy: 'The remote is busy. Try again in a few seconds.',
  timeout: "The remote didn't answer in time. It may be asleep or out of range.",
  no_session: "The bridge has no session with this remote yet. Wait for it to rejoin, then retry.",
  not_remote: 'This command only applies to remotes.',
  invalid_payload: 'The command was malformed and was not sent.',
  unsupported: "This remote's firmware doesn't support that command.",
};

/** Remote controls: relay mode, heartbeat, preferred parent, rediscover, reboot. */
@customElement('esp-device-config')
export class EspDeviceConfig extends LitElement {
  @property({ type: String }) mac = '';
  @property({ type: Boolean }) online = false;
  @property({ type: Boolean }) isRemote = false;
  @property({ type: Array }) relayNodes: TopologyNode[] = [];
  @property({ type: Boolean }) relayEnabled = false;
  @state() private busy = '';
  @state() private heartbeatSeconds = 60;
  @state() private selectedParent = '';
  @state() private customParentMac = '';
  @state() private showParentModal = false;
  @state() private confirm: ConfirmRequest | null = null;
  @state() private toast: { message: string; tone: ToastTone } | null = null;
  private toastTimer: number | undefined;

  disconnectedCallback(): void {
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    super.disconnectedCallback();
  }

  private disabled(): boolean {
    return !this.online || !!this.busy;
  }

  private notify(message: string, tone: ToastTone): void {
    this.toast = { message, tone };
    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => { this.toast = null; }, 6000);
  }

  private dispatchChanged(): void {
    this.dispatchEvent(new CustomEvent('config-changed', { bubbles: true, composed: true }));
  }

  /** Send one command and report its outcome in plain language. */
  private async send(key: string, ok: string, call: () => Promise<ConfigResult>, accept: (r: string) => boolean = (r) => r === 'ok'): Promise<void> {
    this.busy = key;
    try {
      const result = await call();
      if (result?.result !== undefined && accept(result.result)) {
        this.notify(result.result === 'ok' ? ok : String(result.result), 'ok');
        this.dispatchChanged();
      } else if (result?.result === undefined) {
        console.error('Unexpected config response:', result);
        this.notify('The add-on returned an unexpected response.', 'error');
      } else {
        this.notify(RESULT_MESSAGES[result.result] ?? `Command failed: ${result.result}`, 'error');
      }
    } catch (error) {
      this.notify(error instanceof Error ? error.message : String(error), 'error');
    } finally {
      this.busy = '';
    }
  }

  private reboot(): void {
    this.confirm = {
      title: 'Reboot this remote?',
      message: 'The remote restarts and rejoins the mesh, usually within a few seconds.',
      detail: 'Its entities are unavailable in Home Assistant until it rejoins.',
      confirmLabel: 'Reboot',
      run: () => this.send('reboot', 'Reboot sent. The remote will rejoin shortly.', () => api.rebootDevice(this.mac)),
    };
  }

  private rediscover(): void {
    this.confirm = {
      title: 'Rediscover the route?',
      message: 'The remote drops its current parent and searches for the best route to the bridge again.',
      confirmLabel: 'Rediscover',
      run: () => this.send('rediscover', 'Rediscover sent. The route may change in the tree.', () => api.forceRediscover(this.mac)),
    };
  }

  private setRelay(enable: boolean): void {
    void this.send('relay', enable ? 'Relay enabled.' : 'Relay disabled.', () => api.setRelay(this.mac, enable),
      (r) => !['no_session', 'timeout', 'rejected', 'busy', 'invalid_payload', 'not_remote'].includes(r));
  }

  private applyHeartbeat(): void {
    const interval = Math.trunc(Number(this.heartbeatSeconds));
    if (!(interval >= 5 && interval <= 3600)) {
      this.notify('Heartbeat must be between 5 and 3600 seconds.', 'error');
      return;
    }
    void this.send('heartbeat', `Heartbeat set to ${interval} s.`, () => api.setHeartbeatInterval(this.mac, interval));
  }

  private applyParent(replaceAll: boolean): void {
    const parentMac = normalizeMac((this.customParentMac || this.selectedParent).trim());
    if (!/^[0-9A-F]{2}(:[0-9A-F]{2}){5}$/.test(parentMac)) {
      this.notify('Enter a full MAC address, like AA:BB:CC:DD:EE:FF.', 'error');
      return;
    }
    this.showParentModal = false;
    void this.send('parent', 'Preferred parent set.', () => api.setParentMac(this.mac, parentMac, replaceAll));
  }

  render() {
    if (!this.isRemote) return nothing;
    const off = this.disabled();
    return html`
      <div class="card-head">
        <h2>Controls</h2>
        ${this.busy ? html`<span class="chip info"><span class="spinner"></span>Sending…</span>` : nothing}
      </div>
      ${!this.online ? html`<div class="offline notice">${icon('info')}<span>Controls are available when the remote is online.</span></div>` : nothing}
      <ul class="actions">
        <li>
          <div class="what"><strong>Relay</strong><span>Forward traffic for remotes that can't reach the bridge directly. Currently ${this.relayEnabled ? 'on' : 'off'}.</span></div>
          <button class="btn sm" ?disabled=${off} @click=${() => this.setRelay(!this.relayEnabled)}>${this.relayEnabled ? 'Turn off' : 'Turn on'}</button>
        </li>
        <li>
          <div class="what"><strong>Heartbeat</strong><span>How often the remote checks in, 5–3600 seconds.</span></div>
          <form class="inline" @submit=${(e: Event) => { e.preventDefault(); this.applyHeartbeat(); }}>
            <input type="number" min="5" max="3600" step="1" aria-label="Heartbeat interval in seconds" .value=${String(this.heartbeatSeconds)} ?disabled=${off}
              @input=${(e: Event) => { this.heartbeatSeconds = Number((e.target as HTMLInputElement).value); }} />
            <button class="btn sm" type="submit" ?disabled=${off}>Set</button>
          </form>
        </li>
        <li>
          <div class="what"><strong>Preferred parent</strong><span>Route this remote through a specific node when it can reach it.</span></div>
          <button class="btn sm" ?disabled=${off} @click=${() => { this.showParentModal = true; void this.updateComplete.then(() => (this.renderRoot.querySelector('#pp') as HTMLElement | null)?.focus()); }}>Choose…</button>
        </li>
        <li>
          <div class="what"><strong>Rediscover route</strong><span>Search again for the best path to the bridge.</span></div>
          <button class="btn sm" ?disabled=${off} @click=${() => this.rediscover()}>Rediscover…</button>
        </li>
        <li>
          <div class="what"><strong>Reboot</strong><span>Restart the remote. It rejoins automatically.</span></div>
          <button class="btn sm danger" ?disabled=${off} @click=${() => this.reboot()}>${icon('power')}Reboot…</button>
        </li>
      </ul>
      ${this.toast ? html`<div class="toast notice ${this.toast.tone === 'ok' ? 'ok' : 'danger'}" role=${this.toast.tone === 'ok' ? 'status' : 'alert'}>
        ${icon(this.toast.tone === 'ok' ? 'checkCircle' : 'alert')}<span>${this.toast.message}</span></div>` : nothing}
      ${this.showParentModal ? this.renderParentModal() : nothing}
      <esp-confirm-dialog .request=${this.confirm} @closed=${() => { this.confirm = null; }}></esp-confirm-dialog>
    `;
  }

  private renderParentModal() {
    const hasParent = !!(this.customParentMac.trim() || this.selectedParent);
    const options = this.relayNodes.filter((node) => normalizeMac(node.mac) !== normalizeMac(this.mac));
    const custom = this.selectedParent === '__custom__';
    return html`
      <div class="scrim" @click=${(e: Event) => { if (e.target === e.currentTarget) this.showParentModal = false; }}
        @keydown=${(e: KeyboardEvent) => { if (e.key === 'Escape') this.showParentModal = false; }}>
        <section class="modal" role="dialog" aria-modal="true" aria-labelledby="pp-title">
          <h2 id="pp-title">Preferred parent</h2>
          <p>A preference, not a lock: if the remote can't reach this parent it picks another route.</p>
          <div class="field">
            <label for="pp">Parent</label>
            <select id="pp" .value=${this.selectedParent} @change=${(e: Event) => {
              this.selectedParent = (e.target as HTMLSelectElement).value;
              if (this.selectedParent !== '__custom__') this.customParentMac = '';
            }}>
              <option value="">Select a node…</option>
              ${options.map((node) => html`<option value=${normalizeMac(node.mac)}>${node.friendly_name || node.esphome_name || node.label || normalizeMac(node.mac)}${node.is_bridge ? ' (bridge)' : ''}</option>`)}
              <option value="__custom__">Enter a MAC address…</option>
            </select>
          </div>
          ${custom ? html`
            <div class="field">
              <label for="ppm">MAC address</label>
              <input id="ppm" type="text" autocomplete="off" placeholder="AA:BB:CC:DD:EE:FF" class="mono" .value=${this.customParentMac}
                @input=${(e: Event) => { this.customParentMac = (e.target as HTMLInputElement).value; }} />
            </div>` : nothing}
          <div class="modal-actions">
            <button class="btn" @click=${() => { this.showParentModal = false; }}>Cancel</button>
            <button class="btn" ?disabled=${!hasParent || custom && !this.customParentMac.trim()} @click=${() => this.applyParent(false)}>Add to list</button>
            <button class="btn primary" ?disabled=${!hasParent || custom && !this.customParentMac.trim()} @click=${() => this.applyParent(true)}>Replace parents</button>
          </div>
        </section>
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .card-head { border-bottom: 0; padding-bottom: 4px; }
    .card-head .spinner { width: 12px; height: 12px; border-color: currentColor; border-top-color: transparent; }
    .offline { margin: 4px 16px 8px; }
    .actions { list-style: none; margin: 0; padding: 0 0 6px; }
    .actions li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 16px;
      border-top: 1px solid var(--line);
    }
    .actions li:first-child { border-top: 0; }
    .what { display: grid; gap: 2px; min-width: 0; }
    .what strong { font-weight: 500; }
    .what span { color: var(--muted); font-size: var(--text-sm); }
    .inline { display: flex; gap: 6px; flex: none; }
    .inline input { width: 88px; min-height: 30px; padding: 4px 8px; }
    .btn.sm svg { width: 16px; height: 16px; }
    .toast { margin: 0 16px 16px; }

    .scrim {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: grid;
      place-items: center;
      padding: 16px;
      background: var(--scrim);
    }
    .modal {
      display: grid;
      gap: 14px;
      width: min(460px, 100%);
      padding: 22px;
      border-radius: var(--radius-lg);
      background: var(--surface-raised);
      box-shadow: var(--shadow-md);
    }
    .modal h2 { font-size: var(--text-xl); font-weight: 500; }
    .modal p { color: var(--ink-2); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-top: 4px; }

    @media (max-width: 520px) {
      .actions li { flex-wrap: wrap; }
    }
  `];
}
