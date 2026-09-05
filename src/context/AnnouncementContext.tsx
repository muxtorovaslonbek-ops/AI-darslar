import React, { createContext, useContext, useState, useEffect } from 'react';
import { Announcement } from '../types';
import { INITIAL_ANNOUNCEMENTS } from '../data/mockData';
import { playNotificationSound } from '../utils/audio';

interface AnnouncementContextType {
  announcements: Announcement[];
  readIds: string[];
  unreadCount: number;
  addAnnouncement: (title: string, message: string, category?: Announcement['category'], isPinned?: boolean) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllAnnouncements: () => void;
  playNotificationSound: () => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export function AnnouncementProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('eduplatform-announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse announcements', e);
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [readIds, setReadIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('eduplatform-read-announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse read announcements', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('eduplatform-announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('eduplatform-read-announcements', JSON.stringify(readIds));
  }, [readIds]);

  const addAnnouncement = (
    title: string,
    message: string,
    category: Announcement['category'] = 'important',
    isPinned: boolean = false
  ) => {
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      category,
      author: 'Administrator',
      createdAt: new Date().toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isPinned,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    // Play sound notification immediately when announcement is sent/arrives
    playNotificationSound();
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setReadIds((prev) => prev.filter((item) => item !== id));
  };

  const clearAllAnnouncements = () => {
    setAnnouncements([]);
    setReadIds([]);
    localStorage.removeItem('eduplatform-announcements');
    localStorage.removeItem('eduplatform-read-announcements');
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  };

  const markAllAsRead = () => {
    setReadIds(announcements.map((a) => a.id));
  };

  const unreadCount = announcements.filter((a) => !readIds.includes(a.id)).length;

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        readIds,
        unreadCount,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,
        markAsRead,
        markAllAsRead,
        clearAllAnnouncements,
        playNotificationSound,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
}
