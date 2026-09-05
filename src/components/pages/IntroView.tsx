import React from 'react';
import { Sparkles, Terminal, Video, Globe, Code, Briefcase, ArrowRight, ShieldCheck } from 'lucide-react';

interface IntroViewProps {
  onStart?: () => void;
  onAdminClick?: () => void;
}

const courses = [
  {
    icon: Sparkles,
    title: "Sun'iy Intellekt (AI) sirlari",
    description: "Neyrotarmoqlardan professional darajada foydalanish va ish jarayonlarini avtomatlashtirish."
  },
  {
    icon: Terminal,
    title: "Professional Prompt yozish",
    description: "AI vositalari bilan to'g'ri muloqot qilish, kerakli va aniq natijani olish uchun mukammal buyruqlar (promptlar) tuzish san'ati."
  },
  {
    icon: Video,
    title: "Zamonaviy video va rasmlar tayyorlash",
    description: "Sun'iy intellekt yordamida eksklyuziv vizual kontentlar, logotiplar hamda yuqori sifatli videolar (jumladan Veo 3 orqali) yaratish texnikasi."
  },
  {
    icon: Globe,
    title: "Web-saytlar yaratish",
    description: "Noldan boshlab zamonaviy, foydalanuvchiga qulay va tezkor veb-saytlarni ishlab chiqish."
  },
  {
    icon: Code,
    title: "Dasturlar yaratish",
    description: "Eng so'nggi texnologiyalar yordamida o'z g'oyalaringizni real dasturlarga aylantiring."
  },
  {
    icon: Briefcase,
    title: "Shaxsiya biznesingizni rivojlantirish",
    description: "IT va AI yechimlarini qo'llagan holda o'z biznesingizni yangi bosqichga olib chiqing."
  }
];

export const IntroView: React.FC<IntroViewProps> = ({ onStart, onAdminClick }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Header Buttons */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={onStart}
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          Boshlash va Ro'yxatdan O'tish
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>

        <button
          onClick={onAdminClick}
          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-medium text-sm transition-all active:scale-95"
        >
          <ShieldCheck className="w-4 h-4 mr-2 text-indigo-400" />
          Admin Sifatida Kirish
        </button>
      </div>

      {/* Main Hero Header */}
      <div className="max-w-4xl mx-auto text-center my-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 mb-4">
          Zamonaviy IT va Sun'iy Intellekt Yo'nalishlari
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Dasturlash, AI neyrotarmoqlari va zamonaviy biznes yechimlarini amalda o'rganing.
        </p>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {courses.map((course, index) => {
          const Icon = course.icon;
          return (
            <div
              key={index}
              className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntroView;
