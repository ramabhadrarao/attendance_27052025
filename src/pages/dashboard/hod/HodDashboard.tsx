import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, BarChart2, CalendarClock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import DepartmentSummary from '../../../components/hod/DepartmentSummary';
import AttendanceChart from '../../../components/hod/AttendanceChart';

const HodDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock data - In a real app, this would come from an API
  const stats = {
    totalStudents: 354,
    totalFaculty: 24,
    totalPrograms: 4,
    attendanceRate: 87.5
  };
  
  // Mock data for department summary
  const departmentData = {
    programs: [
      { 
        name: 'B.Tech Computer Science', 
        students: 180, 
        batches: 3, 
        sections: ['CS-A', 'CS-B', 'CS-C'],
        attendanceRate: 89.2
      },
      { 
        name: 'M.Tech Computer Science', 
        students: 45, 
        batches: 2, 
        sections: ['MCS-A'],
        attendanceRate: 92.5
      },
      { 
        name: 'B.Tech Information Technology', 
        students: 120, 
        batches: 2, 
        sections: ['IT-A', 'IT-B'],
        attendanceRate: 85.6
      },
      { 
        name: 'PhD Computer Science', 
        students: 9, 
        batches: 1, 
        sections: ['PhD-CS'],
        attendanceRate: 94.3
      }
    ]
  };
  
  // Mock data for attendance charts
  const attendanceData = {
    weekly: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      datasets: [
        {
          label: 'Attendance Rate (%)',
          data: [88, 91, 86, 89, 85],
          backgroundColor: 'rgba(51, 102, 204, 0.6)',
          borderColor: 'rgba(51, 102, 204, 1)',
          borderWidth: 1
        }
      ]
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'B.Tech CS',
          data: [92, 88, 90, 87],
          backgroundColor: 'rgba(51, 102, 204, 0.6)',
          borderColor: 'rgba(51, 102, 204, 1)',
          borderWidth: 1
        },
        {
          label: 'M.Tech CS',
          data: [95, 93, 94, 91],
          backgroundColor: 'rgba(19, 128, 134, 0.6)',
          borderColor: 'rgba(19, 128, 134, 1)',
          borderWidth: 1
        },
        {
          label: 'B.Tech IT',
          data: [88, 86, 84, 85],
          backgroundColor: 'rgba(255, 159, 28, 0.6)',
          borderColor: 'rgba(255, 159, 28, 1)',
          borderWidth: 1
        }
      ]
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">HOD Dashboard</h1>
      
      {/* HOD Info Card */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-800">{user?.name}</h2>
            <p className="text-neutral-500">HOD, Department of Computer Science</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => navigate('/hod/reports')}
              className="btn btn-primary"
            >
              View Detailed Reports
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="card bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Total Students</p>
              <h3 className="text-2xl font-bold text-primary mt-1">{stats.totalStudents}</h3>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Users size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="card bg-secondary/5 border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Faculty Members</p>
              <h3 className="text-2xl font-bold text-secondary mt-1">{stats.totalFaculty}</h3>
            </div>
            <div className="bg-secondary/10 p-3 rounded-full">
              <Users size={24} className="text-secondary" />
            </div>
          </div>
        </div>
        
        <div className="card bg-accent/5 border border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Programs</p>
              <h3 className="text-2xl font-bold text-accent mt-1">{stats.totalPrograms}</h3>
            </div>
            <div className="bg-accent/10 p-3 rounded-full">
              <BookOpen size={24} className="text-accent" />
            </div>
          </div>
        </div>
        
        <div className="card bg-success/5 border border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 font-medium">Avg. Attendance</p>
              <h3 className="text-2xl font-bold text-success mt-1">{stats.attendanceRate}%</h3>
            </div>
            <div className="bg-success/10 p-3 rounded-full">
              <CalendarClock size={24} className="text-success" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Attendance Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <BarChart2 size={20} className="mr-2 text-primary" />
            Weekly Attendance
          </h2>
          <AttendanceChart data={attendanceData.weekly} type="bar" />
        </div>
        
        {/* Monthly Attendance Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
            <BarChart2 size={20} className="mr-2 text-primary" />
            Monthly Program Comparison
          </h2>
          <AttendanceChart data={attendanceData.monthly} type="bar" />
        </div>
      </div>
      
      {/* Department Summary */}
      <div className="card">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
          <BookOpen size={20} className="mr-2 text-primary" />
          Department Summary
        </h2>
        <DepartmentSummary programs={departmentData.programs} />
      </div>
    </div>
  );
};

export default HodDashboard;