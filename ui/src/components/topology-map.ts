import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { BridgeFirmwareStatus, ConfigStatus, OtaJob, QueueResponse, TopologyNode, api, normalizeMac, streamTopology, TopologyStreamHandle, WsTopologyMessage } from '../api/client';
import { renderTreeRow, treeStyles, nodeName, offlineReason, type TreeRow } from './topology-node';
import './confirm-dialog';
import type { ConfirmRequest } from './confirm-dialog';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';

@customElement('esp-topology-map')
export class EspTopologyMap extends LitElement {
  /** Set by the shell while the add-on is unreachable; the shell already explains the outage. */
  @property({ type: Boolean }) addonDown = false;
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
    const running = !!status && !['success', 'failed', 'aborted', 'version_mismatch', 'rejoin_timeout', 'rejoined_unverified'].includes(status);
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

  /** Depth-first flatten so every row shares one grid and columns align. */
  private flatten(root: TopologyNode, childMap: Map<string, TopologyNode[]>): TreeRow[] {
    const rows: TreeRow[] = [{ node: root, depth: 0, rails: [], last: true, isRoot: true }];
    const walk = (parent: TopologyNode, depth: number, rails: boolean[]) => {
      const children = childMap.get(this.childKey(parent.mac)) || [];
      children.forEach((child, i) => {
        const last = i === children.length - 1;
        rows.push({ node: child, depth, rails, last, isRoot: false });
        walk(child, depth + 1, [...rails, !last]);
      });
    };
    walk(root, 1, []);
    return rows;
  }

  render() {
    const { root } = this.buildChildren();
    const rootMac = this.childKey(root?.mac || '');
    // The topology list is what the bridge currently reports, plus remotes retained
    // from earlier sessions. A retained remote has no hop count, so keep any
    // non-hidden node that is either reachable (hops > 0) or a retained remote
    // (not the root bridge), and let it render as an offline row.
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
      children.sort((a, b) => nodeName(a).localeCompare(nodeName(b)));
    }
    const running = this.currentJob ? 1 : 0;
    const queued = (this.queueData?.queued_jobs ?? []).length;
    const shownRemotes = visibleTopology.filter((n) => !n.is_bridge).length;
    const filtered = this.filter !== 'all' || !!normalizedQuery;
    const rows = root ? this.flatten(root, visibleChildMap) : [];

    return html`
      <div class="page">
        <div class="page-head">
          <div>
            <h1>Network</h1>
            ${root ? html`
              <p class="summary" aria-live="polite">
                <span><strong>${onlineRemotes.length}</strong> of ${remotes.length} remotes online</span>
                ${offlineRemotes > 0 ? html`<button class="summary-link danger" @click=${() => { this.filter = 'offline'; }}>${offlineRemotes} offline</button>` : nothing}
                ${running + queued > 0 ? html`<a class="summary-link" href="#/queue">${running ? '1 job running' : ''}${running && queued ? ', ' : ''}${queued ? `${queued} queued` : ''}</a>` : nothing}
              </p>
            ` : nothing}
          </div>
          <div class="page-actions">
            <button class="btn icon" aria-label="Refresh" title="Refresh" @click=${() => void this.load(true, true)} ?disabled=${this.loading}>
              ${this.loading ? html`<span class="spinner"></span>` : icon('refresh')}
            </button>
            ${this.addonDown
              ? html`<button class="btn primary" disabled title="Unavailable while the add-on is unreachable">${icon('plus')}Add remote</button>`
              : html`<a class="btn primary" href="#/add-remote">${icon('plus')}Add remote</a>`}
          </div>
        </div>

        ${this.error && !this.addonDown ? html`<div class="notice danger" role="alert">${icon('alert')}<span><strong>Couldn't read the network.</strong> ${this.error}</span>
          <span class="notice-actions"><button class="btn sm" @click=${() => void this.load(true, true)}>Try again</button></span></div>` : nothing}

        ${root ? html`
          <section class="card" aria-label="Device tree">
            <div class="filters">
              <label class="search">
                ${icon('search')}
                <input type="search" aria-label="Search devices" placeholder="Search by name, MAC or chip" .value=${this.query}
                  @input=${(e: Event) => { this.query = (e.target as HTMLInputElement).value; }} />
              </label>
              <div class="segmented" role="group" aria-label="Show">
                ${(['all', 'online', 'offline'] as const).map((value) => html`
                  <button aria-pressed=${this.filter === value ? 'true' : 'false'} @click=${() => { this.filter = value; }}>
                    ${value === 'all' ? `All ${remotes.length}` : value === 'online' ? `Online ${onlineRemotes.length}` : `Offline ${offlineRemotes}`}
                  </button>
                `)}
              </div>
            </div>
            ${remotes.length === 0
              ? html`
                <div class="tree" role="grid" aria-label="Devices">${rows.map((row) => this.row(row))}</div>
                <div class="empty">
                  ${icon('network')}
                  <strong>No remotes have joined yet</strong>
                  <p>Flash a remote with this bridge's network credentials. It appears here as soon as it joins.</p>
                  <a class="btn primary" href="#/add-remote">${icon('plus')}Add remote</a>
                </div>`
              : html`
                <div class="tree" role="grid" aria-label="Devices">
                  <div class="tree-head" role="row">
                    <span></span><span role="columnheader">Device</span><span role="columnheader">Signal</span><span role="columnheader">Hops</span>
                    <span role="columnheader">Last seen</span><span role="columnheader" class="fw">Firmware</span><span role="columnheader">Status</span><span></span>
                  </div>
                  ${rows.map((row) => this.row(row))}
                </div>
                ${filtered && shownRemotes === 0 ? html`
                  <div class="empty">
                    ${icon('search')}
                    <strong>No remotes match</strong>
                    <p>Nothing matches “${this.query || this.filter}”. Clear the search or show all remotes.</p>
                    <button class="btn" @click=${() => { this.query = ''; this.filter = 'all'; }}>Show all</button>
                  </div>` : nothing}
              `}
            ${hiddenDevices.length > 0 ? html`
              <div class="hidden-block">
                <button class="hidden-toggle" aria-expanded=${this.hiddenExpanded ? 'true' : 'false'} @click=${() => { this.hiddenExpanded = !this.hiddenExpanded; }}>
                  <span class="chev ${this.hiddenExpanded ? 'open' : ''}">${icon('chevronRight')}</span>
                  Hidden devices <span class="chip">${hiddenDevices.length}</span>
                  <span class="hint">Offline devices kept out of the tree</span>
                </button>
                ${this.hiddenExpanded ? html`
                  <ul class="hidden-list">
                    ${hiddenDevices.map((node) => html`
                      <li>
                        <span class="dot danger"></span>
                        <span class="hidden-id">
                          <a href=${`#/device/${encodeURIComponent(node.mac)}`}>${nodeName(node)}</a>
                          <small><span class="mono">${node.mac}</span> · ${offlineReason(node)}</small>
                        </span>
                        <span class="hidden-actions">
                          <button class="btn sm" @click=${() => void this.handleUnhideDevice(node.mac)}>Restore</button>
                          ${node.is_bridge ? nothing : html`<button class="btn sm danger" @click=${() => void this.handleRemoveDevice(node.mac)}>Delete…</button>`}
                        </span>
                      </li>
                    `)}
                  </ul>
                ` : nothing}
              </div>
            ` : nothing}
          </section>
        ` : this.loading
          ? html`<div class="card loading" aria-live="polite"><span class="spinner"></span>Reading the bridge topology…</div>`
          : !this.error ? html`
            <section class="card">
              <div class="empty">
                ${icon('bridge')}
                <strong>No bridge data yet</strong>
                <p>The add-on hasn't received a topology from the bridge. Check that the bridge is powered and connected, then try again.</p>
                <button class="btn primary" @click=${() => void this.load(true, true)}>Try again</button>
              </div>
            </section>` : nothing}

        <esp-confirm-dialog .request=${this.pendingConfirm} @closed=${() => { this.pendingConfirm = null; }}></esp-confirm-dialog>
      </div>
    `;
  }

  private row(row: TreeRow) {
    return renderTreeRow(row, {
      job: this.jobForMac(row.node.mac),
      config: this.configForMac(row.node.mac),
      firmware: row.isRoot ? this.firmwareForMac(row.node.mac) : null,
      onUpdateFirmware: (mac) => void this.handleUpdateFirmware(mac),
      onHide: (mac) => void this.handleHideDevice(mac),
    });
  }

  static styles = [shared, treeStyles, css`
    :host { display: block; }
    .summary {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 4px 14px;
      margin-top: 4px;
      color: var(--muted);
    }
    .summary strong { color: var(--ink); font-weight: 500; }
    .summary-link {
      border: 0;
      padding: 0;
      background: none;
      font: inherit;
      color: var(--primary);
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
    }
    .summary-link:hover { text-decoration: underline; }
    .summary-link.danger { color: var(--danger); }

    .card { overflow: hidden; }
    .filters {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 12px 16px;
      border-bottom: 1px solid var(--line);
    }
    .search { position: relative; flex: 1 1 260px; max-width: 360px; }
    .search svg { position: absolute; left: 10px; top: 50%; width: 18px; height: 18px; transform: translateY(-50%); color: var(--faint); pointer-events: none; }
    .search input { padding-left: 36px; min-height: 36px; }

    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }

    .hidden-block { border-top: 1px solid var(--line); }
    .hidden-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      min-height: 48px;
      padding: 0 16px;
      border: 0;
      background: none;
      color: var(--ink);
      font: inherit;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
    }
    .hidden-toggle:hover { background: var(--surface-hover); }
    .hidden-toggle .hint { font-weight: 400; margin-left: 4px; }
    .chev { display: inline-flex; transition: transform 150ms ease; color: var(--muted); }
    .chev svg { width: 18px; height: 18px; }
    .chev.open { transform: rotate(90deg); }
    .hidden-list { list-style: none; margin: 0; padding: 0 0 8px; }
    .hidden-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px 8px 42px;
    }
    .hidden-id { display: grid; min-width: 0; flex: 1; }
    .hidden-id a { color: var(--ink); font-weight: 500; text-decoration: none; }
    .hidden-id a:hover { color: var(--primary); text-decoration: underline; }
    .hidden-id small { color: var(--muted); font-size: var(--text-xs); }
    .hidden-actions { display: flex; gap: 8px; }

    @media (max-width: 760px) {
      .page-head { flex-wrap: nowrap; align-items: flex-start; }
      .search { max-width: none; }
      .hidden-toggle .hint { display: none; }
      .hidden-list li { flex-wrap: wrap; padding-left: 16px; }
    }
  `];
}
