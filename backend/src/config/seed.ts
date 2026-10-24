import { getDatabase, seedInitialData } from './database';

function runSeed() {
  console.log('🌱 Seeding database...');
  const db = getDatabase();
  seedInitialData(db);
  console.log('✅ Database seeded successfully with demo users and realistic inventory.');
}

runSeed();
