import re
with open('../www.24high.com/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract from <html> to the start of the contentwrapper
header_split = html.split('<div class="contentwrapper">')
if len(header_split) > 1:
    header = header_split[0] + '<div class="contentwrapper">'
    
    # Extract footer
    # The actual footer might be the last few divs or footer tags.
    footer_match = re.search(r'<div class="footer.*?</div>\s*</body>\s*</html>', html, re.DOTALL)
    if footer_match:
        footer = footer_match.group(0)
    else:
        # Fallback: take everything after the last </div>
        footer = '</div></body></html>'
        footer_start = html.rfind('<div class="footer')
        if footer_start != -1:
             footer = html[footer_start:]
    
    # replace title with Astro prop
    header = re.sub(r'<title>.*?</title>', '<title>{title}</title>', header)
    
    astro_layout = f"""---
const {{ title }} = Astro.props;
---
{header}
<slot />
{footer}
"""
    with open('src/layouts/Layout.astro', 'w', encoding='utf-8') as f2:
        f2.write(astro_layout)
    print('Layout generated successfully')
else:
    print('Could not find contentwrapper')
