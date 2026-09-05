import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Info,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface AuthPortalViewProps {
  onSuccess?: () => void;
  onNavigateToIntro?: () => void;
}

export const AuthPortalView: React.FC<AuthPortalViewProps> = ({
  onSuccess,
  onNavigateToIntro,
}) => {
  const { register, login, users, quickSwitchUser } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(true);

  // Form states - Mandatory fields: First Name, Last Name, Phone Number
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegisterMode) {
      if (!firstName.trim()) {
        setError('Iltimos, ismingizni kiriting (First Name is required).');
        return;
      }
      if (!lastName.trim()) {
        setError('Iltimos, familiyangizni kiriting (Last Name is required).');
        return;
      }
      if (!phoneNumber.trim() || phoneNumber.trim().length < 9) {
        setError('Iltimos, to\'g\'ri telefon raqamingizni kiriting (Phone Number is required).');
        return;
      }

      const success = register(firstName, lastName, phoneNumber);
      if (success && onSuccess) {
        onSuccess();
      }
    } else {
      if (!phoneNumber.trim()) {
        setError('Iltimos, telefon raqamingizni kiriting.');
        return;
      }
      const success = login(phoneNumber);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        setError('Bunday telefon raqamli foydalanuvchi topilmadi. Ro\'yxatdan o\'tishni tanlang.');
      }
    }
  };

  return (
    <div
      id="auth-portal-page"
      className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8"
    >
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Panel: Visual Branding & Platform Value (5 Cols on LG) */}
        <div
          id="auth-portal-left-panel"
          className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/40 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">EduPlatform</h2>
                <p className="text-xs text-indigo-300 font-mono">Sun'iy Intellekt & IT Portali</p>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-medium">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Interaktiv Ta'lim Portali
              </span>
              <h3 className="text-2xl font-bold leading-snug">
                Bilim oling, sinovdan o'ting va o'z kasbingiz egasi bo'ling.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zamonaviy darsliklar, avtomatlashgan testlar, Gemini AI yordamchisi va xavfsiz admin
                tasdiqlash arxitekturasi.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bir martalik ro'yxatdan o'tish (Ism, Familiya, Tel)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Admin tasdig'i (Pending kutilmoqda xavfsizlik filtri)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI konsultanti va interaktiv testlar bazasi</span>
              </div>
            </div>
          </div>

          {/* Bottom Action: Go to Platform Intro */}
          <div className="relative z-10 pt-8 mt-6 border-t border-indigo-800/50">
            {onNavigateToIntro ? (
              <button
                id="auth-go-intro-btn"
                type="button"
                onClick={onNavigateToIntro}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-indigo-300" />
                  <span>Platforma bilan to'liq tanishuv (Intro)</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <p className="text-[11px] text-slate-400">
                EduPlatform v2.4 • O'zbekiston bo'yicha onlayn ta'lim platformasi
              </p>
            )}
          </div>
        </div>

        {/* Right Panel: Authentication Form & Quick Test Switches (7 Cols on LG) */}
        <div id="auth-portal-right-panel" className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Nav Switch Tabs: Ro'yxatdan o'tish vs Kirish */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isRegisterMode ? 'Ro\'yxatdan O\'tish Paneli' : 'Tizimga Kirish Paneli'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isRegisterMode
                    ? 'Yangi hisob yaratish uchun ma\'lumotlaringizni kiriting'
                    : 'Mavjud hisobingiz orqali platformaga kiring'}
                </p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  id="portal-tab-register"
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setError(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isRegisterMode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Ro'yxatdan o'tish
                </button>
                <button
                  id="portal-tab-login"
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setError(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    !isRegisterMode
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Kirish
                </button>
              </div>
            </div>

            {error && (
              <div
                id="portal-error-alert"
                className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2"
              >
                <span>{error}</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode ? (
                <>
                  {/* Notice about Admin Approval */}
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Ro'yxatdan o'tgach hisobingiz <strong>Pending (kutilmoqda)</strong> holatida
                      ochiladi. Administrator tasdiqlagach kurslar ochiladi.
                    </span>
                  </div>

                  {/* Mandatory First & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="portal-first-name-input"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Ism (First Name) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="portal-first-name-input"
                          type="text"
                          required
                          autoFocus
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Masalan: Aslonbek"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white caret-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="portal-last-name-input"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Familiya (Last Name) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          id="portal-last-name-input"
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Masalan: Muxtorov"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white caret-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number - Mandatory */}
                  <div>
                    <label
                      htmlFor="portal-phone-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Telefon Raqami (Phone Number) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="portal-phone-input"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white caret-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Login Phone */}
                  <div>
                    <label
                      htmlFor="portal-login-phone-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Telefon Raqamingiz
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="portal-login-phone-input"
                        type="tel"
                        required
                        autoFocus
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white caret-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="portal-login-password-input"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Maxfiy Parol
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="portal-login-password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white caret-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                id="portal-submit-btn"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 mt-3"
              >
                <span>{isRegisterMode ? "Ro'yxatdan O'tish va Boshlash" : 'Platformaga Kirish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Security Assurance */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>EduPlatform xavfsiz va himoyalangan ta'lim tizimi</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
