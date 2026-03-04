import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'campberry_super_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'campberry_refresh_super_secret';

// Helper to set cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth',
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role: role || 'STUDENT',
        is_verified: false,
      },
    });

    res.status(201).json({ message: 'Registration successful', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password_hash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate tokens
    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, is_verified: user.is_verified },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({ error: 'Refresh token missing' });
      return;
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.expires_at < new Date()) {
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { token } }); // Clean up expired
      }
      res.status(401).json({ error: 'Invalid or expired refresh token' });
      return;
    }

    jwt.verify(token, JWT_REFRESH_SECRET, (err: any) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid refresh token signature' });
      }

      const accessToken = jwt.sign({ id: storedToken.user.id, role: storedToken.user.role }, JWT_SECRET, { expiresIn: '15m' });
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await prisma.refreshToken.deleteMany({
        where: { token },
      });
    }

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { verificationToken } = req.body;
    // Stubbed logic: we'll pretend the token contains user ID for now
    // In reality, you would map token->userId in DB or verify JWT.
    // For MVP, if token exists, we consider it valid.
    if (!verificationToken) {
      res.status(400).json({ error: 'Missing verification token' });
      return;
    }

    // We assume the token is the user's email for this stub
    const user = await prisma.user.findUnique({ where: { email: verificationToken } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { is_verified: true },
    });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ error: 'Google Auth not implemented yet' });
};
