import React from 'react';
import { ShieldCheck, Download, Printer, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/helpers';

export const TaxReceiptModal: React.FC = () => {
  const { receiptModalData, closeReceiptModal, t } = useApp();

  if (!receiptModalData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">{t.portalName} {t.downloadReceipt}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={closeReceiptModal}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Layout */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs bg-slate-50 font-sans">
          {/* Top Header */}
          <div className="text-center border-b-2 border-slate-300 pb-4 bg-white p-6 rounded-2xl shadow-xs border">
            <div className="w-12 h-12 bg-blue-900 text-amber-400 rounded-full flex items-center justify-center mx-auto font-black text-base mb-2">
              PN
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-blue-950 uppercase tracking-wide">
              {t.portalName}
            </h2>
            <h3 className="text-xs font-bold text-slate-700 mt-1 uppercase">
              {t.portalSubtitle}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              Digital Payment Verification Receipt
            </p>
          </div>

          {/* Receipt Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 font-mono">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">RECEIPT NUMBER:</span>
              <strong className="text-blue-950 font-bold">{receiptModalData.receiptNo}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">TRANSACTION ID:</span>
              <strong className="text-slate-900">{receiptModalData.transactionId}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">APPLICATION NUMBER:</span>
              <strong className="text-slate-900">{receiptModalData.applicationNo}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">SERVICE DESCRIPTION:</span>
              <strong className="text-slate-900 font-sans">{receiptModalData.serviceType || receiptModalData.serviceTitle}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">PAYER NAME:</span>
              <strong className="text-slate-900 font-sans">{receiptModalData.applicantName}</strong>
            </div>

            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">PAYMENT DATE & TIME:</span>
              <strong className="text-slate-900 font-sans">{receiptModalData.date}</strong>
            </div>

            <div className="flex justify-between pt-2 text-base font-extrabold text-slate-900 font-sans">
              <span>Total Statutory Amount Received:</span>
              <span className="text-emerald-700">{formatCurrency(receiptModalData.amount)}</span>
            </div>
          </div>

          {/* QR Stamp */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=BK:REC:${receiptModalData.receiptNo}|AMT:${receiptModalData.amount}`}
                alt="QR"
                className="w-14 h-14 border p-1 rounded-lg"
              />
              <div>
                <span className="font-bold text-slate-900 block text-xs">Payment Cleared Successfully</span>
                <span className="text-[10px] text-slate-500 block">
                  This is a computer-generated tax invoice. No physical signature required.
                </span>
              </div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
