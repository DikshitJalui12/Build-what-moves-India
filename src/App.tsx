import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GovHeader } from './components/layout/GovHeader';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { CitizenDashboard } from './components/dashboard/CitizenDashboard';
import { VehicleServicesHub } from './components/vehicleServices/VehicleServicesHub';
import { DLServicesHub } from './components/dlServices/DLServicesHub';
import { DocumentVault } from './components/vault/DocumentVault';
import { MyAppointments } from './components/appointments/MyAppointments';
import { PublicServicesHub } from './components/publicServices/PublicServicesHub';
import { OfficerPortal } from './components/officer/OfficerPortal';
import { HelpCenter } from './components/help/HelpCenter';
import { ParivahanSaathiModal } from './components/ai/ParivahanSaathiModal';
import { AuthModal } from './components/auth/AuthModal';
import { PaymentModal } from './components/payments/PaymentModal';
import { TaxReceiptModal } from './components/payments/TaxReceiptModal';
import { AppointmentBookingModal } from './components/appointments/AppointmentBookingModal';

const AppContent: React.FC = () => {
  const { activeNavTab, role } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white font-sans">
      {/* Top Government Branding & Accessibility Strip */}
      <GovHeader />

      {/* Primary Sticky Task Navigation Bar */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 pb-16 md:pb-12">
        {activeNavTab === 'home' && <CitizenDashboard />}
        {activeNavTab === 'garage' && <CitizenDashboard />}
        {activeNavTab === 'dl' && <CitizenDashboard />}
        {activeNavTab === 'vehicle-services' && <VehicleServicesHub />}
        {activeNavTab === 'dl-services' && <DLServicesHub />}
        {activeNavTab === 'appointments' && <MyAppointments />}
        {activeNavTab === 'vault' && <DocumentVault />}
        {activeNavTab === 'public' && <PublicServicesHub />}
        {activeNavTab === 'officer' && <OfficerPortal />}
        {activeNavTab === 'help' && <HelpCenter />}
      </main>

      {/* Mobile Bottom Quick Navigation */}
      <MobileNav />

      {/* Official Government Footer */}
      <Footer />

      {/* Global Modals & Overlay Engines */}
      <ParivahanSaathiModal />
      <AuthModal />
      <PaymentModal />
      <TaxReceiptModal />
      <AppointmentBookingModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
