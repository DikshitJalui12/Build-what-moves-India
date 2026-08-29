import React, { useState } from 'react';
import { Landmark, CheckCircle2, ArrowRight, CreditCard, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { generateAppNumber } from '../../utils/helpers';

export const HypothecationWizard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { vehicles, user, addApplication, openPaymentModal, openReceiptModal } = useApp();

  const [serviceMode, setServiceMode] = useState<'termination' | 'addition'>('termination');
  const [selectedVehicleReg, setSelectedVehicleReg] = useState(
    vehicles.length > 0 ? vehicles[0].registrationNo : ''
  );
  const [bankName, setBankName] = useState('State Bank of India (SBI)');
  const [loanAccountNo, setLoanAccountNo] = useState('SBI-AUTO-8821092');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<Application | null>(null);

  const selectedVehicle = vehicles.find((v) => v.registrationNo === selectedVehicleReg) || vehicles[0];
  const fee = serviceMode === 'termination' ? 350 : 550;

  const handleSubmit = () => {
    openPaymentModal(
      serviceMode === 'termination'
        ? 'Termination of Hypothecation / Loan Clearance (Form 35)'
        : 'Endorsement of Hypothecation / Auto Loan (Form 34)',
      {
        baseFee: serviceMode === 'termination' ? 300 : 500,
        userCharges: 50,
        roadTax: 0,
        postalFee: 0,
        total: fee,
      },
      (receipt) => {
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber(serviceMode === 'termination' ? 'HPT' : 'HPA'),
          serviceType:
            serviceMode === 'termination'
              ? 'Termination of Hypothecation (Bank NOC)'
              : 'Endorsement of Hypothecation',
          serviceCategory: 'vehicle',
          applicantName: user?.name || 'Citizen',
          applicantMobile: user?.mobile || '+91 9876543210',
          applicantAadhaarMasked: user?.aadhaar || 'XXXX-XXXX-8924',
          vehicleNo: selectedVehicle?.registrationNo,
          rtoCode: selectedVehicle?.rtoCode || 'MH-02',
          rtoName: selectedVehicle?.rtoName || 'RTO Andheri',
          state: selectedVehicle?.state || 'Maharashtra',
          submittedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          currentStage: 'SCRUTINY',
          stages: [
            {
              stageKey: 'SUBMITTED',
              stageName: `Form ${serviceMode === 'termination' ? '35' : '34'} Application Submitted`,
              timestamp: 'Just now',
              status: 'completed',
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'Bank Loan Endorsement Fee Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${fee} paid via BharatKosh`,
            },
            {
              stageKey: 'SCRUTINY',
              stageName: 'Bank Digital NOC Verification with RTO Desk',
              status: 'current',
            },
            {
              stageKey: 'APPROVED',
              stageName: 'Updated RC Smartcard Issued',
              status: 'pending',
            },
          ],
          documents: [
            {
              name: `Bank No Objection Certificate (NOC) - ${bankName}`,
              type: 'PDF',
              url: 'mock://bank_noc.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
            {
              name: `Form ${serviceMode === 'termination' ? '35' : '34'} Notice`,
              type: 'PDF',
              url: 'mock://form35.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: serviceMode === 'termination' ? 300 : 500,
            userCharges: 50,
            roadTax: 0,
            postalSmartcardFee: 0,
            total: fee,
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

  if (isSuccess && generatedApp) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Hypothecation Request Submitted</h3>
        <p className="text-xs text-slate-600">
          Application Ref:{' '}
          <strong className="font-mono text-blue-950 text-base">{generatedApp.applicationNo}</strong>
        </p>
        <button
          onClick={onCancel}
          className="bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-3xl mx-auto">
      <div className="bg-blue-950 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">Bank Hypothecation Services</h2>
            <p className="text-xs text-blue-200">
              Form 34 (Loan Addition) or Form 35 (Loan Clearance Termination)
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg"
        >
          Cancel
        </button>
      </div>

      <div className="p-6 space-y-5 text-xs">
        {/* Toggle Mode */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setServiceMode('termination')}
            className={`flex-1 py-2 rounded-lg font-bold transition cursor-pointer ${
              serviceMode === 'termination' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Termination of Loan (Form 35)
          </button>
          <button
            onClick={() => setServiceMode('addition')}
            className={`flex-1 py-2 rounded-lg font-bold transition cursor-pointer ${
              serviceMode === 'addition' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Addition of Bank Loan (Form 34)
          </button>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Select Vehicle</label>
          <select
            value={selectedVehicleReg}
            onChange={(e) => setSelectedVehicleReg(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
          >
            {vehicles.map((v) => (
              <option key={v.registrationNo} value={v.registrationNo}>
                {v.registrationNo} - {v.makerModel}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Financing Bank Name</label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
            >
              <option>State Bank of India (SBI)</option>
              <option>HDFC Bank Ltd</option>
              <option>ICICI Bank</option>
              <option>Punjab National Bank (PNB)</option>
              <option>Bank of Baroda</option>
              <option>Kotak Mahindra Bank</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Loan / NOC Reference Number</label>
            <input
              type="text"
              value={loanAccountNo}
              onChange={(e) => setLoanAccountNo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
            />
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Bank API Integration: Digital clearance certificate will be verified in real-time with {bankName}.
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
          <span>Pay ₹{fee} & Submit Form {serviceMode === 'termination' ? '35' : '34'}</span>
        </button>
      </div>
    </div>
  );
};
