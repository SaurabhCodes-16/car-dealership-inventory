import request from 'supertest';
import app from '../src/app';
import { getDatabase, seedInitialData, closeDatabase } from '../src/config/database';
import path from 'path';
import fs from 'fs';

const TEST_DB = path.join(__dirname, 'test_vehicles.sqlite');

describe('Vehicles API - TDD Test Suite', () => {
  let adminToken: string;
  let customerToken: string;
  let db: any;

  beforeAll(async () => {
    process.env.DB_PATH = TEST_DB;
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    db = getDatabase(TEST_DB);
    seedInitialData(db);

    // Get auth tokens
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
    closeDatabase(db);
    try {
      if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    } catch (e) {}
  });

  describe('GET /api/vehicles', () => {
    it('should reject unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/vehicles');
      expect(res.status).toBe(401);
    });

    it('should return list of all vehicles when authenticated', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.vehicles || res.body)).toBe(true);
      const list = res.body.vehicles || res.body;
      expect(list.length).toBeGreaterThan(0);
      expect(list[0]).toHaveProperty('id');
      expect(list[0]).toHaveProperty('make');
      expect(list[0]).toHaveProperty('model');
      expect(list[0]).toHaveProperty('price');
      expect(list[0]).toHaveProperty('quantity');
    });
  });

  describe('GET /api/vehicles/search', () => {
    it('should search vehicles by make (e.g. Porsche)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=Porsche')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      const list = res.body.vehicles || res.body;
      expect(list.length).toBeGreaterThan(0);
      expect(list.every((c: any) => c.make.toLowerCase().includes('porsche'))).toBe(true);
    });

    it('should filter vehicles by category (e.g. Electric)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?category=Electric')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      const list = res.body.vehicles || res.body;
      expect(list.length).toBeGreaterThan(0);
      expect(list.every((c: any) => c.category === 'Electric')).toBe(true);
    });

    it('should filter vehicles by price range (e.g. minPrice 70000, maxPrice 90000)', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?minPrice=70000&maxPrice=90000')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      const list = res.body.vehicles || res.body;
      expect(list.length).toBeGreaterThan(0);
      expect(list.every((c: any) => c.price >= 70000 && c.price <= 90000)).toBe(true);
    });
  });

  describe('POST /api/vehicles', () => {
    it('should add a new vehicle with valid data', async () => {
      const newCar = {
        make: 'Lucid',
        model: 'Air Sapphire',
        category: 'Electric',
        price: 249000,
        quantity: 2,
        year: 2024,
        description: 'Tri-motor luxury super-sedan'
      };

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newCar);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.make).toBe('Lucid');
      expect(res.body.price).toBe(249000);
    });

    it('should reject vehicle addition with negative price or quantity', async () => {
      const invalidCar = {
        make: 'Faulty',
        model: 'Zero',
        category: 'Sedan',
        price: -500,
        quantity: -1
      };

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidCar);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should update vehicle details', async () => {
      const updateData = {
        price: 119900,
        description: 'Updated price and specs for Taycan'
      };

      const res = await request(app)
        .put('/api/vehicles/veh-001')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.price).toBe(119900);
    });

    it('should return 404 for non-existent vehicle update', async () => {
      const res = await request(app)
        .put('/api/vehicles/non-existent-999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 50000 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/vehicles/:id (Admin only)', () => {
    it('should forbid non-admin customer from deleting a vehicle', async () => {
      const res = await request(app)
        .delete('/api/vehicles/veh-002')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
    });

    it('should allow admin to delete a vehicle', async () => {
      const res = await request(app)
        .delete('/api/vehicles/veh-002')
        .set('Authorization', `Bearer ${adminToken}`);

      expect([200, 204]).toContain(res.status);

      // Verify it no longer exists
      const checkRes = await request(app)
        .get('/api/vehicles/search?model=GV80')
        .set('Authorization', `Bearer ${adminToken}`);
      
      const list = checkRes.body.vehicles || checkRes.body;
      expect(list.length).toBe(0);
    });
  });
});
