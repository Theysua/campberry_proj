import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Generating dummy accounts...');

  const accounts = [
    {
      name: 'Oliver Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'STUDENT'
    },
    {
      name: 'Emma Student',
      email: 'emma@example.com',
      password: 'password123',
      role: 'STUDENT'
    },
    {
      name: 'Sarah Counselor',
      email: 'counselor@example.com', // To match our previous tests
      password: 'password123',
      role: 'COUNSELOR'
    },
    {
      name: 'Michael Admin',
      email: 'admin@campberry.com',
      password: 'adminpassword',
      role: 'ADMIN'
    }
  ];

  for (const acc of accounts) {
    const existingUser = await prisma.user.findUnique({ where: { email: acc.email } });
    
    if (existingUser) {
      console.log(`User ${acc.email} already exists. Skipping.`);
      continue;
    }

    const password_hash = await bcrypt.hash(acc.password, 10);

    const user = await prisma.user.create({
      data: {
        name: acc.name,
        email: acc.email,
        password_hash,
        role: acc.role,
      }
    });

    console.log(`✅ Created ${acc.role} account: ${user.name} (${user.email}) | Password: ${acc.password}`);
  }

  console.log('Finished creating accounts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
