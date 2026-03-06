# Campberry Backend

## Local Postgres setup

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

## Validation and tests

```bash
npm test
npm run typecheck
```
