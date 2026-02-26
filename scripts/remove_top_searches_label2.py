import glob
import re

for path in glob.glob('c:/campberry_proj/**/campberry_full_L*.html', recursive=True):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to remove the specific pill that contains the words "Top Searches".
    # Since it's surrounded by <div class="top-search-pill"...> and </div>,
    # we can use a non-greedy regex that finds a div containing "Top Searches".
    
    # Matches <div class="top-search-pill" ...> ... Top Searches ... </div>
    # Using non-greedy .*?
    
    # To prevent it from matching from a PREVIOUS pill to this pill, we make sure there are no other <divs> in between.
    
    new_content = re.sub(
        r'<div class="top-search-pill"(?:(?!\s*<div).)*?Top Searches(?:(?!\s*<div).)*?</div>\s*',
        '',
        content,
        flags=re.IGNORECASE | re.DOTALL
    )

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {path}')
