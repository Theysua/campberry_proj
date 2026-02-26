import os

# Common elements and styles
common_colors = """
    --primary: #011936;
    --accent: #892233;
    --primary-dark: #780000;
    --mint: #ddfff7;
    --yellow: #fade41;
    --orange: #ff751f;
    --bg: #f8fafc;
    --surface: #ffffff;
    --text: #333333;
"""

base_css = """
* { box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; color: var(--text); background: var(--bg); }
.btn { padding: 10px 24px; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-block; font-size: 14px; }
.btn-outline { padding: 8px 20px; background: transparent; color: var(--primary); border: 2px solid var(--primary); border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; }
.card { background: var(--surface); border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
.tag { font-size: 11px; padding: 4px 10px; border-radius: 16px; background: #f1f5f9; color: var(--primary); font-weight: 600; margin-right: 6px; display: inline-block; }
.badge-most { font-size: 10px; padding: 4px 6px; border-radius: 4px; background: var(--accent); color: white; font-weight: bold; margin-right: 4px; display: inline-block; }
.badge-impact { font-size: 10px; padding: 4px 6px; border-radius: 4px; background: var(--primary); color: white; font-weight: bold; margin-right: 4px; display: inline-block; }
.page { display: none; }
.page.active { display: block; }
.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.tab-nav { background: var(--primary); padding: 10px 20px; overflow-x: auto; display: flex; gap: 10px; }
.tab-btn { background: rgba(255,255,255,0.1); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }
.tab-btn.active { background: var(--accent); }
"""

script_js = """
<script>
    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        let navs = document.querySelectorAll('.nav-links button, .side-item');
        if(navs) navs.forEach(b => b.classList.remove('active'));
        
        document.getElementById('page-' + pageId).classList.add('active');
        let devTab = document.querySelector(`.tab-btn[onclick="showPage('${pageId}')"]`);
        if(devTab) devTab.classList.add('active');
    }
</script>
"""

# Shared sub-pages for standard top-nav layouts (L1-L5)
def get_shared_pages(layout_num):
    container_cls = "container"
    if layout_num == 5:
        container_cls = "container" # using max-width 900px maybe
    
    # Program Detail
    program = f"""
    <div class="{container_cls}">
        <button class="btn-outline" style="margin-bottom: 20px;" onclick="showPage('home')">← Back to Search</button>
        <div class="card" style="margin-bottom: 24px; display: flex; gap: 30px; align-items: flex-start;">
            <div style="width: 120px; height: 120px; background: #f1f5f9; border-radius: 12px; border: 1px solid #e2e8f0;"></div>
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h1 style="margin: 0 0 8px 0; font-size: 28px; color: var(--primary);">Stanford Pre-Collegiate Summer Institutes</h1>
                        <div style="font-size: 18px; color: var(--accent); font-weight: 600; margin-bottom: 15px;">Stanford University</div>
                    </div>
                    <div style="display: flex; gap: 10px;"><button class="btn-outline">↗ Share</button><button class="btn">☆ Add to List</button></div>
                </div>
                <div style="margin-bottom: 15px;"><span class="badge-most">MOST RECOMMENDED</span><span class="badge-impact">HIGH IMPACT</span></div>
                <div><span class="tag">STEM</span><span class="tag">Summer</span></div>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
            <div>
                <div class="card" style="margin-bottom: 20px;">
                    <h3 style="margin-top: 0; color: var(--primary); border-bottom: 2px solid var(--accent); padding-bottom: 10px; display: inline-block;">About the Program</h3>
                    <p style="color: #475569; line-height: 1.6;">A residential summer program focusing on intensive academic exploration for highly motivated high school students...</p>
                </div>
                <div class="card" style="background: #fffbef; border-color: #fde68a;">
                    <h3 style="margin-top: 0; color: #92400e; display: flex; align-items: center; gap: 8px;">⭐ Expert Guidance</h3>
                    <p style="color: #b45309; font-size: 14px;">Highly competitive and proven to demonstrate deep interest and capability in rigorous academic environments to top-tier universities.</p>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div class="card" style="padding: 16px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">Dates & Deadlines</h4>
                    <div style="font-size: 13px; color: #475569; margin-bottom: 8px;"><strong>Starts:</strong> June 20, 2026</div>
                    <div style="font-size: 13px; color: #475569;"><strong>Apply by:</strong> Jan 15, 2026</div>
                </div>
            </div>
        </div>
    </div>
    """

    # Lists Browse
    lists = f"""
    <div class="{container_cls}">
        <h1 style="color: var(--primary); margin-bottom: 10px;">Your Workspace</h1>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0;">My Lists</h2><button class="btn">＋ Create New List</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 50px;">
            <div class="card" style="cursor: pointer;" onclick="showPage('mylistdetail')">
                <h3 style="margin: 0 0 8px 0; color: var(--primary);">Summer 2026 Targets</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #e2e8f0; margin-top: 15px;">
                    <span style="font-size: 13px; font-weight: 600;">4 Programs</span><span class="badge-impact" style="background: var(--mint); color: var(--primary); margin: 0;">Private</span>
                </div>
            </div>
        </div>
        <h2 style="margin: 0 0 20px 0;">Featured Lists</h2>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
             <div class="card" style="border-top: 4px solid var(--primary); cursor: pointer;" onclick="showPage('mylistdetail')"><h4 style="margin: 0 0 10px 0; color: var(--primary);">Counselors' Top Picks</h4><div style="font-size: 12px; color: #64748b;">12 Programs inside</div></div>
             <div class="card" style="border-top: 4px solid var(--accent);"><h4 style="margin: 0 0 10px 0; color: var(--primary);">Best STEM Programs</h4><div style="font-size: 12px; color: #64748b;">8 Programs</div></div>
             <div class="card" style="border-top: 4px solid var(--orange);"><h4 style="margin: 0 0 10px 0; color: var(--primary);">Free for Low-Income</h4><div style="font-size: 12px; color: #64748b;">15 Programs</div></div>
        </div>
    </div>
    """

    # List Detail
    listdetail = f"""
    <div class="{container_cls}">
        <div style="display: flex; gap: 40px; align-items: flex-start;">
            <div style="width: 320px; flex-shrink: 0; position: sticky; top: 20px;">
                <button class="btn-outline" style="margin-bottom: 24px; padding: 6px 15px; font-size: 12px;" onclick="showPage('lists')">← Back to All Lists</button>
                <h1 style="margin: 0 0 10px 0; font-size: 28px; color: var(--primary); line-height: 1.2;">Counselors' Top Picks</h1>
                <p style="font-size: 14px; line-height: 1.6; color: var(--text); padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">A curated selection of the most rigorous and respected programs.</p>
                <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 13px; font-weight: 600; color: #64748b;">Total Programs</span><span style="font-weight: bold; color: var(--primary);">12</span>
                </div>
                <div style="margin-top: 24px;"><button class="btn" style="width:100%;">Copy to My Lists</button></div>
            </div>
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 20px; color: var(--primary);">Programs in this list</h2>
                </div>
                <div class="card" style="display: flex; gap: 20px; align-items: center; margin-bottom: 15px; cursor: pointer;" onclick="showPage('program')">
                    <div style="font-size: 24px; font-weight: 900; color: var(--accent);">#1</div>
                    <div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 8px;"></div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 5px 0; font-size: 16px; color: var(--primary);">Stanford Pre-Collegiate Summer Institutes</h3>
                        <div style="font-size: 13px; color: #64748b;">Stanford University</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """

    # Auth
    auth = f"""
    <div style="display: flex; min-height: calc(100vh - 70px);">
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px;">
            <div style="width: 100%; max-width: 400px;">
                <h1 style="margin: 0 0 5px 0; color: var(--primary); font-size: 32px;">Welcome back</h1>
                <p style="color: #64748b; margin-bottom: 30px;">Don't have an account? <span style="color: var(--accent); font-weight: 600; cursor: pointer;">Sign Up</span></p>
                <button style="width: 100%; padding: 12px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; margin-bottom: 20px; cursor: pointer;">Continue with Google</button>
                <div style="margin-bottom: 16px;"><label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Email address</label><input type="email" placeholder="you@example.com" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;"></div>
                <div style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><label style="font-size: 13px; font-weight: 600;">Password</label></div>
                    <input type="password" placeholder="••••••••" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
                </div>
                <button class="btn" style="width: 100%; padding: 14px; font-size: 16px;">Sign In</button>
            </div>
        </div>
        <div style="flex: 1; background: var(--primary); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px;">
            <h2 style="font-size: 36px; margin: 0 0 20px 0;">Empower Your Future</h2>
            <p style="font-size: 18px; color: rgba(255,255,255,0.8); max-width: 400px; margin-bottom: 40px; text-align: center;">Join thousands of students and counselors discovering the best summer opportunities.</p>
        </div>
    </div>
    """
    
    return program, lists, listdetail, auth


# Layout 1: Grid & Centered
html_L1 = f"""<!DOCTYPE html><html lang="en"><head><title>L1: Grid & Centered</title><style>:root{{{common_colors}}}{base_css}
header {{ display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: var(--surface); border-bottom: 1px solid #e2e8f0; }}
.nav-links button {{ background: none; border: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; padding: 5px 10px; }}
.hero {{ text-align: center; padding: 60px 20px; background: var(--surface); border-bottom: 1px solid #e2e8f0; }}
.hero h1 {{ font-size: 42px; color: var(--primary); margin: 0 0 10px 0; }}
.hero-search {{ max-width: 700px; margin: 20px auto; display: flex; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; }}
.hero-search input {{ flex: 1; padding: 15px 20px; border: 1px solid #cbd5e1; border-right: none; font-size: 16px; outline: none; border-radius: 8px 0 0 8px; }}
.hero-search button {{ padding: 0 30px; background: var(--accent); color: white; border: none; font-size: 16px; font-weight: bold; border-radius: 0 8px 8px 0; }}
.l1-layout {{ display: grid; grid-template-columns: 250px 1fr; gap: 40px; max-width: 1200px; margin: 0 auto; padding: 40px 20px; }}
.l1-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }}
.hot-row {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }}
</style></head><body>
<div class="tab-nav"><button class="tab-btn active" onclick="showPage('home')">1. Home</button><button class="tab-btn" onclick="showPage('program')">2. Detail</button><button class="tab-btn" onclick="showPage('lists')">3. All Lists</button><button class="tab-btn" onclick="showPage('mylistdetail')">4. Target List</button><button class="tab-btn" onclick="showPage('auth')">5. Auth</button></div>
<header><div class="logo">Campberry (L1)</div><div class="nav-links"><button onclick="showPage('home')">Find</button><button onclick="showPage('lists')">My Lists</button><button onclick="showPage('auth')">Sign In</button></div></header>

<div class="page active" id="page-home">
    <div class="hero">
        <h1>Find Your Dream Program</h1>
        <p style="color: #64748b;">Discover extracurriculars that matter</p>
        <div class="hero-search"><input type="text" placeholder="Search over 1000 opportunities..."><button>Search</button></div>
        <div style="font-size:14px; font-weight:600; color:var(--accent);">★ Reviews and rankings by experts and parents.</div>
    </div>
    <div class="l1-layout">
        <div>
            <h3 style="margin-top:0;">Filters</h3>
            <div style="margin-bottom: 10px;"><strong>Grade</strong><br><input type="checkbox"> 9 <input type="checkbox"> 10</div>
            <div style="margin-bottom: 20px;"><strong>Season</strong><br><input type="checkbox"> Summer <input type="checkbox"> Fall</div>
            <button class="btn" style="width: 100%;">Apply</button>
        </div>
        <div>
            <h2 style="margin-top:0;">124 Results</h2>
            <div class="l1-grid">
                <div class="card" onclick="showPage('program')" style="cursor:pointer; border-top: 4px solid var(--accent);">
                    <div style="display:flex; gap:10px; margin-bottom:10px;"><div style="width:50px; height:50px; background:#f1f5f9;"></div><div><h3 style="margin:0; font-size:16px;">Stanford Pre-Collegiate</h3><div style="font-size:13px;">Stanford Univ</div></div></div>
                    <div><span class="badge-most">MOST RECOMMENDED</span></div>
                </div>
                <div class="card" style="border-top: 4px solid var(--primary);">
                    <div style="display:flex; gap:10px; margin-bottom:10px;"><div style="width:50px; height:50px; background:#f1f5f9;"></div><div><h3 style="margin:0; font-size:16px;">MIT PRIMES</h3><div style="font-size:13px;">MIT</div></div></div>
                    <div><span class="badge-impact">RECOMMENDED</span></div>
                </div>
            </div>
            
            <h2 style="margin-top: 40px;">Hot Programs</h2>
            <div class="hot-row">
                <div class="card" style="background:var(--primary); color:white; padding:15px; cursor:pointer;" onclick="showPage('mylistdetail')"><h4 style="margin:0;">Counselors' Picks</h4></div>
                <div class="card" style="background:var(--accent); color:white; padding:15px;"><h4 style="margin:0;">Best STEM</h4></div>
            </div>
        </div>
    </div>
</div>
<div class="page" id="page-program">{get_shared_pages(1)[0]}</div>
<div class="page" id="page-lists">{get_shared_pages(1)[1]}</div>
<div class="page" id="page-mylistdetail">{get_shared_pages(1)[2]}</div>
<div class="page" id="page-auth">{get_shared_pages(1)[3]}</div>
{script_js}</body></html>"""

# Layout 2: Left Aligned List
html_L2 = f"""<!DOCTYPE html><html lang="en"><head><title>L2: Left Aligned</title><style>:root{{{common_colors}}}{base_css}
header {{ display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: var(--surface); border-bottom: 1px solid #e2e8f0; }}
.nav-links button {{ background: none; border: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; padding: 5px 10px; }}
.hero-inline {{ display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 40px auto; background: var(--surface); padding: 40px; border-radius: 12px; border: 1px solid #e2e8f0; }}
.hero-inline h1 {{ font-size: 38px; color: var(--primary); margin: 0 0 10px 0; }}
.search-inline {{ flex: 1; max-width: 500px; display: flex; border: 2px solid var(--primary); border-radius: 8px; overflow: hidden; }}
.search-inline input {{ flex: 1; padding: 15px; border: none; outline: none; }}
.search-inline button {{ padding: 0 25px; background: var(--primary); color: white; border: none; font-weight: bold; }}
.l2-layout {{ max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 300px; gap: 40px; padding: 0 20px 60px; }}
.top-filters {{ display: flex; gap: 10px; padding: 15px 0; border-bottom: 2px solid #e2e8f0; margin-bottom: 20px; }}
.filter-btn {{ padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 6px; background: white; }}
.list-card {{ display: flex; gap: 20px; padding: 20px; border-left: 6px solid var(--accent); margin-bottom: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; }}
.sidebar-hot h3 {{ color: var(--primary); border-bottom: 2px solid var(--accent); padding-bottom: 10px; }}
.hot-list-item {{ padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 15px; background: white; cursor: pointer; }}
</style></head><body>
<div class="tab-nav"><button class="tab-btn active" onclick="showPage('home')">1. Home</button><button class="tab-btn" onclick="showPage('program')">2. Detail</button><button class="tab-btn" onclick="showPage('lists')">3. All Lists</button><button class="tab-btn" onclick="showPage('mylistdetail')">4. Target List</button><button class="tab-btn" onclick="showPage('auth')">5. Auth</button></div>
<header><div class="logo">Campberry (L2)</div><div class="nav-links"><button onclick="showPage('home')">Find</button><button onclick="showPage('lists')">My Lists</button><button onclick="showPage('auth')">Sign In</button></div></header>

<div class="page active" id="page-home">
    <div class="hero-inline">
        <div style="flex:1;">
            <h1>Find Your Dream Program</h1>
            <p style="color: #64748b;">Discover extracurriculars that matter.</p>
            <div style="font-size:13px; font-weight:600; color:var(--accent);">★ Reviews and rankings by experts and parents.</div>
        </div>
        <div class="search-inline"><input type="text" placeholder="Search over 1000 opportunities..."><button>Search</button></div>
    </div>
    
    <div class="l2-layout">
        <div>
            <div class="top-filters"><strong>Filters:</strong><div class="filter-btn">Grade ▼</div><div class="filter-btn">Season ▼</div><div class="filter-btn">Subject ▼</div></div>
            <h2 style="margin-top:0;">Search Results</h2>
            <div class="list-card" onclick="showPage('program')">
                <div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 8px;"></div>
                <div style="flex:1;"><h3 style="margin:0; font-size:18px;">Stanford Pre-Collegiate</h3><div style="font-size:13px; color:#64748b; margin-bottom:5px;">Stanford Univ</div><div><span class="tag">STEM</span></div></div>
                <div style="text-align:right;"><span class="badge-most" style="display:block;">MOST RECOMMENDED</span></div>
            </div>
             <div class="list-card" style="border-left-color: var(--primary);">
                <div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 8px;"></div>
                <div style="flex:1;"><h3 style="margin:0; font-size:18px;">MIT PRIMES</h3><div style="font-size:13px; color:#64748b; margin-bottom:5px;">MIT</div><div><span class="tag">Math</span></div></div>
            </div>
        </div>
        <div class="sidebar-hot">
            <h3>🔥 Hot Programs</h3>
            <div class="hot-list-item" onclick="showPage('mylistdetail')"><h4 style="margin:0;">Counselors' Top Picks</h4><div style="font-size:12px; color:#64748b;">Featured List</div></div>
            <div class="hot-list-item"><h4 style="margin:0;">Best STEM Programs</h4><div style="font-size:12px; color:#64748b;">Featured List</div></div>
        </div>
    </div>
</div>
<div class="page" id="page-program">{get_shared_pages(2)[0]}</div>
<div class="page" id="page-lists">{get_shared_pages(2)[1]}</div>
<div class="page" id="page-mylistdetail">{get_shared_pages(2)[2]}</div>
<div class="page" id="page-auth">{get_shared_pages(2)[3]}</div>
{script_js}</body></html>"""

# Layout 3: Integrated Full Width (Header Search, Sticky Filters)
html_L3 = f"""<!DOCTYPE html><html lang="en"><head><title>L3: Integrated Full Width</title><style>:root{{{common_colors}}}{base_css}
header {{ display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: var(--primary); border-bottom: none; }}
header .logo {{ color: white; }}
header .nav-links button {{ background: none; border: none; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.8); cursor: pointer; padding: 5px 10px; }}
.top-search {{ background: var(--primary); color: white; padding: 30px 40px; text-align: center; }}
.top-search h1 {{ margin: 0 0 10px 0; font-size: 36px; }}
.huge-search {{ max-width: 800px; margin: 20px auto 10px; display: flex; }}
.huge-search input {{ flex: 1; padding: 18px 24px; font-size: 16px; border: none; border-radius: 8px 0 0 8px; outline: none; }}
.huge-search button {{ padding: 0 40px; background: var(--accent); color: white; border: none; font-size: 16px; font-weight: bold; border-radius: 0 8px 8px 0; }}
.sticky-filters {{ background: white; padding: 15px 40px; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; display: flex; gap: 10px; align-items: center; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }}
.filter-chip {{ padding: 8px 16px; background: var(--bg); border: 1px solid transparent; border-radius: 20px; font-size: 14px; font-weight: 600; }}
.content-area {{ max-width: 1400px; margin: 0 auto; padding: 40px; }}
.hot-scroll {{ display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; margin-bottom: 40px; }}
.hot-scroll-item {{ min-width: 250px; background: white; border: 1px solid #e2e8f0; border-top: 4px solid var(--primary); padding: 20px; border-radius: 12px; cursor: pointer; }}
.masonry-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }}
</style></head><body>
<div class="tab-nav"><button class="tab-btn active" onclick="showPage('home')">1. Home</button><button class="tab-btn" onclick="showPage('program')">2. Detail</button><button class="tab-btn" onclick="showPage('lists')">3. All Lists</button><button class="tab-btn" onclick="showPage('mylistdetail')">4. Target List</button><button class="tab-btn" onclick="showPage('auth')">5. Auth</button></div>
<header><div class="logo">Campberry (L3)</div><div class="nav-links"><button onclick="showPage('home')">Find</button><button onclick="showPage('lists')">My Lists</button><button onclick="showPage('auth')" style="border: 1px solid white; border-radius:6px;">Sign In</button></div></header>

<div class="page active" id="page-home">
    <div class="top-search">
        <h1>Find Your Dream Program</h1>
        <p style="opacity: 0.8; margin:0;">Discover extracurriculars that matter.</p>
        <div class="huge-search"><input type="text" placeholder="Search over 1000 opportunities..."><button>Search</button></div>
        <div style="font-size:13px; color:var(--yellow); font-weight:bold;">★ Reviews and rankings by experts.</div>
    </div>
    
    <div class="sticky-filters">
        <strong>Filters:</strong><div class="filter-chip">Grade ▼</div><div class="filter-chip">Season ▼</div><div class="filter-chip">Subject ▼</div>
    </div>
    
    <div class="content-area">
        <h2>🔥 Hot Programs</h2>
        <div class="hot-scroll">
            <div class="hot-scroll-item" onclick="showPage('mylistdetail')"><h3 style="margin:0 0 5px 0; color:var(--primary);">Counselors' Picks</h3><div style="font-size:13px; color:#64748b;">Featured List</div></div>
            <div class="hot-scroll-item" style="border-top-color: var(--accent);"><h3 style="margin:0 0 5px 0;">Best STEM</h3><div style="font-size:13px; color:#64748b;">Featured List</div></div>
            <div class="hot-scroll-item"><h3 style="margin:0 0 5px 0;">Research</h3><div style="font-size:13px; color:#64748b;">Featured List</div></div>
        </div>
        
        <h2>Results</h2>
        <div class="masonry-grid">
            <div class="card" onclick="showPage('program')" style="cursor: pointer;">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px;"><div style="width:50px; height:50px; background:#f1f5f9; border-radius:8px;"></div><div style="text-align:right;"><span class="badge-most" style="display:block; margin-bottom:4px;">MOST RECOMMENDED</span></div></div>
                <h3 style="margin:0 0 5px 0; font-size: 18px;">Stanford Pre-Collegiate</h3>
                <div style="font-size:13px; color:#64748b; margin-bottom:10px;">Stanford University</div>
                <div><span class="tag">STEM</span></div>
            </div>
             <div class="card">
                <div style="display:flex; justify-content:space-between; margin-bottom:15px;"><div style="width:50px; height:50px; background:#f1f5f9; border-radius:8px;"></div></div>
                <h3 style="margin:0 0 5px 0; font-size: 18px;">MIT PRIMES</h3>
                <div style="font-size:13px; color:#64748b; margin-bottom:10px;">Mass. Institute of Technology</div>
                <div><span class="tag">Math</span></div>
            </div>
        </div>
    </div>
</div>
<div class="page" id="page-program">{get_shared_pages(3)[0]}</div>
<div class="page" id="page-lists">{get_shared_pages(3)[1]}</div>
<div class="page" id="page-mylistdetail">{get_shared_pages(3)[2]}</div>
<div class="page" id="page-auth">{get_shared_pages(3)[3]}</div>
{script_js}</body></html>"""

# Layout 4: Hero Tabs + Sidebar
html_L4 = f"""<!DOCTYPE html><html lang="en"><head><title>L4: Hero Tabs</title><style>:root{{{common_colors}}}{base_css}
header {{ display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: var(--surface); border-bottom: 1px solid #e2e8f0; }}
.nav-links button {{ background: none; border: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; padding: 5px 10px; }}
.hero-dark {{ background: var(--primary); color: white; padding: 60px 20px; text-align: center; }}
.hero-dark h1 {{ font-size: 40px; margin: 0 0 10px 0; }}
.hero-search {{ max-width: 800px; margin: 20px auto 0; display: flex; background: white; border-radius: 8px; padding: 5px; }}
.hero-search input {{ flex: 1; padding: 15px; border: none; outline: none; border-radius: 8px; font-size: 16px; }}
.hero-search button {{ padding: 0 40px; background: var(--accent); color: white; border: none; font-weight: bold; border-radius: 8px; }}
.floating-filters {{ max-width: 1000px; margin: -25px auto 40px; background: white; padding: 15px 20px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); display: flex; gap: 15px; border: 1px solid #e2e8f0; position: relative; z-index: 10; align-items: center; }}
.floating-filters .filter-btn {{ padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 6px; background: #f8fafc; font-size: 14px; font-weight: 600; }}
.l4-layout {{ max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 300px; gap: 30px; padding: 0 20px 60px; }}
.results-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }}
.hot-sidebar {{ background: var(--mint); padding: 20px; border-radius: 12px; border: 1px solid #caeee3; height: fit-content; }}
.hot-item-btn {{ background: white; padding: 15px; border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border: 1px solid transparent; }}
.hot-item-btn:hover {{ border-color: var(--primary); }}
</style></head><body>
<div class="tab-nav"><button class="tab-btn active" onclick="showPage('home')">1. Home</button><button class="tab-btn" onclick="showPage('program')">2. Detail</button><button class="tab-btn" onclick="showPage('lists')">3. All Lists</button><button class="tab-btn" onclick="showPage('mylistdetail')">4. Target List</button><button class="tab-btn" onclick="showPage('auth')">5. Auth</button></div>
<header><div class="logo">Campberry (L4)</div><div class="nav-links"><button onclick="showPage('home')">Find</button><button onclick="showPage('lists')">My Lists</button><button onclick="showPage('auth')">Sign In</button></div></header>

<div class="page active" id="page-home">
    <div class="hero-dark">
        <h1>Find Your Dream Program</h1>
        <p style="color:var(--mint);">Discover extracurriculars that matter</p>
        <div style="font-size:13px; color:var(--yellow); font-weight:bold;">★ Reviews and rankings by experts and parents.</div>
        <div class="hero-search"><input type="text" placeholder="Search over 1000 opportunities..."><button>Search</button></div>
    </div>
    
    <div class="floating-filters">
        <strong style="color:var(--primary);">Filters:</strong>
        <div class="filter-btn">Grade ▼</div><div class="filter-btn">Season ▼</div><div class="filter-btn">Subject ▼</div>
    </div>
    
    <div class="l4-layout">
        <div>
            <h2 style="margin-top:0;">Results (124)</h2>
            <div class="results-grid">
                <div class="card" onclick="showPage('program')" style="cursor: pointer; border-top: 4px solid var(--accent);">
                    <div style="display:flex; gap:15px; margin-bottom:15px;"><div style="width:50px; height:50px; background:#f1f5f9; border-radius:8px;"></div><div><h3 style="margin:0; font-size:16px;">Stanford Pre-Collegiate</h3><div style="font-size:13px; color:#64748b;">Stanford Univ</div></div></div>
                    <div><span class="badge-most">MOST RECOMMENDED</span><br><span class="badge-impact" style="margin-top:5px;">HIGH IMPACT</span></div>
                </div>
                 <div class="card" style="border-top: 4px solid var(--primary);">
                    <div style="display:flex; gap:15px; margin-bottom:15px;"><div style="width:50px; height:50px; background:#f1f5f9; border-radius:8px;"></div><div><h3 style="margin:0; font-size:16px;">MIT PRIMES</h3><div style="font-size:13px; color:#64748b;">MIT</div></div></div>
                    <div><span class="badge-impact" style="background:var(--accent);">RECOMMENDED</span></div>
                </div>
            </div>
        </div>
        
        <div class="hot-sidebar">
            <h2 style="margin-top:0; color:var(--primary); font-size:18px;">🔥 Hot Programs</h2>
            <div class="hot-item-btn" onclick="showPage('mylistdetail')">
                <div><div style="font-weight:bold; color:var(--primary);">Counselors' Picks</div><div style="font-size:11px; color:#64748b;">12 Programs</div></div>
                <div style="color:var(--accent); font-weight:bold;">→</div>
            </div>
             <div class="hot-item-btn">
                <div><div style="font-weight:bold; color:var(--primary);">Best STEM</div><div style="font-size:11px; color:#64748b;">8 Programs</div></div>
                <div style="color:var(--accent); font-weight:bold;">→</div>
            </div>
        </div>
    </div>
</div>
<div class="page" id="page-program">{get_shared_pages(4)[0]}</div>
<div class="page" id="page-lists">{get_shared_pages(4)[1]}</div>
<div class="page" id="page-mylistdetail">{get_shared_pages(4)[2]}</div>
<div class="page" id="page-auth">{get_shared_pages(4)[3]}</div>
{script_js}</body></html>"""

# Layout 5: Minimalist SaaS
html_L5 = f"""<!DOCTYPE html><html lang="en"><head><title>L5: Minimalist SaaS</title><style>:root{{{common_colors}}}{base_css}
header {{ display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: var(--surface); border-bottom: 1px solid #e2e8f0; }}
.nav-links button {{ background: none; border: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; padding: 5px 10px; }}
.mini-container {{ max-width: 900px; margin: 0 auto; padding: 60px 20px; }}
.hero-minimal {{ text-align: center; margin-bottom: 40px; }}
.hero-minimal h1 {{ font-size: 48px; color: var(--primary); margin: 0 0 10px 0; letter-spacing: -1px; }}
.huge-input {{ display: flex; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; margin-bottom: 20px; }}
.huge-input input {{ flex: 1; padding: 20px 24px; font-size: 18px; border: none; outline: none; }}
.huge-input button {{ padding: 0 40px; font-size: 18px; background: var(--primary); color: white; border: none; font-weight: bold; cursor: pointer; }}
.filter-row {{ display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }}
.hot-ribbon {{ background: var(--primary); color: white; border-radius: 12px; padding: 24px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }}
.ribbon-tag {{ background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 8px 16px; font-size: 14px; cursor: pointer; margin-left: 10px; }}
.ribbon-tag:hover {{ background: var(--mint); color: var(--primary); }}
.res-wide {{ display: flex; background: var(--surface); border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 15px; gap: 24px; align-items: center; cursor: pointer; }}
.res-wide:hover {{ box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border-color: #cbd5e1; transform: translateY(-2px); }}
</style></head><body>
<div class="tab-nav"><button class="tab-btn active" onclick="showPage('home')">1. Home</button><button class="tab-btn" onclick="showPage('program')">2. Detail</button><button class="tab-btn" onclick="showPage('lists')">3. All Lists</button><button class="tab-btn" onclick="showPage('mylistdetail')">4. Target List</button><button class="tab-btn" onclick="showPage('auth')">5. Auth</button></div>
<header><div class="logo">Campberry (L5)</div><div class="nav-links"><button onclick="showPage('home')">Find</button><button onclick="showPage('lists')">My Lists</button><button onclick="showPage('auth')">Sign In</button></div></header>

<div class="page active" id="page-home">
    <div class="mini-container">
        <div class="hero-minimal">
            <h1>Find Your Dream Program</h1>
            <p style="color:#64748b; font-size:18px;">Discover extracurriculars that matter.</p>
            <div style="font-size:14px; font-weight:600; color:#94a3b8;"><span style="color:var(--yellow);">★</span> Reviews and rankings by experts and parents.</div>
        </div>
        
        <div class="huge-input"><input type="text" placeholder="Search over 1000 opportunities..."><button>Search</button></div>
        
        <div class="filter-row">
            <div style="display:flex; gap:15px; font-weight:600; font-size:14px; color:var(--primary);"><span>Grade ▼</span><span>Season ▼</span><span>Subject ▼</span></div>
            <div style="color:#64748b; font-size:14px;">124 Results</div>
        </div>
        
        <div class="hot-ribbon">
            <div><h3 style="margin:0 0 5px 0;">🔥 Hot Programs</h3><div style="font-size:13px; opacity:0.8;">Explore our curated featured lists</div></div>
            <div style="display:flex;"><div class="ribbon-tag" onclick="showPage('mylistdetail')">Counselors' Picks</div><div class="ribbon-tag">Best STEM</div></div>
        </div>
        
        <div class="res-wide" onclick="showPage('program')">
            <div style="width:80px; height:80px; border-radius:8px; border:1px solid #e2e8f0; background:var(--bg);"></div>
            <div style="flex:1;"><h3 style="margin:0 0 6px 0; font-size:20px; color:var(--primary);">Stanford Pre-Collegiate</h3><div style="color:#64748b; font-size:14px; margin-bottom:10px;">Stanford University</div><div><span class="tag">STEM</span></div></div>
            <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-end;"><span class="badge-most">MOST RECOMMENDED</span></div>
        </div>
        
        <div class="res-wide">
            <div style="width:80px; height:80px; border-radius:8px; border:1px solid #e2e8f0; background:var(--bg);"></div>
            <div style="flex:1;"><h3 style="margin:0 0 6px 0; font-size:20px; color:var(--primary);">MIT PRIMES</h3><div style="color:#64748b; font-size:14px; margin-bottom:10px;">MIT</div><div><span class="tag">Math</span></div></div>
            <div style="display:flex; flex-direction:column; gap:10px; align-items:flex-end;"><span class="badge-impact">RECOMMENDED</span></div>
        </div>
    </div>
</div>
<div class="page" id="page-program">{get_shared_pages(5)[0]}</div>
<div class="page" id="page-lists">{get_shared_pages(5)[1]}</div>
<div class="page" id="page-mylistdetail">{get_shared_pages(5)[2]}</div>
<div class="page" id="page-auth">{get_shared_pages(5)[3]}</div>
{script_js}</body></html>"""

# Layout 6: Dashboard (Requires different shell)
html_L6 = f"""<!DOCTYPE html><html lang="en"><head><title>L6: Dashboard App</title><style>:root{{{common_colors}}}{base_css}
body {{ display: flex; height: 100vh; overflow: hidden; background: #f1f5f9; }}
.l6-app-wrapper {{ display: flex; width: 100vw; height: 100vh; flex-direction: column; }}
.l6-main-body {{ display: flex; flex: 1; overflow: hidden; }}
.sidebar {{ width: 250px; background: var(--primary); color: white; display: flex; flex-direction: column; flex-shrink: 0; }}
.side-logo {{ padding: 24px; font-size: 24px; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }}
.side-item {{ padding: 12px 16px; border-radius: 8px; color: rgba(255,255,255,0.8); text-decoration: none; font-weight: 600; font-size: 15px; display: flex; margin: 0 15px 5px; cursor: pointer; background: transparent; border: none; text-align: left; width: calc(100% - 30px); }}
.side-item:hover, .side-item.active {{ background: rgba(255,255,255,0.1); color: white; }}
.main-wrapper {{ flex: 1; display: flex; flex-direction: column; overflow: hidden; }}
.topbar {{ background: var(--surface); padding: 15px 30px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }}
.dash-search {{ display: flex; background: var(--bg); border: 1px solid #cbd5e1; border-radius: 8px; width: 500px; }}
.dash-search input {{ flex: 1; border: none; background: transparent; padding: 12px; outline: none; }}
.dash-search button {{ background: var(--primary-dark); color: white; border: none; padding: 0 20px; border-radius: 0 8px 8px 0; font-weight: bold; cursor: pointer; }}
.page-content {{ flex: 1; overflow-y: auto; padding: 30px; display: flex; gap: 30px; }}
.main-col {{ flex: 1; }} .right-col {{ width: 300px; }}
.dash-filters {{ display: flex; gap: 10px; background: white; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; }}
.dash-filters select {{ flex:1; border: 1px solid #cbd5e1; border-radius:6px; padding:10px; outline:none; }}
.grid-2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }}
.right-panel {{ background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; position: sticky; top: 0; }}
.mini-hot-item {{ padding: 12px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: var(--primary); margin-bottom: 10px; cursor: pointer; }}
.content-container {{ max-width: 1000px; }}
</style></head><body>

<div class="l6-app-wrapper">
    <div class="tab-nav" style="flex-shrink:0;"><button class="tab-btn active" onclick="showPage('home')">1. Home</button><button class="tab-btn" onclick="showPage('program')">2. Detail</button><button class="tab-btn" onclick="showPage('lists')">3. All Lists</button><button class="tab-btn" onclick="showPage('mylistdetail')">4. Target List</button><button class="tab-btn" onclick="showPage('auth')">5. Auth</button></div>
    
    <div class="l6-main-body">
        <div class="sidebar">
            <div class="side-logo">Campberry App</div>
            <button class="side-item active" onclick="showPage('home')">🔍 Find Programs</button>
            <button class="side-item" onclick="showPage('lists')">📁 My Lists</button>
            <button class="side-item" onclick="showPage('auth')">🔐 Sign In</button>
        </div>
        
        <div class="main-wrapper">
            <div class="topbar">
                <div class="dash-search"><input type="text" placeholder="Search over 1000 opportunities..."><button>Search</button></div>
                <div style="font-size:12px; color:#64748b; font-weight:bold;">★ Reviews and rankings by experts.</div>
            </div>
            
            <div class="page-content page active" id="page-home">
                <div style="display:flex; gap:30px; width:100%;">
                    <div class="main-col">
                        <div class="dash-filters"><select><option>Grade</option></select><select><option>Season</option></select><button class="btn">Apply</button></div>
                        <h2 style="margin-top:0;">Results (124)</h2>
                        <div class="grid-2">
                            <div class="card" onclick="showPage('program')" style="cursor:pointer; border-top: 4px solid var(--accent); display:flex; flex-direction:column;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:12px;"><h3 style="margin:0; font-size:16px;">Stanford Pre-Collegiate</h3><div style="width:40px;height:40px;background:#f1f5f9;border-radius:6px;"></div></div>
                                <div style="font-size:13px; color:#64748b; margin-bottom:15px;">Stanford Univ</div>
                                <div><span class="badge-most">MOST RECOMMENDED</span></div>
                            </div>
                             <div class="card" style="border-top: 4px solid var(--primary); display:flex; flex-direction:column;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:12px;"><h3 style="margin:0; font-size:16px;">MIT PRIMES</h3><div style="width:40px;height:40px;background:#f1f5f9;border-radius:6px;"></div></div>
                                <div style="font-size:13px; color:#64748b; margin-bottom:15px;">MIT</div>
                                <div><span class="badge-impact">RECOMMENDED</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="right-col">
                        <div class="right-panel">
                            <h3 style="margin-top:0; color:var(--primary);">🔥 Hot Programs</h3>
                            <div class="mini-hot-item" onclick="showPage('mylistdetail')">Counselors' Top Picks</div>
                            <div class="mini-hot-item">Best STEM Programs</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="page-content page" id="page-program"><div class="content-container">{get_shared_pages(6)[0]}</div></div>
            <div class="page-content page" id="page-lists"><div class="content-container">{get_shared_pages(6)[1]}</div></div>
            <div class="page-content page" id="page-mylistdetail"><div class="content-container">{get_shared_pages(6)[2]}</div></div>
            <div class="page-content page" id="page-auth"><div class="content-container" style="width:100%;">{get_shared_pages(6)[3]}</div></div>
        </div>
    </div>
</div>
{script_js}</body></html>"""

with open(r'c:\campberry_proj\campberry_full_L1.html', 'w', encoding='utf-8') as f: f.write(html_L1)
with open(r'c:\campberry_proj\campberry_full_L2.html', 'w', encoding='utf-8') as f: f.write(html_L2)
with open(r'c:\campberry_proj\campberry_full_L3.html', 'w', encoding='utf-8') as f: f.write(html_L3)
with open(r'c:\campberry_proj\campberry_full_L4.html', 'w', encoding='utf-8') as f: f.write(html_L4)
with open(r'c:\campberry_proj\campberry_full_L5.html', 'w', encoding='utf-8') as f: f.write(html_L5)
with open(r'c:\campberry_proj\campberry_full_L6.html', 'w', encoding='utf-8') as f: f.write(html_L6)

print("Created 6 complete layout HTML prototypes in c:\campberry_proj")
