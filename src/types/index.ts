export type UserRole = 'citizen' | 'officer' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa';

export interface User {
  id: string;
  name: string;
  mobile: string;
  aadhaar: string; // masked e.g. 'XXXX-XXXX-7777'
  email: string;
  role: UserRole;
  address: string;
  state: string;
  district: string;
  pincode: string;
  avatarUrl?: string;
  digiLockerLinked: boolean;
}

export type ExpiryStatus = 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';

export interface VehicleInsurance {
  provider: string;
  policyNo: string;
  validTill: string;
  status: ExpiryStatus;
}

export interface VehiclePUC {
  certificateNo: string;
  validTill: string;
  status: ExpiryStatus;
  centerCode: string;
}

export interface VehicleFitness {
  certificateNo: string;
  validTill: string;
  status: ExpiryStatus;
}

export interface VehicleTax {
  receiptNo: string;
  paidTill: string;
  status: ExpiryStatus;
}

export interface VehicleHypothecation {
  isFinanced: boolean;
  bankName?: string;
  branch?: string;
  sanctionDate?: string;
  status: 'ACTIVE' | 'TERMINATED_PENDING_APPROVAL' | 'NOC_CLEARED';
}

export interface Vehicle {
  registrationNo: string;
  chassisNo: string;
  engineNo: string;
  ownerName: string;
  ownerAadhaarMasked: string;
  vehicleClass: 'Motorcycle' | 'Motor Car / LMV' | 'Commercial / Goods' | 'Electric Vehicle' | 'Auto Rickshaw';
  vehicleType: '2W' | '4W' | 'CV' | 'EV';
  makerModel: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'CNG' | 'HYBRID';
  color: string;
  seatingCapacity: number;
  cubicCapacity?: number;
  registrationDate: string;
  rcExpiryDate: string;
  rcStatus: ExpiryStatus;
  insurance: VehicleInsurance;
  puc: VehiclePUC;
  fitness: VehicleFitness;
  tax: VehicleTax;
  hypothecation?: VehicleHypothecation;
  rtoCode: string;
  rtoName: string;
  state: string;
  isCommercial: boolean;
}

export interface DLClassEndorsement {
  classCode: 'MCWG' | 'LMV' | 'HGMV' | 'TRANS' | '3W-CAB';
  description: string;
  issueDate: string;
}

export interface DrivingLicence {
  licenceNo: string;
  holderName: string;
  holderAadhaarMasked: string;
  fatherName: string;
  dateOfBirth: string;
  bloodGroup: string;
  issueDate: string;
  validTillNonTransport: string;
  validTillTransport?: string;
  status: ExpiryStatus;
  authorizedClasses: DLClassEndorsement[];
  rtoCode: string;
  rtoName: string;
  state: string;
  address: string;
  hasIDP?: boolean;
  idpValidTill?: string;
}

export type ApplicationStageCode =
  | 'SUBMITTED'
  | 'PAYMENT_COMPLETED'
  | 'SCRUTINY'
  | 'INSPECTION_OR_TEST'
  | 'APPROVED'
  | 'REJECTED'
  | 'CLARIFICATION_REQUIRED';

export interface ApplicationStage {
  stageKey: ApplicationStageCode;
  stageName: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'pending' | 'rejected' | 'action_needed';
  remarks?: string;
  officerName?: string;
}

export interface UploadedDoc {
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  remarks?: string;
}

export interface FeeItemization {
  applicationFee: number;
  userCharges: number;
  roadTax: number;
  postalSmartcardFee: number;
  penaltyFee?: number;
  total: number;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  transactionId?: string;
  paymentDate?: string;
  paymentMode?: 'UPI' | 'NET_BANKING' | 'DEBIT_CREDIT_CARD';
  receiptNo?: string;
}

export interface Application {
  id: string;
  applicationNo: string;
  serviceType: string;
  serviceCategory: 'vehicle' | 'dl' | 'permit' | 'public';
  applicantName: string;
  applicantMobile: string;
  applicantAadhaarMasked: string;
  vehicleNo?: string;
  licenceNo?: string;
  rtoCode: string;
  rtoName: string;
  state: string;
  submittedDate: string;
  lastUpdated: string;
  currentStage: ApplicationStageCode;
  stages: ApplicationStage[];
  documents: UploadedDoc[];
  feeDetails: FeeItemization;
  appointment?: {
    appointmentNo: string;
    date: string;
    timeSlot: string;
    rtoCode: string;
    rtoName: string;
    address: string;
  };
  detailsPayload?: Record<string, any>;
  officerRemarks?: string;
  estimatedCompletionDate: string;
}

export interface Challan {
  challanNo: string;
  vehicleNo: string;
  ownerName: string;
  date: string;
  time: string;
  location: string;
  violationType: string;
  section: string;
  fineAmount: number;
  status: 'PENDING' | 'PAID' | 'DISPUTED';
  evidenceUrl: string;
  trafficPoliceJurisdiction: string;
  paymentDetails?: {
    transactionId: string;
    paidAt: string;
    receiptNo: string;
    paymentMode: string;
  };
}

export interface AppointmentSlot {
  id: string;
  bookingNo: string;
  serviceName: string;
  applicantName: string;
  applicantMobile: string;
  identifier: string; // Vehicle or DL number
  rtoCode: string;
  rtoName: string;
  date: string;
  timeSlot: string;
  status: 'CONFIRMED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED';
  qrCodeUrl: string;
  address: string;
}

export interface DocumentVaultItem {
  id: string;
  title: string;
  documentType: 'RC_SMARTCARD' | 'DRIVING_LICENCE' | 'PUC_CERTIFICATE' | 'INSURANCE_POLICY' | 'FITNESS_CERT' | 'TAX_RECEIPT' | 'NOC' | 'FORM_29_30';
  documentNumber: string;
  linkedIdentifier: string; // Vehicle or DL No
  issueDate: string;
  validTill: string;
  issuer: string;
  isDigiLockerVerified: boolean;
  fileSize: string;
  fileFormat: 'PDF' | 'DIGITAL_CARD';
  payload?: any;
}

export interface GrievanceTicket {
  id: string;
  tokenNo: string;
  citizenName: string;
  citizenMobile: string;
  email: string;
  category: 'RC_DELAY' | 'DL_TEST_ISSUE' | 'PAYMENT_REFUND' | 'OFFICER_CONDUCT' | 'PORTAL_TECHNICAL' | 'OTHER';
  rtoCode: string;
  rtoName: string;
  subject: string;
  description: string;
  applicationNoOrRegNo?: string;
  status: 'REGISTERED' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  slaDeadline: string;
  resolutionDate?: string;
  resolutionNotes?: string;
}

export interface RTOOffice {
  code: string;
  name: string;
  district: string;
  state: string;
  stateCode: string;
  address: string;
  pincode: string;
  workingHours: string;
  phone: string;
  email: string;
  rtoOfficerName: string;
  counterTimings: string;
  mapCoordinates: {
    lat: number;
    lng: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'EXPIRY' | 'APPLICATION_UPDATE' | 'PAYMENT' | 'APPOINTMENT' | 'ALERT';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface LearnerMockQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  image?: string;
  category: 'ROAD_SIGNS' | 'TRAFFIC_RULES' | 'SAFETY_REGULATIONS';
}

export interface FormDraft {
  serviceId: string;
  lastUpdated: string;
  step: number;
  formData: Record<string, any>;
}
