import os, glob

def main():
    with open(r'c:\campberry_proj\campberry_full_L1.html', 'r', encoding='utf-8') as f:
        source_html = f.read()

    # Extract CSS
    start_css = source_html.find('/* Search Page Custom Styles */')
    end_css = source_html.find('</style>')
    if start_css == -1 or end_css == -1:
        print("Error: Could not find CSS block")
        return
    css_block = source_html[start_css:end_css]

    # Extract #page-search
    start_search = source_html.find('<div class="page" id="page-search">')
    end_search = source_html.find('<!-- PAGE: PROGRAM DETAIL -->')
    if start_search == -1 or end_search == -1:
        print("Error: Could not find page-search block")
        return
    search_block = source_html[start_search:end_search]

    for filepath in glob.glob(r'C:\campberry_proj\prototypes\campberry_full_L*.html'):
        with open(filepath, 'r', encoding='utf-8') as f:
            target = f.read()

        # Check CSS
        old_css_start = target.find('/* Search Page Custom Styles */')
        if old_css_start != -1:
            old_css_end = target.find('</style>', old_css_start)
            target = target[:old_css_start] + css_block + target[old_css_end:]
        else:
            style_end = target.find('</style>')
            if style_end != -1:
                target = target[:style_end] + '\n' + css_block + '\n' + target[style_end:]

        # Check page-search
        old_search_start = target.find('<div class="page" id="page-search">')
        if old_search_start != -1:
            old_search_end = target.find('<!-- PAGE:', old_search_start)
            if old_search_end == -1:
                old_search_end = target.find('<div class="page" id="page-program">', old_search_start)
            if old_search_end != -1:
                target = target[:old_search_start] + search_block + target[old_search_end:]
        else:
            pg_prog_start = target.find('<div class="page" id="page-program">')
            if pg_prog_start != -1:
                target = target[:pg_prog_start] + search_block + target[pg_prog_start:]

        # Fix nav
        target = target.replace('onclick="showPage(\'home\')">Find</button>', 'onclick="showPage(\'search\')">Find</button>')
        target = target.replace('onclick="showPage(\'home\')">🔍 Find Programs</button>', 'onclick="showPage(\'search\')">🔍 Find Programs</button>')
        
        tab_nav_start = target.find('<div class="tab-nav">')
        if tab_nav_start != -1:
            tab_nav_end = target.find('</div>', tab_nav_start)
            new_tab_nav = '<div class="tab-nav"><button class="tab-btn active" onclick="showPage(\'home\')\">1. Home</button><button class="tab-btn" onclick="showPage(\'search\')\">2. Find</button><button class="tab-btn" onclick="showPage(\'program\')\">3. Detail</button><button class="tab-btn" onclick="showPage(\'lists\')\">4. All Lists</button><button class="tab-btn" onclick="showPage(\'mylistdetail\')\">5. Target List</button><button class="tab-btn" onclick="showPage(\'auth\')\">6. Auth</button>'
            target = target[:tab_nav_start] + new_tab_nav + target[tab_nav_end:]

        # Ensure that page showing works
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(target)
        print(f"Updated {filepath}")

if __name__ == '__main__':
    main()
