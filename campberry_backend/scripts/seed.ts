import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const PROGRAM_UPSERT_CONCURRENCY = 25
const BULK_CHUNK_SIZE = 1000

type SeedSourceItem = {
  title?: string
  description?: string
  url?: string
  logo?: string
  org?: string
  trpcData?: any
}

type NormalizedProgram = {
  id: string
  name: string
  description: string | null
  type: string
  url: string | null
  logo_url: string | null
  provider_id: string
  is_highly_selective: boolean
  cost_info: string | null
  admission_info: string | null
  eligibility_info: string | null
  experts_choice_rating: string | null
  impact_rating: string | null
  eligible_grades: string
  only_us_citizens: boolean
  only_us_residents: boolean
  allows_international: boolean
  offers_college_credit: boolean
  is_one_on_one: boolean
  trpc_data: string
}

type NormalizedProgramInterest = {
  program_id: string
  interest_id: number
}

type NormalizedSession = {
  program_id: string
  start_date: Date | null
  end_date: Date | null
  location_type: string | null
  location_name: string | null
  location_lat: number | null
  location_lng: number | null
}

type NormalizedDeadline = {
  program_id: string
  description: string
  date: Date
}

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

const chunk = <T>(items: T[], size: number) => {
  const output: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    output.push(items.slice(index, index + size))
  }
  return output
}

const sampleCounselors = [
  {
    email: 'maya.chen@campberry.com',
    name: 'Maya Chen',
    role: 'COUNSELOR',
  },
  {
    email: 'jonathan.lee@campberry.com',
    name: 'Jonathan Lee',
    role: 'COUNSELOR',
  },
  {
    email: 'sofia.ramirez@campberry.com',
    name: 'Sofia Ramirez',
    role: 'COUNSELOR',
  },
]

const sampleReviewers = [
  {
    email: 'alex.student@campberry.com',
    name: 'Alex Student',
    role: 'STUDENT',
  },
  {
    email: 'nina.parent@campberry.com',
    name: 'Nina Parent',
    role: 'STUDENT',
  },
]

const samplePublicLists = [
  {
    title: 'Counselor Picks: Research Programs That Signal Initiative',
    authorEmail: 'maya.chen@campberry.com',
    description:
      'These are the programs I reach for when a student wants to show serious academic initiative, not just casual summer participation.\n\nEach one asks students to do something concrete: produce original work, handle real research questions, or operate in a highly selective environment where independence matters.',
    items: [
      {
        programName: 'MITES Summer',
        commentary:
          'A national-level option for students who want a rigorous STEM cohort and a signal that they can thrive in demanding, mission-driven learning spaces.',
      },
      {
        programName: 'Applied Research Innovations in Science and Engineering (ARISE)',
        commentary:
          'One of the cleaner research credibility signals in this database. The structure is serious, and the brand carries weight with STEM-oriented applicants.',
      },
      {
        programName: 'Laboratory Learning Program',
        commentary:
          'Strong fit for students who want real lab exposure instead of a purely classroom-style pre-college experience.',
      },
      {
        programName: 'MSK Summer Student Program',
        commentary:
          'Particularly compelling for students interested in translational science, oncology, or biomedical research environments.',
      },
      {
        programName: 'Pathways Intern',
        commentary:
          'A useful option when a student wants something that feels closer to early professional experience than a traditional camp.',
      },
    ],
  },
  {
    title: 'Counselor Picks: Writing and Journalism Programs Worth Watching',
    authorEmail: 'jonathan.lee@campberry.com',
    description:
      'I usually recommend this mix to students who already write regularly and need a sharper environment, better mentorship, or stronger external validation.\n\nThis is not just a creative hobby list. These programs can help students build portfolio material, editorial judgment, and a more mature intellectual voice.',
    items: [
      {
        programName: 'Princeton Summer Journalism Program (PSJP)',
        commentary:
          'Still one of the strongest names in this category. It combines journalism training with a meaningful college-access dimension.',
      },
      {
        programName: 'JCamp',
        commentary:
          'Excellent for students who want intensive journalism training and a cohort that treats reporting as serious work.',
      },
      {
        programName: "Iowa Young Writers' Studio",
        commentary:
          'A classic recommendation for students with real literary ambition. The selective nature matters, but so does the peer environment.',
      },
      {
        programName: 'Cronkite Summer Journalism Institute (SJI)',
        commentary:
          'I like this for students who want to test whether journalism is a genuine long-term interest rather than a one-off summer experiment.',
      },
      {
        programName: 'National Student Poets Program',
        commentary:
          'Much more validation-driven than a normal summer program, but worth keeping in the same conversation for exceptional young writers.',
      },
    ],
  },
  {
    title: 'Counselor Picks: Pre-Med and Health Science Paths',
    authorEmail: 'sofia.ramirez@campberry.com',
    description:
      'For students who say pre-med, I try to separate programs that merely sound medical from those that actually provide useful exposure to research, health systems, or scientific training.\n\nThis list mixes direct hospital or health-care exposure with academically serious biology and lab-oriented options so families can compare different paths early.',
    items: [
      {
        programName: 'HPREP at Harvard Medical',
        commentary:
          'A standout name for students serious about medicine, public health, or health equity. The context around the program is often as valuable as the content.',
      },
      {
        programName: 'High School Summer Program',
        commentary:
          'One of the better-known health-focused options in the dataset. Especially useful for students who want exposure to a major medical center environment.',
      },
      {
        programName: 'Healthcare Career Exploration Program (HCEP)',
        commentary:
          'Good exploratory option for students still narrowing down what healthcare means for them beyond doctor as a default answer.',
      },
      {
        programName: 'BioBuilderClub',
        commentary:
          'I like this when a student is really more biotech or bioengineering than classic hospital pre-med, but still wants relevant scientific depth.',
      },
      {
        programName: 'Keller BLOOM Program',
        commentary:
          'A strong fit for students interested in marine biology, ecology, or research-heavy science pathways that can still support a future health-science story.',
      },
    ],
  },
]

const sampleProgramReviews = [
  {
    reviewerEmail: 'alex.student@campberry.com',
    programName: 'MITES Summer',
    rating: 5,
    comment:
      'Feels like one of the clearest high-rigor STEM options in the database. The structure and reputation both stand out.',
  },
  {
    reviewerEmail: 'nina.parent@campberry.com',
    programName: 'Princeton Summer Journalism Program (PSJP)',
    rating: 5,
    comment:
      'Strong combination of access, mentorship, and real output. This is the kind of program parents immediately understand the value of.',
  },
]

const sampleListReviews = [
  {
    reviewerEmail: 'alex.student@campberry.com',
    listTitle: 'Counselor Picks: Research Programs That Signal Initiative',
    rating: 5,
    comment: 'Very usable shortlist. The commentary quickly explains why these are more serious than generic summer programs.',
  },
  {
    reviewerEmail: 'nina.parent@campberry.com',
    listTitle: 'Counselor Picks: Writing and Journalism Programs Worth Watching',
    rating: 4,
    comment: 'Helpful framing. The notes make it easier to understand which programs are validation-heavy versus skill-building.',
  },
]

const upsertSeedUser = async (
  email: string,
  name: string,
  role: string,
  passwordHash: string
) =>
  prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      is_verified: true,
      password_hash: passwordHash,
    },
    create: {
      email,
      name,
      role,
      is_verified: true,
      password_hash: passwordHash,
    },
  })

async function main() {
  const dataPath = resolveDataPath()
  console.log(`Start seeding from ${dataPath}...`)

  const rawData = fs.readFileSync(dataPath, 'utf8')
  const programsData = JSON.parse(rawData) as SeedSourceItem[]
  console.log(`Found ${programsData.length} programs to sync.`)

  const validItems = programsData.filter((item) => item.trpcData?.id)
  const programIds = validItems.map((item) => item.trpcData.id as string)

  const providerNames = [...new Set(validItems.map((item) => item.trpcData.provider?.name || item.org || 'Unknown Provider'))]
  const interestNames = [
    ...new Set(
      validItems.flatMap((item) =>
        Array.isArray(item.trpcData?.interests)
          ? item.trpcData.interests.map((interest: any) => interest?.name).filter(Boolean)
          : []
      )
    ),
  ]

  console.log(`Preparing ${providerNames.length} providers and ${interestNames.length} interests...`)

  await prisma.provider.createMany({
    data: providerNames.map((name) => ({ name })),
    skipDuplicates: true,
  })

  await prisma.interest.createMany({
    data: interestNames.map((name) => ({ name })),
    skipDuplicates: true,
  })

  const providerCache = new Map(
    (await prisma.provider.findMany({ select: { id: true, name: true } })).map((provider) => [provider.name, provider.id])
  )
  const interestCache = new Map(
    (await prisma.interest.findMany({ select: { id: true, name: true } })).map((interest) => [interest.name, interest.id])
  )

  const normalizedPrograms: NormalizedProgram[] = []
  const normalizedProgramInterests: NormalizedProgramInterest[] = []
  const normalizedSessions: NormalizedSession[] = []
  const normalizedDeadlines: NormalizedDeadline[] = []

  for (const item of validItems) {
    const programData = item.trpcData
    const providerName = programData.provider?.name || item.org || 'Unknown Provider'
    const providerId = providerCache.get(providerName)

    if (!providerId) {
      throw new Error(`Provider cache miss for ${providerName}`)
    }

    const allowsInternational =
      programData.allowsInternational ?? !(programData.onlyUsCitizens || programData.onlyUsResidents)

    normalizedPrograms.push({
      id: programData.id,
      name: programData.name || item.title || 'Unknown Program',
      description: programData.description || item.description || null,
      type: toProgramType(programData.type),
      url: programData.url || item.url || null,
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
    })

    for (const interestData of programData.interests || []) {
      if (!interestData?.name) {
        continue
      }

      const interestId = interestCache.get(interestData.name)
      if (!interestId) {
        continue
      }

      normalizedProgramInterests.push({
        program_id: programData.id,
        interest_id: interestId,
      })
    }

    for (const session of programData.sessions || []) {
      normalizedSessions.push({
        program_id: programData.id,
        start_date: session.startDate ? new Date(session.startDate) : null,
        end_date: session.endDate ? new Date(session.endDate) : null,
        location_type: toLocationType(session.locationType),
        location_name: session.location?.name || null,
        location_lat: typeof session.location?.latitude === 'number' ? session.location.latitude : null,
        location_lng: typeof session.location?.longitude === 'number' ? session.location.longitude : null,
      })
    }

    for (const deadline of programData.deadlines || []) {
      if (!deadline?.date) {
        continue
      }

      normalizedDeadlines.push({
        program_id: programData.id,
        description: deadline.description || 'Deadline',
        date: new Date(deadline.date),
      })
    }
  }

  console.log(`Prepared ${normalizedPrograms.length} programs, ${normalizedProgramInterests.length} interests, ${normalizedSessions.length} sessions, ${normalizedDeadlines.length} deadlines.`)
  console.log(`Upserting programs with concurrency ${PROGRAM_UPSERT_CONCURRENCY}...`)

  let syncedCount = 0
  for (const programBatch of chunk(normalizedPrograms, PROGRAM_UPSERT_CONCURRENCY)) {
    await Promise.all(
      programBatch.map((program) =>
        prisma.program.upsert({
          where: { id: program.id },
          update: {
            name: program.name,
            description: program.description,
            type: program.type,
            url: program.url,
            logo_url: program.logo_url,
            provider_id: program.provider_id,
            is_highly_selective: program.is_highly_selective,
            cost_info: program.cost_info,
            admission_info: program.admission_info,
            eligibility_info: program.eligibility_info,
            experts_choice_rating: program.experts_choice_rating,
            impact_rating: program.impact_rating,
            eligible_grades: program.eligible_grades,
            only_us_citizens: program.only_us_citizens,
            only_us_residents: program.only_us_residents,
            allows_international: program.allows_international,
            offers_college_credit: program.offers_college_credit,
            is_one_on_one: program.is_one_on_one,
            trpc_data: program.trpc_data,
          },
          create: program,
        })
      )
    )

    syncedCount += programBatch.length
    if (syncedCount % 100 === 0 || syncedCount === normalizedPrograms.length) {
      console.log(`Upserted ${syncedCount}/${normalizedPrograms.length} programs...`)
    }
  }

  console.log('Refreshing program relations in bulk...')
  for (const programIdBatch of chunk(programIds, BULK_CHUNK_SIZE)) {
    await prisma.programInterest.deleteMany({
      where: { program_id: { in: programIdBatch } },
    })
    await prisma.session.deleteMany({
      where: { program_id: { in: programIdBatch } },
    })
    await prisma.deadline.deleteMany({
      where: { program_id: { in: programIdBatch } },
    })
  }

  for (const relationBatch of chunk(normalizedProgramInterests, BULK_CHUNK_SIZE)) {
    await prisma.programInterest.createMany({
      data: relationBatch,
      skipDuplicates: true,
    })
  }
  console.log(`Recreated ${normalizedProgramInterests.length} program-interest links.`)

  for (const sessionBatch of chunk(normalizedSessions, BULK_CHUNK_SIZE)) {
    await prisma.session.createMany({
      data: sessionBatch,
    })
  }
  console.log(`Recreated ${normalizedSessions.length} sessions.`)

  for (const deadlineBatch of chunk(normalizedDeadlines, BULK_CHUNK_SIZE)) {
    await prisma.deadline.createMany({
      data: deadlineBatch,
    })
  }
  console.log(`Recreated ${normalizedDeadlines.length} deadlines.`)

  const passwordHash = await bcrypt.hash('password123', 10)
  const seedUsers = new Map<string, Awaited<ReturnType<typeof upsertSeedUser>>>()

  for (const user of [
    { email: 'counselor@campberry.com', name: 'Jane Counselor', role: 'COUNSELOR' },
    ...sampleCounselors,
    ...sampleReviewers,
  ]) {
    const seededUser = await upsertSeedUser(user.email, user.name, user.role, passwordHash)
    seedUsers.set(user.email, seededUser)
  }

  for (const sampleList of samplePublicLists) {
    const author = seedUsers.get(sampleList.authorEmail)
    if (!author) {
      continue
    }

    const existingList = await prisma.list.findFirst({
      where: {
        title: sampleList.title,
        author_id: author.id,
      },
      select: { id: true },
    })

    const list = existingList
      ? await prisma.list.update({
          where: { id: existingList.id },
          data: {
            description: sampleList.description,
            is_public: true,
          },
        })
      : await prisma.list.create({
          data: {
            title: sampleList.title,
            description: sampleList.description,
            is_public: true,
            author_id: author.id,
          },
        })

    await prisma.listItem.deleteMany({
      where: { list_id: list.id },
    })

    const listItems = []
    for (const [index, item] of sampleList.items.entries()) {
      const program = await prisma.program.findFirst({
        where: { name: item.programName },
        select: { id: true },
      })

      if (!program) {
        console.warn(`Skipping list item because program was not found: ${item.programName}`)
        continue
      }

      listItems.push({
        list_id: list.id,
        program_id: program.id,
        author_commentary: item.commentary,
        display_order: index + 1,
      })
    }

    if (listItems.length > 0) {
      await prisma.listItem.createMany({
        data: listItems,
      })
    }
  }

  for (const review of sampleProgramReviews) {
    const reviewer = seedUsers.get(review.reviewerEmail)
    const program = await prisma.program.findFirst({
      where: { name: review.programName },
      select: { id: true },
    })

    if (!reviewer || !program) {
      continue
    }

    await prisma.programReview.upsert({
      where: {
        program_id_user_id: {
          program_id: program.id,
          user_id: reviewer.id,
        },
      },
      update: {
        rating: review.rating,
        comment: review.comment,
      },
      create: {
        program_id: program.id,
        user_id: reviewer.id,
        rating: review.rating,
        comment: review.comment,
      },
    })
  }

  for (const review of sampleListReviews) {
    const reviewer = seedUsers.get(review.reviewerEmail)
    const list = await prisma.list.findFirst({
      where: { title: review.listTitle },
      select: { id: true },
    })

    if (!reviewer || !list) {
      continue
    }

    await prisma.listReview.upsert({
      where: {
        list_id_user_id: {
          list_id: list.id,
          user_id: reviewer.id,
        },
      },
      update: {
        rating: review.rating,
        comment: review.comment,
      },
      create: {
        list_id: list.id,
        user_id: reviewer.id,
        rating: review.rating,
        comment: review.comment,
      },
    })
  }

  console.log(`Seeding finished successfully. Synced ${normalizedPrograms.length} programs.`)
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
