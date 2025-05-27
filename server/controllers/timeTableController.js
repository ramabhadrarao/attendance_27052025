import TimeTable from '../models/TimeTable.js';

// Create or update time table
export const updateTimeTable = async (req, res) => {
  try {
    const { department, programme, batch, section, semester, day, periods } = req.body;

    const timeTable = await TimeTable.findOneAndUpdate(
      { department, programme, batch, section, day },
      { department, programme, batch, section, semester, day, periods },
      { new: true, upsert: true }
    );

    res.json(timeTable);
  } catch (error) {
    console.error('Update time table error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get time table
export const getTimeTable = async (req, res) => {
  try {
    const { department, programme, batch, section, day } = req.query;
    
    let query = {};
    if (department) query.department = department;
    if (programme) query.programme = programme;
    if (batch) query.batch = batch;
    if (section) query.section = section;
    if (day) query.day = day;

    const timeTable = await TimeTable.find(query).populate('periods.faculty', 'name');
    res.json(timeTable);
  } catch (error) {
    console.error('Get time table error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};