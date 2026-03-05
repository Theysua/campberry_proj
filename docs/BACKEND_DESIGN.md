# Campberry: Backend Development Design

This document outlines the complete backend architecture, database schema, and API design required to transition the Campberry project from a static front-end prototype to a fully functional, dynamic web application.

## 1. System Architecture

We will adopt a monolithic architecture for simplicity and rapid development, which is well-suited for the current scale of the project. The backend will be a central server that handles all business logic, data processing, and communication with the database.

*   **Tech Stack:**
    *   **Runtime:** Node.js
    *   **Framework:** Express.js (or a similar robust framework like NestJS for more structure)
    *   **Database:** SQLite (Chosen for simplicity, zero maintenance, and high read performance suitable for deployment on a persistent VPS)
    *   **ORM:** Prisma (for its type-safety, intuitive schema definition, and migration management)
*   **Authentication:** Token-based authentication using JSON Web Tokens (JWT).
*   **Deployment:** The application will be deployed as a persistent service on a traditional VPS (e.g., DigitalOcean, AWS EC2, Railway with permanent disks) to prevent data loss from the local SQLite `dev.db`. Serverless environments (like Vercel) are avoided due to ephemeral storage.

## 2. Database Schema

The schema is designed to be relational, normalizing the nested JSON data from the prototype into a structured and scalable format. All table and column names will use `snake_case`.

### Core Tables

**`users`**
Stores user information for authentication and role management.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique user identifier |
| `email` | VARCHAR(255) | Unique, Not Null | User's email for login |
| `password_hash` | VARCHAR(255) | Nullable | Hashed password (null for OAuth users) |
| `name` | VARCHAR(255) | Not Null | User's full name |
| `role` | ENUM('STUDENT', 'COUNSELOR', 'ADMIN') | Not Null, Default: 'STUDENT' | User role for permissions |
| `created_at` | TIMESTAMPTZ | Not Null, Default: NOW() | Timestamp of user creation |
| `updated_at` | TIMESTAMPTZ | Not Null, Default: NOW() | Timestamp of last update |

**`programs`**
The central table for all extracurricular opportunities.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique program identifier |
| `name` | VARCHAR(255) | Not Null | Full name of the program |
| `provider_id` | UUID | Foreign Key -> `providers.id` | The organizing institution |
| `description` | TEXT | | Detailed program description |
| `type` | ENUM('PROGRAM', 'COMPETITION') | Not Null | Type of opportunity |
| `url` | VARCHAR(2048) | | Official program website URL |
| `logo_url` | VARCHAR(2048) | | URL for the program/provider logo |
| `is_highly_selective` | BOOLEAN | Default: false | Whether the program is highly selective |
| `cost_info` | TEXT | | Detailed information about costs |
| `admission_info` | TEXT | | Information about the application process |
| `eligibility_info` | TEXT | | Detailed eligibility criteria |
| `experts_choice_rating` | ENUM('MOST_RECOMMENDED', 'HIGHLY_RECOMMENDED') | Nullable | Rating from education experts |
| `impact_rating` | ENUM('MOST_HIGH_IMPACT', 'HIGH_IMPACT') | Nullable | Rating for impact on college admissions |
| `eligible_grades` | INTEGER[] | | Array of eligible grade levels (e.g., `[9, 10, 11]`) |
| `only_us_citizens` | BOOLEAN | Default: false | Eligibility constraint |
| `only_us_residents` | BOOLEAN | Default: false | Eligibility constraint |
| `created_at` | TIMESTAMPTZ | Not Null, Default: NOW() | Timestamp of record creation |
| `updated_at` | TIMESTAMPTZ | Not Null, Default: NOW() | Timestamp of last update |

**`providers`**
Stores the organizing institutions to avoid data duplication.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique provider identifier |
| `name` | VARCHAR(255) | Not Null, Unique | Name of the institution (e.g., "Princeton University") |

### Relational & Supporting Tables

**`interests`** (Many-to-Many with `programs`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | SERIAL | Primary Key | Unique interest identifier |
| `name` | VARCHAR(255) | Not Null, Unique | The interest tag (e.g., "STEM", "Research") |

**`program_interests`** (Join Table)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `program_id` | UUID | Foreign Key -> `programs.id` | Part of composite primary key |
| `interest_id` | INTEGER | Foreign Key -> `interests.id` | Part of composite primary key |

**`sessions`** (One-to-Many with `programs`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique session identifier |
| `program_id` | UUID | Foreign Key -> `programs.id` | The program this session belongs to |
| `start_date` | DATE | | Session start date |
| `end_date` | DATE | | Session end date |
| `location_type` | ENUM('IN_PERSON', 'ONLINE', 'LOCAL') | | Type of location |
| `location_name` | VARCHAR(255) | | Name of the location (e.g., "Princeton, NJ") |

**`deadlines`** (One-to-Many with `programs`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique deadline identifier |
| `program_id` | UUID | Foreign Key -> `programs.id` | The program this deadline belongs to |
| `description` | VARCHAR(255) | Not Null | e.g., "Application Deadline" |
| `date` | DATE | Not Null | The actual deadline date |

**`lists`**
Curated lists created by counselors.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique list identifier |
| `title` | VARCHAR(255) | Not Null | Title of the list |
| `description` | TEXT | | A short description of the list |
| `author_id` | UUID | Foreign Key -> `users.id` | The user (counselor) who created the list |
| `is_public` | BOOLEAN | Default: true | Whether the list is visible to all users |
| `created_at` | TIMESTAMPTZ | Not Null, Default: NOW() | Timestamp of list creation |
| `updated_at` | TIMESTAMPTZ | Not Null, Default: NOW() | Timestamp of last update |

**`list_items`**
Associates programs with lists and holds unique commentary.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Primary Key | Unique list item identifier |
| `list_id` | UUID | Foreign Key -> `lists.id` | The list this item belongs to |
| `program_id` | UUID | Foreign Key -> `programs.id` | The program being added to the list |
| `author_commentary` | TEXT | | Counselor's unique commentary for this program in this list |
| `display_order` | INTEGER | Not Null | The order in which the item appears in the list |

**`user_saved_programs`** (Join Table for Bookmarks)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | Foreign Key -> `users.id` | Part of composite primary key |
| `program_id` | UUID | Foreign Key -> `programs.id` | Part of composite primary key |
| `saved_at` | TIMESTAMPTZ | Not Null, Default: NOW() | When the program was saved |

## 3. API Design (RESTful)

All endpoints will be versioned under `/api/v1/`.

### Public Endpoints (No Auth Required)

*   **`GET /programs`**: Search and filter programs.
    *   **Query Params:** `search` (string), `interests` (comma-separated IDs), `type` (PROGRAM/COMPETITION), `minGrade`, `maxGrade`, `isFree` (boolean), `isSelective` (boolean), `rating` (MOST_RECOMMENDED/HIGHLY_RECOMMENDED), `page` (integer), `limit` (integer).
    *   **Response:** Paginated list of program summaries.

*   **`GET /programs/:id`**: Get full details for a single program.
    *   **Response:** A single program object with all associated data (sessions, deadlines, etc.).

*   **`GET /lists`**: Get all public, curated lists.
    *   **Response:** A list of list objects (title, author info, description).

*   **`GET /lists/:id`**: Get the details of a single curated list.
    *   **Response:** A list object with an array of `list_items`, including programs and author commentary.

*   **`GET /interests`**: Get a list of all available interest tags.
    *   **Response:** An array of interest objects (`{ id, name }`).

### Authentication Endpoints

*   **`POST /auth/register`**: Register a new user.
    *   **Body:** `{ name, email, password, role }`
    *   **Response:** `{ user, token }`

*   **`POST /auth/login`**: Log in an existing user.
    *   **Body:** `{ email, password }`
    *   **Response:** `{ user, token }`

*   **`POST /auth/google`**: Handle Google OAuth callback.
    *   **Body:** `{ googleToken }`
    *   **Response:** `{ user, token }`

### Protected Endpoints (Auth Required)

*   **`GET /me`**: Get the current logged-in user's profile.

*   **`GET /me/saved-programs`**: Get all programs saved by the current user.

*   **`POST /me/saved-programs`**: Save/bookmark a program.
    *   **Body:** `{ programId }`

*   **`DELETE /me/saved-programs/:programId`**: Unsave a program.

*   **`GET /me/lists`**: Get all lists created by the current user (for counselors).

*   **`POST /me/lists`**: Create a new curated list.
    *   **Body:** `{ title, description, isPublic }`

*   **`PUT /me/lists/:id`**: Update a list's details.

*   **`POST /me/lists/:id/items`**: Add a program to a list.
    *   **Body:** `{ programId, commentary }`

*   **`PUT /me/lists/:listId/items/:itemId`**: Update the commentary or order of a program in a list.

## 4. Implementation Roadmap

1.  **Project Setup:** Initialize a Node.js/Express project with TypeScript. Install Prisma and configure it for SQLite.
2.  **Database Migration:** Define the complete schema in `schema.prisma`. Run `prisma migrate dev` to generate the initial local `dev.db` database tables.
3.  **Seed Database:** Write a script to parse the `detailed_programs.json` file and populate the `programs`, `providers`, `interests`, and related tables with the initial 2100+ items.
4.  **Authentication Module:** Implement the `users` model and the `/auth/register`, `/auth/login` endpoints. Set up JWT generation and a middleware for verifying tokens on protected routes.
5.  **Public API Development:** Build the public-facing endpoints (`/programs`, `/lists`, etc.), focusing on efficient querying and data aggregation.
6.  **Protected API Development:** Implement the user-specific endpoints (`/me/*`) that require authentication.
7.  **Testing:** Write unit and integration tests for all API endpoints to ensure correctness and reliability.
8.  **Deployment:** Dockerize the application and set up a CI/CD pipeline for automated deployment.
