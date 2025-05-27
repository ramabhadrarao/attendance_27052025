import React from 'react';
import { CalendarClock, BookOpen, Clock, User } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import AttendanceSummary from '../../../components/student/AttendanceSummary';
import TodaySchedule from '../../../components/student/TodaySchedule';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - In a real app, this would come from an API
  const attendanceStats = {
    overallPercentage: 87,
    totalClasses: 120,
    present: 104,
    absent: 16,
    subjects: [
      { name: 'Data Structures', percentage: 92 },
      { name: 'Database Management', percentage: 85 },
      { name: 'Computer Networks', percentage: 78 },
      { name: 'Software Engineering', percentage: 94 }
    ]
  };

  const todaySchedule = [
    { period: 1, time: '9:00 - 9:50', subject: 'Data Structures', faculty: 'Dr. Smith', room: 'CS-101' },
    { period: 2, time: '10:00 - 10:50', subject: 'Database Management', faculty: 'Prof. Johnson', room: 'CS-102' },
    { period: 3, time: '11:00 - 11:50', subject: 'Computer Networks', faculty: 'Dr. Williams', room: 'CS-103' },
    { period: 4, time: '12:00 - 12:50', subject: 'Software Engineering', faculty: 'Prof. Davis', room: 'CS-104' },
    { period: 5, time: '2:00 - 2:50', subject: 'Mathematics', faculty: 'Dr. Miller', room: 'CS-105' },
    { period: 6, time: '3:00 - 3:50', subject: 'Programming Lab', faculty: 'Prof. Wilson', room: 'LAB-201' },
    { period: 7, time: '4:00 - 4:50', subject: 'Programming Lab', faculty: 'Prof. Wilson', room: 'LAB-201' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Student Dashboard</h1>
      
      {/* Student Info Card */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">{user?.name}</h2>
            <p className="text-neutral-500">Roll Number: CS2022001</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <BookOpen size={16} />
              <span>B.Tech - Computer Science</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <User size={16} />
              <span>Batch: 2022-26</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock size={16} />
              <span>Semester: 4</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Overall Attendance</p>
              <h3 className="text-2xl font-bold text-primary mt-1">{attendanceStats.overallPercentage}%</h3>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <CalendarClock size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="card bg-success/5 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Classes Attended</p>
              <h3 className="text-2xl font-bold text-success mt-1">{attendanceStats.present}</h3>
            </div>
            <div className="bg-success/10 p-3 rounded-full">
              <CalendarClock size={24} className="text-success" />
            </div>
          </div>
        </div>
        
        <div className="card bg-error/5 border border-error/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Classes Missed</p>
              <h3 className="text-2xl font-bold text-error mt-1">{attendanceStats.absent}</h3>
            </div>
            <div className="bg-error/10 p-3 rounded-full">
              <CalendarClock size={24} className="text-error" />
            </div>
          </div>
        </div>
        
        <div className="card bg-warning/5 border border-warning/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Total Classes</p>
              <h3 className="text-2xl font-bold text-warning mt-1">{attendanceStats.totalClasses}</h3>
            </div>
            <div className="bg-warning/10 p-3 rounded-full">
              <CalendarClock size={24} className="text-warning" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <Clock size={20} className="mr-2 text-primary" />
            Today's Schedule
          </h2>
          <TodaySchedule schedule={todaySchedule} />
        </div>
        
        {/* Attendance Summary */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <CalendarClock size={20} className="mr-2 text-primary" />
            Attendance Summary
          </h2>
          <AttendanceSummary subjects={attendanceStats.subjects} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;