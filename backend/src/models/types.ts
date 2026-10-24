export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: string;
}

export type VehicleCategory = 
  | 'Sedan'
  | 'SUV'
  | 'Coupe'
  | 'Truck'
  | 'Electric'
  | 'Hybrid'
  | 'Luxury'
  | 'Convertible'
  | 'Hatchback';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: VehicleCategory;
  price: number;
  quantity: number;
  year?: number;
  vin?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseLog {
  id: string;
  vehicleId: string;
  userId: string;
  make: string;
  model: string;
  price: number;
  purchasedAt: string;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}
