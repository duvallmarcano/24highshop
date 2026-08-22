"""Recover the aggregate ratings the first extraction threw away.

`extract_content.py` stripped every element whose class matched `rating`,
which removed the review widget — but the page's own `aggregateRating` also
lived in the Product JSON-LD, and that went with it.

This reads the pre-extraction baseline commit (the raw scrape, which is no
longer on disk) and writes the recovered `rating:` block back into the
product frontmatter.

Only the aggregate survives. Review *bodies* were loaded over AJAX into an
empty `#review-container`, so no scraped page ever contained review text —
`reviews:` stays empty and nothing is invented to fill it.

    python3 scripts/restore_ratings.py [--dry-run]
"""
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRODUCTS = os.path.join(ROOT, 'src', 'content', 'products')
BASELINE = 'a4587ef'
BASE_DIR = '24high-astro/src/content/article-en'


def baseline_files() -> list[str]:
    out = subprocess.run(
        ['git', 'ls-tree', '-r', '--name-only', BASELINE, BASE_DIR],
        cwd=ROOT, capture_output=True, text=True, check=True,
    ).stdout.split('\n')
    return [f for f in out if f.endswith('.md')]


def read_baseline(path: str) -> str:
    return subprocess.run(
        ['git', 'show', f'{BASELINE}:{path}'],
        cwd=ROOT, capture_output=True, text=True,
    ).stdout


def main():
    dry = '--dry-run' in sys.argv
    found: dict[str, dict] = {}

    for path in baseline_files():
        slug = os.path.basename(path)[:-3]
        html = read_baseline(path)
        m = re.search(r'"aggregateRating"\s*:\s*\{(.*?)\}', html, re.S)
        if not m:
            continue
        blob = m.group(1)
        value = re.search(r'"ratingValue"\s*:\s*"?([\d.]+)"?', blob)
        count = re.search(r'"reviewCount"\s*:\s*"?(\d+)"?', blob)
        if not (value and count):
            continue
        v, c = float(value.group(1)), int(count.group(1))
        if not (1 <= v <= 5 and c > 0):
            continue
        found[slug] = {'value': round(v, 2), 'count': c}

    print(f'  {len(found)} products carry an aggregate rating in the baseline scrape')

    applied = skipped = 0
    for slug, r in sorted(found.items()):
        target = os.path.join(PRODUCTS, f'{slug}.md')
        if not os.path.exists(target):
            skipped += 1
            continue
        text = open(target, encoding='utf-8').read()
        if re.search(r'^rating:', text, re.M):
            continue
        block = f'rating:\n  value: {r["value"]}\n  count: {r["count"]}\n'
        # sits directly above `images:`, keeping frontmatter order stable
        new = re.sub(r'^(images: )', block + r'\1', text, count=1, flags=re.M)
        if new == text:
            skipped += 1
            continue
        if not dry:
            open(target, 'w', encoding='utf-8').write(new)
        applied += 1

    print(f'  {applied} written{" (dry run)" if dry else ""}, {skipped} skipped (product no longer listed)')

    dist: dict[float, int] = {}
    for r in found.values():
        dist[r['value']] = dist.get(r['value'], 0) + 1
    print('  rating spread: ' + ', '.join(f'{k}★×{v}' for k, v in sorted(dist.items())))
    print(f'  total reviews behind them: {sum(r["count"] for r in found.values())}')


if __name__ == '__main__':
    main()
