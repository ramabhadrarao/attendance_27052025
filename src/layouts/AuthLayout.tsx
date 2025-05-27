import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-primary-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GraduationCap size={48} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-800">Student Attendance System</h1>
          <p className="text-neutral-500 mt-2">Manage attendance with ease</p>
        </div>
        
        <Outlet />
        
        <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} Student Attendance System
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;