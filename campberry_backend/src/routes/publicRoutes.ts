import { Request, Response, Router } from 'express';
import {
  getInterests,
  getListById,
  getListFeedback,
  getLists,
  getProgramById,
  getProgramFeedback,
  getPrograms,
} from '../controllers/publicController';

const router = Router();

router.get('/programs', (req: Request, res: Response) => { getPrograms(req, res); });
router.get('/programs/:id/feedback', (req: Request, res: Response) => { getProgramFeedback(req, res); });
router.get('/programs/:id', (req: Request, res: Response) => { getProgramById(req, res); });
router.get('/lists', (req: Request, res: Response) => { getLists(req, res); });
router.get('/lists/:id/feedback', (req: Request, res: Response) => { getListFeedback(req, res); });
router.get('/lists/:id', (req: Request, res: Response) => { getListById(req, res); });
router.get('/interests', (req: Request, res: Response) => { getInterests(req, res); });

export default router;
