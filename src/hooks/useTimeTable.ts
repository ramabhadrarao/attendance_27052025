import { useState, useCallback } from 'react';
import { studentAPI, facultyAPI, hodAPI, commonAPI } from '../services/api';
import { toast } from 'react-toastify';

interface TimeTablePeriod {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  faculty: string;
  isLab: boolean;
  room: string;
}

interface TimeTableData {
  department: string;
  programme: string;
  batch: string;
  section: string;
  semester: number;
  day: string;
  periods: TimeTablePeriod[];
}

interface TimeTableFilters {
  department?: string;
  programme?: string;
  batch?: string;
  section?: string;
  day?: string;
  faculty?: string;
}

export const useTimeTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Common methods
  const getTimeTableFilters = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const { data } = await commonAPI.getTimeTableFilters();
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch filters';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Student methods
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

  // Faculty methods
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

  // HOD methods
  const getTimeTable = useCallback(async (filters: TimeTableFilters = {}) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await hodAPI.getTimeTable(filters);
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

  const updateTimeTable = useCallback(async (timeTableData: TimeTableData) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await hodAPI.updateTimeTable(timeTableData);
      toast.success('Timetable updated successfully');
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update timetable';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const deleteTimeTable = useCallback(async (id: string) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await hodAPI.deleteTimeTable(id);
      toast.success('Timetable entry deleted successfully');
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete timetable entry';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const bulkImportTimeTable = useCallback(async (timeTableData: TimeTableData[]) => {
    try {
      setLoading(true);
      clearError();
      const { data } = await hodAPI.bulkImportTimeTable({ timeTableData });
      toast.success(`Successfully imported ${data.count} timetable entries`);
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to import timetable';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  // Utility methods
  const generateTimeSlots = useCallback((startHour: number = 9, endHour: number = 17, slotDuration: number = 50) => {
    const slots = [];
    let currentHour = startHour;
    let currentMinute = 0;
    let period = 1;

    while (currentHour < endHour) {
      const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Add slot duration
      currentMinute += slotDuration;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }

      const endTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

      slots.push({
        period,
        startTime,
        endTime,
        timeSlot: `${startTime} - ${endTime}`
      });

      // Add break time (10 minutes)
      currentMinute += 10;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }

      period++;

      // Break for lunch (12:00 - 1:00)
      if (currentHour === 12 && currentMinute === 0) {
        currentHour = 13;
        currentMinute = 0;
      }
    }

    return slots;
  }, []);

  const validateTimeTable = useCallback((timeTableData: TimeTableData) => {
    const errors: string[] = [];

    if (!timeTableData.department) errors.push('Department is required');
    if (!timeTableData.programme) errors.push('Programme is required');
    if (!timeTableData.batch) errors.push('Batch is required');
    if (!timeTableData.section) errors.push('Section is required');
    if (!timeTableData.semester) errors.push('Semester is required');
    if (!timeTableData.day) errors.push('Day is required');
    if (!timeTableData.periods || timeTableData.periods.length === 0) {
      errors.push('At least one period is required');
    }

    // Validate periods
    timeTableData.periods?.forEach((period, index) => {
      if (!period.periodNumber) errors.push(`Period ${index + 1}: Period number is required`);
      if (!period.startTime) errors.push(`Period ${index + 1}: Start time is required`);
      if (!period.endTime) errors.push(`Period ${index + 1}: End time is required`);
      if (!period.subject) errors.push(`Period ${index + 1}: Subject is required`);
      if (!period.faculty) errors.push(`Period ${index + 1}: Faculty is required`);
      if (!period.room) errors.push(`Period ${index + 1}: Room is required`);

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (period.startTime && !timeRegex.test(period.startTime)) {
        errors.push(`Period ${index + 1}: Invalid start time format`);
      }
      if (period.endTime && !timeRegex.test(period.endTime)) {
        errors.push(`Period ${index + 1}: Invalid end time format`);
      }

      // Validate time logic
      if (period.startTime && period.endTime) {
        const start = new Date(`2000-01-01 ${period.startTime}`);
        const end = new Date(`2000-01-01 ${period.endTime}`);
        if (start >= end) {
          errors.push(`Period ${index + 1}: End time must be after start time`);
        }
      }
    });

    // Check for duplicate periods
    const periodNumbers = timeTableData.periods?.map(p => p.periodNumber) || [];
    const uniquePeriods = new Set(periodNumbers);
    if (periodNumbers.length !== uniquePeriods.size) {
      errors.push('Duplicate period numbers found');
    }

    // Check for time conflicts
    const sortedPeriods = [...(timeTableData.periods || [])].sort((a, b) => 
      new Date(`2000-01-01 ${a.startTime}`).getTime() - new Date(`2000-01-01 ${b.startTime}`).getTime()
    );

    for (let i = 0; i < sortedPeriods.length - 1; i++) {
      const current = sortedPeriods[i];
      const next = sortedPeriods[i + 1];
      
      const currentEnd = new Date(`2000-01-01 ${current.endTime}`);
      const nextStart = new Date(`2000-01-01 ${next.startTime}`);
      
      if (currentEnd > nextStart) {
        errors.push(`Time conflict between periods ${current.periodNumber} and ${next.periodNumber}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const formatTimeTableForDisplay = useCallback((timeTable: any[]) => {
    const formatted = timeTable.map(tt => ({
      ...tt,
      periods: tt.periods.map((period: any) => ({
        ...period,
        timeSlot: `${period.startTime} - ${period.endTime}`,
        facultyName: typeof period.faculty === 'object' ? period.faculty.name : period.faculty,
        type: period.isLab ? 'Lab' : 'Theory'
      })).sort((a: any, b: any) => a.periodNumber - b.periodNumber)
    }));

    return formatted;
  }, []);

  return {
    loading,
    error,
    clearError,

    // Common methods
    getTimeTableFilters,

    // Student methods
    getStudentTimeTable,

    // Faculty methods
    getFacultyTimeTable,

    // HOD methods
    getTimeTable,
    updateTimeTable,
    deleteTimeTable,
    bulkImportTimeTable,

    // Utility methods
    generateTimeSlots,
    validateTimeTable,
    formatTimeTableForDisplay
  };
};