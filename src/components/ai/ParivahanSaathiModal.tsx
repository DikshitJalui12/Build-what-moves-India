import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Key,
  Bot,
  Car,
  CreditCard,
  Wrench,
  Search,
  FileText,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speakText, stopSpeaking, LANG_BCP47_MAP } from '../../utils/helpers';
import { LanguageCode } from '../../types';

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
    user,
    vehicles,
    drivingLicence,
    challans,
    applications,
    t,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('pn_grok_api_key') || '');
  const [customEndpoint, setCustomEndpoint] = useState(() => localStorage.getItem('pn_ai_endpoint') || 'https://api.x.ai/v1/chat/completions');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('pn_ai_model') || 'grok-beta');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getGreeting = (lang: LanguageCode) => {
    switch (lang) {
      case 'hi':
        return 'नमस्ते! मैं परिवहन साथी AI हूँ। मैं वाहन आरसी, ड्राइविंग लाइसेंस, ई-चालान, आरटीओ फीस और अपॉइंटमेंट में आपकी सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?';
      case 'ta':
        return 'வணக்கம்! நான் பரிவஹன் சாதி AI. வாகன ஆர்.சி, ஓட்டுநர் உரிமம், சலான் கட்டணம் மற்றும் ஆர்டிஓ சேவைகளில் உங்களுக்கு உதவ நான் தயாராக உள்ளேன்.';
      case 'te':
        return 'నమస్కారం! నేను పరివహన్ సాథీ AI. వాహన ఆర్సీ, డ్రైవింగ్ లైసెన్స్, ఈ-చలాన్ చెల్లింపులు మరియు ఆర్టీవో సేవలలో మీకు సహాయం చేస్తాను.';
      case 'kn':
        return 'ನಮಸ್ಕಾರ! ನಾನು ಪರಿವಾಹನ್ ಸಾಥಿ AI. ವಾಹನ ಆರ್‌ಸಿ, ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್, ಇ-ಚಲನ್ ಮತ್ತು ಆರ್‌ಟಿಒ ಸೇವೆಗಳಲ್ಲಿ ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧನಾಗಿದ್ದೇನೆ.';
      case 'ml':
        return 'നമസ്കാരം! ഞാൻ പരിവാഹൻ സാഥി AI. വാഹന ആർസി, ഡ്രൈവിംഗ് ലൈസൻസ്, ഇ-ചെല്ലാൻ എന്നിവയിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്.';
      case 'bn':
        return 'নমস্কার! আমি পরিবহন সাথী AI। যানবাহন আরসি, ড্রাইভিং লাইসেন্স, চালান এবং আরটিও পরিষেবা নিয়ে আমি আপনাকে সাহায্য করতে পারি।';
      case 'mr':
        return 'नमस्कार! मी परिवहन साथी AI आहे. वाहन आरसी, ड्रायव्हिंग लायसन्स, ई-चलन आणि आरटीओ सेवांमध्ये मी तुम्हाला मदत करू शकतो.';
      case 'gu':
        return 'નમસ્તે! હું પરિવહન સાથી AI છું. વાહન આરસી, ડ્રાઇવિંગ લાઇસન્સ, ઇ-ચલણ અને આરટીઓ સેવાઓમાં હું તમને સહાય કરી શકું છું.';
      case 'pa':
        return 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਪਰਿਵਾਹਨ ਸਾਥੀ AI ਹਾਂ। ਵਾਹਨ ਆਰਸੀ, ਡਰਾਈਵਿੰਗ ਲਾਇਸੈਂਸ, ਈ-ਚਲਾਨ ਅਤੇ ਆਰਟੀਓ ਸੇਵਾਵਾਂ ਲਈ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।';
      default:
        return 'Namaste! I am Parivahan Saathi AI, your intelligent transport assistant. How can I help you today with your vehicle RC, driving licence, challan payments, or RTO appointments?';
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: getGreeting(activeLang),
      timestamp: 'Just now',
    },
  ]);

  // Update initial greeting when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'assistant') {
        return [
          {
            id: '1',
            sender: 'assistant',
            text: getGreeting(activeLang),
            timestamp: 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [activeLang]);

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

  // Stop speaking when modal closes
  useEffect(() => {
    if (!isSaathiModalOpen) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [isSaathiModalOpen]);

  if (!isSaathiModalOpen) return null;

  const handleStopSpeech = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleSaveApiConfig = () => {
    localStorage.setItem('pn_grok_api_key', apiKey.trim());
    localStorage.setItem('pn_ai_endpoint', customEndpoint.trim());
    localStorage.setItem('pn_ai_model', selectedModel.trim());
    setShowConfig(false);
  };

  /**
   * Comprehensive intelligent response generator (Grok API + Contextual Fallback)
   */
  const generateAIResponse = async (userQuery: string): Promise<{ reply: string; action?: ChatMessage['actionButton'] }> => {
    const cleanKey = apiKey.trim();

    // 1. If user provided a Grok / xAI / OpenAI API key, attempt live call
    if (cleanKey) {
      try {
        const systemPrompt = `You are Parivahan Saathi AI, an intelligent, empathetic, and authoritative assistant for the Parivahan Next digital mobility platform in India.
Current User Context:
- Name: ${user?.name || 'Citizen'}
- Mobile: ${user?.mobile || '9876543210'}
- State/RTO: ${user?.state || 'Maharashtra'} / ${vehicles[0]?.rtoName || 'RTO Andheri'}
- Vehicles Registered: ${vehicles.map(v => `${v.registrationNo} (${v.makerModel})`).join(', ')}
- Driving Licence: ${drivingLicence?.licenceNo || 'DL01-2022-0098231'} (Status: ${drivingLicence?.status || 'Active'})
- Pending Challans: ${challans.length} challans (Total: ₹${challans.reduce((a,c) => a + c.fineAmount, 0)})
- Active Applications: ${applications.length} applications

Instructions:
1. Always respond in the citizen's selected language: ${activeLang.toUpperCase()} (e.g. Hindi if hi, Tamil if ta, Telugu if te, English if en).
2. Answer clearly, accurately, with statutory fees, required forms (e.g. Form 29/30 for transfer, Form 3 for LL, Form 35 for loan clearance), and step-by-step guidance under the Motor Vehicles Act / CMVR 1989.
3. Keep responses concise (2-4 paragraphs max). Do NOT use markdown code fences for plain text.`;

        const response = await fetch(customEndpoint || 'https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanKey}`,
          },
          body: JSON.stringify({
            model: selectedModel || 'grok-beta',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.slice(-6).map((m) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text,
              })),
              { role: 'user', content: userQuery },
            ],
            temperature: 0.4,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            // Determine smart action button
            const qLower = userQuery.toLowerCase();
            let action: ChatMessage['actionButton'] = undefined;
            if (qLower.includes('transfer') || qLower.includes('sell') || qLower.includes('buy')) {
              action = { label: t.transferOwnership, targetTab: 'vehicle-services', serviceWizard: 'ownership-transfer' };
            } else if (qLower.includes('learner') || qLower.includes('ll')) {
              action = { label: t.learnerLicence, targetTab: 'dl-services', serviceWizard: 'learner-licence' };
            } else if (qLower.includes('challan') || qLower.includes('fine')) {
              action = { label: t.payChallans, targetTab: 'public' };
            } else if (qLower.includes('slot') || qLower.includes('appointment')) {
              action = { label: t.bookInspectionSlot, targetTab: 'appointments' };
            }
            return { reply, action };
          }
        }
      } catch (err) {
        console.warn('Grok API fetch failed, switching to local contextual reasoning engine:', err);
      }
    }

    // 2. High-Performance Multilingual Contextual Reasoning Engine
    const q = userQuery.toLowerCase();
    let reply = '';
    let action: ChatMessage['actionButton'] = undefined;

    if (q.includes('transfer') || q.includes('ownership') || q.includes('sell') || q.includes('buy') || q.includes('बेचना') || q.includes('खरीद')) {
      if (activeLang === 'hi') {
        reply = `वाहन स्वामित्व हस्तांतरण (Ownership Transfer) के लिए फॉर्म 29 और फॉर्म 30 की आवश्यकता होती है। विक्रेता अपने पोर्टल से खरीदार का मोबाइल/आधार नंबर दर्ज करके डिजिटल अनुरोध शुरू करता है। खरीदार द्वारा सहमति और ₹530 के सांविधिक शुल्क भुगतान के बाद, आरटीओ बिना किसी कागजी परेशानी के डिजिटल स्वीकृति प्रदान करता है।`;
      } else if (activeLang === 'ta') {
        reply = `வாகன உரிமை மாற்றத்திற்கு படிவம் 29 மற்றும் படிவம் 30 தேவைப்படுகிறது. விற்பனையாளர் வாங்குபவரின் விவரங்களை உள்ளிட்டு கோரிக்கையைத் தொடங்கலாம். ₹530 கட்டணம் செலுத்திய பின், ஆர்.டி.ஓ டிஜிட்டல் முறையில் ஒப்புதல் அளிக்கும்.`;
      } else if (activeLang === 'te') {
        reply = `వాహన యాజమాన్య బదిలీ కోసం ఫారం 29 మరియు ఫారం 30 అవసరం. విక్రేత కొనుగోలుదారు వివరాలను నమోదు చేసి ప్రక్రియను ప్రారంభించవచ్చు. ₹530 ఫీజు చెల్లించిన తర్వాత, ఆర్టీవో డిజిటల్ ఆమోదం తెలుపుతుంది.`;
      } else {
        reply = `To transfer vehicle ownership under Parivahan Next, you need Form 29 & Form 30. The seller initiates the request with the buyer’s Aadhaar/mobile. Once the buyer confirms and pays statutory fees (₹530), the RTO processes the transfer with zero physical paper hassle!`;
      }
      action = { label: t.transferOwnership, targetTab: 'vehicle-services', serviceWizard: 'ownership-transfer' };
    } else if (q.includes('learner') || q.includes('ll') || q.includes('learning') || q.includes('लर्नर') || q.includes('लाइसेंस')) {
      if (activeLang === 'hi') {
        reply = `आप आधार ई-केवाईसी (e-KYC) के माध्यम से पूरी तरह से ऑनलाइन लर्नर लाइसेंस (LL) के लिए आवेदन कर सकते हैं। विवरण जमा करने के बाद, आप पोर्टल पर 15 प्रश्नों का मॉक टेस्ट देंगे। 60% या अधिक अंक प्राप्त करने पर आपका फॉर्म 3 प्रोविजनल लाइसेंस तुरंत जारी कर दिया जाएगा!`;
      } else if (activeLang === 'ta') {
        reply = `ஆதார் e-KYC மூலம் ஆன்லைனில் லேர்னர் உரிமம் பெறலாம். விண்ணப்பித்த பின் 15 கேள்விகள் கொண்ட ஆன்லைன் தேர்வில் 60% மதிப்பெண் பெற்றால், தற்காலிக உரிமம் உடனடியாக வழங்கப்படும்.`;
      } else if (activeLang === 'te') {
        reply = `ఆధార్ e-KYC ద్వారా ఆన్‌లైన్‌లో లెర్నర్ లైసెన్స్ పొందవచ్చు. 15 ప్రశ్నల ఆన్‌లైన్ పరీక్షలో 60% లేదా అంతకంటే ఎక్కువ మార్కులు పొందితే, మీ తాత్కాలిక లైసెన్స్ వెంటనే జారీ చేయబడుతుంది.`;
      } else {
        reply = `You can apply for a Learner’s Licence completely online using Aadhaar e-KYC. After submitting basic details, you will take an interactive 15-question Mock Test right here on the portal. Scored 60% or higher? Your provisional LL will be generated immediately!`;
      }
      action = { label: t.learnerLicence, targetTab: 'dl-services', serviceWizard: 'learner-licence' };
    } else if (q.includes('challan') || q.includes('fine') || q.includes('violation') || q.includes('चालान') || q.includes('जुर्माना')) {
      if (activeLang === 'hi') {
        reply = `आप अपने वाहन पंजीकरण संख्या (${vehicles[0]?.registrationNo || 'MH02-CL-8891'}) या चालान संख्या से सभी लंबित चालान देख सकते हैं। डिजिटल कैमरा साक्ष्य जांचें और शून्य गेटवे सरचार्ज के साथ यूपीआई/नेटबैंकिंग द्वारा तुरंत भुगतान करें।`;
      } else if (activeLang === 'ta') {
        reply = `உங்கள் வாகன எண் அல்லது சலான் எண் மூலம் நிலுவையில் உள்ள போக்குவரத்து அபராதங்களைச் சரிபார்த்து, UPI அல்லது நெட்பேங்கிங் மூலம் உடனடியாகச் செலுத்தலாம்.`;
      } else if (activeLang === 'te') {
        reply = `మీ వాహన నంబర్ లేదా చలాన్ నంబర్ ద్వారా పెండింగ్ చలానాలను చూసి, UPI ద్వారా వెంటనే చెల్లించవచ్చు.`;
      } else {
        reply = `You can look up any pending traffic challan instantly using your Vehicle Registration Number (${vehicles[0]?.registrationNo || 'MH02-CL-8891'}), Challan Number, or Driving Licence. View camera evidence and pay immediately via UPI with zero gateway surcharge.`;
      }
      action = { label: t.payChallans, targetTab: 'public' };
    } else if (q.includes('insurance') || q.includes('puc') || q.includes('fitness') || q.includes('प्रदूषण') || q.includes('बीमा')) {
      if (activeLang === 'hi') {
        reply = `आपके वाहन ${vehicles[0]?.registrationNo} का बीमा और पीयूसी (PUC) रिकॉर्ड राष्ट्रीय वाहन रजिस्टर से स्वतः सिंक हो जाता है। जब आपकी बीमा कंपनी डेटा अपडेट करती है, तो आपका डिजिटल हेल्थ बैज तुरंत हरा (Valid) हो जाता है।`;
      } else {
        reply = `Your vehicle ${vehicles[0]?.registrationNo || 'MH02-CL-8891'} insurance and PUC pollution certificates sync automatically with the National Register. Once renewed with any authorized insurer, your health card updates to Valid instantly.`;
      }
      action = { label: t.navGarage, targetTab: 'garage' };
    } else if (q.includes('slot') || q.includes('appointment') || q.includes('visit') || q.includes('अपॉइंटमेंट') || q.includes('आरटीओ')) {
      if (activeLang === 'hi') {
        reply = `आप अपने नजदीकी आरटीओ कार्यालय में गारंटीकृत स्लॉट बुक कर सकते हैं। अपनी तारीख और समय चुनें और काउंटर पर त्वरित सेवा के लिए क्यूआर कोड एंट्री पास प्राप्त करें।`;
      } else {
        reply = `You can schedule a guaranteed visit slot at your designated RTO office. Choose your date and time to receive a scannable QR Entry Pass for express clearance at the counter.`;
      }
      action = { label: t.bookInspectionSlot, targetTab: 'appointments' };
    } else if (q.includes('idp') || q.includes('international') || q.includes('विदेश') || q.includes('विदेश यात्रा')) {
      if (activeLang === 'hi') {
        reply = `अंतर्राष्ट्रीय ड्राइविंग परमिट (IDP) 1949 जिनेवा कन्वेंशन के तहत 1 वर्ष के लिए वैध होता है। इसके लिए वैध भारतीय ड्राइविंग लाइसेंस, पासपोर्ट और वीजा की आवश्यकता होती है। सांविधिक शुल्क ₹1,050 है।`;
      } else {
        reply = `An International Driving Permit (IDP) is valid for 1 year under the 1949 Geneva Convention. You will need a valid Indian Driving Licence, Passport, and Visa/Flight Ticket. Statutory fee is ₹1,050.`;
      }
      action = { label: 'Apply for International Permit', targetTab: 'dl-services', serviceWizard: 'idp' };
    } else {
      if (activeLang === 'hi') {
        reply = `मैं समझता हूँ कि आप "${userQuery}" के बारे में पूछ रहे हैं। परिवहन नेक्स्ट में आपके सभी वाहन रिकॉर्ड, लाइसेंस, चालान और आवेदन एक ही डैशबोर्ड में उपलब्ध हैं। आप सीधे संबंधित सेवाओं तक पहुँच सकते हैं।`;
      } else if (activeLang === 'ta') {
        reply = `"${userQuery}" பற்றிய உங்கள் கேள்வி புரிந்தது. பரிவஹன் நெக்ஸ்ட் தளத்தில் உங்கள் அனைத்து வாகன பதிவுகளும் ஒரே இடத்தில் உள்ளன.`;
      } else {
        reply = `I understand your query regarding "${userQuery}". In Parivahan Next, all your linked vehicles (${vehicles.map(v => v.registrationNo).join(', ')}), driving licences, and applications are consolidated in your dashboard for unified 1-click management.`;
      }
      action = { label: t.navHome, targetTab: 'home' };
    }

    return { reply, action };
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    // Check voice navigation commands
    const qLower = query.toLowerCase();
    if (qLower === 'open garage' || qLower === 'show vehicles' || qLower === 'गैराज खोलो') {
      setActiveNavTab('garage');
      setIsSaathiModalOpen(false);
      speakText('Opening your vehicles garage', activeLang);
      return;
    }
    if (qLower === 'open dl' || qLower === 'show licence' || qLower === 'लाइसेंस खोलो') {
      setActiveNavTab('dl');
      setIsSaathiModalOpen(false);
      speakText('Opening your driving licence', activeLang);
      return;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const { reply, action } = await generateAIResponse(query);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actionButton: action,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsSpeaking(true);
      speakText(reply, activeLang);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'I am here to help you navigate all transport and vehicle services. How can I assist you further?',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      const bcp = LANG_BCP47_MAP[activeLang] || 'en-IN';
      recognition.lang = bcp;
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
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[620px] max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-950 via-blue-900 to-indigo-900 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>{t.askSaathi}</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  {apiKey.trim() ? 'Grok AI Live' : 'Smart AI'}
                </span>
                <span className="text-[10px] bg-white/20 text-blue-100 font-mono px-1.5 py-0.5 rounded uppercase">
                  {activeLang}
                </span>
              </h3>
              <p className="text-xs text-blue-200">
                Multilingual AI Transport Assistant & Voice Navigator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mute / Pause Speech Button */}
            <button
              onClick={handleStopSpeech}
              title="Mute / Stop Voice Assistant"
              className="p-1.5 text-blue-200 hover:text-amber-300 hover:bg-white/10 rounded-lg transition cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <VolumeX className="w-4 h-4" />
              <span className="hidden sm:inline">Mute Voice</span>
            </button>

            {/* AI Config / API Key Settings Button */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              title="AI Model & API Key Settings"
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                showConfig ? 'bg-amber-400 text-slate-950' : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsSaathiModalOpen(false)}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Grok / OpenAI API Configuration Panel */}
        {showConfig && (
          <div className="bg-slate-900 text-white p-4 border-b border-slate-700 text-xs space-y-3 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between font-bold text-amber-400">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4" /> Grok / xAI / OpenAI API Configuration
              </span>
              <span className="text-[10px] text-slate-400">Optional: Connect your live LLM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">API Key (xAI or OpenAI):</label>
                <input
                  type="password"
                  placeholder="xai-... or sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Model Name:</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                >
                  <option value="grok-beta">grok-beta (xAI)</option>
                  <option value="grok-2">grok-2 (xAI)</option>
                  <option value="gpt-4o-mini">gpt-4o-mini (OpenAI)</option>
                  <option value="gpt-4o">gpt-4o (OpenAI)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => {
                  setApiKey('');
                  localStorage.removeItem('pn_grok_api_key');
                  setShowConfig(false);
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Clear Key (Use Built-in Engine)
              </button>
              <button
                onClick={handleSaveApiConfig}
                className="px-4 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg"
              >
                Save Configuration
              </button>
            </div>
          </div>
        )}

        {/* Quick Prompts Chips */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 text-xs px-3 py-1 rounded-full whitespace-nowrap transition cursor-pointer shrink-0 shadow-2xs font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-900 to-indigo-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.sender === 'assistant' && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => {
                        setIsSpeaking(true);
                        speakText(msg.text, activeLang);
                      }}
                      className="text-[11px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen in {activeLang.toUpperCase()}</span>
                    </button>

                    {msg.actionButton && (
                      <button
                        onClick={() => {
                          setActiveNavTab(msg.actionButton!.targetTab);
                          if (msg.actionButton!.serviceWizard) {
                            setActiveServiceWizard(msg.actionButton!.serviceWizard);
                          }
                          setIsSaathiModalOpen(false);
                          stopSpeaking();
                        }}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-lg transition cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <span>{msg.actionButton.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Parivahan Saathi is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="bg-white p-3 border-t border-slate-200">
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
              className={`p-2.5 rounded-xl transition cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Voice Input (Mic)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask in ${activeLang.toUpperCase()} e.g. "How to transfer RC?", "How to clear challan?"...`}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition font-medium"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
