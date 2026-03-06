import assert from 'node:assert/strict';
import test from 'node:test';
import 'dotenv/config';
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
    await prisma.listItem.deleteMany({
      where: { list_id: { in: listIds } },
    });
  }

  await prisma.list.deleteMany({
    where: { author_id: user.id },
  });
  await prisma.userSavedProgram.deleteMany({
    where: { user_id: user.id },
  });
  await prisma.refreshToken.deleteMany({
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
