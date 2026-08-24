import { DEFAULT_LOCALE, type LocaleCode } from './site';
import infoPages from './info-pages.json';

/**
 * Short-form information pages, translated into all nine languages.
 *
 * Written against Swiss law: revDSG rather than the GDPR as the primary
 * regime, VAT at 8.1%, and the Obligationenrecht rather than the EU
 * distance-selling directive. The translations follow the English exactly —
 * same sections, same paragraph counts, same figures — but they are still a
 * shop's own wording, not a lawyer's. Have a Swiss lawyer read them, and note
 * that publishing them in eight languages means eight jurisdictions can read
 * them.
 */
export interface InfoPage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}

type Table = Record<string, Record<string, Omit<InfoPage, 'slug'>>>;
const BY_LOCALE = infoPages as Table;

/** Slug order is shared across locales; the copy is not. */
export const INFO_SLUGS = Object.keys(BY_LOCALE[DEFAULT_LOCALE]);

export function infoPagesFor(locale: LocaleCode = DEFAULT_LOCALE): InfoPage[] {
  const table = BY_LOCALE[locale] ?? BY_LOCALE[DEFAULT_LOCALE];
  return INFO_SLUGS.map((slug) => ({ slug, ...table[slug] }));
}

export function infoPage(slug: string, locale: LocaleCode = DEFAULT_LOCALE): InfoPage | undefined {
  const table = BY_LOCALE[locale] ?? BY_LOCALE[DEFAULT_LOCALE];
  return table[slug] ? { slug, ...table[slug] } : undefined;
}

/** Kept for callers with no locale to hand. */
export const INFO_PAGES: InfoPage[] = infoPagesFor(DEFAULT_LOCALE);
export const INFO_BY_SLUG = new Map(INFO_PAGES.map((p) => [p.slug, p]));
