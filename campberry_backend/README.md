# Campberry Backend

## Local Postgres setup

The backend now defaults local development and test flows to the Docker Postgres instance on `localhost:5433` whenever a stale `prisma+postgres://localhost:...` URL is detected.

1. Start Postgres:

```bash
npm run db:up
```

2. Apply migrations:

```bash
npm run db:migrate
```

3. Seed dev data:

```bash
npm run db:seed
npm run db:accounts
```

4. Start the API:

```bash
npm run dev
```

The local database runs in Docker on `localhost:5433`.
If you do not already have a `.env`, copy from `.env.example`.

## Validation and tests

```bash
npm test
npm run typecheck
```

`npm test` will:

1. Start the local Docker Postgres container if needed
2. Apply Prisma migrations
3. Seed the local dataset
4. Run the backend integration test suite
