import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { SalonDetailView } from './components/marketplace/SalonDetailView';
import { ClientPortal } from './components/client/ClientPortal';
import { ProDashboard } from './components/pro/ProDashboard';
import { BookingModal } from './components/booking/BookingModal';
import { Salon } from './types';
import { X, CheckCircle2, AlertCircle, Sparkles, WifiOff } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    salons, 
    toastNotifications, 
    removeToastNotification,
    isLowBandwidthMode,
    setIsLowBandwidthMode 
  } = useApp();

  // Booking Modal Global State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeBookingSalon, setActiveBookingSalon] = useState<Salon | null>(null);
  const [activeServiceId, setActiveServiceId] = useState<string | undefined>(undefined);
  const [activeStaffId, setActiveStaffId] = useState<string | undefined>(undefined);

  const handleOpenBooking = (salon: Salon, serviceId?: string, staffId?: string) => {
    setActiveBookingSalon(salon);
    setActiveServiceId(serviceId);
    setActiveStaffId(staffId);
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
  };

  const handleBookingComplete = () => {
    setCurrentView('client_portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#1A1A1A] flex flex-col font-sans antialiased selection:bg-[#B45309] selection:text-white">
      
      {/* Low-Bandwidth Mode Persistent Notice if enabled */}
      {isLowBandwidthMode && (
        <div className="bg-[#B45309] text-white text-xs px-4 py-1.5 text-center font-medium flex items-center justify-center gap-2 sticky top-0 z-50">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode Économie de Données actif (images compressées pour connexions lentes)</span>
          <button 
            onClick={() => setIsLowBandwidthMode(false)}
            className="underline ml-2 hover:text-amber-100 cursor-pointer"
          >
            Désactiver
          </button>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar onOpenBooking={() => {
        if (salons.length > 0) handleOpenBooking(salons[0]);
      }} />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'marketplace' && (
          <MarketplaceView onOpenBooking={handleOpenBooking} />
        )}

        {currentView === 'salon_detail' && (
          <SalonDetailView 
            onOpenBooking={handleOpenBooking} 
            onBack={() => {
              setCurrentView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        )}

        {currentView === 'client_portal' && (
          <ClientPortal onBookSalon={(s) => handleOpenBooking(s)} />
        )}

        {currentView === 'pro_dashboard' && (
          <ProDashboard />
        )}
      </main>

      {/* Footer (hidden on Pro Dashboard to maximize working screen) */}
      {currentView !== 'pro_dashboard' && <Footer />}

      {/* Mobile Sticky Bottom Navigation */}
      <MobileNav />

      {/* Booking Funnel Modal */}
      {bookingModalOpen && activeBookingSalon && (
        <BookingModal
          salon={activeBookingSalon}
          initialServiceId={activeServiceId}
          initialStaffId={activeStaffId}
          isOpen={bookingModalOpen}
          onClose={handleCloseBooking}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {(toastNotifications || []).map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-2xl shadow-xl border border-stone-800 backdrop-blur-md flex items-start gap-3 animate-in slide-in-from-top-4 duration-200 bg-stone-900/95 text-white"
          >
            <div className="shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            </div>

            <div className="flex-1 pr-2">
              <h5 className="font-bold text-xs sm:text-sm text-amber-300">{toast.title}</h5>
              <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToastNotification(toast.id)}
              className="text-stone-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
