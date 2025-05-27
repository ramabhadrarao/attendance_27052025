import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      qualification,
      experience,
      subjects,
      specialization,
      guardianName,
      guardianPhone,
      nationality,
      dateOfBirth
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update common fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (nationality) user.nationality = nationality;

    // Update role-specific fields
    if (user.role === 'faculty' || user.role === 'hod') {
      if (qualification) user.qualification = qualification;
      if (experience) user.experience = experience;
      if (subjects) user.subjects = subjects;
      if (specialization) user.specialization = specialization;
    }

    if (user.role === 'student') {
      if (guardianName) user.guardianName = guardianName;
      if (guardianPhone) user.guardianPhone = guardianPhone;
    }

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all faculty (for HOD)
export const getAllFaculty = async (req, res) => {
  try {
    const { department } = req.user;
    
    const faculty = await User.find({ 
      role: 'faculty', 
      department 
    }).select('-password');

    res.json(faculty);
  } catch (error) {
    console.error('Get all faculty error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students (for Faculty and HOD)
export const getAllStudents = async (req, res) => {
  try {
    const { role, department } = req.user;
    const { programme, batch, section } = req.query;

    let query = { role: 'student', department };
    
    if (programme && programme !== 'all') query.programme = programme;
    if (batch && batch !== 'all') query.batch = batch;
    if (section && section !== 'all') query.section = section;

    const students = await User.find(query).select('-password').sort({ rollNumber: 1 });

    res.json(students);
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new user (HOD only)
export const createUser = async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      role,
      department,
      email,
      phone,
      // Student specific
      rollNumber,
      batch,
      programme,
      section,
      semester,
      // Faculty specific
      subjects,
      qualification,
      experience
    } = req.body;

    // Validate required fields
    if (!username || !password || !name || !role || !department) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create user object
    const userData = {
      username,
      password,
      name,
      role,
      department,
      email,
      phone
    };

    // Add role-specific fields
    if (role === 'student') {
      if (!rollNumber || !batch || !programme || !section) {
        return res.status(400).json({ message: 'Missing required student fields' });
      }
      userData.rollNumber = rollNumber;
      userData.batch = batch;
      userData.programme = programme;
      userData.section = section;
      userData.semester = semester;
    } else if (role === 'faculty') {
      userData.subjects = subjects || [];
      userData.qualification = qualification;
      userData.experience = experience;
    }

    const user = new User(userData);
    await user.save();

    // Return user without password
    const newUser = await User.findById(user._id).select('-password');
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user (HOD only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.username;
    delete updateData._id;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (HOD only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get department statistics
export const getDepartmentStats = async (req, res) => {
  try {
    const { department } = req.user;

    const [students, faculty, programs, sections] = await Promise.all([
      User.countDocuments({ role: 'student', department }),
      User.countDocuments({ role: 'faculty', department }),
      User.distinct('programme', { role: 'student', department }),
      User.distinct('section', { role: 'student', department })
    ]);

    const programStats = await User.aggregate([
      { $match: { role: 'student', department } },
      { $group: {
        _id: '$programme',
        count: { $sum: 1 },
        sections: { $addToSet: '$section' }
      }}
    ]);

    res.json({
      totalStudents: students,
      totalFaculty: faculty,
      totalPrograms: programs.length,
      totalSections: sections.length,
      programBreakdown: programStats
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};