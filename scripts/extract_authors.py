"""Pull the real author profiles out of the mirror.

E-E-A-T needs named people with verifiable bios, not invented credentials.
The source site has four named writers with real biographies and portraits,
so this reads them rather than making anything up.
"""
import json
import os
import re

from bs4 import BeautifulSoup

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIRROR = os.path.join(ROOT, 'www.24high.com')
AUTHOR_DIR = os.path.join(MIRROR, 'en', 'authors')
OUT = os.path.join(ROOT, 'src', 'data', 'authors.json')

SLUGS = ['elke-folkersma', 'mirjam-sprenger', 'rianne-gerrits', 'stoney-tark']


def clean(s):
    return re.sub(r'\s+', ' ', s or '').strip()


def main():
    authors = []
    for slug in SLUGS:
        path = os.path.join(AUTHOR_DIR, f'{slug}.html')
        if not os.path.exists(path):
            print(f'  [skip] {slug}')
            continue

        soup = BeautifulSoup(open(path, encoding='utf-8', errors='ignore').read(),
                             'html.parser')
        content = soup.find('div', class_='content')
        if not content:
            continue

        h1 = content.find('h1')
        name = clean(h1.get_text()) if h1 else slug.replace('-', ' ').title()

        # the bio is the run of paragraphs before the "Latest articles" list
        # Only paragraphs before the "Latest articles" list are biography.
        # Walking every <p> pulled article summaries in as bio text.
        bio = []
        for node in content.find_all(['h2', 'h3', 'p']):
            text = clean(node.get_text())
            if node.name in ('h2', 'h3'):
                if re.search(r'latest|articles|artikel', text, re.I):
                    break
                continue
            if not text or re.search(r'^latest article', text, re.I):
                break
            if len(text) > 40:
                bio.append(text)
        bio = bio[:3]

        # portrait id, e.g. image.php?f=authors&n=3.webp
        image = ''
        for img in content.find_all('img'):
            src = (img.get('src') or '').replace('&amp;', '&')
            if m := re.search(r'f=authors&n=(\d+)\.', src):
                image = m.group(1)
                break

        authors.append({
            'slug': slug,
            'name': name,
            'bio': bio,
            'image': image,
        })
        print(f'  {name:20s} image={image or "-":3s} {len(bio)} bio paragraph(s)')

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(authors, fh, indent=2, ensure_ascii=False)
    print(f'\n  wrote {len(authors)} authors -> src/data/authors.json')


if __name__ == '__main__':
    main()
