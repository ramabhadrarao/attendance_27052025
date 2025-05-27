import { useState, useCallback } from 'react';
import { studentAPI, hodAPI } from '../services/api';
import { toast } from 'react-toastify';

export const useTimeTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTimeTable = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await studentAPI.getTimeTable();
      return data;
    } catch (error) {
      toast.error('Failed to fetch time table');
      setError('Failed to fetch time table');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTimeTable = useCallback(async (timeTableData: {
    department: string;
    programme: string;
    batch: string;
    section: string;
    semester: number;
    day: string;
    periods: Array<{
      periodNumber: number;
      startTime: string;
      endTime: string;
      subject: string;
      faculty: string;
      isLab: boolean;
      room: string;
    }>;
  }) => {
    try {
      setLoading(true);
      const { data } = await hodAPI.updateTimeTable(timeTableData);
      toast.success('Time table updated successfully');
      return data;
    } catch (error) {
      toast.error('Failed to update time table');
      setError('Failed to update time table');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getTimeTable,
    updateTimeTable
  };
};