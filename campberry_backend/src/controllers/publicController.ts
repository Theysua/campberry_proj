import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { parseOrRespond } from '../validation/parse';
import { searchProgramsQuerySchema } from '../validation/schemas';

const PUBLIC_RESPONSE_CACHE = new Map<string, { expiresAt: number; payload: unknown }>();
const PROGRAMS_CACHE_TTL_MS = 60 * 1000;
const INTERESTS_CACHE_TTL_MS = 10 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || 'campberry_super_secret';
const GUEST_SEARCH_VISIBLE_LIMIT = 10;

const getCachedResponse = <T>(key: string): T | null => {
  const cached = PUBLIC_RESPONSE_CACHE.get(key);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    PUBLIC_RESPONSE_CACHE.delete(key);
    return null;
  }

  return cached.payload as T;
};

const getOptionalViewer = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
  } catch {
    return null;
  }
};

const setCachedResponse = (key: string, payload: unknown, ttlMs: number) => {
  PUBLIC_RESPONSE_CACHE.set(key, {
    payload,
    expiresAt: Date.now() + ttlMs,
  });
};

const sendCachedJson = (res: Response, payload: unknown, maxAgeSeconds: number, cacheState: 'HIT' | 'MISS') => {
  res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 5}`);
  res.setHeader('X-Campberry-Cache', cacheState);
  res.json(payload);
};

const SEASON_MONTHS: Record<string, number[]> = {
  SPRING: [1, 2, 3, 4, 5],
  SUMMER: [6, 7, 8],
  FALL: [9, 10, 11],
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const haversineMiles = (
  originLat: number,
  originLng: number,
  destinationLat: number,
  destinationLng: number
) => {
  const earthRadiusMiles = 3958.8;
  const dLat = toRadians(destinationLat - originLat);
  const dLng = toRadians(destinationLng - originLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(originLat)) *
      Math.cos(toRadians(destinationLat)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a));
};

const getMonthRange = (startDate?: Date | null, endDate?: Date | null) => {
  if (!startDate && !endDate) {
    return [];
  }

  const start = startDate ?? endDate;
  const end = endDate ?? startDate;

  if (!start || !end) {
    return [];
  }

  const months: number[] = [];
  const cursor = new Date(start);
  cursor.setDate(1);
  const finalDate = new Date(end);
  finalDate.setDate(1);

  while (cursor <= finalDate) {
    months.push(cursor.getMonth() + 1);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return months;
};

const matchesSeason = (sessions: Array<{ start_date?: Date | null; end_date?: Date | null }>, season?: string) => {
  if (!season) {
    return true;
  }

  const allowedMonths = SEASON_MONTHS[String(season).toUpperCase()];
  if (!allowedMonths) {
    return true;
  }

  return sessions.some((session) =>
    getMonthRange(session.start_date, session.end_date).some((month) =>
      allowedMonths.includes(month)
    )
  );
};

const parseGradeList = (eligibleGrades?: string | null) =>
  String(eligibleGrades || '')
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value));

const matchesGrades = (eligibleGrades?: string | null, selectedGrades?: number[]) => {
  if (!selectedGrades || selectedGrades.length === 0) {
    return true;
  }

  const availableGrades = parseGradeList(eligibleGrades);
  return selectedGrades.some((grade) => availableGrades.includes(grade));
};

const hasOnlineSession = (sessions: Array<{ location_type?: string | null }>) =>
  sessions.some((session) => session.location_type === 'ONLINE');

const hasPhysicalSession = (sessions: Array<{ location_type?: string | null }>) =>
  sessions.some((session) => session.location_type !== 'ONLINE');

const getProgramDistanceMiles = (
  sessions: Array<{
    location_type?: string | null;
    location_lat?: number | null;
    location_lng?: number | null;
  }>,
  lat?: number,
  lng?: number
) => {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  let minDistance: number | null = null;

  for (const session of sessions) {
    if (
      session.location_type === 'ONLINE' ||
      typeof session.location_lat !== 'number' ||
      typeof session.location_lng !== 'number'
    ) {
      continue;
    }

    const distance = haversineMiles(lat as number, lng as number, session.location_lat, session.location_lng);
    if (minDistance === null || distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance;
};

const matchesLocationText = (
  sessions: Array<{ location_name?: string | null }>,
  locationText?: string
) => {
  if (!locationText) {
    return false;
  }

  const normalized = locationText.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return sessions.some((session) =>
    String(session.location_name || '').toLowerCase().includes(normalized)
  );
};

const getRatingScore = (program: {
  experts_choice_rating?: string | null;
  impact_rating?: string | null;
  is_highly_selective?: boolean | null;
}) => {
  const hasHighImpact =
    program.impact_rating === 'HIGH_IMPACT' || program.impact_rating === 'MOST_HIGH_IMPACT';

  if (program.experts_choice_rating === 'MOST_RECOMMENDED' && hasHighImpact && program.is_highly_selective) {
    return 500;
  }

  if (program.experts_choice_rating === 'MOST_RECOMMENDED' && hasHighImpact) {
    return 400;
  }

  if (program.experts_choice_rating === 'MOST_RECOMMENDED') {
    return 300;
  }

  let score = 0;
  if (program.experts_choice_rating === 'HIGHLY_RECOMMENDED') {
    score += 70;
  }

  if (program.impact_rating === 'MOST_HIGH_IMPACT') {
    score += 35;
  } else if (program.impact_rating === 'HIGH_IMPACT') {
    score += 25;
  }

  if (program.is_highly_selective) {
    score += 10;
  }

  return score;
};

const toDeadlineTimestamp = (value?: Date | string | null) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
};

const isNormalizedDeadline = (
  value: { description: string; date: Date } | null
): value is { description: string; date: Date } => value !== null;

const getNormalizedDeadlines = (
  deadlines: Array<{ description?: string | null; date?: Date | string | null }>,
  trpcData?: string | null
) => {
  if (trpcData) {
    try {
      const parsed = JSON.parse(trpcData);
      const normalizedFromTrpc: Array<{ description: string; date: Date }> = Array.isArray(parsed?.deadlines)
        ? parsed.deadlines
            .map((deadline: { description?: string | null; date?: string | null; predictedDate?: string | null }) => {
              const normalizedDate = deadline?.predictedDate || deadline?.date || null;
              const timestamp = toDeadlineTimestamp(normalizedDate);

              if (timestamp === null) {
                return null;
              }

              return {
                description: deadline?.description || 'Deadline',
                date: new Date(timestamp),
              };
            })
            .filter(isNormalizedDeadline)
            .sort(
              (left: { date: Date }, right: { date: Date }) => left.date.getTime() - right.date.getTime()
            )
        : [];

      if (normalizedFromTrpc.length > 0) {
        return normalizedFromTrpc;
      }
    } catch {
      // Fall back to relational deadlines when trpc_data is unavailable or malformed.
    }
  }

  return deadlines
    .map((deadline) => {
      const timestamp = toDeadlineTimestamp(deadline?.date);
      if (timestamp === null) {
        return null;
      }

      return {
        description: deadline?.description || 'Deadline',
        date: new Date(timestamp),
      };
    })
    .filter(isNormalizedDeadline)
    .sort((left: { date: Date }, right: { date: Date }) => left.date.getTime() - right.date.getTime());
};

const getNextDeadlineTime = (deadlines: Array<{ date: Date }>) => {
  const now = Date.now();
  const futureDeadlines = deadlines
    .map((deadline) => new Date(deadline.date).getTime())
    .filter((time) => time >= now)
    .sort((a, b) => a - b);

  return futureDeadlines[0] ?? Number.POSITIVE_INFINITY;
};

const getRelevanceScore = (
  program: {
    name?: string | null;
    description?: string | null;
    provider?: { name?: string | null } | null;
    experts_choice_rating?: string | null;
    impact_rating?: string | null;
    is_highly_selective?: boolean | null;
  },
  search?: string
) => {
  if (!search) {
    return getRatingScore(program);
  }

  const query = search.trim().toLowerCase();
  const programName = String(program.name || '').toLowerCase();
  const providerName = String(program.provider?.name || '').toLowerCase();
  const description = String(program.description || '').toLowerCase();

  let score = 0;
  if (programName === query) {
    score += 200;
  } else if (programName.startsWith(query)) {
    score += 120;
  } else if (programName.includes(query)) {
    score += 80;
  }

  if (providerName.includes(query)) {
    score += 40;
  }

  if (description.includes(query)) {
    score += 10;
  }

  return score + getRatingScore(program);
};

const canUseDistance = (lat?: number, lng?: number) =>
  Number.isFinite(lat) && Number.isFinite(lng);

const formatAverageRating = (value: number | null | undefined) =>
  typeof value === 'number' ? Math.round(value * 10) / 10 : null;

const getProgramFeedbackSnapshot = async (programId: string) => {
  const [aggregate, commentCount, reviews] = await prisma.$transaction([
    prisma.programReview.aggregate({
      where: { program_id: programId },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.programReview.count({
      where: {
        program_id: programId,
        comment: { not: null },
      },
    }),
    prisma.programReview.findMany({
      where: {
        program_id: programId,
        comment: { not: null },
      },
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        rating: true,
        comment: true,
        created_at: true,
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar_url: true,
          },
        },
      },
    }),
  ]);

  return {
    summary: {
      averageRating: formatAverageRating(aggregate._avg.rating),
      ratingCount: aggregate._count._all,
      commentCount,
    },
    reviews,
  };
};

const getListFeedbackSnapshot = async (listId: string) => {
  const [aggregate, commentCount, reviews] = await prisma.$transaction([
    prisma.listReview.aggregate({
      where: { list_id: listId },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.listReview.count({
      where: {
        list_id: listId,
        comment: { not: null },
      },
    }),
    prisma.listReview.findMany({
      where: {
        list_id: listId,
        comment: { not: null },
      },
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        rating: true,
        comment: true,
        created_at: true,
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar_url: true,
          },
        },
      },
    }),
  ]);

  return {
    summary: {
      averageRating: formatAverageRating(aggregate._avg.rating),
      ratingCount: aggregate._count._all,
      commentCount,
    },
    reviews,
  };
};

const getBoundingBox = (lat: number, lng: number, radiusMiles: number) => {
  const latDelta = radiusMiles / 69;
  const cosLat = Math.cos(toRadians(lat));
  const lngDelta = radiusMiles / (69 * Math.max(Math.abs(cosLat), 0.01));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLng: lng - lngDelta,
    maxLng: lng + lngDelta,
  };
};

const PHYSICAL_SESSION_CLAUSE = {
  OR: [
    { location_type: { not: 'ONLINE' } },
    { location_type: null },
  ],
};

const buildSessionFilterClause = ({
  onlineOnlyPrograms,
  includeOnlinePrograms,
  latitude,
  longitude,
  distanceRadius,
  locationText,
}: {
  onlineOnlyPrograms: boolean;
  includeOnlinePrograms: boolean;
  latitude?: number;
  longitude?: number;
  distanceRadius?: number;
  locationText?: string;
}) => {
  if (onlineOnlyPrograms) {
    return {
      sessions: {
        some: {
          location_type: 'ONLINE',
        },
      },
    };
  }

  if (canUseDistance(latitude, longitude) && Number.isFinite(distanceRadius)) {
    const bounds = getBoundingBox(latitude as number, longitude as number, distanceRadius as number);
    const physicalMatch = {
      sessions: {
        some: {
          AND: [
            PHYSICAL_SESSION_CLAUSE,
            { location_lat: { gte: bounds.minLat, lte: bounds.maxLat } },
            { location_lng: { gte: bounds.minLng, lte: bounds.maxLng } },
          ],
        },
      },
    };

    if (!includeOnlinePrograms) {
      return physicalMatch;
    }

    return {
      OR: [
        physicalMatch,
        {
          sessions: {
            some: {
              location_type: 'ONLINE',
            },
          },
        },
      ],
    };
  }

  if (locationText) {
    const physicalMatch = {
      sessions: {
        some: {
          location_name: {
            contains: locationText,
            mode: 'insensitive' as const,
          },
        },
      },
    };

    if (!includeOnlinePrograms) {
      return physicalMatch;
    }

    return {
      OR: [
        physicalMatch,
        {
          sessions: {
            some: {
              location_type: 'ONLINE',
            },
          },
        },
      ],
    };
  }

  if (!includeOnlinePrograms) {
    return {
      sessions: {
        some: PHYSICAL_SESSION_CLAUSE,
      },
    };
  }

  return null;
};

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const viewer = getOptionalViewer(req);
    const isGuestViewer = !viewer;
    const cacheKey = `programs:${isGuestViewer ? 'guest' : `auth:${viewer.id}`}:${req.originalUrl}`;
    const cachedPayload = getCachedResponse<any>(cacheKey);
    if (cachedPayload) {
      sendCachedJson(res, cachedPayload, 60, 'HIT');
      return;
    }

    const parsedQuery = parseOrRespond(searchProgramsQuerySchema, req.query, res);
    if (!parsedQuery) {
      return;
    }

    const {
      search,
      interests,
      type,
      isSelective,
      rating,
      impact,
      zip,
      locationQuery,
      season,
      onlineOnly,
      includeOnline,
      grades,
      international,
      collegeCredit,
      oneOnOne,
      lat,
      lng,
      radiusMiles,
      sort,
      sortOrder,
      page = 1,
      limit = 10,
    } = parsedQuery;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);
    const selectedGrades = grades
      ? grades
          .split(',')
          .map((value) => Number(value.trim()))
          .filter((value) => Number.isInteger(value))
      : [];

    const latitude = lat;
    const longitude = lng;
    const distanceRadius = radiusMiles;
    const locationText = locationQuery || zip;
    const includeOnlinePrograms = includeOnline !== 'false';
    const onlineOnlyPrograms = onlineOnly === 'true';
    const sortKey = sort || 'relevancy';
    const sortDirection = sortOrder || 'asc';

    const whereClause: any = {};
    const andClauses: any[] = [];

    if (search) {
      const query = String(search).trim();
      andClauses.push({
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            provider: {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (type) {
      whereClause.type = String(type);
    }

    if (isSelective === 'true') {
      whereClause.is_highly_selective = true;
    }

    if (rating) {
      whereClause.experts_choice_rating = String(rating);
    }

    if (impact === 'HIGH_IMPACT') {
      whereClause.experts_choice_rating = 'MOST_RECOMMENDED';
      whereClause.is_highly_selective = true;
    } else if (impact) {
      whereClause.impact_rating = String(impact);
    }

    if (international === 'true') {
      whereClause.allows_international = true;
    }

    if (collegeCredit === 'true') {
      whereClause.offers_college_credit = true;
    }

    if (oneOnOne === 'true') {
      whereClause.is_one_on_one = true;
    }

    if (interests && typeof interests === 'string') {
      const interestIds = interests.split(',').map(Number).filter((value) => !Number.isNaN(value));
      if (interestIds.length > 0) {
        whereClause.interests = {
          some: {
            interest_id: { in: interestIds },
          },
        };
      }
    }

    const sessionClause = buildSessionFilterClause({
      onlineOnlyPrograms,
      includeOnlinePrograms,
      latitude,
      longitude,
      distanceRadius,
      locationText: typeof locationText === 'string' ? locationText.trim() : undefined,
    });

    if (sessionClause) {
      andClauses.push(sessionClause);
    }

    if (andClauses.length > 0) {
      whereClause.AND = andClauses;
    }

    const candidatePrograms = await prisma.program.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        description: true,
        eligible_grades: true,
        experts_choice_rating: true,
        impact_rating: true,
        is_highly_selective: true,
        trpc_data: true,
        provider: {
          select: {
            name: true,
          },
        },
        deadlines: {
          select: {
            date: true,
          },
        },
        sessions: {
          select: {
            start_date: true,
            end_date: true,
            location_type: true,
            location_name: true,
            location_lat: true,
            location_lng: true,
          },
        },
      },
    });

    const filteredPrograms = candidatePrograms
      .map((program) => ({
        ...program,
        distance_miles: getProgramDistanceMiles(program.sessions, latitude, longitude),
      }))
      .filter((program) => matchesGrades(program.eligible_grades, selectedGrades))
      .filter((program) => matchesSeason(program.sessions, typeof season === 'string' ? season : undefined))
      .filter((program) => {
        const hasOnline = hasOnlineSession(program.sessions);
        const hasPhysical = hasPhysicalSession(program.sessions);

        if (onlineOnlyPrograms) {
          return hasOnline;
        }

        if (!includeOnlinePrograms && !hasPhysical) {
          return false;
        }

        if (canUseDistance(latitude, longitude) && Number.isFinite(distanceRadius)) {
          const physicalMatch =
            typeof program.distance_miles === 'number' &&
            program.distance_miles <= (distanceRadius as number);
          return physicalMatch || (includeOnlinePrograms && hasOnline);
        }

        if (locationText) {
          const physicalMatch = matchesLocationText(program.sessions, locationText);
          return physicalMatch || (includeOnlinePrograms && hasOnline);
        }

        return includeOnlinePrograms || hasPhysical;
      });

    filteredPrograms.sort((left, right) => {
      if (sortKey === 'rating') {
        return getRatingScore(right) - getRatingScore(left);
      }

      if (sortKey === 'selectivity') {
        if (Boolean(left.is_highly_selective) !== Boolean(right.is_highly_selective)) {
          return Boolean(right.is_highly_selective) ? 1 : -1;
        }

        return getRatingScore(right) - getRatingScore(left);
      }

      if (sortKey === 'deadline') {
        const comparison =
          getNextDeadlineTime(getNormalizedDeadlines(left.deadlines, left.trpc_data)) -
          getNextDeadlineTime(getNormalizedDeadlines(right.deadlines, right.trpc_data));
        return sortDirection === 'desc' ? comparison * -1 : comparison;
      }

      if (sortKey === 'distance' && canUseDistance(latitude, longitude)) {
        const leftDistance = left.distance_miles ?? Number.POSITIVE_INFINITY;
        const rightDistance = right.distance_miles ?? Number.POSITIVE_INFINITY;
        return leftDistance - rightDistance;
      }

      return (
        getRelevanceScore(right, typeof search === 'string' ? search : undefined) -
        getRelevanceScore(left, typeof search === 'string' ? search : undefined)
      );
    });

    const total = filteredPrograms.length;
    const visiblePrograms = isGuestViewer
      ? filteredPrograms.slice(0, GUEST_SEARCH_VISIBLE_LIMIT)
      : filteredPrograms;
    const effectivePageNumber = isGuestViewer ? 1 : pageNumber;
    const effectiveLimitNumber = isGuestViewer ? Math.min(limitNumber, GUEST_SEARCH_VISIBLE_LIMIT) : limitNumber;
    const paginatedIds = visiblePrograms
      .slice((effectivePageNumber - 1) * effectiveLimitNumber, effectivePageNumber * effectiveLimitNumber)
      .map((program) => program.id);

    if (paginatedIds.length === 0) {
      const payload = {
        data: [],
        meta: {
          page: effectivePageNumber,
          limit: effectiveLimitNumber,
          total: visiblePrograms.length,
          totalPages: Math.max(1, Math.ceil(visiblePrograms.length / effectiveLimitNumber)),
          totalMatches: total,
          guestVisibleLimit: isGuestViewer ? GUEST_SEARCH_VISIBLE_LIMIT : null,
          loginRequiredForMore: isGuestViewer && total > GUEST_SEARCH_VISIBLE_LIMIT,
          hiddenCount: isGuestViewer ? Math.max(0, total - GUEST_SEARCH_VISIBLE_LIMIT) : 0,
        },
      };
      setCachedResponse(cacheKey, payload, PROGRAMS_CACHE_TTL_MS);
      sendCachedJson(res, payload, 60, 'MISS');
      return;
    }

    const paginatedPrograms = await prisma.program.findMany({
      where: {
        id: {
          in: paginatedIds,
        },
      },
      include: {
        provider: true,
        deadlines: true,
        sessions: true,
        interests: {
          include: {
            interest: true,
          },
        },
      },
    });

    const paginatedProgramMap = new Map(paginatedPrograms.map((program) => [program.id, program]));
    const candidateMap = new Map(filteredPrograms.map((program) => [program.id, program]));
    const orderedPrograms = paginatedIds
      .map((id) => {
        const fullProgram = paginatedProgramMap.get(id);
        if (!fullProgram) {
          return null;
        }

        return {
          ...fullProgram,
          deadlines: getNormalizedDeadlines(fullProgram.deadlines, fullProgram.trpc_data),
          distance_miles: candidateMap.get(id)?.distance_miles ?? null,
        };
      })
      .filter(Boolean);

    const payload = {
      data: orderedPrograms,
      meta: {
        page: effectivePageNumber,
        limit: effectiveLimitNumber,
        total: visiblePrograms.length,
        totalPages: Math.max(1, Math.ceil(visiblePrograms.length / effectiveLimitNumber)),
        totalMatches: total,
        guestVisibleLimit: isGuestViewer ? GUEST_SEARCH_VISIBLE_LIMIT : null,
        loginRequiredForMore: isGuestViewer && total > GUEST_SEARCH_VISIBLE_LIMIT,
        hiddenCount: isGuestViewer ? Math.max(0, total - GUEST_SEARCH_VISIBLE_LIMIT) : 0,
      },
    };

    setCachedResponse(cacheKey, payload, PROGRAMS_CACHE_TTL_MS);
    sendCachedJson(res, payload, 60, 'MISS');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

export const getProgramById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.findUnique({
      where: { id: String(id) },
      include: {
        provider: true,
        sessions: true,
        deadlines: true,
        interests: {
          include: { interest: true },
        },
      },
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const feedback = await getProgramFeedbackSnapshot(program.id);

    res.json({
      ...program,
      deadlines: getNormalizedDeadlines(program.deadlines, program.trpc_data),
      feedback_summary: feedback.summary,
      feedback_preview: feedback.reviews.slice(0, 3),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
};

export const getLists = async (_req: Request, res: Response) => {
  try {
    const lists = await prisma.list.findMany({
      where: { is_public: true },
      include: {
        author: {
          select: { name: true, role: true },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { updated_at: 'desc' },
    });
    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
};

export const getListById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const list = await prisma.list.findFirst({
      where: {
        id: String(id),
        is_public: true,
      },
      include: {
        author: {
          select: { name: true, role: true },
        },
        items: {
          include: {
            program: {
              include: { provider: true },
            },
          },
          orderBy: { display_order: 'asc' },
        },
      },
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const feedback = await getListFeedbackSnapshot(list.id);

    res.json({
      ...list,
      feedback_summary: feedback.summary,
      feedback_preview: feedback.reviews.slice(0, 3),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
};

export const getProgramFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.findUnique({
      where: { id: String(id) },
      select: { id: true },
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const feedback = await getProgramFeedbackSnapshot(program.id);
    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch program feedback' });
  }
};

export const getListFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const list = await prisma.list.findFirst({
      where: {
        id: String(id),
        is_public: true,
      },
      select: { id: true },
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const feedback = await getListFeedbackSnapshot(list.id);
    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch list feedback' });
  }
};

export const getInterests = async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'interests';
    const cachedPayload = getCachedResponse<any[]>(cacheKey);
    if (cachedPayload) {
      sendCachedJson(res, cachedPayload, 600, 'HIT');
      return;
    }

    const interests = await prisma.interest.findMany({
      orderBy: { name: 'asc' },
    });
    setCachedResponse(cacheKey, interests, INTERESTS_CACHE_TTL_MS);
    sendCachedJson(res, interests, 600, 'MISS');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch interests' });
  }
};
