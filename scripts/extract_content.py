"""Turn the scraped mirror into structured Astro content.

The previous migration copied whole page bodies into markdown, so product
facts (price, SKU, stock) lived inside markup and every file re-shipped the
site's chrome, its jQuery handlers and ~80 inlined FontAwesome icons.

Requires the scraped mirror at ./www.24high.com, which is NOT in the repo —
it was removed after extraction. Restore it before re-running.

This reads the mirror instead and writes:

    src/content/products/<slug>.md   frontmatter facts + description prose only
    src/content/blog/<slug>.md       frontmatter meta + article prose only
    src/data/catalog.json            the shop -> category taxonomy

Body HTML is reduced to a safe semantic subset: headings, paragraphs, lists,
tables, emphasis, links and images. Everything else is dropped.
"""
import json
import os
import re
import sys
from collections import Counter, OrderedDict

from bs4 import BeautifulSoup, NavigableString

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIRROR = os.path.join(ROOT, 'www.24high.com')
OUT_PRODUCTS = os.path.join(ROOT, 'src', 'content', 'products')
OUT_BLOG = os.path.join(ROOT, 'src', 'content', 'blog')
OUT_DATA = os.path.join(ROOT, 'src', 'data')

KEEP_TAGS = {'p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i',
             'a', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote'}
KEEP_ATTRS = {'a': ['href'], 'img': ['src', 'alt']}

stats = Counter()


# ---------------------------------------------------------------- helpers

def yaml_str(v):
    """Quote a scalar for YAML frontmatter."""
    if v is None:
        return '""'
    s = str(v).replace('\\', '\\\\').replace('"', '\\"')
    s = re.sub(r'\s+', ' ', s).strip()
    return f'"{s}"'


def clean_text(s):
    return re.sub(r'\s+', ' ', (s or '')).strip()


SHARE_HOSTS = re.compile(r'twitter\.com|facebook\.com|wa\.me|whatsapp|linkedin\.com|'
                         r'pinterest\.|mailto:\?', re.I)


def strip_site_chrome(node):
    """Drop scripts, icons and anything that belongs to the old page shell."""
    for t in node.find_all(['script', 'style', 'noscript', 'svg', 'iframe',
                            'form', 'button', 'select', 'input']):
        t.decompose()
    for t in node.find_all(class_=re.compile(
            r'carousel|article--|rating|tabs__bar|imagebox|breadcrumb|'
            r'social|share|newsarticle__readmore|btn|text-right')):
        t.decompose()
    # the byline / share strip the scrape wraps in a flex row
    for t in node.find_all('div', class_='fx'):
        if re.search(r'last updated|geplaatst op|laatst bijgewerkt',
                     t.get_text(' ', strip=True), re.I) or t.find('a', href=SHARE_HOSTS):
            t.decompose()
    for a in node.find_all('a', href=SHARE_HOSTS):
        a.decompose()


def sanitise(node, base_lang='en'):
    """Reduce a subtree to the semantic subset, unwrapping everything else."""
    strip_site_chrome(node)

    for el in node.find_all(True):
        # decomposing a parent detaches its descendants, but they are still
        # in this snapshot of the tree — skip anything already removed
        if el.parent is None or el.decomposed:
            continue
        if el.name == 'img':
            src = rewrite_asset(el.get('src', ''))
            if not src:
                el.decompose()
                continue
            alt = el.get('alt', '')
            el.attrs = {'src': src, 'alt': alt, 'loading': 'lazy'}
            continue
        if el.name in ('div', 'span', 'section', 'article', 'font', 'center'):
            el.unwrap()
            continue
        if el.name not in KEEP_TAGS:
            el.unwrap()
            continue
        allowed = KEEP_ATTRS.get(el.name, [])
        el.attrs = {k: v for k, v in el.attrs.items() if k in allowed}
        if el.name == 'a':
            el['href'] = rewrite_link(el.get('href', ''), base_lang)

    html = node.decode_contents()
    html = re.sub(r'<(p|li|h2|h3|h4)>\s*</\1>', '', html)   # empty shells
    html = re.sub(r'(<br\s*/?>\s*){3,}', '<br />', html)
    html = re.sub(r'\n{3,}', '\n\n', html)
    return html.strip()


_NEWS_DIR = os.path.join(ROOT, 'public', 'images', 'news')
_NEWS_FILES = set(os.listdir(_NEWS_DIR)) if os.path.isdir(_NEWS_DIR) else set()
# the scrape only ever stored these crops, whatever size the URL asked for
_NEWS_SIZES = ('400x300', '500x500', '300x200')


def news_image(base):
    """Resolve a news image to a crop that actually exists on disk."""
    for size in _NEWS_SIZES:
        if f'{base}-{size}.webp' in _NEWS_FILES:
            return f'/images/news/{base}-{size}.webp'
    return ''


def rewrite_asset(src):
    """Point scraped image URLs at the normalised /images tree."""
    if not src:
        return ''
    src = src.replace('&amp;', '&')
    if m := re.search(r'image\.php[@?]id=(\d+)&w=(\d+)', src):
        return f'/images/products/{m.group(1)}-{m.group(2)}.webp'
    if m := re.search(r'image\.php[@?]n=(.+?)\.\w+&f=news', src):
        return news_image(m.group(1))
    if m := re.search(r'image\.php[@?]f=layout&n=(.+?)\.(\w+)', src):
        return f'/images/layout/{m.group(1)}.{m.group(2)}'
    if src.startswith('http'):
        return src
    return ''


def rewrite_link(href, lang='en'):
    """Map mirror paths onto the new route structure."""
    if not href or href.startswith(('mailto:', 'tel:', '#')):
        return href or '#'
    href = href.replace('&amp;', '&').split('?')[0]
    href = re.sub(r'\.html$', '', href).lstrip('./')
    if m := re.search(r'article/([\w\-]+)', href):
        return f'/{lang}/product/{m.group(1)}'
    if m := re.search(r'blog/\d+/([\w\-]+)', href):
        return f'/{lang}/blog/{m.group(1)}'
    if m := re.search(r'(smartshop|headshop|healthshop|mushrooms|cbdshop|seedshop)/'
                      r'(\d+)-([\w\-]+)', href):
        return f'/{lang}/shop/{m.group(1)}/{m.group(3)}'
    if href.startswith('http'):
        return href
    return f'/{lang}/'


def read(path):
    with open(path, encoding='utf-8', errors='ignore') as f:
        return f.read()


VALID_ESCAPES = set('"\\/bfnrtu')


def repair_json(raw):
    """The CMS emitted JSON-LD with PHP string escaping, which is not JSON.

    Two faults show up: `\\'` (only valid in PHP) and literal newlines inside
    string values. Fix both by walking the text and tracking string state.
    """
    out = []
    in_string = False
    i = 0
    while i < len(raw):
        c = raw[i]
        if c == '\\' and i + 1 < len(raw):
            nxt = raw[i + 1]
            if in_string and nxt not in VALID_ESCAPES:
                out.append(nxt)       # drop the bogus backslash, keep the char
            else:
                out.append(c)
                out.append(nxt)
            i += 2
            continue
        if c == '"':
            in_string = not in_string
        elif in_string and c in '\n\r\t':
            out.append({'\n': '\\n', '\r': '\\r', '\t': '\\t'}[c])
            i += 1
            continue
        out.append(c)
        i += 1
    return ''.join(out)


def json_ld(soup, want):
    for sc in soup.find_all('script', type='application/ld+json'):
        raw = sc.string or sc.get_text()
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            try:
                data = json.loads(repair_json(raw))
            except json.JSONDecodeError:
                stats['json_ld_unparseable'] += 1
                continue
        if isinstance(data, dict) and str(data.get('@type', '')).endswith(want):
            return data
    return {}


def slug_of(filename):
    return re.sub(r'\.html$', '', os.path.basename(filename))


# ---------------------------------------------------------------- products

def extract_product(path):
    soup = BeautifulSoup(read(path), 'html.parser')
    ld = json_ld(soup, 'Product')
    if not ld:
        stats['product_no_ld'] += 1
        return None

    h1 = soup.find('h1')
    title = clean_text(h1.get_text()) if h1 else clean_text(ld.get('name'))
    if not title:
        return None

    meta = soup.find('meta', attrs={'name': 'description'})
    description = clean_text(meta['content']) if meta and meta.get('content') else ''

    offers = ld.get('offers') or {}
    price = offers.get('price') or ''
    try:
        price = round(float(price), 2)
    except (TypeError, ValueError):
        price = None
    in_stock = 'InStock' in str(offers.get('availability', ''))

    # category comes off the single breadcrumb link
    shop = category = category_label = ''
    crumb = soup.find('a', class_='a--hover-primary')
    if crumb and crumb.get('href'):
        if m := re.search(r'(smartshop|headshop|healthshop|mushrooms|cbdshop|seedshop)/'
                          r'(\d+)-([\w\-]+)', crumb['href']):
            shop, category = m.group(1), m.group(3)
            parts = [p.strip() for p in crumb.get_text().split('->')]
            category_label = parts[-1] if parts else ''

    # gallery: thumbnails carry the full-size id
    images = []
    for th in soup.select('.imagebox__thumbnail'):
        url = (th.get('data-url') or '').replace('&amp;', '&')
        if m := re.search(r'id=(\d+)', url):
            if m.group(1) not in images:
                images.append(m.group(1))
    if not images:
        main = soup.select_one('#main-product-image')
        if main and (m := re.search(r'id=(\d+)', main.get('src', '').replace('&amp;', '&'))):
            images.append(m.group(1))

    body_node = soup.select_one('#tabs_description')
    body = sanitise(body_node) if body_node else ''
    if not body and description:
        body = f'<p>{description}</p>'

    stats['products'] += 1
    fm = OrderedDict(
        title=yaml_str(title),
        description=yaml_str(description or title),
        sku=yaml_str(ld.get('sku') or ''),
        price=price if price is not None else 'null',
        currency=yaml_str(offers.get('priceCurrency') or 'EUR'),
        inStock='true' if in_stock else 'false',
        shop=yaml_str(shop),
        category=yaml_str(category),
        categoryLabel=yaml_str(category_label),
    )
    lines = [f'{k}: {v}' for k, v in fm.items()]
    lines.append('images: [' + ', '.join(yaml_str(i) for i in images) + ']')
    return slug_of(path), '---\n' + '\n'.join(lines) + '\n---\n\n' + body + '\n', (shop, category, category_label)


# ------------------------------------------------------------------- blog

def extract_post(path):
    soup = BeautifulSoup(read(path), 'html.parser')
    ld = json_ld(soup, 'BlogPosting')

    h1 = soup.find('h1')
    title = clean_text(h1.get_text()) if h1 else clean_text(ld.get('headline'))
    if not title:
        stats['blog_no_title'] += 1
        return None
    # the scrape shouts a lot of headlines in caps
    if title.isupper() and len(title) > 12:
        title = title.title()
    title = re.sub(r'\s*\|\s*24High\s*$', '', title).strip()

    meta = soup.find('meta', attrs={'name': 'description'})
    description = clean_text(meta['content']) if meta and meta.get('content') else ''

    hero = rewrite_asset(ld.get('image', ''))
    if not hero:
        img = soup.select_one('.content img')
        hero = rewrite_asset(img.get('src', '')) if img else ''

    content = soup.select_one('div.content')
    if not content:
        stats['blog_no_body'] += 1
        return None
    for h in content.find_all('h1'):
        h.decompose()
    # the hero is rendered from frontmatter, so drop it from the prose
    for img in content.find_all('img'):
        if rewrite_asset(img.get('src', '')) == hero and hero:
            (img.parent if img.parent.name == 'p' else img).decompose()
            break
    body = sanitise(content)
    if len(re.sub(r'<[^>]+>', '', body).strip()) < 200:
        stats['blog_too_short'] += 1
        return None

    stats['posts'] += 1
    fm = OrderedDict(
        title=yaml_str(title),
        description=yaml_str(description or title),
        heroImage=yaml_str(hero),
        publishedAt=yaml_str((ld.get('datePublished') or '')[:10]),
        updatedAt=yaml_str((ld.get('dateModified') or ld.get('datePublished') or '')[:10]),
        author=yaml_str((ld.get('author') or {}).get('name') or '24highshop'),
    )
    lines = [f'{k}: {v}' for k, v in fm.items()]
    return slug_of(path), '---\n' + '\n'.join(lines) + '\n---\n\n' + body + '\n'


# ------------------------------------------------------------------- main

def resolve_links():
    """Drop cross-language links that have no English target.

    Source pages link between the six country sites, so a share of the hrefs
    point at Dutch, German or Italian slugs. Rewriting those to /en/ would
    produce a build full of 404s, so anything that does not resolve loses its
    anchor and keeps its text.
    """
    products = {f[:-3] for f in os.listdir(OUT_PRODUCTS)}
    posts = {f[:-3] for f in os.listdir(OUT_BLOG)}

    with open(os.path.join(OUT_DATA, 'catalog.json'), encoding='utf-8') as fh:
        taxonomy = json.load(fh)
    # only categories that actually hold products get a page
    categories = {f'{shop}/{cat}' for shop, cats in taxonomy.items() for cat in cats}

    def keep(href):
        if href.startswith('/en/product/'):
            return href.split('/en/product/', 1)[1].strip('/') in products
        if href.startswith('/en/blog/'):
            return href.split('/en/blog/', 1)[1].strip('/') in posts
        if href.startswith('/en/shop/'):
            return href.split('/en/shop/', 1)[1].strip('/') in categories
        return True

    def has_file(src):
        return os.path.exists(os.path.join(ROOT, 'public', src.lstrip('/')))

    link_re = re.compile(r'<a href="([^"]+)">(.*?)</a>', re.S)
    img_re = re.compile(r'<img src="(/[^"]+)"[^>]*/?>')

    for folder in (OUT_PRODUCTS, OUT_BLOG):
        for name in os.listdir(folder):
            path = os.path.join(folder, name)
            with open(path, encoding='utf-8') as fh:
                body = fh.read()

            fixed = link_re.sub(
                lambda m: m.group(0) if keep(m.group(1)) else m.group(2), body
            )
            # the scrape references a few shots it never captured
            fixed = img_re.sub(lambda m: m.group(0) if has_file(m.group(1)) else '', fixed)

            if fixed != body:
                stats['links_unwrapped'] += len(link_re.findall(body)) - len(
                    link_re.findall(fixed)
                )
                stats['images_dropped'] += len(img_re.findall(body)) - len(
                    img_re.findall(fixed)
                )
                with open(path, 'w', encoding='utf-8') as fh:
                    fh.write(fixed)


def main():
    for d in (OUT_PRODUCTS, OUT_BLOG, OUT_DATA):
        os.makedirs(d, exist_ok=True)

    taxonomy = {}

    art_dir = os.path.join(MIRROR, 'en', 'article')
    files = sorted(f for f in os.listdir(art_dir) if f.endswith('.html'))
    for i, f in enumerate(files, 1):
        res = extract_product(os.path.join(art_dir, f))
        if not res:
            continue
        slug, doc, (shop, cat, label) = res
        with open(os.path.join(OUT_PRODUCTS, slug + '.md'), 'w', encoding='utf-8') as fh:
            fh.write(doc)
        if shop and cat:
            taxonomy.setdefault(shop, {}).setdefault(cat, {'label': label, 'count': 0})
            taxonomy[shop][cat]['count'] += 1
        if i % 250 == 0:
            print(f'  products {i}/{len(files)}', flush=True)

    blog_dir = os.path.join(MIRROR, 'en', 'blog')
    seen = set()
    posts = []
    for root, _, fs in os.walk(blog_dir):
        for f in sorted(fs):
            if f.endswith('.html') and not f.startswith('index'):
                posts.append(os.path.join(root, f))
    for i, p in enumerate(posts, 1):
        res = extract_post(p)
        if not res:
            continue
        slug, doc = res
        if slug in seen:
            stats['blog_dupe'] += 1
            continue
        seen.add(slug)
        with open(os.path.join(OUT_BLOG, slug + '.md'), 'w', encoding='utf-8') as fh:
            fh.write(doc)
        if i % 200 == 0:
            print(f'  posts {i}/{len(posts)}', flush=True)

    with open(os.path.join(OUT_DATA, 'catalog.json'), 'w', encoding='utf-8') as fh:
        json.dump(taxonomy, fh, indent=2, sort_keys=True)

    resolve_links()

    print('\n--- extraction summary ---')
    for k, v in sorted(stats.items()):
        print(f'  {v:6d}  {k}')
    print(f'  {sum(len(v) for v in taxonomy.values()):6d}  categories across '
          f'{len(taxonomy)} shops')


if __name__ == '__main__':
    main()
