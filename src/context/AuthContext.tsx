import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (identifier: string) => boolean;
  loginWithGoogle: (email: string, fullName?: string) => boolean;
  loginWithGmail: (gmail: string, fullName?: string) => boolean;
  loginWithTelegram: (telegramHandle: string, fullName?: string) => boolean;
  loginAsAdmin: () => boolean;
  loginAsAdminWithCredentials: (loginInput: string, passwordInput: string) => { success: boolean; error?: string };
  register: (
    firstName: string,
    lastName: string,
    emailOrIdentifier?: string,
    provider?: 'email' | 'phone' | 'google' | 'gmail' | 'telegram',
    telegramHandle?: string,
    phoneNumber?: string
  ) => boolean;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  updateAnyUser: (userId: string, updates: Partial<User>) => void;
  addUser: (userData: Omit<User, 'id' | 'joinedDate'>) => void;
  deleteUser: (userId: string) => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  switchUserRoleOrStatus: (userId: string, status: UserStatus, role?: UserRole) => void;
  clearDemoUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('eduplatform-users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out any old mock placeholder users, keep real users & admin
        const cleaned = parsed.filter((u: User) => 
          u.role === 'admin' || !u.id.startsWith('demo-')
        );
        const hasAdmin = cleaned.some((u: User) => u.role === 'admin');
        if (!hasAdmin) {
          return [...INITIAL_USERS, ...cleaned];
        }
        return cleaned.length > 0 ? cleaned : INITIAL_USERS;
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem('eduplatform-current-user-id');
    if (saved) {
      return saved;
    }
    return null; // Start unauthenticated to show animated IT/AI Intro first
  });

  useEffect(() => {
    localStorage.setItem('eduplatform-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('eduplatform-current-user-id', currentUserId);
    } else {
      localStorage.removeItem('eduplatform-current-user-id');
    }
  }, [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const isAuthenticated = currentUser !== null;

  const login = (identifier: string): boolean => {
    const cleanInput = identifier.trim().toLowerCase();
    const cleanNoSpaces = cleanInput.replace(/\s+/g, '');
    const user = users.find(
      (u) =>
        (u.email && u.email.toLowerCase() === cleanInput) ||
        (u.telegramHandle && u.telegramHandle.replace(/^@/, '').toLowerCase() === cleanInput.replace(/^@/, '')) ||
        (u.firstName && u.firstName.toLowerCase() === cleanInput) ||
        (`${u.firstName} ${u.lastName}`.toLowerCase() === cleanInput) ||
        (u.id === cleanInput) ||
        (u.phoneNumber && u.phoneNumber.replace(/\s+/g, '') === cleanNoSpaces)
    );
    if (user) {
      setCurrentUserId(user.id);
      return true;
    }
    return false;
  };

  const loginWithGoogle = (email: string, fullName?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    let user = users.find((u) => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      // Auto-register with Google (status: pending approval)
      const parts = (fullName || 'Foydalanuvchi').trim().split(' ');
      const fName = parts[0] || 'Google';
      const lName = parts.slice(1).join(' ') || 'Foydalanuvchisi';
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: fName,
        lastName: lName,
        email: cleanEmail,
        role: 'student',
        status: 'pending',
        authProvider: 'google',
        joinedDate: new Date().toISOString().split('T')[0],
        bio: 'Google hisobi orqali ro\'yxatdan o\'tgan talaba.',
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUserId(newUser.id);
      return true;
    }

    setCurrentUserId(user.id);
    return true;
  };

  const loginWithGmail = (gmail: string, fullName?: string): boolean => {
    let cleanEmail = gmail.trim().toLowerCase();
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@gmail.com`;
    }
    let user = users.find((u) => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      const parts = (fullName || 'Foydalanuvchi').trim().split(' ');
      const fName = parts[0] || 'Gmail';
      const lName = parts.slice(1).join(' ') || 'Foydalanuvchisi';
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: fName,
        lastName: lName,
        email: cleanEmail,
        role: 'student',
        status: 'pending',
        authProvider: 'gmail',
        joinedDate: new Date().toISOString().split('T')[0],
        bio: 'Gmail orqali ro\'yxatdan o\'tgan talaba.',
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUserId(newUser.id);
      return true;
    }

    setCurrentUserId(user.id);
    return true;
  };

  const loginWithTelegram = (telegramHandle: string, fullName?: string): boolean => {
    let cleanHandle = telegramHandle.trim().replace(/^@/, '').toLowerCase();
    let user = users.find(
      (u) =>
        (u.telegramHandle && u.telegramHandle.replace(/^@/, '').toLowerCase() === cleanHandle) ||
        (cleanHandle && u.email && u.email.toLowerCase().startsWith(cleanHandle))
    );

    if (!user) {
      const parts = (fullName || cleanHandle || 'Telegram').trim().split(' ');
      const fName = parts[0] || `@${cleanHandle}`;
      const lName = parts.slice(1).join(' ') || 'Foydalanuvchisi';
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName: fName,
        lastName: lName,
        telegramHandle: `@${cleanHandle}`,
        email: `${cleanHandle}@telegram.user`,
        role: 'student',
        status: 'pending',
        authProvider: 'telegram',
        joinedDate: new Date().toISOString().split('T')[0],
        bio: 'Telegram orqali ro\'yxatdan o\'tgan talaba.',
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUserId(newUser.id);
      return true;
    }

    setCurrentUserId(user.id);
    return true;
  };

  const register = (
    firstName: string,
    lastName: string,
    emailOrIdentifier?: string,
    provider: 'email' | 'phone' | 'google' | 'gmail' | 'telegram' = 'email',
    telegramHandle?: string,
    phoneNumber?: string
  ): boolean => {
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const resolvedEmail =
      emailOrIdentifier && emailOrIdentifier.trim()
        ? emailOrIdentifier.trim().toLowerCase()
        : `${cleanFirst.toLowerCase().replace(/\s+/g, '')}.${cleanLast.toLowerCase().replace(/\s+/g, '')}@student.edu`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: cleanFirst,
      lastName: cleanLast,
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      email: resolvedEmail,
      telegramHandle: telegramHandle ? (telegramHandle.startsWith('@') ? telegramHandle : `@${telegramHandle}`) : undefined,
      authProvider: provider,
      role: 'student',
      status: 'pending', // Pending approval lock requirement: Only Admin can approve!
      joinedDate: new Date().toISOString().split('T')[0],
      bio: 'Yangi ro\'yxatdan o\'tgan talaba.',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    return true;
  };

  const clearDemoUsers = () => {
    setUsers((prev) => {
      // Keep only admin and non-demo registered users
      const filtered = prev.filter((u) => u.role === 'admin' || !u.id.startsWith('demo-'));
      return filtered.length > 0 ? filtered : INITIAL_USERS;
    });
  };

  const loginAsAdmin = (): boolean => {
    let admin = users.find((u) => u.role === 'admin');
    if (!admin) {
      const defaultAdmin = INITIAL_USERS[0];
      setUsers((prev) => [defaultAdmin, ...prev]);
      admin = defaultAdmin;
    }
    setCurrentUserId(admin.id);
    return true;
  };

  const loginAsAdminWithCredentials = (
    loginInput: string,
    passwordInput: string
  ): { success: boolean; error?: string } => {
    const cleanLogin = loginInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // Check credentials (authorized admin logins and passwords)
    const validLogins = ['admin', 'admin@eduplatform.uz', 'eduadmin', 'superadmin'];
    const validPasswords = ['admin123', 'admin2026', 'admin'];

    if (!validLogins.includes(cleanLogin) || !validPasswords.includes(cleanPass)) {
      return {
        success: false,
        error: "Noto'g'ri administrator login yoki parol! (Standart login: 'admin', parol: 'admin123')",
      };
    }

    let admin = users.find((u) => u.role === 'admin');
    if (!admin) {
      const defaultAdmin = INITIAL_USERS[0];
      setUsers((prev) => [defaultAdmin, ...prev]);
      admin = defaultAdmin;
    }
    setCurrentUserId(admin.id);
    return { success: true };
  };

  const addUser = (userData: Omit<User, 'id' | 'joinedDate'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUserId === userId) {
      setCurrentUserId(null);
    }
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
  };

  const updateAnyUser = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
  };

  const approveUser = (userId: string) => {
    // Only administrators are allowed to approve users
    if (currentUser?.role !== 'admin') {
      console.warn("Faqat administrator foydalanuvchini tasdiqlashi mumkin!");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'approved' } : u))
    );
  };

  const rejectUser = (userId: string) => {
    if (currentUser?.role !== 'admin') {
      console.warn("Faqat administrator foydalanuvchini rad etishi mumkin!");
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'rejected' } : u))
    );
  };

  const switchUserRoleOrStatus = (userId: string, status: UserStatus, role?: UserRole) => {
    if (currentUser?.role !== 'admin') {
      console.warn("Faqat administrator foydalanuvchi holatini o'zgartirishi mumkin!");
      return;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status, ...(role ? { role } : {}) }
          : u
      )
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
        login,
        loginWithGoogle,
        loginWithGmail,
        loginWithTelegram,
        loginAsAdmin,
        loginAsAdminWithCredentials,
        register,
        logout,
        updateCurrentUser,
        updateAnyUser,
        addUser,
        deleteUser,
        approveUser,
        rejectUser,
        switchUserRoleOrStatus,
        clearDemoUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
