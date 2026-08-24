import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroSection } from './HeroSection';
import { SalonFilters } from './SalonFilters';
import { SalonCard } from './SalonCard';
import { Salon } from '../../types';
import { Scissors, Sparkles, MapPin, SearchX } from 'lucide-react';

interface MarketplaceViewProps {
  onOpenBooking: (salon: Salon, serviceId?: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onOpenBooking }) => {
  const {
    salons,
    services,
    currentCountry,
    selectedCity,
    searchQuery,
    selectedCategory,
    setSelectedSalonSlug,
    setCurrentView
  } = useApp();

  const [filters, setFilters] = useState<{
    sortBy: 'rating' | 'price_asc' | 'reviews';
    minRating: number;
    instantOnly: boolean;
    momoOnly: boolean;
    priceRange: 'all' | 'budget' | 'mid' | 'premium';
  }>({
    sortBy: 'rating',
    minRating: 0,
    instantOnly: false,
    momoOnly: false,
    priceRange: 'all'
  });

  // Filter salons based on search query, city, category, country, and toolbar filters
  const filteredSalons = useMemo(() => {
    return salons.filter(salon => {
      // 1. Country & City match
      // If the salon matches current country or selected city
      const cityMatches = selectedCity ? (salon.city || '').toLowerCase().includes(selectedCity.toLowerCase()) : true;
      const countryMatches = salon.country === currentCountry;

      // 2. Category match
      const categoryMatches = selectedCategory === 'all' 
        ? true 
        : (salon.categories || []).includes(selectedCategory);

      // 3. Search query match in salon name, description, address, neighborhood, or services
      let searchMatches = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = (salon.name || '').toLowerCase().includes(q);
        const inTagline = (salon.tagline || '').toLowerCase().includes(q);
        const inDesc = (salon.description || '').toLowerCase().includes(q);
        const inNeighborhood = (salon.neighborhood || '').toLowerCase().includes(q);
        const inCity = (salon.city || '').toLowerCase().includes(q);
        
        // check salon's services
        const salonServices = (services || []).filter(s => s.salonId === salon.id);
        const inServices = salonServices.some(s => 
          (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
        );

        searchMatches = inName || inTagline || inDesc || inNeighborhood || inCity || inServices;
      }

      // 4. Rating filter
      const ratingMatches = filters.minRating === 0 || salon.rating >= filters.minRating;

      // 5. Instant booking
      const instantMatches = !filters.instantOnly || salon.instantBooking;

      // 6. Mobile Money
      const momoMatches = !filters.momoOnly || salon.mobileMoneyAccepted;

      // 7. Price range
      let priceMatches = true;
      if (filters.priceRange === 'budget') {
        priceMatches = salon.minPrice <= 5000;
      } else if (filters.priceRange === 'mid') {
        priceMatches = salon.minPrice > 5000 && salon.minPrice <= 15000;
      } else if (filters.priceRange === 'premium') {
        priceMatches = salon.minPrice > 15000;
      }

      return (cityMatches || countryMatches) && categoryMatches && searchMatches && ratingMatches && instantMatches && momoMatches && priceMatches;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (filters.sortBy === 'price_asc') {
        return a.minPrice - b.minPrice;
      } else if (filters.sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      return 0;
    });
  }, [salons, services, currentCountry, selectedCity, searchQuery, selectedCategory, filters]);

  const handleSelectSalon = (salon: Salon) => {
    setSelectedSalonSlug(salon.slug);
    setCurrentView('salon_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickBook = (salon: Salon) => {
    onOpenBooking(salon);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] pb-20">
      
      {/* Hero Search Section */}
      <HeroSection onSearchSubmit={() => {}} />

      {/* Salons Marketplace List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
              <Scissors className="w-5 h-5 text-[#B45309]" />
              <span>Salons & Barbiers disponibles à {selectedCity}</span>
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Comparez les prix, vérifiez les avis et réservez instantanément avec acompte Mobile Money.
            </p>
          </div>
        </div>

        {/* Filters Toolbar */}
        <SalonFilters
          filters={filters}
          setFilters={setFilters}
          totalCount={filteredSalons.length}
        />

        {/* Salons Grid */}
        {filteredSalons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSalons.map(salon => (
              <SalonCard
                key={salon.id}
                salon={salon}
                onSelectSalon={handleSelectSalon}
                onQuickBook={handleQuickBook}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#F0EBE5] p-12 text-center max-w-lg mx-auto my-8 shadow-2xs">
            <div className="w-14 h-14 bg-[#FFFBEB] rounded-2xl flex items-center justify-center mx-auto text-[#B45309] mb-4">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Aucun salon ne correspond à votre recherche</h3>
            <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
              Essayez de modifier votre ville, élargir votre catégorie ou réinitialiser vos critères de prix et de note.
            </p>
            <button
              onClick={() => {
                setFilters({
                  sortBy: 'rating',
                  minRating: 0,
                  instantOnly: false,
                  momoOnly: false,
                  priceRange: 'all'
                });
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold transition-all shadow-xs"
            >
              Voir tous les salons
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
