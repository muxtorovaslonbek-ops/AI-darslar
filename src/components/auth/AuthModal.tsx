import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User as UserIcon,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  BookOpen,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
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
  } = useAuth();

  // Mode: 'register' | 'login' | 'admin'
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'admin'>('register');
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'telegram' | 'gmail'>('email');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('@');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin credentials state
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // ADMIN LOGIN
    if (authMode === 'admin') {
      if (!adminLogin.trim()) {
        setError('Administrator loginini kiriting (Masalan: admin).');
        return;
      }
      if (!adminPassword.trim()) {
        setError('Administrator parolini kiriting (Masalan: admin123).');
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
      return;
    }

    // REGISTRATION
    if (authMode === 'register') {
      if (!firstName.trim()) {
        setError('Iltimos, ismingizni kiriting.');
        return;
      }
      if (!lastName.trim()) {
        setError('Iltimos, familiyangizni kiriting.');
        return;
      }

      if (authMethod === 'google') {
        if (!emailInput.trim() || !emailInput.includes('@')) {
          setError('Iltimos, haqiqiy Google email manzilingizni kiriting.');
          return;
        }
        loginWithGoogle(emailInput.trim(), `${firstName} ${lastName}`);
        setSuccessMsg("Google orqali ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
        setTimeout(() => { if (onSuccess) onSuccess(); }, 400);
        return;
      }

      if (authMethod === 'gmail') {
        if (!emailInput.trim() || !emailInput.includes('@')) {
          setError('Iltimos, Gmail pochta manzilingizni kiriting.');
          return;
        }
        loginWithGmail(emailInput.trim(), `${firstName} ${lastName}`);
        setSuccessMsg("Gmail orqali ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
        setTimeout(() => { if (onSuccess) onSuccess(); }, 400);
        return;
      }

      if (authMethod === 'telegram') {
        if (!telegramHandle.trim() || telegramHandle.trim() === '@') {
          setError('Iltimos, Telegram username kiriting (Masalan: @username).');
          return;
        }
        loginWithTelegram(telegramHandle.trim(), `${firstName} ${lastName}`);
        setSuccessMsg("Telegram orqali ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
        setTimeout(() => { if (onSuccess) onSuccess(); }, 400);
        return;
      }

      // Default Email / Username
      if (!emailInput.trim()) {
        setError('Iltimos, email yoki login kiriting.');
        return;
      }

      const success = register(firstName, lastName, emailInput.trim(), 'email');
      if (success) {
        setSuccessMsg("Muvaffaqiyatli ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 400);
      }
      return;
    }

    // LOGIN
    if (authMode === 'login') {
      if (authMethod === 'google') {
        if (!emailInput.trim() || !emailInput.includes('@')) {
          setError('Google hisobingiz email manzilini kiriting.');
          return;
        }
        const success = loginWithGoogle(emailInput.trim());
        if (success) {
          setSuccessMsg('Google orqali tizimga kirdingiz!');
          setTimeout(() => { if (onSuccess) onSuccess(); }, 400);
        }
        return;
      }

      if (authMethod === 'gmail') {
        if (!emailInput.trim() || !emailInput.includes('@')) {
          setError('Gmail manzilingizni kiriting.');
          return;
        }
        const success = loginWithGmail(emailInput.trim());
        if (success) {
          setSuccessMsg('Gmail orqali tizimga kirdingiz!');
          setTimeout(() => { if (onSuccess) onSuccess(); }, 400);
        }
        return;
      }

      if (authMethod === 'telegram') {
        if (!telegramHandle.trim() || telegramHandle.trim() === '@') {
          setError('Telegram @username kiriting.');
          return;
        }
        const success = loginWithTelegram(telegramHandle.trim());
        if (success) {
          setSuccessMsg('Telegram orqali tizimga kirdingiz!');
          setTimeout(() => { if (onSuccess) onSuccess(); }, 400);
        }
        return;
      }

      if (!emailInput.trim()) {
        setError('Email yoki loginingizni kiriting.');
        return;
      }

      const success = login(emailInput.trim());
      if (success) {
        setSuccessMsg('Tizimga muvaffaqiyatli kirdingiz!');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 400);
      } else {
        setError("Bunday foydalanuvchi topilmadi. Avval ro'yxatdan o'ting.");
      }
    }
  };

  return (
    <div
      id="auth-screen-container"
      className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            EduPlatform Ta'lim Portali
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Zamonaviy IT, Sun'iy Intellekt va Dasturlash ta'lim tizimi
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800">
          {/* Top 3-Way Tabs: Ro'yxatdan o'tish, Kirish, Admin */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-6">
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'register'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
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
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
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
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-600 dark:text-amber-400 hover:text-amber-700'
              }`}
            >
              Admin Kirish
            </button>
          </div>

          {error && (
            <div
              id="auth-error-alert"
              className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium"
            >
              {error}
            </div>
          )}

          {successMsg && (
            <div
              id="auth-success-alert"
              className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Method Selection (For Register and Login) */}
          {(authMode === 'register' || authMode === 'login') && (
            <div className="mb-5 space-y-2.5">
              <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                {authMode === 'register' ? "Qaysi usul orqali ro'yxatdan o'tasiz?" : "Qaysi usul orqali kirasiz?"}
              </div>

              <div className="grid grid-cols-4 gap-2">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('google');
                    setError(null);
                  }}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    authMethod === 'google'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                    <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.39l4.02-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
                  </svg>
                  <span>Google</span>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('telegram');
                    setError(null);
                  }}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    authMethod === 'telegram'
                      ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <svg className="w-4 h-4 fill-[#229ED9]" viewBox="0 0 24 24">
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
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    authMethod === 'gmail'
                      ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <svg className="w-4 h-4 fill-rose-500" viewBox="0 0 24 24">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                  </svg>
                  <span>Gmail</span>
                </button>

                {/* Email / Login */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setError(null);
                  }}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    authMethod === 'email'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span>Email</span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ADMIN LOGIN VIEW */}
            {authMode === 'admin' && (
              <>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Administrator Xavfsiz Kirish:</strong> Kurslar, darslar, testlar va talabalar hisobini tasdiqlash uchun maxsus login va parolingizni kiriting.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Admin Logini <span className="text-amber-600">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adminLogin}
                      onChange={(e) => setAdminLogin(e.target.value)}
                      placeholder="admin yoki admin@eduplatform.uz"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Admin Paroli <span className="text-amber-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Admin paroli (admin123)"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-md shadow-amber-600/25 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Admin Panelga Kirish</span>
                </button>
              </>
            )}

            {/* REGISTRATION FORM */}
            {authMode === 'register' && (
              <>
                {/* Notice: Admin approval is strictly required */}
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Ro'yxatdan o'tgach hisobingiz <strong>Pending (kutilmoqda)</strong> holatida bo'ladi. Faqat administrator tasdiqlaganidan so'ng kurslar va testlar ochiladi.
                  </span>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Ism <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Masalan: Sardor"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Familiya <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Masalan: Qodirov"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Method Specific Fields */}
                {authMethod === 'telegram' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Telegram Username <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.926z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        placeholder="@username"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {authMethod === 'google'
                        ? 'Google Pochta Manzili'
                        : authMethod === 'gmail'
                        ? 'Gmail Pochta Manzili'
                        : 'Elektron Pochta yoki Foydalanuvchi Nomi'}{' '}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={
                          authMethod === 'gmail'
                            ? 'masalan@gmail.com'
                            : 'foydalanuvchi@pochta.uz'
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>
                    {authMethod === 'google'
                      ? "Google Bilan Ro'yxatdan O'tish"
                      : authMethod === 'gmail'
                      ? "Gmail Bilan Ro'yxatdan O'tish"
                      : authMethod === 'telegram'
                      ? "Telegram Bilan Ro'yxatdan O'tish"
                      : "Ro'yxatdan O'tish"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <>
                {authMethod === 'telegram' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Telegram Username (@username)
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.926z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        placeholder="@username"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      {authMethod === 'google'
                        ? 'Google Pochta Manzilingiz'
                        : authMethod === 'gmail'
                        ? 'Gmail Pochta Manzilingiz'
                        : 'Elektron Pochta yoki Login'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="masalan: aslonbek@eduplatform.uz"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Parol (Ixtiyoriy)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>
                    {authMethod === 'google'
                      ? 'Google Orqali Kirish'
                      : authMethod === 'gmail'
                      ? 'Gmail Orqali Kirish'
                      : authMethod === 'telegram'
                      ? 'Telegram Orqali Kirish'
                      : 'Platformaga Kirish'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </form>

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
