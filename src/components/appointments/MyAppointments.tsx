import React from 'react';
import { Calendar, Clock, MapPin, QrCode, XCircle, RefreshCw, CheckCircle2, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';

export const MyAppointments: React.FC = () => {
  const { appointments, cancelAppointment, openAppointmentModal, vehicles } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">My RTO Appointments & Visits</h2>
          </div>
          <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
            View upcoming and past RTO counter appointments. Download QR check-in entry passes for expedited counter service.
          </p>
        </div>

        <button
          onClick={() =>
            openAppointmentModal(
              'Document Scrutiny & Verification',
              vehicles[0]?.registrationNo || 'GEN-VISIT',
              'DL-01'
            )
          }
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-950 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {apt.bookingNo}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    apt.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : apt.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-800'
                      : apt.status === 'CANCELLED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm mb-1">{apt.serviceName}</h3>
              <p className="text-xs text-slate-500 mb-3">
                Target Identifier: <strong>{apt.identifier}</strong>
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1.5 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>Date: <strong>{formatDate(apt.date)}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Time Slot: <strong>{apt.timeSlot}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="truncate">{apt.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={apt.qrCodeUrl}
                  alt="QR"
                  className="w-10 h-10 border p-0.5 rounded-lg bg-white"
                />
                <span className="text-[10px] text-slate-400 block leading-tight">
                  Scan at RTO Reception
                </span>
              </div>

              {apt.status === 'CONFIRMED' && (
                <button
                  onClick={() => cancelAppointment(apt.id)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                >
                  Cancel Slot
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
