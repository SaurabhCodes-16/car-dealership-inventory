import request from 'supertest';
import app from '../src/app';
import { getDatabase, seedInitialData, closeDatabase } from '../src/config/database';
import path from 'path';
import fs from 'fs';

const TEST_DB = path.join(__dirname, 'test_health.sqlite');

describe('Health Diagnostics API', () => {
  let db: any;

  beforeAll(() => {
    process.env.DB_PATH = TEST_DB;
    if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    db = getDatabase(TEST_DB);
    seedInitialData(db);
  });

  afterAll(() => {
    closeDatabase();
    try {
      if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
    } catch (e) {}
  });

  it('GET /health should return 200 with database status, inventory count, and memory metrics', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('database');
    expect(res.body.database).toMatchObject({
      engine: 'SQLite3 (WAL)',
      status: 'connected'
    });
    expect(typeof res.body.database.vehiclesCount).toBe('number');
    expect(res.body).toHaveProperty('memory');
    expect(typeof res.body.uptimeSeconds).toBe('number');
  });
});
