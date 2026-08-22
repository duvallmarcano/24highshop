/** Prices come off the source catalogue as plain numbers in EUR. */
export function formatPrice(value: number | null, currency = 'EUR'): string {
  if (value === null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/** Strip tags and clamp, for card summaries built from body prose. */
export function excerpt(html: string, max = 150): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(' ', max)) + '…';
}
