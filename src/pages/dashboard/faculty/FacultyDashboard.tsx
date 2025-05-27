import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Users, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import TodayClasses from '../../../components/faculty/TodayClasses';

const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  
  // Mock data - In a real app, this would come from an API
  const classesToday = [
    { period: 1, time: '9:00 - 9:50', subject: 'Data Structures', section: 'CS-A', room: 'CS-101', attendanceStatus: 'Taken' },
    { period: 3, time: '11:00 - 11:50', subject: 'Data Structures', section: 'CS-B', room: 'CS-103', attendanceStatus: 'Pending' },
    { period: 5, time: '2:00 - 2:50', subject: 'Algorithms', section: 'CS-A', room: 'CS-105', attendanceStatus: 'Pending' },
    { period: 6, time: '3:00 - 3:50', subject: 'Programming Lab', section: 'CS-C', room: 'LAB-201', attendanceStatus: 'Pending' },
    { period: 7, time: '4:00 - 4:50', subject: 'Programming Lab', section: 'CS-C', room: 'LAB-201', attendanceStatus: 'Pending' }
  ];
  
  const stats = {
    totalClasses: 24,
    attendanceTaken: 18,
    totalStudents: 156,
    subjects: 2
  };

  const handleTakeAttendance = (period: number) => {
    navigate('/faculty/take-attendance', { state: { period } });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Faculty Dashboard</h1>
      
      {/* Faculty Info Card */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">{user?.name}</h2>
            <p className="text-neutral-500">Faculty ID: F101</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <BookOpen size={16} />
              <span>Department: Computer Science</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Users size={16} />
              <span>Subjects: Data Structures, Algorithms</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Date and Time */}
      <div className="card mb-6 bg-primary/5 border border-primary/10">
        <div className="flex items-center">
          <Clock size={24} className="text-primary mr-3" />
          <div>
            <p className="text-neutral-600">Today's Date</p>
            <h3 className="text-xl font-semibold text-neutral-800">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Total Classes</p>
              <h3 className="text-2xl font-bold text-primary mt-1">{stats.totalClasses}</h3>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <CalendarClock size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="card bg-success/5 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Attendance Taken</p>
              <h3 className="text-2xl font-bold text-success mt-1">{stats.attendanceTaken}</h3>
            </div>
            <div className="bg-success/10 p-3 rounded-full">
              <CalendarClock size={24} className="text-success" />
            </div>
          </div>
        </div>
        
        <div className="card bg-accent/5 border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Total Students</p>
              <h3 className="text-2xl font-bold text-accent mt-1">{stats.totalStudents}</h3>
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <Users size={24} className="text-accent" />
            </div>
          </div>
        </div>
        
        <div className="card bg-secondary/5 border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Subjects</p>
              <h3 className="text-2xl font-bold text-secondary mt-1">{stats.subjects}</h3>
            </div>
            <div className="bg-secondary/10 p-3 rounded-full">
              <BookOpen size={24} className="text-secondary" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Classes */}
      <div className="card">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <CalendarClock size={20} className="mr-2 text-primary" />
          Today's Classes
        </h2>
        <TodayClasses classes={classesToday} onTakeAttendance={handleTakeAttendance} />
      </div>
    </div>
  );
};

export default FacultyDashboard;