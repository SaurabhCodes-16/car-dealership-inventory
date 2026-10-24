import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, Compass, KeyRound } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { vehicles } = useInventory();
  const { isAuthenticated, isAdmin } = useAuth();

  const totalStock = vehicles.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalModels = vehicles.length;
  const evCount = vehicles.filter(v => v.category === 'Electric' || v.category === 'Hybrid').length;

  return (
    <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-b from-[#F4F1EA]/80 to-[#ECE8DE]/40 rounded-3xl p-8 sm:p-12 border border-[#E6E1D6] relative overflow-hidden">
        
        {/* Subtle Decorative Ambient Ring */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-champagne-200/20 blur-3xl pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-stone-200/60 shadow-sm mb-5 text-[11px] font-medium text-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Spring 2026 Fleet Showcase</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-500 font-mono">TDD Inventory Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold tracking-tight text-stone-900 leading-[1.15]">
            Precision Engineering. <br />
            <span className="text-stone-500 font-normal">Thoughtfully Acquired.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
            Explore our curated inventory of electric grand tourers, executive sedans, and performance coupes.
            Verified history, atomic inventory transactions, and direct concierge delivery.
          </p>
        </div>

        {/* Soft Metrics Bar */}
        <div className="mt-8 pt-8 border-t border-stone-200/60 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Available Fleet</p>
            <p className="text-2xl font-heading font-semibold text-stone-900 mt-1">{totalStock} Units</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Across {totalModels} models</p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">EV & Hybrid</p>
            <p className="text-2xl font-heading font-semibold text-stone-900 mt-1">{evCount} Models</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Zero tailpipe emissions</p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Inventory Security</p>
            <p className="text-2xl font-heading font-semibold text-stone-900 mt-1">Atomic</p>
            <p className="text-[11px] text-stone-500 mt-0.5">ACID SQLite transactions</p>
          </div>
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Access Tier</p>
            <p className="text-2xl font-heading font-semibold text-stone-900 mt-1">
              {isAdmin ? 'Administrator' : isAuthenticated ? 'Verified Buyer' : 'Guest Visitor'}
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">Token-based RBAC</p>
          </div>
        </div>

      </div>
    </section>
  );
};
