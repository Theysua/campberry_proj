import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvedDatabaseUrl } from '../src/config/databaseUrl';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const env = {
  ...process.env,
  DATABASE_URL: resolvedDatabaseUrl,
};

const run = (command: string) => {
  execSync(command, {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
  });
};

run('docker compose up -d postgres');
run('npx prisma migrate deploy');
run('npx tsx scripts/seed.ts');
run('node --import tsx --test src/**/*.test.ts');
