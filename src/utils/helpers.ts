import { ExpiryStatus } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const getStatusBadgeColor = (status: ExpiryStatus) => {
  switch (status) {
    case 'VALID':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
        text: 'Valid',
      };
    case 'EXPIRING_SOON':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        dot: 'bg-amber-500',
        text: 'Expiring Soon',
      };
    case 'EXPIRED':
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-300',
        dot: 'bg-rose-500',
        text: 'Expired',
      };
  }
};

export const maskAadhaar = (aadhaar: string): string => {
  if (!aadhaar) return 'XXXX-XXXX-XXXX';
  const clean = aadhaar.replace(/[^0-9]/g, '');
  if (clean.length === 12) {
    return `XXXX-XXXX-${clean.slice(8)}`;
  }
  return aadhaar;
};

export const generateAppNumber = (prefix = 'PAR'): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${year}-${rand}`;
};

export const generateReceiptNumber = (): string => {
  const rand = Math.floor(1000000 + Math.random() * 9000000);
  return `MORTH-REC-2026-${rand}`;
};

export const generateTxnId = (): string => {
  return `TXN-BK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

/**
 * Text-to-speech announcer for accessibility
 */
export const speakText = (text: string, lang = 'en-IN') => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback if speech synthesis is blocked or unavailable
    }
  }
};

/**
 * Safe LocalStorage loader with error boundary fallback
 */
export const safeLoadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    return JSON.parse(saved) as T;
  } catch (err) {
    console.warn(`[Parivahan Next Storage] Failed to load key "${key}", using default`, err);
    return defaultValue;
  }
};

/**
 * Validation Helpers
 */
export const isValidAadhaar = (aadhaar: string): boolean => {
  const clean = aadhaar.replace(/[\s-]/g, '');
  return /^\d{12}$/.test(clean);
};

export const isValidMobile = (mobile: string): boolean => {
  const clean = mobile.replace(/[\s-+]/g, '').slice(-10);
  return /^[6-9]\d{9}$/.test(clean);
};

export const isValidVehicleReg = (reg: string): boolean => {
  const clean = reg.replace(/[\s-]/g, '').toUpperCase();
  return /^[A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}$/.test(clean);
};

export const sanitizeText = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
