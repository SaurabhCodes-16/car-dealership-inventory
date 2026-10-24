import React from 'react';
import { Vehicle } from '../types';
import { VehicleCard } from './VehicleCard';
import { useInventory } from '../context/InventoryContext';
import { RotateCcw, Car } from 'lucide-react';

interface VehicleGridProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenPurchase: (vehicle: Vehicle) => void;
  onOpenRestock: (vehicle: Vehicle) => void;
  onOpenEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
  onSelectVehicle,
  onOpenPurchase,
  onOpenRestock,
  onOpenEdit,
  onDelete,
}) => {
  const { filteredVehicles, isLoading, resetFilters } = useInventory();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200/60 p-4 space-y-4 animate-pulse">
              <div className="aspect-[16/10] bg-stone-100 rounded-xl" />
              <div className="h-4 bg-stone-100 rounded w-1/3" />
              <div className="h-6 bg-stone-100 rounded w-3/4" />
              <div className="h-10 bg-stone-100 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredVehicles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-4">
          <Car className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-stone-900">No vehicles match your criteria</h3>
        <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">
          Try loosening your price range, searching for another make/model, or resetting all filters.
        </p>
        <button
          onClick={resetFilters}
          className="mt-6 inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-medium hover:bg-stone-800 transition-soft shadow-soft"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onSelectVehicle={onSelectVehicle}
            onOpenPurchase={onOpenPurchase}
            onOpenRestock={onOpenRestock}
            onOpenEdit={onOpenEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
