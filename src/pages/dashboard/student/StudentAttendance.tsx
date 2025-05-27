import React, { useState } from 'react';
import { Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceRecord {
  date: string;
  day: string;
  subjects: {
    name: string;
    time: string;
    status: 'present' | 'absent' | 'late';
    faculty: string;
  }[];
}

const StudentAttendance: React.FC = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Format date for display
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Mock data - In a real app, this would come from an API
  const mockAttendanceData: AttendanceRecord[] = [
    {
      date: '2025-06-10',
      day: 'Monday',
      subjects: [
        { name: 'Data Structures', time: '9:00 - 9:50', status: 'present', faculty: 'Dr. Smith' },
        { name: 'Database Management', time: '10:00 - 10:50', status: 'present', faculty: 'Prof. Johnson' },
        { name: 'Computer Networks', time: '11:00 - 11:50', status: 'absent', faculty: 'Dr. Williams' },
        { name: 'Software Engineering', time: '12:00 - 12:50', status: 'present', faculty: 'Prof. Davis' },
        { name: 'Mathematics', time: '2:00 - 2:50', status: 'late', faculty: 'Dr. Miller' },
        { name: 'Programming Lab', time: '3:00 - 4:50', status: 'present', faculty: 'Prof. Wilson' }
      ]
    }
  ];
  
  // Navigate to previous/next day
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'daily') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'daily') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // Stats calculation
  const calculateStats = () => {
    const totalClasses = mockAttendanceData[0].subjects.length;
    const present = mockAttendanceData[0].subjects.filter(s => s.status === 'present').length;
    const absent = mockAttendanceData[0].subjects.filter(s => s.status === 'absent').length;
    const late = mockAttendanceData[0].subjects.filter(s => s.status === 'late').length;
    
    return {
      total: totalClasses,
      present,
      absent,
      late,
      percentage: Math.round(((present + late) / totalClasses) * 100)
    };
  };
  
  const stats = calculateStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">My Attendance</h1>
      
      {/* View Mode Toggle */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex border border-neutral-300 rounded-md overflow-hidden">
              <button
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'daily' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setViewMode('daily')}
              >
                Daily
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'weekly' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setViewMode('weekly')}
              >
                Weekly
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'monthly' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-neutral-400" />
              </div>
              <input 
                type="date" 
                className="input pl-10"
                value={currentDate.toISOString().split('T')[0]}
                onChange={(e) => setCurrentDate(new Date(e.target.value))}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={navigatePrevious}
              className="p-2 rounded-full hover:bg-neutral-100"
            >
              <ChevronLeft size={20} className="text-neutral-600" />
            </button>
            <span className="text-neutral-800 font-medium">
              {viewMode === 'daily' && formattedDate}
              {viewMode === 'weekly' && `Week of ${formattedDate}`}
              {viewMode === 'monthly' && currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </span>
            <button 
              onClick={navigateNext}
              className="p-2 rounded-full hover:bg-neutral-100"
            >
              <ChevronRight size={20} className="text-neutral-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card bg-neutral-100">
          <p className="text-sm text-neutral-600 mb-1">Total Classes</p>
          <h3 className="text-xl font-bold text-neutral-800">{stats.total}</h3>
        </div>
        <div className="card bg-success/10">
          <p className="text-sm text-success-600 mb-1">Present</p>
          <h3 className="text-xl font-bold text-success">{stats.present}</h3>
        </div>
        <div className="card bg-error/10">
          <p className="text-sm text-error-600 mb-1">Absent</p>
          <h3 className="text-xl font-bold text-error">{stats.absent}</h3>
        </div>
        <div className="card bg-warning/10">
          <p className="text-sm text-warning-600 mb-1">Late</p>
          <h3 className="text-xl font-bold text-warning">{stats.late}</h3>
        </div>
        <div className="card bg-primary/10">
          <p className="text-sm text-primary-600 mb-1">Percentage</p>
          <h3 className="text-xl font-bold text-primary">{stats.percentage}%</h3>
        </div>
      </div>
      
      {/* Attendance Records */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">Attendance Records</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-neutral-400" />
            </div>
            <select className="input pl-10 pr-8 py-1 text-sm">
              <option>All Subjects</option>
              <option>Data Structures</option>
              <option>Database Management</option>
              <option>Computer Networks</option>
              <option>Software Engineering</option>
              <option>Mathematics</option>
              <option>Programming Lab</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Faculty
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {mockAttendanceData[0].subjects.map((subject, index) => (
                <tr key={index} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                    {subject.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {subject.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {subject.faculty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${subject.status === 'present' ? 'status-present' : 
                        subject.status === 'absent' ? 'status-absent' : 
                        'status-late'}
                    `}>
                      {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;