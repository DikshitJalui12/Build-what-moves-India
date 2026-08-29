import React from 'react';
import { Shield, ExternalLink, Globe2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveNavTab, setActiveServiceWizard, t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-4 border-amber-500 mt-auto pt-10 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Platform Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                PN
              </div>
              <span className="font-bold text-white text-sm">{t.portalName} 2.0</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] mb-3">
              {t.footerDesc}
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <Shield className="w-4 h-4" />
              <span>WCAG 2.1 Level AA Compliant</span>
            </div>
          </div>

          {/* Col 2: Quick Vehicle Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t.vehicleServicesTitle}
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
                  {t.transferOwnership}
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
                  {t.renewRC}
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
                  Bank NOC / Hypothecation
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
                  Choice & VIP Number Booking
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
                  {t.applyInterstateNOC}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Driving Licence Services */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t.dlServicesTitle}
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
                  {t.learnerLicence}
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
                  {t.permanentDL}
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
                  Licence Renewal
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
                  Add Vehicle Class
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Public Links & Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Digital Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://digitallocker.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-400 transition"
                >
                  <span>DigiLocker Service</span>
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
                  <span>CPGRAMS Grievance Portal</span>
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
                  <span>BharatKosh Gateway</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveNavTab('help')}
                  className="hover:text-amber-400 transition cursor-pointer text-left text-amber-300 font-semibold"
                >
                  {t.helpTitle} &rarr;
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & hackathon disclaimer line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © 2026 {t.portalName}.
            <div className="text-amber-400/90 font-medium text-[10px] mt-0.5">
              ⚠️ {t.footerDisclaimer}
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
