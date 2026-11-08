import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { EspOtaBox } from './ota-box';
import { OtaJob, PreflightComparison, TopologyNode, api, fmtDuration, normalizeMac } from '../api/client';
import { CompileStatusResponse } from '../api/client';
import './device-config';
import './ota-box';
import './flash-history';
import './compile-history';
import './compile-log-viewer';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';
import { linkQuality, nodeName, offlineReason, readableRssi } from './topology-node';

const ACTIVE_STATUSES = ['queued', 'starting', 'transferring', 'verifying', 'transfer_success_waiting_rejoin'];
const COMPILE_ACTIVE_STATUSES = ['compile_queued', 'compiling'];

@customElement('esp-device-detail')
export class EspDeviceDetail extends LitElement {
  @property({ type: String }) mac = '';
  @state() private node: TopologyNode | null = null;
  @state() private topology: TopologyNode[] = [];
  @state() private currentJob: OtaJob | null = null;
  @state() private history: OtaJob[] = [];
  @state() private compileHistoryList: OtaJob[] = [];
  @state() private compileStatus: string = 'idle';
  @state() private loading = true;
  @state() private error = '';
  @state() private haBusy = false;
  @state() private haNotice = '';
  private timer: number | undefined;
  private compileTimer: ReturnType<typeof setInterval> | null = null;
  @query('esp-ota-box') private otaBox!: EspOtaBox;

  connectedCallback(): void {
    super.connectedCallback();
    void this.load();
    this.schedulePoll();
  }

  disconnectedCallback(): void {
    if (this.timer) window.clearInterval(this.timer);
    if (this.compileTimer) window.clearInterval(this.compileTimer);
    super.disconnectedCallback();
  }

  private schedulePoll(): void {
    if (this.timer) window.clearInterval(this.timer);
    const isActive = this.currentJob && ACTIVE_STATUSES.includes(this.currentJob.status);
    const interval = isActive ? 2000 : 5000;
    this.timer = window.setInterval(() => void this.load(false), interval);
  }

  private pollCompileStatus(): void {
    api.getCompileStatus(this.mac).then((s: CompileStatusResponse) => {
      this.compileStatus = s.status;
      if (COMPILE_ACTIVE_STATUSES.includes(s.status)) {
        if (!this.compileTimer) {
          this.compileTimer = setInterval(() => this.pollCompileStatus(), 3000);
        }
      } else {
        if (this.compileTimer) {
          clearInterval(this.compileTimer);
          this.compileTimer = null;
        }
      }
    }).catch(() => {});
  }

  private handleReflashResult(e: CustomEvent<{ job: OtaJob; preflight: PreflightComparison }>): void {
    this.otaBox.preflight = e.detail.preflight;
    void this.load(false);
  }

  updated(): void {
    this.schedulePoll();
  }

  private async load(showLoading = true, fresh = false): Promise<void> {
    if (showLoading) this.loading = true;
    try {
      const [topology, current, queue, history, compileHistory] = await Promise.all([
        api.topology(fresh),
        api.currentOtaForDevice(this.mac),
        api.getQueue(),
        api.history(this.mac),
        api.getCompileHistory(this.mac),
      ]);
      this.topology = topology;
      this.node = topology.find((node) => normalizeMac(node.mac) === normalizeMac(this.mac)) || null;
      const nm = normalizeMac(this.mac);
      const queuedForThis = (queue.queued_jobs ?? []).find((j) => normalizeMac(j.mac) === nm) ?? null;
      if (current && current.job && normalizeMac(current.job.mac) === nm) {
        this.currentJob = current.job;
      } else if (queuedForThis) {
        this.currentJob = queuedForThis;
      } else {
        this.currentJob = null;
      }
      this.history = history.jobs;
      this.compileHistoryList = compileHistory.jobs;
      this.error = '';
      const compileResp = await api.getCompileStatus(this.mac).catch(() => null);
      if (compileResp) {
        this.compileStatus = compileResp.status;
      }
      if (COMPILE_ACTIVE_STATUSES.includes(this.compileStatus)) {
        this.pollCompileStatus();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    } finally {
      this.loading = false;
    }
  }

  /** Same path the add-remote wizard uses: run the integration's setup so it picks up new remotes. */
  private async addToHomeAssistant(): Promise<void> {
    this.haBusy = true;
    this.haNotice = '';
    try {
      const result = await api.integrationSetup();
      this.haNotice = result.success
        ? 'Home Assistant is adding this remote. It can take a few seconds to appear.'
        : (result.error || "Home Assistant didn't accept the request.");
      await this.load(false);
    } catch (err) {
      this.haNotice = err instanceof Error ? err.message : String(err);
    } finally {
      this.haBusy = false;
    }
  }

  render() {
    if (this.loading) return html`<div class="card loading" aria-live="polite"><span class="spinner"></span>Loading device…</div>`;
    if (this.error) {
      return html`<div class="notice danger" role="alert">${icon('alert')}<span><strong>Couldn't load this device.</strong> ${this.error}</span>
        <span class="notice-actions"><button class="btn sm" @click=${() => void this.load()}>Try again</button></span></div>`;
    }
    if (!this.node) {
      return html`
        <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Network</a>${icon('chevronRight')}<span class="mono">${this.mac}</span></nav>
        <section class="card">
          <div class="empty">
            ${icon('search')}
            <strong>Device not in the network</strong>
            <p>${this.mac} isn't in the bridge's current topology. It may have been deleted, or it hasn't joined since the add-on restarted.</p>
            <a class="btn" href="#/">Back to network</a>
          </div>
        </section>
      `;
    }
    const node = this.node;
    const isRemote = !node.is_bridge;
    const relayNodes = this.topology.filter((n) => {
      if (!n.online) return false;
      if (normalizeMac(n.mac) === normalizeMac(node.mac)) return false;
      return !!n.is_bridge || !!n.can_relay || (n.hops ?? 0) > 0;
    });
    const parent = this.topology.find((n) => normalizeMac(n.mac) === normalizeMac(node.parent_mac || ''));
    const name = nodeName(node);
    const q = linkQuality(node);
    const rssi = readableRssi(node.rssi);
    const qLabel = { strong: 'Strong', fair: 'Fair', weak: 'Weak', down: '', unknown: '' }[q];
    const haHref = `/config/devices/device/${node.ha_device_id}`;
    return html`
      <div class="page">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Network</a>${icon('chevronRight')}<span aria-current="page">${name}</span></nav>
          <div class="page-head">
            <div class="ident">
              <span class="glyph ${node.online ? '' : 'off'} ${node.is_bridge ? 'bridge' : ''}" aria-hidden="true">${icon(node.is_bridge ? 'bridge' : node.relay_enabled ? 'relay' : 'remote')}</span>
              <div>
                <h1>${name}</h1>
                <p class="sub">
                  ${node.online
                    ? html`<span class="chip ok"><span class="dot ok"></span>Online</span>`
                    : html`<span class="chip danger"><span class="dot danger"></span>${offlineReason(node)}</span>`}
                  <span>${node.is_bridge ? 'Bridge' : node.relay_enabled ? 'Remote · relay' : 'Remote'}</span>
                  <span class="mono">${node.mac}</span>
                  ${node.chip_name ? html`<span>${node.chip_name}</span>` : nothing}
                </p>
              </div>
            </div>
            <div class="page-actions">
              ${node.ha_device_id
                ? html`<a class="btn" href=${haHref} target="_top" rel="noopener">${icon('ha')}Open in Home Assistant</a>`
                : html`<button class="btn" ?disabled=${this.haBusy} @click=${() => void this.addToHomeAssistant()}>${this.haBusy ? html`<span class="spinner"></span>Adding…` : html`${icon('ha')}Add to Home Assistant`}</button>`}
            </div>
          </div>
        </div>

        ${this.haNotice ? html`<div class="notice info" role="status">${icon('info')}<span>${this.haNotice}</span></div>` : nothing}

        <section class="card">
          <dl class="facts summary">
            <div><dt>Last seen</dt><dd>${node.is_bridge ? 'Now' : node.last_seen_ago != null ? `${fmtDuration(node.last_seen_ago) || '0s'} ago` : '—'}</dd></div>
            <div><dt>Uptime</dt><dd>${fmtDuration(node.uptime_s) || '—'}</dd></div>
            <div><dt>Signal</dt><dd>${rssi == null ? '—' : html`${rssi} dBm${qLabel ? html` <span class="q ${q}">${qLabel}</span>` : nothing}`}</dd></div>
            <div><dt>Route</dt><dd>${node.is_bridge ? 'Root of the mesh' : parent ? html`via <a href=${`#/device/${encodeURIComponent(parent.mac)}`}>${nodeName(parent)}</a>${(node.hops ?? 0) > 0 ? html` · ${node.hops} hop${node.hops === 1 ? '' : 's'}` : nothing}` : 'Unknown (retained)'}</dd></div>
            <div><dt>Firmware</dt><dd>${node.project_version || node.firmware_version || '—'}</dd></div>
            <div><dt>Relay</dt><dd>${node.relay_enabled ? 'On' : node.can_relay ? 'Available, off' : 'Not supported'}</dd></div>
          </dl>
        </section>

        <div class="layout ${isRemote ? '' : 'single'}">
          <section class="card">
            <esp-ota-box .mac=${node.mac} .node=${node} .currentJob=${this.currentJob} .showEditYaml=${isRemote} @ota-changed=${() => void this.load(false, true)}></esp-ota-box>
          </section>
          ${isRemote ? html`
            <section class="card">
              <esp-device-config
                .mac=${node.mac}
                .online=${!!node.online}
                .isRemote=${isRemote}
                .relayNodes=${relayNodes}
                .relayEnabled=${!!node.relay_enabled}
                @config-changed=${() => void this.load(false, true)}
              ></esp-device-config>
            </section>` : nothing}
        </div>

        ${COMPILE_ACTIVE_STATUSES.includes(this.compileStatus) || this.compileStatus === 'failed'
          ? html`<section class="card log-card">
              <div class="card-head"><h2>${this.compileStatus === 'failed' ? 'Last build failed' : 'Building firmware'}</h2></div>
              <div class="card-body"><esp-compile-log-viewer .mac=${this.mac} .visible=${true}></esp-compile-log-viewer></div>
            </section>`
          : nothing}

        <div class="history-layout">
          <section class="card">
            <esp-flash-history .jobs=${this.history} @ota-changed=${() => void this.load(false, true)} @ota-reflash-result=${this.handleReflashResult}></esp-flash-history>
          </section>
          <section class="card">
            <esp-compile-history .jobs=${this.compileHistoryList} .mac=${this.mac}></esp-compile-history>
          </section>
        </div>
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .ident { display: flex; gap: 14px; align-items: center; min-width: 0; }
    .ident > div { min-width: 0; }
    .ident h1 { overflow-wrap: anywhere; }
    .glyph { display: grid; place-items: center; width: 48px; height: 48px; flex: none; border-radius: 50%; background: var(--surface-subtle); color: var(--muted); }
    .glyph svg { width: 26px; height: 26px; }
    .glyph.bridge { background: var(--primary-soft); color: var(--primary); }
    .glyph.off { background: var(--danger-soft); color: var(--danger); }
    .sub { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
    .page-actions .btn svg { width: 18px; height: 18px; }
    .page-actions .spinner { width: 14px; height: 14px; }
    .summary { padding: 16px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .q { font-size: var(--text-xs); font-weight: 500; }
    .q.strong { color: var(--ok); }
    .q.fair { color: var(--accent); }
    .q.weak { color: var(--danger); }
    .layout { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .layout.single { grid-template-columns: minmax(0, 1fr); }
    .history-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; }
    .layout > .card, .history-layout > .card { overflow: hidden; }
    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }
    @media (max-width: 960px) {
      .layout { grid-template-columns: minmax(0, 1fr); }
    }
  `];
}
