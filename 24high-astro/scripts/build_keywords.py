"""Turn the Semrush position exports into a keyword map keyed by route.

The exports say which *old* URL ranks for each term. This maps those URLs onto
the routes this site actually serves, so every page can see the queries it is
already being found for.

Reads:   ../*.csv          (Semrush "Organic Positions" exports)
Writes:  src/data/keywords.json
         src/data/keyword-gaps.json   terms with no page to land on
"""
import csv
import glob
import json
import os
import re
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_DIR = os.path.join(ROOT, '..')
OUT = os.path.join(ROOT, 'src', 'data')

SHOPS = ('smartshop', 'headshop', 'healthshop', 'mushrooms', 'cbdshop', 'seedshop')

# Terms that describe the old business rather than the catalogue, or that we
# have no intention of competing for.
STOP = re.compile(r'\b24high\b|\bcocaine\b|\bsnuif\b', re.I)


def route_for(url: str, products: set, posts: set, categories: set) -> str | None:
    """Map a scraped URL onto the route that replaced it."""
    if not url:
        return None
    path = url.split('?')[0].rstrip('/')

    if m := re.search(r'/en/blog/\d+/([\w\-]+)', path):
        slug = m.group(1)
        return f'/en/blog/{slug}' if slug in posts else None

    if m := re.search(r'/en/article/([\w\-]+)', path):
        slug = m.group(1)
        return f'/en/product/{slug}' if slug in products else None

    if m := re.search(rf'/en/({"|".join(SHOPS)})/\d+-([\w\-]+)', path):
        shop, cat = m.group(1), m.group(2)
        return f'/en/shop/{shop}/{cat}' if f'{shop}/{cat}' in categories else None

    if m := re.search(rf'/en/({"|".join(SHOPS)})$', path):
        return f'/en/shop/{m.group(1)}'

    if path.endswith('.com') or path.endswith('/en'):
        return '/en/'

    return None


def as_int(v, default=0):
    try:
        return int(float(v or default))
    except (TypeError, ValueError):
        return default


def main():
    products = {f[:-3] for f in os.listdir(os.path.join(ROOT, 'src/content/products'))}
    posts = {f[:-3] for f in os.listdir(os.path.join(ROOT, 'src/content/blog'))}
    with open(os.path.join(OUT, 'catalog.json'), encoding='utf-8') as fh:
        catalog = json.load(fh)
    categories = {f'{s}/{c}' for s, cats in catalog.items() for c in cats}

    # best row per keyword across all exports
    best: dict[str, dict] = {}
    files = sorted(glob.glob(os.path.join(CSV_DIR, '*.csv')))
    for f in files:
        with open(f, encoding='utf-8-sig', newline='') as fh:
            for r in csv.DictReader(fh):
                kw = (r.get('Keyword') or '').strip().lower()
                if not kw or STOP.search(kw):
                    continue
                pos = as_int(r.get('Position'), 999)
                if kw not in best or pos < best[kw]['position']:
                    best[kw] = {
                        'keyword': kw,
                        'position': pos,
                        'volume': as_int(r.get('Search Volume')),
                        'difficulty': as_int(r.get('Keyword Difficulty')),
                        'intent': [i.strip() for i in (r.get('Keyword Intents') or '').split(',') if i.strip()],
                        'url': (r.get('URL') or '').strip(),
                    }

    by_route: dict[str, list] = defaultdict(list)
    gaps = []
    for kw, row in best.items():
        route = route_for(row['url'], products, posts, categories)
        entry = {k: row[k] for k in ('keyword', 'position', 'volume', 'difficulty', 'intent')}
        if route:
            by_route[route].append(entry)
        elif row['volume'] >= 100:
            gaps.append({**entry, 'url': row['url']})

    for route in by_route:
        by_route[route].sort(key=lambda e: (-e['volume'], e['position']))

    gaps.sort(key=lambda e: -e['volume'])

    with open(os.path.join(OUT, 'keywords.json'), 'w', encoding='utf-8') as fh:
        json.dump(by_route, fh, indent=0, sort_keys=True)
    with open(os.path.join(OUT, 'keyword-gaps.json'), 'w', encoding='utf-8') as fh:
        json.dump(gaps[:150], fh, indent=2)

    mapped = sum(len(v) for v in by_route.values())
    vol = sum(e['volume'] for v in by_route.values() for e in v)
    print(f'  {len(files)} export(s), {len(best)} unique keywords')
    print(f'  {mapped} mapped onto {len(by_route)} routes ({vol:,} monthly searches)')
    print(f'  {len(gaps)} unmapped with volume >= 100 -> keyword-gaps.json')
    kinds = defaultdict(int)
    for r in by_route:
        kinds['blog' if '/blog/' in r else
              'product' if '/product/' in r else
              'category' if r.count('/') > 3 else 'shop/home'] += 1
    for k, v in sorted(kinds.items(), key=lambda x: -x[1]):
        print(f'    {v:4d} {k} pages have keyword data')


if __name__ == '__main__':
    main()
