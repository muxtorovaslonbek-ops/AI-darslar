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
    description: "Neyrotarmoqlardan professional darajada foydalanish va ish jarayonlarini avtomatlashtirish.",
    gradient: "from-purple-500 to-indigo-500"
  },
  {
    icon: Terminal,
    title: "Professional Prompt yozish",
    description: "AI vositalari bilan to'g'ri muloqot qilish, kerakli va aniq natijani olish uchun mukammal buyruqlar tuzish san'ati.",
    gradient: "from-amber-500 to-orange-500"
  },
  {
    icon: Video,
    title: "Zamonaviy video va rasmlar tayyorlash",
    description: "Sun'iy intellekt yordamida eksklyuziv vizual kontentlar, logotiplar hamda yuqori sifatli videolar yaratish texnikasi.",
    gradient: "from-rose-500 to-pink-500"
  },
  {
    icon: Globe,
    title: "Web-saytlar yaratish",
    description: "Noldan boshlab zamonaviy, foydalanuvchiga qulay va tezkor veb-saytlarni ishlab chiqish.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Code,
    title: "Dasturlar yaratish",
    description: "Eng so'nggi texnologiyalar yordamida o'z g'oyalaringizni real dasturlarga aylantiring.",
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    icon: Briefcase,
    title: "Shaxsiya biznesingizni rivojlantirish",
    description: "IT va AI yechimlarini qo'llagan holda o'z biznesingizni yangi bosqichga olib chiqing.",
    gradient: "from-violet-500 to-purple-500"
  }
];

export const IntroView: React.FC<IntroViewProps> = ({ onStart, onAdminClick }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Buttons */}
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3 mb-10 relative z-10">
        <button
          onClick={onStart}
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-95"
        >
          Boshlash va Ro'yxatdan O'tish
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>

        <button
          onClick={onAdminClick}
          className="inline-flex items-center px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 backdrop-blur-md font-medium text-sm transition-all duration-200 active:scale-95"
        >
          <ShieldCheck className="w-4 h-4 mr-2 text-indigo-400" />
          Admin Sifatida Kirish
        </button>
      </div>

      {/* Main Hero Header with Gradient Text */}
      <div className="max-w-4xl mx-auto text-center my-14 relative z-10">
        <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300 mb-5 leading-tight">
          Zamonaviy IT va Sun'iy Intellekt Yo'nalishlari
        </h1>
        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto font-normal">
          Dasturlash, AI neyrotarmoqlari va zamonaviy biznes yechimlarini amalda o'rganing.
        </p>
      </div>

      {/* Glassmorphism Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto relative z-10">
        {courses.map((course, index) => {
          const Icon = course.icon;
          return (
            <div
              key={index}
              className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Icon with Glowing Gradient */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.gradient} p-0.5 mb-5 shadow-lg shadow-indigo-500/10`}>
                  <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-indigo-300 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-normal">
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
