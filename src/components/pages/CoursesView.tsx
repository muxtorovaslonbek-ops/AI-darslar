import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CourseContext';
import { Course, Lesson } from '../../types';
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

  const isLocked = currentUser?.status === 'pending';

  const categories = ['Barchasi', 'Dasturlash', "Sun'iy Intellekt", 'Xorijiy Tillar', 'Aniq Fanlar'];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'Barchasi' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If status is 'pending', show the Admin Approval Locked State!
  if (isLocked) {
    return (
      <div id="courses-locked-container" className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-amber-200 dark:border-amber-900/50 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Locked Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-6 shadow-inner ring-8 ring-amber-50 dark:ring-amber-950/20">
            <Lock className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800 mb-4">
            <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
            <span>Holatingiz: Kutilmoqda (Pending Approval)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Kurslar va Yo'nalishlar Bo'limi Qulflangan
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Hurmatli <strong className="text-slate-900 dark:text-white">{currentUser?.firstName} {currentUser?.lastName}</strong>,
            xavfsizlik va guruhlarni to'g'ri taqsimlash maqsadida sizning so'rovingiz
            administrator tomonidan ko'rib chiqilmoqda. Admin tasdiqlagach barcha kurslar va darsliklar sizga ochiladi.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm font-medium">
              <Clock className="w-4 h-4 animate-spin text-amber-600" />
              <span>Arizangiz ko'rib chiqilmoqda. Administrator tasdiqlaganidan so'ng ushbu sahifadagi barcha darslar avtomatik ravishda ochiladi.</span>
            </div>
          </div>

          {/* Locked Preview Teaser */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 text-center">
              Tasdiqlangandan so'ng ochiladigan kurslar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-60 pointer-events-none filter blur-[0.5px]">
              {courses.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
                >
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{c.title}</h2>
                    <p className="text-xs text-slate-500">{c.lessonsCount} ta dars • {c.duration}</p>
                  </div>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Approved state: full access to courses
  return (
    <div id="courses-active-container" className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 mb-1">
            <span>app</span>
            <span>/</span>
            <span className="font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
              /courses
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kurslar va Yo'nalishlar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            IT, Sun'iy intellekt va chet tillari bo'yicha interaktiv darsliklar to'plami.
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
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
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
                <h2 className="font-bold text-base text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <span>Darsni Boshlash</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Player Modal */}
      {selectedCourse && (
        <div
          id="course-player-modal"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6"
        >
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">
                  {selectedCourse.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Lesson player mockup & syllabus */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
              {/* Left 2 Cols: Video / Interactive screen */}
              <div className="md:col-span-2 p-5 flex flex-col justify-between space-y-4">
                <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center shadow-inner">
                  <div className="text-center p-6">
                    <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/40">
                      <PlayCircle className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {activeLesson ? activeLesson.title : 'Darsni tanlang'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Davomiyligi: {activeLesson?.duration || '00:00'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Kurs Tavsifi
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedCourse.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>O'qituvchi: {selectedCourse.instructor}</span>
                    <span>Baholash: ⭐ {selectedCourse.rating}</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Lessons List */}
              <div className="p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Darslar Mundarijasi ({selectedCourse.lessons.length})
                </h4>

                <div className="space-y-2">
                  {selectedCourse.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        activeLesson?.id === lesson.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-slate-400 text-[10px]">
                          0{idx + 1}
                        </span>
                        <span>{lesson.title}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonCompleted(selectedCourse.id, lesson.id);
                        }}
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                        title="Tugallangan deb belgilash"
                      >
                        <CheckCircle
                          className={`w-4 h-4 ${
                            lesson.isCompleted ? 'text-emerald-500 fill-emerald-500/20' : ''
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
