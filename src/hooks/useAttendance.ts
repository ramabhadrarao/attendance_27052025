import { useState, useCallback } from 'react';
import { studentAPI, facultyAPI, hodAPI } from '../services/api';
import { toast } from 'react-toastify';

interface AttendanceStudent {
  student: string;
  status: 'present' | 'absent' | 'late';
}

interface AttendanceData {
  date: string;
  subject: string;
  period: number;
  section: string;
  room?: string;
  students: AttendanceStudent[];
}

interface AttendanceFilters {
  type?: 'daily' | 'weekly' | 'monthly';
  subject?: string;
  startDate?: string;
  endDate?: string;
  programme?: string;
  batch?: string;
  section?: string;
  faculty?: string;
}

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Student methods
  const getStudentAttendance = useCallback(async (filters: AttendanceFilters = {}) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await studentAPI.getAttendance(filters);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch attendance data';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getStudentTimeTable = useCallback(async (day?: string) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await studentAPI.getTimeTable(day ? { day } : undefined);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch timetable';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getStudentSummary = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await studentAPI.getAttendanceSummary();
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch attendance summary';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Faculty methods
  const getFacultyClasses = useCallback(async (date?: string) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await facultyAPI.getClasses(date ? { date } : undefined);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch classes';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getClassStudents = useCallback(async (classInfo: {
    department: string;
    programme: string;
    batch: string;
    section: string;
  }) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await facultyAPI.getClassStudents(classInfo);
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

  const takeAttendance = useCallback(async (attendanceData: AttendanceData) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await facultyAPI.takeAttendance(attendanceData);
      toast.success('Attendance recorded successfully');
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to record attendance';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getFacultyAttendanceRecords = useCallback(async (filters: {
    startDate?: string;
    endDate?: string;
    subject?: string;
    section?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await facultyAPI.getAttendanceRecords(filters);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch attendance records';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getFacultyTimeTable = useCallback(async (day?: string) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await facultyAPI.getTimeTable(day ? { day } : undefined);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch timetable';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getFacultySummary = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await facultyAPI.getAttendanceSummary();
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch attendance summary';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // HOD methods
  const getDepartmentAttendance = useCallback(async (filters: AttendanceFilters = {}) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await hodAPI.getDepartmentAttendance(filters);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch department attendance';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const getHodSummary = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await hodAPI.getAttendanceSummary();
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch attendance summary';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  return {
    loading,
    error,
    clearError,
    
    // Student methods
    getStudentAttendance,
    getStudentTimeTable,
    getStudentSummary,
    
    // Faculty methods
    getFacultyClasses,
    getClassStudents,
    takeAttendance,
    getFacultyAttendanceRecords,
    getFacultyTimeTable,
    getFacultySummary,
    
    // HOD methods
    getDepartmentAttendance,
    getHodSummary
  };
};