import { css, html, nothing, type TemplateResult } from 'lit';
import { BridgeFirmwareStatus, ConfigStatus, OtaJob, TopologyNode, fmtDuration } from '../api/client';
import { icon } from '../styles/icons';

/*
 * Device tree rows. The tree is flattened by the map into rows that share one
 * grid, so every column lines up regardless of depth. Each row draws its own
 * guide lines; the elbow into a node carries that node's link quality
 * (strong / fair / weak / down), which is the tree's signature: weak hops are
 * visible in the shape of the network itself.
 */

export interface TreeRow {
  node: TopologyNode;
  depth: number;
  /** For each ancestor level 1..depth-1: does that ancestor have later siblings (draw a through line)? */
  rails: boolean[];
  last: boolean;
  isRoot: boolean;
}

export interface RowContext {
  job: OtaJob | null;
  config: ConfigStatus | null;
  firmware: BridgeFirmwareStatus | null;
  onUpdateFirmware: (mac: string) => void;
  onHide: (mac: string) => void;
}

const TERMINAL = ['success', 'failed', 'aborted', 'version_mismatch', 'rejoin_timeout'];

export function nodeName(node: TopologyNode): string {
  return node.friendly_name || node.esphome_name || node.label || node.mac;
}

export function linkQuality(node: TopologyNode): 'strong' | 'fair' | 'weak' | 'down' | 'unknown' {
  if (!node.online) return 'down';
  const rssi = node.rssi;
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
  if (q === 'down') return html`<span class="muted">—</span>`;
  const level = q === 'strong' ? 4 : q === 'fair' ? 3 : q === 'weak' ? 1 : 0;
  return html`
    <span class="signal ${q}" title=${node.rssi != null ? `${QUALITY_LABEL[q]} signal, ${node.rssi} dBm` : 'Signal not reported'}>
      <span class="bars" aria-hidden="true">${[1, 2, 3, 4].map((i) => html`<i class=${i <= level ? 'on' : ''}></i>`)}</span>
      <span class="dbm">${node.rssi != null ? `${node.rssi} dBm` : '—'}</span>
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
  const q = linkQuality(row.node);
  return html`<span class="guides" aria-hidden="true">
    ${row.rails.map((through) => html`<span class="rail ${through ? 'through' : ''}"></span>`)}
    <span class="elbow ${row.last ? 'last' : ''} ${q}"></span>
  </span>`;
}

function go(path: string): void {
  window.location.hash = path;
}

export function renderTreeRow(row: TreeRow, ctx: RowContext): TemplateResult {
  const { node, isRoot } = row;
  const name = nodeName(node);
  const fw = isRoot
    ? (ctx.firmware?.running?.version || node.project_version || node.firmware_version || '')
    : (node.project_version || node.firmware_version || '');
  const deviceHref = `#/device/${encodeURIComponent(node.mac)}`;
  const fwJob = ctx.firmware?.job;
  const bridgeBusy = !!fwJob && !TERMINAL.includes(fwJob.status);
  const canUpdate = !bridgeBusy && (ctx.firmware ? ctx.firmware.can_update : true);
  const blocker = ctx.firmware?.blocked_reason || '';

  return html`
    <div class="row ${node.online ? '' : 'is-offline'} ${isRoot ? 'is-root' : ''}" role="row">
      ${guides(row)}
      <div class="cell name" role="gridcell">
        <span class="node-icon ${isRoot ? 'bridge' : ''}" aria-hidden="true">${icon(isRoot ? 'bridge' : node.relay_enabled ? 'relay' : 'chip')}</span>
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
        <div class="cell fw" role="gridcell">${fw ? html`<span class="ver" title=${node.firmware_build_date ? `Built ${node.firmware_build_date}` : ''}>${fw}</span>` : html`<span class="muted">—</span>`}</div>
        <div class="cell status" role="gridcell">${statusCell(row, ctx)}</div>
      </div>
      <div class="cell actions" role="gridcell">
        ${isRoot
          ? html`<button class="btn sm" ?disabled=${!canUpdate} title=${blocker || 'Rebuild the bridge from this add-on and upload over WiFi'}
              @click=${() => ctx.onUpdateFirmware(node.mac)}>Update firmware</button>`
          : node.online
            ? html`<button class="btn sm text" aria-label=${`Edit YAML for ${name}`} @click=${() => go(`/device/${encodeURIComponent(node.mac)}/config`)}>${icon('code')}YAML</button>`
            : html`<button class="btn sm text" aria-label=${`Hide ${name}`} title="Move to Hidden devices until it comes back" @click=${() => ctx.onHide(node.mac)}>${icon('eyeOff')}Hide</button>`}
      </div>
    </div>
  `;
}

export const treeStyles = css`
  .tree { font-size: var(--text-md); }
  .row, .tree-head {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 124px 48px 104px 84px 200px 120px;
    align-items: center;
    column-gap: 12px;
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
  .row {
    min-height: 56px;
    border-bottom: 1px solid var(--line);
    transition: background-color 120ms ease;
  }
  .row:last-child { border-bottom: 0; }
  .row:hover { background: var(--surface-hover); }
  .row.is-root { background: var(--surface-subtle); }
  .row.is-root:hover { background: var(--surface-hover); }
  .cell { min-width: 0; }
  .cell.name { display: flex; align-items: stretch; align-self: stretch; gap: 10px; }
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
  .node-icon.bridge { background: var(--primary-soft); color: var(--primary); }
  .is-offline .node-icon { color: var(--danger); background: var(--danger-soft); }
  .is-offline .title { color: var(--ink-2); }
  .muted { color: var(--faint); }
  .m-label { display: none; }
  .num, .seen, .fw { font-variant-numeric: tabular-nums; color: var(--ink-2); }
  .fw .ver { font-size: var(--text-sm); }
  .actions { display: flex; justify-content: flex-end; }
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

  /* Guides: rails for ancestors, an elbow into this node coloured by its link */
  .guides { display: flex; flex: none; align-self: stretch; margin-left: 4px; }
  .rail, .elbow { position: relative; width: 22px; flex: none; }
  .rail.through::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    border-left: 2px solid var(--line-strong);
  }
  .elbow::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    border-left: 2px solid var(--line-strong);
  }
  .elbow.last::before { bottom: auto; height: 28px; }
  .elbow::after {
    content: '';
    position: absolute;
    left: 10px;
    right: -6px;
    top: 27px;
    border-top: 2px solid var(--link-colour, var(--line-strong));
  }
  .elbow.strong { --link-colour: var(--ok-dot); }
  .elbow.strong::after { border-top-width: 3px; top: 26px; }
  .elbow.fair { --link-colour: var(--accent-fill); }
  .elbow.weak { --link-colour: var(--danger); }
  .elbow.weak::after { border-top-width: 1px; top: 27.5px; }
  .elbow.down::after { border-top-style: dashed; --link-colour: var(--danger); opacity: 0.7; }

  @media (max-width: 1100px) {
    .row, .tree-head { grid-template-columns: auto minmax(0, 1fr) 116px 48px 100px 184px 112px; }
    .fw { display: none; }
  }
  @media (max-width: 860px) {
    .tree-head { display: none; }
    .row {
      grid-template-columns: auto minmax(0, 1fr) auto;
      grid-template-areas: 'guides name actions' 'guides facts facts';
      column-gap: 8px;
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
