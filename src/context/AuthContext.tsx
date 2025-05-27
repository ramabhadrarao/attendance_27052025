import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Types
type User = {
  id: string;
  name: string;
  username: string;
  role: 'student' | 'faculty' | 'hod';
  department?: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

// Mock user data (in a real app, this would come from the backend)
const mockUsers = [
  {
    id: 's1',
    name: 'John Student',
    username: 'student',
    password: 'password',
    role: 'student',
    department: 'Computer Science',
    batch: '2022-26',
    programme: 'B.Tech',
    rollNumber: 'CS2022001'
  },
  {
    id: 'f1',
    name: 'Jane Faculty',
    username: 'faculty',
    password: 'password',
    role: 'faculty',
    department: 'Computer Science',
    subjects: ['Data Structures', 'Algorithms']
  },
  {
    id: 'h1',
    name: 'Alice HOD',
    username: 'hod',
    password: 'password',
    role: 'hod',
    department: 'Computer Science'
  }
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (username: string, password: string, role: string) => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password && u.role === role
    );

    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword as User);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
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