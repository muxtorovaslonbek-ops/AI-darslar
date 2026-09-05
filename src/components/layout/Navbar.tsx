import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Moon,
  Sun,
  ShieldCheck,
  Clock,
  Sparkles,
  Lock,
  UserCheck,
  Info,
  Bell,
  CheckCircle,
  Pin,
  X,
  ExternalLink,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAnnouncements } from '../../context/AnnouncementContext';
import { ActiveRoute } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  activeRoute: ActiveRoute;
  onRouteChange: (route: ActiveRoute) => void;
}

const ROUTE_TITLES: Record<ActiveRoute, string> = {
  dashboard: 'Boshqaruv Paneli (Dashboard)',
  profile: 'Mening Profilim',
  courses: "Kurslar va Yo'nalishlar",
  tests: 'Interaktiv Testlar',
  'ai-assistant': 'AI Ta\'lim Yordamchisi',
  settings: 'Tizim Sozlamalari (/settings)',
  'admin-cms': 'Admin CMS & Boshqaruv Tizimi',
  intro: 'Platforma Kirish & Intro Taqdimot',
};

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  activeRoute,
  onRouteChange,
}) => {
  const { currentUser } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { announcements, unreadCount, readIds, markAsRead, markAllAsRead } = useAnnouncements();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="global-navbar"
      className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Current View Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            id="hamburger-menu-btn"
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Menyuni ochish"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white truncate">
              {ROUTE_TITLES[activeRoute] || 'EduPlatform'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Zamonaviy IT & Sun'iy Intellekt Ta'lim Portali
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notifications Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="navbar-notifications-bell-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors relative cursor-pointer"
              title="Admin Bildirishnomalari"
              aria-label="Bildirishnomalar"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Admin Bildirishnomalari
                    </span>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Barchasini o'qish
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {announcements.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Hozircha yangi bildirishnomalar yo'q.
                    </div>
                  ) : (
                    announcements.map((ann) => {
                      const isRead = readIds.includes(ann.id);
                      return (
                        <div
                          key={ann.id}
                          onClick={() => {
                            markAsRead(ann.id);
                            onRouteChange('dashboard');
                            setIsNotifOpen(false);
                          }}
                          className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                            !isRead
                              ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60 font-medium'
                              : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-slate-900 dark:text-white truncate">
                              {ann.title}
                            </span>
                            {ann.isPinned && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 shrink-0 flex items-center gap-0.5">
                                <Pin className="w-2.5 h-2.5" /> Pin
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {ann.message}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>{ann.createdAt}</span>
                            {!isRead && <span className="text-indigo-600 font-bold">• Yangi</span>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => {
                      onRouteChange('dashboard');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1 w-full cursor-pointer"
                  >
                    <span>Asosiy sahifadagi barcha xabarlarni ko'rish</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Intro Presentation Link */}
          <button
            id="navbar-intro-btn"
            onClick={() => onRouteChange('intro')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Platforma tanishtiruv sahifasi"
          >
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            <span>Intro</span>
          </button>

          {/* Quick AI Assistant Link */}
          <button
            id="navbar-ai-assistant-btn"
            onClick={() => onRouteChange('ai-assistant')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Yordamchi</span>
          </button>

          {/* Theme Toggle (Light/Dark) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition-colors cursor-pointer"
            title={`Hozirgi mavzu: ${resolvedTheme === 'dark' ? 'Qorong\'u' : 'Yorug\' '}`}
            aria-label="Mavzuni o'zgartirish"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Profile Pill */}
          {currentUser && (
            <button
              id="navbar-user-chip"
              onClick={() => onRouteChange('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer"
            >
              <div className="relative">
                <img
                  src={
                    currentUser.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={currentUser.firstName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                {currentUser.role === 'admin' ? (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                ) : currentUser.status === 'pending' ? (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                ) : (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </div>
              <div className="hidden lg:block">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[120px]">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5 font-mono">
                  {currentUser.role === 'admin' ? 'Administrator' : currentUser.status === 'pending' ? 'Pending' : 'Talaba'}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
