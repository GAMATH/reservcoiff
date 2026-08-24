import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { 
  Sparkles, 
  MessageSquare, 
  Tag, 
  Gift, 
  Clock, 
  Send, 
  Percent, 
  Check, 
  Users, 
  AlertCircle,
  Smartphone
} from 'lucide-react';

interface ProMarketingProps {
  salonId: string;
}

export const ProMarketing: React.FC<ProMarketingProps> = ({ salonId }) => {
  const { salons, clients, currentCurrency, addToastNotification } = useApp();
  const salon = salons.find(s => s.id === salonId) || salons[0];

  const [campaignTitle, setCampaignTitle] = useState('Offre Spéciale Week-end');
  const [campaignMessage, setCampaignMessage] = useState(
    `Bonjour ! Profitez de -20% sur toutes nos coupes et tresses ce jeudi et vendredi chez ${salon.name}. Réservez votre créneau sur Kuzuri !`
  );
  const [selectedTarget, setSelectedTarget] = useState<'all' | 'vip' | 'inactive'>('all');
  const [isSending, setIsSending] = useState(false);

  // Active Promo Codes
  const [promoCodes, setPromoCodes] = useState([
    { code: 'AFROVIP20', discount: '20%', uses: 48, status: 'Actif' },
    { code: 'BIENVENUE10', discount: '10%', uses: 112, status: 'Actif' },
    { code: 'HAPPYHOUR15', discount: '15%', uses: 24, status: 'Mardi & Jeudi matin' }
  ]);

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      addToastNotification(
        'Campagne WhatsApp & SMS envoyée ! 🚀',
        `Message diffusé avec succès à ${clients.length} clients.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-[11px] uppercase tracking-wider">
            Marketing & Croissance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-3">
            Remplissez vos créneaux creux
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
            Activez les promotions d’heures creuses (mardi/jeudi matin) et relancez vos clients fidèles par SMS et WhatsApp sans frais intermédiaires.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: WhatsApp & SMS Campaign Launcher (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-black text-base text-stone-950">Diffusion WhatsApp / SMS Rapide</h3>
              <p className="text-xs text-stone-500">Envoyez des rappels ou offres groupées</p>
            </div>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Cible de la campagne</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTarget('all')}
                  className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                    selectedTarget === 'all'
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  Tous les clients ({clients.length})
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTarget('vip')}
                  className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                    selectedTarget === 'vip'
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  Clients VIP (5+ visites)
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTarget('inactive')}
                  className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                    selectedTarget === 'inactive'
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  Inactifs (30+ jours)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Objet de la campagne</label>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Texte du message WhatsApp</label>
              <textarea
                rows={4}
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Envoi en cours...' : 'Diffuser la campagne maintenant'}</span>
            </button>
          </form>
        </div>

        {/* Right: Active Promo Codes & Happy Hours (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-base text-stone-950">Codes Promo Actifs</h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {promoCodes.map((promo, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-black text-stone-900 text-sm tracking-wider">{promo.code}</span>
                    <p className="text-[11px] text-stone-500">{promo.status} • {promo.uses} utilisations</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-extrabold">
                    {promo.discount}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => addToastNotification('Nouveau code', 'Générateur de code promo ouvert.')}
              className="w-full py-2.5 rounded-xl border border-stone-300 hover:border-amber-500 bg-white font-bold text-xs text-stone-800 transition-colors"
            >
              + Créer un nouveau code promo
            </button>
          </div>

          {/* Automated Loyalty Rules */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-3">
            <h3 className="font-black text-base text-stone-950 flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-500" />
              <span>Programme Fidélité Salon</span>
            </h3>
            <p className="text-xs text-stone-500">
              Chaque client gagne 1 point tous les 100 FCFA dépensés. Dès 500 points, une réduction est automatiquement débloquée.
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Fidélisation automatique activée pour ce salon.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
