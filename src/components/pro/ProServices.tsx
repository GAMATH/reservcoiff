import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types';
import { formatCurrency, CATEGORY_LABELS } from '../../utils/formatters';
import { Scissors, Plus, Edit2, Trash2, Check, Clock, Sparkles, X } from 'lucide-react';

interface ProServicesProps {
  salonId: string;
}

export const ProServices: React.FC<ProServicesProps> = ({ salonId }) => {
  const { services = [], setServices, currentCurrency, addToastNotification } = useApp();
  const salonServices = (services || []).filter(s => s.salonId === salonId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<any>('haircut_men');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [price, setPrice] = useState(5000);
  const [description, setDescription] = useState('');
  const [depositRequired, setDepositRequired] = useState(true);
  const [depositPercentage, setDepositPercentage] = useState(30);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newService: Service = {
      id: `srv_${Date.now()}`,
      salonId,
      name,
      category,
      durationMinutes: Number(durationMinutes),
      price: Number(price),
      description,
      popular: false,
      depositRequired,
      depositPercentage: Number(depositPercentage),
      staffIds: []
    };

    setServices(prev => [...prev, newService]);
    setShowAddModal(false);
    setName('');
    setDescription('');
    addToastNotification('Prestation ajoutée ! ✂️', `"${name}" est désormais disponible à la réservation.`);
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    addToastNotification('Prestation supprimée', 'La prestation a été retirée du menu.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-black text-base text-stone-950 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-amber-500" />
            <span>Gestion des Prestations ({salonServices.length})</span>
          </h3>
          <p className="text-xs text-stone-500">Configurez vos tarifs, durées et exigences d’acompte</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle prestation</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-stone-100">
          {salonServices.map(srv => (
            <div key={srv.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-stone-900">{srv.name}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                    {CATEGORY_LABELS[srv.category]?.label || srv.category}
                  </span>
                  {srv.popular && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                      ⭐ Populaire
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-500 mt-1 max-w-xl line-clamp-1">{srv.description}</p>

                <div className="flex items-center gap-3 mt-2 text-xs text-stone-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {srv.durationMinutes} min
                  </span>
                  <span>•</span>
                  <span>{srv.depositRequired ? `Acompte obligatoire (${srv.depositPercentage}%)` : 'Pas d’acompte'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="font-black text-base text-stone-950">
                  {formatCurrency(srv.price, currentCurrency)}
                </span>

                <button
                  onClick={() => handleDelete(srv.id)}
                  className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Service */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h4 className="font-black text-stone-900 text-base">Ajouter une prestation</h4>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nom de la prestation *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Tresses Knotless Braid"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
                  >
                    <option value="haircut_men">Barber & Homme</option>
                    <option value="braids_women">Tresses & Nattes</option>
                    <option value="locks_twists">Locks & Twists</option>
                    <option value="hair_treatment">Soins & Traitements</option>
                    <option value="coloring">Coloration</option>
                    <option value="beard">Barbe & Rasage</option>
                    <option value="spa_massage">Spa & Massages</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Durée (minutes)</label>
                  <input
                    type="number"
                    step={5}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Acompte (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={depositPercentage}
                    onChange={(e) => setDepositPercentage(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description courte</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails du service..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs mt-3"
              >
                Créer la prestation
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
