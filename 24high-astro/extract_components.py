"""
This script:
1. Parses the Layout.astro to extract the CSS into public/css/site.css
2. Extracts the header HTML block -> src/components/Header.astro
3. Extracts the nav HTML block -> src/components/Nav.astro
4. Extracts the footer HTML block -> src/components/Footer.astro
5. Writes a clean new Layout.astro that composes all components
"""
import re

with open('src/layouts/Layout.astro', 'r', encoding='utf-8') as f:
    content = f.read()

# --- 1. Extract <style> block (the huge CSS) ---
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
global_css = style_match.group(1) if style_match else ''

# Write to a public CSS file
with open('public/css/site.css', 'w', encoding='utf-8') as f:
    f.write(global_css)
print(f"Extracted CSS: {len(global_css)} chars -> public/css/site.css")

# --- 2. Extract Header block ---
# The header is wrapped in <div class="header-container"> 
header_match = re.search(
    r'(<div class="header-container">.*?</div>\s*<!--\s*end header|<div class="header-container">.*?</div>(?=\s*<div[^>]*menu))',
    content, re.DOTALL
)

# More targeted: find header-container through to the menu div
header_start = content.find('<div class="header-container">')
nav_start = content.find('<div class="menu"')
if nav_start == -1:
    nav_start = content.find('<nav ')

header_html = content[header_start:nav_start].strip() if header_start != -1 and nav_start != -1 else ''

# --- 3. Extract Nav block ---
# Nav is the sticky menu bar
nav_end_markers = ['<div class="searchbar"', '<div class="container"', '<div class="contentwrapper"']
nav_end = len(content)
for marker in nav_end_markers:
    pos = content.find(marker, nav_start)
    if pos != -1 and pos < nav_end:
        nav_end = pos

nav_html = content[nav_start:nav_end].strip() if nav_start != -1 else ''

# --- 4. Extract Footer block ---
# Footer is after the <slot /> equivalent (the contentwrapper close)
# In the layout, after <slot /> is the footer HTML
slot_marker = '<slot />'
content_after_slot_split = content.split('<slot />')
footer_html = ''
if len(content_after_slot_split) > 1:
    after_slot = content_after_slot_split[1]
    # Remove </body></html> from the end
    footer_html = after_slot.rsplit('</body>', 1)[0].strip()

# --- 5. Extract <head> scripts (GTM etc.) ---
head_start = content.find('<head>')
style_start = content.find('<style>')
head_scripts = content[head_start + 6:style_start].strip() if head_start != -1 and style_start != -1 else ''

# --- Write Header.astro ---
header_astro = f"""---
const {{ lang = 'en' }} = Astro.props;
---
{header_html}
"""
with open('src/components/Header.astro', 'w', encoding='utf-8') as f:
    f.write(header_astro)
print("Written: src/components/Header.astro")

# --- Write Nav.astro ---
nav_astro = f"""---
const {{ lang = 'en' }} = Astro.props;
---
{nav_html}
"""
with open('src/components/Nav.astro', 'w', encoding='utf-8') as f:
    f.write(nav_astro)
print("Written: src/components/Nav.astro")

# --- Write Footer.astro ---
footer_astro = f"""---
// Footer component - shared across all pages and languages
---
{footer_html}
"""
with open('src/components/Footer.astro', 'w', encoding='utf-8') as f:
    f.write(footer_astro)
print("Written: src/components/Footer.astro")

# --- Write Meta.astro ---
meta_astro = """---
interface Props {
  title: string;
  description?: string;
  lang?: string;
  ogImage?: string;
  canonical?: string;
}

const {
  title,
  description = '24High is the smartshop for all your psychedelic needs.',
  lang = 'en',
  ogImage = 'https://www.24high.com/images/layout/logo.png',
  canonical = '',
} = Astro.props;
---
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content={description} />
<meta name="author" content="24High" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:type" content="website" />
{canonical && <link rel="canonical" href={canonical} />}
<link rel="alternate" hreflang="en" href="https://www.24high.com/en/" />
<link rel="alternate" hreflang="nl" href="https://www.24high.nl/" />
<link rel="alternate" hreflang="fr" href="https://www.24high.fr/" />
<link rel="alternate" hreflang="de" href="https://www.24high.de/" />
<link rel="alternate" hreflang="es" href="https://www.24high.es/" />
<link rel="alternate" hreflang="it" href="https://www.24high.it/" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="stylesheet" href="/css/site.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
<script defer src="https://kit.fontawesome.com/7f43e329c7.js" crossorigin="anonymous"></script>
"""
with open('src/components/Meta.astro', 'w', encoding='utf-8') as f:
    f.write(meta_astro)
print("Written: src/components/Meta.astro")

# --- Write clean new Layout.astro ---
new_layout = """---
import Meta from '../components/Meta.astro';
import Header from '../components/Header.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
  lang?: string;
  ogImage?: string;
  canonical?: string;
}

const { title, description, lang = 'en', ogImage, canonical } = Astro.props;
---
<!doctype html>
<html lang={lang}>
<head>
  <!-- Google Tag Manager -->
  <script is:inline>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MNRGJCH3');
  </script>
  <!-- End Google Tag Manager -->
  <Meta
    title={title}
    description={description}
    lang={lang}
    ogImage={ogImage}
    canonical={canonical}
  />
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MNRGJCH3" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <Header lang={lang} />
  <Nav lang={lang} />

  <div class="contentwrapper">
    <slot />
  </div>

  <Footer />
</body>
</html>
"""
with open('src/layouts/Layout.astro', 'w', encoding='utf-8') as f:
    f.write(new_layout)
print("Written: src/layouts/Layout.astro (clean, component-based)")

print("\nDone! Component extraction complete.")
