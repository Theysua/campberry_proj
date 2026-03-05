import { Request, Response } from 'express';
import prisma from '../db';

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const {
      search,
      interests,
      type,
      isFree,
      isSelective,
      rating,
      zip,
      season,
      onlineOnly,
      includeOnline,
      grades,
      international,
      collegeCredit,
      oneOnOne,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Building the where clause based on query params
    const whereClause: any = {};

    if (search) {
      whereClause.name = {
        contains: String(search),
        mode: 'insensitive',
      };
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

    if (isFree === 'true') {
      // According to frontend filters, free maps roughly to cost_info containing 'free' or 0
      whereClause.cost_info = {
        contains: 'free',
        mode: 'insensitive'
      };
    }

    if (season) {
      whereClause.sessions = {
        some: {
          name: {
            contains: String(season),
            mode: 'insensitive'
          }
        }
      };
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

    if (zip) {
      whereClause.sessions = {
        ...(whereClause.sessions || {}),
        some: {
          ...(whereClause.sessions?.some || {}),
          location_name: {
            contains: String(zip),
            mode: 'insensitive'
          }
        }
      };
    }

    if (onlineOnly === 'true') {
      whereClause.sessions = {
        ...(whereClause.sessions || {}),
        some: {
          ...(whereClause.sessions?.some || {}),
          location_type: 'ONLINE'
        }
      };
    } else if (includeOnline !== 'true') {
      // Exclude online programs
      whereClause.sessions = {
        ...(whereClause.sessions || {}),
        none: {
          location_type: 'ONLINE'
        }
      };
    }

    if (grades && typeof grades === 'string') {
      const selectedGrades = grades.split(',').map(g => parseInt(g.trim())).filter(g => !isNaN(g));
      if (selectedGrades.length > 0) {
        whereClause.AND = [
          ...(whereClause.AND || []),
          {
            OR: selectedGrades.map(g => ({
              eligible_grades: { contains: String(g) }
            }))
          }
        ];
      }
    }

    if (interests && typeof interests === 'string') {
      const interestIds = interests.split(',').map(Number).filter(n => !isNaN(n));
      if (interestIds.length > 0) {
        whereClause.interests = {
          some: {
            interest_id: { in: interestIds }
          }
        };
      }
    }

    // Default fetch with new filters
    const programs = await prisma.program.findMany({
      where: whereClause,
      include: {
        provider: true,
        interests: {
          include: {
            interest: true
          }
        }
      },
      skip,
      take: limitNumber,
      orderBy: { created_at: 'desc' }
    });

    const total = await prisma.program.count({ where: whereClause });

    res.json({
      data: programs,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });

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
          include: { interest: true }
        }
      }
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
};

export const getLists = async (req: Request, res: Response) => {
  try {
    const lists = await prisma.list.findMany({
      where: { is_public: true },
      include: {
        author: {
          select: { name: true, role: true }
        }
      }
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
    const list = await prisma.list.findUnique({
      where: { id: String(id) },
      include: {
        author: {
          select: { name: true }
        },
        items: {
          include: {
            program: {
              include: { provider: true }
            }
          },
          orderBy: { display_order: 'asc' }
        }
      }
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
};

export const getInterests = async (req: Request, res: Response) => {
  try {
    const interests = await prisma.interest.findMany();
    res.json(interests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch interests' });
  }
};
