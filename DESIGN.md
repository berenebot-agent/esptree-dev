---
name: ESP Tree
description: A Home Assistant panel that runs an ESP-NOW radio mesh, with a live route tree first and HA-native chrome around it.
colors:
  canvas: "#f4f6f6"
  surface: "#ffffff"
  surface-subtle: "#f2f5f5"
  surface-raised: "#ffffff"
  surface-hover: "#eef2f2"
  ink: "#1a1f20"
  ink-2: "#3a4446"
  muted: "#59656a"
  faint: "#66727a"
  line: "#e0e5e6"
  line-strong: "#c9d1d3"
  toolbar: "#0b3b4b"
  toolbar-ink: "#ffffff"
  toolbar-muted: "rgba(255, 255, 255, 0.72)"
  toolbar-hover: "rgba(255, 255, 255, 0.1)"
  toolbar-indicator: "#f5b041"
  primary: "#0f6e69"
  primary-strong: "#0a5551"
  primary-soft: "#e2f1ef"
  on-primary: "#ffffff"
  accent: "#9a5b00"
  accent-fill: "#f39c12"
  accent-soft: "#fdf0d9"
  danger: "#c0352b"
  danger-strong: "#9f2a22"
  danger-soft: "#fdebe9"
  on-danger: "#ffffff"
  ok: "#2a7a3b"
  ok-dot: "#3fa25a"
  ok-soft: "#e5f3e8"
  info: "#0b6aa6"
  info-soft: "#e2f0fa"
  log-bg: "#12191b"
  log-ink: "#d7e0e1"
  log-muted: "#8a9a9e"
  scrim: "rgba(10, 20, 22, 0.45)"
  canvas-dark: "#111414"
  surface-dark: "#1b1f1f"
  surface-subtle-dark: "#222727"
  surface-raised-dark: "#232828"
  surface-hover-dark: "#283030"
  ink-dark: "#e3e8e8"
  ink-2-dark: "#c2cbcb"
  muted-dark: "#9aa5a6"
  faint-dark: "#909c9d"
  line-dark: "#2c3333"
  line-strong-dark: "#3c4545"
  toolbar-dark: "#0f2a32"
  toolbar-ink-dark: "#e9f1f2"
  toolbar-muted-dark: "rgba(233, 241, 242, 0.7)"
  toolbar-hover-dark: "rgba(255, 255, 255, 0.08)"
  toolbar-indicator-dark: "#f5b041"
  primary-dark: "#5cc8ba"
  primary-strong-dark: "#7dd8cc"
  primary-soft-dark: "#16302d"
  on-primary-dark: "#062420"
  accent-dark: "#f2b54a"
  accent-fill-dark: "#f2b54a"
  accent-soft-dark: "#33280f"
  danger-dark: "#f28b82"
  danger-strong-dark: "#f6a49d"
  danger-soft-dark: "#3a1e1c"
  on-danger-dark: "#2a0b08"
  ok-dark: "#86cf98"
  ok-dot-dark: "#5fbf77"
  ok-soft-dark: "#173020"
  info-dark: "#82c6f2"
  info-soft-dark: "#132a39"
  log-bg-dark: "#0b0f10"
  log-ink-dark: "#d7e0e1"
  log-muted-dark: "#879598"
  scrim-dark: "rgba(0, 0, 0, 0.6)"
typography:
  headline:
    fontFamily: 'Roboto, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  brand:
    fontFamily: 'Roboto, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.01em"
  title:
    fontFamily: 'Roboto, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontFamily: 'Roboto, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: 'Roboto, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.45
  caption:
    fontFamily: 'Roboto, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.45
  mono:
    fontFamily: '"Roboto Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  gutter: "24px"
  gutter-narrow: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.on-primary}"
  button-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 14px"
  button-default-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.ink}"
  button-danger-solid:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 14px"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    height: "36px"
    padding: "0 10px"
  button-text-hover:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
  chip-ok:
    backgroundColor: "{colors.ok-soft}"
    textColor: "{colors.ok}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  chip-warn:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  chip-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  chip-info:
    backgroundColor: "{colors.info-soft}"
    textColor: "{colors.info}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  chip-neutral:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    height: "22px"
    padding: "0 8px"
  notice:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  notice-warn:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  notice-danger:
    backgroundColor: "{colors.danger-soft}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  field-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "8px 12px"
  segmented-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    height: "30px"
    padding: "0 12px"
  toolbar:
    backgroundColor: "{colors.toolbar}"
    textColor: "{colors.toolbar-ink}"
    height: "56px"
  toolbar-tab-hover:
    backgroundColor: "{colors.toolbar-hover}"
    textColor: "{colors.toolbar-ink}"
  dialog:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    width: "min(480px, calc(100vw - 32px))"
  log:
    backgroundColor: "{colors.log-bg}"
    textColor: "{colors.log-ink}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    typography: "{typography.mono}"
  progress-track:
    backgroundColor: "{colors.surface-subtle}"
    rounded: "{rounded.pill}"
    height: "6px"
  progress-fill:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    height: "6px"
---

# Design System: ESP Tree

## Overview

**Creative North Star: "The Panel That Runs a Mesh"**

ESP Tree is a Home Assistant panel that happens to run a radio mesh. It is framed by Home Assistant's own panel grammar (a 56px app toolbar, a tab row with an underline indicator, flat 12px cards with a 1px outline, 14px body text) and it puts the live route tree first. The mesh is the content; the chrome is borrowed from the host, so the add-on reads as part of Home Assistant rather than a separate app running beside it.

The character is calm and instrument-like. Most visits are a health glance: is the mesh online, is a job running. The page answers that in one status line, shows every node and its link in the tree, and lets the visitor act on a node from its row or its page. Density is high in the tree (aligned columns for signal, hops, last seen, firmware, status) and low everywhere else. Colour is restrained: deep teal for the frame and primary actions, amber for queued and attention states, and Home Assistant-style green and red for status. Status is always stated in words; colour only reinforces it.

Confirmed visual rejections, from the owner's direction: an in-app sidebar, a hero banner, and a KPI strip. The SaaS ops-dashboard arrangement is not the model.

**Key Characteristics:**
- A Home Assistant panel first: 56px toolbar, horizontal tabs, no in-app vertical navigation.
- Flat surfaces: 1px outlines do the structural work; no card shadows at rest.
- Route tree as the signature: connector geometry encodes each link's signal quality.
- Teal and amber identity on Home Assistant-standard light and dark surfaces.
- Status by word first, colour second; numbers in tabular figures.
- Roboto when the system has it, with the platform sans behind it; no font files are shipped.

### Hard constraints

- **No left sidebar, navigation rail, or drawer-style vertical menu at any width.** The UI runs inside a Home Assistant ingress panel, and Home Assistant already owns the left sidebar. A second vertical navigation column duplicates the host's chrome and reads as two competing apps.
- **Primary navigation is the horizontal tab row in the 56px toolbar** (Network, Jobs, Activity, Settings). Below 760px the tab row wraps onto its own full-width 44px row beneath the brand. It stays horizontal and scrolls sideways if it must.
- **Secondary navigation is contextual:** breadcrumbs (`.crumbs`), back links, and in-page filters such as the segmented control.
- **The route-tree guide lines in the left gutter of each row are data connectors, not navigation.** They draw the parent-child structure and each link's quality. They are part of the world and do not count as a vertical menu.
- **Components do not hard-code colours.** Every colour a component uses comes from a token in `ui/src/styles/theme.ts`. A new colour is added there for both the light and the dark theme before a component uses it.

### Named Rules

**The Horizontal Navigation Rule.** Navigation between top-level areas is a horizontal row inside the toolbar at every width. Anything vertical beside the content is a contextual device, not a menu.

## Colors

The palette is a deep teal frame with a teal primary, amber for attention, and a neutral green-grey ground. Values are defined once in `ui/src/styles/theme.ts` as CSS custom properties, one set for light and one for dark. The tables below mirror the frontmatter; the frontmatter is normative.

**Theme selection.** The app follows Home Assistant's theme. It reads the resolved `--primary-background-color` of the parent document (same-origin ingress), takes its luminance, and sets `theme="dark"` or `theme="light"` on its host; it re-checks every 5 seconds. If HA cannot be read, no attribute is set and the OS `prefers-color-scheme` decides. Dark tokens apply under `:host([theme='dark'])`, and under the OS dark preference unless `theme="light"` is set.

### Neutral and surface
| Token | Light | Dark | Role |
|---|---|---|---|
| `canvas` | `#f4f6f6` | `#111414` | Page ground behind cards |
| `surface` | `#ffffff` | `#1b1f1f` | Cards, fields, buttons |
| `surface-subtle` | `#f2f5f5` | `#222727` | Table head, tree root row, notices, track |
| `surface-raised` | `#ffffff` | `#232828` | Dialogs |
| `surface-hover` | `#eef2f2` | `#283030` | Row and button hover |
| `ink` | `#1a1f20` | `#e3e8e8` | Primary text |
| `ink-2` | `#3a4446` | `#c2cbcb` | Secondary text, control labels |
| `muted` | `#59656a` | `#9aa5a6` | Supporting text, table heads |
| `faint` | `#66727a` | `#909c9d` | Placeholders, metadata glyphs |
| `line` | `#e0e5e6` | `#2c3333` | Card outlines, row dividers |
| `line-strong` | `#c9d1d3` | `#3c4545` | Control borders, guide rails |

### Toolbar
| Token | Light | Dark | Role |
|---|---|---|---|
| `toolbar` | `#0b3b4b` | `#0f2a32` | Deep teal app bar |
| `toolbar-ink` | `#ffffff` | `#e9f1f2` | Brand, current tab |
| `toolbar-muted` | `rgba(255, 255, 255, 0.72)` | `rgba(233, 241, 242, 0.7)` | Inactive tabs, connection text |
| `toolbar-hover` | `rgba(255, 255, 255, 0.1)` | `rgba(255, 255, 255, 0.08)` | Tab hover ground |
| `toolbar-indicator` | `#f5b041` | `#f5b041` | Current-tab underline, brand mark, live count |

### Primary (teal)
| Token | Light | Dark | Role |
|---|---|---|---|
| `primary` | `#0f6e69` | `#5cc8ba` | Primary buttons, links, focus outline, progress fill, bridge identity |
| `primary-strong` | `#0a5551` | `#7dd8cc` | Primary hover |
| `primary-soft` | `#e2f1ef` | `#16302d` | Selected segment, text-button hover, bridge disc |
| `on-primary` | `#ffffff` | `#062420` | Text on primary |

### Attention and status
| Token | Light | Dark | Role |
|---|---|---|---|
| `accent` | `#9a5b00` | `#f2b54a` | Warning text and icons |
| `accent-fill` | `#f39c12` | `#f2b54a` | Fair-signal bars and connectors, warning dots |
| `accent-soft` | `#fdf0d9` | `#33280f` | Warning chip and notice ground |
| `danger` | `#c0352b` | `#f28b82` | Offline, failure, weak link, destructive text |
| `danger-strong` | `#9f2a22` | `#f6a49d` | Danger-solid hover |
| `danger-soft` | `#fdebe9` | `#3a1e1c` | Danger chip, notice, offline disc |
| `on-danger` | `#ffffff` | `#2a0b08` | Text on danger-solid |
| `ok` | `#2a7a3b` | `#86cf98` | Online chip text |
| `ok-dot` | `#3fa25a` | `#5fbf77` | Online dot, strong-signal bars and connector |
| `ok-soft` | `#e5f3e8` | `#173020` | Online chip ground |
| `info` | `#0b6aa6` | `#82c6f2` | In-flight chips, spinners |
| `info-soft` | `#e2f0fa` | `#132a39` | In-flight chip ground |

### Log and scrim
| Token | Light | Dark | Role |
|---|---|---|---|
| `log-bg` | `#12191b` | `#0b0f10` | Log and code surface; stays dark in both themes |
| `log-ink` | `#d7e0e1` | `#d7e0e1` | Log text |
| `log-muted` | `#8a9a9e` | `#879598` | Log secondary text |
| `scrim` | `rgba(10, 20, 22, 0.45)` | `rgba(0, 0, 0, 0.6)` | Dialog backdrop |

### Named Rules

**The Tokens Only Rule.** Components read `var(--token)` and nothing else for colour. A new colour gets a token in `theme.ts` with a dark value beside its light value, so both themes stay correct.

**The Word Beside Colour Rule.** Every status is a word first. A dot, bar, or connector colour supports a label; it never carries the state alone.

## Typography

**Display Font:** none. The product has no display face and ships none.
**Body Font:** Roboto, with "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif behind it. Roboto is used when the system has it, as Home Assistant does. No font files are shipped, by decision, to keep the add-on dependency-free.
**Label/Mono Font:** "Roboto Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace. Mono is used only for MAC addresses, YAML, logs, and inline code.

**Character:** Plain, host-native sans with a mono used for machine identifiers. Figures and versions use tabular numerals in the sans rather than switching to mono.

### Hierarchy
- **Headline** (500, 24px / 1.2, letter-spacing -0.01em): the one page heading on each page (`.page-head h1`), e.g. "Network".
- **Brand** (500, 20px, -0.01em): "ESP Tree" in the toolbar, beside the 26px mark.
- **Title** (500, 16px / 1.3): card titles, empty-state headings, the bridge's name in the tree.
- **Body** (400, 14px / 1.45): default text. Metadata and sub-lines drop to 12px. Long copy is kept within 46ch in empty states.
- **Label** (500, 13px): field labels, notice actions, segmented controls, secondary chips.
- **Caption** (400, 12px): table column heads (500), chip text (500), breadcrumbs (13px), build footer.
- **Mono** (400, 12px / 1.6; 0.92em inside running text): MACs, YAML, logs, code.

### Named Rules

**The Tabular Figures Rule.** Numbers, times, firmware versions, and dBm values use `font-variant-numeric: tabular-nums` so they align in columns. Mono is reserved for identifiers and logs.

## Layout

- **Frame:** a sticky 56px toolbar (`--toolbar-h`) full width, its contents capped at `--content-max` (1280px) plus two gutters and centred. Below the toolbar, a `main` column capped at 1280px, padded 20px top, 32px bottom, and the gutter (24px) at the sides. A 12px build footer sits below.
- **Gutter:** 24px (`--gutter`); 16px at ≤760px.
- **Page rhythm:** pages are a grid with 16px row gaps. The page head is a flex row with the title and sub-line on the left and actions on the right; it wraps under the title when space is short.
- **Card internals:** card head 14px 16px with a bottom divider; body 16px; foot 12px 16px with a top divider.
- **Observed spacing:** there is no spacing scale token. The build uses values from 4 to 40px; most gaps are 8, 12, or 16px. New work should reuse those steps rather than invent new ones.
- **Tree columns (desktop):** one shared grid across all rows, so columns align at every depth: name, signal (124px), hops (48px), last seen (104px), firmware (84px), status (200px), actions (120px). Each row is at least 56px high.
- **Responsive changes:**
  - ≤1100px: the firmware column is hidden and the other columns tighten.
  - ≤860px: the tree's header row is hidden; each row becomes two lines: name and action on top, the facts (signal, hops, last seen, status) wrapped beneath, indented 42px under the name.
  - ≤760px: the toolbar wraps (brand row 52px, tab row 44px full width), the gutter drops to 16px, and page actions stop wrapping.
  - ≤640px: job history rows collapse from four columns to two, with the action row on its own line.
- **Facts grid:** key/value facts use `repeat(auto-fill, minmax(150px, 1fr))` with 14px 20px gaps.
- **Dialogs:** width `min(480px, 100vw - 32px)`.
- **Tables:** `table.data` sits in a horizontally scrolling wrapper, so a wide table scrolls inside its own card and never pushes the page.

## Elevation & Depth

Flat by default. Depth comes from 1px outlines and tonal grounds (`surface`, `surface-subtle`, `surface-hover`), not from shadows. Cards have no shadow at rest. Shadows exist for floating surfaces only: dialogs and modal panels (`--shadow-md`: the shared dialog, device config, OTA box, queue page). Hover changes ground colour, not elevation.

### Shadow Vocabulary
- **Floating surface** (`box-shadow: 0 6px 24px rgba(15, 30, 32, 0.12), 0 1px 3px rgba(15, 30, 32, 0.08)` light; `0 8px 28px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4)` dark): dialogs and modal panels, token `--shadow-md`.
- **Resting lift** (`box-shadow: 0 1px 2px rgba(15, 30, 32, 0.06)` light; `0 1px 2px rgba(0, 0, 0, 0.4)` dark): token `--shadow-sm`, used only by the config page's single raised panel.
- **Focus ring on fields** (`box-shadow: 0 0 0 1px var(--primary)`): a 1px ring that accompanies the primary border on focus. It is not a glow.

### Named Rules

**The Flat Card Rule.** Cards are flat at rest: a 1px `line` outline and a `surface` ground. Shadows appear on floating surfaces only, never as a hover effect on a card.

## Shapes

- **Cards and dialogs:** 12px radius (`--radius-lg`), 1px `line` outline on cards; dialogs have no outline, only the shadow and the surface ground.
- **Controls, fields, notices, logs:** 8px radius (`--radius-md`). Small buttons and the segmented-control segments: 6px (`--radius-sm`).
- **Chips, tab counts, progress tracks:** full pill (999px).
- **Circles:** 50% for status dots, the 8px dot in the toolbar, the 32px node disc in the tree, and spinners.
- **Tab indicator:** a 3px amber bar inset 10px from each side of the tab, with its top corners rounded 3px.
- **Form geometry:** inputs are 40px high with an 8px 12px inset; buttons are 36px high (30px small, 36px square for icon-only).

### Named Rules

**The Route Line Rule.** The tree's connectors are the one place where a line carries meaning. Each node's elbow takes its colour and weight from that node's link quality, so a weak hop is visible in the shape of the network without reading a number.

## Components

Components use the shared vocabulary in `ui/src/styles/shared.ts` and the job vocabulary in `ui/src/lib/job-status.ts`. Each one adopts the shared styles first and adds only local layout.

### Icons
- Authored 24px line icons in `ui/src/styles/icons.ts`, drawn with `currentColor`, one 1.8 stroke weight, round caps. Drawn at 16px in row actions, 18px in buttons, 20px in notices, 32px in empty states.
- The ESP Tree mark is a bridge fanning out to remotes, in `toolbar-indicator`.
- Icons are inline SVG. Emoji are not used.

### Buttons
- **Shape:** 8px radius; 36px high with 0 14px padding; 30px high (`.btn.sm`) with 6px radius for compact row actions.
- **Default:** `surface` ground, `line-strong` border, `ink` text. Hover moves the ground to `surface-hover`.
- **Primary:** `primary` ground with `on-primary` text and a matching border. Hover moves to `primary-strong`. It marks the page's main action.
- **Danger:** outlined with `danger` text by default. `danger-solid` (filled `danger`, `on-danger` text, hover `danger-strong`) appears only on the confirm button of a destructive dialog.
- **Text:** no border or ground; `primary` text; hover fills `primary-soft`. Used for row actions such as YAML and Hide.
- **Icon-only:** 36px square, or 30px when small. Always carries an accessible name.
- **States:** focus-visible is a 2px `primary` outline offset 2px. Disabled is 50% opacity with a not-allowed cursor. A busy button uses a progress cursor and a spinner.

### Chips (status)
- **Shape:** full pill, 22px high, 8px side padding, 12px medium text, no border.
- **Tones:** `ok` (online), `warn` (queued, no config, attention), `danger` (offline, failed), `info` (in flight), `primary` (selected/bridge), and neutral (`surface-subtle`).
- **Content:** a leading 8px dot for ok and danger, or a 10px spinner for in-flight states, then the label. The label is the status: "Online", "Missed heartbeats", "Upload queued · #1", "Uploading 42%".
- **Job states:** job-status labels come from `job-status.ts` (for example "Succeeded", "Failed", "Building", "Awaiting confirmation"). Tones follow the table: ok for success, danger for failed and rejoin timeout, warn for aborted, version mismatch, queued and pending confirmation, info for live states.

### Notices
- **Shape:** 8px radius, 12px 14px padding, 20px icon at the start, text in `ink-2` with bold runs in `ink`.
- **Tones:** neutral (`surface-subtle`), warn (`accent-soft`, icon `accent`), danger (`danger-soft`, icon `danger`), info (`info-soft`), ok (`ok-soft`).
- **Actions:** pushed to the right on the same row (`.notice-actions`).
- **Outage banners:** the app's full-width banner under the toolbar uses the same tones, with a link to the fix on its right.

### Fields
- **Style:** 8px radius, `surface` ground, 1px `line-strong` border, 40px high, 8px 12px inset, `ink` text.
- **Labels:** above the field, 13px medium, `ink-2`, with 6px between label and field. A hint sits below in 13px `muted`; an error in 13px `danger`.
- **Hover:** border moves to `faint`.
- **Focus:** border turns `primary` with a 1px `primary` ring. No outline is drawn on fields.
- **Disabled:** 60% opacity, not-allowed cursor.
- **Placeholder:** `faint`. A placeholder is never the only label.

### Segmented filter
- A 2px-padded group with an 8px-radius `line-strong` border and `surface` ground.
- Segments are 30px high, 6px radius, 13px medium text in `muted`. Hover shows `ink`. The pressed segment is `primary-soft` with `primary` text (`aria-pressed="true"`).

### Tables and tree rows
- **Data tables:** column heads are 12px medium `muted` with 10px 16px padding and a 1px `line` bottom divider. Cells are 14px with 12px 16px padding. Rows divide with `line`; the last row has none. Numeric cells are tabular.
- **Route tree:** a single card. The head is `surface-subtle` with 12px `muted` column labels. Each row is at least 56px, divided by `line`, hovering to `surface-hover`. The bridge root row sits on `surface-subtle`.
- **Row content:** a 32px node disc (bridge on `primary-soft`, offline on `danger-soft`, others on `surface-subtle`), then the name as a link with a 12px meta line of role, MAC (mono), and chip type. Signal, hops, last seen, firmware, and status follow in aligned columns. The primary row action is a text button outside the link.
- **The whole row opens the device:** the name link's hit area is stretched over the row (`position: relative` row, `.title::after { inset: 0 }`), so a click on any cell — signal, hops, last seen, firmware, status — goes to that device. Row actions sit above the overlay (`z-index: 1`) and keep their own behaviour. The row shows `cursor: pointer`, and keyboard focus on the link rings the row.

### Route tree signature
- **Connectors:** each ancestor level draws a 2px `line-strong` rail through the rows below it. Each node's elbow comes off its parent's rail with its own colour and weight:
  - **Strong** (RSSI ≥ -67 dBm): 3px `ok-dot` link.
  - **Fair** (-80 to -68 dBm): 2px `accent-fill` link.
  - **Weak** (below -80 dBm): 1px `danger` link.
  - **Down** (offline): dashed `danger` link at 70% opacity.
  - **Unknown** (no RSSI): 2px `line-strong`.
  - The last child's rail stops at the elbow.
- **Signal meter:** four bars rising from 5px to 14px, 4px wide. Strong lights four bars in `ok-dot`, fair three in `accent-fill`, weak one in `danger`. The dBm value is printed beside the bars, so the meter is never the only signal.
- **Offline rows:** the disc and name shift to `danger` and `ink-2`, and the status reads "Missed heartbeats", "Not reported by bridge", or "Offline".

### Facts
- Key/value pairs in an auto-fill grid. Keys are 12px `muted`; values are 14px `ink` with tabular figures and overflow wrapping.

### Empty states
- Centred, 40px 16px padding. A 32px icon in `faint`, a 16px medium heading in `ink`, a body line in `muted` (46ch maximum), and an optional button 10px below. The copy says what will appear and the next useful action.

### Progress
- A 6px full-pill track in `surface-subtle` with a `primary` fill that eases its width over 300ms. Indeterminate progress uses a 35% sliding bar.

### Logs
- `log-bg` ground, `log-ink` text, 12px mono at 1.6 line height, 8px radius, 12px 14px padding, scrolling, wrapping long lines. Logs stay dark in the light theme.

### Dialogs
- The native `<dialog>` with a `surface-raised` ground, 12px radius, `shadow-md`, and a `scrim` backdrop. Width is `min(480px, 100vw - 32px)`.
- Body: 22px padding, a title (20px medium), a message in `ink-2`, an optional consequence notice (`danger` for destructive, otherwise warn), and an error line if the action fails.
- Actions: a right-aligned row with Cancel (default button) and the confirm button: `primary` for ordinary actions, `danger-solid` for destructive ones. The confirm button shows a spinner and "Working…" while busy.
- Escape and backdrop clicks close the dialog unless an action is running. Browser `confirm()` is not used.

### Toolbar and navigation
- **Toolbar:** 56px, `toolbar` ground, `toolbar-ink` text. Left: the mark and "ESP Tree". Then the four tabs. Right: a connection status with an 8px dot and the bridge's name or a status word.
- **Tabs:** 14px medium, `toolbar-muted` by default; hover fills `toolbar-hover` and lifts the text to `toolbar-ink`. The current tab carries `aria-current="page"`, `toolbar-ink` text, and a 3px `toolbar-indicator` underline.
- **Jobs count:** a 20px pill beside "Jobs". It is translucent white by default and turns `toolbar-indicator` with dark text when a job is running. A paused queue shows a pause icon. The count has an accessible label.
- **Focus:** a 2px `toolbar-indicator` outline, inset.
- **Mobile:** the tab row moves to its own full-width row beneath the brand, 44px high, with 12px tab padding.

### Motion
- Hover and state transitions are 120 to 150ms ease: tab colour, row ground, button ground and border. Progress width eases over 300ms.
- Spinners rotate at 0.8s linear while a real request or job is in flight. A live job shows a 1.6s pulsing dot beside its status (job page).
- No page-load choreography.
- **Reduced motion:** under `prefers-reduced-motion: reduce`, animations are removed and transitions shrink to 1ms. The spinner stays as a static ring. An indeterminate progress bar becomes a full-width bar at 50% opacity.

### Status and text
- Every status carries a word: "Online", "Offline", "Missed heartbeats", "Compiling", "Uploading 42%", "Failed". Colour, bars, and dots reinforce the word; they never replace it.
- Icon-only controls carry an accessible name and a tooltip.

## Do's and Don'ts

### Do:
- **Do** put the four top-level destinations (Network, Jobs, Activity, Settings) in the horizontal tab row of the 56px toolbar.
- **Do** use `var(--token)` from `theme.ts` for every colour, and add a new token with its dark value when a new colour is needed.
- **Do** lead every status with a word, and keep the dBm value beside the signal bars.
- **Do** keep cards flat: a `surface` ground, a 1px `line` outline, a 12px radius, and one card level only.
- **Do** use the tree's shared 56px-row grid for device lists, so columns align at every depth.
- **Do** follow Home Assistant's theme through the `theme` attribute and fall back to the OS preference.
- **Do** use the authored icons in `icons.ts` at 16 to 20px, drawn in `currentColor`.
- **Do** use tabular figures for numbers, versions, and times, and mono only for MACs, YAML, and logs.
- **Do** put a focus-visible 2px outline on every interactive control.

### Don't:
- **Don't** add a left sidebar, navigation rail, or drawer-style vertical menu at any width.
- **Don't** hard-code a colour, shadow, or radius in a component when a token exists or should exist.
- **Don't** nest cards to show grouping. Use section heads and dividers inside one card.
- **Don't** use a shadow on a card at rest, and don't use a hover shadow to show an element is interactive.
- **Don't** convey status by colour alone, or by a dot with no label.
- **Don't** use `confirm()` for consequential actions; use the shared confirm dialog.
- **Don't** show a placeholder as the only label on a field.
- **Don't** add page-load choreography or new looping animation beyond the spinner and the live-job pulse, and don't ignore `prefers-reduced-motion`.
