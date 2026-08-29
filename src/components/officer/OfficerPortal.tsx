import React, { useState } from 'react';
import {
  Building2,
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  FileText,
  User,
  ShieldCheck,
  TrendingUp,
  Award,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStageCode } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';
import confetti from 'canvas-confetti';

export const OfficerPortal: React.FC = () => {
  const { applications, updateApplicationStage, user } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'scrutiny' | 'analytics' | 'test_entry'>('queue');
  const [selectedApp, setSelectedApp] = useState<Application | null>(
    applications.length > 0 ? applications[0] : null
  );
  const [officerRemarks, setOfficerRemarks] = useState('All statutory documents verified and found compliant with CMVR 1989.');
  const [testCandidateDl, setTestCandidateDl] = useState('DL01-LL-2026-009812');
  const [testResult, setTestResult] = useState<'PASS' | 'FAIL'>('PASS');
  const [testTrackNotes, setTestTrackNotes] = useState('Completed 8-track, parallel parking, and gradient restart test with zero sensor penalties.');
  const [testEntrySuccess, setTestEntrySuccess] = useState(false);

  const pendingApps = applications.filter(
    (a) => a.currentStage === 'SCRUTINY' || a.currentStage === 'INSPECTION_OR_TEST'
  );

  const handleApprove = () => {
    if (!selectedApp) return;

    try {
      confetti({ particleCount: 60, spread: 60 });
    } catch {}

    updateApplicationStage(
      selectedApp.id,
      selectedApp.currentStage,
      officerRemarks,
      'M. K. Kadam (ARTO)'
    );

    // Pick next app
    const remaining = applications.filter((a) => a.id !== selectedApp.id);
    setSelectedApp(remaining.length > 0 ? remaining[0] : null);
  };

  const handleReject = () => {
    if (!selectedApp) return;
    updateApplicationStage(
      selectedApp.id,
      'REJECTED',
      officerRemarks || 'Document discrepancy observed.',
      'M. K. Kadam (ARTO)'
    );
  };

  const handleRecordTestScore = (e: React.FormEvent) => {
    e.preventDefault();
    setTestEntrySuccess(true);
    setTimeout(() => setTestEntrySuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Officer Header */}
      <div className="bg-linear-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              RTO Official Enforcement Desk
            </span>
            <span className="text-blue-300 text-xs font-semibold">
              Jurisdiction: RTO Andheri (MH-02) / North Delhi (DL-01)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            RTO Officer Verification & Scrutiny Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Logged In Officer: <strong>Shri M. K. Kadam</strong> (Assistant Regional Transport Officer)
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'queue' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            Pending Queue ({pendingApps.length})
          </button>
          <button
            onClick={() => setActiveTab('scrutiny')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'scrutiny' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            Split-Screen Desk
          </button>
          <button
            onClick={() => setActiveTab('test_entry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'test_entry' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            Track Test Entry
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'analytics' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            RTO Analytics
          </button>
        </div>
      </div>

      {/* 1. APPLICATION QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-extrabold text-sm text-slate-900">
              Assigned Applications Awaiting Officer Scrutiny ({pendingApps.length})
            </h3>
            <span className="text-xs text-slate-500">Average Disposal SLA: &lt; 48 Hours</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {pendingApps.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  setActiveTab('scrutiny');
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs shrink-0">
                    {app.serviceCategory === 'vehicle' ? 'RC' : 'DL'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{app.serviceType}</h4>
                      <span className="font-mono text-xs text-blue-950 font-bold bg-slate-100 px-2 py-0.5 rounded">
                        {app.applicationNo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Applicant: <strong>{app.applicantName}</strong> • Aadhaar: {app.applicantAadhaarMasked} • Submitted: {formatDate(app.submittedDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                    Stage: {app.currentStage}
                  </span>
                  <button className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-2xs">
                    Scrutinize &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SPLIT-SCREEN SCRUTINY DESK */}
      {activeTab === 'scrutiny' && selectedApp && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Pane: Applicant Details & Fee Itemization */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-xs">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <span className="font-mono font-bold text-sm text-blue-950">
                  {selectedApp.applicationNo}
                </span>
                <h3 className="font-black text-slate-900 text-base mt-0.5">
                  {selectedApp.serviceType}
                </h3>
              </div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                Under Scrutiny
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">APPLICANT NAME</span>
                <span className="font-bold text-slate-900">{selectedApp.applicantName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">AADHAAR IDENTITY</span>
                <span className="font-bold text-slate-900 font-mono">{selectedApp.applicantAadhaarMasked}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">TARGET IDENTIFIER</span>
                <span className="font-bold text-slate-900">{selectedApp.vehicleNo || selectedApp.licenceNo || 'New Registration'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">RTO JURISDICTION</span>
                <span className="font-bold text-slate-900">{selectedApp.rtoName}</span>
              </div>
            </div>

            {/* Fee Status */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Statutory Fee Paid: {formatCurrency(selectedApp.feeDetails.total)}</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-800">
                Txn: {selectedApp.feeDetails.transactionId}
              </span>
            </div>

            {/* Decision & Remarks Panel */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="block font-bold text-slate-700">Officer Scrutiny Remarks</label>
              <textarea
                rows={3}
                value={officerRemarks}
                onChange={(e) => setOfficerRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:bg-white text-xs"
              />

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Sign Digitally</span>
                </button>
                <button
                  onClick={handleReject}
                  className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-4 py-3 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Pane: Uploaded Documents Scrutiny Viewer */}
          <div className="lg:col-span-6 bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-sm">Attached Documents Viewer</h4>
                </div>
                <span className="text-[10px] text-slate-400">
                  {selectedApp.documents.length} Files Attached
                </span>
              </div>

              <div className="space-y-3">
                {selectedApp.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-900 text-blue-200 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">Uploaded {doc.uploadDate}</div>
                      </div>
                    </div>

                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Digital Watermark */}
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-slate-300 text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                All documents digitally fetched from DigiLocker repository with cryptographic hash check.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TRACK TEST ENTRY */}
      {activeTab === 'test_entry' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-5 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Automated Driving Test Track Scorecard Entry
            </h3>
            <p className="text-xs text-slate-500">
              Submit sensor track performance scores for permanent DL applicants.
            </p>
          </div>

          <form onSubmit={handleRecordTestScore} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Candidate Learner Licence / Application Number
              </label>
              <input
                type="text"
                required
                value={testCandidateDl}
                onChange={(e) => setTestCandidateDl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Test Result Decision</label>
                <select
                  value={testResult}
                  onChange={(e) => setTestResult(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold"
                >
                  <option value="PASS">PASS (Qualified for Permanent DL)</option>
                  <option value="FAIL">FAIL (Sensor Boundary Penalty)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Track Facility</label>
                <input
                  type="text"
                  disabled
                  value="RTO Mall Road Sensor Track #1"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Track Sensor Observations</label>
              <textarea
                rows={3}
                value={testTrackNotes}
                onChange={(e) => setTestTrackNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-950 text-white font-black py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Award className="w-4 h-4" />
              <span>Record Official Track Test Decision</span>
            </button>
          </form>

          {testEntrySuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Test score recorded. Permanent Smartcard DL approval forwarded to dispatch.</span>
            </div>
          )}
        </div>
      )}

      {/* 4. RTO ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-bold uppercase">Daily Applications</div>
              <div className="text-2xl font-black text-blue-950 mt-1">1,482</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 12% vs last week</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-bold uppercase">Average Disposal Time</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">1.8 Days</div>
              <div className="text-[11px] text-slate-500 mt-1">SLA Target: &lt; 3.0 Days</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-bold uppercase">Daily Revenue Collected</div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹8,42,900</div>
              <div className="text-[11px] text-blue-700 font-semibold mt-1">100% BharatKosh Settled</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-bold uppercase">Citizen Satisfaction</div>
              <div className="text-2xl font-black text-amber-500 mt-1">4.8 / 5.0</div>
              <div className="text-[11px] text-slate-500 mt-1">Based on 14,200 reviews</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
