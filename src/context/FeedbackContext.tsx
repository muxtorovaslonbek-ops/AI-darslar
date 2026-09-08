import React, { createContext, useContext, useState, useEffect } from 'react';
import { FeedbackMessage, FeedbackStatus } from '../types';
import { playNotificationSound } from '../utils/audio';
import { saveFeedbackToFirestore } from '../lib/firebase';

interface FeedbackContextType {
  feedbacks: FeedbackMessage[];
  unreadFeedbacksCount: number;
  sendFeedback: (data: {
    userName: string;
    userEmail?: string;
    userPhone?: string;
    userTelegram?: string;
    type: FeedbackMessage['type'];
    subject: string;
    message: string;
    rating?: number;
    userId?: string;
  }) => Promise<void>;
  updateFeedbackStatus: (id: string, status: FeedbackStatus) => void;
  replyToFeedback: (id: string, replyText: string) => void;
  deleteFeedback: (id: string) => void;
  clearAllFeedbacks: () => void;
}

const INITIAL_FEEDBACKS: FeedbackMessage[] = [
  {
    id: 'fb-1',
    userName: 'Akmal Karimov',
    userEmail: 'akmal.dev@gmail.com',
    userPhone: '+998 90 345 67 89',
    userTelegram: '@akmal_tech',
    type: 'suggestion',
    subject: 'Python va FastAPI bo\'yicha yangi kurs qo\'shilsa ajoyib bo\'lardi',
    message: 'Assalomu alaykum! Platformangiz juda qulay va dizayni yoqimli. Taklifim shuki, backend yo\'nalishida Python va FastAPI orqali mikroxizmatlar yaratish bo\'yicha ham darslar bo\'lsa, talabalarga juda katta yordam bo\'lardi.',
    rating: 5,
    status: 'new',
    createdAt: 'Bugun, 10:45',
  },
  {
    id: 'fb-2',
    userName: 'Dilnoza Salimova',
    userEmail: 'dilnoza.ai@gmail.com',
    userTelegram: '@dilnoza_s',
    type: 'request',
    subject: 'Darslar yakunida sertifikat yuklab olish imkoniyati',
    message: 'Salom admin jamoasi. Kursdagi barcha test va darslarni 100% tamomlagan talabalarga PDF formatida shaxsiy QR-kodli sertifikat berish tizimini qo\'shishingizni so\'rayman.',
    rating: 5,
    status: 'reviewed',
    adminReply: 'Taklifingiz uchun rahmat! Ushbu funksiya keyingi versiya yangilanishimiz rejasiga kiritildi.',
    adminRepliedAt: 'Bugun, 11:20',
    createdAt: 'Kecha, 16:30',
  },
  {
    id: 'fb-3',
    userName: 'Jamshid Ergashev',
    userPhone: '+998 97 123 45 67',
    type: 'opinion',
    subject: 'Platformaning qorong\'u va yorug\'lik rejimi juda chiroyli chiqibdi',
    message: 'Menga ayniqsa yangi qorong\'u rejimdagi kontrast va shriftlar juda yoqdi. Ko\'zni toliqtirmaydi, darslarni tuni bilan bemalol o\'qish mumkin. Rahmat!',
    rating: 5,
    status: 'resolved',
    createdAt: '2 kun oldin',
  },
];

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>(() => {
    const saved = localStorage.getItem('eduplatform-feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved feedbacks', e);
      }
    }
    return INITIAL_FEEDBACKS;
  });

  useEffect(() => {
    localStorage.setItem('eduplatform-feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Listen to storage event for multi-tab notification sound when user submits feedback
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'eduplatform-feedbacks' && e.newValue) {
        try {
          const updated: FeedbackMessage[] = JSON.parse(e.newValue);
          setFeedbacks((curr) => {
            if (updated.length > curr.length) {
              // Admin hears alert chime when student posts a new request/feedback
              playNotificationSound('alert');
            }
            return updated;
          });
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const sendFeedback = async (data: {
    userName: string;
    userEmail?: string;
    userPhone?: string;
    userTelegram?: string;
    type: FeedbackMessage['type'];
    subject: string;
    message: string;
    rating?: number;
    userId?: string;
  }) => {
    const newFeedback: FeedbackMessage = {
      id: `fb-${Date.now()}`,
      userName: data.userName.trim(),
      userEmail: data.userEmail?.trim() || undefined,
      userPhone: data.userPhone?.trim() || undefined,
      userTelegram: data.userTelegram?.trim() || undefined,
      type: data.type,
      subject: data.subject.trim(),
      message: data.message.trim(),
      rating: data.rating,
      userId: data.userId,
      status: 'new',
      createdAt: new Date().toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);
    saveFeedbackToFirestore(newFeedback).catch((e) => {
      console.warn('Feedback Firestore save note:', e);
    });

    // Play pleasant success audio chime
    playNotificationSound('success');
  };

  const updateFeedbackStatus = (id: string, status: FeedbackStatus) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, status } : fb))
    );
  };

  const replyToFeedback = (id: string, replyText: string) => {
    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === id
          ? {
              ...fb,
              adminReply: replyText.trim(),
              adminRepliedAt: new Date().toLocaleDateString('uz-UZ', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              }),
              status: 'resolved',
            }
          : fb
      )
    );
    // Play chime for reply sent
    playNotificationSound('chime');
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
  };

  const clearAllFeedbacks = () => {
    setFeedbacks([]);
    localStorage.removeItem('eduplatform-feedbacks');
  };

  const unreadFeedbacksCount = feedbacks.filter((fb) => fb.status === 'new').length;

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        unreadFeedbacksCount,
        sendFeedback,
        updateFeedbackStatus,
        replyToFeedback,
        deleteFeedback,
        clearAllFeedbacks,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}
