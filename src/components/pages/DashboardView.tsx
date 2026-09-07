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
  Search,
} from 'lucide-react';
import { GlobalSearch } from '../common/GlobalSearch';

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
      {/* Welcome Banner with Atmospheric Ambient Light */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white p-6 sm:p-9 border border-indigo-500/30 shadow-2xl shadow-indigo-950/40">
        {/* Atmospheric Ambient Radial Orbs */}
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-purple-500/25 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />
        
        {/* Geometric Dot Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>EduPlatform Innovatsion Ta'lim Portali</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Xush kelibsiz, {currentUser?.firstName || 'Talaba'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Interaktiv kurslar, amaliy topshiriqlar va sun'iy intellekt asosidagi yordamchi orqali bilimlaringizni oshiring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Glowing Shimmer CTA Button */}
            <div className="relative group/cta">
              {/* Soft Neon Glow Aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-70 group-hover/cta:opacity-100 transition duration-500 group-hover/cta:duration-200 animate-pulse" />
              
              <button
                id="dashboard-explore-courses-btn"
                onClick={() => onRouteChange('courses')}
                className="relative px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-slate-50 font-black text-xs sm:text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer overflow-hidden border border-white/80 group-hover/cta:scale-[1.02]"
              >
                {/* Moving Shimmer Sheen */}
                <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent pointer-events-none" />
                
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>{isPending ? 'Kurslar (Qulflangan)' : "Boshlash va Kurslarni Ko'rish"}</span>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover/cta:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* AI Assistant Button */}
            <button
              id="dashboard-open-ai-btn"
              onClick={() => onRouteChange('ai-assistant')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Yordamchi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Universal Search System for Main Screen */}
      <div id="dashboard-global-search-card" className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Platforma Bo'ylab Qidiruv Tizimi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kurslar, video darslar, interaktiv testlar va yangiliklarni bir zumda toping
              </p>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 hidden sm:block">
            <span>Tezkor qidiruv uchun: </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">⌘K</kbd> yoki <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Ctrl+K</kbd>
          </div>
        </div>

        <GlobalSearch
          onRouteChange={onRouteChange}
          className="w-full"
        />
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
              className="relative group rounded-2xl transition-all duration-300"
            >
              {/* Ambient Border Glow Aura on Hover */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px] -z-10 pointer-events-none" />

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 group-hover:border-transparent shadow-sm group-hover:shadow-[0_12px_30px_-5px_rgba(99,102,241,0.2)] flex flex-col justify-between h-full transition-all duration-300">
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
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <span>{isPending ? 'Kursni Ko\'rish' : 'Boshlash'}</span>
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
