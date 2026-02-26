import os

common_styles = """
:root {
    --primary: #011936;
    --accent: #892233;
    --primary-dark: #780000;
    --mint: #ddfff7;
    --yellow: #fade41;
    --orange: #ff751f;
    --bg: #f8fafc;
    --surface: #ffffff;
    --text: #333333;
}

body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: var(--text); background: var(--bg); }
header { display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: var(--surface); border-bottom: 1px solid #e2e8f0; }
.logo { font-size: 22px; font-weight: 800; color: var(--primary); }
.nav-links { display: flex; gap: 24px; }
.nav-links a { text-decoration: none; color: var(--text); font-weight: 600; font-size: 14px; }

.btn { padding: 10px 24px; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-block; text-align: center; font-size: 14px; }
.btn:hover { background: var(--primary-dark); }
.btn-outline { padding: 8px 20px; background: transparent; color: var(--primary); border: 2px solid var(--primary); border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; }

.card { background: var(--surface); border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
.tag { font-size: 12px; padding: 4px 10px; border-radius: 16px; background: var(--mint); color: var(--primary); font-weight: 600; margin-right: 6px; display: inline-block; }
.badge-most { font-size: 10px; padding: 4px 8px; border-radius: 6px; background: var(--accent); color: white; font-weight: bold; margin-right: 6px; display: inline-block; }
.badge-impact { font-size: 10px; padding: 4px 8px; border-radius: 6px; background: var(--primary); color: white; font-weight: bold; margin-right: 6px; display: inline-block; }
"""

# LAYOUT 4: Hero Tabs + 2 Column Results & Sidebar
layout4 = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Proposal 4: Hero Tabs + Results & Sidebar</title>
    <style>
        {common_styles}
        .hero {{ background: var(--primary); color: white; padding: 60px 20px; text-align: center; }}
        .hero h1 {{ font-size: 40px; margin: 0 0 10px 0; font-weight: 800; }}
        .hero p {{ font-size: 18px; color: var(--mint); margin: 0 0 15px 0; }}
        .trust {{ font-size: 14px; font-weight: 600; color: var(--yellow); margin-bottom: 40px; }}
        
        .search-container {{ max-width: 800px; margin: 0 auto; position: relative; }}
        .search-box {{ display: flex; background: var(--surface); border-radius: 12px; padding: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }}
        .search-box input {{ flex: 1; border: none; padding: 15px; font-size: 16px; border-radius: 8px; outline: none; }}
        .search-box .btn {{ padding: 15px 40px; font-size: 16px; border-radius: 8px; }}
        
        /* Filters attached right under hero */
        .filter-tabs {{ max-width: 1000px; margin: -20px auto 40px auto; background: var(--surface); border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 15px 20px; display: flex; gap: 15px; position: relative; z-index: 10; border: 1px solid #e2e8f0; align-items: center; justify-content: space-between;}}
        .filter-group {{ display: flex; gap: 15px; }}
        .filter-btn {{ padding: 8px 16px; border-radius: 8px; border: 1px solid #cbd5e1; background: #f8fafc; font-size: 14px; font-weight: 600; color: var(--primary); cursor: pointer; }}
        .filter-btn:hover {{ border-color: var(--primary); }}
        
        .layout-grid {{ max-width: 1200px; margin: 0 auto; padding: 0 20px 60px 20px; display: grid; grid-template-columns: 1fr 300px; gap: 30px; }}
        
        .results-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }}
        .res-card {{ display: flex; flex-direction: column; }}
        
        h2.section-title {{ color: var(--primary); font-size: 20px; margin-top: 0; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }}
        
        .hot-sidebar {{ background: var(--mint); padding: 20px; border-radius: 12px; height: fit-content; border: 1px solid #caeee3; }}
        .hot-sidebar h2 {{ color: var(--primary); font-size: 18px; margin-top: 0; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }}
        .hot-item {{ background: var(--surface); padding: 15px; border-radius: 8px; margin-bottom: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; justify-content: space-between; align-items: center; cursor: pointer; }}
        .hot-item:hover {{ border: 1px solid var(--primary); }}
        .hot-item-title {{ font-size: 14px; font-weight: bold; color: var(--primary); }}
    </style>
</head>
<body>
    <header>
        <div class="logo">Campberry</div>
        <div class="nav-links"><a href="#">Find</a><a href="#">My Lists</a></div>
        <button class="btn-outline">Log In</button>
    </header>

    <div class="hero">
        <h1>Find Your Dream Program</h1>
        <p>Discover extracurriculars that matter</p>
        <div class="trust">★ Reviews and rankings by experts and parents.</div>
        
        <div class="search-container">
            <div class="search-box">
                <input type="text" placeholder="Search over 1000 opportunities...">
                <button class="btn">Search</button>
            </div>
        </div>
    </div>

    <!-- Filters as floating bar just below hero -->
    <div class="filter-tabs">
        <div style="font-weight: bold; color: var(--primary);">Filters:</div>
        <div class="filter-group">
            <div class="filter-btn">Grade ▼</div>
            <div class="filter-btn">Season ▼</div>
            <div class="filter-btn">Subject ▼</div>
            <div class="filter-btn">Location ▼</div>
        </div>
        <button class="btn" style="padding: 8px 16px;">Apply Filters</button>
    </div>

    <div class="layout-grid">
        <!-- Main Results -->
        <div class="main">
            <h2 class="section-title">
                Results (124)
                <span style="font-size: 14px; font-weight: normal; color: #64748b;">Sort: Relevancy ▼</span>
            </h2>
            
            <div class="results-grid">
                <div class="card res-card border-top-accent" style="border-top: 4px solid var(--accent);">
                    <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <div style="width: 50px; height: 50px; background: #f1f5f9; border-radius: 8px;"></div>
                        <div>
                            <h3 style="margin: 0; font-size: 16px; color: var(--primary);">Stanford Pre-Collegiate</h3>
                            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Stanford University</div>
                        </div>
                    </div>
                    <div>
                        <span class="badge-most">MOST RECOMMENDED</span>
                        <span class="badge-impact">HIGH IMPACT</span>
                    </div>
                    <div style="margin-top: 15px;">
                        <span class="tag">STEM</span><span class="tag">Summer</span>
                    </div>
                </div>

                <div class="card res-card border-top-primary" style="border-top: 4px solid var(--primary);">
                    <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <div style="width: 50px; height: 50px; background: #f1f5f9; border-radius: 8px;"></div>
                        <div>
                            <h3 style="margin: 0; font-size: 16px; color: var(--primary);">MIT PRIMES</h3>
                            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Mass. Institute of Technology</div>
                        </div>
                    </div>
                    <div>
                        <span class="badge-impact">RECOMMENDED</span>
                    </div>
                    <div style="margin-top: 15px;">
                        <span class="tag">Math</span><span class="tag">Research</span>
                    </div>
                </div>
                
                 <div class="card res-card border-top-primary" style="border-top: 4px solid var(--primary);">
                    <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                        <div style="width: 50px; height: 50px; background: #f1f5f9; border-radius: 8px;"></div>
                        <div>
                            <h3 style="margin: 0; font-size: 16px; color: var(--primary);">Clark Scholars</h3>
                            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Texas Tech University</div>
                        </div>
                    </div>
                    <div style="margin-top: 15px;">
                        <span class="tag">STEM</span><span class="tag">Research</span>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="btn-outline">Load More Results</button>
            </div>
        </div>

        <!-- Right Side Hot Programs -->
        <div class="hot-sidebar">
            <h2>🔥 Hot Programs <span style="font-size: 12px; font-weight: normal; color: var(--primary); background: rgba(255,255,255,0.5); padding: 2px 6px; border-radius: 4px; margin-left: auto;">Featured Lists</span></h2>
            
            <div class="hot-item">
                <div>
                   <div class="hot-item-title">Counselors' Top Picks</div>
                   <div style="font-size: 11px; color: #64748b; margin-top: 4px;">12 Programs</div>
                </div>
                <div style="color: var(--accent); font-weight: bold;">→</div>
            </div>
            <div class="hot-item">
                <div>
                   <div class="hot-item-title">Best STEM Programs</div>
                   <div style="font-size: 11px; color: #64748b; margin-top: 4px;">8 Programs</div>
                </div>
                <div style="color: var(--accent); font-weight: bold;">→</div>
            </div>
            <div class="hot-item">
                <div>
                   <div class="hot-item-title">High Impact Research</div>
                   <div style="font-size: 11px; color: #64748b; margin-top: 4px;">5 Programs</div>
                </div>
                <div style="color: var(--accent); font-weight: bold;">→</div>
            </div>
            <div class="hot-item">
                <div>
                   <div class="hot-item-title">Free for Low-Income</div>
                   <div style="font-size: 11px; color: #64748b; margin-top: 4px;">15 Programs</div>
                </div>
                <div style="color: var(--accent); font-weight: bold;">→</div>
            </div>
        </div>
    </div>
</body>
</html>
"""


# LAYOUT 5: Ultra Minimalist SaaS (Single Column, Filters inline, Horizontal Cards)
layout5 = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Proposal 5: Minimalist SaaS</title>
    <style>
        {common_styles}
        .container {{ max-width: 900px; margin: 0 auto; padding: 60px 20px; }}
        
        .hero-minimal {{ text-align: center; margin-bottom: 40px; }}
        .hero-minimal h1 {{ font-size: 48px; color: var(--primary); margin: 0 0 10px 0; font-weight: 900; letter-spacing: -1px; }}
        .hero-minimal p {{ font-size: 18px; color: #64748b; margin: 0 0 15px 0; }}
        .trust {{ font-size: 14px; font-weight: 600; color: #94a3b8; display: flex; align-items: center; justify-content: center; gap: 8px; }}
        
        .huge-input-group {{ display: flex; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; margin-bottom: 20px; }}
        .huge-input-group input {{ flex: 1; padding: 20px 24px; font-size: 18px; border: none; outline: none; }}
        .huge-input-group button {{ padding: 20px 40px; font-size: 18px; background: var(--primary); color: white; border: none; font-weight: bold; cursor: pointer; }}
        .huge-input-group button:hover {{ background: var(--primary-dark); }}
        
        .filter-row {{ display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }}
        .filter-options {{ display: flex; gap: 15px; }}
        .filter-opt {{ font-size: 14px; font-weight: 600; color: var(--primary); cursor: pointer; display: flex; align-items: center; gap: 5px; }}
        .filter-opt:hover {{ color: var(--accent); }}
        
        /* Hot Programs Banner Horizontal */
        .hot-banner {{ background: var(--primary); color: white; border-radius: 12px; padding: 24px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }}
        .hot-list-tags {{ display: flex; gap: 10px; }}
        .hot-tag {{ background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 8px 16px; font-size: 14px; cursor: pointer; }}
        .hot-tag:hover {{ background: var(--mint); color: var(--primary); }}
        
        .res-list-item {{ display: flex; background: var(--surface); border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 15px; gap: 24px; align-items: center; transition: all 0.2s; }}
        .res-list-item:hover {{ box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border-color: #cbd5e1; transform: translateY(-2px); }}
        .res-logo {{ width: 80px; height: 80px; background: var(--bg); border: 1px solid #e2e8f0; border-radius: 8px; flex-shrink: 0; }}
        .res-content {{ flex: 1; }}
        .res-actions {{ display: flex; flex-direction: column; gap: 10px; align-items: flex-end; min-width: 150px; }}
    </style>
</head>
<body>
    <header>
        <div class="logo">Campberry</div>
        <div class="nav-links"><a href="#">Find</a><a href="#">My Lists</a></div>
        <button class="btn-outline">Log In</button>
    </header>

    <div class="container">
        <div class="hero-minimal">
            <h1>Find Your Dream Program</h1>
            <p>Discover extracurriculars that matter</p>
            <div class="trust">
                <span style="color: var(--yellow);">★</span> Reviews and rankings by experts and parents.
            </div>
        </div>
        
        <div class="huge-input-group">
            <input type="text" placeholder="Search over 1000 opportunities...">
            <button>Search</button>
        </div>
        
        <div class="filter-row">
            <div class="filter-options">
                <div class="filter-opt">Grade <span style="color: #94a3b8; font-size:10px;">▼</span></div>
                <div class="filter-opt">Season <span style="color: #94a3b8; font-size:10px;">▼</span></div>
                <div class="filter-opt">Subject <span style="color: #94a3b8; font-size:10px;">▼</span></div>
                <div class="filter-opt">Location <span style="color: #94a3b8; font-size:10px;">▼</span></div>
            </div>
            <div style="font-size: 14px; color: #64748b;">124 Results</div>
        </div>
        
        <!-- Hot Programs Horizontal Ribbon -->
        <div class="hot-banner">
            <div>
                <h3 style="margin: 0 0 5px 0;">🔥 Hot Programs</h3>
                <div style="font-size: 13px; opacity: 0.8;">Explore our curated featured lists</div>
            </div>
            <div class="hot-list-tags">
                <div class="hot-tag">Counselors' Picks</div>
                <div class="hot-tag">Best STEM</div>
                <div class="hot-tag">High Impact</div>
            </div>
        </div>

        <div>
            <!-- List Card 1 -->
            <div class="res-list-item">
                <div class="res-logo"></div>
                <div class="res-content">
                    <h3 style="margin: 0 0 6px 0; font-size: 20px; color: var(--primary);">Stanford Pre-Collegiate Summer Institutes</h3>
                    <div style="font-size: 14px; color: #64748b; margin-bottom: 12px;">Stanford University</div>
                    <div><span class="tag">STEM</span><span class="tag">Summer</span></div>
                </div>
                <div class="res-actions">
                    <span class="badge-most">MOST RECOMMENDED</span>
                    <span class="badge-impact">HIGH IMPACT</span>
                </div>
            </div>
            
            <!-- List Card 2 -->
            <div class="res-list-item">
                <div class="res-logo"></div>
                <div class="res-content">
                    <h3 style="margin: 0 0 6px 0; font-size: 20px; color: var(--primary);">MIT PRIMES</h3>
                    <div style="font-size: 14px; color: #64748b; margin-bottom: 12px;">Massachusetts Institute of Technology</div>
                    <div><span class="tag">Math</span><span class="tag">Research</span></div>
                </div>
                <div class="res-actions">
                    <span class="badge-impact" style="background:var(--accent);">RECOMMENDED</span>
                </div>
            </div>
            
             <!-- List Card 3 -->
            <div class="res-list-item">
                <div class="res-logo"></div>
                <div class="res-content">
                    <h3 style="margin: 0 0 6px 0; font-size: 20px; color: var(--primary);">Clark Scholars</h3>
                    <div style="font-size: 14px; color: #64748b; margin-bottom: 12px;">Texas Tech University</div>
                    <div><span class="tag">Research</span><span class="tag">STEM</span></div>
                </div>
                <div class="res-actions">
                </div>
            </div>
        </div>
        
    </div>
</body>
</html>
"""


# LAYOUT 6: Dashboard/App Style (Fixed Left Navbar, Top Filters, Grid body)
layout6 = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Proposal 6: Dashboard Application Style</title>
    <style>
        {common_styles}
        body {{ display: flex; height: 100vh; overflow: hidden; background: #f1f5f9; }}
        
        .sidebar {{ width: 250px; background: var(--primary); color: white; display: flex; flex-direction: column; flex-shrink: 0; }}
        .side-logo {{ padding: 24px; font-size: 24px; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px; }}
        .side-nav {{ display: flex; flex-direction: column; padding: 0 15px; gap: 5px; }}
        .side-item {{ padding: 12px 16px; border-radius: 8px; color: rgba(255,255,255,0.8); text-decoration: none; font-weight: 600; font-size: 15px; display: flex; align-items: center; justify-content: space-between; }}
        .side-item:hover, .side-item.active {{ background: rgba(255,255,255,0.1); color: white; }}
        
        .main-wrapper {{ flex: 1; display: flex; flex-direction: column; overflow: hidden; }}
        
        .topbar {{ background: var(--surface); padding: 15px 30px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }}
        .dash-search-box {{ display: flex; background: var(--bg); border: 1px solid #cbd5e1; border-radius: 8px; width: 500px; }}
        .dash-search-box input {{ flex: 1; border: none; background: transparent; padding: 12px 16px; font-size: 15px; outline: none; }}
        .dash-search-box button {{ background: var(--primary-dark); color: white; border: none; padding: 0 20px; border-radius: 0 8px 8px 0; font-weight: bold; cursor: pointer; }}
        
        .topbar-text {{ font-size: 12px; color: #64748b; margin-top: 5px; font-weight: 600; }}
        
        .page-content {{ flex: 1; overflow-y: auto; padding: 30px; display: flex; gap: 30px; }}
        .main-col {{ flex: 1; }}
        .right-col {{ width: 320px; flex-shrink: 0; }}
        
        .dash-header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }}
        .dash-header h1 {{ margin: 0; font-size: 28px; color: var(--primary); }}
        
        /* Filters specific to dashboard */
        .dash-filters {{ display: flex; gap: 10px; background: white; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; }}
        .dash-select {{ flex: 1; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; font-size: 14px; color: var(--text); appearance: none; background: #f8fafc; cursor: pointer; }}
        
        .grid-2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }}
        .dash-card {{ background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; transition: border-color 0.2s; border-top: 4px solid var(--accent); }}
        .dash-card:hover {{ border-color: var(--primary); }}
        
        .right-panel {{ background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; position: sticky; top: 0; }}
        .right-panel h3 {{ margin: 0 0 20px 0; color: var(--primary); display: flex; align-items: center; justify-content: space-between; }}
        
        .mini-hot {{ display: flex; flex-direction: column; gap: 12px; }}
        .mini-hot-item {{ padding: 12px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: var(--primary); cursor: pointer; }}
        .mini-hot-item:hover {{ background: var(--mint); border-color: var(--primary); }}
    </style>
</head>
<body>

    <div class="sidebar">
        <div class="side-logo">Campberry</div>
        <div class="side-nav">
            <a href="#" class="side-item active">🔍 Find Programs</a>
            <a href="#" class="side-item">📁 My Lists</a>
            <a href="#" class="side-item">⚙️ Settings</a>
        </div>
        <div style="margin-top: auto; padding: 20px;">
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">★ Reviews and rankings by experts and parents.</div>
            </div>
        </div>
    </div>

    <div class="main-wrapper">
        <div class="topbar">
            <div>
                <div class="dash-search-box">
                    <input type="text" placeholder="Search over 1000 opportunities...">
                    <button>Search</button>
                </div>
                <div class="topbar-text">Find Your Dream Program • Discover extracurriculars that matter</div>
            </div>
            <button class="btn-outline">Log In</button>
        </div>
        
        <div class="page-content">
            <div class="main-col">
                <div class="dash-header">
                    <h1>Results (124)</h1>
                </div>
                
                <div class="dash-filters">
                    <select class="dash-select"><option>Grade</option></select>
                    <select class="dash-select"><option>Season</option></select>
                    <select class="dash-select"><option>Subject</option></select>
                    <select class="dash-select"><option>Location</option></select>
                    <button class="btn" style="white-space: nowrap;">Apply Filter</button>
                </div>
                
                <div class="grid-2">
                    <div class="dash-card">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; font-size: 18px; color: var(--primary); max-width: 80%;">Stanford Pre-Collegiate</h3>
                            <div style="width: 40px; height: 40px; background: var(--bg); border: 1px solid #e2e8f0; border-radius: 6px;"></div>
                        </div>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 15px;">Stanford University</div>
                        <div>
                            <span class="badge-most">MOST RECOMMENDED</span>
                            <span class="badge-impact">HIGH IMPACT</span>
                        </div>
                        <div style="margin-top: auto; padding-top: 15px;">
                            <span class="tag">STEM</span><span class="tag">Summer</span>
                        </div>
                    </div>
                    
                    <div class="dash-card" style="border-top-color: var(--primary);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; font-size: 18px; color: var(--primary); max-width: 80%;">MIT PRIMES</h3>
                            <div style="width: 40px; height: 40px; background: var(--bg); border: 1px solid #e2e8f0; border-radius: 6px;"></div>
                        </div>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 15px;">Massachusetts Institute of Technology</div>
                        <div>
                            <span class="badge-impact" style="background:var(--accent);">RECOMMENDED</span>
                        </div>
                        <div style="margin-top: auto; padding-top: 15px;">
                            <span class="tag">Math</span><span class="tag">Research</span>
                        </div>
                    </div>
                    
                    <div class="dash-card" style="border-top-color: var(--primary);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; font-size: 18px; color: var(--primary); max-width: 80%;">Clark Scholars</h3>
                            <div style="width: 40px; height: 40px; background: var(--bg); border: 1px solid #e2e8f0; border-radius: 6px;"></div>
                        </div>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 15px;">Texas Tech University</div>
                        <div style="margin-top: auto; padding-top: 15px;">
                            <span class="tag">Research</span><span class="tag">STEM</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="right-col">
                <div class="right-panel">
                    <h3>🔥 Hot Programs <span style="font-size:10px; background: var(--mint); padding: 2px 6px; border-radius:4px;">Featured</span></h3>
                    <div class="mini-hot">
                        <div class="mini-hot-item">Counselors' Top Picks</div>
                        <div class="mini-hot-item">Best STEM Programs</div>
                        <div class="mini-hot-item">High Impact Research</div>
                        <div class="mini-hot-item">Free for Low-Income</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"""

# Write files
with open(r'c:\campberry_proj\campberry_layout_4.html', 'w', encoding='utf-8') as f:
    f.write(layout4)
with open(r'c:\campberry_proj\campberry_layout_5.html', 'w', encoding='utf-8') as f:
    f.write(layout5)
with open(r'c:\campberry_proj\campberry_layout_6.html', 'w', encoding='utf-8') as f:
    f.write(layout6)

print("Created Layouts 4, 5, 6 using the default system colors.")
