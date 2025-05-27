import Attendance from '../models/Attendance.js';
import TimeTable from '../models/TimeTable.js';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Take attendance for a period
export const takeAttendance = async (req, res) => {
  try {
    const { date, subject, period, students } = req.body;
    const faculty = req.user.id;

    // Verify if faculty is assigned to this period
    const timeTable = await TimeTable.findOne({
      'periods.faculty': faculty,
      'periods.periodNumber': period,
      'periods.subject': subject
    });

    if (!timeTable) {
      return res.status(403).json({ message: 'Not authorized to take attendance for this period' });
    }

    const attendance = new Attendance({
      date,
      department: timeTable.department,
      programme: timeTable.programme,
      batch: timeTable.batch,
      section: timeTable.section,
      subject,
      faculty,
      period,
      students
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Take attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student's attendance
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type } = req.query; // daily, weekly, monthly
    
    let dateFilter = {};
    const now = new Date();

    switch (type) {
      case 'daily':
        dateFilter = {
          date: {
            $gte: startOfDay(now),
            $lte: endOfDay(now)
          }
        };
        break;
      case 'weekly':
        dateFilter = {
          date: {
            $gte: startOfWeek(now),
            $lte: endOfWeek(now)
          }
        };
        break;
      case 'monthly':
        dateFilter = {
          date: {
            $gte: startOfMonth(now),
            $lte: endOfMonth(now)
          }
        };
        break;
      default:
        dateFilter = {
          date: {
            $gte: startOfDay(now),
            $lte: endOfDay(now)
          }
        };
    }

    const attendance = await Attendance.find({
      'students.student': studentId,
      ...dateFilter
    }).populate('faculty', 'name');

    res.json(attendance);
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get faculty's classes for attendance
export const getFacultyClasses = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

    const timeTable = await TimeTable.find({
      'periods.faculty': facultyId,
      day: dayOfWeek
    });

    res.json(timeTable);
  } catch (error) {
    console.error('Get faculty classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get HOD department attendance report
export const getDepartmentAttendance = async (req, res) => {
  try {
    const { department } = req.user;
    const { programme, batch, section, startDate, endDate } = req.query;

    let query = { department };
    if (programme) query.programme = programme;
    if (batch) query.batch = batch;
    if (section) query.section = section;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('faculty', 'name')
      .populate('students.student', 'name rollNumber');

    res.json(attendance);
  } catch (error) {
    console.error('Get department attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};