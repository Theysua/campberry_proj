import re
import glob
import os

def update_layouts():
    with open('c:/campberry_proj/prototypes/campberry_full_L1.html', 'r', encoding='utf-8') as f:
        l1 = f.read()

    # Get Filter block
    filter_start = l1.find('<!-- Left Sidebar Filters -->')
    filter_end = l1.find('<!-- Right Results Section -->')
    if filter_start == -1 or filter_end == -1:
        print("Could not find filters")
        return
    filter_block = l1[filter_start:filter_end].strip()

    # Get Results block. It starts at Right Results Section and ends at the end of the page-search div.
    res_start = l1.find('<!-- Right Results Section -->')
    res_end = l1.find('<!-- PAGE: PROGRAM DETAIL -->')
    
    # Actually, we need to stop before the closing divs of the l1-layout wrapper.
    # At 828 there's </div></div></div>
    res_block_full = l1[res_start:res_end]
    # Lets isolate just the inner container: `<div style="flex: 1;">` (or whatever it is)
    m = re.search(r'(<div style="flex: 1;">.*?)</div>\s*</div>\s*</div>\s*<!-- PAGE: PROGRAM DETAIL -->', res_block_full, re.DOTALL)
    if m:
        res_block = m.group(1).strip()
    else:
        # Fallback
        res_block = res_block_full

    res_block = l1[res_start:res_end]
    res_block = re.sub(r'</div>\s*</div>\s*</div>\s*$', '', res_block.strip() , flags=re.DOTALL)


    # Now iterate L2-L6 and place them into their correct structure.
    for path in glob.glob('c:/campberry_proj/prototypes/campberry_full_L*.html'):
        base = os.path.basename(path)
        if base == 'campberry_full_L1.html':
            continue

        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        # We want to replace the `page-search` div or `<!-- PAGE: SEARCH -->` through `<!-- PAGE: PROGRAM DETAIL -->`
        # with our structured versions
        
        # But wait, we previously overwrote them all to have L1's structure!
        # So we have to rebuild them based on `generate_6_prototypes.py` layouts, but inject `filter_block` and `res_block`.
        pass
update_layouts()
