import catalog from './catalog.json';

export const SITE = {
  name: '24High',
  tagline: 'Smartshop & botanical apothecary',
  description:
    'Magic truffles, grow kits, mushroom spores, kratom, CBD and headshop supplies — shipped discreetly across Europe since 2018.',
  url: 'https://www.24high.com',
  lang: 'en',
  email: 'info@24high.com',
  established: 2018,
} as const;

/**
 * The other locales are separate domains rather than routes on this one, so
 * they are declared here purely to drive the hreflang set and the language
 * switcher.
 */
export const LOCALES = [
  { code: 'en', label: 'English', href: 'https://www.24high.com/en/' },
  { code: 'nl', label: 'Nederlands', href: 'https://www.24high.nl/' },
  { code: 'fr', label: 'Français', href: 'https://www.24high.fr/' },
  { code: 'de', label: 'Deutsch', href: 'https://www.24high.de/' },
  { code: 'es', label: 'Español', href: 'https://www.24high.es/' },
  { code: 'it', label: 'Italiano', href: 'https://www.24high.it/' },
] as const;

export type ShopId = 'mushrooms' | 'smartshop' | 'headshop' | 'seedshop' | 'cbdshop' | 'healthshop';

/** Display order and copy for the six shops; counts come from the catalogue. */
const SHOP_META: Record<ShopId, { label: string; blurb: string }> = {
  mushrooms: {
    label: 'Mushrooms',
    blurb: 'Grow kits, truffles, spores and everything the mycelium needs.',
  },
  smartshop: {
    label: 'Smartshop',
    blurb: 'Kratom, kanna, cacti and botanicals with a long ethnographic record.',
  },
  headshop: {
    label: 'Headshop',
    blurb: 'Grinders, bongs, pipes, storage and the rest of the kit.',
  },
  seedshop: {
    label: 'Seedshop',
    blurb: 'Feminised, autoflower and regular cannabis genetics.',
  },
  cbdshop: {
    label: 'CBD',
    blurb: 'Oils, pastes, crystals and edibles across the cannabinoid range.',
  },
  healthshop: {
    label: 'Healthshop',
    blurb: 'Adaptogens, nootropics and superfoods for focus, sleep and mood.',
  },
};

export interface Category {
  slug: string;
  label: string;
  count: number;
  href: string;
}

export interface Shop {
  id: ShopId;
  label: string;
  blurb: string;
  href: string;
  total: number;
  categories: Category[];
}

const raw = catalog as Record<string, Record<string, { label: string; count: number }>>;

export const SHOPS: Shop[] = (Object.keys(SHOP_META) as ShopId[])
  .filter((id) => raw[id])
  .map((id) => {
    const categories = Object.entries(raw[id])
      .map(([slug, c]) => ({
        slug,
        // a handful of source rows carry the shop name instead of a category
        label: c.label && c.label.toUpperCase() !== id.toUpperCase() ? c.label : titleise(slug),
        count: c.count,
        href: `/en/shop/${id}/${slug}`,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    return {
      id,
      label: SHOP_META[id].label,
      blurb: SHOP_META[id].blurb,
      href: `/en/shop/${id}`,
      total: categories.reduce((n, c) => n + c.count, 0),
      categories,
    };
  });

export const SHOP_BY_ID = new Map(SHOPS.map((s) => [s.id, s]));

function titleise(slug: string) {
  return slug
    .split('-')
    .map((w) => (w.length <= 3 && w !== 'cbd' ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
    .replace(/\bCbd\b/g, 'CBD');
}

export function categoryOf(shop: string, slug: string): Category | undefined {
  return SHOP_BY_ID.get(shop as ShopId)?.categories.find((c) => c.slug === slug);
}

/** Secondary links that are not part of the catalogue tree. */
export const UTILITY_NAV = [
  { label: 'Blog', href: '/en/blog' },
  { label: 'About us', href: '/en/about' },
] as const;
