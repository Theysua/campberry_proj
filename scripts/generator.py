import os

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campberry Wireframes</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f0f0; color: #333; }
        
        .tab-nav { position: sticky; top: 0; z-index: 100; background: #2c3e50; display: flex; overflow-x: auto; padding: 10px; gap: 10px; }
        .tab-btn { padding: 10px 15px; background: #34495e; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .tab-btn.active { background: #3498db; }
        
        .page { display: none; padding: 20px; }
        .page.active { display: block; }
        
        .frame { background: #fff; border: 1px solid #ccc; border-radius: 8px; max-width: 1200px; margin: 0 auto 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .frame-header { background: #ecf0f1; padding: 10px 20px; font-weight: bold; border-bottom: 1px solid #ccc; border-radius: 8px 8px 0 0; }
        
        .wf-content { padding: 20px; }
        
        /* Version Layouts */
        .version-container { display: grid; gap: 20px; margin-bottom: 40px; }
        
        /* Components */
        .search-area { padding: 40px 20px; text-align: center; }
        .search-title { font-size: 36px; font-weight: 800; margin-bottom: 10px; }
        .search-subtitle { font-size: 18px; margin-bottom: 20px; }
        .search-box { display: flex; max-width: 600px; margin: 0 auto; background: white; border-radius: 30px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .search-input { flex: 1; padding: 15px 20px; border: none; outline: none; font-size: 16px; }
        .search-button { padding: 15px 30px; border: none; color: white; font-weight: bold; cursor: pointer; }
        
        .trust-badges { display: flex; justify-content: center; gap: 20px; margin-top: 20px; font-size: 14px; }
        
        .layout-grid { display: grid; gap: 20px; }
        .filters { padding: 20px; border-radius: 8px; }
        .results { display: flex; flex-direction: column; gap: 15px; }
        
        .program-card { padding: 20px; border-radius: 8px; display: flex; gap: 15px; background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .card-img { width: 80px; height: 80px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .card-content { flex: 1; }
        
        .hot-programs { margin-top: 40px; }
        .hot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-top: 15px; }
        .hot-card { padding: 20px; border-radius: 8px; height: 120px; display: flex; flex-direction: column; justify-content: space-between; }
        
        /* Color Schemes base variables to be inherited/overridden */
        .v1 .layout-grid { grid-template-columns: 250px 1fr; } /* Side filters */
        .v1 .search-area { flex-direction: column; }
        
        .v2 .layout-grid { grid-template-columns: 1fr; } /* Top filters */
        .v2 .filters { display: flex; gap: 10px; flex-wrap: wrap; }
        
        .v3 .layout-grid { grid-template-columns: 300px 1fr; } /* Sticky left filters, more cards */
        
        /* Apply Colors Mixin simulation via inline HTML classes */
    </style>
    <script>
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('page-' + pageId).classList.add('active');
            event.currentTarget.classList.add('active');
        }
    </script>
</head>
<body>

    <div class="tab-nav">
        <button class="tab-btn active" onclick="showPage('v1')">Version 1: Traditional Split</button>
        <button class="tab-btn" onclick="showPage('v2')">Version 2: Top Filter Modern</button>
        <button class="tab-btn" onclick="showPage('v3')">Version 3: Focus Cards</button>
    </div>

    <!-- Generating HTML structure for each version and color scheme -->
"""

versions = [
    {"id": "v1", "name": "Layout 1: Traditional Split (Side Filters)"},
    {"id": "v2", "name": "Layout 2: Top Filter Modern (Filters above results)"},
    {"id": "v3", "name": "Layout 3: Focus Cards (Detailed vertical results)"}
]

color_schemes = [
    {
        "name": "Scheme 1: Midnight & Ruby (Current, High Contrast)",
        "bg_main": "#f8fafc", "primary": "#011936", "accent": "#892233", "surface": "#ffffff", "text": "#333333",
        "search_bg": "#edf2f7", "card_border": "1px solid #e2e8f0"
    },
    {
        "name": "Scheme 2: Academic Slate & Sage (Less green, calm)",
        "bg_main": "#f4f5f5", "primary": "#2d3748", "accent": "#718096", "surface": "#ffffff", "text": "#2d3748",
        "search_bg": "#e2e8f0", "card_border": "1px solid #cbd5e0"
    },
    {
        "name": "Scheme 3: Crisp Blue & White (Clean, Trustworthy)",
        "bg_main": "#f0f4f8", "primary": "#1A365D", "accent": "#2B6CB0", "surface": "#ffffff", "text": "#2C5282",
        "search_bg": "#eBF8FF", "card_border": "1px solid #bee3f8"
    },
    {
        "name": "Scheme 4: Warm Ivory & Charcoal (Premium, elegant)",
        "bg_main": "#faf9f6", "primary": "#333333", "accent": "#d4af37", "surface": "#ffffff", "text": "#4a4a4a",
        "search_bg": "#f0ede6", "card_border": "1px solid #e8e5df"
    },
    {
        "name": "Scheme 5: Subdued Lavender & Navy (Modern, youthful)",
        "bg_main": "#f5f3f7", "primary": "#1e1b4b", "accent": "#6d28d9", "surface": "#ffffff", "text": "#312e81",
        "search_bg": "#ede9fe", "card_border": "1px solid #ddd6fe"
    }
]

def generate_layout(v, c):
    layout_class = v['id']
    html = f"""
    <div class="wf-content {layout_class}" style="background: {c['bg_main']}; color: {c['text']}; margin-bottom: 50px; border-radius: 8px; overflow: hidden; border: 2px solid {c['primary']};">
        <div style="background:{c['primary']}; color:white; padding: 10px; font-weight:bold;">{c['name']}</div>
        
        <!-- Search Area -->
        <div class="search-area" style="background: {c['search_bg']};">
            <div class="search-title" style="color: {c['primary']};">Find Your Dream Program</div>
            <div class="search-subtitle">Discover extracurriculars that matter</div>
            
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Search over 1000 opportunities...">
                <button class="search-button" style="background: {c['accent']};">Search</button>
            </div>
            
            <div class="trust-badges">
                <span style="color: {c['primary']}">★ Reviews and rankings by experts and parents.</span>
            </div>
        </div>
        
        <div style="padding: 20px;">
    """
    
    if layout_class == 'v2':
        html += f"""
        <!-- Top Filters -->
        <div class="filters" style="background: {c['surface']}; border: {c['card_border']}; margin-bottom: 20px;">
            <strong>Filters:</strong>
            <span style="padding: 5px 15px; border-radius: 15px; border: 1px solid {c['accent']}; font-size: 14px;">Grade ▼</span>
            <span style="padding: 5px 15px; border-radius: 15px; border: 1px solid {c['accent']}; font-size: 14px;">Season ▼</span>
            <span style="padding: 5px 15px; border-radius: 15px; border: 1px solid {c['accent']}; font-size: 14px;">Subject ▼</span>
            <span style="padding: 5px 15px; border-radius: 15px; border: 1px solid {c['accent']}; font-size: 14px; background:{c['accent']}; color:white;">Apply</span>
        </div>
        <div class="results">
        """
    else:
        html += f"""
        <div class="layout-grid">
            <!-- Sidebar Filters -->
            <div class="filters" style="background: {c['surface']}; border: {c['card_border']};">
                <h3 style="color: {c['primary']}; margin-bottom: 15px;">Filters</h3>
                <div style="margin-bottom: 10px; font-size: 14px;"><strong>Grade</strong><br><input type="checkbox"> 9th <input type="checkbox"> 10th</div>
                <div style="margin-bottom: 10px; font-size: 14px;"><strong>Season</strong><br><input type="checkbox"> Summer <input type="checkbox"> Fall</div>
                <button style="width:100%; padding: 8px; background:{c['accent']}; color:white; border:none; border-radius:4px;">Apply Filters</button>
            </div>
            <div class="results">
        """

    # Result Cards
    for i in range(2):
        html += f"""
                <div class="program-card" style="background: {c['surface']}; border: {c['card_border']};">
                    <div class="card-img" style="background: {c['search_bg']}; color: {c['primary']};">Logo</div>
                    <div class="card-content">
                        <h3 style="color: {c['primary']};">Sample Program {i+1}</h3>
                        <p style="font-size: 14px; color: {c['text']}; opacity: 0.8; margin-bottom: 10px;">University Name</p>
                        <span style="background: {c['search_bg']}; color: {c['primary']}; padding: 3px 8px; border-radius: 4px; font-size: 12px;">STEM</span>
                    </div>
                </div>
        """
        
    html += """
            </div>
        </div>
        """
        
    # Hot Programs
    html += f"""
        <!-- Hot Programs -->
        <div class="hot-programs">
            <h2 style="color: {c['primary']}; border-bottom: 2px solid {c['accent']}; padding-bottom: 5px;">Hot Programs</h2>
            <div class="hot-grid">
                <div class="hot-card" style="background: {c['surface']}; border: {c['card_border']}; border-top: 4px solid {c['accent']};">
                    <h4 style="color: {c['primary']};">Counselors' Top Picks</h4>
                    <p style="font-size: 12px; color: {c['text']};">Featured List</p>
                </div>
                <div class="hot-card" style="background: {c['surface']}; border: {c['card_border']}; border-top: 4px solid {c['primary']};">
                    <h4 style="color: {c['primary']};">Best for STEM</h4>
                    <p style="font-size: 12px; color: {c['text']};">Featured List</p>
                </div>
                <div class="hot-card" style="background: {c['surface']}; border: {c['card_border']}; border-top: 4px solid {c['accent']};">
                    <h4 style="color: {c['primary']};">High Impact Research</h4>
                    <p style="font-size: 12px; color: {c['text']};">Featured List</p>
                </div>
            </div>
        </div>
        
        </div> <!-- End padding -->
    </div> <!-- End container -->
    """
    return html

for i, v in enumerate(versions):
    active = "active" if i == 0 else ""
    html_template += f'<div class="page {active}" id="page-{v["id"]}">'
    html_template += f'<div class="frame"><div class="frame-header">{v["name"]}</div>'
    for c in color_schemes:
        html_template += generate_layout(v, c)
    html_template += '</div></div>'

html_template += """
</body>
</html>
"""

with open(r'C:\campberry_proj\wireframe_proposals.html', 'w', encoding='utf-8') as f:
    f.write(html_template)
print("Wireframes generated.")
