import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Vehicle, FilterState, PurchaseLog, ToastMessage } from '../types';
import { vehicleApi } from '../services/api';
import { useAuth } from './AuthContext';

interface InventoryContextType {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  isLoading: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  refreshVehicles: () => Promise<void>;
  purchaseVehicle: (id: string) => Promise<PurchaseLog>;
  restockVehicle: (id: string, qty: number) => Promise<Vehicle>;
  addVehicle: (data: Partial<Vehicle>) => Promise<Vehicle>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
  userPurchases: PurchaseLog[];
  fetchPurchases: () => Promise<void>;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'All',
  minPrice: '',
  maxPrice: '',
  inStockOnly: false,
  sortBy: 'price-asc',
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [userPurchases, setUserPurchases] = useState<PurchaseLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshVehicles = useCallback(async () => {
    if (!token) {
      setVehicles([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await vehicleApi.getAll();
      setVehicles(data);
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to load vehicles',
        message: err.response?.data?.error || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, addToast]);

  const fetchPurchases = useCallback(async () => {
    if (!token) return;
    try {
      const list = await vehicleApi.getPurchases();
      setUserPurchases(list);
    } catch (err: any) {
      console.error('Failed to load purchases:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      refreshVehicles();
      fetchPurchases();
    } else {
      setVehicles([]);
      setUserPurchases([]);
      setIsLoading(false);
    }
  }, [token, refreshVehicles, fetchPurchases]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Compute filtered & sorted vehicles in-memory with high responsiveness
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        // Search query: matches make, model, or description
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchMake = vehicle.make.toLowerCase().includes(q);
          const matchModel = vehicle.model.toLowerCase().includes(q);
          const matchCategory = vehicle.category.toLowerCase().includes(q);
          if (!matchMake && !matchModel && !matchCategory) return false;
        }

        // Category filter
        if (filters.category !== 'All' && vehicle.category.toLowerCase() !== filters.category.toLowerCase()) {
          return false;
        }

        // Price range
        if (filters.minPrice !== '' && vehicle.price < Number(filters.minPrice)) {
          return false;
        }
        if (filters.maxPrice !== '' && vehicle.price > Number(filters.maxPrice)) {
          return false;
        }

        // Stock filter
        if (filters.inStockOnly && vehicle.quantity <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'year-desc') return (b.year || 0) - (a.year || 0);
        if (filters.sortBy === 'stock-desc') return b.quantity - a.quantity;
        return 0;
      });
  }, [vehicles, filters]);

  const purchaseVehicle = async (id: string) => {
    try {
      const res = await vehicleApi.purchase(id);
      // Update local vehicle quantity
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, quantity: Math.max(0, v.quantity - 1) } : v))
      );
      setUserPurchases((prev) => [res.purchase, ...prev]);
      addToast({
        type: 'success',
        title: 'Acquisition Successful',
        message: `Congratulations! You have purchased the ${res.vehicle.make} ${res.vehicle.model}.`,
      });
      return res.purchase;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      addToast({
        type: 'error',
        title: 'Purchase Failed',
        message: errMsg,
      });
      throw err;
    }
  };

  const restockVehicle = async (id: string, qty: number) => {
    try {
      const res = await vehicleApi.restock(id, qty);
      setVehicles((prev) => prev.map((v) => (v.id === id ? res.vehicle : v)));
      addToast({
        type: 'success',
        title: 'Inventory Restocked',
        message: `Added ${qty} unit(s) to ${res.vehicle.make} ${res.vehicle.model}. Current stock: ${res.vehicle.quantity}.`,
      });
      return res.vehicle;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      addToast({
        type: 'error',
        title: 'Restock Failed',
        message: errMsg,
      });
      throw err;
    }
  };

  const addVehicle = async (data: Partial<Vehicle>) => {
    try {
      const created = await vehicleApi.create(data);
      setVehicles((prev) => [created, ...prev]);
      addToast({
        type: 'success',
        title: 'Vehicle Added to Fleet',
        message: `${created.make} ${created.model} was successfully added.`,
      });
      return created;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      addToast({
        type: 'error',
        title: 'Failed to Add Vehicle',
        message: errMsg,
      });
      throw err;
    }
  };

  const updateVehicle = async (id: string, data: Partial<Vehicle>) => {
    try {
      const updated = await vehicleApi.update(id, data);
      setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
      addToast({
        type: 'success',
        title: 'Vehicle Updated',
        message: `Changes to ${updated.make} ${updated.model} saved.`,
      });
      return updated;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: errMsg,
      });
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await vehicleApi.delete(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      addToast({
        type: 'info',
        title: 'Vehicle Removed',
        message: 'Vehicle removed from dealership catalog.',
      });
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: errMsg,
      });
      throw err;
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        vehicles,
        filteredVehicles,
        isLoading,
        filters,
        setFilters,
        resetFilters,
        refreshVehicles,
        purchaseVehicle,
        restockVehicle,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        userPurchases,
        fetchPurchases,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
