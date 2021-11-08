const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

const userInfo = {
  username: 'woop',
  password: 'doop',
};

const registerUser = async (username = 'woop', password = 'doop') => {
  return await request(server)
    .post('/api/auth/register')
    .send({ username, password });
};

test('sanity', () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

describe('register', () => {
  test('reject if !username || !password', async () => {
    expect(true).toBe(true);
    const res = await request(server)
      .post('/api/auth/register')
      .send({ name: 'Shariq the handsome' });
    expect(res.status).toBe(401);
  });

  test('return new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'shariq', password: 'ali' });
    expect(res.body).toMatchObject({ username: 'shariq', id: 1 });
  });
});

describe('login', () => {
  test('error if incorrect password || username', async () => {
    const registering = await registerUser();
    const res = await request(server).post('/api/auth/login').send(userInfo);
    expect(res.body).toMatchObject({ message: 'invalid credentials' });
  });

  test('proper token and body message', async () => {
    const registering = await registerUser();
    const res = await request(server).post('/api/auth/login').send(userInfo);
    expect(res.body).toMatchObject({
      message: `welcome, ${userInfo.username}`,
    });
  });
});

describe('dad jokes', () => {
  test('jokes should have tokens', async () => {
    const registering = await registerUser();
    const loggedIn = await (
      await request(server).post('/api/auth/login')
    ).send(userInfo);
    const res = await (
      await request(server).get('/api/jokes')
    ).set({ authoriation: loggedIn.body.token });

    expect(res.body).toHaveLength(3);
  });
});
