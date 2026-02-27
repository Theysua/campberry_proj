import os
import re

with open('c:/campberry_proj/prototypes/campberry_full_L1.html', 'r', encoding='utf-8') as f:
    l1 = f.read()

# Helper to rename L1 to LX
def make_l(l_num, title, body_modifier=None, css_modifier=None):
    res = l1
    res = res.replace('L1', f'L{l_num}')
    res = res.replace('Grid & Centered', title)
    
    if css_modifier:
        res = re.sub(r'(</style>)', css_modifier + r'\1', res)
        
    if body_modifier:
        res = body_modifier(res)
        
    # We also remove the extra page-search we added earlier, leaving only page-home
    # Actually wait, L1 itself has a page-search and page-home!
    # Let me check L1. It has page-home and page-search.
    # We should merge page-search into page-home, or just keep them?
    # L1 currently shows Hero on page-home, and search results on page-search? No! L1's page-home has everything!
    # Wait, earlier I viewed L1 and it had a page-home AND a page-search!
    # Let's check!
    
    with open(f'c:/campberry_proj/prototypes/campberry_full_L{l_num}.html', 'w', encoding='utf-8') as f2:
        f2.write(res)
    print(f"Generated L{l_num}")

# L2: Right Sidebar
def body_mod_l2(content):
    # Change flex direction to row-reverse for the main layout container.
    # The container in L1 is: <div style="display: flex; gap: 30px; align-items: flex-start;">
    content = content.replace(
        '<div style="display: flex; gap: 30px; align-items: flex-start;">',
        '<div style="display: flex; gap: 40px; align-items: flex-start; flex-direction: row-reverse; max-width: 1200px; margin: 0 auto; padding: 20px;">'
    )
    # Give the search wrapper some inline hero treatment
    content = content.replace('<div class="hero">', '<div class="hero" style="background:var(--surface); border:1px solid #e2e8f0; border-radius:12px; margin:20px; text-align:left; display:flex; justify-content:space-between; align-items:center; padding:40px;">')
    return content

# L3: Horizontal Top Filters
def body_mod_l3(content):
    # Change flex direction to column so filters are on top
    content = content.replace(
        '<div style="display: flex; gap: 30px; align-items: flex-start;">',
        '<div style="display: flex; flex-direction: column; gap: 30px; align-items: stretch; max-width: 1200px; margin: 0 auto;">'
    )
    # modify filter panel to be horizontal
    content = content.replace(
        '<div class="filter-panel">',
        '<div class="filter-panel" style="width: 100%; position: sticky; top: 0; z-index: 50; display:flex; flex-direction:row; flex-wrap:wrap; align-items:center; gap:15px; background:white; padding:15px; border-bottom:1px solid #e2e8f0;">'
    )
    # Make hero solid primary dark
    content = content.replace('<div class="hero">', '<div class="hero" style="background:var(--primary); color:white; padding:40px 20px;">')
    return content

# L4: Dense grid
def body_mod_l4(content):
    # Update grid to 3 columns (vs L1's grid which gets defined as a generic one or flex)
    content = content.replace('class="l1-grid"', 'class="l1-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px;"')
    # Dark hero
    content = content.replace('<div class="hero">', '<div class="hero" style="background:#0f172a; color:#f8fafc; text-align:center;">')
    return content

# L5: Floating SaaS UI
def body_mod_l5(content):
    # Make cards wide instead of grid
    content = content.replace('class="l1-grid"', 'class="l1-grid" style="display:flex; flex-direction:column; gap:20px;"')
    content = content.replace('class="card program-card"', 'class="card program-card res-wide" style="display:flex; flex-direction:row; align-items:center; padding:20px 30px; border-left:4px solid var(--accent);"')
    content = content.replace('<div class="hero">', '<div class="hero" style="background:transparent; border-bottom:none; margin-bottom:0;">')
    return content

# L6: Dashboard split
def body_mod_l6(content):
    # Emulate dashboard by adding a sidebar before the header
    dash_header = '''
    <div style="display:flex; height:100vh; overflow:hidden;">
        <div style="width:250px; background:var(--primary); color:white; padding:20px; display:flex; flex-direction:column; gap:10px;">
            <h2 style="margin-top:0;">Campberry</h2>
            <div style="padding:10px; background:rgba(255,255,255,0.1); border-radius:6px; font-weight:bold;">🔍 Find Programs</div>
            <div style="padding:10px; opacity:0.8;">📁 My Lists</div>
            <div style="padding:10px; opacity:0.8;">⚙️ Settings</div>
        </div>
        <div style="flex:1; overflow-y:auto; position:relative; background:#f8fafc;">
    '''
    content = content.replace('<body>', '<body>\n' + dash_header)
    content = content.replace('</body>', '</div></div>\n</body>')
    return content

make_l(2, 'Left Aligned', body_mod_l2)
make_l(3, 'Integrated Full Width', body_mod_l3)
make_l(4, 'Hero Tabs', body_mod_l4)
make_l(5, 'Minimalist SaaS', body_mod_l5)
make_l(6, 'Dashboard', body_mod_l6)
