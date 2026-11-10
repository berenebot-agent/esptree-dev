import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/topology-map';
import './components/device-detail';
import './components/settings';
import './pages/queue-page';
import './pages/config-page';
import './pages/secrets-page';
import './pages/job-page';
import './pages/activity-log-page';
import './pages/setup-page';
import './pages/remote-wizard';
import { QueueResponse, CompileQueueResponse, api, streamBridgeState } from './api/client';
import { themeTokens } from './styles/theme';
import { shared } from './styles/shared';
import { icon, brandMark } from './styles/icons';

declare const __GIT_HASH__: string;
declare const __GIT_DATE__: string;

type Route = { name: 'topology' } | { name: 'device'; mac: string } | { name: 'device-config'; mac: string; updateFirmware?: boolean } | { name: 'settings' } | { name: 'queue' } | { name: 'secrets'; from: string } | { name: 'job'; jobId: number; from: string } | { name: 'activity-log' } | { name: 'setup' } | { name: 'remote-wizard' };

@customElement('espnow-app')
export class EspnowApp extends LitElement {
  @state() private route: Route = this.readRoute();
  @state() private queueData: QueueResponse | null = null;
  @state() private compileData: CompileQueueResponse | null = null;
  @state() private addonConnected = true;
  @state() private bridgeConnected: boolean | null = null;
  @state() private bridgeConfigured: boolean | null = null;
  @state() private integrationLoaded: boolean | null = null;
  @state() private integrationConfigured = false;
  @state() private restartRequired = false;
  @state() private bridgeLabel = '';
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private bridgeStreamHandle: { close: () => void } | null = null;
  private setupDismissed = false;

  /**
   * Follow Home Assistant's theme rather than only the OS. The panel runs in a
   * same-origin ingress iframe, so HA's resolved background colour is readable;
   * its luminance says whether HA is dark. Any failure falls back to the OS
   * preference (no attribute).
   */
  private syncHaTheme = (): void => {
    let mode: 'dark' | 'light' | null = null;
    try {
      if (window.parent !== window) {
        const root = window.parent.document.documentElement;
        const raw = window.parent.getComputedStyle(root).getPropertyValue('--primary-background-color').trim();
        const probe = document.createElement('span');
        probe.style.color = raw;
        document.body.appendChild(probe);
        const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g)?.map(Number);
        probe.remove();
        if (raw && rgb && rgb.length >= 3) {
          const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
          mode = lum < 0.5 ? 'dark' : 'light';
        }
      }
    } catch {
      mode = null;
    }
    if (mode) this.setAttribute('theme', mode);
    else this.removeAttribute('theme');
    const meta = document.querySelector('meta[name="color-scheme"]');
    meta?.setAttribute('content', mode ?? 'light dark');
    document.documentElement.style.background = mode === 'dark' ? '#111414' : mode === 'light' ? '#f4f6f6' : '';
  };
  private themeTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.syncHaTheme();
    this.themeTimer = setInterval(this.syncHaTheme, 5000);
    window.addEventListener('hashchange', this.onHashChange);
    this.addEventListener('setup-dismissed', this.onSetupDismissed as EventListener);
    this.bridgeStreamHandle = streamBridgeState((connected) => {
      this.bridgeConnected = connected;
      void this.fetchConfig();
    });
    this.fetchQueue();
    this.pollTimer = setInterval(() => {
      this.fetchQueue();
      void this.fetchConfig();
      void this.checkRestartRequired();
    }, 3000);
    void this.fetchConfig();
    void this.checkRestartRequired();
    this.maybeRedirectToSetup();
  }

  private async checkRestartRequired(): Promise<void> {
    try {
      const status = await api.restartRequired();
      this.restartRequired = status.restart_required;
      this.integrationLoaded = status.integration?.loaded ?? this.integrationLoaded;
      this.integrationConfigured = status.integration?.configured ?? this.integrationConfigured;
    } catch {
      this.restartRequired = false;
    }
    this.maybeRedirectToSetup();
  }

  private async fetchConfig(): Promise<void> {
    try {
      const config = await api.config();
      const active = config.active_bridge as { name?: string; hostname?: string; host?: string; error?: unknown } | null;
      this.integrationLoaded = config.integration?.loaded ?? null;
      this.integrationConfigured = config.integration?.configured ?? false;
      this.bridgeLabel = active?.name || active?.hostname || active?.host || '';
      // The add-on's own bridge records are the only authority here. The
      // integration's bridge_count is retained runtime state that survives
      // clearing the add-on's data (HA keeps the config entries), so a stale
      // snapshot reports a bridge the add-on no longer has and suppresses the
      // first-run wizard on a genuinely fresh install.
      this.bridgeConfigured = !!(
        (active && !active.error) ||
        (config.bridges?.length ?? 0) > 0
      );
      this.addonConnected = true;
    } catch {
      // An unreachable add-on is an outage, not a fresh install: keep the last
      // known bridge state so the shell shows the outage instead of sending
      // the user into first-run setup.
      this.addonConnected = false;
    }
    this.maybeRedirectToSetup();
  }

  private needsSetup(): boolean {
    if (!this.addonConnected) return false;
    return this.bridgeConfigured === false
      || this.restartRequired
      || (!this.integrationConfigured && this.integrationLoaded === false);
  }

  private maybeRedirectToSetup(): void {
    if (
      this.needsSetup() &&
      this.route.name === 'topology' &&
      !this.setupDismissed
    ) {
      this.navigate('/setup');
    }
  }

  disconnectedCallback(): void {
    if (this.themeTimer) clearInterval(this.themeTimer);
    window.removeEventListener('hashchange', this.onHashChange);
    this.removeEventListener('setup-dismissed', this.onSetupDismissed as EventListener);
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.bridgeStreamHandle?.close();
    this.bridgeStreamHandle = null;
    super.disconnectedCallback();
  }

  private async fetchQueue(): Promise<void> {
    try {
      const [flash, compile] = await Promise.all([
        api.getQueue(),
        api.getCompileQueue(),
      ]);
      this.queueData = flash;
      this.compileData = compile;
      this.addonConnected = true;
    } catch {
      this.addonConnected = false;
    }
  }

  private onHashChange = (): void => {
    this.route = this.readRoute();
  };

  private onSetupDismissed = (): void => {
    this.setupDismissed = true;
  };

  private readRoute(): Route {
    const hash = window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');
    if (hash.startsWith('device/')) {
      const rest = hash.slice(7);
      const [devicePath, query] = rest.split('?');
      if (devicePath.endsWith('/config')) {
        const params = new URLSearchParams(query || '');
        return {
          name: 'device-config',
          mac: decodeURIComponent(devicePath.replace(/\/config$/, '')),
          updateFirmware: params.get('update_firmware') === '1',
        };
      }
      return { name: 'device', mac: decodeURIComponent(devicePath) };
    }
    if (hash.startsWith('job/')) {
      const rest = hash.slice(4);
      const [idPart, query] = rest.split('?');
      const jobId = parseInt(idPart, 10);
      let from = '/queue';
      if (query) {
        const params = new URLSearchParams(query);
        from = params.get('from') || '/queue';
      }
      return { name: 'job', jobId, from };
    }
    if (hash === 'settings') return { name: 'settings' };
    if (hash === 'queue') return { name: 'queue' };
    if (hash === 'secrets') return { name: 'secrets', from: '/' };
    if (hash.startsWith('secrets?')) {
      const params = new URLSearchParams(hash.slice(7));
      return { name: 'secrets', from: params.get('from') || '/' };
    }
    if (hash === 'activity-log') return { name: 'activity-log' };
    if (hash === 'setup') return { name: 'setup' };
    if (hash === 'add-remote') return { name: 'remote-wizard' };
    return { name: 'topology' };
  }

  private navigate(path: string): void {
    window.location.hash = path;
  }

  private activeRoute(): string {
    if (this.route.name === 'topology' || this.route.name === 'device' || this.route.name === 'device-config' || this.route.name === 'remote-wizard') return 'network';
    if (this.route.name === 'queue' || this.route.name === 'job') return 'queue';
    if (this.route.name === 'activity-log') return 'activity';
    return 'settings';
  }

  /** One number for work running or queued, counted once.
   *
   *  `/api/ota/queue` counts queued uploads only, while `/api/compile/queue`
   *  already includes the build it is running. Adding a bare "something is
   *  active" back on top double-counted that build and showed a single
   *  build-and-upload as two jobs on the tab.
   */
  private queueSummary(): { label: string; count: number; active: boolean; paused: boolean } {
    const q = this.queueData;
    const cq = this.compileData;
    const activeUpload = !!q?.active_job;
    const activeBuild = !!cq?.active_job;
    const count = (q?.count ?? 0) + (cq?.count ?? 0) + (activeUpload ? 1 : 0);
    return {
      label: `${count}`,
      count,
      active: activeUpload || activeBuild,
      paused: !!q?.paused,
    };
  }

  private renderTab(key: string, label: string, path: string, extra: unknown = nothing) {
    const current = this.activeRoute() === key;
    return html`
      <a class="tab ${current ? 'current' : ''}" href="#${path}" aria-current=${current ? 'page' : 'false'}>
        <span>${label}</span>${extra}
      </a>
    `;
  }

  private renderStatus() {
    if (!this.addonConnected) {
      return html`<span class="status bad" role="status"><span class="sdot"></span><span class="status-text">Add-on unreachable</span></span>`;
    }
    if (this.bridgeConnected === false) {
      return html`<span class="status bad" role="status"><span class="sdot"></span><span class="status-text">Bridge offline</span></span>`;
    }
    if (this.bridgeConfigured === false) {
      return html`<span class="status warn" role="status"><span class="sdot"></span><span class="status-text">No bridge</span></span>`;
    }
    return html`<span class="status ok" role="status" title=${this.bridgeLabel ? `Connected to ${this.bridgeLabel}` : 'Bridge connected'}>
      <span class="sdot"></span><span class="status-text">${this.bridgeLabel || 'Bridge connected'}</span>
    </span>`;
  }

  private renderOutage() {
    if (!this.addonConnected) {
      return html`<div class="outage" role="alert">
        ${icon('alert')}
        <span><strong>Can't reach the ESP Tree add-on.</strong> Retrying every few seconds. If this continues, check the add-on is running in Home Assistant under Settings → Add-ons.</span>
      </div>`;
    }
    if (this.bridgeConnected === false) {
      return html`<div class="outage" role="status">
        ${icon('alert')}
        <span><strong>The add-on can't reach the bridge.</strong> Remotes keep running, but status is stale and jobs are paused until it reconnects.</span>
        <a class="outage-link" href="#/settings">Bridge settings</a>
      </div>`;
    }
    if (this.restartRequired) {
      return html`<div class="outage notice-warn" role="status">
        ${icon('info')}
        <span><strong>Home Assistant needs a restart</strong> to load the updated ESP Tree integration.</span>
        <a class="outage-link" href="#/setup">Finish setup</a>
      </div>`;
    }
    return nothing;
  }

  render() {
    if (this.route.name === 'setup') {
      return html`<esp-setup-wizard></esp-setup-wizard>`;
    }

    const q = this.queueSummary();
    const jobsBadge = q.count > 0 || q.active
      ? html`<span class="tab-count ${q.active ? 'live' : ''}" aria-label=${`${q.count} job${q.count === 1 ? '' : 's'} running or queued${q.paused ? ', paused' : ''}`}>${q.paused ? icon('pause') : nothing}${q.count}</span>`
      : nothing;

    return html`
      <header class="toolbar">
        <div class="toolbar-inner">
          <a class="brand" href="#/" aria-label="ESP Tree, network">
            ${brandMark}<span>ESP Tree</span>
          </a>
          <nav class="tabs" aria-label="ESP Tree">
            ${this.renderTab('network', 'Network', '/')}
            ${this.renderTab('queue', 'Jobs', '/queue', jobsBadge)}
            ${this.renderTab('activity', 'Activity', '/activity-log')}
            ${this.renderTab('settings', 'Settings', '/settings')}
          </nav>
          <div class="toolbar-end">${this.renderStatus()}</div>
        </div>
      </header>
      ${this.renderOutage()}
      <main class="content">
        ${this.route.name === 'remote-wizard'
          ? html`<esp-remote-wizard></esp-remote-wizard>`
          : this.route.name === 'topology'
          ? html`<esp-topology-map .addonDown=${!this.addonConnected} @node-selected=${(event: CustomEvent<string>) => this.navigate(`/device/${encodeURIComponent(event.detail)}`)}></esp-topology-map>`
          : this.route.name === 'device'
            ? html`<esp-device-detail .mac=${this.route.mac}></esp-device-detail>`
            : this.route.name === 'device-config'
              ? html`<esp-config-page .mac=${this.route.mac} .updateFirmware=${this.route.updateFirmware ?? false}></esp-config-page>`
              : this.route.name === 'job'
                ? html`<esp-job-page .jobId=${this.route.jobId} .from=${this.route.from}></esp-job-page>`
                : this.route.name === 'queue'
                  ? html`<esp-queue-page></esp-queue-page>`
                  : this.route.name === 'secrets'
                    ? html`<esp-secrets-page .from=${this.route.from}></esp-secrets-page>`
                    : this.route.name === 'activity-log'
                      ? html`<esp-activity-log-page></esp-activity-log-page>`
                      : html`<esp-settings></esp-settings>`}
      </main>
      <footer class="build">ESP Tree UI · ${__GIT_HASH__}</footer>
    `;
  }

  static styles = [themeTokens, shared, css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--canvas);
      color: var(--ink);
      font-family: var(--font-sans);
      font-size: var(--text-md);
      -webkit-font-smoothing: antialiased;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: var(--toolbar);
      color: var(--toolbar-ink);
    }
    .toolbar-inner {
      display: flex;
      align-items: stretch;
      gap: 8px 24px;
      height: var(--toolbar-h);
      max-width: calc(var(--content-max) + 2 * var(--gutter));
      margin: 0 auto;
      padding: 0 var(--gutter);
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: inherit;
      text-decoration: none;
      font-size: var(--text-xl);
      font-weight: 500;
      letter-spacing: -0.01em;
      flex: none;
    }
    .brand .brand-mark { width: 26px; height: 26px; color: var(--toolbar-indicator); }
    .tabs {
      display: flex;
      align-items: stretch;
      gap: 4px;
      min-width: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs::-webkit-scrollbar { display: none; }
    .tab {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 14px;
      color: var(--toolbar-muted);
      text-decoration: none;
      font-size: var(--text-md);
      font-weight: 500;
      white-space: nowrap;
      transition: color 150ms ease, background-color 150ms ease;
    }
    .tab:hover { color: var(--toolbar-ink); background: var(--toolbar-hover); }
    .tab.current { color: var(--toolbar-ink); }
    .tab.current::after {
      content: '';
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--toolbar-indicator);
    }
    .tab:focus-visible { outline-color: var(--toolbar-indicator); outline-offset: -4px; }
    .tab-count {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.16);
      color: var(--toolbar-ink);
      font-size: var(--text-xs);
      font-weight: 600;
      justify-content: center;
      font-variant-numeric: tabular-nums;
    }
    .tab-count.live { background: var(--toolbar-indicator); color: #2b1a00; }
    .tab-count svg { width: 12px; height: 12px; }

    .toolbar-end {
      margin-left: auto;
      display: flex;
      align-items: center;
      min-width: 0;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      color: var(--toolbar-muted);
      font-size: var(--text-sm);
    }
    .status-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sdot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: #6fd08a; box-shadow: 0 0 0 3px rgba(111, 208, 138, 0.2); }
    .status.bad { color: var(--toolbar-ink); }
    .status.bad .sdot { background: #ff8a80; box-shadow: 0 0 0 3px rgba(255, 138, 128, 0.25); }
    .status.warn .sdot { background: var(--toolbar-indicator); box-shadow: none; }

    .outage {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px var(--gutter);
      background: var(--danger-soft);
      color: var(--ink);
      font-size: var(--text-md);
      border-bottom: 1px solid var(--line);
    }
    .outage.notice-warn { background: var(--accent-soft); }
    .outage svg { width: 20px; height: 20px; flex: none; color: var(--danger); margin-top: 1px; }
    .outage.notice-warn svg { color: var(--accent); }
    .outage strong { font-weight: 500; }
    .outage-link { margin-left: auto; white-space: nowrap; font-weight: 500; }

    .content {
      max-width: var(--content-max);
      margin: 0 auto;
      padding: 20px var(--gutter) 32px;
    }
    .build {
      max-width: var(--content-max);
      margin: 0 auto;
      padding: 0 var(--gutter) 24px;
      color: var(--faint);
      font-size: var(--text-xs);
    }

    @media (max-width: 760px) {
      .toolbar-inner {
        flex-wrap: wrap;
        height: auto;
        padding: 0;
        gap: 0;
      }
      .brand { height: 52px; padding: 0 var(--gutter); font-size: var(--text-lg); }
      .toolbar-end { height: 52px; padding-right: var(--gutter); }
      .tabs { order: 3; flex: 1 0 100%; height: 44px; padding: 0 8px; }
      .tab { padding: 0 12px; }
      .content { padding-top: 16px; }
      .status-text { max-width: 40vw; }
    }
  `];
}
