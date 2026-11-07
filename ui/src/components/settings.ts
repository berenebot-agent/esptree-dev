import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { AppConfig, ConfiguredBridge, ContainerStatusInfo, DiscoveredBridge, api } from '../api/client';

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

  private renderIntegrationStatus() {
    const int = this.config?.integration;
    if (!int) {
      return html`<p class="int-status-note muted">Loading integration status...</p>`;
    }

    const { installed, loaded, configured, connected, bridge_count, remote_count } = int;
    // remote_count includes offline remotes kept from earlier sessions, so show the
    // online split when the integration reports it. Older integrations don't send it:
    // fall back to a neutral count rather than claiming the total is online.
    const hasOnline = typeof int.remotes_online === 'number';
    const online = hasOnline ? int.remotes_online! : 0;
    const offline = hasOnline ? remote_count - online : 0;

    if (!installed) {
      return html`
        <div class="int-status-row">
          <span class="status-dot red"></span>
          <span>Integration files not found — Restart Home Assistant to complete installation</span>
        </div>
      `;
    }

    if (!loaded) {
      return html`
        <div class="int-status-row">
          <span class="status-dot yellow"></span>
          <span>Integration installed but not yet loaded — Restart Home Assistant</span>
        </div>
        <button class="btn btn-primary" ?disabled=${this.restarting} @click=${this.restartHa}>
          ${this.restarting ? 'Restarting...' : 'Restart Home Assistant'}
        </button>
        ${this.restartFeedback ? html`<p class="saved">${this.restartFeedback}</p>` : nothing}
      `;
    }

    if (!configured && !loaded) {
      return html`
        <div class="int-status-row">
          <span class="status-dot yellow"></span>
          <span>Integration not yet configured</span>
        </div>
        <div class="int-configure-hint">
          <strong>Add ESP-Tree integration</strong>
          <p>Go to <strong>Settings → Devices &amp; Services → Add Integration</strong> → search for <em>ESP-Tree</em></p>
        </div>
      `;
    }

    if (!connected) {
      return html`
        <div class="int-status-row">
          <span class="status-dot gray"></span>
          <span>Bridge connection lost</span>
        </div>
      `;
    }

    return html`
      <div class="int-connected-box">
        <div class="int-connected-header">
          <span class="status-dot green pulse"></span>
          <span class="int-connected-label">Connected v${int.version || '?'}</span>
        </div>
        <div class="int-connected-counts">
          ${bridge_count > 0 ? html`<span>${bridge_count} ${bridge_count === 1 ? 'bridge' : 'bridges'}</span>` : nothing}
          ${hasOnline
            ? html`
                ${online > 0 ? html`<span>${online} ${online === 1 ? 'remote' : 'remotes'} online</span>` : nothing}
                ${offline > 0 ? html`<span class="muted">${offline} offline</span>` : nothing}
                ${online === 0 && offline === 0 ? html`<span>no remotes</span>` : nothing}
              `
            : html`<span>${remote_count} ${remote_count === 1 ? 'remote' : 'remotes'} known</span>`}
        </div>
      </div>
    `;
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

  private scrollToSection(id: string): void {
    this.shadowRoot?.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render() {
    if (this.loading) return html`<section class="card loading-card">Loading settings…</section>`;

    return html`
      <div class="settings-page">
        <div class="page-head">
          <div class="page-heading">
            <span class="eyebrow">Configuration</span>
            <h1>Settings</h1>
            <p>Manage the bridge connection, Home Assistant integration, and the local build environment.</p>
          </div>
          <div class="page-actions">
            <button class="btn" @click=${() => { window.location.hash = '/secrets'; }}>Open secrets</button>
          </div>
        </div>

        <nav class="settings-nav" aria-label="Settings sections">
          <button @click=${() => this.scrollToSection('settings-connection')}>Bridge connection</button>
          <button @click=${() => this.scrollToSection('settings-integration')}>Integration</button>
          <button @click=${() => this.scrollToSection('settings-build')}>Build environment</button>
        </nav>

        <div class="settings-stack">
          <section class="card settings-card" id="settings-connection">
            <div class="title">
              <span class="section-mark">01</span>
              <span class="section-copy"><h2>Bridge connection</h2><p>Discover, activate, or update the bridge that carries this network.</p></span>
            </div>

        <div class="actions">
          <button class="btn btn-primary" ?disabled=${this.discovering} @click=${this.triggerScan}>
            ${this.discovering ? html`<span class="spinner"></span> Scanning...` : 'Scan Network'}
          </button>
          <button class="btn" ?disabled=${this.saving} @click=${() => this.showManualEntry = !this.showManualEntry}>
            ${this.showManualEntry ? 'Cancel' : 'Manual IP'}
          </button>
          <button class="btn" @click=${this.viewScanLog}>
            ${this.showScanLog ? 'Hide Scan Log' : 'View Scan Log'}
          </button>
        </div>

        ${this.showScanLog ? html`
          <div class="scan-log">
            <h3>Scan Log</h3>
            ${this.scanLogLoading ? html`<p class="info">Loading...</p>` : html`
              <pre class="scan-log-content">${this.scanLogContent}</pre>
            `}
          </div>
        ` : nothing}

        ${this.showManualEntry ? html`
          <div class="manual-entry">
            <div class="manual-form">
              <label>
                Host / IP
                <input type="text" placeholder="192.168.1.50 or hostname.local" .value=${this.manualHost} @input=${(e: Event) => this.manualHost = (e.target as HTMLInputElement).value} />
              </label>
              <label>
                Port
                <input type="number" min="1" max="65535" .value=${String(this.manualPort)} @input=${(e: Event) => this.manualPort = Number((e.target as HTMLInputElement).value || 80)} />
              </label>
              <label>
                API Key
                <input type="password" placeholder="API Key" .value=${this.manualApiKey} @input=${(e: Event) => this.manualApiKey = (e.target as HTMLInputElement).value} />
              </label>
            </div>
            <button class="btn btn-primary" ?disabled=${this.saving} @click=${this.addManualBridge}>Connect</button>
          </div>
        ` : nothing}

        ${this.discovering ? html`<p class="info">Scanning your network for bridges (8s)...</p>` : nothing}

        ${this.discoveredBridges.length > 0 ? html`
          <div class="bridge-list">
            <h3>Discovered Bridges</h3>
            <table class="bridge-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Hostname</th>
                  <th>IP</th>
                  <th>Port</th>
                  <th>Network ID</th>
                  <th>API Key</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${this.discoveredBridges.map(bridge => html`
                  <tr>
                    <td><strong>${bridge.name || bridge.host}</strong></td>
                    <td>${bridge.hostname || '-'}</td>
                    <td>${bridge.host}</td>
                    <td>${bridge.port}</td>
                    <td>${bridge.network_id || '-'}</td>
                    <td>
                      <input
                        type="password"
                        placeholder="API Key"
                        .value=${this.newBridgeApiKey}
                        @input=${(e: Event) => this.newBridgeApiKey = (e.target as HTMLInputElement).value}
                      />
                    </td>
                    <td>
                      <button class="btn btn-primary" ?disabled=${this.saving} @click=${() => this.selectBridge(bridge)}>
                        Select
                      </button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        ` : nothing}

        ${this.configuredBridges.length > 0 ? html`
          <div class="bridge-list-container">
            <h3>Configured Bridges</h3>
            <table class="bridge-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Hostname</th>
                  <th>IP</th>
                  <th>Port</th>
                  <th>Network ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.configuredBridges.map(bridge => html`
                  <tr class="${this.isBridgeActive(bridge) ? 'active-row' : ''}">
                    <td>
                      <span class="bridge-status ${this.isBridgeConnected(bridge) ? 'connected' : 'disconnected'}">
                        ${this.isBridgeConnected(bridge) ? 'connected' : 'disconnected'}
                      </span>
                      ${this.isBridgeActive(bridge) ? html`<span class="active-badge">Active</span>` : nothing}
                      ${this.bridgeSkippedReason(bridge)
                        ? html`<div class="bridge-skip-reason">${this.bridgeSkippedReason(bridge)}</div>`
                        : nothing}
                    </td>
                    <td>
                      ${bridge.name || '-'}
                      ${this.isSerial(bridge) ? html`<span class="active-badge">Serial</span>` : nothing}
                    </td>
                    <td>${this.bridgeHostname(bridge)}</td>
                    <td>${this.bridgeAddress(bridge)}</td>
                    <td>${this.isSerial(bridge) ? '-' : (bridge.port || '-')}</td>
                    <td>${bridge.network_id || '-'}</td>
                    <td class="actions-cell">
                      ${this.editingBridgeId === bridge.uuid ? html`
                        <input
                          type="password"
                          placeholder="API Key"
                          .value=${this.editApiKey}
                          @input=${(e: Event) => this.editApiKey = (e.target as HTMLInputElement).value}
                        />
                        <input
                          type="password"
                          placeholder="OTA password"
                          title="The ESPHome OTA password this bridge was compiled with — required to update it over the air"
                          .value=${this.editOtaPassword}
                          @input=${(e: Event) => this.editOtaPassword = (e.target as HTMLInputElement).value}
                        />
                        <button class="btn btn-primary" ?disabled=${this.saving} @click=${() => this.saveBridgeCredentials(bridge)}>Save</button>
                        <button class="btn" ?disabled=${this.saving} @click=${this.cancelEditing}>Cancel</button>
                      ` : html`
                        ${this.isBridgeActive(bridge)
                          ? html`<button class="btn" ?disabled=${this.saving} @click=${() => this.deactivateBridge(bridge)}>Deactivate</button>`
                          : html`<button class="btn btn-primary" ?disabled=${this.saving} @click=${() => this.activateBridge(bridge)}>Activate</button>`}
                        <button class="btn" ?disabled=${this.saving} @click=${() => this.startEditingBridge(bridge)}>Edit credentials</button>
                        <button class="btn btn-danger" ?disabled=${this.saving} @click=${() => this.deleteBridge(bridge)}>Delete</button>
                      `}
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        ` : nothing}

        ${this.error ? html`<p class="error">${this.error}</p>` : nothing}
        ${this.saved ? html`<p class="saved">${this.saved}</p>` : nothing}
      </section>

      <section class="card integration-status-card settings-card" id="settings-integration">
        <div class="title">
          <span class="section-mark">02</span>
          <span class="section-copy"><h2>Home Assistant integration</h2><p>Connection state, entity counts, and restart requirements.</p></span>
        </div>
        <div class="int-status-row-layout">
          ${this.renderIntegrationStatus()}
          <div class="actions">
            <a href="#/activity-log" class="btn">
              Open activity
              <span class="sub">Bridge, remote, and protobuf events</span>
            </a>
          </div>
        </div>
      </section>

      <section class="card settings-card" id="settings-build">
        <div class="title">
          <span class="section-mark">03</span>
          <span class="section-copy"><h2>Build environment</h2><p>The local ESPHome toolchain used for firmware compilation.</p></span>
        </div>

        <div class="current">
          <div><span>Status</span><strong class=${this.containerStatus?.available ? 'ok' : 'danger'}>${this.containerStatus?.available ? 'Available' : 'Unavailable'}</strong></div>
          <div><span>ESPHome</span><strong>${this.containerStatus?.tag || 'unknown'}</strong></div>
          ${this.containerStatus?.error ? html`<div><span>Error</span><strong>${this.containerStatus.error}</strong></div>` : nothing}
        </div>

        <div class="actions">
          <button class="btn btn-danger" ?disabled=${this.cleaningArtifacts} @click=${this.cleanArtifacts}>Clean build artifacts</button>
        </div>

        ${this.artifactsMessage ? html`<p class="info">${this.artifactsMessage}</p>` : nothing}

        <p class="hint">Removes the PlatformIO cache and ESPHome build output. Useful for freeing space or resolving stale build state; the next compile will be slower.</p>
      </section>
        </div>
      </div>
    `;
  }

  static styles = css`
    .card {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 16px 20px;
      display: grid;
      gap: 16px;
      margin-bottom: 16px;
    }

    .title span,
    .current span {
      color: var(--primary);
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
    }

    h2 {
      margin: 3px 0 0;
      font-size: 16px;
      font-weight: 600;
    }

    h3 {
      margin: 8px 0 4px;
      font-size: 13px;
      font-weight: 600;
      color: var(--muted);
    }

    .current {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 8px;
    }

    .current > div {
      background: #f8fafc;
      padding: 10px 12px;
      border-radius: 8px;
      border: 1px solid #f1f5f9;
    }

    .current span {
      display: block;
      color: #94a3b8;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .current strong {
      display: block;
      margin-top: 4px;
      overflow-wrap: anywhere;
      font-size: 14px;
      font-weight: 500;
    }

    .ok { color: var(--ok); }
    .danger { color: var(--danger); }

    .bridge-list-container {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 16px 20px;
      margin-bottom: 16px;
    }

    .bridge-list {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      padding: 12px;
    }

    .bridge-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .bridge-table th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--muted);
      font-weight: 600;
      padding: 6px 8px;
      border-bottom: 2px solid var(--line);
    }

    .bridge-table td {
      padding: 8px;
      border-bottom: 1px solid #f1f5f9;
    }

    .bridge-table tr:last-child td {
      border-bottom: none;
    }

    .bridge-table .actions-cell {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-wrap: wrap;
    }

    .bridge-table input[type="password"] {
      padding: 4px 8px;
      font-size: 12px;
      border: 1px solid var(--line);
      border-radius: 6px;
    }

    .bridge-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
      gap: 12px;
    }

    .bridge-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .bridge-item:first-child {
      padding-top: 0;
    }

    .bridge-item.default {
      background: #dcfce7;
      margin: -12px;
      padding: 10px 12px;
      border-radius: 8px;
    }

    .bridge-info {
      display: flex;
      flex-direction: row;
      gap: 12px;
      align-items: center;
    }

    .bridge-info strong {
      font-size: 14px;
      font-weight: 600;
    }

    .bridge-info span {
      font-size: 12px;
      color: var(--muted);
    }

    .bridge-info .version {
      color: var(--ok);
    }

    .bridge-info .via {
      font-size: 11px;
      text-transform: uppercase;
    }

    .bridge-status {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid;
    }

    .bridge-status.connected {
      color: var(--ok);
      border-color: var(--ok);
      background: #dcfce7;
    }

    .bridge-status.disconnected {
      color: var(--danger);
      border-color: var(--danger);
      background: #fee2e2;
    }

    /* Why a bridge has no client (e.g. "bridge has no api_key"). Without this the
       row looked healthy while no client was ever started. */
    .bridge-skip-reason {
      margin-top: 4px;
      font-size: 10px;
      line-height: 1.25;
      color: var(--danger);
      text-transform: none;
      font-weight: 500;
      max-width: 22ch;
    }

    .active-badge {
      color: var(--ok);
      background: #dcfce7;
      border: 1px solid var(--ok);
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      text-transform: uppercase;
    }

    .bridge-form {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .manual-entry {
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .manual-form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 100px;
      gap: 12px;
    }

    .manual-form label {
      display: grid;
      gap: 4px;
      font-weight: 500;
      font-size: 13px;
    }

    .manual-form input {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 38px;
      padding: 8px 12px;
      font: inherit;
      font-size: 14px;
      background: var(--surface);
      color: var(--ink);
    }

    .manual-form input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(11,59,75,0.1);
    }

    .bridge-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .unavailable-note {
      background: #fef2f2;
      border: 1px solid var(--danger);
      padding: 12px;
      border-radius: 8px;
    }
    .unavailable-note strong {
      color: var(--danger);
      font-size: 14px;
      display: block;
      margin-bottom: 4px;
    }
    .unavailable-note p {
      margin: 2px 0;
      font-size: 12px;
      color: var(--ink);
    }

    .form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 140px;
      gap: 12px;
    }

    label {
      display: grid;
      gap: 4px;
      font-weight: 500;
      font-size: 13px;
    }

    input[type="text"],
    input[type="password"] {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 38px;
      padding: 8px 12px;
      font: inherit;
      font-size: 14px;
      background: var(--surface);
      color: var(--ink);
      transition: border-color 0.12s;
    }

    input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(11,59,75,0.1);
    }

    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all 0.12s;
      min-height: 38px;
    }

    .btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    a.btn {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      text-decoration: none;
    }

    a.btn .sub {
      font-size: 10px;
      font-weight: 400;
      color: var(--muted);
      line-height: 1;
    }

    .btn-primary {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: #0d4d5e;
    }

    .btn-danger {
      background: var(--danger);
      color: #fff;
      border-color: var(--danger);
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    button:disabled,
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error,
    .saved,
    .info {
      margin: 0;
      font-weight: 500;
      font-size: 13px;
    }

    .error {
      color: var(--danger);
      padding: 10px 12px;
      background: #fef2f2;
      border: 1px solid var(--danger);
      border-radius: 6px;
    }

    .saved {
      color: var(--ok);
      padding: 10px 12px;
      background: #dcfce7;
      border: 1px solid var(--ok);
      border-radius: 6px;
    }

    .info {
      color: var(--primary);
    }

    .hint {
      font-size: 11px;
      color: var(--muted);
      margin: 0;
    }

    .toggle-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }

    .toggle input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .toggle-label {
      font-weight: 500;
      font-size: 14px;
    }

    .scan-log {
      margin-top: 12px;
    }

    .scan-log h3 {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .scan-log-content {
      background: #1e293b;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 6px;
      font-family: 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      line-height: 1.5;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
      max-height: 400px;
      overflow-y: auto;
      margin: 0;
    }

    

    .int-status-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-dot.red { background: #ef4444; }
    .status-dot.yellow { background: #eab308; }
    .status-dot.gray { background: #9ca3af; }
    .status-dot.green { background: #22c55e; }

    .status-dot.green.pulse {
      animation: pulse-green 2s ease-in-out infinite;
    }

    @keyframes pulse-green {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.85); }
    }

    .int-status-note {
      font-size: 13px;
    }

    .int-configure-hint {
      margin-top: 8px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #f1f5f9;
    }

    .int-configure-hint strong {
      display: block;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .int-configure-hint p {
      margin: 0;
      font-size: 13px;
      color: #64748b;
    }

    .int-connected-box {
      border: 2px solid #22c55e;
      border-radius: 10px;
      padding: 14px 16px;
      background: #f0fdf4;
    }

    .int-connected-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .int-connected-label {
      font-size: 15px;
      font-weight: 600;
      color: #166534;
    }

    .int-connected-counts {
      margin-top: 6px;
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #15803d;
    }

    .int-status-row-layout {
      display: flex;
      gap: 16px;
      align-items: stretch;
    }

    .int-status-row-layout .actions {
      flex: 1;
      display: flex;
      align-items: center;
    }

    .muted {
      color: var(--muted);
    }

    @media (max-width: 760px) {
      .current,
      .form,
      .manual-form {
        grid-template-columns: 1fr;
      }

      .bridge-item,
      .bridge-form,
      .bridge-actions {
        align-items: stretch;
        flex-direction: column;
      }

      .bridge-info {
        align-items: flex-start;
        flex-direction: column;
        gap: 6px;
      }

      .int-status-row-layout {
        flex-direction: column;
      }
    }

    /* ---- Settings page shell and section rhythm ---- */
    :host { display: block; color: var(--ink); }
    * { box-sizing: border-box; }
    .settings-page { display: flex; flex-direction: column; gap: 18px; }
    .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
    .page-heading { display: flex; flex-direction: column; gap: 5px; }
    .eyebrow { color: var(--primary); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    h1 { margin: 0; font-size: 27px; line-height: 1.15; letter-spacing: -.035em; font-weight: 700; }
    .page-heading p { margin: 2px 0 0; max-width: 66ch; color: var(--muted); font-size: 13px; line-height: 1.5; }
    .page-actions { display: flex; gap: 8px; flex-shrink: 0; }
    .settings-nav { display: flex; align-items: center; gap: 3px; padding: 3px; width: fit-content; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); box-shadow: var(--shadow-sm); }
    .settings-nav button { min-height: 29px; padding: 0 10px; border: 0; border-radius: 5px; background: transparent; color: var(--muted); font: inherit; font-size: 10px; font-weight: 600; cursor: pointer; }
    .settings-nav button:hover { background: var(--surface-subtle); color: var(--ink); }
    .settings-nav button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
    .settings-stack { display: flex; flex-direction: column; gap: 16px; }
    .settings-card { margin: 0 !important; padding: 20px 22px !important; border: 1px solid var(--line) !important; border-radius: var(--radius-lg) !important; background: var(--surface) !important; box-shadow: var(--shadow-sm) !important; scroll-margin-top: 82px; }
    .settings-card .title { display: flex; align-items: flex-start; gap: 11px; }
    .section-mark { display: grid; place-items: center; width: 24px; height: 24px; flex: 0 0 24px; border-radius: 6px; background: var(--primary-soft); color: var(--primary) !important; font-family: var(--font-mono); font-size: 9px !important; font-weight: 700 !important; letter-spacing: 0 !important; text-transform: none !important; }
    .section-copy { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .section-copy h2 { margin: 0 !important; color: var(--ink); font-size: 16px !important; line-height: 1.3; font-weight: 650 !important; letter-spacing: -.015em; }
    .section-copy p { margin: 0; color: var(--muted); font-size: 10px; line-height: 1.4; }
    .settings-card .actions { gap: 6px; }
    .settings-card .btn { min-height: 34px; padding: 0 12px; border-radius: 6px; font-size: 11px; }
    .settings-card .btn-primary { background: var(--primary); border-color: var(--primary); }
    .settings-card .btn-primary:hover { background: var(--primary-strong); }
    .settings-card .btn-danger { background: var(--surface); border-color: #e5c2c4; color: var(--danger); }
    .settings-card .btn-danger:hover { background: var(--danger-soft); }
    .settings-card .bridge-list-container { padding: 0; border: 0; box-shadow: none; margin: 0; background: transparent; }
    .settings-card .bridge-list-container > h3, .settings-card .bridge-list > h3 { margin: 8px 0 0; color: var(--muted); font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
    .settings-card .bridge-table { font-size: 11px; }
    .settings-card .bridge-table th { padding: 8px; border-bottom: 1px solid var(--line); color: var(--faint); font-size: 9px; letter-spacing: .06em; }
    .settings-card .bridge-table td { padding: 10px 8px; border-bottom: 1px solid var(--line); color: var(--ink-2); vertical-align: middle; }
    .settings-card .bridge-table .actions-cell { gap: 5px; }
    .settings-card .bridge-table .btn { min-height: 29px; padding: 0 8px; font-size: 10px; }
    .settings-card .bridge-status { font-size: 8px; padding: 2px 6px; border-radius: 3px; }
    .settings-card .active-badge { font-size: 8px; padding: 2px 6px; border-radius: 3px; border-color: #cfe5d5; color: var(--ok); background: var(--ok-soft); }
    .settings-card .manual-entry, .settings-card .scan-log { margin-top: 13px; border: 1px solid var(--line); background: var(--surface-subtle); border-radius: 8px; padding: 13px; }
    .settings-card .current { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; }
    .settings-card .current > div { min-height: 64px; border: 1px solid var(--line); border-radius: 7px; background: var(--surface-subtle); padding: 11px 12px; }
    .settings-card .current span { color: var(--faint); font-size: 9px; letter-spacing: .06em; }
    .settings-card .current strong { color: var(--ink); font-size: 12px; }
    .settings-card .int-status-row-layout { align-items: flex-start; gap: 18px; }
    .settings-card .int-connected-box { border: 1px solid #cfe5d5; border-radius: 8px; background: var(--ok-soft); padding: 14px 15px; }
    .settings-card .int-connected-label { color: var(--ok); font-size: 13px; }
    .settings-card .int-connected-counts { color: var(--muted); font-size: 11px; }
    .settings-card .hint { color: var(--muted); font-size: 10px; line-height: 1.45; }
    .settings-card .error, .settings-card .saved { border-radius: 6px; font-size: 11px; }
    .loading-card { padding: 30px; color: var(--muted); font-size: 12px; }

    @media (max-width: 800px) {
      .page-head { align-items: flex-start; flex-direction: column; gap: 13px; }
      h1 { font-size: 24px; }
      .page-actions { width: 100%; }
      .page-actions .btn { width: 100%; }
      .settings-nav { width: 100%; overflow-x: auto; }
      .settings-nav button { flex: 1 0 auto; }
      .settings-card { padding: 17px 15px !important; }
      .settings-card .bridge-list-container { overflow-x: auto; }
      .settings-card .bridge-table { min-width: 650px; }
      .settings-card .title { gap: 9px; }
      .settings-card .int-status-row-layout { flex-direction: column; }
      .settings-card .current { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .settings-card .actions { width: 100%; }
      .settings-card .actions .btn { flex: 1; }
      .settings-nav button { font-size: 9px; padding: 0 8px; }
    }
  `;
}
