import re
import os
from bs4 import BeautifulSoup

base_dir = r"c:\campberry_proj\campberry_frontend\src"
html_path = r"c:\campberry_proj\prototypes\campberry_full_L1.html"

with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, "html.parser")

# Extract CSS
style_tag = soup.find("style")
if style_tag:
    css_content = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

""" + style_tag.string
    with open(os.path.join(base_dir, "index.css"), "w", encoding="utf-8") as f:
        f.write(css_content)

def convert_to_jsx(tag_str):
    # simple replacements
    res = tag_str
    res = res.replace("class=", "className=")
    res = re.sub(r'onclick="showPage\(\'([^\']*)\'\)"', lambda m: f"onClick={{() => navigate('/{m.group(1)}')}}", res)
    res = res.replace("onclick=", "onClick=")
    res = re.sub(r'onmouseover="[^"]*"', '', res)
    res = re.sub(r'onmouseout="[^"]*"', '', res)
    res = res.replace("for=", "htmlFor=")
    res = res.replace("<!--", "{/*")
    res = res.replace("-->", "*/}")
    
    # replace style="..."
    def style_repl(match):
        style_str = match.group(1)
        styles = style_str.split(";")
        obj_strs = []
        for s in styles:
            if ":" not in s: continue
            k, v = s.split(":", 1)
            k = k.strip()
            v = v.strip().replace("'", "\\'")
            # camelCase the key
            k = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
            obj_strs.append(f"'{k}': '{v}'")
        return f"style={{{{{', '.join(obj_strs)}}}}}"
        
    res = re.sub(r'style="([^"]*)"', style_repl, res)
    # Self-closing tags
    res = re.sub(r'<(input|img|br|hr)([^>]*)>', lambda m: f"<{m.group(1)}{m.group(2)}{'/' if '/' not in m.group(2) else ''}>", res)
    return res

# Pages map id -> component Name
pages_map = {
    "page-home": "Home",
    "page-search": "Search",
    "page-program": "ProgramDetail",
    "page-lists": "Lists",
    "page-mylistdetail": "MyListDetail",
    "page-auth": "Auth"
}

# components
for page_div in soup.find_all("div", class_="page"):
    page_id = page_div.get("id")
    if page_id in pages_map:
        comp_name = pages_map[page_id]
        jsx_content = convert_to_jsx(str(page_div))
        
        # Write to src/pages/{comp_name}.jsx
        comp_code = f"""import React from 'react';
import {{ Link, useNavigate }} from 'react-router-dom';

export default function {comp_name}() {{
  const navigate = useNavigate();
  return (
    <>
      {jsx_content}
    </>
  );
}}
"""
        with open(os.path.join(base_dir, "pages", f"{comp_name}.jsx"), "w", encoding="utf-8") as f:
            f.write(comp_code)

# Navbar (Header)
header = soup.find("header", id="main-header")
if header:
    jsx_content = convert_to_jsx(str(header))
    comp_code = f"""import React from 'react';
import {{ Link, useNavigate }} from 'react-router-dom';

export default function Navbar() {{
  const navigate = useNavigate();
  return (
    <>
      {jsx_content}
    </>
  );
}}
"""
    with open(os.path.join(base_dir, "components", "Navbar.jsx"), "w", encoding="utf-8") as f:
        f.write(comp_code)

print("Conversion complete!")
