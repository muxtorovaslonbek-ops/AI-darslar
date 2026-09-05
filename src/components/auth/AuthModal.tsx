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
  const [authMethod, setAuthMethod] = useState<'phone' | 'telegram'>('phone');

  // Mandatory Form states: First Name, Last Name, Phone Number
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

      // 2. REGISTRATION (Mandatory: First Name, Last Name, Phone Number - NO EMAIL)
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
        if (!phoneNumber.trim() || phoneNumber.trim().length < 9) {
          setError("Iltimos, telefon raqamingizni to'liq kiriting (Telefon raqam majburiy).");
          setIsSubmitting(false);
          return;
        }

        // Standard Phone Register without email
        const cleanTg = telegramHandle.trim() !== '@' && telegramHandle.trim().length > 1 ? telegramHandle.trim() : undefined;
        const success = await register(
          firstName.trim(),
          lastName.trim(),
          phoneNumber.trim(),
          undefined,
          'phone',
          cleanTg
        );

        if (success) {
          setSuccessMsg("Ro'yxatdan muvaffaqiyatli o'tdingiz! Arizangiz adminga yuborildi.");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 400);
        }
        setIsSubmitting(false);
        return;
      }

      // 3. LOGIN (By Phone Number or Telegram)
      if (authMode === 'login') {
        let identifier = phoneNumber.trim();

        if (authMethod === 'telegram') {
          identifier = telegramHandle.trim();
        } else {
          identifier = phoneNumber.trim();
        }

        if (!identifier || identifier === '@') {
          setError("Iltimos, telefon raqamingizni kiriting.");
          setIsSubmitting(false);
          return;
        }

        const success = login(identifier);
        if (success) {
          setSuccessMsg('Muvaffaqiyatli tizimga kirdingiz!');
          setTimeout(() => { if (onSuccess) onSuccess(); }, 400);
        } else {
          setError("Bunday telefon raqamli foydalanuvchi topilmadi. Avval ro'yxatdan o'tishingiz kerak.");
        }
        setIsSubmitting(false);
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

          {/* Method Selection (Only For Login) */}
          {authMode === 'login' && (
            <div className="mb-5 space-y-2">
              <div className="text-center text-xs font-medium text-slate-400">
                Kirish usulini tanlang:
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Telefon */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('phone');
                    setError(null);
                  }}
                  className={`py-2 px-1 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    authMethod === 'phone'
                      ? 'bg-slate-800 text-cyan-400 border-cyan-500 ring-2 ring-cyan-500/30'
                      : 'bg-slate-950 hover:bg-slate-800/80 text-slate-400 border-slate-800'
                  }`}
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>Telefon Raqam</span>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('telegram');
                    setError(null);
                  }}
                  className={`py-2 px-1 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    authMethod === 'telegram'
                      ? 'bg-slate-800 text-sky-400 border-sky-500 ring-2 ring-sky-500/30'
                      : 'bg-slate-950 hover:bg-slate-800/80 text-slate-400 border-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4 fill-[#229ED9]" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.926z" />
                  </svg>
                  <span>Telegram</span>
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

            {/* 2. REGISTRATION FORM (First Name, Last Name, Phone Number - NO EMAIL) */}
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

                {/* MANDATORY PHONE NUMBER */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefon Raqami (Majburiy) <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Admin tasdiqlashi uchun haqiqiy telefon raqamingizni kiriting.</p>
                </div>

                {/* Optional Telegram */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telegram Username (Ixtiyoriy)
                  </label>
                  <div className="relative">
                    <span className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono">@</span>
                    <input
                      type="text"
                      value={telegramHandle}
                      onChange={(e) => setTelegramHandle(e.target.value)}
                      placeholder="@username"
                      className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <span>Ro'yxatdan O'tish va Ariza Yuborish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* 3. LOGIN FORM */}
            {authMode === 'login' && (
              <>
                {authMethod === 'telegram' ? (
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
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Telefon Raqamingiz
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Ro'yxatdan o'tgan telefon raqamingizni kiriting</p>
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
