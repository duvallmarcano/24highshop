# 24High

The 24High storefront, built with Astro as a static site: 1,187 products,
508 guides, six shops, one build.

## Where things live

```
scripts/                 pipeline that produced src/content and src/data
  normalize_images.py    renames image.php@… assets into /images/{products,news,…}
  extract_content.py     mirror HTML  ->  structured collections + catalog.json

src/
  content/
    products/            frontmatter facts (price, sku, stock, images) + prose
    blog/                frontmatter meta + article prose
    config.ts            zod schemas; a bad field fails the build
  data/
    catalog.json         shop -> category -> {label, count}, generated
    product-image-sizes.json  ids that exist at 1000px, generated
    site.ts              shops, locales, nav — the single source for navigation
    info-pages.ts        short-form legal/info copy
  lib/                   images.ts, format.ts, icons.ts
  components/
    ui/                  Icon, IconSprite, Button, Badge, Price
    layout/              Header, Footer, Breadcrumbs, Section
    product/             ProductCard, ProductGrid, ProductRail, Gallery,
                         BuyBox, ProductSchema
    blog/                PostCard
    Meta.astro           title, canonical, OG, hreflang, theme bootstrap
  layouts/BaseLayout.astro
  styles/                tokens.css (design tokens), global.css (reset + prose)
  pages/en/              index, product/[slug], shop/[shop]/[category],
                         blog/[slug], search, cart, about, [info]
```

## Commands

```bash
npm install
npm run dev            # local dev server
npm run build          # static build to dist/
npm run check          # astro check (types + template diagnostics)

npm run normalize:images   # re-run the image rename pass   (needs the mirror)
npm run extract            # re-derive src/content            (needs the mirror)
npm run keywords           # rebuild keywords.json + redirects (needs the CSVs)
```

The build needs a raised heap on constrained machines:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## How content is produced

> The scraped mirror and the Semrush CSVs were removed once their output was
> committed. `src/content` and `src/data` are the artefacts and are what the
> site builds from — the scripts below only need their inputs restored if you
> want to re-derive them.
>
> - `extract_content.py`, `extract_authors.py`, `normalize_images.py` expect
>   the mirror at `./www.24high.com`.
> - `build_keywords.py`, `build_redirects.py` expect exports in
>   `./data/semrush/*.csv`.

`extract_content.py` reads `./www.24high.com` (the source mirror) and writes
the two collections. It takes product facts from each page's `Product`
JSON-LD, the category from the breadcrumb, the gallery from the thumbnail
strip, and the description from the `#tabs_description` panel. Body HTML is
reduced to a semantic subset — headings, paragraphs, lists, tables, links,
images — so no page carries markup for chrome it does not own.

A final pass resolves every rewritten link against what was actually
produced. Links to other-language slugs and to categories with no products
lose their anchor and keep their text, so the build has no internal 404s.

Re-running the extractor is safe and idempotent; it overwrites both
collections from the mirror.

## Design system

Tokens live in `src/styles/tokens.css`. The complete light palette is defined
on bare `:root`; the dark palette redefines only the colour tokens, once
under `prefers-color-scheme` (guarded so an explicit light choice wins) and
once under `[data-theme="dark"]` (so the toggle wins). Components only ever
reference tokens, never literal colours.

Type is Bricolage Grotesque for display, Public Sans for body, JetBrains Mono
for data — SKUs, counts, prices and eyebrows. Sizes come from the `--step-*`
fluid scale.

## Notes

- **One locale.** The other languages are separate domains (24high.nl, .fr,
  .de, .es, .it), linked by hreflang from `Meta.astro`. The previous migration
  declared twelve collections for them; eleven were empty.
- **Icons** are defined once per document by `IconSprite` and referenced with
  `<use>`. There is no icon font and no remote kit.
- **The basket** is `localStorage` only. Checkout needs the 24High order
  system, which this static build does not include.
- **`@astrojs/sitemap` is pinned to 3.2.1.** Later 3.x releases expect the
  Astro 5 `astro:build:done` signature and crash on Astro 4.
