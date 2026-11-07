import { css } from 'lit';

/*
 * Design tokens. Declared on the app host; custom properties inherit through
 * every nested shadow root, so components read them with var(--token).
 *
 * Values follow Home Assistant's panel conventions (surfaces, radii, status
 * colours, light/dark) with ESP Tree's own teal and amber as identity.
 * Never hard-code a colour in a component: add or reuse a token here so both
 * themes stay correct.
 */
const light = css`
  --canvas: #f4f6f6;
  --surface: #ffffff;
  --surface-subtle: #f2f5f5;
  --surface-raised: #ffffff;
  --surface-hover: #eef2f2;
  --ink: #1a1f20;
  --ink-2: #3a4446;
  --muted: #59656a;
  --faint: #66727a;
  --line: #e0e5e6;
  --line-strong: #c9d1d3;

  --toolbar: #0b3b4b;
  --toolbar-ink: #ffffff;
  --toolbar-muted: rgba(255, 255, 255, 0.72);
  --toolbar-hover: rgba(255, 255, 255, 0.1);
  --toolbar-indicator: #f5b041;

  --primary: #0f6e69;
  --primary-strong: #0a5551;
  --primary-soft: #e2f1ef;
  --on-primary: #ffffff;

  --accent: #9a5b00;
  --accent-fill: #f39c12;
  --accent-soft: #fdf0d9;
  --danger: #c0352b;
  --danger-strong: #9f2a22;
  --danger-soft: #fdebe9;
  --on-danger: #ffffff;
  --ok: #2a7a3b;
  --ok-dot: #3fa25a;
  --ok-soft: #e5f3e8;
  --info: #0b6aa6;
  --info-soft: #e2f0fa;

  --log-bg: #12191b;
  --log-ink: #d7e0e1;
  --log-muted: #8a9a9e;

  --shadow-sm: 0 1px 2px rgba(15, 30, 32, 0.06);
  --shadow-md: 0 6px 24px rgba(15, 30, 32, 0.12), 0 1px 3px rgba(15, 30, 32, 0.08);
  --scrim: rgba(10, 20, 22, 0.45);
  color-scheme: light;
`;

const dark = css`
  --canvas: #111414;
  --surface: #1b1f1f;
  --surface-subtle: #222727;
  --surface-raised: #232828;
  --surface-hover: #283030;
  --ink: #e3e8e8;
  --ink-2: #c2cbcb;
  --muted: #9aa5a6;
  --faint: #909c9d;
  --line: #2c3333;
  --line-strong: #3c4545;

  --toolbar: #0f2a32;
  --toolbar-ink: #e9f1f2;
  --toolbar-muted: rgba(233, 241, 242, 0.7);
  --toolbar-hover: rgba(255, 255, 255, 0.08);
  --toolbar-indicator: #f5b041;

  --primary: #5cc8ba;
  --primary-strong: #7dd8cc;
  --primary-soft: #16302d;
  --on-primary: #062420;

  --accent: #f2b54a;
  --accent-fill: #f2b54a;
  --accent-soft: #33280f;
  --danger: #f28b82;
  --danger-strong: #f6a49d;
  --danger-soft: #3a1e1c;
  --on-danger: #2a0b08;
  --ok: #86cf98;
  --ok-dot: #5fbf77;
  --ok-soft: #173020;
  --info: #82c6f2;
  --info-soft: #132a39;

  --log-bg: #0b0f10;
  --log-ink: #d7e0e1;
  --log-muted: #879598;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 8px 28px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4);
  --scrim: rgba(0, 0, 0, 0.6);
  color-scheme: dark;
`;

const scale = css`
  --font-sans: Roboto, "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "Roboto Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  --text-xs: 12px;
  --text-sm: 13px;
  --text-md: 14px;
  --text-lg: 16px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --gutter: 24px;
  --content-max: 1280px;
  --toolbar-h: 56px;
`;

/*
 * Theme selection: the app sets `theme="dark"|"light"` on its host from Home
 * Assistant's own theme when it can read it (ingress is same-origin). With no
 * attribute, the OS preference decides.
 */
export const themeTokens = css`
  :host {
    ${scale}
    ${light}
  }
  @media (prefers-color-scheme: dark) {
    :host(:not([theme='light'])) {
      ${dark}
    }
  }
  :host([theme='dark']) {
    ${dark}
  }
  @media (max-width: 760px) {
    :host {
      --gutter: 16px;
    }
  }
`;
