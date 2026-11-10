import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { load as loadYaml } from 'js-yaml';
import { DiscoveredBridge, SerialPortInfo, api } from '../api/client';
import { icon, brandMark } from '../styles/icons';
import {
  acquirePort,
  chipFamilyFromName,
  detectChip as detectConnectedChip,
  openInstallDialog,
  portLabel,
  usbFlashSupported,
  type UsbSerialPort,
} from '../lib/browser-flash';

const CHIP_OPTIONS: Record<string, { label: string; board_info: Record<string, string> }> = {
  'ESP32-C5': { label: 'ESP32-C5 (esp32-c5-devkitc-1)', board_info: { platform: 'esp32', board: 'esp32-c5-devkitc-1', framework: 'esp-idf', variant: 'esp32c5' } },
  'ESP32-C6': { label: 'ESP32-C6 (esp32-c6-devkitc)', board_info: { platform: 'esp32', board: 'esp32-c6-devkitc', framework: 'esp-idf', variant: 'esp32c6' } },
  'ESP32-S3': { label: 'ESP32-S3 (esp32-s3-devkitc-1)', board_info: { platform: 'esp32', board: 'esp32-s3-devkitc-1', framework: 'esp-idf', variant: 'esp32s3' } },
  'ESP32-C3': { label: 'ESP32-C3 (esp32-c3-devkitm-1)', board_info: { platform: 'esp32', board: 'esp32-c3-devkitm-1', framework: 'esp-idf', variant: 'esp32c3' } },
  'ESP32-S2': { label: 'ESP32-S2 (esp32-s2-saola)', board_info: { platform: 'esp32', board: 'esp32-s2-saola', framework: 'esp-idf', variant: 'esp32s2' } },
  'ESP32': { label: 'ESP32 (esp32dev)', board_info: { platform: 'esp32', board: 'esp32dev', framework: 'esp-idf' } },
  'ESP32-H2': { label: 'ESP32-H2 (esp32-h2-devkitm-1)', board_info: { platform: 'esp32', board: 'esp32-h2-devkitm-1', framework: 'esp-idf', variant: 'esp32h2' } },
  'ESP32-C2': { label: 'ESP32-C2 (esp32-c2-devkitm-1)', board_info: { platform: 'esp32', board: 'esp32-c2-devkitm-1', framework: 'esp-idf', variant: 'esp32c2' } },
};

type Step1State = 'disabled' | 'choose' | 'scanning' | 'found' | 'connecting' | 'pending' | 'complete' | 'error';
type Step2State = 'disabled' | 'ready' | 'restarting' | 'polling' | 'complete' | 'error';
type Step3State = 'disabled' | 'triggering' | 'polling' | 'complete' | 'fallback' | 'error';

@customElement('esp-setup-wizard')
export class EspSetupWizard extends LitElement {
  private static readonly MAX_POLL_DURATION_MS = 5 * 60 * 1000;
  private static readonly MAX_DISCOVERY_DURATION_MS = 30 * 1000;
  private static readonly STATUS_POLL_INTERVAL_MS = 1000;
  private static readonly STATUS_POLL_INTERVAL_S = EspSetupWizard.STATUS_POLL_INTERVAL_MS / 1000;
  @state() private step1: Step1State = 'choose';
  @state() private step1Choice: 'choose' | 'existing' | 'new' = 'choose';
  @state() private step2: Step2State = 'disabled';
  @state() private step3: Step3State = 'disabled';
  @state() private discoveredBridges: DiscoveredBridge[] = [];
  @state() private bridgeError: string | null = null;
  @state() private manualHost = '';
  @state() private manualPort = 80;
  @state() private manualApiKey = '';
  @state() private apiKeyInput = '';
  @state() private selectedBridge: DiscoveredBridge | null = null;
  @state() private restartError: string | null = null;
  @state() private integrationError: string | null = null;
  @state() private runningIntegrationVersion: string | null = null;
  @state() private latestIntegrationVersion: string | null = null;
  @state() private integrationDetected = false;
  @state() private bridgeApiStatus: string | null = null;
  @state() private statusPollTimer: ReturnType<typeof setInterval> | null = null;
  @state() private integrationPollTimer: ReturnType<typeof setInterval> | null = null;
  @state() private integrationFailures = 0;
  @state() private pollingSeconds = 0;
  private discoveryTimer: ReturnType<typeof setInterval> | null = null;
  private discoveryTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  private doneTimer: ReturnType<typeof setTimeout> | null = null;
  private validatePollTimer: ReturnType<typeof setInterval> | null = null;
  private validateAttempts = 0;
  private activeBridgeUuid: string | null = null;
  private bridgeHost: string | null = null;
  private bridgePort = 80;
  private pollStartTime = 0;
  private lastIntegrationSetupAttemptAt = 0;

  @state() private flashTab: 'discover' | 'manual' | 'flash' | 'serial' = 'discover';
  @state() private flashStage: 'config' | 'compiling' | 'flashing' | 'detecting' | 'complete' | 'error' = 'config';
  @state() private flashName = 'espnow-bridge';
  @state() private flashNetworkId = '';
  @state() private flashPsk = '';
  @state() private flashWifiSsid = '';
  @state() private flashWifiPassword = '';
  @state() private flashApiKey = '';
  @state() private flashEspnowMode = 'regular';
  @state() private flashOtaPassword = '';
  @state() private flashChipName = '';
  @state() private flashTransport: 'wifi' | 'serial' = 'wifi';
  @state() private flashTransportChosen = false;
  @state() private flashPrefilledFields: Record<string, boolean> = {};
  @state() private flashSerialPort = '';
  @state() private flashSerialPorts: SerialPortInfo[] = [];
  @state() private flashSerialPortScanning = false;
  @state() private flashSerialFlashStatus = '';
  @state() private flashSerialFlashError = '';
  private flashSerialFlashTimer: ReturnType<typeof setInterval> | null = null;
  @state() private flashBoardInfo: Record<string, string> | null = null;
  @state() private flashBrowserDetecting = false;
  @state() private flashBrowserDetectError = '';
  @state() private flashDetectedChip = '';
  /**
   * A port the browser has already granted (from the detect step). Passing it to the
   * install dialog is what removes the browser's second device chooser.
   */
  private flashBrowserPort: UsbSerialPort | null = null;
  /** Which physical board `flashBrowserPort` is, e.g. "USB 303a:1001" (see `portLabel`). */
  @state() private flashBrowserPortLabel = '';
  @state() private flashBrowserFlashing = false;
  @state() private flashBrowserFlashError = '';
  @state() private flashSecretsWarning = '';
  @state() private flashConfigError = '';
  @state() private flashMac = '';
  @state() private flashCompileLog = '';
  @state() private flashCompilePercent = 0;
  @state() private flashCompileStatus = '';
  @state() private flashCompileError = '';
  @state() private flashFlashError = '';
  @state() private flashDetectElapsed = 0;
  @state() private flashDetectError = '';
  @state() private flashBrowserManifestUrl = '';
  private flashCompilePollTimer: ReturnType<typeof setInterval> | null = null;
  private flashDetectTimer: ReturnType<typeof setInterval> | null = null;
  private flashCompileLogEs: EventSource | null = null;
  private flashBrowserFirmwareBlobUrl = '';

  @state() private serialPorts: SerialPortInfo[] = [];
  @state() private serialScanning = false;
  @state() private serialSelectedPort = '';
  @state() private serialBaud = 460800;
  @state() private serialApiKey = '';
  @state() private serialName = '';
  @state() private serialError: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    void this.initFromBridgeConfig();
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('flashCompileLog')) {
      const el = this.shadowRoot?.getElementById('flash-log-viewer');
      if (el) el.scrollTop = el.scrollHeight;
    }
  }

  private async initFromBridgeConfig(): Promise<void> {
    const status = await api.setupStatus();
    this.captureStatus(status);
    const integrationReady = this.integrationReady(status);

    if (status.bridge.configured) {
      this.activeBridgeUuid = status.bridge.uuid || null;
      this.bridgeHost = status.bridge.ip || null;
      if (status.bridge.connected) {
        this.step1 = 'complete';
        void this.startConfiguredBridgeFlow(status, integrationReady);
      } else {
        this.step1 = 'pending';
        this.validateAttempts = 0;
        if (this.discoveryTimer) {
          clearInterval(this.discoveryTimer);
          this.discoveryTimer = null;
        }
        if (this.activeBridgeUuid) {
          void api.bridgeReconnect(this.activeBridgeUuid);
        }
        this.validatePollTimer = setInterval(() => void this.pollValidateStatus(), 1000);
      }
    } else {
      if (this.step2 !== 'disabled') this.step2 = 'disabled';
      if (this.step3 !== 'disabled') this.step3 = 'disabled';
      this.step1 = 'choose';
      this.step1Choice = 'choose';
      this.statusPollTimer = setInterval(() => void this.pollStatus(), EspSetupWizard.STATUS_POLL_INTERVAL_MS);
    }
  }

  private async startConfiguredBridgeFlow(status: Awaited<ReturnType<typeof api.setupStatus>>, integrationReady: boolean): Promise<void> {
    if (status.restart.required) {
      if (!['restarting', 'polling', 'complete'].includes(this.step2)) this.step2 = 'ready';
    } else {
      this.step2 = 'complete';
      if (integrationReady) {
        this.step3 = 'complete';
        void this.onAllDone();
      } else if (this.step3 === 'disabled') {
        void this.triggerIntegrationSetup();
      }
    }
    this.statusPollTimer = setInterval(() => void this.pollStatus(), EspSetupWizard.STATUS_POLL_INTERVAL_MS);
  }

  private get browserSupportsUsbFlash(): boolean {
    return typeof window !== 'undefined' && window.isSecureContext && 'serial' in navigator;
  }

  private get flashChipFamily(): string | null {
    return chipFamilyFromName(this.flashChipName);
  }

  private clearFlashBrowserManifestUrl(): void {
    if (this.flashBrowserManifestUrl) {
      URL.revokeObjectURL(this.flashBrowserManifestUrl);
      this.flashBrowserManifestUrl = '';
    }
    if (this.flashBrowserFirmwareBlobUrl) {
      URL.revokeObjectURL(this.flashBrowserFirmwareBlobUrl);
      this.flashBrowserFirmwareBlobUrl = '';
    }
  }

  private async updateFlashBrowserManifestUrl(): Promise<void> {
    if (!this.flashMac) return;
    const chipFamily = this.flashChipFamily;
    if (!chipFamily) {
      this.clearFlashBrowserManifestUrl();
      return;
    }
    try {
      const resp = await fetch(api.downloadFactoryBinary(this.flashMac));
      if (!resp.ok) {
        this.clearFlashBrowserManifestUrl();
        return;
      }
      const firmwareBlob = await resp.blob();
      const newFirmwareBlobUrl = URL.createObjectURL(firmwareBlob);
      const manifest = {
        name: this.flashName,
        version: 'compiled',
        // No erase prompt: this is a factory image written to a blank device, and the
        // decision was already made by pressing Compile. The dialog erases without asking
        // when this is false and the device reports no Improv.
        new_install_prompt_erase: false,
        // The bridge firmware implements no Improv (no `improv_serial:` anywhere in
        // device_code/), so the dialog's post-write Improv probe can only ever time out.
        // 0 skips it instead of stalling for the 10 s default.
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
      this.clearFlashBrowserManifestUrl();
      this.flashBrowserManifestUrl = newManifestUrl;
      this.flashBrowserFirmwareBlobUrl = newFirmwareBlobUrl;
    } catch {
      this.clearFlashBrowserManifestUrl();
    }
  }

  private async pollValidateStatus(): Promise<void> {
    if (this.step1 !== 'pending') {
      if (this.validatePollTimer) {
        clearInterval(this.validatePollTimer);
        this.validatePollTimer = null;
      }
      return;
    }
    this.validateAttempts++;
    try {
      const status = await api.setupStatus();
      this.captureStatus(status);
      if (status.bridge.connected) {
        this.step1 = 'complete';
        if (this.validatePollTimer) {
          clearInterval(this.validatePollTimer);
          this.validatePollTimer = null;
        }
        void this.startConfiguredBridgeFlow(status, this.integrationReady(status));
        return;
      }
    } catch {
      // ignore
    }
    if (this.validateAttempts >= 3) {
      if (this.validatePollTimer) {
        clearInterval(this.validatePollTimer);
        this.validatePollTimer = null;
      }
      this.step1 = 'error';
      void this.startDiscovery();
      this.statusPollTimer = setInterval(() => void this.pollStatus(), EspSetupWizard.STATUS_POLL_INTERVAL_MS);
    }
  }

  disconnectedCallback(): void {
    if (this.statusPollTimer) {
      clearInterval(this.statusPollTimer);
      this.statusPollTimer = null;
    }
    if (this.integrationPollTimer) {
      clearInterval(this.integrationPollTimer);
      this.integrationPollTimer = null;
    }
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer);
      this.discoveryTimer = null;
    }
    if (this.discoveryTimeoutTimer) {
      clearTimeout(this.discoveryTimeoutTimer);
      this.discoveryTimeoutTimer = null;
    }
    if (this.validatePollTimer) {
      clearInterval(this.validatePollTimer);
      this.validatePollTimer = null;
    }
    if (this.doneTimer) {
      clearTimeout(this.doneTimer);
      this.doneTimer = null;
    }
    if (this.flashCompilePollTimer) {
      clearInterval(this.flashCompilePollTimer);
      this.flashCompilePollTimer = null;
    }
    if (this.flashDetectTimer) {
      clearInterval(this.flashDetectTimer);
      this.flashDetectTimer = null;
    }
    if (this.flashCompileLogEs) {
      this.flashCompileLogEs.close();
      this.flashCompileLogEs = null;
    }
    this.clearFlashBrowserManifestUrl();
    super.disconnectedCallback();
  }

  private async startDiscovery(): Promise<void> {
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer);
      this.discoveryTimer = null;
    }
    if (this.discoveryTimeoutTimer) {
      clearTimeout(this.discoveryTimeoutTimer);
      this.discoveryTimeoutTimer = null;
    }
    if (this.step1 !== 'complete') this.step1 = 'scanning';
    this.bridgeError = null;
    await this.refreshDiscoveredBridges();
    void api.triggerScan().catch((e) => {
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.toLowerCase().includes('already')) {
        this.bridgeError = msg;
      }
    });
    this.discoveryTimer = setInterval(() => void this.refreshDiscoveredBridges(), 2000);
    this.discoveryTimeoutTimer = setTimeout(() => {
      this.discoveryTimeoutTimer = null;
      if (this.discoveryTimer) {
        clearInterval(this.discoveryTimer);
        this.discoveryTimer = null;
      }
      if (this.step1 === 'scanning') {
        this.step1 = 'error';
        this.bridgeError = 'No bridges found. Make sure your bridge is powered on and connected to the same network, then try again.';
      }
    }, EspSetupWizard.MAX_DISCOVERY_DURATION_MS);
  }

  private async refreshDiscoveredBridges(): Promise<void> {
    if (this.step1 === 'complete' || this.step1 === 'connecting' || this.step1 === 'pending') return;
    try {
      const result = await api.discoverBridges();
      this.discoveredBridges = result.bridges;
      if (this.discoveredBridges.length > 0) {
        this.step1 = 'found';
        this.bridgeError = null;
        if (this.discoveryTimer) {
          clearInterval(this.discoveryTimer);
          this.discoveryTimer = null;
        }
        if (this.discoveryTimeoutTimer) {
          clearTimeout(this.discoveryTimeoutTimer);
          this.discoveryTimeoutTimer = null;
        }
      } else if (!result.scanning) {
        this.step1 = 'error';
        this.bridgeError = 'No bridges found. Make sure your bridge is powered on and connected to the same network, then try again.';
        if (this.discoveryTimer) {
          clearInterval(this.discoveryTimer);
          this.discoveryTimer = null;
        }
        if (this.discoveryTimeoutTimer) {
          clearTimeout(this.discoveryTimeoutTimer);
          this.discoveryTimeoutTimer = null;
        }
      } else if (this.step1 !== 'error') {
        this.step1 = 'scanning';
      }
    } catch (e) {
      this.bridgeError = e instanceof Error ? e.message : String(e);
    }
  }

  private async pollStatus(): Promise<void> {
    try {
      const status = await api.setupStatus();
      this.captureStatus(status);
      const integrationReady = this.integrationReady(status);

      if (status.bridge.configured && this.step1 !== 'pending') {
        this.step1 = 'complete';
        if (this.discoveryTimer) {
          clearInterval(this.discoveryTimer);
          this.discoveryTimer = null;
        }
        if (status.restart.required) {
          if (!['restarting', 'polling', 'complete'].includes(this.step2)) this.step2 = 'ready';
        } else {
          this.step2 = 'complete';
          if (!integrationReady && this.step3 === 'disabled') {
            void this.triggerIntegrationSetup();
          }
        }
      } else {
        if (this.step2 !== 'disabled') this.step2 = 'disabled';
        if (this.step3 !== 'disabled') this.step3 = 'disabled';
      }

      if (status.bridge.configured && !status.restart.required && this.step2 === 'polling') {
        this.step2 = 'complete';
        this.pollingSeconds = 0;
        if (!integrationReady && this.step3 === 'disabled') {
          void this.triggerIntegrationSetup();
        }
      }

      if (integrationReady) {
        this.step3 = 'complete';
        this.integrationFailures = 0;
        if (this.step1 === 'complete' && this.step2 === 'complete') void this.onAllDone();
      }

      if (this.step2 === 'polling') {
        this.pollingSeconds += EspSetupWizard.STATUS_POLL_INTERVAL_S;
      }
    } catch {
      // API unreachable — expected during restart polling, step2 handles it
    }
  }

  private captureStatus(status: Awaited<ReturnType<typeof api.setupStatus>>): void {
    this.runningIntegrationVersion = status.integration.live_version || status.restart.running_version || status.integration.version || status.integration.runtime_version || null;
    this.latestIntegrationVersion = status.restart.latest_version || status.integration.latest_version || null;
    this.integrationDetected = Boolean(
      status.integration.loaded ||
      status.integration.live_connected ||
      status.integration.runtime_loaded ||
      status.integration.entry_loaded ||
      status.integration.ws_client_connected ||
      status.integration.configured
    );
    if (status.bridge.ws_connected) {
      this.bridgeApiStatus = `Bridge protobuf online: ${status.bridge.ip || status.bridge.hostname || 'bridge'}`;
    } else {
      this.bridgeApiStatus = null;
    }
  }

  private integrationReady(status: Awaited<ReturnType<typeof api.setupStatus>>): boolean {
    const s = status.integration;
    const hasIntegration = s.configured || s.entry_loaded || s.ws_client_connected || (s.loaded && s.connected);
    return Boolean(hasIntegration) && !status.restart.required;
  }

  private async connectBridgeBySelect(bridge: DiscoveredBridge): Promise<void> {
    if (!this.apiKeyInput.trim()) {
      this.bridgeError = 'API key is required';
      return;
    }
    this.step1 = 'connecting';
    this.bridgeError = null;
    try {
      await api.selectBridge(
        bridge.host, bridge.port, bridge.name, bridge.version,
        this.apiKeyInput, bridge.network_id, bridge.hostname,
      );
      this.step1 = 'complete';
      this.step2 = 'ready';
      void this.pollStatus();
    } catch (e) {
      this.step1 = 'found';
      this.bridgeError = e instanceof Error ? e.message : String(e);
    }
  }

  private async connectManualBridge(): Promise<void> {
    if (!this.manualHost.trim()) {
      this.bridgeError = 'Host is required';
      return;
    }
    this.step1 = 'connecting';
    this.bridgeError = null;
    try {
      await api.addBridge(this.manualHost.trim(), this.manualPort, undefined, this.manualApiKey || '', '');
      this.step1 = 'complete';
      this.step2 = 'ready';
      void this.pollStatus();
    } catch (e) {
      this.step1 = this.discoveredBridges.length > 0 ? 'found' : 'error';
      this.bridgeError = e instanceof Error ? e.message : String(e);
    }
  }

  private selectBridgeForApiKey(bridge: DiscoveredBridge): void {
    this.selectedBridge = bridge;
    if (this.discoveryTimer) {
      clearInterval(this.discoveryTimer);
      this.discoveryTimer = null;
    }
  }

  private async handleRestart(): Promise<void> {
    this.step2 = 'restarting';
    this.restartError = null;
    try {
      const result = await api.requestRestart();
      if (result.success) {
        this.step2 = 'polling';
        this.pollingSeconds = 0;
      } else {
        this.step2 = 'error';
        this.restartError = result.error || 'Restart failed';
      }
    } catch (e) {
      this.step2 = 'polling';
      this.pollingSeconds = 0;
      this.restartError = null;
    }
  }

  private triggerIntegrationSetup(): void {
    if (['triggering', 'polling', 'complete'].includes(this.step3)) return;
    this.step3 = 'triggering';
    this.integrationError = null;
    this.integrationFailures = 0;
    this.lastIntegrationSetupAttemptAt = Date.now();
    api.integrationSetup().then(async (result) => {
      const currentStatus = await api.setupStatus();
      this.captureStatus(currentStatus);
      if (this.integrationReady(currentStatus)) {
        this.step3 = 'complete';
        void this.onAllDone();
        return;
      }
      if (result.entry_created && !result.restart_required) {
        this.step3 = 'complete';
        void this.onAllDone();
        return;
      }
      if (result.success && !result.entry_created && !result.restart_required) {
        this.step3 = 'fallback';
        this.integrationError = 'Integration created — restart Home Assistant first, then add ESP Tree in Devices & Services.';
        return;
      }
      if (result.success) {
        this.step3 = 'polling';
        this.pollStartTime = Date.now();
        if (!this.integrationPollTimer) {
          this.integrationPollTimer = setInterval(() => void this.pollIntegrationForEntry(), EspSetupWizard.STATUS_POLL_INTERVAL_MS);
        }
      } else {
        this.step3 = 'error';
        this.integrationError = result.error || 'Failed to set up integration';
      }
    }).catch((e) => {
      this.step3 = 'error';
      this.integrationError = e instanceof Error ? e.message : String(e);
    });
  }

  private async pollIntegrationForEntry(): Promise<void> {
    try {
      const status = await api.setupStatus();
      this.captureStatus(status);
      this.integrationFailures = 0;
      if (this.integrationReady(status)) {
        this.step3 = 'complete';
        if (this.integrationPollTimer) {
          clearInterval(this.integrationPollTimer);
          this.integrationPollTimer = null;
        }
        void this.onAllDone();
        return;
      }
      const now = Date.now();
      if (now - this.lastIntegrationSetupAttemptAt >= 10_000) {
        this.lastIntegrationSetupAttemptAt = now;
        const result = await api.integrationSetup();
        if (result.entry_created && !result.restart_required) {
          this.step3 = 'complete';
          if (this.integrationPollTimer) {
            clearInterval(this.integrationPollTimer);
            this.integrationPollTimer = null;
          }
          void this.onAllDone();
          return;
        }
      }
      if (Date.now() - this.pollStartTime > EspSetupWizard.MAX_POLL_DURATION_MS) {
        if (this.integrationPollTimer) {
          clearInterval(this.integrationPollTimer);
          this.integrationPollTimer = null;
        }
        this.step3 = 'fallback';
      }
    } catch {
      this.integrationFailures++;
      if (this.integrationFailures >= 10) {
        if (this.integrationPollTimer) {
          clearInterval(this.integrationPollTimer);
          this.integrationPollTimer = null;
        }
        this.step3 = 'fallback';
      }
    }
  }

  private async onAllDone(): Promise<void> {
    if (this.doneTimer) return;
    this.doneTimer = setTimeout(() => {
      this.doneTimer = null;
      window.location.hash = '/';
    }, 2000);
  }

  private dismiss(): void {
    if (this.doneTimer) {
      clearTimeout(this.doneTimer);
      this.doneTimer = null;
    }
    this.dispatchEvent(new CustomEvent('setup-dismissed', { bubbles: true, composed: true }));
    window.location.hash = '/';
  }

  private retryDiscovery(): void {
    void this.startDiscovery();
  }

  private retryConnection(): void {
    this.step1 = 'pending';
    this.validateAttempts = 0;
    if (this.activeBridgeUuid) {
      void api.bridgeReconnect(this.activeBridgeUuid);
    }
    if (this.statusPollTimer) {
      clearInterval(this.statusPollTimer);
      this.statusPollTimer = null;
    }
    this.validatePollTimer = setInterval(() => void this.pollValidateStatus(), 1000);
  }

  private onChooseExistingBridge(): void {
    this.step1Choice = 'existing';
    this.flashTab = 'discover';
    void this.startDiscovery();
  }

  private onChooseNewBridge(): void {
    this.step1Choice = 'new';
    this.flashTab = 'flash';
    this.flashTransportChosen = false;
    void this.loadFlashWizardDefaults();
  }

  private onChooseTransport(transport: 'wifi' | 'serial'): void {
    this.flashTransport = transport;
    this.flashTransportChosen = true;
    if (transport === 'serial') {
      void this.scanFlashSerialPorts();
    }
  }

  private onBackToChoose(): void {
    this.step1Choice = 'choose';
    this.step1 = 'choose';
    this.bridgeError = null;
  }

  private async loadFlashWizardDefaults(): Promise<void> {
    try {
      const secretsResult = await api.getSecrets().catch(() => null);
      if (secretsResult?.content) {
        this.parseSecretsForFlash(secretsResult.content);
      }
      if (!this.flashApiKey) {
        this.flashApiKey = this.generateRandomBase64(18);
      }
      if (!this.flashOtaPassword) {
        this.flashOtaPassword = this.generateRandomHex(16);
      }
    } catch {
      if (!this.flashApiKey) {
        this.flashApiKey = this.generateRandomBase64(18);
      }
      if (!this.flashOtaPassword) {
        this.flashOtaPassword = this.generateRandomHex(16);
      }
    }
  }

  private parseSecretsForFlash(content: string): void {
    if (!content || !content.trim()) {
      return;
    }
    try {
      const parsed = loadYaml(content);
      if (!parsed || typeof parsed !== 'object') return;
      const secrets = parsed as Record<string, unknown>;
      const wifiSsid = typeof secrets.wifi_ssid === 'string' ? secrets.wifi_ssid : '';
      const wifiPassword = typeof secrets.wifi_password === 'string' ? secrets.wifi_password : '';
      const otaPassword = typeof secrets.ota_password === 'string' ? secrets.ota_password : '';
      const apiKey = typeof secrets.bridge_api_key === 'string' ? secrets.bridge_api_key : '';
      const networkId = typeof secrets.espnow_network_id === 'string' ? secrets.espnow_network_id : '';
      const psk = typeof secrets.espnow_psk === 'string' ? secrets.espnow_psk : '';

      if (wifiSsid) this.flashWifiSsid = wifiSsid;
      if (wifiPassword) this.flashWifiPassword = wifiPassword;
      if (otaPassword) this.flashOtaPassword = otaPassword;
      if (apiKey) this.flashApiKey = apiKey;
      if (networkId) this.flashNetworkId = networkId;
      if (psk) this.flashPsk = psk;

      this.flashPrefilledFields = {
        wifiSsid: !!wifiSsid,
        wifiPassword: !!wifiPassword,
        otaPassword: !!otaPassword,
        apiKey: !!apiKey,
        networkId: !!networkId,
        psk: !!psk,
      };

      if (networkId || psk) {
        const prefilled = [networkId ? 'Network ID' : '', psk ? 'PSK' : ''].filter(Boolean).join(' and ');
        this.flashSecretsWarning = `Existing network credentials detected. ${prefilled} pre-filled from your current configuration. Changing the Network ID or PSK will break communication with any existing remotes on this network.`;
      } else {
        this.flashSecretsWarning = '';
      }
    } catch {
      // Ignore parse errors and leave manual entry available.
    }
  }

  private generateRandomBase64(bytes: number): string {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr)).replace(/[+/=]/g, '').slice(0, 24);
  }

  private generateRandomHex(bytes: number): string {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async detectFlashBoardInBrowser(forcePicker = false): Promise<void> {
    this.flashBrowserDetecting = true;
    this.flashBrowserDetectError = '';
    this.flashDetectedChip = '';

    try {
      if (!usbFlashSupported()) {
        throw new Error('Browser USB detection requires a secure HTTPS page in Chrome or Edge');
      }

      const port = await acquirePort({ forcePicker });
      if (port === 'cancelled') {
        this.flashBrowserDetectError = 'No USB device was chosen';
        this.flashBrowserDetecting = false;
        return;
      }
      // Keep the granted port: the flash step reuses it instead of re-prompting.
      this.flashBrowserPort = port;
      this.flashBrowserPortLabel = portLabel(port);

      const { detected, family } = await detectConnectedChip(port);
      if (!family || !CHIP_OPTIONS[family]) {
        throw new Error(`Detected ${detected}, but there is no supported board mapping for it`);
      }

      this.flashChipName = family;
      this.flashBoardInfo = CHIP_OPTIONS[family].board_info;
      this.flashDetectedChip = detected;
    } catch (e) {
      this.flashBrowserDetectError = e instanceof Error ? e.message : String(e);
    } finally {
      this.flashBrowserDetecting = false;
    }
  }

  private onFlashChipChange(chipName: string): void {
    this.flashChipName = chipName;
    this.flashBoardInfo = CHIP_OPTIONS[chipName]?.board_info || null;
    this.flashDetectedChip = '';
    this.flashBrowserDetectError = '';
  }

  private validateFlashConfig(): boolean {
    const errors: string[] = [];
    if (!this.flashName.trim()) errors.push('ESPHome Name is required');
    if (!/^[a-z][a-z0-9-]*$/.test(this.flashName.trim())) errors.push('ESPHome Name must be lowercase letters, numbers, and hyphens');
    if (!this.flashNetworkId.trim()) errors.push('ESP-NOW Network ID is required');
    if (!this.flashPsk.trim()) errors.push('ESP-NOW PSK is required');
    if (!this.flashWifiSsid.trim() && this.flashTransport === 'wifi') errors.push('WiFi SSID is required');
    if (!this.flashWifiPassword.trim() && this.flashTransport === 'wifi') errors.push('WiFi Password is required');
    if (!this.flashSerialPort && this.flashTransport === 'serial') errors.push('Serial port is required for serial transport');
    if (!/^[0-9a-fA-F]{64}$/.test(this.flashPsk.trim())) {
      errors.push('PSK must be 64 hex characters');
    }
    if (!this.flashChipName || !CHIP_OPTIONS[this.flashChipName] || !this.flashBoardInfo) errors.push('Board selection is required');
    if (errors.length > 0) {
      this.flashConfigError = errors.join('. ') + '.';
      return false;
    }
    this.flashConfigError = '';
    return true;
  }

  private async onSubmitFlashConfig(): Promise<void> {
    if (!this.validateFlashConfig()) return;
    this.flashStage = 'compiling';
    this.flashCompileLog = '';
    this.flashCompilePercent = 0;
    this.flashCompileStatus = '';
    this.flashCompileError = '';
    this.flashFlashError = '';
    this.clearFlashBrowserManifestUrl();
    const boardInfo = this.flashBoardInfo || CHIP_OPTIONS[this.flashChipName]?.board_info || {};
    try {
      const result = await api.submitFlashWizard({
        name: this.flashName.trim(),
        network_id: this.flashNetworkId.trim(),
        psk: this.flashPsk.trim(),
        wifi_ssid: this.flashWifiSsid.trim(),
        wifi_password: this.flashWifiPassword,
        api_key: this.flashApiKey,
        espnow_mode: this.flashEspnowMode,
        ota_password: this.flashOtaPassword,
        chip_name: this.flashChipName,
        board_info: boardInfo,
        transport: this.flashTransport,
        serial_port: this.flashTransport === 'serial' ? this.flashSerialPort : '',
      });
      this.flashMac = result.mac;
      void this.pollCompileStatus();
      void this.startCompileLogStream();
    } catch (e) {
      this.flashCompileError = e instanceof Error ? e.message : String(e);
      this.flashStage = 'error';
    }
  }

  private async pollCompileStatus(): Promise<void> {
    if (this.flashStage !== 'compiling' || !this.flashMac) return;
    try {
      const status = await api.getCompileStatus(this.flashMac);
      const s = status.status || '';
      if (s === 'idle') {
        this.flashCompileLog += `[status: idle — waiting for compile job to start]\n`;
      }
      this.flashCompileStatus = s;
      this.flashCompilePercent = s === 'compiled' ? 100 :
        s === 'failed' ? 0 :
        s === 'compile_queued' ? (status.queue_position != null ? Math.max(5, 100 - (status.queue_position || 1) * 10) : 5) :
        s === 'compiling' ? Math.max(this.flashCompilePercent, 10) :
        Math.max(this.flashCompilePercent, 2);
      if (s === 'compiled') {
        this.flashCompilePercent = 100;
        if (this.flashCompilePollTimer) {
          clearInterval(this.flashCompilePollTimer);
          this.flashCompilePollTimer = null;
        }
        if (this.flashCompileLogEs) {
          this.flashCompileLogEs.close();
          this.flashCompileLogEs = null;
        }
        await this.updateFlashBrowserManifestUrl();
        if (this.flashStage === 'compiling') {
          this.flashStage = 'flashing';
        }
        return;
      }
      if (s === 'failed') {
        this.flashCompileError = status.error || 'Compilation failed';
        this.flashStage = 'error';
        this.cleanupFlashTimers();
        return;
      }
    } catch (e) {
      this.flashCompileLog += `[poll error: ${e instanceof Error ? e.message : String(e)}]\n`;
    }
    if (this.flashStage === 'compiling') {
      this.flashCompilePollTimer = setTimeout(() => void this.pollCompileStatus(), 2000) as unknown as ReturnType<typeof setInterval>;
    }
  }

  private startCompileLogStream(): void {
    if (!this.flashMac) return;
    this.flashCompileLogEs = api.streamCompileLogs(
      this.flashMac,
      (line) => { this.flashCompileLog += line + '\n'; },
      (err) => {
        this.flashCompileLog += `[SSE error: ${err.type || 'connection failed'}]\n`;
      },
    );
  }

  private get flashCompileStatusLabel(): string {
    const labels: Record<string, string> = {
      'idle': 'Waiting to start...',
      'compile_queued': 'Queued for compilation...',
      'compiling': 'Compiling...',
      'compiled': 'Compile complete!',
      'failed': 'Compilation failed',
    };
    return labels[this.flashCompileStatus] || this.flashCompileStatus;
  }

  private async scanFlashSerialPorts(): Promise<void> {
    this.flashSerialPortScanning = true;
    try {
      const ports = await api.scanSerialPorts();
      this.flashSerialPorts = ports;
      if (ports.length === 0) {
        this.flashSerialFlashError = 'No serial ports found on the add-on host.';
      }
    } catch (e) {
      this.flashSerialFlashError = e instanceof Error ? e.message : String(e);
    } finally {
      this.flashSerialPortScanning = false;
    }
  }

  private async startSerialFlashFromWizard(): Promise<void> {
    if (!this.flashMac || !this.flashSerialPort) return;
    this.flashSerialFlashError = '';
    this.flashSerialFlashStatus = 'flashing';
    try {
      await api.startSerialFlash(this.flashMac, this.flashSerialPort);
    } catch (e) {
      this.flashSerialFlashError = e instanceof Error ? e.message : String(e);
      this.flashSerialFlashStatus = 'failed';
      return;
    }
    this.flashSerialFlashTimer = setInterval(() => void this.pollSerialFlashStatus(), 2000) as unknown as ReturnType<typeof setInterval>;
  }

  private async pollSerialFlashStatus(): Promise<void> {
    if (!this.flashMac) return;
    try {
      const status = await api.getSerialFlashStatus(this.flashMac);
      const s = status.status || 'idle';
      this.flashSerialFlashStatus = s;
      if (s === 'success' || s === 'failed') {
        if (this.flashSerialFlashTimer) {
          clearInterval(this.flashSerialFlashTimer);
          this.flashSerialFlashTimer = null;
        }
        if (s === 'failed') {
          this.flashSerialFlashError = (status as { error?: string }).error || 'Serial flash failed';
        }
      }
    } catch {
      // transient; keep polling
    }
  }

  /**
   * Open the install dialog against this wizard's compiled factory image.
   *
   * Called from a click so the `requestPort()` fallback still has its user activation; when
   * the board was detected earlier in this wizard the held port is passed straight in and
   * the browser shows no second chooser.
   */
  private async flashInBrowser(): Promise<void> {
    if (!this.flashBrowserManifestUrl) return;
    this.flashBrowserFlashError = '';
    this.flashBrowserFlashing = true;
    try {
      const { result, port } = await openInstallDialog({
        manifestUrl: this.flashBrowserManifestUrl,
        port: this.flashBrowserPort,
        onClosed: () => {
          this.flashBrowserFlashing = false;
        },
      });
      if (result === 'cancelled') {
        this.flashBrowserFlashError = 'No USB device was selected.';
        this.flashBrowserFlashing = false;
      }
      // Take back whatever port the dialog settled on: it falls back to the chooser when the
      // held port turned out to be stale, and the retry must reuse that choice.
      this.flashBrowserPort = port;
      this.flashBrowserPortLabel = port ? portLabel(port) : '';
    } catch (e) {
      this.flashBrowserFlashError = e instanceof Error ? e.message : String(e);
      this.flashBrowserFlashing = false;
    }
  }

  private async startDetection(): Promise<void> {
    this.flashStage = 'detecting';
    this.flashDetectElapsed = 0;
    this.flashDetectError = '';
    if (this.flashTransport === 'serial') {
      // Nothing to scan for: a serial bridge has no host. Activation just enables
      // the bridge and starts its serial client on the add-on.
      try {
        await api.finalizeFlashWizard();
      } catch {
        // fall through to polling; the status endpoint reports the real state
      }
    } else {
      await api.triggerScan().catch(() => {});
    }
    this.flashDetectTimer = setInterval(() => void this.pollFlashWizardStatus(), 2000) as unknown as ReturnType<typeof setInterval>;
  }

  private async pollFlashWizardStatus(): Promise<void> {
    if (this.flashStage !== 'detecting') {
      if (this.flashDetectTimer) {
        clearInterval(this.flashDetectTimer);
        this.flashDetectTimer = null;
      }
      return;
    }
    this.flashDetectElapsed += 2;
    if (this.flashDetectElapsed >= 90) {
      if (this.flashDetectTimer) {
        clearInterval(this.flashDetectTimer);
        this.flashDetectTimer = null;
      }
      this.flashDetectError = this.flashTransport === 'serial'
        ? 'Bridge did not authenticate over serial within 90 seconds. Check the port is correct and the bridge is powered.'
        : 'Bridge not found within 90 seconds. Ensure the bridge is powered on and connected to WiFi.';
      this.flashStage = 'error';
      return;
    }
    try {
      const status = await api.getFlashWizardStatus();
      if (status.bridge_detected) {
        if (this.flashDetectTimer) {
          clearInterval(this.flashDetectTimer);
          this.flashDetectTimer = null;
        }
        this.flashStage = 'complete';
        this.step1 = 'complete';
        this.step2 = 'ready';
        void this.pollStatus();
      }
    } catch {
      // ignore
    }
  }

  private get flashBackLabel(): string {
    if (this.flashStage === 'detecting' || (this.flashStage === 'error' && this.flashDetectError)) {
      return 'Back to flashing';
    }
    if (this.flashStage === 'flashing' || this.flashStage === 'compiling' || this.flashStage === 'error') {
      return 'Back to configuration';
    }
    if (this.flashStage === 'config' && this.flashTransportChosen) {
      return 'Back to bridge type';
    }
    return 'Back';
  }

  private async handleFlashBack(): Promise<void> {
    if (this.flashStage === 'detecting' || (this.flashStage === 'error' && this.flashDetectError)) {
      if (this.flashDetectTimer) {
        clearInterval(this.flashDetectTimer);
        this.flashDetectTimer = null;
      }
      this.flashDetectElapsed = 0;
      this.flashDetectError = '';
      this.flashStage = 'flashing';
      return;
    }

    if (this.flashStage === 'flashing' || this.flashStage === 'error') {
      this.resetFlashWizard();
      return;
    }

    if (this.flashStage === 'compiling') {
      if (this.flashMac) {
        await api.cancelCompile(this.flashMac).catch(() => {});
      }
      this.resetFlashWizard();
      return;
    }

    if (this.flashTransportChosen) {
      this.flashTransportChosen = false;
      return;
    }

    this.onBackToChoose();
  }

  private resetFlashWizard(): void {
    this.cleanupFlashTimers();
    this.flashStage = 'config';
    this.flashCompileLog = '';
    this.flashCompilePercent = 0;
    this.flashCompileStatus = '';
    this.flashCompileError = '';
    this.flashFlashError = '';
    this.flashDetectElapsed = 0;
    this.flashDetectError = '';
    this.flashMac = '';
    this.flashConfigError = '';
  }

  private cleanupFlashTimers(): void {
    if (this.flashCompilePollTimer) {
      clearInterval(this.flashCompilePollTimer);
      this.flashCompilePollTimer = null;
    }
    if (this.flashDetectTimer) {
      clearInterval(this.flashDetectTimer);
      this.flashDetectTimer = null;
    }
    if (this.flashCompileLogEs) {
      this.flashCompileLogEs.close();
      this.flashCompileLogEs = null;
    }
    this.clearFlashBrowserManifestUrl();
  }

  render() {
    return html`
      <div class="setup-bar"><div class="setup-bar-inner">
        <span class="setup-brand">${brandMark}ESP Tree</span>
        <button class="dismiss-btn" @click=${this.dismiss}>Skip for now</button>
      </div></div>
      <div class="wizard-page">
        <header class="wizard-header">
          <h1>Connect your network</h1>
          <p class="tagline">Connect an ESP-NOW bridge, then hand the network to Home Assistant. Three steps, a few minutes.</p>
        </header>

        <div class="stepper">
          ${this.renderStep1()}
          ${this.renderStep2()}
          ${this.renderStep3()}
          ${this.renderDone()}
        </div>
      </div>
    `;
  }

  private renderStep1() {
    const collapsed = this.step1 === 'complete' && this.step2 !== 'disabled';
    return html`
      <div class="step ${collapsed ? 'collapsed' : ''} ${this.step1 === 'complete' ? 'done' : ''} ${this.step1 === 'error' ? 'has-error' : ''}">
        <div class="step-header" @click=${() => { if (collapsed) this.requestUpdate(); }}>
          <span class="step-icon">
            ${this.step1 === 'choose' ? '1' :
              this.step1 === 'scanning' ? html`<span class="spinner"></span>` :
              this.step1 === 'connecting' ? html`<span class="spinner"></span>` :
              this.step1 === 'pending' ? html`<span class="spinner"></span>` :
              this.step1 === 'complete' ? icon('check') :
              this.step1 === 'error' ? icon('close') : '1'}
          </span>
          <div class="step-title-area">
            <h2>Connect your bridge</h2>
            <p class="step-summary">
              ${this.step1 === 'choose' ? 'Choose how to set up your bridge' :
                this.step1 === 'scanning' ? 'Searching your network for bridges…' :
                this.step1 === 'found' ? `${this.discoveredBridges.length} bridge(s) found` :
                this.step1 === 'connecting' ? 'Connecting to the bridge…' :
                this.step1 === 'pending' ? 'Checking the bridge connection…' :
                this.step1 === 'complete' ? 'Bridge connected' :
                this.step1 === 'error' ? (this.activeBridgeUuid ? 'Bridge offline' : 'No bridges found') : ''}
            </p>
          </div>
          ${collapsed ? html`<span class="collapse-icon">${icon('chevronRight')}</span>` : nothing}
        </div>

        ${!collapsed ? html`
          <div class="step-body">
            ${this.step1 === 'choose' && this.step1Choice === 'choose' ? html`
              <div class="choice-cards">
                <button class="choice-card" @click=${this.onChooseExistingBridge}>
                  <span class="choice-icon">${icon('search')}</span>
                  <h3>I already have a bridge</h3>
                  <p>Scan your network for an existing ESP-NOW bridge or enter its address manually.</p>
                </button>
                <button class="choice-card" @click=${this.onChooseNewBridge}>
                  <span class="choice-icon">${icon('usb')}</span>
                  <h3>Set up a new bridge</h3>
                  <p>Flash ESP-NOW firmware onto a new ESP32 device and configure it.</p>
                </button>
              </div>
            ` : nothing}

            ${this.step1Choice === 'existing' && this.step1 !== 'complete' ? html`
              <div class="choice-back">
                <button class="btn btn-outline btn-sm" @click=${this.onBackToChoose}>${icon('chevronLeft')}Back</button>
              </div>
              <div class="step-tabs">
                <button class="tab ${this.flashTab === 'discover' ? 'active' : ''}" @click=${() => this.flashTab = 'discover'}>Discover</button>
                <button class="tab ${this.flashTab === 'manual' ? 'active' : ''}" @click=${() => this.flashTab = 'manual'}>Manual</button>
                <button class="tab ${this.flashTab === 'serial' ? 'active' : ''}" @click=${() => this.flashTab = 'serial'}>Serial</button>
              </div>
              ${this.flashTab === 'discover' ? this.renderDiscoverTab() : nothing}
              ${this.flashTab === 'manual' ? this.renderManualTab() : nothing}
              ${this.flashTab === 'serial' ? this.renderSerialTab() : nothing}
            ` : nothing}

            ${this.step1Choice === 'new' && this.step1 !== 'complete' ? html`
              <div class="choice-back">
                <button class="btn btn-outline btn-sm" @click=${() => void this.handleFlashBack()}>${icon('chevronLeft')}${this.flashBackLabel}</button>
              </div>
              ${this.renderFlashTab()}
            ` : nothing}

            ${this.step1 === 'complete' && this.step2 === 'disabled' ? html`
              <div class="complete-state">
                <span class="check">${icon('checkCircle')}</span>
                <span>${this.bridgeApiStatus || 'Bridge connected successfully'}</span>
              </div>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
  }

  private renderDiscoverTab() {
    return html`
      ${this.step1 === 'scanning' || this.step1 === 'connecting' || this.step1 === 'pending' ? html`
        <div class="scanning-state">
          <span class="spinner large"></span>
          <p>${this.step1 === 'scanning' ? 'Searching your network for bridges…' :
            this.step1 === 'connecting' ? 'Connecting to the bridge…' :
            'Checking the bridge connection…'}</p>
        </div>
      ` : nothing}

      ${this.step1 === 'found' ? html`
        ${this.discoveredBridges.length > 0 ? html`
          <div class="bridge-list">
            ${this.discoveredBridges.map(b => html`
              <div class="bridge-card">
                <div class="bridge-info">
                  <strong>${b.name || b.host}</strong>
                  <span>${b.hostname || b.host}:${b.port}</span>
                  ${b.network_id ? html`<span class="net-id">Network: ${b.network_id}</span>` : nothing}
                </div>
                ${this.selectedBridge === b ? html`
                  <div class="api-key-row">
                    <input
                      type="password"
                      placeholder="API Key"
                      .value=${this.apiKeyInput}
                      @input=${(e: Event) => this.apiKeyInput = (e.target as HTMLInputElement).value}
                    />
                    <button class="btn btn-primary" @click=${() => this.connectBridgeBySelect(b)}>
                      Connect
                    </button>
                  </div>
                ` : html`
                  <button class="btn btn-outline" @click=${() => this.selectBridgeForApiKey(b)}>
                    Connect
                  </button>
                `}
              </div>
            `)}
          </div>
        ` : nothing}
      ` : nothing}

      ${this.step1 === 'pending' || (this.step1 === 'error' && this.activeBridgeUuid) ? html`
        <div class="bridge-list">
            <div class="bridge-card offline">
              <div class="bridge-info">
                <strong>${this.bridgeHost || 'Bridge'}</strong>
                <span>${this.bridgeHost ? `${this.bridgeHost}:${this.bridgePort}` : ''}</span>
                <span class="net-id">Offline</span>
              </div>
              <button class="btn btn-outline" @click=${this.retryConnection}>
                Retry Connection
              </button>
            </div>
        </div>
      ` : nothing}

      ${this.step1 === 'error' && !this.activeBridgeUuid ? html`
        <div class="error-block">
          <p>${this.bridgeError || 'No bridges found on your network.'}</p>
          <button class="btn btn-primary" @click=${this.retryDiscovery}>Rescan</button>
          <span class="hint">You can also try the Manual tab to connect by IP address.</span>
        </div>
      ` : nothing}

      ${this.step1 !== 'connecting' && this.step1 !== 'pending' && this.step1 !== 'complete' && !(this.step1 === 'error' && !this.activeBridgeUuid) ? html`
        ${this.bridgeError ? html`
          <div class="error-block">
            <p>${this.bridgeError}</p>
            <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
          </div>
        ` : nothing}
      ` : nothing}
    `;
  }

  private renderManualTab() {
    return html`
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
          <input type="password" placeholder="API Key (optional)" .value=${this.manualApiKey} @input=${(e: Event) => this.manualApiKey = (e.target as HTMLInputElement).value} />
        </label>
        <button class="btn btn-primary" @click=${this.connectManualBridge}>
          Connect
        </button>
      </div>
      ${this.bridgeError ? html`
        <div class="error-block">
          <p>${this.bridgeError}</p>
          <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
        </div>
      ` : nothing}
    `;
  }

  private async scanSerialPorts(): Promise<void> {
    this.serialScanning = true;
    this.serialError = null;
    try {
      const ports = await api.scanSerialPorts();
      this.serialPorts = ports;
      if (ports.length === 0) {
        this.serialError = 'No serial ports found.';
      }
    } catch (e) {
      this.serialError = e instanceof Error ? e.message : String(e);
    } finally {
      this.serialScanning = false;
    }
  }

  private async connectSerialBridge(): Promise<void> {
    if (!this.serialSelectedPort) {
      this.serialError = 'Select a serial port';
      return;
    }
    this.serialError = null;
    this.step1 = 'connecting';
    try {
      await api.addBridge('', 80, this.serialName || undefined, this.serialApiKey || '', '', 'serial', this.serialSelectedPort, this.serialBaud);
      this.step1 = 'complete';
      this.step2 = 'ready';
      void this.pollStatus();
    } catch (e) {
      this.step1 = 'error';
      this.serialError = e instanceof Error ? e.message : String(e);
    }
  }

  private renderSerialTab() {
    return html`
      <div class="manual-form">
        <label>
          Serial Port
          <div class="flash-key-row">
            <select .value=${this.serialSelectedPort} @change=${(e: Event) => this.serialSelectedPort = (e.target as HTMLSelectElement).value}>
              <option value="">-- Select port --</option>
              ${this.serialPorts.map(p => html`
                <option value=${p.port} ?selected=${this.serialSelectedPort === p.port}>${p.label || p.port}${p.available ? "" : " (unavailable)"}</option>
              `)}
            </select>
            <button class="btn btn-outline btn-sm" @click=${() => void this.scanSerialPorts()} ?disabled=${this.serialScanning}>
              ${this.serialScanning ? 'Scanning...' : 'Scan Ports'}
            </button>
          </div>
        </label>
        <label>
          Or enter a port / network serial URL
          <input type="text" placeholder="socket://192.168.1.50:7000 or /dev/ttyUSB0"
            .value=${this.serialSelectedPort}
            @input=${(e: Event) => this.serialSelectedPort = (e.target as HTMLInputElement).value} />
        </label>
        <label>
          Baud Rate
          <input type="number" min="9600" max="921600" .value=${String(this.serialBaud)} @input=${(e: Event) => this.serialBaud = Number((e.target as HTMLInputElement).value) || 460800} />
        </label>
        <label>
          API Key
          <input type="password" placeholder="API Key (optional)" .value=${this.serialApiKey} @input=${(e: Event) => this.serialApiKey = (e.target as HTMLInputElement).value} />
        </label>
        <label>
          Name
          <input type="text" placeholder="Bridge name (optional)" .value=${this.serialName} @input=${(e: Event) => this.serialName = (e.target as HTMLInputElement).value} />
        </label>
        <button class="btn btn-primary" @click=${() => void this.connectSerialBridge()} ?disabled=${this.serialScanning || !this.serialSelectedPort}>
          Connect
        </button>
      </div>
      ${this.serialError ? html`
        <div class="error-block">
          <p>${this.serialError}</p>
          <button class="btn btn-outline" @click=${this.retryDiscovery}>Retry</button>
        </div>
      ` : nothing}
    `;
  }

  private renderFlashTab() {
    if (this.flashStage !== 'config') {
      return this.renderFlashProgress();
    }
    if (!this.flashTransportChosen) {
      return this.renderTransportChoice();
    }
    return html`
      <div class="flash-stage-indicator">
        <span class="stage-dot active">Configure</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Compile</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Flash</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Detect</span>
      </div>

      <div class="flash-form">
        <div class="transport-badge">${this.flashTransport === 'serial' ? 'Serial (USB-UART) transport' : 'Wi-Fi transport'}</div>

        ${this.flashSecretsWarning ? html`
          <div class="flash-warning">${this.flashSecretsWarning}</div>
        ` : nothing}
        ${this.flashConfigError ? html`
          <div class="error-block"><p>${this.flashConfigError}</p></div>
        ` : nothing}

        <label>
          ESPHome Name
          <input type="text" placeholder="espnow-bridge" .value=${this.flashName} @input=${(e: Event) => this.flashName = (e.target as HTMLInputElement).value} />
        </label>

        <label>
          ESP-NOW Network ID ${this.prefillTag('networkId')}
          <input type="text" placeholder="ESP-NOW network name" .value=${this.flashNetworkId} @input=${(e: Event) => this.flashNetworkId = (e.target as HTMLInputElement).value} />
        </label>

        <label>
          ESP-NOW PSK (64 hex chars) ${this.prefillTag('psk')}
          <div class="flash-key-row">
            <input type="text" placeholder="32-byte hex key" .value=${this.flashPsk} @input=${(e: Event) => this.flashPsk = (e.target as HTMLInputElement).value} />
            <button class="btn btn-outline btn-sm" @click=${() => this.flashPsk = this.generateRandomHex(32)}>Generate</button>
          </div>
        </label>

        ${this.flashTransport === 'wifi' ? html`
          <label>
            WiFi SSID ${this.prefillTag('wifiSsid')}
            <input type="text" placeholder="WiFi network name" .value=${this.flashWifiSsid} @input=${(e: Event) => this.flashWifiSsid = (e.target as HTMLInputElement).value} />
          </label>

          <label>
            WiFi Password ${this.prefillTag('wifiPassword')}
            <input type="password" placeholder="WiFi password" .value=${this.flashWifiPassword} @input=${(e: Event) => this.flashWifiPassword = (e.target as HTMLInputElement).value} />
          </label>
        ` : html`
          <label>
            Serial Port
            <div class="flash-key-row">
              <select .value=${this.flashSerialPort} @change=${(e: Event) => this.flashSerialPort = (e.target as HTMLSelectElement).value}>
                <option value="">-- Select port --</option>
                ${this.flashSerialPorts.map(p => html`
                  <option value=${p.port} ?selected=${this.flashSerialPort === p.port}>${p.label || p.port}${p.available ? "" : " (unavailable)"}</option>
                `)}
              </select>
              <button class="btn btn-outline btn-sm" @click=${() => void this.scanFlashSerialPorts()} ?disabled=${this.flashSerialPortScanning}>
                ${this.flashSerialPortScanning ? 'Scanning...' : 'Rescan'}
              </button>
            </div>
          </label>
          <label>
            Or enter a port / network serial URL
            <input type="text" placeholder="socket://192.168.1.50:7000 or /dev/ttyUSB0"
              .value=${this.flashSerialPort}
              @input=${(e: Event) => this.flashSerialPort = (e.target as HTMLInputElement).value} />
          </label>
          ${this.flashSerialFlashError ? html`
            <div class="flash-warning">${this.flashSerialFlashError}</div>
          ` : nothing}
          <div class="flash-warning">
            Serial transport: no WiFi credentials are needed. The bridge talks to the add-on over its
            UART0 pins (wired to a USB-UART adapter), and the console is pinned to the same UART so
            boot logs and panic backtraces stay readable. If the adapter is on another host, point the
            add-on at it with a <code>socket://host:port</code> URL served by a TCP serial bridge.
          </div>
        `}

        <label>
          ESP-NOW Mode
          <select .value=${this.flashEspnowMode} @change=${(e: Event) => this.flashEspnowMode = (e.target as HTMLSelectElement).value}>
            <option value="lr">Long Range (LR)</option>
            <option value="regular">Regular</option>
          </select>
        </label>

        <label>
          Board
          <div class="flash-key-row">
            <select .value=${this.flashChipName} @change=${(e: Event) => this.onFlashChipChange((e.target as HTMLSelectElement).value)}>
              <option value="">-- Detect or select board --</option>
              ${Object.entries(CHIP_OPTIONS).map(([key, val]) => html`
                <option value=${key} ?selected=${this.flashChipName === key}>${val.label}</option>
              `)}
            </select>
            <button class="btn btn-outline btn-sm" @click=${() => void this.detectFlashBoardInBrowser()} ?disabled=${this.flashBrowserDetecting}>
              ${this.flashBrowserDetecting ? 'Detecting...' : 'Detect Connected ESP'}
            </button>
            <button class="btn btn-outline btn-sm" @click=${() => void this.detectFlashBoardInBrowser(true)} ?disabled=${this.flashBrowserDetecting}>
              Choose device…
            </button>
          </div>
        </label>

        ${this.flashDetectedChip ? html`
          <div class="chip-badge detected">Detected: ${this.flashDetectedChip}${this.flashBrowserPortLabel
            ? html` on ${this.flashBrowserPortLabel}`
            : nothing} → ${CHIP_OPTIONS[this.flashChipName]?.label || this.flashChipName}</div>
        ` : nothing}
        ${this.flashBrowserDetectError ? html`
          <div class="flash-warning">Automatic detection failed: ${this.flashBrowserDetectError}. You can select the board manually.</div>
        ` : nothing}

        <div class="flash-warning">
          Connect the new ESP to this computer by USB and click Detect Connected ESP before compiling. Detection uses Web Serial in Chrome/Edge. Manual board selection is available as a fallback.
        </div>

        <details class="advanced-section">
          <summary>Advanced</summary>
          <div class="advanced-body">
            <label>
              API Key ${this.prefillTag('apiKey')} <span class="muted">(will be remembered by addon)</span>
              <div class="flash-key-row">
                <input type="text" placeholder="Auto-generated" .value=${this.flashApiKey} @input=${(e: Event) => this.flashApiKey = (e.target as HTMLInputElement).value} />
                <button class="btn btn-outline btn-sm" @click=${() => this.flashApiKey = this.generateRandomBase64(18)}>Generate</button>
              </div>
            </label>

            <label>
              OTA Password ${this.prefillTag('otaPassword')} <span class="muted">(will be remembered by addon)</span>
              <div class="flash-key-row">
                <input type="text" placeholder="Auto-generated" .value=${this.flashOtaPassword} @input=${(e: Event) => this.flashOtaPassword = (e.target as HTMLInputElement).value} />
                <button class="btn btn-outline btn-sm" @click=${() => this.flashOtaPassword = this.generateRandomHex(16)}>Generate</button>
              </div>
            </label>
          </div>
        </details>

        <button class="btn btn-primary" @click=${() => this.onSubmitFlashConfig()} ?disabled=${!this.flashChipName || !this.flashName.trim()}>Compile Bridge Firmware</button>
      </div>
    `;
  }

  private renderTransportChoice() {
    return html`
      <div class="flash-stage-indicator">
        <span class="stage-dot active">Configure</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Compile</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Flash</span>
        <span class="stage-line"></span>
        <span class="stage-dot">Detect</span>
      </div>

      <div class="choice-cards">
        <button class="choice-card" @click=${() => this.onChooseTransport('wifi')}>
          <span class="choice-icon">${icon('wifi')}</span>
          <h3>Wi-Fi Bridge</h3>
          <p>Connects to the add-on over your Wi-Fi network. You'll need the network name and password.</p>
        </button>
        <button class="choice-card" @click=${() => this.onChooseTransport('serial')}>
          <span class="choice-icon">${icon('usb')}</span>
          <h3>Serial Bridge</h3>
          <p>Connects over a USB-UART link to the add-on. No Wi-Fi credentials needed.</p>
        </button>
      </div>
    `;
  }

  private prefillTag(field: string) {
    return this.flashPrefilledFields[field]
      ? html`<span class="prefill-tag">pre-filled</span>`
      : nothing;
  }

  private renderFlashProgress() {
    const stages = ['config', 'compiling', 'flashing', 'detecting', 'complete'] as const;
    const currentIdx = stages.indexOf(this.flashStage as typeof stages[number]);

    return html`
      <div class="flash-stage-indicator">
        <span class="stage-dot ${currentIdx > 0 ? 'done' : 'active'}">Configure</span>
        <span class="stage-line ${currentIdx > 0 ? 'done' : ''}"></span>
        <span class="stage-dot ${currentIdx > 1 ? 'done' : currentIdx === 1 ? 'active' : ''}">Compile</span>
        <span class="stage-line ${currentIdx > 1 ? 'done' : ''}"></span>
        <span class="stage-dot ${currentIdx > 2 ? 'done' : currentIdx === 2 ? 'active' : ''}">Browser Flash</span>
        <span class="stage-line ${currentIdx > 2 ? 'done' : ''}"></span>
        <span class="stage-dot ${currentIdx > 3 ? 'done' : currentIdx === 3 ? 'active' : ''}">Detect</span>
      </div>

      ${this.flashStage === 'compiling' ? html`
        <div class="flash-progress-area">
          <h3>Compiling Firmware</h3>
          <p class="muted">Building ESPHome firmware for ${this.flashName}...</p>
          ${this.flashCompileStatus ? html`
            <p class="muted compile-status-label">${this.flashCompileStatusLabel}</p>
          ` : nothing}
          ${this.flashCompilePercent > 0 ? html`
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${this.flashCompilePercent}%"></div>
            </div>
            <p class="muted">${this.flashCompilePercent}%</p>
          ` : nothing}
          <div class="flash-log-viewer" id="flash-log-viewer">${this.flashCompileLog}</div>
        </div>
      ` : nothing}

      ${this.flashStage === 'flashing' ? html`
        <div class="flash-progress-area">
          ${this.flashTransport === 'serial' ? html`
            <h3>Flash over Serial</h3>
            <p class="muted">Firmware is ready. Connect the bridge to the add-on host and flash it over the selected port.</p>
            <div class="transport-badge">Port: ${this.flashSerialPort || 'not selected'}</div>
            ${this.flashSerialFlashStatus === 'flashing' ? html`
              <div class="progress-bar-container"><div class="progress-bar" style="width: 100%"></div></div>
              <p class="muted">Flashing ${this.flashName}...</p>
            ` : nothing}
            ${this.flashSerialFlashStatus === 'success' ? html`
              <div class="complete-state"><span class="check">${icon('checkCircle')}</span><span>Flashed over serial.</span></div>
            ` : nothing}
            ${this.flashSerialFlashStatus === 'failed' ? html`
              <div class="flash-warning">Serial flash failed: ${this.flashSerialFlashError || 'see log'}</div>
            ` : nothing}
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${() => void this.handleFlashBack()}>Back to Configure</button>
              <button class="btn btn-primary"
                @click=${() => void this.startSerialFlashFromWizard()}
                ?disabled=${!this.flashSerialPort || this.flashSerialFlashStatus === 'flashing'}>Flash over Serial</button>
              <button class="btn btn-primary"
                @click=${() => void this.startDetection()}
                ?disabled=${!this.flashMac || this.flashSerialFlashStatus !== 'success'}>I Flashed It, Connect Bridge</button>
            </div>
          ` : html`
            <h3>Flash in Browser</h3>
            <p class="muted">Firmware is ready. Connect ${this.flashName} to this computer by USB and flash it from this page.</p>
            <div class="flash-browser-actions">
              ${this.flashBrowserManifestUrl ? html`
                <button class="btn btn-primary"
                  @click=${() => void this.flashInBrowser()}
                  ?disabled=${this.flashBrowserFlashing}>
                  ${this.flashBrowserFlashing ? 'Flashing…' : 'Flash via Browser USB'}
                </button>
                ${this.flashBrowserPort ? html`
                  <span class="chip-badge">Device already granted (${this.flashBrowserPortLabel || 'USB device'}) — no USB prompt needed.</span>
                ` : ''}
                ${this.flashBrowserFlashError ? html`<div class="flash-warning">${this.flashBrowserFlashError}</div>` : ''}
              ` : html`
                <div class="flash-warning">
                  Browser USB flashing is not available for this build in the current tab. Download the factory binary and flash it with your preferred tool.
                </div>
              `}
              <a class="btn" href=${this.flashMac ? api.downloadFactoryBinary(this.flashMac) : '#'} download>Download factory .bin</a>
              <a class="btn" href=${this.flashMac ? api.downloadCompileBinary(this.flashMac) : '#'} download>Download .ota.bin</a>
            </div>
            <p class="muted">
              ${this.browserSupportsUsbFlash
                ? 'When the USB flash finishes and the bridge is powered on, continue to detection.'
                : 'Browser USB flashing is unavailable here. Flash the downloaded factory binary locally, then continue to detection.'}
            </p>
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${() => void this.handleFlashBack()}>Back to Configure</button>
              <button class="btn btn-primary" @click=${() => void this.startDetection()} ?disabled=${!this.flashMac}>I Flashed It, Detect Bridge</button>
            </div>
          `}
          ${this.flashCompileLog ? html`
            <details class="flash-log-details">
              <summary>View Build Log</summary>
              <div class="flash-log-viewer">${this.flashCompileLog}</div>
            </details>
          ` : nothing}
        </div>
      ` : nothing}

      ${this.flashStage === 'detecting' ? html`
        <div class="flash-progress-area">
          <h3>${this.flashTransport === 'serial' ? 'Connecting Bridge' : 'Detecting Bridge'}</h3>
          <p class="muted">${this.flashTransport === 'serial'
            ? `Starting the add-on's serial client (${this.flashDetectElapsed}s elapsed)...`
            : `Waiting for the bridge to come online (${this.flashDetectElapsed}s elapsed)...`}</p>
          <div class="scanning-state">
            <span class="spinner large"></span>
            <p>${this.flashTransport === 'serial' ? 'Waiting for the bridge to authenticate over serial...' : 'Waiting for bridge to appear on network...'}</p>
          </div>
          <div class="flash-error-actions">
            <button class="btn btn-outline" @click=${() => void this.handleFlashBack()}>Back to Flash</button>
          </div>
        </div>
      ` : nothing}

      ${this.flashStage === 'complete' ? html`
        <div class="flash-progress-area">
          <div class="complete-state">
            <span class="check">${icon('checkCircle')}</span>
            <span>Bridge detected and connected!</span>
          </div>
        </div>
      ` : nothing}

      ${this.flashStage === 'error' ? html`
        <div class="flash-progress-area">
          <div class="error-block">
            <p>${this.flashCompileError || this.flashFlashError || this.flashDetectError || 'An error occurred'}</p>
            <div class="flash-error-actions">
              <button class="btn btn-outline" @click=${() => void this.handleFlashBack()}>${this.flashDetectError ? 'Back to Flash' : 'Back to Configure'}</button>
              ${this.flashDetectError ? html`
                <button class="btn btn-outline" @click=${() => { this.flashStage = 'detecting'; this.flashDetectError = ''; void this.startDetection(); }}>Retry Scan</button>
                <button class="btn btn-outline" @click=${() => { this.resetFlashWizard(); this.step1Choice = 'choose'; this.step1 = 'choose'; }}>Skip</button>
              ` : nothing}
            </div>
          </div>
          ${this.flashCompileLog ? html`
            <details class="flash-log-details">
              <summary>View Log</summary>
              <div class="flash-log-viewer">${this.flashCompileLog}</div>
            </details>
          ` : nothing}
        </div>
      ` : nothing}
    `;
  }

  private renderStep2() {
    const collapsed = this.step2 === 'complete' && this.step3 !== 'disabled';
    const runningLabel = this.runningIntegrationVersion || (this.integrationDetected ? 'detected, version unknown' : 'not loaded');
    return html`
      <div class="step ${this.step2 === 'disabled' ? 'locked' : ''} ${collapsed ? 'collapsed' : ''} ${this.step2 === 'complete' ? 'done' : ''} ${this.step2 === 'error' ? 'has-error' : ''}">
        <div class="step-header">
          <span class="step-icon">
            ${this.step2 === 'disabled' ? icon('lock') :
              this.step2 === 'restarting' ? html`<span class="spinner"></span>` :
              this.step2 === 'polling' ? html`<span class="spinner"></span>` :
              this.step2 === 'complete' ? icon('check') :
              this.step2 === 'error' ? icon('close') : '2'}
          </span>
          <div class="step-title-area">
            <h2>Restart Home Assistant</h2>
            <p class="step-summary">
              ${this.step2 === 'disabled' ? 'Complete step 1 first' :
                this.step2 === 'ready' ? 'Home Assistant needs to restart to activate the integration' :
                this.step2 === 'restarting' ? 'Restarting...' :
                this.step2 === 'polling' ? `Waiting for Home Assistant to come back online... (${this.pollingSeconds}s)` :
                this.step2 === 'complete' ? 'Home Assistant restarted successfully' :
                this.step2 === 'error' ? 'Restart failed' : ''}
            </p>
          </div>
          ${collapsed ? html`<span class="collapse-icon">${icon('chevronRight')}</span>` : nothing}
        </div>

        ${!collapsed ? html`
          <div class="step-body">
            ${this.step2 === 'disabled' ? html`
              <p class="muted">Connect a bridge first to continue.</p>
            ` : nothing}

            ${this.step2 === 'ready' ? html`
              <p>
                Home Assistant needs to restart to activate the ESP Tree integration
                ${runningLabel === 'not loaded' ? html`
                  — it will be installed as version ${this.latestIntegrationVersion || 'latest'}.
                ` : html`
                  from ${runningLabel} to ${this.latestIntegrationVersion || 'latest'}.
                `}
              </p>
              <button class="btn btn-primary" @click=${this.handleRestart}>
                Restart Home Assistant
              </button>
            ` : nothing}

            ${this.step2 === 'restarting' ? html`
              <div class="scanning-state">
                <span class="spinner large"></span>
                <p>Sending restart request...</p>
              </div>
            ` : nothing}

            ${this.step2 === 'polling' ? html`
              <div class="polling-state">
                <span class="spinner large"></span>
                <p>Waiting for Home Assistant to come back online...</p>
                ${this.pollingSeconds > 40 ? html`
                  <p class="muted">Taking longer than expected. Check if Home Assistant restarted successfully.</p>
                ` : nothing}
              </div>
            ` : nothing}

            ${this.step2 === 'complete' ? html`
              <div class="complete-state">
                <span class="check">${icon('checkCircle')}</span>
                <span>
                  Home Assistant is running the ESP Tree integration
                  ${this.runningIntegrationVersion ? ` ${this.runningIntegrationVersion}` : ''}
                </span>
              </div>
            ` : nothing}

            ${this.step2 === 'error' && this.restartError ? html`
              <div class="error-block">
                <p>Restart failed: ${this.restartError}</p>
                <button class="btn btn-outline" @click=${this.handleRestart}>Retry</button>
              </div>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
  }

  private renderStep3() {
    return html`
      <div class="step ${this.step3 === 'disabled' ? 'locked' : ''} ${this.step3 === 'complete' ? 'done' : ''}">
        <div class="step-header">
          <span class="step-icon">
            ${this.step3 === 'disabled' ? icon('lock') :
              this.step3 === 'triggering' ? html`<span class="spinner"></span>` :
              this.step3 === 'polling' ? html`<span class="spinner"></span>` :
              this.step3 === 'complete' ? icon('check') :
              this.step3 === 'fallback' ? icon('alert') :
              this.step3 === 'error' ? icon('close') : '3'}
          </span>
          <div class="step-title-area">
            <h2>Add the ESP Tree integration</h2>
            <p class="step-summary">
              ${this.step3 === 'disabled' ? 'Complete step 2 first' :
                this.step3 === 'triggering' ? 'Setting up the ESP Tree integration...' :
                this.step3 === 'polling' ? 'Waiting for integration to activate...' :
                this.step3 === 'complete' ? 'ESP Tree integration is active' :
                this.step3 === 'fallback' ? 'Manual setup required' :
                this.step3 === 'error' ? 'Could not set up integration' : ''}
            </p>
          </div>
        </div>

        <div class="step-body">
          ${this.step3 === 'disabled' ? html`
            <p class="muted">Restart Home Assistant first to continue.</p>
          ` : nothing}

          ${this.step3 === 'triggering' ? html`
            <div class="scanning-state">
              <span class="spinner large"></span>
              <p>Setting up the ESP Tree integration...</p>
            </div>
          ` : nothing}

          ${this.step3 === 'polling' ? html`
            <div class="polling-state">
              <span class="spinner large"></span>
              <p>Waiting for integration to become active...</p>
            </div>
          ` : nothing}

          ${this.step3 === 'complete' ? html`
            <div class="complete-state">
              <span class="check">${icon('checkCircle')}</span>
              <span>
                ESP Tree integration is active
                ${this.runningIntegrationVersion ? ` (${this.runningIntegrationVersion})` : ''}
              </span>
            </div>
          ` : nothing}

          ${this.step3 === 'fallback' ? html`
            <div class="fallback-state">
              <p>Integration created — add it in Devices &amp; Services to activate:</p>
              <div class="fallback-actions">
                <button class="btn btn-outline" @click=${() => window.open('/config/integrations/dashboard', '_blank')}>
                  Open Devices &amp; Services
                </button>
                <button class="btn btn-outline" @click=${() => window.open('/config/integrations/dashboard/add?domain=esp_tree', '_blank')}>
                  Add ESP Tree Integration
                </button>
              </div>
              <button class="btn" @click=${() => { this.integrationFailures = 0; void this.triggerIntegrationSetup(); }}>
                Retry
              </button>
            </div>
          ` : nothing}

          ${this.step3 === 'error' && this.integrationError ? html`
            <div class="error-block">
              <p>Could not set up integration automatically: ${this.integrationError}</p>
              <div class="fallback-actions">
                <button class="btn btn-outline" @click=${() => window.open('/config/integrations/dashboard', '_blank')}>
                  Open Devices &amp; Services
                </button>
                <button class="btn btn-outline" @click=${() => window.open('/config/integrations/dashboard/add?domain=esp_tree', '_blank')}>
                  Add ESP Tree Integration
                </button>
              </div>
              <button class="btn" @click=${() => { this.integrationError = null; void this.triggerIntegrationSetup(); }}>
                Retry
              </button>
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private renderDone() {
    if (this.step1 !== 'complete' || this.step2 !== 'complete' || this.step3 !== 'complete') return nothing;
    return html`
      <div class="step done expanded">
        <div class="step-header">
          <span class="step-icon">${icon('checkCircle')}</span>
          <div class="step-title-area">
            <h2>Setup Complete!</h2>
            <p class="step-summary">Redirecting to topology map...</p>
          </div>
        </div>
        <div class="step-body done-body">
          <button class="btn btn-primary" @click=${this.dismiss}>Go Now</button>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--canvas);
      color: var(--ink);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
    }

    * { box-sizing: border-box; }

    .wizard-page {
      max-width: 680px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .wizard-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--line);
    }

    .wizard-header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: var(--primary);
    }

    .tagline {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: 15px;
    }

    .dismiss-btn {
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--muted);
      padding: 8px 16px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
      border-radius: 8px;
      white-space: nowrap;
      transition: all 0.15s;
    }

    .dismiss-btn:hover {
      border-color: var(--muted);
      color: var(--ink);
    }

    .stepper {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .step {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: opacity 0.2s;
    }

    .step.locked {
      opacity: 0.55;
    }

    .step.done {
      border-color: var(--ok);
    }

    .step.has-error {
      border-color: var(--danger);
    }

    .step-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 18px 20px;
    }

    .step.collapsed .step-header {
      cursor: pointer;
    }

    .step-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background: var(--surface-subtle);
      border-radius: 50%;
      margin-top: 2px;
    }

    .step.complete .step-icon,
    .step.done .step-icon {
      background: var(--ok-soft);
    }

    .step-title-area {
      flex: 1;
    }

    .step-title-area h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .step-summary {
      margin: 4px 0 0;
      font-size: 13px;
      color: var(--muted);
    }

    .collapse-icon {
      font-size: 12px;
      color: var(--muted);
      margin-top: 6px;
    }

    .step-body {
      padding: 0 20px 20px 70px;
    }

    .step.collapsed .step-body {
      display: none;
    }

    .scanning-state,
    .polling-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 0;
      gap: 12px;
    }

    .scanning-state p,
    .polling-state p {
      margin: 0;
      font-size: 14px;
      color: var(--muted);
    }

    .complete-state {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 0;
      font-size: 14px;
      font-weight: 500;
      color: var(--ok);
    }

    .step-body.done-body {
      padding: 0 20px 20px 70px;
    }

    .step-body.done-body .btn {
      margin-top: 4px;
    }

    .check {
      font-size: 18px;
    }

    .bridge-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }

    .bridge-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: var(--surface-subtle);
      border: 1px solid var(--surface-subtle);
      border-radius: 10px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .bridge-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 13px;
    }

    .bridge-info strong {
      font-size: 14px;
    }

    .net-id {
      font-size: var(--text-xs);
      color: var(--muted);
      font-family: monospace;
    }

    .api-key-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .api-key-row input {
      padding: 6px 10px;
      font-size: 13px;
      border: 1px solid var(--line);
      border-radius: 6px;
      width: 180px;
    }

    .manual-toggle {
      margin-bottom: 12px;
    }

    .manual-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      background: var(--surface-subtle);
      border: 1px solid var(--surface-subtle);
      border-radius: 10px;
      margin-bottom: 12px;
    }

    .manual-form label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
    }

    .manual-form input {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-family: inherit;
    }

    .error-block {
      margin-top: 12px;
      padding: 12px 16px;
      background: var(--danger-soft);
      border: 1px solid var(--line);
      border-radius: 8px;
    }

    .error-block p {
      margin: 0 0 8px;
      color: var(--danger);
      font-size: 13px;
    }

    .error-block .hint {
      display: block;
      margin-top: 4px;
      font-size: 12px;
      color: var(--muted);
    }

    .fallback-state {
      padding: 16px;
      background: var(--accent-soft);
      border: 1px solid var(--line);
      border-radius: 8px;
      margin-top: 8px;
    }

    .fallback-state p {
      margin: 0 0 12px;
      font-size: 14px;
    }

    .fallback-actions {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .btn {
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      padding: 8px 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.15s;
    }

    .btn:hover {
      background: var(--surface-subtle);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--primary);
      color: var(--on-primary);
      border-color: var(--primary);
    }

    .btn-primary:hover {
      background: var(--primary);
    }

    .btn-outline {
      border-color: var(--primary);
      color: var(--primary);
      background: transparent;
    }

    .btn-outline:hover {
      background: rgba(11, 59, 75, 0.06);
    }

    .muted {
      color: var(--muted);
      font-size: 13px;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 3px solid rgba(11, 59, 75, 0.2);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .spinner.large {
      width: 32px;
      height: 32px;
      border-width: 4px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 600px) {
      .wizard-page {
        padding: 24px 16px;
      }

      .wizard-header {
        flex-direction: column;
        gap: 12px;
      }

      .step-body {
        padding: 0 16px 16px 54px;
      }

      .bridge-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .flash-form label {
        font-size: var(--text-xs);
      }

      .flash-key-row {
        flex-direction: column;
      }

      .flash-port-row {
        flex-direction: column;
      }
    }

    .choice-cards {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .choice-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      border: 2px solid var(--line);
      border-radius: 12px;
      background: var(--surface);
      cursor: pointer;
      transition: all 0.15s;
      text-align: center;
      font: inherit;
      color: var(--ink);
    }

    .choice-card:hover {
      border-color: var(--primary);
      background: rgba(0, 0, 0, 0.02);
      transform: translateY(-1px);
    }

    .choice-icon {
      font-size: 32px;
      margin-bottom: 8px;
    }

    .choice-card h3 {
      margin: 0 0 8px 0;
      font-size: 15px;
      font-weight: 600;
    }

    .choice-card p {
      margin: 0;
      font-size: 13px;
      color: var(--muted);
      line-height: 1.4;
    }

    .choice-back {
      margin-bottom: 12px;
    }

    .step-tabs {
      display: flex;
      gap: 0;
      margin-bottom: 16px;
      border-bottom: 2px solid var(--line);
    }

    .tab {
      padding: 10px 18px;
      border: none;
      background: transparent;
      color: var(--muted);
      font: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.15s;
    }

    .tab:hover {
      color: var(--ink);
    }

    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .flash-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 16px;
      background: var(--surface-subtle);
      border: 1px solid var(--surface-subtle);
      border-radius: 10px;
    }

    .flash-form label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
    }

    .flash-form input,
    .flash-form select {
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      font-family: inherit;
      background: var(--surface);
    }

    .flash-form select {
      cursor: pointer;
    }

    .flash-warning {
      padding: 10px 14px;
      background: var(--accent-soft);
      border: 1px solid var(--line);
      border-radius: 8px;
      font-size: 13px;
      color: var(--accent);
    }

    .transport-badge {
      display: inline-block;
      align-self: flex-start;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--info-soft);
      border: 1px solid var(--line);
      color: var(--primary);
      font-size: 12px;
      font-weight: 600;
    }

    .prefill-tag {
      display: inline-block;
      margin-left: 6px;
      padding: 1px 7px;
      border-radius: 999px;
      background: var(--ok-soft);
      border: 1px solid var(--line);
      color: var(--ok);
      font-size: var(--text-xs);
      font-weight: 600;
      text-transform: none;
      letter-spacing: 0.02em;
      vertical-align: middle;
    }

    .advanced-section {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      padding: 0 12px;
    }

    .advanced-section summary {
      cursor: pointer;
      padding: 10px 0;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      text-transform: uppercase;
      list-style: none;
    }

    .advanced-section summary::-webkit-details-marker {
      display: none;
    }

    .advanced-section summary::before {
      content: '▸';
      display: inline-block;
      margin-right: 6px;
      transition: transform 0.15s;
    }

    .advanced-section[open] summary::before {
      transform: rotate(90deg);
    }

    .advanced-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-bottom: 12px;
    }

    .flash-key-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .flash-key-row input {
      flex: 1;
    }

    .flash-port-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .flash-port-row select {
      flex: 1;
    }

    .btn-sm {
      padding: 4px 10px;
      font-size: 12px;
    }

    .chip-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
    }

    .chip-badge.detected {
      background: var(--ok-soft);
      color: var(--ok);
      border: 1px solid var(--line);
    }

    .chip-badge.detecting {
      background: var(--info-soft);
      color: var(--primary);
      border: 1px solid var(--line);
    }

    .chip-badge.error {
      background: var(--danger-soft);
      color: var(--danger);
      border: 1px solid var(--line);
      flex-wrap: wrap;
    }

    .chip-board-info {
      font-size: var(--text-xs);
      color: var(--muted);
      font-weight: 400;
    }

    .flash-stage-indicator {
      display: flex;
      align-items: center;
      gap: 0;
      margin-bottom: 16px;
      padding: 12px 0;
    }

    .stage-dot {
      font-size: 12px;
      font-weight: 500;
      color: var(--muted);
      padding: 4px 10px;
      border-radius: 12px;
      white-space: nowrap;
    }

    .stage-dot.active {
      color: var(--primary);
      background: var(--info-soft);
      font-weight: 600;
    }

    .stage-dot.done {
      color: var(--ok);
      background: var(--ok-soft);
    }

    .stage-line {
      flex: 1;
      height: 2px;
      background: var(--line);
      min-width: 12px;
    }

    .stage-line.done {
      background: var(--ok);
    }

    .flash-progress-area {
      padding: 16px 0;
    }

    .flash-progress-area h3 {
      margin: 0 0 8px;
      font-size: 16px;
    }

    .flash-log-viewer {
      max-height: 200px;
      overflow-y: auto;
      font-family: monospace;
      font-size: var(--text-xs);
      background: var(--log-bg);
      color: var(--log-ink);
      padding: 12px;
      border-radius: 8px;
      white-space: pre-wrap;
      word-break: break-all;
      margin-top: 12px;
    }

    .compile-status-label {
      font-style: italic;
      margin: 4px 0;
    }

    .flash-error-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .flash-log-details {
      margin-top: 12px;
    }

    .flash-log-details summary {
      cursor: pointer;
      font-size: 13px;
      color: var(--muted);
    }

    .progress-bar-container {
      width: 100%;
      height: 8px;
      background: var(--line);
      border-radius: 4px;
      overflow: hidden;
      margin: 8px 0;
    }

    .progress-bar {
      height: 100%;
      background: var(--primary);
      border-radius: 4px;
      transition: width 0.3s;
    }

    /* ---- Setup shell: HA-native, shared tokens ---- */
    .setup-bar { background: var(--toolbar); color: var(--toolbar-ink); }
    .setup-bar-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; max-width: 760px; height: var(--toolbar-h); margin: 0 auto; padding: 0 24px; }
    .setup-brand { display: inline-flex; align-items: center; gap: 10px; font-size: var(--text-xl); font-weight: 500; }
    .setup-brand .brand-mark { width: 26px; height: 26px; color: var(--toolbar-indicator); }
    .dismiss-btn { min-height: 36px; padding: 0 14px; border: 1px solid rgba(255,255,255,.3); border-radius: var(--radius-md); background: transparent; color: var(--toolbar-ink); font: inherit; font-size: var(--text-md); font-weight: 500; cursor: pointer; }
    .dismiss-btn:hover { background: var(--toolbar-hover); }
    .wizard-page { max-width: 760px; padding: 24px 24px 56px; }
    .wizard-header { display: block; margin-bottom: 20px; padding-bottom: 0; border-bottom: 0; }
    .wizard-header h1 { margin: 0; color: var(--ink); font-size: var(--text-2xl); line-height: 1.2; font-weight: 500; }
    .tagline { margin: 4px 0 0; color: var(--muted); font-size: var(--text-md); line-height: 1.45; }
    .stepper { gap: 12px; }
    .step { border: 1px solid var(--line); border-radius: var(--radius-lg); background: var(--surface); box-shadow: none; }
    .step.disabled, .step.locked { opacity: 0.7; }
    .step-header { padding: 16px; gap: 14px; }
    .step-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: var(--surface-subtle); color: var(--muted); font-size: var(--text-md); font-weight: 500; margin-top: 0; }
    .step-icon svg { width: 18px; height: 18px; }
    .step.done .step-icon, .step.complete .step-icon { background: var(--ok-soft); color: var(--ok); }
    .step.has-error .step-icon { background: var(--danger-soft); color: var(--danger); }
    .step-title-area h2 { color: var(--ink); font-size: var(--text-lg); font-weight: 500; letter-spacing: 0; }
    .step-summary { margin-top: 2px; color: var(--muted); font-size: var(--text-sm); }
    .collapse-icon svg { width: 18px; height: 18px; color: var(--muted); }
    .step-body, .step-body.done-body { padding: 0 16px 18px 62px; }
    .choice-cards { display: grid !important; grid-template-columns: 1fr; gap: 0; margin-bottom: 14px; border-top: 1px solid var(--line); }
    .choice-card { display: grid !important; grid-template-columns: 36px 1fr; column-gap: 14px; align-items: center; min-height: 0; padding: 14px 8px; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; color: var(--ink); text-align: left; transition: background-color 150ms ease; }
    .choice-card:hover { background: var(--surface-hover); transform: none; box-shadow: none; }
    .choice-card .choice-icon { grid-row: 1 / 3; }
    .choice-icon { display: grid; place-items: center; width: 36px; height: 36px; margin-bottom: 0; border: 0; border-radius: 50%; background: var(--primary-soft); color: var(--primary); }
    .choice-icon svg { width: 20px; height: 20px; }
    .choice-card h3 { margin: 0 0 4px !important; font-size: var(--text-md) !important; font-weight: 500 !important; }
    .choice-card p { color: var(--muted); font-size: var(--text-sm) !important; line-height: 1.5 !important; }
    .tab { padding: 10px 14px; font-size: var(--text-md); font-weight: 500; color: var(--muted); }
    .tab.active { border-bottom-color: var(--primary); color: var(--primary); }
    .step-tabs { margin-bottom: 14px; border-bottom: 1px solid var(--line); }
    .flash-form, .manual-form { padding: 16px; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface-subtle); }
    .flash-form label, .manual-form label { color: var(--ink-2); font-size: var(--text-sm); font-weight: 500; letter-spacing: 0; text-transform: none; }
    .flash-form input, .flash-form select, .manual-form input, .api-key-row input { min-height: 40px; padding: 8px 12px; border: 1px solid var(--line-strong); border-radius: var(--radius-md); background: var(--surface); color: var(--ink); font: inherit; font-size: var(--text-md); }
    .flash-form input:focus, .flash-form select:focus, .manual-form input:focus, .api-key-row input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary); }
    .bridge-card { padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--surface); }
    .bridge-info { font-size: var(--text-sm); color: var(--muted); }
    .bridge-info strong { font-size: var(--text-md); font-weight: 500; color: var(--ink); }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 36px; padding: 0 14px; border: 1px solid var(--line-strong); border-radius: var(--radius-md); background: var(--surface); color: var(--ink); font: inherit; font-size: var(--text-md); font-weight: 500; cursor: pointer; }
    .btn:hover:not(:disabled) { background: var(--surface-hover); }
    .btn:disabled { opacity: .5; cursor: not-allowed; }
    .btn svg { width: 18px; height: 18px; }
    .btn-primary { border-color: var(--primary); background: var(--primary); color: var(--on-primary); }
    .btn-primary:hover:not(:disabled) { background: var(--primary-strong); border-color: var(--primary-strong); }
    .btn-outline { border-color: var(--line-strong); color: var(--ink); background: transparent; }
    .btn-outline:hover:not(:disabled) { background: var(--surface-hover); }
    .btn-sm { min-height: 30px; padding: 0 10px; font-size: var(--text-sm); }
    .btn-sm svg { width: 16px; height: 16px; }
    .transport-badge { padding: 2px 8px; border: 0; border-radius: 999px; background: var(--surface-subtle); color: var(--ink-2); font-size: var(--text-xs); }
    .prefill-tag { background: var(--primary-soft); border-color: transparent; color: var(--primary); font-size: var(--text-xs); }
    .advanced-section { border-color: var(--line); background: var(--surface-subtle); }
    .advanced-section summary { color: var(--ink-2); font-size: var(--text-sm); font-weight: 500; }
    .flash-warning, .fallback-state { border: 0; background: var(--accent-soft); color: var(--ink); font-size: var(--text-md); }
    .error-block { border: 0; background: var(--danger-soft); }
    .error-block p { color: var(--danger); font-size: var(--text-md); }
    .chip-badge { font-size: var(--text-xs); }
    .chip-badge.detected { border-color: transparent; background: var(--ok-soft); color: var(--ok); }
    .chip-badge.detecting { border-color: transparent; background: var(--info-soft); color: var(--info); }
    .chip-badge.error { border-color: transparent; background: var(--danger-soft); color: var(--danger); }
    .stage-dot.active { background: var(--primary-soft); color: var(--primary); }
    .stage-dot.done { background: var(--ok-soft); color: var(--ok); }
    .flash-log-viewer { background: var(--log-bg); color: var(--log-ink); font-family: var(--font-mono); font-size: var(--text-xs); border-radius: var(--radius-md); }
    .progress-bar-container { background: var(--surface-subtle); }
    .check svg { width: 20px; height: 20px; color: var(--ok); }
    :focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    @media (max-width: 620px) {
      .setup-bar-inner { padding: 0 16px; }
      .wizard-page { padding: 18px 16px 40px; }
      .step-body, .step-body.done-body { padding: 0 16px 16px; }
      .choice-cards { flex-direction: column; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
  `;
}
