import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('Connecting...');
  const count = await prisma.program.count();
  console.log('Program count:', count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
