import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppConfig, ConfiguredBridge, ContainerStatusInfo, DiscoveredBridge, api } from '../api/client';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';
import './confirm-dialog';
import type { ConfirmRequest } from './confirm-dialog';

@customElement('esp-settings')
export class EspSettings extends LitElement {
  @property({ type: Boolean }) autoInit = false;
  @state() private config: AppConfig | null = null;
  @state() private configuredBridges: ConfiguredBridge[] = [];
  @state() private discoveredBridges: DiscoveredBridge[] = [];
  @state() private loading = true;
  @state() private discovering = false;
  @state() private saving = false;
  @state() private error = '';
  @state() private saved = '';
  @state() private containerStatus: ContainerStatusInfo | null = null;
  @state() private cleaningArtifacts = false;
  @state() private artifactsMessage = '';
  @state() private editingBridgeId: string | null = null;
  @state() private editApiKey = '';
  // The ESPHome OTA password this bridge was compiled with. Editable here because
  // secrets.yaml keeps only one for the whole network: after another bridge is
  // provisioned, an older bridge can only be updated if its own password is known.
  @state() private editOtaPassword = '';
  @state() private newBridgeApiKey = '';
  @state() private showManualEntry = false;
  @state() private manualHost = '';
  @state() private manualPort = 80;
  @state() private manualApiKey = '';
  @state() private showScanLog = false;
  @state() private scanLogContent = '';
  @state() private scanLogLoading = false;
  @state() private restarting = false;
  @state() private restartFeedback = '';
  @state() private confirm: ConfirmRequest | null = null;
  private integrationPollTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    void this.load();
    void this.loadContainerStatus();
    this.integrationPollTimer = setInterval(() => void this.pollIntegrationStatus(), 5000);
    if (this.autoInit) {
      void this.discover();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.integrationPollTimer) {
      clearInterval(this.integrationPollTimer);
      this.integrationPollTimer = null;
    }
  }

  private async pollIntegrationStatus(): Promise<void> {
    try {
      this.config = await api.config();
    } catch {
    }
  }

  private async restartHa(): Promise<void> {
    this.restarting = true;
    this.restartFeedback = '';
    try {
      const result = await api.requestRestart();
      if (result.success) {
        this.restartFeedback = 'Restart requested';
      } else {
        this.restartFeedback = result.error || 'Restart failed';
      }
    } catch (err) {
      this.restartFeedback = 'Restart failed';
    } finally {
      this.restarting = false;
      setTimeout(() => { this.restartFeedback = ''; }, 4000);
    }
  }

  private async load(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      this.config = await api.config();
      this.configuredBridges = await api.getBridges();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.loading = false;
    }
  }

  private async loadContainerStatus(): Promise<void> {
    try {
      this.containerStatus = await api.getContainerStatus();
    } catch {
      this.containerStatus = null;
    }
  }

  private isBridgeConnected(bridge: ConfiguredBridge): boolean {
    // Prefer the add-on's per-bridge client state. The previous check only asked
    // whether this bridge was the ACTIVE one, so a bridge with no client running at
    // all still rendered "connected" as long as it was active - which is exactly the
    // case a bridge skipped for a missing api_key falls into.
    if (typeof bridge.client_connected === 'boolean') {
      return bridge.client_connected;
    }
    // Older payload without the field: keep the previous behaviour.
    if (!this.config?.active_bridge || this.config.active_bridge.error) {
      return false;
    }
    const active = this.config.active_bridge as { uuid?: string; host?: string; port?: number };
    return active.uuid === bridge.uuid || (active.host === bridge.host && active.port === bridge.port);
  }

  // Why a bridge has no client, straight from the add-on. Rendered next to the
  // status so an unconnectable bridge is not indistinguishable from a healthy one.
  private bridgeSkippedReason(bridge: ConfiguredBridge): string {
    return (bridge.client_skipped_reason || '').trim();
  }

  private isBridgeActive(bridge: ConfiguredBridge): boolean {
    return !!bridge.is_active;
  }

  private isSerial(bridge: ConfiguredBridge): boolean {
    return bridge.transport === 'serial';
  }

  // A serial bridge has no hostname/IP/port of its own: it is reached through a
  // device or socket path. Label the columns sensibly rather than leaving blanks
  // or pretending the path is an IP address.
  private bridgeHostname(bridge: ConfiguredBridge): string {
    if (this.isSerial(bridge)) return 'serial';
    return bridge.hostname || '-';
  }

  private bridgeAddress(bridge: ConfiguredBridge): string {
    if (this.isSerial(bridge)) return bridge.serial_port || '-';
    return bridge.host || '-';
  }

  private async discover(): Promise<void> {
    this.discovering = true;
    this.error = '';
    this.newBridgeApiKey = '';
    try {
      const result = await api.discoverBridges();
      this.discoveredBridges = result.bridges;
      if (this.discoveredBridges.length === 0) {
        this.error = 'No bridges found. Make sure your bridge is powered on and connected to the same network, then try again. You can also use Manual IP to connect directly.';
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg === 'timeout') {
        this.error = 'Scan timed out. Try again or use View Scan Log to see scanned IPs, or use Manual IP to connect directly.';
      } else if (msg === 'cancelled') {
        this.error = '';
      } else {
        this.error = msg;
      }
    } finally {
      this.discovering = false;
    }
  }

  private async triggerScan(): Promise<void> {
    this.discovering = true;
    this.error = '';
    this.newBridgeApiKey = '';
    try {
      const result = await api.triggerScan();
      if (!result.success && result.error) {
        this.error = result.error;
      }
      await this.discover();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.discovering = false;
    }
  }

  private async viewScanLog(): Promise<void> {
    if (this.showScanLog) {
      this.showScanLog = false;
      return;
    }
    this.scanLogLoading = true;
    this.showScanLog = true;
    try {
      this.scanLogContent = (await api.getScanLog()) || '(empty)';
    } catch (error) {
      this.scanLogContent = error instanceof Error ? error.message : String(error);
    } finally {
      this.scanLogLoading = false;
    }
  }

  private async selectBridge(bridge: DiscoveredBridge): Promise<void> {
    if (!this.newBridgeApiKey.trim()) {
      this.error = 'API key is required';
      return;
    }
    this.saving = true;
    this.error = '';
    this.saved = '';
    try {
      await api.selectBridge(bridge.host, bridge.port, bridge.name, bridge.version, this.newBridgeApiKey, bridge.network_id, bridge.hostname);
      this.saved = `Connected to ${bridge.name || bridge.host}`;
      this.discoveredBridges = [];
      this.newBridgeApiKey = '';
      await this.load();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.saving = false;
    }
  }

  private async addManualBridge(): Promise<void> {
    if (!this.manualHost.trim()) {
      this.error = 'Host is required';
      return;
    }
    if (!this.manualPort || this.manualPort < 1 || this.manualPort > 65535) {
      this.error = 'Valid port is required';
      return;
    }
    this.saving = true;
    this.error = '';
    this.saved = '';
    try {
      await api.addBridge(this.manualHost.trim(), this.manualPort, undefined, this.manualApiKey || '', '');
      this.saved = `Connected to ${this.manualHost}:${this.manualPort}`;
      this.showManualEntry = false;
      this.manualHost = '';
      this.manualPort = 80;
      this.manualApiKey = '';
      await this.load();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.saving = false;
    }
  }

  private async deleteBridge(bridge: ConfiguredBridge): Promise<void> {
    this.saving = true;
    this.error = '';
    try {
      await api.deleteBridge(bridge.uuid);
      this.saved = `Bridge removed`;
      await this.load();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.saving = false;
    }
  }

  private async saveBridgeCredentials(bridge: ConfiguredBridge): Promise<void> {
    if (!this.editApiKey.trim()) {
      this.error = 'API key is required';
      return;
    }
    this.saving = true;
    this.error = '';
    try {
      await api.updateBridge(
        bridge.uuid,
        undefined,
        undefined,
        undefined,
        this.editApiKey,
        this.editOtaPassword,
      );
      this.saved = `Credentials updated for ${bridge.name || bridge.host}`;
      this.editingBridgeId = null;
      this.editApiKey = '';
      this.editOtaPassword = '';
      await this.load();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.saving = false;
    }
  }

  private startEditingBridge(bridge: ConfiguredBridge): void {
    this.editingBridgeId = bridge.uuid;
    this.editApiKey = bridge.api_key || '';
    this.editOtaPassword = bridge.ota_password || '';
  }

  private cancelEditing(): void {
    this.editingBridgeId = null;
    this.editApiKey = '';
    this.editOtaPassword = '';
  }

  private async cleanArtifacts(): Promise<void> {
    this.cleaningArtifacts = true;
    this.artifactsMessage = '';
    try {
      const result = await api.cleanArtifacts();
      const totalMB = (result.total_bytes / (1024 * 1024)).toFixed(1);
      this.artifactsMessage = `Cleared ${totalMB} MB of build cache. Next compile will be slower.`;
      void this.loadContainerStatus();
    } catch (error) {
      this.artifactsMessage = `Error: ${error instanceof Error ? error.message : String(error)}`;
    } finally {
      this.cleaningArtifacts = false;
    }
  }

  private async activateBridge(bridge: ConfiguredBridge): Promise<void> {
    this.saving = true;
    this.error = '';
    this.saved = '';
    try {
      await api.activateBridge(bridge.uuid);
      this.saved = `Activated ${bridge.name || bridge.host}`;
      await this.load();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.saving = false;
    }
  }

  private async deactivateBridge(bridge: ConfiguredBridge): Promise<void> {
    this.saving = true;
    this.error = '';
    this.saved = '';
    try {
      await api.deactivateBridge(bridge.uuid);
      this.saved = `Deactivated ${bridge.name || bridge.host}`;
      await this.load();
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.saving = false;
    }
  }


  private renderIntegrationStatus() {
    const int = this.config?.integration;
    if (!int) {
      return html`<div class="setting"><span class="what"><span class="spinner"></span></span></div>`;
    }
    const { installed, loaded, configured, connected, bridge_count, remote_count } = int;
    // remote_count includes offline remotes kept from earlier sessions, so show the
    // online split when the integration reports it. Older integrations don't send it.
    const hasOnline = typeof int.remotes_online === 'number';
    const online = hasOnline ? int.remotes_online! : 0;
    const offline = hasOnline ? remote_count - online : 0;

    if (!installed) {
      return html`<div class="notice danger">${icon('alert')}<span><strong>Integration files not found.</strong> Restart Home Assistant to finish installing ESP Tree.</span></div>`;
    }
    if (!loaded) {
      return html`
        <div class="notice warn">${icon('info')}<span><strong>Installed but not loaded yet.</strong> Home Assistant loads the integration on its next restart.</span>
          <span class="notice-actions"><button class="btn sm primary" ?disabled=${this.restarting} @click=${this.restartHa}>${this.restarting ? 'Restarting…' : 'Restart Home Assistant'}</button></span>
        </div>
        ${this.restartFeedback ? html`<p class="hint">${this.restartFeedback}</p>` : nothing}
      `;
    }
    if (!configured) {
      return html`<div class="notice warn">${icon('info')}<span><strong>Not set up yet.</strong> In Home Assistant, go to Settings → Devices &amp; services → Add integration, and search for ESP Tree.</span></div>`;
    }
    if (!connected) {
      return html`<div class="notice danger">${icon('alert')}<span><strong>The integration lost its connection to the add-on.</strong> It reconnects automatically; if it doesn't, reload the integration in Home Assistant.</span></div>`;
    }
    return html`
      <div class="status-line">
        <span class="chip ok"><span class="dot ok"></span>Connected</span>
        <span>Version ${int.version || 'unknown'}</span>
        ${bridge_count > 0 ? html`<span>${bridge_count} ${bridge_count === 1 ? 'bridge' : 'bridges'}</span>` : nothing}
        ${hasOnline
          ? html`<span>${online} of ${remote_count} remotes online${offline > 0 ? html` · <span class="warn-text">${offline} offline</span>` : nothing}</span>`
          : html`<span>${remote_count} ${remote_count === 1 ? 'remote' : 'remotes'} known</span>`}
      </div>
    `;
  }

  private confirmDeleteBridge(bridge: ConfiguredBridge): void {
    this.confirm = {
      title: `Remove ${bridge.name || 'this bridge'}?`,
      message: 'ESP Tree forgets this bridge and its credentials. The bridge itself keeps running and can be added again later.',
      detail: this.isBridgeActive(bridge) ? 'This is the active bridge: the network goes offline in ESP Tree until another bridge is activated.' : undefined,
      confirmLabel: 'Remove bridge',
      danger: true,
      run: () => this.deleteBridge(bridge),
    };
  }

  private confirmCleanArtifacts(): void {
    this.confirm = {
      title: 'Clear the build cache?',
      message: 'Deletes the PlatformIO cache and ESPHome build output. Use it to free disk space or recover from a stale build.',
      detail: 'The next build of every device downloads toolchains again and is much slower.',
      confirmLabel: 'Clear cache',
      run: () => this.cleanArtifacts(),
    };
  }

  private renderBridge(bridge: ConfiguredBridge) {
    const active = this.isBridgeActive(bridge);
    const connected = this.isBridgeConnected(bridge);
    const skipped = this.bridgeSkippedReason(bridge);
    const editing = this.editingBridgeId === bridge.uuid;
    return html`
      <li class=${active ? 'active' : ''}>
        <div class="bridge-row">
          <span class="node-icon ${active ? 'on' : ''}" aria-hidden="true">${icon(this.isSerial(bridge) ? 'usb' : 'wifi')}</span>
          <span class="what">
            <strong>${bridge.name || this.bridgeHostname(bridge)}
              ${active ? html`<span class="chip primary">Active</span>` : nothing}
            </strong>
            <small>
              ${this.isSerial(bridge) ? 'Serial' : 'WiFi'} ·
              <span class="mono">${this.bridgeAddress(bridge)}${!this.isSerial(bridge) && bridge.port ? `:${bridge.port}` : ''}</span>
              ${bridge.network_id ? html` · network ${bridge.network_id}` : nothing}
            </small>
          </span>
          <span class="conn">
            ${connected
              ? html`<span class="chip ok"><span class="dot ok"></span>Connected</span>`
              : html`<span class="chip ${active ? 'danger' : ''}" title=${skipped || ''}>${active ? html`<span class="dot danger"></span>` : nothing}${active ? 'Not connected' : 'Standby'}</span>`}
          </span>
          <span class="row-actions">
            ${editing ? nothing : html`
              ${active
                ? html`<button class="btn sm" ?disabled=${this.saving} @click=${() => this.deactivateBridge(bridge)}>Deactivate</button>`
                : html`<button class="btn sm primary" ?disabled=${this.saving} @click=${() => this.activateBridge(bridge)}>Activate</button>`}
              <button class="btn sm text" ?disabled=${this.saving} @click=${() => this.startEditingBridge(bridge)}>Credentials</button>
              <button class="btn sm text danger-text" ?disabled=${this.saving} aria-label=${`Remove ${bridge.name || 'bridge'}`} @click=${() => this.confirmDeleteBridge(bridge)}>${icon('trash')}</button>
            `}
          </span>
        </div>
        ${skipped && !connected && active ? html`<p class="skip">${skipped}</p>` : nothing}
        ${editing ? html`
          <form class="inline-form" @submit=${(e: Event) => { e.preventDefault(); void this.saveBridgeCredentials(bridge); }}>
            <div class="field">
              <label for=${`k-${bridge.uuid}`}>API key</label>
              <input id=${`k-${bridge.uuid}`} type="password" autocomplete="off" placeholder="Leave blank to keep the current key" .value=${this.editApiKey}
                @input=${(e: Event) => this.editApiKey = (e.target as HTMLInputElement).value} />
            </div>
            <div class="field">
              <label for=${`o-${bridge.uuid}`}>OTA password</label>
              <input id=${`o-${bridge.uuid}`} type="password" autocomplete="off" placeholder="Needed to update the bridge over WiFi" .value=${this.editOtaPassword}
                @input=${(e: Event) => this.editOtaPassword = (e.target as HTMLInputElement).value} />
            </div>
            <div class="form-actions">
              <button type="button" class="btn" ?disabled=${this.saving} @click=${this.cancelEditing}>Cancel</button>
              <button type="submit" class="btn primary" ?disabled=${this.saving}>Save</button>
            </div>
          </form>
        ` : nothing}
      </li>
    `;
  }

  render() {
    if (this.loading) return html`<div class="card loading"><span class="spinner"></span>Loading settings…</div>`;

    return html`
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Settings</h1>
            <p class="sub">Bridges, the Home Assistant integration, secrets and the build host.</p>
          </div>
        </div>

        ${this.error ? html`<div class="notice danger" role="alert">${icon('alert')}<span>${this.error}</span></div>` : nothing}
        ${this.saved ? html`<div class="notice ok" role="status">${icon('checkCircle')}<span>${this.saved}</span></div>` : nothing}

        <section class="card" id="settings-connection">
          <div class="card-head">
            <div>
              <h2>Bridges</h2>
              <p class="sub">One bridge is active at a time. Others are kept on standby.</p>
            </div>
            <div class="page-actions">
              <button class="btn sm" @click=${this.viewScanLog}>${this.showScanLog ? 'Hide scan log' : 'Scan log'}</button>
              <button class="btn sm" ?disabled=${this.saving} @click=${() => this.showManualEntry = !this.showManualEntry}>${this.showManualEntry ? 'Cancel' : 'Add by address'}</button>
              <button class="btn sm primary" ?disabled=${this.discovering} @click=${this.triggerScan}>
                ${this.discovering ? html`<span class="spinner"></span>Searching…` : html`${icon('search')}Find bridges`}
              </button>
            </div>
          </div>

          ${this.configuredBridges.length > 0
            ? html`<ul class="bridges">${this.configuredBridges.map((b) => this.renderBridge(b))}</ul>`
            : html`<div class="empty">${icon('bridge')}<strong>No bridges yet</strong><p>Find a bridge on your network, or add one by address.</p></div>`}

          ${this.discovering ? html`<p class="pad hint">Searching your network for ESP Tree bridges. This takes about 8 seconds.</p>` : nothing}

          ${this.discoveredBridges.length > 0 ? html`
            <div class="sub-section">
              <h3>Found on your network</h3>
              <ul class="bridges">
                ${this.discoveredBridges.map((bridge) => html`
                  <li>
                    <div class="bridge-row">
                      <span class="node-icon" aria-hidden="true">${icon('wifi')}</span>
                      <span class="what">
                        <strong>${bridge.name || bridge.host}</strong>
                        <small><span class="mono">${bridge.host}:${bridge.port}</span>${bridge.hostname ? ` · ${bridge.hostname}` : ''}${bridge.network_id ? ` · network ${bridge.network_id}` : ''}</small>
                      </span>
                      <input class="key" type="password" autocomplete="off" aria-label="API key" placeholder="API key" .value=${this.newBridgeApiKey}
                        @input=${(e: Event) => this.newBridgeApiKey = (e.target as HTMLInputElement).value} />
                      <span class="row-actions"><button class="btn sm primary" ?disabled=${this.saving} @click=${() => this.selectBridge(bridge)}>Use this bridge</button></span>
                    </div>
                  </li>
                `)}
              </ul>
            </div>
          ` : nothing}

          ${this.showManualEntry ? html`
            <form class="sub-section manual" @submit=${(e: Event) => { e.preventDefault(); void this.addManualBridge(); }}>
              <h3>Add a bridge by address</h3>
              <div class="manual-grid">
                <div class="field">
                  <label for="mh">Host or IP address</label>
                  <input id="mh" type="text" placeholder="192.168.1.50 or bridge.local" .value=${this.manualHost} @input=${(e: Event) => this.manualHost = (e.target as HTMLInputElement).value} />
                </div>
                <div class="field">
                  <label for="mp">Port</label>
                  <input id="mp" type="number" min="1" max="65535" .value=${String(this.manualPort)} @input=${(e: Event) => this.manualPort = Number((e.target as HTMLInputElement).value || 80)} />
                </div>
                <div class="field">
                  <label for="mk">API key</label>
                  <input id="mk" type="password" autocomplete="off" .value=${this.manualApiKey} @input=${(e: Event) => this.manualApiKey = (e.target as HTMLInputElement).value} />
                </div>
              </div>
              <div class="form-actions"><button type="submit" class="btn primary" ?disabled=${this.saving}>Connect</button></div>
            </form>
          ` : nothing}

          ${this.showScanLog ? html`
            <div class="sub-section">
              <h3>Scan log</h3>
              ${this.scanLogLoading ? html`<p class="hint"><span class="spinner"></span></p>` : html`<pre class="log">${this.scanLogContent || 'No scans yet.'}</pre>`}
            </div>
          ` : nothing}
        </section>

        <section class="card" id="settings-integration">
          <div class="card-head">
            <div>
              <h2>Home Assistant integration</h2>
              <p class="sub">Turns remotes into Home Assistant devices and entities.</p>
            </div>
            <a href="#/activity-log" class="btn sm">${icon('activity')}Activity</a>
          </div>
          <div class="card-body">${this.renderIntegrationStatus()}</div>
        </section>

        <section class="card">
          <div class="setting">
            <span class="what">
              <strong>Secrets</strong>
              <small>secrets.yaml holds the WiFi and ESP-NOW credentials every build uses.</small>
            </span>
            <a class="btn sm" href="#/secrets?from=${encodeURIComponent('/settings')}">${icon('key')}Edit secrets</a>
          </div>
        </section>

        <section class="card" id="settings-build">
          <div class="card-head">
            <div>
              <h2>Build host</h2>
              <p class="sub">The ESPHome toolchain inside the add-on that compiles firmware.</p>
            </div>
          </div>
          <div class="setting">
            <span class="what">
              <strong>ESPHome ${this.containerStatus?.tag || ''}</strong>
              <small>${this.containerStatus?.error || (this.containerStatus?.available ? 'Ready to build' : 'Not available')}</small>
            </span>
            ${this.containerStatus?.available
              ? html`<span class="chip ok"><span class="dot ok"></span>Available</span>`
              : html`<span class="chip danger"><span class="dot danger"></span>Unavailable</span>`}
          </div>
          <div class="setting">
            <span class="what">
              <strong>Build cache</strong>
              <small>${this.artifactsMessage || 'Clear it to free disk space or recover from a stale build. The next build is slower.'}</small>
            </span>
            <button class="btn sm" ?disabled=${this.cleaningArtifacts} @click=${() => this.confirmCleanArtifacts()}>${this.cleaningArtifacts ? 'Clearing…' : 'Clear cache…'}</button>
          </div>
        </section>

        <esp-confirm-dialog .request=${this.confirm} @closed=${() => { this.confirm = null; }}></esp-confirm-dialog>
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }
    .card { overflow: hidden; }
    .card-head .page-actions .btn svg, .card-head > .btn svg, .setting .btn svg { width: 16px; height: 16px; }
    .card-head .spinner { width: 14px; height: 14px; border-color: currentColor; border-top-color: transparent; }
    .pad { padding: 0 16px 16px; }
    .bridges { list-style: none; margin: 0; padding: 0; }
    .bridges li { border-top: 1px solid var(--line); }
    .bridges li:first-child { border-top: 0; }
    .bridge-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; flex-wrap: wrap; }
    .node-icon { display: grid; place-items: center; width: 36px; height: 36px; flex: none; border-radius: 50%; background: var(--surface-subtle); color: var(--muted); }
    .node-icon.on { background: var(--primary-soft); color: var(--primary); }
    .node-icon svg { width: 20px; height: 20px; }
    .what { display: grid; gap: 2px; flex: 1 1 220px; min-width: 0; }
    .what strong { display: flex; align-items: center; gap: 8px; font-weight: 500; }
    .what small { color: var(--muted); font-size: var(--text-sm); overflow-wrap: anywhere; }
    .row-actions { display: flex; gap: 4px; align-items: center; margin-left: auto; }
    .danger-text { color: var(--danger); }
    .danger-text:hover:not(:disabled) { background: var(--danger-soft); }
    .row-actions .btn svg { width: 18px; height: 18px; }
    .skip { margin: -6px 16px 12px 64px; color: var(--muted); font-size: var(--text-sm); }
    .key { width: 180px; min-height: 30px; }
    .inline-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 0 16px 16px 64px; }
    .form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 8px; }
    .sub-section { display: grid; gap: 10px; padding: 14px 16px 16px; border-top: 1px solid var(--line); background: var(--surface-subtle); }
    .sub-section h3 { font-size: var(--text-md); font-weight: 500; }
    .sub-section .bridges li { border-color: var(--line); }
    .sub-section .bridge-row { padding: 8px 0; }
    .manual-grid { display: grid; grid-template-columns: minmax(0, 2fr) 110px minmax(0, 1.5fr); gap: 12px; }
    .status-line { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; color: var(--ink-2); }
    .warn-text { color: var(--accent); }
    .setting { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px; border-top: 1px solid var(--line); }
    .card > .setting:first-child { border-top: 0; }
    .card-head + .setting { border-top: 0; }
    .hint .spinner { display: inline-block; }
    @media (max-width: 760px) {
      .inline-form { grid-template-columns: minmax(0, 1fr); padding-left: 16px; }
      .manual-grid { grid-template-columns: minmax(0, 1fr); }
      .row-actions { margin-left: 48px; }
      .key { flex: 1 1 100%; width: auto; }
      .skip { margin-left: 16px; }
    }
  `];
}
