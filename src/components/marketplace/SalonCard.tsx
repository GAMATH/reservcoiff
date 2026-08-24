import React from 'react';
import { Salon } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { 
  Star, 
  MapPin, 
  Clock, 
  Zap, 
  Heart, 
  Smartphone, 
  ChevronRight, 
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface SalonCardProps {
  salon: Salon;
  onSelectSalon: (salon: Salon) => void;
  onQuickBook: (salon: Salon) => void;
}

export const SalonCard: React.FC<SalonCardProps> = ({ salon, onSelectSalon, onQuickBook }) => {
  const { 
    services = [], 
    favorites = [], 
    toggleFavorite, 
    isLowBandwidthMode,
    currentCurrency
  } = useApp();

  const isFav = (favorites || []).includes(salon.id);
  const salonServices = (services || []).filter(s => s.salonId === salon.id);
  const topServices = salonServices.slice(0, 3);

  // Compute next pseudo available slot
  const nextSlot = 'Aujourd’hui 14:30';

  return (
    <div className="group bg-white rounded-2xl border border-[#F0EBE5] hover:border-[#B45309]/40 shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between">
      
      {/* Cover Image & Badges */}
      <div className="relative aspect-16/10 overflow-hidden bg-[#F3F4F6] cursor-pointer" onClick={() => onSelectSalon(salon)}>
        {!isLowBandwidthMode ? (
          <img
            src={salon.coverImage}
            alt={salon.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F3F4F6] text-[#6B7280] p-4 text-center">
            <span className="font-bold text-[#1A1A1A] text-sm">{salon.name}</span>
            <span className="text-xs text-[#9CA3AF] mt-1">Image masquée (Mode Éco Données)</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {salon.instantBooking && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#B45309] text-[10px] font-bold shadow-2xs">
                <Zap className="w-3 h-3 text-[#B45309] fill-[#B45309]" />
                <span>Instantané</span>
              </span>
            )}
            {salon.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>Vérifié</span>
              </span>
            )}
          </div>

          {/* Favorite Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(salon.id);
            }}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#1A1A1A] hover:text-rose-500 shadow-2xs hover:scale-105 active:scale-95 transition-all"
            aria-label="Ajouter aux favoris"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-[#6B7280]'}`} />
          </button>
        </div>

        {/* Bottom image overlay: Price & Next Slot */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1 bg-[#1A1A1A]/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px]">
            <Clock className="w-3 h-3 text-[#FDE68A]" />
            <span>{nextSlot}</span>
          </div>

          <div className="bg-[#B45309]/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-white font-bold text-[11px]">
            Dès {formatCurrency(salon.minPrice, currentCurrency)}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header with Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <h3 
                onClick={() => onSelectSalon(salon)}
                className="font-bold text-base text-[#1A1A1A] hover:text-[#B45309] transition-colors cursor-pointer line-clamp-1"
              >
                {salon.name}
              </h3>
              <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                <span className="truncate">{salon.neighborhood}, {salon.city}</span>
              </p>
            </div>

            {/* Rating Box */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] shrink-0">
              <Star className="w-3 h-3 fill-current text-[#B45309]" />
              <span className="font-bold text-xs">{salon.rating.toFixed(1)}</span>
              <span className="text-[10px] text-[#92400E] font-normal">({salon.reviewCount})</span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs text-[#6B7280] line-clamp-2 mt-1.5 leading-relaxed">
            {salon.tagline || salon.description}
          </p>

          {/* Preview of Top Services */}
          <div className="mt-3 pt-2.5 border-t border-[#F0EBE5] space-y-1">
            {topServices.map(srv => (
              <div 
                key={srv.id} 
                className="flex items-center justify-between text-xs py-0.5 text-[#4B5563] hover:text-[#1A1A1A] cursor-pointer"
                onClick={() => onSelectSalon(salon)}
              >
                <span className="truncate pr-2 font-medium">• {srv.name}</span>
                <span className="font-semibold text-[#1A1A1A] shrink-0">
                  {formatCurrency(srv.price, currentCurrency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-[#F0EBE5] flex items-center gap-2">
          <button
            onClick={() => onSelectSalon(salon)}
            className="flex-1 py-2 px-3 rounded-xl border border-[#F0EBE5] hover:bg-[#F3F4F6] bg-white text-xs font-medium text-[#1A1A1A] transition-all text-center"
          >
            Détails
          </button>

          <button
            onClick={() => onQuickBook(salon)}
            className="flex-1 py-2 px-3 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-medium shadow-2xs transition-all flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span>Réserver</span>
          </button>
        </div>

      </div>

    </div>
  );
};
