import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding from detailed_programs.json...');

  const dataPath = path.join(process.cwd(), '../campberry_frontend/src/data/detailed_programs.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const programsData = JSON.parse(rawData);

  console.log(`Found ${programsData.length} programs to sync.`);

  for (const item of programsData) {
    const programData = item.trpcData;
    if (!programData?.id) {
      continue;
    }

    const providerName = programData.provider?.name || 'Unknown Provider';
    const provider = await prisma.provider.upsert({
      where: { name: providerName },
      update: {},
      create: { name: providerName },
    });

    const syncedProgram = await prisma.program.upsert({
      where: { id: programData.id },
      update: {
        name: programData.name || item.title || 'Unknown Program',
        description: programData.description,
        type: programData.type === 'COMPETITION' ? 'COMPETITION' : 'PROGRAM',
        url: programData.url || item.url,
        logo_url: programData.logo?.url,
        provider_id: provider.id,
        is_highly_selective: programData.isHighlySelective || false,
        cost_info: programData.costInfo,
        admission_info: programData.admissionInfo,
        eligibility_info: programData.eligibilityInfo,
        experts_choice_rating:
          programData.expertsChoiceRating === 'MOST_RECOMMENDED'
            ? 'MOST_RECOMMENDED'
            : programData.expertsChoiceRating === 'HIGHLY_RECOMMENDED'
              ? 'HIGHLY_RECOMMENDED'
              : null,
        impact_rating:
          programData.impactOnAdmissionsRating === 'MOST_HIGH_IMPACT'
            ? 'MOST_HIGH_IMPACT'
            : programData.impactOnAdmissionsRating === 'HIGH_IMPACT'
              ? 'HIGH_IMPACT'
              : null,
        eligible_grades: programData.eligibleGrades ? programData.eligibleGrades.join(',') : '',
        only_us_citizens: programData.onlyUsCitizens || false,
        only_us_residents: programData.onlyUsResidents || false,
        allows_international: programData.allowsInternational ?? true,
        offers_college_credit: programData.offersCollegeCredit || false,
        is_one_on_one: programData.isOneOnOne || false,
        trpc_data: JSON.stringify(programData),
      },
      create: {
        id: programData.id,
        name: programData.name || item.title || 'Unknown Program',
        description: programData.description,
        type: programData.type === 'COMPETITION' ? 'COMPETITION' : 'PROGRAM',
        url: programData.url || item.url,
        logo_url: programData.logo?.url,
        provider_id: provider.id,
        is_highly_selective: programData.isHighlySelective || false,
        cost_info: programData.costInfo,
        admission_info: programData.admissionInfo,
        eligibility_info: programData.eligibilityInfo,
        experts_choice_rating:
          programData.expertsChoiceRating === 'MOST_RECOMMENDED'
            ? 'MOST_RECOMMENDED'
            : programData.expertsChoiceRating === 'HIGHLY_RECOMMENDED'
              ? 'HIGHLY_RECOMMENDED'
              : null,
        impact_rating:
          programData.impactOnAdmissionsRating === 'MOST_HIGH_IMPACT'
            ? 'MOST_HIGH_IMPACT'
            : programData.impactOnAdmissionsRating === 'HIGH_IMPACT'
              ? 'HIGH_IMPACT'
              : null,
        eligible_grades: programData.eligibleGrades ? programData.eligibleGrades.join(',') : '',
        only_us_citizens: programData.onlyUsCitizens || false,
        only_us_residents: programData.onlyUsResidents || false,
        allows_international: programData.allowsInternational ?? true,
        offers_college_credit: programData.offersCollegeCredit || false,
        is_one_on_one: programData.isOneOnOne || false,
        trpc_data: JSON.stringify(programData),
      },
    });

    await prisma.programInterest.deleteMany({
      where: { program_id: syncedProgram.id },
    });
    await prisma.session.deleteMany({
      where: { program_id: syncedProgram.id },
    });
    await prisma.deadline.deleteMany({
      where: { program_id: syncedProgram.id },
    });

    if (programData.interests?.length) {
      for (const interestData of programData.interests) {
        if (!interestData.name) {
          continue;
        }

        const interest = await prisma.interest.upsert({
          where: { name: interestData.name },
          update: {},
          create: { name: interestData.name },
        });

        await prisma.programInterest.create({
          data: {
            program_id: syncedProgram.id,
            interest_id: interest.id,
          },
        });
      }
    }

    if (programData.sessions?.length) {
      await prisma.session.createMany({
        data: programData.sessions.map((session: any) => ({
          program_id: syncedProgram.id,
          start_date: session.startDate ? new Date(session.startDate) : null,
          end_date: session.endDate ? new Date(session.endDate) : null,
          location_type:
            session.locationType === 'ONLINE'
              ? 'ONLINE'
              : session.locationType === 'LOCAL'
                ? 'LOCAL'
                : 'IN_PERSON',
          location_name: session.location?.name || null,
          location_lat:
            typeof session.location?.latitude === 'number' ? session.location.latitude : null,
          location_lng:
            typeof session.location?.longitude === 'number' ? session.location.longitude : null,
        })),
      });
    }

    if (programData.deadlines?.length) {
      await prisma.deadline.createMany({
        data: programData.deadlines
          .filter((deadline: any) => deadline.date)
          .map((deadline: any) => ({
            program_id: syncedProgram.id,
            description: deadline.description || 'Deadline',
            date: new Date(deadline.date),
          })),
      });
    }
  }

  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'counselor@campberry.com' },
    update: {},
    create: {
      email: 'counselor@campberry.com',
      name: 'Jane Counselor',
      password_hash: passwordHash,
      role: 'COUNSELOR',
      is_verified: true,
    },
  });

  console.log('Seeding finished successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
