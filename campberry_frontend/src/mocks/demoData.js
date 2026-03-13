const DEMO_INTERESTS = [
  { id: 1, name: 'STEM' },
  { id: 2, name: 'Writing' },
  { id: 3, name: 'Research' },
  { id: 4, name: 'Business' },
  { id: 5, name: 'Arts' },
  { id: 6, name: 'Health Science' },
  { id: 7, name: 'Public Policy' },
  { id: 8, name: 'Leadership' },
]

const byInterest = (name) => {
  const interest = DEMO_INTERESTS.find((entry) => entry.name === name)
  return { interest }
}

const DEMO_PROGRAMS = [
  {
    id: 'demo-program-astro-research',
    name: 'Astro Research Institute Summer Lab',
    type: 'PROGRAM',
    provider: { name: 'Nova Scholars Institute' },
    description:
      'A selective summer research intensive where students work in small teams on astronomy and data science projects. The program combines research mentoring, paper writing, and final presentations.',
    cost_info: 'Tuition: $3,200. Need-based aid available for admitted students.',
    admission_info: 'Application, transcript, and one short essay required.',
    eligibility_info: 'Open to students in grades 9-11 with strong quantitative interest.',
    eligible_grades: '9,10,11',
    experts_choice_rating: 'MOST_RECOMMENDED',
    impact_rating: 'HIGH_IMPACT',
    is_highly_selective: true,
    allows_international: true,
    logo_url: '',
    url: 'https://example.org/astro-research',
    interests: [byInterest('STEM'), byInterest('Research')],
    deadlines: [
      { description: 'Priority deadline', date: '2026-02-15T00:00:00.000Z' },
      { description: 'Final deadline', date: '2026-03-10T00:00:00.000Z' },
    ],
    sessions: [
      {
        start_date: '2026-06-15T00:00:00.000Z',
        end_date: '2026-07-12T00:00:00.000Z',
        location_type: 'IN_PERSON',
        location_name: 'Cambridge, MA',
      },
    ],
    feedback_summary: { averageRating: 4.8, ratingCount: 18, commentCount: 12 },
    feedback_preview: [
      { id: 'pr1', rating: 5, comment: 'Excellent mentorship and a serious research environment.', user: { name: 'Parent Review' } },
      { id: 'pr2', rating: 4, comment: 'Demanding workload, but the final project felt very meaningful.', user: { name: 'Student Review' } },
    ],
  },
  {
    id: 'demo-program-young-writers',
    name: 'Young Writers Editorial Studio',
    type: 'PROGRAM',
    provider: { name: 'Northfield Review' },
    description:
      'A writing and journalism studio focused on feature writing, editing, and pitching. Students build a portfolio and publish a final piece with editorial feedback.',
    cost_info: 'Tuition: $1,850. Scholarships available.',
    admission_info: 'Writing sample and short statement of interest.',
    eligibility_info: 'Open to grades 8-12.',
    eligible_grades: '8,9,10,11,12',
    experts_choice_rating: 'HIGHLY_RECOMMENDED',
    impact_rating: 'HIGH_IMPACT',
    allows_international: true,
    logo_url: '',
    url: 'https://example.org/writers-studio',
    interests: [byInterest('Writing'), byInterest('Leadership')],
    deadlines: [{ description: 'Application deadline', date: '2026-04-01T00:00:00.000Z' }],
    sessions: [
      {
        start_date: '2026-07-06T00:00:00.000Z',
        end_date: '2026-07-24T00:00:00.000Z',
        location_type: 'ONLINE',
        location_name: '',
      },
    ],
    feedback_summary: { averageRating: 4.6, ratingCount: 9, commentCount: 6 },
    feedback_preview: [
      { id: 'pr3', rating: 5, comment: 'Very strong writing feedback and a polished final portfolio.', user: { name: 'Counselor Review' } },
    ],
  },
  {
    id: 'demo-program-health-policy',
    name: 'Health Policy and Bioethics Academy',
    type: 'PROGRAM',
    provider: { name: 'Metro Pre-Med Network' },
    description:
      'Students explore healthcare systems, public policy, and bioethics through case discussions, hospital guest speakers, and a capstone policy memo.',
    cost_info: 'Tuition: $2,400. Partial aid available.',
    admission_info: 'Short answers and one recommendation.',
    eligibility_info: 'Grades 10-12.',
    eligible_grades: '10,11,12',
    experts_choice_rating: 'HIGHLY_RECOMMENDED',
    impact_rating: 'MOST_HIGH_IMPACT',
    is_highly_selective: true,
    allows_international: false,
    logo_url: '',
    url: 'https://example.org/health-policy',
    interests: [byInterest('Health Science'), byInterest('Public Policy')],
    deadlines: [{ description: 'Final deadline', date: '2026-03-28T00:00:00.000Z' }],
    sessions: [
      {
        start_date: '2026-06-22T00:00:00.000Z',
        end_date: '2026-07-17T00:00:00.000Z',
        location_type: 'IN_PERSON',
        location_name: 'Washington, DC',
      },
    ],
    feedback_summary: { averageRating: 4.9, ratingCount: 11, commentCount: 7 },
    feedback_preview: [
      { id: 'pr4', rating: 5, comment: 'Great for students interested in medicine beyond pure lab work.', user: { name: 'Advisor Review' } },
    ],
  },
  {
    id: 'demo-program-startup-sprint',
    name: 'Startup Sprint for Teens',
    type: 'PROGRAM',
    provider: { name: 'LaunchPad Youth Ventures' },
    description:
      'A business and product-building bootcamp where students validate an idea, build a pitch deck, and present to a panel of founders.',
    cost_info: 'Free for all selected participants.',
    admission_info: 'Application form and short video response.',
    eligibility_info: 'Grades 9-12.',
    eligible_grades: '9,10,11,12',
    experts_choice_rating: 'MOST_RECOMMENDED',
    impact_rating: 'HIGH_IMPACT',
    is_highly_selective: false,
    allows_international: true,
    logo_url: '',
    url: 'https://example.org/startup-sprint',
    interests: [byInterest('Business'), byInterest('Leadership')],
    deadlines: [{ description: 'Rolling admissions', date: '2026-05-10T00:00:00.000Z' }],
    sessions: [
      {
        start_date: '2026-07-20T00:00:00.000Z',
        end_date: '2026-08-07T00:00:00.000Z',
        location_type: 'ONLINE',
        location_name: '',
      },
    ],
    feedback_summary: { averageRating: 4.7, ratingCount: 14, commentCount: 9 },
    feedback_preview: [
      { id: 'pr5', rating: 5, comment: 'Fast-paced and practical. Students leave with something concrete.', user: { name: 'Parent Review' } },
    ],
  },
  {
    id: 'demo-program-arts-residency',
    name: 'Studio Arts Residency for High School Creators',
    type: 'PROGRAM',
    provider: { name: 'Harbor Arts Collective' },
    description:
      'An interdisciplinary arts residency covering visual arts, critique, and portfolio development with working artists.',
    cost_info: 'Tuition: $2,950. Merit awards available.',
    admission_info: 'Portfolio submission required.',
    eligibility_info: 'Grades 9-12.',
    eligible_grades: '9,10,11,12',
    experts_choice_rating: 'HIGHLY_RECOMMENDED',
    impact_rating: 'HIGH_IMPACT',
    allows_international: true,
    logo_url: '',
    url: 'https://example.org/arts-residency',
    interests: [byInterest('Arts')],
    deadlines: [{ description: 'Portfolio deadline', date: '2026-02-28T00:00:00.000Z' }],
    sessions: [
      {
        start_date: '2026-06-29T00:00:00.000Z',
        end_date: '2026-07-24T00:00:00.000Z',
        location_type: 'IN_PERSON',
        location_name: 'Providence, RI',
      },
    ],
    feedback_summary: { averageRating: 4.5, ratingCount: 7, commentCount: 4 },
    feedback_preview: [
      { id: 'pr6', rating: 4, comment: 'Excellent critique culture and strong portfolio guidance.', user: { name: 'Student Review' } },
    ],
  },
  {
    id: 'demo-program-policy-debate',
    name: 'Global Debate and Diplomacy Summit',
    type: 'COMPETITION',
    provider: { name: 'Model World Forum' },
    description:
      'A public speaking and diplomacy competition with policy briefs, negotiation rounds, and international affairs workshops.',
    cost_info: 'Competition fee: $320.',
    admission_info: 'Open registration with selective advanced track.',
    eligibility_info: 'Grades 8-12.',
    eligible_grades: '8,9,10,11,12',
    experts_choice_rating: 'HIGHLY_RECOMMENDED',
    impact_rating: 'HIGH_IMPACT',
    allows_international: true,
    logo_url: '',
    url: 'https://example.org/debate-summit',
    interests: [byInterest('Public Policy'), byInterest('Leadership')],
    deadlines: [{ description: 'Registration closes', date: '2026-09-01T00:00:00.000Z' }],
    sessions: [
      {
        start_date: '2026-10-10T00:00:00.000Z',
        end_date: '2026-10-12T00:00:00.000Z',
        location_type: 'IN_PERSON',
        location_name: 'New York, NY',
      },
    ],
    feedback_summary: { averageRating: 4.4, ratingCount: 6, commentCount: 3 },
    feedback_preview: [
      { id: 'pr7', rating: 4, comment: 'Very good speaking practice and conference energy.', user: { name: 'Competition Review' } },
    ],
  },
]

const attachListProgram = (programId, commentary, displayOrder) => {
  const program = DEMO_PROGRAMS.find((entry) => entry.id === programId)
  return {
    id: `item-${programId}`,
    program_id: programId,
    author_commentary: commentary,
    display_order: displayOrder,
    program,
  }
}

const DEMO_LISTS = [
  {
    id: 'demo-list-research',
    title: 'Counselor Picks: Research Programs That Signal Initiative',
    description:
      'A starter collection for students who want serious academic depth. These programs stand out for mentorship, selective admissions, and evidence of independent work.\n\nBest for students targeting STEM-heavy applications or research portfolios.',
    updated_at: '2026-02-10T00:00:00.000Z',
    is_public: true,
    author: { id: 'c1', name: 'School Counseling Group', role: 'COUNSELOR' },
    authorRole: 'COUNSELOR',
    feedback_summary: { averageRating: 4.8, ratingCount: 10, commentCount: 6 },
    feedback_preview: [
      { id: 'lr1', rating: 5, comment: 'Very useful list if you are overwhelmed by generic summer program directories.', user: { name: 'Parent Review' } },
    ],
    items: [
      attachListProgram('demo-program-astro-research', 'Strong signal for students who want authentic research, not just enrichment branding.', 1),
      attachListProgram('demo-program-health-policy', 'Pairs well with pre-med or public policy narratives because the output is concrete.', 2),
    ],
  },
  {
    id: 'demo-list-writing',
    title: 'Counselor Picks: Writing and Journalism Programs Worth Watching',
    description:
      'A short list of programs with real writing output and visible editorial structure.\n\nUseful for students building portfolios for school newspapers, humanities programs, or narrative-heavy application themes.',
    updated_at: '2026-01-28T00:00:00.000Z',
    is_public: true,
    author: { id: 'c2', name: 'Campberry Editorial Team', role: 'COUNSELOR' },
    authorRole: 'COUNSELOR',
    feedback_summary: { averageRating: 4.6, ratingCount: 7, commentCount: 5 },
    feedback_preview: [
      { id: 'lw1', rating: 5, comment: 'The commentary helped us understand what each program is actually good for.', user: { name: 'Parent Review' } },
    ],
    items: [
      attachListProgram('demo-program-young-writers', 'Excellent for students who need strong editing feedback and publishable work.', 1),
      attachListProgram('demo-program-policy-debate', 'A good adjacent option for students whose writing strength shows up in argument and speaking.', 2),
    ],
  },
  {
    id: 'demo-list-access',
    title: 'Campberry Demo: High-Value Programs to Explore',
    description:
      'A lightweight demo list for the public Pages version. These picks show the kind of curated guidance Campberry surfaces even before the live backend is online.',
    updated_at: '2026-02-18T00:00:00.000Z',
    is_public: true,
    author: { id: 'c3', name: 'Campberry', role: 'EDITOR' },
    authorRole: 'EDITOR',
    feedback_summary: { averageRating: 4.7, ratingCount: 5, commentCount: 2 },
    feedback_preview: [],
    items: [
      attachListProgram('demo-program-startup-sprint', 'Practical and output-driven. Great option for motivated students who want visible project work.', 1),
      attachListProgram('demo-program-arts-residency', 'Strong portfolio value for students building a serious creative application narrative.', 2),
    ],
  },
]

const normalizeSearchText = (value) => (value || '').toLowerCase().trim()

const includesText = (haystack, needle) => normalizeSearchText(haystack).includes(normalizeSearchText(needle))

const hasHighImpactRating = (program) =>
  program?.impact_rating === 'HIGH_IMPACT' || program?.impact_rating === 'MOST_HIGH_IMPACT'

const getProgramStarRating = (program) => {
  if (program?.experts_choice_rating !== 'MOST_RECOMMENDED') {
    return 0
  }

  if (hasHighImpactRating(program) && program?.is_highly_selective) {
    return 5
  }

  if (hasHighImpactRating(program)) {
    return 4
  }

  return 3
}

const getProgramRatingScore = (program) => {
  const starRating = getProgramStarRating(program)
  if (starRating > 0) {
    return starRating * 100
  }

  let score = 0

  if (program?.experts_choice_rating === 'HIGHLY_RECOMMENDED') {
    score += 70
  }

  if (program?.impact_rating === 'MOST_HIGH_IMPACT') {
    score += 35
  } else if (program?.impact_rating === 'HIGH_IMPACT') {
    score += 25
  }

  if (program?.is_highly_selective) {
    score += 10
  }

  return score
}

const getDeadlineTime = (deadline) => {
  const parsed = new Date(deadline?.predictedDate || deadline?.date || '').getTime()
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed
}

export const getDemoInterests = () => DEMO_INTERESTS

export const getDemoLists = () =>
  DEMO_LISTS.map(({ items, ...rest }) => ({
    ...rest,
    items_count: items.length,
  }))

export const getDemoListById = (id) => {
  const list = DEMO_LISTS.find((entry) => entry.id === id)
  if (!list) {
    throw new Error('List not found')
  }

  return list
}

export const getDemoProgramById = (id) => {
  const program = DEMO_PROGRAMS.find((entry) => entry.id === id)
  if (!program) {
    throw new Error('Program not found')
  }

  return program
}

export const getDemoPrograms = (params = {}) => {
  let filtered = [...DEMO_PROGRAMS]

  if (params.search) {
    filtered = filtered.filter((program) =>
      includesText(program.name, params.search) ||
      includesText(program.provider?.name, params.search) ||
      program.interests?.some((interest) => includesText(interest.interest?.name, params.search))
    )
  }

  if (params.type) {
    filtered = filtered.filter((program) => program.type === params.type)
  }

  if (params.rating) {
    filtered = filtered.filter((program) => program.experts_choice_rating === params.rating)
  }

  if (params.isSelective) {
    filtered = filtered.filter((program) => program.is_highly_selective)
  }

  if (params.locationQuery) {
    filtered = filtered.filter((program) =>
      program.sessions?.some((session) => includesText(session.location_name, params.locationQuery))
    )
  }

  if (params.season) {
    filtered = filtered.filter((program) => {
      const month = new Date(program.sessions?.[0]?.start_date || '').getMonth() + 1
      if (params.season === 'Summer') return month >= 6 && month <= 8
      if (params.season === 'Fall') return month >= 9 && month <= 11
      if (params.season === 'Spring') return month >= 2 && month <= 5
      return true
    })
  }

  if (params.onlineOnly) {
    filtered = filtered.filter((program) => program.sessions?.some((session) => session.location_type === 'ONLINE'))
  }

  if (params.interests) {
    const requested = String(params.interests).split(',').filter(Boolean)
    filtered = filtered.filter((program) =>
      requested.some((id) =>
        program.interests?.some((interest) => String(interest.interest?.id) === id)
      )
    )
  }

  if (params.grades) {
    const requested = String(params.grades).split(',').filter(Boolean)
    filtered = filtered.filter((program) => requested.some((grade) => program.eligible_grades?.split(',').includes(grade)))
  }

  if (params.international) {
    filtered = filtered.filter((program) => program.allows_international)
  }

  if (params.sort === 'rating') {
    filtered.sort((left, right) => {
      return getProgramRatingScore(right) - getProgramRatingScore(left)
    })
  }

  if (params.sort === 'selectivity') {
    filtered.sort((left, right) => {
      if (left.is_highly_selective !== right.is_highly_selective) {
        return right.is_highly_selective ? 1 : -1
      }

      return getProgramRatingScore(right) - getProgramRatingScore(left)
    })
  }

  if (params.sort === 'deadline') {
    filtered.sort((left, right) => {
      const leftDate = Math.min(...(left.deadlines || []).map(getDeadlineTime), Number.POSITIVE_INFINITY)
      const rightDate = Math.min(...(right.deadlines || []).map(getDeadlineTime), Number.POSITIVE_INFINITY)
      const comparison = leftDate - rightDate
      return params.sortOrder === 'desc' ? comparison * -1 : comparison
    })
  }

  const limit = Number(params.limit || 10)
  const page = Number(params.page || 1)
  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const startIndex = (page - 1) * limit

  return {
    data: filtered.slice(startIndex, startIndex + limit),
    meta: {
      total,
      totalPages,
      page,
      limit,
    },
  }
}
