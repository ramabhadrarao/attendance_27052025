import TimeTable from '../models/TimeTable.js';
import User from '../models/User.js';

// Create or update time table
export const updateTimeTable = async (req, res) => {
  try {
    const { department, programme, batch, section, semester, day, periods } = req.body;

    // Validate required fields
    if (!department || !programme || !batch || !section || !semester || !day || !periods) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate periods structure
    for (const period of periods) {
      if (!period.periodNumber || !period.startTime || !period.endTime || 
          !period.subject || !period.faculty || !period.room) {
        return res.status(400).json({ message: 'Invalid period data' });
      }

      // Verify faculty exists
      const facultyExists = await User.findById(period.faculty);
      if (!facultyExists || facultyExists.role !== 'faculty') {
        return res.status(400).json({ 
          message: `Faculty with ID ${period.faculty} not found` 
        });
      }
    }

    const timeTable = await TimeTable.findOneAndUpdate(
      { department, programme, batch, section, day },
      { department, programme, batch, section, semester, day, periods },
      { new: true, upsert: true }
    ).populate('periods.faculty', 'name');

    res.json(timeTable);
  } catch (error) {
    console.error('Update time table error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get time table
export const getTimeTable = async (req, res) => {
  try {
    const { department, programme, batch, section, day, faculty } = req.query;
    
    let query = {};
    
    if (department && department !== 'all') query.department = department;
    if (programme && programme !== 'all') query.programme = programme;
    if (batch && batch !== 'all') query.batch = batch;
    if (section && section !== 'all') query.section = section;
    if (day && day !== 'all') query.day = day;
    if (faculty && faculty !== 'all') query['periods.faculty'] = faculty;

    const timeTable = await TimeTable.find(query)
      .populate('periods.faculty', 'name')
      .sort({ day: 1, 'periods.periodNumber': 1 });

    res.json(timeTable);
  } catch (error) {
    console.error('Get time table error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student's time table
export const getStudentTimeTable = async (req, res) => {
  try {
    const { department, programme, batch, section } = req.user;
    const { day } = req.query;

    let query = { department, programme, batch, section };
    if (day && day !== 'all') {
      query.day = day;
    }

    const timeTable = await TimeTable.find(query)
      .populate('periods.faculty', 'name')
      .sort({ day: 1, 'periods.periodNumber': 1 });

    // If specific day requested, return flattened schedule
    if (day && day !== 'all') {
      const schedule = [];
      timeTable.forEach(tt => {
        tt.periods.forEach(period => {
          schedule.push({
            period: period.periodNumber,
            time: `${period.startTime} - ${period.endTime}`,
            subject: period.subject,
            faculty: period.faculty.name,
            room: period.room,
            isLab: period.isLab
          });
        });
      });
      
      schedule.sort((a, b) => a.period - b.period);
      return res.json({ schedule, day });
    }

    res.json(timeTable);
  } catch (error) {
    console.error('Get student time table error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get faculty time table
export const getFacultyTimeTable = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { day } = req.query;

    let query = { 'periods.faculty': facultyId };
    if (day && day !== 'all') {
      query.day = day;
    }

    const timeTable = await TimeTable.find(query)
      .populate('periods.faculty', 'name')
      .sort({ day: 1, 'periods.periodNumber': 1 });

    // Filter to only include periods for this faculty
    const facultySchedule = timeTable.map(tt => ({
      ...tt.toObject(),
      periods: tt.periods.filter(period => 
        period.faculty._id.toString() === facultyId
      )
    })).filter(tt => tt.periods.length > 0);

    res.json(facultySchedule);
  } catch (error) {
    console.error('Get faculty time table error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete time table entry
export const deleteTimeTable = async (req, res) => {
  try {
    const { id } = req.params;

    const timeTable = await TimeTable.findByIdAndDelete(id);
    if (!timeTable) {
      return res.status(404).json({ message: 'Time table not found' });
    }

    res.json({ message: 'Time table deleted successfully' });
  } catch (error) {
    console.error('Delete time table error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all departments, programmes, batches, sections for filters
export const getTimeTableFilters = async (req, res) => {
  try {
    const [departments, programmes, batches, sections, faculty] = await Promise.all([
      TimeTable.distinct('department'),
      TimeTable.distinct('programme'),
      TimeTable.distinct('batch'),
      TimeTable.distinct('section'),
      User.find({ role: 'faculty' }, 'name').lean()
    ]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    res.json({
      departments,
      programmes,
      batches,
      sections,
      faculty,
      days
    });
  } catch (error) {
    console.error('Get time table filters error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk import time table
export const bulkImportTimeTable = async (req, res) => {
  try {
    const { timeTableData } = req.body;

    if (!Array.isArray(timeTableData) || timeTableData.length === 0) {
      return res.status(400).json({ message: 'Invalid time table data' });
    }

    // Validate all entries
    for (const entry of timeTableData) {
      const { department, programme, batch, section, semester, day, periods } = entry;
      
      if (!department || !programme || !batch || !section || !semester || !day || !periods) {
        return res.status(400).json({ 
          message: 'Missing required fields in time table entry' 
        });
      }

      // Validate periods
      for (const period of periods) {
        if (!period.periodNumber || !period.startTime || !period.endTime || 
            !period.subject || !period.faculty || !period.room) {
          return res.status(400).json({ message: 'Invalid period data' });
        }
      }
    }

    // Delete existing entries for the same department/programme/batch combinations
    const deletePromises = timeTableData.map(entry => 
      TimeTable.deleteMany({
        department: entry.department,
        programme: entry.programme,
        batch: entry.batch,
        section: entry.section
      })
    );

    await Promise.all(deletePromises);

    // Insert new entries
    const insertedTimeTable = await TimeTable.insertMany(timeTableData);

    res.json({
      message: 'Time table imported successfully',
      count: insertedTimeTable.length
    });
  } catch (error) {
    console.error('Bulk import time table error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};