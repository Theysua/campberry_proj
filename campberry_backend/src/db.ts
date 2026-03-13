import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { resolvedDatabaseUrl } from './config/databaseUrl';

const prisma = new PrismaClient({
  datasourceUrl: resolvedDatabaseUrl,
});

export default prisma;
