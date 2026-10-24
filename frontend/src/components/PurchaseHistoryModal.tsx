import React, { useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingBag, Calendar, CheckCircle2, FileText } from 'lucide-react';

interface PurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseHistoryModal: React.FC<PurchaseHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { userPurchases, fetchPurchases } = useInventory();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchPurchases();
    }
  }, [isOpen, fetchPurchases]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-soft-hover overflow-hidden max-h-[85vh] flex flex-col transition-soft">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-champagne-300" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-stone-900">My Acquired Vehicles</h3>
              <p className="text-xs text-stone-500">{user?.name}’s Certified Acquisitions</p>
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {userPurchases.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <ShoppingBag className="w-10 h-10 mx-auto stroke-[1.25] text-stone-300 mb-2" />
              <p className="text-sm font-medium text-stone-600">No vehicle acquisitions yet</p>
              <p className="text-xs text-stone-400 mt-1">Browse our inventory and select a vehicle to purchase.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userPurchases.map((pch) => (
                <div
                  key={pch.id}
                  className="p-4 bg-[#FBFBFA] rounded-2xl border border-stone-200/80 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-semibold text-sm text-stone-900">
                        {pch.make} {pch.model}
                      </span>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-medium text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-mono">Invoice #{pch.id}</p>
                    <p className="text-[11px] text-stone-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(pch.purchasedAt).toLocaleString()}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase font-medium text-stone-400">Acquisition Price</p>
                    <p className="text-sm font-heading font-semibold text-stone-900">
                      ${pch.price.toLocaleString('en-US')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-[#FBFBFA] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-stone-100 text-xs font-medium hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
