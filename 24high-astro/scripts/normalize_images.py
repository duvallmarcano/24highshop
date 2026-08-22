"""Rename scraped `image.php@...` assets into clean, predictable paths.

The mirror stored query strings as filenames. This maps them onto a flat,
readable scheme so components can build an image URL from an id alone:

    articles/image.php@id=4967&w=1000&h=1000    ->  products/4967-1000.webp
    image.php@n=270-1690816175.jpg&f=news&w=400&h=300 -> news/270-1690816175-400x300.webp
    image.php@f=layout&n=logo-200.png           ->  layout/logo-200.png
    image.php@f=authors&n=3.webp&w=300&h=300    ->  authors/3-300.webp

Extensions come from the file's magic bytes, because the scraped names lie
(most `.jpg` URLs actually served WebP).
"""
import os
import re
import shutil
import subprocess
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public', 'images')

MIME_EXT = {
    'image/webp': '.webp', 'image/jpeg': '.jpg', 'image/png': '.png',
    'image/gif': '.gif', 'image/svg+xml': '.svg',
}
moved = Counter()


def ext_of(path):
    mime = subprocess.run(['file', '-b', '--mime-type', path],
                          capture_output=True, text=True).stdout.strip()
    return MIME_EXT.get(mime, '.bin')


def place(src, subdir, name):
    dest_dir = os.path.join(SRC, subdir)
    os.makedirs(dest_dir, exist_ok=True)
    dest = os.path.join(dest_dir, name + ext_of(src))
    if os.path.exists(dest):
        os.remove(src)          # already normalised on a previous run
    else:
        shutil.move(src, dest)
    moved[subdir] += 1


def write_size_manifest():
    """Record which product ids exist at full size.

    The mirror captured a 1000px crop for some products and only a 200px
    thumbnail for others, so components need to know which to ask for rather
    than linking a file that is not there.
    """
    import json
    prod = os.path.join(SRC, 'products')
    if not os.path.isdir(prod):
        return
    large = sorted({f.rsplit('-', 1)[0] for f in os.listdir(prod)
                    if f.endswith('-1000.webp')})
    out = os.path.join(ROOT, 'src', 'data', 'product-image-sizes.json')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as fh:
        json.dump(large, fh)
    print(f'  {len(large):5d}  ids with a 1000px crop -> product-image-sizes.json')


def main():
    # product shots live one level down, in articles/
    adir = os.path.join(SRC, 'articles')
    if os.path.isdir(adir):
        for f in sorted(os.listdir(adir)):
            p = os.path.join(adir, f)
            if os.path.isfile(p) and (m := re.match(r'image\.php@id=(\d+)&w=(\d+)', f)):
                place(p, 'products', f'{m.group(1)}-{m.group(2)}')
        if not os.listdir(adir):
            os.rmdir(adir)

    # everything else sits at the images/ root
    for f in sorted(os.listdir(SRC)):
        p = os.path.join(SRC, f)
        if not os.path.isfile(p):
            continue
        if m := re.match(r'image\.php@n=(.+?)\.\w+&f=news&w=(\d+)&h=(\d+)', f):
            place(p, 'news', f'{m.group(1)}-{m.group(2)}x{m.group(3)}')
        elif m := re.match(r'image\.php@f=authors&n=(\d+)\.\w+&w=(\d+)', f):
            place(p, 'authors', f'{m.group(1)}-{m.group(2)}')
        elif m := re.match(r'image\.php@f=layout&n=(.+?)\.\w+$', f):
            place(p, 'layout', m.group(1))
        elif m := re.match(r'image\.php@f=bannerbuttons&n=(.+?)\.\w+$', f):
            place(p, 'banners', m.group(1))
        elif m := re.match(r'image\.php@n=(\d+)\.\w+&f=banners&w=(\d+)', f):
            place(p, 'banners', f'{m.group(1)}-{m.group(2)}')

    for k, v in sorted(moved.items()):
        print(f'  {v:5d}  {k}/')
    leftover = [f for f in os.listdir(SRC) if os.path.isfile(os.path.join(SRC, f))]
    print(f'  {len(leftover):5d}  unmatched left at images/ root')
    for f in leftover[:5]:
        print(f'          {f}')
    write_size_manifest()



if __name__ == '__main__':
    main()
