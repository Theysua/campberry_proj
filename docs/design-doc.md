# Campberry Backend Logic Design Document

- **Owner:** AI PM/TM / Dev Team
- **Status:** Review
- **Last Updated:** 2026-03-13
- **Related Links:** `C:\campberry_proj\docs\requirements_output.txt`, Frontend Codebase

---

## 1. Background & Problem
Currently, the Campberry frontend relies on static JSON data (`detailed_programs.json`). The next product phase prioritizes a B2B workflow for consultants, centered on high-signal listings, visible deadlines, and direct links to the official company or school website. To evolve into a fully functional product, the backend must serve up-to-date program information, gate deeper usage behind registration after a guest preview threshold, and support persistent saved lists for research and client presentations.

## 2. Goals & Success Metrics
- **Core Goal:** Build out the backend using the established Express + Prisma + SQLite stack to support a consultant-first B2B discovery and curation workflow.
- **Success Criteria:**
  - Guests can search and preview up to 10 activities before registration is required for continued use.
  - Search results emphasize the three primary functions: listings, deadlines, and official website links.
  - Users can register/login (Email/Password or Google Auth) once they hit the guest preview threshold or try to save content.
  - Authenticated consultants can save programs into reusable lists for internal research and client-facing presentations.
  - Results can be ranked by deadline in both ascending and descending order.
  - The API structure mirrors the existing frontend data expectations to minimize frontend rewrite.

## 3. Non-goals (for MVP)
- Real-time chat or forum features.
- Payment gateways in MVP, although the registration wall should be designed so charging can be introduced later.
- Complex ML-driven recommendation algorithms (stick to basic filtering/search for MVP).
- The actual UI implementation of user reviews and ratings scoring (database models will be prepared, but UI integration deferred).
- Free-related positioning, copy, badges, or filters as a product feature.
- Impact-on-admissions rating as a core filter or sorting dimension.

## 4. Users & Scenarios
- **Guest Consultant (Unauthenticated):** Searches listings, reviews deadlines, and opens activity details during an initial preview period. After 10 viewed activities, the user must register to continue.
- **Consultant After Registration:** Registers after hitting the preview limit, returns to the same workflow, and saves programs into named lists.
- **Counselor/Educator (Authenticated):** Builds curated research lists for internal analysis or client delivery, adding commentary where needed and optionally publishing selected lists.

## 5. Scope (MVP)
### Must Have (P0)
- Database schema for Users, Programs, Lists, and ListItems.
- JWT-based authentication API (Register, Login, Google Auth placeholder).
- Read-only APIs for Programs (with complex filtering support), including deadline metadata and official website links.
- Guest usage tracking that enforces a registration wall after 10 activity detail views.
- Authenticated APIs for saving programs and managing custom lists.
- Deadline sorting with explicit ascending and descending options.

### Should Have (P1)
- Automated replay of the user's intent (e.g., Save) after a login interrupt.
- Robust database seeding matching `detailed_programs.json` for immediate testing.

### Could Have (P2)
- Reviews and Ratings infrastructure APIs (Endpoints prepared but not deeply integrated into frontend).

## 6. User Flows (Critical Paths)
1. **The Discovery Loop:** User -> `/search` -> Enters filter params -> Backend `GET /api/programs` handles query (e.g., `interests=STEM&sortBy=deadline&sortOrder=asc`) -> User views listings with visible deadlines and official website links.
2. **The Guest Limit Loop:** Guest opens activity details -> Backend/session usage counter increments -> After the 10th viewed activity, the next gated action or detail view redirects to `/auth?redirectTo=/search&reason=preview_limit`.
3. **The Save-and-Resume Loop:** User clicks "Save" -> Frontend intercepts if unauthenticated -> Redirects to `/auth?redirectTo=/program/123&action=save` -> User logs in -> Backend issues JWT -> Frontend replays the save action via `POST /api/user/lists/{id}/items`.
4. **The Curator Loop:** Consultant -> `/account/lists/new` -> Sends `POST /api/lists` -> Adds Items via `POST /api/lists/{id}/items` specifying ordering and optional commentary -> Reuses the saved list for research or client presentation.

## 7. Requirements & Acceptance Criteria

| ID | Requirement | Acceptance Criteria | Priority |
|---:|-------------|---------------------|----------|
| R1 | Program Read API | `GET /api/programs` returns a paginated listing feed matching frontend schema, including next relevant deadline and official website URL, and handles filters (interest, grade, location). | P0 |
| R2 | User Auth API | `POST /api/auth/register`, `/api/auth/login` issue valid JWTs. | P0 |
| R3 | Guest Preview Limit | Guests may view up to 10 activities. Further activity-detail access and save/list actions require registration, while preserving the intended redirect target. | P0 |
| R4 | Save Program & List Workspace | Authenticated users can save programs into reusable lists for research or client presentations. `POST /api/lists` creates a list and `POST /api/lists/:id/items` adds programs with optional commentary/text nodes. | P0 |
| R5 | Deadline Ranking | `GET /api/programs` supports `sortBy=deadline` with `sortOrder=asc|desc`, and the frontend exposes both ascending and descending options. | P0 |
| R6 | No Free / Impact Positioning | Product UI and API do not expose free-related filters, badges, or impact-on-admissions filters as core Campberry features. | P1 |

## 8. Technical Architecture
**Approach:** RESTful JSON API using existing `campberry_backend` skeleton.
**Stack:**
- **Runtime:** Node.js (via `tsx`)
- **Framework:** Express.js 5.x
- **DB/ORM:** SQLite + Prisma (v6)
- **Auth:** `jsonwebtoken`, `bcryptjs`, Google Auth Library.

**Key Decision:** The authentication state will use HTTP-Only secure cookies for JWT storage to prevent XSS attacks while supporting seamless session continuity. An anonymous session cookie will also be used to track guest activity-detail views for preview-limit enforcement before registration.

## 9. Data Model
*Prisma Schema Outline:*

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?
  name          String?
  avatarUrl     String?
  role          String    @default("STUDENT") // STUDENT, COUNSELOR, ADMIN
  lists         List[]
  savedPrograms SavedProgram[]
  createdAt     DateTime  @default(now())
}

model Program {
  id                       String    @id @default(uuid())
  title                    String
  org                      String
  description              String?
  type                     String    // Competition, Summer Program, etc.
  officialWebsiteUrl       String?
  logoUrl                  String?
  interests                String[]  // Array of strings (e.g., "STEM")
  nextDeadlineAt           DateTime?
  // Specialized Filtering Fields
  allowsInternational      Boolean   @default(true)
  usStudentsOnly           Boolean   @default(false)
  expertChoiceRating       String?   // "MOST_RECOMMENDED", "HIGHLY_RECOMMENDED"
  // JSON field to dump the complex detailed mapping for MVP compatibility
  trpcData                 Json
  
  // Relations
  listItems                ListItem[]
  savedBy                  SavedProgram[]
}

model List {
  id          String     @id @default(uuid())
  title       String
  description String?
  isPublic    Boolean    @default(true)
  authorId    String
  author      User       @relation(fields: [authorId], references: [id])
  items       ListItem[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model ListItem {
  id               String   @id @default(uuid())
  listId           String
  list             List     @relation(fields: [listId], references: [id], onDelete: Cascade)
  programId        String?  // Nullable if it's purely a text entry
  program          Program? @relation(fields: [programId], references: [id])
  order            Int
  type             String   @default("PROGRAM") // PROGRAM or TEXT_ONLY
  authorCommentary String?  // Specific markup/text the author wrote for this item
}

model SavedProgram {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  programId String
  program   Program  @relation(fields: [programId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, programId])
}

model GuestUsage {
  id                  String   @id @default(uuid())
  sessionId           String   @unique
  activityViewsCount  Int      @default(0)
  lastViewedProgramId String?
  updatedAt           DateTime @updatedAt
  createdAt           DateTime @default(now())
}
```

## 10. API / Interface Design

| Endpoint | Method | Purpose | Auth Req | Notes / Error Handling |
|----------|--------|---------|----------|------------------------|
| `/api/auth/register` | POST | Create user | No | Validates email uniqueness. (409 Conflict) |
| `/api/auth/login` | POST | Authenticate user | No | Returns JWT in HttpOnly Cookie. (401 Unauthorized) |
| `/api/programs` | GET | List/Search programs | No | Paginated. Supports complex filters, includes deadline + official website link, and accepts `sortBy=deadline&sortOrder=asc|desc`. |
| `/api/programs/:id`| GET | Program detail | No | Includes detailed `trpcData` JSON. |
| `/api/guest/usage` | GET | Get guest preview usage | No | Returns viewed count and remaining preview quota. |
| `/api/lists` | GET | Browse public lists | No | Paginated. |
| `/api/lists/:id` | GET | View public list | No | Includes `ListItem`s sorted by `order`. |
| `/api/user/save` | POST | Bookmark program | Yes | `programId` in body. Idempotent design. |
| `/api/user/lists`| POST | Create personal list| Yes | Body requires `title`. |

## 11. Non-Functional Requirements
- **Performance:** Program search `GET /api/programs` should respond in < 200ms. Leverage SQLite indexes on `interests`, `type`, `title`, and `nextDeadlineAt`.
- **Security:** Passwords hashed with `bcryptjs`. JWT stored in HttpOnly cookies to mitigate XSS. CORS properly configured to only allow the Vite frontend.
- **Resilience:** The backend should gracefully handle missing `trpcData` nodes without bringing down the UI.
- **Monetization Readiness:** The preview-limit logic must be feature-flag friendly so a paid plan can be introduced later without reworking the core auth flow.

## 12. Error Handling & Edge Cases
- **Unauthenticated Actions:** If a guest attempts `POST /api/user/save`, return `401 Unauthorized`. Frontend intercepts this and redirects to `<Login>?redirect=/save/id`.
- **Guest Preview Limit Reached:** If an unauthenticated guest exceeds 10 viewed activities, return `403 Forbidden` with reason `PREVIEW_LIMIT_REACHED`; frontend routes to auth and preserves context.
- **Invalid Auth Token:** If token expired, return `403 Forbidden`. Frontend should trigger silent refresh or clear local auth state.
- **Idempotency on Save:** Calling the save endpoint twice for the same program should quietly return `200 OK` rather than a unique constraint error.
- **Missing Website Link:** If a program has no official website URL, the API returns `null` and the frontend hides the external-link CTA instead of rendering a broken action.

## 13. Test Plan
- **Backend Setup Validation:** Successfully spin up SQLite database schema and run Prisma migrations.
- **API Functional Tests:** Use Postman or internal scripts to verify auth flow and program retrieval.
- **Frontend Integration:**
  1. Login via frontend UI.
  2. Navigate to search, apply "STEM" and "US Students Only=false" filter, verify correct API load.
  3. Click "Save", verify it sticks in database.
  4. View 10 activity detail pages while logged out, then verify the 11th gated action redirects to auth.
  5. Sort by deadline ascending, then descending, and verify order changes correctly.

## 14. Milestones & Delivery Roadmap
1. **M1 (DB & Models):** Create Prisma schema, run migration, and write a Node.js seed script to ingest `detailed_programs.json` into the `Program` table.
2. **M2 (Auth Layer):** Implement Express Auth routes, JWT middleware, guest usage tracking, and cookie handling.
3. **M3 (Core API):** Build out the Program Search and Details endpoints, including deadline sorting and website-link fields.
4. **M4 (User API):** Implement Lists and Saved Programs endpoints for consultant workflows.
5. **M5 (Frontend Wiring):** Update React code (API fetch hooks, interceptors) to point to `localhost` and honor the preview-limit redirect flow.

## 15. Open Questions
- To what extent do we want to validate the `trpcData` structure inside the DB, or do we treat it as an opaque JSON blob for the MVP? *(Assumption: Treat as opaque blob for maximum frontend compatibility initially.)*
- How is the browser geolocation passed to `/api/programs`? *(Assumption: Sent as `lat,lng` query params, and backend calculates rough distance.)*
- Should the 10-activity preview limit be based on detail-page opens only, or also on card expansions/website clicks? *(Assumption: Count detail-page opens only to keep enforcement predictable.)*
- Will saved lists eventually support export (PDF/shareable client view), or is persistence sufficient for the current phase? *(Assumption: Persistence is in scope now; export/presentation formatting is a later enhancement.)*
