# Authentication Module Design Document

- Owner: PM/TM Agent
- Status: Draft
- Last Updated: 2026-03-04
- Related Links: [BACKEND_DESIGN.md](./BACKEND_DESIGN.md)

## 1. Background & Problem
The Campberry MVP currently uses an open API where user identity is mocked. To transition into a real service, we need to implement a robust, production-grade identity management system that handles authentication and authorization across different types of users (Student, Counselor, Admin).

## 2. Goals & Success Metrics
- **Goal:** Provide a secure, stateful login/registration process using Email & Password.
- **Goal:** Lay the foundation for email verification (stubbed for now).
- **Goal:** Implement secure session persistence across browser sessions without compromising security.
- **Goal:** Institute Role-Based Access Control (RBAC) to gate platform functionality based on user type.

## 3. Non-goals
- Google OAuth (deferred to a future iteration).
- Password reset via email logic (the API will be stubbed, but the actual SMTP integration is deferred).
- Rate-limiting at the reverse-proxy layer (will rely on application-level basic limits if needed, but not a priority yet).

## 4. Users & Scenarios
- **Unverified User:** Just registered, can log in but has restricted platform access until email is verified (if enforced).
- **STUDENT:** Can search programs, save programs, and create personal lists.
- **COUNSELOR:** Can create public curated lists and write expert commentary on programs.
- **ADMIN:** Can view user stats, ban users, and edit core program data.

## 5. Scope (MVP)
### Must (P0)
- User registration (Email/Password).
- User login (returns Access Token and Refresh Token).
- Authentication middleware to protect routes.
- RBAC middleware to restrict routes (e.g., only Counselors can publish public lists).
- Refresh Token API to silently issue new Access Tokens.
- Access tokens via `Authorization` header, Refresh tokens via `HttpOnly` cookie.

### Should (P1)
- Stubbed email verification endpoint.
- Logout API (invalidates/deletes refresh token).

## 6. User Flows (Critical Paths)
1. **Registration:** User enters email, name, password -> System hashes password, stores in DB, signals "verification email sent" (stubbed) -> User is redirected to login.
2. **Login:** User enters email and password -> System validates -> Issues short-lived Access Token (15 mins) and long-lived Refresh Token (7 days, set as HttpOnly cookie).
3. **API Access:** Front-end sends Access Token -> Backend validates JWT -> Route executes with `req.user` context.
4. **Token Refresh:** Access Token expires -> Front-end calls `/auth/refresh` -> Backend reads HttpOnly cookie -> Issues new Access Token.

## 7. Requirements & Acceptance Criteria
| ID | User Story | Requirement | Acceptance Criteria | Priority |
|---:|------------|-------------|---------------------|----------|
| R1 | As a user, I want to sign up securely. | Email/Password Registration. | Passwords must be hashed using `bcrypt` (salt rounds >= 10). Emails must be unique. | P0 |
| R2 | As a user, I want to stay logged in securely. | Refresh/Access Token mechanism. | Access Token expires in 15-60 minutes. Refresh Token expires in 7 days and is returned *only* in a Secure, HttpOnly cookie. | P0 |
| R3 | As an Admin/Counselor, I need specialized access. | RBAC Middleware. | Endpoints wrapped in `requireRole('ADMIN')` must return 403 Forbidden if accessed by a Student. | P0 |
| R4 | As a system, I need to verify user emails. | Email Verification Flow. | DB has `is_verified` flag. API provides `/auth/send-verification` and `/auth/verify` endpoints (logic stubbed). | P1 |

## 8. Technical Architecture
**Token Mechanism:**
- **Access JWT:** Signed with `JWT_SECRET`. Contains `{ userId: string, role: string }`. Sent by client in `Authorization: Bearer <token>`.
- **Refresh Token (Opaque or JWT):** Signed with `JWT_REFRESH_SECRET`. Stored as an `HttpOnly`, `SameSite=Strict`, `Secure` (in prod) cookie relative to `/api/v1/auth`. Stored in DB to allow revocation (e.g., logging out from all devices).

**Database Model Additions (Prisma):**
We will add a new table/model to track valid refresh tokens.

```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

// Add to User model
model User {
  // ... existing fields
  is_verified   Boolean @default(false)
  refreshTokens RefreshToken[]
}
```

## 9. API / Interface Design

| Endpoint | Method | Request | Response / Effect | Auth | Errors/Retry |
|----------|--------|---------|-------------------|------|--------------|
| `/api/v1/auth/register` | `POST` | `{ name, email, password, role? }` | `201 Created` / `{ message: "Registration successful" }` | None | `400` Validation, `409` Email exists |
| `/api/v1/auth/login` | `POST` | `{ email, password }` | `200 OK` / `{ accessToken, user }`, Sets HttpOnly Cookie `refreshToken` | None | `401` Unauthorized (wrong creds) |
| `/api/v1/auth/refresh` | `POST` | Cookie `refreshToken` | `200 OK` / `{ accessToken }` | Cookie | `401` Unauthenticated |
| `/api/v1/auth/logout` | `POST` | Cookie `refreshToken` | `200 OK` / Clears cookie, deletes token from DB | Token | - |
| `/api/v1/auth/verify-email` | `POST` | `{ token }` | `200 OK` / Sets `user.is_verified = true` (Stubbed email sending side) | None | `400` Invalid token |
| `/api/v1/me/profile` | `GET` | Bearer Token | `200 OK` / Return user details based on ID in token | Token | `401` Unauthorized |

## 10. Non-Functional Requirements
- **Security:** Passwords never logged. `HttpOnly` cookies strictly mitigate XSS for the long-lived refresh token. Access tokens mitigate CSRF because they are sent via header. 
- **Performance:** JWT verification requires no DB lookup for access tokens, keeping protected API calls extremely fast.
- **Scalability:** Stateless access tokens play well with distributed systems.

## 11. Delivery Plan & Milestones
- **Milestone 1:** Prisma schema updates (`RefreshToken`, `is_verified`), DB Migration.
- **Milestone 2:** Implement Registration, Password Hashing, Login, and JWT generation logic + middleware.
- **Milestone 3:** Implement Refresh Token endpoint and Cookie handling.
- **Milestone 4:** Front-end integration (AuthContext updates, Axios interceptors to handle 401s and auto-refresh).
- **Milestone 5:** Create testing accounts for all 3 roles and verify the RBAC guards on existing protected routes.
