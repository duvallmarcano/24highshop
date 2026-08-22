import authorsJson from '../data/authors.json';

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

export function authorImage(a: Author, size: 120 | 300 | 400 = 300): string {
  return a.image ? `/images/authors/${a.image}-${size}.webp` : '';
}
