import { Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';
import { parseOrRespond } from '../validation/parse';
import {
  addListItemBodySchema,
  createFeedbackBodySchema,
  createListBodySchema,
  saveListBodySchema,
  saveProgramBodySchema,
  updateListBodySchema,
  updateListItemBodySchema,
} from '../validation/schemas';

const canManagePublicLists = (role?: string) => ['COUNSELOR', 'ADMIN'].includes(String(role || ''));

const ensureAuthenticated = (req: AuthRequest, res: Response) => {
  if (!req.user?.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  return req.user;
};

const formatAverageRating = (value: number | null | undefined) =>
  typeof value === 'number' ? Math.round(value * 10) / 10 : null;

const getProgramFeedbackSummary = async (programId: string) => {
  const [aggregate, commentCount] = await prisma.$transaction([
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
  ]);

  return {
    averageRating: formatAverageRating(aggregate._avg.rating),
    ratingCount: aggregate._count._all,
    commentCount,
  };
};

const getListFeedbackSummary = async (listId: string) => {
  const [aggregate, commentCount] = await prisma.$transaction([
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
  ]);

  return {
    averageRating: formatAverageRating(aggregate._avg.rating),
    ratingCount: aggregate._count._all,
    commentCount,
  };
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        is_verified: true,
      },
    });

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const getSavedPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const savedPrograms = await prisma.userSavedProgram.findMany({
      where: { user_id: user.id },
      include: {
        program: {
          include: { provider: true, deadlines: true, sessions: true, interests: { include: { interest: true } } },
        },
      },
      orderBy: { saved_at: 'desc' },
    });

    res.json(savedPrograms.map((item) => ({ savedAt: item.saved_at, program: item.program })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch saved programs' });
  }
};

export const getSavedLists = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const savedLists = await prisma.userSavedList.findMany({
      where: { user_id: user.id },
      include: {
        list: {
          include: {
            author: {
              select: { name: true, role: true },
            },
            _count: {
              select: { items: true },
            },
          },
        },
      },
      orderBy: { saved_at: 'desc' },
    });

    res.json(savedLists.map((item: typeof savedLists[number]) => ({ savedAt: item.saved_at, list: item.list })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch saved lists' });
  }
};

export const saveProgram = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const parsedBody = parseOrRespond(saveProgramBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const { programId } = parsedBody;

    const program = await prisma.program.findUnique({ where: { id: String(programId) } });
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const existing = await prisma.userSavedProgram.findUnique({
      where: {
        user_id_program_id: {
          user_id: user.id,
          program_id: String(programId),
        },
      },
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const saved = await prisma.userSavedProgram.create({
      data: {
        user_id: user.id,
        program_id: String(programId),
      },
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save program' });
  }
};

export const saveList = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const parsedBody = parseOrRespond(saveListBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const { listId } = parsedBody;

    const list = await prisma.list.findFirst({
      where: {
        id: String(listId),
        is_public: true,
      },
      select: { id: true },
    });
    if (!list) {
      return res.status(404).json({ error: 'Public list not found' });
    }

    const existing = await prisma.userSavedList.findUnique({
      where: {
        user_id_list_id: {
          user_id: user.id,
          list_id: String(listId),
        },
      },
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    const saved = await prisma.userSavedList.create({
      data: {
        user_id: user.id,
        list_id: String(listId),
      },
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save list' });
  }
};

export const unsaveProgram = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const { programId } = req.params;

    await prisma.userSavedProgram.deleteMany({
      where: {
        user_id: user.id,
        program_id: String(programId),
      },
    });

    res.json({ message: 'Program unsaved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unsave program' });
  }
};

export const unsaveList = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const { listId } = req.params;

    await prisma.userSavedList.deleteMany({
      where: {
        user_id: user.id,
        list_id: String(listId),
      },
    });

    res.json({ message: 'List unsaved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unsave list' });
  }
};

export const getMyLists = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const lists = await prisma.list.findMany({
      where: { author_id: user.id },
      include: {
        author: {
          select: { name: true, role: true },
        },
        items: {
          select: {
            id: true,
            program_id: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch your lists' });
  }
};

export const getMyListById = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const { id } = req.params;
    const list = await prisma.list.findFirst({
      where: {
        id: String(id),
        author_id: user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, role: true },
        },
        items: {
          include: {
            program: {
              include: {
                provider: true,
              },
            },
          },
          orderBy: { display_order: 'asc' },
        },
      },
    });

    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch your list' });
  }
};

export const createList = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const parsedBody = parseOrRespond(createListBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const { title, description, isPublic = false } = parsedBody;

    if (isPublic && !canManagePublicLists(user.role)) {
      return res.status(403).json({ error: 'Only counselors and admins can create public lists' });
    }

    const list = await prisma.list.create({
      data: {
        title: String(title).trim(),
        description: description ? String(description).trim() : null,
        is_public: Boolean(isPublic),
        author_id: user.id,
      },
    });

    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create list' });
  }
};

export const updateList = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const id = String(req.params.id);
    const parsedBody = parseOrRespond(updateListBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const { title, description, isPublic } = parsedBody;

    const list = await prisma.list.findUnique({ where: { id } });
    if (!list || list.author_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this list' });
    }

    if (isPublic === true && !canManagePublicLists(user.role)) {
      return res.status(403).json({ error: 'Only counselors and admins can publish public lists' });
    }

    const updatedList = await prisma.list.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: String(title).trim() }),
        ...(description !== undefined && { description: description ? String(description).trim() : null }),
        ...(isPublic !== undefined && { is_public: Boolean(isPublic) }),
      },
    });

    res.json(updatedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update list' });
  }
};

export const addListItem = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const listId = String(req.params.listId);
    const parsedBody = parseOrRespond(addListItemBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const { programId, commentary } = parsedBody;

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list || list.author_id !== user.id) {
      return res.status(403).json({ error: 'List not found or unauthorized' });
    }

    const program = await prisma.program.findUnique({ where: { id: String(programId) } });
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const existingItem = await prisma.listItem.findFirst({
      where: {
        list_id: listId,
        program_id: String(programId),
      },
    });

    if (existingItem) {
      return res.status(200).json(existingItem);
    }

    const maxOrder = await prisma.listItem.aggregate({
      where: { list_id: listId },
      _max: { display_order: true },
    });
    const nextOrder = (maxOrder?._max?.display_order || 0) + 1;

    const listItem = await prisma.listItem.create({
      data: {
        list_id: listId,
        program_id: String(programId),
        author_commentary: commentary ? String(commentary) : null,
        display_order: nextOrder,
      },
    });

    res.status(201).json(listItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to list' });
  }
};

export const removeListItem = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const listId = String(req.params.listId);
    const itemId = String(req.params.itemId);

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list || list.author_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this list' });
    }

    await prisma.listItem.deleteMany({
      where: { id: itemId, list_id: listId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

export const updateListItem = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const listId = String(req.params.listId);
    const itemId = String(req.params.itemId);
    const parsedBody = parseOrRespond(updateListItemBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const { commentary, displayOrder } = parsedBody;

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list || list.author_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this list' });
    }

    const item = await prisma.listItem.findFirst({ where: { id: itemId, list_id: listId } });
    if (!item) {
      return res.status(404).json({ error: 'Item not found in this list' });
    }

    const updatedItem = await prisma.listItem.update({
      where: { id: itemId },
      data: {
        ...(commentary !== undefined && { author_commentary: commentary ? String(commentary) : null }),
        ...(displayOrder !== undefined && { display_order: Number(displayOrder) }),
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update list item' });
  }
};

export const deleteList = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const id = String(req.params.id);

    const list = await prisma.list.findUnique({ where: { id } });
    if (!list || list.author_id !== user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.listItem.deleteMany({ where: { list_id: id } });
    await prisma.list.delete({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete list' });
  }
};

export const upsertProgramFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const programId = String(req.params.programId);
    const parsedBody = parseOrRespond(createFeedbackBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { id: true },
    });
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    const review = await prisma.programReview.upsert({
      where: {
        program_id_user_id: {
          program_id: programId,
          user_id: user.id,
        },
      },
      update: {
        rating: parsedBody.rating,
        comment: parsedBody.comment ? String(parsedBody.comment).trim() : null,
      },
      create: {
        program_id: programId,
        user_id: user.id,
        rating: parsedBody.rating,
        comment: parsedBody.comment ? String(parsedBody.comment).trim() : null,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        created_at: true,
        updated_at: true,
      },
    });

    const summary = await getProgramFeedbackSummary(programId);

    res.status(201).json({ review, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save program feedback' });
  }
};

export const upsertListFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const user = ensureAuthenticated(req, res);
    if (!user) {
      return;
    }

    const listId = String(req.params.listId);
    const parsedBody = parseOrRespond(createFeedbackBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const list = await prisma.list.findFirst({
      where: {
        id: listId,
        is_public: true,
      },
      select: { id: true },
    });
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const review = await prisma.listReview.upsert({
      where: {
        list_id_user_id: {
          list_id: listId,
          user_id: user.id,
        },
      },
      update: {
        rating: parsedBody.rating,
        comment: parsedBody.comment ? String(parsedBody.comment).trim() : null,
      },
      create: {
        list_id: listId,
        user_id: user.id,
        rating: parsedBody.rating,
        comment: parsedBody.comment ? String(parsedBody.comment).trim() : null,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        created_at: true,
        updated_at: true,
      },
    });

    const summary = await getListFeedbackSummary(listId);

    res.status(201).json({ review, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save list feedback' });
  }
};
