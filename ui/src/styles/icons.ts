import { html, svg, type TemplateResult } from 'lit';

/*
 * Authored 24px line icons, one stroke weight (1.8), round caps.
 * Use these instead of emoji or text glyphs. Size them with CSS
 * (width/height) and colour them with `color`; they draw in currentColor.
 */
const paths = {
  network: svg`<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2V12M12 12l-5.4 5.2M12 12l5.4 5.2"/>`,
  jobs: svg`<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5.5l1 1 1.8-2M4 11.5l1 1 1.8-2"/><circle cx="5" cy="18" r="1.2"/>`,
  activity: svg`<path d="M3 12h4l2.5-7 5 14 2.5-7h4"/>`,
  settings: svg`<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2L5.5 5.5"/>`,
  plus: svg`<path d="M12 5v14M5 12h14"/>`,
  refresh: svg`<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>`,
  search: svg`<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>`,
  chevronRight: svg`<path d="M9 5l7 7-7 7"/>`,
  chevronLeft: svg`<path d="M15 5l-7 7 7 7"/>`,
  chevronDown: svg`<path d="M5 9l7 7 7-7"/>`,
  arrowUp: svg`<path d="M12 19V5M6 11l6-6 6 6"/>`,
  arrowDown: svg`<path d="M12 5v14M6 13l6 6 6-6"/>`,
  key: svg`<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>`,
  alert: svg`<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.4v.1"/>`,
  info: svg`<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>`,
  check: svg`<path d="M5 12.5l4.5 4.5L19 7.5"/>`,
  checkCircle: svg`<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8L16.2 9.6"/>`,
  close: svg`<path d="M6 6l12 12M18 6L6 18"/>`,
  upload: svg`<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>`,
  download: svg`<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>`,
  pause: svg`<path d="M9 5v14M15 5v14"/>`,
  play: svg`<path d="M7 4.5v15l12-7.5z"/>`,
  stop: svg`<rect x="6" y="6" width="12" height="12" rx="1.5"/>`,
  code: svg`<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>`,
  chip: svg`<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>`,
  usb: svg`<path d="M12 3v14"/><circle cx="12" cy="19" r="2"/><path d="M12 13l-4-3V7M12 11l4-2.5V6"/><rect x="6.6" y="5" width="2.8" height="2.4" rx=".4"/><circle cx="16" cy="5.2" r="1.2"/>`,
  wifi: svg`<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.5a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19" r="1"/>`,
  bridge: svg`<path d="M12 21v-8"/><path d="M8.5 9.5a5 5 0 0 1 7 0M5.8 6.8a9 9 0 0 1 12.4 0"/><circle cx="12" cy="12" r="1.6"/>`,
  relay: svg`<circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="M7 12h3M14 12h3"/><path d="M10.5 9.5l2.5 2.5-2.5 2.5"/>`,
  power: svg`<path d="M12 3v8"/><path d="M6.6 6.6a8 8 0 1 0 10.8 0"/>`,
  trash: svg`<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>`,
  eyeOff: svg`<path d="M3 3l18 18"/><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4.3 9.5 6-.5.8-1.5 2.2-2.9 3.5M6.4 7.6C4.6 8.9 3.2 10.7 2.5 12c1 1.7 4.5 6 9.5 6a9.6 9.6 0 0 0 4.4-1.1"/><path d="M9.9 10a3 3 0 0 0 4.1 4.1"/>`,
  eye: svg`<path d="M2.5 12c1-1.7 4.5-6 9.5-6s8.5 4.3 9.5 6c-1 1.7-4.5 6-9.5 6s-8.5-4.3-9.5-6z"/><circle cx="12" cy="12" r="3"/>`,
  external: svg`<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>`,
  ha: svg`<path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M5.5 10v9.5h13V10"/><circle cx="12" cy="14" r="1.6"/><path d="M12 15.6v3.9"/>`,
  clock: svg`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  lock: svg`<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>`,
  build: svg`<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.4-.6-.6-2.4z"/>`,
  more: svg`<circle cx="12" cy="5.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="18.5" r="1.3"/>`,
  fullscreen: svg`<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>`,
};

export type IconName = keyof typeof paths;

export function icon(name: IconName, label?: string): TemplateResult {
  return html`<svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    role=${label ? 'img' : 'presentation'}
    aria-hidden=${label ? 'false' : 'true'}
    aria-label=${label ?? ''}
  >${paths[name]}</svg>`;
}

/** ESP Tree mark: a bridge root fanning out to remotes. */
export const brandMark = html`<svg class="brand-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M16 27V16M16 16L8.5 9.5M16 16l7.5-6.5M16 16V7.5"/>
  <circle cx="16" cy="6" r="2.3" fill="currentColor" stroke="none"/>
  <circle cx="7.5" cy="8.5" r="2.3" fill="currentColor" stroke="none"/>
  <circle cx="24.5" cy="8.5" r="2.3" fill="currentColor" stroke="none"/>
</svg>`;
