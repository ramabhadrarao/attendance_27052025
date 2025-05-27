import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, Menu, X, Home, Calendar, User, 
  ClipboardList, BarChart, BookOpen, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine navigation links based on user role
  const getNavLinks = () => {
    switch (user?.role) {
      case 'student':
        return [
          { to: '/student', icon: <Home size={20} />, label: 'Dashboard' },
          { to: '/student/attendance', icon: <Calendar size={20} />, label: 'My Attendance' },
          { to: '/student/profile', icon: <User size={20} />, label: 'Profile' },
        ];
      case 'faculty':
        return [
          { to: '/faculty', icon: <Home size={20} />, label: 'Dashboard' },
          { to: '/faculty/take-attendance', icon: <ClipboardList size={20} />, label: 'Take Attendance' },
          { to: '/faculty/view-attendance', icon: <Calendar size={20} />, label: 'View Attendance' },
          { to: '/faculty/profile', icon: <User size={20} />, label: 'Profile' },
        ];
      case 'hod':
        return [
          { to: '/hod', icon: <Home size={20} />, label: 'Dashboard' },
          { to: '/hod/reports', icon: <BarChart size={20} />, label: 'Reports' },
          { to: '/hod/department', icon: <BookOpen size={20} />, label: 'Department' },
          { to: '/hod/profile', icon: <User size={20} />, label: 'Profile' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-2 p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-semibold text-neutral-800 hidden md:block">
                  Attendance System
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-neutral-800">{user?.name}</div>
                <div className="text-xs text-neutral-500 capitalize">{user?.role}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden\" onClick={closeSidebar}>
            <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" aria-hidden="true"></div>
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs bg-white shadow-lg">
              <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
                <div className="flex items-center">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <span className="ml-2 text-xl font-semibold text-neutral-800">
                    Attendance
                  </span>
                </div>
                <button 
                  className="rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 p-2"
                  onClick={closeSidebar}
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 px-2 py-4 overflow-y-auto">
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.to}
                    className={`nav-link mb-1 ${location.pathname === link.to ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(link.to);
                      closeSidebar();
                    }}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))}
                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <button 
                    onClick={handleLogout}
                    className="nav-link w-full justify-start text-error"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-neutral-200 lg:bg-white">
          <div className="h-16 flex items-center justify-center border-b border-neutral-200">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-semibold text-neutral-800">
              Attendance
            </span>
          </div>
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.to}
                className={`nav-link mb-2 ${location.pathname === link.to ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(link.to);
                }}
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
            <div className="border-t border-neutral-200 pt-4 mt-6">
              <button 
                onClick={handleLogout}
                className="nav-link w-full justify-start text-error"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="page-container animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;