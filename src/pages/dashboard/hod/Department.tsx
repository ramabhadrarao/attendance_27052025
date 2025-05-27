import React, { useState } from 'react';
import { Users, BookOpen, Calendar, Clock, Plus, Edit3, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface TimeTableEntry {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: string;
  faculty: string;
  section: string;
  room: string;
  isLab: boolean;
}

interface Faculty {
  id: string;
  name: string;
  subjects: string[];
  email: string;
}

interface Program {
  id: string;
  name: string;
  duration: string;
  totalSemesters: number;
  sections: string[];
}

const Department: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'faculty' | 'programs'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - In a real app, this would come from APIs
  const departmentStats = {
    totalStudents: 354,
    totalFaculty: 24,
    totalPrograms: 4,
    totalSections: 12
  };

  const [programs] = useState<Program[]>([
    {
      id: '1',
      name: 'B.Tech Computer Science',
      duration: '4 Years',
      totalSemesters: 8,
      sections: ['CS-A', 'CS-B', 'CS-C']
    },
    {
      id: '2',
      name: 'M.Tech Computer Science',
      duration: '2 Years',
      totalSemesters: 4,
      sections: ['MCS-A']
    },
    {
      id: '3',
      name: 'B.Tech Information Technology',
      duration: '4 Years',
      totalSemesters: 8,
      sections: ['IT-A', 'IT-B']
    },
    {
      id: '4',
      name: 'PhD Computer Science',
      duration: '3-5 Years',
      totalSemesters: 6,
      sections: ['PhD-CS']
    }
  ]);

  const [faculty] = useState<Faculty[]>([
    {
      id: '1',
      name: 'Dr. Smith Johnson',
      subjects: ['Data Structures', 'Algorithms'],
      email: 'smith@university.edu'
    },
    {
      id: '2',
      name: 'Prof. Sarah Williams',
      subjects: ['Database Management', 'SQL'],
      email: 'sarah@university.edu'
    },
    {
      id: '3',
      name: 'Dr. Michael Brown',
      subjects: ['Computer Networks', 'Network Security'],
      email: 'michael@university.edu'
    },
    {
      id: '4',
      name: 'Prof. Emily Davis',
      subjects: ['Software Engineering', 'Project Management'],
      email: 'emily@university.edu'
    }
  ]);

  const [timeTable, setTimeTable] = useState<TimeTableEntry[]>([
    {
      id: '1',
      day: 'Monday',
      period: 1,
      startTime: '9:00',
      endTime: '9:50',
      subject: 'Data Structures',
      faculty: 'Dr. Smith Johnson',
      section: 'CS-A',
      room: 'CS-101',
      isLab: false
    },
    {
      id: '2',
      day: 'Monday',
      period: 2,
      startTime: '10:00',
      endTime: '10:50',
      subject: 'Database Management',
      faculty: 'Prof. Sarah Williams',
      section: 'CS-A',
      room: 'CS-102',
      isLab: false
    },
    {
      id: '3',
      day: 'Monday',
      period: 3,
      startTime: '11:00',
      endTime: '11:50',
      subject: 'Computer Networks',
      faculty: 'Dr. Michael Brown',
      section: 'CS-A',
      room: 'CS-103',
      isLab: false
    }
  ]);

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedSection, setSelectedSection] = useState('CS-A');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const sections = ['CS-A', 'CS-B', 'CS-C', 'IT-A', 'IT-B', 'MCS-A'];

  // Filter timetable by selected day and section
  const filteredTimeTable = timeTable.filter(
    entry => entry.day === selectedDay && entry.section === selectedSection
  );

  const handleAddTimeSlot = () => {
    toast.info('Add time slot functionality would be implemented here');
  };

  const handleEditTimeSlot = (id: string) => {
    toast.info(`Edit time slot ${id} functionality would be implemented here`);
  };

  const handleDeleteTimeSlot = (id: string) => {
    setTimeTable(prev => prev.filter(entry => entry.id !== id));
    toast.success('Time slot deleted successfully');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Department Management</h1>

      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BookOpen size={18} /> },
            { id: 'timetable', label: 'Time Table', icon: <Calendar size={18} /> },
            { id: 'faculty', label: 'Faculty', icon: <Users size={18} /> },
            { id: 'programs', label: 'Programs', icon: <BookOpen size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 font-medium">Total Students</p>
                  <h3 className="text-2xl font-bold text-primary mt-1">{departmentStats.totalStudents}</h3>
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
                  <h3 className="text-2xl font-bold text-secondary mt-1">{departmentStats.totalFaculty}</h3>
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
                  <h3 className="text-2xl font-bold text-accent mt-1">{departmentStats.totalPrograms}</h3>
                </div>
                <div className="bg-accent/10 p-3 rounded-full">
                  <BookOpen size={24} className="text-accent" />
                </div>
              </div>
            </div>
            
            <div className="card bg-success/5 border border-success/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-600 font-medium">Total Sections</p>
                  <h3 className="text-2xl font-bold text-success mt-1">{departmentStats.totalSections}</h3>
                </div>
                <div className="bg-success/10 p-3 rounded-full">
                  <BookOpen size={24} className="text-success" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left">
                <Calendar size={24} className="text-primary mb-2" />
                <h4 className="font-medium text-neutral-800">Manage Time Table</h4>
                <p className="text-sm text-neutral-500">Update class schedules and periods</p>
              </button>
              <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left">
                <Users size={24} className="text-secondary mb-2" />
                <h4 className="font-medium text-neutral-800">Faculty Management</h4>
                <p className="text-sm text-neutral-500">Add or update faculty information</p>
              </button>
              <button className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-left">
                <BookOpen size={24} className="text-accent mb-2" />
                <h4 className="font-medium text-neutral-800">Program Management</h4>
                <p className="text-sm text-neutral-500">Manage academic programs</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Table Tab */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          {/* Filters and Controls */}
          <div className="card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4">
                <div>
                  <label className="label">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="input"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="input"
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
                onClick={handleAddTimeSlot}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Add Time Slot
              </button>
            </div>
          </div>

          {/* Time Table */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              {selectedDay} - {selectedSection}
            </h3>
            
            {filteredTimeTable.length === 0 ? (
              <div className="text-center py-8">
                <Clock size={48} className="mx-auto text-neutral-400 mb-4" />
                <p className="text-neutral-500">No classes scheduled for this day and section.</p>
                <button 
                  onClick={handleAddTimeSlot}
                  className="btn btn-primary mt-4"
                >
                  Add First Time Slot
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Faculty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {filteredTimeTable.map((entry) => (
                      <tr key={entry.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                          {entry.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {entry.startTime} - {entry.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                          {entry.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {entry.faculty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                          {entry.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.isLab 
                              ? 'bg-warning/20 text-warning' 
                              : 'bg-primary/20 text-primary'
                          }`}>
                            {entry.isLab ? 'Lab' : 'Theory'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditTimeSlot(entry.id)}
                              className="text-primary hover:text-primary-dark"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTimeSlot(entry.id)}
                              className="text-error hover:text-error-dark"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Faculty Tab */}
      {activeTab === 'faculty' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-800">Faculty Members</h3>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus size={18} />
              Add Faculty
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((member) => (
              <div key={member.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users size={24} className="text-primary" />
                  </div>
                  <button
                    onClick={() => toast.info(`Edit ${member.name}`)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
                
                <h4 className="font-semibold text-neutral-800 mb-2">{member.name}</h4>
                <p className="text-sm text-neutral-600 mb-3">{member.email}</p>
                
                <div>
                  <p className="text-xs text-neutral-500 mb-2">Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {member.subjects.map((subject, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-800">Academic Programs</h3>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus size={18} />
              Add Program
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-2">{program.name}</h4>
                    <p className="text-sm text-neutral-600">Duration: {program.duration}</p>
                  </div>
                  <button
                    onClick={() => toast.info(`Edit ${program.name}`)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-neutral-500">Total Semesters</p>
                    <p className="font-medium text-neutral-800">{program.totalSemesters}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500">Sections</p>
                    <p className="font-medium text-neutral-800">{program.sections.length}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-neutral-500 mb-2">Sections:</p>
                  <div className="flex flex-wrap gap-1">
                    {program.sections.map((section, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;