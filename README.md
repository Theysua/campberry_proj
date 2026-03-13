# Campberry

Campberry is a searchable opportunity database for education consultants and counselors. The current product focus is B2B research workflows: finding listings, tracking deadlines, opening official program websites, and saving reusable lists for client work.

---

## Current Product Priorities

- **Listings-first search** with filters for interests, grades, season, selectivity, and international eligibility
- **Deadline visibility** directly on search cards and detail pages
- **Deadline sorting** with both ascending and descending options
- **Official website links** surfaced in search results and detail views
- **Saved lists** for consultant research and client presentation workflows
- **Guest preview wall** after 10 unique program detail views for unauthenticated visitors

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
cd campberry_proj

# Frontend
cd campberry_frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173** (or the next available port).

### Backend Local Development

```bash
cd campberry_backend
cp .env.example .env
npm install
npm run db:up
npm run db:deploy
npm run db:seed
npm run dev
```

The backend API runs on **http://localhost:3001** by default and will fall back to the Docker Postgres URL from `.env.example` when an old local Prisma proxy URL is detected.

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy Frontend to GitHub Pages

The repository includes a GitHub Actions workflow that deploys only `campberry_frontend` to GitHub Pages.

Before using it, add a repository variable named `VITE_API_URL` that points to your public backend API base, for example:

```text
https://your-backend.example.com/api/v1
```

Without `VITE_API_URL`, the GitHub Pages site will build and deploy, but API-backed features such as search, auth, lists, and saved programs will not work in production.

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
    "costInfo": "$X,XXX / Financial aid available",
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

## Validation

Frontend:

```bash
cd campberry_frontend
npm run lint
npm run build
```

Backend:

```bash
cd campberry_backend
npm run typecheck
npm test
```

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
