import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, UserSession } from '../services/authService';

interface AuthContextType {
  session: UserSession | null;
  isLoading: boolean;
  isOnboarded: boolean;
  login: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  verifyAbha: (abhaInput: string) => Promise<{ success: boolean; message: string }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const refreshSession = async () => {
    try {
      const [currentSession, onboarded] = await Promise.all([
        authService.getSession(),
        authService.isOnboardingCompleted()
      ]);
      setSession(currentSession);
      setIsOnboarded(onboarded);
    } catch (e) {
      console.error('Error restoring auth state:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (phone: string, otp: string) => {
    const res = await authService.verifyOtp(phone, otp);
    if (res.success && res.session) {
      setSession(res.session);
    }
    return { success: res.success, message: res.message };
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
  };

  const completeOnboarding = async () => {
    await authService.setOnboardingCompleted(true);
    setIsOnboarded(true);
  };

  const verifyAbha = async (abhaInput: string) => {
    const res = await authService.verifyAbhaCard(abhaInput);
    if (res.success && res.abhaDetails && session) {
      const updated: UserSession = {
        ...session,
        ...res.abhaDetails,
      };
      setSession(updated);
    }
    return { success: res.success, message: res.message };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isOnboarded,
        login,
        logout,
        completeOnboarding,
        verifyAbha,
        refreshSession,
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
