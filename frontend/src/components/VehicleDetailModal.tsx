import React from 'react';
import { Vehicle } from '../types';
import { X, Fuel, Cog, Gauge, Calendar, ShieldCheck, Hash, ShoppingBag } from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenPurchase: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onOpenPurchase,
}) => {
  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-soft-hover overflow-hidden max-h-[90vh] flex flex-col transition-soft">
        
        {/* Modal Header */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 shrink-0">
          <img
            src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/70 text-stone-100 hover:bg-stone-900 transition-colors backdrop-blur-md"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <span className="px-3 py-1 rounded-lg bg-stone-900/90 text-stone-100 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              {vehicle.category}
            </span>
            <span className="px-3 py-1 rounded-lg bg-white/90 text-stone-800 text-xs font-medium backdrop-blur-md">
              {vehicle.year}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">{vehicle.make}</p>
            <h2 className="text-2xl font-heading font-semibold text-stone-900">{vehicle.model}</h2>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {vehicle.description || 'Premium curated vehicle inspected and certified by AURA Motors.'}
            </p>
          </div>

          {/* Detailed Spec Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
            <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/70">
              <span className="text-[10px] uppercase font-medium text-stone-400 flex items-center gap-1">
                <Fuel className="w-3 h-3 text-stone-500" />
                <span>Powertrain</span>
              </span>
              <p className="text-xs font-semibold text-stone-800 mt-1">{vehicle.fuelType || 'Gasoline'}</p>
            </div>

            <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/70">
              <span className="text-[10px] uppercase font-medium text-stone-400 flex items-center gap-1">
                <Cog className="w-3 h-3 text-stone-500" />
                <span>Transmission</span>
              </span>
              <p className="text-xs font-semibold text-stone-800 mt-1">{vehicle.transmission || 'Automatic'}</p>
            </div>

            <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/70">
              <span className="text-[10px] uppercase font-medium text-stone-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-stone-500" />
                <span>Odometer</span>
              </span>
              <p className="text-xs font-semibold text-stone-800 mt-1">
                {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : 'Delivery miles'}
              </p>
            </div>

            <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/70">
              <span className="text-[10px] uppercase font-medium text-stone-400 flex items-center gap-1">
                <Hash className="w-3 h-3 text-stone-500" />
                <span>VIN Code</span>
              </span>
              <p className="text-xs font-mono font-semibold text-stone-800 mt-1 truncate">
                {vehicle.vin || 'VIN-CONFIDENTIAL'}
              </p>
            </div>

            <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/70">
              <span className="text-[10px] uppercase font-medium text-stone-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-500" />
                <span>Model Year</span>
              </span>
              <p className="text-xs font-semibold text-stone-800 mt-1">{vehicle.year || 2024}</p>
            </div>

            <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/70">
              <span className="text-[10px] uppercase font-medium text-stone-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-stone-500" />
                <span>Stock Units</span>
              </span>
              <p className={`text-xs font-semibold mt-1 ${isOutOfStock ? 'text-stone-400' : 'text-emerald-700'}`}>
                {isOutOfStock ? 'Sold Out (0)' : `${vehicle.quantity} Units Available`}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer with Price & Purchase Button */}
        <div className="p-6 border-t border-stone-100 bg-[#FBFBFA] flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] uppercase font-medium text-stone-400">Total Price</p>
            <p className="text-2xl font-heading font-semibold text-stone-900">
              ${vehicle.price.toLocaleString('en-US')}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:bg-white transition-colors"
            >
              Back to Catalog
            </button>
            <button
              disabled={isOutOfStock}
              onClick={() => {
                onClose();
                onOpenPurchase(vehicle);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-medium transition-soft flex items-center space-x-2 ${
                isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-stone-100 hover:bg-stone-800 shadow-soft'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-champagne-300" />
              <span>{isOutOfStock ? 'Sold Out' : 'Acquire Vehicle'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
