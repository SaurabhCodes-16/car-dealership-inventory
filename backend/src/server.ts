import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { getDatabase, seedInitialData } from './config/database';

const PORT = process.env.PORT || 5000;

// Initialize database schema and ensure seed data is available
const db = getDatabase();
seedInitialData(db);

const server = app.listen(PORT, () => {
  console.log(`🚗 Car Dealership Inventory API is running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`🏎️ Vehicles API: http://localhost:${PORT}/api/vehicles`);
});

export default server;
