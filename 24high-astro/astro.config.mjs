import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://www.24high.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',

  // The catalogue lives at /en/. The other languages are separate domains
  // (24high.nl, .fr, .de, .es, .it), wired together by hreflang in Meta.astro,
  // so this project ships one locale rather than six empty ones.
  redirects: {
    '/': '/en/',
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        if (item.url.endsWith('/en/')) item.priority = 1.0;
        else if (item.url.includes('/product/')) item.priority = 0.8;
        else if (item.url.includes('/shop/')) item.priority = 0.7;
        else item.priority = 0.6;
        return item;
      },
    }),
  ],

  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      // 1,700+ pages of mostly-static HTML; keep rollup from holding every
      // rendered module in memory at once
      cssCodeSplit: false,
    },
  },
});
