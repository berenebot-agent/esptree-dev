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

  private async load(showLoading = true): Promise<void> {
    if (showLoading) this.loading = true;
    try {
      const [topology, current, queue, history, compileHistory] = await Promise.all([
        api.topology(),
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

  private goBack(): void {
    window.location.hash = '/';
  }

  render() {
    if (this.loading) return html`<div class="card">Loading device...</div>`;
    if (this.error) return html`<div class="card error">${this.error}</div>`;
    if (!this.node) {
      return html`
        <div class="card">
          <button class="back" @click=${this.goBack}>Back</button>
          <p>Device ${this.mac} is not present in the current bridge topology.</p>
        </div>
      `;
    }
    const isRemote = !this.node.is_bridge;
    const relayNodes = this.topology.filter((node) => {
      if (!node.online) return false;
      if (normalizeMac(node.mac) === normalizeMac(this.node!.mac)) return false;
      return !!node.is_bridge || !!node.can_relay || (node.hops ?? 0) > 0;
    });
    const parent = this.topology.find((node) => normalizeMac(node.mac) === normalizeMac(this.node?.parent_mac || ''));
    const name = this.node.friendly_name || this.node.esphome_name || this.node.label || this.node.mac;
    const statusLabel = this.node.online ? 'Online' : (this.node.offline_reason || 'Offline');
    const firmware = this.node.firmware_version || this.node.project_version || '—';
    return html`
      <div class="device-page">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <button @click=${this.goBack}>Network</button><span aria-hidden="true">/</span><span>${name}</span>
        </nav>
        <section class="hero ${this.node.online ? 'online' : 'offline'}">
          <div class="hero-top">
            <div class="hero-identity">
              <span class="device-glyph" aria-hidden="true">
                ${this.node.is_bridge
                  ? html`<svg viewBox="0 0 32 32"><path d="M16 27V14M16 14l-6-5M16 14l6-5M10 9L7 6M22 9l3-3"/><circle cx="16" cy="6" r="2.3"/><circle cx="10" cy="9" r="2"/><circle cx="22" cy="9" r="2"/></svg>`
                  : html`<svg viewBox="0 0 32 32"><rect x="9" y="7" width="14" height="11" rx="2"/><rect x="12" y="10" width="8" height="5" rx="1"/><path d="M16 18v7M11 25h10"/></svg>`}
              </span>
              <div class="hero-copy">
                <div class="hero-flags">
                  <span class="status-pill ${this.node.online ? 'ok' : 'bad'}"><span class="dot"></span>${statusLabel}</span>
                  <span class="type-pill">${this.node.is_bridge ? 'Bridge' : 'ESP-NOW remote'}</span>
                  ${(this.node.hops ?? 0) > 0 ? html`<span class="type-pill">${this.node.hops} hop${this.node.hops === 1 ? '' : 's'}</span>` : nothing}
                </div>
                <h1>${name}</h1>
                <div class="hero-meta">
                  <span class="mono">${this.node.mac}</span>
                  ${this.node.chip_name ? html`<span>${this.node.chip_name}</span>` : nothing}
                  ${parent ? html`<span>via ${parent.friendly_name || parent.esphome_name || parent.label || parent.mac}</span>` : nothing}
                </div>
              </div>
            </div>
            <div class="hero-actions">
              <a class="btn ${this.node.ha_device_id ? '' : 'attention'}" href="${this.node.ha_device_id ? `/config/devices/device/${this.node.ha_device_id}` : '/config/integrations/dashboard/add?domain=esp_tree'}" target="_blank" rel="noopener">
                ${this.node.ha_device_id ? 'Open in Home Assistant' : 'Add to Home Assistant'}
              </a>
            </div>
          </div>
          <div class="stat-row">
            <div class="stat"><span class="stat-label">Uptime</span><span class="stat-value">${fmtDuration(this.node.uptime_s)}</span></div>
            <div class="stat"><span class="stat-label">Last seen</span><span class="stat-value">${this.node.last_seen_ago != null ? `${fmtDuration(this.node.last_seen_ago)} ago` : '—'}</span></div>
            <div class="stat"><span class="stat-label">Signal</span><span class="stat-value">${this.node.rssi == null ? '—' : `${this.node.rssi} dBm`}</span></div>
            <div class="stat"><span class="stat-label">Route</span><span class="stat-value">${this.node.is_bridge ? 'Root' : parent ? parent.friendly_name || parent.esphome_name || parent.label || parent.mac : 'Retained'}</span></div>
            <div class="stat"><span class="stat-label">Firmware</span><span class="stat-value">${firmware}</span></div>
            <div class="stat"><span class="stat-label">Relay</span><span class="stat-value">${this.node.relay_enabled ? 'Enabled' : this.node.can_relay ? 'Available' : 'No'}</span></div>
          </div>
        </section>

        <div class="layout">
        ${isRemote
          ? html`
              <section class="card config-card">
                <esp-device-config
                  .mac=${this.node.mac}
                  .online=${!!this.node.online}
                  .isRemote=${isRemote}
                  .relayNodes=${relayNodes}
                  .relayEnabled=${!!this.node.relay_enabled}
                  @config-changed=${() => void this.load(false)}
                ></esp-device-config>
              </section>
              <section class="card ota-card">
                <esp-ota-box .mac=${this.node.mac} .node=${this.node} .currentJob=${this.currentJob} .showEditYaml=${isRemote} @ota-changed=${() => void this.load(false)}></esp-ota-box>
              </section>
            `
          : html`
              <section class="card ota-card">
                <esp-ota-box .mac=${this.node.mac} .node=${this.node} .currentJob=${this.currentJob} @ota-changed=${() => void this.load(false)}></esp-ota-box>
              </section>
            `}
        <section class="card history">
          <esp-flash-history .jobs=${this.history} @ota-changed=${() => void this.load(false)} @ota-reflash-result=${this.handleReflashResult}></esp-flash-history>
        </section>
        <section class="card history">
          <esp-compile-history .jobs=${this.compileHistoryList} .mac=${this.mac}></esp-compile-history>
        </section>
        ${COMPILE_ACTIVE_STATUSES.includes(this.compileStatus) || this.compileStatus === 'failed'
          ? html`<section class="card history compile-log-card">
              <esp-compile-log-viewer .mac=${this.mac} .visible=${true}></esp-compile-log-viewer>
            </section>`
          : nothing}
        </div>
      </div>
    `;
  }

static styles = css`
    .back {
      border: 1px solid var(--line);
      background: var(--surface);
      min-height: 36px;
      padding: 0 14px;
      font: inherit;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 16px;
      font-size: 13px;
      transition: all 0.12s;
    }

    .back:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .hero,
    .card {
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 12px;
      box-shadow: var(--shadow);
    }

    .hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      padding: 20px 24px;
      margin-bottom: 20px;
    }

    .hero-left {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .hero-left h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
      overflow-wrap: anywhere;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .mac-suffix {
      font-size: 14px;
      font-weight: 400;
      color: var(--muted);
      font-family: monospace;
    }
    .hero-entities {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 6px 10px;
      min-width: 70px;
      text-decoration: none;
      color: inherit;
      transition: border-color 0.15s, background 0.15s;
    }
    .hero-entities:hover {
      background: #eef4ff;
      border-color: #93c5fd;
    }
    .hero-entities .lbl {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
    }
    .hero-entities .val {
      font-size: 13px;
      font-weight: 600;
    }
    .hero-entities.not-added {
      border-color: #fecaca;
      background: #fef2f2;
    }
    .hero-entities.not-added:hover {
      background: #fee2e2;
      border-color: #f87171;
    }
    .hero-entities.not-added .val {
      color: #dc2626;
      font-size: 10px;
      font-weight: 500;
    }

    .hero-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hero-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 14px;
      min-width: 80px;
    }

    .hero-box.sm {
      min-width: 70px;
      padding: 6px 10px;
    }

    .hero-box.sm .lbl {
      font-size: 9px;
    }

.hero-box.sm {
      min-width: 70px;
      padding: 6px 10px;
    }

    .hero-box.sm .lbl {
      font-size: 9px;
    }

.hero-box.sm .val {
      font-size: 13px;
    }

    .box-online {
      background: #dcfce7;
      border-color: #bbf7d0;
    }

    .box-online .lbl,
    .box-online .val {
      color: #166534;
    }

    .box-offline {
      background: #fef2f2;
      border-color: #fecaca;
    }

    .box-offline .lbl,
    .box-offline .val {
      color: #991b1b;
    }

    .hero-box .lbl {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 2px;
    }

    .hero-box .val {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .hero-box .val .unit {
      font-size: 11px;
      font-weight: 500;
      color: #94a3b8;
    }

    .btn-edit-config {
      border: 1px solid #0f766e;
      background: #0f766e;
      color: #fff;
      min-height: 36px;
      padding: 0 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.12s;
      align-self: flex-start;
    }

    .btn-edit-config:hover {
      background: #0d5f58;
      border-color: #0d5f58;
    }

    .layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .panel,
    .card {
      padding: 16px 20px;
    }

    .history {
      grid-column: 1 / -1;
    }

    .layout-empty {
      min-height: 1px;
    }

    .error {
      color: var(--danger);
      font-weight: 500;
      padding: 12px;
      border: 1px solid var(--danger);
      border-radius: 8px;
      background: #fef2f2;
    }

    @media (max-width: 900px) {
      .layout {
        grid-template-columns: 1fr;
      }
      .hero-stats {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 500px) {
      .hero-stats {
        flex-direction: column;
      }
    }

    /* ---- Device detail shell ---- */
    :host { display: block; color: var(--ink); }
    * { box-sizing: border-box; }
    .device-page { display: flex; flex-direction: column; gap: 16px; }
    .breadcrumb { display: flex; align-items: center; gap: 7px; color: var(--faint); font-size: 10px; }
    .breadcrumb button { padding: 0; border: 0; background: none; color: var(--primary); font: inherit; font-weight: 600; cursor: pointer; }
    .breadcrumb button:hover { text-decoration: underline; }
    .breadcrumb button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .hero { display: block; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--shadow-sm); overflow: hidden; padding: 0; margin: 0; }
    .hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding: 22px 24px 18px; }
    .hero-identity { display: flex; align-items: flex-start; gap: 15px; min-width: 0; }
    .device-glyph { display: grid; place-items: center; width: 48px; height: 48px; flex: 0 0 48px; border: 1px solid var(--line); border-radius: 11px; background: var(--surface-subtle); }
    .hero.online .device-glyph { border-color: #cfe5d5; background: var(--ok-soft); }
    .hero.offline .device-glyph { border-color: #e7c2c5; background: var(--danger-soft); }
    .device-glyph svg { width: 29px; height: 29px; fill: none; stroke: var(--primary); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
    .hero.offline .device-glyph svg { stroke: var(--danger); }
    .hero-copy { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
    .hero-flags { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
    .status-pill { display: inline-flex; align-items: center; gap: 5px; min-height: 21px; padding: 0 7px; border-radius: 4px; font-size: 9px; font-weight: 700; }
    .status-pill .dot { width: 5px; height: 5px; border-radius: 50%; }
    .status-pill.ok { background: var(--ok-soft); color: var(--ok); }
    .status-pill.ok .dot { background: var(--ok); }
    .status-pill.bad { background: var(--danger-soft); color: #95343a; }
    .status-pill.bad .dot { background: var(--danger); }
    .type-pill { display: inline-flex; align-items: center; min-height: 21px; padding: 0 7px; border: 1px solid var(--line); border-radius: 4px; color: var(--muted); font-size: 9px; font-weight: 600; }
    .hero h1 { margin: 1px 0 0; color: var(--ink); font-size: 25px; line-height: 1.18; letter-spacing: -.035em; font-weight: 700; overflow-wrap: anywhere; }
    .hero-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 4px 10px; color: var(--muted); font-size: 10px; }
    .hero-meta span + span::before { content: '·'; margin-right: 10px; color: #83928a; }
    .mono { font-family: var(--font-mono); }
    .hero-actions { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
    .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 35px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); color: var(--ink-2); font: inherit; font-size: 11px; font-weight: 600; text-decoration: none; white-space: nowrap; }
    .btn:hover { background: var(--surface-subtle); border-color: var(--faint); }
    .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .btn.attention { border-color: #e4d2ae; background: var(--accent-soft); color: #855d15; }
    .stat-row { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1px; border-top: 1px solid var(--line); background: var(--line); }
    .stat { display: flex; flex-direction: column; gap: 4px; min-height: 73px; padding: 13px 16px; background: var(--surface-subtle); }
    .stat-label { color: var(--faint); font-size: 8px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
    .stat-value { overflow: hidden; text-overflow: ellipsis; color: var(--ink); font-size: 12px; font-weight: 650; white-space: nowrap; }
    .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
    .layout .card { border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--shadow-sm); padding: 16px 18px; min-width: 0; }
    .layout .history, .layout .compile-log-card { grid-column: 1 / -1; }
    .layout .ota-card { padding: 0; }
    .layout .ota-card > * { display: block; padding: 16px 18px; }
    .loading-state { display: flex; align-items: center; gap: 9px; min-height: 120px; padding: 24px; border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); color: var(--muted); font-size: 12px; }
    .spinner { width: 14px; height: 14px; border: 2px solid var(--line); border-top-color: var(--primary); border-radius: 50%; animation: spin .8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .callout { display: flex; flex-direction: column; gap: 2px; padding: 12px 14px; border: 1px solid #e7c2c5; border-radius: 8px; background: var(--danger-soft); color: #8c3037; font-size: 12px; }
    .callout.error { border-color: #e7c2c5; background: var(--danger-soft); color: #8c3037; }
    .empty-page { padding: 32px; text-align: center; border: 1px dashed var(--line-strong); border-radius: var(--radius-lg); background: var(--surface-subtle); }
    .empty-page h2 { margin: 20px 0 3px; font-size: 17px; }
    .empty-page p { margin: 0 auto; max-width: 56ch; color: var(--muted); font-size: 12px; line-height: 1.5; }
    .back { border: 0; background: none; color: var(--primary); font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
    @media (max-width: 1120px) { .stat-row { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .hero-top { flex-direction: column; gap: 15px; }
      .hero-actions { width: 100%; }
      .hero-actions .btn { width: 100%; }
    }
    @media (max-width: 620px) {
      .hero-top { padding: 17px 16px 15px; }
      .device-glyph { width: 40px; height: 40px; flex-basis: 40px; border-radius: 9px; }
      .device-glyph svg { width: 24px; height: 24px; }
      .hero h1 { font-size: 21px; }
      .stat-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .stat { min-height: 65px; padding: 11px 13px; }
      .layout .card { padding: 14px; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
  `;
}
