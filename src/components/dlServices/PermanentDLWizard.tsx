import React, { useState } from 'react';
import {
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Award,
  Download,
  Car
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../types';
import { generateAppNumber } from '../../utils/helpers';

export const PermanentDLWizard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { user, addApplication, openPaymentModal, openReceiptModal } = useApp();

  const [step, setStep] = useState(1);
  const [llNumber, setLlNumber] = useState('DL01-LL-2026-009812');
  const [testTrackDate, setTestTrackDate] = useState('2026-09-12');
  const [testTrackSlot, setTestTrackSlot] = useState('09:30 AM - 11:00 AM (Slot A)');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<Application | null>(null);

  const totalFee = 650; // ₹400 Permanent DL + ₹50 portal + ₹200 Smartcard postal

  const handleCompletePayment = () => {
    openPaymentModal(
      'Permanent Driving Licence Application & Track Test',
      {
        baseFee: 400,
        userCharges: 50,
        roadTax: 0,
        postalFee: 200,
        total: totalFee,
      },
      (receipt) => {
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber('DL01-PDL'),
          serviceType: 'Conversion to Permanent Driving Licence',
          serviceCategory: 'dl',
          applicantName: user?.name || 'Citizen',
          applicantMobile: user?.mobile || '+91 9876543210',
          applicantAadhaarMasked: user?.aadhaar || 'XXXX-XXXX-8924',
          licenceNo: llNumber,
          rtoCode: 'DL-01',
          rtoName: 'RTO Mall Road (Track Facility)',
          state: 'Delhi',
          submittedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          currentStage: 'INSPECTION_OR_TEST',
          stages: [
            {
              stageKey: 'SUBMITTED',
              stageName: 'Learner Licence (LL) Verification',
              timestamp: 'Just now',
              status: 'completed',
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'Driving Test Track & Smartcard Fee Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${totalFee} paid via BharatKosh`,
            },
            {
              stageKey: 'INSPECTION_OR_TEST',
              stageName: 'Automated Driving Test Track (Sensor Based)',
              timestamp: `${testTrackDate} (${testTrackSlot})`,
              status: 'current',
              remarks: 'Report to RTO Automated Driving Test Track Counter',
            },
            {
              stageKey: 'APPROVED',
              stageName: 'Permanent Smartcard DL Printed & Dispatched',
              status: 'pending',
            },
          ],
          documents: [
            {
              name: 'Valid Learner’s Licence (Form 3)',
              type: 'PDF',
              url: 'mock://ll_form3.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
            {
              name: 'Driving School Form 5 / Self Declaration',
              type: 'PDF',
              url: 'mock://form5.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: 400,
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
            appointmentNo: `APT-DL-TRACK-${Date.now().toString().slice(-4)}`,
            date: testTrackDate,
            timeSlot: testTrackSlot,
            rtoCode: 'DL-01',
            rtoName: 'RTO Mall Road Automated Test Track',
            address: '5/9 Under Hill Road, Civil Lines, Delhi',
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
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <Calendar className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Driving Test Track Slot Confirmed</h3>
        <p className="text-xs text-slate-600">
          Application Reference Number:{' '}
          <strong className="font-mono text-blue-950 text-base">{generatedApp.applicationNo}</strong>
        </p>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-left text-xs space-y-2 text-blue-950">
          <p>
            Test Track Date: <strong>{testTrackDate}</strong>
          </p>
          <p>
            Slot: <strong>{testTrackSlot}</strong>
          </p>
          <p>
            Venue: <strong>RTO Mall Road Automated Sensor Track, Delhi</strong>
          </p>
          <p className="text-[11px] text-blue-800">
            Please carry your Learner’s Licence and Appointment QR pass to the test center.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-blue-950 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">Convert to Permanent Driving Licence</h2>
            <p className="text-xs text-blue-200">
              Form 4 Application for Permanent Smartcard DL with Test Track Booking
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

      <div className="p-6 sm:p-8 space-y-5 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            Active Learner’s Licence Number
          </label>
          <input
            type="text"
            value={llNumber}
            onChange={(e) => setLlNumber(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
          />
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Eligibility Verified: Your Learner Licence is older than 30 days and valid for test track booking.
          </span>
        </div>

        {/* Slot selector */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-700" />
            <span>Select Automated Test Track Appointment Date</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Test Date</label>
              <input
                type="date"
                value={testTrackDate}
                onChange={(e) => setTestTrackDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Track Batch Slot</label>
              <select
                value={testTrackSlot}
                onChange={(e) => setTestTrackSlot(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              >
                <option>09:30 AM - 11:00 AM (Slot A)</option>
                <option>11:00 AM - 12:30 PM (Slot B)</option>
                <option>02:00 PM - 03:30 PM (Slot C)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-xs font-bold text-slate-600">
          Cancel
        </button>
        <button
          onClick={handleCompletePayment}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
        >
          <CreditCard className="w-4 h-4" />
          <span>Pay ₹650 & Confirm Test Slot</span>
        </button>
      </div>
    </div>
  );
};
