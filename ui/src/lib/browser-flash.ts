/**
 * Browser-side flashing: chip detection and the ESP Web Tools install dialog.
 *
 * Two things this module exists to fix, both verified against esp-web-tools@10.4.0:
 *
 * 1. **The second USB chooser.** esp-web-tools' `connect()` (what `<esp-web-install-button>`
 *    runs on click) always calls `navigator.serial.requestPort()` itself, so a page could
 *    never hand it a port it had already been granted. Every wizard here detects the chip
 *    first — and that detection click is where the browser's picker appears — so the user
 *    saw the USB picker twice per flash. `openInstallDialog({ port })` passes the held port
 *    straight in, and the dialog is created directly instead of through `connect()`.
 *
 * 2. **The chip-probe coupling.** `InstallButton.isSupported` is `"serial" in navigator`
 *    and `InstallButton.isAllowed` is `window.isSecureContext`, both read at module load.
 *    `usbFlashSupported()` asks the same two questions without loading the element.
 *
 * Attached is not the same as granted. `getPorts()` only lists devices this origin was
 * already allowed to use; a board plugged in for the first time is invisible to it. So the
 * port decision cannot be made from `getPorts()` alone: a silent pick is only safe with
 * exactly one live grant, and anything else opens `requestPort()`, which is the one surface
 * that shows ungranted devices. A blocked chooser is reported as "click again", never as a
 * device fault — `requestPort()` needs transient activation and a spent click looks like
 * nothing happening.
 *
 * Ordering note: `requestPort()` throws `SecurityError` without transient activation, so it
 * is called *before* any awaited dynamic import. Awaiting the import first consumes the
 * click's activation and the chooser never appears.
 */

/** The chip families esptool-js reports, mapped to the names the add-on's API uses. */
export type ChipFamily =
  | 'ESP32'
  | 'ESP32-S2'
  | 'ESP32-S3'
  | 'ESP32-C2'
  | 'ESP32-C3'
  | 'ESP32-C5'
  | 'ESP32-C6'
  | 'ESP32-C61'
  | 'ESP32-H2'
  | 'ESP32-P4'
  | 'ESP8266';

/** Longest first: "ESP32-C61" must be tested before "ESP32-C6" before "ESP32". */
const CHIP_FAMILIES: ChipFamily[] = [
  'ESP32-C61',
  'ESP32-C6',
  'ESP32-C5',
  'ESP32-C3',
  'ESP32-C2',
  'ESP32-H2',
  'ESP32-P4',
  'ESP32-S3',
  'ESP32-S2',
  'ESP8266',
  'ESP32',
];

/** The baud rate esp-web-tools opens with, so a held port is in the state it expects. */
const SERIAL_OPEN_OPTIONS: SerialOptions = { baudRate: 115200, bufferSize: 8192 };

export type OpenInstallDialogResult = 'opened' | 'cancelled';

/** Which port the dialog actually used. `port` is null when the chooser was dismissed. */
export interface OpenInstallDialogOutcome {
  result: OpenInstallDialogResult;
  /**
   * The port the dialog settled on: the one passed in, or the one the chooser returned when
   * there was no usable held port. Callers keep it so a retry does not re-prompt, and so the
   * page can name the device it is about to write to.
   */
  port: SerialPort | null;
}

/**
 * The DOM's Web Serial port type, under a name that cannot collide.
 *
 * Several pages already import an unrelated `SerialPort` (the add-on's serial-port listing
 * shape) from `../api/client`, which shadows the global. Import this alias instead of
 * annotating with `SerialPort` in those files.
 */
export type UsbSerialPort = SerialPort;

/** Chrome/Edge (and Firefox 151+) on a secure context — the minimum for Web Serial. */
export function usbFlashSupported(): boolean {
  return typeof window !== 'undefined' && window.isSecureContext && 'serial' in navigator;
}

/**
 * Map an esptool/detection string onto a chip family.
 *
 * Accepts the loose forms esptool produces ("ESP32-C5", "ESP32C5", "ESP32-C5 (QFN32)"),
 * because the exact wording differs between esptool versions and reset modes.
 */
export function chipFamilyFromName(chipName: string | null | undefined): ChipFamily | null {
  if (!chipName) return null;
  const normalized = chipName.trim().toUpperCase().replace(/\s+/g, '');
  for (const family of CHIP_FAMILIES) {
    if (normalized.includes(family) || normalized.includes(family.replace(/-/g, ''))) return family;
  }
  return null;
}

/**
 * Ports this page has already been granted, most recent last.
 *
 * `getPorts()` needs no user activation, so a port granted in an earlier step (or an
 * earlier page load) can be reused with no browser prompt at all.
 */
export async function grantedPorts(): Promise<SerialPort[]> {
  if (!usbFlashSupported() || !navigator.serial) return [];
  try {
    return await navigator.serial.getPorts();
  } catch {
    return [];
  }
}

/**
 * Granted ports whose device is still attached.
 *
 * Chrome keeps previously-granted ports in `getPorts()` long after the device is gone:
 * those entries return an empty `getInfo()` and fail every `open()` with "Failed to open
 * serial port". Only a port that still reports a USB identity is worth offering.
 */
export async function listLivePorts(): Promise<SerialPort[]> {
  const granted = await grantedPorts();
  return granted.filter((port) => {
    try {
      return Boolean(port.getInfo().usbVendorId);
    } catch {
      return false;
    }
  });
}

/**
 * A short, human label for a granted port, so the page can say *which* board it will use.
 *
 * Web Serial exposes no product or serial-number string — only the USB vendor/product ids
 * from the descriptor. That is still enough to tell two boards apart, whereas "the selected
 * USB device" tells the user nothing when several are plugged in.
 */
export function portLabel(port: SerialPort | null | undefined): string {
  if (!port) return 'no device';
  try {
    const { usbVendorId, usbProductId } = port.getInfo();
    if (usbVendorId === undefined) return 'a serial port';
    const hex = (n: number | undefined): string => (n === undefined ? '????' : n.toString(16).padStart(4, '0'));
    return `USB ${hex(usbVendorId)}:${hex(usbProductId)}`;
  } catch {
    return 'a serial port';
  }
}

/**
 * The error a blocked chooser deserves.
 *
 * `requestPort()` throws `SecurityError` when transient activation has already been spent —
 * a second click while a detection is still running, or a call made from a poll callback.
 * That is not a device fault and must not read like one: the raw message ("Must be handling
 * a user gesture to show a permission request") leaves the user with no next step.
 */
const NO_GESTURE_MESSAGE =
  'The browser blocked the USB device chooser. Click the USB button again to reopen it.';

/**
 * Show the browser's own device chooser.
 *
 * Needs a real user gesture. Resolves `'cancelled'` when the chooser is dismissed.
 */
export async function pickPort(): Promise<SerialPort | 'cancelled'> {
  if (!navigator.serial) throw new Error('Web Serial is not available in this browser.');
  try {
    return await navigator.serial.requestPort();
  } catch (err) {
    // NotFoundError is the documented "picker dismissed" rejection, not a fault.
    if (err instanceof DOMException && err.name === 'NotFoundError') return 'cancelled';
    if (err instanceof DOMException && err.name === 'SecurityError') {
      throw new Error(NO_GESTURE_MESSAGE);
    }
    throw err;
  }
}

/**
 * Return a port to use, asking the user whenever the choice is not obvious.
 *
 * The only ports Web Serial can see without a prompt are the ones this origin was already
 * granted (`getPorts()`). A board plugged in for the first time is *not* in that list, so
 * "one live port" can mean "one board we happen to hold, while three are attached". The
 * silent fast path therefore stays deliberately narrow: one live port, and only when the
 * caller has no other reason to ask. Every ambiguous case — none, several, `forcePicker` —
 * opens the native chooser, which is the only surface that lists ungranted devices.
 *
 * Needs a real user gesture for the chooser — call this from a click handler.
 */
export async function acquirePort(options: { forcePicker?: boolean } = {}): Promise<SerialPort | 'cancelled'> {
  if (!usbFlashSupported() || !navigator.serial) {
    throw new Error('Web Serial is not available in this browser.');
  }
  if (!options.forcePicker) {
    const live = await listLivePorts();
    if (live.length === 1) return live[0];
  }
  return pickPort();
}

export interface ChipDetectionResult {
  /** The raw string esptool reported, for display. */
  detected: string;
  family: ChipFamily | null;
}

/**
 * Connect to a chip and read its identity, leaving the port granted but closed.
 *
 * The port is deliberately released afterwards: a multi-minute compile with the port held
 * keeps the chip parked in the bootloader and is exposed to the device re-enumerating
 * mid-build. Reopening a granted port needs no gesture, so nothing is lost.
 */
export async function detectChip(port: SerialPort): Promise<ChipDetectionResult> {
  // esptool-js is ~200 KB; only detection and flashing need it.
  const { Transport, ESPLoader } = await import('esptool-js');
  const transport = new Transport(port, true);
  try {
    const loader = new ESPLoader({
      transport,
      baudrate: 115200,
      terminal: { clean: () => {}, writeLine: () => {}, write: () => {} },
      debugLogging: false,
    });
    const detected = String(await loader.main());
    return { detected, family: chipFamilyFromName(detected) };
  } finally {
    try {
      await transport.disconnect();
    } catch {
      // Detection is finished either way; releasing the port is best-effort.
    }
  }
}

/**
 * Open the install dialog.
 *
 * `port` — a port the page already holds (from detection). When omitted, the browser's
 * picker is shown instead, which requires this to be called from a real user gesture. A held
 * port that can no longer be opened also falls back to the picker.
 *
 * Resolves `cancelled` when the user dismisses the picker; the dialog reports its own
 * progress and errors, and its `closed` event is surfaced via `onClosed`.
 */
export async function openInstallDialog(options: {
  manifestUrl: string;
  port?: SerialPort | null;
  onClosed?: () => void;
  onFinished?: () => void;
}): Promise<OpenInstallDialogOutcome> {
  if (!usbFlashSupported()) {
    throw new Error('Browser USB flashing needs Chrome or Edge on a secure HTTPS page.');
  }

  let port = options.port ?? null;
  if (!port) {
    const acquired = await acquirePort();
    if (acquired === 'cancelled') return { result: 'cancelled', port: null };
    port = acquired;
  }

  // Loaded on demand: the dialog drags in lit, Material Web and esptool-js (~360 KB), none
  // of which the rest of the page needs.
  await import('esp-web-tools/dist/install-dialog.js');

  if (port.readable === null) {
    // A port held from an earlier detection step is closed but still granted; the dialog
    // expects to be handed an open one, exactly as esp-web-tools' own `connect()` does.
    try {
      await port.open(SERIAL_OPEN_OPTIONS);
    } catch (err) {
      if (!options.port) throw err;
      // The held port is stale — the board was unplugged or re-enumerated after a reset.
      // Chrome reports that as an opaque "Failed to open serial port" on a handle the user
      // cannot distinguish from a live one, so ask for a device explicitly instead.
      const acquired = await acquirePort();
      if (acquired === 'cancelled') return { result: 'cancelled', port: null };
      port = acquired;
      await port.open(SERIAL_OPEN_OPTIONS);
    }
  }

  const el = document.createElement('ewt-install-dialog') as HTMLElement & {
    port: SerialPort;
    manifestPath: string;
  };
  el.port = port;
  el.manifestPath = options.manifestUrl;

  /**
   * Report a completed write.
   *
   * esp-web-tools@10's dialog never dispatches the `state-changed` event its own README and
   * older versions advertise (the only `state-changed` listener in the source is for the
   * Improv client), so watching for a `FINISHED` event silently never fires. It does mirror
   * its internal state machine onto a `state` attribute, which is what we watch instead:
   * the write runs with `state="INSTALL"`, and the "Next" button after it moves to
   * `DASHBOARD` (or `PROVISION` when Improv is available). So "INSTALL has been seen, and
   * the state has moved on from it" means the firmware was written — whereas closing the
   * dialog straight from the initial dashboard state does not.
   */
  let sawInstall = false;
  let reported = false;
  let observer: MutationObserver | null = null;
  const stopWatching = (): void => {
    observer?.disconnect();
    observer = null;
  };
  const watch = (): void => {
    if (!options.onFinished) return;
    observer = new MutationObserver(() => {
      const state = el.getAttribute('state');
      if (state === 'INSTALL') {
        sawInstall = true;
        return;
      }
      if (sawInstall && !reported && (state === 'DASHBOARD' || state === 'PROVISION')) {
        reported = true;
        options.onFinished?.();
      }
    });
    observer.observe(el, { attributes: true, attributeFilter: ['state'] });
  };
  watch();

  el.addEventListener(
    'closed',
    () => {
      stopWatching();
      // The dialog never closes the port itself; `connect()` does this via the same event.
      void port.close().catch(() => {});
      options.onClosed?.();
    },
    { once: true },
  );
  document.body.appendChild(el);
  return { result: 'opened', port };
}
