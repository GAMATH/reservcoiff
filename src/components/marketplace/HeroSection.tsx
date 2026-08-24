import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../data/mockData';
import { CATEGORY_LABELS } from '../../utils/formatters';
import { 
  Search, 
  MapPin, 
  Calendar, 
  LocateFixed, 
  Scissors, 
  Sparkles, 
  Crown, 
  Heart, 
  Droplet, 
  Eye, 
  Smile, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Smartphone
} from 'lucide-react';
import { ServiceCategory } from '../../types';

interface HeroSectionProps {
  onSearchSubmit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearchSubmit }) => {
  const {
    currentCountry,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    useGeolocation,
    setUseGeolocation,
    addToastNotification
  } = useApp();

  const [searchDate, setSearchDate] = useState<string>('today');
  const countryObj = COUNTRIES.find(c => c.code === currentCountry) || COUNTRIES[0];

  const handleUseLocation = () => {
    setUseGeolocation(true);
    addToastNotification(
      'Géolocalisation activée 📍',
      `Affichage des salons et barbiers les plus proches de ${selectedCity}.`
    );
    onSearchSubmit();
  };

  const categoriesList: { key: ServiceCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Tous les services', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'barber', label: 'Barbier & Homme', icon: <Scissors className="w-4 h-4" /> },
    { key: 'braids_tresses', label: 'Braids & Tresses', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'locks', label: 'Locks & Dreads', icon: <Crown className="w-4 h-4" /> },
    { key: 'women_hair', label: 'Coiffure Femme & Wigs', icon: <Heart className="w-4 h-4" /> },
    { key: 'coloring_treatment', label: 'Soins & Teintures', icon: <Droplet className="w-4 h-4" /> },
    { key: 'nails_makeup', label: 'Onglerie & Makeup', icon: <Eye className="w-4 h-4" /> },
    { key: 'spa_skin', label: 'Soins Visage & Spa', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="relative bg-[#FCFBF8] pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-[#F0EBE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-semibold mb-4 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
            <span>Réservation en ligne • Paiement Mobile Money ou Sur Place</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light text-[#1A1A1A] tracking-tight leading-tight">
            Réservez votre prochain <br className="hidden sm:block" />
            <span className="italic font-serif text-[#B45309] font-normal">
              rendez-vous beauté
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#6B7280] leading-relaxed max-w-2xl mx-auto">
            Découvrez et réservez les meilleurs salons de coiffure, barbiers et instituts à {selectedCity} et dans toute l’Afrique.
          </p>
        </div>

        {/* Floating Minimalist Search Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xs border border-[#F0EBE5] p-2.5 sm:p-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
            
            {/* Search Input (What?) */}
            <div className="md:col-span-5 relative px-3 py-1.5 sm:border-r border-[#F0EBE5]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-0.5">
                Service ou Coiffeur
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#9CA3AF] mr-2 shrink-0 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Coupe homme, Braids, Locks, Barbe..."
                  className="w-full text-xs sm:text-sm font-medium text-[#1A1A1A] placeholder:text-[#9CA3AF] bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Location Selector (Where?) */}
            <div className="md:col-span-4 relative px-3 py-1.5 sm:border-r border-[#F0EBE5]">
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Ville & Quartier
                </label>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[#B45309] hover:text-[#92400E]"
                >
                  <LocateFixed className="w-2.5 h-2.5" />
                  <span>Ma position</span>
                </button>
              </div>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-[#B45309] mr-2 shrink-0 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-[#1A1A1A] bg-transparent outline-none appearance-none cursor-pointer"
                >
                  {(countryObj?.cities || []).map(city => (
                    <option key={city} value={city}>
                      {city} ({countryObj?.name || 'Afrique'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Search Button */}
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={onSearchSubmit}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Rechercher</span>
              </button>
            </div>

          </div>

          {/* Quick suggestions */}
          <div className="mt-2.5 pt-2.5 border-t border-[#F0EBE5] flex items-center gap-2 text-xs text-[#6B7280] overflow-x-auto whitespace-nowrap scrollbar-none px-2">
            <span className="font-medium text-[#9CA3AF] text-[11px]">Populaires :</span>
            {['Coupe Homme', 'Knotless Braids', 'Retwist Locks', 'Pose Lace Wig', 'Taille de Barbe'].map(term => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  onSearchSubmit();
                }}
                className="px-2.5 py-0.5 rounded-full bg-[#F3F4F6] hover:bg-[#FFFBEB] hover:text-[#B45309] text-[#4B5563] text-[11px] font-medium transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Category Badges */}
        <div className="mt-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoriesList.map(cat => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    onSearchSubmit();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#B45309] text-white shadow-xs'
                      : 'bg-white hover:border-[#B45309] text-[#1A1A1A] border border-[#F0EBE5]'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : 'text-[#B45309]'}>
                    {cat.icon}
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Value Highlights */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-[#4B5563] bg-white p-2.5 rounded-xl border border-[#F0EBE5]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Salons vérifiés & notés</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#4B5563] bg-white p-2.5 rounded-xl border border-[#F0EBE5]">
            <Smartphone className="w-4 h-4 text-[#B45309] shrink-0" />
            <span className="font-medium">Mobile Money & Espèces</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#4B5563] bg-white p-2.5 rounded-xl border border-[#F0EBE5]">
            <Zap className="w-4 h-4 text-[#B45309] shrink-0" />
            <span className="font-medium">Réservation instantanée</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#4B5563] bg-white p-2.5 rounded-xl border border-[#F0EBE5]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Rappels WhatsApp & SMS</span>
          </div>
        </div>

      </div>
    </div>
  );
};
