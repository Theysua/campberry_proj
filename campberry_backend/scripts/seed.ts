import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const resolveDataPath = () => {
  const candidates = [
    path.resolve(process.cwd(), '../.local_private/snowday/output/detailed_programs.compat.json'),
    path.resolve(process.cwd(), '../campberry_frontend/src/data/detailed_programs.json'),
  ]

  const existingPath = candidates.find((candidate) => fs.existsSync(candidate))
  if (!existingPath) {
    throw new Error(`No seed data file found. Checked: ${candidates.join(', ')}`)
  }

  return existingPath
}

const toProgramType = (type: unknown) => (type === 'COMPETITION' ? 'COMPETITION' : 'PROGRAM')

const toExpertsChoiceRating = (rating: unknown) => {
  if (rating === 'MOST_RECOMMENDED') {
    return 'MOST_RECOMMENDED'
  }

  if (rating === 'HIGHLY_RECOMMENDED') {
    return 'HIGHLY_RECOMMENDED'
  }

  return null
}

const toImpactRating = (rating: unknown) => {
  if (rating === 'MOST_HIGH_IMPACT') {
    return 'MOST_HIGH_IMPACT'
  }

  if (rating === 'HIGH_IMPACT') {
    return 'HIGH_IMPACT'
  }

  return null
}

const toLocationType = (locationType: unknown) => {
  if (locationType === 'ONLINE') {
    return 'ONLINE'
  }

  if (locationType === 'LOCAL') {
    return 'LOCAL'
  }

  return 'IN_PERSON'
}

async function main() {
  const dataPath = resolveDataPath()
  console.log(`Start seeding from ${dataPath}...`)

  const rawData = fs.readFileSync(dataPath, 'utf8')
  const programsData = JSON.parse(rawData)
  console.log(`Found ${programsData.length} programs to sync.`)

  const providerCache = new Map(
    (await prisma.provider.findMany({ select: { id: true, name: true } })).map((provider) => [provider.name, provider.id])
  )
  const interestCache = new Map(
    (await prisma.interest.findMany({ select: { id: true, name: true } })).map((interest) => [interest.name, interest.id])
  )

  let syncedCount = 0

  for (const item of programsData) {
    const programData = item.trpcData
    if (!programData?.id) {
      continue
    }

    const providerName = programData.provider?.name || item.org || 'Unknown Provider'
    let providerId = providerCache.get(providerName)
    if (!providerId) {
      const provider = await prisma.provider.upsert({
        where: { name: providerName },
        update: {},
        create: { name: providerName },
      })
      providerId = provider.id
      providerCache.set(providerName, provider.id)
    }

    const allowsInternational =
      programData.allowsInternational ?? !(programData.onlyUsCitizens || programData.onlyUsResidents)

    const syncedProgram = await prisma.program.upsert({
      where: { id: programData.id },
      update: {
        name: programData.name || item.title || 'Unknown Program',
        description: programData.description || item.description || null,
        type: toProgramType(programData.type),
        url: programData.url || item.url,
        logo_url: programData.logo?.url || item.logo || null,
        provider_id: providerId,
        is_highly_selective: programData.isHighlySelective || false,
        cost_info: programData.costInfo || null,
        admission_info: programData.admissionInfo || null,
        eligibility_info: programData.eligibilityInfo || null,
        experts_choice_rating: toExpertsChoiceRating(programData.expertsChoiceRating),
        impact_rating: toImpactRating(programData.impactOnAdmissionsRating),
        eligible_grades: Array.isArray(programData.eligibleGrades) ? programData.eligibleGrades.join(',') : '',
        only_us_citizens: programData.onlyUsCitizens || false,
        only_us_residents: programData.onlyUsResidents || false,
        allows_international: allowsInternational,
        offers_college_credit: programData.offersCollegeCredit || programData.grantsCollegeCredit || false,
        is_one_on_one: programData.isOneOnOne || false,
        trpc_data: JSON.stringify(programData),
      },
      create: {
        id: programData.id,
        name: programData.name || item.title || 'Unknown Program',
        description: programData.description || item.description || null,
        type: toProgramType(programData.type),
        url: programData.url || item.url,
        logo_url: programData.logo?.url || item.logo || null,
        provider_id: providerId,
        is_highly_selective: programData.isHighlySelective || false,
        cost_info: programData.costInfo || null,
        admission_info: programData.admissionInfo || null,
        eligibility_info: programData.eligibilityInfo || null,
        experts_choice_rating: toExpertsChoiceRating(programData.expertsChoiceRating),
        impact_rating: toImpactRating(programData.impactOnAdmissionsRating),
        eligible_grades: Array.isArray(programData.eligibleGrades) ? programData.eligibleGrades.join(',') : '',
        only_us_citizens: programData.onlyUsCitizens || false,
        only_us_residents: programData.onlyUsResidents || false,
        allows_international: allowsInternational,
        offers_college_credit: programData.offersCollegeCredit || programData.grantsCollegeCredit || false,
        is_one_on_one: programData.isOneOnOne || false,
        trpc_data: JSON.stringify(programData),
      },
    })

    await prisma.programInterest.deleteMany({
      where: { program_id: syncedProgram.id },
    })
    await prisma.session.deleteMany({
      where: { program_id: syncedProgram.id },
    })
    await prisma.deadline.deleteMany({
      where: { program_id: syncedProgram.id },
    })

    if (programData.interests?.length) {
      for (const interestData of programData.interests) {
        if (!interestData.name) {
          continue
        }

        let interestId = interestCache.get(interestData.name)
        if (!interestId) {
          const interest = await prisma.interest.upsert({
            where: { name: interestData.name },
            update: {},
            create: { name: interestData.name },
          })
          interestId = interest.id
          interestCache.set(interestData.name, interest.id)
        }

        await prisma.programInterest.create({
          data: {
            program_id: syncedProgram.id,
            interest_id: interestId,
          },
        })
      }
    }

    if (programData.sessions?.length) {
      await prisma.session.createMany({
        data: programData.sessions.map((session: any) => ({
          program_id: syncedProgram.id,
          start_date: session.startDate ? new Date(session.startDate) : null,
          end_date: session.endDate ? new Date(session.endDate) : null,
          location_type: toLocationType(session.locationType),
          location_name: session.location?.name || null,
          location_lat:
            typeof session.location?.latitude === 'number' ? session.location.latitude : null,
          location_lng:
            typeof session.location?.longitude === 'number' ? session.location.longitude : null,
        })),
      })
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
      })
    }

    syncedCount += 1
    if (syncedCount % 100 === 0) {
      console.log(`Synced ${syncedCount}/${programsData.length} programs...`)
    }
  }

  const passwordHash = await bcrypt.hash('password123', 10)
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
  })

  console.log(`Seeding finished successfully. Synced ${syncedCount} programs.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
