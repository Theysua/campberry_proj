import { Request, Response, Router } from 'express';
import { getInterests, getListById, getLists, getProgramById, getPrograms } from '../controllers/publicController';

const router = Router();

router.get('/programs', (req: Request, res: Response) => { getPrograms(req, res); });
router.get('/programs/:id', (req: Request, res: Response) => { getProgramById(req, res); });
router.get('/lists', (req: Request, res: Response) => { getLists(req, res); });
router.get('/lists/:id', (req: Request, res: Response) => { getListById(req, res); });
router.get('/interests', (req: Request, res: Response) => { getInterests(req, res); });

export default router;
