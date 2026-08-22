/**
 * One small icon set replaces the remote FontAwesome kit and the 54 MB of
 * SVG path data the scrape inlined across the catalogue.
 */
export const ICON_PATHS = {
  cart: 'M3 4h2.2l2.1 10.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6M9.5 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14ZM20 20l-4-4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  'chevron-down': 'm6 9 6 6 6-6',
  'chevron-right': 'm9 6 6 6-6 6',
  'arrow-right': 'M4 12h15m-6-6 6 6-6 6',
  star: 'm12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8L12 3.6Z',
  check: 'm4.5 12.5 5 5 10-11',
  truck: 'M3 6h11v9H3zM14 9h4l3 3v3h-7zM7 18.5a1.5 1.5 0 1 0 0-.01M17.5 18.5a1.5 1.5 0 1 0 0-.01',
  shield: 'M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Z',
  leaf: 'M20 4C10 4 4 8.5 4 15a5 5 0 0 0 5 5c6.5 0 11-6 11-16ZM4 20 14 10',
  package: 'M12 3 4 7v10l8 4 8-4V7l-8-4ZM4 7l8 4 8-4M12 11v10',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z',
} as const;

export type IconName = keyof typeof ICON_PATHS;

/** Icons drawn as fills rather than strokes. */
export const SOLID_ICONS: ReadonlySet<string> = new Set(['star']);
