import React, { useState } from 'react';
import {
  HelpCircle,
  PhoneCall,
  Search,
  FileQuestion,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GrievanceTicket } from '../../types';

export const HelpCenter: React.FC = () => {
  const { grievances, addGrievance, user, setIsSaathiModalOpen } = useApp();

  const [activeTab, setActiveTab] = useState<'faq' | 'grievance' | 'contact'>('faq');
  const [searchFaq, setSearchFaq] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Grievance Form State
  const [grvCategory, setGrvCategory] = useState<GrievanceTicket['category']>('RC_DELAY');
  const [grvSubject, setGrvSubject] = useState('');
  const [grvDescription, setGrvDescription] = useState('');
  const [grvIdentifier, setGrvIdentifier] = useState('DL01AB1234');
  const [grvSuccessToken, setGrvSuccessToken] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How does Parivahan Next unify Vahan (Vehicles) and Sarathi (Licences)?',
      a: 'Parivahan Next links all your vehicles and driving licences under your authenticated Aadhaar / DigiLocker identity. One single login grants access to all registered cars, two-wheelers, driving licences, active applications, and challans with zero duplicate account registrations.',
    },
    {
      q: 'What is the procedure for vehicle ownership transfer without visiting an RTO?',
      a: 'The registered seller initiates the transfer on the portal by entering the buyer’s mobile/Aadhaar number. The buyer receives a digital consent request, confirms ownership transfer, and pays statutory transfer fees. Form 29 & Form 30 are auto-generated with digital signatures, eliminating paper visits.',
    },
    {
      q: 'How does the online Learner’s Licence (LL) test work?',
      a: 'After completing Aadhaar e-KYC, you take an online 15-question road safety mock test directly on this portal. If you score 60% or higher (9+ correct answers), your provisional Form 3 Learner’s Licence is immediately issued to your Document Vault.',
    },
    {
      q: 'What should I do if a payment fails during fee checkout?',
      a: 'BharatKosh payment gateway includes automatic reconciliation. If your money is deducted, your transaction status will automatically update within 15 minutes. Alternatively, you can click "Retry Payment" or re-check the Payment History tab.',
    },
    {
      q: 'Are digital RC and DL in this portal legally valid for traffic police inspection?',
      a: 'Yes. Under Rule 139 of the Central Motor Vehicles Rules and MoRTH notifications, digital documents stored in Parivahan Next / DigiLocker carrying cryptographic QR verification stamps are legally equivalent to physical plastic smartcards.',
    },
    {
      q: 'When should I renew my vehicle Registration Certificate (RC)?',
      a: 'Private motor vehicles require mandatory fitness inspection and RC renewal after completing 15 years from the initial registration date, and subsequently every 5 years thereafter.',
    },
  ];

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `MORTH-GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket: GrievanceTicket = {
      id: `GRV-${Date.now()}`,
      tokenNo: token,
      citizenName: user?.name || 'Citizen',
      citizenMobile: user?.mobile || '+91 9876543210',
      email: user?.email || 'citizen@nic.in',
      category: grvCategory,
      rtoCode: 'DL-01',
      rtoName: 'RTO Mall Road',
      subject: grvSubject,
      description: grvDescription,
      applicationNoOrRegNo: grvIdentifier,
      status: 'REGISTERED',
      createdAt: new Date().toISOString().split('T')[0],
      slaDeadline: 'Within 7 Working Days (Citizen Charter SLA)',
    };

    addGrievance(newTicket);
    setGrvSuccessToken(token);
    setGrvSubject('');
    setGrvDescription('');
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.a.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold">Help & Grievance Redressal Center</h2>
          </div>
          <p className="text-xs sm:text-sm text-blue-200 max-w-xl">
            Frequently asked questions, grievance tracking (CPGRAMS), emergency toll-free helplines, and 24x7 AI assistance.
          </p>
        </div>

        <button
          onClick={() => setIsSaathiModalOpen(true)}
          className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Parivahan Saathi AI</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md mx-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'faq' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
          }`}
        >
          Frequently Asked Questions
        </button>
        <button
          onClick={() => setActiveTab('grievance')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'grievance' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
          }`}
        >
          Lodge Grievance ({grievances.length})
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'contact' ? 'bg-white text-blue-950 shadow-xs' : 'text-slate-600'
          }`}
        >
          Emergency Helplines
        </button>
      </div>

      {/* 1. FAQS */}
      {activeTab === 'faq' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-4 font-bold text-xs text-slate-900 hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4.5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. GRIEVANCES */}
      {activeTab === 'grievance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
          {/* Lodge New Grievance */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-slate-900">
              Submit Citizen Grievance (CPGRAMS / MoRTH)
            </h3>

            {grvSuccessToken && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Grievance Ticket Created: {grvSuccessToken}</span>
                </div>
                <p className="text-[11px]">
                  Your complaint has been forwarded to the Designated Appellate Officer. SLA resolution target is within 7 working days.
                </p>
              </div>
            )}

            <form onSubmit={handleGrievanceSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Grievance Category</label>
                <select
                  value={grvCategory}
                  onChange={(e) => setGrvCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                >
                  <option value="RC_DELAY">Delay in RC Smartcard Issuance / Dispatch</option>
                  <option value="DL_TEST_ISSUE">Driving Licence Slot / Test Track Query</option>
                  <option value="PAYMENT_REFUND">Payment Gateway Failed Transaction / Refund</option>
                  <option value="PORTAL_TECHNICAL">Technical Glitch on Portal</option>
                  <option value="OFFICER_CONDUCT">Officer Grievance / Unfair Rejection</option>
                  <option value="OTHER">Other Transport Service Matter</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Associated Vehicle Reg / Application No
                </label>
                <input
                  type="text"
                  value={grvIdentifier}
                  onChange={(e) => setGrvIdentifier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject of Grievance</label>
                <input
                  type="text"
                  required
                  value={grvSubject}
                  onChange={(e) => setGrvSubject(e.target.value)}
                  placeholder="Brief summary of issue..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  required
                  value={grvDescription}
                  onChange={(e) => setGrvDescription(e.target.value)}
                  placeholder="Provide facts, dates, reference numbers..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-black py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance to Appellate Authority</span>
              </button>
            </form>
          </div>

          {/* Registered Grievance Tickets */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider">
              My Lodged Grievance Tickets ({grievances.length})
            </h4>

            {grievances.map((g) => (
              <div
                key={g.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono font-bold text-blue-950 bg-blue-50 px-2 py-0.5 rounded">
                    {g.tokenNo}
                  </span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {g.status}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900">{g.subject}</h5>
                <p className="text-slate-600 text-[11px] leading-relaxed">{g.description}</p>
                {g.resolutionNotes && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-950">
                    <strong>Resolution:</strong> {g.resolutionNotes}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  Target SLA: {g.slaDeadline}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EMERGENCY CONTACTS */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-xs">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">National Highway Helpline</h4>
            <div className="text-xl font-black text-blue-950 font-mono">1033</div>
            <p className="text-slate-500 text-[11px]">
              Toll-Free Emergency Road Assistance, Crane & Medical Support on all Indian Expressways.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mx-auto">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Transport Portal Desk</h4>
            <div className="text-xl font-black text-blue-950 font-mono">0120-4925505</div>
            <p className="text-slate-500 text-[11px]">
              Available Monday to Saturday (06:00 AM - 10:00 PM) for citizen technical support.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Traffic Police Emergency</h4>
            <div className="text-xl font-black text-rose-700 font-mono">112 / 1095</div>
            <p className="text-slate-500 text-[11px]">
              Immediate Traffic Police Control Room Assistance and Road Incident reporting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
