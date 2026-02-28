import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:7000';

// Mock users for demo fallback
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@examflow.com': {
    password: 'admin123',
    user: { id: '1', email: 'admin@examflow.com', name: 'Admin User', role: 'admin' },
  },
  'teacher@examflow.com': {
    password: 'teacher123',
    user: { id: '2', email: 'teacher@examflow.com', name: 'John Smith', role: 'teacher' },
  },
  'student@examflow.com': {
    password: 'student123',
    user: { id: '3', email: 'student@examflow.com', name: 'Jane Doe', role: 'student' },
  },
};

// Decode JWT payload without library
const decodeJwt = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const mapRole = (role: string): UserRole => {
  const r = role.toUpperCase();
  if (r === 'ADMIN') return 'admin';
  if (r === 'TEACHER') return 'teacher';
  return 'student';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('examflow_user');
    const storedToken = localStorage.getItem('examflow_token');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedToken);
      } catch {
        localStorage.removeItem('examflow_user');
        localStorage.removeItem('examflow_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check demo credentials first
    const mockUser = MOCK_USERS[userId.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem('examflow_user', JSON.stringify(mockUser.user));
      return { success: true };
    }

    // Try real API
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (data.status === '0' && data.accessToken) {
        const payload = decodeJwt(data.accessToken);
        const role = mapRole((payload?.roles as string) || 'STUDENT');
        const sub = (payload?.sub as string) || userId;

        const loggedInUser: User = {
          id: sub,
          email: sub,
          name: sub,
          role,
        };

        setUser(loggedInUser);
        setAccessToken(data.accessToken);
        localStorage.setItem('examflow_user', JSON.stringify(loggedInUser));
        localStorage.setItem('examflow_token', data.accessToken);
        return { success: true };
      }

      return { success: false, error: data.messages || 'Login failed' };
    } catch (err) {
      // If API is unreachable and not a demo user
      return { success: false, error: 'Server unavailable. Please try demo credentials or check connection.' };
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('examflow_user');
    localStorage.removeItem('examflow_token');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
