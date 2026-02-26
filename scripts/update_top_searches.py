import glob, re

css = '''
.top-searches { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 15px; max-width: 600px; margin-left: auto; margin-right: auto; }
.top-search-pill { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 6px 14px; font-size: 13px; font-weight: 600; color: var(--primary); display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s; }
.top-search-pill:hover { transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-color: #cbd5e1; }
'''

html_snippet = '''<div class="top-searches">
    <div class="top-search-pill" style="border: none; background: transparent; box-shadow: none; font-size: 16px; padding: 0;">✨ <strong>Top Searches</strong></div>
    <div class="top-search-pill">☀️ Summer</div>
    <div class="top-search-pill">🔬 STEM</div>
    <div class="top-search-pill">💼 Business</div>
    <div class="top-search-pill">📚 Humanities</div>
    <div class="top-search-pill">🧪 Research</div>
    <div class="top-search-pill">🌏 Hong Kong</div>
</div>'''

def main():
    for path in glob.glob('c:/campberry_proj/prototypes/campberry_full_L*.html'):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update CSS
        if '.top-searches {' not in content:
            if '/* Search Page Custom Styles */' in content:
                content = content.replace('/* Search Page Custom Styles */', css + '\n/* Search Page Custom Styles */')
            else:
                content = content.replace('</style>', css + '\n</style>')
        else:
            content = re.sub(r'\.top-searches \{.*?\}', '.top-searches { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 15px; max-width: 600px; margin-left: auto; margin-right: auto; }', content, flags=re.DOTALL)

        # L2
        if 'campberry_full_L2.html' in path:
            if 'class="top-searches"' not in content:
                content = content.replace('</div>\n    </div>\n    \n    <div class="l2-layout">', '</div>\n    </div>\n    ' + html_snippet + '\n    <div class="l2-layout">')
        # L3
        elif 'campberry_full_L3.html' in path:
            if 'class="top-searches"' not in content:
                content = content.replace('★ Reviews and rankings by experts.</div>\n    </div>', '★ Reviews and rankings by experts.</div>\n        ' + html_snippet + '\n    </div>')
        # L4
        elif 'campberry_full_L4.html' in path:
            if '✨ <strong>Top Searches' not in content:
                content = re.sub(r'<div class="top-searches">.*?</div>\n    </div>', html_snippet + '\n    </div>', content, flags=re.DOTALL)
        # L5
        elif 'campberry_full_L5.html' in path:
            if 'class="top-searches"' not in content:
                content = content.replace('<button>Search</button></div>', '<button>Search</button></div>\n        ' + html_snippet)
        # L6
        elif 'campberry_full_L6.html' in path:
            if 'class="top-searches"' not in content:
                content = content.replace('★ Reviews and rankings by experts.</div>\n            </div>', '★ Reviews and rankings by experts.</div>\n            </div>\n            ' + html_snippet)

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated', path)

if __name__ == '__main__':
    main()
