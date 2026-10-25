import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { Car, LogOut, ShoppingBag, Plus } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenAddVehicle: () => void;
  onOpenPurchases: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenAddVehicle,
  onOpenPurchases,
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { userPurchases } = useInventory();

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#ECE9E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-soft">
            <Car className="w-5 h-5 text-champagne-300 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-semibold text-lg tracking-tight text-stone-900">
                AURA
              </span>
              <span className="text-[10px] tracking-[0.2em] font-medium text-stone-400 uppercase bg-stone-100 px-1.5 py-0.5 rounded">
                MOTORS
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block tracking-wide">
              Curated Automotive Inventory
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">

          {/* Admin "Add Vehicle" Button */}
          {isAdmin && (
            <button
              onClick={onOpenAddVehicle}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-900 text-stone-100 hover:bg-stone-800 transition-soft shadow-soft"
            >
              <Plus className="w-3.5 h-3.5 text-champagne-300" />
              <span>Add Vehicle</span>
            </button>
          )}

          {/* Customer Purchases Drawer Trigger */}
          {isAuthenticated && (
            <button
              onClick={onOpenPurchases}
              className="relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-700 transition-soft shadow-sm"
              title="My Acquisitions"
            >
              <ShoppingBag className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Acquisitions</span>
              {userPurchases.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-stone-900 text-stone-100 text-[10px] flex items-center justify-center font-bold">
                  {userPurchases.length}
                </span>
              )}
            </button>
          )}

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-stone-200">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-medium text-stone-900 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-stone-500 font-mono capitalize">
                  {isAdmin ? 'Dealership Manager' : 'Verified Buyer'}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-soft"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-stone-900 text-stone-100 hover:bg-stone-800 transition-soft shadow-soft"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
