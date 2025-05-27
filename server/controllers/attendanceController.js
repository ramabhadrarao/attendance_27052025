import Attendance from '../models/Attendance.js';
import TimeTable from '../models/TimeTable.js';
import User from '../models/User.js';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Take attendance for a period
export const takeAttendance = async (req, res) => {
  try {
    const { date, subject, period, students, section, room } = req.body;
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

    // Check if attendance already exists for this date, subject, and period
    const existingAttendance = await Attendance.findOne({
      date: new Date(date),
      subject,
      period,
      faculty
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.students = students;
      await existingAttendance.save();
      
      const populatedAttendance = await Attendance.findById(existingAttendance._id)
        .populate('faculty', 'name')
        .populate('students.student', 'name rollNumber');
      
      return res.json(populatedAttendance);
    }

    // Create new attendance record
    const attendance = new Attendance({
      date: new Date(date),
      department: timeTable.department,
      programme: timeTable.programme,
      batch: timeTable.batch,
      section: section || timeTable.section,
      subject,
      faculty,
      period,
      students,
      room: room || 'Not specified'
    });

    await attendance.save();
    
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('faculty', 'name')
      .populate('students.student', 'name rollNumber');
    
    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error('Take attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student's attendance
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { type = 'daily', subject, startDate, endDate } = req.query;
    
    let dateFilter = {};
    const now = new Date();

    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
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
    }

    let query = {
      'students.student': studentId,
      ...dateFilter
    };

    if (subject && subject !== 'all') {
      query.subject = subject;
    }

    const attendance = await Attendance.find(query)
      .populate('faculty', 'name')
      .populate('students.student', 'name rollNumber')
      .sort({ date: -1, period: 1 });

    // Calculate attendance summary
    const summary = {
      totalClasses: attendance.length,
      present: 0,
      absent: 0,
      late: 0
    };

    attendance.forEach(record => {
      const studentRecord = record.students.find(s => s.student._id.toString() === studentId);
      if (studentRecord) {
        summary[studentRecord.status]++;
      }
    });

    summary.percentage = summary.totalClasses > 0 
      ? Math.round(((summary.present + summary.late) / summary.totalClasses) * 100)
      : 0;

    res.json({
      attendance,
      summary
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get faculty's classes for today
export const getFacultyClasses = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { date } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    const timeTable = await TimeTable.find({
      'periods.faculty': facultyId,
      day: dayOfWeek
    }).populate('periods.faculty', 'name');

    // Flatten the periods and add timetable info
    const classes = [];
    
    for (const tt of timeTable) {
      const facultyPeriods = tt.periods.filter(period => 
        period.faculty._id.toString() === facultyId
      );
      
      for (const period of facultyPeriods) {
        // Check if attendance is already taken
        const attendanceRecord = await Attendance.findOne({
          date: {
            $gte: startOfDay(targetDate),
            $lte: endOfDay(targetDate)
          },
          subject: period.subject,
          period: period.periodNumber,
          faculty: facultyId,
          section: tt.section
        });

        classes.push({
          id: `${tt._id}-${period.periodNumber}`,
          department: tt.department,
          programme: tt.programme,
          batch: tt.batch,
          section: tt.section,
          period: period.periodNumber,
          startTime: period.startTime,
          endTime: period.endTime,
          subject: period.subject,
          room: period.room,
          isLab: period.isLab,
          attendanceStatus: attendanceRecord ? 'Taken' : 'Pending',
          attendanceId: attendanceRecord?._id
        });
      }
    }

    // Sort by period number
    classes.sort((a, b) => a.period - b.period);

    res.json(classes);
  } catch (error) {
    console.error('Get faculty classes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get students for a specific class/section
export const getClassStudents = async (req, res) => {
  try {
    const { department, programme, batch, section } = req.query;

    if (!department || !programme || !batch || !section) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const students = await User.find({
      role: 'student',
      department,
      programme,
      batch,
      section
    }).select('name rollNumber').sort({ rollNumber: 1 });

    res.json(students);
  } catch (error) {
    console.error('Get class students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get faculty's attendance records
export const getFacultyAttendanceRecords = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { 
      startDate, 
      endDate, 
      subject, 
      section, 
      page = 1, 
      limit = 10 
    } = req.query;

    let query = { faculty: facultyId };

    // Date filter
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Subject filter
    if (subject && subject !== 'all') {
      query.subject = subject;
    }

    // Section filter
    if (section && section !== 'all') {
      query.section = section;
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Attendance.find(query)
        .populate('students.student', 'name rollNumber')
        .sort({ date: -1, period: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Attendance.countDocuments(query)
    ]);

    // Calculate statistics for each record
    const recordsWithStats = records.map(record => {
      const stats = {
        totalStudents: record.students.length,
        present: record.students.filter(s => s.status === 'present').length,
        absent: record.students.filter(s => s.status === 'absent').length,
        late: record.students.filter(s => s.status === 'late').length
      };
      
      stats.percentage = stats.totalStudents > 0 
        ? Math.round(((stats.present + stats.late) / stats.totalStudents) * 100)
        : 0;

      return {
        ...record.toObject(),
        stats
      };
    });

    res.json({
      records: recordsWithStats,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: skip + records.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get faculty attendance records error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get HOD department attendance report
export const getDepartmentAttendance = async (req, res) => {
  try {
    const { department } = req.user;
    const { 
      programme, 
      batch, 
      section, 
      startDate, 
      endDate,
      subject,
      faculty 
    } = req.query;

    let query = { department };
    
    if (programme && programme !== 'all') query.programme = programme;
    if (batch && batch !== 'all') query.batch = batch;
    if (section && section !== 'all') query.section = section;
    if (subject && subject !== 'all') query.subject = subject;
    if (faculty && faculty !== 'all') query.faculty = faculty;
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('faculty', 'name')
      .populate('students.student', 'name rollNumber')
      .sort({ date: -1 });

    // Calculate overall statistics
    const stats = {
      totalClasses: attendance.length,
      totalStudentRecords: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0
    };

    const subjectWiseStats = {};
    const facultyWiseStats = {};
    const sectionWiseStats = {};

    attendance.forEach(record => {
      const present = record.students.filter(s => s.status === 'present').length;
      const absent = record.students.filter(s => s.status === 'absent').length;
      const late = record.students.filter(s => s.status === 'late').length;
      const total = record.students.length;

      stats.totalStudentRecords += total;
      stats.totalPresent += present;
      stats.totalAbsent += absent;
      stats.totalLate += late;

      // Subject-wise stats
      if (!subjectWiseStats[record.subject]) {
        subjectWiseStats[record.subject] = {
          totalClasses: 0,
          totalStudents: 0,
          present: 0,
          absent: 0,
          late: 0
        };
      }
      subjectWiseStats[record.subject].totalClasses++;
      subjectWiseStats[record.subject].totalStudents += total;
      subjectWiseStats[record.subject].present += present;
      subjectWiseStats[record.subject].absent += absent;
      subjectWiseStats[record.subject].late += late;

      // Faculty-wise stats
      const facultyName = record.faculty.name;
      if (!facultyWiseStats[facultyName]) {
        facultyWiseStats[facultyName] = {
          totalClasses: 0,
          totalStudents: 0,
          present: 0,
          absent: 0,
          late: 0
        };
      }
      facultyWiseStats[facultyName].totalClasses++;
      facultyWiseStats[facultyName].totalStudents += total;
      facultyWiseStats[facultyName].present += present;
      facultyWiseStats[facultyName].absent += absent;
      facultyWiseStats[facultyName].late += late;

      // Section-wise stats
      if (!sectionWiseStats[record.section]) {
        sectionWiseStats[record.section] = {
          totalClasses: 0,
          totalStudents: 0,
          present: 0,
          absent: 0,
          late: 0
        };
      }
      sectionWiseStats[record.section].totalClasses++;
      sectionWiseStats[record.section].totalStudents += total;
      sectionWiseStats[record.section].present += present;
      sectionWiseStats[record.section].absent += absent;
      sectionWiseStats[record.section].late += late;
    });

    // Calculate percentages
    stats.overallPercentage = stats.totalStudentRecords > 0 
      ? Math.round(((stats.totalPresent + stats.totalLate) / stats.totalStudentRecords) * 100)
      : 0;

    // Add percentages to category stats
    Object.keys(subjectWiseStats).forEach(subject => {
      const stat = subjectWiseStats[subject];
      stat.percentage = stat.totalStudents > 0 
        ? Math.round(((stat.present + stat.late) / stat.totalStudents) * 100)
        : 0;
    });

    Object.keys(facultyWiseStats).forEach(faculty => {
      const stat = facultyWiseStats[faculty];
      stat.percentage = stat.totalStudents > 0 
        ? Math.round(((stat.present + stat.late) / stat.totalStudents) * 100)
        : 0;
    });

    Object.keys(sectionWiseStats).forEach(section => {
      const stat = sectionWiseStats[section];
      stat.percentage = stat.totalStudents > 0 
        ? Math.round(((stat.present + stat.late) / stat.totalStudents) * 100)
        : 0;
    });

    res.json({
      attendance,
      stats,
      breakdown: {
        bySubject: subjectWiseStats,
        byFaculty: facultyWiseStats,
        bySection: sectionWiseStats
      }
    });
  } catch (error) {
    console.error('Get department attendance error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get attendance summary for dashboard
export const getAttendanceSummary = async (req, res) => {
  try {
    const { role, id: userId, department } = req.user;
    const now = new Date();
    
    let query = {};
    
    if (role === 'student') {
      query = { 'students.student': userId };
    } else if (role === 'faculty') {
      query = { faculty: userId };
    } else if (role === 'hod') {
      query = { department };
    }

    // Today's attendance
    const todayQuery = {
      ...query,
      date: {
        $gte: startOfDay(now),
        $lte: endOfDay(now)
      }
    };

    // This week's attendance
    const weekQuery = {
      ...query,
      date: {
        $gte: startOfWeek(now),
        $lte: endOfWeek(now)
      }
    };

    // This month's attendance
    const monthQuery = {
      ...query,
      date: {
        $gte: startOfMonth(now),
        $lte: endOfMonth(now)
      }
    };

    const [todayRecords, weekRecords, monthRecords] = await Promise.all([
      Attendance.find(todayQuery),
      Attendance.find(weekQuery),
      Attendance.find(monthQuery)
    ]);

    const calculateStats = (records) => {
      if (role === 'student') {
        let present = 0, absent = 0, late = 0;
        
        records.forEach(record => {
          const studentRecord = record.students.find(s => s.student.toString() === userId);
          if (studentRecord) {
            if (studentRecord.status === 'present') present++;
            else if (studentRecord.status === 'absent') absent++;
            else if (studentRecord.status === 'late') late++;
          }
        });

        return {
          totalClasses: records.length,
          present,
          absent,
          late,
          percentage: records.length > 0 ? Math.round(((present + late) / records.length) * 100) : 0
        };
      } else {
        // For faculty and HOD
        let totalStudents = 0, totalPresent = 0, totalAbsent = 0, totalLate = 0;
        
        records.forEach(record => {
          record.students.forEach(student => {
            totalStudents++;
            if (student.status === 'present') totalPresent++;
            else if (student.status === 'absent') totalAbsent++;
            else if (student.status === 'late') totalLate++;
          });
        });

        return {
          totalClasses: records.length,
          totalStudents,
          present: totalPresent,
          absent: totalAbsent,
          late: totalLate,
          percentage: totalStudents > 0 ? Math.round(((totalPresent + totalLate) / totalStudents) * 100) : 0
        };
      }
    };

    res.json({
      today: calculateStats(todayRecords),
      week: calculateStats(weekRecords),
      month: calculateStats(monthRecords)
    });
  } catch (error) {
    console.error('Get attendance summary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};