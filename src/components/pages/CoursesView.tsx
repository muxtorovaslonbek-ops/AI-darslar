import React from 'react';

interface Lesson {
  id?: string;
  title?: string;
  course_name?: string;
  description?: string;
  video_url?: string;
}

interface CoursesViewProps {
  currentLesson?: Lesson;
  onSelectLesson?: (lesson: Lesson) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  currentLesson = {
    title: 'Kirish Darsi',
    description: 'Platformadan foydalanish va asosiy tushunchalar bilan tanishuv.',
    course_name: "Boshlang'ich Dars"
  }
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Mening Darslarim
        </h1>
        
        {currentLesson && (
          <div className="space-y-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
                {currentLesson.course_name || "Boshlang'ich Dars"}
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentLesson.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                {currentLesson.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesView;
