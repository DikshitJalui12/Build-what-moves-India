import React, { useState } from 'react';
import {
  CreditCard,
  RefreshCw,
  Globe,
  PlusCircle,
  FileText,
  MapPin,
  Calendar,
  Award,
  ArrowRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearnerLicenceWizard } from './LearnerLicenceWizard';
import { PermanentDLWizard } from './PermanentDLWizard';
import { IDPWizard } from './IDPWizard';
import { GenericDLWizard } from './GenericDLWizard';

export const DLServicesHub: React.FC = () => {
  const { activeServiceWizard, setActiveServiceWizard, openAppointmentModal, t } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const services = [
    {
      id: 'learner-licence',
      title: 'New Learner’s Licence (LL)',
      description: 'Aadhaar paperless e-KYC and online 15-question traffic mock test with instant LL issuance.',
      icon: CreditCard,
      color: 'bg-emerald-100 text-emerald-900',
      fee: '₹250',
      isPopular: true,
    },
    {
      id: 'permanent-dl',
      title: 'Convert to Permanent Driving Licence',
      description: 'Convert valid Learner’s Licence to Permanent DL with automated test track appointment.',
      icon: Award,
      color: 'bg-blue-100 text-blue-900',
      fee: '₹650',
      isPopular: true,
    },
    {
      id: 'idp',
      title: 'International Driving Permit (IDP)',
      description: 'Geneva Convention 1949 International Driving Permit for driving in 150+ foreign countries.',
      icon: Globe,
      color: 'bg-amber-100 text-amber-950',
      fee: '₹1,050',
      isPopular: true,
    },
    {
      id: 'dl-renewal',
      title: 'Driving Licence Renewal',
      description: 'Renew expired or expiring DL with digital Form 1A medical fitness self-declaration.',
      icon: RefreshCw,
      color: 'bg-purple-100 text-purple-900',
      fee: '₹450',
    },
    {
      id: 'add-cov',
      title: 'Addition of Vehicle Class (COV)',
      description: 'Add new class of vehicles (e.g. 4-Wheeler Car / Commercial) to existing driving licence.',
      icon: PlusCircle,
      color: 'bg-rose-100 text-rose-900',
      fee: '₹750',
    },
    {
      id: 'change-address-dl',
      title: 'Change of Address in Licence',
      description: 'Update permanent / current address in Driving Licence using instant Aadhaar sync.',
      icon: MapPin,
      color: 'bg-teal-100 text-teal-900',
      fee: '₹450',
    },
    {
      id: 'duplicate-dl',
      title: 'Issue Duplicate Driving Licence',
      description: 'Apply for replacement smartcard DL in case of theft, loss, or damaged licence card.',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-900',
      fee: '₹450',
    },
    {
      id: 'dl-slot-book',
      title: 'Book / Reschedule Driving Test Slot',
      description: 'Select automated driving test track date and counter time slot at your designated RTO.',
      icon: Calendar,
      color: 'bg-cyan-100 text-cyan-900',
      fee: 'Free (Included with DL Application)',
    },
  ];

  if (activeServiceWizard === 'learner-licence') {
    return <LearnerLicenceWizard onCancel={() => setActiveServiceWizard(null)} />;
  }
  if (activeServiceWizard === 'permanent-dl') {
    return <PermanentDLWizard onCancel={() => setActiveServiceWizard(null)} />;
  }
  if (activeServiceWizard === 'idp') {
    return <IDPWizard onCancel={() => setActiveServiceWizard(null)} />;
  }
  if (activeServiceWizard) {
    return <GenericDLWizard serviceId={activeServiceWizard} onCancel={() => setActiveServiceWizard(null)} />;
  }

  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <CreditCard className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            {t.dlServicesTitle}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
          {t.dlServicesSubtitle}
        </p>

        {/* Search */}
        <div className="mt-6 relative max-w-md">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search licence services (Learner, Renewal, IDP, Class...)"
            className="w-full bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2.5 shadow-md border-0 focus:ring-2 focus:ring-amber-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Grid */}
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
                  <div
                    className={`w-11 h-11 rounded-xl ${service.color} flex items-center justify-center shadow-2xs group-hover:scale-105 transition`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {service.isPopular && (
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      ★ Essential
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
                  <span className="text-[10px] text-slate-400 block font-bold">FEES</span>
                  <span className="font-bold text-xs text-slate-800">{service.fee}</span>
                </div>

                <button
                  onClick={() => {
                    if (service.id === 'dl-slot-book') {
                      openAppointmentModal('Driving Licence Test Slot', 'DL-0120150045678', 'DL-01');
                    } else {
                      setActiveServiceWizard(service.id);
                    }
                  }}
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
