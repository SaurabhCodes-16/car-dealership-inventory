import { Response } from 'express';
import { randomUUID } from 'crypto';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Vehicle } from '../models/types';

const vehicleRepo = new VehicleRepository();

function getIdParam(req: AuthenticatedRequest): string {
  return (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
}

export async function getAllVehicles(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const vehicles = vehicleRepo.findAll();
    res.status(200).json({ vehicles, total: vehicles.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve vehicles.', details: error.message });
  }
}

export async function searchVehicles(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { make, model, category, minPrice, maxPrice, inStockOnly } = req.query;

    const filters = {
      make: make ? String(make) : undefined,
      model: model ? String(model) : undefined,
      category: category ? String(category) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStockOnly === 'true' || inStockOnly === '1'
    };

    const vehicles = vehicleRepo.search(filters);
    res.status(200).json({ vehicles, total: vehicles.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to search vehicles.', details: error.message });
  }
}

export async function getVehicleById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = getIdParam(req);
    const vehicle = vehicleRepo.findById(id);

    if (!vehicle) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    res.status(200).json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve vehicle details.', details: error.message });
  }
}

export async function addVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { make, model, category, price, quantity, year, vin, mileage, fuelType, transmission, imageUrl, description } = req.body;

    if (!make || !model || !category || price === undefined || quantity === undefined) {
      res.status(400).json({ error: 'Missing required vehicle properties: make, model, category, price, and quantity are mandatory.' });
      return;
    }

    const numPrice = Number(price);
    const numQty = Number(quantity);

    if (isNaN(numPrice) || numPrice < 0) {
      res.status(400).json({ error: 'Price must be a positive number.' });
      return;
    }

    if (isNaN(numQty) || numQty < 0 || !Number.isInteger(numQty)) {
      res.status(400).json({ error: 'Quantity must be a non-negative integer.' });
      return;
    }

    const now = new Date().toISOString();
    const newVehicle: Vehicle = {
      id: `veh-${randomUUID().substring(0, 8)}`,
      make: String(make).trim(),
      model: String(model).trim(),
      category: String(category).trim() as any,
      price: numPrice,
      quantity: numQty,
      year: year ? Number(year) : new Date().getFullYear(),
      vin: vin ? String(vin).trim() : `VIN-${randomUUID().substring(0, 10).toUpperCase()}`,
      mileage: mileage !== undefined ? Number(mileage) : 0,
      fuelType: fuelType || 'Gasoline',
      transmission: transmission || 'Automatic',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      description: description ? String(description).trim() : '',
      createdAt: now,
      updatedAt: now
    };

    const saved = vehicleRepo.create(newVehicle);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create vehicle record.', details: error.message });
  }
}

export async function updateVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = getIdParam(req);
    const existing = vehicleRepo.findById(id);

    if (!existing) {
      res.status(404).json({ error: `Vehicle with ID ${id} not found.` });
      return;
    }

    if (req.body.price !== undefined) {
      const p = Number(req.body.price);
      if (isNaN(p) || p < 0) {
        res.status(400).json({ error: 'Price must be a positive number.' });
        return;
      }
      req.body.price = p;
    }

    if (req.body.quantity !== undefined) {
      const q = Number(req.body.quantity);
      if (isNaN(q) || q < 0 || !Number.isInteger(q)) {
        res.status(400).json({ error: 'Quantity must be a non-negative integer.' });
        return;
      }
      req.body.quantity = q;
    }

    const updated = vehicleRepo.update(id, req.body);
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update vehicle.', details: error.message });
  }
}

export async function deleteVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = getIdParam(req);
    const existing = vehicleRepo.findById(id);

    if (!existing) {
      res.status(404).json({ error: `Vehicle with ID ${id} not found.` });
      return;
    }

    vehicleRepo.delete(id);
    res.status(200).json({ message: `Vehicle ${existing.make} ${existing.model} deleted successfully.` });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete vehicle.', details: error.message });
  }
}

export async function purchaseVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = getIdParam(req);
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required to complete purchase.' });
      return;
    }

    const result = vehicleRepo.purchase(id, userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message.startsWith('OUT_OF_STOCK')) {
      res.status(400).json({ error: 'Vehicle is currently out of stock.' });
      return;
    }
    if (error.message.startsWith('NOT_FOUND')) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }
    res.status(500).json({ error: 'Failed to process vehicle purchase.', details: error.message });
  }
}

export async function restockVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const id = getIdParam(req);
    const { quantity } = req.body;

    const qtyToAdd = Number(quantity);
    if (isNaN(qtyToAdd) || qtyToAdd <= 0 || !Number.isInteger(qtyToAdd)) {
      res.status(400).json({ error: 'Restock quantity must be a positive integer greater than zero.' });
      return;
    }

    const updated = vehicleRepo.restock(id, qtyToAdd);
    res.status(200).json({
      message: `Successfully restocked ${qtyToAdd} unit(s).`,
      vehicle: updated
    });
  } catch (error: any) {
    if (error.message.startsWith('NOT_FOUND')) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }
    if (error.message.startsWith('INVALID_QUANTITY')) {
      res.status(400).json({ error: error.message.replace('INVALID_QUANTITY: ', '') });
      return;
    }
    res.status(500).json({ error: 'Failed to restock vehicle.', details: error.message });
  }
}

export async function getUserPurchases(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const purchases = vehicleRepo.getUserPurchases(req.user.userId);
    res.status(200).json({ purchases, total: purchases.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch purchase history.', details: error.message });
  }
}
