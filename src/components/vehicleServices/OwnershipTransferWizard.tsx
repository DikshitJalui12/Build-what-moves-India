import React, { useState } from 'react';
import {
  Car,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  FileText,
  User,
  AlertCircle,
  CreditCard,
  Download,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, Vehicle } from '../../types';
import { formatCurrency, generateAppNumber, generateTxnId } from '../../utils/helpers';

export const OwnershipTransferWizard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const {
    vehicles,
    user,
    addApplication,
    openPaymentModal,
    openReceiptModal,
    saveFormDraft,
    getFormDraft,
    clearFormDraft,
    t,
  } = useApp();

  const draft = getFormDraft('ownership-transfer');

  const [step, setStep] = useState(draft?.step || 1);
  const [selectedVehicleReg, setSelectedVehicleReg] = useState(
    draft?.data?.selectedVehicleReg || (vehicles.length > 0 ? vehicles[0].registrationNo : '')
  );

  // Buyer Form Data
  const [buyerName, setBuyerName] = useState(draft?.data?.buyerName || 'Amitabh Roy');
  const [buyerMobile, setBuyerMobile] = useState(draft?.data?.buyerMobile || '9812345678');
  const [buyerAadhaar, setBuyerAadhaar] = useState(draft?.data?.buyerAadhaar || '7788 9900 1234');
  const [buyerAddress, setBuyerAddress] = useState(
    draft?.data?.buyerAddress || 'Plot 12, Baner Road, Pune, Maharashtra 411045'
  );
  const [saleAmount, setSaleAmount] = useState(draft?.data?.saleAmount || '650000');
  const [buyerOtp, setBuyerOtp] = useState('892101');
  const [buyerOtpVerified, setBuyerOtpVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<Application | null>(null);

  const selectedVehicle = vehicles.find((v) => v.registrationNo === selectedVehicleReg) || vehicles[0];

  const totalFee = 530; // ₹300 transfer + ₹50 user charge + ₹180 smartcard dispatch

  const handleNext = () => {
    saveFormDraft('ownership-transfer', step + 1, {
      selectedVehicleReg,
      buyerName,
      buyerMobile,
      buyerAadhaar,
      buyerAddress,
      saleAmount,
    });
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleVerifyBuyerOtp = () => {
    setBuyerOtpVerified(true);
  };

  const handleCompleteTransferPayment = () => {
    openPaymentModal(
      'Transfer of Vehicle Ownership (Form 29/30)',
      {
        baseFee: 300,
        userCharges: 50,
        roadTax: 0,
        postalFee: 180,
        total: totalFee,
      },
      (receipt) => {
        clearFormDraft('ownership-transfer');
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber('MH02-TO'),
          serviceType: 'Transfer of Vehicle Ownership',
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
              stageName: 'Notice of Transfer (Form 29/30) Submitted',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `Transferred from ${user?.name} to ${buyerName}`,
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'Statutory RTO Transfer Fees Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${totalFee} paid via BharatKosh Gateway`,
            },
            {
              stageKey: 'SCRUTINY',
              stageName: 'RTO Officer Document Verification',
              status: 'current',
              remarks: 'Assigned to Assistant RTO Scrutiny Queue',
            },
            {
              stageKey: 'INSPECTION_OR_TEST',
              stageName: 'State Crime Record (SCRB) Clearance',
              status: 'pending',
            },
            {
              stageKey: 'APPROVED',
              stageName: 'New Smartcard RC Generated & Vault Sync',
              status: 'pending',
            },
          ],
          documents: [
            {
              name: 'Digital Form 29 (Notice of Transfer)',
              type: 'PDF',
              url: 'mock://form29.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
            {
              name: 'Digital Form 30 (Application for Intimation & Transfer)',
              type: 'PDF',
              url: 'mock://form30.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
            {
              name: 'Buyer Aadhaar & Address Proof',
              type: 'PDF',
              url: 'mock://buyer_aadhaar.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: 300,
            userCharges: 50,
            roadTax: 0,
            postalSmartcardFee: 180,
            total: totalFee,
            paymentStatus: 'PAID',
            transactionId: receipt.transactionId,
            paymentDate: new Date().toLocaleString('en-IN'),
            receiptNo: receipt.receiptNo,
          },
          estimatedCompletionDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
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
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full uppercase">
            Application Submitted Successfully
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            Vehicle Ownership Transfer Initiated
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Application Reference Number:{' '}
            <strong className="font-mono text-blue-950 text-base">{generatedApp.applicationNo}</strong>
          </p>
        </div>

        {/* Transfer Handshake Summary Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-sans">Vehicle Reg:</span>
            <strong className="text-slate-900">{generatedApp.vehicleNo}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-sans">Registered Seller:</span>
            <strong className="text-slate-900">{user?.name}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-sans">Intended Buyer:</span>
            <strong className="text-slate-900">{buyerName}</strong>
          </div>
          <div className="flex justify-between text-emerald-800 font-bold pt-1 font-sans">
            <span>Transfer Fee Paid:</span>
            <span>₹{totalFee} (BharatKosh Receipt Generated)</span>
          </div>
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
            <span>Download Tax Receipt & Slip</span>
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
      {/* Wizard Header */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">
              Transfer of Vehicle Ownership (Form 29 & Form 30)
            </h2>
            <p className="text-xs text-blue-200">
              Guided Paperless Handshake between Registered Seller and Buyer
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-bold">
        {[
          { num: 1, title: 'Select Vehicle' },
          { num: 2, title: 'Buyer e-KYC' },
          { num: 3, title: 'Form 29/30 Preview' },
          { num: 4, title: 'Payment & Submission' },
        ].map((st) => (
          <div
            key={st.num}
            className={`flex items-center gap-2 ${
              step >= st.num ? 'text-blue-900 font-extrabold' : 'text-slate-400 font-medium'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step > st.num
                  ? 'bg-emerald-600 text-white'
                  : step === st.num
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > st.num ? '✓' : st.num}
            </span>
            <span className="hidden sm:inline">{st.title}</span>
          </div>
        ))}
      </div>

      {/* Wizard Content Body */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: Select Vehicle & Check Eligibility */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {t.step} 1: Select Registered Vehicle to Transfer
              </h3>
              <p className="text-xs text-slate-500">
                Choose the vehicle currently registered in your name that you wish to transfer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vehicles.map((v) => (
                <div
                  key={v.registrationNo}
                  onClick={() => setSelectedVehicleReg(v.registrationNo)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                    selectedVehicleReg === v.registrationNo
                      ? 'border-blue-900 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-black text-sm text-blue-950 bg-white border border-slate-300 px-2 py-0.5 rounded">
                      {v.registrationNo}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">{v.vehicleClass}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{v.makerModel}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">RTO: {v.rtoName}</p>
                </div>
              ))}
            </div>

            {/* Selected Vehicle Clearance Checklist */}
            {selectedVehicle && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Pre-Transfer Automated Clearance Checks:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>No Pending Fines</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Valid Registration Certificate</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>NOC Bank Financed Check Clear</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Buyer Details & Aadhaar OTP Handshake */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {t.step} 2: Enter Buyer Identity & e-KYC Verification
              </h3>
              <p className="text-xs text-slate-500">
                The buyer will receive a secure digital consent request to confirm transfer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Buyer Full Name</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Buyer Mobile Number</label>
                <input
                  type="tel"
                  value={buyerMobile}
                  onChange={(e) => setBuyerMobile(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Buyer Aadhaar Number</label>
                <input
                  type="text"
                  value={buyerAadhaar}
                  onChange={(e) => setBuyerAadhaar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Agreed Sale Price (₹)</label>
                <input
                  type="number"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Buyer New Residential Address (For RC Smartcard Dispatch)
                </label>
                <textarea
                  rows={2}
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Buyer OTP Consent Simulation */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Buyer Aadhaar e-Consent Handshake (Demo):
                </span>
                <span className="text-[10px] text-amber-700 font-bold bg-white px-2 py-0.5 rounded">
                  SMS Code: 892101
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={buyerOtp}
                  onChange={(e) => setBuyerOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-40 text-center font-mono font-bold bg-white border border-amber-300 rounded-xl py-1.5 text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleVerifyBuyerOtp}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-1.5 rounded-xl transition cursor-pointer text-xs"
                >
                  {buyerOtpVerified ? '✓ Consent Verified' : 'Verify Buyer Consent'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Form 29 & Form 30 Digital Auto-Generation */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {t.step} 3: Review Auto-Generated Statutory Forms (Form 29 & 30)
              </h3>
              <p className="text-xs text-slate-500">
                The system has pre-populated official Central Motor Vehicle Rules transfer documents with digital e-Signs.
              </p>
            </div>

            {/* Form 29 Document Preview Box */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-5 text-xs space-y-3 font-serif">
              <div className="text-center border-b border-slate-300 pb-2">
                <h4 className="font-black text-sm uppercase tracking-wide">FORM 29</h4>
                <p className="text-[11px] text-slate-600">
                  [See Rule 55(1) of the Central Motor Vehicles Rules, 1989]
                </p>
                <p className="text-[11px] font-bold text-slate-800">
                  NOTICE OF TRANSFER OF OWNERSHIP OF A MOTOR VEHICLE
                </p>
              </div>

              <div className="space-y-2 text-[11px] leading-relaxed text-slate-800">
                <p>
                  To: The Registering Authority, <strong>{selectedVehicle?.rtoName}</strong>.
                </p>
                <p>
                  I, <strong>{user?.name}</strong> (Resident of {user?.address}), hereby give notice that I have on this day transferred the motor vehicle bearing registration number{' '}
                  <strong className="font-mono">{selectedVehicle?.registrationNo}</strong>, Chassis Number{' '}
                  <strong className="font-mono">{selectedVehicle?.chassisNo}</strong>, to{' '}
                  <strong>{buyerName}</strong> for the sum of ₹{Number(saleAmount).toLocaleString('en-IN')}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-300 font-sans text-xs">
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-emerald-900">
                  <span className="text-[10px] text-emerald-700 block font-bold">SELLER E-SIGN:</span>
                  <strong>{user?.name} (Aadhaar Verified)</strong>
                </div>
                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-emerald-900">
                  <span className="text-[10px] text-emerald-700 block font-bold">BUYER E-SIGN:</span>
                  <strong>{buyerName} (Consent Verified)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Fee Summary & Trigger Payment */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {t.step} 4: Statutory RTO Fee Breakdown & BharatKosh Checkout
              </h3>
              <p className="text-xs text-slate-500">
                Review transparent statutory fee items before proceeding to government payment gateway.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>Transfer of Ownership Statutory Fee:</span>
                <span className="font-bold text-slate-900">₹300.00</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>Digital Portal User Charges:</span>
                <span className="font-bold text-slate-900">₹50.00</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>New Smartcard RC & SpeedPost Dispatch:</span>
                <span className="font-bold text-slate-900">₹180.00</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-extrabold text-slate-900">
                <span>Total Statutory Amount Payable:</span>
                <span className="text-emerald-700">₹530.00</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-xs flex items-center gap-3 text-blue-950">
              <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0" />
              <div>
                <strong>Zero Bureaucratic Visit Required:</strong> Once fee is processed, your application is routed straight to the RTO Scrutiny Officer desk for digital approval.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <button
            onClick={handleNext}
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <span>Continue to Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCompleteTransferPayment}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer animate-pulse"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay ₹530 & Submit Transfer</span>
          </button>
        )}
      </div>
    </div>
  );
};
