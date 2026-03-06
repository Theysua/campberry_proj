import { Response, Router } from 'express';
import {
    addListItem,
    createList,
    deleteList,
    getMe,
    getMyListById,
    getMyLists,
    getSavedLists,
    getSavedPrograms,
    removeListItem,
    saveList,
    saveProgram,
    unsaveList,
    unsaveProgram,
    updateList,
    updateListItem,
    upsertListFeedback,
    upsertProgramFeedback
} from '../controllers/protectedController';
import { AuthRequest, authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', (req: AuthRequest, res: Response) => { getMe(req, res); });

router.get('/saved-programs', (req: AuthRequest, res: Response) => { getSavedPrograms(req, res); });
router.post('/saved-programs', (req: AuthRequest, res: Response) => { saveProgram(req, res); });
router.delete('/saved-programs/:programId', (req: AuthRequest, res: Response) => { unsaveProgram(req, res); });
router.get('/saved-lists', (req: AuthRequest, res: Response) => { getSavedLists(req, res); });
router.post('/saved-lists', (req: AuthRequest, res: Response) => { saveList(req, res); });
router.delete('/saved-lists/:listId', (req: AuthRequest, res: Response) => { unsaveList(req, res); });
router.post('/programs/:programId/feedback', (req: AuthRequest, res: Response) => { upsertProgramFeedback(req, res); });

// Lists
router.get('/lists', (req: AuthRequest, res: Response) => { getMyLists(req, res); });
router.get('/lists/:id', (req: AuthRequest, res: Response) => { getMyListById(req, res); });

// Note: Additional protected routes for Lists creation/updating can be implemented later as needed.
router.post('/lists', (req: AuthRequest, res: Response) => { createList(req, res); });
router.put('/lists/:id', (req: AuthRequest, res: Response) => { updateList(req, res); });
router.delete('/lists/:id', (req: AuthRequest, res: Response) => { deleteList(req, res); });
router.post('/lists/:listId/items', (req: AuthRequest, res: Response) => { addListItem(req, res); });
router.put('/lists/:listId/items/:itemId', (req: AuthRequest, res: Response) => { updateListItem(req, res); });
router.delete('/lists/:listId/items/:itemId', (req: AuthRequest, res: Response) => { removeListItem(req, res); });
router.post('/lists/:listId/feedback', (req: AuthRequest, res: Response) => { upsertListFeedback(req, res); });

export default router;
