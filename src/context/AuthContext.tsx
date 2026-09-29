import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, referredBy?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  claimDailyStreak: () => Promise<void>;
  loginAsDemo: (role: 'admin' | 'customer') => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nexora_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          setToken(null);
          localStorage.removeItem('nexora_token');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Login failed', 'error');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('nexora_token', data.token);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      setIsAuthModalOpen(false);
      return true;
    } catch {
      showToast('Network error during login', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, referredBy?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, referredBy })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Registration failed', 'error');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('nexora_token', data.token);
      showToast(`Account created! +100 welcome reward points added.`, 'success');
      setIsAuthModalOpen(false);
      return true;
    } catch {
      showToast('Network error during registration', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexora_token');
    showToast('You have been logged out', 'info');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || 'Profile update failed', 'error');
        return false;
      }
      setUser(resData.user);
      showToast('Profile updated successfully', 'success');
      return true;
    } catch {
      showToast('Failed to update profile', 'error');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to change password', 'error');
        return false;
      }
      showToast('Password changed successfully', 'success');
      return true;
    } catch {
      showToast('Network error updating password', 'error');
      return false;
    }
  };

  const claimDailyStreak = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch('/api/auth/claim-streak', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        if (data.user) setUser(data.user);
        showToast(data.message, 'success');
      }
    } catch {
      showToast('Failed to claim streak', 'error');
    }
  };

  const loginAsDemo = async (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      await login('admin@nexora.store', 'Admin@123');
    } else {
      await login('alex@nexora.store', 'Customer@123');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        claimDailyStreak,
        loginAsDemo,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
