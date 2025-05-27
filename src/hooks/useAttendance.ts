import { useState, useCallback } from 'react';
import { studentAPI, facultyAPI, hodAPI } from '../services/api';
import { toast } from 'react-toastify';

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStudentAttendance = useCallback(async (type: 'daily' | 'weekly' | 'monthly') => {
    try {
      setLoading(true);
      const { data } = await studentAPI.getAttendance(type);
      return data;
    } catch (error) {
      toast.error('Failed to fetch attendance data');
      setError('Failed to fetch attendance data');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFacultyClasses = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await facultyAPI.getClasses();
      return data;
    } catch (error) {
      toast.error('Failed to fetch classes');
      setError('Failed to fetch classes');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const takeAttendance = useCallback(async (attendanceData: {
    date: Date;
    subject: string;
    period: number;
    students: Array<{ student: string; status: 'present' | 'absent' | 'late' }>;
  }) => {
    try {
      setLoading(true);
      const { data } = await facultyAPI.takeAttendance(attendanceData);
      toast.success('Attendance recorded successfully');
      return data;
    } catch (error) {
      toast.error('Failed to record attendance');
      setError('Failed to record attendance');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDepartmentAttendance = useCallback(async (params: {
    programme?: string;
    batch?: string;
    section?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      setLoading(true);
      const { data } = await hodAPI.getDepartmentAttendance(params);
      return data;
    } catch (error) {
      toast.error('Failed to fetch department attendance');
      setError('Failed to fetch department attendance');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getStudentAttendance,
    getFacultyClasses,
    takeAttendance,
    getDepartmentAttendance
  };
};