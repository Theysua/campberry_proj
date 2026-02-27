import re

with open('c:/campberry_proj/prototypes/campberry_full_L1.html', 'r', encoding='utf-8') as f:
    l1 = f.read()

# CSS
css_start = l1.find('/* Search Page Custom Styles */')
css_end = l1.find('</style>')
if css_start == -1: css_start = l1.find('</style>')
css = l1[css_start:css_end]

# Filter panel
f_start = l1.find('<!-- Left Sidebar Filters -->')
f_end = l1.find('<!-- Right Results Section -->')
filter_panel = l1[f_start:f_end]

# Results
r_start = l1.find('<!-- Right Results Section -->')
r_end = l1.find('<!-- PAGE: PROGRAM DETAIL -->')
l1_bottom = l1[r_start:r_end]

# We also need the top-searches and hero part
h_start = l1.find('<div class="hero">')
h_end = l1.find('<!-- 3. Hot Programs (Featured Lists) -->')
hero = l1[h_start:h_end]

hot_start = h_end
hot_end = l1.find('<!-- 4. Campberry ratings -->')
hot_programs = l1[hot_start:hot_end]

ratings_start = hot_end
ratings_end = l1.find('<!-- PAGE: SEARCH -->')
ratings = l1[ratings_start:ratings_end]

# For each layout, we create a new page active that puts these pieces differently.
def gen(L_num, layout_wrapper, content_arrangement):
    html = []
    # Base structure from generate_6_prototypes...
    pass

with open('c:/campberry_proj/scripts/snippets.py', 'w', encoding='utf-8') as f:
    f.write(f'css = """{css}"""\n')
    f.write(f'filter_panel = """{filter_panel}"""\n')
    f.write(f'results = """{l1_bottom}"""\n')

print("Snippets extracted")
