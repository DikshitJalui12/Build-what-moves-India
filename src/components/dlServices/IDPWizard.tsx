import React, { useState } from 'react';
import { Globe, ShieldCheck, Download, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { generateAppNumber } from '../../utils/helpers';

export const IDPWizard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { user, drivingLicence, addApplication, openPaymentModal, openReceiptModal } = useApp();

  const [destinationCountry, setDestinationCountry] = useState('United States of America (USA)');
  const [passportNumber, setPassportNumber] = useState('Z9810294');
  const [visaType, setVisaType] = useState('Tourist / Business B1/B2');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<Application | null>(null);

  const totalFee = 1050; // ₹1000 IDP + ₹50 user charges

  const handleSubmit = () => {
    openPaymentModal(
      `International Driving Permit (1949 Convention - ${destinationCountry})`,
      {
        baseFee: 1000,
        userCharges: 50,
        roadTax: 0,
        postalFee: 0,
        total: totalFee,
      },
      (receipt) => {
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber('DL01-IDP'),
          serviceType: `International Driving Permit (IDP) - ${destinationCountry}`,
          serviceCategory: 'dl',
          applicantName: user?.name || 'Citizen',
          applicantMobile: user?.mobile || '+91 9876543210',
          applicantAadhaarMasked: user?.aadhaar || 'XXXX-XXXX-8924',
          licenceNo: drivingLicence?.licenceNo || 'DL-0120150045678',
          rtoCode: 'DL-01',
          rtoName: 'RTO Mall Road',
          state: 'Delhi',
          submittedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          currentStage: 'APPROVED',
          stages: [
            {
              stageKey: 'SUBMITTED',
              stageName: 'Passport & Visa Verification Cleared',
              timestamp: 'Just now',
              status: 'completed',
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'Statutory IDP Fee Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${totalFee} paid via BharatKosh`,
            },
            {
              stageKey: 'APPROVED',
              stageName: 'Digital IDP Issued & Physical Booklet Ready',
              timestamp: 'Just now',
              status: 'completed',
              remarks: 'Valid for 1 Year across 150+ countries',
            },
          ],
          documents: [
            {
              name: 'International Driving Permit (Geneva Convention 1949)',
              type: 'PDF',
              url: 'mock://idp_booklet.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: 1000,
            userCharges: 50,
            roadTax: 0,
            postalSmartcardFee: 0,
            total: totalFee,
            paymentStatus: 'PAID',
            transactionId: receipt.transactionId,
            paymentDate: new Date().toLocaleString('en-IN'),
            receiptNo: receipt.receiptNo,
          },
          estimatedCompletionDate: new Date().toISOString().split('T')[0],
        };

        addApplication(newApp);
        setGeneratedApp(newApp);
        setIsSuccess(true);
      }
    );
  };

  if (isSuccess && generatedApp) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <Globe className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">International Driving Permit Issued!</h3>
        <p className="text-xs text-slate-600">
          IDP Reference Number: <strong className="font-mono text-blue-950 text-base">{generatedApp.applicationNo}</strong>
        </p>
        <button
          onClick={onCancel}
          className="bg-blue-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      <div className="bg-blue-950 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">International Driving Permit (IDP)</h2>
            <p className="text-xs text-blue-200">1949 Geneva Convention 1-Year Valid Permit</p>
          </div>
        </div>
        <button onClick={onCancel} className="text-xs text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg">
          Cancel
        </button>
      </div>

      <div className="p-6 space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Destination Country / Region</label>
          <select
            value={destinationCountry}
            onChange={(e) => setDestinationCountry(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
          >
            <option>United States of America (USA)</option>
            <option>United Kingdom (UK)</option>
            <option>United Arab Emirates (UAE)</option>
            <option>Germany & Schengen Area</option>
            <option>Australia</option>
            <option>Canada</option>
            <option>Singapore</option>
            <option>Japan</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Indian Passport Number</label>
            <input
              type="text"
              value={passportNumber}
              onChange={(e) => setPassportNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Visa Category</label>
            <input
              type="text"
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
          <span>
            Linked Driving Licence: <strong>{drivingLicence?.licenceNo}</strong> (Classes: MCWG, LMV)
          </span>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-xs font-bold text-slate-600">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay ₹1,050 & Issue IDP</span>
        </button>
      </div>
    </div>
  );
};
