import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Salon, Service, StaffMember } from '../../types';
import { formatCurrency, buildWhatsAppLink, CATEGORY_LABELS } from '../../utils/formatters';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  ChevronLeft, 
  Zap, 
  Smartphone,
  Crown,
  Info,
  CornerDownRight
} from 'lucide-react';

interface SalonDetailViewProps {
  onOpenBooking: (salon: Salon, serviceId?: string, staffId?: string) => void;
  onBack: () => void;
}

export const SalonDetailView: React.FC<SalonDetailViewProps> = ({ onOpenBooking, onBack }) => {
  const { 
    salons, 
    selectedSalonSlug, 
    services, 
    staff, 
    reviews, 
    favorites, 
    toggleFavorite, 
    currentCurrency,
    isLowBandwidthMode,
    addToastNotification
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const salon = salons.find(s => s.slug === selectedSalonSlug) || salons[0];
  
  if (!salon) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-2xl border border-[#F0EBE5] shadow-xs max-w-sm w-full">
          <p className="text-sm font-semibold text-[#1A1A1A]">Salon introuvable</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-[#B45309] text-white text-xs font-semibold rounded-xl"
          >
            Retour aux salons
          </button>
        </div>
      </div>
    );
  }

  const salonServices = (services || []).filter(s => s.salonId === salon.id);
  const salonStaff = (staff || []).filter(st => st.salonId === salon.id);
  const salonReviews = (reviews || []).filter(r => r.salonId === salon.id);

  const isFav = (favorites || []).includes(salon.id);
  const photos = salon.images && salon.images.length > 0 ? salon.images : [salon.coverImage || ''];

  // Group services by category
  const categoriesPresent = Array.from(new Set(salonServices.map(s => s.category)));

  const filteredServices = activeCategory === 'all' 
    ? salonServices 
    : salonServices.filter(s => s.category === activeCategory);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToastNotification('Lien copié ! 📋', 'Le lien du salon a été copié dans votre presse-papier.');
    }
  };

  const handleWhatsAppContact = () => {
    const waUrl = buildWhatsAppLink(salon.whatsapp);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pb-28 md:pb-20">
      
      {/* Top Breadcrumb / Back Bar */}
      <div className="bg-white border-b border-stone-200 sticky top-16 sm:top-20 z-30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-amber-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour aux salons</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
              title="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(salon.id)}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
              title="Favoris"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8 rounded-3xl overflow-hidden shadow-sm border border-stone-200">
          
          {/* Main Large Photo */}
          <div className="md:col-span-3 aspect-16/9 md:aspect-16/10 relative bg-stone-100">
            {!isLowBandwidthMode ? (
              <img
                src={photos[selectedPhotoIndex] || salon.coverImage}
                alt={salon.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-600 font-bold text-sm">
                Mode Éco Données Activé
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-stone-900/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {salon.rating.toFixed(1)} ({salon.reviewCount} avis)
              </span>
              {salon.verified && (
                <span className="px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Vérifié
                </span>
              )}
            </div>
          </div>

          {/* Side Thumbnail List */}
          <div className="hidden md:flex flex-col gap-3">
            {photos.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`flex-1 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedPhotoIndex === idx ? 'border-amber-500 scale-[0.98]' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Aperçu ${idx}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

        </div>

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info, Services, Staff, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header info */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                    {salon.name}
                  </h1>
                  <p className="text-sm font-semibold text-amber-700 mt-1">
                    {salon.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1.5 mt-2">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{salon.address} ({salon.neighborhood}, {salon.city})</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWhatsAppContact}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Salon</span>
                  </button>

                  <a
                    href={`tel:${salon.phone}`}
                    className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors"
                    title="Appeler le salon"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm text-stone-600 leading-relaxed pt-6 border-t border-stone-100">
                {salon.description}
              </p>

              {/* Amenities tags */}
              <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap gap-2">
                {(salon.amenities || []).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{amenity}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Services List Section */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900">
                    Prestations & Tarifs
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Choisissez votre prestation et réservez votre créneau
                  </p>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Toutes ({salonServices.length})
                </button>
                {categoriesPresent.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? 'bg-amber-500 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]?.label || String(cat)}
                  </button>
                ))}
              </div>

              {/* Services Cards */}
              <div className="space-y-4">
                {filteredServices.map(service => (
                  <div
                    key={service.id}
                    className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-amber-400 bg-stone-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-amber-600 transition-colors">
                          {service.name}
                        </h3>
                        {service.popular && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                            Populaire
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 mt-1 leading-relaxed max-w-xl">
                        {service.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs text-stone-600">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {service.durationMinutes} min
                        </span>
                        <span>•</span>
                        <span className="font-medium">
                          {service.depositRequired 
                            ? `Acompte requis (${service.depositPercentage || 30}%)` 
                            : 'Paiement intégral sur place possible'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                      <span className="text-base sm:text-lg font-black text-stone-900">
                        {formatCurrency(service.price, currentCurrency)}
                      </span>

                      <button
                        onClick={() => onOpenBooking(salon, service.id)}
                        className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Réserver</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team / Staff Section */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-black text-stone-900 mb-1">
                L’Équipe du Salon
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Coiffeurs, barbiers et locticians certifiés à votre service
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {salonStaff.map(member => (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-400 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/50"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{member.name}</h4>
                        <p className="text-[11px] text-amber-700 font-medium">{member.role}</p>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-stone-900">{member.rating.toFixed(1)}</span>
                          <span>({member.reviewsCount} avis)</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-200/80">
                      <p className="text-[11px] text-stone-500 font-medium mb-2">Spécialités :</p>
                      <div className="flex flex-wrap gap-1">
                        {(member.specialties || []).map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 text-[10px] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenBooking(salon, undefined, member.id)}
                      className="mt-4 w-full py-1.5 px-3 rounded-lg border border-stone-300 hover:border-amber-500 bg-white text-xs font-semibold text-stone-800 hover:text-amber-700 transition-all"
                    >
                      Prendre RDV avec {member.name.split(' ')[0]}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-stone-900">
                    Avis clients vérifiés ({salonReviews.length})
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Seuls les clients ayant réservé peuvent déposer un avis
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-2 rounded-2xl text-amber-950">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-black">{salon.rating.toFixed(1)}</span>
                  <span className="text-xs text-amber-800">/ 5</span>
                </div>
              </div>

              {salonReviews.length > 0 ? (
                <div className="space-y-6">
                  {salonReviews.map(review => (
                    <div key={review.id} className="pb-6 border-b border-stone-100 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                            {review.clientName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                              {review.clientName}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              Prestation : {review.serviceName} {review.staffName ? `avec ${review.staffName}` : ''}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-10">
                        {review.comment}
                      </p>

                      {/* Salon Owner Response if present */}
                      {review.salonResponse && (
                        <div className="ml-10 mt-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                            <CornerDownRight className="w-3.5 h-3.5 text-amber-600" />
                            <span>Réponse du salon ({salon.name})</span>
                          </div>
                          <p className="text-amber-900 leading-relaxed">
                            {review.salonResponse.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-400 py-6 text-center">Aucun avis pour le moment sur ce salon.</p>
              )}
            </div>

          </div>

          {/* Right Column (Sidebar): Hours, Location Map, Quick Booking Card */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Sticky Card */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm sticky top-32">
              <div className="pb-4 border-b border-stone-100">
                <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Réservation</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black text-stone-950">
                    Dès {formatCurrency(salon.minPrice, currentCurrency)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Disponibilités en direct
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenBooking(salon)}
                className="mt-5 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-amber-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Prendre rendez-vous</span>
              </button>

              <div className="mt-4 text-center">
                <p className="text-[11px] text-stone-400">
                  ⚡ Confirmation instantanée • Annulation facile
                </p>
              </div>

              {/* Opening Hours Widget */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Horaires d’ouverture
                </h4>

                <div className="space-y-2 text-xs">
                  {Object.entries(salon.openingHours || {}).map(([day, hours]) => {
                    const h = hours as { open?: string; close?: string; closed?: boolean };
                    return (
                      <div key={day} className="flex items-center justify-between py-1 border-b border-stone-50 last:border-0">
                        <span className="capitalize font-medium text-stone-600">{day}</span>
                        <span className={`font-semibold ${h?.closed ? 'text-rose-500' : 'text-stone-900'}`}>
                          {h?.closed ? 'Fermé' : `${h?.open || '09:00'} - ${h?.close || '19:00'}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods Accepted */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  Moyens de paiement acceptés
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded bg-amber-50 text-amber-900 font-bold text-[10px]">MTN MoMo</span>
                  <span className="px-2 py-1 rounded bg-red-50 text-red-900 font-bold text-[10px]">Airtel Money</span>
                  <span className="px-2 py-1 rounded bg-orange-50 text-orange-900 font-bold text-[10px]">Orange Money</span>
                  <span className="px-2 py-1 rounded bg-stone-100 text-stone-800 font-bold text-[10px]">Espèces sur place</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Sticky Mobile Floating Booking Bar */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 px-4 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] text-stone-400 block">À partir de</span>
          <span className="text-base font-black text-stone-950">
            {formatCurrency(salon.minPrice, currentCurrency)}
          </span>
        </div>

        <button
          onClick={() => onOpenBooking(salon)}
          className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/30 flex items-center gap-1.5"
        >
          <Calendar className="w-4 h-4" />
          <span>Réserver</span>
        </button>
      </div>

    </div>
  );
};
