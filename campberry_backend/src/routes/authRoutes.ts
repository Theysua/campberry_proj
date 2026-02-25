import { Request, Response, Router } from 'express';
import { googleAuth, login, register } from '../controllers/authController';

const router = Router();

router.post('/register', (req: Request, res: Response) => { register(req, res); });
router.post('/login', (req: Request, res: Response) => { login(req, res); });
router.post('/google', (req: Request, res: Response) => { googleAuth(req, res); });

export default router;
