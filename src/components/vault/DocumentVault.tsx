import React, { useState } from 'react';
import {
  FolderLock,
  Download,
  Eye,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  FileText,
  CreditCard,
  Car,
  QrCode,
  CheckCircle2,
  X,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentVaultItem } from '../../types';
import { formatDate } from '../../utils/helpers';

export const DocumentVault: React.FC = () => {
  const { vaultDocs, user, vehicles, drivingLicence, t } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<DocumentVaultItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(false);

  const handleDigiLockerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice(true);
      setTimeout(() => setSyncNotice(false), 4000);
    }, 1200);
  };

  const handleDownload = (doc: DocumentVaultItem) => {
    setSelectedDoc(doc);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <FolderLock className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              {t.vaultTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-blue-200 max-w-xl leading-relaxed">
            {t.vaultSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDigiLockerSync}
            disabled={isSyncing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : t.syncDigiLocker}</span>
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950 flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>{t.digiLockerBadge}:</strong> All digital credentials and Smartcard certificates are up-to-date.
          </span>
        </div>
      )}

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vaultDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {doc.documentType}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {t.digiLockerBadge}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm mb-1">{doc.title}</h3>
              <p className="text-xs text-slate-500 mb-4 font-mono">{doc.documentNumber}</p>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Linked:</span>
                  <span className="font-bold text-slate-800">{doc.linkedIdentifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.validTill}:</span>
                  <span className="font-medium text-emerald-800">{formatDate(doc.validTill)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.issuingAuthority}:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[150px]">{doc.issuer}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDoc(doc)}
                className="flex-1 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>{t.viewCard}</span>
              </button>
              <button
                onClick={() => handleDownload(doc)}
                className="flex-1 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadSlip}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Document View / Print Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">{selectedDoc.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-xs bg-slate-50 font-sans">
              <div className="text-center border-b-2 border-slate-300 pb-4 bg-white p-6 rounded-2xl shadow-xs border">
                <div className="w-12 h-12 bg-blue-900 text-amber-400 rounded-full flex items-center justify-center mx-auto font-black text-base mb-2">
                  PN
                </div>
                <h2 className="text-base font-extrabold text-blue-950 uppercase tracking-wide">
                  {t.portalName} • {t.portalSubtitle}
                </h2>
                <h3 className="text-xs font-bold text-slate-700 mt-1 uppercase">
                  {selectedDoc.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Verified Digital Transport Credential
                </p>
              </div>

              {/* Data Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Certificate / Document Number:
                    </span>
                    <span className="font-mono font-bold text-sm text-blue-950">
                      {selectedDoc.documentNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Registered Owner / Holder:
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {user?.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Linked Vehicle / Licence:
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedDoc.linkedIdentifier}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Validity Date:
                    </span>
                    <span className="font-bold text-emerald-800">
                      {formatDate(selectedDoc.validTill)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Issuing Authority:
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedDoc.issuer}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Aadhaar Identity Linkage:
                    </span>
                    <span className="font-mono text-slate-800">
                      {user?.aadhaar} (Verified)
                    </span>
                  </div>
                </div>

                {/* QR Code Verification Stamp */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=MORTH:DOC:${selectedDoc.documentNumber}|VALID:${selectedDoc.validTill}`}
                      alt="QR"
                      className="w-16 h-16 border p-1 rounded-lg bg-white"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Digitally Signed & Verified</span>
                      <span className="text-[10px] text-slate-500 block">
                        Compliant with Rule 139 of Central Motor Vehicles Rules
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">CERTIFICATE STATUS</span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      OFFICIALLY VALID
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
