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
          'One of the cleaner “research credibility” signals in this database. The structure is serious, and the brand carries weight with STEM-oriented applicants.',
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
      'I usually recommend this mix to students who already write regularly and need a sharper environment, better mentorship, or stronger external validation.\n\nThis is not just a “creative hobby” list. These programs can help students build portfolio material, editorial judgment, and a more mature intellectual voice.',
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
      'For students who say “pre-med,” I try to separate programs that merely sound medical from those that actually provide useful exposure to research, health systems, or scientific training.\n\nThis list mixes direct hospital or health-care exposure with academically serious biology and lab-oriented options so families can compare different paths early.',
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
          'Good exploratory option for students still narrowing down what “healthcare” means for them beyond doctor as a default answer.',
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

    for (const [index, item] of sampleList.items.entries()) {
      const program = await prisma.program.findFirst({
        where: { name: item.programName },
        select: { id: true },
      })

      if (!program) {
        console.warn(`Skipping list item because program was not found: ${item.programName}`)
        continue
      }

      await prisma.listItem.create({
        data: {
          list_id: list.id,
          program_id: program.id,
          author_commentary: item.commentary,
          display_order: index + 1,
        },
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
