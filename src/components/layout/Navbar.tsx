import React, { useState } from 'react';
import {
  Car,
  CreditCard,
  Wrench,
  FileCheck2,
  Calendar,
  FolderLock,
  Search,
  HelpCircle,
  Building2,
  Home
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    setActiveServiceWizard,
    t,
    role,
    vehicles,
    drivingLicence,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'garage', label: `${t.navGarage} (${vehicles.length})`, icon: Car },
    { id: 'dl', label: t.navDL, icon: CreditCard },
    { id: 'vehicle-services', label: t.navVehicleServices, icon: Wrench },
    { id: 'dl-services', label: t.navDLServices, icon: FileCheck2 },
    { id: 'appointments', label: t.navAppointments, icon: Calendar },
    { id: 'vault', label: t.navVault, icon: FolderLock },
    { id: 'public', label: t.navPublicServices, icon: Search },
    { id: 'help', label: t.navHelp, icon: HelpCircle },
  ];

  if (role === 'officer' || role === 'admin') {
    navItems.push({
      id: 'officer',
      label: t.navOfficerPortal,
      icon: Building2,
    });
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toUpperCase();
    // Check if matching a vehicle
    const matchedVehicle = vehicles.find((v) => v.registrationNo.includes(query));
    if (matchedVehicle) {
      setActiveNavTab('garage');
      return;
    }

    // Check if DL
    if (drivingLicence && drivingLicence.licenceNo.includes(query)) {
      setActiveNavTab('dl');
      return;
    }

    // Otherwise navigate to public lookup
    setActiveNavTab('public');
  };

  return (
    <nav className="bg-blue-950 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 gap-4">
          {/* Nav Links (Desktop) */}
          <div className="hidden xl:flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNavTab(item.id);
                    setActiveServiceWizard(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-inner'
                      : 'text-slate-200 hover:bg-blue-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Compact Nav Bar for Laptops / Tablets */}
          <div className="flex xl:hidden items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNavTab(item.id);
                    setActiveServiceWizard(null);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-200 hover:bg-blue-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[90px]">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearch} className="relative w-48 sm:w-64 md:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Reg No, DL, Challan..."
              className="w-full bg-blue-900/80 hover:bg-blue-900 text-white placeholder-slate-400 text-xs rounded-lg pl-8 pr-3 py-2 border border-blue-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
            <Search className="w-4 h-4 text-amber-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </form>
        </div>
      </div>
    </nav>
  );
};
