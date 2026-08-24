import { LOCALES, DEFAULT_LOCALE, type LocaleCode } from '../data/site';

/**
 * Locale plumbing.
 *
 * Until now every component called `useTranslations('en')` and hard-coded
 * `/en/` into its links, so the translated string tables were unreachable —
 * switching a locale on would have changed nothing. Everything locale-shaped
 * now goes through here.
 */

export const ENABLED_LOCALES = LOCALES.filter((l) => l.enabled).map((l) => l.code);

const CODES = new Set(LOCALES.map((l) => l.code as string));

/** Which locale a URL belongs to, from its first path segment. */
export function localeFromPath(pathname: string): LocaleCode {
  const first = pathname.split('/').filter(Boolean)[0];
  return first && CODES.has(first) ? (first as LocaleCode) : DEFAULT_LOCALE;
}

/**
 * Rewrite a path into a locale. Accepts paths with or without a locale
 * segment, so `localized('/blog', 'de')` and `localized('/en/blog', 'de')`
 * both give `/de/blog`.
 */
export function localized(path: string, locale: LocaleCode): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length && CODES.has(parts[0])) parts.shift();
  return `/${locale}${parts.length ? '/' + parts.join('/') : '/'}`.replace(/\/{2,}/g, '/');
}

/** True when a path already sits under a locale segment. */
export function isLocalised(pathname: string): boolean {
  const first = pathname.split('/').filter(Boolean)[0];
  return Boolean(first && CODES.has(first));
}

/**
 * Where the language switcher should point.
 *
 * On a localised page, the same page in the other language. On one that is
 * not — the 404, which lives at the root — the other language's home page,
 * because `/de/404` does not exist.
 */
export function switchLocale(pathname: string, locale: LocaleCode): string {
  return isLocalised(pathname) ? localized(pathname, locale) : `/${locale}/`;
}

/** BCP-47 tag for `<html lang>`, Intl and schema `inLanguage`. */
export function bcp47(locale: LocaleCode): string {
  return LOCALES.find((l) => l.code === locale)?.hreflang ?? locale;
}

/** `og:locale` wants an underscore and an uppercase region. */
export function ogLocale(locale: LocaleCode): string {
  const tag = bcp47(locale);
  return tag.includes('-') ? tag.replace('-', '_') : `${locale}_${locale.toUpperCase()}`;
}

/** Intl locale for dates and numbers. */
export function intlLocale(locale: LocaleCode): string {
  return bcp47(locale);
}

export function labelFor(locale: LocaleCode): string {
  return LOCALES.find((l) => l.code === locale)?.label ?? locale;
}

/** Every enabled locale, for `getStaticPaths` across the localised routes. */
export function localePaths(): { params: { lang: LocaleCode } }[] {
  return ENABLED_LOCALES.map((lang) => ({ params: { lang } }));
}
