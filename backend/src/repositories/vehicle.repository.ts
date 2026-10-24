import { getDatabase } from '../config/database';
import { Vehicle, VehicleSearchParams, PurchaseLog } from '../models/types';
import { randomUUID } from 'crypto';

export class VehicleRepository {
  private get db() {
    return getDatabase();
  }

  findAll(): Vehicle[] {
    const stmt = this.db.prepare('SELECT * FROM vehicles ORDER BY createdAt DESC');
    return stmt.all() as Vehicle[];
  }

  findById(id: string): Vehicle | undefined {
    const stmt = this.db.prepare('SELECT * FROM vehicles WHERE id = ?');
    return stmt.get(id) as Vehicle | undefined;
  }

  search(params: VehicleSearchParams): Vehicle[] {
    let query = 'SELECT * FROM vehicles WHERE 1=1';
    const values: any[] = [];

    if (params.make) {
      query += ' AND LOWER(make) LIKE LOWER(?)';
      values.push(`%${params.make.trim()}%`);
    }

    if (params.model) {
      query += ' AND LOWER(model) LIKE LOWER(?)';
      values.push(`%${params.model.trim()}%`);
    }

    if (params.category && params.category !== 'All') {
      query += ' AND category = ?';
      values.push(params.category.trim());
    }

    if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
      query += ' AND price >= ?';
      values.push(Number(params.minPrice));
    }

    if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      query += ' AND price <= ?';
      values.push(Number(params.maxPrice));
    }

    if (params.inStockOnly) {
      query += ' AND quantity > 0';
    }

    query += ' ORDER BY price ASC';

    const stmt = this.db.prepare(query);
    return stmt.all(...values) as Vehicle[];
  }

  create(vehicle: Vehicle): Vehicle {
    const stmt = this.db.prepare(`
      INSERT INTO vehicles (
        id, make, model, category, price, quantity,
        year, vin, mileage, fuelType, transmission, imageUrl, description,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      vehicle.id,
      vehicle.make,
      vehicle.model,
      vehicle.category,
      vehicle.price,
      vehicle.quantity,
      vehicle.year || new Date().getFullYear(),
      vehicle.vin || `VIN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      vehicle.mileage || 0,
      vehicle.fuelType || 'Gasoline',
      vehicle.transmission || 'Automatic',
      vehicle.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      vehicle.description || '',
      vehicle.createdAt,
      vehicle.updatedAt
    );

    return vehicle;
  }

  update(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];
    const now = new Date().toISOString();

    const allowedKeys: (keyof Vehicle)[] = [
      'make', 'model', 'category', 'price', 'quantity',
      'year', 'vin', 'mileage', 'fuelType', 'transmission',
      'imageUrl', 'description'
    ];

    for (const key of allowedKeys) {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    }

    if (fields.length === 0) return existing;

    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);

    const query = `UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`;
    const stmt = this.db.prepare(query);
    stmt.run(...values);

    return this.findById(id) || null;
  }

  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM vehicles WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  purchase(vehicleId: string, userId: string): { success: boolean; vehicle: Vehicle; purchase: PurchaseLog } {
    const transaction = this.db.transaction(() => {
      // 1. Select vehicle with current quantity
      const selectStmt = this.db.prepare('SELECT * FROM vehicles WHERE id = ?');
      const vehicle = selectStmt.get(vehicleId) as Vehicle | undefined;

      if (!vehicle) {
        throw new Error('NOT_FOUND: Vehicle does not exist.');
      }

      if (vehicle.quantity <= 0) {
        throw new Error('OUT_OF_STOCK: Vehicle is out of stock.');
      }

      // 2. Decrement quantity atomically
      const now = new Date().toISOString();
      const updateStmt = this.db.prepare(`
        UPDATE vehicles 
        SET quantity = quantity - 1, updatedAt = ? 
        WHERE id = ? AND quantity > 0
      `);
      const updateResult = updateStmt.run(now, vehicleId);

      if (updateResult.changes === 0) {
        throw new Error('OUT_OF_STOCK: Vehicle is out of stock.');
      }

      // 3. Record purchase log
      const purchaseId = `pch-${randomUUID().substring(0, 8)}`;
      const logStmt = this.db.prepare(`
        INSERT INTO purchases (id, vehicleId, userId, make, model, price, purchasedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      logStmt.run(purchaseId, vehicle.id, userId, vehicle.make, vehicle.model, vehicle.price, now);

      const updatedVehicle = this.findById(vehicleId)!;
      const purchaseLog: PurchaseLog = {
        id: purchaseId,
        vehicleId: vehicle.id,
        userId,
        make: vehicle.make,
        model: vehicle.model,
        price: vehicle.price,
        purchasedAt: now
      };

      return {
        success: true,
        vehicle: updatedVehicle,
        purchase: purchaseLog
      };
    });

    return transaction();
  }

  restock(vehicleId: string, quantityToAdd: number): Vehicle {
    const transaction = this.db.transaction(() => {
      const selectStmt = this.db.prepare('SELECT * FROM vehicles WHERE id = ?');
      const vehicle = selectStmt.get(vehicleId) as Vehicle | undefined;

      if (!vehicle) {
        throw new Error('NOT_FOUND: Vehicle does not exist.');
      }

      if (quantityToAdd <= 0) {
        throw new Error('INVALID_QUANTITY: Restock quantity must be a positive integer greater than zero.');
      }

      const now = new Date().toISOString();
      const updateStmt = this.db.prepare(`
        UPDATE vehicles
        SET quantity = quantity + ?, updatedAt = ?
        WHERE id = ?
      `);
      updateStmt.run(quantityToAdd, now, vehicleId);

      return this.findById(vehicleId)!;
    });

    return transaction();
  }

  getUserPurchases(userId: string): PurchaseLog[] {
    const stmt = this.db.prepare('SELECT * FROM purchases WHERE userId = ? ORDER BY purchasedAt DESC');
    return stmt.all(userId) as PurchaseLog[];
  }
}
