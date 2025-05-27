import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\+?[\d\s-()]+$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'hod'],
    required: true
  },
  department: {
    type: String,
    required: true
  },
  address: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  nationality: {
    type: String,
    default: 'Indian'
  },
  
  // Student specific fields
  rollNumber: {
    type: String,
    sparse: true, // Allows null/undefined but ensures uniqueness when present
    trim: true,
    uppercase: true
  },
  batch: {
    type: String,
    trim: true
  },
  programme: {
    type: String,
    trim: true
  },
  section: {
    type: String,
    trim: true,
    uppercase: true
  },
  semester: {
    type: Number,
    min: 1,
    max: 12
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  guardianName: {
    type: String,
    trim: true
  },
  guardianPhone: {
    type: String,
    trim: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    trim: true
  },
  
  // Faculty specific fields
  employeeId: {
    type: String,
    sparse: true,
    trim: true,
    uppercase: true
  },
  subjects: [{
    type: String,
    trim: true
  }],
  qualification: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  specialization: [{
    type: String,
    trim: true
  }],
  
  // HOD specific fields
  hodSince: {
    type: Date
  },
  previousRoles: [{
    type: String,
    trim: true
  }],
  publications: {
    type: Number,
    default: 0
  },
  researchProjects: {
    type: Number,
    default: 0
  },
  
  // Common fields
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ role: 1, department: 1 });
userSchema.index({ rollNumber: 1 }, { sparse: true });
userSchema.index({ employeeId: 1 }, { sparse: true });
userSchema.index({ department: 1, programme: 1, batch: 1, section: 1 });

// Validation for role-specific required fields
userSchema.pre('validate', function(next) {
  if (this.role === 'student') {
    if (!this.rollNumber || !this.batch || !this.programme || !this.section) {
      return next(new Error('Student must have rollNumber, batch, programme, and section'));
    }
  }
  
  if (this.role === 'faculty' && !this.employeeId) {
    // Auto-generate employee ID if not provided
    this.employeeId = `FAC${Date.now().toString().slice(-6)}`;
  }
  
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find students by class
userSchema.statics.findStudentsByClass = function(department, programme, batch, section) {
  return this.find({
    role: 'student',
    department,
    programme,
    batch,
    section,
    isActive: true
  }).select('-password').sort({ rollNumber: 1 });
};

// Static method to find faculty by department
userSchema.statics.findFacultyByDepartment = function(department) {
  return this.find({
    role: 'faculty',
    department,
    isActive: true
  }).select('-password').sort({ name: 1 });
};

// Virtual for full name display
userSchema.virtual('displayName').get(function() {
  if (this.role === 'student' && this.rollNumber) {
    return `${this.name} (${this.rollNumber})`;
  }
  return this.name;
});

// Virtual for student class info
userSchema.virtual('classInfo').get(function() {
  if (this.role === 'student') {
    return `${this.programme} ${this.section} - ${this.batch}`;
  }
  return null;
});

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;