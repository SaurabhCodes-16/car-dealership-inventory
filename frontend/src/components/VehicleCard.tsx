import React from 'react';
import { Vehicle } from '../types';
import { useAuth } from '../context/AuthContext';
import { Gauge, Fuel, Cog, ArrowUpRight, Plus, Edit2, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenPurchase: (vehicle: Vehicle) => void;
  onOpenRestock: (vehicle: Vehicle) => void;
  onOpenEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelectVehicle,
  onOpenPurchase,
  onOpenRestock,
  onOpenEdit,
  onDelete,
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const isOutOfStock = vehicle.quantity <= 0;
  const fallbackImage = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';
  const [imgSrc, setImgSrc] = React.useState(vehicle.imageUrl || fallbackImage);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(vehicle.imageUrl || fallbackImage);
    setIsLoaded(false);
  }, [vehicle.imageUrl]);

  return (
    <div className="group bg-white rounded-2xl border border-[#EBE7DF] overflow-hidden shadow-soft hover:shadow-soft-hover transition-slow-soft flex flex-col justify-between">
      
      {/* Top Media & Tags */}
      <div>
        <div
          className="relative aspect-[16/10] overflow-hidden bg-[#F4F1EA] cursor-pointer"
          onClick={() => onSelectVehicle(vehicle)}
        >
          <img
            src={imgSrc}
            alt={`${vehicle.make} ${vehicle.model}`}
            className={`w-full h-full object-cover object-center group-hover:scale-[1.03] transition-slow-soft duration-500 ${isLoaded ? 'opacity-100' : 'opacity-20'}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              if (imgSrc !== fallbackImage) {
                setImgSrc(fallbackImage);
              }
            }}
          />

          {/* Category & Year Tag */}
          <div className="absolute top-3.5 left-3.5 flex items-center space-x-1.5">
            <span className="px-2.5 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-stone-100">
              {vehicle.category}
            </span>
            {vehicle.year && (
              <span className="px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-medium text-stone-700">
                {vehicle.year}
              </span>
            )}
          </div>

          {/* Stock Status Badge */}
          <div className="absolute top-3.5 right-3.5">
            {isOutOfStock ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-200/90 backdrop-blur-md text-[10px] font-medium text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                <span>Sold Out</span>
              </span>
            ) : vehicle.quantity === 1 ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50/90 backdrop-blur-md border border-amber-200/60 text-[10px] font-medium text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>1 Unit Left</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50/90 backdrop-blur-md border border-emerald-200/60 text-[10px] font-medium text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{vehicle.quantity} Available</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">
                {vehicle.make}
              </p>
              <h3
                onClick={() => onSelectVehicle(vehicle)}
                className="text-lg font-heading font-semibold text-stone-900 tracking-tight hover:text-stone-600 cursor-pointer transition-colors"
              >
                {vehicle.model}
              </h3>
            </div>
            
            <button
              onClick={() => onSelectVehicle(vehicle)}
              className="p-1.5 rounded-lg text-stone-300 hover:text-stone-700 hover:bg-stone-50 transition-colors"
              title="View full vehicle specifications"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
            <div className="flex items-center space-x-1 truncate">
              <Fuel className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{vehicle.fuelType || 'Gasoline'}</span>
            </div>
            <div className="flex items-center space-x-1 truncate">
              <Cog className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{vehicle.transmission || 'Automatic'}</span>
            </div>
            <div className="flex items-center space-x-1 truncate">
              <Gauge className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{vehicle.mileage?.toLocaleString() || '0'} mi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Price, Purchase Button, and Admin Actions */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">Dealership Price</p>
            <p className="text-xl font-heading font-semibold text-stone-900">
              ${vehicle.price.toLocaleString('en-US')}
            </p>
          </div>

          {/* Primary Action Button */}
          <div>
            <button
              disabled={isOutOfStock}
              onClick={() => onOpenPurchase(vehicle)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-soft flex items-center space-x-1.5 ${
                isOutOfStock
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200/60'
                  : 'bg-stone-900 text-stone-100 hover:bg-stone-800 shadow-soft hover:shadow-soft-hover cursor-pointer active:scale-95'
              }`}
            >
              <span>{isOutOfStock ? 'Sold Out' : 'Purchase'}</span>
            </button>
          </div>
        </div>

        {/* Admin Management Toolbar */}
        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-mono text-stone-400">Admin Tools:</span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => onOpenRestock(vehicle)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors flex items-center space-x-1"
                title="Restock units"
              >
                <Plus className="w-3 h-3 text-stone-500" />
                <span>Restock</span>
              </button>
              <button
                onClick={() => onOpenEdit(vehicle)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                title="Edit vehicle details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(vehicle)}
                className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete vehicle from inventory"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
