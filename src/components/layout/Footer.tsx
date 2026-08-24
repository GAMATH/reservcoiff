import React from 'react';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../data/mockData';
import { Scissors, Phone, MessageSquare, ShieldCheck, Heart, Globe, Sparkles } from 'lucide-react';
import { CountryCode } from '../../types';

export const Footer: React.FC = () => {
  const { setCurrentCountry, setSelectedCity, setCurrentView } = useApp();

  return (
    <footer className="bg-[#1A1A1A] text-[#9CA3AF] pt-14 pb-20 md:pb-14 border-t border-[#2B2B2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-[#2B2B2B]">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#B45309] flex items-center justify-center text-white font-bold text-xs">
                K
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Kuzuri<span className="text-[#B45309]">.</span>
              </span>
            </div>
            
            <p className="text-xs text-[#9CA3AF] max-w-sm leading-relaxed">
              La 1ère plateforme de réservation de coiffeurs, barbiers et instituts de beauté d’Afrique francophone et centrale. Simplifiez vos rendez-vous beauté avec paiement Mobile Money et rappels WhatsApp.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-[#262626] text-[11px] font-medium text-[#FDE68A] border border-[#404040]">
                MTN MoMo
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#262626] text-[11px] font-medium text-red-300 border border-[#404040]">
                Airtel Money
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#262626] text-[11px] font-medium text-orange-300 border border-[#404040]">
                Orange Money
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#262626] text-[11px] font-medium text-sky-300 border border-[#404040]">
                Wave & Moov
              </span>
            </div>
          </div>

          {/* Villes populaires */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
              Villes & Salons
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li>
                <button 
                  onClick={() => { setCurrentCountry('CG'); setSelectedCity('Brazzaville'); setCurrentView('marketplace'); }}
                  className="hover:text-white transition-colors"
                >
                  🇨🇬 Barbiers à Brazzaville
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentCountry('CG'); setSelectedCity('Pointe-Noire'); setCurrentView('marketplace'); }}
                  className="hover:text-white transition-colors"
                >
                  🇨🇬 Salons à Pointe-Noire
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentCountry('CI'); setSelectedCity('Abidjan'); setCurrentView('marketplace'); }}
                  className="hover:text-white transition-colors"
                >
                  🇨🇮 Coiffure & Wigs à Abidjan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentCountry('CM'); setSelectedCity('Douala'); setCurrentView('marketplace'); }}
                  className="hover:text-white transition-colors"
                >
                  🇨🇲 Locks & Barbiers à Douala
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentCountry('GA'); setSelectedCity('Libreville'); setCurrentView('marketplace'); }}
                  className="hover:text-white transition-colors"
                >
                  🇬🇦 Salons à Libreville
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentCountry('BJ'); setSelectedCity('Cotonou'); setCurrentView('marketplace'); }}
                  className="hover:text-white transition-colors"
                >
                  🇧🇯 Beauté & Tresses à Cotonou
                </button>
              </li>
            </ul>
          </div>

          {/* Espace Salon Pro */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Professionnels
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li>
                <button 
                  onClick={() => setCurrentView('pro_dashboard')}
                  className="hover:text-white transition-colors font-medium text-[#FDE68A]"
                >
                  Accéder à l’Espace Pro
                </button>
              </li>
              <li>
                <span className="text-[#6B7280]">Logiciel de Caisse & POS</span>
              </li>
              <li>
                <span className="text-[#6B7280]">Agenda & Calendrier connecté</span>
              </li>
              <li>
                <span className="text-[#6B7280]">Fichier Client & CRM WhatsApp</span>
              </li>
              <li>
                <span className="text-[#6B7280]">Paiements d’acomptes en ligne</span>
              </li>
            </ul>
          </div>

          {/* Support & Sécurité */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Confiance & Sécurité
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Salons 100% vérifiés</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rappels WhatsApp automatiques</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Support disponible 7j/7</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
          <p>© 2026 Kuzuri Technologies Afrique. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Brazzaville • Libreville • Douala • Abidjan • Cotonou • Lomé</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
