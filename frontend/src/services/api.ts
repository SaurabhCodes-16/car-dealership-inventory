import axios from 'axios';
import { Vehicle, User, PurchaseLog } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT token into outgoing requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dealership_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name: string, email: string, password: string, role: 'customer' | 'admin' = 'customer', adminSecretCode?: string): Promise<{ token: string; user: User }> => {
    const res = await api.post('/auth/register', { name, email, password, role, adminSecretCode });
    return res.data;
  },
  getProfile: async (): Promise<{ user: User }> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const vehicleApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const res = await api.get('/vehicles');
    return res.data.vehicles || res.data;
  },
  search: async (params: { make?: string; model?: string; category?: string; minPrice?: number; maxPrice?: number; inStockOnly?: boolean }): Promise<Vehicle[]> => {
    const res = await api.get('/vehicles/search', { params });
    return res.data.vehicles || res.data;
  },
  getById: async (id: string): Promise<Vehicle> => {
    const res = await api.get(`/vehicles/${id}`);
    return res.data;
  },
  create: async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const res = await api.post('/vehicles', vehicleData);
    return res.data;
  },
  update: async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    const res = await api.put(`/vehicles/${id}`, updates);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
  purchase: async (id: string): Promise<{ success: boolean; vehicle: Vehicle; purchase: PurchaseLog }> => {
    const res = await api.post(`/vehicles/${id}/purchase`);
    return res.data;
  },
  restock: async (id: string, quantity: number): Promise<{ message: string; vehicle: Vehicle }> => {
    const res = await api.post(`/vehicles/${id}/restock`, { quantity });
    return res.data;
  },
  getPurchases: async (): Promise<PurchaseLog[]> => {
    const res = await api.get('/vehicles/purchases/me');
    return res.data.purchases || [];
  },
};

export default api;
