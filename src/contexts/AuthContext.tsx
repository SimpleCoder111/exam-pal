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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@examflow.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@examflow.com',
      name: 'Admin User',
      role: 'admin',
    },
  },
  'teacher@examflow.com': {
    password: 'teacher123',
    user: {
      id: '2',
      email: 'teacher@examflow.com',
      name: 'John Smith',
      role: 'teacher',
    },
  },
  'student@examflow.com': {
    password: 'student123',
    user: {
      id: '3',
      email: 'student@examflow.com',
      name: 'Jane Doe',
      role: 'student',
    },
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('examflow_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('examflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS[email.toLowerCase()];
    
    if (!mockUser) {
      return { success: false, error: 'User not found' };
    }
    
    if (mockUser.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    setUser(mockUser.user);
    localStorage.setItem('examflow_user', JSON.stringify(mockUser.user));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('examflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
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
