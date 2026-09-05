import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ActiveRoute } from '../../types';
import {
  User,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Clock,
  Edit,
  Award,
  BookOpen,
  CheckCircle,
  FileQuestion,
  Lock,
} from 'lucide-react';

export const ProfileView: React.FC<{ onRouteChange: (route: ActiveRoute) => void }> = ({
  onRouteChange,
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div id="profile-view" className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 mb-1">
          <span>app</span>
          <span>/</span>
          <span className="font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
            /profile
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Mening Profilim
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Shaxsiy hisob ma'lumotlari, tasdiqlash holati va ta'lim natijalari.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  currentUser.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                }
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-indigo-50 dark:ring-indigo-950/50 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow">
                {currentUser.status === 'pending' ? (
                  <Clock className="w-4 h-4 text-amber-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>

                {currentUser.role === 'admin' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    Tizim Administratori
                  </span>
                ) : currentUser.status === 'pending' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Kutilmoqda (Pending)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Tasdiqlangan Talaba
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {currentUser.bio || 'EduPlatform talabasi'}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.phoneNumber}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.email || 'Email mavjud emas'}
                </span>
              </div>
            </div>
          </div>

          <button
            id="profile-goto-settings-btn"
            onClick={() => onRouteChange('settings')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Edit className="w-4 h-4" />
            <span>Sozlamalarni O'zgartirish</span>
          </button>
        </div>

        {/* Status explanation block */}
        {currentUser.status === 'pending' && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              <strong>Admin Tasdiqlashi Kutilmoqda:</strong> Sizning ro'yxatdan o'tgan telefon raqamingiz
              ({currentUser.phoneNumber}) ma'murlarimiz tomonidan tekshirilgach barcha yopiq darslar va sertifikatli testlar ochiladi.
            </div>
          </div>
        )}
      </div>

      {/* Progress and Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">4 ta</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tugallangan darslar</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">88%</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">O'rtacha test balli</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">1 ta</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sertifikat</p>
          </div>
        </div>
      </div>
    </div>
  );
};
