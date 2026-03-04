# Campberry Backend Logic Design Document

- **Owner:** AI PM/TM / Dev Team
- **Status:** Review
- **Last Updated:** 2026-03-04
- **Related Links:** `C:\campberry_proj\docs\requirements_output.txt`, Frontend Codebase

---

## 1. Background & Problem
Currently, the Campberry frontend relies on static JSON data (`detailed_programs.json`). To evolve into a fully functional product, it needs a dynamic backend to serve up-to-date program information, authenticate users, and support personalized actions such as saving programs and creating curated lists.

## 2. Goals & Success Metrics
- **Core Goal:** Build out the backend using the established Express + Prisma + PostgreSQL stack to support the full user journey.
- **Success Criteria:**
  - Unauthenticated users can search, filter, and view programs and public lists perfectly matching the frontend UI requirements.
  - Users can register/login (Email/Password or Google Auth).
  - Authenticated users can save programs to their personal lists and create new curated lists.
  - The API structure mirrors the existing frontend data expectations to minimize frontend rewrite.

## 3. Non-goals (for MVP)
- Real-time chat or forum features.
- Payment gateways.
- Complex ML-driven recommendation algorithms (stick to basic filtering/search for MVP).
- The actual UI implementation of user reviews and ratings scoring (database models will be prepared, but UI integration deferred).

## 4. Users & Scenarios
- **Browsing Student (Unauthenticated):** Visits the site, searches for summer programs in "STEM", views details, then tries to click "Save".
- **Authenticating Student:** Is prompted to log in upon clicking "Save", completes Google Auth, and returns to find the program automatically saved to their list.
- **Counselor/Educator (Authenticated):** Logs in to build a curated "Top 10 Research Programs" list, adding their own commentary per program, and sets the list to public.

## 5. Scope (MVP)
### Must Have (P0)
- Database schema for Users, Programs, Lists, and ListItems.
- JWT-based authentication API (Register, Login, Google Auth placeholder).
- Read-only APIs for Programs (with complex filtering support) and Lists.
- Authenticated APIs for saving programs and managing custom lists.

### Should Have (P1)
- Automated replay of the user's intent (e.g., Save) after a login interrupt.
- Robust database seeding matching `detailed_programs.json` for immediate testing.

### Could Have (P2)
- Reviews and Ratings infrastructure APIs (Endpoints prepared but not deeply integrated into frontend).

## 6. User Flows (Critical Paths)
1. **The Discovery Loop:** User -> `/search` -> Enters filter params -> Backend `GET /api/programs` handles query (e.g., `interests=STEM&usStudentsOnly=false`) -> User views results.
2. **The "Progressive Disclosure" Auth Loop:** User clicks "Save" -> Frontend intercept -> Redirects to `/auth?redirectTo=/program/123&action=save` -> User Logs in -> Backend issues JWT -> Frontend replays the save action via `POST /api/my-lists/programs/123`.
3. **The Curator Loop:** Counselor -> `/account/lists/new` -> Sends `POST /api/lists` -> Adds Items via `POST /api/lists/{id}/items` specifying ordering and custom commentary.

## 7. Requirements & Acceptance Criteria

| ID | Requirement | Acceptance Criteria | Priority |
|---:|-------------|---------------------|----------|
| R1 | Program Read API | `GET /api/programs` returns paginated list matching frontend schema, handles filters (interest, grade, location). | P0 |
| R2 | User Auth API | `POST /api/auth/register`, `/api/auth/login` issue valid JWTs. | P0 |
| R3 | Save Program | `POST /api/user/saved-programs` requires JWT. Saves ID to user profile. | P0 |
| R4 | Curated List Creation | `POST /api/lists` creates a list. `POST /api/lists/:id/items` adds programs with optional commentary/text nodes. | P0 |
| R5 | Ratings / Reviews Model | DB schema includes tables for future reviews, impact/expert ratings are fields on the Program entity. | P1 |

## 8. Technical Architecture
**Approach:** RESTful JSON API using existing `campberry_backend` skeleton.
**Stack:**
- **Runtime:** Node.js (via `tsx`)
- **Framework:** Express.js 5.x
- **DB/ORM:** PostgreSQL + Prisma (v6)
- **Auth:** `jsonwebtoken`, `bcryptjs`, Google Auth Library.

**Key Decision:** The authentication state will use HTTP-Only secure cookies for JWT storage to prevent XSS attacks while supporting seamless session continuity.

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
  logoUrl                  String?
  interests                String[]  // Array of strings (e.g., "STEM")
  // Specialized Filtering Fields
  allowsInternational      Boolean   @default(true)
  usStudentsOnly           Boolean   @default(false)
  expertChoiceRating       String?   // "MOST_RECOMMENDED", "HIGHLY_RECOMMENDED"
  impactOnAdmissionsRating String?   // "MOST_HIGH_IMPACT", "HIGH_IMPACT"
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
```

## 10. API / Interface Design

| Endpoint | Method | Purpose | Auth Req | Notes / Error Handling |
|----------|--------|---------|----------|------------------------|
| `/api/auth/register` | POST | Create user | No | Validates email uniqueness. (409 Conflict) |
| `/api/auth/login` | POST | Authenticate user | No | Returns JWT in HttpOnly Cookie. (401 Unauthorized) |
| `/api/programs` | GET | List/Search programs | No | Paginated. Supports complex filters in query. |
| `/api/programs/:id`| GET | Program detail | No | Includes detailed `trpcData` JSON. |
| `/api/lists` | GET | Browse public lists | No | Paginated. |
| `/api/lists/:id` | GET | View public list | No | Includes `ListItem`s sorted by `order`. |
| `/api/user/save` | POST | Bookmark program | Yes | `programId` in body. Idempotent design. |
| `/api/user/lists`| POST | Create personal list| Yes | Body requires `title`. |

## 11. Non-Functional Requirements
- **Performance:** Program search `GET /api/programs` should respond in < 200ms. Leverage Postgres indexes on `interests`, `type`, and `title`.
- **Security:** Passwords hashed with `bcryptjs`. JWT stored in HttpOnly cookies to mitigate XSS. CORS properly configured to only allow the Vite frontend.
- **Resilience:** The backend should gracefully handle missing `trpcData` nodes without bringing down the UI.

## 12. Error Handling & Edge Cases
- **Unauthenticated Actions:** If a guest attempts `POST /api/user/save`, return `401 Unauthorized`. Frontend intercepts this and redirects to `<Login>?redirect=/save/id`.
- **Invalid Auth Token:** If token expired, return `403 Forbidden`. Frontend should trigger silent refresh or clear local auth state.
- **Idempotency on Save:** Calling the save endpoint twice for the same program should quietly return `200 OK` rather than a unique constraint error.

## 13. Test Plan
- **Backend Setup Validation:** Successfully spin up Postgres and run Prisma migrations.
- **API Functional Tests:** Use Postman or internal scripts to verify auth flow and program retrieval.
- **Frontend Integration:**
  1. Login via frontend UI.
  2. Navigate to search, apply "STEM" and "US Students Only=false" filter, verify correct API load.
  3. Click "Save", verify it sticks in database.

## 14. Milestones & Delivery Roadmap
1. **M1 (DB & Models):** Create Prisma schema, run migration, and write a Node.js seed script to ingest `detailed_programs.json` into the `Program` table.
2. **M2 (Auth Layer):** Implement Express Auth routes, JWT middleware, and cookie handling.
3. **M3 (Core API):** Build out the Program Search and Details endpoints.
4. **M4 (User API):** Implement Lists and Saved Programs endpoints.
5. **M5 (Frontend Wiring):** Update React code (API fetch hooks, interceptors) to point to `localhost`.

## 15. Open Questions
- To what extent do we want to validate the `trpcData` structure inside the DB, or do we treat it as an opaque JSON blob for the MVP? *(Assumption: Treat as opaque blob for maximum frontend compatibility initially.)*
- How is the browser geolocation passed to `/api/programs`? *(Assumption: Sent as `lat,lng` query params, and backend calculates rough distance.)*
