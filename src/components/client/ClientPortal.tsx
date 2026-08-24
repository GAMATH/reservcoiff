import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, Salon } from '../../types';
import { formatCurrency, formatDateFrench, buildWhatsAppLink } from '../../utils/formatters';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Gift, 
  User, 
  QrCode, 
  MessageSquare, 
  X, 
  Check, 
  ChevronRight, 
  AlertCircle,
  Scissors,
  Sparkles,
  Smartphone,
  CreditCard
} from 'lucide-react';

interface ClientPortalProps {
  onBookSalon: (salon: Salon) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onBookSalon }) => {
  const {
    currentClient,
    setCurrentClient,
    appointments,
    cancelAppointment,
    salons,
    favorites,
    toggleFavorite,
    addReview,
    currentCurrency,
    addToastNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites' | 'loyalty' | 'profile'>('bookings');
  
  // Review Modal State
  const [reviewModalApt, setReviewModalApt] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  // Filter client's bookings
  const clientAppointments = (appointments || []).filter(
    a => a.clientId === currentClient?.id || (currentClient?.phone && a.clientPhone === currentClient.phone)
  );

  const upcomingAppointments = clientAppointments.filter(
    a => a.status === 'confirmed' || a.status === 'in_progress'
  );

  const pastAppointments = clientAppointments.filter(
    a => a.status === 'completed' || a.status === 'cancelled' || a.status === 'no_show'
  );

  const favoriteSalons = (salons || []).filter(s => (favorites || []).includes(s.id));

  const handleOpenReviewModal = (apt: Appointment) => {
    setReviewModalApt(apt);
    setReviewRating(5);
    setReviewComment('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalApt) return;

    addReview({
      salonId: reviewModalApt.salonId,
      appointmentId: reviewModalApt.id,
      clientId: currentClient.id,
      clientName: currentClient.name,
      clientAvatar: currentClient.avatar,
      serviceName: reviewModalApt.serviceName,
      staffName: reviewModalApt.staffName,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewModalApt(null);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 pb-24 md:pb-16 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Header Profile Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <img
                src={currentClient.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={currentClient.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-400/40 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-stone-950">{currentClient.name}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    Client VIP
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">{currentClient.phone} • {currentClient.city}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-stone-700">
                  <span>📅 {clientAppointments.length} réservations</span>
                  <span>•</span>
                  <span className="text-amber-700">⭐ {currentClient.loyaltyPoints} points fidélité</span>
                </div>
              </div>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-[100px]">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">Fidélité</span>
                <span className="text-xl font-black text-amber-950">{currentClient.loyaltyPoints} pts</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200 text-center min-w-[100px]">
                <span className="text-[11px] font-bold text-stone-500 uppercase block">Total dépensé</span>
                <span className="text-sm font-black text-stone-900">{formatCurrency(currentClient.totalSpent, currentCurrency)}</span>
              </div>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Mes Rendez-vous ({clientAppointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Mes Favoris ({favoriteSalons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('loyalty')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'loyalty'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Fidélité & Récompenses</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mon Profil</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MES RENDEZ-VOUS */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            
            {/* Section A: Upcoming Appointments */}
            <div>
              <h3 className="text-lg font-black text-stone-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>Rendez-vous à venir ({upcomingAppointments.length})</span>
              </h3>

              {upcomingAppointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="bg-white rounded-3xl border-2 border-amber-300 p-5 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase">
                              {apt.status === 'in_progress' ? 'En cours au salon' : 'Confirmé'}
                            </span>
                            <h4 className="font-extrabold text-base text-stone-900 mt-1.5">{apt.serviceName}</h4>
                            <p className="text-xs font-semibold text-amber-700">{apt.salonName}</p>
                          </div>

                          <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center p-1">
                            <QrCode className="w-full h-full text-stone-800" />
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50/70 p-3 rounded-2xl border border-stone-100 mb-4">
                          <p className="flex items-center gap-2 font-bold text-stone-900">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span>{formatDateFrench(apt.date)} à {apt.startTime} ({apt.durationMinutes} min)</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-stone-400" />
                            <span>Avec : <strong>{apt.staffName}</strong></span>
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span>{apt.salonAddress}</span>
                          </p>
                          <div className="pt-2 border-t border-stone-200 flex justify-between font-bold">
                            <span>Total : {formatCurrency(apt.totalPrice, apt.currency)}</span>
                            <span className="text-emerald-700">
                              {apt.paymentStatus === 'partial_deposit' 
                                ? `Acompte payé (${formatCurrency(apt.paidAmount, apt.currency)})` 
                                : 'Paiement sur place'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                        <a
                          href={buildWhatsAppLink(apt.salonWhatsapp, apt)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Salon</span>
                        </a>

                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="py-2 px-3 rounded-xl border border-stone-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 text-xs font-bold transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center">
                  <p className="text-xs text-stone-500">Vous n’avez aucun rendez-vous à venir.</p>
                </div>
              )}
            </div>

            {/* Section B: Past Appointments */}
            <div>
              <h3 className="text-lg font-black text-stone-900 mb-4">
                Historique des rendez-vous ({pastAppointments.length})
              </h3>

              <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
                {pastAppointments.map(apt => (
                  <div key={apt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          apt.status === 'completed' ? 'bg-stone-100 text-stone-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {apt.status === 'completed' ? 'Terminé' : 'Annulé'}
                        </span>
                        <h4 className="font-bold text-sm text-stone-900">{apt.serviceName}</h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {apt.salonName} • {apt.date} • {formatCurrency(apt.totalPrice, apt.currency)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {apt.status === 'completed' && (
                        <button
                          onClick={() => handleOpenReviewModal(apt)}
                          className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Laisser un avis</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const salon = salons.find(s => s.id === apt.salonId);
                          if (salon) onBookSalon(salon);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
                      >
                        Reprendre RDV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MES FAVORIS */}
        {activeTab === 'favorites' && (
          <div>
            <h3 className="text-lg font-black text-stone-900 mb-4">Mes Salons Enregistrés</h3>
            {favoriteSalons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteSalons.map(salon => (
                  <div key={salon.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
                    <img
                      src={salon.coverImage}
                      alt={salon.name}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-16/10 object-cover"
                    />
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-base text-stone-900">{salon.name}</h4>
                          <p className="text-xs text-stone-500">{salon.neighborhood}, {salon.city}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {salon.rating.toFixed(1)}
                        </span>
                      </div>

                      <button
                        onClick={() => onBookSalon(salon)}
                        className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Prendre rendez-vous
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center">
                <p className="text-xs text-stone-500">Vous n’avez aucun salon dans vos favoris.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FIDELITE */}
        {activeTab === 'loyalty' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Virtual Card */}
            <div className="bg-gradient-to-tr from-stone-950 via-stone-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">Carte Kuzuri Privilège</span>
                  <h4 className="text-xl font-black mt-1">{currentClient.name}</h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Scissors className="w-5 h-5 -rotate-45" />
                </div>
              </div>

              <div className="pt-8">
                <span className="text-xs text-stone-400 block">Solde de points</span>
                <span className="text-3xl font-black text-amber-400">{currentClient.loyaltyPoints} points</span>
                <p className="text-[11px] text-stone-400 mt-1">100 FCFA dépensés = 1 point cumulé</p>
              </div>
            </div>

            {/* Card 2: Unlocked Rewards */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h4 className="font-extrabold text-base text-stone-900">Récompenses disponibles</h4>
              
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-amber-950 block">Coupe offerte dès 500 points</span>
                  <span className="text-[11px] text-amber-700">Vous avez atteint le palier !</span>
                </div>
                <button
                  onClick={() => addToastNotification('Coupon activé ! 🎁', 'Votre réduction sera appliquée à votre prochaine réservation.')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Utiliser
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between opacity-75">
                <div>
                  <span className="font-bold text-xs text-stone-800 block">Soin barbe vapeur offert (700 pts)</span>
                  <span className="text-[11px] text-stone-500">Il vous manque 250 points</span>
                </div>
                <span className="text-xs font-bold text-stone-400">Verrouillé</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-xl shadow-xs">
            <h3 className="font-black text-lg text-stone-900 mb-4">Mes Informations Personnelles</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              addToastNotification('Profil mis à jour !', 'Vos coordonnées ont été enregistrées.');
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={currentClient.name}
                  onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Numéro Mobile Money & WhatsApp</label>
                <input
                  type="tel"
                  value={currentClient.phone}
                  onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={currentClient.email || ''}
                  onChange={(e) => setCurrentClient({ ...currentClient, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Ville de résidence</label>
                <input
                  type="text"
                  value={currentClient.city}
                  onChange={(e) => setCurrentClient({ ...currentClient, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                className="mt-4 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
              >
                Sauvegarder les modifications
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Review Modal */}
      {reviewModalApt && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h4 className="font-black text-stone-900 text-base">Laisser un avis vérifié</h4>
              <button onClick={() => setReviewModalApt(null)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-stone-600 mb-2">
                  Comment s’est passée votre prestation <strong>{reviewModalApt.serviceName}</strong> chez <strong>{reviewModalApt.salonName}</strong> ?
                </p>
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-stone-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Votre commentaire</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Ambiance, propreté, professionnalisme du coiffeur..."
                  className="w-full p-3 rounded-xl border border-stone-300 focus:border-amber-500 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Publier mon avis
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
