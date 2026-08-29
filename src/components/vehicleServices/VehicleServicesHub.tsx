import React, { useState } from 'react';
import {
  Car,
  RefreshCw,
  Share2,
  Landmark,
  FileText,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  Truck,
  CheckCircle2,
  ArrowRight,
  Search,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OwnershipTransferWizard } from './OwnershipTransferWizard';
import { RCRenewalWizard } from './RCRenewalWizard';
import { HypothecationWizard } from './HypothecationWizard';
import { FancyNumberWizard } from './FancyNumberWizard';
import { GenericVehicleWizard } from './GenericVehicleWizard';

export const VehicleServicesHub: React.FC = () => {
  const { activeServiceWizard, setActiveServiceWizard, t } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const services = [
    {
      id: 'ownership-transfer',
      title: 'Transfer of Vehicle Ownership',
      category: 'ownership',
      description: 'Handshake transfer between seller & buyer with digital Form 29 & Form 30.',
      icon: Car,
      color: 'bg-blue-100 text-blue-900',
      fee: '₹530',
      duration: '7-10 Days',
      isPopular: true,
    },
    {
      id: 'rc-renewal',
      title: '15-Year RC Renewal & Fitness',
      category: 'registration',
      description: 'Mandatory re-registration and fitness inspection for vehicles older than 15 years.',
      icon: RefreshCw,
      color: 'bg-emerald-100 text-emerald-900',
      fee: '₹1,250',
      duration: '5-7 Days',
      isPopular: true,
    },
    {
      id: 'hypothecation-term',
      title: 'Hypothecation Termination (Loan NOC)',
      category: 'finance',
      description: 'Remove bank auto-loan endorsement upon final loan repayment with digital Form 35.',
      icon: Landmark,
      color: 'bg-amber-100 text-amber-950',
      fee: '₹350',
      duration: '3-5 Days',
    },
    {
      id: 'hypothecation-add',
      title: 'Hypothecation Addition (New Loan)',
      category: 'finance',
      description: 'Add financier / bank lien on your vehicle Registration Certificate (Form 34).',
      icon: Landmark,
      color: 'bg-purple-100 text-purple-900',
      fee: '₹550',
      duration: '3-5 Days',
    },
    {
      id: 'fancy-number',
      title: 'Choice & VIP Number Booking',
      category: 'vip',
      description: 'Book exclusive VIP registration numbers (e.g., 0001, 0007, 9999) online.',
      icon: Sparkles,
      color: 'bg-yellow-100 text-yellow-950',
      fee: 'From ₹10,000',
      duration: 'Instant Allotment',
      isPopular: true,
    },
    {
      id: 'change-address-rc',
      title: 'Change of Address in RC',
      category: 'registration',
      description: 'Update residential address in RC Smartcard seamlessly via Aadhaar e-KYC.',
      icon: MapPin,
      color: 'bg-rose-100 text-rose-900',
      fee: '₹550',
      duration: '4-6 Days',
    },
    {
      id: 'duplicate-rc',
      title: 'Issue of Duplicate RC',
      category: 'registration',
      description: 'Apply for replacement smartcard RC in case of theft, loss, or mutilation.',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-900',
      fee: '₹550',
      duration: '5-8 Days',
    },
    {
      id: 'interstate-noc',
      title: 'Interstate Transfer NOC',
      category: 'permits',
      description: 'Grant of No Objection Certificate for moving vehicle to another state (Form 28).',
      icon: Share2,
      color: 'bg-teal-100 text-teal-900',
      fee: '₹350',
      duration: '7 Days',
    },
    {
      id: 'fitness-renewal',
      title: 'Vehicle Fitness Certificate',
      category: 'registration',
      description: 'Renewal of fitness certificate for transport & commercial vehicles.',
      icon: ShieldCheck,
      color: 'bg-cyan-100 text-cyan-900',
      fee: '₹900',
      duration: '3 Days',
    },
    {
      id: 'new-registration',
      title: 'New Vehicle Registration',
      category: 'registration',
      description: 'Dealer-to-RTO permanent registration and road tax payment workflow.',
      icon: Award,
      color: 'bg-orange-100 text-orange-950',
      fee: 'Calculated by Model',
      duration: '2-4 Days',
    },
  ];

  // If a specific wizard is open, render that wizard
  if (activeServiceWizard === 'ownership-transfer') {
    return <OwnershipTransferWizard onCancel={() => setActiveServiceWizard(null)} />;
  }
  if (activeServiceWizard === 'rc-renewal') {
    return <RCRenewalWizard onCancel={() => setActiveServiceWizard(null)} />;
  }
  if (activeServiceWizard === 'hypothecation-term' || activeServiceWizard === 'hypothecation-add') {
    return <HypothecationWizard onCancel={() => setActiveServiceWizard(null)} />;
  }
  if (activeServiceWizard === 'fancy-number') {
    return <FancyNumberWizard onCancel={() => setActiveServiceWizard(null)} />;
  }
  if (activeServiceWizard) {
    return <GenericVehicleWizard serviceId={activeServiceWizard} onCancel={() => setActiveServiceWizard(null)} />;
  }

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            {t.vehicleServicesTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
          {t.vehicleServicesSubtitle}
        </p>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search vehicle services e.g. Transfer, Renewal, NOC, Hypothecation..."
              className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2.5 shadow-md border-0 focus:ring-2 focus:ring-amber-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['all', 'ownership', 'registration', 'finance', 'vip', 'permits'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap transition cursor-pointer capitalize ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl ${service.color} flex items-center justify-center shadow-2xs group-hover:scale-105 transition`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {service.isPopular && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ★ Popular
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-blue-900 transition">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">STATUTORY FEE</span>
                  <span className="font-bold text-xs text-slate-800">{service.fee}</span>
                </div>

                <button
                  onClick={() => setActiveServiceWizard(service.id)}
                  className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
