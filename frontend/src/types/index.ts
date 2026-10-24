export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export type VehicleCategory = 
  | 'All'
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
  category: string;
  price: number;
  quantity: number;
  year?: number;
  vin?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface FilterState {
  searchQuery: string;
  category: VehicleCategory;
  minPrice: number | '';
  maxPrice: number | '';
  inStockOnly: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'year-desc' | 'stock-desc';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
