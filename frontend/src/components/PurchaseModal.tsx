import React, { useState } from 'react';
import { Vehicle, PurchaseLog } from '../types';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { X, CheckCircle2, Shield, Calendar, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

interface PurchaseModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const PurchaseModal: React.FC<PurchaseModalProps> = ({
  vehicle,
  onClose,
  onOpenAuth,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { purchaseVehicle } = useInventory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<PurchaseLog | null>(null);

  if (!vehicle) return null;

  const docFee = 850;
  const totalPrice = vehicle.price + docFee;

  const handleConfirmPurchase = async () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    try {
      const purchaseLog = await purchaseVehicle(vehicle.id);
      setReceipt(purchaseLog);
    } catch (err) {
      // Error is handled via toast in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-soft-hover overflow-hidden transition-soft">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-stone-700" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-stone-900">
                {receipt ? 'Acquisition Receipt' : 'Vehicle Acquisition'}
              </h3>
              <p className="text-xs text-stone-500">Atomic Inventory Checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        {receipt ? (
          <div className="p-6 space-y-6">
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-heading font-semibold text-stone-900">Purchase Confirmed!</h4>
              <p className="text-xs text-stone-500 mt-1">
                Your order has been recorded into the persistent SQLite database.
              </p>
            </div>

            <div className="bg-[#FBFBFA] rounded-2xl p-4 border border-stone-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400 uppercase font-medium">Acquisition ID:</span>
                <span className="font-mono text-stone-900 font-semibold">{receipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400 uppercase font-medium">Vehicle:</span>
                <span className="text-stone-900 font-medium">{receipt.make} {receipt.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400 uppercase font-medium">Acquired By:</span>
                <span className="text-stone-900">{user?.name} ({user?.email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400 uppercase font-medium">Timestamp:</span>
                <span className="text-stone-700 font-mono">{new Date(receipt.purchasedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="text-stone-500 font-medium">Amount Debited:</span>
                <span className="text-stone-900 font-bold text-sm">${(receipt.price + docFee).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-stone-900 text-stone-100 font-medium text-xs hover:bg-stone-800 transition-soft shadow-soft"
            >
              Close Receipt
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            
            {/* Vehicle Preview Card */}
            <div className="flex items-center space-x-4 p-3 bg-[#FBFBFA] rounded-2xl border border-stone-200/70">
              <img
                src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'}
                alt={vehicle.model}
                className="w-20 h-16 object-cover rounded-xl shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-semibold text-stone-400">{vehicle.make}</span>
                <h4 className="font-heading font-semibold text-sm text-stone-900 truncate">{vehicle.model}</h4>
                <div className="flex items-center space-x-2 mt-1 text-[11px] text-stone-500">
                  <span>{vehicle.category}</span>
                  <span>•</span>
                  <span>{vehicle.year}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{vehicle.quantity} In Stock</span>
                </div>
              </div>
            </div>

            {/* Price Itemization */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Vehicle Base Price</span>
                <span>${vehicle.price.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Dealer Documentation & Title Fee</span>
                <span>${docFee.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Enclosed Carrier Delivery</span>
                <span className="text-emerald-600 font-medium">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-between text-sm font-heading font-semibold text-stone-900">
                <span>Total Acquisition Price</span>
                <span>${totalPrice.toLocaleString('en-US')}</span>
              </div>
            </div>

            {/* Unauthenticated notice */}
            {!isAuthenticated ? (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-800 space-y-2">
                <div className="flex items-center space-x-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Authentication Required</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  Please sign in or create an account to reserve and complete the purchase of this vehicle.
                </p>
                <div className="pt-1">
                  <button
                    onClick={onOpenAuth}
                    className="px-3.5 py-1.5 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-lg font-medium text-[11px] transition-colors shadow-sm"
                  >
                    Sign In / Register
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 flex items-center justify-between">
                <span>Purchasing as: <strong>{user?.name}</strong></span>
                <span className="text-[10px] font-mono uppercase bg-white px-2 py-0.5 rounded border border-stone-200">
                  {user?.role}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || (!isAuthenticated && false)}
                onClick={handleConfirmPurchase}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-medium hover:bg-stone-800 transition-soft shadow-soft flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Processing Transaction...</span>
                ) : (
                  <span>Confirm Acquisition</span>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
