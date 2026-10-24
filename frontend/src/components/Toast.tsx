import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-soft-hover transition-soft translate-y-0"
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-stone-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800">{toast.title}</h4>
            {toast.message && <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{toast.message}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-stone-600 transition-colors p-1 -mr-1"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
