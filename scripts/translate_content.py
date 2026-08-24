"""Machine-translate the product and guide bodies into the other locales.

862,244 words across 1,695 files. Times eight target languages that is about
6.9 million words — far past what can be written by hand, so this is the only
route to a fully translated catalogue.

    export DEEPL_API_KEY=...
    python3 scripts/translate_content.py --estimate            # cost, no calls
    python3 scripts/translate_content.py --lang de --limit 20  # try a batch
    python3 scripts/translate_content.py --lang de             # the whole set

Design notes
------------
* DeepL is called with ``tag_handling=html``, so the markup in each body
  survives and only the text between tags is translated.
* Anything that must not be translated — product names, SKUs, brand, units,
  species binomials — is wrapped in ``<span translate="no">`` before the call
  and unwrapped after. DeepL honours that attribute.
* Numbers are checked after translation: if a file comes back with a
  different set of digits than it went in with, it is rejected rather than
  written. A drifted dose or temperature is the one failure mode that matters
  here.
* Output lands in ``src/content/products-<lang>/`` and ``blog-<lang>/`` so the
  English originals are never overwritten, and the run is resumable — files
  that already exist are skipped.
* Every translated file gets ``machineTranslated: true`` in its frontmatter so
  the site can mark it, and so a human review pass can find what still needs
  checking.
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, 'src', 'content')
COLLECTIONS = ('products', 'blog')
TARGETS = ('de', 'fr', 'it', 'nl', 'es', 'pl', 'cs', 'pt')

# DeepL bills per character of source text.
DEEPL_URL = 'https://api-free.deepl.com/v2/translate'
DEEPL_PRO_URL = 'https://api.deepl.com/v2/translate'
PRICE_PER_MILLION_EUR = 20.0

# DeepL target codes differ from our locale codes in two places.
DEEPL_TARGET = {'pt': 'PT-PT', 'en': 'EN-GB'}

# Never translate: brand, SKUs, units, and the Latin binomials that identify
# a species. Getting "Psilocybe cubensis" localised would be actively wrong.
PROTECT = re.compile(
    r'(24highshop|24[Hh]igh'
    r'|\b[A-Z][a-z]+ [a-z]{4,}(?:ii|is|us|um|ae|ata|osa|ensis)\b'   # binomials
    r'|\b\d+(?:[.,]\d+)?\s?(?:ml|mg|g|kg|cm|mm|cc|%|°C|CHF|EUR)\b'
    r'|\bCBD\b|\bTHC\b|\bCBG\b|\bSEPA\b|\bIBAN\b|\bBitcoin\b)'
)


def protect(text: str) -> str:
    return PROTECT.sub(lambda m: f'<span translate="no">{m.group(0)}</span>', text)


def unprotect(text: str) -> str:
    return re.sub(r'<span translate="no">(.*?)</span>', r'\1', text, flags=re.S)


def digits(text: str) -> list[str]:
    """Every number in the text, for the post-translation integrity check."""
    return re.findall(r'\d+(?:[.,]\d+)?', unprotect(text))


def split_frontmatter(raw: str) -> tuple[str, str]:
    if not raw.startswith('---'):
        return '', raw
    end = raw.index('---', 3)
    return raw[: end + 3], raw[end + 3 :]


def deepl(texts: list[str], target: str, key: str, pro: bool) -> list[str]:
    data = [('auth_key', key), ('target_lang', DEEPL_TARGET.get(target, target.upper())),
            ('tag_handling', 'html'), ('preserve_formatting', '1'),
            ('split_sentences', 'nonewlines')]
    data += [('text', t) for t in texts]
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(DEEPL_PRO_URL if pro else DEEPL_URL, data=body)
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return [t['text'] for t in json.load(r)['translations']]
        except urllib.error.HTTPError as e:
            if e.code in (429, 456, 500, 503) and attempt < 4:
                time.sleep(2 ** attempt * 3)
                continue
            raise
    raise RuntimeError('DeepL retries exhausted')


def translate_file(path: str, out_path: str, target: str, key: str, pro: bool) -> str:
    raw = open(path, encoding='utf-8').read()
    fm, body = split_frontmatter(raw)

    title = re.search(r'^title: "(.*)"$', fm, re.M)
    desc = re.search(r'^description: "(.*)"$', fm, re.M)
    pieces = [protect(title.group(1)) if title else '',
              protect(desc.group(1)) if desc else '',
              protect(body)]

    out = deepl([p for p in pieces if p], target, key, pro)
    it = iter(out)
    new_title = unprotect(next(it)) if pieces[0] else None
    new_desc = unprotect(next(it)) if pieces[1] else None
    new_body = unprotect(next(it))

    if digits(body) != digits(new_body):
        return 'number-drift'

    if new_title:
        fm = re.sub(r'^title: ".*"$', 'title: "' + new_title.replace('"', '\\"') + '"', fm, count=1, flags=re.M)
    if new_desc:
        fm = re.sub(r'^description: ".*"$', 'description: "' + new_desc.replace('"', '\\"') + '"', fm, count=1, flags=re.M)
    # mark it, so the site can label it and a reviewer can find it
    fm = fm.rstrip('-\n ') + '\nmachineTranslated: true\n---'

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(fm + new_body)
    return 'ok'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--lang', choices=TARGETS)
    ap.add_argument('--collection', choices=COLLECTIONS)
    ap.add_argument('--limit', type=int)
    ap.add_argument('--estimate', action='store_true')
    ap.add_argument('--pro', action='store_true', help='use the paid DeepL endpoint')
    args = ap.parse_args()

    if args.estimate:
        total = 0
        for c in COLLECTIONS:
            d = os.path.join(CONTENT, c)
            n = chars = 0
            for f in os.listdir(d):
                chars += len(open(os.path.join(d, f), encoding='utf-8').read())
                n += 1
            print(f'  {c:9s} {n:5d} files  {chars:10,} characters')
            total += chars
        print(f'\n  per language : {total:12,} characters')
        print(f'  x{len(TARGETS)} languages: {total*len(TARGETS):12,} characters')
        print(f'  DeepL at €{PRICE_PER_MILLION_EUR:.0f}/M: '
              f'≈ €{total*len(TARGETS)/1_000_000*PRICE_PER_MILLION_EUR:,.0f} one-off')
        print('\n  Run per language to spread the cost; the run is resumable.')
        return

    key = os.environ.get('DEEPL_API_KEY')
    if not key:
        sys.exit('DEEPL_API_KEY is not set. Run with --estimate to price it first.')
    if not args.lang:
        sys.exit('--lang is required (or use --estimate)')

    done = skipped = failed = 0
    for c in COLLECTIONS:
        if args.collection and c != args.collection:
            continue
        src = os.path.join(CONTENT, c)
        dst = os.path.join(CONTENT, f'{c}-{args.lang}')
        for f in sorted(os.listdir(src)):
            if args.limit and done >= args.limit:
                break
            out = os.path.join(dst, f)
            if os.path.exists(out):
                skipped += 1
                continue
            status = translate_file(os.path.join(src, f), out, args.lang, key, args.pro)
            if status == 'ok':
                done += 1
            else:
                failed += 1
                print(f'  [{status}] {c}/{f}')
            if done % 25 == 0 and done:
                print(f'  {args.lang}: {done} translated…', flush=True)

    print(f'\n  {args.lang}: {done} translated, {skipped} already present, {failed} rejected')
    if failed:
        print('  Rejected files had numbers that changed in translation and were not written.')


if __name__ == '__main__':
    main()
