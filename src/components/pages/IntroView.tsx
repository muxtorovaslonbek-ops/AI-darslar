import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Code2,
  Terminal,
  ShieldCheck,
  Sparkles,
  Play,
  ArrowRight,
  Bot,
  Cpu,
  Layers,
  Video,
  Briefcase,
  GraduationCap,
  Globe,
  PenTool,
  CheckCircle,
  KeyRound,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
  Clock,
  Flame,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActiveRoute } from '../../types';

interface IntroViewProps {
  onSuccessAuth?: () => void;
  onRouteChange?: (route: ActiveRoute) => void;
}

export const IntroView: React.FC<IntroViewProps> = ({
  onSuccessAuth,
  onRouteChange,
}) => {
  const {
    isAuthenticated,
    register,
    login,
    loginWithGoogle,
    loginWithGmail,
    loginWithTelegram,
    loginAsAdminWithCredentials,
  } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auth Section Tab: 'register' | 'login' | 'admin'
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'admin'>('register');
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'telegram' | 'gmail'>('email');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('@');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin credentials state
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Animated Terminal Typing Effect State
  const [terminalCodeIndex, setTerminalCodeIndex] = useState(0);
  const terminalLines = [
    '# 1. Initialize Neural AI Tutor Model',
    'import eduplatform.ai as gemini_core',
    'model = gemini_core.load_assistant(engine="deep-learning-v3")',
    '',
    '# 2. Compile Real-Time Student Learning Path',
    'student_stack = ["React 19", "AI & Neyrotarmoqlar", "Prompt Engineering", "FullStack Web"]',
    'pipeline = model.generate_roadmap(student_stack, mode="adaptive")',
    '',
    '# 3. Interactive Code Execution: SUCCESS (0 errors)',
    '>>> Ready to transform your tech career! 🚀',
  ];

  // Dynamic code typing simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalCodeIndex((prev) => (prev < terminalLines.length ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, [terminalLines.length]);

  // Interactive Neural Particle Grid (Canvas Animation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for neural web
    const nodeCount = 38;
    const nodes: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ['#818cf8', '#a855f7', '#38bdf8', '#34d399', '#fbbf24'];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting filaments
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.35 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.9;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update particle nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToAuth = () => {
    const el = document.getElementById('intro-auth-portal-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!firstName.trim()) {
      setAuthError('Ismingizni kiriting.');
      return;
    }
    if (!lastName.trim()) {
      setAuthError('Familiyangizni kiriting.');
      return;
    }

    if (authMethod === 'google') {
      if (!emailInput.trim() || !emailInput.includes('@')) {
        setAuthError('Google hisobingiz email manzilini kiriting.');
        return;
      }
      loginWithGoogle(emailInput.trim(), `${firstName} ${lastName}`);
      setAuthSuccess("Google orqali ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
      setTimeout(() => { if (onSuccessAuth) onSuccessAuth(); }, 400);
      return;
    }

    if (authMethod === 'gmail') {
      if (!emailInput.trim() || !emailInput.includes('@')) {
        setAuthError('Gmail manzilingizni kiriting.');
        return;
      }
      loginWithGmail(emailInput.trim(), `${firstName} ${lastName}`);
      setAuthSuccess("Gmail orqali ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
      setTimeout(() => { if (onSuccessAuth) onSuccessAuth(); }, 400);
      return;
    }

    if (authMethod === 'telegram') {
      if (!telegramHandle.trim() || telegramHandle.trim() === '@') {
        setAuthError('Telegram @username kiriting.');
        return;
      }
      loginWithTelegram(telegramHandle.trim(), `${firstName} ${lastName}`);
      setAuthSuccess("Telegram orqali ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
      setTimeout(() => { if (onSuccessAuth) onSuccessAuth(); }, 400);
      return;
    }

    // Default: Email / Username registration
    if (!emailInput.trim()) {
      setAuthError('Email yoki foydalanuvchi loginingizni kiriting.');
      return;
    }

    const success = register(firstName, lastName, emailInput.trim(), 'email');
    if (success) {
      setAuthSuccess("Muvaffaqiyatli ro'yxatdan o'tdingiz! Arizangiz adminga yuborildi.");
      setTimeout(() => {
        if (onSuccessAuth) onSuccessAuth();
      }, 400);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (authMethod === 'google') {
      if (!emailInput.trim() || !emailInput.includes('@')) {
        setAuthError('Google hisobingiz email manzilini kiriting.');
        return;
      }
      const success = loginWithGoogle(emailInput.trim());
      if (success) {
        setAuthSuccess('Google orqali tizimga kirdingiz!');
        setTimeout(() => { if (onSuccessAuth) onSuccessAuth(); }, 400);
      }
      return;
    }

    if (authMethod === 'gmail') {
      if (!emailInput.trim() || !emailInput.includes('@')) {
        setAuthError('Gmail manzilingizni kiriting.');
        return;
      }
      const success = loginWithGmail(emailInput.trim());
      if (success) {
        setAuthSuccess('Gmail orqali tizimga kirdingiz!');
        setTimeout(() => { if (onSuccessAuth) onSuccessAuth(); }, 400);
      }
      return;
    }

    if (authMethod === 'telegram') {
      if (!telegramHandle.trim() || telegramHandle.trim() === '@') {
        setAuthError('Telegram @username kiriting.');
        return;
      }
      const success = loginWithTelegram(telegramHandle.trim());
      if (success) {
        setAuthSuccess('Telegram orqali tizimga kirdingiz!');
        setTimeout(() => { if (onSuccessAuth) onSuccessAuth(); }, 400);
      }
      return;
    }

    // Email / Username login
    if (!emailInput.trim()) {
      setAuthError('Email yoki loginingizni kiriting.');
      return;
    }

    const success = login(emailInput.trim());
    if (success) {
      setAuthSuccess('Tizimga muvaffaqiyatli kirdingiz!');
      setTimeout(() => {
        if (onSuccessAuth) onSuccessAuth();
      }, 400);
    } else {
      setAuthError("Bunday foydalanuvchi topilmadi. Avval ro'yxatdan o'ting.");
    }
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!adminLogin.trim()) {
      setAuthError('Administrator loginini kiriting (Masalan: admin).');
      return;
    }
    if (!adminPassword.trim()) {
      setAuthError('Administrator parolini kiriting (Masalan: admin123).');
      return;
    }

    const res = loginAsAdminWithCredentials(adminLogin.trim(), adminPassword.trim());
    if (res.success) {
      setAuthSuccess('Administrator sifatida muvaffaqiyatli kirdingiz!');
      setTimeout(() => {
        if (onSuccessAuth) onSuccessAuth();
      }, 400);
    } else {
      setAuthError(res.error || "Noto'g'ri administrator login yoki parol! (Standart: login 'admin', parol 'admin123')");
    }
  };

  return (
    <div id="intro-presentation-page" className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* 1. HERO: Animated IT & Artificial Intelligence Neural Engine */}
      <section
        id="intro-hero-section"
        className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-indigo-900/40"
      >
        {/* Interactive Neural Canvas Background */}
        <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Vision & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Next-Gen Sun'iy Intellekt & Dasturlash Ekotizimi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Zamonaviy IT, AI va Dasturlashni{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400">
                Interaktiv O'rganing
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Neyrotarmoqlar, Prompt muhandisligi, AI video va rasmlar yaratish, zamonaviy veb-saytlar va dasturlar ishlab chiqish bo'yicha professional ta'lim.
            </p>

            {/* Quick Feature Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium border border-white/10 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Algoritmlar</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium border border-white/10 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full-Stack Web Dasturlash</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium border border-white/10 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Jonli Amaliyot</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Boshqaruvi</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              {!isAuthenticated ? (
                <>
                  <button
                    id="hero-start-register-btn"
                    onClick={scrollToAuth}
                    className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/40 hover:shadow-indigo-600/60 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Boshlash va Ro'yxatdan O'tish</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    id="hero-admin-quick-btn"
                    onClick={() => {
                      setAuthMode('admin');
                      scrollToAuth();
                    }}
                    className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-sm font-semibold border border-indigo-500/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Admin Sifatida Kirish</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onRouteChange && onRouteChange('dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/40 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Mening O'quv Kabinetimga O'tish</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Simulated Animated IT Terminal */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-900/90 border border-indigo-800/50 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Terminal Header Bar */}
              <div className="bg-slate-950 px-4 py-3 border-b border-indigo-900/40 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-300">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span>gemini-ai-kernel.py</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-4 font-mono text-xs space-y-1.5 bg-slate-950/80 min-h-[220px]">
                {terminalLines.slice(0, terminalCodeIndex).map((line, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      line.startsWith('#')
                        ? 'text-slate-500 font-semibold'
                        : line.startsWith('>>>')
                        ? 'text-emerald-300 font-bold'
                        : line.includes('import') || line.includes('from')
                        ? 'text-purple-300'
                        : 'text-indigo-200'
                    }`}
                  >
                    {line}
                  </div>
                ))}
                <div className="flex items-center gap-1 text-indigo-400 pt-2">
                  <span>eduplatform@ai-core:~$</span>
                  <span className="w-2 h-4 bg-indigo-400 animate-pulse" />
                </div>
              </div>

              {/* Terminal Quick Insight Bar */}
              <div className="bg-slate-900/80 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-indigo-300">
                  <Cpu className="w-3.5 h-3.5" /> Yuqori Tezlikdagi Arxitektura
                </span>
                <span className="text-emerald-400 font-mono">Latency: 12ms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IT & AI LEARNING DIRECTIONS GRID */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Zamonaviy IT va Sun'iy Intellekt Yo'nalishlari
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dasturlash, AI neyrotarmoqlari va zamonaviy biznes yechimlarini amalda o'rganing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Direction 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              🤖 Sun'iy Intellekt (AI) sirlari
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Neyrotarmoqlardan professional darajada foydalanish va ish jarayonlarini avtomatlashtirish.
            </p>
          </div>

          {/* Direction 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              ✍️ Professional Prompt yozish
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              AI vositalari bilan to'g'ri muloqot qilish, kerakli va aniq natijani olish uchun mukammal buyruqlar (promptlar) tuzish san'ati.
            </p>
          </div>

          {/* Direction 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              🎬 Zamonaviy video va rasmlar tayyorlash
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sun'iy intellekt yordamida eksklyuziv vizual kontentlar, logotiplar hamda yuqori sifatli videolar (jumladan Veo 3 orqali) yaratish texnikasi.
            </p>
          </div>

          {/* Direction 4 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              🌐 Web-saytlar yaratish
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Noldan boshlab zamonaviy, foydalanuvchiga qulay va tezkor ishlaydigan shaxsiy hamda biznes veb-saytlarini ishlab chiqish.
            </p>
          </div>

          {/* Direction 5 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              💻 Dasturlar yaratish
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Eng so'nggi texnologiyalar yordamida o'z g'oyalaringizni real loyihalarga aylantirish va dasturlar tuzish.
            </p>
          </div>

          {/* Direction 6 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              💼 Shaxsiy biznesingizni rivojlantirish
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              IT va AI yechimlarini qo'llagan holda o'z biznesingizni raqamlashtirish, xarajatlarni qisqartirish va daromadni karrasiga oshirish.
            </p>
          </div>

          {/* Direction 7 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-3 group md:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  🎓 O'qituvchilar uchun zamonaviy dars tizimlari
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ta'lim jarayonini interaktiv tashkil etish, innovatsion o'qitish metodikalari va har bir o'qituvchi uchun shaxsiy brend (veb-sayt) yaratish sirlari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AUTHENTICATION & ACCESS PORTAL: Register, Login, or Login as Admin */}
      <section
        id="intro-auth-portal-section"
        className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 border border-indigo-800/50 shadow-2xl relative overflow-hidden"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Platformaga Kirish Markazi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ro'yxatdan O'ting yoki Tizimga Kiring
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Talaba sifatida hisob oching yoki Administrator sifatida maxsus login-parol orqali kiring.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-indigo-800/50 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Ro'yxatdan O'tish</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Kirish</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('admin');
                setAuthError(null);
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'admin'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Kirish</span>
            </button>
          </div>

          {/* Error & Success Messages */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-medium text-center">
              {authError}
            </div>
          )}
          {authSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-medium text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-slate-950/70 p-6 sm:p-8 rounded-2xl border border-indigo-900/50 backdrop-blur-md">
            {/* Social / Method Selector for Register & Login */}
            {(authMode === 'register' || authMode === 'login') && (
              <div className="mb-6 space-y-3">
                <div className="text-center text-xs font-semibold text-slate-400">
                  {authMode === 'register' ? "Qaysi usul orqali ro'yxatdan o'tmoqchisiz?" : "Qaysi usul orqali kirmoqchisiz?"}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('google');
                      setAuthError(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      authMethod === 'google'
                        ? 'bg-white text-slate-900 border-white shadow-md shadow-white/10 ring-2 ring-indigo-500'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.39l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Telegram Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('telegram');
                      setAuthError(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      authMethod === 'telegram'
                        ? 'bg-[#229ED9] text-white border-[#229ED9] shadow-md shadow-[#229ED9]/30 ring-2 ring-sky-400'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                    }`}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.926z" />
                    </svg>
                    <span>Telegram</span>
                  </button>

                  {/* Gmail Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('gmail');
                      setAuthError(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      authMethod === 'gmail'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                    }`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Gmail</span>
                  </button>

                  {/* Email / Username Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setAuthError(null);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      authMethod === 'email'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 1: REGISTRATION FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Admin Approval Requirement Notice */}
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Muhim eslatma:</strong> Ro'yxatdan o'tganingizdan so'ng hisobingiz kutilmoqda holatida ochiladi. Darslar va testlar faqat administrator tasdiqlaganidan keyin o'rganish uchun ochiladi.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Ism (First Name) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Masalan: Aslonbek"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Familiya (Last Name) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Masalan: Muxtorov"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Specific Method Input */}
                {authMethod === 'google' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Google Elektron Pochtasi (Gmail) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.39l4.02-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="aslonbek@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'gmail' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Gmail Elektron Pochtasi <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="masalan: aslonbek@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'telegram' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Telegram Username (@username) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 text-[#229ED9] absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.926z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        placeholder="@aslonbek_dev"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm font-mono text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'email' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Elektron Pochta yoki Foydalanuvchi Logini <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="masalan: aslonbek@eduplatform.uz"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <span>
                    {authMethod === 'google'
                      ? "Google bilan Ro'yxatdan O'tish"
                      : authMethod === 'telegram'
                      ? "Telegram bilan Ro'yxatdan O'tish"
                      : authMethod === 'gmail'
                      ? "Gmail bilan Ro'yxatdan O'tish"
                      : "Ro'yxatdan O'tish va Saytni Ochish"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 2: LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {authMethod === 'google' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Google hisobingiz (Gmail manzili)
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.39l4.02-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="aslonbek@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'gmail' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Gmail Pochta Manzilingiz
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="aslonbek@gmail.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'telegram' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Telegram Username (@username)
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 text-[#229ED9] absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.926z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        placeholder="@aslonbek_dev"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm font-mono text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {authMethod === 'email' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Elektron Pochta yoki Foydalanuvchi Logini
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="masalan: aslonbek@eduplatform.uz"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Parol (Ixtiyoriy)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {authMethod === 'google'
                      ? 'Google Orqali Kirish'
                      : authMethod === 'telegram'
                      ? 'Telegram Orqali Kirish'
                      : authMethod === 'gmail'
                      ? 'Gmail Orqali Kirish'
                      : 'Platformaga Kirish'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* TAB 3: ADMIN ACCESS FORM */}
            {authMode === 'admin' && (
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Administrator Xavfsiz Boshqaruv Tizimi:</strong>
                    Kurslar, darslar, testlar va talabalar hisobini tasdiqlash uchun maxsus admin login va paroli talab qilinadi.
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Admin Logini <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={adminLogin}
                      onChange={(e) => setAdminLogin(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Admin Paroli <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm text-white caret-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Administrator Sifatida Kirish</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
