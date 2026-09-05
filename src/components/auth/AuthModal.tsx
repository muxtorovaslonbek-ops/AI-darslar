import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User as UserIcon,
  Phone,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Database,
} from 'lucide-react';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const {
    register,
    login,
    loginWithGoogle,
    loginWithGmail,
    loginWithTelegram,
    loginAsAdminWithCredentials,
    isSupabaseActive,
  } = useAuth();

  // Mode: 'register' | 'login' | 'admin'
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'admin'>('register');
  const [authMethod, setAuthMethod] = useState<'google' | 'telegram' | 'gmail'>('google');

  // Form states: First Name, Last Name, Email/Gmail/Google, Telegram, Phone
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+998 ');
  const [telegramHandle, setTelegramHandle] = useState('@');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin credentials state
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      // 1. ADMIN LOGIN
      if (authMode === 'admin') {
        if (!adminLogin.trim()) {
          setError('Administrator loginini kiriting.');
          setIsSubmitting(false);
          return;
        }
        if (!adminPassword.trim()) {
          setError('Administrator parolini kiriting.');
          setIsSubmitting(false);
          return;
        }

        const res = loginAsAdminWithCredentials(adminLogin.trim(), adminPassword.trim());
        if (res.success) {
          setSuccessMsg("Administrator sifatida muvaffaqiyatli kirdingiz!");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 400);
        } else {
          setError(res.error || "Noto'g'ri administrator login yoki parol!");
        }
        setIsSubmitting(false);
        return;
      }

      // 2. REGISTRATION (Google, Telegram, Gmail)
      if (authMode === 'register') {
        if (!firstName.trim()) {
          setError('Iltimos, ismingizni kiriting (Ism majburiy).');
          setIsSubmitting(false);
          return;
        }
        if (!lastName.trim()) {
          setError('Iltimos, familiyangizni kiriting (Familiya majburiy).');
          setIsSubmitting(false);
          return;
        }

        if (authMethod === 'google') {
          if (!emailInput.trim() || !emailInput.includes('@')) {
            setError("Iltimos, to'g'ri Google elektron pochtangizni kiriting.");
            setIsSubmitting(false);
            return;
          }
          await loginWithGoogle(
            emailInput.trim(),
            `${firstName.trim()} ${lastName.trim()}`,
            phoneNumber.trim() || undefined
          );
          setSuccessMsg("Google orqali muvaffaqiyatli ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 400);
          setIsSubmitting(false);
          return;
        }

        if (authMethod === 'gmail') {
          if (!emailInput.trim() || !emailInput.includes('@')) {
            setError("Iltimos, to'g'ri Gmail manzilingizni kiriting.");
            setIsSubmitting(false);
            return;
          }
          await loginWithGmail(
            emailInput.trim(),
            `${firstName.trim()} ${lastName.trim()}`,
            phoneNumber.trim() || undefined
          );
          setSuccessMsg("Gmail orqali muvaffaqiyatli ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 400);
          setIsSubmitting(false);
          return;
        }

        if (authMethod === 'telegram') {
          if (!telegramHandle.trim() || telegramHandle.trim() === '@') {
            setError('Telegram @username kiriting.');
            setIsSubmitting(false);
            return;
          }
          await loginWithTelegram(
            telegramHandle.trim(),
            `${firstName.trim()} ${lastName.trim()}`,
            phoneNumber.trim() || undefined
          );
          setSuccessMsg("Telegram orqali muvaffaqiyatli ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 400);
          setIsSubmitting(false);
          return;
        }
      }

      // 3. LOGIN (By Google, Telegram, Gmail)
      if (authMode === 'login') {
        if (authMethod === 'google') {
          if (!emailInput.trim() || !emailInput.includes('@')) {
            setError('Google hisob pochtasini kiriting.');
            setIsSubmitting(false);
            return;
          }
          const success = await loginWithGoogle(emailInput.trim());
          if (success) {
            setSuccessMsg('Google orqali muvaffaqiyatli kirdingiz!');
            setTimeout(() => {
              if (onSuccess) onSuccess();
            }, 400);
          } else {
            setError("Bunday Google hisobli foydalanuvchi topilmadi. Avval ro'yxatdan o'ting.");
          }
          setIsSubmitting(false);
          return;
        }

        if (authMethod === 'gmail') {
          if (!emailInput.trim() || !emailInput.includes('@')) {
            setError('Gmail pochtangizni kiriting.');
            setIsSubmitting(false);
            return;
          }
          const success = await loginWithGmail(emailInput.trim());
          if (success) {
            setSuccessMsg('Gmail orqali muvaffaqiyatli kirdingiz!');
            setTimeout(() => {
              if (onSuccess) onSuccess();
            }, 400);
          } else {
            setError("Bunday Gmail hisobli foydalanuvchi topilmadi. Avval ro'yxatdan o'ting.");
          }
          setIsSubmitting(false);
          return;
        }

        if (authMethod === 'telegram') {
          if (!telegramHandle.trim() || telegramHandle.trim() === '@') {
            setError('Telegram @username kiriting.');
            setIsSubmitting(false);
            return;
          }
          const success = await loginWithTelegram(telegramHandle.trim());
          if (success) {
            setSuccessMsg('Telegram orqali muvaffaqiyatli kirdingiz!');
            setTimeout(() => {
              if (onSuccess) onSuccess();
            }, 400);
          } else {
            setError("Bunday Telegram foydalanuvchisi topilmadi. Avval ro'yxatdan o'ting.");
          }
          setIsSubmitting(false);
          return;
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-xl shadow-cyan-500/20 mb-3 ring-4 ring-cyan-500/20">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>AI Future</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              LMS
            </span>
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Sun'iy Intellekt va Zamonaviy IT Ta'lim Portali
          </p>

          {/* Supabase Status Indicator */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-slate-800/80 border border-slate-700 text-slate-300">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>{isSupabaseActive ? 'Supabase Auth Faol' : 'Xavfsiz Lokal Baza'}</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 text-white">
          {/* Top 3-Way Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ro'yxatdan o'tish
            </button>
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kirish
            </button>
            <button
              id="auth-tab-admin"
              type="button"
              onClick={() => {
                setAuthMode('admin');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'admin'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              Admin Kirish
            </button>
          </div>

          {error && (
            <div
              id="auth-error-alert"
              className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium"
            >
              {error}
            </div>
          )}

          {successMsg && (
            <div
              id="auth-success-alert"
              className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Method Selection (For Register and Login - Google, Telegram, Gmail) */}
          {(authMode === 'register' || authMode === 'login') && (
            <div className="mb-5 space-y-2">
              <div className="text-center text-xs font-medium text-slate-400">
                {authMode === 'register' ? "Ro'yxatdan o'tish usulini tanlang:" : "Kirish usulini tanlang:"}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('google');
                    setError(null);
                  }}
                  className={`py-2 px-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'google'
                      ? 'bg-slate-800 text-cyan-400 border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'bg-slate-950 hover:bg-slate-800/80 text-slate-400 border-slate-800'
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                      <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.39l4.02-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                    </svg>
                  </div>
                  <span>Google</span>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('telegram');
                    setError(null);
                  }}
                  className={`py-2 px-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'telegram'
                      ? 'bg-slate-800 text-sky-400 border-sky-500 ring-2 ring-sky-500/30'
                      : 'bg-slate-950 hover:bg-slate-800/80 text-slate-400 border-slate-800'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-[#229ED9] shrink-0" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.926z" />
                  </svg>
                  <span>Telegram</span>
                </button>

                {/* Gmail */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('gmail');
                    setError(null);
                  }}
                  className={`py-2 px-1.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMethod === 'gmail'
                      ? 'bg-slate-800 text-rose-400 border-rose-500 ring-2 ring-rose-500/30'
                      : 'bg-slate-950 hover:bg-slate-800/80 text-slate-400 border-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Gmail</span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1. ADMIN LOGIN FORM */}
            {authMode === 'admin' && (
              <>
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800 text-xs text-amber-200 flex items-start gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Administrator Kirish:</strong> Kurslar, darslar va talabalar hisobini tasdiqlash uchun maxsus login va parolingizni kiriting.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Admin Logini <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adminLogin}
                      onChange={(e) => setAdminLogin(e.target.value)}
                      placeholder="admin yoki aslonbek"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Admin Paroli <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Administrator paroli"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Admin Panelga Kirish</span>
                </button>
              </>
            )}

            {/* 2. REGISTRATION FORM (Google, Telegram, Gmail) */}
            {authMode === 'register' && (
              <>
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800 text-xs text-cyan-200 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Yangi ro'yxatdan o'tgan barcha talabalar avtomatik <strong>Pending (kutilmoqda)</strong> holatiga olinadi va admin tasdig'idan so'ng kurslar ochiladi.
                  </span>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ism <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ismingizni kiriting"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Familiya <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Familiyangizni kiriting"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Method-Specific Input */}
                {authMethod === 'google' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Google Elektron Pochtangiz <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                          <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.39l4.02-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="ismingiz@gmail.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'gmail' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gmail Manzilingiz <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="ismingiz@gmail.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'telegram' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Telegram Username (@username) <span className="text-sky-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono">@</span>
                      <input
                        type="text"
                        required
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        placeholder="@username"
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                )}

                {/* Optional Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefon Raqami (Bog'lanish uchun)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <span>
                    {authMethod === 'google'
                      ? "Google bilan Ro'yxatdan O'tish"
                      : authMethod === 'telegram'
                      ? "Telegram bilan Ro'yxatdan O'tish"
                      : "Gmail bilan Ro'yxatdan O'tish"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* 3. LOGIN FORM */}
            {authMode === 'login' && (
              <>
                {authMethod === 'google' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Google Elektron Pochtangiz
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                          <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.39l4.02-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="ismingiz@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'gmail' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gmail Elektron Pochtangiz
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="ismingiz@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'telegram' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Telegram Username (@username)
                    </label>
                    <div className="relative">
                      <span className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono">@</span>
                      <input
                        type="text"
                        required
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        placeholder="@username"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <span>Platformaga Kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </form>

          {/* Security Assurance */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AI Future • Xavfsiz, Shifrlangan va PWA-Moslashtirilgan Platforma</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
