"""Generate /llms.txt — a plain-text map of the site for language models.

Answer engines and LLM crawlers do better with a curated index than with a
1,800-URL sitemap. This states what the business is, where it is, what it
sells, and which pages are worth reading, in the order a model should read
them.

Run after `extract_content.py`, since it reads the generated catalogue.
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'llms.txt')
SITE = 'https://www.24high.com'

SHOP_ORDER = ['mushrooms', 'smartshop', 'headshop', 'seedshop', 'cbdshop', 'healthshop']
SHOP_LABEL = {
    'mushrooms': 'Mushrooms',
    'smartshop': 'Smartshop',
    'headshop': 'Headshop',
    'seedshop': 'Seedshop',
    'cbdshop': 'CBD',
    'healthshop': 'Healthshop',
}


def front_matter(path):
    """Read the frontmatter block of a content file into a dict."""
    out = {}
    with open(path, encoding='utf-8') as fh:
        if fh.readline().strip() != '---':
            return out
        for line in fh:
            line = line.rstrip('\n')
            if line.strip() == '---':
                break
            if m := re.match(r'^(\w+):\s*(.*)$', line):
                out[m.group(1)] = m.group(2).strip().strip('"')
    return out


def main():
    catalog = json.load(open(os.path.join(ROOT, 'src', 'data', 'catalog.json'),
                             encoding='utf-8'))

    blog_dir = os.path.join(ROOT, 'src', 'content', 'blog')
    posts = []
    for f in os.listdir(blog_dir):
        fm = front_matter(os.path.join(blog_dir, f))
        if fm.get('title'):
            posts.append((fm.get('publishedAt', ''), fm['title'], f[:-3]))
    posts.sort(reverse=True)

    total = sum(c['count'] for cats in catalog.values() for c in cats.values())

    L = []
    add = L.append

    add('# 24High')
    add('')
    # Swiss thousands separator is an apostrophe — applied to the number only
    total_ch = f'{total:,}'.replace(',', "\u2019")
    add('> Swiss smartshop for botanicals and mycology, based in Zürich and trading '
        f'since 2018. {total_ch} products across six shops — mushroom grow kits, spores '
        'and cultures, kratom and kanna, cannabis genetics, CBD, and headshop hardware — '
        'shipped from Swiss stock in plain packaging, usually within one to two working '
        'days.')
    add('')
    add('## Key facts')
    add('')
    add('- Legal name: 24High AG, Zürich, Switzerland')
    add('- Currency: CHF (prices include 8.1% Swiss VAT); EUR shown for reference')
    add('- Shipping: free within Switzerland over CHF 60, otherwise CHF 7.90; '
        '1–2 working days domestically, 2–6 elsewhere in Europe')
    add('- Packaging: plain and unmarked, no branding or product name outside')
    add('- Payment: TWINT, PostFinance, Visa, Mastercard, invoice')
    add('- Returns: 14 days on unopened items; perishables and opened consumables excluded')
    add('- Age policy: strictly 18+')
    add('- Legal note: cannabis below 1% THC is lawful in Switzerland. Psilocybin is '
        'controlled and is NOT sold. Kratom is sold as a botanical specimen, not for '
        'consumption.')
    add('')

    add('## Shops')
    add('')
    for shop in SHOP_ORDER:
        cats = catalog.get(shop)
        if not cats:
            continue
        n = sum(c['count'] for c in cats.values())
        add(f'- [{SHOP_LABEL[shop]}]({SITE}/en/shop/{shop}): {n} products '
            f'across {len(cats)} categories')
    add('')

    add('## Categories')
    add('')
    for shop in SHOP_ORDER:
        cats = catalog.get(shop)
        if not cats:
            continue
        add(f'### {SHOP_LABEL[shop]}')
        add('')
        for slug, c in sorted(cats.items(), key=lambda kv: -kv[1]['count']):
            add(f'- [{c["label"]}]({SITE}/en/shop/{shop}/{slug}): {c["count"]} products')
        add('')

    add('## Guides')
    add('')
    add(f'{len(posts)} guides on cultivation, dosing, harm reduction and botany, '
        'written by named authors and checked in-house. Most recent first:')
    add('')
    for _, title, slug in posts[:60]:
        add(f'- [{title}]({SITE}/en/blog/{slug})')
    add('')
    add(f'- [All guides]({SITE}/en/blog)')
    add('')

    add('## About and policies')
    add('')
    for label, path in [
        ('About 24High', '/en/about'),
        ('Editorial standards', '/en/editorial-policy'),
        ('Our writers', '/en/authors'),
        ('Shipping and returns', '/en/shipping'),
        ('Terms and conditions', '/en/terms'),
        ('Privacy policy', '/en/privacy'),
        ('Disclaimer', '/en/disclaimer'),
        ('Contact', '/en/contact'),
    ]:
        add(f'- [{label}]({SITE}{path})')
    add('')

    with open(OUT, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(L))
    print(f'  wrote {len(L)} lines -> public/llms.txt')


if __name__ == '__main__':
    main()
