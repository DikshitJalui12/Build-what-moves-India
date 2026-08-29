import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  Car,
  CreditCard,
  Wrench,
  Search,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakText } from '../../utils/helpers';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    targetTab: string;
    serviceWizard?: string;
  };
}

export const ParivahanSaathiModal: React.FC = () => {
  const {
    isSaathiModalOpen,
    setIsSaathiModalOpen,
    setActiveNavTab,
    setActiveServiceWizard,
    activeLang,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text:
        activeLang === 'hi'
          ? 'नमस्ते! मैं परिवहन साथी AI हूँ। मैं वाहन आरसी, ड्राइविंग लाइसेंस, ई-चालान, आरटीओ फीस और अपॉइंटमेंट में आपकी सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?'
          : 'Namaste! I am Parivahan Saathi AI, your intelligent transport assistant. How can I help you today with your vehicle RC, driving licence, challan payments, or RTO appointments?',
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    { label: '🚗 Transfer Ownership', query: 'How do I transfer vehicle ownership to a buyer?' },
    { label: '🪪 Learner’s Licence', query: 'What is the procedure for new Learner Licence?' },
    { label: '💰 Pay Traffic Fine', query: 'How to check and pay pending traffic challan?' },
    { label: '🛡️ Renew Insurance & PUC', query: 'My insurance is expiring. How do I update it?' },
    { label: '🌍 International Permit (IDP)', query: 'How can I get an International Driving Permit?' },
    { label: '📅 Book RTO Slot', query: 'How do I book an appointment slot at RTO?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isSaathiModalOpen) {
      scrollToBottom();
    }
  }, [messages, isSaathiModalOpen]);

  if (!isSaathiModalOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent AI response based on intent
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let reply = '';
      let action: ChatMessage['actionButton'] = undefined;

      if (qLower.includes('transfer') || qLower.includes('ownership') || qLower.includes('sell') || qLower.includes('buy')) {
        reply =
          'To transfer vehicle ownership under Parivahan Next, you need Form 29 & Form 30. The seller initiates the request with the buyer’s Aadhaar/mobile. Once the buyer confirms and pays statutory fees (₹530), the RTO processes the transfer with zero physical paper hassle!';
        action = {
          label: 'Start Transfer Ownership Wizard',
          targetTab: 'vehicle-services',
          serviceWizard: 'ownership-transfer',
        };
      } else if (qLower.includes('learner') || qLower.includes('ll') || qLower.includes('learning')) {
        reply =
          'You can apply for a Learner’s Licence completely online using Aadhaar e-KYC. After submitting basic details, you will take an interactive 15-question Mock Test right here on the portal. Scored 60% or higher? Your provisional LL will be generated immediately!';
        action = {
          label: 'Apply for Learner’s Licence',
          targetTab: 'dl-services',
          serviceWizard: 'learner-licence',
        };
      } else if (qLower.includes('challan') || qLower.includes('fine') || qLower.includes('violation')) {
        reply =
          'You can look up any pending traffic challan instantly using your Vehicle Registration Number, Challan Number, or Driving Licence. You can view camera photographic proof and pay immediately via UPI or NetBanking with zero gateway surcharge.';
        action = {
          label: 'Check & Pay eChallans',
          targetTab: 'public',
        };
      } else if (qLower.includes('permanent') || qLower.includes('dl') || qLower.includes('driving test')) {
        reply =
          'Citizens holding an active Learner’s Licence for at least 30 days are eligible to convert to a Permanent Driving Licence. You can book an appointment slot for the RTO Automated Driving Test Track through the portal.';
        action = {
          label: 'Convert to Permanent DL',
          targetTab: 'dl-services',
          serviceWizard: 'permanent-dl',
        };
      } else if (qLower.includes('idp') || qLower.includes('international') || qLower.includes('abroad')) {
        reply =
          'An International Driving Permit (IDP) is valid for 1 year under the 1949 Geneva Convention. You will need a valid Indian Driving Licence, Passport, and Visa/Flight Ticket. The statutory government fee is ₹1,050.';
        action = {
          label: 'Apply for International Permit',
          targetTab: 'dl-services',
          serviceWizard: 'idp',
        };
      } else if (qLower.includes('rc renewal') || qLower.includes('15 year') || qLower.includes('fitness')) {
        reply =
          'Vehicles completing 15 years from registration must undergo mandatory fitness inspection and RC re-registration for 5 additional years. RTO fee is ₹1,250.';
        action = {
          label: 'Start RC Renewal Wizard',
          targetTab: 'vehicle-services',
          serviceWizard: 'rc-renewal',
        };
      } else if (qLower.includes('slot') || qLower.includes('appointment') || qLower.includes('visit')) {
        reply =
          'You can schedule a guaranteed visit slot at your designated RTO office. Choose your date and time to receive a scannable QR Entry Pass for express clearance at the counter.';
        action = {
          label: 'Book RTO Appointment',
          targetTab: 'appointments',
        };
      } else {
        reply = `I understand you are asking about "${query}". In Parivahan Next, all vehicle records, licences, and applications are consolidated in your dashboard. You can access vehicle services, DL renewals, document downloads, or file grievances anytime.`;
        action = {
          label: 'Go to Citizen Dashboard',
          targetTab: 'home',
        };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actionButton: action,
      };

      setMessages((prev) => [...prev, botMsg]);
      speakText(reply);
    }, 450);
  };

  const toggleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = activeLang === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      if (!isListening) {
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setInputQuery(speechResult);
          setIsListening(false);
          handleSend(speechResult);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } else {
        recognition.stop();
        setIsListening(false);
      }
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-950 via-blue-900 to-indigo-900 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Parivahan Saathi AI</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Gov Assistant
                </span>
              </h3>
              <p className="text-xs text-blue-200">
                Instant Multilingual Guidance for Indian Transport & RTO Services
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSaathiModalOpen(false)}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Chips */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-xs bg-white text-slate-700 hover:text-blue-900 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer shadow-2xs font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold text-xs mt-1">
                  AI
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-900 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="font-semibold text-[11px] opacity-75">
                    {msg.sender === 'user' ? 'You' : 'Parivahan Saathi'}
                  </span>
                  <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Optional Action Button */}
                {msg.actionButton && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveNavTab(msg.actionButton!.targetTab);
                        if (msg.actionButton!.serviceWizard) {
                          setActiveServiceWizard(msg.actionButton!.serviceWizard);
                        }
                        setIsSaathiModalOpen(false);
                      }}
                      className="bg-blue-900 hover:bg-blue-950 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{msg.actionButton.label}</span>
                      <span>&rarr;</span>
                    </button>
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1.5 text-slate-400 hover:text-blue-900 rounded-md transition"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleSpeechInput}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about RC, DL, challans, fees or RTO rules..."
              className="flex-1 bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 text-xs rounded-xl px-4 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="bg-blue-900 hover:bg-blue-950 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-xs cursor-pointer"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
