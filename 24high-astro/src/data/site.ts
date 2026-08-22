import catalog from './catalog.json';
import type { IconName } from '../lib/icons';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * REPLACE BEFORE LAUNCH — marked PLACEHOLDER below
 *   · streetAddress, phone and the CHE/UID number are invented stand-ins.
 *     They appear in Organization/LocalBusiness structured data, so Google
 *     will read them as factual claims about a real business.
 *   · EUR_TO_CHF is a fixed rate, not a live feed.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const SITE = {
  name: '24High',
  legalName: '24High AG',
  tagline: 'Swiss smartshop for botanicals & mycology',
  description:
    'Magic truffles, mushroom grow kits, spores, kratom, kanna and CBD — sourced, checked and shipped discreetly from Zürich across Switzerland and Europe.',
  url: 'https://www.24high.com',
  lang: 'en',
  email: 'hello@24high.com',
  phone: '+41 44 000 00 00', // PLACEHOLDER
  established: 2018,
  uid: 'CHE-000.000.000', // PLACEHOLDER — Swiss business identification number
  address: {
    street: 'Pfingstweidstrasse 10', // PLACEHOLDER
    postalCode: '8005',
    locality: 'Zürich',
    region: 'ZH',
    country: 'CH',
    countryName: 'Switzerland',
  },
  geo: { lat: 47.3886, lng: 8.5175 }, // Zürich West
  openingHours: 'Mo-Fr 09:00-17:00',
  cutoff: '16:00',
} as const;

/** Swiss standard VAT. Reduced rate (2.6%) applies to some foodstuffs. */
export const VAT_RATE = 0.081;

/**
 * Prices come out of the source catalogue in EUR. CHF is the shop's primary
 * currency, so everything is converted at display time from this one rate —
 * swap it for a live rate or re-price the catalogue when you have real
 * numbers. Kept as a constant so there is exactly one thing to change.
 */
export const EUR_TO_CHF = 0.95;

/** Swiss retail rounds to the nearest 5 rappen. */
export function toCHF(eur: number): number {
  return Math.round((eur / EUR_TO_CHF) * 20) / 20;
}

/**
 * Switzerland is a four-language market. Only `en` has content today; the
 * rest are declared so the language switcher, hreflang set and routing
 * helpers are already in place when translations land.
 */
export const LOCALES = [
  { code: 'en', hreflang: 'en-CH', label: 'English', enabled: true },
  { code: 'de', hreflang: 'de-CH', label: 'Deutsch', enabled: false },
  { code: 'fr', hreflang: 'fr-CH', label: 'Français', enabled: false },
  { code: 'it', hreflang: 'it-CH', label: 'Italiano', enabled: false },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];
export const DEFAULT_LOCALE: LocaleCode = 'en';
export const ACTIVE_LOCALES = LOCALES.filter((l) => l.enabled);

export type ShopId =
  | 'mushrooms'
  | 'smartshop'
  | 'headshop'
  | 'seedshop'
  | 'cbdshop'
  | 'healthshop';

/** Display order, positioning copy and the question each shop answers. */
const SHOP_META: Record<
  ShopId,
  { label: string; blurb: string; intro: string; icon: IconName }
> = {
  mushrooms: {
    icon: 'mushroom',
    label: 'Mushrooms',
    blurb: 'Grow kits, truffles, spores and everything the mycelium needs.',
    intro:
      'Everything for growing and using fungi: all-in-one grow kits that fruit in two to three weeks, liquid cultures and spore syringes for people who want to start from genetics, fresh magic truffles, and the medicinal species — lion’s mane, reishi, cordyceps.',
  },
  smartshop: {
    icon: 'cactus',
    label: 'Smartshop',
    blurb: 'Kratom, kanna, cacti and botanicals with a long ethnographic record.',
    intro:
      'Plants people have used deliberately for a very long time. Kratom and kanna, mescaline cacti, dream herbs, rapé and the seeds behind them — with the dosing notes and cautions that should come with them.',
  },
  headshop: {
    icon: 'grinder',
    label: 'Headshop',
    blurb: 'Grinders, bongs, pipes, storage and the rest of the kit.',
    intro:
      'The hardware. Grinders that hold an edge, borosilicate glass, airtight storage that actually holds humidity, scales, capsule machines and extraction gear.',
  },
  seedshop: {
    icon: 'sprout',
    label: 'Seedshop',
    blurb: 'Feminised, autoflower and regular cannabis genetics.',
    intro:
      'Cannabis genetics from established European breeders: feminised and autoflowering seeds, high-THC and CBD-dominant lines, and the medicinal strains — sold as souvenirs and collectors’ items.',
  },
  cbdshop: {
    icon: 'droplet',
    label: 'CBD',
    blurb: 'Oils, pastes, crystals and edibles across the cannabinoid range.',
    intro:
      'Full-spectrum oils, pastes and isolated crystals at a range of strengths, plus edibles. Swiss law permits CBD products below 1% THC — a far higher threshold than most of Europe.',
  },
  healthshop: {
    icon: 'pulse',
    label: 'Healthshop',
    blurb: 'Adaptogens, nootropics and superfoods for focus, sleep and mood.',
    intro:
      'Adaptogens and nootropics grouped by what you want from them rather than by ingredient: sleep, focus, energy, mood, immunity.',
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
  intro: string;
  icon: IconName;
  href: string;
  total: number;
  categories: Category[];
}

const raw = catalog as Record<string, Record<string, { label: string; count: number }>>;

function titleise(slug: string) {
  return slug
    .split('-')
    .map((w) => (w.length <= 3 && w !== 'cbd' ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
    .replace(/\bCbd\b/g, 'CBD');
}

export const SHOPS: Shop[] = (Object.keys(SHOP_META) as ShopId[])
  .filter((id) => raw[id])
  .map((id) => {
    const categories = Object.entries(raw[id])
      .map(([slug, c]) => ({
        slug,
        // a few source rows carry the shop name instead of a category label
        label: c.label && c.label.toUpperCase() !== id.toUpperCase() ? c.label : titleise(slug),
        count: c.count,
        href: `/en/shop/${id}/${slug}`,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

    return {
      id,
      ...SHOP_META[id],
      href: `/en/shop/${id}`,
      total: categories.reduce((n, c) => n + c.count, 0),
      categories,
    };
  });

export const SHOP_BY_ID = new Map(SHOPS.map((s) => [s.id, s]));

export function categoryOf(shop: string, slug: string): Category | undefined {
  return SHOP_BY_ID.get(shop as ShopId)?.categories.find((c) => c.slug === slug);
}

export const TOTAL_PRODUCTS = SHOPS.reduce((n, s) => n + s.total, 0);

export const UTILITY_NAV = [
  { label: 'Guides', href: '/en/blog' },
  { label: 'About', href: '/en/about' },
] as const;
