import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding from detailed_programs.json...');

  // Use process.cwd() instead of __dirname to avoid typescript complaints in some setups
  const dataPath = path.join(process.cwd(), '../campberry_frontend/src/data/detailed_programs.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const programsData = JSON.parse(rawData);

  console.log(`Found ${programsData.length} programs to insert.`);

  for (const item of programsData) {
    const p = item.trpcData;
    if (!p) continue;

    // 1. Check or Create Provider
    const providerObj = p.provider;
    let providerId;
    if (providerObj?.name) {
      const provider = await prisma.provider.upsert({
        where: { name: providerObj.name },
        update: {},
        create: { name: providerObj.name },
      });
      providerId = provider.id;
    } else {
      const provider = await prisma.provider.upsert({
        where: { name: 'Unknown Provider' },
        update: {},
        create: { name: 'Unknown Provider' },
      });
      providerId = provider.id;
    }

    // 2. Handle Interests (ensure they exist and collect their IDs to link)
    const interestLinks: any = [];
    if (p.interests && p.interests.length > 0) {
      for (const i of p.interests) {
        if (!i.name) continue;
        const interest = await prisma.interest.upsert({
          where: { name: i.name },
          update: {},
          create: { name: i.name },
        });
        interestLinks.push({ interest_id: interest.id });
      }
    }

    // 3. Create Program
    const createdProgram = await prisma.program.create({
      data: {
        id: p.id,
        name: p.name || item.title || 'Unknown Program',
        description: p.description,
        type: p.type === 'COMPETITION' ? 'COMPETITION' : 'PROGRAM',
        url: p.url || item.url,
        logo_url: p.logo?.url,
        provider_id: providerId,
        is_highly_selective: p.isHighlySelective || false,
        cost_info: p.costInfo,
        admission_info: p.admissionInfo,
        eligibility_info: p.eligibilityInfo,
        experts_choice_rating: p.expertsChoiceRating === 'MOST_RECOMMENDED' ? 'MOST_RECOMMENDED' : p.expertsChoiceRating === 'HIGHLY_RECOMMENDED' ? 'HIGHLY_RECOMMENDED' : null,
        impact_rating: p.impactOnAdmissionsRating === 'MOST_HIGH_IMPACT' ? 'MOST_HIGH_IMPACT' : p.impactOnAdmissionsRating === 'HIGH_IMPACT' ? 'HIGH_IMPACT' : null,
        eligible_grades: p.eligibleGrades ? p.eligibleGrades.join(',') : '',
        only_us_citizens: p.onlyUsCitizens || false,
        only_us_residents: p.onlyUsResidents || false,
        allows_international: p.allowsInternational ?? true,
        trpc_data: JSON.stringify(p),
      },
    });

    // 4. Link Interests
    if (interestLinks.length > 0) {
      for (const link of interestLinks) {
        await prisma.programInterest.create({
          data: {
            program_id: createdProgram.id,
            interest_id: link.interest_id
          }
        });
      }
    }

    // 5. Create Sessions
    if (p.sessions && p.sessions.length > 0) {
      for (const sess of p.sessions) {
        await prisma.session.create({
          data: {
            program_id: createdProgram.id,
            start_date: sess.startDate ? new Date(sess.startDate) : null,
            end_date: sess.endDate ? new Date(sess.endDate) : null,
            location_type: sess.locationType === 'ONLINE' ? 'ONLINE' : sess.locationType === 'LOCAL' ? 'LOCAL' : 'IN_PERSON',
            location_name: sess.location?.name || null
          }
        });
      }
    }

    // 6. Create Deadlines
    if (p.deadlines && p.deadlines.length > 0) {
      for (const d of p.deadlines) {
        if (!d.date) continue;
        await prisma.deadline.create({
          data: {
            program_id: createdProgram.id,
            description: d.description || 'Deadline',
            date: new Date(d.date)
          }
        });
      }
    }
  }

  // Ensure one consistent user profile for testing
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'counselor@campberry.com' },
    update: {},
    create: {
      email: 'counselor@campberry.com',
      name: 'Jane Counselor',
      password_hash: passwordHash,
      role: 'COUNSELOR',
    },
  });

  console.log('Seeding finished successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
