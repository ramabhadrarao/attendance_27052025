import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, Search, Save } from 'lucide-react';
import { toast } from 'react-toastify';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | '';
}

const TakeAttendance: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { period } = location.state || { period: 1 };
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock class details - In a real app, this would come from an API
  const classDetails = {
    subject: 'Data Structures',
    section: 'CS-A',
    room: 'CS-101',
    time: '9:00 - 9:50',
    period: period,
    date: new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
  
  // Mock student data - In a real app, this would come from an API
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', rollNumber: 'CS2022001', status: '' },
    { id: '2', name: 'Bob Smith', rollNumber: 'CS2022002', status: '' },
    { id: '3', name: 'Charlie Brown', rollNumber: 'CS2022003', status: '' },
    { id: '4', name: 'Diana Prince', rollNumber: 'CS2022004', status: '' },
    { id: '5', name: 'Ethan Hunt', rollNumber: 'CS2022005', status: '' },
    { id: '6', name: 'Fiona Gallagher', rollNumber: 'CS2022006', status: '' },
    { id: '7', name: 'George Miller', rollNumber: 'CS2022007', status: '' },
    { id: '8', name: 'Hannah Baker', rollNumber: 'CS2022008', status: '' },
    { id: '9', name: 'Ian Malcolm', rollNumber: 'CS2022009', status: '' },
    { id: '10', name: 'Julia Roberts', rollNumber: 'CS2022010', status: '' },
    { id: '11', name: 'Kevin Hart', rollNumber: 'CS2022011', status: '' },
    { id: '12', name: 'Lisa Simpson', rollNumber: 'CS2022012', status: '' },
    { id: '13', name: 'Michael Scott', rollNumber: 'CS2022013', status: '' },
    { id: '14', name: 'Nancy Wheeler', rollNumber: 'CS2022014', status: '' },
    { id: '15', name: 'Oliver Queen', rollNumber: 'CS2022015', status: '' },
    { id: '16', name: 'Peter Parker', rollNumber: 'CS2022016', status: '' },
    { id: '17', name: 'Quinn Fabray', rollNumber: 'CS2022017', status: '' },
    { id: '18', name: 'Richard Hendricks', rollNumber: 'CS2022018', status: '' },
    { id: '19', name: 'Sansa Stark', rollNumber: 'CS2022019', status: '' },
    { id: '20', name: 'Tony Stark', rollNumber: 'CS2022020', status: '' }
  ]);

  // Filter students based on search term
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle attendance status change
  const handleStatusChange = (id: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, status } : student
    ));
  };

  // Mark all students as present
  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'present' })));
  };

  // Submit attendance
  const submitAttendance = () => {
    // Check if all students have a status
    const allMarked = students.every(student => student.status !== '');
    if (!allMarked) {
      toast.warning('Please mark attendance for all students');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Attendance submitted successfully');
      setIsSubmitting(false);
      navigate('/faculty');
    }, 1500);
  };

  // Stats
  const stats = {
    total: students.length,
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    unmarked: students.filter(s => s.status === '').length
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Take Attendance</h1>
      
      {/* Class Details Card */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-neutral-500">Subject</p>
            <h3 className="font-semibold text-neutral-800">{classDetails.subject}</h3>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Section</p>
            <h3 className="font-semibold text-neutral-800">{classDetails.section}</h3>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Room</p>
            <h3 className="font-semibold text-neutral-800">{classDetails.room}</h3>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Time (Period {classDetails.period})</p>
            <h3 className="font-semibold text-neutral-800">{classDetails.time}</h3>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">Date</p>
          <h3 className="font-semibold text-neutral-800">{classDetails.date}</h3>
        </div>
      </div>
      
      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card bg-neutral-100">
          <p className="text-sm text-neutral-600 mb-1">Total</p>
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
        <div className="card bg-neutral-200">
          <p className="text-sm text-neutral-600 mb-1">Unmarked</p>
          <h3 className="text-xl font-bold text-neutral-800">{stats.unmarked}</h3>
        </div>
      </div>
      
      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or roll number"
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            className="btn btn-secondary"
            onClick={markAllPresent}
          >
            Mark All Present
          </button>
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={submitAttendance}
            disabled={isSubmitting || stats.unmarked > 0}
          >
            {isSubmitting ? 'Submitting...' : (
              <>
                <Save size={18} />
                Save Attendance
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Student List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800">
                    {student.rollNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        className={`p-2 rounded-full transition-all ${
                          student.status === 'present'
                            ? 'bg-success text-white'
                            : 'bg-neutral-100 text-neutral-400 hover:bg-success/20 hover:text-success'
                        }`}
                        onClick={() => handleStatusChange(student.id, 'present')}
                        title="Present"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        className={`p-2 rounded-full transition-all ${
                          student.status === 'absent'
                            ? 'bg-error text-white'
                            : 'bg-neutral-100 text-neutral-400 hover:bg-error/20 hover:text-error'
                        }`}
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        title="Absent"
                      >
                        <XCircle size={20} />
                      </button>
                      <button
                        className={`p-2 rounded-full transition-all ${
                          student.status === 'late'
                            ? 'bg-warning text-white'
                            : 'bg-neutral-100 text-neutral-400 hover:bg-warning/20 hover:text-warning'
                        }`}
                        onClick={() => handleStatusChange(student.id, 'late')}
                        title="Late"
                      >
                        <AlertCircle size={20} />
                      </button>
                    </div>
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

export default TakeAttendance;