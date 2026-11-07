# ESP Tree Design System

<!-- impeccable:design-schema 1 -->

## Direction

ESP Tree is a field console for a radio mesh: calm enough to read at a glance, dense enough for real diagnostics, and explicit about physical consequences. The visual identity comes from the product's own domain — a dark pine instrument rail, warm signal-amber accents, monospaced identifiers, and route-tree geometry — not from generic SaaS dashboard decoration.

Operate mode. Familiar controls, restrained colour, and predictable interaction patterns outrank novelty.

## Foundations

### Colour

| Token | Value | Role |
|---|---|---|
| `--canvas` | `#f2f5f1` | Page ground, green-tinted neutral |
| `--surface` | `#ffffff` | Cards, panels, dialogs |
| `--surface-subtle` | `#f7faf6` | Secondary panels and field ground |
| `--ink` | `#17221f` | Primary text |
| `--ink-2` | `#34433e` | Secondary text and control labels |
| `--muted` | `#5f6e68` | Supporting text (AA on canvas) |
| `--faint` | `#64726c` | Metadata and labels (AA on surface) |
| `--line` | `#dfe6df` | Default borders and dividers |
| `--line-strong` | `#cbd5cd` | Emphasised borders |
| `--primary` | `#1e5b4f` | Primary actions, current selection, bridge identity |
| `--primary-strong` | `#16483f` | Primary hover/active |
| `--primary-soft` | `#e8f1eb` | Selected and informational ground |
| `--accent` | `#c88b27` | Attention, queue state, focus ring |
| `--accent-soft` | `#fbf2df` | Warning surface |
| `--danger` | `#b63c43` | Destructive action and failure |
| `--danger-soft` | `#fdf0f0` | Error surface |
| `--ok` | `#2f7b58` | Online and success |
| `--ok-soft` | `#eaf5ee` | Success surface |
| `--info` | `#356f91` | Upload and in-flight state |

The sidebar uses a dedicated deep ground (`#102a26`) with `#d6b15c` as its signal accent. Status is never conveyed by colour alone; every status also carries a label.

### Type

System UI stack for product clarity: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`. Identifiers, firmware values, event logs, and line labels use `"SFMono-Regular", Consolas, "Liberation Mono", monospace`.

| Step | Size | Use |
|---|---|---|
| Micro | 8–10px | Metadata labels, table microcopy, eyebrow |
| Small | 11–12px | Secondary copy, controls, table cells |
| Body | 13px | Body copy and form values |
| Title | 16px | Card and panel titles |
| Page title | 24–27px | One page-level heading only |
| Display figure | 25–37px | Summary figures |

Page titles use `-0.03em` to `-0.04em` tracking. Labels use uppercase microtype only for taxonomy; they are not used for every heading.

### Spacing and layout

4px base rhythm: 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30, 32, 40, 56.

- Desktop application frame: 232px fixed pine sidebar, 62px utility top bar, 32px content gutter, 1440px maximum content width.
- Tablet: 206px sidebar, 22px gutter.
- Mobile ≤760px: sidebar becomes a compact brand + horizontal navigation header; content gutter 14px.
- Cards use 14px radius; controls 6–8px; status chips 4px; true pills are reserved for counts and compact status.
- Borders do the structural work. Shadows are low-contrast and reserved for raised surfaces.

### Components

**Buttons**
- Height 34–36px desktop, 38–44px on touch layouts.
- Primary: pine fill, white text. Secondary: white fill, neutral border. Danger: restrained red outline or red fill only for confirmation.
- Every button has hover, focus-visible, active, disabled, and loading labels where applicable.

**Navigation**
- Persistent desktop sidebar with four destinations: Network, Jobs, Activity, Settings.
- Current destination is marked by both background and a warm left rule; `aria-current="page"` is set.
- Mobile navigation remains visible and horizontally scrollable rather than hiding behind a hamburger.

**Cards and panels**
- One card level only. Do not nest cards to express grouping; use section headings and dividers.
- Panel header: title, one-line purpose, optional count. Panel body owns only the content.

**Tables and trees**
- Tree rows are real buttons for the primary selection action, with sibling action buttons outside the button.
- Tables collapse to stacked records at ≤760px; columns never force page-level horizontal scrolling.
- Log surfaces are the deliberate dark exception, matching the physical console metaphor.

**Forms**
- Labels above fields, 10–11px semibold. Helper text below.
- Inputs 34–40px high, 6–8px radius, visible focus ring using accent at 2px plus pine shadow.
- Placeholder text is never the only label.

**Dialogs**
- Native-feeling alert dialogs for high-consequence actions: title, consequence, extra detail, cancel, explicit action.
- Escape and backdrop dismissal are supported unless an operation is in progress.
- Browser `confirm()` is not part of the product vocabulary.

**Status**
- Online: green dot + “Online”.
- Offline: red dot + reason.
- Working: blue/amber chip with a verb (“Uploading 42%”, “Compiling”).
- Empty: explain what will appear and the next useful action.

### Motion

150–200ms for hover and state transitions. No page-load choreography. Spinners only while a real request is in flight. Respect `prefers-reduced-motion`.

## Responsive contract

- Content order is meaningful without hover.
- Primary actions remain reachable without horizontal scrolling.
- Touch targets are at least 36px, and 44px where vertical space permits.
- Logs and wide tables scroll within their own surface.
- Page heading, summary, and primary action stay above the fold on a 390px viewport where the information is needed to act.

## Accessibility contract

- Keyboard focus is always visible, with a 2px amber outline and offset.
- Interactive controls are buttons or links, not clickable containers.
- Icon-only controls have tooltips and accessible names.
- Status is expressed in text, not colour alone.
- All body and metadata text meets AA contrast on its actual background.
- The app remains usable at 200% zoom and at 390px width.
