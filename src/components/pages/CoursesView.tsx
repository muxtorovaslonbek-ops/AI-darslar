import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CourseContext';
import { Course, Lesson } from '../../types';
import { ProtectedVideoPlayer } from '../common/ProtectedVideoPlayer';
import {
  Lock,
  Clock,
  BookOpen,
  Search,
  Star,
  PlayCircle,
  CheckCircle,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Phone,
  UserCheck,
} from 'lucide-react';

export const CoursesView: React.FC<{ onNavigateToAdmin?: () => void }> = ({
  onNavigateToAdmin,
}) => {
  const { currentUser } = useAuth();
  const { courses, toggleLessonCompleted } = useCourses();

  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const isLocked = !currentUser || currentUser.status === 'pending' || currentUser.status === 'rejected';

  const categories = ['Barchasi', 'Dasturlash', "Sun'iy Intellekt", 'Xorijiy Tillar', 'Aniq Fanlar'];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'Barchasi' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If status is 'pending' or 'rejected', show strictly locked screen with blurred backdrop
  if (isLocked) {
    return (
      <div id="courses-locked-container" className="max-w-4xl mx-auto py-10 px-4 text-center">
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-amber-500/30 shadow-2xl relative overflow-hidden text-white">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Locked Icon Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-400 mb-6 shadow-inner ring-8 ring-amber-500/10 border border-amber-500/30">
            <Lock className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-4">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Holat: Admin Tasdig'i Kutilmoqda (Pending Approval)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Darslarni Ko'rish Uchun Admin Tasdig'i Kutilmoqda
          </h1>

          <p className="mt-3 text-slate-300 max-w-lg mx-auto text-sm leading-relaxed">
            Hurmatli <strong className="text-cyan-300">{currentUser?.firstName || 'Foydalanuvchi'} {currentUser?.lastName || ''}</strong>,
            platformadagi barcha professional darslar va Bunny.net himoyalangan video materiallari faqat administrator tomonidan tasdiqlangan talabalarga ochiladi.
          </p>

          {/* User Status Card */}
          <div className="mt-6 max-w-md mx-auto p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Ro'yxatdan o'tgan ism:</span>
              <span className="font-semibold text-white">{currentUser?.firstName} {currentUser?.lastName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Telefon raqam:</span>
              <span className="font-mono text-cyan-300">{currentUser?.phoneNumber || 'Kiritilmagan'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Ariza holati:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Tekshirilmoqda
              </span>
            </div>
          </div>

          <div className="mt-8">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium max-w-lg">
              <Clock className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              <span>
                Administrator hisobingizni tasdiqlashi bilan barcha kurslar, video darsliklar va testlar avtomatik faollashadi.
              </span>
            </div>
          </div>

          {/* Blurred Teaser - Strictly hides video IDs & links */}
          <div className="mt-10 pt-6 border-t border-slate-800 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 text-center">
              Tasdiqlangandan so'ng ochiladigan dasturlar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-50 pointer-events-none filter blur-[2px]">
              {courses.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between"
                >
                  <div>
                    <h2 className="text-sm font-semibold text-white">{c.title}</h2>
                    <p className="text-xs text-slate-400">{c.lessonsCount} ta dars • {c.duration}</p>
                  </div>
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Approved state: Full access to courses and protected player
  return (
    <div id="courses-active-container" className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-1">
            <span>app</span>
            <span>/</span>
            <span className="font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              /courses
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kurslar va Yo'nalishlar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            IT, Sun'iy Intellekt va zamonaviy texnologiyalar bo'yicha interaktiv darslar to'plami.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="course-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kurslarni qidirish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`course-cat-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            id={`course-card-${course.id}`}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
          >
            {/* Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                {course.category}
              </div>
              <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs font-semibold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{course.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.lessonsCount} ta dars</span>
                </div>
                <h2 className="font-bold text-base text-slate-900 dark:text-white leading-snug group-hover:text-cyan-500 transition-colors">
                  {course.title}
                </h2>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                  {course.instructor}
                </span>

                <button
                  id={`open-course-btn-${course.id}`}
                  onClick={() => {
                    setSelectedCourse(course);
                    setActiveLesson(course.lessons[0] || null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>Darsni Boshlash</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Player Modal with Bunny Stream & Anti-Piracy Watermark */}
      {selectedCourse && (
        <div
          id="course-player-modal"
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          <div className="bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                  {selectedCourse.category}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                id="close-player-modal-btn"
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Lesson player & syllabus */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
              {/* Left 2 Cols: Protected Video Player */}
              <div className="lg:col-span-2 p-5 flex flex-col justify-between space-y-4">
                {/* Dedicated ProtectedVideoPlayer with moving watermark */}
                <ProtectedVideoPlayer
                  libraryId={activeLesson?.libraryId || '384729'}
                  videoId={activeLesson?.bunnyVideoId}
                  title={activeLesson ? activeLesson.title : selectedCourse.title}
                  duration={activeLesson?.duration}
                  currentUser={currentUser}
                  onCompleted={() => {
                    if (activeLesson) {
                      toggleLessonCompleted(selectedCourse.id, activeLesson.id);
                    }
                  }}
                  isCompleted={activeLesson?.isCompleted}
                />

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Dars va Kurs Tafsilotlari
                    </h4>
                    <span className="text-xs font-mono text-cyan-400">
                      Bunny Stream DRM Faol
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeLesson?.description || selectedCourse.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <span>O'qituvchi: {selectedCourse.instructor}</span>
                    <span>Baholash: ⭐ {selectedCourse.rating}</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Lessons List */}
              <div className="p-4 space-y-3 bg-slate-950/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Darslar Mundarijasi ({selectedCourse.lessons.length})
                  </h4>
                  <span className="text-[11px] text-cyan-400 font-mono">
                    {selectedCourse.lessons.filter((l) => l.isCompleted).length}/{selectedCourse.lessons.length} tugallandi
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedCourse.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        activeLesson?.id === lesson.id
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200 font-semibold shadow-sm'
                          : 'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-slate-500 text-[10px]">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <span>{lesson.title}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonCompleted(selectedCourse.id, lesson.id);
                        }}
                        className="text-slate-500 hover:text-emerald-400 transition-colors cursor-pointer"
                        title="Tugallangan deb belgilash"
                      >
                        <CheckCircle
                          className={`w-4 h-4 ${
                            lesson.isCompleted ? 'text-emerald-400 fill-emerald-400/20' : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
