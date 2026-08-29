import React from 'react';
import { Shield, ExternalLink, Heart, Globe2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveNavTab, setActiveServiceWizard } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-4 border-amber-500 mt-auto pt-10 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Ministry Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                PN
              </div>
              <span className="font-bold text-white text-sm">Parivahan Next 2.0</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] mb-3">
              Designed & Developed to unify India's vehicle registration (Vahan), driving licensing (Sarathi), and traffic enforcement (eChallan) systems under Digital India.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <Shield className="w-4 h-4" />
              <span>WCAG 2.1 Level AA Compliant</span>
            </div>
          </div>

          {/* Col 2: Quick Vehicle Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Vehicle Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('vehicle-services');
                    setActiveServiceWizard('ownership-transfer');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Transfer of Vehicle Ownership
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('vehicle-services');
                    setActiveServiceWizard('rc-renewal');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  15-Year RC Renewal & Fitness
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('vehicle-services');
                    setActiveServiceWizard('hypothecation-term');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Hypothecation / Bank NOC Clearance
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('vehicle-services');
                    setActiveServiceWizard('fancy-number');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Choice & VIP Number Plate Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('vehicle-services');
                    setActiveServiceWizard('interstate-noc');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Interstate No Objection Certificate (NOC)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Driving Licence Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Licence Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('dl-services');
                    setActiveServiceWizard('learner-licence');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  New Learner’s Licence (e-KYC & Test)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('dl-services');
                    setActiveServiceWizard('permanent-dl');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Convert to Permanent Driving Licence
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('dl-services');
                    setActiveServiceWizard('idp');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  International Driving Permit (IDP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('dl-services');
                    setActiveServiceWizard('dl-renewal');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Driving Licence Renewal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveNavTab('dl-services');
                    setActiveServiceWizard('add-cov');
                  }}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  Add Vehicle Class to Licence
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Links & Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Government Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://morth.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-400 transition"
                >
                  <span>MoRTH Official Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://digitallocker.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-400 transition"
                >
                  <span>DigiLocker India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pgportal.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-400 transition"
                >
                  <span>CPGRAMS Citizen Grievance</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://bharatkosh.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-400 transition"
                >
                  <span>BharatKosh Non-Tax Receipts</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveNavTab('help')}
                  className="hover:text-amber-400 transition cursor-pointer text-left text-amber-300 font-semibold"
                >
                  Grievance Redressal & RTO Contacts &rarr;
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & hackathon disclaimer line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © 2026 Ministry of Road Transport & Highways, Government of India.
            <div className="text-amber-400/90 font-medium text-[10px] mt-0.5">
              ⚠️ Hackathon Innovation Prototype • Uses Synthetic Mock Data • Not an official government deployment.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-amber-400" /> Digital Public Infrastructure
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-300">
              Powered by OpenAI / Codex
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
