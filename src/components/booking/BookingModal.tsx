import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Salon, Service, StaffMember, PaymentMethodType } from '../../types';
import { 
  formatCurrency, 
  calculateAvailableSlots, 
  formatDateFrench, 
  buildWhatsAppLink 
} from '../../utils/formatters';
import { COUNTRIES } from '../../data/mockData';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Calendar, 
  User, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  MessageSquare, 
  AlertCircle,
  CreditCard,
  Banknote,
  Lock,
  ArrowRight,
  Star
} from 'lucide-react';

interface BookingModalProps {
  salon: Salon;
  initialServiceId?: string;
  initialStaffId?: string;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  salon,
  initialServiceId,
  initialStaffId,
  isOpen,
  onClose,
  onBookingComplete
}) => {
  const {
    services,
    staff,
    appointments,
    createAppointment,
    currentClient,
    currentCountry,
    currentCurrency,
    addToastNotification
  } = useApp();

  const salonServices = useMemo(() => (services || []).filter(s => s.salonId === salon?.id), [services, salon?.id]);
  const salonStaff = useMemo(() => (staff || []).filter(st => st.salonId === salon?.id), [staff, salon?.id]);

  // Steps: 1: Service, 2: Staff, 3: Date & Slot, 4: Client Info, 5: Payment & MoMo USSD, 6: Confirmation
  const [step, setStep] = useState<number>(1);

  // Selections
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || salonServices[0]?.id || ''
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    initialStaffId || 'any'
  );

  // Date selection (default today YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Client info
  const [clientFirstName, setClientFirstName] = useState<string>(
    currentClient?.name ? currentClient.name.split(' ')[0] : ''
  );
  const [clientLastName, setClientLastName] = useState<string>(
    currentClient?.name ? currentClient.name.split(' ').slice(1).join(' ') : ''
  );
  const [clientPhone, setClientPhone] = useState<string>(currentClient?.phone || '');
  const [clientEmail, setClientEmail] = useState<string>(currentClient?.email || '');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Payment configuration
  const selectedService = salonServices.find(s => s.id === selectedServiceId) || salonServices[0];
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'now' | 'on_site'>('deposit');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('mtn_momo');

  // Simulated Mobile Money Processing State
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [ussdStep, setUssdStep] = useState<'idle' | 'prompt' | 'pin' | 'success'>('idle');
  const [momoPin, setMomoPin] = useState<string>('');

  // Generated confirmation
  const [confirmedAppointment, setConfirmedAppointment] = useState<any>(null);

  // Update selection if initial props change
  useEffect(() => {
    if (initialServiceId) setSelectedServiceId(initialServiceId);
    if (initialStaffId) setSelectedStaffId(initialStaffId);
  }, [initialServiceId, initialStaffId]);

  // Selected staff member object
  const selectedStaffMember = selectedStaffId !== 'any' 
    ? salonStaff.find(st => st.id === selectedStaffId) 
    : undefined;

  // Real-time calculation of available time slots
  const availableSlots = useMemo(() => {
    if (!selectedService || !selectedDate) return [];
    return calculateAvailableSlots({
      date: selectedDate,
      salon,
      service: selectedService,
      staff: selectedStaffMember,
      allAppointments: appointments
    });
  }, [selectedDate, salon, selectedService, selectedStaffMember, appointments]);

  // Pricing math
  const servicePrice = selectedService ? selectedService.price : 0;
  const depositPercent = selectedService?.depositPercentage || salon.defaultDepositPercent || 30;
  const depositAmount = Math.round((servicePrice * depositPercent) / 100);

  const amountToPayNow = 
    paymentOption === 'now' 
      ? servicePrice 
      : paymentOption === 'deposit' 
        ? depositAmount 
        : 0;

  const remainingOnSite = servicePrice - amountToPayNow;

  if (!isOpen) return null;

  // Handle final submission
  const handleFinalizeBooking = () => {
    if (paymentOption !== 'on_site' && paymentMethod !== 'cash') {
      // Trigger interactive USSD Mobile Money simulation!
      setIsProcessingPayment(true);
      setUssdStep('prompt');
      setTimeout(() => {
        setUssdStep('pin');
      }, 1200);
    } else {
      executeBookingCreation();
    }
  };

  const executeBookingCreation = () => {
    setIsProcessingPayment(false);
    setUssdStep('idle');

    const apt = createAppointment({
      salonId: salon.id,
      serviceId: selectedService.id,
      staffId: selectedStaffId,
      date: selectedDate,
      startTime: selectedSlot,
      clientName: `${clientFirstName.trim()} ${clientLastName.trim()}`.trim() || 'Client Kuzuri',
      clientPhone,
      clientEmail,
      paymentMethod,
      paymentOption,
      notes: clientNotes
    });

    setConfirmedAppointment(apt);
    setStep(6);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleConfirmUssdPin = (e: React.FormEvent) => {
    e.preventDefault();
    setUssdStep('success');
    setTimeout(() => {
      executeBookingCreation();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              {step < 6 ? `${step}/5` : '✓'}
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 line-clamp-1">{salon.name}</h3>
              <p className="text-[11px] text-stone-500">
                {step === 1 && '1. Choisissez votre prestation'}
                {step === 2 && '2. Choisissez votre professionnel'}
                {step === 3 && '3. Choisissez la date & l’heure'}
                {step === 4 && '4. Vos coordonnées de réservation'}
                {step === 5 && '5. Mode de paiement / Acompte'}
                {step === 6 && '🎉 Réservation confirmée !'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with dynamic steps */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: SELECT SERVICE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="font-extrabold text-lg text-stone-950">Sélectionnez la prestation</h4>
                <p className="text-xs text-stone-500">Cliquez sur le service souhaité pour continuer</p>
              </div>

              <div className="space-y-3">
                {salonServices.map(srv => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      selectedServiceId === srv.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{srv.name}</span>
                        {srv.popular && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Top
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-1">{srv.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{srv.durationMinutes} minutes</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-black text-stone-900 block">
                        {formatCurrency(srv.price, currentCurrency)}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ml-auto mt-2 ${
                        selectedServiceId === srv.id ? 'bg-amber-500 border-amber-500 text-white' : 'border-stone-300'
                      }`}>
                        {selectedServiceId === srv.id && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT STAFF */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="font-extrabold text-lg text-stone-950">Choisissez votre coiffeur / spécialiste</h4>
                <p className="text-xs text-stone-500">Ou choisissez le premier disponible pour plus de flexibilité</p>
              </div>

              {/* Option "Any available" */}
              <div
                onClick={() => setSelectedStaffId('any')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedStaffId === 'any'
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center font-bold text-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-stone-900">Premier professionnel disponible</h5>
                    <p className="text-xs text-stone-500">Permet d’avoir le maximum de choix de créneaux</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedStaffId === 'any' ? 'bg-amber-500 border-amber-500 text-white' : 'border-stone-300'
                }`}>
                  {selectedStaffId === 'any' && <Check className="w-3 h-3" />}
                </div>
              </div>

              {/* Specific staff cards */}
              <div className="space-y-3 pt-2">
                {salonStaff.map(member => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedStaffId(member.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedStaffId === member.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-stone-900">{member.name}</h5>
                          <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {member.rating.toFixed(1)}
                          </div>
                        </div>
                        <p className="text-xs text-stone-500">{member.role}</p>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedStaffId === member.id ? 'bg-amber-500 border-amber-500 text-white' : 'border-stone-300'
                    }`}>
                      {selectedStaffId === member.id && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME SLOTS */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h4 className="font-extrabold text-lg text-stone-950">Sélectionnez la date et l’heure</h4>
                <p className="text-xs text-stone-500">Créneaux vérifiés en temps réel sans risque de double réservation</p>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Date du rendez-vous
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot('');
                  }}
                  className="w-full p-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-semibold outline-none cursor-pointer bg-stone-50"
                />
                <p className="text-[11px] text-stone-500 mt-1 capitalize font-medium">
                  📅 {formatDateFrench(selectedDate)}
                </p>
              </div>

              {/* Slots Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Heure de passage ({availableSlots.length} créneau{availableSlots.length > 1 ? 'x' : ''} disponible{availableSlots.length > 1 ? 's' : ''})
                </label>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          selectedSlot === slot
                            ? 'bg-amber-500 border-amber-600 text-white shadow-md shadow-amber-500/20 scale-105'
                            : 'bg-stone-50 hover:bg-white border-stone-200 text-stone-800 hover:border-amber-400'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                    <p className="text-xs font-bold text-amber-900">Aucun créneau disponible pour cette date</p>
                    <p className="text-[11px] text-amber-700 mt-1">Le salon est peut-être fermé ou complet ce jour-là. Essayez un autre jour.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: CLIENT CONTACT INFO */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="font-extrabold text-lg text-stone-950">Vos coordonnées</h4>
                <p className="text-xs text-stone-500">Pas besoin de mot de passe. Le SMS et WhatsApp de confirmation seront envoyés à ce numéro.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                    placeholder="Ex: Yannick"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 text-xs sm:text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nom de famille *</label>
                  <input
                    type="text"
                    required
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                    placeholder="Ex: Moukala"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 text-xs sm:text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Numéro de Téléphone (Mobile Money & WhatsApp) *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-stone-500">
                    {COUNTRIES.find(c => c.code === currentCountry)?.phonePrefix || '+242'}
                  </span>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="06 123 45 67"
                    className="w-full pl-16 pr-3 py-2.5 rounded-xl border border-stone-300 focus:border-amber-500 text-xs sm:text-sm font-semibold outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-1">Numéro utilisé pour la validation Mobile Money et la confirmation</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email (facultatif)</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="votre.email@exemple.cg"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Note pour le coiffeur (facultatif)</label>
                <textarea
                  rows={2}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Ex: Coupe très courte, cuir chevelu sensible..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-amber-500 text-xs outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: PAYMENT & DEPOSIT SELECTION */}
          {step === 5 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h4 className="font-extrabold text-lg text-stone-950">Option de paiement & Acompte</h4>
                <p className="text-xs text-stone-500">Sécurisez votre rendez-vous et évitez les files d’attente</p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Prestation :</span>
                  <span className="font-bold text-stone-900">{selectedService.name}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Date & Heure :</span>
                  <span className="font-bold text-stone-900">{selectedDate} à {selectedSlot}</span>
                </div>
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Coiffeur :</span>
                  <span className="font-bold text-stone-900">{selectedStaffMember ? selectedStaffMember.name : 'Premier disponible'}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                  <span>Total prestation :</span>
                  <span className="text-amber-600 font-black">{formatCurrency(servicePrice, currentCurrency)}</span>
                </div>
              </div>

              {/* Deposit option selector */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Combien souhaitez-vous régler maintenant ?
                </label>

                {/* Option 1: Acompte (recommended) */}
                <div
                  onClick={() => setPaymentOption('deposit')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentOption === 'deposit'
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">
                        Payer un acompte ({depositPercent}%)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Recommandé
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Payez {formatCurrency(depositAmount, currentCurrency)} maintenant et le solde ({formatCurrency(servicePrice - depositAmount, currentCurrency)}) au salon.
                    </p>
                  </div>
                  <span className="font-black text-sm text-stone-900">
                    {formatCurrency(depositAmount, currentCurrency)}
                  </span>
                </div>

                {/* Option 2: Pay full */}
                <div
                  onClick={() => setPaymentOption('now')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentOption === 'now'
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                      Payer la totalité maintenant
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Rien à régler sur place, arrivée directe au salon.
                    </p>
                  </div>
                  <span className="font-black text-sm text-stone-900">
                    {formatCurrency(servicePrice, currentCurrency)}
                  </span>
                </div>

                {/* Option 3: Pay on site */}
                <div
                  onClick={() => setPaymentOption('on_site')}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentOption === 'on_site'
                      ? 'border-amber-500 bg-amber-50/50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                      Payer sur place au salon
                    </span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Paiement en espèces ou Mobile Money lors de votre rendez-vous.
                    </p>
                  </div>
                  <span className="font-bold text-xs text-stone-500">
                    0 FCFA maintenant
                  </span>
                </div>
              </div>

              {/* Payment Method Selector if paying now/deposit */}
              {paymentOption !== 'on_site' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Moyen de paiement Mobile Money
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mtn_momo')}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                        paymentMethod === 'mtn_momo'
                          ? 'border-amber-500 bg-amber-100 text-amber-950 ring-1 ring-amber-500'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                      <span>MTN Mobile Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('airtel_money')}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                        paymentMethod === 'airtel_money'
                          ? 'border-red-500 bg-red-100 text-red-950 ring-1 ring-red-500'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                      <span>Airtel Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('orange_money')}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                        paymentMethod === 'orange_money'
                          ? 'border-orange-500 bg-orange-100 text-orange-950 ring-1 ring-orange-500'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                      <span>Orange Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-100 text-blue-950 ring-1 ring-blue-500'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      <span>Carte Visa / Mastercard</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* STEP 6: CONFIRMATION & SUCCESS SCREEN */}
          {step === 6 && confirmedAppointment && (
            <div className="space-y-6 text-center py-2 animate-in zoom-in-95">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-stone-950">
                  Votre rendez-vous est confirmé !
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Un SMS de confirmation a été envoyé au <span className="font-bold text-stone-800">{confirmedAppointment.clientPhone}</span>
                </p>
              </div>

              {/* Reference & QR Box */}
              <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Numéro de réservation</span>
                    <p className="text-lg font-black text-amber-950">{confirmedAppointment.referenceNumber}</p>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-xs border border-amber-200 flex items-center justify-center">
                    <QrCode className="w-full h-full text-stone-900" />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Établissement :</span>
                    <span className="font-bold text-stone-900">{confirmedAppointment.salonName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Prestation :</span>
                    <span className="font-bold text-stone-900">{confirmedAppointment.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Date & Heure :</span>
                    <span className="font-bold text-stone-900">{confirmedAppointment.date} à {confirmedAppointment.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Professionnel :</span>
                    <span className="font-bold text-stone-900">{confirmedAppointment.staffName}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-200 font-bold">
                    <span>Statut paiement :</span>
                    <span className="text-emerald-700">
                      {confirmedAppointment.paymentStatus === 'partial_deposit' 
                        ? `Acompte réglé (${formatCurrency(confirmedAppointment.paidAmount, confirmedAppointment.currency)})` 
                        : 'Paiement sur place'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={buildWhatsAppLink(salon.whatsapp, confirmedAppointment)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Envoyer rappel sur WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    if (onBookingComplete) onBookingComplete();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
                >
                  Terminer & Voir mes RDV
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer Navigation */}
        {step < 6 && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl border border-stone-300 hover:bg-white text-xs font-bold text-stone-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              {step === 1 && (
                <button
                  type="button"
                  disabled={!selectedServiceId}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <span>Continuer</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <span>Continuer vers l’horaire</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <span>Valider l’heure ({selectedSlot || 'Choisir'})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  disabled={!clientFirstName.trim() || !clientPhone.trim()}
                  onClick={() => setStep(5)}
                  className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <span>Continuer vers le paiement</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 5 && (
                <button
                  type="button"
                  onClick={handleFinalizeBooking}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-xs font-black shadow-md shadow-amber-500/30 transition-all active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Confirmer la réservation</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Interactive Mobile Money USSD Dialog Simulation */}
      {isProcessingPayment && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-stone-900 text-white rounded-3xl border border-stone-700 p-6 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                  Passerelle Mobile Money
                </span>
              </div>
              <span className="text-xs text-stone-400">{paymentMethod.toUpperCase()}</span>
            </div>

            {ussdStep === 'prompt' && (
              <div className="py-6 text-center space-y-3">
                <Smartphone className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
                <h5 className="font-bold text-sm">Envoi de la requête USSD vers votre mobile...</h5>
                <p className="text-xs text-stone-400">
                  Numéro : <span className="text-white font-mono">{clientPhone}</span>
                </p>
                <p className="text-xs text-amber-300 font-bold">
                  Montant à débiter : {formatCurrency(amountToPayNow, currentCurrency)}
                </p>
              </div>
            )}

            {ussdStep === 'pin' && (
              <form onSubmit={handleConfirmUssdPin} className="py-4 space-y-4">
                <div className="text-center">
                  <p className="text-xs text-stone-300">
                    Veuillez entrer votre code secret Mobile Money pour autoriser le paiement de{' '}
                    <strong className="text-amber-400">{formatCurrency(amountToPayNow, currentCurrency)}</strong>
                  </p>
                </div>

                <div>
                  <input
                    type="password"
                    maxLength={5}
                    autoFocus
                    required
                    value={momoPin}
                    onChange={(e) => setMomoPin(e.target.value)}
                    placeholder="••••"
                    className="w-full text-center tracking-[1em] text-2xl font-black py-3 rounded-xl bg-stone-800 border border-stone-600 focus:border-amber-400 text-white outline-none"
                  />
                  <p className="text-[10px] text-stone-400 text-center mt-1">Simulation sécurisée bac à sable</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 font-bold text-stone-950 text-xs transition-colors"
                >
                  Valider le paiement
                </button>
              </form>
            )}

            {ussdStep === 'success' && (
              <div className="py-6 text-center space-y-2">
                <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                <h5 className="font-bold text-sm text-emerald-300">Paiement Mobile Money Confirmé !</h5>
                <p className="text-xs text-stone-400">Génération de votre ticket de réservation...</p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
