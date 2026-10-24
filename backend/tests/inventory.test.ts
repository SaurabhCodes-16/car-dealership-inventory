import request from 'supertest';
import app from '../src/app';
import { getDatabase, seedInitialData, closeDatabase } from '../src/config/database';
import path from 'path';
import fs from 'fs';

const TEST_DB = path.join(__dirname, 'test_inventory.sqlite');

describe('Inventory Transactions API - TDD Test Suite', () => {
  let adminToken: string;
  let customerToken: string;
  let db: any;

  beforeAll(async () => {
    process.env.DB_PATH = TEST_DB;
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    db = getDatabase(TEST_DB);
    seedInitialData(db);

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@dealership.com', password: 'admin123' });
    adminToken = adminRes.body.token;

    const customerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'buyer@dealership.com', password: 'buyer123' });
    customerToken = customerRes.body.token;
  });

  afterAll(() => {
    closeDatabase();
    try {
      if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    } catch (e) {}
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should successfully purchase an in-stock vehicle and decrement quantity', async () => {
      // veh-003 has quantity 2
      const res = await request(app)
        .post('/api/vehicles/veh-003/purchase')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.vehicle.quantity).toBe(1);
    });

    it('should reject purchase when vehicle quantity is 0 (Out of stock)', async () => {
      // veh-007 has quantity 0 (Rivian R1T)
      const res = await request(app)
        .post('/api/vehicles/veh-007/purchase')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.toLowerCase()).toContain('stock');
    });

    it('should reject unauthenticated purchase requests with 401', async () => {
      const res = await request(app).post('/api/vehicles/veh-003/purchase');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/vehicles/:id/restock (Admin only)', () => {
    it('should reject non-admin customer from restocking with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/vehicles/veh-007/restock')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
    });

    it('should allow admin to restock an out-of-stock vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles/veh-007/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 4 });

      expect(res.status).toBe(200);
      expect(res.body.vehicle.quantity).toBe(4);
    });

    it('should reject restock with zero or negative quantity', async () => {
      const res = await request(app)
        .post('/api/vehicles/veh-007/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -3 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
