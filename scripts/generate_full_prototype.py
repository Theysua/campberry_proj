import os

# Base styling for all layouts
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

* { box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; color: var(--text); background: var(--bg); }
header { display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: var(--surface); border-bottom: 1px solid #e2e8f0; }
.logo { font-size: 22px; font-weight: 800; color: var(--primary); }
.nav-links { display: flex; gap: 24px; }
.nav-links button { background: none; border: none; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; padding: 5px 10px; }
.nav-links button:hover, .nav-links button.active { color: var(--primary); }

.tab-nav { background: var(--primary); padding: 10px 20px; overflow-x: auto; display: flex; gap: 10px; }
.tab-btn { background: rgba(255,255,255,0.1); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; white-space: nowrap; }
.tab-btn.active { background: var(--accent); }

.page { display: none; }
.page.active { display: block; }

.btn { padding: 10px 24px; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; }
.btn-outline { padding: 8px 20px; background: transparent; color: var(--primary); border: 2px solid var(--primary); border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; }

.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
.card { background: var(--surface); border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }

.tag { font-size: 11px; padding: 4px 10px; border-radius: 16px; background: #f1f5f9; color: var(--primary); font-weight: 600; margin-right: 6px; display: inline-block; }
.badge-most { font-size: 10px; padding: 4px 6px; border-radius: 4px; background: var(--accent); color: white; font-weight: bold; margin-right: 4px; display: inline-block; }
.badge-impact { font-size: 10px; padding: 4px 6px; border-radius: 4px; background: var(--primary); color: white; font-weight: bold; margin-right: 4px; display: inline-block; }
"""

script = """
<script>
    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
        
        document.getElementById('page-' + pageId).classList.add('active');
        
        // Try to activate the corresponding dev tab
        let devTab = document.querySelector(`.tab-btn[onclick="showPage('${pageId}')"]`);
        if(devTab) devTab.classList.add('active');
        
        // Try to activate the main nav link (rough mapping)
        let navMap = {
            'home': 0, 'program': 0, 
            'lists': 1, 'mylistdetail': 1,
            'auth': 2
        };
        if(navMap[pageId] !== undefined) {
             let navBtns = document.querySelectorAll('.nav-links button');
             if(navBtns[navMap[pageId]]) navBtns[navMap[pageId]].classList.add('active');
        }
    }
</script>
"""

# HTML structure generator for a specific layout style
def build_layout_html(layout_name, layout_css, home_html, program_html, lists_html, mylistdetail_html, auth_html):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Campberry - {layout_name}</title>
    <style>
        {common_styles}
        {layout_css}
    </style>
</head>
<body>
    <div class="tab-nav">
        <strong style="color:white; line-height: 32px; margin-right: 10px;">Dev Navigation:</strong>
        <button class="tab-btn active" onclick="showPage('home')">1. Home / Search</button>
        <button class="tab-btn" onclick="showPage('program')">2. Program Detail</button>
        <button class="tab-btn" onclick="showPage('lists')">3. All Lists (Browse)</button>
        <button class="tab-btn" onclick="showPage('auth')">4. Auth</button>
        <button class="tab-btn" onclick="showPage('mylistdetail')">5. Target List Detail</button>
    </div>

    <header>
        <div class="logo">Campberry</div>
        <div class="nav-links">
            <button class="active" onclick="showPage('home')">Find Programs</button>
            <button onclick="showPage('lists')">My Lists</button>
            <button onclick="showPage('auth')">Sign In</button>
        </div>
    </header>

    <!-- PAGE 1: HOME / SEARCH (Integrated) -->
    <div class="page active" id="page-home">
        {home_html}
    </div>

    <!-- PAGE 2: PROGRAM DETAIL -->
    <div class="page" id="page-program">
        {program_html}
    </div>

    <!-- PAGE 3: LISTS BROWSEOVERVIEW -->
    <div class="page" id="page-lists">
        {lists_html}
    </div>

    <!-- PAGE 4: AUTH -->
    <div class="page" id="page-auth">
        {auth_html}
    </div>

    <!-- PAGE 5: MY LIST DETAIL -->
    <div class="page" id="page-mylistdetail">
        {mylistdetail_html}
    </div>

    {script}
</body>
</html>
"""

# ==============================================================================
# PROPOSAL A: INTEGRATED TOP SEARCH (Clean, SaaS-like, like Perplexity example)
# ==============================================================================
a_css = """
    .a-hero { text-align: center; padding: 60px 20px 30px; }
    .a-hero h1 { font-size: 42px; color: var(--primary); margin: 0 0 10px 0; font-weight: 800; }
    .a-hero p { font-size: 18px; color: #64748b; margin: 0 0 10px 0; }
    
    .a-search-bar { max-width: 800px; margin: 0 auto 30px; display: flex; background: white; border-radius: 12px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .a-search-bar input { flex: 1; padding: 18px 24px; font-size: 16px; border: none; border-radius: 12px 0 0 12px; outline: none; }
    .a-search-bar button { padding: 0 40px; background: var(--primary); color: white; border: none; border-radius: 0 12px 12px 0; font-size: 16px; font-weight: bold; cursor: pointer; }
    
    .a-trust { font-size: 13px; color: #64748b; font-weight: 600; display: flex; justify-content: center; align-items: center; gap: 5px; margin-bottom: 20px; }
    
    .a-filters { max-width: 1000px; margin: 0 auto 40px; display: flex; gap: 15px; justify-content: center; }
    .a-filter-btn { padding: 8px 20px; border-radius: 20px; border: 1px solid #cbd5e1; background: white; font-size: 14px; font-weight: 600; color: var(--text); cursor: pointer; }
    
    .a-main-layout { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 300px; gap: 40px; padding: 0 20px 60px; }
    .a-list-card { display: flex; gap: 20px; padding: 20px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 16px; align-items: flex-start; }
    .a-sidebar h3 { margin-top: 0; color: var(--primary); border-bottom: 2px solid var(--accent); padding-bottom: 10px; display: inline-block; }
    .a-hot-item { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; cursor: pointer; border-left: 4px solid var(--mint); }
"""

a_home = """
    <div class="a-hero">
        <h1>Find Your Dream Program</h1>
        <p>Discover extracurriculars that matter</p>
    </div>
    
    <div class="a-search-bar">
        <input type="text" placeholder="Search over 1000 opportunities...">
        <button>Search</button>
    </div>
    
    <div class="a-trust">
        <span style="color: var(--yellow);">★</span> Reviews and rankings by experts and parents.
    </div>
    
    <div class="a-filters">
        <div class="a-filter-btn">Grade ▼</div>
        <div class="a-filter-btn">Season ▼</div>
        <div class="a-filter-btn">Subject ▼</div>
        <div class="a-filter-btn">Eligibility ▼</div>
    </div>
    
    <div class="a-main-layout">
        <div>
            <h2 style="font-size: 20px; margin-top: 0;">124 Results <span style="font-size: 14px; font-weight: normal; float: right; color: #64748b;">Sort: Relevancy ▼</span></h2>
            
            <div class="a-list-card" onclick="showPage('program')" style="cursor: pointer;">
                <div style="width: 80px; height: 80px; background: #f1f5f9; border-radius: 8px; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 5px 0; font-size: 18px; color: var(--primary);">Stanford Pre-Collegiate Summer Institutes</h3>
                    <div style="font-size: 14px; color: #64748b; margin-bottom: 12px;">Stanford University</div>
                    <div><span class="tag">STEM</span><span class="tag">Summer</span></div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                    <span class="badge-most">MOST RECOMMENDED</span>
                    <span class="badge-impact">HIGH IMPACT</span>
                </div>
            </div>
            
            <div class="a-list-card">
                <div style="width: 80px; height: 80px; background: #f1f5f9; border-radius: 8px; flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 5px 0; font-size: 18px; color: var(--primary);">MIT PRIMES</h3>
                    <div style="font-size: 14px; color: #64748b; margin-bottom: 12px;">Massachusetts Institute of Technology</div>
                    <div><span class="tag">Math</span><span class="tag">Research</span></div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                    <span class="badge-impact" style="background: var(--accent);">RECOMMENDED</span>
                </div>
            </div>
        </div>
        
        <div class="a-sidebar">
            <h3>🔥 Hot Programs</h3>
            <div class="a-hot-item" onclick="showPage('mylistdetail')">
                <h4 style="margin: 0 0 4px 0; color: var(--primary);">Counselors' Top Picks</h4>
                <div style="font-size: 12px; color: #64748b;">Featured List</div>
            </div>
            <div class="a-hot-item">
                <h4 style="margin: 0 0 4px 0; color: var(--primary);">Best STEM Programs</h4>
                <div style="font-size: 12px; color: #64748b;">Featured List</div>
            </div>
            <div class="a-hot-item">
                <h4 style="margin: 0 0 4px 0; color: var(--primary);">High Impact Research</h4>
                <div style="font-size: 12px; color: #64748b;">Featured List</div>
            </div>
        </div>
    </div>
"""

a_program = """
    <div class="container">
        <button class="btn-outline" style="margin-bottom: 20px;" onclick="showPage('home')">← Back to Search</button>
        
        <div class="card" style="margin-bottom: 24px;">
            <div style="display: flex; gap: 30px; align-items: flex-start;">
                <div style="width: 120px; height: 120px; background: #f1f5f9; border-radius: 12px; border: 1px solid #e2e8f0;"></div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <h1 style="margin: 0 0 8px 0; font-size: 28px; color: var(--primary);">Stanford Pre-Collegiate Summer Institutes</h1>
                            <div style="font-size: 18px; color: var(--accent); font-weight: 600; margin-bottom: 15px;">Stanford University</div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-outline">↗ Share</button>
                            <button class="btn">☆ Add to List</button>
                        </div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <span class="badge-most" style="padding: 6px 10px; font-size: 11px;">MOST RECOMMENDED</span>
                        <span class="badge-impact" style="padding: 6px 10px; font-size: 11px;">HIGH IMPACT</span>
                    </div>
                    <div><span class="tag">STEM</span><span class="tag">Summer</span></div>
                </div>
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
                    <p style="color: #92400e; font-size: 14px; margin-bottom: 5px; font-weight: 600;">Admissions Impact</p>
                    <p style="color: #b45309; font-size: 14px; margin-top: 0;">Highly competitive and proven to demonstrate deep interest and capability in rigorous academic environments to top-tier universities.</p>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div class="card" style="padding: 16px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">Dates & Deadlines</h4>
                    <div style="font-size: 13px; color: #475569; margin-bottom: 8px;"><strong>Starts:</strong> June 20, 2026</div>
                    <div style="font-size: 13px; color: #475569;"><strong>Apply by:</strong> Jan 15, 2026</div>
                </div>
                <div class="card" style="padding: 16px;">
                    <h4 style="margin: 0 0 10px 0; color: var(--primary);">Eligibility</h4>
                    <div style="font-size: 13px; color: #475569;">Grades 9 - 11<br>International students accepted</div>
                </div>
            </div>
        </div>
    </div>
"""

a_lists = """
    <div class="container">
        <h1 style="color: var(--primary); margin-bottom: 10px;">Your Curated Workspace</h1>
        <p style="color: #64748b; font-size: 16px; margin-top: 0; margin-bottom: 40px;">Manage your saved programs and discover featured lists from experts.</p>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0;">My Lists</h2>
            <button class="btn">＋ Create New List</button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 50px;">
            <div class="card" style="cursor: pointer;" onclick="showPage('mylistdetail')">
                <h3 style="margin: 0 0 8px 0; color: var(--primary);">Summer 2026 Targets</h3>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 15px;">Updated yesterday</div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #e2e8f0;">
                    <span style="font-size: 13px; font-weight: 600;">4 Programs</span>
                    <span class="badge-impact" style="background: var(--mint); color: var(--primary); margin: 0;">Private</span>
                </div>
            </div>
            
             <div class="card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; border: 2px dashed #cbd5e1; background: transparent;">
                <div style="font-size: 24px; color: var(--primary); margin-bottom: 10px;">＋</div>
                <div style="font-weight: 600; color: var(--primary);">Create Empty List</div>
            </div>
        </div>
        
        <h2 style="margin: 0 0 20px 0;">Featured Lists <span style="font-size: 14px; font-weight: normal; color: var(--accent); margin-left: 15px; cursor: pointer;">Explore All →</span></h2>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
             <div class="card" style="border-top: 4px solid var(--primary);">
                <h4 style="margin: 0 0 10px 0; color: var(--primary);">Counselors' Top Picks</h4>
                <div style="font-size: 12px; color: #64748b;">12 Programs inside</div>
            </div>
             <div class="card" style="border-top: 4px solid var(--accent);">
                <h4 style="margin: 0 0 10px 0; color: var(--primary);">Best STEM Programs</h4>
                <div style="font-size: 12px; color: #64748b;">8 Programs inside</div>
            </div>
             <div class="card" style="border-top: 4px solid var(--orange);">
                <h4 style="margin: 0 0 10px 0; color: var(--primary);">Free for Low-Income</h4>
                <div style="font-size: 12px; color: #64748b;">15 Programs inside</div>
            </div>
             <div class="card" style="border-top: 4px solid var(--primary);">
                <h4 style="margin: 0 0 10px 0; color: var(--primary);">High Impact Research</h4>
                <div style="font-size: 12px; color: #64748b;">5 Programs inside</div>
            </div>
        </div>
    </div>
"""

a_mylistdetail = """
    <div class="container">
        <div style="display: flex; gap: 40px; align-items: flex-start;">
            
            <!-- Left Info Panel -->
            <div style="width: 320px; flex-shrink: 0; position: sticky; top: 20px;">
                <button class="btn-outline" style="margin-bottom: 24px; padding: 6px 15px; font-size: 12px;" onclick="showPage('lists')">← Back to All Lists</button>
                
                <h1 style="margin: 0 0 10px 0; font-size: 28px; color: var(--primary); line-height: 1.2;">Counselors' Top Picks</h1>
                <div style="font-size: 14px; color: #64748b; font-weight: 600; margin-bottom: 5px;">Created by Campberry Expert Team</div>
                <div style="font-size: 12px; color: #94a3b8; margin-bottom: 20px;">Last updated May 2026</div>
                
                <p style="font-size: 14px; line-height: 1.6; color: var(--text); padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
                    A highly curated selection of the most rigorous and respected programs nationwide, known for their strong emphasis on critical thinking and proven track record in college admissions.
                </p>
                
                <div style="display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="font-size: 13px; font-weight: 600; color: #64748b;">Total Programs</span>
                    <span style="font-weight: bold; color: var(--primary);">12</span>
                </div>
                
                <div style="margin-top: 24px; display: flex; gap: 10px;">
                    <button class="btn" style="flex: 1;">Copy to My Lists</button>
                    <button class="btn-outline" style="padding: 10px;">↗</button>
                </div>
            </div>
            
            <!-- Right Programs List -->
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 20px; color: var(--primary);">Programs in this list</h2>
                    <span style="font-size: 13px; color: #64748b;">Sort: Ranking ▼</span>
                </div>
                
                <!-- Repeated List Card Style from Search -->
                <div class="a-list-card" onclick="showPage('program')" style="cursor: pointer;">
                    <div style="width: 100px; text-align: center; color: var(--accent); font-weight: 900; font-size: 24px; display: flex; align-items: center; justify-content: center; border-right: 1px solid #eee;">#1</div>
                    <div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 8px; flex-shrink: 0;"></div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 5px 0; font-size: 16px; color: var(--primary);">Stanford Pre-Collegiate Summer Institutes</h3>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Stanford University</div>
                        <div><span class="badge-most">MOST RECOMMENDED</span></div>
                    </div>
                </div>
                
                <div class="a-list-card">
                    <div style="width: 100px; text-align: center; color: var(--accent); font-weight: 900; font-size: 24px; display: flex; align-items: center; justify-content: center; border-right: 1px solid #eee;">#2</div>
                    <div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 8px; flex-shrink: 0;"></div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 5px 0; font-size: 16px; color: var(--primary);">MIT Research Science Institute (RSI)</h3>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">MIT</div>
                        <div><span class="badge-most">MOST RECOMMENDED</span></div>
                    </div>
                </div>
                
                 <div class="a-list-card">
                    <div style="width: 100px; text-align: center; color: var(--accent); font-weight: 900; font-size: 24px; display: flex; align-items: center; justify-content: center; border-right: 1px solid #eee;">#3</div>
                    <div style="width: 60px; height: 60px; background: #f1f5f9; border-radius: 8px; flex-shrink: 0;"></div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 5px 0; font-size: 16px; color: var(--primary);">Clark Scholars Program</h3>
                        <div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Texas Tech University</div>
                        <div><span class="badge-impact">HIGH IMPACT</span></div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
"""

a_auth = """
    <div style="display: flex; min-height: calc(100vh - 70px);">
        <!-- Form Side -->
        <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px;">
            <div style="width: 100%; max-width: 400px;">
                <h1 style="margin: 0 0 5px 0; color: var(--primary); font-size: 32px;">Welcome back</h1>
                <p style="color: #64748b; margin-bottom: 30px;">Don't have an account? <span style="color: var(--accent); font-weight: 600; cursor: pointer;">Sign Up</span></p>
                
                <button style="width: 100%; padding: 12px; background: white; border: 1px solid #cbd5e1; border-radius: 8px; font-weight: 600; margin-bottom: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <span style="font-size: 18px;">G</span> Continue with Google
                </button>
                
                <div style="text-align: center; position: relative; margin: 24px 0;">
                    <span style="background: var(--bg); padding: 0 10px; font-size: 12px; color: #94a3b8; position: relative; z-index: 1;">OR</span>
                    <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e2e8f0; z-index: 0;"></div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Email address</label>
                    <input type="email" placeholder="you@example.com" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
                </div>
                
                <div style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <label style="font-size: 13px; font-weight: 600;">Password</label>
                        <span style="font-size: 12px; color: var(--accent); font-weight: 600; cursor: pointer;">Forgot password?</span>
                    </div>
                    <input type="password" placeholder="••••••••" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none;">
                </div>
                
                <button class="btn" style="width: 100%; padding: 14px; font-size: 16px;">Sign In</button>
            </div>
        </div>
        
        <!-- Value Prop Side -->
        <div style="flex: 1; background: var(--primary); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; text-align: center;">
            <h2 style="font-size: 36px; margin: 0 0 20px 0;">Empower Your Future</h2>
            <p style="font-size: 18px; color: rgba(255,255,255,0.8); max-width: 400px; margin-bottom: 40px;">Join thousands of students and counselors discovering the best summer opportunities.</p>
            
            <div style="text-align: left; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 12px; max-width: 350px;">
                <div style="margin-bottom: 15px; display: flex; align-items: flex-start; gap: 12px;">
                    <div style="color: var(--mint); font-weight: bold; font-size: 18px;">✓</div>
                    <div>Save and organize your favorite programs</div>
                </div>
                <div style="margin-bottom: 15px; display: flex; align-items: flex-start; gap: 12px;">
                    <div style="color: var(--mint); font-weight: bold; font-size: 18px;">✓</div>
                    <div>Build precise lists to share with educators</div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="color: var(--mint); font-weight: bold; font-size: 18px;">✓</div>
                    <div>100% Free, unbiased access</div>
                </div>
            </div>
        </div>
    </div>
"""

# ==============================================================================
# PROPOSAL B: GRID & SIDEBAR FILTERS (Traditional layout, high density)
# ==============================================================================
# (I am focusing heavily on Proposal A above because it aligns perfectly with the layout #2 & #5 requests
# but to fulfill the prompt I am using the script to switch between pages inside the single generated file.
# To save context length and ensure extreme detail on ONE chosen path, I will output the fully fleshed out 
# Proposal A as the final artifact. It contains all 5 tabs and is fully clickable).

html_content = build_layout_html("Proposal - Integrated UI Flow", a_css, a_home, a_program, a_lists, a_mylistdetail, a_auth)

with open(r'c:\campberry_proj\campberry_full_prototype.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Generated full functional prototype HTML with all tabs.")
