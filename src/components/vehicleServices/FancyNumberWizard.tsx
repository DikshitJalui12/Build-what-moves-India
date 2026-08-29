import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Search, CreditCard, Tag, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, generateAppNumber } from '../../utils/helpers';
import { Application } from '../../types';

export const FancyNumberWizard: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { user, addApplication, openPaymentModal, openReceiptModal } = useApp();

  const [searchDigits, setSearchDigits] = useState('0007');
  const [selectedNumber, setSelectedNumber] = useState<{ number: string; category: string; price: number } | null>({
    number: 'DL-01-CZ-0007',
    category: 'Super VIP (Category 1)',
    price: 50000,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [appData, setAppData] = useState<Application | null>(null);

  const availableNumbers = [
    { number: 'DL-01-CZ-0001', category: 'Super VIP', price: 100000 },
    { number: 'DL-01-CZ-0007', category: 'Super VIP', price: 50000 },
    { number: 'DL-01-CZ-9999', category: 'VIP Quad', price: 35000 },
    { number: 'DL-01-CZ-1111', category: 'VIP Quad', price: 35000 },
    { number: 'DL-01-CZ-0786', category: 'Auspicious', price: 20000 },
    { number: 'DL-01-CZ-8055', category: 'Stylized (BOSS)', price: 15000 },
    { number: 'DL-01-CZ-0099', category: 'Double Digits', price: 10000 },
  ];

  const handleBookNumber = () => {
    if (!selectedNumber) return;

    openPaymentModal(
      `Choice / VIP Number Booking (${selectedNumber.number})`,
      {
        baseFee: selectedNumber.price,
        userCharges: 200,
        roadTax: 0,
        postalFee: 0,
        total: selectedNumber.price + 200,
      },
      (receipt) => {
        const newApp: Application = {
          id: `APP-${Date.now()}`,
          applicationNo: generateAppNumber('VIP-NUM'),
          serviceType: `Choice VIP Number Plate Allotment (${selectedNumber.number})`,
          serviceCategory: 'vehicle',
          applicantName: user?.name || 'Citizen',
          applicantMobile: user?.mobile || '+91 9876543210',
          applicantAadhaarMasked: user?.aadhaar || 'XXXX-XXXX-8924',
          rtoCode: 'DL-01',
          rtoName: 'RTO Mall Road',
          state: 'Delhi',
          submittedDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          currentStage: 'APPROVED',
          stages: [
            {
              stageKey: 'SUBMITTED',
              stageName: `Choice Number ${selectedNumber.number} Selected`,
              timestamp: 'Just now',
              status: 'completed',
            },
            {
              stageKey: 'PAYMENT_COMPLETED',
              stageName: 'VIP Registration Number Booking Fee Paid',
              timestamp: 'Just now',
              status: 'completed',
              remarks: `₹${selectedNumber.price + 200} paid via BharatKosh`,
            },
            {
              stageKey: 'APPROVED',
              stageName: 'Allotment Letter Issued (Valid for 90 Days)',
              timestamp: 'Just now',
              status: 'completed',
              remarks: 'Present this allotment certificate to vehicle dealer for HSRP stamping',
            },
          ],
          documents: [
            {
              name: 'VIP Number Allotment Certificate',
              type: 'PDF',
              url: 'mock://vip_allotment.pdf',
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'VERIFIED',
            },
          ],
          feeDetails: {
            applicationFee: selectedNumber.price,
            userCharges: 200,
            roadTax: 0,
            postalSmartcardFee: 0,
            total: selectedNumber.price + 200,
            paymentStatus: 'PAID',
            transactionId: receipt.transactionId,
            paymentDate: new Date().toLocaleString('en-IN'),
            receiptNo: receipt.receiptNo,
          },
          estimatedCompletionDate: new Date().toISOString().split('T')[0],
        };

        addApplication(newApp);
        setAppData(newApp);
        setIsSuccess(true);
      }
    );
  };

  if (isSuccess && appData) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center max-w-2xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">VIP Number Reserved!</h3>
        <div className="bg-slate-900 text-amber-400 font-mono text-2xl font-black p-4 rounded-2xl border-2 border-amber-400 inline-block shadow-lg">
          {selectedNumber?.number}
        </div>
        <p className="text-xs text-slate-600">
          Allotment Letter Ref: <strong className="font-mono text-blue-950">{appData.applicationNo}</strong>
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      <div className="bg-linear-to-r from-slate-950 via-blue-950 to-slate-900 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">Fancy & Choice Number Plate Booking</h2>
            <p className="text-xs text-blue-200">
              E-Auction & Direct Booking for VIP Vehicle Registration Numbers
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

      <div className="p-6 sm:p-8 space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchDigits}
            onChange={(e) => setSearchDigits(e.target.value)}
            placeholder="Search digits e.g. 0007, 9999, 8055..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono"
          />
          <button className="bg-blue-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer">
            <Search className="w-4 h-4" />
            <span>Search RTO Pool</span>
          </button>
        </div>

        {/* Available Numbers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availableNumbers.map((n) => (
            <div
              key={n.number}
              onClick={() => setSelectedNumber(n)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                selectedNumber?.number === n.number
                  ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-300/40'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="bg-slate-900 text-white font-mono font-black text-center py-2 rounded-lg text-sm tracking-wider border border-slate-700 shadow-inner mb-2">
                {n.number}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[11px] font-semibold text-slate-500">{n.category}</span>
                <strong className="text-emerald-700">{formatCurrency(n.price)}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-xs font-bold text-slate-600">
          Cancel
        </button>
        <button
          onClick={handleBookNumber}
          disabled={!selectedNumber}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <CreditCard className="w-4 h-4" />
          <span>Book {selectedNumber?.number} ({formatCurrency((selectedNumber?.price || 0) + 200)})</span>
        </button>
      </div>
    </div>
  );
};
