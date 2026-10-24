import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { VehicleCategory } from '../types';

const categories: VehicleCategory[] = [
  'All',
  'Electric',
  'SUV',
  'Sedan',
  'Coupe',
  'Hybrid',
  'Truck',
];

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredVehicles, vehicles } = useInventory();

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.category !== 'All' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8">
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EBE7DF] shadow-soft space-y-4">
        
        {/* Top Row: Search Input & Sort Options */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by make (Porsche, Genesis), model, or keyword..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#FBFBFA] border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-soft"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-stone-400 font-medium">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              aria-label="Sort vehicles"
              className="px-3 py-2 rounded-xl bg-[#FBFBFA] border border-stone-200 text-xs text-stone-700 font-medium focus:outline-none focus:border-stone-400 transition-soft"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest</option>
              <option value="stock-desc">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Middle Row: Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-soft ${
                filters.category === cat
                  ? 'bg-stone-900 text-stone-100 shadow-sm'
                  : 'bg-[#F6F4EF] text-stone-600 hover:bg-[#EFECE4] hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bottom Row: Price Filter, In-Stock Toggle, and Results Counter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-stone-400 uppercase font-medium tracking-wider text-[10px]">
              Price Range ($):
            </span>
            <div className="flex items-center space-x-1.5">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value ? Number(e.target.value) : '',
                  }))
                }
                className="w-24 px-2.5 py-1 rounded-lg bg-[#FBFBFA] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
              />
              <span className="text-stone-400">—</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value ? Number(e.target.value) : '',
                  }))
                }
                className="w-24 px-2.5 py-1 rounded-lg bg-[#FBFBFA] border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400"
              />
            </div>

            {/* In-Stock Only Toggle */}
            <label className="flex items-center space-x-1.5 cursor-pointer select-none text-stone-700 font-medium ml-2">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                }
                className="rounded border-stone-300 text-stone-900 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
              />
              <span>In-stock only</span>
            </label>
          </div>

          {/* Results count & Reset button */}
          <div className="flex items-center space-x-3 text-stone-500">
            <span>
              Showing <strong className="text-stone-900">{filteredVehicles.length}</strong> of {vehicles.length} vehicles
            </span>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
