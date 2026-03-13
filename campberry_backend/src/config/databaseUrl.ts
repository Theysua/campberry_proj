import 'dotenv/config';

const DEFAULT_LOCAL_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/campberry_dev?schema=public';
const LOCAL_PRISMA_PROXY_PATTERN = /^prisma\+postgres:\/\/localhost(?::\d+)?\//i;

const shouldFallbackToLocalPostgres = (databaseUrl: string) =>
  process.env.NODE_ENV !== 'production' && LOCAL_PRISMA_PROXY_PATTERN.test(databaseUrl);

export const resolveDatabaseUrl = () => {
  const configuredUrl = String(process.env.DATABASE_URL || '').trim();
  const fallbackUrl = String(process.env.CAMPBERRY_LOCAL_DATABASE_URL || DEFAULT_LOCAL_DATABASE_URL).trim();

  if (!configuredUrl) {
    process.env.DATABASE_URL = fallbackUrl;
    return fallbackUrl;
  }

  if (shouldFallbackToLocalPostgres(configuredUrl)) {
    process.env.DATABASE_URL = fallbackUrl;
    return fallbackUrl;
  }

  return configuredUrl;
};

export const resolvedDatabaseUrl = resolveDatabaseUrl();
