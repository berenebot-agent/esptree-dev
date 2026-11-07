import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ChipInfo, api, normalizeMac } from '../api/client';
import '../components/compile-log-viewer';
import { shared } from '../styles/shared';
import { icon } from '../styles/icons';
import { acquirePort, openInstallDialog, detectChip as detectConnectedChip, usbFlashSupported } from '../lib/browser-flash';

/**
 * Create Remote wizard.
 *
 * Flashes a brand-new ESP-NOW remote entirely in the browser: the add-on compiles
 * the firmware, then esp-web-tools writes it over Web Serial from the user's own
 * machine. No add-on serial port is involved, so this works when the remote is
 * plugged into the computer rather than the HA host.
 *
 * Deliberately separate from `setup-page.ts`: that wizard owns bridge provisioning
 * (a bridges row, WiFi credentials, a serial client), which a remote must not have.
 *
 * ESP-NOW credentials are read from the configured bridge rather than typed here,
 * because a remote whose network id/PSK differ from the bridge's simply cannot join.
 */
@customElement('esp-remote-wizard')
export class EspRemoteWizard extends LitElement {
  @state() private name = 'espnow-remote';
  @state() private chips: ChipInfo[] = [];
  @state() private chipName = '';
  @state() private loadingChips = false;
  @state() private detectingChip = false;
  @state() private chipDetectionError = '';
  @state() private detectedChipName = '';

  @state() private networkId = '';
  @state() private psk = '';
  @state() private bridgeName = '';
  @state() private credentialsComplete = false;
  @state() private networkIdSource = '';
  @state() private pskSource = '';
  @state() private credentialsMismatch = false;
  @state() private bridgeNetworkId = '';
  @state() private loadingCredentials = false;

  @state() private stage: 'config' | 'compiling' | 'ready' | 'flashing' | 'done' | 'error' = 'config';
  @state() private error = '';
  @state() private mac = '';
  @state() private esphomeName = '';
  @state() private compilePercent = 0;
  @state() private compileStatus = '';

  @state() private manifestUrl = '';
  @state() private firmwareBlobUrl = '';
  @state() private preparingManifest = false;
  @state() private usbSupported = true;
  @state() private flashError = '';
  @state() private flashing = false;
  /**
   * Set when the dialog is closed without first confirming completion.
   *
   * A successful write still shows the dialog's "Next" button, and the user may close out
   * instead of pressing it — so the automatic advance can be missed. In that one case we
   * surface a manual continue rather than leaving the wizard stuck.
   */
  @state() private flashNeedsConfirm = false;
  /**
   * A port the browser has already granted (from the detect step). Passing it to the
   * install dialog is what removes the browser's second device chooser.
   */
  private browserFlashPort: SerialPort | null = null;
  /**
   * True when the user pressed "Compile & install": flash starts by itself once the build
   * finishes. The USB port was chosen on that click (the only moment the browser allows a
   * chooser), so no further click is needed.
   */
  @state() private autoInstall = false;

  /**
   * Post-flash Home Assistant integration status.
   *
   * Appearing in the topology is NOT the same as appearing in Home Assistant. The
   * remote only becomes usable HA entities once the ESP Tree integration has a config
   * entry for it, and that happens through the integration's own discovery flow. Until
   * then the device-detail hero link reads "Entities: Not Yet Added" and points at
   * /config/integrations/dashboard/add?domain=esp_tree -- which, when the hub
   * integration is already installed, starts a user flow that immediately aborts
   * `already_configured`. A dead end that looks like it should have worked.
   *
   * `undefined` = still checking, so we do not flash a misleading prompt.
   */
  @state() private haStatus: 'checking' | 'waiting-for-join' | 'managed' | 'unmanaged' = 'checking';
  @state() private haDeviceId = '';
  @state() private haBusy = false;
  @state() private haNotice = '';

  private haPollTimer: ReturnType<typeof setInterval> | null = null;
  private haPollAttempts = 0;
  private static readonly HA_POLL_INTERVAL_MS = 5000;
  /** The remote has to boot, join the mesh and be seen by the bridge first. */
  private static readonly HA_POLL_MAX_ATTEMPTS = 12;

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.usbSupported = this.detectUsbSupport();
    void this.loadChips();
    void this.loadCredentials();
  }

  disconnectedCallback(): void {
    this.clearPoll();
    this.clearHaPoll();
    this.clearManifestUrls();
    super.disconnectedCallback();
  }

  private detectUsbSupport(): boolean {
    return usbFlashSupported();
  }

  /**
   * Detect the connected chip from this browser, where the USB device is plugged in.
   *
   * The granted port is kept (`browserFlashPort`) so the flash step needs no second
   * chooser from the browser.
   */
  private async detectChip(forcePicker = false): Promise<void> {
    this.chipDetectionError = '';
    this.detectedChipName = '';
    this.detectingChip = true;

    try {
      if (!this.detectUsbSupport()) {
        throw new Error('USB chip detection requires Chrome or Edge on a secure HTTPS page. You can select the chip manually instead.');
      }
      const port = await acquirePort({ forcePicker });
      if (port === 'cancelled') {
        this.detectingChip = false;
        return;
      }
      // Keep the granted port: the flash step reuses it instead of re-prompting.
      this.browserFlashPort = port;

      const { detected, family } = await detectConnectedChip(port);
      const supportedChip = family && this.chips.find((chip) => chip.chip_name.toUpperCase() === family);
      if (!family || !supportedChip) {
        throw new Error(`Detected ${detected}, but this chip is not in the supported firmware list. Choose a supported chip manually.`);
      }
      this.chipName = supportedChip.chip_name;
      this.detectedChipName = detected;
    } catch (err) {
      this.chipDetectionError = err instanceof Error ? err.message : String(err);
    } finally {
      this.detectingChip = false;
    }
  }

  private clearPoll(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  /** esp-web-tools holds this URL until it flashes; revoke to avoid a leak. */
  private clearManifestUrls(): void {
    if (this.manifestUrl) {
      URL.revokeObjectURL(this.manifestUrl);
      this.manifestUrl = '';
    }
    if (this.firmwareBlobUrl) {
      URL.revokeObjectURL(this.firmwareBlobUrl);
      this.firmwareBlobUrl = '';
    }
  }

  private async loadChips(): Promise<void> {
    this.loadingChips = true;
    try {
      const res = await api.getChips();
      this.chips = res.chips ?? [];
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.loadingChips = false;
    }
  }

  /** Credentials come from the configured bridge, not from user input. */
  private async loadCredentials(): Promise<void> {
    this.loadingCredentials = true;
    try {
      const res = await api.getBridgeNetworkCredentials();
      this.networkId = res.network_id ?? '';
      this.psk = res.psk ?? '';
      this.bridgeName = res.bridge_name ?? '';
      this.credentialsComplete = Boolean(res.complete);
      this.networkIdSource = res.network_id_source ?? '';
      this.pskSource = res.psk_source ?? '';
      this.credentialsMismatch = Boolean(res.mismatch);
      this.bridgeNetworkId = res.bridge_network_id ?? '';
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.loadingCredentials = false;
    }
  }

  private get selectedChip(): ChipInfo | undefined {
    return this.chips.find((c) => c.chip_name === this.chipName);
  }

  private get chipFamily(): string | null {
    // The registry keys are already esp-web-tools families (ESP32-C6 etc).
    return this.chipName || null;
  }

  private canSubmit(opts: { chipOptional?: boolean } = {}): boolean {
    // A chip the API marks unbuildable must not be submittable: the job would run
    // for minutes and end in a compiler error about a header that is absent by
    // design. Refuse here and let the reason render under the chip field.
    if (this.selectedChip?.buildable === false) return false;
    const chipOk = opts.chipOptional ? !this.chipName || Boolean(this.selectedChip) : Boolean(this.chipName && this.selectedChip);
    return Boolean(this.name.trim() && chipOk && this.networkId.trim() && this.psk.trim());
  }

  /**
   * One click: choose the board, confirm the chip, compile, then flash.
   *
   * The port is chosen here because `requestPort()` needs a user gesture and the build
   * takes minutes -- by the time it finishes the click is long gone. A granted port stays
   * valid, so the install dialog can open it later with no further click.
   */
  private async compileAndInstall(): Promise<void> {
    if (!this.canSubmit({ chipOptional: true })) return;
    this.chipDetectionError = '';
    this.flashError = '';
    this.flashNeedsConfirm = false;
    try {
      const port = this.browserFlashPort ?? (await acquirePort());
      if (port === 'cancelled') return;
      this.browserFlashPort = port;

      // Identify the board now, even when a chip is already selected: a mismatch between
      // the chosen chip and the plugged-in board would otherwise flash the wrong image.
      this.detectingChip = true;
      const { detected, family } = await detectConnectedChip(port);
      const supported = family && this.chips.find((c) => c.chip_name.toUpperCase() === family);
      if (!family || !supported) {
        throw new Error(`Detected ${detected}, but this chip is not in the supported firmware list. Choose a different device or select a chip and use Compile only.`);
      }
      if (this.chipName && this.chipName.toUpperCase() !== family) {
        throw new Error(`The connected board is ${detected}, but ${this.chipName} is selected. Choose the matching chip, or pick a different device.`);
      }
      this.chipName = supported.chip_name;
      this.detectedChipName = detected;
    } catch (err) {
      this.chipDetectionError = err instanceof Error ? err.message : String(err);
      return;
    } finally {
      this.detectingChip = false;
    }
    this.autoInstall = true;
    await this.submit();
  }

  private async submit(): Promise<void> {
    const chip = this.selectedChip;
    if (!this.canSubmit() || !chip) return;
    this.error = '';
    this.stage = 'compiling';
    this.compilePercent = 0;
    this.compileStatus = '';
    try {
      const res = await api.submitFlashWizard({
        name: this.name.trim(),
        // Send the resolved credentials back so the server can verify this remote is
        // joining the configured network. A remote never writes secrets.yaml.
        network_id: this.networkId.trim(),
        psk: this.psk.trim(),
        // A remote has no WiFi: leave these empty so nothing wifi-shaped is written.
        wifi_ssid: '',
        wifi_password: '',
        api_key: '',
        espnow_mode: 'lr',
        ota_password: '',
        chip_name: this.chipName,
        // Carry `variant` through when the chip registry supplies it. Without it the
        // generated YAML has no `variant:` line, so ESPHome cannot resolve the SoC's
        // UART0 pins for anything that needs them (the serial scaffold) and a
        // pinless `uart:` block reaches the compiler. The bridge wizard hardcoded
        // its variants for this reason; a remote must not silently lose it just
        // because the registry grew the field.
        board_info: {
          platform: chip.platform,
          board: chip.board,
          framework: chip.framework,
          ...(chip.variant ? { variant: chip.variant } : {}),
        },
        transport: 'espnow',
        kind: 'remote',
      });
      this.mac = res.mac;
      this.esphomeName = res.esphome_name;
      this.startCompilePoll();
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      this.stage = 'error';
    }
  }

  private startCompilePoll(): void {
    this.clearPoll();
    this.pollTimer = setInterval(() => {
      void this.pollCompile();
    }, 3000);
    void this.pollCompile();
  }

  private async pollCompile(): Promise<void> {
    if (!this.mac) return;
    try {
      // Use the per-device compile status, not the flash-wizard status: the latter
      // reports only *active* jobs and drops back to "idle" the instant a build
      // reaches its terminal state, so the wizard would wait forever.
      const status = await api.getCompileStatus(this.mac);
      const state = status.status || 'idle';
      this.compileStatus = state;
      if (state === 'compiled') {
        this.compilePercent = 100;
        this.clearPoll();
        this.stage = 'ready';
        void this.prepareManifest().then(() => {
          if (this.autoInstall && this.manifestUrl && this.browserFlashPort) void this.flashInBrowser();
        });
        return;
      }
      if (state === 'failed') {
        this.clearPoll();
        this.error = status.error || 'Compilation failed';
        this.stage = 'error';
        return;
      }
      if (state === 'compile_queued') {
        const position = status.queue_position ?? 1;
        this.compilePercent = Math.max(5, 100 - position * 10);
      } else if (state === 'compiling') {
        this.compilePercent = Math.max(this.compilePercent, 10);
      } else {
        this.compilePercent = Math.max(this.compilePercent, 2);
      }
    } catch {
      // Keep polling through transient errors.
    }
  }

  private get compileStatusLabel(): string {
    const name = this.esphomeName || this.name.trim();
    if (this.compileStatus === 'compile_queued') return `Queued to compile ${name}`;
    if (this.compileStatus === 'idle') return `Waiting for the compiler`;
    return `Compiling ${name}`;
  }

  /**
   * Hand esp-web-tools the compiled factory image.
   *
   * The factory .bin is the full merged image (bootloader + partitions + app), which
   * is what a blank device needs; the .ota.bin is an update image and cannot be
   * flashed to empty flash. The manifest must be a blob URL because the ingress path
   * is not a stable absolute URL for the component to fetch back.
   */
  private async prepareManifest(): Promise<void> {
    if (!this.mac) return;
    const chipFamily = this.chipFamily;
    if (!chipFamily) {
      this.error = 'Could not determine the chip family for browser flashing.';
      return;
    }
    this.preparingManifest = true;
    try {
      const resp = await fetch(api.downloadFactoryBinary(this.mac));
      if (!resp.ok) {
        this.error =
          'Compiled, but no factory image is available for browser flashing. Check the queue page for the build log.';
        return;
      }
      const firmwareBlobUrl = URL.createObjectURL(await resp.blob());
      const manifest = {
        name: this.esphomeName || this.name.trim(),
        version: 'compiled',
        // No erase prompt: this is a factory image written to a blank device, and the
        // decision was already made by pressing Compile. The dialog erases without asking
        // when this is false and the device reports no Improv.
        new_install_prompt_erase: false,
        // The remote firmware implements no Improv (no `improv_serial:` anywhere in
        // device_code/), so the dialog's post-write Improv probe can only ever time out.
        // 0 skips it instead of stalling for the 10 s default.
        new_install_improv_wait_time: 0,
        builds: [{ chipFamily, parts: [{ path: firmwareBlobUrl, offset: 0 }] }],
      };
      const manifestUrl = URL.createObjectURL(
        new Blob([JSON.stringify(manifest)], { type: 'application/json' }),
      );
      this.clearManifestUrls();
      this.manifestUrl = manifestUrl;
      this.firmwareBlobUrl = firmwareBlobUrl;
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    } finally {
      this.preparingManifest = false;
    }
  }

  /**
   * Open the install dialog against the compiled remote firmware.
   *
   * Called from a click so the `requestPort()` fallback still has its user activation; when
   * the chip was detected earlier in this wizard the held port is passed straight in and the
   * browser shows no second chooser.
   */
  private async flashInBrowser(): Promise<void> {
    if (!this.manifestUrl) return;
    this.flashError = '';
    this.flashing = true;
    try {
      const result = await openInstallDialog({
        manifestUrl: this.manifestUrl,
        port: this.browserFlashPort,
        // Advances the wizard to the Home Assistant step as soon as the write completes,
        // so no manual "I've flashed it" click is needed in the normal path.
        onFinished: () => void this.onBrowserFlashDone(),
        onClosed: () => {
          // Closed without the automatic advance firing: the write may well have succeeded
          // (successful writes wait for the dialog's own "Next"), so offer a manual continue
          // rather than silently doing nothing.
          if (this.stage !== 'done') this.flashNeedsConfirm = true;
        },
      });
      if (result === 'cancelled') {
        this.flashError = 'No USB device was selected.';
      }
    } catch (err) {
      this.flashError = err instanceof Error ? err.message : String(err);
    } finally {
      this.flashing = false;
    }
  }

  /** The install dialog has finished writing the firmware. */
  private async onBrowserFlashDone(): Promise<void> {
    this.clearPoll();
    try {
      await api.finalizeFlashWizard();
    } catch {
      // The placeholder is cosmetic; the remote is added by topology upsert.
    }
    this.clearManifestUrls();
    this.stage = 'done';
    this.watchForHaIntegration();
  }

  // --- post-flash Home Assistant integration ----------------------------

  /**
   * Poll until the remote shows up in the topology, then report whether Home
   * Assistant actually manages it.
   *
   * Two genuinely different states, which the old single "Not Yet Added" link
   * conflated into one useless link:
   *  - the integration has no entry for this remote yet -> it still needs adding;
   *  - the integration has an entry -> show the way to the HA device page.
   */
  private watchForHaIntegration(): void {
    this.clearHaPoll();
    this.haStatus = 'checking';
    this.haDeviceId = '';
    this.haPollAttempts = 0;
    void this.checkHaIntegration();
    this.haPollTimer = setInterval(
      () => void this.checkHaIntegration(),
      EspRemoteWizard.HA_POLL_INTERVAL_MS,
    );
  }

  private clearHaPoll(): void {
    if (this.haPollTimer) {
      clearInterval(this.haPollTimer);
      this.haPollTimer = null;
    }
  }

  private async checkHaIntegration(): Promise<void> {
    if (!this.mac) return;
    this.haPollAttempts += 1;
    try {
      const nodes = await api.topology(true);
      const mine = nodes.find(
        (n) => normalizeMac(n.mac) === normalizeMac(this.mac),
      );
      if (!mine) {
        // Not seen by the bridge yet -- normal for the first few seconds after a
        // flash, since the remote has to boot and join.
        this.haStatus = 'waiting-for-join';
      } else if (mine.ha_device_id) {
        this.haStatus = 'managed';
        this.haDeviceId = mine.ha_device_id;
        this.clearHaPoll();
        return;
      } else {
        this.haStatus = 'unmanaged';
      }
    } catch {
      this.haStatus = 'waiting-for-join';
    }
    if (this.haPollAttempts >= EspRemoteWizard.HA_POLL_MAX_ATTEMPTS) {
      this.clearHaPoll();
    }
  }

  /**
   * Ask the integration to add any remote it has discovered but not yet added.
   *
   * This is the fix for the /config/integrations/dashboard/add?domain=esp_tree dead
   * end: that URL starts a `user` flow, which aborts `already_configured` when the
   * hub is installed, so it can never add a *remote*. The add-on's
   * /api/integration/setup runs the discovery path instead.
   */
  private async addToHomeAssistant(): Promise<void> {
    if (this.haBusy) return;
    this.haBusy = true;
    this.haNotice = '';
    try {
      const result = await api.integrationSetup();
      if (!result.success && result.error) {
        this.haNotice = result.error;
      }
      await this.checkHaIntegration();
      if (this.haStatus !== 'managed') {
        // The integration creates entries asynchronously, so give the next poll a
        // chance before telling the user anything discouraging.
        this.haPollAttempts = 0;
        this.clearHaPoll();
        this.haPollTimer = setInterval(
          () => void this.checkHaIntegration(),
          EspRemoteWizard.HA_POLL_INTERVAL_MS,
        );
      }
    } catch (err) {
      this.haNotice = err instanceof Error ? err.message : String(err);
    } finally {
      this.haBusy = false;
    }
  }

  private startOver(): void {
    this.clearPoll();
    this.clearHaPoll();
    this.stage = 'config';
    this.autoInstall = false;
    this.error = '';
    this.compileStatus = '';
    this.compilePercent = 0;
    this.mac = '';
    this.esphomeName = '';
    this.haStatus = 'checking';
    this.haDeviceId = '';
    this.haNotice = '';
  }

  /**
   * The "make it appear in Home Assistant" step.
   *
   * The topology view is an add-on screen; Home Assistant entities only exist once the
   * integration holds a config entry for the remote. That step was previously invisible
   * here and the only pointer the user got was the red "Entities: Not Yet Added" badge
   * on the device page, which links to the generic add-integration page and cannot
   * succeed while the hub integration is already installed.
   */
  private renderSteps() {
    const order = ['config', 'compiling', 'ready', 'done'] as const;
    const stage = this.stage === 'flashing' ? 'ready' : this.stage === 'error' ? 'config' : this.stage;
    const at = order.indexOf(stage as typeof order[number]);
    const labels = ['Describe', 'Build', 'Flash', 'Join'];
    return html`<ol class="steps" aria-label="Progress">
      ${labels.map((label, i) => html`<li class=${i < at ? 'done' : i === at ? 'current' : ''} aria-current=${i === at ? 'step' : 'false'}>
        <span class="n">${i < at ? icon('check') : i + 1}</span>${label}</li>`)}
    </ol>`;
  }

  private renderHaIntegrationStep() {
    if (this.haStatus === 'managed') {
      return html`
        <div class="ha-step ha-ok">
          <span class="ha-icon ok">${icon('checkCircle')}</span>
          <div>
            <strong>Added to Home Assistant</strong>
            <p class="hint">
              This remote's entities are available in Home Assistant.
            </p>
            <a class="btn" href=${`/config/devices/device/${this.haDeviceId}`} target="_top" rel="noopener">
              Open device in Home Assistant
            </a>
          </div>
        </div>
      `;
    }

    if (this.haStatus === 'checking' || this.haStatus === 'waiting-for-join') {
      return html`
        <div class="ha-step">
          <span class="ha-icon"><span class="spinner"></span></span>
          <div>
            <strong>Waiting for the remote to join</strong>
            <p class="hint">
              Once the bridge sees it, this step adds it to Home Assistant so its entities appear.
            </p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="ha-step ha-action">
        <span class="ha-icon warn">${icon('ha')}</span>
        <div>
          <strong>Last step: add it to Home Assistant</strong>
          <p class="hint">
            The remote is on the mesh, but Home Assistant has no device for it yet, so its
            entities are not available. Add it here — the integration detects it
            automatically. (Adding it from Devices &amp; Services does not work; that page
            can only install the integration itself, which is already installed.)
          </p>
          ${this.haNotice ? html`<p class="hint ha-error">${this.haNotice}</p>` : nothing}
          <button class="btn primary" ?disabled=${this.haBusy} @click=${() => void this.addToHomeAssistant()}>
            ${this.haBusy ? 'Adding…' : 'Add to Home Assistant'}
          </button>
        </div>
      </div>
    `;
  }

  private credentialsLabel(): string {
    if (this.loadingCredentials) return 'loading…';
    if (!this.credentialsComplete) return 'not configured';
    return this.bridgeName ? `from bridge ${this.bridgeName}` : 'from secrets.yaml';
  }

  private sourceLabel(source: string): string {
    if (!source || source === 'missing') return 'missing';
    return `from ${source}`;
  }

  render() {
    return html`
      <div class="page remote-page">
        <div>
          <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Network</a>${icon('chevronRight')}<span aria-current="page">Add remote</span></nav>
          <div class="page-head">
            <div>
              <h1>Add a remote</h1>
              <p class="sub">Plug a board into this computer by USB. The add-on builds ESP-NOW firmware, your browser writes it, and the remote joins on its own.</p>
            </div>
          </div>
        </div>
        ${this.renderSteps()}
      <section class="card">
        <div class="card-body">
          ${this.error ? html`<div class="notice danger" role="alert">${icon('alert')}<span>${this.error}</span></div>` : nothing}

          ${this.stage === 'config'
            ? html`
                <label class="field">
                  <span>Device name</span>
                  <input
                    type="text"
                    .value=${this.name}
                    @input=${(e: Event) => { this.name = (e.target as HTMLInputElement).value; }}
                  />
                </label>

                <label class="field">
                  <span>Chip</span>
                  <select
                    .value=${this.chipName}
                    @change=${(e: Event) => {
                      this.chipName = (e.target as HTMLSelectElement).value;
                      this.detectedChipName = '';
                    }}
                    ?disabled=${this.loadingChips || this.chips.length === 0}
                  >
                    ${this.loadingChips
                      ? html`<option value="">Loading chips…</option>`
                      : html`<option value="">Select a chip…</option>`
                    }
                    ${this.chips.map(
                      (c) => html`<option value=${c.chip_name} ?disabled=${c.buildable === false} ?selected=${c.chip_name === this.chipName}>
                            ${c.chip_name} — ${c.board}${c.buildable === false ? ' (not buildable)' : ''}
                          </option>`,
                    )}
                  </select>

                  ${this.selectedChip && this.selectedChip.buildable === false
                    ? html`<span class="hint warn-text">${this.selectedChip.unbuildable_reason}</span>`
                    : nothing}
                </label>

                <div class="chip-detect">
                  <button class="btn" ?disabled=${this.detectingChip || this.loadingChips} @click=${() => void this.detectChip()}>
                    ${this.detectingChip ? html`<span class="spinner"></span>Detecting…` : html`${icon('usb')}Detect from USB`}
                  </button>
                  ${this.usbSupported
                    ? html`<button class="btn" ?disabled=${this.detectingChip || this.loadingChips} @click=${() => void this.detectChip(true)}>
                        Choose a different device…
                      </button>`
                    : nothing}
                  ${this.detectedChipName
                    ? html`<span class="hint">Detected ${this.detectedChipName}; selected ${this.chipName}.</span>`
                    : nothing}
                  ${this.chipDetectionError
                    ? html`<span class="hint warn-text">${this.chipDetectionError}</span>`
                    : nothing}
                  ${!this.usbSupported
                    ? html`<span class="hint">Automatic detection needs Chrome or Edge on a secure HTTPS page. Manual chip selection is available.</span>`
                    : nothing}
                </div>

                <div class="creds notice ${this.credentialsComplete ? 'ok' : 'warn'}">
                  ${icon(this.credentialsComplete ? 'lock' : 'alert')}
                  <div class="creds-body">
                  <div class="creds-row">
                    <strong>ESP-NOW network</strong>
                    <span>${this.credentialsLabel()}</span>
                  </div>
                  ${this.credentialsComplete
                    ? html`<div class="creds-row">
                          <span>Network ID <small class="src">${this.sourceLabel(this.networkIdSource)}</small></span>
                          <code>${this.networkId}</code>
                        </div>
                        <div class="creds-row">
                          <span>PSK <small class="src">${this.sourceLabel(this.pskSource)}</small></span>
                          <code>••••••••</code>
                        </div>`
                    : html`<p class="hint">
                        No ESP-NOW credentials found${this.bridgeName
                          ? html` for bridge <strong>${this.bridgeName}</strong>`
                          : nothing}.
                        A remote cannot join without them — configure a bridge first, or add
                        <code>espnow_network_id</code> and <code>espnow_psk</code> to secrets.yaml.
                      </p>`}
                  ${this.credentialsComplete
                    ? html`<p class="hint">
                        Taken from secrets.yaml so the remote matches what the bridge is running.
                      </p>`
                    : nothing}
                  ${this.credentialsMismatch
                    ? html`<p class="hint warn-text mismatch">
                        Note: the saved bridge record says the network ID is
                        <code>${this.bridgeNetworkId}</code>, which disagrees with secrets.yaml.
                        The bridge firmware reads secrets.yaml, so that value is used here — but
                        the record is stale and worth correcting.
                      </p>`
                    : nothing}
                  </div>
                </div>

                <div class="actions">
                  ${this.usbSupported
                    ? html`<button class="btn primary" ?disabled=${!this.canSubmit({ chipOptional: true }) || this.detectingChip} @click=${() => void this.compileAndInstall()}>
                          ${this.detectingChip ? 'Checking board…' : 'Compile & install'}
                        </button>
                        <button class="btn" ?disabled=${!this.canSubmit()} @click=${() => { this.autoInstall = false; void this.submit(); }}>
                          Compile only
                        </button>`
                    : html`<button class="btn primary" ?disabled=${!this.canSubmit()} @click=${() => { this.autoInstall = false; void this.submit(); }}>
                          Compile firmware
                        </button>`}
                </div>
              `
            : nothing}

          ${this.stage === 'compiling'
            ? html`
                <div class="status info">
                  <div class="spinner"></div>
                  <div>
                    <strong
                      >${this.compileStatusLabel}…${this.compilePercent > 0
                        ? ` ${this.compilePercent}%`
                        : ''}</strong
                    >
                    <p class="hint">This uses the add-on's own compiler. It can take a few minutes.</p>
                    ${this.autoInstall
                      ? html`<p class="hint">It will flash to the selected USB device automatically when the build finishes. Keep the board plugged in.</p>`
                      : nothing}
                  </div>
                </div>
                <esp-compile-log-viewer .mac=${this.mac} .visible=${true}></esp-compile-log-viewer>
              `
            : nothing}

          ${this.stage === 'ready'
            ? html`
                <div class="status ok">
                  ${icon('checkCircle')}
                  <div>
                  <strong>Firmware built.</strong>
                  <p class="hint">
                    ${this.autoInstall && this.flashing
                      ? 'Flashing to the selected USB device…'
                      : 'Plug the remote into this computer by USB, then flash it below.'}
                  </p>
                  </div>
                </div>
                ${this.preparingManifest
                  ? html`<div class="status"><div class="spinner"></div><span>Preparing firmware…</span></div>`
                  : nothing}
                ${this.manifestUrl
                  ? html`
                      <div class="actions">
                        <button class="btn primary" ?disabled=${this.flashing} @click=${() => void this.flashInBrowser()}>
                          ${this.flashing ? html`<span class="spinner"></span>Flashing…` : html`${icon('usb')}Flash by USB`}
                        </button>
                      </div>
                      ${this.flashError
                        ? html`<div class="notice danger" role="alert">${icon('alert')}<span>${this.flashError}</span></div>`
                        : nothing}
                      ${this.flashNeedsConfirm
                        ? html`
                            <div class="actions">
                              <button class="btn primary" @click=${() => void this.onBrowserFlashDone()}>
                                Continue to Home Assistant setup
                              </button>
                            </div>
                          `
                        : nothing}
                    `
                  : nothing}
                ${!this.usbSupported
                  ? html`<div class="notice warn">${icon('info')}<span>This browser can't flash over USB. Open the add-on in Chrome or Edge over HTTPS, or download the factory image below.</span></div>`
                  : nothing}
                <p class="hint">
                  The button above writes the firmware from this computer. If your browser cannot,
                  use the compiled .bin with your own tool, then continue.
                </p>
                ${this.mac
                  ? html`
                      <div class="actions download-actions">
                        <a class="btn" href=${api.downloadFactoryBinary(this.mac)} download>
                          Download factory .bin
                        </a>
                        <a class="btn" href=${api.downloadCompileBinary(this.mac)} download>
                          Download .ota.bin
                        </a>
                        <a class="btn" href=${'#/device/' + encodeURIComponent(this.mac) + '/config'}>
                          Edit YAML
                        </a>
                      </div>
                      <p class="hint">
                        <strong>Download factory .bin</strong> writes the whole image at offset 0
                        (bootloader + partitions + app) and is what a blank device needs — flash it
                        with your own tool at 0x0. The .ota.bin is an update image and cannot be
                        flashed to empty flash.
                      </p>
                    `
                  : nothing}
              `
            : nothing}

          ${this.stage === 'done'
            ? html`
                <div class="status ok">
                  ${icon('checkCircle')}
                  <div>
                  <strong>${this.esphomeName} is flashed.</strong>
                  <p class="hint">
                    Power the remote. Once it joins, the bridge reports it and it appears in the
                    network view automatically.
                  </p>
                  </div>
                </div>
                ${this.renderHaIntegrationStep()}
                <div class="actions"><a class="btn primary" href="#/">Go to network</a></div>
              `
            : nothing}

          ${this.stage === 'error'
            ? html`
                <div class="actions"><button class="btn" @click=${() => this.startOver()}>Start over</button></div>
              `
            : nothing}
        </div>
      </section>
      </div>
    `;
  }

  static styles = [shared, css`
    :host { display: block; }
    .remote-page { max-width: 760px; }
    .crumbs svg { width: 14px; height: 14px; color: var(--faint); }
    .steps { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; counter-reset: s; }
    .steps li {
      display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
      padding: 8px 0; border-top: 3px solid var(--line); color: var(--muted); font-size: var(--text-sm); font-weight: 500;
    }
    .steps li.current { border-color: var(--primary); color: var(--ink); }
    .steps li.done { border-color: var(--primary); color: var(--ink-2); }
    .steps .n {
      display: grid; place-items: center; width: 22px; height: 22px; flex: none; border-radius: 50%;
      background: var(--surface-subtle); color: var(--muted); font-size: var(--text-xs);
    }
    .steps .current .n { background: var(--primary); color: var(--on-primary); }
    .steps .done .n { background: var(--primary-soft); color: var(--primary); }
    .steps .n svg { width: 14px; height: 14px; }
    .card-body { display: grid; gap: 18px; padding: 20px; }
    label.field { display: grid; gap: 6px; }
    label.field > span { font-size: var(--text-sm); font-weight: 500; color: var(--ink-2); }
    .chip-detect { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin-top: -6px; }
    .chip-detect .btn svg, .actions .btn svg { width: 18px; height: 18px; }
    .chip-detect .spinner, .actions .spinner { width: 14px; height: 14px; }
    .warn-text { color: var(--accent); }
    .creds .creds-body { display: grid; gap: 6px; flex: 1; min-width: 0; }
    .creds-row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    .creds-row code { font-family: var(--font-mono); font-size: var(--text-sm); }
    .creds .src { color: var(--muted); font-size: var(--text-xs); margin-left: 4px; }
    .creds .mismatch { margin-top: 4px; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .download-actions { margin-top: 4px; }
    .status { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: var(--radius-md); background: var(--surface-subtle); }
    .status.info { background: var(--info-soft); }
    .status.ok { background: var(--ok-soft); }
    .status > svg { width: 22px; height: 22px; flex: none; color: var(--ok); }
    .status strong { font-weight: 500; }
    .status .hint { margin-top: 2px; }
    .ha-step { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; border: 1px solid var(--line); border-radius: var(--radius-md); }
    .ha-step > div { display: grid; gap: 8px; justify-items: start; }
    .ha-step strong { font-weight: 500; }
    .ha-icon { display: grid; place-items: center; width: 24px; height: 24px; flex: none; color: var(--muted); }
    .ha-icon.ok { color: var(--ok); }
    .ha-icon.warn { color: var(--accent); }
    .ha-icon svg { width: 22px; height: 22px; }
    .ha-error { color: var(--danger); }
    @media (max-width: 560px) {
      .steps li { flex-direction: column; align-items: flex-start; gap: 4px; font-size: var(--text-xs); }
      .card-body { padding: 16px; }
    }
  `];
}
