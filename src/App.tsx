import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Dashboard Pages
import StudentDashboard from './pages/dashboard/student/StudentDashboard';
import FacultyDashboard from './pages/dashboard/faculty/FacultyDashboard';
import HodDashboard from './pages/dashboard/hod/HodDashboard';

// Student Pages
import StudentAttendance from './pages/dashboard/student/StudentAttendance';
import StudentProfile from './pages/dashboard/student/StudentProfile';

// Faculty Pages
import FacultyTakeAttendance from './pages/dashboard/faculty/TakeAttendance';
import FacultyViewAttendance from './pages/dashboard/faculty/ViewAttendance';
import FacultyProfile from './pages/dashboard/faculty/FacultyProfile';

// HOD Pages
import HodReports from './pages/dashboard/hod/Reports';
import HodDepartment from './pages/dashboard/hod/Department';
import HodProfile from './pages/dashboard/hod/HodProfile';

// Context
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>
          </Route>

          {/* Faculty Routes */}
          <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/faculty/take-attendance" element={<FacultyTakeAttendance />} />
              <Route path="/faculty/view-attendance" element={<FacultyViewAttendance />} />
              <Route path="/faculty/profile" element={<FacultyProfile />} />
            </Route>
          </Route>

          {/* HOD Routes */}
          <Route element={<ProtectedRoute allowedRoles={['hod']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/hod" element={<HodDashboard />} />
              <Route path="/hod/reports" element={<HodReports />} />
              <Route path="/hod/department" element={<HodDepartment />} />
              <Route path="/hod/profile" element={<HodProfile />} />
            </Route>
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login\" replace />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;