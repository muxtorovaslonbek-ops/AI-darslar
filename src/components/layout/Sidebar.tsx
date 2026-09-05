import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  User as UserIcon,
  BookOpen,
  CheckSquare,
  Bot,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Clock,
  Sparkles,
  Lock,
  Info,
} from 'lucide-react';

import { ActiveRoute } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeRoute: ActiveRoute;
  onRouteChange: (route: ActiveRoute) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeRoute,
  onRouteChange,
}) => {
  const { currentUser, logout } = useAuth();

  const menuItems: Array<{
    id: ActiveRoute | 'logout';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    locked?: boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'profile',
      label: 'Mening Profilim',
      icon: UserIcon,
    },
    {
      id: 'courses',
      label: "Kurslar va Yo'nalishlar",
      icon: BookOpen,
      locked: currentUser?.status === 'pending',
    },
    {
      id: 'tests',
      label: 'Interaktiv testlar',
      icon: CheckSquare,
      locked: currentUser?.status === 'pending',
    },
    {
      id: 'ai-assistant',
      label: 'AI Yordamchi',
      icon: Bot,
      badge: 'AI',
    },
    {
      id: 'settings',
      label: 'Sozlamalar',
      icon: Settings,
    },
    {
      id: 'logout',
      label: 'Chiqish',
      icon: LogOut,
    },
  ];

  const handleItemClick = (id: ActiveRoute | 'logout') => {
    if (id === 'logout') {
      logout();
      onClose();
      return;
    }
    onRouteChange(id);
    // On small screens, close the drawer after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay for mobile & drawer mode */}
          <motion.div
            id="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Drawer Sidebar */}
          <motion.aside
            id="main-sidebar-drawer"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header / Brand */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    EduPlatform
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      v2.0
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Zamonaviy Ta'lim Portali
                  </p>
                </div>
              </div>
              <button
                id="close-sidebar-btn"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                aria-label="Menyuni yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User status card preview */}
            {currentUser && (
              <div className="px-5 pt-4 pb-2">
                <div
                  id="user-status-card"
                  className={`p-3.5 rounded-xl border ${
                    currentUser.status === 'pending'
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                      : currentUser.role === 'admin'
                      ? 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50'
                      : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        currentUser.avatarUrl ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={`${currentUser.firstName} ${currentUser.lastName}`}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {currentUser.firstName} {currentUser.lastName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {currentUser.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                            <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                            Kutilmoqda (Pending)
                          </span>
                        ) : currentUser.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 dark:text-purple-300">
                            <ShieldCheck className="w-3 h-3 text-purple-500" />
                            Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            Tasdiqlangan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {currentUser.status === 'pending' && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-200 flex items-center justify-between">
                      <span>Kurslar & testlar bloklangan</span>
                      <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Menu Items strictly in the requested order:
                1. Dashboard
                2. Mening Profilim
                3. Kurslar va Yo'nalishlar
                4. Interaktiv testlar
                5. AI Yordamchi
                6. Sozlamalar
                7. Chiqish
            */}
            <div className="flex-1 px-4 py-3 overflow-y-auto space-y-1.5">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Asosiy Menyu
              </div>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeRoute === item.id;
                const isLogout = item.id === 'logout';

                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                      isLogout
                        ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                        : isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span
                        className={`transition-colors ${
                          isActive
                            ? 'text-white'
                            : isLogout
                            ? 'text-rose-500'
                            : 'text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      {item.locked && (
                        <span
                          title="Admin tasdiqlashi talab qilinadi"
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            isActive
                              ? 'bg-indigo-700 text-indigo-100'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          <Lock className="w-2.5 h-2.5" />
                          Locked
                        </span>
                      )}

                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-0.5 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          {item.badge}
                        </span>
                      )}

                      <span className="text-[10px] text-slate-300 dark:text-slate-600 group-hover:opacity-100 font-mono">
                        0{index + 1}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Admin CMS shortcut if user is Admin */}
              {currentUser?.role === 'admin' && (
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="px-2 py-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Admin Panel</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <button
                    id="sidebar-admin-cms-btn"
                    onClick={() => {
                      onRouteChange('admin-cms');
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`w-full mt-1.5 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      activeRoute === 'admin-cms'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Admin CMS & Tasdiqlash</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                      CMS
                    </span>
                  </button>
                </div>
              )}

              {/* Platforma Intro & Tanishuv Link */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="sidebar-intro-btn"
                  onClick={() => {
                    onRouteChange('intro');
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeRoute === 'intro'
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Info className="w-4 h-4 text-indigo-500" />
                    <span>Platforma Kirish & Intro</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                    Taqdimot
                  </span>
                </button>
              </div>

            </div>

            {/* Footer user badge */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Foydalanuvchi:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                  {currentUser?.email || `${currentUser?.firstName || ''}`}
                </span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
