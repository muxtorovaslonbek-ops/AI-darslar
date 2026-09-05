import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CourseContext';
import { useAnnouncements } from '../../context/AnnouncementContext';
import { ActiveRoute } from '../../types';
import {
  BookOpen,
  CheckSquare,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Flame,
  Play,
  Bell,
  Pin,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  PlusCircle,
} from 'lucide-react';

export const DashboardView: React.FC<{ onRouteChange: (route: ActiveRoute) => void }> = ({
  onRouteChange,
}) => {
  const { currentUser } = useAuth();
  const { courses, quizzes } = useCourses();
  const { announcements, readIds, markAsRead } = useAnnouncements();

  const isPending = currentUser?.status === 'pending';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div id="dashboard-view" className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-lg shadow-indigo-600/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>EduPlatform Innovatsion Ta'lim Portali</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Xush kelibsiz, {currentUser?.firstName || 'Talaba'}!
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl">
              Interaktiv kurslar, amaliy topshiriqlar va sun'iy intellekt asosidagi yordamchi orqali bilimlaringizni oshiring.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              id="dashboard-explore-courses-btn"
              onClick={() => onRouteChange('courses')}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isPending ? 'Kurslar (Qulflangan)' : 'Kurslarni ko\'rish'}</span>
            </button>

            <button
              id="dashboard-open-ai-btn"
              onClick={() => onRouteChange('ai-assistant')}
              className="px-5 py-2.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/50 border border-white/20 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Yordamchi</span>
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN NOTIFICATIONS & ANNOUNCEMENTS FEED (User requested: Admin xabar yozsa shu yerga kelishi kerak) */}
      <section id="dashboard-admin-announcements-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Admin Bildirishnomalari va Rasmiy Xabarlar</span>
                {announcements.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    {announcements.length} ta xabar
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrator tomonidan yuborilgan rasmiy e'lonlar va tizim yangiliklari
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              id="dashboard-goto-admin-announcements-btn"
              onClick={() => onRouteChange('admin-cms')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Yangi xabar yozish</span>
            </button>
          )}
        </div>

        {announcements.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            Hozircha admin bildirishnomalari mavjud emas.
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => {
              const isRead = readIds.includes(ann.id);
              return (
                <div
                  key={ann.id}
                  onClick={() => markAsRead(ann.id)}
                  className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                    ann.isPinned
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60 shadow-sm'
                      : isRead
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/50 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {ann.isPinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                            <Pin className="w-3 h-3" />
                            Muhim E'lon
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {ann.category === 'important'
                            ? 'Muhim'
                            : ann.category === 'news'
                            ? 'Yangilik'
                            : ann.category === 'update'
                            ? 'Yangilanish'
                            : 'Tizim'}
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {ann.createdAt} • {ann.author}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {ann.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {ann.message}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isRead ? (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          O'qildi
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(ann.id);
                          }}
                          className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 hover:bg-indigo-200 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold transition-all cursor-pointer"
                        >
                          O'qilgan deb belgilash
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Mavjud Kurslar</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{courses.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">+2 yangi</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Interaktiv Testlar</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{quizzes.length}</span>
            <span className="text-xs text-slate-400">Faol sinovlar</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">O'quv Soatlari</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">18.5</span>
            <span className="text-xs text-slate-400">soat</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Ketma-ketlik (Streak)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">5 kun</span>
            <span className="text-xs text-rose-500 font-semibold">Faol</span>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Tavsiya etilayotgan Kurslar
          </h2>
          <button
            onClick={() => onRouteChange('courses')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Barchasini ko'rish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 2).map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{course.category}</span>
                  <span>{course.duration}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{course.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{course.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {course.instructor}
                </span>
                <button
                  onClick={() => onRouteChange('courses')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{isPending ? 'Kursni Ko\'rish' : 'Boshlash'}</span>
                  <Play className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
