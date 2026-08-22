import type { LocaleCode } from '../data/site';

/**
 * Every string the chrome renders. Content (products, guides) stays in its
 * own collection; this is only the shell, so adding a language means
 * translating this file and flipping `enabled` in LOCALES.
 */
export const UI = {
  en: {
    'nav.search': 'Search truffles, grow kits, kratom…',
    'nav.searchLabel': 'Search the catalogue',
    'nav.menu': 'Menu',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.basket': 'Basket',
    'nav.theme': 'Switch colour theme',
    'nav.language': 'Change language',
    'nav.allProducts': 'All {n} products',
    'nav.moreCategories': '+{n} more categories',
    'nav.skip': 'Skip to content',

    'promo.shipping': 'Free Swiss shipping over CHF 60',
    'promo.packaging': 'Neutral packaging',
    'promo.since': 'Shipping from Zürich since {year}',

    'product.inStock': 'In stock',
    'product.soldOut': 'Sold out',
    'product.addToBasket': 'Add to basket',
    'product.notify': 'Notify me',
    'product.quantity': 'Quantity',
    'product.vat': 'Incl. 8.1% VAT · ships from Zürich',
    'product.sku': 'Article',
    'product.description': 'Description',
    'product.keyFacts': 'At a glance',
    'product.faq': 'Common questions',
    'product.related': 'More from {category}',

    'shop.browse': 'Browse by category',
    'shop.popular': 'Popular in {shop}',
    'shop.products': 'Products',
    'shop.available': 'In stock',
    'shop.from': 'From',
    'shop.empty': 'Nothing in this category right now.',

    'blog.readingTime': '{n} min read',
    'blog.updated': 'Updated {date}',
    'blog.by': 'By',
    'blog.reviewed': 'Reviewed by the 24High editorial team',
    'blog.more': 'Keep reading',
    'blog.allGuides': 'All guides',

    'footer.shop': 'Shop',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.languages': 'Languages',
    'footer.age': 'Strictly 18+. Please use responsibly.',
    'footer.rights': 'All rights reserved.',
    'footer.vatNote': 'Prices include Swiss VAT.',

    'usp.shipping': 'Free Swiss shipping over CHF 60',
    'usp.shippingSub': 'Tracked, 1–2 working days',
    'usp.packaging': 'Neutral packaging',
    'usp.packagingSub': 'Unmarked, no branding outside',
    'usp.payment': 'Swiss payment methods',
    'usp.paymentSub': 'TWINT, PostFinance, card, invoice',
    'usp.origin': 'Shipped from Zürich',
    'usp.originSub': 'Swiss stock, Swiss customs',

    'cta.shopNow': 'Shop now',
    'cta.seeAll': 'See all',
    'cta.readGuides': 'Read the guides',
    'cta.learnMore': 'Learn more',
  },
} satisfies Record<string, Record<string, string>>;

export type UIKey = keyof (typeof UI)['en'];

/**
 * Returns a lookup for the given locale, falling back to English for any
 * key a translation has not covered yet.
 */
export function useTranslations(lang: LocaleCode = 'en') {
  const table = (UI as Record<string, Partial<Record<UIKey, string>>>)[lang] ?? {};
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    let out = table[key] ?? UI.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        out = out.replace(`{${k}}`, String(v));
      }
    }
    return out;
  };
}
