import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { VehicleGrid } from './components/VehicleGrid';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { PurchaseModal } from './components/PurchaseModal';
import { AdminVehicleModal } from './components/AdminVehicleModal';
import { AdminRestockModal } from './components/AdminRestockModal';
import { AuthModal } from './components/AuthModal';
import { PurchaseHistoryModal } from './components/PurchaseHistoryModal';
import { ToastContainer } from './components/Toast';
import { Vehicle } from './types';
import { Car, Code2, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { deleteVehicle } = useInventory();

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [purchaseTarget, setPurchaseTarget] = useState<Vehicle | null>(null);
  const [restockTarget, setRestockTarget] = useState<Vehicle | null>(null);
  const [editTarget, setEditTarget] = useState<Vehicle | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false);

  const handleDelete = async (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to permanently delete the ${vehicle.make} ${vehicle.model} from the dealership inventory?`)) {
      await deleteVehicle(vehicle.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-stone-900 selection:bg-stone-200">
      
      {/* Top Banner Notice */}
      <div className="bg-stone-900 text-stone-300 text-[11px] py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <Sparkles className="w-3 h-3 text-champagne-300 shrink-0" />
        <span>Full-Stack Dealership Inventory System | TDD Architecture with SQLite</span>
        <span className="hidden sm:inline text-stone-500">•</span>
        <span className="hidden sm:inline text-champagne-300 font-mono">RESTful API & Atomic Stock Deductions</span>
      </div>

      {/* Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAddVehicle={() => setIsAddOpen(true)}
        onOpenPurchases={() => setIsPurchasesOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <HeroSection />
        <FilterBar />
        <VehicleGrid
          onSelectVehicle={(v) => setSelectedVehicle(v)}
          onOpenPurchase={(v) => setPurchaseTarget(v)}
          onOpenRestock={(v) => setRestockTarget(v)}
          onOpenEdit={(v) => { setEditTarget(v); setIsAddOpen(true); }}
          onDelete={handleDelete}
        />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#ECE9E2] bg-white py-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center">
              <Car className="w-3.5 h-3.5 text-champagne-300" />
            </div>
            <div>
              <p className="font-heading font-semibold text-stone-800">AURA MOTORS</p>
              <p className="text-[11px] text-stone-400">Car Dealership Inventory System • TDD Kata</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-stone-500">
            <span>Node.js / Express</span>
            <span>•</span>
            <span>React / Tailwind CSS</span>
            <span>•</span>
            <span>SQLite Database</span>
            <span>•</span>
            <a
              href="https://github.com/SaurabhCodes-16/car-dealership-inventory"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 hover:text-stone-900 transition-colors"
            >
              <Code2 className="w-4 h-4 text-stone-600" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onOpenPurchase={(v) => setPurchaseTarget(v)}
      />

      <PurchaseModal
        vehicle={purchaseTarget}
        onClose={() => setPurchaseTarget(null)}
        onOpenAuth={() => { setPurchaseTarget(null); setIsAuthOpen(true); }}
      />

      <AdminVehicleModal
        isOpen={isAddOpen}
        onClose={() => { setIsAddOpen(false); setEditTarget(null); }}
        editVehicle={editTarget}
      />

      <AdminRestockModal
        vehicle={restockTarget}
        onClose={() => setRestockTarget(null)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <PurchaseHistoryModal
        isOpen={isPurchasesOpen}
        onClose={() => setIsPurchasesOpen(false)}
      />

      {/* Toast Notification Container */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <MainLayout />
      </InventoryProvider>
    </AuthProvider>
  );
}
