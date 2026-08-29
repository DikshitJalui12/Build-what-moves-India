import React, { useState } from 'react';
import {
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  CreditCard,
  Download,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { generateAppNumber } from '../../utils/helpers';

export const RCRenewalWizard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const {
    vehicles,
    user,
    addApplication,
    openPaymentModal,
    openReceiptModal,
    openAppointmentModal,
    t,
  } = useApp();

  const [step, setStep] = useState(1);
  const [selectedVehicleReg, setSelectedVehicleReg] = useState(
    vehicles.length > 0 ? vehicles[0].registrationNo : ''
  );
  const [inspectionDate, setInspectionDate] = useState('2026-09-08');
  const [inspectionSlot, setInspectionSlot] = useState('10:00 AM - 11:30 AM');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<Application | null>(null);

  const selectedVehicle = vehicles.find((v) => v.registrationNo === selectedVehicleReg) || vehicles[0];
  const totalFee = 1250; // ₹1000 renewal + ₹50 user charges + ₹200 smartcard

  const handleCompletePayment = () => {
    openPaymentModal(
      '15-Year RC Renewal & Fitness Re-Registration (Form 25)',
      {
        baseFee: 1000,
        userCharges: 50,
        roadTax: 0,
        postalFee: 200,
        total: totalFee,
      },
      (receipt) => {
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber('RC-REN'),
          serviceType: '15-Year RC Renewal & Fitness Extension',
          serviceCategory: 'vehicle',
          applicantName: user?.name || 'Citizen',
          applicantMobile: user?.mobile || '+91 9876543210',
          applicantAadhaarMasked: user?.aadhaar || 'XXXX-XXXX-8924',
          vehicleNo: selectedVehicle?.registrationNo,
          rtoCode: selectedVehicle?.rtoCode || 'DL-01',
          rtoName: selectedVehicle?.rtoName || 'RTO Mall Road',
          state: selectedVehicle?.state || 'Delhi',
          submittedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          currentStage: 'INSPECTION_OR_TEST',
          stages: [
            {
              stageKey: 'SUBMITTED',
              stageName: 'Form 25 Renewal Application Submitted',
              timestamp: 'Just now',
              status: 'completed',
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'RC Renewal & Inspection Fee Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${totalFee} paid via BharatKosh`,
            },
            {
              stageKey: 'INSPECTION_OR_TEST',
              stageName: 'Automated Vehicle Fitness Inspection Track',
              timestamp: `${inspectionDate} (${inspectionSlot})`,
              status: 'current',
              remarks: `Scheduled at ${selectedVehicle?.rtoName}`,
            },
            {
              stageKey: 'SCRUTINY',
              stageName: 'Fitness Clearance & 5-Year RC Extension',
              status: 'pending',
            },
            {
              stageKey: 'APPROVED',
              stageName: 'Renewed Smartcard RC Dispatched',
              status: 'pending',
            },
          ],
          documents: [
            {
              name: 'Application Form 25 for RC Renewal',
              type: 'PDF',
              url: 'mock://form25.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
            {
              name: 'Existing Original RC Card',
              type: 'PDF',
              url: 'mock://rc_orig.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
            {
              name: 'Valid Insurance & PUC Certificate',
              type: 'PDF',
              url: 'mock://puc_ins.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: 1000,
            userCharges: 50,
            roadTax: 0,
            postalSmartcardFee: 200,
            total: totalFee,
            paymentStatus: 'PAID',
            transactionId: receipt.transactionId,
            paymentDate: new Date().toLocaleString('en-IN'),
            receiptNo: receipt.receiptNo,
          },
          appointment: {
            appointmentNo: `APT-REN-${Date.now().toString().slice(-4)}`,
            date: inspectionDate,
            timeSlot: inspectionSlot,
            rtoCode: selectedVehicle?.rtoCode || 'DL-01',
            rtoName: selectedVehicle?.rtoName || 'RTO Mall Road',
            address: 'Vehicle Inspection Track, Counter 3',
          },
          estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
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
            Inspection Booked & Fee Paid
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">
            RC Renewal Request Registered
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Application Number:{' '}
            <strong className="font-mono text-blue-950 text-base">{generatedApp.applicationNo}</strong>
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-left text-xs space-y-2 text-blue-950">
          <div className="flex items-center gap-2 font-bold">
            <Calendar className="w-4 h-4 text-blue-700" />
            <span>Inspection Track Appointment Details:</span>
          </div>
          <p>
            Date: <strong>{inspectionDate}</strong> | Slot: <strong>{inspectionSlot}</strong>
          </p>
          <p>Location: <strong>{selectedVehicle?.rtoName} (Track Counter 3)</strong></p>
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
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">15-Year RC Renewal & Fitness Inspection</h2>
            <p className="text-xs text-blue-200">
              Form 25 Application for 5-Year RC Validity Extension
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

      {/* Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              {t.step} 1: Choose Vehicle & Select Fitness Inspection Slot
            </h3>

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
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-black text-sm text-blue-950">
                      {v.registrationNo}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">{v.vehicleClass}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{v.makerModel}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Expiry: {v.rcExpiryDate}</p>
                </div>
              ))}
            </div>

            {/* Appointment Slot Picker */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span>Select Inspection Date & Time Slot at {selectedVehicle?.rtoName}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inspection Date</label>
                  <input
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={inspectionSlot}
                    onChange={(e) => setInspectionSlot(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  >
                    <option>10:00 AM - 11:30 AM</option>
                    <option>11:30 AM - 01:00 PM</option>
                    <option>02:00 PM - 03:30 PM</option>
                    <option>03:30 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleCompletePayment}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay ₹1,250 & Confirm Slot</span>
        </button>
      </div>
    </div>
  );
};
