import assert from 'node:assert/strict';
import test from 'node:test';
import 'dotenv/config';
import { OAuth2Client } from 'google-auth-library';
import request from 'supertest';
import prisma from './db';

import { app } from './app';

const uniqueEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;

const cleanupUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return;
  }

  const lists = await prisma.list.findMany({
    where: { author_id: user.id },
    select: { id: true },
  });
  const listIds = lists.map((list) => list.id);

  if (listIds.length > 0) {
    await prisma.listReview.deleteMany({
      where: { list_id: { in: listIds } },
    });
    await prisma.listItem.deleteMany({
      where: { list_id: { in: listIds } },
    });
  }

  await prisma.programReview.deleteMany({
    where: { user_id: user.id },
  });
  await prisma.listReview.deleteMany({
    where: { user_id: user.id },
  });
  await prisma.list.deleteMany({
    where: { author_id: user.id },
  });
  await prisma.userSavedProgram.deleteMany({
    where: { user_id: user.id },
  });
  await prisma.userSavedList.deleteMany({
    where: { user_id: user.id },
  });
  await prisma.refreshToken.deleteMany({
    where: { user_id: user.id },
  });
  await prisma.emailVerificationToken.deleteMany({
    where: { user_id: user.id },
  });
  await prisma.passwordResetToken.deleteMany({
    where: { user_id: user.id },
  });
  await prisma.user.delete({
    where: { id: user.id },
  });
};

const registerAndLogin = async (email: string, extraRegisterBody: Record<string, unknown> = {}) => {
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'Test User',
      email,
      password: 'password123',
      ...extraRegisterBody,
    })
    .expect(201);

  const loginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email,
      password: 'password123',
    })
    .expect(200);

  return loginResponse.body as {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
};

test('rejects invalid registration payload', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({
      name: 'Broken User',
      email: 'not-an-email',
      password: '123',
    })
    .expect(400);

  assert.equal(response.body.error, 'Invalid request');
});

test('forces self-registered users to remain STUDENT even if role is provided', async () => {
  const email = uniqueEmail('role-guard');

  try {
    const loginResponse = await registerAndLogin(email, { role: 'ADMIN' });
    assert.equal(loginResponse.user.role, 'STUDENT');
  } finally {
    await cleanupUserByEmail(email);
  }
});

test('register issues a local verification token and verify-email consumes it', async () => {
  const email = uniqueEmail('verify-email');

  try {
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Verify Me',
        email,
        password: 'password123',
      })
      .expect(201);

    assert.ok(registerResponse.body.verification?.verificationUrl);
    const token = registerResponse.body.verification?.token;
    assert.ok(token);

    const beforeVerify = await prisma.user.findUnique({
      where: { email },
      select: { is_verified: true },
    });
    assert.equal(beforeVerify?.is_verified, false);

    const verifyResponse = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ verificationToken: token })
      .expect(200);

    assert.equal(verifyResponse.body.user.is_verified, true);

    const afterVerify = await prisma.user.findUnique({
      where: { email },
      select: { is_verified: true },
    });
    assert.equal(afterVerify?.is_verified, true);

    const remainingTokens = await prisma.emailVerificationToken.count({
      where: { user: { email } },
    });
    assert.equal(remainingTokens, 0);
  } finally {
    await cleanupUserByEmail(email);
  }
});

test('dev verification endpoint returns the latest local verification link', async () => {
  const email = uniqueEmail('verify-dev-link');

  try {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Dev Link User',
        email,
        password: 'password123',
      })
      .expect(201);

    const response = await request(app)
      .get(`/api/v1/auth/dev/verification-link?email=${encodeURIComponent(email)}`)
      .expect(200);

    assert.equal(response.body.email, email);
    assert.equal(response.body.is_verified, false);
    assert.match(response.body.verification.verificationUrl, /verify-email\?token=/);
  } finally {
    await cleanupUserByEmail(email);
  }
});

test('forgot password issues a reset token and reset-password updates the password', async () => {
  const email = uniqueEmail('password-reset');

  try {
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'Reset Me',
        email,
        password: 'password123',
      })
      .expect(201);

    const forgotResponse = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email })
      .expect(200);

    const token = forgotResponse.body.reset?.token;
    assert.ok(token);

    await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token,
        password: 'newpassword123',
      })
      .expect(200);

    await request(app)
      .post('/api/v1/auth/login')
      .send({
        email,
        password: 'newpassword123',
      })
      .expect(200);
  } finally {
    await cleanupUserByEmail(email);
  }
});

test('search endpoint validates geo params and still supports season filtering', async () => {
  await request(app)
    .get('/api/v1/programs?lat=40.7')
    .expect(400);

  const seasonResponse = await request(app)
    .get('/api/v1/programs?season=Summer&limit=5')
    .expect(200);

  assert.ok(seasonResponse.body.meta.total >= 0);

  const distanceResponse = await request(app)
    .get('/api/v1/programs?lat=40.3430942&lng=-74.6550739&radiusMiles=10&sort=distance&limit=3')
    .expect(200);

  assert.ok(Array.isArray(distanceResponse.body.data));

  const impactResponse = await request(app)
    .get('/api/v1/programs?impact=HIGH_IMPACT&limit=5')
    .expect(200);

  assert.ok(Array.isArray(impactResponse.body.data));
});

test('student users cannot create public lists', async () => {
  const email = uniqueEmail('public-list');

  try {
    const loginResponse = await registerAndLogin(email);

    const response = await request(app)
      .post('/api/v1/me/lists')
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .send({
        title: 'Should Fail',
        isPublic: true,
      })
      .expect(403);

    assert.match(response.body.error, /public lists/i);
  } finally {
    await cleanupUserByEmail(email);
  }
});

test('private lists are hidden from public route but accessible to the owner', async () => {
  const email = uniqueEmail('private-list');

  try {
    const loginResponse = await registerAndLogin(email);

    const createResponse = await request(app)
      .post('/api/v1/me/lists')
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .send({
        title: 'Private Notes',
        description: 'Only for me',
        isPublic: false,
      })
      .expect(201);

    const listId = createResponse.body.id;

    await request(app)
      .get(`/api/v1/lists/${listId}`)
      .expect(404);

    const myListResponse = await request(app)
      .get(`/api/v1/me/lists/${listId}`)
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .expect(200);

    assert.equal(myListResponse.body.id, listId);
    assert.equal(myListResponse.body.title, 'Private Notes');
  } finally {
    await cleanupUserByEmail(email);
  }
});

test('saved programs and list item flows work end-to-end for an authenticated user', async () => {
  const email = uniqueEmail('saved-list-flow');

  try {
    const loginResponse = await registerAndLogin(email);
    const program = await prisma.program.findFirst({
      select: { id: true },
    });

    assert.ok(program?.id, 'Expected at least one program in the database');

    await request(app)
      .post('/api/v1/me/saved-programs')
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .send({ programId: program!.id })
      .expect(201);

    const savedProgramsResponse = await request(app)
      .get('/api/v1/me/saved-programs')
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .expect(200);

    assert.ok(savedProgramsResponse.body.some((item: any) => item.program.id === program!.id));

    const createListResponse = await request(app)
      .post('/api/v1/me/lists')
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .send({
        title: 'Reach Programs',
        description: 'Saved from test flow',
      })
      .expect(201);

    const listId = createListResponse.body.id;

    await request(app)
      .post(`/api/v1/me/lists/${listId}/items`)
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .send({ programId: program!.id })
      .expect(201);

    const myListResponse = await request(app)
      .get(`/api/v1/me/lists/${listId}`)
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .expect(200);

    assert.equal(myListResponse.body.id, listId);
    assert.ok(myListResponse.body.items.some((item: any) => item.program_id === program!.id));
  } finally {
    await cleanupUserByEmail(email);
  }
});

test('public lists can be saved and appear in saved lists for an authenticated user', async () => {
  const email = uniqueEmail('saved-public-list');

  try {
    const loginResponse = await registerAndLogin(email);
    const publicList = await prisma.list.findFirst({
      where: { is_public: true },
      select: { id: true },
    });

    assert.ok(publicList?.id, 'Expected at least one public list in the database');

    await request(app)
      .post('/api/v1/me/saved-lists')
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .send({ listId: publicList!.id })
      .expect(201);

    const savedListsResponse = await request(app)
      .get('/api/v1/me/saved-lists')
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .expect(200);

    assert.ok(savedListsResponse.body.some((item: any) => item.list.id === publicList!.id));

    await request(app)
      .delete(`/api/v1/me/saved-lists/${publicList!.id}`)
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .expect(200);

    const afterUnsaveResponse = await request(app)
      .get('/api/v1/me/saved-lists')
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .expect(200);

    assert.ok(afterUnsaveResponse.body.every((item: any) => item.list.id !== publicList!.id));
  } finally {
    await cleanupUserByEmail(email);
  }
});

test('google auth exchanges a verified Google credential for a Campberry session', async () => {
  const email = uniqueEmail('google-auth');
  const originalClientId = process.env.GOOGLE_CLIENT_ID;
  const originalVerifyIdToken = OAuth2Client.prototype.verifyIdToken;

  process.env.GOOGLE_CLIENT_ID = 'test-google-client-id.apps.googleusercontent.com';
  OAuth2Client.prototype.verifyIdToken = async function mockVerifyIdToken() {
    return {
      getPayload: () => ({
        email,
        email_verified: true,
        name: 'Google Tester',
        picture: 'https://example.com/avatar.png',
      }),
    } as any;
  };

  try {
    const response = await request(app)
      .post('/api/v1/auth/google')
      .send({ credential: 'mock-google-credential' })
      .expect(200);

    assert.ok(response.body.accessToken);
    assert.equal(response.body.user.email, email);
    assert.equal(response.body.user.is_verified, true);
  } finally {
    OAuth2Client.prototype.verifyIdToken = originalVerifyIdToken;
    if (originalClientId === undefined) {
      delete process.env.GOOGLE_CLIENT_ID;
    } else {
      process.env.GOOGLE_CLIENT_ID = originalClientId;
    }
    await cleanupUserByEmail(email);
  }
});

test('program and list feedback endpoints support ratings and comments', async () => {
  const studentEmail = uniqueEmail('feedback-student');
  const counselorEmail = uniqueEmail('feedback-counselor');

  try {
    const loginResponse = await registerAndLogin(studentEmail);
    const program = await prisma.program.findFirst({
      select: { id: true },
    });
    assert.ok(program?.id, 'Expected at least one program in the database');

    const counselor = await prisma.user.create({
      data: {
        email: counselorEmail,
        name: 'Feedback Counselor',
        role: 'COUNSELOR',
        is_verified: true,
      },
    });

    const publicList = await prisma.list.create({
      data: {
        title: 'Feedback Test Public List',
        description: 'List used for feedback endpoint coverage',
        author_id: counselor.id,
        is_public: true,
      },
    });

    const programFeedbackResponse = await request(app)
      .post(`/api/v1/me/programs/${program!.id}/feedback`)
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .send({
        rating: 5,
        comment: 'Excellent fit for ambitious students.',
      })
      .expect(201);

    assert.equal(programFeedbackResponse.body.review.rating, 5);
    assert.equal(programFeedbackResponse.body.summary.ratingCount, 1);

    const publicProgramFeedbackResponse = await request(app)
      .get(`/api/v1/programs/${program!.id}/feedback`)
      .expect(200);

    assert.equal(publicProgramFeedbackResponse.body.summary.ratingCount, 1);
    assert.ok(publicProgramFeedbackResponse.body.reviews.length >= 1);

    const listFeedbackResponse = await request(app)
      .post(`/api/v1/me/lists/${publicList.id}/feedback`)
      .set('Authorization', `Bearer ${loginResponse.accessToken}`)
      .send({
        rating: 4,
        comment: 'Helpful shortlist with clear commentary.',
      })
      .expect(201);

    assert.equal(listFeedbackResponse.body.review.rating, 4);
    assert.equal(listFeedbackResponse.body.summary.ratingCount, 1);

    const publicListFeedbackResponse = await request(app)
      .get(`/api/v1/lists/${publicList.id}/feedback`)
      .expect(200);

    assert.equal(publicListFeedbackResponse.body.summary.ratingCount, 1);
    assert.ok(publicListFeedbackResponse.body.reviews.length >= 1);
  } finally {
    await cleanupUserByEmail(studentEmail);
    await cleanupUserByEmail(counselorEmail);
  }
});
