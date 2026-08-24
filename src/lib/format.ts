import { DEFAULT_LOCALE, type LocaleCode } from '../data/site';
import { intlLocale } from './i18n';

export function formatDate(iso: string, locale: LocaleCode = DEFAULT_LOCALE): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
