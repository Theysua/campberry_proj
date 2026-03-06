import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { parseOrRespond } from '../validation/parse';
import {
  emailBodySchema,
  googleAuthBodySchema,
  loginBodySchema,
  registerBodySchema,
  verifyEmailBodySchema,
} from '../validation/schemas';

const JWT_SECRET = process.env.JWT_SECRET || 'campberry_super_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'campberry_refresh_super_secret';
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

const getGoogleClientId = () => process.env.GOOGLE_CLIENT_ID || '';
const getFrontendBaseUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';
const canExposeDevEmailPreview = () => process.env.NODE_ENV !== 'production';

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

const issueSession = async (
  res: Response,
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    is_verified: boolean;
  }
) => {
  const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
    },
  });
};

const buildVerificationUrl = (token: string) =>
  `${getFrontendBaseUrl().replace(/\/$/, '')}/verify-email?token=${encodeURIComponent(token)}`;

const createEmailVerificationToken = async (userId: string) => {
  const token = crypto.randomBytes(24).toString('hex');

  await prisma.emailVerificationToken.deleteMany({
    where: { user_id: userId },
  });

  const record = await prisma.emailVerificationToken.create({
    data: {
      token,
      user_id: userId,
      expires_at: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
    },
  });

  return {
    token: record.token,
    verificationUrl: buildVerificationUrl(record.token),
    expiresAt: record.expires_at,
  };
};

const getLatestEmailVerificationPreview = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      is_verified: true,
      email_verification_tokens: {
        orderBy: { created_at: 'desc' },
        take: 1,
      },
    },
  });

  if (!user) {
    return null;
  }

  const latestToken = user.email_verification_tokens[0] || null;

  return {
    user: {
      id: user.id,
      email: user.email,
      is_verified: user.is_verified,
    },
    latestToken,
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedBody = parseOrRespond(registerBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const { name, email, password } = parsedBody;

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
        role: 'STUDENT',
        is_verified: false,
      },
    });

    const verification = await createEmailVerificationToken(user.id);

    if (canExposeDevEmailPreview()) {
      console.log(`[email-dev] Verify ${user.email}: ${verification.verificationUrl}`);
    }

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, email: user.email },
      ...(canExposeDevEmailPreview()
        ? {
            verification: {
              token: verification.token,
              verificationUrl: verification.verificationUrl,
              expiresAt: verification.expiresAt,
            },
          }
        : {}),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedBody = parseOrRespond(loginBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const { email, password } = parsedBody;

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

    await issueSession(res, user);
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
    const parsedBody = parseOrRespond(verifyEmailBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const verificationToken = parsedBody.verificationToken || parsedBody.token;
    if (!verificationToken) {
      res.status(400).json({ error: 'Missing verification token' });
      return;
    }

    const tokenRecord = await prisma.emailVerificationToken.findUnique({
      where: { token: verificationToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      res.status(404).json({ error: 'Verification token not found' });
      return;
    }

    if (tokenRecord.expires_at < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: { token: tokenRecord.token },
      });
      res.status(400).json({ error: 'Verification token has expired' });
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRecord.user_id },
        data: { is_verified: true },
      }),
      prisma.emailVerificationToken.deleteMany({
        where: { user_id: tokenRecord.user_id },
      }),
    ]);

    res.status(200).json({
      message: 'Email verified successfully',
      user: {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        is_verified: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedBody = parseOrRespond(emailBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const preview = await getLatestEmailVerificationPreview(parsedBody.email);
    if (!preview) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (preview.user.is_verified) {
      res.status(200).json({ message: 'Email is already verified' });
      return;
    }

    const verification = await createEmailVerificationToken(preview.user.id);

    if (canExposeDevEmailPreview()) {
      console.log(`[email-dev] Verify ${preview.user.email}: ${verification.verificationUrl}`);
    }

    res.status(200).json({
      message: 'Verification email re-issued',
      ...(canExposeDevEmailPreview()
        ? {
            verification: {
              token: verification.token,
              verificationUrl: verification.verificationUrl,
              expiresAt: verification.expiresAt,
            },
          }
        : {}),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
};

export const getDevVerificationLink = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!canExposeDevEmailPreview()) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    const parsedQuery = parseOrRespond(emailBodySchema, req.query, res);
    if (!parsedQuery) {
      return;
    }

    const preview = await getLatestEmailVerificationPreview(parsedQuery.email);
    if (!preview) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!preview.latestToken) {
      res.status(404).json({ error: 'No verification token found for this user' });
      return;
    }

    res.status(200).json({
      email: preview.user.email,
      is_verified: preview.user.is_verified,
      verification: {
        token: preview.latestToken.token,
        verificationUrl: buildVerificationUrl(preview.latestToken.token),
        expiresAt: preview.latestToken.expires_at,
        createdAt: preview.latestToken.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load development verification link' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const googleClientId = getGoogleClientId();
    if (!googleClientId) {
      res.status(500).json({ error: 'Google auth is not configured' });
      return;
    }

    const parsedBody = parseOrRespond(googleAuthBodySchema, req.body, res);
    if (!parsedBody) {
      return;
    }

    const googleClient = new OAuth2Client(googleClientId);
    const ticket = await googleClient.verifyIdToken({
      idToken: parsedBody.credential,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(401).json({ error: 'Google account email is unavailable' });
      return;
    }

    if (payload.email_verified === false) {
      res.status(401).json({ error: 'Google email is not verified' });
      return;
    }

    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: {
        name: payload.name || payload.email.split('@')[0],
        avatar_url: payload.picture || null,
        is_verified: true,
      },
      create: {
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        avatar_url: payload.picture || null,
        role: 'STUDENT',
        is_verified: true,
      },
    });

    await issueSession(res, user);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Google authentication failed' });
  }
};
