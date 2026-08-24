import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../data/mockData';
import { 
  Scissors, 
  MapPin, 
  Globe, 
  Wifi, 
  WifiOff, 
  Calendar, 
  Heart, 
  User, 
  Store, 
  ShieldCheck, 
  Bell, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { CountryCode } from '../../types';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const {
    currentCountry,
    setCurrentCountry,
    currentCurrency,
    currentView,
    setCurrentView,
    setSelectedSalonSlug,
    isLowBandwidthMode,
    setIsLowBandwidthMode,
    language,
    setLanguage,
    favorites = [],
    notifications = [],
    markNotificationAsRead,
    clearNotifications,
    currentClient
  } = useApp();

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const selectedCountryObj = COUNTRIES.find(c => c.code === currentCountry) || COUNTRIES[0];
  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const navigateTo = (view: string, slug: string | null = null) => {
    setSelectedSalonSlug(slug);
    setCurrentView(view);
    setShowUserDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#F0EBE5] transition-all">
      {/* Top micro banner for quick market info & low bandwidth mode */}
      <div className="bg-[#1A1A1A] text-[#9CA3AF] text-xs px-4 sm:px-8 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="flex items-center gap-1.5 text-[#FDE68A] font-medium text-[11px]">
            <Sparkles className="w-3 h-3 text-[#FDE68A]" />
            Plateforme #1 Coiffure & Beauté en Afrique
          </span>
          <span className="text-[#4B5563] hidden sm:inline">•</span>
          <span className="text-[#9CA3AF] text-[11px] hidden sm:inline">Paiements Mobile Money sécurisés (MTN, Airtel, Orange, Wave)</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Low Bandwidth Toggle */}
          <button
            onClick={() => setIsLowBandwidthMode(!isLowBandwidthMode)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              isLowBandwidthMode 
                ? 'bg-[#B45309] text-white' 
                : 'bg-[#2B2B2B] text-[#9CA3AF] hover:text-white'
            }`}
            title="Optimise la vitesse et réduit la consommation de données internet"
          >
            {isLowBandwidthMode ? <WifiOff className="w-3 h-3 text-amber-200" /> : <Wifi className="w-3 h-3" />}
            <span>{isLowBandwidthMode ? 'Éco Données' : 'Mode Éco'}</span>
          </button>

          {/* Lang Toggle */}
          <button
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="text-[#9CA3AF] hover:text-white uppercase font-bold text-[11px]"
          >
            {language}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Country Selector */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => navigateTo('marketplace')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#B45309] flex items-center justify-center text-white font-bold text-xs shadow-xs group-hover:bg-[#92400E] transition-colors">
                K
              </div>
              <div className="text-xl font-bold tracking-tight text-[#B45309] flex items-center gap-1">
                <span>Kuzuri</span>
              </div>
            </button>

            {/* Country Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center gap-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] px-3 py-1.5 rounded-full text-xs font-semibold text-[#1A1A1A] transition-all"
              >
                <span className="text-sm">{selectedCountryObj.flag}</span>
                <span className="hidden md:inline text-xs font-medium text-[#4B5563]">{selectedCountryObj.code}</span>
                <span className="text-[11px] text-[#B45309] font-bold">
                  {currentCurrency}
                </span>
                <ChevronDown className="w-3 h-3 text-[#6B7280]" />
              </button>

              {showCountryDropdown && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[#F0EBE5] py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
                    Choisir votre pays
                  </div>
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrentCountry(c.code as CountryCode);
                        setShowCountryDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-[#FFFBEB] transition-colors ${
                        currentCountry === c.code ? 'bg-[#FFFBEB] font-bold text-[#B45309]' : 'text-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{c.flag}</span>
                        <span>{c.name}</span>
                      </div>
                      <span className="text-[11px] text-[#6B7280] font-medium">
                        {c.currency}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6B7280]">
            <button
              onClick={() => navigateTo('marketplace')}
              className={`pb-1 transition-colors ${
                currentView === 'marketplace' 
                  ? 'text-[#1A1A1A] border-b-2 border-[#B45309] font-semibold' 
                  : 'hover:text-[#1A1A1A]'
              }`}
            >
              Découvrir
            </button>

            <button
              onClick={() => navigateTo('client_portal')}
              className={`pb-1 flex items-center gap-1.5 transition-colors ${
                currentView === 'client_portal' 
                  ? 'text-[#1A1A1A] border-b-2 border-[#B45309] font-semibold' 
                  : 'hover:text-[#1A1A1A]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#6B7280]" />
              <span>Mes Rendez-vous</span>
            </button>

            <button
              onClick={() => navigateTo('client_portal')}
              className="flex items-center gap-1.5 hover:text-[#1A1A1A] transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Favoris ({favorites.length})</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Pro Button */}
            <button
              onClick={() => navigateTo('pro_dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'pro_dashboard'
                  ? 'bg-[#B45309] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F3F4F6] text-[#1A1A1A] border border-[#F0EBE5]'
              }`}
            >
              <Store className="w-4 h-4 text-[#B45309]" />
              <span className="hidden sm:inline">Espace Pro</span>
              <span className="sm:hidden">Pro</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 rounded-full text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F3F4F6] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#B45309] rounded-full ring-2 ring-white" />
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#F0EBE5] p-4 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE5]">
                    <div className="font-bold text-sm text-[#1A1A1A] flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#B45309]" />
                      Notifications ({notifications.length})
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="text-xs text-[#6B7280] hover:text-[#1A1A1A]"
                      >
                        Effacer tout
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                    {(notifications || []).length === 0 ? (
                      <p className="text-xs text-[#6B7280] py-4 text-center">Aucune notification pour le moment</p>
                    ) : (
                      (notifications || []).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            n.read ? 'bg-[#FCFBF8] border-[#F0EBE5] text-[#6B7280]' : 'bg-[#FFFBEB] border-[#FDE68A] text-[#1A1A1A] font-medium'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-[#1A1A1A]">{n.title}</span>
                            <span className="text-[10px] text-[#6B7280]">{n.timestamp}</span>
                          </div>
                          <p className="mt-1 text-[#4B5563] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full border border-[#F0EBE5] hover:bg-[#F3F4F6] transition-all"
              >
                <img
                  src={currentClient.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentClient.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#F0EBE5]"
                />
                <span className="hidden lg:inline text-xs font-semibold text-[#1A1A1A]">
                  {currentClient.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[#6B7280] hidden sm:inline" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#F0EBE5] py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-[#F0EBE5]">
                    <p className="text-xs font-bold text-[#1A1A1A]">{currentClient.name}</p>
                    <p className="text-[11px] text-[#6B7280]">{currentClient.phone}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] text-[10px] font-bold">
                        ⭐ {currentClient.loyaltyPoints} pts fidélité
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => navigateTo('client_portal')}
                      className="w-full px-4 py-2 text-xs text-left text-[#1A1A1A] hover:bg-[#FFFBEB] flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-[#B45309]" />
                      Mes réservations & Portefeuille
                    </button>
                    <button
                      onClick={() => navigateTo('pro_dashboard')}
                      className="w-full px-4 py-2 text-xs text-left text-[#1A1A1A] hover:bg-[#FFFBEB] flex items-center gap-2 font-medium"
                    >
                      <Store className="w-4 h-4 text-[#B45309]" />
                      Espace Salon (SaaS & Agenda)
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
