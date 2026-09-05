import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Moon,
  Sun,
  Sparkles,
  User,
  LogOut,
  Info,
  Bell,
  Pin,
  ExternalLink,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAnnouncements } from '../../context/AnnouncementContext';
import { ActiveRoute } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
  activeRoute?: ActiveRoute;
  onRouteChange?: (route: ActiveRoute) => void;
  onOpenAuthModal?: () => void;
  onNavigate?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  activeRoute = 'dashboard',
  onRouteChange,
  onOpenAuthModal,
  onNavigate,
}) => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { announcements, unreadCount, readIds, markAsRead, markAllAsRead } = useAnnouncements();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const handleNav = (target: string) => {
    if (onRouteChange) {
      onRouteChange(target as ActiveRoute);
    }
    if (onNavigate) {
      onNavigate(target);
    }
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
      className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              id="hamburger-menu-btn"
              onClick={onToggleSidebar}
              className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              aria-label="Menyuni ochish"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <div 
            onClick={() => handleNav('dashboard')} 
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
              AI
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              AI Darslar
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              id="navbar-notifications-bell-btn"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors relative cursor-pointer"
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
                            handleNav('dashboard');
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
                      handleNav('dashboard');
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Mavzuni o'zgartirish"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* User Auth / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('profile')}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profile?.first_name?.[0] || 'U'
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:inline">
                  {profile?.first_name || 'Foydalanuvchi'}
                </span>
              </button>

              <button
                onClick={signOut}
                className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer"
                title="Chiqish"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Kirish</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
