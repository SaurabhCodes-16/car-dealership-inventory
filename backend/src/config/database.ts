import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

let dbInstance: Database.Database | null = null;
let currentDbPath: string | null = null;

export function getDatabase(customPath?: string): Database.Database {
  const targetPath = customPath || process.env.DB_PATH || path.join(__dirname, '../../dealership.sqlite');
  
  if (!dbInstance || currentDbPath !== targetPath) {
    if (dbInstance && dbInstance.open) {
      dbInstance.close();
    }
    dbInstance = new Database(targetPath);
    currentDbPath = targetPath;
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    initSchema(dbInstance);
  }
  return dbInstance;
}

export function closeDatabase() {
  if (dbInstance && dbInstance.open) {
    dbInstance.close();
  }
  dbInstance = null;
  currentDbPath = null;
}

export function initSchema(db: Database.Database) {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'customer')),
      createdAt TEXT NOT NULL
    );
  `);

  // Vehicles table
  db.exec(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      quantity INTEGER NOT NULL CHECK(quantity >= 0),
      year INTEGER,
      vin TEXT UNIQUE,
      mileage INTEGER DEFAULT 0,
      fuelType TEXT DEFAULT 'Gasoline',
      transmission TEXT DEFAULT 'Automatic',
      imageUrl TEXT,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
    CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
    CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
  `);

  // Purchases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      vehicleId TEXT NOT NULL,
      userId TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      price REAL NOT NULL,
      purchasedAt TEXT NOT NULL,
      FOREIGN KEY(vehicleId) REFERENCES vehicles(id) ON DELETE SET NULL,
      FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(userId);
  `);
}

export function seedInitialData(db: Database.Database) {
  // Check if admin user exists
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@dealership.com');
  const buyerExists = db.prepare('SELECT id FROM users WHERE email = ?').get('buyer@dealership.com');

  const salt = bcrypt.genSaltSync(10);
  const now = new Date().toISOString();

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, password, role, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  if (!adminExists) {
    const adminPass = bcrypt.hashSync('admin123', salt);
    insertUser.run('usr-admin-1', 'Dealership Administrator', 'admin@dealership.com', adminPass, 'admin', now);
  }

  if (!buyerExists) {
    const customerPass = bcrypt.hashSync('buyer123', salt);
    insertUser.run('usr-customer-1', 'Saurabh Buyer', 'buyer@dealership.com', customerPass, 'customer', now);
  }

  // Check if vehicles already seeded
  const vehicleCount = db.prepare('SELECT COUNT(*) as count FROM vehicles').get() as { count: number };
  if (vehicleCount.count === 0) {
    const now = new Date().toISOString();
    const insertVehicle = db.prepare(`
      INSERT INTO vehicles (id, make, model, category, price, quantity, year, vin, mileage, fuelType, transmission, imageUrl, description, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const seedCars = [
      {
        id: 'veh-001',
        make: 'Porsche',
        model: 'Taycan 4S Cross Turismo',
        category: 'Electric',
        price: 118500,
        quantity: 3,
        year: 2024,
        vin: 'WP0AB2Y18PSA98231',
        mileage: 1200,
        fuelType: 'Dual Motor EV',
        transmission: '2-Speed Automatic',
        imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
        description: 'Immaculate all-electric grand tourer in Chalk finish with Bordeaux Red leather interior and Performance Battery Plus.'
      },
      {
        id: 'veh-002',
        make: 'Genesis',
        model: 'GV80 Prestige AWD',
        category: 'SUV',
        price: 74200,
        quantity: 5,
        year: 2024,
        vin: 'KMUHN4AG5PU091244',
        mileage: 2400,
        fuelType: 'Twin-Turbo V6',
        transmission: '8-Speed Shiftable',
        imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
        description: 'Sophisticated luxury SUV with Ergo-Motion seating, Nappa leather, Lexicon 21-speaker audio, and matte Cardiff Green exterior.'
      },
      {
        id: 'veh-003',
        make: 'BMW',
        model: 'M4 Competition Coupe',
        category: 'Coupe',
        price: 86400,
        quantity: 2,
        year: 2023,
        vin: 'WBS43AZ00PCK78231',
        mileage: 4800,
        fuelType: 'TwinPower Turbo Inline-6',
        transmission: '8-Speed M Steptronic',
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
        description: 'Track-ready performance coupe in Isle of Man Green featuring M Carbon bucket seats and adaptive M differential.'
      },
      {
        id: 'veh-004',
        make: 'Audi',
        model: 'RS e-tron GT',
        category: 'Electric',
        price: 147500,
        quantity: 1,
        year: 2024,
        vin: 'WAU84AFZ8PA019482',
        mileage: 850,
        fuelType: 'Dual Permanent Magnet EV',
        transmission: 'Single-Speed Front / 2-Speed Rear',
        imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
        description: 'Flagship electric sedan producing 637 horsepower in boost mode, with carbon fiber roof and carbide tungsten brakes.'
      },
      {
        id: 'veh-005',
        make: 'Mercedes-Benz',
        model: 'S 580 4MATIC Luxury',
        category: 'Sedan',
        price: 124800,
        quantity: 4,
        year: 2024,
        vin: 'W1K3G7CB9RA109384',
        mileage: 3100,
        fuelType: '4.0L V8 Biturbo Mild Hybrid',
        transmission: '9G-TRONIC Automatic',
        imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
        description: 'Pinnacle of executive sedans with rear-axle steering, OLED central console, and active ambient sound isolation.'
      },
      {
        id: 'veh-006',
        make: 'Volvo',
        model: 'XC90 Recharge Ultimate',
        category: 'Hybrid',
        price: 81900,
        quantity: 6,
        year: 2024,
        vin: 'YV4BR0UL7P1490215',
        mileage: 5100,
        fuelType: 'Plug-in Hybrid (T8)',
        transmission: '8-Speed Geartronic',
        imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
        description: 'Three-row Scandinavian luxury with crystal gear shifter by Orrefors, Bowers & Wilkins sound system, and zero-emission city mode.'
      },
      {
        id: 'veh-007',
        make: 'Rivian',
        model: 'R1T Adventure Quad-Motor',
        category: 'Truck',
        price: 89000,
        quantity: 0, // Intentionally 0 to test "Out of Stock" & disabled purchase button scenario!
        year: 2023,
        vin: '7FCTGAAA3PN012389',
        mileage: 9400,
        fuelType: 'Quad-Motor Electric AWD',
        transmission: 'Direct Drive',
        imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        description: 'Expedition electric truck with gear tunnel, air suspension, Camp Mode, and 835 HP. Currently awaiting incoming fleet restock.'
      },
      {
        id: 'veh-008',
        make: 'Lexus',
        model: 'LC 500 Bespoke Coupe',
        category: 'Coupe',
        price: 99800,
        quantity: 2,
        year: 2024,
        vin: 'JTHHW5BC6PA004512',
        mileage: 1800,
        fuelType: 'Naturally Aspirated 5.0L V8',
        transmission: '10-Speed Direct-Shift',
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        description: 'Exquisite grand tourer pairing an emotional acoustic exhaust with Mark Levinson 13-speaker reference audio and toasted caramel interior.'
      }
    ];

    for (const car of seedCars) {
      insertVehicle.run(
        car.id,
        car.make,
        car.model,
        car.category,
        car.price,
        car.quantity,
        car.year,
        car.vin,
        car.mileage,
        car.fuelType,
        car.transmission,
        car.imageUrl,
        car.description,
        now,
        now
      );
    }
  }
}
