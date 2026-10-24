import React, { useState } from 'react';
import { Vehicle } from '../types';
import { useInventory } from '../context/InventoryContext';
import { X, RefreshCw, Plus, Check } from 'lucide-react';

interface AdminRestockModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const AdminRestockModal: React.FC<AdminRestockModalProps> = ({
  vehicle,
  onClose,
}) => {
  const { restockVehicle } = useInventory();
  const [quantity, setQuantity] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!vehicle) return null;

  const currentQty = vehicle.quantity;
  const newQty = currentQty + (quantity || 0);

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || quantity <= 0) return;

    setIsSubmitting(true);
    try {
      await restockVehicle(vehicle.id, quantity);
      onClose();
    } catch (err) {
      // Toast handles error display
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-soft-hover overflow-hidden transition-soft">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-stone-700" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-stone-900">Restock Fleet Units</h3>
              <p className="text-xs text-stone-500">Admin Inventory Replenishment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleRestockSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Target Vehicle Preview */}
          <div className="p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/70 flex items-center space-x-3">
            <img
              src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'}
              alt={vehicle.model}
              className="w-16 h-12 object-cover rounded-xl shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-semibold text-stone-400">{vehicle.make}</p>
              <h4 className="font-heading font-semibold text-sm text-stone-900 truncate">{vehicle.model}</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">Current Stock: <strong>{currentQty} units</strong></p>
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div>
            <label className="block font-medium text-stone-700 mb-2">Select Units to Add:</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuantity(num)}
                  className={`py-2 rounded-xl text-xs font-semibold transition-soft ${
                    quantity === num
                      ? 'bg-stone-900 text-stone-100 shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div>
            <label className="block font-medium text-stone-700 mb-1">Custom Quantity:</label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-400 text-sm"
            />
          </div>

          {/* Summary */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <span>Projected Inventory:</span>
            <span className="font-semibold text-sm">{currentQty} → {newQty} units</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || quantity <= 0}
              className="flex-1 py-2.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-medium hover:bg-stone-800 transition-soft shadow-soft flex items-center justify-center space-x-1.5"
            >
              {isSubmitting ? (
                <span>Updating Stock...</span>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 text-champagne-300" />
                  <span>Restock {quantity} Unit(s)</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
