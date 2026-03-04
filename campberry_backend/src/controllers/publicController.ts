import { Request, Response } from 'express';
import prisma from '../db';

export const getPrograms = async (req: Request, res: Response) => {
  try {
    const {
      search,
      interests,
      type,
      minGrade,
      maxGrade,
      isFree,
      isSelective,
      rating,
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
