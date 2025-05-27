import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string; role: string }) =>
    api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify')
};

// Student API
export const studentAPI = {
  getAttendance: (type: 'daily' | 'weekly' | 'monthly') =>
    api.get(`/attendance/student?type=${type}`),
  getTimeTable: () =>
    api.get('/timetable', {
      params: {
        day: new Date().toLocaleDateString('en-US', { weekday: 'long' })
      }
    })
};

// Faculty API
export const facultyAPI = {
  getClasses: () => api.get('/attendance/faculty/classes'),
  takeAttendance: (data: {
    date: Date;
    subject: string;
    period: number;
    students: Array<{ student: string; status: 'present' | 'absent' | 'late' }>;
  }) => api.post('/attendance/take', data)
};

// HOD API
export const hodAPI = {
  getDepartmentAttendance: (params: {
    programme?: string;
    batch?: string;
    section?: string;
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
  }) => api.put('/timetable', data)
};

export default api;