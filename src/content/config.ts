import { defineCollection, z } from 'astro:content';

/**
 * Product facts come out of the source catalogue as data, not markup — the
 * body of each entry is description prose only. Anything a template needs to
 * lay out (price, stock, gallery, taxonomy) is declared here so a typo fails
 * the build rather than rendering an empty element.
 */
const products = defineCollection({
  type: 'content',
  schema: z.object({
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
     * Reviews. The source site loaded these over AJAX into an empty
     * container, so the scrape captured none — every product currently has
     * zero. The shape is declared so real review data renders (and enters
     * Product schema as aggregateRating/review) the moment it exists, and
     * so nothing has to be invented in the meantime.
     */
    rating: z
      .object({
        value: z.number().min(1).max(5),
        count: z.number().int().positive(),
      })
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
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    heroImage: z.string().default(''),
    publishedAt: z.string(),
    updatedAt: z.string().default(''),
    author: z.string().default('24highshop'),
  }),
});

export const collections = { products, blog };
