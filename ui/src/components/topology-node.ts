import { css, html, nothing, type TemplateResult } from 'lit';
import { BridgeFirmwareStatus, ConfigStatus, OtaJob, TopologyNode, fmtDuration } from '../api/client';
import { icon } from '../styles/icons';

/*
 * Device tree rows. The tree is flattened by the map into rows that share one
 * grid, so every column lines up regardless of depth. Each row draws its own
 * guide lines, laid out so they join up across rows into one trunk: a parent's
 * icon drops a stem, each child hangs off that stem with an elbow that runs
 * into the child's icon. Lines are neutral; only an offline link is dashed.
 * Signal quality lives in the Signal column, not on the lines.
 */

export interface TreeRow {
  node: TopologyNode;
  depth: number;
  /** For each ancestor level 1..depth-1: does that ancestor have later siblings (draw a through line)? */
  rails: boolean[];
  last: boolean;
  isRoot: boolean;
  /** Draw a stem down from this node's icon to its first child. */
  hasChildren: boolean;
}

export interface RowContext {
  job: OtaJob | null;
  config: ConfigStatus | null;
  firmware: BridgeFirmwareStatus | null;
  latestVersion: string;
  onUpdateFirmware: (mac: string) => void;
  onHide: (mac: string) => void;
}

const TERMINAL = ['success', 'failed', 'aborted', 'version_mismatch', 'rejoin_timeout', 'rejoined_unverified'];

export function firmwareOutdated(running: string, latest: string): boolean {
  const parse = (version: string) => /^\d+\.\d+\.\d+$/.test(version) ? version.split('.').map(Number) : null;
  const current = parse(running);
  const target = parse(latest);
  if (!current || !target) return false;
  for (let i = 0; i < 3; i++) {
    if (current[i] !== target[i]) return current[i] < target[i];
  }
  return false;
}

export function nodeName(node: TopologyNode): string {
  return node.friendly_name || node.esphome_name || node.label || node.mac;
}

/**
 * Below this a number is a sentinel, not a measurement: a leaf that has not
 * heard its parent reports its -127 initialiser, a fresh bridge session starts
 * at -128, and a receive descriptor with no rx_ctrl reports 0. Drawing one of
 * those as "1 bar, weak" is worse than showing nothing.
 */
export const RSSI_NO_READING_FLOOR = -110;

export function readableRssi(rssi?: number | null): number | null {
  return rssi != null && rssi < 0 && rssi > RSSI_NO_READING_FLOOR ? rssi : null;
}

export function linkQuality(node: TopologyNode): 'strong' | 'fair' | 'weak' | 'down' | 'unknown' {
  if (!node.online) return 'down';
  const rssi = readableRssi(node.rssi);
  if (rssi == null) return 'unknown';
  if (rssi >= -67) return 'strong';
  if (rssi >= -80) return 'fair';
  return 'weak';
}

const QUALITY_LABEL = { strong: 'Strong', fair: 'Fair', weak: 'Weak', down: 'No link', unknown: 'Unknown' } as const;

export function offlineReason(node: TopologyNode): string {
  if (node.from_integration_store && !node.offline_reason) return 'Not seen this session';
  const raw = node.offline_reason || '';
  switch (raw) {
    case 'missed_heartbeats': return 'Missed heartbeats';
    case 'not_advertised': return 'Not reported by bridge';
    case '': return 'Offline';
    default: return raw.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
  }
}

function ago(seconds?: number | null): string {
  if (seconds == null) return '—';
  if (seconds < 5) return 'just now';
  return `${fmtDuration(seconds)} ago`;
}

function signal(node: TopologyNode, isRoot: boolean): TemplateResult {
  if (isRoot) return html`<span class="muted">—</span>`;
  const q = linkQuality(node);
  const rssi = readableRssi(node.rssi);
  if (q === 'down') return html`<span class="muted">—</span>`;
  const level = q === 'strong' ? 4 : q === 'fair' ? 3 : q === 'weak' ? 1 : 0;
  return html`
    <span class="signal ${q}" title=${rssi != null ? `${QUALITY_LABEL[q]} signal, ${rssi} dBm` : 'Signal not reported'}>
      <span class="bars" aria-hidden="true">${[1, 2, 3, 4].map((i) => html`<i class=${i <= level ? 'on' : ''}></i>`)}</span>
      <span class="dbm">${rssi != null ? `${rssi} dBm` : '—'}</span>
    </span>
  `;
}

function statusCell(row: TreeRow, ctx: RowContext): TemplateResult {
  const { node, isRoot } = row;
  if (isRoot) {
    const job = ctx.firmware?.job;
    if (job && !TERMINAL.includes(job.status)) {
      const label = job.status === 'compiling' ? 'Building' : job.status === 'transferring' ? `Updating ${job.percent ?? 0}%` : 'Updating';
      return html`<span class="chip info"><span class="spinner sm"></span>${label}</span>`;
    }
    return node.online
      ? html`<span class="chip ok"><span class="dot ok"></span>Online</span>`
      : html`<span class="chip danger"><span class="dot danger"></span>Offline</span>`;
  }
  const cs = ctx.config?.config_state;
  const job = ctx.job;
  if (cs === 'compiling') return html`<span class="chip info"><span class="spinner sm"></span>Compiling</span>`;
  if (job && ['starting', 'transferring', 'verifying', 'transfer_success_waiting_rejoin'].includes(job.status)) {
    const text = job.status === 'transferring' ? `Uploading ${job.percent ?? 0}%` : job.status === 'verifying' ? 'Verifying' : job.status === 'transfer_success_waiting_rejoin' ? 'Rebooting' : 'Starting upload';
    return html`<span class="chip info"><span class="spinner sm"></span>${text}</span>`;
  }
  if (job?.status === 'queued') return html`<span class="chip warn">Upload queued · #${job.queue_position ?? 1}</span>`;
  if (cs === 'compile_queued') return html`<span class="chip warn">Build queued · #${ctx.config?.queue_position ?? 1}</span>`;
  if (!node.online) return html`<span class="chip danger" title=${offlineReason(node)}><span class="dot danger"></span>${offlineReason(node)}</span>`;
  if (cs === 'no_config') return html`<span class="chip warn" title="No YAML stored for this remote yet">Online · no config</span>`;
  return html`<span class="chip ok"><span class="dot ok"></span>Online</span>`;
}

function guides(row: TreeRow): TemplateResult {
  if (row.isRoot) return html`<span class="guides" aria-hidden="true"></span>`;
  return html`<span class="guides" aria-hidden="true">
    ${row.rails.map((through) => html`<span class="rail ${through ? 'through' : ''}"></span>`)}
    <span class="elbow ${row.last ? 'last' : ''} ${row.node.online ? '' : 'down'}"></span>
  </span>`;
}

export function renderTreeRow(row: TreeRow, ctx: RowContext): TemplateResult {
  const { node, isRoot } = row;
  const name = nodeName(node);
  const fw = isRoot
    ? (ctx.firmware?.running?.version || node.project_version || node.firmware_version || '')
    : (node.project_version || node.firmware_version || '');
  // Firmware built before ESP_TREE_VERSION existed reports no version at all. Show
  // the running app's digest instead of an empty cell, so the column still says
  // something true about the image on the device.
  const fwDigest = fw ? '' : (node.firmware_md5 || '').slice(0, 8);
  const deviceHref = `#/device/${encodeURIComponent(node.mac)}`;
  const fwJob = ctx.firmware?.job;
  const bridgeBusy = !!fwJob && !TERMINAL.includes(fwJob.status);
  const canUpdate = !bridgeBusy && (ctx.firmware ? ctx.firmware.can_update : true);
  const blocker = ctx.firmware?.blocked_reason || '';
  // project_version may be the user's ESPHome project version, unrelated to
  // the ESP Tree release. Only compare ESP Tree's fallback version when no
  // project identity overrides it; offer an update when the running version
  // cannot be identified (including firmware predating version reporting).
  const knownEspTreeVersion = !node.project_name && /^\d+\.\d+\.\d+$/.test(fw);
  const needsUpdate = !!ctx.latestVersion && (knownEspTreeVersion
    ? firmwareOutdated(fw, ctx.latestVersion)
    : true);
  const configHref = `#/device/${encodeURIComponent(node.mac)}/config`;

  return html`
    <div class="row ${node.online ? '' : 'is-offline'} ${isRoot ? 'is-root' : ''}" role="row">
      ${guides(row)}
      <div class="cell name ${row.hasChildren ? 'has-children' : ''}" role="gridcell">
        <span class="node-icon ${isRoot ? 'bridge' : node.relay_enabled ? 'relay' : 'remote'}" aria-hidden="true">${icon(isRoot ? 'bridge' : node.relay_enabled ? 'relay' : 'remote')}</span>
        <span class="identity">
          <a class="title" href=${deviceHref} title=${name}>${name}</a>
          <span class="meta">
            ${isRoot ? html`<span>Bridge${node.network_id ? html` · ${node.network_id}` : nothing}</span><span class="sep">·</span>` : nothing}
            ${!isRoot && node.relay_enabled ? html`<span>Relay</span><span class="sep">·</span>` : nothing}
            <span class="mono">${node.mac}</span>
            ${node.chip_name ? html`<span class="sep">·</span><span>${node.chip_name}</span>` : nothing}
          </span>
        </span>
      </div>
      <div class="facts">
        <div class="cell signal-cell" role="gridcell">${signal(node, isRoot)}</div>
        <div class="cell num hops" role="gridcell"><span class="m-label">Hops </span>${isRoot ? '—' : (node.hops ?? '—')}</div>
        <div class="cell seen" role="gridcell">
          ${isRoot
            ? html`<span title="Bridge uptime">Up ${fmtDuration(node.uptime_s) || '—'}</span>`
            : html`<span><span class="m-label">Seen </span>${ago(node.last_seen_ago)}</span>`}
        </div>
        <div class="cell fw" role="gridcell">${fw
          ? html`<span class="ver" title=${node.firmware_build_date ? `Built ${node.firmware_build_date}` : ''}>${fw}</span>`
          : fwDigest
            ? html`<span class="ver mono digest" title="This firmware reports no version — showing the first 8 digits of the running app's MD5">${fwDigest}</span>`
            : html`<span class="muted">—</span>`}</div>
        <div class="cell status" role="gridcell">${statusCell(row, ctx)}</div>
      </div>
      <div class="cell actions" role="gridcell">
        ${isRoot
          ? needsUpdate && node.online ? html`<button class="btn sm icon" ?disabled=${!canUpdate} aria-label=${`Update firmware for ${name}`}
              title=${blocker || `Update firmware to ${ctx.latestVersion}`} @click=${() => ctx.onUpdateFirmware(node.mac)}>${icon('upload')}</button>` : nothing
          : node.online
            ? html`${needsUpdate && ctx.config?.has_config ? html`<button class="btn sm icon" aria-label=${`Update firmware for ${name}`} title=${`Build and install firmware ${ctx.latestVersion}`} @click=${() => ctx.onUpdateFirmware(node.mac)}>${icon('upload')}</button>` : nothing}
                <a class="btn sm" aria-label=${`Edit YAML for ${name}`} href=${configHref}>${icon('code')}YAML</a>`
            : html`<button class="btn sm" aria-label=${`Hide ${name}`} title="Move to Hidden devices until it comes back" @click=${() => ctx.onHide(node.mac)}>${icon('eyeOff')}Hide</button>`}
      </div>
    </div>
  `;
}

export const treeStyles = css`
  .tree { font-size: var(--text-md); }
  .row, .tree-head {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 124px 48px 104px 84px 200px 124px;
    align-items: center;
    column-gap: var(--tree-gap, 12px);
    padding: 0 16px 0 8px;
  }
  .facts { display: contents; }
  .tree-head {
    min-height: 36px;
    color: var(--muted);
    font-size: var(--text-xs);
    font-weight: 500;
    border-bottom: 1px solid var(--line);
    background: var(--surface-subtle);
  }
  .tree-head .num { text-align: left; }
  /* Tree geometry. Icons are 32px with their centre 28px down the row; a level is
     one --tree-step wide, so a child's elbow sits exactly under its parent's icon. */
  .row {
    --tree-gap: 12px;
    --tree-step: 40px;
    --tree-x: calc(var(--tree-gap) + 16px); /* icon centre, measured from the start of its guide column */
    --tree-y: 28px;
    --tree-line: var(--line-strong);
    position: relative; /* containing block for the row-wide hit target below */
    min-height: 56px;
    border-bottom: 1px solid var(--line);
    transition: background-color 120ms ease;
    cursor: pointer;
  }
  .row:last-child { border-bottom: 0; }
  .row:hover { background: var(--surface-hover); }
  .row.is-root { background: var(--surface-subtle); }
  .row.is-root:hover { background: var(--surface-hover); }
  .cell { min-width: 0; }
  .cell.name { position: relative; display: flex; align-items: stretch; align-self: stretch; gap: 10px; }
  .identity { display: grid; align-content: center; gap: 2px; min-width: 0; padding: 8px 0; min-height: 56px; }
  .meta > :last-child { overflow: hidden; text-overflow: ellipsis; }
  .title {
    color: var(--ink);
    font-weight: 500;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title:hover { color: var(--primary); text-decoration: underline; }
  /* The name link's hit area is the whole row, so a click anywhere on a device opens that
     device. Its containing block is .row (now positioned), which is how it escapes
     .title's overflow:hidden — that clip is what truncates a long name with an ellipsis,
     so do not "fix" it by making .title overflow visible. */
  .title::after { content: ''; position: absolute; inset: 0; }
  .row:has(.title:focus-visible) { outline: 2px solid var(--primary); outline-offset: -2px; }
  .is-root .title { font-size: var(--text-lg); }
  .meta {
    display: flex;
    gap: 6px;
    color: var(--muted);
    font-size: var(--text-xs);
    white-space: nowrap;
    overflow: hidden;
  }
  .meta .sep { color: var(--line-strong); }
  .node-icon {
    align-self: flex-start;
    margin-top: 12px;
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    flex: none;
    border-radius: 50%;
    background: var(--surface-subtle);
    color: var(--muted);
  }
  .node-icon svg { width: 18px; height: 18px; }
  /* Role reads from weight: a solid bridge, an outlined relay, a quiet remote. */
  .node-icon.bridge { background: var(--primary); color: var(--on-primary); }
  .node-icon.relay { background: var(--primary-soft); color: var(--primary); box-shadow: inset 0 0 0 1.5px var(--primary); }
  .node-icon.remote { background: var(--surface); color: var(--muted); box-shadow: inset 0 0 0 1.5px var(--line-strong); }
  .is-offline .node-icon { color: var(--danger); background: var(--danger-soft); box-shadow: inset 0 0 0 1.5px var(--danger-soft); }
  /* Stem from a parent's icon down to the row edge, where its first child's elbow picks it up. */
  .cell.name.has-children::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 44px;
    bottom: -1px;
    border-left: 2px solid var(--tree-line);
  }
  .is-offline .title { color: var(--ink-2); }
  .muted { color: var(--faint); }
  .m-label { display: none; }
  .num, .seen, .fw { font-variant-numeric: tabular-nums; color: var(--ink-2); }
  .fw .ver { font-size: var(--text-sm); }
  .fw .digest { color: var(--muted); }
  /* Above the stretched name link, or the overlay would swallow the row actions. */
  .actions { display: flex; justify-content: flex-end; gap: 6px; position: relative; z-index: 1; }
  .actions .btn svg { width: 16px; height: 16px; }
  .chip .spinner.sm { width: 10px; height: 10px; border-width: 1.5px; border-color: currentColor; border-top-color: transparent; }
  .chip { max-width: 100%; overflow: hidden; text-overflow: ellipsis; }

  /* Signal meter */
  .signal { display: inline-flex; align-items: center; gap: 8px; }
  .bars { display: inline-flex; align-items: flex-end; gap: 2px; height: 14px; }
  .bars i { display: block; width: 4px; border-radius: 1px; background: var(--line-strong); }
  .bars i:nth-child(1) { height: 5px; }
  .bars i:nth-child(2) { height: 8px; }
  .bars i:nth-child(3) { height: 11px; }
  .bars i:nth-child(4) { height: 14px; }
  .signal.strong .bars i.on { background: var(--ok-dot); }
  .signal.fair .bars i.on { background: var(--accent-fill); }
  .signal.weak .bars i.on { background: var(--danger); }
  .dbm { color: var(--muted); font-size: var(--text-sm); font-variant-numeric: tabular-nums; }

  /* Guides: rails carry an ancestor's trunk past this row; the elbow joins this node to its parent. */
  .guides { display: flex; flex: none; align-self: stretch; }
  .rail, .elbow { position: relative; width: var(--tree-step); flex: none; }
  .rail.through::before, .elbow::before {
    content: '';
    position: absolute;
    left: calc(var(--tree-x) - 1px);
    top: 0;
    bottom: -1px; /* bridge the row border so the trunk is unbroken */
    border-left: 2px solid var(--tree-line);
  }
  .elbow.last::before { bottom: auto; height: var(--tree-y); }
  .elbow::after {
    content: '';
    position: absolute;
    left: calc(var(--tree-x) - 1px);
    right: calc(-1 * var(--tree-gap));
    top: calc(var(--tree-y) - 1px);
    border-top: 2px solid var(--tree-line);
  }
  .elbow.down::after { border-top-style: dashed; border-top-color: var(--faint); }

  @media (max-width: 1100px) {
    .row, .tree-head { grid-template-columns: auto minmax(0, 1fr) 116px 48px 100px 184px 124px; }
    .fw { display: none; }
  }
  @media (max-width: 860px) {
    .tree-head { display: none; }
    .row {
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas: 'guides name actions' 'guides facts facts';
      --tree-gap: 8px;
      --tree-step: 32px;
      padding: 0 8px 0 4px;
    }
    .guides { grid-area: guides; }
    .cell.name { grid-area: name; }
    .cell.actions { grid-area: actions; }
    .facts {
      grid-area: facts;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 14px;
      padding: 0 0 12px 42px;
      font-size: var(--text-sm);
    }
    .cell.fw { display: none; }
    .is-root .cell.signal-cell, .is-root .cell.hops { display: none; }
    .m-label { display: inline; color: var(--muted); }
    .meta { flex-wrap: wrap; white-space: normal; row-gap: 0; }
    .title { white-space: normal; overflow-wrap: anywhere; }
  }
`;
