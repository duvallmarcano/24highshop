import keywordMap from '../data/keywords.json';

/**
 * What each page is already being found for, from the Semrush position
 * exports. Used to align titles and meta descriptions with the language
 * people actually search in, and to link related pages together.
 *
 * The rule everywhere below: a keyword is only ever used where it is
 * *already true* of the page. Nothing here invents relevance — the term is
 * one this page already ranks for, so matching its phrasing is describing
 * the page accurately, not stuffing it.
 */
export interface Keyword {
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  intent: string[];
}

const MAP = keywordMap as Record<string, Keyword[]>;

export function keywordsFor(route: string): Keyword[] {
  return MAP[route.replace(/\/$/, '') || '/en/'] ?? MAP[route] ?? [];
}

/** The single term worth aligning a title or description to. */
export function primaryKeyword(route: string, minVolume = 50): Keyword | undefined {
  return keywordsFor(route).find((k) => k.volume >= minVolume);
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Does this text already cover the term, in any word order? */
export function covers(text: string, keyword: string): boolean {
  const haystack = norm(text);
  const words = norm(keyword).split(' ').filter((w) => w.length > 2);
  if (!words.length) return true;
  return words.every((w) => haystack.includes(w));
}

/**
 * Weave the primary term into a meta description, but only when the
 * description does not already say it. Returns the original otherwise.
 */
export function alignDescription(
  description: string,
  route: string,
  opts: { suffix?: string } = {}
): string {
  const kw = primaryKeyword(route, 100);
  if (!kw || covers(description, kw.keyword)) return description;

  const lead = kw.keyword.charAt(0).toUpperCase() + kw.keyword.slice(1);
  const merged = `${lead}: ${description}`;
  return merged.length <= 158 ? merged : description;
}

/**
 * Question-shaped queries this page ranks for. These are the exact words
 * people type, which makes them the right headings for an answer engine to
 * match against.
 */
const QUESTION = /^(how|what|why|when|where|which|can|does|do|is|are|should)\b/;

export function questionKeywords(route: string, limit = 6): Keyword[] {
  const seen = new Set<string>();
  return keywordsFor(route)
    .filter((k) => QUESTION.test(k.keyword) && k.volume >= 40)
    .filter((k) => {
      // collapse near-duplicates ("how to use a weed grinder" / "how to use pot grinder")
      const key = norm(k.keyword).split(' ').slice(0, 4).sort().join(' ');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

/** Total monthly demand a route is visible for — used to order related links. */
export function routeVolume(route: string): number {
  return keywordsFor(route).reduce((n, k) => n + k.volume, 0);
}

/** Every route that has keyword data, richest first. */
export function rankedRoutes(prefix?: string): { route: string; volume: number }[] {
  return Object.keys(MAP)
    .filter((r) => (prefix ? r.startsWith(prefix) : true))
    .map((route) => ({ route, volume: routeVolume(route) }))
    .sort((a, b) => b.volume - a.volume);
}

/**
 * Guides related to a shop or category, chosen by shared vocabulary between
 * the page's own terms and each guide's. Produces genuine internal links
 * between pages that serve the same intent.
 */
export function relatedGuides(route: string, limit = 4): { route: string; volume: number }[] {
  const own = new Set(
    keywordsFor(route).flatMap((k) => norm(k.keyword).split(' ').filter((w) => w.length > 3))
  );
  if (!own.size) return [];

  return Object.entries(MAP)
    .filter(([r]) => r.startsWith('/en/blog/') && r !== route)
    .map(([r, kws]) => {
      const words = new Set(
        kws.flatMap((k) => norm(k.keyword).split(' ').filter((w) => w.length > 3))
      );
      let overlap = 0;
      for (const w of words) if (own.has(w)) overlap++;
      return { route: r, overlap, volume: kws.reduce((n, k) => n + k.volume, 0) };
    })
    .filter((x) => x.overlap >= 2)
    .sort((a, b) => b.overlap - a.overlap || b.volume - a.volume)
    .slice(0, limit)
    .map(({ route: r, volume }) => ({ route: r, volume }));
}
