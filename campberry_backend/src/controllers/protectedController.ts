import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const getSavedPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const savedPrograms = await prisma.userSavedProgram.findMany({
      where: { user_id: userId },
      include: {
        program: {
          include: { provider: true }
        }
      },
      orderBy: { saved_at: 'desc' }
    });

    res.json(savedPrograms.map((sp: any) => ({ savedAt: sp.saved_at, program: sp.program })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch saved programs' });
  }
};

export const saveProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { programId } = req.body;

    const saved = await prisma.userSavedProgram.create({
      data: {
        user_id: userId,
        program_id: programId
      }
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save program (might already be saved)' });
  }
};

export const unsaveProgram = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { programId } = req.params;

    await prisma.userSavedProgram.delete({
      where: {
        user_id_program_id: {
          user_id: userId,
          program_id: String(programId)
        }
      }
    });

    res.json({ message: 'Program unsaved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unsave program' });
  }
};

export const getMyLists = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const lists = await prisma.list.findMany({
      where: { author_id: userId },
      include: {
        author: {
          select: { name: true, role: true }
        },
        _count: {
          select: { items: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(lists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch your lists' });
  }
};

export const createList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { title, description, isPublic = false } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const list = await prisma.list.create({
      data: {
        title,
        description,
        is_public: isPublic,
        author_id: userId
      }
    });

    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create list' });
  }
};

export const updateList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = String(req.params.id);
    const { title, description, isPublic } = req.body;

    const list = await prisma.list.findUnique({ where: { id } });
    if (!list || list.author_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to modify this list' });
    }

    const updatedList = await prisma.list.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { is_public: isPublic })
      }
    });

    res.json(updatedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update list' });
  }
};

export const addListItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const listId = String(req.params.listId);
    const { programId, commentary } = req.body;

    // Verify ownership
    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list || list.author_id !== userId) {
      return res.status(403).json({ error: 'List not found or unauthorized' });
    }

    // Get current max order
    const maxOrder = await prisma.listItem.aggregate({
      where: { list_id: listId },
      _max: { display_order: true }
    });
    const nextOrder = (maxOrder?._max?.display_order || 0) + 1;

    const listItem = await prisma.listItem.create({
      data: {
        list_id: listId,
        program_id: programId,
        author_commentary: commentary || null,
        display_order: nextOrder
      }
    });

    res.status(201).json(listItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to list' });
  }
};

export const removeListItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const listId = String(req.params.listId);
    const itemId = String(req.params.itemId);

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list || list.author_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to modify this list' });
    }

    await prisma.listItem.deleteMany({
      where: { id: itemId, list_id: listId }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

export const updateListItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const listId = String(req.params.listId);
    const itemId = String(req.params.itemId);
    const { commentary, displayOrder } = req.body;

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list || list.author_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to modify this list' });
    }

    const item = await prisma.listItem.findFirst({ where: { id: itemId, list_id: listId } });
    if (!item) {
      return res.status(404).json({ error: 'Item not found in this list' });
    }

    const updatedItem = await prisma.listItem.update({
      where: { id: itemId },
      data: {
        ...(commentary !== undefined && { author_commentary: commentary }),
        ...(displayOrder !== undefined && { display_order: displayOrder })
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update list item' });
  }
};

export const deleteList = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = String(req.params.id);

    const list = await prisma.list.findUnique({ where: { id } });
    if (!list || list.author_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Prisma handles cascading potentially, but better safe:
    await prisma.listItem.deleteMany({ where: { list_id: id } });
    await prisma.list.delete({ where: { id } });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete list' });
  }
};
