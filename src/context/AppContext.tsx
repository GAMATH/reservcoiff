import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CountryCode, 
  CurrencyCode, 
  LanguageCode, 
  Salon, 
  Service, 
  StaffMember, 
  Appointment, 
  ClientProfile, 
  Review, 
  Product, 
  Promotion, 
  WaitlistEntry, 
  AppNotification,
  ServiceCategory,
  PaymentMethodType,
  AppointmentStatus,
  PaymentStatus
} from '../types';
import { 
  COUNTRIES, 
  INITIAL_SALONS, 
  INITIAL_STAFF, 
  INITIAL_SERVICES, 
  INITIAL_REVIEWS, 
  INITIAL_CLIENTS, 
  INITIAL_PRODUCTS, 
  INITIAL_PROMOTIONS, 
  INITIAL_APPOINTMENTS 
} from '../data/mockData';
import { addMinutesToTime } from '../utils/formatters';

interface AppContextType {
  // Localization & Settings
  currentCountry: CountryCode;
  setCurrentCountry: (code: CountryCode) => void;
  currentCurrency: CurrencyCode;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  isLowBandwidthMode: boolean;
  setIsLowBandwidthMode: (val: boolean) => void;
  
  // Navigation & Modes
  currentView: string; // 'marketplace' | 'salon_detail' | 'client_portal' | 'pro_space' | 'admin'
  setCurrentView: (view: string) => void;
  selectedSalonSlug: string | null;
  setSelectedSalonSlug: (slug: string | null) => void;
  activeProTab: string; // 'dashboard' | 'agenda' | 'bookings' | 'clients' | 'services' | 'staff' | 'pos' | 'inventory' | 'marketing' | 'reviews' | 'analytics' | 'settings'
  setActiveProTab: (tab: string) => void;

  // Selected Salon for Pro Mode
  activeProSalonId: string;
  setActiveProSalonId: (id: string) => void;
  proSalonId?: string;
  setProSalonId?: (id: string) => void;

  // Data collections
  salons: Salon[];
  setSalons: React.Dispatch<React.SetStateAction<Salon[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  clients: ClientProfile[];
  setClients: React.Dispatch<React.SetStateAction<ClientProfile[]>>;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  promotions: Promotion[];
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
  waitlists: WaitlistEntry[];
  notifications: AppNotification[];
  toastNotifications: AppNotification[];
  removeToastNotification: (id: string) => void;

  // Current client
  currentClient: ClientProfile;
  setCurrentClient: (client: ClientProfile) => void;
  favorites: string[];
  toggleFavorite: (salonId: string) => void;

  // Actions
  createAppointment: (bookingData: {
    salonId: string;
    serviceId: string;
    staffId: string;
    date: string;
    startTime: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    paymentMethod: PaymentMethodType;
    paymentOption: 'now' | 'deposit' | 'on_site';
    notes?: string;
  }) => Appointment;

  updateAppointmentStatus: (aptId: string, status: AppointmentStatus, paymentStatus?: PaymentStatus) => void;
  cancelAppointment: (aptId: string, reason?: string) => void;
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
  replyToReview: (reviewId: string, responseText: string) => void;
  
  // Pro Management Actions
  addOrUpdateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
  addOrUpdateStaff: (staffMember: StaffMember) => void;
  deleteStaff: (staffId: string) => void;
  updateSalonInfo: (salonId: string, updates: Partial<Salon>) => void;
  addOrUpdateProduct: (product: Product) => void;
  updateProductStock: (productId: string, delta: number) => void;
  addOrUpdatePromotion: (promo: Promotion) => void;
  updateClientNotes: (clientId: string, salonId: string, note: string) => void;
  
  // POS & Caisse
  processPosCheckout: (data: {
    salonId: string;
    clientName: string;
    clientPhone?: string;
    serviceIds: string[];
    productIdsWithQty: { productId: string; qty: number }[];
    discountAmount: number;
    tipAmount: number;
    paymentMethod: PaymentMethodType;
  }) => { invoiceNumber: string; total: number };

  // Waitlist
  joinWaitlist: (data: Omit<WaitlistEntry, 'id' | 'status' | 'createdAt'>) => void;

  // Search & Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: ServiceCategory | 'all';
  setSelectedCategory: (cat: ServiceCategory | 'all') => void;
  useGeolocation: boolean;
  setUseGeolocation: (val: boolean) => void;

  // Notification action
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addToastNotification: (title: string, message: string, type?: AppNotification['type']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'kuzuri_app_data_v1';

const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key) || localStorage.getItem(key.replace('kuzuri_', 'afrostyle_'));
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (!parsed || (Array.isArray(fallback) && !Array.isArray(parsed))) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from local storage or fallback to seed
  const [salons, setSalons] = useState<Salon[]>(() => safeParse(`${LOCAL_STORAGE_KEY}_salons`, INITIAL_SALONS));
  const [services, setServices] = useState<Service[]>(() => safeParse(`${LOCAL_STORAGE_KEY}_services`, INITIAL_SERVICES));
  const [staff, setStaff] = useState<StaffMember[]>(() => safeParse(`${LOCAL_STORAGE_KEY}_staff`, INITIAL_STAFF));
  const [appointments, setAppointments] = useState<Appointment[]>(() => safeParse(`${LOCAL_STORAGE_KEY}_apts`, INITIAL_APPOINTMENTS));
  const [clients, setClients] = useState<ClientProfile[]>(() => safeParse(`${LOCAL_STORAGE_KEY}_clients`, INITIAL_CLIENTS));
  const [reviews, setReviews] = useState<Review[]>(() => safeParse(`${LOCAL_STORAGE_KEY}_reviews`, INITIAL_REVIEWS));
  const [products, setProducts] = useState<Product[]>(() => safeParse(`${LOCAL_STORAGE_KEY}_products`, INITIAL_PRODUCTS));
  const [promotions, setPromotions] = useState<Promotion[]>(() => safeParse(`${LOCAL_STORAGE_KEY}_promos`, INITIAL_PROMOTIONS));

  const [waitlists, setWaitlists] = useState<WaitlistEntry[]>([]);
  
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Bienvenue sur Kuzuri',
      message: 'Trouvez et réservez les meilleurs coiffeurs et barbiers avec paiement Mobile Money.',
      type: 'appointment_confirmed',
      timestamp: 'Il y a 10 min',
      read: false
    }
  ]);

  // Current Country & Currency
  const [currentCountry, setCurrentCountryState] = useState<CountryCode>('CG');
  const [language, setLanguage] = useState<LanguageCode>('fr');
  const [isLowBandwidthMode, setIsLowBandwidthMode] = useState<boolean>(false);

  // App navigation state
  const [currentView, setCurrentView] = useState<string>('marketplace');
  const [selectedSalonSlug, setSelectedSalonSlug] = useState<string | null>(null);
  const [activeProTab, setActiveProTab] = useState<string>('dashboard');
  const [activeProSalonId, setActiveProSalonId] = useState<string>('salon-1');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Brazzaville');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [useGeolocation, setUseGeolocation] = useState<boolean>(false);

  // Client Session
  const [currentClient, setCurrentClient] = useState<ClientProfile>(INITIAL_CLIENTS[0]);
  const [favorites, setFavorites] = useState<string[]>(['salon-1', 'salon-2']);

  // Sync country currency
  const countryObj = COUNTRIES.find(c => c.code === currentCountry);
  const currentCurrency = countryObj ? countryObj.currency : 'XAF';

  const setCurrentCountry = (code: CountryCode) => {
    setCurrentCountryState(code);
    const country = COUNTRIES.find(c => c.code === code);
    if (country && country.cities.length > 0) {
      setSelectedCity(country.cities[0]);
    }
  };

  // Local storage persistence effects
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_salons`, JSON.stringify(salons));
  }, [salons]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_services`, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_staff`, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_apts`, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(products));
  }, [products]);

  const addToastNotification = (title: string, message: string, type: AppNotification['type'] = 'appointment_confirmed') => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'À l’instant',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const toggleFavorite = (salonId: string) => {
    setFavorites(prev => 
      prev.includes(salonId) ? prev.filter(id => id !== salonId) : [...prev, salonId]
    );
  };

  // Create Appointment
  const createAppointment = (bookingData: {
    salonId: string;
    serviceId: string;
    staffId: string;
    date: string;
    startTime: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    paymentMethod: PaymentMethodType;
    paymentOption: 'now' | 'deposit' | 'on_site';
    notes?: string;
  }): Appointment => {
    const salon = salons.find(s => s.id === bookingData.salonId) || salons[0];
    const service = services.find(s => s.id === bookingData.serviceId) || services[0];
    
    // If "any" staff was selected, pick the first available staff for this service
    let staffMember = staff.find(st => st.id === bookingData.staffId);
    if (!staffMember) {
      staffMember = staff.find(st => st.salonId === salon.id && service.staffIds.includes(st.id)) || staff[0];
    }

    const duration = service.durationMinutes;
    const endTime = addMinutesToTime(bookingData.startTime, duration);
    const totalPrice = service.price;

    let depositAmount = 0;
    let paidAmount = 0;
    let paymentStatus: PaymentStatus = 'pending';

    if (bookingData.paymentOption === 'deposit') {
      const percent = service.depositPercentage || salon.defaultDepositPercent || 30;
      depositAmount = Math.round((totalPrice * percent) / 100);
      paidAmount = depositAmount;
      paymentStatus = 'partial_deposit';
    } else if (bookingData.paymentOption === 'now') {
      depositAmount = totalPrice;
      paidAmount = totalPrice;
      paymentStatus = 'paid_full';
    } else {
      depositAmount = 0;
      paidAmount = 0;
      paymentStatus = 'paid_on_site';
    }

    const remainingAmount = totalPrice - paidAmount;
    const refNum = `AFRO-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceNumber: refNum,
      salonId: salon.id,
      salonName: salon.name,
      salonAddress: salon.address,
      salonPhone: salon.phone,
      salonWhatsapp: salon.whatsapp,
      clientId: currentClient.id || `cli-${Date.now()}`,
      clientName: bookingData.clientName,
      clientPhone: bookingData.clientPhone,
      clientEmail: bookingData.clientEmail,
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category,
      staffId: staffMember.id,
      staffName: staffMember.name,
      staffAvatar: staffMember.avatar,
      date: bookingData.date,
      startTime: bookingData.startTime,
      endTime,
      durationMinutes: duration,
      totalPrice,
      currency: currentCurrency,
      depositAmount,
      paidAmount,
      remainingAmount,
      status: 'confirmed',
      paymentStatus,
      paymentMethod: bookingData.paymentMethod,
      notes: bookingData.notes,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Update or add to CRM client profile
    setClients(prev => {
      const existing = prev.find(c => c.phone === bookingData.clientPhone);
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          totalBookings: c.totalBookings + 1,
          totalSpent: c.totalSpent + totalPrice,
          loyaltyPoints: c.loyaltyPoints + Math.round(totalPrice / 100)
        } : c);
      } else {
        const newCli: ClientProfile = {
          id: `cli-${Date.now()}`,
          name: bookingData.clientName,
          phone: bookingData.clientPhone,
          email: bookingData.clientEmail,
          city: salon.city,
          country: salon.country,
          loyaltyPoints: Math.round(totalPrice / 100),
          totalSpent: totalPrice,
          totalBookings: 1,
          favoriteSalonIds: [salon.id],
          createdAt: new Date().toISOString()
        };
        return [newCli, ...prev];
      }
    });

    // Notify
    addToastNotification(
      'Réservation Confirmée ! 🎉',
      `Votre RDV chez ${salon.name} le ${bookingData.date} à ${bookingData.startTime} est enregistré. Réf: ${refNum}`,
      'appointment_confirmed'
    );

    return newAppointment;
  };

  const updateAppointmentStatus = (aptId: string, status: AppointmentStatus, paymentStatus?: PaymentStatus) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === aptId) {
        return {
          ...apt,
          status,
          ...(paymentStatus ? { paymentStatus } : {})
        };
      }
      return apt;
    }));
  };

  const cancelAppointment = (aptId: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === aptId) {
        return {
          ...apt,
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        };
      }
      return apt;
    }));
    addToastNotification('Rendez-vous annulé', 'Le rendez-vous a bien été annulé.', 'reminder');
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate salon average rating
    setSalons(prev => prev.map(s => {
      if (s.id === reviewData.salonId) {
        const allSalonRevs = [...reviews.filter(r => r.salonId === s.id), newRev];
        const avg = allSalonRevs.reduce((acc, r) => acc + r.rating, 0) / allSalonRevs.length;
        return {
          ...s,
          rating: Number(avg.toFixed(1)),
          reviewCount: allSalonRevs.length
        };
      }
      return s;
    }));

    addToastNotification('Avis publié ⭐', 'Merci pour votre retour d’expérience !');
  };

  const replyToReview = (reviewId: string, responseText: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          salonResponse: {
            text: responseText,
            date: new Date().toISOString().split('T')[0]
          }
        };
      }
      return r;
    }));
    addToastNotification('Réponse publiée', 'Votre réponse est maintenant visible sur la fiche du salon.');
  };

  // Pro Service Actions
  const addOrUpdateService = (service: Service) => {
    setServices(prev => {
      const exists = prev.some(s => s.id === service.id);
      if (exists) {
        return prev.map(s => s.id === service.id ? service : s);
      }
      return [...prev, { ...service, id: service.id || `srv-${Date.now()}` }];
    });
    addToastNotification('Service enregistré', `Le service "${service.name}" a été mis à jour.`);
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    addToastNotification('Service supprimé', 'Le service a été retiré.');
  };

  // Pro Staff Actions
  const addOrUpdateStaff = (staffMember: StaffMember) => {
    setStaff(prev => {
      const exists = prev.some(st => st.id === staffMember.id);
      if (exists) {
        return prev.map(st => st.id === staffMember.id ? staffMember : st);
      }
      return [...prev, { ...staffMember, id: staffMember.id || `staff-${Date.now()}` }];
    });
    addToastNotification('Membre d’équipe enregistré', `${staffMember.name} a été mis à jour.`);
  };

  const deleteStaff = (staffId: string) => {
    setStaff(prev => prev.filter(st => st.id !== staffId));
    addToastNotification('Membre retiré', 'L’employé a été supprimé de la liste.');
  };

  const updateSalonInfo = (salonId: string, updates: Partial<Salon>) => {
    setSalons(prev => prev.map(s => s.id === salonId ? { ...s, ...updates } : s));
    addToastNotification('Paramètres salon sauvegardés', 'Les informations du salon ont été mises à jour.');
  };

  // Products
  const addOrUpdateProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [...prev, { ...product, id: product.id || `prod-${Date.now()}` }];
    });
  };

  const updateProductStock = (productId: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    }));
  };

  const addOrUpdatePromotion = (promo: Promotion) => {
    setPromotions(prev => {
      const exists = prev.some(p => p.id === promo.id);
      if (exists) {
        return prev.map(p => p.id === promo.id ? promo : p);
      }
      return [...prev, { ...promo, id: promo.id || `promo-${Date.now()}` }];
    });
  };

  const updateClientNotes = (clientId: string, salonId: string, note: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          privateNotesBySalon: {
            ...(c.privateNotesBySalon || {}),
            [salonId]: note
          }
        };
      }
      return c;
    }));
  };

  // POS Checkout
  const processPosCheckout = (data: {
    salonId: string;
    clientName: string;
    clientPhone?: string;
    serviceIds: string[];
    productIdsWithQty: { productId: string; qty: number }[];
    discountAmount: number;
    tipAmount: number;
    paymentMethod: PaymentMethodType;
  }) => {
    const salon = salons.find(s => s.id === data.salonId) || salons[0];
    const selectedServices = services.filter(s => data.serviceIds.includes(s.id));
    const servicesTotal = selectedServices.reduce((sum, s) => sum + s.price, 0);

    let productsTotal = 0;
    data.productIdsWithQty.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        productsTotal += prod.sellingPrice * item.qty;
        updateProductStock(prod.id, -item.qty);
      }
    });

    const subtotal = servicesTotal + productsTotal;
    const finalTotal = Math.max(0, subtotal - data.discountAmount + data.tipAmount);
    const invoiceNum = `POS-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create completed appointment record
    const newApt: Appointment = {
      id: `apt-pos-${Date.now()}`,
      referenceNumber: invoiceNum,
      salonId: salon.id,
      salonName: salon.name,
      salonAddress: salon.address,
      salonPhone: salon.phone,
      salonWhatsapp: salon.whatsapp,
      clientId: `cli-${Date.now()}`,
      clientName: data.clientName || 'Client Caisse (Sans RDV)',
      clientPhone: data.clientPhone || '+242 06 000 00 00',
      serviceId: selectedServices[0]?.id || 'srv-pos',
      serviceName: selectedServices.map(s => s.name).join(' + ') || 'Encaissement Libre',
      serviceCategory: selectedServices[0]?.category || 'barber',
      staffId: staff.find(st => st.salonId === salon.id)?.id || 'staff-1',
      staffName: staff.find(st => st.salonId === salon.id)?.name || 'Équipe Salon',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: 30,
      totalPrice: finalTotal,
      currency: currentCurrency,
      depositAmount: finalTotal,
      paidAmount: finalTotal,
      remainingAmount: 0,
      status: 'completed',
      paymentStatus: 'paid_full',
      paymentMethod: data.paymentMethod,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newApt, ...prev]);

    addToastNotification(
      'Encaissement validé ! 🧾',
      `Facture #${invoiceNum} de ${finalTotal} FCFA enregistrée avec succès.`,
      'momo_paid'
    );

    return { invoiceNumber: invoiceNum, total: finalTotal };
  };

  // Waitlist
  const joinWaitlist = (data: Omit<WaitlistEntry, 'id' | 'status' | 'createdAt'>) => {
    const newEntry: WaitlistEntry = {
      ...data,
      id: `wait-${Date.now()}`,
      status: 'waiting',
      createdAt: new Date().toISOString()
    };
    setWaitlists(prev => [newEntry, ...prev]);
    addToastNotification(
      'Inscrit sur liste d’attente 📋',
      'Vous recevrez un SMS et message WhatsApp dès qu’un créneau se libère !'
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      currentCountry,
      setCurrentCountry,
      currentCurrency,
      language,
      setLanguage,
      isLowBandwidthMode,
      setIsLowBandwidthMode,
      currentView,
      setCurrentView,
      selectedSalonSlug,
      setSelectedSalonSlug,
      activeProTab,
      setActiveProTab,
      activeProSalonId,
      setActiveProSalonId,
      proSalonId: activeProSalonId,
      setProSalonId: setActiveProSalonId,
      salons,
      setSalons,
      services,
      setServices,
      staff,
      setStaff,
      appointments,
      setAppointments,
      clients,
      setClients,
      reviews,
      setReviews,
      products,
      setProducts,
      promotions,
      setPromotions,
      waitlists,
      notifications,
      toastNotifications: notifications,
      removeToastNotification: (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      },
      currentClient,
      setCurrentClient,
      favorites,
      toggleFavorite,
      createAppointment,
      updateAppointmentStatus,
      cancelAppointment,
      addReview,
      replyToReview,
      addOrUpdateService,
      deleteService,
      addOrUpdateStaff,
      deleteStaff,
      updateSalonInfo,
      addOrUpdateProduct,
      updateProductStock,
      addOrUpdatePromotion,
      updateClientNotes,
      processPosCheckout,
      joinWaitlist,
      searchQuery,
      setSearchQuery,
      selectedCity,
      setSelectedCity,
      selectedCategory,
      setSelectedCategory,
      useGeolocation,
      setUseGeolocation,
      markNotificationAsRead,
      clearNotifications,
      addToastNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
