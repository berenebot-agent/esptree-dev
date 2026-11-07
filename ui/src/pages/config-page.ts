import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../components/config-editor';
import '../components/compile-log-viewer';
import { hasEspTreeExternalComponents } from '../components/config-editor';
import { api, CompileStatusResponse, DeviceConfig, normalizeMac, PreflightComparison } from '../api/client';
import { chipFamilyFromName, openInstallDialog, usbFlashSupported } from '../lib/browser-flash';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';

type PageState = 'loading' | 'no_config' | 'editor';
type CompilePhase = 'idle' | 'compile_queued' | 'compiling' | 'compiled' | 'failed' | 'queued_for_flash';
type FlashIntent = 'none' | 'ota' | 'browser';
const FLASH_STATUSES = new Set(['queued', 'starting', 'announcing', 'transferring', 'verifying', 'transfer_success_waiting_rejoin']);
const FLASH_TERMINAL_STATUSES = new Set(['success', 'failed', 'aborted', 'rejoin_timeout', 'version_mismatch']);

function chipFamilyFromYaml(yaml: string): string | null {
  const text = yaml || '';
  if (/^\s*esp8266\s*:/m.test(text)) return 'ESP8266';
  if (!/^\s*esp32\s*:/m.test(text)) return null;
  const variantMatch = text.match(/^\s*variant\s*:\s*["']?([A-Za-z0-9_-]+)["']?\s*$/m);
  const variant = (variantMatch?.[1] || '').toUpperCase().replace(/_/g, '-');
  if (!variant) return 'ESP32';
  if (variant.includes('ESP32-C61')) return 'ESP32-C61';
  if (variant.includes('ESP32-C6')) return 'ESP32-C6';
  if (variant.includes('ESP32-C5')) return 'ESP32-C5';
  if (variant.includes('ESP32-C3')) return 'ESP32-C3';
  if (variant.includes('ESP32-C2')) return 'ESP32-C2';
  if (variant.includes('ESP32-H2')) return 'ESP32-H2';
  if (variant.includes('ESP32-P4')) return 'ESP32-P4';
  if (variant.includes('ESP32-S3')) return 'ESP32-S3';
  if (variant.includes('ESP32-S2')) return 'ESP32-S2';
  return 'ESP32';
}

@customElement('esp-config-page')
export class EspConfigPage extends LitElement {
  @property({ type: String }) mac = '';
  @state() private state: PageState = 'loading';
  @state() private device: Record<string, unknown> | null = null;
  @state() private config: DeviceConfig | null = null;
  @state() private editorContent = '';
  @state() private saveIndicator = '';
  @state() private hasUnsavedChanges = false;
  @state() private error = '';
  @state() private compilePhase: CompilePhase = 'idle';
  @state() private topology: { mac: string; online?: boolean }[] = [];
  @state() private compileJobId: number | null = null;
  @state() private compileQueuePosition: number | null = null;
  @state() private preflight: PreflightComparison | null = null;
  @state() private chipUnknown = false;
  @state() private yamlWarnings: string[] = [];
  @state() private showExternalComponentsFix = false;
  @state() private showSecretsWarning = false;
  @state() private missingSecrets: string[] = [];
  private pendingAction: 'save' | 'compile' | null = null;
  private pendingAutoFlash = false;
  @state() private showCompileLog = true;
  @state() private compileStartedAt: number | null = null;
  @state() private flashIntent: FlashIntent = 'none';
  @state() private browserFlashManifestUrl = '';
  @state() private browserFlashError = '';
  @state() private browserFlashOpen = false;
  private browserFlashFirmwareBlobUrl = '';
  private elapsedTimer: ReturnType<typeof setInterval> | null = null;
  @query('esp-compile-log-viewer') private compileLogViewer!: HTMLElement | null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private devicePollTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    void this.load();
  }

  disconnectedCallback(): void {
    this.stopPolling();
    this.stopDevicePolling();
    super.disconnectedCallback();
  }

  private startPolling(): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(() => this.pollCompileStatus(), 2000);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private stopCompileLogViewer(): void {
    if (this.compileLogViewer) {
      (this.compileLogViewer as any).stopped = true;
    }
  }

  private startDevicePolling(): void {
    if (this.devicePollTimer) return;
    this.devicePollTimer = setInterval(() => void this.pollDevice(), 30_000);
  }

  private stopDevicePolling(): void {
    if (this.devicePollTimer) {
      clearInterval(this.devicePollTimer);
      this.devicePollTimer = null;
    }
  }

  private async pollDevice(): Promise<void> {
    try {
      const dev = await api.device(this.mac);
      this.device = dev || {};
    } catch {
      // ignore poll errors
    }
  }

  private get isCompilingActive(): boolean {
    return this.compilePhase === 'compiling' || this.compilePhase === 'compile_queued';
  }

  private get browserSupportsUsbFlash(): boolean {
    return usbFlashSupported();
  }

  private get browserFlashChipFamily(): string | null {
    const chipName = String(this.preflight?.chip.new || this.device?.chip_name || '');
    return chipFamilyFromYaml(this.editorContent) || chipFamilyFromName(chipName);
  }

  private getElapsedTime(): string {
    if (!this.compileStartedAt) return '00:00';
    const elapsed = Math.floor((Date.now() - this.compileStartedAt) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  private startElapsedTimer(): void {
    this.stopElapsedTimer();
    this.elapsedTimer = setInterval(() => this.requestUpdate(), 1000);
  }

  private stopElapsedTimer(): void {
    if (this.elapsedTimer) {
      clearInterval(this.elapsedTimer);
      this.elapsedTimer = null;
    }
  }

  private async load(): Promise<void> {
    this.state = 'loading';
    try {
      const [dev, configData, topology] = await Promise.all([
        api.device(this.mac).catch(() => null),
        api.getConfig(this.mac).catch(() => null),
        api.topology().catch(() => []),
      ]);
      this.device = dev || {};
      this.topology = topology;
      this.startDevicePolling();
      if (configData && (configData as DeviceConfig).has_config) {
        this.config = configData as DeviceConfig;
        this.editorContent = this.config.content;
        this.hasUnsavedChanges = false;
        this.state = 'editor';
      } else {
        this.state = 'no_config';
      }
      await this.pollCompileStatus();
    } catch {
      this.state = 'no_config';
    }
  }

  private clearBrowserFlashManifestUrl(): void {
    if (this.browserFlashManifestUrl) {
      URL.revokeObjectURL(this.browserFlashManifestUrl);
      this.browserFlashManifestUrl = '';
    }
    if (this.browserFlashFirmwareBlobUrl) {
      URL.revokeObjectURL(this.browserFlashFirmwareBlobUrl);
      this.browserFlashFirmwareBlobUrl = '';
    }
  }

  private async updateBrowserFlashManifestUrl(): Promise<void> {
    if (this.compilePhase !== 'compiled') return;
    const chipFamily = this.browserFlashChipFamily;
    if (!chipFamily) {
      this.clearBrowserFlashManifestUrl();
      return;
    }
    try {
      const downloadUrl = api.downloadFactoryBinary(this.mac);
      const resp = await fetch(downloadUrl);
      if (!resp.ok) {
        this.clearBrowserFlashManifestUrl();
        return;
      }
      const firmwareBlob = await resp.blob();
      const newFirmwareBlobUrl = URL.createObjectURL(firmwareBlob);
      const manifest = {
        name: String(this.device?.esphome_name || this.device?.label || this.mac),
        version: String(this.device?.project_version || this.device?.firmware_version || 'compiled'),
        // No erase prompt: this is a factory image reflashed from the device's own
        // page, and the dialog's "Erase device?" step is a second question for a
        // decision the user already made by pressing Compile and Flash. The dialog
        // erases without asking when this is false and the device has no Improv.
        new_install_prompt_erase: false,
        // The firmware implements no Improv (no `improv_serial:` anywhere in
        // device_code/), so the dialog's post-write Improv probe can only ever time
        // out. 0 skips it instead of stalling for the 10 s default.
        new_install_improv_wait_time: 0,
        builds: [
          {
            chipFamily,
            parts: [{ path: newFirmwareBlobUrl, offset: 0 }],
          },
        ],
      };
      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const newManifestUrl = URL.createObjectURL(manifestBlob);
      this.clearBrowserFlashManifestUrl();
      this.browserFlashManifestUrl = newManifestUrl;
      this.browserFlashFirmwareBlobUrl = newFirmwareBlobUrl;
    } catch {
      this.clearBrowserFlashManifestUrl();
    }
  }

  private async pollCompileStatus(): Promise<void> {
    try {
      const status: CompileStatusResponse = await api.getCompileStatus(this.mac);
      if (status.status === 'compile_queued') {
        this.compilePhase = 'compile_queued';
        this.compileJobId = status.job_id;
        this.compileQueuePosition = status.queue_position;
        this.startPolling();
      } else if (status.status === 'compiling') {
        this.compilePhase = 'compiling';
        this.compileJobId = status.job_id;
        this.compileQueuePosition = null;
        this.startPolling();
      } else if (FLASH_STATUSES.has(status.status)) {
        this.compilePhase = 'queued_for_flash';
        this.compileJobId = status.job_id;
        this.compileQueuePosition = status.queue_position;
        this.flashIntent = 'ota';
        this.startPolling();
        window.location.hash = `/device/${encodeURIComponent(this.mac)}`;
      } else if (status.status === 'compiled') {
        this.compilePhase = 'compiled';
        this.compileJobId = status.job_id;
        this.compileQueuePosition = null;
        this.stopElapsedTimer();
        this.updateBrowserFlashManifestUrl();
        this.stopPolling();
        if (this.flashIntent === 'ota') {
          window.location.hash = `/device/${encodeURIComponent(this.mac)}`;
        }
      } else if (FLASH_TERMINAL_STATUSES.has(status.status)) {
        this.compilePhase = 'idle';
        this.compileJobId = null;
        this.compileQueuePosition = null;
        this.compileStartedAt = null;
        this.flashIntent = 'none';
        this.clearBrowserFlashManifestUrl();
        this.stopElapsedTimer();
        this.stopPolling();
        this.stopCompileLogViewer();
      }
    } catch {
      // ignore poll errors
    }
  }

  private async createScaffold(): Promise<void> {
    try {
      const result = await api.saveConfig(this.mac, '', true);
      this.config = result;
      this.editorContent = result.content;
      this.chipUnknown = result.chip_unknown ?? false;
      this.state = 'editor';
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  private async importYaml(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yaml,.yml';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const result = await api.importConfig(this.mac, file);
        this.config = result;
        this.editorContent = result.content;
        this.state = 'editor';
      } catch (err) {
        this.error = err instanceof Error ? err.message : String(err);
      }
    };
    input.click();
  }

  private async saveConfig(bypassCheck = false): Promise<void> {
    if (!bypassCheck && !hasEspTreeExternalComponents(this.editorContent)) {
      this.pendingAction = 'save';
      this.showExternalComponentsFix = true;
      return;
    }
    this.saveIndicator = 'Saving...';
    try {
      const result = await api.saveConfig(this.mac, this.editorContent);
      this.config = result;
      this.hasUnsavedChanges = false;
      this.saveIndicator = 'Saved';
      setTimeout(() => { this.saveIndicator = ''; this.requestUpdate(); }, 2000);
    } catch (err) {
      this.saveIndicator = '';
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  private onEditorChange(e: CustomEvent): void {
    const detail = e.detail as { content: string; warnings?: string[] };
    this.editorContent = detail.content;
    this.yamlWarnings = detail.warnings ?? [];
    this.hasUnsavedChanges = this.config ? this.editorContent !== this.config.content : true;
  }

  private get isBridgeDevice(): boolean {
    return Boolean((this.device as { is_bridge?: boolean })?.is_bridge);
  }

  private get isEsp8266Device(): boolean {
    const chipName = String(this.device?.chip_name ?? '');
    return chipName === 'ESP8266' || chipName === 'ESP-01' || chipName === 'ESP-12E';
  }

  private get remoteComponentName(): string {
    if (this.isBridgeDevice) return 'esp_tree_bridge';
    if (this.isEsp8266Device) return 'espnow_82xx_remote';
    return 'esp_tree_remote';
  }

  private get externalComponentsFixYaml(): string {
    const component = this.remoteComponentName;
    return `external_components:\n  - source:\n      type: local\n      path: /opt/esp-tree/components\n    components: [${component}, esp_tree_common]`;
  }

  private insertExternalComponentsFix(): void {
    const component = this.remoteComponentName;
    const block = `\nexternal_components:\n  - source:\n      type: local\n      path: /opt/esp-tree/components\n    components: [${component}, esp_tree_common]\n`;
    let text = this.editorContent;

    text = this.removeExternalComponentsBlock(text);

    const lines = text.split('\n');
    let insertIdx = this.findBlockEnd(lines, /^esphome:\s*$/);
    if (insertIdx < 0) insertIdx = 0;

    const chipEnd = this.findBlockEnd(lines, /^(esp32|esp8266):\s*$/, insertIdx);
    if (chipEnd > insertIdx) insertIdx = chipEnd;

    while (insertIdx < lines.length && lines[insertIdx].trim() === '') insertIdx++;
    lines.splice(insertIdx, 0, ...block.split('\n'));
    this.editorContent = lines.join('\n');
  }

  private removeExternalComponentsBlock(text: string): string {
    const lines = text.split('\n');
    const startIdx = lines.findIndex((l) => /^external_components:\s*$/.test(l));
    if (startIdx < 0) return text;
    let endIdx = startIdx + 1;
    while (endIdx < lines.length && (lines[endIdx].startsWith(' ') || lines[endIdx].startsWith('\t') || lines[endIdx].trim() === '')) {
      if (lines[endIdx].trim() === '' && endIdx + 1 < lines.length && !lines[endIdx + 1].startsWith(' ') && !lines[endIdx + 1].startsWith('\t')) break;
      endIdx++;
    }
    while (endIdx < lines.length && lines[endIdx].trim() === '') endIdx++;
    lines.splice(startIdx, endIdx - startIdx);
    return lines.join('\n');
  }

  private findBlockEnd(lines: string[], headerRe: RegExp, searchFrom = 0): number {
    const start = lines.findIndex((l, i) => i >= searchFrom && headerRe.test(l));
    if (start < 0) return -1;
    let end = start + 1;
    while (end < lines.length && (lines[end].startsWith(' ') || lines[end].startsWith('\t'))) end++;
    return end;
  }

  private async applyExternalComponentsFix(): Promise<void> {
    this.showExternalComponentsFix = false;
    this.insertExternalComponentsFix();
    this.yamlWarnings = [];
    this.hasUnsavedChanges = true;
    this.requestUpdate();
    const action = this.pendingAction;
    const autoFlash = this.pendingAutoFlash;
    this.pendingAction = null;
    this.pendingAutoFlash = false;
    if (action === 'save') {
      await this.saveConfig(true);
    } else if (action === 'compile') {
      await this.queueCompile(autoFlash, true);
    }
  }

  private async dismissExternalComponentsFix(): Promise<void> {
    this.showExternalComponentsFix = false;
    const action = this.pendingAction;
    const autoFlash = this.pendingAutoFlash;
    this.pendingAction = null;
    this.pendingAutoFlash = false;
    if (action === 'save') {
      await this.saveConfig(true);
    } else if (action === 'compile') {
      await this.queueCompile(autoFlash, true);
    }
  }

  private async dismissSecretsWarning(): Promise<void> {
    this.showSecretsWarning = false;
    const action = this.pendingAction;
    const autoFlash = this.pendingAutoFlash;
    this.pendingAction = null;
    this.pendingAutoFlash = false;
    if (action === 'compile') {
      await this.queueCompile(autoFlash, true);
    }
  }

  private goToSecretsFromWarning(): void {
    this.showSecretsWarning = false;
    this.goToSecrets();
  }

  private async checkForMissingSecrets(): Promise<string[]> {
    try {
      const result = await api.checkSecrets(this.editorContent);
      return result.missing_secrets;
    } catch {
      return [];
    }
  }

  private async queueCompile(autoFlash: boolean, bypassCheck = false): Promise<void> {
    if (this.compilePhase === 'compiling' || this.compilePhase === 'compile_queued') return;
    if (!bypassCheck) {
      const missing = await this.checkForMissingSecrets();
      if (missing.length > 0) {
        this.missingSecrets = missing;
        this.pendingAction = 'compile';
        this.pendingAutoFlash = autoFlash;
        this.showSecretsWarning = true;
        return;
      }
    }
    if (!bypassCheck && !hasEspTreeExternalComponents(this.editorContent)) {
      this.pendingAction = 'compile';
      this.pendingAutoFlash = autoFlash;
      this.showExternalComponentsFix = true;
      return;
    }
    if (this.hasUnsavedChanges) {
      await this.saveConfig(true);
    }
    this.compilePhase = 'compiling';
    this.compileStartedAt = Date.now();
    this.startElapsedTimer();
    this.error = '';
    this.showCompileLog = true;

    try {
      const result = await api.compileDevice(this.mac, autoFlash);
      this.compileJobId = result.job.id;
      this.preflight = result.preflight || null;
      if (result.job.status === 'compile_queued') {
        this.compilePhase = 'compile_queued';
        this.compileQueuePosition = result.queue_position;
      } else if (result.job.status === 'compiling') {
        this.compilePhase = 'compiling';
        this.compileQueuePosition = null;
      }
      this.startPolling();
    } catch (err) {
      this.compilePhase = 'failed';
      this.compileStartedAt = null;
      this.stopElapsedTimer();
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  private async triggerCompile(): Promise<void> {
    this.flashIntent = 'none';
    await this.queueCompile(false);
  }

  private async triggerOtaFlash(): Promise<void> {
    this.flashIntent = 'ota';
    await this.queueCompile(true);
  }

  private async triggerBrowserFlashFlow(): Promise<void> {
    this.flashIntent = 'browser';
    await this.queueCompile(false);
  }

  /**
   * Open the install dialog against this page's compiled factory image.
   *
   * Called from a click so the requestPort() fallback still has its user activation;
   * when the chip was already detected earlier in the session the port is passed
   * straight in and the browser shows no second chooser.
   */
  private async openBrowserFlash(): Promise<void> {
    if (!this.browserFlashManifestUrl) return;
    this.browserFlashError = '';
    try {
      const result = await openInstallDialog({
        manifestUrl: this.browserFlashManifestUrl,
        onClosed: () => this.onBrowserFlashClosed(),
      });
      if (result === 'cancelled') {
        this.browserFlashError = 'No USB device was selected.';
        return;
      }
      this.browserFlashOpen = true;
    } catch (err) {
      this.browserFlashError = err instanceof Error ? err.message : String(err);
    }
  }

  private onBrowserFlashClosed(): void {
    this.browserFlashOpen = false;
  }

  private async cancelCompile(): Promise<void> {
    try {
      await api.cancelCompile(this.mac);
    } catch {
      // no active job to cancel — fall through to local reset
    }
    this.compilePhase = 'idle';
    this.compileJobId = null;
    this.compileQueuePosition = null;
    this.compileStartedAt = null;
    this.flashIntent = 'none';
    this.clearBrowserFlashManifestUrl();
    this.stopElapsedTimer();
    this.stopPolling();
  }

  private goToSecrets(): void {
    window.location.hash = `/secrets?from=${encodeURIComponent(window.location.hash)}`;
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (
      changedProperties.has('compilePhase') ||
      changedProperties.has('device') ||
      changedProperties.has('preflight')
    ) {
      void this.updateBrowserFlashManifestUrl();
    }
  }

  render() {
    const esphomeName = String(this.device?.esphome_name || this.device?.label || this.mac);
    const chipName = String(this.device?.chip_name || '-');
    const topologyNode = this.topology.find((n) => normalizeMac(n.mac) === normalizeMac(this.mac));
    const online = topologyNode?.online ?? Boolean(this.device?.online);
    const dev = this.device as { is_bridge?: boolean; hops?: number };
    const isBridge = Boolean(dev?.is_bridge);
    const isRemote = !isBridge && (dev?.hops ?? 0) > 0;
    const chipFamily = this.browserFlashChipFamily;
    const showBrowserFlashInstall = this.compilePhase === 'compiled' && !!this.browserFlashManifestUrl;

    return html`
      <div class="config-page" data-job-id=${this.compileJobId ?? ''}>
        ${this.showExternalComponentsFix
          ? html`
              <div class="ec-fix-backdrop" @click=${this.dismissExternalComponentsFix}>
                <div class="ec-fix-modal" @click=${(e: Event) => e.stopPropagation()}>
                  <h3>Add ESP Tree's external components?</h3>
                  <p>This YAML is missing the <code>external_components</code> block that ESP Tree remotes need to compile:</p>
                  <pre class="ec-fix-snippet">${this.externalComponentsFixYaml}</pre>

                  <div class="ec-fix-actions">
                    <button class="btn primary" @click=${this.applyExternalComponentsFix}>Add the block</button>
                    <button class="btn" @click=${this.dismissExternalComponentsFix}>Cancel</button>
                  </div>
                </div>
              </div>
            `
          : nothing}
        ${this.showSecretsWarning
          ? html`
              <div class="ec-fix-backdrop" @click=${this.dismissSecretsWarning}>
                <div class="ec-fix-modal" @click=${(e: Event) => e.stopPropagation()}>
                  <h3>Some secrets are missing</h3>
                  <p>This YAML references secrets that aren't defined in secrets.yaml, so the build will fail:</p>
                  <ul class="missing-secrets-list">
                    ${this.missingSecrets.map((s) => html`<li><code>!secret ${s}</code></li>`)}
                  </ul>

                  <div class="ec-fix-actions">
                    <button class="btn" @click=${this.dismissSecretsWarning}>Compile anyway</button>
                    <button class="btn primary" @click=${this.goToSecretsFromWarning}>${icon('key')}Edit secrets</button>
                  </div>
                </div>
              </div>
            `
          : nothing}
        <div>
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="#/">Network</a>${icon('chevronRight')}
            <a href=${`#/device/${encodeURIComponent(this.mac)}`}>${esphomeName}</a>${icon('chevronRight')}
            <span aria-current="page">YAML</span>
          </nav>
          <div class="page-head">
            <div>
              <h1>${esphomeName}</h1>
              <p class="sub meta">
                <span class="chip ${online ? 'ok' : 'danger'}"><span class="dot ${online ? 'ok' : 'danger'}"></span>${online ? 'Online' : 'Offline'}</span>
                <span>${isRemote ? 'Remote' : isBridge ? 'Bridge' : 'Device'}</span>
                <span class="mono">${this.mac}</span>
                <span>${chipName}</span>
              </p>
            </div>
            <div class="page-actions">
              <button class="btn" @click=${this.goToSecrets}>${icon('key')}Secrets</button>
            </div>
          </div>
        </div>

        ${this.state === 'loading'
          ? html`<div class="card loading"><span class="spinner"></span>Loading configuration…</div>`
          : this.state === 'no_config'
            ? html`
                <div class="card no-config empty">
                  ${this.chipUnknown ? html`
                    <div class="chip-error-banner">
                      ${icon('alert')}<span>This remote reported a chip type ESP Tree can't build for. Check the chip before compiling.</span>
                      <button class="btn sm icon text" aria-label="Dismiss" @click=${() => { this.chipUnknown = false; }}>${icon('close')}</button>
                    </div>
                  ` : nothing}
                  ${icon('code')}
                  <strong>No YAML for this remote yet</strong>
                  <p>Start from a scaffold filled in from what the bridge knows about this remote, or import an existing ESPHome YAML file.</p>
                  <div class="no-config-actions">
                    <button class="btn primary" @click=${this.createScaffold}>Create from scaffold</button>
                    <button class="btn" @click=${this.importYaml}>${icon('upload')}Import YAML</button>
                  </div>
                  ${this.error ? html`<p class="error">${this.error}</p>` : nothing}
                </div>
              `
: this.state === 'editor'
                ? html`
                    <div class="main-content">
                    ${!this.isCompilingActive
                      ? html`
                          <esp-config-editor
                            .value=${this.editorContent}
                            .readonly=${false}
                            @content-change=${this.onEditorChange}
                          ></esp-config-editor>

                          ${this.yamlWarnings.length > 0
                            ? html`<div class="notice warn yaml-warnings">${icon('alert')}<div>${this.yamlWarnings.map((w) => html`<p>${w}</p>`)}</div></div>`
                            : nothing}
                        `
                      : html`
                          <div class="compile-focus-view">
                            <div class="compile-status-header">
                              <span class="spinner"></span>
                              <span>${this.compilePhase === 'compile_queued'
                                ? `Queued at position ${this.compileQueuePosition !== null ? this.compileQueuePosition : '?'}`
                                : 'Building firmware…'}</span>
                              <span class="compile-elapsed">${this.getElapsedTime()}</span>
                            </div>
                            <esp-compile-log-viewer
                              .mac=${this.mac}
                              .visible=${true}
                              class="expanded-log"
                            ></esp-compile-log-viewer>
                          </div>
                        `
                    }
                    </div>

                    <esp-compile-log-viewer
                      .mac=${this.mac}
                      .visible=${(this.compilePhase === 'queued_for_flash' || this.compilePhase === 'failed') && this.showCompileLog}
                      class="bottom-log"
                    ></esp-compile-log-viewer>

                    ${this.compilePhase === 'compile_queued'
                    ? html`
                        <div class="notice warn queue-banner">
                          ${icon('clock')}<span><strong>Build queued</strong> · position ${this.compileQueuePosition !== null ? this.compileQueuePosition : '?'}. It starts when the current build finishes.</span>
                          <span class="notice-actions"><button class="btn sm" @click=${this.cancelCompile}>Cancel build</button></span>
                        </div>
                      `
                    : nothing}

                  <div class="action-bar">
                    <span class="save-state ${this.hasUnsavedChanges ? 'dirty' : ''}" aria-live="polite">
                      ${this.compilePhase === 'compiling'
                        ? html`<span class="spinner"></span>Building…`
                        : this.compilePhase === 'compile_queued'
                          ? html`Build queued (#${this.compileQueuePosition !== null ? this.compileQueuePosition : '?'})`
                          : this.compilePhase === 'queued_for_flash'
                            ? html`Upload queued or running${this.compileQueuePosition !== null ? ` (#${this.compileQueuePosition})` : ''}`
                            : this.saveIndicator || (this.hasUnsavedChanges ? 'Unsaved changes' : html`${icon('check')}Saved`)}
                    </span>
                    <span class="bar-actions">
                      <button class="btn" @click=${this.saveConfig} ?disabled=${!this.hasUnsavedChanges || this.compilePhase === 'compiling' || this.compilePhase === 'compile_queued'}>Save</button>
                      ${this.compilePhase === 'idle' || this.compilePhase === 'failed' || this.compilePhase === 'compiled'
                        ? html`
                            <button class="btn" ?disabled=${!this.config} @click=${this.triggerCompile}>${icon('build')}Compile</button>
                            <button class="btn" ?disabled=${!this.config} @click=${this.triggerBrowserFlashFlow} title="Compile, then flash a board plugged into this computer">${icon('usb')}Compile &amp; flash by USB</button>
                            <button class="btn primary" ?disabled=${!this.config} @click=${this.triggerOtaFlash} title="Compile, then upload over the ESP-NOW mesh">${icon('upload')}Compile &amp; install</button>
                          `
                        : this.compilePhase === 'compiling' || this.compilePhase === 'compile_queued'
                          ? html`<button class="btn danger" @click=${this.cancelCompile}>Cancel build</button>`
                          : nothing}
                    </span>
                  </div>

                  <div class="browser-flash-panel">
                    ${showBrowserFlashInstall
                      ? html`
                          <div class="browser-flash-actions">
                            <button
                              class="btn primary"
                              ?disabled=${this.browserFlashOpen}
                              @click=${this.openBrowserFlash}
                            >
                              ${icon('usb')}${this.browserFlashOpen ? 'Flashing…' : 'Flash by USB now'}
                            </button>
                            <a class="btn" href=${api.downloadFactoryBinary(this.mac)} download>Download factory .bin</a>
                          </div>
                          ${this.browserFlashError
                            ? html`<p class="browser-flash-error">${this.browserFlashError}</p>`
                            : nothing}
                        `
                      : html`
                          <div class="browser-flash-hint hint">
                            ${this.compilePhase === 'compiled' && !chipFamily
                              ? html`<p>Browser USB flash is unavailable because the chip family could not be determined for this build.</p>`
                              : !this.browserSupportsUsbFlash
                                ? html`<p>Browser USB flash requires Chrome or Edge with Web Serial on an HTTPS page.</p>`
                                : html`<p>USB flashing becomes available here after a successful build.</p>`}
                            <a class="btn" href=${api.downloadFactoryBinary(this.mac)} download ?hidden=${this.compilePhase !== 'compiled'}>Download factory .bin</a>
                          </div>
                        `}
                  </div>

                  ${this.error && this.compilePhase !== 'compiling'
                    ? html`<div class="notice danger" role="alert">${icon('alert')}<span>${this.error}</span></div>`
                    : nothing}

                  ${this.compilePhase === 'compiled'
                    ? html`
                        <div class="success-section">
                          <div class="success-banner">${icon('checkCircle')}<strong>Build succeeded</strong><span class="build-info">${esphomeName} is ready to install</span></div>
                          ${this.preflight?.has_warnings
                            ? html`
                                <div class="warnings">
                                  ${this.preflight!.warnings.map((w) => html`<p>${w}</p>`)}
                                </div>
                              `
                            : nothing}
                          ${this.flashIntent === 'browser'
                            ? html`<p class="hint">Build complete. Connect the device by USB and use the browser flash control above.</p>`
                            : html`<p class="hint">Install it over the air or by USB from the buttons above, or download the binaries.</p>`}
                          <div class="download-links">
                            <a class="btn" href=${api.downloadFactoryBinary(this.mac)} download>Download .bin</a>
                            <a class="btn" href=${api.downloadCompileBinary(this.mac)} download>Download .ota.bin</a>
                          </div>
                        </div>
                      `
                    : nothing}

                  ${this.compilePhase === 'failed'
                    ? html`
                        <div class="fail-section">
                          <div class="fail-banner">
                            <span class="fail-title">${icon('alert')}Build failed</span>
                            ${this.showCompileLog ? html`<button class="close-logs-link" @click=${() => { this.showCompileLog = false; }}>Hide logs</button>` : html`<button class="close-logs-link" @click=${() => { this.showCompileLog = true; }}>Show logs</button>`}
                          </div>
                          <p class="hint">Check the log for the first error, fix the YAML above, then compile again.</p>
                        </div>
                      `
                    : nothing}
                `
              : nothing}
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .config-page { display: grid; gap: 16px; }
    .config-page > *, .main-content > * { min-width: 0; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; }
    .page-actions .btn svg, .bar-actions .btn svg, .no-config .btn svg, .ec-fix-actions .btn svg, .browser-flash-actions .btn svg { width: 18px; height: 18px; }
    .loading { display: flex; align-items: center; gap: 12px; padding: 24px 16px; color: var(--muted); }

    .no-config { padding: 48px 16px; }
    .no-config-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 10px; }
    .chip-error-banner {
      display: flex; align-items: center; gap: 10px; width: 100%; max-width: 640px;
      padding: 10px 12px; border-radius: var(--radius-md); background: var(--accent-soft); color: var(--ink); text-align: left;
    }
    .chip-error-banner > svg { width: 20px; height: 20px; color: var(--accent); flex: none; margin: 0; }
    .chip-error-banner span { flex: 1; }

    .main-content { display: grid; gap: 12px; }
    .yaml-warnings p + p { margin-top: 4px; }
    .compile-focus-view { display: grid; gap: 10px; }
    .compile-status-header { display: flex; align-items: center; gap: 10px; font-weight: 500; }
    .compile-elapsed { margin-left: auto; color: var(--muted); font-variant-numeric: tabular-nums; font-weight: 400; }
    .expanded-log { min-height: 420px; }

    .action-bar {
      position: sticky;
      bottom: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      padding: 12px 16px;
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      background: var(--surface);
      box-shadow: var(--shadow-sm);
    }
    .save-state { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-size: var(--text-sm); }
    .save-state svg { width: 16px; height: 16px; color: var(--ok); }
    .save-state.dirty { color: var(--accent); font-weight: 500; }
    .save-state .spinner { width: 14px; height: 14px; }
    .bar-actions { display: flex; flex-wrap: wrap; gap: 8px; }

    .browser-flash-panel:empty { display: none; }
    .browser-flash-hint { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .browser-flash-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .browser-flash-error { color: var(--danger); margin-top: 8px; }

    .success-section, .fail-section { display: grid; gap: 10px; padding: 14px 16px; border-radius: var(--radius-lg); }
    .success-section { background: var(--ok-soft); }
    .fail-section { background: var(--danger-soft); }
    .success-banner { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; color: var(--ok); }
    .success-banner svg { width: 22px; height: 22px; }
    .success-banner strong { font-weight: 500; }
    .build-info { color: var(--ink-2); }
    .warnings { display: grid; gap: 4px; color: var(--accent); }
    .download-links { display: flex; gap: 8px; flex-wrap: wrap; }
    .fail-banner { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .fail-title { display: inline-flex; align-items: center; gap: 8px; color: var(--danger); font-weight: 500; }
    .fail-title svg { width: 20px; height: 20px; }
    .close-logs-link, .btn-link {
      border: 0; background: none; padding: 0; color: var(--primary); font: inherit; font-weight: 500; cursor: pointer;
    }
    .close-logs-link:hover, .btn-link:hover { text-decoration: underline; }
    .error { color: var(--danger); }

    .ec-fix-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 16px; background: var(--scrim); }
    .ec-fix-modal {
      display: grid; gap: 12px; width: min(560px, 100%); max-height: calc(100vh - 32px); overflow: auto;
      padding: 22px; border-radius: var(--radius-lg); background: var(--surface-raised); box-shadow: var(--shadow-md);
    }
    .ec-fix-modal h3 { font-size: var(--text-xl); font-weight: 500; }
    .ec-fix-modal p { color: var(--ink-2); }
    .ec-fix-snippet { margin: 0; padding: 12px 14px; border-radius: var(--radius-md); background: var(--log-bg); color: var(--log-ink); font-family: var(--font-mono); font-size: var(--text-xs); overflow: auto; }
    .missing-secrets-list { margin: 0; padding-left: 20px; }
    .ec-fix-actions { display: flex; justify-content: flex-end; gap: 8px; flex-wrap: wrap; margin-top: 4px; }

    @media (max-width: 760px) {
      .action-bar { position: static; }
      .bar-actions { width: 100%; }
      .bar-actions .btn { flex: 1 1 auto; }
    }
  `];
}

declare global {
  interface HTMLElementTagNameMap {
    'esp-config-page': EspConfigPage;
  }
}
