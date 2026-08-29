import React, { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Fingerprint,
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck,
  Building2,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, setRole } = useApp();

  const [authMethod, setAuthMethod] = useState<'aadhaar' | 'mobile' | 'digilocker'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('9876 5432 8924');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtpValue('492810'); // Simulated OTP
    }, 600);
  };

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser(selectedRole);
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setSelectedRole(role);
    loginUser(role);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Top Header */}
        <div className="bg-linear-to-r from-blue-950 to-blue-900 text-white p-5 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-blue-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Unified Citizen & Officer Sign-In
              </h3>
              <p className="text-xs text-blue-200">
                Single Sign-On for all Indian Vehicles & Driving Licences
              </p>
            </div>
          </div>
        </div>

        {/* Demo Fast Switcher Bar */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
          <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Quick Demo 1-Click Access:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleQuickDemoLogin('citizen')}
              className="bg-white hover:bg-blue-50 text-blue-950 border border-blue-200 text-xs font-bold py-1.5 px-2 rounded-lg text-center transition cursor-pointer shadow-2xs"
            >
              Citizen Profile
            </button>
            <button
              onClick={() => handleQuickDemoLogin('officer')}
              className="bg-white hover:bg-amber-50 text-amber-950 border border-amber-200 text-xs font-bold py-1.5 px-2 rounded-lg text-center transition cursor-pointer shadow-2xs"
            >
              RTO Officer Desk
            </button>
            <button
              onClick={() => handleQuickDemoLogin('admin')}
              className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-bold py-1.5 px-2 rounded-lg text-center transition cursor-pointer shadow-2xs"
            >
              Admin Console
            </button>
          </div>
        </div>

        {/* Auth Method Tabs */}
        <div className="p-6">
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('aadhaar');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                authMethod === 'aadhaar'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Fingerprint className="w-4 h-4" />
              <span>Aadhaar OTP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('mobile');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                authMethod === 'mobile'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile OTP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('digilocker');
                setOtpSent(false);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                authMethod === 'digilocker'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>DigiLocker</span>
            </button>
          </div>

          {/* Form depending on state */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {authMethod === 'aadhaar' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter 12-Digit Aadhaar Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX XXXX 8924"
                      className="w-full text-sm font-semibold tracking-wider bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pl-10 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <Fingerprint className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    UIDAI Paperless e-KYC with Instant Auto-Fetch
                  </p>
                </div>
              )}

              {authMethod === 'mobile' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter Registered Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pl-14 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <span className="text-xs font-bold text-slate-500 absolute left-3 top-3">
                      +91
                    </span>
                  </div>
                </div>
              )}

              {authMethod === 'digilocker' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Instant DigiLocker Single Sign-On</span>
                  </div>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    Authenticate directly using your verified DigiLocker account to automatically sync your Driving Licence and all vehicle RC certificates.
                  </p>
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Access Portal As:
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="citizen">Citizen (Unified Vehicles & Driving Licence)</option>
                  <option value="officer">RTO Scrutiny Officer (Counter & Approvals)</option>
                  <option value="admin">System Administrator (State Statistics & Audit)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {isLoading ? (
                  <span>Sending Secure OTP...</span>
                ) : (
                  <>
                    <span>Generate OTP & Proceed</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndLogin} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-emerald-900">
                  <strong>OTP sent to registered mobile</strong> (Auto-filled demo code below)
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter 6-Digit One Time Password (OTP)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  className="w-full text-center text-xl tracking-widest font-extrabold bg-slate-50 border border-slate-300 rounded-xl py-3 text-blue-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Verify & Enter Portal</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-blue-700 hover:underline"
                >
                  Change Number / Method
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
