import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffMember } from '../../types';
import { Users, Plus, Star, Phone, Mail, Award, Clock, X, Trash2 } from 'lucide-react';

interface ProStaffProps {
  salonId: string;
}

export const ProStaff: React.FC<ProStaffProps> = ({ salonId }) => {
  const { staff = [], setStaff, addToastNotification } = useApp();
  const salonStaff = (staff || []).filter(st => st.salonId === salonId);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Master Barber');
  const [phone, setPhone] = useState('+242 06 000 00 00');
  const [commissionRate, setCommissionRate] = useState(40);
  const [specialtiesStr, setSpecialtiesStr] = useState('Dégradé américain, Barbe');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: StaffMember = {
      id: `staff_${Date.now()}`,
      salonId,
      name,
      role,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewsCount: 0,
      specialties: specialtiesStr.split(',').map(s => s.trim()).filter(Boolean),
      workingDays: [1, 2, 3, 4, 5, 6],
      startHour: '08:30',
      endHour: '19:30',
      isAvailable: true,
      commissionRate: Number(commissionRate)
    };

    setStaff(prev => [...prev, newMember]);
    setShowAddModal(false);
    setName('');
    addToastNotification('Collaborateur ajouté ! 💇', `${name} fait désormais partie de l'équipe.`);
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(prev => prev.filter(st => st.id !== id));
    addToastNotification('Collaborateur retiré', 'Le collaborateur a été retiré de l’équipe.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-black text-base text-stone-950 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Gestion de l’Équipe ({salonStaff.length})</span>
          </h3>
          <p className="text-xs text-stone-500">Gérez les coiffeurs, plannings et taux de commission</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un coiffeur</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {salonStaff.map(member => (
          <div key={member.id} className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{member.name}</h4>
                    <span className="text-xs text-amber-700 font-semibold">{member.role}</span>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-stone-900">{member.rating.toFixed(1)}</span>
                      <span>({member.reviewsCount} avis)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteStaff(member.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Horaires :</span>
                  <span className="font-semibold text-stone-800">{member.startHour} - {member.endHour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Commission :</span>
                  <span className="font-bold text-emerald-700">{member.commissionRate || 40}% sur CA</span>
                </div>
                <div className="pt-2">
                  <span className="text-stone-500 text-[11px] block mb-1">Spécialités :</span>
                  <div className="flex flex-wrap gap-1">
                    {(member.specialties || []).map((sp, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Staff */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h4 className="font-black text-stone-900 text-base">Ajouter un collaborateur</h4>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nom et Prénom *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: David Mabiala"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Rôle / Titre</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Maître Barbier / Coiffeuse Senior"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Commission (%)</label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Spécialités (séparées par virgules)</label>
                <input
                  type="text"
                  value={specialtiesStr}
                  onChange={(e) => setSpecialtiesStr(e.target.value)}
                  placeholder="Dégradé, Barbe, Nattes, Locks..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs mt-3"
              >
                Enregistrer le collaborateur
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
