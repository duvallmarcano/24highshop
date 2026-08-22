"""Generate redirects from the old URLs that hold rankings.

The rewrite changed every route. Any old URL that still holds a Semrush
position is link equity we would otherwise throw away on a 404, so each one
gets a 301 to whatever replaced it.

Reads:   data/semrush/*.csv, src/content, src/data/catalog.json
Writes:  src/data/redirects.json  {oldPath: newPath}
"""
import csv
import glob
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'data', 'redirects.json')
SHOPS = ('smartshop', 'headshop', 'healthshop', 'mushrooms', 'cbdshop', 'seedshop')

# Old categories that were split or renamed in the rewrite. Each points at the
# closest current page so the ranking lands somewhere sensible.
MANUAL: dict[str, str] = {
    '/en/headshop/13-weed-scale': '/en/shop/headshop/scales-pocket-scales',
    '/en/mushrooms/237-mushroom-edibles': '/en/shop/mushrooms/medicinal-mushrooms',
    '/en/mushrooms/204-spore-prints': '/en/shop/mushrooms/spores-shrooms',
    '/en/seedshop/152-brands': '/en/shop/seedshop',
    '/en/magic-mushroom-calculator': '/en/shop/mushrooms/all-in-one-growkits',
    '/en/blog': '/en/blog',
    '/en/cart': '/en/cart',
    # products and categories that were delisted — send the ranking to the
    # closest thing we still sell rather than to a 404
    '/en/article/2208854-chacruna-psychotria-viridis-indian-spirit-25g':
        '/en/shop/smartshop/hallucinating-herbs',
    '/en/article/4201404-mr-stiff-libido-shot-25ml': '/en/shop/smartshop/erotic',
    '/en/article/4204840-jack-frost-mushroom-grow-kit':
        '/en/shop/mushrooms/all-in-one-growkits',
    '/en/article/5204531-mac-galactic-xl-mushroom-grow-bag':
        '/en/shop/mushrooms/grow-supplies',
    '/en/article/5204986-cascadian-teacher-mushroom-grow-kit':
        '/en/shop/mushrooms/all-in-one-growkits',
    '/en/article/5207189-royale-flush-iceberg-growkit':
        '/en/shop/mushrooms/all-in-one-growkits',
    '/en/cbdshop/97-cbd-tea': '/en/shop/cbdshop',
    '/en/mushrooms/42-top-10-mushrooms': '/en/shop/mushrooms',
}


def main():
    products = {f[:-3] for f in os.listdir(os.path.join(ROOT, 'src/content/products'))}
    posts = {f[:-3] for f in os.listdir(os.path.join(ROOT, 'src/content/blog'))}
    with open(os.path.join(ROOT, 'src/data/catalog.json'), encoding='utf-8') as fh:
        catalog = json.load(fh)
    categories = {f'{s}/{c}' for s, cats in catalog.items() for c in cats}

    urls = set()
    for f in glob.glob(os.path.join(ROOT, 'data', 'semrush', '*.csv')):
        with open(f, encoding='utf-8-sig', newline='') as fh:
            for r in csv.DictReader(fh):
                u = (r.get('URL') or '').split('?')[0].rstrip('/')
                if u:
                    urls.add(u)

    redirects: dict[str, str] = {}
    unresolved = []

    for url in sorted(urls):
        path = re.sub(r'^https?://(www\.)?24high\.com', '', url) or '/'
        if path in MANUAL:
            if MANUAL[path] != path:
                redirects[path] = MANUAL[path]
            continue

        target = None
        if m := re.match(r'^/en/blog/\d+/([\w\-]+)$', path):
            if m.group(1) in posts:
                target = f'/en/blog/{m.group(1)}'
        elif m := re.match(r'^/en/article/([\w\-]+)$', path):
            if m.group(1) in products:
                target = f'/en/product/{m.group(1)}'
        elif m := re.match(rf'^/en/({"|".join(SHOPS)})/\d+-([\w\-]+)$', path):
            if f'{m.group(1)}/{m.group(2)}' in categories:
                target = f'/en/shop/{m.group(1)}/{m.group(2)}'
        elif m := re.match(rf'^/en/({"|".join(SHOPS)})$', path):
            target = f'/en/shop/{m.group(1)}'
        elif path in ('/en', '/'):
            continue

        if target and target != path:
            redirects[path] = target
        elif not target:
            unresolved.append(path)

    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(redirects, fh, indent=0, sort_keys=True)

    print(f'  {len(urls)} distinct ranking URLs')
    print(f'  {len(redirects)} redirects -> src/data/redirects.json')
    if unresolved:
        print(f'  {len(unresolved)} could not be resolved automatically:')
        for u in unresolved[:8]:
            print(f'      {u}')


if __name__ == '__main__':
    main()
