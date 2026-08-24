import authorsJson from '../data/authors.json';
import bios from '../data/author-bios.json';
import { DEFAULT_LOCALE, type LocaleCode } from '../data/site';

export interface Author {
  slug: string;
  name: string;
  bio: string[];
  image: string;
}

export const AUTHORS = authorsJson as Author[];

const BY_NAME = new Map(AUTHORS.map((a) => [a.name.toLowerCase(), a]));

/**
 * Posts carry an author name from the source JSON-LD. Most are attributed to
 * the organisation; the rest match one of the four named writers.
 */
export function authorByName(name: string): Author | undefined {
  return BY_NAME.get((name || '').toLowerCase());
}

/** Biography in the reader's language, falling back to English. */
const BIOS = bios as Record<string, Record<string, string[]>>;

export function bioFor(slug: string, locale: LocaleCode = DEFAULT_LOCALE): string[] {
  const table = BIOS[locale] ?? BIOS[DEFAULT_LOCALE];
  return table[slug] ?? BIOS[DEFAULT_LOCALE][slug] ?? [];
}

export function authorImage(a: Author, size: 120 | 300 | 400 = 300): string {
  return a.image ? `/images/authors/${a.image}-${size}.webp` : '';
}
