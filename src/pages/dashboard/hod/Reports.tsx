import React, { useState } from 'react';
import { Calendar, Filter, Download } from 'lucide-react';
import ReportTable from '../../../components/hod/ReportTable';

type ReportType = 'daily' | 'weekly' | 'monthly';
type FilterOption = 'all' | 'program' | 'batch' | 'section';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  
  // Mock data for filters
  const programs = ['B.Tech Computer Science', 'M.Tech Computer Science', 'B.Tech Information Technology'];
  const batches = ['2022-26', '2023-27', '2024-28'];
  const sections = ['CS-A', 'CS-B', 'CS-C', 'IT-A', 'IT-B'];
  
  // Mock data for daily report
  const dailyAttendanceData = {
    date: '2025-06-10',
    subjects: [
      { 
        name: 'Data Structures', 
        faculty: 'Dr. Smith',
        time: '9:00 - 9:50',
        section: 'CS-A',
        present: 42,
        absent: 3,
        total: 45,
        percentage: 93.3
      },
      { 
        name: 'Database Management', 
        faculty: 'Prof. Johnson',
        time: '10:00 - 10:50',
        section: 'CS-A',
        present: 40,
        absent: 5,
        total: 45,
        percentage: 88.9
      },
      { 
        name: 'Computer Networks', 
        faculty: 'Dr. Williams',
        time: '11:00 - 11:50',
        section: 'CS-B',
        present: 41,
        absent: 4,
        total: 45,
        percentage: 91.1
      },
      { 
        name: 'Software Engineering', 
        faculty: 'Prof. Davis',
        time: '12:00 - 12:50',
        section: 'CS-B',
        present: 43,
        absent: 2,
        total: 45,
        percentage: 95.6
      },
      { 
        name: 'Mathematics', 
        faculty: 'Dr. Miller',
        time: '2:00 - 2:50',
        section: 'IT-A',
        present: 38,
        absent: 4,
        total: 42,
        percentage: 90.5
      },
      { 
        name: 'Programming Lab', 
        faculty: 'Prof. Wilson',
        time: '3:00 - 4:50',
        section: 'IT-A',
        present: 40,
        absent: 2,
        total: 42,
        percentage: 95.2
      }
    ]
  };
  
  // Generate exportable data (CSV format for example)
  const exportReport = () => {
    const headers = ['Subject', 'Faculty', 'Time', 'Section', 'Present', 'Absent', 'Total', 'Percentage'];
    const csvContent = [
      headers.join(','),
      ...dailyAttendanceData.subjects.map(subject => 
        [
          subject.name,
          subject.faculty,
          subject.time,
          subject.section,
          subject.present,
          subject.absent,
          subject.total,
          `${subject.percentage}%`
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${reportType}_${dailyAttendanceData.date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Attendance Reports</h1>
        <button 
          onClick={exportReport}
          className="btn btn-primary mt-4 md:mt-0 flex items-center gap-2"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>
      
      {/* Report Options */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Report Type */}
          <div>
            <label className="label">Report Type</label>
            <div className="flex border border-neutral-300 rounded-md overflow-hidden">
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  reportType === 'daily' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setReportType('daily')}
              >
                Daily
              </button>
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  reportType === 'weekly' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setReportType('weekly')}
              >
                Weekly
              </button>
              <button
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  reportType === 'monthly' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
                onClick={() => setReportType('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>
          
          {/* Date Selection */}
          <div>
            <label htmlFor="report-date" className="label">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-neutral-400" />
              </div>
              <input
                type="date"
                id="report-date"
                className="input pl-10"
                defaultValue="2025-06-10"
              />
            </div>
          </div>
          
          {/* Filter By */}
          <div>
            <label htmlFor="filter-by" className="label">Filter By</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-neutral-400" />
              </div>
              <select
                id="filter-by"
                className="input pl-10 appearance-none"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              >
                <option value="all">All</option>
                <option value="program">Program</option>
                <option value="batch">Batch</option>
                <option value="section">Section</option>
              </select>
            </div>
          </div>
          
          {/* Dynamic Filter Selection */}
          <div>
            <label htmlFor="filter-value" className="label">
              {filterBy === 'program' ? 'Program' : 
               filterBy === 'batch' ? 'Batch' : 
               filterBy === 'section' ? 'Section' : 'Select Filter First'}
            </label>
            {filterBy === 'program' && (
              <select
                id="filter-value"
                className="input"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
              >
                <option value="all">All Programs</option>
                {programs.map((program, index) => (
                  <option key={index} value={program}>{program}</option>
                ))}
              </select>
            )}
            {filterBy === 'batch' && (
              <select
                id="filter-value"
                className="input"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="all">All Batches</option>
                {batches.map((batch, index) => (
                  <option key={index} value={batch}>{batch}</option>
                ))}
              </select>
            )}
            {filterBy === 'section' && (
              <select
                id="filter-value"
                className="input"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="all">All Sections</option>
                {sections.map((section, index) => (
                  <option key={index} value={section}>{section}</option>
                ))}
              </select>
            )}
            {filterBy === 'all' && (
              <select id="filter-value" className="input" disabled>
                <option>No Filter Selected</option>
              </select>
            )}
          </div>
        </div>
      </div>
      
      {/* Report Content */}
      <div className="card">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">
          {reportType === 'daily' && 'Daily Attendance Report'}
          {reportType === 'weekly' && 'Weekly Attendance Report'}
          {reportType === 'monthly' && 'Monthly Attendance Report'}
          <span className="ml-2 text-neutral-500 font-normal">
            {new Date(dailyAttendanceData.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </h2>
        
        <ReportTable data={dailyAttendanceData.subjects} />
        
        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-800">Summary</h3>
              <p className="text-neutral-600 mt-1">
                Total Classes: {dailyAttendanceData.subjects.length} | 
                Average Attendance: {
                  (dailyAttendanceData.subjects.reduce((acc, subj) => acc + subj.percentage, 0) / 
                  dailyAttendanceData.subjects.length).toFixed(1)
                }%
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                className="text-primary hover:text-primary-dark font-medium flex items-center gap-2"
                onClick={() => {
                  // In a real app, this would show more detailed statistics
                  alert('Detailed statistics would be shown here');
                }}
              >
                View Detailed Statistics
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default Reports;