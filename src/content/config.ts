import { defineCollection, z } from 'astro:content';

/**
 * Product facts come out of the source catalogue as data, not markup — the
 * body of each entry is description prose only. Anything a template needs to
 * lay out (price, stock, gallery, taxonomy) is declared here so a typo fails
 * the build rather than rendering an empty element.
 */
const productSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  sku: z.string(),
  price: z.number().nullable(),
  currency: z.string().default('EUR'),
  inStock: z.boolean().default(true),
  shop: z.string(),
  category: z.string(),
  categoryLabel: z.string().default(''),
  /** Image ids; the CDN path is built by <ProductImage /> */
  images: z.array(z.string()).default([]),

  /**
   * Reviews. The source site loaded these over AJAX into an empty container,
   * so the scrape captured only the aggregate. 117 products carry a rating;
   * none carries review text, and none is invented.
   */
  rating: z
    .object({ value: z.number().min(1).max(5), count: z.number().int().positive() })
    .optional(),
  reviews: z
    .array(
      z.object({
        author: z.string(),
        rating: z.number().min(1).max(5),
        date: z.string(),
        title: z.string().optional(),
        body: z.string(),
        verified: z.boolean().default(false),
      })
    )
    .default([]),

  /** Set by scripts/translate_content.py; marks a page as awaiting review. */
  machineTranslated: z.boolean().default(false),
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  heroImage: z.string().default(''),
  publishedAt: z.string(),
  updatedAt: z.string().default(''),
  author: z.string().default('24highshop'),
  machineTranslated: z.boolean().default(false),
});

const products = defineCollection({ type: 'content', schema: productSchema });
const blog = defineCollection({ type: 'content', schema: blogSchema });

/**
 * One collection per locale, filled by scripts/translate_content.py into
 * src/content/products-<lang>/ and blog-<lang>/. Declared up front so a
 * locale can be switched on the moment its content lands; a directory that
 * does not exist yet simply yields an empty collection.
 */
const TRANSLATED = ['de', 'fr', 'it', 'nl', 'es', 'pl', 'cs', 'pt'] as const;

const localised = Object.fromEntries(
  TRANSLATED.flatMap((l) => [
    [`products-${l}`, defineCollection({ type: 'content', schema: productSchema })],
    [`blog-${l}`, defineCollection({ type: 'content', schema: blogSchema })],
  ])
);

export const collections = { products, blog, ...localised };
