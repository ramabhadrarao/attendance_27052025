import { useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, setUser } = context;

  const login = useCallback(async (username: string, password: string, role: string) => {
    try {
      const { data } = await authAPI.login({ username, password, role });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  }, [setUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, [setUser]);

  const verifyToken = useCallback(async () => {
    try {
      const { data } = await authAPI.verifyToken();
      setUser(data.user);
      return data.user;
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  }, [setUser]);

  return {
    user,
    login,
    logout,
    verifyToken,
    isAuthenticated: !!user
  };
};