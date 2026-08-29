import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  PlusCircle,
  MapPin,
  FileText,
  ShieldCheck,
  Download,
  Bike,
  Car
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { generateAppNumber, formatCurrency } from '../../utils/helpers';

interface GenericDLWizardProps {
  serviceId: string;
  onCancel: () => void;
}

export const GenericDLWizard: React.FC<GenericDLWizardProps> = ({ serviceId, onCancel }) => {
  const { drivingLicence, user, addApplication, openPaymentModal, openReceiptModal } = useApp();

  const serviceConfigs: Record<
    string,
    { title: string; subtitle: string; baseFee: number; userCharge: number; postalFee: number; icon: any; formType: string }
  > = {
    'dl-renewal': {
      title: 'Driving Licence Renewal (Form 9)',
      subtitle: 'Extend DL validity with digital Form 1A medical fitness declaration',
      baseFee: 200,
      userCharge: 50,
      postalFee: 200,
      icon: RefreshCw,
      formType: 'renewal',
    },
    'add-cov': {
      title: 'Addition of Vehicle Class (COV) to DL',
      subtitle: 'Endorse additional vehicle category (e.g. 4-Wheeler LMV) to your existing licence',
      baseFee: 500,
      userCharge: 50,
      postalFee: 200,
      icon: PlusCircle,
      formType: 'add_class',
    },
    'change-address-dl': {
      title: 'Change of Address in Driving Licence',
      subtitle: 'Update permanent/current address in Driving Licence using Aadhaar sync',
      baseFee: 200,
      userCharge: 50,
      postalFee: 200,
      icon: MapPin,
      formType: 'address',
    },
    'duplicate-dl': {
      title: 'Issue Duplicate Driving Licence (Form 2)',
      subtitle: 'Replacement licence card for lost, stolen, or damaged licence',
      baseFee: 200,
      userCharge: 50,
      postalFee: 200,
      icon: FileText,
      formType: 'duplicate',
    },
  };

  const config = serviceConfigs[serviceId] || serviceConfigs['dl-renewal'];
  const totalFee = config.baseFee + config.userCharge + config.postalFee;

  // Form states
  const [selectedClassToAdd, setSelectedClassToAdd] = useState('LMV (Light Motor Vehicle - Car)');
  const [medicalFitnessDeclared, setMedicalFitnessDeclared] = useState(true);
  const [dlNewAddress, setDlNewAddress] = useState(
    user?.address || 'Flat 402, Shanti Nilayam, Sector 14, Dwarka, Delhi 110078'
  );
  const [firNumber, setFirNumber] = useState('FIR-DL-2026-8812');

  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<Application | null>(null);

  const handleSubmitAndPay = () => {
    openPaymentModal(
      config.title,
      {
        baseFee: config.baseFee,
        userCharges: config.userCharge,
        roadTax: 0,
        postalFee: config.postalFee,
        total: totalFee,
      },
      (receipt) => {
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber('DL-SRV'),
          serviceType: config.title,
          serviceCategory: 'dl',
          applicantName: user?.name || 'Citizen',
          applicantMobile: user?.mobile || '+91 9876543210',
          applicantAadhaarMasked: user?.aadhaar || 'XXXX-XXXX-8924',
          licenceNo: drivingLicence?.licenceNo || 'DL-0120150045678',
          rtoCode: drivingLicence?.rtoCode || 'DL-01',
          rtoName: drivingLicence?.rtoName || 'RTO Mall Road',
          state: drivingLicence?.state || 'Delhi',
          submittedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          currentStage: 'SCRUTINY',
          stages: [
            {
              stageKey: 'SUBMITTED',
              stageName: `${config.title} Application Filed`,
              timestamp: 'Just now',
              status: 'completed',
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'Statutory Licence Fee Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${totalFee} paid via BharatKosh`,
            },
            {
              stageKey: 'SCRUTINY',
              stageName: 'RTO Scrutiny & Endorsement Verification',
              status: 'current',
            },
            {
              stageKey: 'APPROVED',
              stageName: 'Updated Smartcard DL Issued & Dispatched',
              status: 'pending',
            },
          ],
          documents: [
            {
              name: `Application Document (${config.title})`,
              type: 'PDF',
              url: 'mock://dl_app.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: config.baseFee,
            userCharges: config.userCharge,
            roadTax: 0,
            postalSmartcardFee: config.postalFee,
            total: totalFee,
            paymentStatus: 'PAID',
            transactionId: receipt.transactionId,
            paymentDate: new Date().toLocaleString('en-IN'),
            receiptNo: receipt.receiptNo,
          },
          estimatedCompletionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        };

        addApplication(newApp);
        setGeneratedApp(newApp);
        setIsSuccess(true);
      }
    );
  };

  const Icon = config.icon;

  if (isSuccess && generatedApp) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full uppercase">
            Application Registered
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{config.title}</h3>
          <p className="text-xs text-slate-600 mt-1">
            Application Ref No: <strong className="font-mono text-blue-950 text-base">{generatedApp.applicationNo}</strong>
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() =>
              openReceiptModal({
                receiptNo: generatedApp.feeDetails.receiptNo,
                applicationNo: generatedApp.applicationNo,
                serviceType: generatedApp.serviceType,
                applicantName: user?.name,
                amount: totalFee,
                transactionId: generatedApp.feeDetails.transactionId,
                date: generatedApp.feeDetails.paymentDate,
                rtoName: generatedApp.rtoName,
              })
            }
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Tax Receipt</span>
          </button>
          <button
            onClick={onCancel}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">{config.title}</h2>
            <p className="text-xs text-blue-200">{config.subtitle}</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg"
        >
          Cancel
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-5 text-xs">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 block">LINKED DRIVING LICENCE:</span>
          <span className="font-mono font-bold text-sm text-blue-950">{drivingLicence?.licenceNo}</span>
          <span className="text-slate-500 block">Holder: {user?.name} | RTO: {drivingLicence?.rtoName}</span>
        </div>

        {/* Dynamic Fields */}
        {config.formType === 'renewal' && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Digital Form 1A (Medical Fitness Declaration)</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={medicalFitnessDeclared}
                onChange={(e) => setMedicalFitnessDeclared(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-xs">
                I hereby declare that I possess sound health and vision compliant with the Central Motor Vehicles Rules.
              </span>
            </label>
          </div>
        )}

        {config.formType === 'add_class' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Additional Class of Vehicle</label>
            <select
              value={selectedClassToAdd}
              onChange={(e) => setSelectedClassToAdd(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
            >
              <option>LMV (Light Motor Vehicle - Private Car)</option>
              <option>TRANS (Transport & Goods Commercial Vehicle)</option>
              <option>3W-CAB (Auto Rickshaw / Passenger Cab)</option>
              <option>HGMV (Heavy Goods Motor Vehicle)</option>
            </select>
          </div>
        )}

        {config.formType === 'address' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1">New Residential Address on DL</label>
            <textarea
              rows={2}
              value={dlNewAddress}
              onChange={(e) => setDlNewAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900"
            />
          </div>
        )}

        {config.formType === 'duplicate' && (
          <div>
            <label className="block font-bold text-slate-700 mb-1">Police Lost Report / FIR Number</label>
            <input
              type="text"
              value={firNumber}
              onChange={(e) => setFirNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900"
            />
          </div>
        )}

        {/* Fee Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Statutory Fee:</span>
            <span className="font-bold">₹{config.baseFee}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Portal User Charge:</span>
            <span className="font-bold">₹{config.userCharge}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Smartcard DL SpeedPost Dispatch:</span>
            <span className="font-bold">₹{config.postalFee}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Payable:</span>
            <span className="text-emerald-700">{formatCurrency(totalFee)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-xs font-bold text-slate-600 cursor-pointer">
          Cancel
        </button>
        <button
          onClick={handleSubmitAndPay}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay {formatCurrency(totalFee)} & Submit Application</span>
        </button>
      </div>
    </div>
  );
};
