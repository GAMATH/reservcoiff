import React from 'react';
import { useApp } from '../../context/AppContext';
import { Filter, Star, Zap, Smartphone, Check, RotateCcw } from 'lucide-react';

interface FiltersState {
  sortBy: 'rating' | 'price_asc' | 'reviews';
  minRating: number;
  instantOnly: boolean;
  momoOnly: boolean;
  priceRange: 'all' | 'budget' | 'mid' | 'premium';
}

interface SalonFiltersProps {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  totalCount: number;
}

export const SalonFilters: React.FC<SalonFiltersProps> = ({ filters, setFilters, totalCount }) => {
  const { currentCurrency } = useApp();

  const resetFilters = () => {
    setFilters({
      sortBy: 'rating',
      minRating: 0,
      instantOnly: false,
      momoOnly: false,
      priceRange: 'all'
    });
  };

  const hasActiveFilters = 
    filters.minRating > 0 || 
    filters.instantOnly || 
    filters.momoOnly || 
    filters.priceRange !== 'all' || 
    filters.sortBy !== 'rating';

  return (
    <div className="bg-white rounded-2xl border border-[#F0EBE5] p-4 mb-6 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Total Count & Quick toggles */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-semibold text-[#1A1A1A] bg-[#F3F4F6] px-3 py-1.5 rounded-lg">
            {totalCount} salon{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
          </span>

          {/* Instant booking toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, instantOnly: !prev.instantOnly }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              filters.instantOnly
                ? 'bg-[#B45309] border-[#B45309] text-white shadow-xs'
                : 'bg-white border-[#F0EBE5] text-[#4B5563] hover:border-[#B45309]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Réservation instantanée</span>
            {filters.instantOnly && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Mobile Money accepted toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, momoOnly: !prev.momoOnly }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              filters.momoOnly
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                : 'bg-white border-[#F0EBE5] text-[#4B5563] hover:border-[#B45309]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Mobile Money</span>
            {filters.momoOnly && <Check className="w-3 h-3 ml-0.5" />}
          </button>

          {/* Min Rating 4.8+ */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === 4.8 ? 0 : 4.8 }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              filters.minRating === 4.8
                ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309] font-bold shadow-xs'
                : 'bg-white border-[#F0EBE5] text-[#4B5563] hover:border-[#B45309]'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current text-[#B45309]" />
            <span>Top notés (4.8+)</span>
          </button>
        </div>

        {/* Right: Sort & Price Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Price Range */}
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value as any }))}
            className="px-3 py-1.5 rounded-xl border border-[#F0EBE5] bg-white text-xs font-medium text-[#1A1A1A] outline-none focus:border-[#B45309] cursor-pointer"
          >
            <option value="all">Tous les prix</option>
            <option value="budget">Moins de 5 000 {currentCurrency}</option>
            <option value="mid">5 000 à 15 000 {currentCurrency}</option>
            <option value="premium">Plus de 15 000 {currentCurrency}</option>
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="px-3 py-1.5 rounded-xl border border-[#F0EBE5] bg-white text-xs font-medium text-[#1A1A1A] outline-none focus:border-[#B45309] cursor-pointer"
          >
            <option value="rating">Trier : Mieux notés ⭐</option>
            <option value="price_asc">Trier : Prix croissant</option>
            <option value="reviews">Trier : Plus d’avis</option>
          </select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F3F4F6] transition-colors"
              title="Réinitialiser tous les filtres"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Effacer</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
