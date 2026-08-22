import { SITE, VAT_RATE, toCHF } from '../data/site';
import { productImage } from './images';

const abs = (path: string) => new URL(path, SITE.url).href;

/** Postal address, reused by every schema that claims a location. */
const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: SITE.address.street,
  postalCode: SITE.address.postalCode,
  addressLocality: SITE.address.locality,
  addressRegion: SITE.address.region,
  addressCountry: SITE.address.country,
};

/**
 * The shop as an entity. Search engines and answer engines both resolve the
 * brand from this: one consistent name, address and contact point across
 * every page is what makes 24highshop a *thing* rather than a string.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    foundingDate: String(SITE.established),
    vatID: SITE.uid,
    logo: {
      '@type': 'ImageObject',
      url: abs('/images/layout/logo-200.webp'),
    },
    image: abs('/images/layout/logo-200.webp'),
    address: postalAddress,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: [
      { '@type': 'Country', name: 'Switzerland' },
      { '@type': 'Country', name: 'Liechtenstein' },
      { '@type': 'Place', name: 'European Union' },
    ],
    currenciesAccepted: 'CHF, EUR',
    paymentAccepted: 'Bitcoin, Bank transfer',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SITE.email,
      availableLanguage: ['en', 'de', 'fr', 'it'],
      areaServed: 'CH',
    },
  };
}

/** Enables the sitelinks search box and names the site as an entity. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en-CH',
    publisher: { '@id': `${SITE.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/en/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface ProductReview {
  author: string;
  rating: number;
  date: string;
  title?: string;
  body: string;
}

export interface ProductSchemaInput {
  title: string;
  description: string;
  sku: string;
  priceEUR: number | null;
  inStock: boolean;
  images: string[];
  url: string;
  category?: string;
  rating?: { value: number; count: number };
  reviews?: ProductReview[];
}

/**
 * Product structured data including the shipping and return details Google
 * asks for in merchant listings.
 *
 * aggregateRating and review are emitted only when the product actually
 * carries review data. No product does today — the source site served
 * reviews over AJAX, so the scrape captured none — and inventing them would
 * be both a Google policy violation and a lie to customers.
 */
export function productSchema(p: ProductSchemaInput) {
  const chf = p.priceEUR === null ? null : toCHF(p.priceEUR);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': abs(p.url) + '#product',
    name: p.title,
    description: p.description,
    sku: p.sku,
    mpn: p.sku,
    ...(p.category && { category: p.category }),
    image: p.images.map((id) => abs(productImage(id, 1000))),
    brand: { '@type': 'Brand', name: SITE.name },
    ...(p.rating && p.rating.count > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: p.rating.value.toFixed(1),
        reviewCount: p.rating.count,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(p.reviews?.length && {
      review: p.reviews.slice(0, 10).map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        datePublished: r.date,
        ...(r.title && { name: r.title }),
        reviewBody: r.body,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: String(r.rating),
          bestRating: '5',
          worstRating: '1',
        },
      })),
    }),
    ...(chf !== null && {
      offers: {
        '@type': 'Offer',
        price: chf.toFixed(2),
        priceCurrency: 'CHF',
        availability: `https://schema.org/${p.inStock ? 'InStock' : 'OutOfStock'}`,
        itemCondition: 'https://schema.org/NewCondition',
        url: abs(p.url),
        priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
        seller: { '@id': `${SITE.url}/#organization` },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            // every order clears the EUR 200 minimum, so shipping is included
            '@type': 'MonetaryAmount',
            value: '0.00',
            currency: 'CHF',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'CH',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 2,
              unitCode: 'DAY',
            },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'CH',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 14,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/ReturnShippingFees',
        },
      },
    }),
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href && { item: abs(c.href) }),
    })),
  };
}

export interface QA {
  q: string;
  a: string;
}

/**
 * FAQPage markup. This is the single highest-leverage thing for answer
 * engines: a question in the same words a person would use, followed by an
 * answer complete enough to be lifted whole.
 */
export function faqSchema(items: QA[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function itemListSchema(
  products: { slug: string; title: string; price: number | null }[],
  listName: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 30).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(`/en/product/${p.slug}`),
      name: p.title,
    })),
  };
}

export function collectionPageSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: abs(url),
    isPartOf: { '@id': `${SITE.url}/#website` },
    inLanguage: 'en-CH',
    provider: { '@id': `${SITE.url}/#organization` },
  };
}

export interface AuthorRef {
  name: string;
  slug?: string;
  bio?: string;
  image?: string;
}

export function personSchema(a: AuthorRef) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': a.slug ? abs(`/en/authors/${a.slug}`) + '#person' : undefined,
    name: a.name,
    ...(a.slug && { url: abs(`/en/authors/${a.slug}`) }),
    ...(a.bio && { description: a.bio }),
    ...(a.image && { image: abs(a.image) }),
    worksFor: { '@id': `${SITE.url}/#organization` },
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  image: string;
  published: string;
  modified: string;
  url: string;
  author: AuthorRef;
  wordCount?: number;
}

/**
 * BlogPosting with a real author entity and an explicit reviewer. Both are
 * E-E-A-T signals; both are only worth emitting because the underlying
 * people and process are real.
 */
export function articleSchema(a: ArticleSchemaInput) {
  const namedAuthor = Boolean(a.author.slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': abs(a.url) + '#article',
    headline: a.title,
    description: a.description,
    ...(a.image && { image: abs(a.image) }),
    datePublished: a.published,
    dateModified: a.modified || a.published,
    ...(a.wordCount && { wordCount: a.wordCount }),
    inLanguage: 'en-CH',
    author: namedAuthor
      ? personSchema(a.author)
      : { '@type': 'Organization', '@id': `${SITE.url}/#organization`, name: SITE.name },
    publisher: { '@id': `${SITE.url}/#organization` },
    isPartOf: { '@id': `${SITE.url}/#website` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(a.url) },
  };
}

/** VAT-exclusive figure, for the price breakdown shown on product pages. */
export function exVat(gross: number): number {
  return Math.round((gross / (1 + VAT_RATE)) * 100) / 100;
}
