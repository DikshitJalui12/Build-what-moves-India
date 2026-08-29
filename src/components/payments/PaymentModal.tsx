import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Landmark,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  RefreshCw,
  Lock,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, generateReceiptNumber, generateTxnId } from '../../utils/helpers';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const { paymentModal, closePaymentModal, user } = useApp();

  const [paymentMode, setPaymentMode] = useState<'upi_qr' | 'upi_id' | 'netbanking' | 'card'>('upi_qr');
  const [upiId, setUpiId] = useState('rajesh.sharma@okaxis');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('891');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!paymentModal.isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setPaymentError(null);

    setTimeout(() => {
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      const receipt = {
        receiptNo: generateReceiptNumber(),
        transactionId: generateTxnId(),
        serviceTitle: paymentModal.serviceTitle,
        applicationNo: paymentModal.applicationNo || 'PAR-2026-99120',
        amount: paymentModal.fees.total,
        paymentMode:
          paymentMode === 'upi_qr'
            ? 'UPI (Dynamic QR Scan)'
            : paymentMode === 'upi_id'
            ? `UPI ID (${upiId})`
            : paymentMode === 'netbanking'
            ? `Net Banking (${selectedBank})`
            : 'Debit / Credit Card',
        paymentDate: new Date().toLocaleString('en-IN'),
        applicantName: user?.name || 'Citizen',
        rtoName: 'Transport Department, Government of India',
      };

      paymentModal.onSuccess(receipt);
      closePaymentModal();
    }, 1200);
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentError('Bank Gateway Timeout (ERR_BANK_504). Please retry or select another payment mode.');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">BharatKosh Non-Tax Gateway</h3>
              <p className="text-xs text-blue-200">
                Official Ministry of Road Transport & Highways Payment Desk
              </p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fee Itemization Box */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 text-xs space-y-1.5">
          <div className="flex justify-between font-bold text-slate-800 pb-1 border-b border-slate-200">
            <span>Service: {paymentModal.serviceTitle}</span>
            {paymentModal.applicationNo && (
              <span className="font-mono text-blue-950">App #{paymentModal.applicationNo}</span>
            )}
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Base Application / Statutory Fee:</span>
            <span>{formatCurrency(paymentModal.fees.baseFee)}</span>
          </div>
          {paymentModal.fees.userCharges > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Digital Portal & E-Governance Charges:</span>
              <span>{formatCurrency(paymentModal.fees.userCharges)}</span>
            </div>
          )}
          {paymentModal.fees.postalFee > 0 && (
            <div className="flex justify-between text-slate-600">
              <span>Smartcard Chip & Postal SpeedPost Dispatch:</span>
              <span>{formatCurrency(paymentModal.fees.postalFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Payable:</span>
            <span className="text-emerald-700 font-mono text-base">
              {formatCurrency(paymentModal.fees.total)}
            </span>
          </div>
        </div>

        {/* Payment Error Banner if simulated */}
        {paymentError && (
          <div className="bg-rose-50 border-b border-rose-200 p-3 text-xs text-rose-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{paymentError}</span>
            </div>
            <button
              onClick={() => setPaymentError(null)}
              className="text-xs font-bold text-rose-700 hover:underline shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Payment Mode Selector */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-4 gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setPaymentMode('upi_qr')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMode === 'upi_qr'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="text-[10px]">UPI QR</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('upi_id')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMode === 'upi_id'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-[10px]">UPI ID</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('netbanking')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMode === 'netbanking'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span className="text-[10px]">NetBanking</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMode('card')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                paymentMode === 'card'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[10px]">Cards</span>
            </button>
          </div>

          {/* Mode Content */}
          {paymentMode === 'upi_qr' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="inline-block p-3 bg-white rounded-2xl shadow-md border-2 border-slate-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=bharatkosh@nic&pn=MORTH_GOV&am=${paymentModal.fees.total}&cu=INR`}
                  alt="UPI QR"
                  className="w-36 h-36 mx-auto"
                />
              </div>
              <p className="text-xs font-semibold text-slate-700">
                Scan with <strong>Google Pay, PhonePe, Paytm, BHIM</strong>, or any UPI App
              </p>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-bold">
                <span>Auto-expiring in 04:59</span>
              </div>
            </div>
          )}

          {paymentMode === 'upi_id' && (
            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700">Enter Virtual Payment Address (VPA / UPI ID)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okhdfcbank"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
              />
              <p className="text-[11px] text-slate-500">
                A collect request for {formatCurrency(paymentModal.fees.total)} will be sent to your UPI App.
              </p>
            </div>
          )}

          {paymentMode === 'netbanking' && (
            <div className="space-y-3 text-xs">
              <label className="block font-bold text-slate-700">Select Bank for Internet Banking</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
              >
                <option>State Bank of India (SBI)</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Punjab National Bank (PNB)</option>
                <option>Bank of Baroda</option>
                <option>Canara Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {paymentMode === 'card' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Number (RuPay, Visa, Master)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-[11px] text-emerald-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encrypted Government Payment Gateway • Zero Surcharge</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSimulateFailure}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Simulate Gateway Failure
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePayNow}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize {formatCurrency(paymentModal.fees.total)} & Pay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
