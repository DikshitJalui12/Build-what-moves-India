import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Download,
  Calendar,
  Globe,
  PlusCircle,
  RefreshCw,
  QrCode,
  CheckCircle2,
  Car,
  Bike
} from 'lucide-react';
import { DrivingLicence } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

interface DLCardProps {
  dl: DrivingLicence | null;
}

export const DLCard: React.FC<DLCardProps> = ({ dl }) => {
  const { setActiveNavTab, setActiveServiceWizard, t } = useApp();
  const [showBackSide, setShowBackSide] = useState(false);

  if (!dl) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-xs">
        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-800">No Driving Licence Linked</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
          You don’t have an active driving licence linked to your digital profile.
        </p>
        <button
          onClick={() => {
            setActiveNavTab('dl-services');
            setActiveServiceWizard('learner-licence');
          }}
          className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
        >
          {t.learnerLicence} &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <span className="font-extrabold text-sm tracking-wide">
            {t.dlSmartcard}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t.digiLockerBadge}
          </span>
          <button
            onClick={() => setShowBackSide(!showBackSide)}
            className="text-[11px] bg-white/10 hover:bg-white/20 text-white font-bold px-2 py-0.5 rounded-md transition cursor-pointer"
          >
            {t.flipCard}
          </button>
        </div>
      </div>

      {/* Realistic Smartcard Graphic Container */}
      <div className="p-4 sm:p-6 flex-1">
        {!showBackSide ? (
          /* FRONT SIDE */
          <div className="relative bg-linear-to-br from-amber-50/70 via-white to-blue-50/60 rounded-2xl p-5 border-2 border-amber-200/80 shadow-md overflow-hidden">
            {/* Watermark Graphic */}
            <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none text-9xl font-black text-blue-900 select-none">
              DL
            </div>

            {/* Header within Card */}
            <div className="flex items-center justify-between border-b border-amber-300/60 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                  IN
                </div>
                <div>
                  <h4 className="text-xs font-black text-blue-950 uppercase tracking-wide">
                    {t.portalName}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    {t.dlSmartcard}
                  </p>
                </div>
              </div>

              {/* Gold Chip representation */}
              <div className="w-9 h-7 rounded bg-linear-to-br from-amber-300 via-amber-400 to-yellow-600 border border-amber-600/40 shadow-inner flex items-center justify-center">
                <div className="w-6 h-4 border border-amber-700/30 rounded-xs grid grid-cols-2"></div>
              </div>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Photo & Blood Group */}
              <div className="sm:col-span-3 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-28 bg-slate-200 rounded-lg overflow-hidden border-2 border-slate-300 shadow-xs mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    alt={dl.holderName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {t.bloodGroup}: {dl.bloodGroup}
                </div>
              </div>

              {/* License Details */}
              <div className="sm:col-span-9 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    {t.licenceNo}:
                  </span>
                  <span className="text-sm font-black text-blue-950 font-mono tracking-wider">
                    {dl.licenceNo}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{t.name}:</span>
                    <span className="font-bold text-slate-900 uppercase">{dl.holderName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{t.fatherName}:</span>
                    <span className="font-bold text-slate-800">{dl.fatherName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{t.dob}:</span>
                    <span className="font-bold text-slate-800">{formatDate(dl.dateOfBirth)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{t.issueDate}:</span>
                    <span className="font-bold text-slate-800">{formatDate(dl.issueDate)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 block uppercase">
                      {t.validTill}:
                    </span>
                    <span className="font-extrabold text-emerald-950">
                      {formatDate(dl.validTillNonTransport)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 block uppercase">
                      {t.issuingAuthority}:
                    </span>
                    <span className="font-extrabold text-emerald-950 truncate block">
                      {dl.rtoName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Authorized Classes Ribbon */}
            <div className="mt-4 pt-3 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">{t.authorizedClasses}:</span>
                {dl.authorizedClasses.map((cls) => (
                  <span
                    key={cls.classCode}
                    className="inline-flex items-center gap-1 bg-blue-900 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-2xs"
                  >
                    {cls.classCode === 'MCWG' && <Bike className="w-3 h-3" />}
                    {cls.classCode === 'LMV' && <Car className="w-3 h-3" />}
                    <span>{cls.classCode}</span>
                  </span>
                ))}
              </div>

              {dl.hasIDP && (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  <Globe className="w-3 h-3" />
                  IDP Endorsed (Valid till {formatDate(dl.idpValidTill || '')})
                </span>
              )}
            </div>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="relative bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl p-5 border-2 border-slate-300 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase">
                Driving Licence Endorsements & Address
              </h4>
              <QrCode className="w-5 h-5 text-slate-600" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 text-xs">
              <div className="sm:col-span-8 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Permanent Address:
                  </span>
                  <p className="font-semibold text-slate-800 leading-relaxed">{dl.address}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
                    Class Endorsement Log:
                  </span>
                  <table className="w-full text-left text-[11px] border border-slate-200 rounded-lg overflow-hidden bg-white">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="p-1.5 font-bold">Class</th>
                        <th className="p-1.5 font-bold">Description</th>
                        <th className="p-1.5 font-bold">Issued</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dl.authorizedClasses.map((c) => (
                        <tr key={c.classCode}>
                          <td className="p-1.5 font-mono font-bold text-blue-900">{c.classCode}</td>
                          <td className="p-1.5 text-slate-700">{c.description}</td>
                          <td className="p-1.5 text-slate-500">{formatDate(c.issueDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=DL:${dl.licenceNo}|DOB:${dl.dateOfBirth}|HOLDER:${dl.holderName}`}
                  alt="QR Code"
                  className="w-24 h-24 mb-1.5"
                />
                <span className="text-[9px] font-mono text-slate-400">MoRTH QR Verified</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Tray */}
      <div className="bg-slate-50 border-t border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveNavTab('dl-services');
              setActiveServiceWizard('idp');
            }}
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Apply for IDP</span>
          </button>
          <button
            onClick={() => {
              setActiveNavTab('dl-services');
              setActiveServiceWizard('add-cov');
            }}
            className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-700" />
            <span>Add Vehicle Class</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveNavTab('dl-services');
              setActiveServiceWizard('dl-renewal');
            }}
            className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>Renew DL</span>
          </button>
          <button
            onClick={() => setActiveNavTab('vault')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Digital DL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
