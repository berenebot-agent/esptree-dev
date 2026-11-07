import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeFirmwareStatus, ConfigStatus, OtaJob, TopologyNode, fmtDuration, normalizeMac } from '../api/client';

@customElement('esp-topology-node')
export class EspTopologyNode extends LitElement {
  @property({ type: Object }) node!: TopologyNode;
  @property({ type: Array }) childNodesData: TopologyNode[] = [];
  @property({ attribute: false }) childMap: Map<string, TopologyNode[]> = new Map();
  @property({ attribute: false }) jobForMac: (mac: string) => OtaJob | null = () => null;
  @property({ attribute: false }) configForMac: (mac: string) => ConfigStatus | null = () => null;
  @property({ attribute: false }) firmwareForMac: (mac: string) => BridgeFirmwareStatus | null = () => null;
  @property({ attribute: false }) onUpdateFirmware: (mac: string) => void = () => {};
  @property({ attribute: false }) onHideDevice: (mac: string) => void = () => {};
  @property({ type: Boolean }) isRoot = false;
  @property({ type: Boolean, reflect: true }) isLast = false;

  private selectNode(): void {
    if (this.node.ha_device_id) {
      window.open(`/config/devices/device/${this.node.ha_device_id}`, '_blank');
    } else {
      this.dispatchEvent(new CustomEvent('node-selected', { detail: this.node.mac, bubbles: true, composed: true }));
    }
  }

  private navigateTo(path: string): void {
    window.location.hash = path;
  }

  private rssiBars(rssi?: number | null): string {
    if (rssi == null) return '-';
    if (rssi >= -50) return '▂▄▆█';
    if (rssi >= -65) return '▂▄▆';
    if (rssi >= -80) return '▂▄';
    if (rssi >= -90) return '▂';
    return '▁';
  }

  private childKey(node: TopologyNode): string {
    return normalizeMac(node.mac || '');
  }

  private bridgeFirmware(): BridgeFirmwareStatus | null {
    return this.firmwareForMac(this.node.mac);
  }

  private bridgeJobLabel(status: string, percent: number | null | undefined, position: number | null | undefined): string {
    switch (status) {
      case 'compile_queued':
        return `⏳ build #${position ?? 1}`;
      case 'compiling':
        return '⚙ building';
      case 'queued':
        return `⏳ #${position ?? 1}`;
      case 'starting':
      case 'announcing':
        return '⚙ connecting';
      case 'transferring':
        return percent ? `📡 ${percent}%` : '📡 uploading';
      case 'verifying':
        return '✓ verifying';
      case 'transfer_success_waiting_rejoin':
        return '⟳ rebooting';
      default:
        return '⚙ updating';
    }
  }

  /**
   * Firmware control for the bridge itself.
   *
   * A bridge cannot receive an image over the ESP-NOW link it carries, so updating it
   * is a rebuild of its stored YAML plus an ESPHome OTA push to its own OTA port. The
   * button is always offered (there is no version stamp to compare against yet); the
   * server refuses with the reason when the bridge cannot take one, and the label
   * states what is running so the user can see the result.
   */
  private renderBridgeFirmware() {
    const fw = this.bridgeFirmware();
    const job = fw?.job ?? null;
    const status = job?.status ?? '';
    const terminal = ['success', 'failed', 'aborted', 'version_mismatch', 'rejoin_timeout'];
    const busy = !!status && !terminal.includes(status);
    const canUpdate = !busy && (fw ? fw.can_update : true);
    const blocker = fw?.blocked_reason || '';
    const build = fw?.running?.build_date || this.node.firmware_build_date || '';
    const title = blocker
      || (build ? `Running firmware built ${build}. Rebuild from this add-on and upload over the air.`
               : 'Rebuild this bridge from this add-on and upload it over the air.');
    return html`
      <span class="bridge-fw" title=${title}>
        <span class="firmware-label">${build ? `FW ${build.split(' ')[0]}` : 'FW unknown'}</span>
        ${busy
          ? html`<span class="bridge-job" title=${`Bridge update: ${status}`}
               @click=${(e: Event) => { e.stopPropagation(); this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`); }}>
               ${this.bridgeJobLabel(status, job?.percent, job?.queue_position)}</span>`
          : html`<button class="row-btn bridge-update" ?disabled=${!canUpdate}
                   title=${title}
                   @click=${(e: Event) => { e.stopPropagation(); this.onUpdateFirmware(this.node.mac); }}>Update</button>`}
      </span>
    `;
  }

  render() {
    const job = this.jobForMac(this.node.mac);
    const isActive = !!job && ['starting', 'transferring', 'verifying', 'transfer_success_waiting_rejoin'].includes(job.status);
    const isQueued = !!job && job.status === 'queued';
    const percent = job?.percent ?? 0;
    const hasChildren = this.childNodesData.length > 0;
    // Any node that is not the tree root and not the bridge itself is a remote.
    // Gating on `hops > 0` alone hid retained remotes: those are restored from the
    // integration store without a hop count, so they silently lost their config
    // badge and their Edit YAML button.
    const isRemote = !this.isRoot && !this.node.is_bridge;
    const name = this.node.friendly_name || this.node.esphome_name || this.node.label || this.node.mac;
    const configStatus = this.configForMac(this.node.mac);
    const configState = configStatus?.config_state ?? 'no_config';
    const needsConfig = isRemote && configState === 'no_config';
    const isCompiling = configState === 'compiling';
    const isCompileQueued = configState === 'compile_queued';
    const compileQueuePos = configStatus?.queue_position ?? 1;
    const rssi = this.node.rssi;
    const signalClass = rssi == null ? 'unknown' : rssi >= -65 ? 'strong' : rssi >= -80 ? 'fair' : 'weak';

    return html`
      <div class="tree-row">
        <div class="branch ${this.isRoot ? 'root' : ''}" aria-hidden="true"></div>
        <div class="node-card ${this.node.online ? 'online' : 'offline'} ${this.isRoot ? 'root' : ''}">
          <button class="node-main" @click=${this.selectNode} aria-label=${`Open ${name}`}>
            <span class="status-dot ${this.node.online ? 'online' : 'offline'}" aria-hidden="true"></span>
            <span class="node-identity">
              <span class="node-title-line">
                ${this.isRoot ? html`<span class="bridge-badge" title="Bridge">Bridge</span>` : nothing}
                <strong>${name}</strong>
                ${this.isRoot && this.node.network_id ? html`<span class="network-id">${this.node.network_id}</span>` : nothing}
              </span>
              <span class="node-meta">
                <span class="mono">${this.node.mac}</span>
                ${this.node.chip_name ? html`<span class="meta-sep">·</span><span>${this.node.chip_name}</span>` : nothing}
                ${this.isRoot && this.node.firmware_build_date ? html`<span class="meta-sep">·</span><span>FW ${this.node.firmware_build_date.split(' ')[0]}</span>` : nothing}
              </span>
            </span>
            <span class="node-facts">
              ${this.node.online
                ? html`
                    <span class="fact"><span class="fact-label">${this.isRoot ? 'Uptime' : 'Seen'}</span><span class="fact-value">${this.isRoot ? fmtDuration(this.node.uptime_s) : (this.node.last_seen_ago != null ? `${fmtDuration(this.node.last_seen_ago)} ago` : '—')}</span></span>
                    <span class="fact"><span class="fact-label">${this.isRoot ? 'Direct' : 'Hops'}</span><span class="fact-value">${this.isRoot ? (this.node.direct_child_count ?? 0) : (this.node.hops ?? 0)}</span></span>
                    <span class="fact signal ${signalClass}" title=${rssi != null ? `${rssi} dBm` : 'Signal unavailable'}>
                      <span class="fact-label">Link</span><span class="bars" aria-hidden="true">${this.rssiBars(rssi)}</span>
                      ${rssi != null ? html`<span class="dbm">${rssi}</span>` : nothing}
                    </span>
                  `
                : html`
                    <span class="fact"><span class="fact-label">Last seen</span><span class="fact-value">${this.node.last_seen_ago != null ? `${fmtDuration(this.node.last_seen_ago)} ago` : 'Unknown'}</span></span>
                    <span class="fact"><span class="fact-label">Hops</span><span class="fact-value">${this.node.hops ?? '—'}</span></span>
                    <span class="offline-reason">${this.node.offline_reason || 'Offline'}</span>
                  `}
            </span>
          </button>

          <div class="node-actions">
            ${this.isRoot
              ? this.renderBridgeFirmware()
              : html`
                  ${isCompiling
                    ? html`<span class="job-badge compiling" title="Compiling firmware"><span class="mini-spinner"></span>Compiling</span>`
                    : isCompileQueued
                      ? html`<span class="job-badge queued" title="Compile queued">Compile #${compileQueuePos}</span>`
                      : isActive
                        ? html`<span class="job-badge transferring" title="OTA upload in progress">Uploading ${percent}%</span>`
                        : isQueued
                          ? html`<span class="job-badge queued" title="OTA upload queued">Queued #${job.queue_position ?? 1}</span>`
                          : nothing}
                  <button class="row-btn" @click=${() => this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}`)}>${this.node.online ? 'Open' : 'Details'}</button>
                  ${this.node.online ? html`
                    <button class="row-btn quiet" @click=${() => this.navigateTo(`/device/${encodeURIComponent(this.node.mac)}/config`)}>YAML${needsConfig ? html`<span class="config-dot" title="No configuration yet"></span>` : nothing}</button>
                  ` : html`
                    <button class="row-btn quiet" title="Hide until it returns" @click=${() => this.onHideDevice(this.node.mac)}>Hide</button>
                  `}
                `}
          </div>
        </div>
      </div>
      ${hasChildren
        ? html`
            <div class="tree-child">
              ${this.childNodesData.map(
                (child, i) => html`
                  <esp-topology-node
                    .node=${child}
                    .childNodesData=${this.childMap.get(this.childKey(child)) || []}
                    .childMap=${this.childMap}
                    .jobForMac=${this.jobForMac}
                    .configForMac=${this.configForMac}
                    .firmwareForMac=${this.firmwareForMac}
                    .onUpdateFirmware=${this.onUpdateFirmware}
                    .onHideDevice=${this.onHideDevice}
                    .isLast=${i === this.childNodesData.length - 1}
                  ></esp-topology-node>
                `
              )}
            </div>
          `
        : nothing}
    `;
  }

  static styles = css`
    :host { display: block; position: relative; margin-left: 14px; }
    :host([is-root]) { margin-left: 0; }
    * { box-sizing: border-box; }

    .tree-row { display: flex; align-items: stretch; position: relative; padding: 3px 0; }
    .branch { position: relative; width: 24px; flex: 0 0 24px; }
    .branch:not(.root)::before {
      content: ''; position: absolute; left: 5px; top: 0; bottom: 0;
      border-left: 1px solid var(--line-strong);
    }
    .branch:not(.root)::after {
      content: ''; position: absolute; left: 5px; top: 50%; width: 14px;
      border-top: 1px solid var(--line-strong);
    }
    :host([is-last]) .branch::before { bottom: 50%; }
    .branch.root { width: 0; flex-basis: 0; }

    .node-card {
      display: flex; align-items: center; gap: 8px; width: 100%; min-width: 0;
      border: 1px solid var(--line); border-radius: 8px; background: var(--surface);
      transition: border-color .15s, background .15s, box-shadow .15s;
    }
    .node-card:hover { border-color: #b9c9c0; background: #fcfdfa; box-shadow: 0 1px 2px rgba(20,40,32,.04); }
    .node-card.offline { border-color: #ecd4d5; background: #fefafa; }
    .node-card.root { border-color: #cfdad3; background: #fbfcf9; }

    .node-main {
      display: grid; grid-template-columns: 8px minmax(200px, 1.4fr) minmax(270px, 1fr);
      align-items: center; gap: 12px; flex: 1; min-width: 0;
      min-height: 58px; padding: 8px 10px 8px 14px; border: 0; border-radius: 8px;
      background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer;
    }
    .node-main:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
    .status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 3px var(--ok-soft); }
    .status-dot.offline { background: var(--danger); box-shadow: 0 0 0 3px var(--danger-soft); }

    .node-identity { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .node-title-line { display: flex; align-items: center; gap: 7px; min-width: 0; }
    .node-title-line strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); font-size: 13px; line-height: 1.3; font-weight: 650; letter-spacing: -.005em; }
    .bridge-badge { flex: 0 0 auto; padding: 1px 5px; border: 1px solid #d2ded5; border-radius: 4px; background: var(--primary-soft); color: var(--primary); font-size: 8px; font-weight: 750; letter-spacing: .06em; text-transform: uppercase; }
    .network-id { flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 1px 6px; border-radius: 4px; background: var(--surface-subtle); color: var(--muted); font-size: 9px; font-weight: 550; }
    .node-meta { display: flex; align-items: center; gap: 5px; min-width: 0; overflow: hidden; color: var(--faint); font-size: 10px; white-space: nowrap; }
    .mono { font-family: var(--font-mono); }
    .meta-sep { color: #83928a; }

    .node-facts { display: flex; align-items: center; justify-content: flex-end; gap: 20px; min-width: 0; }
    .fact { display: flex; align-items: baseline; gap: 5px; min-width: 0; white-space: nowrap; }
    .fact-label { color: var(--faint); font-size: 8px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
    .fact-value { color: var(--ink-2); font-size: 10px; font-weight: 600; }
    .signal .bars { color: var(--ok); font-size: 11px; letter-spacing: -.1em; }
    .signal.fair .bars { color: #a97920; }
    .signal.weak .bars { color: var(--danger); }
    .dbm { color: var(--faint); font-family: var(--font-mono); font-size: 9px; }
    .offline-reason { overflow: hidden; text-overflow: ellipsis; padding: 2px 6px; border-radius: 4px; background: var(--danger-soft); color: #95343a; font-size: 9px; font-weight: 600; }

    .node-actions { display: flex; align-items: center; justify-content: flex-end; gap: 5px; flex: 0 0 auto; padding-right: 10px; }
    .row-btn {
      min-height: 30px; padding: 0 9px; border: 1px solid var(--line); border-radius: 6px;
      background: var(--surface); color: var(--ink-2); font: inherit; font-size: 10px;
      font-weight: 600; cursor: pointer; white-space: nowrap; transition: background .15s, border-color .15s;
    }
    .row-btn:hover { background: var(--surface-subtle); border-color: var(--line-strong); }
    .row-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .row-btn.quiet { color: var(--muted); border-color: transparent; background: transparent; }
    .row-btn.quiet:hover { border-color: var(--line); background: var(--surface-subtle); }
    .config-dot { display: inline-block; width: 5px; height: 5px; margin-left: 4px; border-radius: 50%; background: var(--accent); vertical-align: 1px; }

    .bridge-fw { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; min-width: 92px; }
    .firmware-label { color: var(--faint); font-family: var(--font-mono); font-size: 8px; white-space: nowrap; }
    .bridge-update { min-height: 29px; }
    .bridge-job { display: inline-flex; align-items: center; gap: 4px; min-height: 26px; padding: 0 7px; border: 1px solid #b9d5de; border-radius: 5px; background: var(--info-soft); color: var(--info); font-size: 9px; font-weight: 600; }

    .job-badge { display: inline-flex; align-items: center; gap: 5px; min-height: 25px; padding: 0 7px; border-radius: 5px; font-size: 9px; font-weight: 650; white-space: nowrap; }
    .job-badge.compiling { background: #f3edf9; color: #6c3e91; }
    .job-badge.queued { background: var(--accent-soft); color: #8b6117; }
    .job-badge.transferring { background: var(--info-soft); color: var(--info); }
    .mini-spinner { width: 9px; height: 9px; border: 1.5px solid #d6c4e5; border-top-color: #6c3e91; border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .tree-child { position: relative; }

    @media (max-width: 1120px) {
      .node-main { grid-template-columns: 8px minmax(160px, 1fr) minmax(145px, .65fr); }
      .node-facts { gap: 12px; }
      .fact.signal .dbm { display: none; }
    }

    @media (max-width: 900px) {
      :host { margin-left: 0; }
      .branch { display: none; }
      .node-card { align-items: stretch; flex-direction: column; gap: 0; }
      .node-main { grid-template-columns: 8px minmax(0, 1fr); gap: 10px; padding: 11px 12px 7px; min-height: 0; }
      .node-identity { grid-column: 2; }
      .node-facts { grid-column: 2; justify-content: flex-start; flex-wrap: wrap; gap: 7px 15px; margin-top: 4px; }
      .node-actions { justify-content: flex-start; padding: 0 12px 10px 30px; flex-wrap: wrap; }
      .bridge-fw { flex-direction: row; align-items: center; min-width: 0; }
      .tree-child { margin-top: 2px; }
    }

    @media (max-width: 480px) {
      .node-main { grid-template-columns: 7px minmax(0, 1fr); }
      .node-title-line { align-items: flex-start; flex-wrap: wrap; gap: 4px 6px; }
      .node-title-line strong { white-space: normal; }
      .node-meta { flex-wrap: wrap; white-space: normal; }
      .fact { min-height: 24px; }
      .row-btn { min-height: 34px; }
      .node-actions { padding-left: 29px; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
    }
  `;
}
