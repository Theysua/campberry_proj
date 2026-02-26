import glob
import re

new_pills = '''<div class="top-searches">
                <div class="top-search-pill">🍓 Summer</div>
                <div class="top-search-pill">🔬 STEM</div>
                <div class="top-search-pill">💼 Business</div>
                <div class="top-search-pill">💻 Coding</div>
                <div class="top-search-pill">✍️ Writing</div>
                <div class="top-search-pill">🎨 Arts</div>
                <div class="top-search-pill">🎁 Free</div>
                <div class="top-search-pill">🔍 Research</div>
                <div class="top-search-pill">⚽ Sports</div>
                <div class="top-search-pill">🎵 Music</div>
                <div class="top-search-pill">🌏 Hong Kong</div>
            </div>'''

for path in glob.glob('c:/campberry_proj/**/campberry_full_L*.html', recursive=True):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the entire top-searches block and replace it
    pattern = r'<div class="top-searches">.*?</div>\s*' # need dotall if it spans multiple lines without nesting
    
    # We can use a more precise regex or simple string replacement if we know the closing div is the first </div> after the pills
    # But since there are divs inside, we need to match carefully.
    
    # The pills themselves don't have nested divs.
    pattern = r'<div class="top-searches">\s*(?:<div class="top-search-pill"[^>]*>.*?</div>\s*)*</div>'
    
    content = re.sub(pattern, new_pills, content, flags=re.DOTALL)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f'Updated {path}')
