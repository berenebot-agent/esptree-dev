import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BridgeFirmwareStatus, ConfigStatus, OtaJob, QueueResponse, TopologyNode, api, normalizeMac, streamTopology, TopologyStreamHandle, WsTopologyMessage } from '../api/client';
import './topology-node';

interface ConfirmRequest {
  title: string;
  message: string;
  detail: string;
  confirmLabel: string;
  danger?: boolean;
  run: () => Promise<void>;
}

@customElement('esp-topology-map')
export class EspTopologyMap extends LitElement {
  @state() private topology: TopologyNode[] = [];
  @state() private currentJob: OtaJob | null = null;
  @state() private queueData: QueueResponse | null = null;
  @state() private configStatuses: Map<string, ConfigStatus> = new Map();
  @state() private firmwareStatus: BridgeFirmwareStatus | null = null;
  @state() private loading = true;
  @state() private error = '';
  @state() private hiddenExpanded = false;
  @state() private query = '';
  @state() private filter: 'all' | 'online' | 'offline' = 'all';
  @state() private pendingConfirm: ConfirmRequest | null = null;
  @state() private confirmBusy = false;
  private stream: TopologyStreamHandle | undefined;
  private firmwareTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    void this.load();
    this.stream = streamTopology((msg: WsTopologyMessage) => {
      if (msg.type === 'topology.snapshot' || msg.type === 'topology.changed' || msg.type === 'remote.availability' || msg.type === 'bridge.heartbeat') {
        void this.load(false, true);
      }
    });
  }

  disconnectedCallback(): void {
    this.stream?.close();
    this.stopFirmwarePolling();
    super.disconnectedCallback();
  }

  private stopFirmwarePolling(): void {
    if (this.firmwareTimer) {
      clearInterval(this.firmwareTimer);
      this.firmwareTimer = null;
    }
  }

  /**
   * Fetch the bridge's own firmware state (what it runs, whether an update can land).
   *
   * Kept off the topology poll: the endpoint probes the bridge's OTA port, which costs
   * a TCP timeout when the bridge is unreachable. It is read once per load, and on a
   * short timer only while an update is actually running so the badge advances through
   * build -> upload -> reboot without waiting for a topology event.
   */
  private async loadBridgeFirmware(topology: TopologyNode[]): Promise<void> {
    const bridge = topology.find((n) => n.is_bridge && n.bridge_uuid);
    if (!bridge?.bridge_uuid) {
      this.firmwareStatus = null;
      this.stopFirmwarePolling();
      return;
    }
    try {
      this.firmwareStatus = await api.bridgeFirmware(bridge.bridge_uuid);
    } catch {
      this.firmwareStatus = null;
    }
    const status = this.firmwareStatus?.job?.status ?? '';
    const running = !!status && !['success', 'failed', 'aborted', 'version_mismatch', 'rejoin_timeout'].includes(status);
    if (running && !this.firmwareTimer) {
      this.firmwareTimer = setInterval(() => void this.load(false, true), 3000);
    } else if (!running) {
      this.stopFirmwarePolling();
    }
  }

  private firmwareForMac(mac: string): BridgeFirmwareStatus | null {
    if (!this.firmwareStatus) return null;
    return normalizeMac(this.firmwareStatus.mac) === normalizeMac(mac) ? this.firmwareStatus : null;
  }

  private async handleUpdateFirmware(mac: string): Promise<void> {
    const bridge = this.topology.find((n) => normalizeMac(n.mac) === normalizeMac(mac));
    const uuid = this.firmwareStatus?.uuid || bridge?.bridge_uuid;
    if (!uuid) return;
    const label = bridge?.friendly_name || bridge?.esphome_name || bridge?.label || mac;
    const running = this.firmwareStatus?.running?.build_date;
    const run = async () => {
      await api.updateBridgeFirmware(uuid);
      await this.load(false, true);
    };
    this.pendingConfirm = {
      title: `Update firmware on ${label}?`,
      message: 'The bridge rebuilds its stored configuration, uploads the new image over WiFi, then reboots.',
      detail: `The ESP-NOW mesh will be offline for about a minute.${running ? ` Currently running: built ${running}.` : ''} If the new image cannot boot, the bridge must be reflashed over USB.`,
      confirmLabel: 'Update and reboot',
      run,
    };
    requestAnimationFrame(() => (this.shadowRoot?.querySelector('.confirm-primary') as HTMLElement | null)?.focus());
  }

  private closeConfirm(): void {
    if (this.confirmBusy) return;
    this.pendingConfirm = null;
  }

  private async runConfirm(): Promise<void> {
    const request = this.pendingConfirm;
    if (!request) return;
    this.confirmBusy = true;
    try {
      await request.run();
      this.pendingConfirm = null;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      this.pendingConfirm = null;
    } finally {
      this.confirmBusy = false;
    }
  }

  private async load(showLoading = true, bypassCache = false): Promise<void> {
    if (showLoading) this.loading = true;
    try {
      const [topology, current, queue] = await Promise.all([api.topology(bypassCache), api.currentOta(), api.getQueue()]);
      this.topology = topology;
      this.currentJob = current.job;
      this.queueData = queue;
      this.error = '';

      const configPromises = topology
        .filter((n) => (n.hops ?? 0) > 0)
        .map((n) => api.getConfigStatus(n.mac).catch(() => null));
      const results = await Promise.all(configPromises);
      const cs = new Map<string, ConfigStatus>();
      results.forEach((r) => {
        if (r) cs.set(normalizeMac(r.mac), r);
      });
      this.configStatuses = cs;
      void this.loadBridgeFirmware(topology);
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.loading = false;
    }
  }

  private async handleHideDevice(mac: string): Promise<void> {
    try {
      await api.hideDevice(mac);
      await this.load(false, true);
    } catch (err) {
      console.error('Failed to hide device:', err);
    }
  }

  private async handleUnhideDevice(mac: string): Promise<void> {
    try {
      await api.unhideDevice(mac);
      await this.load(false, true);
    } catch (err) {
      console.error('Failed to unhide device:', err);
    }
  }

  /**
   * Permanently delete a device, but only after it has been moved into Hidden Devices.
   */
  private async handleRemoveDevice(mac: string): Promise<void> {
    const node = this.topology.find((n) => n.mac === mac);
    if (!node?.hidden || node.is_bridge) return;
    const label = node.friendly_name || node.esphome_name || node.label || mac;
    this.pendingConfirm = {
      title: `Delete ${label} permanently?`,
      message: 'This removes the remote from ESP Tree and Home Assistant, including its retained history and firmware records.',
      detail: 'This cannot be undone. If the device is still powered on, it may reappear when it rejoins.',
      confirmLabel: 'Delete permanently',
      danger: true,
      run: async () => {
        await api.removeRemote(mac);
        await this.load(false, true);
      },
    };
    requestAnimationFrame(() => (this.shadowRoot?.querySelector('.confirm-primary') as HTMLElement | null)?.focus());
  }

  private jobForMac(mac: string): OtaJob | null {
    const nm = normalizeMac(mac);
    if (this.currentJob && normalizeMac(this.currentJob.mac) === nm) return this.currentJob;
    const queued = this.queueData?.queued_jobs ?? [];
    return queued.find(j => normalizeMac(j.mac) === nm) ?? null;
  }

  private configForMac(mac: string): ConfigStatus | null {
    return this.configStatuses.get(normalizeMac(mac)) ?? null;
  }

  private childKey(value?: string): string {
    return normalizeMac(value || '');
  }

  private buildChildren(): { root: TopologyNode | null; childMap: Map<string, TopologyNode[]> } {
    const childMap = new Map<string, TopologyNode[]>();
    for (const node of this.topology) {
      const parent = this.childKey(node.parent_mac);
      if (!parent) continue;
      const children = childMap.get(parent) || [];
      children.push(node);
      childMap.set(parent, children);
    }
    for (const children of childMap.values()) {
      children.sort((a, b) => (a.friendly_name || a.label || a.esphome_name || a.mac).localeCompare(b.friendly_name || b.label || b.esphome_name || b.mac));
    }
    const root = this.topology.find((node) => (node.hops ?? 0) === 0) || this.topology.find((node) => !node.parent_mac) || this.topology[0] || null;
    return { root, childMap };
  }

  render() {
    const { root } = this.buildChildren();
    const rootMac = this.childKey(root?.mac || '');
    // The topology list is what the bridge currently reports, plus remotes retained
    // from earlier sessions. A retained remote has no hop count, so filtering on
    // `hops > 0` dropped it off the page entirely - it stayed in the "known"
    // count with no row and no way to edit or clear it. Keep any non-hidden node
    // that is either reachable (hops > 0) or a retained remote (not the root
    // bridge), and let it render as an offline row.
    const allVisibleTopology = this.topology.filter((n) => {
      if (n.hidden) return false;
      if ((n.hops ?? 0) > 0) return true;
      return !n.is_bridge && this.childKey(n.mac) !== rootMac;
    });
    const hiddenDevices = this.topology.filter((n) => n.hidden);
    const remotes = allVisibleTopology.filter((n) => !n.is_bridge);
    const onlineRemotes = remotes.filter((n) => n.online);
    const offlineRemotes = remotes.length - onlineRemotes.length;
    const normalizedQuery = this.query.trim().toLowerCase();
    const matches = (node: TopologyNode) => {
      const byStatus = this.filter === 'all'
        || (this.filter === 'online' && !!node.online)
        || (this.filter === 'offline' && !node.online);
      if (!byStatus) return false;
      if (!normalizedQuery) return true;
      return [node.friendly_name, node.label, node.esphome_name, node.mac, node.chip_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    };
    const visibleTopology = allVisibleTopology.filter((n) => !!n.is_bridge || matches(n));

    const visibleMacs = new Set(visibleTopology.map((n) => this.childKey(n.mac)));
    const visibleChildMap = new Map<string, TopologyNode[]>();
    for (const node of visibleTopology) {
      if (this.childKey(node.mac) === rootMac) continue;
      let parent = this.childKey(node.parent_mac);
      // A retained remote has no parent_mac to hang off (or names a parent that is
      // gone), so park it under the bridge rather than dropping it from the tree.
      if (!parent || !visibleMacs.has(parent)) parent = rootMac;
      const children = visibleChildMap.get(parent) || [];
      children.push(node);
      visibleChildMap.set(parent, children);
    }
    for (const children of visibleChildMap.values()) {
      children.sort((a, b) => (a.friendly_name || a.label || a.esphome_name || a.mac).localeCompare(b.friendly_name || b.label || b.esphome_name || b.mac));
    }

    const directChildren = visibleChildMap.get(rootMac)?.length ?? 0;
    const maxDepth = allVisibleTopology.reduce((depth, node) => Math.max(depth, node.hops ?? 0), 0);
    const weakLinks = remotes.filter((n) => n.online && n.rssi != null && n.rssi <= -80).length;
    const running = this.currentJob ? 1 : 0;
    const queued = (this.queueData?.queued_jobs ?? []).length;
    const bridgeName = root ? (root.friendly_name || root.esphome_name || root.label || root.mac) : 'Bridge';
    const healthLabel = offlineRemotes === 0
      ? 'All remotes responding'
      : offlineRemotes === 1
        ? '1 remote needs attention'
        : `${offlineRemotes} remotes need attention`;

    return html`
      <div class="overview">
        <div class="page-head">
          <div class="page-heading">
            <span class="eyebrow">Live mesh</span>
            <h1>Network overview</h1>
            <p>See the bridge, every route, and what needs attention before you change anything.</p>
          </div>
          <div class="page-actions">
            <button class="btn" @click=${() => void this.load()} ?disabled=${this.loading}>${this.loading ? 'Refreshing…' : 'Refresh'}</button>
            <button class="btn primary" @click=${() => { window.location.hash = '/add-remote'; }}>+ Add remote</button>
          </div>
        </div>

        ${this.error ? html`<div class="callout error" role="alert"><strong>Could not read the network</strong><span>${this.error}</span></div>` : nothing}

        ${root ? html`
          <section class="network-banner" aria-label="Active bridge">
            <div class="bridge-identity">
              <span class="bridge-glyph" aria-hidden="true">
                <svg viewBox="0 0 32 32"><path d="M16 27V14M16 14l-6-5M16 14l6-5M10 9L7 6M22 9l3-3"/><circle cx="16" cy="6" r="2.3"/><circle cx="10" cy="9" r="2"/><circle cx="22" cy="9" r="2"/><circle cx="7" cy="6" r="1.3"/><circle cx="25" cy="6" r="1.3"/></svg>
              </span>
              <div class="bridge-copy">
                <span class="overline">Active bridge</span>
                <h2>${bridgeName}</h2>
                <div class="bridge-meta">
                  <span class="status ${root.online ? 'ok' : 'bad'}"><span class="dot"></span>${root.online ? 'Online' : 'Offline'}</span>
                  ${root.network_id ? html`<span class="meta-item">${root.network_id}</span>` : nothing}
                  ${root.chip_name ? html`<span class="meta-item">${root.chip_name}</span>` : nothing}
                  <span class="meta-item mono">${root.mac}</span>
                </div>
              </div>
            </div>
            <div class="bridge-health" aria-label=${healthLabel}>
              <span class="health-kicker">Mesh health</span>
              <strong>${onlineRemotes.length}<span class="health-total">/${remotes.length || 0}</span></strong>
              <span class="health-caption">${healthLabel}</span>
            </div>
          </section>

          <section class="stat-grid" aria-label="Network summary">
            <div class="stat">
              <span class="stat-label">Remotes online</span>
              <div class="stat-value">${onlineRemotes.length}<span>/${remotes.length}</span></div>
              <span class="stat-note ${offlineRemotes > 0 ? 'warn' : 'ok'}">${offlineRemotes > 0 ? `${offlineRemotes} offline` : 'All reachable'}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Direct bridge links</span>
              <div class="stat-value">${directChildren}</div>
              <span class="stat-note">${remotes.length > directChildren ? `${remotes.length - directChildren} relayed` : 'No relayed nodes'}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Mesh depth</span>
              <div class="stat-value">${maxDepth}<span> ${maxDepth === 1 ? 'hop' : 'hops'}</span></div>
              <span class="stat-note">${weakLinks > 0 ? `${weakLinks} weak signal${weakLinks === 1 ? '' : 's'}` : 'No weak links'}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Work in flight</span>
              <div class="stat-value">${running + queued}<span>${running + queued === 1 ? ' job' : ' jobs'}</span></div>
              <span class="stat-note">${running ? '1 running' : 'Nothing running'}${queued ? ` · ${queued} queued` : ''}</span>
            </div>
          </section>

          <section class="device-panel">
            <div class="panel-heading">
              <div>
                <h2>Device tree</h2>
                <p>Route path from ${bridgeName}. Select a device to inspect or configure it.</p>
              </div>
              <span class="result-count">${visibleTopology.length - 1} of ${allVisibleTopology.length - 1} shown</span>
            </div>
            <div class="device-toolbar">
              <label class="search-field">
                <span class="sr-only">Search devices</span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4"/></svg>
                <input type="search" placeholder="Search name, MAC, or chip" .value=${this.query}
                  @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; }} />
              </label>
              <div class="segmented" role="group" aria-label="Filter devices">
                ${(['all', 'online', 'offline'] as const).map((value) => html`
                  <button class=${this.filter === value ? 'active' : ''} aria-pressed=${this.filter === value ? 'true' : 'false'}
                    @click=${() => { this.filter = value; }}>${value[0].toUpperCase() + value.slice(1)}</button>
                `)}
              </div>
            </div>
            ${remotes.length === 0
              ? html`<div class="empty-state">
                  <span class="empty-glyph" aria-hidden="true">⌁</span>
                  <strong>No remotes have joined yet</strong>
                  <p>Flash a remote with this bridge’s network credentials. It will appear here when it joins.</p>
                  <button class="btn primary" @click=${() => { window.location.hash = '/add-remote'; }}>+ Add remote</button>
                </div>`
              : visibleTopology.length <= 1
              ? html`<div class="empty-state">
                  <span class="empty-glyph" aria-hidden="true">⌕</span>
                  <strong>No devices match this view</strong>
                  <p>Try another name, or clear the status filter.</p>
                  <button class="btn" @click=${() => { this.query = ''; this.filter = 'all'; }}>Clear filters</button>
                </div>`
              : html`
                  <div class="tree-wrap">
                    <div class="tree-legend" aria-hidden="true"><span>Device</span><span>Last seen</span><span>Link</span></div>
                    <div class="tree-root">
                      <esp-topology-node
                        .node=${root}
                        .childNodesData=${visibleChildMap.get(rootMac) || []}
                        .childMap=${visibleChildMap}
                        .jobForMac=${(mac: string) => this.jobForMac(mac)}
                        .configForMac=${(mac: string) => this.configForMac(mac)}
                        .firmwareForMac=${(mac: string) => this.firmwareForMac(mac)}
                        .onUpdateFirmware=${(mac: string) => void this.handleUpdateFirmware(mac)}
                        .onHideDevice=${(mac: string) => this.handleHideDevice(mac)}
                        .isRoot=${true}
                      ></esp-topology-node>
                    </div>
                  </div>
                `}
          </section>
        ` : (!this.loading && !this.error ? html`
          <section class="empty-page">
            <span class="empty-glyph" aria-hidden="true">⌁</span>
            <h2>No bridge data yet</h2>
            <p>The add-on has no topology to show. Check that the bridge is powered and connected, then refresh.</p>
            <button class="btn primary" @click=${() => void this.load()}>Try again</button>
          </section>
        ` : nothing)}

        ${this.loading && !root ? html`<div class="loading-panel" aria-live="polite"><span class="spinner"></span>Reading bridge topology…</div>` : nothing}

        ${hiddenDevices.length > 0 ? html`
          <section class="device-panel hidden-section">
            <button class="panel-heading accordion" aria-expanded=${this.hiddenExpanded ? 'true' : 'false'} @click=${() => { this.hiddenExpanded = !this.hiddenExpanded; }}>
              <span>
                <h2>Hidden devices <span class="count-badge">${hiddenDevices.length}</span></h2>
                <p>Offline devices kept out of the live tree.</p>
              </span>
              <span class="chevron ${this.hiddenExpanded ? 'open' : ''}" aria-hidden="true">⌄</span>
            </button>
            ${this.hiddenExpanded ? html`
              <div class="hidden-list">
                ${hiddenDevices.map((node) => html`
                  <div class="hidden-row">
                    <span class="status-dot offline"></span>
                    <button class="hidden-identity" @click=${() => { window.location.hash = `/device/${encodeURIComponent(node.mac)}`; }}>
                      <strong>${node.friendly_name || node.esphome_name || node.label || node.mac}</strong>
                      <small class="mono">${node.mac}</small>
                    </button>
                    <span class="hidden-reason">${node.offline_reason || 'offline'}</span>
                    <span class="hidden-actions">
                      <button class="btn sm" @click=${() => void this.handleUnhideDevice(node.mac)}>Restore</button>
                      ${node.is_bridge ? nothing : html`<button class="btn sm danger" @click=${() => void this.handleRemoveDevice(node.mac)}>Delete</button>`}
                    </span>
                  </div>
                `)}
              </div>
            ` : nothing}
          </section>
        ` : nothing}

        ${this.pendingConfirm ? html`
          <div class="confirm-backdrop" role="presentation" @click=${(e: Event) => { if (e.target === e.currentTarget) this.closeConfirm(); }}>
            <section class="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-copy"
              @keydown=${(e: KeyboardEvent) => { if (e.key === 'Escape') this.closeConfirm(); }}>
              <span class="confirm-mark ${this.pendingConfirm.danger ? 'danger' : ''}" aria-hidden="true">${this.pendingConfirm.danger ? '!' : '↻'}</span>
              <h2 id="confirm-title">${this.pendingConfirm.title}</h2>
              <p id="confirm-copy">${this.pendingConfirm.message}</p>
              <div class="confirm-detail">${this.pendingConfirm.detail}</div>
              <div class="confirm-actions">
                <button class="btn" @click=${() => this.closeConfirm()} ?disabled=${this.confirmBusy}>Cancel</button>
                <button class="btn confirm-primary ${this.pendingConfirm.danger ? 'danger' : 'primary'}" @click=${() => void this.runConfirm()} ?disabled=${this.confirmBusy}>
                  ${this.confirmBusy ? 'Working…' : this.pendingConfirm.confirmLabel}
                </button>
              </div>
            </section>
          </div>
        ` : nothing}
      </div>
    `;
  }

  static styles = css`
    :host { display: block; color: var(--ink); }
    * { box-sizing: border-box; }

    .overview { display: flex; flex-direction: column; gap: 18px; }

    .page-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; }
    .page-heading { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
    .eyebrow { color: var(--primary); font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    h1 { margin: 0; font-size: 27px; line-height: 1.15; letter-spacing: -.035em; font-weight: 700; color: var(--ink); }
    .page-heading p { margin: 2px 0 0; max-width: 62ch; color: var(--muted); font-size: 13px; line-height: 1.5; }
    .page-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      min-height: 36px; padding: 0 13px; border: 1px solid var(--line-strong);
      border-radius: 7px; background: var(--surface); color: var(--ink);
      font: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
      transition: background .15s, border-color .15s, color .15s;
      white-space: nowrap;
    }
    .btn:hover { background: var(--surface-subtle); border-color: var(--faint); }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .btn:disabled { opacity: .55; cursor: default; }
    .btn.primary { background: var(--primary); border-color: var(--primary); color: #fff; }
    .btn.primary:hover { background: var(--primary-strong); border-color: var(--primary-strong); }
    .btn.sm { min-height: 30px; padding: 0 10px; font-size: 11px; }
    .btn.danger { color: var(--danger); border-color: #e9c4c6; background: var(--danger-soft); }
    .btn.danger:hover { background: #fbe2e3; }

    .network-banner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      min-height: 146px;
      padding: 26px 30px;
      overflow: hidden;
      border-radius: var(--radius-lg);
      background: #143a33;
      color: #edf4ef;
      box-shadow: var(--shadow-sm);
    }
    .network-banner::after {
      content: '';
      position: absolute;
      width: 360px; height: 360px; right: -130px; top: -185px;
      border: 1px solid rgba(214,177,92,.13);
      border-radius: 50%;
      box-shadow: 0 0 0 38px rgba(214,177,92,.035), 0 0 0 76px rgba(214,177,92,.025);
      pointer-events: none;
    }
    .bridge-identity { display: flex; align-items: center; gap: 18px; min-width: 0; position: relative; z-index: 1; }
    .bridge-glyph {
      display: grid; place-items: center; width: 54px; height: 54px; flex: 0 0 54px;
      border-radius: 13px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
    }
    .bridge-glyph svg { width: 34px; height: 34px; fill: none; stroke: #d6b15c; stroke-width: 1.35; stroke-linecap: round; stroke-linejoin: round; }
    .bridge-copy { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .overline, .health-kicker { color: #9eb5ab; font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; }
    .bridge-copy h2 { margin: 0; color: #fff; font-size: 24px; line-height: 1.2; letter-spacing: -.025em; font-weight: 650; overflow-wrap: anywhere; }
    .bridge-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; margin-top: 5px; color: #abc0b7; font-size: 11px; }
    .meta-item { display: inline-flex; align-items: center; }
    .meta-item + .meta-item::before { content: '·'; margin-right: 10px; color: #69877b; }
    .mono { font-family: var(--font-mono); font-size: 10px; letter-spacing: .01em; }
    .status { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; }
    .status .dot { width: 6px; height: 6px; border-radius: 50%; background: #63be82; box-shadow: 0 0 0 3px rgba(99,190,130,.12); }
    .status.bad { color: #ffc2c4; }
    .status.bad .dot { background: #ef7c82; }
    .status.ok { color: #bce7c9; }

    .bridge-health { position: relative; z-index: 1; min-width: 150px; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; text-align: right; }
    .bridge-health strong { color: #fff; font-size: 37px; line-height: 1; letter-spacing: -.04em; font-weight: 650; }
    .health-total { color: #93aea3; font-size: 21px; font-weight: 500; }
    .health-caption { color: #a7bcb3; font-size: 11px; }

    .stat-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--line); box-shadow: var(--shadow-sm); }
    .stat { display: flex; flex-direction: column; gap: 6px; min-height: 106px; padding: 17px 19px; background: var(--surface); }
    .stat-label { color: var(--muted); font-size: 11px; font-weight: 600; }
    .stat-value { color: var(--ink); font-size: 27px; line-height: 1; letter-spacing: -.035em; font-weight: 650; }
    .stat-value span { color: var(--faint); font-size: 13px; font-weight: 500; letter-spacing: 0; }
    .stat-note { margin-top: auto; color: var(--muted); font-size: 10px; line-height: 1.3; }
    .stat-note.warn { color: #956917; }
    .stat-note.ok { color: var(--ok); }

    .device-panel { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); overflow: hidden; }
    .panel-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 20px 22px 14px; }
    .panel-heading h2 { margin: 0; color: var(--ink); font-size: 16px; letter-spacing: -.015em; font-weight: 650; }
    .panel-heading p { margin: 4px 0 0; color: var(--muted); font-size: 11px; line-height: 1.4; }
    .result-count { flex-shrink: 0; margin-top: 3px; color: var(--faint); font-size: 10px; font-weight: 600; }

    .device-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 22px 14px; border-bottom: 1px solid var(--line); }
    .search-field { position: relative; display: flex; align-items: center; width: min(330px, 100%); }
    .search-field svg { position: absolute; left: 10px; width: 15px; height: 15px; fill: none; stroke: var(--faint); stroke-width: 1.7; stroke-linecap: round; pointer-events: none; }
    .search-field input { width: 100%; min-height: 34px; padding: 0 11px 0 31px; border: 1px solid var(--line); border-radius: 7px; background: var(--surface-subtle); color: var(--ink); font: inherit; font-size: 12px; }
    .search-field input::placeholder { color: var(--faint); }
    .search-field input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30,91,79,.10); }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

    .segmented { display: inline-flex; padding: 2px; border: 1px solid var(--line); border-radius: 7px; background: var(--surface-subtle); }
    .segmented button { min-height: 28px; padding: 0 10px; border: 0; border-radius: 5px; background: transparent; color: var(--muted); font: inherit; font-size: 10px; font-weight: 600; cursor: pointer; }
    .segmented button:hover { color: var(--ink); }
    .segmented button.active { background: var(--surface); color: var(--ink); box-shadow: 0 1px 2px rgba(20,40,32,.10); }
    .segmented button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }

    .tree-wrap { padding: 0 22px 18px; }
    .tree-legend { display: flex; align-items: center; justify-content: flex-end; gap: 34px; padding: 9px 14px 4px; color: var(--faint); font-size: 9px; font-weight: 650; letter-spacing: .08em; text-transform: uppercase; }
    .tree-legend span:first-child { margin-right: auto; margin-left: 4px; }
    .tree-root { margin-top: 2px; }

    .callout { display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; border: 1px solid #e7c2c5; border-radius: 8px; background: var(--danger-soft); color: #8c3037; font-size: 12px; line-height: 1.4; }
    .callout strong { font-size: 12px; }

    .empty-state, .empty-page, .loading-panel { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; padding: 42px 20px; text-align: center; }
    .empty-state strong, .empty-page h2 { margin: 0; color: var(--ink); font-size: 14px; }
    .empty-state p, .empty-page p { margin: 0 0 8px; max-width: 46ch; color: var(--muted); font-size: 12px; line-height: 1.5; }
    .empty-glyph { color: var(--faint); font-size: 32px; line-height: 1; font-weight: 300; }
    .empty-page { min-height: 320px; border: 1px dashed var(--line-strong); border-radius: var(--radius-lg); background: var(--surface-subtle); }
    .loading-panel { flex-direction: row; color: var(--muted); font-size: 12px; }
    .spinner { width: 14px; height: 14px; border: 2px solid var(--line); border-top-color: var(--primary); border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .hidden-section { margin-top: 0; }
    .accordion { width: 100%; border: 0; background: transparent; font: inherit; text-align: left; cursor: pointer; align-items: center; }
    .accordion:hover { background: var(--surface-subtle); }
    .accordion:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
    .count-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; margin-left: 4px; padding: 0 5px; border-radius: 999px; background: var(--surface-subtle); color: var(--muted); font-size: 10px; vertical-align: 2px; }
    .chevron { color: var(--faint); font-size: 18px; line-height: 1; transition: transform .15s; }
    .chevron.open { transform: rotate(180deg); }
    .hidden-list { border-top: 1px solid var(--line); }
    .hidden-row { display: flex; align-items: center; gap: 11px; min-height: 54px; padding: 8px 22px; border-bottom: 1px solid var(--line); }
    .hidden-row:last-child { border-bottom: 0; }
    .status-dot { width: 7px; height: 7px; flex: 0 0 7px; border-radius: 50%; background: var(--faint); }
    .status-dot.offline { background: var(--danger); }
    .hidden-identity { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; padding: 0; border: 0; background: none; color: inherit; text-align: left; cursor: pointer; }
    .hidden-identity strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 600; }
    .hidden-identity small { color: var(--muted); }
    .hidden-identity:hover strong { text-decoration: underline; }
    .hidden-reason { max-width: 200px; color: var(--danger); font-size: 10px; }
    .hidden-actions { display: flex; gap: 6px; flex-shrink: 0; }

    @media (max-width: 1000px) {
      .stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 760px) {
      .overview { gap: 14px; }
      .page-head { align-items: flex-start; flex-direction: column; gap: 14px; }
      h1 { font-size: 24px; }
      .page-actions { width: 100%; }
      .page-actions .btn { flex: 1; }
      .network-banner { min-height: 0; padding: 20px 18px; gap: 18px; align-items: flex-start; flex-direction: column; }
      .bridge-glyph { width: 44px; height: 44px; flex-basis: 44px; border-radius: 10px; }
      .bridge-glyph svg { width: 28px; height: 28px; }
      .bridge-copy h2 { font-size: 21px; }
      .bridge-health { min-width: 0; align-items: flex-start; text-align: left; flex-direction: row; align-items: baseline; gap: 8px; flex-wrap: wrap; }
      .bridge-health strong { font-size: 26px; }
      .health-kicker { width: 100%; }
      .health-caption { font-size: 10px; }
      .stat { min-height: 94px; padding: 14px 15px; }
      .stat-value { font-size: 23px; }
      .device-toolbar { align-items: stretch; flex-direction: column; padding: 0 15px 12px; }
      .search-field { width: 100%; }
      .segmented { align-self: flex-start; }
      .panel-heading { padding: 17px 15px 12px; }
      .result-count { display: none; }
      .tree-wrap { padding: 0 12px 14px; }
      .tree-legend { display: none; }
      .hidden-row { align-items: flex-start; flex-wrap: wrap; padding: 12px 15px; }
      .hidden-identity { flex-basis: calc(100% - 20px); }
      .hidden-reason { order: 3; flex: 1; max-width: none; padding-left: 18px; }
      .hidden-actions { order: 4; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
    }

    .confirm-backdrop { position: fixed; inset: 0; z-index: 1200; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(12,28,24,.60); backdrop-filter: blur(2px); }
    .confirm-modal { width: min(450px, 100%); padding: 22px; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); box-shadow: 0 24px 70px rgba(9,24,19,.28); }
    .confirm-mark { display: grid; place-items: center; width: 30px; height: 30px; margin-bottom: 10px; border-radius: 8px; background: var(--primary-soft); color: var(--primary); font-size: 14px; font-weight: 750; }
    .confirm-mark.danger { background: var(--danger-soft); color: var(--danger); }
    .confirm-modal h2 { margin: 0; color: var(--ink); font-size: 17px; line-height: 1.3; letter-spacing: -.02em; font-weight: 700; }
    .confirm-modal p { margin: 7px 0 0; color: var(--ink-2); font-size: 12px; line-height: 1.55; }
    .confirm-detail { margin-top: 10px; padding: 10px 11px; border: 1px solid var(--line); border-radius: 7px; background: var(--surface-subtle); color: var(--muted); font-size: 10px; line-height: 1.5; }
    .confirm-actions { display: flex; justify-content: flex-end; gap: 7px; margin-top: 18px; }
    .confirm-actions .btn { min-height: 35px; padding: 0 12px; }
    .confirm-actions .btn.primary { border-color: var(--primary); background: var(--primary); color: #fff; }
    .confirm-actions .btn.primary:hover { background: var(--primary-strong); }
    .confirm-actions .btn.danger { border-color: var(--danger); background: var(--danger); color: #fff; }
    .confirm-actions .btn.danger:hover { background: #9f3037; }
    @media (max-width: 520px) { .confirm-actions { flex-direction: column-reverse; } .confirm-actions .btn { width: 100%; } }
  `;
}
