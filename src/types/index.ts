export type CountryCode = 'CG' | 'GA' | 'CM' | 'CI' | 'BJ' | 'TG';
export type CurrencyCode = 'XAF' | 'XOF' | 'EUR' | 'USD';
export type LanguageCode = 'fr' | 'en';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  currency: CurrencyCode;
  phonePrefix: string;
  flag: string;
  cities: string[];
  mobileMoneyProviders: {
    id: string;
    name: string;
    logoColor: string;
    textColor: string;
    prefixMatch?: string[];
  }[];
}

export type ServiceCategory = 
  | 'barber'
  | 'braids_tresses'
  | 'locks'
  | 'women_hair'
  | 'coloring_treatment'
  | 'nails_makeup'
  | 'spa_skin'
  | 'kids';

export interface Service {
  id: string;
  salonId: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number; // in local currency
  durationMinutes: number;
  image?: string;
  depositRequired: boolean;
  depositPercentage?: number; // e.g. 30 for 30%
  depositFixedAmount?: number;
  popular?: boolean;
  staffIds: string[]; // staff capable of performing this
}

export interface StaffMember {
  id: string;
  salonId: string;
  name: string;
  role: string;
  avatar: string;
  specialties: string[];
  rating: number;
  reviewsCount: number;
  commissionRate: number; // percentage
  workingDays: number[]; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  startHour: string; // "09:00"
  endHour: string; // "19:00"
  breakStart?: string; // "13:00"
  breakEnd?: string; // "14:00"
  isAvailable: boolean;
}

export interface Salon {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  country: CountryCode;
  city: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp: string;
  email: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
  images: string[];
  avatar: string;
  openingHours: {
    [day: string]: { open: string; close: string; closed: boolean };
  };
  featured: boolean;
  instantBooking: boolean;
  mobileMoneyAccepted: boolean;
  depositPolicy: 'none' | 'fixed' | 'percentage' | 'full';
  defaultDepositPercent?: number;
  categories: ServiceCategory[];
  minPrice: number;
  amenities: string[]; // e.g. "Climatisation", "Wi-Fi Gratuit", "Boissons offertes", "Parking", "TV / Canal+"
  verified: boolean;
  subscriptionTier: 'starter' | 'pro' | 'premium';
}

export type AppointmentStatus = 
  | 'confirmed'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 
  | 'pending'
  | 'partial_deposit'
  | 'paid_full'
  | 'paid_on_site'
  | 'refunded'
  | 'failed';

export type PaymentMethodType = 
  | 'mtn_momo'
  | 'airtel_money'
  | 'orange_money'
  | 'moov_money'
  | 'wave'
  | 'celtiis'
  | 'tmoney'
  | 'card'
  | 'cash';

export interface Appointment {
  id: string;
  referenceNumber: string; // e.g. "AFRO-8492"
  salonId: string;
  salonName: string;
  salonAddress: string;
  salonPhone: string;
  salonWhatsapp: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:30"
  endTime: string; // "15:30"
  durationMinutes: number;
  totalPrice: number;
  currency: CurrencyCode;
  depositAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethodType;
  notes?: string;
  createdAt: string;
  cancelledAt?: string;
  ratingGiven?: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  city: string;
  country: CountryCode;
  loyaltyPoints: number;
  totalSpent: number;
  totalBookings: number;
  favoriteSalonIds: string[];
  privateNotesBySalon?: { [salonId: string]: string };
  tags?: string[]; // e.g. "VIP", "Habitué", "Cheveux sensibles"
  createdAt: string;
}

export interface Review {
  id: string;
  salonId: string;
  appointmentId?: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  serviceName: string;
  staffName?: string;
  rating: number;
  staffRating?: number;
  comment: string;
  date: string;
  photos?: string[];
  salonResponse?: {
    text: string;
    date: string;
  };
}

export interface Product {
  id: string;
  salonId: string;
  name: string;
  category: string; // "Huiles & Sérums", "Shampooings", "Accessoires", "Cires & Gels"
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStockAlert: number;
  image?: string;
  supplier?: string;
}

export interface Promotion {
  id: string;
  salonId: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // 20 for 20% or 1000 for 1000 FCFA
  code?: string;
  applicableServices: string[]; // 'all' or specific service IDs
  validFrom: string;
  validTo: string;
  happyHourStart?: string; // "10:00"
  happyHourEnd?: string; // "14:00"
  happyHourDays?: number[];
  isActive: boolean;
}

export interface LoyaltyRule {
  salonId: string;
  pointsPerSpend: number; // e.g. 1 point for 100 FCFA
  rewardThreshold: number; // e.g. 500 points
  rewardDescription: string; // e.g. "-20% sur la prochaine coupe"
  rewardDiscountValue: number;
  rewardType: 'percent' | 'free_service';
}

export interface WaitlistEntry {
  id: string;
  salonId: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  desiredDate: string;
  preferredTimeRange: 'morning' | 'afternoon' | 'evening' | 'any';
  status: 'waiting' | 'notified' | 'booked' | 'expired';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'appointment_confirmed' | 'reminder' | 'review_request' | 'momo_paid' | 'waitlist_slot';
  timestamp: string;
  read: boolean;
  link?: string;
}
