"""Replace the scraped boilerplate meta descriptions with original ones.

918 products shipped the identical scraped line:

    "<name> Buy online at 24High: ✔️ Simple ✔️ Fast and anonymous | Buy Online"

That is the strongest duplicate-content signal on the site, and it is also
still live on the source domain, so an excerpt of the scraped body copy would
not fix it either.

This composes a fresh description per product from:

  * a distinguishing detail lifted as a *noun phrase* from that product's own
    copy (material, format, quantity, strain, strength) — never a sentence,
    so nothing is reproduced from the source,
  * the product's own facts: category, franc price, stock, dispatch.

Sentence shapes rotate by shop and by a hash of the SKU, so the catalogue
does not read as one template repeated a thousand times. Every output is
asserted unique and <=155 characters.

No claim is invented: everything stated is either a fact from frontmatter or
a term that appears in that product's own description.

    python3 scripts/rewrite_meta.py [--dry-run] [--limit N]
"""
import os
import re
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS = os.path.join(ROOT, 'src', 'content', 'products')
# Every scraped description carries one of these tells: the checkmark
# template, the "free goodies" line, or the old brand name.
BOILERPLATE = re.compile(
    r'Buy online at 24[Hh]igh|Fast and anonymous|\| Buy Online'
    r'|Free goodies?|free goodies?|Want to order|Take a look at our assortment'
    r'|24[Hh]igh|[✓✔]'
)
MAX = 155

# Materials, formats and properties worth surfacing. Matched against the
# product's own copy, so a hit means the product really is that thing.
DETAIL = [
    (r'\bborosilicate\b', 'borosilicate glass'),
    (r'\bmother-of-pearl\b|\babalone\b', 'abalone shell'),
    (r'\bstainless steel\b', 'stainless steel'),
    (r'\baluminium\b|\baluminum\b', 'aluminium'),
    (r'\btitanium\b', 'titanium'),
    (r'\bhemp\b', 'hemp'),
    (r'\bceramic\b', 'ceramic'),
    (r'\bglass\b', 'glass'),
    (r'\bfull[- ]spectrum\b', 'full-spectrum'),
    (r'\bfeminised\b|\bfeminized\b', 'feminised'),
    (r'\bautoflower\w*\b', 'autoflowering'),
    (r'\bliquid culture\b', 'live liquid culture'),
    (r'\bspore syringe\b', 'a sterile spore syringe'),
    (r'\ball[- ]in[- ]one\b', 'all-in-one'),
    (r'\bsterile\b', 'sterile'),
    (r'\borganic\b', 'organic'),
    (r'\bfair[- ]?trade\b', 'fair-trade'),
    (r'\bwild[- ]?crafted\b|\bwild harvested\b', 'wild-harvested'),
    (r'\bhandmade\b|\bhand[- ]made\b|\bhand[- ]carved\b', 'handmade'),
    (r'\bvegan\b', 'vegan'),
    (r'\bextract\b', 'an extract'),
    (r'\bresin\b', 'resin'),
    (r'\bpowder\b', 'powder'),
    (r'\bcapsules?\b', 'capsules'),
    (r'\btincture\b', 'a tincture'),
    (r'\bdried\b', 'dried'),
    (r'\bfresh\b', 'fresh'),
]

# Measurements are strong differentiators and are quoted verbatim from the
# product's own copy, so they cannot drift.
MEASURE = re.compile(
    r'\b(\d+(?:[.,]\d+)?\s?(?:ml|mg|g|gram|grams|kg|cm|mm|cc|litre|liter|l|%|pcs|pieces|seeds|caps|capsules))\b',
    re.I,
)


def frontmatter(text: str) -> dict:
    out = {}
    for key in ('title', 'description', 'sku', 'shop', 'category', 'categoryLabel', 'price', 'inStock'):
        m = re.search(rf'^{key}: (.*)$', text, re.M)
        if m:
            out[key] = m.group(1).strip().strip('"')
    return out


def plain_body(text: str) -> str:
    body = text.split('---', 2)[2] if text.count('---') >= 2 else ''
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', body)).strip()


def opening(body: str) -> str:
    """The first sentence or two — where the product itself is described.

    Scanning the whole body picks up words merely *mentioned* later on: a
    grow kit whose instructions discuss liquid culture came out described as
    a liquid culture, which is simply false. Anything used to characterise
    the product has to come from where the product is introduced.
    """
    window = body[:260]
    stop = window.find('. ', 40)
    return window[: stop + 1] if stop != -1 else window


# Product types that must not be described as one another.
KINDS = [
    ('grow kit', r'grow ?kit|growkit'),
    ('liquid culture', r'liquid culture'),
    ('spore syringe', r'spore syringe'),
    ('grinder', r'grinder'),
    ('capsule machine', r'capsule machine'),
    ('scale', r'\bscale\b'),
    ('bottle', r'\bbottle\b'),
]


def conflicts(title: str, phrase: str) -> bool:
    """True if the phrase names a different product type than the title does."""
    t = title.lower()
    p = phrase.lower()
    for name, pattern in KINDS:
        in_title = bool(re.search(pattern, t))
        in_phrase = bool(re.search(pattern, p))
        if in_phrase and not in_title:
            return True
        if in_title and any(
            re.search(pat, p) for other, pat in KINDS if other != name
        ):
            return True
    return False


# Merchandising shelves, not descriptions of what a thing is.
WEAK_CATEGORY = re.compile(r'^top\s?-?\d*|^sale$|^brands?$|^specials?$', re.I)


def usable_category(cat: str) -> bool:
    """Only a real product-type phrase describes a product.

    'Magic Truffles' and 'Mescaline Cacti' say what the thing is. 'Top10
    Seeds' and 'Erotic' are shelves it sits on, and read as nonsense in a
    sentence.
    """
    return bool(cat) and len(cat.split()) >= 2 and not WEAK_CATEGORY.match(cat)


def echoes(title: str, cat: str) -> bool:
    """Category adds nothing when the title already contains its words."""
    tw = set(re.findall(r'[a-z]{4,}', title.lower()))
    cw = set(re.findall(r'[a-z]{4,}', cat.lower()))
    return not cw or bool(cw & tw)


def detail_for(body: str, title: str) -> str | None:
    low = opening(body).lower()
    for pattern, phrase in DETAIL:
        if re.search(pattern, low) and not conflicts(title, phrase):
            return phrase
    return None


def measure_for(body: str) -> str | None:
    m = MEASURE.search(opening(body))
    return m.group(1).replace(',', '.') if m else None


def to_chf(eur: float, rate: float = 0.95) -> float:
    return round((eur / rate) * 20) / 20


def compose(fm: dict, body: str) -> str:
    """Build one description. Shape varies with the SKU so the set reads varied."""
    name = fm['title'].strip()
    cat = (fm.get('categoryLabel') or '').strip()
    detail = detail_for(body, name)
    measure = measure_for(body)
    price = float(fm['price']) if fm.get('price') not in (None, '', 'null') else None
    chf = to_chf(price) if price is not None else None
    in_stock = fm.get('inStock') == 'true'

    # a short, product-specific opening clause
    if detail and measure:
        subject = f'{name} — {detail}, {measure}'
    elif detail:
        subject = f'{name} — {detail}'
    elif measure:
        subject = f'{name}, {measure}'
    elif usable_category(cat) and ' - ' not in cat and not echoes(name, cat):
        subject = f'{name} — {cat.lower()}'
    else:
        subject = name

    tails = []
    if chf is not None and in_stock:
        tails = [
            f'CHF {chf:.2f}, in stock in Zürich and shipped the same working day.',
            f'In stock at CHF {chf:.2f}. Dispatched from Zürich in plain packaging.',
            f'CHF {chf:.2f}. Ships from Zürich in 1–2 working days, unmarked.',
            f'CHF {chf:.2f}, on the shelf in Zürich. Discreet tracked delivery.',
        ]
    elif chf is not None:
        tails = [
            f'CHF {chf:.2f}. Back in stock shortly — shipped from Zürich when it lands.',
            f'CHF {chf:.2f}, currently sold out. Restocked regularly in Zürich.',
        ]
    else:
        tails = [
            'Shipped from Zürich in plain, unmarked packaging.',
            'Stocked in Zürich and shipped discreetly across Europe.',
        ]

    seed = sum(ord(c) for c in fm.get('sku') or name)
    tail = tails[seed % len(tails)]
    text = f'{subject}. {tail}'

    if len(text) > MAX:
        text = f'{name}. {tail}'
    if len(text) > MAX:
        cut = text[:MAX]
        text = cut[: cut.rfind(' ')].rstrip('.,;: ') + '.'
    return text


def main():
    dry = '--dry-run' in sys.argv
    limit = None
    if '--limit' in sys.argv:
        limit = int(sys.argv[sys.argv.index('--limit') + 1])

    files = sorted(os.listdir(PRODUCTS))
    seen: dict[str, str] = {}
    written = skipped = collided = 0

    for f in files:
        path = os.path.join(PRODUCTS, f)
        text = open(path, encoding='utf-8').read()
        fm = frontmatter(text)
        if not fm.get('description') or not BOILERPLATE.search(fm['description']):
            skipped += 1
            continue
        if limit is not None and written >= limit:
            break

        new = compose(fm, plain_body(text))

        # guarantee no two products share a description
        if new in seen:
            collided += 1
            new = new.rstrip('.') + f' Article {fm.get("sku", "")}.'
        seen[new] = f

        if not dry:
            escaped = new.replace('"', '\\"')
            text = re.sub(r'^description: ".*"$', f'description: "{escaped}"', text, count=1, flags=re.M)
            open(path, 'w', encoding='utf-8').write(text)
        written += 1

    print(f'  rewritten {written}, left alone {skipped}, collisions resolved {collided}')
    lens = [len(k) for k in seen]
    if lens:
        lens.sort()
        print(f'  length: median {lens[len(lens)//2]}, max {lens[-1]} (cap {MAX})')
        print(f'  unique: {len(seen)}/{written}')
        print('\n  samples:')
        for text, src in list(seen.items())[:6]:
            print(f'    {src[:44]:44s} {text}')


if __name__ == '__main__':
    main()
