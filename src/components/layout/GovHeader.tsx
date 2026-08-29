import React, { useState } from 'react';
import {
  Bell,
  Globe,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Type,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n/translations';
import { LanguageCode, UserRole } from '../../types';

export const GovHeader: React.FC = () => {
  const {
    user,
    role,
    setRole,
    activeLang,
    setActiveLang,
    t,
    highContrast,
    toggleHighContrast,
    fontSize,
    cycleFontSize,
    speechEnabled,
    toggleSpeechEnabled,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    loginUser,
    logoutUser,
    setIsAuthModalOpen,
    setIsSaathiModalOpen,
    setActiveNavTab,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-xs select-none">
      {/* Top Gov Tricolor Bar */}
      <div className="h-1.5 w-full bg-linear-to-r from-orange-500 via-white to-emerald-600"></div>

      {/* Accessibility & Helpline Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GOVERNMENT OF INDIA • भारत सरकार
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden md:flex items-center gap-1 text-slate-300">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            National Highway Helpline: <strong className="text-white ml-1">1033 / 1073</strong> (Toll Free)
          </span>
        </div>

        {/* Accessibility Toolbar */}
        <div className="flex items-center gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsSaathiModalOpen(true)}
            className="flex items-center gap-1.5 bg-linear-to-r from-amber-500 to-orange-600 text-white px-2.5 py-0.5 rounded-full font-medium text-xs hover:shadow-md transition cursor-pointer"
            title="Ask Parivahan Saathi AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.aiAssistantTrigger}</span>
          </button>

          {/* Voice Screen Reader */}
          <button
            onClick={toggleSpeechEnabled}
            className={`flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition cursor-pointer ${
              speechEnabled ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-300'
            }`}
            title="Toggle Voice Assistant / Screen Reader"
            aria-label="Toggle Voice Assistant"
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Voice</span>
          </button>

          {/* High Contrast */}
          <button
            onClick={toggleHighContrast}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition text-slate-300 cursor-pointer"
            title="Toggle High Contrast Mode"
            aria-label="High Contrast"
          >
            {highContrast ? <Sun className="w-3.5 h-3.5 text-yellow-300" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Font Size Adjuster */}
          <button
            onClick={cycleFontSize}
            className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition text-slate-300 cursor-pointer"
            title={`Cycle Font Size (Current: ${fontSize})`}
            aria-label="Cycle Font Size"
          >
            <Type className="w-3.5 h-3.5" />
            <span>A {fontSize === 'large' ? '(+)' : fontSize === 'xlarge' ? '(++)' : ''}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 bg-slate-800 text-amber-300 hover:text-white px-2 py-0.5 rounded transition cursor-pointer font-medium"
              aria-label="Language Selector"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{LANGUAGES.find((l) => l.code === activeLang)?.native || 'English'}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white text-slate-900 rounded-lg shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Language (भाषा)
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setActiveLang(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-amber-50 hover:text-amber-900 transition ${
                      activeLang === lang.code ? 'bg-amber-100/60 font-bold text-amber-900' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-400">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Branding & User Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: National Emblem + Portal Identity */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setActiveNavTab('home')}
        >
          {/* Emblem representation */}
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900 text-amber-400 shadow-md">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2L15 8H9L12 2Z" fill="#ff9933" />
              <circle cx="12" cy="13" r="6" stroke="#ffffff" strokeWidth="1.5" fill="#000080" />
              <path d="M12 9V17M8 13H16M9.17 10.17L14.83 15.83M9.17 15.83L14.83 10.17" stroke="#ffffff" strokeWidth="1" />
              <rect x="6" y="20" width="12" height="2" rx="1" fill="#138808" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-blue-950 tracking-tight flex items-center gap-2">
                <span>{t.portalName}</span>
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  2.0 Unified
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {t.morthTitle} • भारत सरकार
            </p>
          </div>
        </div>

        {/* Right: Role Switcher, Notifications, User Profile / Sign In */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher Badge */}
          <div className="hidden lg:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setRole('citizen')}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                role === 'citizen'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Citizen View
            </button>
            <button
              onClick={() => setRole('officer')}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                role === 'officer'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              RTO Officer Desk
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                role === 'admin'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin Audit
            </button>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-full transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm">Notifications & Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-amber-300 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs transition cursor-pointer hover:bg-slate-50 ${
                          !n.read ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'EXPIRY' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                          {n.type === 'APPLICATION_UPDATE' && <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                          {n.type === 'APPOINTMENT' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                          {n.type === 'ALERT' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-slate-900">{n.title}</h4>
                              <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                            </div>
                            <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                            {n.actionLabel && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (n.actionUrl === 'tracker') setActiveNavTab('garage');
                                  else if (n.actionUrl?.startsWith('services')) setActiveNavTab('vehicle-services');
                                  else if (n.actionUrl?.startsWith('public')) setActiveNavTab('public');
                                  setIsNotifOpen(false);
                                }}
                                className="mt-1.5 inline-block text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                              >
                                {n.actionLabel} &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Sign-In Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full border border-slate-200 transition cursor-pointer"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-blue-900"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> Aadhaar Verified
                  </div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400">Signed In Citizen</p>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.mobile}</p>
                    <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-medium px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      DigiLocker Linked (Aadhaar {user.aadhaar})
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        setActiveNavTab('garage');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-blue-700" />
                      <span>{t.navGarage}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveNavTab('vault');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-blue-700" />
                      <span>{t.navVault}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logoutUser();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 font-medium flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.logoutButton}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>{t.loginButton}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
