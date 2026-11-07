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

declare const __GIT_HASH__: string;
declare const __GIT_DATE__: string;

type Route = { name: 'topology' } | { name: 'device'; mac: string } | { name: 'device-config'; mac: string } | { name: 'settings' } | { name: 'queue' } | { name: 'secrets'; from: string } | { name: 'job'; jobId: number; from: string } | { name: 'activity-log' } | { name: 'setup' } | { name: 'remote-wizard' };

const NAV_ICONS = {
  network: html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2.3"/><circle cx="5" cy="18" r="2.3"/><circle cx="19" cy="18" r="2.3"/><path d="M12 7.3v3.4M6.4 16.6l4.3-4.3M17.6 16.6l-4.3-4.3"/></svg>`,
  jobs: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5h14M5 12h14M5 17.5h9"/><circle cx="3" cy="6.5" r=".9"/><circle cx="3" cy="12" r=".9"/><circle cx="3" cy="17.5" r=".9"/></svg>`,
  activity: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l2.2-6 3.6 12 2.1-6H21"/></svg>`,
  settings: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .35 1.87l.06.06-1.9 1.9-.06-.06a1.7 1.7 0 0 0-1.87-.35 1.7 1.7 0 0 0-1 1.55v.09h-2.7v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.35l-.06.06-1.9-1.9.06-.06A1.7 1.7 0 0 0 7.4 15a1.7 1.7 0 0 0-1.55-1H5.76v-2.7h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.35-1.87l-.06-.06 1.9-1.9.06.06a1.7 1.7 0 0 0 1.87.35 1.7 1.7 0 0 0 1-1.55v-.09h2.7v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.35l.06-.06 1.9 1.9-.06.06a1.7 1.7 0 0 0-.35 1.87 1.7 1.7 0 0 0 1.55 1h.09v2.7h-.09a1.7 1.7 0 0 0-1.55 1Z"/></svg>`,
  plus: html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
};

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
  @state() private addonVersion = '';
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private bridgeStreamHandle: { close: () => void } | null = null;
  private setupDismissed = false;

  connectedCallback(): void {
    super.connectedCallback();
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
    void this.fetchVersion();
    this.maybeRedirectToSetup();
  }

  /** The running add-on version, read live: a value compiled into the bundle is
   *  always one release behind, because the bump lands after the build. */
  private async fetchVersion(): Promise<void> {
    try {
      const health = await api.health();
      if (health.version) this.addonVersion = health.version;
    } catch {
      // Leave the badge blank rather than showing a version that may be wrong.
    }
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
      this.addonConnected = false;
      this.bridgeConfigured = false;
    }
    this.maybeRedirectToSetup();
  }

  private needsSetup(): boolean {
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
      if (rest.endsWith('/config')) {
        return { name: 'device-config', mac: decodeURIComponent(rest.replace(/\/config$/, '')) };
      }
      return { name: 'device', mac: decodeURIComponent(rest) };
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

  private queueSummary(): { label: string; count: number; active: boolean; paused: boolean } {
    const q = this.queueData;
    const cq = this.compileData;
    const queueCount = q?.count ?? 0;
    const compileCount = cq?.count ?? 0;
    const active = !!q?.active_job || !!cq?.active_job;
    return {
      label: `${queueCount + compileCount}`,
      count: queueCount + compileCount,
      active,
      paused: !!q?.paused,
    };
  }

  private pageName(): string {
    switch (this.route.name) {
      case 'queue': return 'Jobs';
      case 'job': return 'Job detail';
      case 'settings': return 'Settings';
      case 'activity-log': return 'Activity';
      case 'secrets': return 'Secrets';
      case 'device': return 'Device';
      case 'device-config': return 'Configuration';
      case 'remote-wizard': return 'Add remote';
      default: return 'Network overview';
    }
  }

  render() {
    if (this.route.name === 'setup') {
      return html`<esp-setup-wizard></esp-setup-wizard>`;
    }

    const q = this.queueSummary();
    const bridgeState = !this.addonConnected ? 'offline' : this.bridgeConnected === false ? 'bridge-offline' : 'online';
    const statusText = !this.addonConnected
      ? 'Add-on unreachable'
      : bridgeState === 'bridge-offline'
        ? 'Bridge unreachable'
        : this.restartRequired
          ? 'Restart required'
          : this.bridgeConfigured === false
            ? 'No bridge configured'
            : 'Network connected';

    return html`
      <div class="app-shell">
        <div class="main-shell">
          <header class="topbar">
            <div class="topbar-title">
              <span class="topbar-kicker">ESP Tree</span>
              <span class="topbar-page">${this.pageName()}</span>
              ${this.bridgeLabel ? html`<span class="topbar-bridge">${this.bridgeLabel}</span>` : nothing}
            </div>

            <nav class="topnav" aria-label="Primary navigation">
              <button class="nav-item ${this.activeRoute() === 'network' ? 'active' : ''}" aria-current=${this.activeRoute() === 'network' ? 'page' : 'false'} @click=${() => this.navigate('/')}>
                ${NAV_ICONS.network}<span>Network</span>
              </button>
              <button class="nav-item ${this.activeRoute() === 'queue' ? 'active' : ''}" aria-current=${this.activeRoute() === 'queue' ? 'page' : 'false'} @click=${() => this.navigate('/queue')}>
                ${NAV_ICONS.jobs}<span>Jobs</span>${q.count > 0 ? html`<span class="nav-count ${q.active ? 'active' : ''}">${q.label}${q.paused ? html`<span class="pause-glyph"> paused</span>` : nothing}</span>` : nothing}
              </button>
              <button class="nav-item ${this.activeRoute() === 'activity' ? 'active' : ''}" aria-current=${this.activeRoute() === 'activity' ? 'page' : 'false'} @click=${() => this.navigate('/activity-log')}>
                ${NAV_ICONS.activity}<span>Activity</span>
              </button>
              <span class="nav-divider" aria-hidden="true"></span>
              <button class="nav-item ${this.activeRoute() === 'settings' ? 'active' : ''}" aria-current=${this.activeRoute() === 'settings' ? 'page' : 'false'} @click=${() => this.navigate('/settings')}>
                ${NAV_ICONS.settings}<span>Settings</span>
              </button>
              <button class="nav-item ${this.route.name === 'secrets' ? 'active' : ''}" aria-current=${this.route.name === 'secrets' ? 'page' : 'false'} @click=${() => this.navigate('/secrets')}>
                <span class="nav-icon text-icon" aria-hidden="true">↗</span><span>Secrets</span>
              </button>
            </nav>

            <div class="topbar-actions">
              <span class="connection-pill ${bridgeState === 'online' ? 'ok' : 'warn'}" role="status">
                <span class="status-dot ${bridgeState}" aria-hidden="true"></span>${statusText}
              </span>
              ${q.active ? html`
                <button class="job-pill" @click=${() => this.navigate('/queue')}>
                  <span class="pulse-dot"></span>${q.paused ? 'Queue paused' : 'Job running'}
                </button>
              ` : nothing}
              <span class="topbar-version">Add-on v${this.addonVersion || '—'}</span>
            </div>
          </header>

          ${!this.addonConnected ? html`
            <div class="connection-banner" role="alert">Cannot reach the add-on</div>
          ` : nothing}
          ${this.bridgeConnected === false ? html`
            <div class="connection-banner subtle" role="status">Bridge unreachable</div>
          ` : nothing}
          <main class="content">
            ${this.route.name === 'remote-wizard'
              ? html`<esp-remote-wizard></esp-remote-wizard>`
              : this.route.name === 'topology'
              ? html`<esp-topology-map @node-selected=${(event: CustomEvent<string>) => this.navigate(`/device/${encodeURIComponent(event.detail)}`)}></esp-topology-map>`
              : this.route.name === 'device'
                ? html`<esp-device-detail .mac=${this.route.mac}></esp-device-detail>`
                : this.route.name === 'device-config'
                  ? html`<esp-config-page .mac=${this.route.mac}></esp-config-page>`
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
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      --canvas: #f2f5f1;
      --surface: #ffffff;
      --surface-subtle: #f7faf6;
      --surface-raised: #ffffff;
      --ink: #17221f;
      --ink-2: #34433e;
      --muted: #5f6e68;
      --faint: #64726c;
      --line: #dfe6df;
      --line-strong: #cbd5cd;
      --primary: #1e5b4f;
      --primary-strong: #16483f;
      --primary-soft: #e8f1eb;
      --accent: #c88b27;
      --accent-soft: #fbf2df;
      --danger: #b63c43;
      --danger-soft: #fdf0f0;
      --ok: #2f7b58;
      --ok-soft: #eaf5ee;
      --info: #356f91;
      --info-soft: #edf4f7;
      --shadow-sm: 0 1px 2px rgba(19, 38, 32, 0.05), 0 1px 3px rgba(19, 38, 32, 0.03);
      --shadow-md: 0 8px 24px rgba(19, 38, 32, 0.07), 0 2px 6px rgba(19, 38, 32, 0.04);
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
      display: block;
      min-height: 100vh;
      background: var(--canvas);
      color: var(--ink);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
    }

    :host, :host * { box-sizing: border-box; }

    .app-shell {
      display: block;
      min-height: 100vh;
    }

    .topnav {
      display: flex;
      align-items: center;
      gap: 2px;
      min-width: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .topnav::-webkit-scrollbar { display: none; }
    .nav-divider { width: 1px; height: 20px; flex: 0 0 1px; margin: 0 6px; background: var(--line); }

    .nav-item {
      width: auto;
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 7px;
      min-height: 32px;
      padding: 0 11px;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: var(--muted);
      font: inherit;
      font-size: 12.5px;
      font-weight: 600;
      text-align: left;
      white-space: nowrap;
      cursor: pointer;
      transition: background .15s ease, color .15s ease;
    }

    .nav-item:hover { background: var(--surface-subtle); color: var(--ink); }
    .nav-item:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .nav-item.active {
      background: var(--surface-subtle);
      color: var(--ink);
      box-shadow: inset 0 -2px 0 var(--accent);
    }

    .nav-item svg {
      width: 15px;
      height: 15px;
      flex: 0 0 15px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.55;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: .9;
    }

    .text-icon { width: 15px; flex: 0 0 15px; font-size: 15px; line-height: 1; text-align: center; color: var(--faint); }

    .nav-count {
      margin-left: 2px;
      min-width: 18px;
      padding: 2px 6px;
      border-radius: 999px;
      background: var(--line);
      color: var(--ink-2);
      font-size: 10px;
      font-weight: 700;
      text-align: center;
      line-height: 1.25;
    }
    .nav-count.active { background: var(--accent); color: #1c2420; }
    .pause-glyph { font-size: 9px; font-weight: 600; opacity: .85; }

    .status-dot { width: 7px; height: 7px; flex: 0 0 7px; border-radius: 50%; background: var(--faint); margin-top: 5px; }
    .status-dot.online { background: #66ba7e; box-shadow: 0 0 0 3px rgba(102,186,126,.13); }
    .status-dot.bridge-offline, .status-dot.offline { background: var(--danger); }
    .status-dot.warn { background: var(--accent); }

    .connection-banner {
      margin: 14px auto 0;
      max-width: 1440px;
      padding: 9px 14px;
      border: 1px solid #eab8b8;
      border-radius: 8px;
      background: var(--danger-soft);
      color: #8a2c2c;
      font-size: 12px;
      line-height: 1.4;
    }
    .connection-banner.subtle { border-color: #ead8b1; background: var(--accent-soft); color: #7c5716; }

    .main-shell { min-width: 0; flex: 1; display: flex; flex-direction: column; }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      min-height: 62px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 30px;
      background: rgba(255,255,255,.92);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(8px);
    }

    .topbar-title { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
    .topbar-kicker { color: var(--faint); font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; }
    .topbar-page { color: var(--ink); font-size: 13px; font-weight: 650; white-space: nowrap; }
    .topbar-bridge {
      color: var(--muted);
      font-size: 12px;
      font-weight: 500;
      padding-left: 10px;
      border-left: 1px solid var(--line);
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .topbar-version { color: var(--faint); font-family: var(--font-mono); font-size: 10px; letter-spacing: .02em; white-space: nowrap; }

    .topbar-actions { display: flex; align-items: center; gap: 9px; min-width: 0; }
    .connection-pill, .job-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      min-height: 28px;
      padding: 0 10px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--surface-subtle);
      color: var(--muted);
      font: inherit;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
    .connection-pill.ok { color: var(--ok); border-color: #cfe5d5; background: var(--ok-soft); }
    .connection-pill.warn { color: #8c6419; border-color: #ead8b1; background: var(--accent-soft); }
    .connection-pill .status-dot { margin-top: 0; width: 6px; height: 6px; flex-basis: 6px; }
    .job-pill { background: var(--primary); border-color: var(--primary); color: #fff; cursor: pointer; }
    .job-pill:hover { background: var(--primary-strong); }
    .job-pill:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: #bce7c9; box-shadow: 0 0 0 3px rgba(188,231,201,.15); }

    .content { width: 100%; max-width: 1440px; margin: 0 auto; padding: 30px 32px 56px; }

    @media (max-width: 980px) {
      .content { padding: 24px 22px 48px; }
      .topbar { padding: 0 22px; gap: 12px; }
      .topbar-kicker { display: none; }
      .topbar-bridge { max-width: 140px; }
      .nav-item { padding: 0 9px; font-size: 12px; }
    }

    @media (max-width: 760px) {
      .topbar {
        min-height: 52px;
        padding: 8px 14px;
        gap: 10px;
        flex-wrap: wrap;
      }
      .topbar-title { order: 1; }
      .topbar-actions { order: 2; margin-left: auto; }
      .topnav { order: 3; width: 100%; padding-bottom: 2px; }
      .topbar-bridge { display: none; }
      .topbar-page { font-size: 12px; }
      .nav-item { min-height: 32px; padding: 0 9px; gap: 6px; font-size: 12px; }
      .nav-item svg { width: 14px; height: 14px; flex-basis: 14px; }
      .nav-item.active { box-shadow: inset 0 -2px 0 var(--accent); }
      .nav-count { margin-left: 2px; }
      .connection-pill { font-size: 10px; padding: 0 8px; }
      .job-pill { display: none; }
      .topbar-version { display: none; }
      .connection-banner { margin: 10px 14px 0; }
      .content { padding: 20px 14px 40px; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
    }
  `;
}
