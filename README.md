# 🍓 Campberry

> **The most comprehensive database of extracurricular & enrichment opportunities for high schoolers — curated by college admissions experts.**

Campberry helps students discover, compare, and save learning opportunities (summer programs, competitions, research internships, and more) that strengthen their college applications. Counselors and educators can create and publish curated program lists with their own expert commentary.

---

## ✨ Features

### For Students
- **Smart Search** — Filter programs by interest, location, season, and eligibility (international students supported by default)
- **Geolocation Filter** — Find programs near you using the browser's Geolocation API
- **Expert Ratings** — Programs are rated with two systems:
  - 🏅 **Experts' Choice** — `MOST` / `HIGHLY` recommended by education consultants
  - 🎓 **Impact on Admissions** — `MOST HIGH IMPACT` / `HIGH IMPACT` for elite college review
- **Program Detail Pages** — Full program info including logo, tags, dates, cost, eligibility, external reviews, and expert guidance
- **Save to My Lists** — Bookmark programs into personal lists for easy tracking

### For Counselors & Educators
- **Curated Lists** — Create and publish lists of recommended programs with author commentary and interspersed notes
- **Expert Guidance** — Per-program guidance notes covering time commitment, scope, competition type, and awards are displayed on detail pages

### Platform
- **2,100+ Opportunities** — Competitions, summer programs, school-year programs, internships, and more
- **No paywall** — Free to use, forever
- **100% data privacy** — No student data sold to programs

---

## 🗂 Project Structure

```
campberry_proj/
├── campberry_frontend/          # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Search.jsx         # Search & filter page
│   │   │   ├── ProgramDetail.jsx  # Individual program detail page
│   │   │   ├── Lists.jsx          # Browse curated lists
│   │   │   ├── ListDetail.jsx     # Public list detail with commentary
│   │   │   ├── MyLists.jsx        # User's saved lists
│   │   │   ├── MyListDetail.jsx   # User's list detail with commentary
│   │   │   └── Mission.jsx        # About/mission page
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Top navigation with Campberry logo
│   │   │   ├── Footer.jsx         # Footer with links
│   │   │   ├── ProgramCard.jsx    # Program card for search results
│   │   │   ├── ListCard.jsx       # List card for browse view
│   │   │   ├── Badge.jsx          # Rating badges (Experts' Choice, Impact)
│   │   │   └── Pill.jsx           # Removable interest tag
│   │   ├── data/
│   │   │   ├── detailed_programs.json  # Core program data (~50 programs)
│   │   │   └── programs.json           # Lightweight program index
│   │   ├── App.jsx                # Router setup
│   │   └── index.css              # Global styles & design tokens
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── campberry_wireframes.html        # Original wireframes reference
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Theysua/campberry_proj.git
cd campberry_proj/campberry_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173** (or the next available port).

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎨 Design System

### Brand Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Deep Navy | `#011936` | Primary text, backgrounds |
| Campberry Red | `#892233` | Buttons, links, accents |
| Mint | `#ddfff7` | Highlights, hover states |
| Amber | `#fade41` | New badges, CTA accents |
| Orange | `#ff751f` | Experts' Choice badges |

### Badge Types
| Badge | Style | Meaning |
|-------|-------|---------|
| `MOST` | Deep Red | Experts' Choice — Most Recommended |
| `HIGHLY` | Orange | Experts' Choice — Highly Recommended |
| `IMPACT_MOST` | Deep Navy | Most High Impact on Admissions |
| `IMPACT_HIGHLY` | Navy/70% | High Impact on Admissions |
| `NEW` | Amber | Recently added |

---

## 📊 Data Schema

Each program in `detailed_programs.json` follows this structure:

```json
{
  "id": "uuid",
  "title": "Program Name",
  "org": "Organizing Institution",
  "description": "Short description...",
  "trpcData": {
    "name": "Full Program Name",
    "type": "Competition / Summer Program / ...",
    "provider": { "name": "Institution Name" },
    "logo": { "url": "https://..." },
    "interests": [{ "name": "STEM" }, { "name": "Research" }],
    "sessions": [{ "startDate": "...", "endDate": "...", "location": { "name": "..." } }],
    "deadlines": [{ "date": "...", "description": "Application Deadline" }],
    "eligibleGrades": ["9", "10", "11", "12"],
    "onlyUsCitizens": false,
    "onlyUsResidents": false,
    "isHighlySelective": true,
    "expertsChoiceRating": "MOST_RECOMMENDED",
    "costInfo": "Free / $X,XXX / Financial aid available",
    "admissionInfo": "Application details...",
    "eligibilityInfo": "Who can apply...",
    "additionalInfo": "Expert guidance: time commitment, scope, awards...",
    "externalReviews": [
      {
        "title": "Review Title",
        "content": "Review text...",
        "authorName": "Name",
        "authorDescription": "Alumni / Writer",
        "date": "2024-01-01T00:00:00.000Z",
        "url": "https://source.com"
      }
    ]
  }
}
```

---

## 🔍 Key Pages & URLs

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, Top Searches, Featured Lists, Ratings |
| Search | `/search` | Full search with filters |
| Program Detail | `/program/:id` | Logo, About, Expert Guidance, External Reviews, Ratings |
| Browse Lists | `/lists` | Curated lists from counselors |
| List Detail | `/lists/:id` | Programs + Author Commentary + Author Notes |
| My Lists | `/my-lists` | Personal saved lists |
| My List Detail | `/my-lists/:id` | Personal list with commentary |
| Mission | `/mission` | About Campberry |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Icons | Lucide React |
| Data | Static JSON (ready for API swap) |
| Location | Browser Geolocation API |

---

## 📋 Requirements Implemented

Based on product requirements spec (`Copy of Copy of Campberry_Requirements.xlsx`):

- [x] Only show programs tagged "allows international students" by default
- [x] Add "US Students Only" toggle filter
- [x] Location uses Geolocation API
- [x] In addition to "expert choice", add Impact on Admissions with "Most" / "Highly" ratings
- [x] Author commentary is unique to List Detail pages
- [x] Short paragraph as list description is OK
- [x] Centered card layout, light-blue background
- [x] No need to add financial accessibility grade
- [x] No need for Free / 1-on-1 filter tags
- [x] No video on program detail pages — logo only
- [x] Default sort: Relevancy
- [x] Mobile nav may collapse to hamburger menu
- [x] Redirects to login if unauthenticated (My Lists)
- [x] Compare page details TBD

---

## 🗺 Roadmap

- [ ] Backend API integration (replace static JSON)
- [ ] User authentication (login / signup)
- [ ] Program comparison page
- [ ] AI-powered search and recommendations
- [ ] Student reviews and ratings
- [ ] Notification system for upcoming deadlines
- [ ] Mobile app

---

## 📄 License

Internal prototype — not for public distribution.

© 2026 Campberry. Built by teens and educators, for teens and educators.
