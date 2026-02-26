import glob
import re

for path in glob.glob('c:/campberry_proj/prototypes/campberry_full_L*.html'):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find and remove the Top Searches title pill
    pattern = r'<div class="top-search-pill" style="border: none; background: transparent; box-shadow: none; font-size: 16px; padding: 0;">✨ <strong>Top Searches</strong></div>\s*'
    content = re.sub(pattern, '', content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Updated {path}')
