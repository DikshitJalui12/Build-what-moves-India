import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  LanguageCode,
  Vehicle,
  DrivingLicence,
  Application,
  Challan,
  AppointmentSlot,
  DocumentVaultItem,
  GrievanceTicket,
  RTOOffice,
  NotificationItem,
  ApplicationStageCode,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_VEHICLES,
  INITIAL_DRIVING_LICENCE,
  INITIAL_APPLICATIONS,
  INITIAL_CHALLANS,
  INITIAL_APPOINTMENTS,
  INITIAL_VAULT_DOCS,
  INITIAL_NOTIFICATIONS,
  INITIAL_GRIEVANCES,
  RTO_OFFICES,
} from '../data/mockData';
import { TRANSLATIONS, TranslationDictionary } from '../i18n/translations';
import { speakText, safeLoadFromStorage } from '../utils/helpers';

interface PaymentModalState {
  isOpen: boolean;
  serviceTitle: string;
  applicationNo?: string;
  fees: {
    baseFee: number;
    userCharges: number;
    roadTax: number;
    postalFee: number;
    total: number;
  };
  onSuccess: (receipt: any) => void;
}

interface AppointmentModalState {
  isOpen: boolean;
  serviceName: string;
  identifier: string;
  rtoCode?: string;
  onSuccess?: (slot: AppointmentSlot) => void;
}

interface AppContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeLang: LanguageCode;
  setActiveLang: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  cycleFontSize: () => void;
  speechEnabled: boolean;
  toggleSpeechEnabled: () => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  activeServiceWizard: string | null;
  setActiveServiceWizard: (wizard: string | null) => void;
  
  // Data entities
  vehicles: Vehicle[];
  drivingLicence: DrivingLicence | null;
  applications: Application[];
  challans: Challan[];
  appointments: AppointmentSlot[];
  vaultDocs: DocumentVaultItem[];
  notifications: NotificationItem[];
  grievances: GrievanceTicket[];
  rtoOffices: RTOOffice[];
  
  // Actions
  loginUser: (role?: UserRole) => void;
  logoutUser: () => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (regNo: string, updates: Partial<Vehicle>) => void;
  addApplication: (app: Application) => void;
  updateApplicationStage: (appId: string, stageKey: ApplicationStageCode, remarks?: string, officerName?: string) => void;
  payChallan: (challanNo: string, paymentDetails: any) => void;
  addAppointment: (apt: AppointmentSlot) => void;
  cancelAppointment: (aptId: string) => void;
  rescheduleAppointment: (aptId: string, newDate: string, newSlot: string) => void;
  addGrievance: (ticket: GrievanceTicket) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Form Drafts
  saveFormDraft: (serviceKey: string, step: number, data: any) => void;
  getFormDraft: (serviceKey: string) => { step: number; data: any } | null;
  clearFormDraft: (serviceKey: string) => void;
  
  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isSaathiModalOpen: boolean;
  setIsSaathiModalOpen: (open: boolean) => void;
  paymentModal: PaymentModalState;
  openPaymentModal: (serviceTitle: string, fees: PaymentModalState['fees'], onSuccess: (receipt: any) => void, appNo?: string) => void;
  closePaymentModal: () => void;
  appointmentModal: AppointmentModalState;
  openAppointmentModal: (serviceName: string, identifier: string, rtoCode?: string, onSuccess?: (slot: AppointmentSlot) => void) => void;
  closeAppointmentModal: () => void;
  receiptModalData: any | null;
  openReceiptModal: (receipt: any) => void;
  closeReceiptModal: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial persistent state safely
  const [user, setUser] = useState<User | null>(() => safeLoadFromStorage<User | null>('pn_user', INITIAL_USER));

  const [role, setRoleState] = useState<UserRole>('citizen');
  const [activeLang, setActiveLangState] = useState<LanguageCode>(() => safeLoadFromStorage<LanguageCode>('pn_lang', 'en'));
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(false);
  const [activeNavTab, setActiveNavTab] = useState<string>('home');
  const [activeServiceWizard, setActiveServiceWizard] = useState<string | null>(null);

  // Entities
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => safeLoadFromStorage<Vehicle[]>('pn_vehicles', INITIAL_VEHICLES));

  const [drivingLicence] = useState<DrivingLicence | null>(() => safeLoadFromStorage<DrivingLicence | null>('pn_dl', INITIAL_DRIVING_LICENCE));

  const [applications, setApplications] = useState<Application[]>(() => safeLoadFromStorage<Application[]>('pn_applications', INITIAL_APPLICATIONS));

  const [challans, setChallans] = useState<Challan[]>(() => safeLoadFromStorage<Challan[]>('pn_challans', INITIAL_CHALLANS));

  const [appointments, setAppointments] = useState<AppointmentSlot[]>(() => safeLoadFromStorage<AppointmentSlot[]>('pn_appointments', INITIAL_APPOINTMENTS));

  const [vaultDocs, setVaultDocs] = useState<DocumentVaultItem[]>(() => safeLoadFromStorage<DocumentVaultItem[]>('pn_vault', INITIAL_VAULT_DOCS));

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => safeLoadFromStorage<NotificationItem[]>('pn_notifs', INITIAL_NOTIFICATIONS));

  const [grievances, setGrievances] = useState<GrievanceTicket[]>(() => safeLoadFromStorage<GrievanceTicket[]>('pn_grievances', INITIAL_GRIEVANCES));

  const [rtoOffices] = useState<RTOOffice[]>(RTO_OFFICES);

  // Form drafts cache
  const [drafts, setDrafts] = useState<Record<string, { step: number; data: any }>>(() => safeLoadFromStorage<Record<string, { step: number; data: any }>>('pn_drafts', {}));

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaathiModalOpen, setIsSaathiModalOpen] = useState(false);
  const [receiptModalData, setReceiptModalData] = useState<any | null>(null);

  const [paymentModal, setPaymentModal] = useState<PaymentModalState>({
    isOpen: false,
    serviceTitle: '',
    fees: { baseFee: 0, userCharges: 0, roadTax: 0, postalFee: 0, total: 0 },
    onSuccess: () => {},
  });

  const [appointmentModal, setAppointmentModal] = useState<AppointmentModalState>({
    isOpen: false,
    serviceName: '',
    identifier: '',
  });

  // Save changes to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('pn_user', JSON.stringify(user));
    else localStorage.removeItem('pn_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pn_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('pn_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('pn_challans', JSON.stringify(challans));
  }, [challans]);

  useEffect(() => {
    localStorage.setItem('pn_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('pn_vault', JSON.stringify(vaultDocs));
  }, [vaultDocs]);

  useEffect(() => {
    localStorage.setItem('pn_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pn_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('pn_drafts', JSON.stringify(drafts));
  }, [drafts]);

  // Accessibility class sync
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    document.body.classList.remove('font-scale-lg', 'font-scale-xl');
    if (fontSize === 'large') document.body.classList.add('font-scale-lg');
    if (fontSize === 'xlarge') document.body.classList.add('font-scale-xl');
  }, [fontSize]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'officer' || newRole === 'admin') {
      setActiveNavTab('officer');
    } else {
      setActiveNavTab('home');
    }
    if (speechEnabled) {
      speakText(`Switched mode to ${newRole === 'officer' ? 'RTO Scrutiny Officer' : newRole === 'admin' ? 'Administrator' : 'Citizen Dashboard'}`);
    }
  };

  const setActiveLang = (lang: LanguageCode) => {
    setActiveLangState(lang);
    localStorage.setItem('pn_lang', lang);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      if (speechEnabled) speakText(next ? 'High Contrast Mode Enabled' : 'Normal Display Restored');
      return next;
    });
  };

  const cycleFontSize = () => {
    setFontSize((curr) => {
      if (curr === 'normal') return 'large';
      if (curr === 'large') return 'xlarge';
      return 'normal';
    });
  };

  const toggleSpeechEnabled = () => {
    setSpeechEnabled((prev) => {
      const next = !prev;
      if (next) speakText('Parivahan Voice Assistant and Screen Reader Activated');
      return next;
    });
  };

  const loginUser = (userRole: UserRole = 'citizen') => {
    setUser({
      ...INITIAL_USER,
      role: userRole,
    });
    setRole(userRole);
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setUser(null);
    setActiveNavTab('public');
  };

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => [vehicle, ...prev]);
    // Also create Document Vault entry
    const newDoc: DocumentVaultItem = {
      id: `DOC-${Date.now()}`,
      title: `Registration Certificate (${vehicle.registrationNo})`,
      documentType: 'RC_SMARTCARD',
      documentNumber: vehicle.registrationNo,
      linkedIdentifier: `${vehicle.registrationNo} (${vehicle.makerModel})`,
      issueDate: vehicle.registrationDate,
      validTill: vehicle.rcExpiryDate,
      issuer: vehicle.rtoName,
      isDigiLockerVerified: true,
      fileSize: '1.2 MB',
      fileFormat: 'DIGITAL_CARD',
    };
    setVaultDocs((prev) => [newDoc, ...prev]);
  };

  const updateVehicle = (regNo: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) => (v.registrationNo === regNo ? { ...v, ...updates } : v))
    );
  };

  const addApplication = (app: Application) => {
    setApplications((prev) => [app, ...prev]);
    // Also add in-app notification
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Application Submitted: ${app.serviceType}`,
      message: `Your application (${app.applicationNo}) for ${app.serviceType} has been successfully submitted and forwarded to ${app.rtoName}.`,
      type: 'APPLICATION_UPDATE',
      timestamp: 'Just now',
      read: false,
      actionUrl: 'tracker',
      actionLabel: 'Track Status',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateApplicationStage = (
    appId: string,
    stageKey: ApplicationStageCode,
    remarks?: string,
    officerName?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const updatedStages = app.stages.map((st) => {
          if (st.stageKey === stageKey) {
            return {
              ...st,
              status: 'completed' as const,
              timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              remarks: remarks || st.remarks,
              officerName: officerName || st.officerName,
            };
          }
          return st;
        });

        // Set next stage
        const nextStageKey =
          stageKey === 'SCRUTINY'
            ? 'APPROVED'
            : stageKey === 'PAYMENT_COMPLETED'
            ? 'SCRUTINY'
            : stageKey;

        return {
          ...app,
          currentStage: nextStageKey,
          lastUpdated: new Date().toISOString().split('T')[0],
          stages: updatedStages,
          officerRemarks: remarks || app.officerRemarks,
        };
      })
    );

    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Application Update: ${stageKey}`,
      message: `Application ${appId} progressed. Remarks: ${remarks || 'Approved by Officer'}`,
      type: 'APPLICATION_UPDATE',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const payChallan = (challanNo: string, paymentDetails: any) => {
    setChallans((prev) =>
      prev.map((ch) =>
        ch.challanNo === challanNo
          ? {
              ...ch,
              status: 'PAID',
              paymentDetails: {
                transactionId: paymentDetails.transactionId,
                paidAt: new Date().toLocaleString('en-IN'),
                receiptNo: paymentDetails.receiptNo,
                paymentMode: paymentDetails.paymentMode,
              },
            }
          : ch
      )
    );
  };

  const addAppointment = (apt: AppointmentSlot) => {
    setAppointments((prev) => [apt, ...prev]);
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `RTO Appointment Confirmed: ${apt.bookingNo}`,
      message: `Your visit at ${apt.rtoName} is confirmed for ${apt.date} (${apt.timeSlot}). Please bring your QR Pass.`,
      type: 'APPOINTMENT',
      timestamp: 'Just now',
      read: false,
      actionUrl: 'appointments',
      actionLabel: 'View QR Pass',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const cancelAppointment = (aptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'CANCELLED' } : a))
    );
  };

  const rescheduleAppointment = (aptId: string, newDate: string, newSlot: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === aptId
          ? { ...a, date: newDate, timeSlot: newSlot, status: 'RESCHEDULED' }
          : a
      )
    );
  };

  const addGrievance = (ticket: GrievanceTicket) => {
    setGrievances((prev) => [ticket, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const saveFormDraft = (serviceKey: string, step: number, data: any) => {
    setDrafts((prev) => ({
      ...prev,
      [serviceKey]: { step, data },
    }));
  };

  const getFormDraft = (serviceKey: string) => {
    return drafts[serviceKey] || null;
  };

  const clearFormDraft = (serviceKey: string) => {
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[serviceKey];
      return copy;
    });
  };

  const openPaymentModal = (
    serviceTitle: string,
    fees: PaymentModalState['fees'],
    onSuccess: (receipt: any) => void,
    applicationNo?: string
  ) => {
    setPaymentModal({
      isOpen: true,
      serviceTitle,
      applicationNo,
      fees,
      onSuccess,
    });
  };

  const closePaymentModal = () => {
    setPaymentModal((prev) => ({ ...prev, isOpen: false }));
  };

  const openAppointmentModal = (
    serviceName: string,
    identifier: string,
    rtoCode?: string,
    onSuccess?: (slot: AppointmentSlot) => void
  ) => {
    setAppointmentModal({
      isOpen: true,
      serviceName,
      identifier,
      rtoCode,
      onSuccess,
    });
  };

  const closeAppointmentModal = () => {
    setAppointmentModal((prev) => ({ ...prev, isOpen: false }));
  };

  const openReceiptModal = (receipt: any) => {
    setReceiptModalData(receipt);
  };

  const closeReceiptModal = () => {
    setReceiptModalData(null);
  };

  const resetDemoData = () => {
    try {
      localStorage.clear();
    } catch {}
    setUser(INITIAL_USER);
    setVehicles(INITIAL_VEHICLES);
    setApplications(INITIAL_APPLICATIONS);
    setChallans(INITIAL_CHALLANS);
    setAppointments(INITIAL_APPOINTMENTS);
    setVaultDocs(INITIAL_VAULT_DOCS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setGrievances(INITIAL_GRIEVANCES);
    setDrafts({});
    setActiveServiceWizard(null);
    setActiveNavTab('home');
  };

  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        setRole,
        activeLang,
        setActiveLang,
        t,
        highContrast,
        toggleHighContrast,
        fontSize,
        cycleFontSize,
        speechEnabled,
        toggleSpeechEnabled,
        activeNavTab,
        setActiveNavTab,
        activeServiceWizard,
        setActiveServiceWizard,
        vehicles,
        drivingLicence,
        applications,
        challans,
        appointments,
        vaultDocs,
        notifications,
        grievances,
        rtoOffices,
        loginUser,
        logoutUser,
        addVehicle,
        updateVehicle,
        addApplication,
        updateApplicationStage,
        payChallan,
        addAppointment,
        cancelAppointment,
        rescheduleAppointment,
        addGrievance,
        markNotificationRead,
        markAllNotificationsRead,
        saveFormDraft,
        getFormDraft,
        clearFormDraft,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSaathiModalOpen,
        setIsSaathiModalOpen,
        paymentModal,
        openPaymentModal,
        closePaymentModal,
        appointmentModal,
        openAppointmentModal,
        closeAppointmentModal,
        receiptModalData,
        openReceiptModal,
        closeReceiptModal,
        resetDemoData,
      }}
    >
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
