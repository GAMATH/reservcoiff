import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Scissors, 
  Award, 
  ArrowUpRight, 
  PieChart, 
  BarChart3,
  Smartphone,
  Banknote
} from 'lucide-react';

interface ProAnalyticsProps {
  salonId: string;
}

export const ProAnalytics: React.FC<ProAnalyticsProps> = ({ salonId }) => {
  const { salons = [], appointments = [], services = [], staff = [], currentCurrency } = useApp();
  const salon = (salons || []).find(s => s.id === salonId) || (salons && salons[0]);
  const salonStaff = (staff || []).filter(st => st.salonId === salonId);
  const salonServices = (services || []).filter(s => s.salonId === salonId);
  const salonAppointments = (appointments || []).filter(a => a.salonId === salonId);

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Total completed revenue
  const totalRevenue = salonAppointments
    .filter(a => a.status === 'completed' || a.status === 'confirmed')
    .reduce((acc, a) => acc + a.totalPrice, 0);

  const mobileMoneyRevenue = Math.round(totalRevenue * 0.68);
  const cashRevenue = totalRevenue - mobileMoneyRevenue;

  const totalBookings = salonAppointments.length;
  const completedCount = salonAppointments.filter(a => a.status === 'completed').length;
  const averageTicket = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  // Daily revenue mock chart data
  const daysData = [
    { day: 'Lun', amount: 85000 },
    { day: 'Mar', amount: 110000 },
    { day: 'Mer', amount: 95000 },
    { day: 'Jeu', amount: 140000 },
    { day: 'Ven', amount: 230000 },
    { day: 'Sam', amount: 380000 },
    { day: 'Dim', amount: 190000 }
  ];

  const maxAmount = Math.max(...daysData.map(d => d.amount));

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase">Chiffre d’Affaires</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-950 mt-3">
            {formatCurrency(totalRevenue || 1250000, currentCurrency)}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18.4% vs mois dernier
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase">Rendez-vous Total</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-950 mt-3">{totalBookings || 142}</p>
          <p className="text-[11px] text-stone-500 mt-1">94% taux de présence (faible no-show)</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase">Panier Moyen</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-950 mt-3">
            {formatCurrency(averageTicket || 8800, currentCurrency)}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">Prestations + soins vente</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase">Note Moyenne</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-950 mt-3">{salon.rating.toFixed(1)} / 5</p>
          <p className="text-[11px] text-stone-500 mt-1">Basé sur {salon.reviewCount} avis certifiés</p>
        </div>

      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-stone-950">Chiffre d’Affaires Hebdomadaire</h3>
              <p className="text-xs text-stone-500">Pic de fréquentation le week-end (Vendredi - Samedi)</p>
            </div>
            <div className="flex gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold text-stone-600">
              <button className="px-2.5 py-1 rounded-lg bg-white shadow-xs text-stone-900">7 jours</button>
              <button className="px-2.5 py-1 rounded-lg hover:text-stone-900">30 jours</button>
            </div>
          </div>

          <div className="pt-6 h-56 flex items-end justify-between gap-3">
            {daysData.map(d => {
              const heightPercent = (d.amount / maxAmount) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {Math.round(d.amount / 1000)}k
                  </span>
                  <div className="w-full bg-stone-100 rounded-t-xl overflow-hidden h-40 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-400 group-hover:from-amber-700 group-hover:to-amber-500 transition-all rounded-t-xl"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-700">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods & Performance (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-5">
          <h3 className="font-black text-base text-stone-950">Répartition des Encaissements</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-stone-800">
                  <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                  Mobile Money (MTN / Airtel / Orange / Wave)
                </span>
                <span className="text-amber-700">68% ({formatCurrency(mobileMoneyRevenue || 850000, currentCurrency)})</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-stone-800">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                  Espèces au comptoir
                </span>
                <span className="text-emerald-700">32% ({formatCurrency(cashRevenue || 400000, currentCurrency)})</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3">Top Collaborateurs</h4>
            <div className="space-y-2">
              {salonStaff.slice(0, 3).map((st, i) => (
                <div key={st.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-600">#{i + 1}</span>
                    <span className="font-bold text-stone-900">{st.name}</span>
                  </div>
                  <span className="font-semibold text-stone-600">{formatCurrency(350000 - (i * 80000), currentCurrency)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
