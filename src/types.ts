export type UserRole = 'student' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  telegramHandle?: string;
  authProvider?: 'email' | 'phone' | 'google' | 'gmail' | 'telegram';
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  joinedDate: string;
  bio?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted?: boolean;
  bunnyVideoId?: string;
  libraryId?: string;
  description?: string;
  courseName?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Boshlang\'ich' | 'O\'rta' | 'Yuqori';
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  description: string;
  instructor: string;
  thumbnail: string;
  lessons: Lesson[];
  status: 'active' | 'draft';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  questionsCount: number;
  durationMinutes: number;
  difficulty: 'Oson' | 'O\'rtacha' | 'Qiyin';
  description: string;
  questions: QuizQuestion[];
}

export interface NotificationSettings {
  emailNewCourses: boolean;
  emailTestResults: boolean;
  emailWeeklyDigest: boolean;
  platformAnnouncements: boolean;
  platformDeadlineAlerts: boolean;
  smsSecurityAlerts: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: 'important' | 'news' | 'system' | 'update';
  author: string;
  createdAt: string;
  isPinned?: boolean;
}

export type ActiveRoute =
  | 'dashboard'
  | 'profile'
  | 'courses'
  | 'tests'
  | 'ai-assistant'
  | 'settings'
  | 'admin-cms'
  | 'intro'
  | 'not-found';

