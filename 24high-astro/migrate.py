import os
import re
from bs4 import BeautifulSoup

# Supported languages and their source directories
LANGUAGES = ['nl', 'fr', 'de', 'es', 'it']  # 'en' already done

SITE_MIRROR_ROOT = '../www.24high.com'

# Source dirs per language
LANG_DIRS = {
    'en': f'{SITE_MIRROR_ROOT}/en',
}
# For all other languages, the site is language-specific and NOT downloaded yet.
# When you have the mirrors, add them here like:
# 'nl': '../www.24high.nl/nl',  etc.

CONTENT_TYPES = ['blog', 'article']

def sanitize_slug(name):
    name = re.sub(r'\.html$', '', name)
    name = re.sub(r'[^a-zA-Z0-9]+', '-', name)
    return name.strip('-').lower()

def migrate_dir(src_dir, dest_dir, content_type, lang):
    if not os.path.exists(src_dir):
        print(f"  [SKIP] {src_dir} does not exist")
        return 0

    os.makedirs(dest_dir, exist_ok=True)
    count = 0

    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if not file.endswith('.html'):
                continue

            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    html_content = f.read()
            except Exception as e:
                print(f"  [ERROR] reading {filepath}: {e}")
                continue

            soup = BeautifulSoup(html_content, 'html.parser')

            title_tag = soup.find('title')
            title = title_tag.text.strip() if title_tag else file
            title = title.replace('"', '\\"').replace('\n', ' ')

            meta_desc = soup.find('meta', attrs={'name': 'description'})
            description = ''
            if meta_desc and 'content' in meta_desc.attrs:
                description = meta_desc['content'].strip().replace('"', '\\"').replace('\n', ' ')

            content_wrapper = soup.find('div', class_='contentwrapper')
            if content_wrapper:
                main_html = str(content_wrapper)
            elif soup.body:
                main_html = str(soup.body)
            else:
                main_html = html_content

            slug = sanitize_slug(file)
            if not slug:
                continue

            md_filename = f"{slug}.md"
            md_filepath = os.path.join(dest_dir, md_filename)

            # Avoid collisions
            counter = 1
            while os.path.exists(md_filepath):
                md_filename = f"{slug}-{counter}.md"
                md_filepath = os.path.join(dest_dir, md_filename)
                counter += 1

            frontmatter = f'---\ntitle: "{title}"\ndescription: "{description}"\nlang: "{lang}"\n---\n'

            with open(md_filepath, 'w', encoding='utf-8') as md_f:
                md_f.write(frontmatter + main_html)

            count += 1

    return count

if __name__ == '__main__':
    for lang, lang_dir in LANG_DIRS.items():
        print(f"\n=== Migrating language: {lang} ===")
        for content_type in CONTENT_TYPES:
            src = f"{lang_dir}/{content_type}"
            dest = f"src/content/{content_type}-{lang}"
            n = migrate_dir(src, dest, content_type, lang)
            print(f"  {content_type}: {n} files -> {dest}")

    print("\nMigration complete!")
    print("\nTo add other languages, download their site mirrors and add them to LANG_DIRS above.")
    print("Example:")
    for other_lang in LANGUAGES:
        print(f"  '{other_lang}': '../www.24high.{other_lang}/{other_lang}',")
