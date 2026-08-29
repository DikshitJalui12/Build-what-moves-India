import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Download,
  Upload,
  User,
  Building2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Application } from '../../types';
import { formatDate } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

interface ApplicationTrackerProps {
  applications: Application[];
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ applications }) => {
  const { openReceiptModal, openAppointmentModal, t } = useApp();
  const [expandedAppId, setExpandedAppId] = useState<string | null>(
    applications.length > 0 ? applications[0].id : null
  );

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-800">{t.activeAppsHeading}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          {t.activeAppsSubheading}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const isExpanded = expandedAppId === app.id;

        return (
          <div
            key={app.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* Header / Summary Bar */}
            <div
              onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
              className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition border-b border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                    app.currentStage === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : app.currentStage === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-blue-100 text-blue-900'
                  }`}
                >
                  {app.serviceCategory === 'vehicle' ? 'RC' : 'DL'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {app.serviceType}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {app.applicationNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                    <span>
                      Target: <strong>{app.vehicleNo || app.licenceNo || 'New Registration'}</strong>
                    </span>
                    <span>•</span>
                    <span>{app.rtoName}</span>
                    <span>•</span>
                    <span>Submitted {formatDate(app.submittedDate)}</span>
                  </p>
                </div>
              </div>

              {/* Status Badge & Toggle Arrow */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                      app.currentStage === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.currentStage === 'SCRUTINY'
                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {app.currentStage === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {app.currentStage === 'SCRUTINY' && <Clock className="w-3.5 h-3.5" />}
                    <span>{t.step}: {app.currentStage}</span>
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    Est. Completion: {formatDate(app.estimatedCompletionDate)}
                  </span>
                </div>

                <div
                  className={`p-1.5 rounded-lg bg-slate-100 text-slate-600 transition transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Expanded Detailed 5-Stage Timeline */}
            {isExpanded && (
              <div className="p-5 sm:p-6 bg-slate-50/50 border-t border-slate-100 space-y-6">
                {/* Visual Stage Steps Line */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                    {t.activeAppsHeading}
                  </h4>

                  <div className="relative">
                    {/* Stepper Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {app.stages.map((stage, idx) => {
                        const isDone = stage.status === 'completed';
                        const isCurrent = stage.status === 'current';
                        const isPending = stage.status === 'pending';

                        return (
                          <div
                            key={stage.stageKey}
                            className={`p-3.5 rounded-xl border text-xs relative transition ${
                              isDone
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                                : isCurrent
                                ? 'bg-white border-amber-400 ring-2 ring-amber-300/50 text-slate-900 shadow-sm'
                                : 'bg-slate-100/70 border-slate-200 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : isCurrent
                                    ? 'bg-amber-500 text-slate-950 animate-bounce'
                                    : 'bg-slate-300 text-slate-600'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </span>

                              {stage.timestamp && (
                                <span className="text-[10px] font-medium text-slate-500">
                                  {stage.timestamp}
                                </span>
                              )}
                            </div>

                            <div className="font-bold text-xs leading-snug mb-1">
                              {stage.stageName}
                            </div>

                            {stage.remarks && (
                              <p className="text-[11px] text-slate-600 italic bg-white/60 p-1.5 rounded-md mt-1 border border-slate-200/50">
                                "{stage.remarks}"
                              </p>
                            )}

                            {stage.officerName && (
                              <div className="text-[10px] text-blue-900 font-semibold mt-1 flex items-center gap-1">
                                <User className="w-3 h-3 text-blue-700" />
                                <span>{stage.officerName}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents Scrutiny Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <h5 className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
                      <span>Submitted Documents ({app.documents.length})</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {t.digiLockerBadge}
                      </span>
                    </h5>
                    <ul className="space-y-2 text-xs">
                      {app.documents.map((doc, dIdx) => (
                        <li
                          key={dIdx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-800" />
                            <span className="font-medium text-slate-800">{doc.name}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              doc.status === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : doc.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fee Payment & Official Slip Box */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 mb-2">
                        Statutory Fee & Payment Receipt
                      </h5>
                      <div className="space-y-1 text-xs text-slate-600 mb-3">
                        <div className="flex justify-between">
                          <span>Application / Service Fee:</span>
                          <span className="font-semibold">₹{app.feeDetails.applicationFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>RTO User Charges:</span>
                          <span className="font-semibold">₹{app.feeDetails.userCharges}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Smartcard Postal Dispatch:</span>
                          <span className="font-semibold">₹{app.feeDetails.postalSmartcardFee}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900 text-sm">
                          <span>Total Paid (BharatKosh):</span>
                          <span className="text-emerald-700">₹{app.feeDetails.total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() =>
                          openReceiptModal({
                            receiptNo: app.feeDetails.receiptNo || 'MORTH-REC-882190',
                            applicationNo: app.applicationNo,
                            serviceType: app.serviceType,
                            applicantName: app.applicantName,
                            amount: app.feeDetails.total,
                            transactionId: app.feeDetails.transactionId,
                            date: app.feeDetails.paymentDate,
                            rtoName: app.rtoName,
                          })
                        }
                        className="flex-1 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.downloadReceipt}</span>
                      </button>

                      {app.appointment && (
                        <button
                          onClick={() =>
                            openAppointmentModal(
                              app.serviceType,
                              app.vehicleNo || app.licenceNo || '',
                              app.rtoCode
                            )
                          }
                          className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-blue-700" />
                          <span>Appointment Pass</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
