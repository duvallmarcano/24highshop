import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import legacyRedirects from './src/data/redirects.json' with { type: 'json' };

const SITE = 'https://www.24high.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',

  // Routes live under /[lang]/. Enabling a locale in src/data/site.ts makes
  // every page generate for it; hreflang follows the same flag.
  redirects: {
    '/': '/en/',
    // 241 old URLs that still hold organic positions. Redirecting rather
    // than 404ing keeps the link equity attached to whatever replaced them.
    ...legacyRedirects,
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
