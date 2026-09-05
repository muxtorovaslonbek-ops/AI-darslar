import React, { useState } from 'react';
import { useCourse } from '../../context/CourseContext';
import { ProtectedVideoPlayer } from '../common/ProtectedVideoPlayer';
import { Search, Lock, CheckCircle, PlayCircle, BookOpen, Sparkles } from 'lucide-react';

export const CoursesView: React.FC = () => {
  const { lessons, completedLessons, markAsCompleted } = useCourse();
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter lessons by Search and Category
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || lesson.course_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Unique categories
  const categories = ['all', ...Array.from(new Set(lessons.map(l => l.course_name).filter(Boolean)))];

  // Active playing lesson
  const currentLesson = lessons.find(l => l.id === selectedLessonId) || lessons[0];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span>Video Darsliklar</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Darslarni ketma-ket ko'rib, bilimlaringizni oshirib boring.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Darslarni qidirish..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Grid: Player + Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Video Player Section */}
        <div className="lg:col-span-2 space-y-6">
          {currentLesson ? (
            <>
              <ProtectedVideoPlayer
                videoId={currentLesson.bunny_video_id}
                isCompleted={completedLessons.includes(currentLesson.id)}
                onEnded={() => markAsCompleted(currentLesson.id)}
              />

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
                      {currentLesson.course_name || 'Boshlang'ich Dars'}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {currentLesson.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => markAsCompleted(currentLesson.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      completedLessons.includes(currentLesson.id)
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{completedLessons.includes(currentLesson.id) ? 'Bajarildi' : 'Darsni yakunlash'}</span>
                  </button>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {currentLesson.description || "Ushbu dars bo'yicha ko'rsatmalarga amal qiling va amaliyotni bajaring."}
                </p>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500">Darslar topilmadi.</div>
          )}
        </div>

        {/* Right: Sequential Lesson List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Darslar Mundarijasi</span>
            <span className="text-xs font-normal text-slate-500">
              {completedLessons.length} / {lessons.length} Bajarildi
            </span>
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredLessons.map((lesson, index) => {
              // Sequential Locking Logic: 1st lesson open, subsequent open if previous is completed
              const isFirst = index === 0;
              const isPreviousCompleted = index > 0 && completedLessons.includes(lessons[index - 1]?.id);
              const isUnlocked = isFirst || isPreviousCompleted || completedLessons.includes(lesson.id);
              const isSelected = lesson.id === (selectedLessonId || currentLesson?.id);
              const isDone = completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => isUnlocked && setSelectedLessonId(lesson.id)}
                  className={`p-4 rounded-xl border transition flex items-center justify-between gap-3 ${
                    !isUnlocked
                      ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                      : isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-sm cursor-pointer'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="shrink-0">
                      {!isUnlocked ? (
                        <Lock className="w-5 h-5 text-slate-400" />
                      ) : isDone ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-indigo-500" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                        {index + 1}. {lesson.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {lesson.course_name || 'Darslik'}
                      </p>
                    </div>
                  </div>

                  {!isUnlocked && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                      Qulflangan
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
