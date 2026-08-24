import type { QA } from '../lib/seo';
import { SITE, MIN_ORDER_EUR, toCHF, DEFAULT_LOCALE, type ShopId, type LocaleCode } from './site';
import globalFaq from './faq-global.json';
import productFaq from './faq-product.json';
import shopFaq from './faq-shops.json';

/**
 * Answer-engine copy.
 *
 * Every answer here has to be *true* and *self-contained* — an assistant
 * lifting one out of context must not end up stating something false about
 * the shop. Anything that varies per product is generated from that
 * product's own data rather than asserted.
 */

const MIN_CHF = toCHF(MIN_ORDER_EUR);

/**
 * Applies to every page; kept short so each answer can be quoted whole.
 * Translated in full — these are the answers an assistant is most likely to
 * lift, so they have to be right in every language.
 */
const GLOBAL_BY_LOCALE = globalFaq as Record<string, QA[]>;

export function globalFAQ(locale: LocaleCode = DEFAULT_LOCALE): QA[] {
  return GLOBAL_BY_LOCALE[locale] ?? GLOBAL_BY_LOCALE[DEFAULT_LOCALE];
}

/** Kept for callers that have no locale to hand. */
export const GLOBAL_FAQ: QA[] = GLOBAL_BY_LOCALE[DEFAULT_LOCALE];

/**
 * What people actually ask before buying from a given shop. Translated in
 * full: these carry the legal and dosing facts, so they have to be right in
 * every language rather than falling back to English.
 */
const SHOP_BY_LOCALE = shopFaq as Record<string, Record<string, QA[]>>;

export function shopFAQ(shop: ShopId, locale: LocaleCode = DEFAULT_LOCALE): QA[] {
  const table = SHOP_BY_LOCALE[locale] ?? SHOP_BY_LOCALE[DEFAULT_LOCALE];
  return table[shop] ?? [];
}

/** Kept for callers with no locale to hand. */
export const SHOP_FAQ: Record<ShopId, QA[]> = SHOP_BY_LOCALE[
  DEFAULT_LOCALE
] as Record<ShopId, QA[]>;

/** Product-level questions, answered from that product's own record. */
const PRODUCT_BY_LOCALE = productFaq as Record<
  string,
  Record<'price' | 'stockYes' | 'stockNo' | 'pack', QA>
>;

function fill(text: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (out, [k, v]) => out.replaceAll(`{${k}}`, String(v)),
    text
  );
}

export function productFAQ(
  p: {
    title: string;
    priceEUR: number | null;
    inStock: boolean;
    categoryLabel: string;
    shop: string;
  },
  locale: LocaleCode = DEFAULT_LOCALE
): QA[] {
  const T = PRODUCT_BY_LOCALE[locale] ?? PRODUCT_BY_LOCALE[DEFAULT_LOCALE];
  const chf = p.priceEUR === null ? null : toCHF(p.priceEUR);
  const vars = {
    title: p.title,
    chf: chf === null ? '' : chf.toFixed(2),
    eur: p.priceEUR === null ? '' : p.priceEUR.toFixed(2),
    min: MIN_ORDER_EUR,
    minchf: MIN_CHF.toFixed(0),
    city: SITE.address.locality,
    cutoff: SITE.cutoff,
    category: p.categoryLabel,
  };

  const out: QA[] = [];
  if (chf !== null) out.push({ q: fill(T.price.q, vars), a: fill(T.price.a, vars) });
  const stock = p.inStock ? T.stockYes : T.stockNo;
  out.push({ q: fill(stock.q, vars), a: fill(stock.a, vars) });
  out.push({ q: fill(T.pack.q, vars), a: fill(T.pack.a, vars) });
  return out;
}
