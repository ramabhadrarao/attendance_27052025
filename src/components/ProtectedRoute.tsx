import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'student') {
      return <Navigate to="/student" replace />;
    } else if (user.role === 'faculty') {
      return <Navigate to="/faculty\" replace />;
    } else if (user.role === 'hod') {
      return <Navigate to="/hod" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;