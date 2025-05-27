import mongoose from 'mongoose';

const timeTableSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true
  },
  programme: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  periods: [{
    periodNumber: {
      type: Number,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isLab: {
      type: Boolean,
      default: false
    },
    room: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

export default TimeTable;