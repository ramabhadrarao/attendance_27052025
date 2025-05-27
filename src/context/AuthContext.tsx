import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

// Types
type User = {
  id: string;
  name: string;
  username: string;
  role: 'student' | 'faculty' | 'hod';
  department?: string;
  rollNumber?: string;
  batch?: string;
  programme?: string;
  section?: string;
  semester?: number;
  subjects?: string[];
  employeeId?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string, role: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await authAPI.verifyToken();
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string, role: string): Promise<User> => {
    try {
      const { data } = await authAPI.login({ username, password, role });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      login, 
      logout, 
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};