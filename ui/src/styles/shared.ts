import { css } from 'lit';

/*
 * Shared component vocabulary. Every page and component adopts this first:
 *   static styles = [shared, css`...local layout only...`];
 * Local styles handle layout; buttons, chips, cards, fields, tables, page
 * headers and empty states come from here so they look the same everywhere.
 */
export const shared = css`
  :host {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: 1.45;
    color: var(--ink);
  }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  h1, h2, h3, h4, p { margin: 0; }
  a { color: var(--primary); text-underline-offset: 2px; }
  code, .mono {
    font-family: var(--font-mono);
    font-size: 0.92em;
    font-variant-numeric: tabular-nums;
  }
  :focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  ::selection { background: var(--primary-soft); color: var(--ink); }

  /* Page frame ---------------------------------------------------------- */
  .page { display: grid; gap: 16px; }
  .page-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px 16px;
    flex-wrap: wrap;
    padding-top: 4px;
  }
  .page-head h1 {
    font-size: var(--text-2xl);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
  .page-head .sub {
    margin-top: 4px;
    color: var(--muted);
    font-size: var(--text-md);
  }
  .page-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  @media (max-width: 760px) { .page-actions { flex-wrap: nowrap; } }
  .crumbs {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--text-sm);
    color: var(--muted);
    margin-bottom: 6px;
  }
  .crumbs a { color: var(--primary); text-decoration: none; font-weight: 500; }
  .crumbs a:hover { text-decoration: underline; }

  /* Cards --------------------------------------------------------------- */
  .card {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius-lg);
    min-width: 0;
  }
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--line);
    flex-wrap: wrap;
  }
  .card-head h2, .card-title {
    font-size: var(--text-lg);
    font-weight: 500;
    line-height: 1.3;
  }
  .card-head .sub { color: var(--muted); font-size: var(--text-sm); margin-top: 2px; }
  .card-body { padding: 16px; }
  .card-foot {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 12px 16px;
    border-top: 1px solid var(--line);
  }

  /* Buttons ------------------------------------------------------------- */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-md);
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: var(--text-md);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
  }
  .btn:hover:not(:disabled) { background: var(--surface-hover); }
  .btn:disabled, .btn[aria-disabled='true'] { opacity: 0.5; cursor: not-allowed; }
  .btn svg { width: 18px; height: 18px; flex: none; }
  .btn.primary {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--on-primary);
  }
  .btn.primary:hover:not(:disabled) { background: var(--primary-strong); border-color: var(--primary-strong); }
  .btn.danger { color: var(--danger); border-color: var(--line-strong); }
  .btn.danger:hover:not(:disabled) { background: var(--danger-soft); border-color: var(--danger); }
  .btn.danger-solid { background: var(--danger); border-color: var(--danger); color: var(--on-danger); }
  .btn.danger-solid:hover:not(:disabled) { background: var(--danger-strong); border-color: var(--danger-strong); }
  .btn.text {
    border-color: transparent;
    background: transparent;
    color: var(--primary);
    padding: 0 10px;
  }
  .btn.text:hover:not(:disabled) { background: var(--primary-soft); }
  .btn.sm { min-height: 30px; padding: 0 10px; font-size: var(--text-sm); border-radius: var(--radius-sm); }
  .btn.sm.text { padding: 0 8px; }
  .btn.icon { padding: 0; width: 36px; }
  .btn.sm.icon { width: 30px; }
  .btn.busy { cursor: progress; }

  /* Status chips ---------------------------------------------------------- */
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    background: var(--surface-subtle);
    color: var(--ink-2);
    font-size: var(--text-xs);
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }
  .chip.ok { background: var(--ok-soft); color: var(--ok); }
  .chip.warn { background: var(--accent-soft); color: var(--accent); }
  .chip.danger { background: var(--danger-soft); color: var(--danger); }
  .chip.info { background: var(--info-soft); color: var(--info); }
  .chip.primary { background: var(--primary-soft); color: var(--primary); }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
    background: var(--faint);
  }
  .dot.ok { background: var(--ok-dot); }
  .dot.danger { background: var(--danger); }
  .dot.warn { background: var(--accent-fill); }
  .dot.info { background: var(--info); }

  /* Notices ------------------------------------------------------------- */
  .notice {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 12px 14px;
    border-radius: var(--radius-md);
    background: var(--surface-subtle);
    color: var(--ink-2);
    font-size: var(--text-md);
  }
  .notice svg { width: 20px; height: 20px; flex: none; margin-top: 1px; }
  .notice strong { color: var(--ink); font-weight: 500; }
  .notice.warn { background: var(--accent-soft); }
  .notice.warn svg { color: var(--accent); }
  .notice.danger { background: var(--danger-soft); }
  .notice.danger svg { color: var(--danger); }
  .notice.info { background: var(--info-soft); }
  .notice.info svg { color: var(--info); }
  .notice.ok { background: var(--ok-soft); }
  .notice.ok svg { color: var(--ok); }
  .notice .notice-actions { margin-left: auto; display: flex; gap: 8px; flex-wrap: wrap; }

  /* Forms --------------------------------------------------------------- */
  .field { display: grid; gap: 6px; min-width: 0; }
  .field > label, .label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--ink-2);
  }
  .hint { font-size: var(--text-sm); color: var(--muted); }
  .error-text { font-size: var(--text-sm); color: var(--danger); }
  input[type='text'], input[type='number'], input[type='password'], input[type='search'], input:not([type]), select, textarea {
    width: 100%;
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-md);
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: var(--text-md);
  }
  textarea { min-height: 96px; resize: vertical; }
  input:hover, select:hover, textarea:hover { border-color: var(--faint); }
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
  }
  input::placeholder, textarea::placeholder { color: var(--faint); }
  input:disabled, select:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Segmented filter ------------------------------------------------------ */
  .segmented {
    display: inline-flex;
    padding: 2px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-md);
    background: var(--surface);
  }
  .segmented button {
    min-height: 30px;
    padding: 0 12px;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
  }
  .segmented button:hover { color: var(--ink); }
  .segmented button[aria-pressed='true'] { background: var(--primary-soft); color: var(--primary); }

  /* Data tables ------------------------------------------------------------- */
  .table-wrap { overflow-x: auto; }
  table.data { width: 100%; border-collapse: collapse; font-size: var(--text-md); }
  table.data th {
    text-align: left;
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--muted);
    padding: 10px 16px;
    border-bottom: 1px solid var(--line);
    white-space: nowrap;
  }
  table.data td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--line);
    vertical-align: middle;
  }
  table.data tr:last-child td { border-bottom: 0; }
  table.data td.num { font-variant-numeric: tabular-nums; }
  table.data td.actions { text-align: right; white-space: nowrap; }

  /* Key/value facts --------------------------------------------------------- */
  .facts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 14px 20px;
    margin: 0;
  }
  .facts div { min-width: 0; }
  .facts dt { font-size: var(--text-xs); color: var(--muted); margin-bottom: 2px; }
  .facts dd {
    margin: 0;
    font-size: var(--text-md);
    color: var(--ink);
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }

  /* Empty / loading -------------------------------------------------------- */
  .empty {
    display: grid;
    justify-items: center;
    gap: 6px;
    padding: 40px 16px;
    text-align: center;
    color: var(--muted);
  }
  .empty svg { width: 32px; height: 32px; color: var(--faint); margin-bottom: 4px; }
  .empty strong { color: var(--ink); font-weight: 500; font-size: var(--text-lg); }
  .empty p { max-width: 46ch; }
  .empty .btn { margin-top: 10px; }
  .empty .btn svg { width: 18px; height: 18px; margin: 0; color: inherit; }
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid var(--line-strong);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex: none;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Progress ------------------------------------------------------------------ */
  .progress {
    height: 6px;
    border-radius: 999px;
    background: var(--surface-subtle);
    overflow: hidden;
  }
  .progress > span {
    display: block;
    height: 100%;
    background: var(--primary);
    border-radius: inherit;
    transition: width 300ms ease;
  }
  .progress.indeterminate > span {
    width: 35% !important;
    animation: slide 1.2s ease-in-out infinite;
  }
  @keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(300%); } }

  /* Logs ---------------------------------------------------------------------- */
  .log {
    background: var(--log-bg);
    color: var(--log-ink);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.6;
    border-radius: var(--radius-md);
    padding: 12px 14px;
    overflow: auto;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  /* Dialogs ------------------------------------------------------------------- */
  dialog {
    border: 0;
    padding: 0;
    border-radius: var(--radius-lg);
    background: var(--surface-raised);
    color: var(--ink);
    box-shadow: var(--shadow-md);
    width: min(480px, calc(100vw - 32px));
  }
  dialog::backdrop { background: var(--scrim); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition-duration: 1ms !important; }
    .spinner { border-top-color: var(--primary); border-right-color: var(--primary); }
    .progress.indeterminate > span { width: 35% !important; transform: translateX(95%); }
  }
`;

/* Job history lists (device page, Jobs page). */
export const historyStyles = css`
  .hist { list-style: none; margin: 0; padding: 0; }
  .hist li {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto 96px auto;
    align-items: center;
    gap: 6px 16px;
    padding: 10px 16px;
    border-top: 1px solid var(--line);
  }
  .hist li:first-child { border-top: 0; }
  .hist .what { display: grid; gap: 2px; min-width: 0; }
  .hist .what strong { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hist .what small { color: var(--muted); font-size: var(--text-xs); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hist .what .err { color: var(--danger); white-space: normal; }
  .hist .when { color: var(--muted); font-size: var(--text-sm); text-align: right; font-variant-numeric: tabular-nums; }
  .hist .row-actions { display: flex; gap: 4px; justify-content: flex-end; }
  .chip-spin { width: 10px !important; height: 10px !important; border-width: 1.5px !important; border-color: currentColor !important; border-top-color: transparent !important; }
  @media (max-width: 640px) {
    .hist li { grid-template-columns: minmax(0, 1fr) auto; }
    .hist .when { text-align: left; }
    .hist .row-actions { grid-column: 1 / -1; justify-content: flex-start; }
  }
`;
