import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientProfile } from '../../types';
import { formatCurrency, buildWhatsAppLink } from '../../utils/formatters';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MessageSquare, 
  Star, 
  Calendar, 
  Clock, 
  Sparkles, 
  X, 
  Heart,
  Tag
} from 'lucide-react';

interface ProClientsProps {
  salonId: string;
}

export const ProClients: React.FC<ProClientsProps> = ({ salonId }) => {
  const { clients, currentCurrency, addToastNotification } = useApp();
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  // Filter clients
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, ville..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold outline-none focus:border-amber-500 bg-stone-50"
          />
        </div>

        <button
          onClick={() => addToastNotification('Ajout client', 'Formulaire nouveau client ouvert.')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau client</span>
        </button>
      </div>

      {/* Clients Directory Table / Grid */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-black text-base text-stone-950 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Fichier Clients ({filteredClients.length})</span>
          </h3>
        </div>

        <div className="divide-y divide-stone-100">
          {filteredClients.map(client => (
            <div
              key={client.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={client.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={client.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/40"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900">{client.name}</h4>
                    {client.totalBookings > 4 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{client.phone} • {client.city}</p>
                  
                  {client.tags && client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {client.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.2 rounded bg-stone-100 text-stone-700 text-[10px] font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-stone-400 block font-medium">
                    {client.totalBookings} visites • {client.loyaltyPoints} pts
                  </span>
                  <span className="font-black text-sm text-stone-900">
                    {formatCurrency(client.totalSpent, currentCurrency)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={buildWhatsAppLink(client.phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    title="Envoyer un message WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <a
                    href={`tel:${client.phone}`}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    title="Appeler"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setSelectedClient(client)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-amber-400 text-xs font-bold text-stone-700 hover:text-stone-900 transition-colors"
                  >
                    Détails
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Client Detail Drawer / Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="font-black text-stone-950 text-base">Fiche Client CRM</h4>
              <button onClick={() => setSelectedClient(null)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={selectedClient.avatar}
                  alt={selectedClient.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400"
                />
                <div>
                  <h4 className="font-black text-base text-stone-900">{selectedClient.name}</h4>
                  <p className="text-stone-500">{selectedClient.phone} • {selectedClient.city}</p>
                  <p className="text-amber-700 font-bold">{selectedClient.loyaltyPoints} points fidélité</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 space-y-2 border border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-500">Nombre de visites :</span>
                  <span className="font-bold text-stone-900">{selectedClient.totalBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Chiffre d’affaires total :</span>
                  <span className="font-bold text-stone-900">{formatCurrency(selectedClient.totalSpent, currentCurrency)}</span>
                </div>
              </div>

              {selectedClient.privateNotesBySalon && selectedClient.privateNotesBySalon[salonId] && (
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Notes privées du salon (texture cheveu, allergies, préférences)
                  </label>
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950">
                    {selectedClient.privateNotesBySalon[salonId]}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
