import { useState, useCallback } from 'react';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  role: 'student' | 'faculty' | 'hod';
  department: string;
  address?: string;
  dateOfBirth?: string;
  nationality?: string;
  
  // Student specific
  rollNumber?: string;
  batch?: string;
  programme?: string;
  section?: string;
  semester?: number;
  cgpa?: number;
  guardianName?: string;
  guardianPhone?: string;
  bloodGroup?: string;
  
  // Faculty/HOD specific
  employeeId?: string;
  subjects?: string[];
  qualification?: string;
  experience?: string;
  designation?: string;
  specialization?: string[];
  hodSince?: string;
  previousRoles?: string[];
  publications?: number;
  researchProjects?: number;
}

interface CreateUserData {
  username: string;
  password: string;
  name: string;
  role: 'student' | 'faculty' | 'hod';
  department: string;
  email?: string;
  phone?: string;
  
  // Student specific
  rollNumber?: string;
  batch?: string;
  programme?: string;
  section?: string;
  semester?: number;
  
  // Faculty specific
  subjects?: string[];
  qualification?: string;
  experience?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const useUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Profile management
  const getUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await userAPI.getProfile();
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const updateUserProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await userAPI.updateProfile(profileData);
      toast.success('Profile updated successfully');
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const changePassword = useCallback(async (passwordData: ChangePasswordData) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await userAPI.changePassword(passwordData);
      toast.success('Password changed successfully');
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // User management (Faculty and HOD)
  const getAllStudents = useCallback(async (filters?: {
    programme?: string;
    batch?: string;
    section?: string;
  }) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await userAPI.getAllStudents(filters);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch students';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getAllFaculty = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await userAPI.getAllFaculty();
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch faculty';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getDepartmentStats = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await userAPI.getDepartmentStats();
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch department statistics';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // User CRUD operations (HOD only)
  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      setLoading(true);
      clearError();
      
      // Validate required fields
      if (!userData.username || !userData.password || !userData.name || !userData.role) {
        throw new Error('Missing required fields');
      }
      
      if (userData.role === 'student' && (!userData.rollNumber || !userData.batch || !userData.programme || !userData.section)) {
        throw new Error('Missing required student fields');
      }
      
      const { data } = await userAPI.createUser(userData);
      toast.success(`${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} created successfully`);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create user';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const updateUser = useCallback(async (id: string, userData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await userAPI.updateUser(id, userData);
      toast.success('User updated successfully');
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await userAPI.deleteUser(id);
      toast.success('User deleted successfully');
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Validation utilities
  const validateUserData = useCallback((userData: Partial<CreateUserData>, isUpdate: boolean = false) => {
    const errors: string[] = [];

    if (!isUpdate) {
      if (!userData.username) errors.push('Username is required');
      if (!userData.password) errors.push('Password is required');
      if (!userData.name) errors.push('Name is required');
      if (!userData.role) errors.push('Role is required');
      if (!userData.department) errors.push('Department is required');
    }

    // Validate username format
    if (userData.username && !/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Validate password strength
    if (userData.password && userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    // Validate email format
    if (userData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate phone format
    if (userData.phone && !/^\+?[\d\s-()]+$/.test(userData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    // Role-specific validations
    if (userData.role === 'student') {
      if (!userData.rollNumber) errors.push('Roll number is required for students');
      if (!userData.batch) errors.push('Batch is required for students');
      if (!userData.programme) errors.push('Programme is required for students');
      if (!userData.section) errors.push('Section is required for students');
      
      // Validate roll number format (assuming format like CS2022001)
      if (userData.rollNumber && !/^[A-Z]{2,4}\d{4,7}$/.test(userData.rollNumber)) {
        errors.push('Invalid roll number format');
      }
    }

    if (userData.role === 'faculty') {
      if (!userData.subjects || userData.subjects.length === 0) {
        errors.push('At least one subject is required for faculty');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const formatUserForDisplay = useCallback((user: UserProfile) => {
    const formatted = { ...user };

    // Format dates
    if (formatted.dateOfBirth) {
      formatted.dateOfBirth = new Date(formatted.dateOfBirth).toLocaleDateString();
    }
    if (formatted.hodSince) {
      formatted.hodSince = new Date(formatted.hodSince).toLocaleDateString();
    }

    // Format role-specific display
    if (formatted.role === 'student') {
      formatted.displayInfo = `${formatted.programme} ${formatted.section} - ${formatted.batch}`;
    } else if (formatted.role === 'faculty') {
      formatted.displayInfo = formatted.subjects?.join(', ') || 'No subjects assigned';
    } else if (formatted.role === 'hod') {
      formatted.displayInfo = `Head of ${formatted.department}`;
    }

    return formatted;
  }, []);

  const generateUsername = useCallback((name: string, role: string, rollNumber?: string) => {
    if (role === 'student' && rollNumber) {
      return rollNumber.toLowerCase();
    }
    
    // Generate username from name
    const cleanName = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const rolePrefix = role.charAt(0);
    const timestamp = Date.now().toString().slice(-4);
    
    return `${rolePrefix}${cleanName}${timestamp}`;
  }, []);

  const generateTemporaryPassword = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }, []);

  return {
    loading,
    error,
    clearError,

    // Profile management
    getUserProfile,
    updateUserProfile,
    changePassword,

    // User management
    getAllStudents,
    getAllFaculty,
    getDepartmentStats,

    // CRUD operations
    createUser,
    updateUser,
    deleteUser,

    // Utilities
    validateUserData,
    formatUserForDisplay,
    generateUsername,
    generateTemporaryPassword
  };
};