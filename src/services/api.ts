import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string; role: string }) =>
    api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
  refreshToken: () => api.post('/auth/refresh')
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/change-password', data),
  getAllStudents: (params?: { programme?: string; batch?: string; section?: string }) =>
    api.get('/users/students', { params }),
  getAllFaculty: () => api.get('/users/faculty'),
  getDepartmentStats: () => api.get('/users/department-stats'),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`)
};

// Student API
export const studentAPI = {
  getAttendance: (params: { 
    type?: 'daily' | 'weekly' | 'monthly';
    subject?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/attendance/student', { params }),
  getTimeTable: (params?: { day?: string }) =>
    api.get('/timetable/student', { params }),
  getAttendanceSummary: () => api.get('/attendance/summary')
};

// Faculty API
export const facultyAPI = {
  getClasses: (params?: { date?: string }) => 
    api.get('/attendance/faculty/classes', { params }),
  takeAttendance: (data: {
    date: string;
    subject: string;
    period: number;
    section: string;
    room?: string;
    students: Array<{ student: string; status: 'present' | 'absent' | 'late' }>;
  }) => api.post('/attendance/take', data),
  getAttendanceRecords: (params?: {
    startDate?: string;
    endDate?: string;
    subject?: string;
    section?: string;
    page?: number;
    limit?: number;
  }) => api.get('/attendance/faculty/records', { params }),
  getClassStudents: (params: {
    department: string;
    programme: string;
    batch: string;
    section: string;
  }) => api.get('/attendance/class-students', { params }),
  getTimeTable: (params?: { day?: string }) =>
    api.get('/timetable/faculty', { params }),
  getAttendanceSummary: () => api.get('/attendance/summary')
};

// HOD API
export const hodAPI = {
  getDepartmentAttendance: (params?: {
    programme?: string;
    batch?: string;
    section?: string;
    subject?: string;
    faculty?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/attendance/department', { params }),
  updateTimeTable: (data: {
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
  }) => api.put('/timetable', data),
  getTimeTable: (params?: {
    department?: string;
    programme?: string;
    batch?: string;
    section?: string;
    day?: string;
    faculty?: string;
  }) => api.get('/timetable', { params }),
  deleteTimeTable: (id: string) => api.delete(`/timetable/${id}`),
  bulkImportTimeTable: (data: { timeTableData: any[] }) =>
    api.post('/timetable/bulk-import', data),
  getTimeTableFilters: () => api.get('/timetable/filters'),
  getAttendanceSummary: () => api.get('/attendance/summary')
};

// Common API
export const commonAPI = {
  getHealth: () => api.get('/health', { baseURL: 'http://localhost:5000' }),
  getTimeTableFilters: () => api.get('/timetable/filters')
};

export default api;