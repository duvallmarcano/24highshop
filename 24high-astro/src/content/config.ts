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
    author: z.string().default('24High'),
  }),
});

export const collections = { products, blog };
