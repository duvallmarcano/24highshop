/**
 * One icon set, defined once per document as <symbol> and referenced with
 * <use>. Replaces the remote FontAwesome kit and the 54 MB of SVG path data
 * the scrape inlined across the catalogue.
 *
 * Values are inner SVG markup on a 24×24 grid, so an icon can be built from
 * whatever primitives read best at 16–24px rather than being forced into a
 * single path. Stroke-drawn unless listed in SOLID_ICONS.
 */
export const ICONS = {
  // ── navigation & interface ──────────────────────────────────────────
  cart: '<path d="M2.5 3.5h2.2l2.3 11a1.8 1.8 0 0 0 1.8 1.4h8a1.8 1.8 0 0 0 1.75-1.35L20.5 7.5H6"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.3-4.3"/>',
  user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"/>',
  menu: '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
  close: '<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>',
  'chevron-down': '<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>',
  'chevron-right': '<path d="m9.5 6.5 5.5 5.5-5.5 5.5"/>',
  'arrow-right': '<path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5"/>',
  'arrow-left': '<path d="M20 12H5m5.5-5.5L5 12l5.5 5.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  filter: '<path d="M3.5 6h17M7 12h10M10 18h4"/>',
  external: '<path d="M14 3.5h6.5V10"/><path d="M20.5 3.5 11 13"/><path d="M18 13.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H11"/>',

  // ── status & feedback ───────────────────────────────────────────────
  check: '<path d="m4.5 12.5 5 5 9.5-10.5"/>',
  'check-circle': '<circle cx="12" cy="12" r="8.75"/><path d="m8 12.3 2.7 2.7L16.2 9"/>',
  info: '<circle cx="12" cy="12" r="8.75"/><path d="M12 11v5.5"/><circle cx="12" cy="7.9" r="1" fill="currentColor" stroke="none"/>',
  alert: '<path d="M12 3.2 2.6 19.6a1 1 0 0 0 .87 1.5h17.06a1 1 0 0 0 .87-1.5Z"/><path d="M12 9.5v4.6"/><circle cx="12" cy="17.4" r="1" fill="currentColor" stroke="none"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7.2a4 4 0 0 1 8 0V10"/>',
  star: '<path d="m12 3.3 2.7 5.5 6 .9-4.35 4.25 1.03 6L12 17.1l-5.38 2.85 1.03-6L3.3 9.7l6-.9Z"/>',
  sparkle: '<path d="M12 2.8 13.9 8.5 19.6 10.4 13.9 12.3 12 18l-1.9-5.7L4.4 10.4 10.1 8.5Z"/><path d="M19 16.5 19.7 18.6 21.8 19.3 19.7 20 19 22.1 18.3 20 16.2 19.3 18.3 18.6Z"/>',

  // ── commerce & trust ────────────────────────────────────────────────
  truck: '<path d="M2.5 6.5A1 1 0 0 1 3.5 5.5h9a1 1 0 0 1 1 1v9h-11Z"/><path d="M13.5 9.5h3.6a1 1 0 0 1 .8.4l2.4 3.1a1 1 0 0 1 .2.6v1.9h-7Z"/><circle cx="7" cy="18.5" r="1.7"/><circle cx="17.5" cy="18.5" r="1.7"/>',
  package: '<path d="M12 2.8 3.5 7.2v9.6L12 21.2l8.5-4.4V7.2Z"/><path d="m3.5 7.2 8.5 4.4 8.5-4.4"/><path d="M12 11.6v9.6"/>',
  shield: '<path d="M12 2.8 4.8 5.7v5.9c0 4.4 3 8 7.2 9.6 4.2-1.6 7.2-5.2 7.2-9.6V5.7Z"/><path d="m9 12 2.2 2.2L15.2 10"/>',
  clock: '<circle cx="12" cy="12" r="8.75"/><path d="M12 6.8V12l3.3 2.2"/>',
  'map-pin': '<path d="M12 21.2s6.8-5.6 6.8-10.6a6.8 6.8 0 1 0-13.6 0c0 5 6.8 10.6 6.8 10.6Z"/><circle cx="12" cy="10.2" r="2.6"/>',
  mail: '<rect x="2.8" y="5" width="18.4" height="14" rx="2"/><path d="m3.4 7 8.6 6 8.6-6"/>',
  flask: '<path d="M9.2 2.8h5.6M10.4 2.8v6.4l-5 8.6A2 2 0 0 0 7.1 21h9.8a2 2 0 0 0 1.7-3.2l-5-8.6V2.8"/><path d="M7.4 15.4h9.2"/>',

  // ── shop identities ─────────────────────────────────────────────────
  mushroom: '<path d="M3.6 11.4a8.4 8.4 0 0 1 16.8 0Z"/><path d="M9.8 11.4v5.9a2.2 2.2 0 0 0 4.4 0v-5.9"/><circle cx="8.6" cy="8.4" r="1" fill="currentColor" stroke="none"/><circle cx="14.4" cy="7.6" r="1.2" fill="currentColor" stroke="none"/>',
  cactus: '<path d="M12 21.2V5.4"/><path d="M12 14.6H8.9a2.4 2.4 0 0 1-2.4-2.4V9.1"/><path d="M12 12.2h3.1a2.4 2.4 0 0 0 2.4-2.4V7.6"/><path d="M9.2 21.2h5.6"/>',
  grinder: '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.1"/><path d="M12 3.6v2.4M12 18v2.4M3.6 12H6M18 12h2.4M6.1 6.1l1.7 1.7M16.2 16.2l1.7 1.7M17.9 6.1l-1.7 1.7M7.8 16.2l-1.7 1.7"/>',
  sprout: '<path d="M12 21.2v-8.4"/><path d="M12 12.8c0-3.2 2.2-5.4 5.4-5.4 0 3.2-2.2 5.4-5.4 5.4Z"/><path d="M12 15c0-2.7-1.9-4.8-4.8-4.8 0 2.7 1.9 4.8 4.8 4.8Z"/>',
  droplet: '<path d="M12 2.8s6.4 6.9 6.4 10.7a6.4 6.4 0 0 1-12.8 0C5.6 9.7 12 2.8 12 2.8Z"/>',
  pulse: '<path d="M2.8 12.4h3.9l2.1-5.6 3.4 11.2 2.6-7 1.6 2.4h4.8"/>',
  leaf: '<path d="M20.4 3.6C10 3.6 3.9 8.3 3.9 15a5.1 5.1 0 0 0 5.1 5.1c6.7 0 11.4-6.1 11.4-16.5Z"/><path d="M3.9 20.1 14.2 9.8"/>',

  // ── payment marks ───────────────────────────────────────────────────
  // Bitcoin's ₿ as published in the Bitcoin brand guidelines: the two
  // vertical strokes crossing a double-lobed B.
  bitcoin:
    '<path d="M9.1 5.6v12.8M12.2 4.6v2M12.2 18v2M15.1 4.6v2M15.1 18v2"/><path d="M9.1 12h5.2a3.2 3.2 0 0 1 0 6.4H6.6M9.1 5.6h4.6a3.2 3.2 0 0 1 0 6.4H6.6"/>',
  bank:
    '<path d="M3 9.6 12 4.4l9 5.2"/><path d="M4.6 9.6v9M9.1 9.6v9M14.9 9.6v9M19.4 9.6v9"/><path d="M2.6 21.4h18.8"/>',

  // ── theme ───────────────────────────────────────────────────────────
  sun: '<circle cx="12" cy="12" r="4.1"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
  moon: '<path d="M20.4 14.6A8.7 8.7 0 0 1 9.4 3.6a8.7 8.7 0 1 0 11 11Z"/>',
} as const;

export type IconName = keyof typeof ICONS;

/** Icons drawn as a fill rather than a stroke. */
export const SOLID_ICONS: ReadonlySet<string> = new Set(['star', 'sparkle']);
