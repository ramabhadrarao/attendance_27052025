import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import TimeTable from './models/TimeTable.js';
import Attendance from './models/Attendance.js';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-system';

// Sample users data
const users = [
  // Students
  {
    username: 'student1',
    password: 'password123',
    name: 'John Student',
    email: 'john.student@university.edu',
    phone: '+91 9876543210',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS2022001',
    batch: '2022-26',
    programme: 'B.Tech',
    section: 'CS-A',
    semester: 4,
    cgpa: 8.5,
    guardianName: 'Robert Student',
    guardianPhone: '+91 9876543211',
    bloodGroup: 'O+',
    address: '123 Student Hostel, University Campus',
    dateOfBirth: new Date('2003-05-15'),
    nationality: 'Indian'
  },
  {
    username: 'student2',
    password: 'password123',
    name: 'Alice Johnson',
    email: 'alice.johnson@university.edu',
    phone: '+91 9876543212',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS2022002',
    batch: '2022-26',
    programme: 'B.Tech',
    section: 'CS-A',
    semester: 4,
    cgpa: 9.1,
    guardianName: 'Mark Johnson',
    guardianPhone: '+91 9876543213',
    bloodGroup: 'A+',
    address: '124 Student Hostel, University Campus',
    dateOfBirth: new Date('2003-08-22'),
    nationality: 'Indian'
  },
  {
    username: 'student3',
    password: 'password123',
    name: 'Bob Smith',
    email: 'bob.smith@university.edu',
    phone: '+91 9876543214',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS2022003',
    batch: '2022-26',
    programme: 'B.Tech',
    section: 'CS-B',
    semester: 4,
    cgpa: 7.8,
    guardianName: 'David Smith',
    guardianPhone: '+91 9876543215',
    bloodGroup: 'B+',
    address: '125 Student Hostel, University Campus',
    dateOfBirth: new Date('2003-12-10'),
    nationality: 'Indian'
  },
  {
    username: 'student4',
    password: 'password123',
    name: 'Diana Prince',
    email: 'diana.prince@university.edu',
    phone: '+91 9876543216',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS2022004',
    batch: '2022-26',
    programme: 'B.Tech',
    section: 'CS-A',
    semester: 4,
    cgpa: 8.9,
    guardianName: 'Steve Prince',
    guardianPhone: '+91 9876543217',
    bloodGroup: 'AB+',
    address: '126 Student Hostel, University Campus',
    dateOfBirth: new Date('2003-03-18'),
    nationality: 'Indian'
  },
  {
    username: 'student5',
    password: 'password123',
    name: 'Ethan Hunt',
    email: 'ethan.hunt@university.edu',
    phone: '+91 9876543218',
    role: 'student',
    department: 'Computer Science',
    rollNumber: 'CS2022005',
    batch: '2022-26',
    programme: 'B.Tech',
    section: 'CS-B',
    semester: 4,
    cgpa: 8.2,
    guardianName: 'William Hunt',
    guardianPhone: '+91 9876543219',
    bloodGroup: 'O-',
    address: '127 Student Hostel, University Campus',
    dateOfBirth: new Date('2003-07-25'),
    nationality: 'Indian'
  },
  
  // Faculty
  {
    username: 'faculty1',
    password: 'password123',
    name: 'Dr. Smith Johnson',
    email: 'smith.johnson@university.edu',
    phone: '+91 9876543220',
    role: 'faculty',
    department: 'Computer Science',
    employeeId: 'FAC001',
    subjects: ['Data Structures', 'Algorithms'],
    qualification: 'PhD Computer Science',
    experience: '8 Years',
    designation: 'Associate Professor',
    specialization: ['Data Structures', 'Algorithm Design'],
    address: '201 Faculty Quarters, University Campus',
    dateOfBirth: new Date('1985-04-12'),
    nationality: 'Indian'
  },
  {
    username: 'faculty2',
    password: 'password123',
    name: 'Prof. Sarah Williams',
    email: 'sarah.williams@university.edu',
    phone: '+91 9876543221',
    role: 'faculty',
    department: 'Computer Science',
    employeeId: 'FAC002',
    subjects: ['Database Management', 'SQL'],
    qualification: 'M.Tech Computer Science',
    experience: '6 Years',
    designation: 'Assistant Professor',
    specialization: ['Database Systems', 'Data Mining'],
    address: '202 Faculty Quarters, University Campus',
    dateOfBirth: new Date('1988-09-08'),
    nationality: 'Indian'
  },
  {
    username: 'faculty3',
    password: 'password123',
    name: 'Dr. Michael Brown',
    email: 'michael.brown@university.edu',
    phone: '+91 9876543222',
    role: 'faculty',
    department: 'Computer Science',
    employeeId: 'FAC003',
    subjects: ['Computer Networks', 'Network Security'],
    qualification: 'PhD Computer Networks',
    experience: '10 Years',
    designation: 'Professor',
    specialization: ['Network Security', 'Wireless Networks'],
    address: '203 Faculty Quarters, University Campus',
    dateOfBirth: new Date('1982-11-15'),
    nationality: 'Indian'
  },
  
  // HOD
  {
    username: 'hod1',
    password: 'password123',
    name: 'Dr. Alice Wilson',
    email: 'alice.wilson@university.edu',
    phone: '+91 9876543223',
    role: 'hod',
    department: 'Computer Science',
    employeeId: 'HOD001',
    qualification: 'PhD Computer Science',
    experience: '15 Years',
    designation: 'Head of Department & Professor',
    specialization: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
    hodSince: new Date('2020-01-01'),
    previousRoles: ['Associate Professor', 'Assistant Professor'],
    publications: 45,
    researchProjects: 8,
    address: '301 Faculty Quarters, University Campus',
    dateOfBirth: new Date('1978-06-20'),
    nationality: 'Indian'
  }
];

// Sample timetable data
const createTimeTable = async () => {
  const faculty = await User.find({ role: 'faculty' });
  
  const timeTableEntries = [
    // Monday CS-A
    {
      department: 'Computer Science',
      programme: 'B.Tech',
      batch: '2022-26',
      section: 'CS-A',
      semester: 4,
      day: 'Monday',
      periods: [
        {
          periodNumber: 1,
          startTime: '9:00',
          endTime: '9:50',
          subject: 'Data Structures',
          faculty: faculty.find(f => f.name === 'Dr. Smith Johnson')._id,
          isLab: false,
          room: 'CS-101'
        },
        {
          periodNumber: 2,
          startTime: '10:00',
          endTime: '10:50',
          subject: 'Database Management',
          faculty: faculty.find(f => f.name === 'Prof. Sarah Williams')._id,
          isLab: false,
          room: 'CS-102'
        },
        {
          periodNumber: 3,
          startTime: '11:00',
          endTime: '11:50',
          subject: 'Computer Networks',
          faculty: faculty.find(f => f.name === 'Dr. Michael Brown')._id,
          isLab: false,
          room: 'CS-103'
        },
        {
          periodNumber: 5,
          startTime: '2:00',
          endTime: '2:50',
          subject: 'Mathematics',
          faculty: faculty.find(f => f.name === 'Dr. Smith Johnson')._id,
          isLab: false,
          room: 'CS-105'
        },
        {
          periodNumber: 6,
          startTime: '3:00',
          endTime: '4:50',
          subject: 'Programming Lab',
          faculty: faculty.find(f => f.name === 'Prof. Sarah Williams')._id,
          isLab: true,
          room: 'LAB-201'
        }
      ]
    },
    
    // Tuesday CS-A
    {
      department: 'Computer Science',
      programme: 'B.Tech',
      batch: '2022-26',
      section: 'CS-A',
      semester: 4,
      day: 'Tuesday',
      periods: [
        {
          periodNumber: 1,
          startTime: '9:00',
          endTime: '9:50',
          subject: 'Algorithms',
          faculty: faculty.find(f => f.name === 'Dr. Smith Johnson')._id,
          isLab: false,
          room: 'CS-101'
        },
        {
          periodNumber: 2,
          startTime: '10:00',
          endTime: '10:50',
          subject: 'SQL',
          faculty: faculty.find(f => f.name === 'Prof. Sarah Williams')._id,
          isLab: false,
          room: 'CS-102'
        },
        {
          periodNumber: 3,
          startTime: '11:00',
          endTime: '11:50',
          subject: 'Network Security',
          faculty: faculty.find(f => f.name === 'Dr. Michael Brown')._id,
          isLab: false,
          room: 'CS-103'
        }
      ]
    },
    
    // Monday CS-B
    {
      department: 'Computer Science',
      programme: 'B.Tech',
      batch: '2022-26',
      section: 'CS-B',
      semester: 4,
      day: 'Monday',
      periods: [
        {
          periodNumber: 2,
          startTime: '10:00',
          endTime: '10:50',
          subject: 'Data Structures',
          faculty: faculty.find(f => f.name === 'Dr. Smith Johnson')._id,
          isLab: false,
          room: 'CS-105'
        },
        {
          periodNumber: 3,
          startTime: '11:00',
          endTime: '11:50',
          subject: 'Database Management',
          faculty: faculty.find(f => f.name === 'Prof. Sarah Williams')._id,
          isLab: false,
          room: 'CS-106'
        },
        {
          periodNumber: 4,
          startTime: '12:00',
          endTime: '12:50',
          subject: 'Computer Networks',
          faculty: faculty.find(f => f.name === 'Dr. Michael Brown')._id,
          isLab: false,
          room: 'CS-107'
        }
      ]
    },

    // Wednesday CS-A
    {
      department: 'Computer Science',
      programme: 'B.Tech',
      batch: '2022-26',
      section: 'CS-A',
      semester: 4,
      day: 'Wednesday',
      periods: [
        {
          periodNumber: 1,
          startTime: '9:00',
          endTime: '9:50',
          subject: 'Data Structures',
          faculty: faculty.find(f => f.name === 'Dr. Smith Johnson')._id,
          isLab: false,
          room: 'CS-101'
        },
        {
          periodNumber: 2,
          startTime: '10:00',
          endTime: '10:50',
          subject: 'Database Management',
          faculty: faculty.find(f => f.name === 'Prof. Sarah Williams')._id,
          isLab: false,
          room: 'CS-102'
        }
      ]
    }
  ];
  
  return timeTableEntries;
};

// Sample attendance data
const createSampleAttendance = async () => {
  const students = await User.find({ role: 'student' });
  const faculty = await User.find({ role: 'faculty' });
  
  const attendanceRecords = [];
  const dates = [
    new Date('2025-01-20'),
    new Date('2025-01-21'),
    new Date('2025-01-22')
  ];

  for (const date of dates) {
    // CS-A Data Structures attendance
    attendanceRecords.push({
      date,
      department: 'Computer Science',
      programme: 'B.Tech',
      batch: '2022-26',
      section: 'CS-A',
      subject: 'Data Structures',
      faculty: faculty.find(f => f.name === 'Dr. Smith Johnson')._id,
      period: 1,
      students: students.filter(s => s.section === 'CS-A').map(student => ({
        student: student._id,
        status: Math.random() > 0.2 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late')
      }))
    });

    // CS-A Database Management attendance
    attendanceRecords.push({
      date,
      department: 'Computer Science',
      programme: 'B.Tech',
      batch: '2022-26',
      section: 'CS-A',
      subject: 'Database Management',
      faculty: faculty.find(f => f.name === 'Prof. Sarah Williams')._id,
      period: 2,
      students: students.filter(s => s.section === 'CS-A').map(student => ({
        student: student._id,
        status: Math.random() > 0.15 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late')
      }))
    });

    // CS-B Data Structures attendance
    attendanceRecords.push({
      date,
      department: 'Computer Science',
      programme: 'B.Tech',
      batch: '2022-26',
      section: 'CS-B',
      subject: 'Data Structures',
      faculty: faculty.find(f => f.name === 'Dr. Smith Johnson')._id,
      period: 2,
      students: students.filter(s => s.section === 'CS-B').map(student => ({
        student: student._id,
        status: Math.random() > 0.25 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late')
      }))
    });
  }

  return attendanceRecords;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await User.deleteMany({});
    await TimeTable.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);
    
    // Create and insert timetable
    const timeTableData = await createTimeTable();
    const createdTimeTable = await TimeTable.insertMany(timeTableData);
    console.log(`Created ${createdTimeTable.length} timetable entries`);
    
    // Create and insert sample attendance
    const attendanceData = await createSampleAttendance();
    const createdAttendance = await Attendance.insertMany(attendanceData);
    console.log(`Created ${createdAttendance.length} attendance records`);
    
    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log('\nLogin Credentials:');
    console.log('Students:');
    console.log('  Username: student1, Password: password123 (John Student - CS2022001)');
    console.log('  Username: student2, Password: password123 (Alice Johnson - CS2022002)');
    console.log('  Username: student3, Password: password123 (Bob Smith - CS2022003)');
    console.log('  Username: student4, Password: password123 (Diana Prince - CS2022004)');
    console.log('  Username: student5, Password: password123 (Ethan Hunt - CS2022005)');
    console.log('\nFaculty:');
    console.log('  Username: faculty1, Password: password123 (Dr. Smith Johnson)');
    console.log('  Username: faculty2, Password: password123 (Prof. Sarah Williams)');
    console.log('  Username: faculty3, Password: password123 (Dr. Michael Brown)');
    console.log('\nHOD:');
    console.log('  Username: hod1, Password: password123 (Dr. Alice Wilson)');
    console.log('\nDatabase Statistics:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- TimeTable Entries: ${createdTimeTable.length}`);
    console.log(`- Attendance Records: ${createdAttendance.length}`);
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();