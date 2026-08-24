import { CurrencyCode, Appointment, Salon, Service, StaffMember } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode = 'XAF'): string {
  const formattedNumber = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(amount);

  return `${formattedNumber} FCFA`;
}

export function formatDateFrench(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getDayNameFrench(dayIndex: number): string {
  const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  return days[dayIndex % 7];
}

/**
 * Generate real-time available time slots for a specific date, service, and staff member
 * Accurately handles:
 * - Salon opening/closing hours
 * - Staff active work days & shift hours
 * - Staff lunch breaks
 * - Existing overlapping appointments
 * - Duration of the service
 */
export function calculateAvailableSlots({
  date,
  salon,
  service,
  staff,
  allAppointments
}: {
  date: string; // YYYY-MM-DD
  salon: Salon;
  service: Service;
  staff?: StaffMember;
  allAppointments: Appointment[];
}): string[] {
  const selectedDate = new Date(date);
  const dayIndex = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayKey = getDayNameFrench(dayIndex);

  const salonHours = salon.openingHours[dayKey];
  if (!salonHours || salonHours.closed) {
    return [];
  }

  // Determine starting and ending hours
  let startMinute = parseTimeToMinutes(salonHours.open);
  let endMinute = parseTimeToMinutes(salonHours.close);

  if (staff) {
    if (!staff.workingDays.includes(dayIndex) || !staff.isAvailable) {
      return [];
    }
    startMinute = Math.max(startMinute, parseTimeToMinutes(staff.startHour));
    endMinute = Math.min(endMinute, parseTimeToMinutes(staff.endHour));
  }

  const duration = service.durationMinutes;
  const interval = 30; // 30 min step
  const slots: string[] = [];

  // Filter existing active appointments on that date for this salon/staff
  const activeBookings = allAppointments.filter(apt => 
    apt.date === date && 
    apt.status !== 'cancelled' && 
    (staff ? apt.staffId === staff.id : apt.salonId === salon.id)
  );

  for (let current = startMinute; current + duration <= endMinute; current += interval) {
    const slotEnd = current + duration;

    // Check staff break
    if (staff && staff.breakStart && staff.breakEnd) {
      const breakStartMin = parseTimeToMinutes(staff.breakStart);
      const breakEndMin = parseTimeToMinutes(staff.breakEnd);
      if ((current >= breakStartMin && current < breakEndMin) || 
          (slotEnd > breakStartMin && slotEnd <= breakEndMin) ||
          (current <= breakStartMin && slotEnd >= breakEndMin)) {
        continue; // overlaps break
      }
    }

    // Check if slot collides with any existing booking
    const hasCollision = activeBookings.some(apt => {
      const aptStart = parseTimeToMinutes(apt.startTime);
      const aptEnd = parseTimeToMinutes(apt.endTime);
      return (current < aptEnd && slotEnd > aptStart);
    });

    if (!hasCollision) {
      slots.push(formatMinutesToTime(current));
    }
  }

  return slots;
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const total = parseTimeToMinutes(timeStr) + minutesToAdd;
  return formatMinutesToTime(total);
}

/**
 * Builds direct WhatsApp booking link with prefilled professional text
 */
export function buildWhatsAppLink(salonPhoneClean: string, appointment?: Appointment): string {
  let message = "Bonjour ! Je vous contacte via la plateforme Kuzuri pour prendre rendez-vous.";
  
  if (appointment) {
    message = `Bonjour ${appointment.salonName} ! 👋
Je viens de réserver sur Kuzuri.
📌 *Réf:* ${appointment.referenceNumber}
💇 *Prestation:* ${appointment.serviceName}
👤 *Professionnel:* ${appointment.staffName}
📅 *Date:* ${formatDateFrench(appointment.date)} à ${appointment.startTime}
💰 *Total:* ${formatCurrency(appointment.totalPrice, appointment.currency)}
💳 *Statut:* ${appointment.paymentStatus === 'partial_deposit' ? `Acompte payé (${formatCurrency(appointment.paidAmount, appointment.currency)})` : 'Paiement sur place'}
Client: ${appointment.clientName} (${appointment.clientPhone})
Merci de me confirmer la bonne prise en compte !`;
  }

  const encoded = encodeURIComponent(message);
  // Ensure digits only
  const cleanNumber = salonPhoneClean.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

export function buildSmsText(appointment: Appointment): string {
  return `Kuzuri: Votre RDV chez ${appointment.salonName} (${appointment.serviceName}) est confirmé pour le ${appointment.date} à ${appointment.startTime}. Réf: ${appointment.referenceNumber}.`;
}

export const CATEGORY_LABELS: Record<string, { label: string; iconName: string; desc: string }> = {
  barber: { label: 'Barbier & Homme', iconName: 'Scissors', desc: 'Dégradés, contours, taille de barbe & soins' },
  braids_tresses: { label: 'Braids & Tresses', iconName: 'Sparkles', desc: 'Knotless, box braids, nattes & cornrows' },
  locks: { label: 'Locks & Dreadlocks', iconName: 'Crown', desc: 'Création, retwist, détox & stylings royaux' },
  women_hair: { label: 'Coiffure Femme & Wigs', iconName: 'Heart', desc: 'Lace wigs, tissages, lissages & brushings' },
  coloring_treatment: { label: 'Soins & Coloration', iconName: 'Droplet', desc: 'Bains d’huile, masques karité & teintes' },
  nails_makeup: { label: 'Ongles & Maquillage', iconName: 'Eye', desc: 'Manucure russe, pose gel, faux cils & makeup' },
  spa_skin: { label: 'Soins Visage & Spa', iconName: 'Sparkle', desc: 'Gommages, vapeur ozone & massages crâniens' },
  kids: { label: 'Enfants', iconName: 'Smile', desc: 'Coiffures douces adaptées aux plus jeunes' }
};
