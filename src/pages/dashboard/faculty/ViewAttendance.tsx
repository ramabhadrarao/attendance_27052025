import React, { useState } from 'react';
import { Calendar, Filter, Download, Eye, Search } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  section: string;
  period: number;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

const ViewAttendance: React.FC = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  
  // Mock data - In a real app, this would come from an API
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      date: '2025-06-10',
      subject: 'Data Structures',
      section: 'CS-A',
      period: 1,
      totalStudents: 45,
      present: 42,
      absent: 2,
      late: 1,
      percentage: 95.6
    },
    {
      id: '2',
      date: '2025-06-10',
      subject: 'Data Structures',
      section: 'CS-B',
      period: 3,
      totalStudents: 43,
      present: 40,
      absent: 3,
      late: 0,
      percentage: 93.0
    },
    {
      id: '3',
      date: '2025-06-09',
      subject: 'Algorithms',
      section: 'CS-A',
      period: 5,
      totalStudents: 45,
      present: 38,
      absent: 5,
      late: 2,
      percentage: 88.9
    },
    {
      id: '4',
      date: '2025-06-09',
      subject: 'Programming Lab',
      section: 'CS-C',
      period: 6,
      totalStudents: 40,
      present: 36,
      absent: 3,
      late: 1,
      percentage: 92.5
    },
    {
      id: '5',
      date: '2025-06-08',
      subject: 'Data Structures',
      section: 'CS-A',
      period: 1,
      totalStudents: 45,
      present: 44,
      absent: 1,
      late: 0,
      percentage: 97.8
    }
  ];

  // Filter records based on selected filters
  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    const startDate = new Date(dateFilter.startDate);
    const endDate = new Date(dateFilter.endDate);
    
    const dateMatch = recordDate >= startDate && recordDate <= endDate;
    const subjectMatch = subjectFilter === 'all' || record.subject === subjectFilter;
    const sectionMatch = sectionFilter === 'all' || record.section === sectionFilter;
    
    return dateMatch && subjectMatch && sectionMatch;
  });

  // Get unique subjects and sections for filter dropdowns
  const subjects = [...new Set(attendanceRecords.map(record => record.subject))];
  const sections = [...new Set(attendanceRecords.map(record => record.section))];

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Subject', 'Section', 'Period', 'Total Students', 'Present', 'Absent', 'Late', 'Percentage'];
    const csvContent = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.date,
        record.subject,
        record.section,
        record.period,
        record.totalStudents,
        record.present,
        record.absent,
        record.late,
        `${record.percentage}%`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_records_${dateFilter.startDate}_to_${dateFilter.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate summary statistics
  const summaryStats = {
    totalClasses: filteredRecords.length,
    averageAttendance: Math.round(
      filteredRecords.reduce((sum, record) => sum + record.percentage, 0) / 
      (filteredRecords.length || 1)
    ),
    totalStudentsPresent: filteredRecords.reduce((sum, record) => sum + record.present, 0),
    totalStudentsAbsent: filteredRecords.reduce((sum, record) => sum + record.absent, 0)
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">View Attendance Records</h1>
        <button 
          onClick={exportToCSV}
          className="btn btn-primary mt-4 md:mt-0 flex items-center gap-2"
          disabled={filteredRecords.length === 0}
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="start-date" className="label">Start Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-neutral-400" />
              </div>
              <input
                type="date"
                id="start-date"
                className="input pl-10"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="end-date" className="label">End Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-neutral-400" />
              </div>
              <input
                type="date"
                id="end-date"
                className="input pl-10"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="subject-filter" className="label">Subject</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-neutral-400" />
              </div>
              <select
                id="subject-filter"
                className="input pl-10 appearance-none"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="section-filter" className="label">Section</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-neutral-400" />
              </div>
              <select
                id="section-filter"
                className="input pl-10 appearance-none"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                <option value="all">All Sections</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-neutral-100">
          <p className="text-sm text-neutral-600 mb-1">Total Classes</p>
          <h3 className="text-xl font-bold text-neutral-800">{summaryStats.totalClasses}</h3>
        </div>
        <div className="card bg-primary/10">
          <p className="text-sm text-primary-600 mb-1">Avg. Attendance</p>
          <h3 className="text-xl font-bold text-primary">{summaryStats.averageAttendance}%</h3>
        </div>
        <div className="card bg-success/10">
          <p className="text-sm text-success-600 mb-1">Total Present</p>
          <h3 className="text-xl font-bold text-success">{summaryStats.totalStudentsPresent}</h3>
        </div>
        <div className="card bg-error/10">
          <p className="text-sm text-error-600 mb-1">Total Absent</p>
          <h3 className="text-xl font-bold text-error">{summaryStats.totalStudentsAbsent}</h3>
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">
            Attendance Records ({filteredRecords.length})
          </h3>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-neutral-400 mb-2">
              <Search size={48} className="mx-auto" />
            </div>
            <p className="text-neutral-500">No attendance records found for the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Present
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Absent
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Late
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                      {record.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {record.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {record.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                      {record.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-success font-medium">
                      {record.present}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-error font-medium">
                      {record.absent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-warning font-medium">
                      {record.late}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span 
                        className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
                          record.percentage >= 90 ? 'bg-success' : 
                          record.percentage >= 75 ? 'bg-warning' : 
                          'bg-error'
                        }`}
                      >
                        {record.percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button 
                        className="text-primary hover:text-primary-dark"
                        onClick={() => {
                          // In a real app, this would show detailed view
                          alert(`View details for ${record.subject} on ${record.date}`);
                        }}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;