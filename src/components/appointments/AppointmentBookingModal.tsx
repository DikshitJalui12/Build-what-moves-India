import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentSlot } from '../../types';
import { generateAppNumber } from '../../utils/helpers';

export const AppointmentBookingModal: React.FC = () => {
  const {
    appointmentModal,
    closeAppointmentModal,
    addAppointment,
    rtoOffices,
    user,
  } = useApp();

  const [selectedRtoCode, setSelectedRtoCode] = useState(
    appointmentModal.rtoCode || rtoOffices[0].code
  );
  const [selectedDate, setSelectedDate] = useState('2026-09-05');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM - 11:30 AM (Counter 2)');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<AppointmentSlot | null>(null);

  if (!appointmentModal.isOpen) return null;

  const currentRto = rtoOffices.find((r) => r.code === selectedRtoCode) || rtoOffices[0];

  const handleConfirmBooking = () => {
    const bookingNo = `APT-${selectedRtoCode}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSlot: AppointmentSlot = {
      id: `APT-${Date.now()}`,
      bookingNo,
      serviceName: appointmentModal.serviceName,
      applicantName: user?.name || 'Citizen',
      applicantMobile: user?.mobile || '+91 9876543210',
      identifier: appointmentModal.identifier,
      rtoCode: currentRto.code,
      rtoName: currentRto.name,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'CONFIRMED',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=APT:${bookingNo}|RTO:${currentRto.code}|DATE:${selectedDate}`,
      address: currentRto.address,
    };

    addAppointment(newSlot);
    if (appointmentModal.onSuccess) {
      appointmentModal.onSuccess(newSlot);
    }
    setBookedSlot(newSlot);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold">Schedule RTO Visit Appointment</h3>
              <p className="text-xs text-blue-200">{appointmentModal.serviceName}</p>
            </div>
          </div>
          <button
            onClick={closeAppointmentModal}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <div className="p-6 space-y-4 text-xs overflow-y-auto">
            {/* RTO Office Picker */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Designated RTO Office</label>
              <select
                value={selectedRtoCode}
                onChange={(e) => setSelectedRtoCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-bold"
              >
                {rtoOffices.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.code} - {r.name} ({r.state})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                {currentRto.address}
              </p>
            </div>

            {/* Date and Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Counter Slot</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option>09:30 AM - 11:00 AM (Counter 1)</option>
                  <option>10:00 AM - 11:30 AM (Counter 2)</option>
                  <option>11:30 AM - 01:00 PM (Counter 3)</option>
                  <option>02:00 PM - 03:30 PM (Counter 4)</option>
                  <option>03:30 PM - 05:00 PM (Counter 5)</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
              <span>
                <strong>Express Counter Access:</strong> Your appointment slip includes a digital QR code for instant entry at the RTO reception token desk.
              </span>
            </div>
          </div>
        ) : (
          /* Booked Pass View */
          <div className="p-6 text-center space-y-4 text-xs overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">RTO Appointment Confirmed!</h4>
              <p className="text-slate-500 font-mono text-xs mt-0.5">
                Booking ID: <strong>{bookedSlot?.bookingNo}</strong>
              </p>
            </div>

            {/* QR Pass Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
              <img
                src={bookedSlot?.qrCodeUrl}
                alt="Appointment QR"
                className="w-32 h-32 mx-auto border p-1 rounded-xl bg-white shadow-xs"
              />
              <div className="text-slate-800 font-bold text-xs">{bookedSlot?.serviceName}</div>
              <p className="text-slate-600">
                Date: <strong>{bookedSlot?.date}</strong> | Slot: <strong>{bookedSlot?.timeSlot}</strong>
              </p>
              <p className="text-[11px] text-slate-500">{bookedSlot?.address}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          {!isSuccess ? (
            <>
              <button
                onClick={closeAppointmentModal}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <span>Confirm & Generate QR Pass</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={closeAppointmentModal}
              className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Done & Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
