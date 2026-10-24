import request from 'supertest';
import app from '../src/app';
import { getDatabase, seedInitialData, closeDatabase } from '../src/config/database';
import path from 'path';
import fs from 'fs';

const TEST_DB = path.join(__dirname, 'test_auth.sqlite');

describe('Authentication API - TDD Test Suite', () => {
  let db: any;

  beforeAll(() => {
    process.env.DB_PATH = TEST_DB;
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    db = getDatabase(TEST_DB);
    seedInitialData(db);
  });

  afterAll(() => {
    closeDatabase(db);
    try {
      if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    } catch (e) {}
  });

  describe('POST /api/auth/register', () => {
    it('should register a new customer user and return token and profile', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
          role: 'customer'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'customer'
      });
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should reject registration if email is already taken', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Jane',
          email: 'jane@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
    });

    it('should fail validation when email or password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Incomplete'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate valid user and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@dealership.com',
          password: 'admin123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toMatchObject({
        email: 'admin@dealership.com',
        role: 'admin'
      });
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@dealership.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject login for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
