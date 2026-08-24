import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Salon } from '../../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Save,
  Check
} from 'lucide-react';

interface ProSettingsProps {
  salonId: string;
}

export const ProSettings: React.FC<ProSettingsProps> = ({ salonId }) => {
  const { salons, setSalons, isLowBandwidthMode, setIsLowBandwidthMode, addToastNotification } = useApp();
  const salon = salons.find(s => s.id === salonId) || salons[0];

  const [name, setName] = useState(salon.name);
  const [tagline, setTagline] = useState(salon.tagline);
  const [address, setAddress] = useState(salon.address);
  const [neighborhood, setNeighborhood] = useState(salon.neighborhood);
  const [phone, setPhone] = useState(salon.phone);
  const [whatsapp, setWhatsapp] = useState(salon.whatsapp);
  const [defaultDepositPercent, setDefaultDepositPercent] = useState(salon.defaultDepositPercent || 30);
  const [instantBooking, setInstantBooking] = useState(salon.instantBooking);
  const [mobileMoneyAccepted, setMobileMoneyAccepted] = useState(salon.mobileMoneyAccepted);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSalons(prev => prev.map(s => {
      if (s.id === salonId) {
        return {
          ...s,
          name,
          tagline,
          address,
          neighborhood,
          phone,
          whatsapp,
          defaultDepositPercent: Number(defaultDepositPercent),
          instantBooking,
          mobileMoneyAccepted
        };
      }
      return s;
    }));

    addToastNotification('Paramètres sauvegardés ! ✅', 'Les informations du salon ont été mises à jour.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
        <h3 className="font-black text-lg text-stone-950 flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-amber-500" />
          <span>Paramètres de l’Établissement</span>
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          Configurez votre fiche publique, coordonnées et politique de réservation
        </p>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Nom commercial du salon *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Slogan / Phrase d’accroche</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Adresse complète</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Quartier & Ville</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Numéro Téléphone Appels</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Numéro WhatsApp Business</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
              />
            </div>
          </div>

          {/* Booking & Payment Policies */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm">Politique de Réservation & Acomptes</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Acompte par défaut (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={defaultDepositPercent}
                  onChange={(e) => setDefaultDepositPercent(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                />
              </div>

              <div className="flex flex-col justify-end space-y-2">
                <label className="flex items-center gap-2 font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={instantBooking}
                    onChange={(e) => setInstantBooking(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Réservation instantanée sans confirmation manuelle</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mobileMoneyAccepted}
                    onChange={(e) => setMobileMoneyAccepted(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Accepter les paiements Mobile Money (MTN, Airtel, Orange, Wave)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les paramètres</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
