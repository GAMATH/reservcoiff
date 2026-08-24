import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProAgenda } from './ProAgenda';
import { ProPos } from './ProPos';
import { ProClients } from './ProClients';
import { ProServices } from './ProServices';
import { ProStaff } from './ProStaff';
import { ProAnalytics } from './ProAnalytics';
import { ProMarketing } from './ProMarketing';
import { ProReviews } from './ProReviews';
import { ProSettings } from './ProSettings';
import { 
  Calendar, 
  Calculator, 
  Users, 
  Scissors, 
  UserCheck, 
  BarChart3, 
  MessageSquare, 
  Star, 
  Settings, 
  ExternalLink,
  ChevronDown,
  Building2,
  Sparkles,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

export const ProDashboard: React.FC = () => {
  const { 
    salons, 
    proSalonId, 
    setProSalonId, 
    setSelectedSalonSlug, 
    setCurrentView,
    appointments
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'agenda' | 'pos' | 'clients' | 'services' | 'staff' | 'analytics' | 'marketing' | 'reviews' | 'settings'
  >('agenda');

  const currentSalon = salons.find(s => s.id === proSalonId) || salons[0];
  const pendingAppointments = appointments.filter(
    a => a.salonId === currentSalon.id && a.status === 'confirmed'
  ).length;

  const handleViewPublicPage = () => {
    setSelectedSalonSlug(currentSalon.slug);
    setCurrentView('salon_detail');
  };

  const navItems = [
    { id: 'agenda', label: 'Agenda & Planning', icon: Calendar, badge: pendingAppointments },
    { id: 'pos', label: 'Caisse & POS', icon: Calculator },
    { id: 'clients', label: 'Clients CRM', icon: Users },
    { id: 'services', label: 'Prestations & Tarifs', icon: Scissors },
    { id: 'staff', label: 'Équipe & Coiffeurs', icon: UserCheck },
    { id: 'analytics', label: 'Statistiques & CA', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing & Promos', icon: MessageSquare },
    { id: 'reviews', label: 'Avis Clients', icon: Star },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100/70 pb-24 md:pb-16 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pro Topbar: Salon Switcher & Status */}
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Salon Selector */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Espace Pro Salon</span>
                {currentSalon.verified && (
                  <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Vérifié
                  </span>
                )}
              </div>

              {/* Salon Select Dropdown */}
              <div className="relative mt-0.5">
                <select
                  value={proSalonId}
                  onChange={(e) => setProSalonId(e.target.value)}
                  className="appearance-none pr-8 py-0.5 bg-transparent font-black text-base sm:text-lg text-stone-950 outline-none cursor-pointer hover:text-amber-600 transition-colors"
                >
                  {salons.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city}, {s.country})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleViewPublicPage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              <span>Voir ma fiche publique</span>
            </button>

            <button
              onClick={() => setActiveTab('pos')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>Ouvrir Caisse</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-1.5 mb-6 shadow-xs overflow-x-auto scrollbar-none flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab View Body */}
        <div>
          {activeTab === 'agenda' && <ProAgenda salonId={currentSalon.id} />}
          {activeTab === 'pos' && <ProPos salonId={currentSalon.id} />}
          {activeTab === 'clients' && <ProClients salonId={currentSalon.id} />}
          {activeTab === 'services' && <ProServices salonId={currentSalon.id} />}
          {activeTab === 'staff' && <ProStaff salonId={currentSalon.id} />}
          {activeTab === 'analytics' && <ProAnalytics salonId={currentSalon.id} />}
          {activeTab === 'marketing' && <ProMarketing salonId={currentSalon.id} />}
          {activeTab === 'reviews' && <ProReviews salonId={currentSalon.id} />}
          {activeTab === 'settings' && <ProSettings salonId={currentSalon.id} />}
        </div>

      </div>
    </div>
  );
};
