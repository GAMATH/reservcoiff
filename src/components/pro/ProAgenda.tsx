import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, StaffMember, Service } from '../../types';
import { formatCurrency, formatDateFrench } from '../../utils/formatters';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  User, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  QrCode,
  Smartphone
} from 'lucide-react';

interface ProAgendaProps {
  salonId: string;
}

export const ProAgenda: React.FC<ProAgendaProps> = ({ salonId }) => {
  const { 
    salons, 
    staff, 
    services, 
    appointments, 
    updateAppointmentStatus, 
    createAppointment,
    currentCurrency,
    addToastNotification 
  } = useApp();

  const salon = (salons || []).find(s => s.id === salonId) || (salons && salons[0]);
  const salonStaff = (staff || []).filter(st => st.salonId === salonId);
  const salonServices = (services || []).filter(s => s.salonId === salonId);

  // Selected date for calendar view (default today)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  
  // Selected appointment for detail drawer / modal
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  // New Walk-in Appointment Modal
  const [showNewAptModal, setShowNewAptModal] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>('');
  const [newClientPhone, setNewClientPhone] = useState<string>('');
  const [newServiceId, setNewServiceId] = useState<string>(salonServices[0]?.id || '');
  const [newStaffId, setNewStaffId] = useState<string>(salonStaff[0]?.id || '');
  const [newTime, setNewTime] = useState<string>('14:00');
  const [newPaymentMethod, setNewPaymentMethod] = useState<any>('cash');

  // Filter appointments for this salon and selected date
  const dayAppointments = useMemo(() => {
    return (appointments || []).filter(apt => 
      apt.salonId === salonId && 
      apt.date === selectedDate &&
      apt.status !== 'cancelled' &&
      (selectedStaffFilter === 'all' || apt.staffId === selectedStaffFilter)
    ).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [appointments, salonId, selectedDate, selectedStaffFilter]);

  // Generate hourly time grid slots from 08:00 to 21:00
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  const handleCreateWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newServiceId || !newStaffId) return;

    createAppointment({
      salonId,
      serviceId: newServiceId,
      staffId: newStaffId,
      date: selectedDate,
      startTime: newTime,
      clientName: newClientName,
      clientPhone: newClientPhone || '+242 06 000 00 00',
      paymentMethod: newPaymentMethod,
      paymentOption: 'on_site'
    });

    setShowNewAptModal(false);
    setNewClientName('');
    setNewClientPhone('');
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'in_progress':
      case 'arrived':
        return 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse';
      case 'completed':
        return 'bg-emerald-100 border-emerald-300 text-emerald-900';
      case 'no_show':
        return 'bg-rose-100 border-rose-300 text-rose-900';
      default:
        return 'bg-stone-100 border-stone-300 text-stone-900';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'arrived': return 'Arrivé au salon';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'no_show': return 'No-Show';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold text-stone-900 outline-none focus:border-amber-500 cursor-pointer bg-stone-50"
          />
          <span className="text-xs sm:text-sm font-black text-stone-900 capitalize hidden sm:inline">
            {formatDateFrench(selectedDate)}
          </span>
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
          >
            Aujourd’hui
          </button>
        </div>

        {/* Staff Filter & Action Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="p-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 bg-stone-50 outline-none cursor-pointer"
          >
            <option value="all">Tous les collaborateurs ({salonStaff.length})</option>
            {salonStaff.map(st => (
              <option key={st.id} value={st.id}>{st.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowNewAptModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau RDV / Sans RDV</span>
          </button>
        </div>

      </div>

      {/* Main Agenda Grid by Staff Columns or Chronological List */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <div>
            <h3 className="font-black text-lg text-stone-950">
              Planning du jour ({dayAppointments.length} rendez-vous)
            </h3>
            <p className="text-xs text-stone-500">
              Cliquez sur un rendez-vous pour changer son statut ou encaisser le client
            </p>
          </div>
        </div>

        {dayAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayAppointments.map(apt => (
              <div
                key={apt.id}
                onClick={() => setSelectedApt(apt)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${getStatusColor(apt.status)}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-extrabold text-xs px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-xs">
                    {apt.startTime} - {apt.endTime}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/90">
                    {getStatusLabel(apt.status)}
                  </span>
                </div>

                <h4 className="font-black text-sm text-stone-950 mt-1">{apt.clientName}</h4>
                <p className="text-xs font-semibold text-stone-800">{apt.serviceName}</p>
                
                <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700">💇 {apt.staffName}</span>
                  <span className="font-black">{formatCurrency(apt.totalPrice, apt.currency)}</span>
                </div>

                {apt.paymentStatus === 'partial_deposit' && (
                  <div className="mt-1.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Acompte réglé ({formatCurrency(apt.paidAmount, apt.currency)})</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <CalendarIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700">Aucun rendez-vous sur cette date</p>
            <p className="text-xs text-stone-400 mt-1">Créez un nouveau rendez-vous ou choisissez une autre date.</p>
            <button
              onClick={() => setShowNewAptModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
            >
              Ajouter un rendez-vous
            </button>
          </div>
        )}

      </div>

      {/* Appointment Detail Drawer / Modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 p-6 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Fiche Rendez-vous</span>
                <h4 className="font-black text-lg text-stone-950">{selectedApt.referenceNumber}</h4>
              </div>
              <button onClick={() => setSelectedApt(null)} className="p-1 rounded-full hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-2xl space-y-1.5">
                <p><strong>Client :</strong> {selectedApt.clientName} ({selectedApt.clientPhone})</p>
                <p><strong>Prestation :</strong> {selectedApt.serviceName} ({selectedApt.durationMinutes} min)</p>
                <p><strong>Professionnel :</strong> {selectedApt.staffName}</p>
                <p><strong>Date :</strong> {formatDateFrench(selectedApt.date)} à {selectedApt.startTime}</p>
                <p><strong>Total :</strong> {formatCurrency(selectedApt.totalPrice, selectedApt.currency)}</p>
                <p><strong>Statut paiement :</strong> {selectedApt.paymentStatus}</p>
                {selectedApt.notes && <p className="text-amber-800"><strong>Note :</strong> {selectedApt.notes}</p>}
              </div>

              {/* Status Update Buttons */}
              <div className="space-y-1.5">
                <label className="block font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                  Mettre à jour le statut du client
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedApt.id, 'arrived');
                      setSelectedApt({ ...selectedApt, status: 'arrived' });
                      addToastNotification('Statut mis à jour', 'Client marqué comme arrivé.');
                    }}
                    className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs"
                  >
                    🚶 Arrivé au salon
                  </button>

                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedApt.id, 'in_progress');
                      setSelectedApt({ ...selectedApt, status: 'in_progress' });
                      addToastNotification('Statut mis à jour', 'Prestation en cours.');
                    }}
                    className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs"
                  >
                    💇 Prestation en cours
                  </button>

                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedApt.id, 'completed', 'paid_full');
                      setSelectedApt({ ...selectedApt, status: 'completed', paymentStatus: 'paid_full' });
                      addToastNotification('Prestation terminée', 'Rendez-vous marqué comme terminé et payé.');
                    }}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs col-span-2"
                  >
                    ✓ Terminé & Encaissé
                  </button>

                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedApt.id, 'no_show');
                      setSelectedApt({ ...selectedApt, status: 'no_show' });
                      addToastNotification('No-Show', 'Client marqué absent sans préavis.');
                    }}
                    className="py-2 px-3 rounded-xl border border-rose-200 text-rose-700 font-bold text-xs"
                  >
                    ❌ Absent (No-Show)
                  </button>

                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedApt.id, 'cancelled');
                      setSelectedApt({ ...selectedApt, status: 'cancelled' });
                      addToastNotification('Annulé', 'Rendez-vous annulé.');
                    }}
                    className="py-2 px-3 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                  >
                    Annuler le RDV
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Modal: New Walk-in Appointment */}
      {showNewAptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h4 className="font-black text-stone-900 text-base">Ajouter un rendez-vous (Walk-in)</h4>
              <button onClick={() => setShowNewAptModal(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nom du client *</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ex: Rodrigue Banza"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Numéro de téléphone</label>
                <input
                  type="tel"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="+242 06 123 45 67"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Prestation</label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold outline-none"
                >
                  {salonServices.map(srv => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} ({formatCurrency(srv.price, currentCurrency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Coiffeur assigné</label>
                <select
                  value={newStaffId}
                  onChange={(e) => setNewStaffId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold outline-none"
                >
                  {salonStaff.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.role})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Heure de début</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold outline-none"
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Mode de paiement</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold outline-none"
                  >
                    <option value="cash">Espèces sur place</option>
                    <option value="mtn_momo">MTN Mobile Money</option>
                    <option value="airtel_money">Airtel Money</option>
                    <option value="card">Carte Bancaire</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs mt-4 shadow-xs"
              >
                Enregistrer le rendez-vous
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
