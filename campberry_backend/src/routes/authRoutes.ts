import { Request, Response, Router } from 'express';
import { googleAuth, login, logout, refreshToken, register, verifyEmail } from '../controllers/authController';

const router = Router();

router.post('/register', (req: Request, res: Response) => { register(req, res); });
router.post('/login', (req: Request, res: Response) => { login(req, res); });
router.post('/refresh', (req: Request, res: Response) => { refreshToken(req, res); });
router.post('/logout', (req: Request, res: Response) => { logout(req, res); });
router.post('/verify-email', (req: Request, res: Response) => { verifyEmail(req, res); });
router.post('/google', (req: Request, res: Response) => { googleAuth(req, res); });

export default router;
