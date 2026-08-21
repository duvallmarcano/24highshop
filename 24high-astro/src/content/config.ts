import { z, defineCollection } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(''),
});

const articleSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(''),
});

// One collection per language — Astro content collections support subdirectory-based routing
export const collections = {
  'blog-en':      defineCollection({ type: 'content', schema: blogSchema }),
  'blog-nl':      defineCollection({ type: 'content', schema: blogSchema }),
  'blog-fr':      defineCollection({ type: 'content', schema: blogSchema }),
  'blog-de':      defineCollection({ type: 'content', schema: blogSchema }),
  'blog-es':      defineCollection({ type: 'content', schema: blogSchema }),
  'blog-it':      defineCollection({ type: 'content', schema: blogSchema }),
  'article-en':   defineCollection({ type: 'content', schema: articleSchema }),
  'article-nl':   defineCollection({ type: 'content', schema: articleSchema }),
  'article-fr':   defineCollection({ type: 'content', schema: articleSchema }),
  'article-de':   defineCollection({ type: 'content', schema: articleSchema }),
  'article-es':   defineCollection({ type: 'content', schema: articleSchema }),
  'article-it':   defineCollection({ type: 'content', schema: articleSchema }),
};
