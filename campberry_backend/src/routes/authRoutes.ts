import { Request, Response, Router } from 'express';
import {
  forgotPassword,
  getDevPasswordResetLink,
  getDevVerificationLink,
  googleAuth,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  resendVerificationEmail,
  verifyEmail,
} from '../controllers/authController';

const router = Router();

router.post('/register', (req: Request, res: Response) => { register(req, res); });
router.post('/login', (req: Request, res: Response) => { login(req, res); });
router.post('/refresh', (req: Request, res: Response) => { refreshToken(req, res); });
router.post('/logout', (req: Request, res: Response) => { logout(req, res); });
router.post('/verify-email', (req: Request, res: Response) => { verifyEmail(req, res); });
router.post('/resend-verification', (req: Request, res: Response) => { resendVerificationEmail(req, res); });
router.post('/forgot-password', (req: Request, res: Response) => { forgotPassword(req, res); });
router.post('/reset-password', (req: Request, res: Response) => { resetPassword(req, res); });
router.post('/google', (req: Request, res: Response) => { googleAuth(req, res); });
router.get('/dev/verification-link', (req: Request, res: Response) => { getDevVerificationLink(req, res); });
router.get('/dev/password-reset-link', (req: Request, res: Response) => { getDevPasswordResetLink(req, res); });

export default router;
