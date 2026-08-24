import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Calendar, Heart, Store, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, setSelectedSalonSlug, favorites, appointments } = useApp();

  const activeAppointmentsCount = appointments.filter(
    a => a.status === 'confirmed' || a.status === 'in_progress'
  ).length;

  const navigateTo = (view: string) => {
    setSelectedSalonSlug(null);
    setCurrentView(view);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F0EBE5] px-3 py-2">
      <div className="flex items-center justify-around">
        <button
          onClick={() => navigateTo('marketplace')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
            currentView === 'marketplace' || currentView === 'salon_detail'
              ? 'text-[#B45309] font-bold'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explorer</span>
        </button>

        <button
          onClick={() => navigateTo('client_portal')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
            currentView === 'client_portal'
              ? 'text-[#B45309] font-bold'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          {activeAppointmentsCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#B45309] text-white text-[9px] font-bold flex items-center justify-center">
              {activeAppointmentsCount}
            </span>
          )}
          <span className="text-[10px]">Mes RDV</span>
        </button>

        <button
          onClick={() => navigateTo('client_portal')}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[#6B7280] hover:text-[#1A1A1A]"
        >
          <Heart className="w-5 h-5 text-rose-500" />
          <span className="text-[10px]">Favoris ({favorites.length})</span>
        </button>

        <button
          onClick={() => navigateTo('pro_dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors ${
            currentView === 'pro_dashboard'
              ? 'text-[#B45309] font-bold'
              : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          <div className={`p-1 rounded-md ${currentView === 'pro_dashboard' ? 'bg-[#FFFBEB] text-[#B45309]' : 'bg-[#F3F4F6]'}`}>
            <Store className="w-4 h-4" />
          </div>
          <span className="text-[10px]">Espace Pro</span>
        </button>
      </div>
    </div>
  );
};
