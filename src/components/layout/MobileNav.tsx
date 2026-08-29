import React from 'react';
import { Home, Car, CreditCard, Wrench, Search, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const {
    activeNavTab,
    setActiveNavTab,
    setActiveServiceWizard,
    setIsSaathiModalOpen,
    t,
  } = useApp();

  const items = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'garage', label: t.navGarage, icon: Car },
    { id: 'saathi', label: t.askSaathi, icon: Sparkles, isSpecial: true },
    { id: 'dl', label: t.navDL, icon: CreditCard },
    { id: 'vehicle-services', label: t.navVehicleServices, icon: Wrench },
    { id: 'public', label: t.navPublicServices, icon: Search },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40 px-2 py-1.5 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeNavTab === item.id;

        if (item.isSpecial) {
          return (
            <button
              key={item.id}
              onClick={() => setIsSaathiModalOpen(true)}
              className="flex flex-col items-center justify-center -mt-5 bg-linear-to-tr from-amber-500 to-orange-600 text-white rounded-full p-3 shadow-lg border-2 border-white cursor-pointer active:scale-95 transition"
              aria-label="Parivahan Saathi AI Assistant"
            >
              <Icon className="w-5 h-5 animate-pulse" />
              <span className="text-[9px] font-bold mt-0.5">Saathi AI</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveNavTab(item.id);
              setActiveServiceWizard(null);
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition cursor-pointer ${
              isActive
                ? 'text-blue-900 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
