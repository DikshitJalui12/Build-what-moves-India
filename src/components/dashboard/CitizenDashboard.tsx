import React from 'react';
import {
  Car,
  CreditCard,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from './VehicleCard';
import { DLCard } from './DLCard';
import { ApplicationTracker } from './ApplicationTracker';

export const CitizenDashboard: React.FC = () => {
  const {
    user,
    vehicles,
    drivingLicence,
    applications,
    challans,
    notifications,
    setActiveNavTab,
    setActiveServiceWizard,
    openAppointmentModal,
    t,
  } = useApp();

  const pendingChallans = challans.filter((c) => c.status === 'PENDING');
  const totalChallanAmount = pendingChallans.reduce((sum, c) => sum + c.fineAmount, 0);

  // Expiring soon or expired items
  const expiringVehicles = vehicles.filter(
    (v) =>
      v.insurance.status === 'EXPIRING_SOON' ||
      v.insurance.status === 'EXPIRED' ||
      v.puc.status === 'EXPIRING_SOON' ||
      v.puc.status === 'EXPIRED'
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Welcome & Unified Citizen Profile Hero Banner */}
      <div className="bg-linear-to-r from-blue-950 via-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl}
              alt={user?.name || 'Citizen'}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Citizen Identity Linked
                </span>
                <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker Verified
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Citizen'}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">
                Aadhaar: <span className="font-mono">{user?.aadhaar}</span> • {user?.district}, {user?.state} ({user?.pincode})
              </p>
            </div>
          </div>

          {/* Citizen Quick Stats Badges */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:px-4 border border-white/15 text-center">
              <div className="text-2xl font-black text-amber-400">{vehicles.length}</div>
              <div className="text-[11px] text-blue-200 font-medium">Vehicles (Garage)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:px-4 border border-white/15 text-center">
              <div className="text-2xl font-black text-emerald-400">
                {drivingLicence ? 'Active' : 'None'}
              </div>
              <div className="text-[11px] text-blue-200 font-medium">Driving Licence</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 sm:px-4 border border-white/15 text-center">
              <div className="text-2xl font-black text-blue-300">{applications.length}</div>
              <div className="text-[11px] text-blue-200 font-medium">Applications</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Urgent Alerts & Notifications Banner (If any) */}
      {(pendingChallans.length > 0 || expiringVehicles.length > 0) && (
        <div className="bg-linear-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Action Required: {expiringVehicles.length} Document Expiries & {pendingChallans.length} Traffic Fine Pending
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Renew your Insurance/PUC promptly to prevent hefty roadside penalties. Pending fine amount:{' '}
                <strong className="text-rose-700">₹{totalChallanAmount}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {pendingChallans.length > 0 && (
              <button
                onClick={() => setActiveNavTab('public')}
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                Pay Challan (₹{totalChallanAmount}) &rarr;
              </button>
            )}
            {expiringVehicles.length > 0 && (
              <button
                onClick={() => {
                  setActiveNavTab('vehicle-services');
                  setActiveServiceWizard('fitness-renewal');
                }}
                className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                Renew Documents &rarr;
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Task-Oriented Quick Action Cards */}
      <div>
        <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{t.quickActionsTitle}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => {
              setActiveNavTab('vehicle-services');
              setActiveServiceWizard('ownership-transfer');
            }}
            className="p-4 bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 rounded-2xl text-left transition shadow-xs hover:shadow-md group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Car className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-snug">
              Transfer Ownership
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Buyer-Seller Form 29/30</div>
          </button>

          <button
            onClick={() => {
              setActiveNavTab('dl-services');
              setActiveServiceWizard('learner-licence');
            }}
            className="p-4 bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 rounded-2xl text-left transition shadow-xs hover:shadow-md group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-snug">
              Learner’s Licence
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Aadhaar e-KYC & Test</div>
          </button>

          <button
            onClick={() => {
              setActiveNavTab('vehicle-services');
              setActiveServiceWizard('rc-renewal');
            }}
            className="p-4 bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 rounded-2xl text-left transition shadow-xs hover:shadow-md group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-950 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Clock className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-snug">
              Renew RC (15+ Yr)
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Fitness & Re-register</div>
          </button>

          <button
            onClick={() => {
              openAppointmentModal('General RTO Visit & Document Verification', 'DL01AB1234', 'DL-01');
            }}
            className="p-4 bg-white hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 rounded-2xl text-left transition shadow-xs hover:shadow-md group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-snug">
              Book RTO Slot
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Calendar & QR Pass</div>
          </button>

          <button
            onClick={() => setActiveNavTab('public')}
            className="p-4 bg-white hover:bg-rose-50/80 border border-slate-200 hover:border-rose-300 rounded-2xl text-left transition shadow-xs hover:shadow-md group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-900 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-snug">
              Pay e-Challan
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Camera Fine Clearance</div>
          </button>

          <button
            onClick={() => setActiveNavTab('vault')}
            className="p-4 bg-white hover:bg-teal-50/80 border border-slate-200 hover:border-teal-300 rounded-2xl text-left transition shadow-xs hover:shadow-md group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Download className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-xs text-slate-900 leading-snug">
              Download Docs
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Smartcards & Certificates</div>
          </button>
        </div>
      </div>

      {/* 4. Unified Vehicles Garage Grid */}
      <section id="garage-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-900" />
              <span>{t.myVehiclesTitle}</span>
              <span className="text-xs bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                {vehicles.length} Active
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              All vehicles registered under your Aadhaar identity across India
            </p>
          </div>

          <button
            onClick={() => {
              setActiveNavTab('vehicle-services');
              setActiveServiceWizard('new-registration');
            }}
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Register New Vehicle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.registrationNo} vehicle={v} />
          ))}
        </div>
      </section>

      {/* 5. Driving Licence Profile */}
      <section id="dl-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-900" />
              <span>{t.myDLTitle}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Digital Smartcard Licence synchronized with National Sarathi Database
            </p>
          </div>
        </div>

        <DLCard dl={drivingLicence} />
      </section>

      {/* 6. Active Application Progress Timeline */}
      <section id="applications-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-900" />
              <span>{t.activeApplicationsTitle}</span>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                {applications.length} Active Requests
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5-stage end-to-end transparent scrutiny & dispatch tracker
            </p>
          </div>
        </div>

        <ApplicationTracker applications={applications} />
      </section>
    </div>
  );
};
