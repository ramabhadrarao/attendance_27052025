import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Calendar, Edit3, Save, X, GraduationCap } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock student data - In a real app, this would come from an API
  const [profile, setProfile] = useState({
    id: 's1',
    name: user?.name || 'John Student',
    username: user?.username || 'student',
    rollNumber: 'CS2022001',
    email: 'john.student@university.edu',
    phone: '+91 9876543210',
    department: 'Computer Science',
    programme: 'B.Tech',
    batch: '2022-26',
    section: 'CS-A',
    semester: 4,
    cgpa: 8.5,
    address: '123 Student Hostel, University Campus',
    dateOfBirth: '2003-05-15',
    admissionDate: '2022-08-15',
    guardianName: 'Robert Student',
    guardianPhone: '+91 9876543211',
    bloodGroup: 'O+',
    nationality: 'Indian'
  });

  const [editForm, setEditForm] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Student Profile</h1>
        {!isEditing ? (
          <button onClick={handleEdit} className="btn btn-primary flex items-center gap-2">
            <Edit3 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleSave} 
              disabled={isLoading}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="btn btn-secondary flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <GraduationCap size={48} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input text-center"
                />
              ) : (
                profile.name
              )}
            </h2>
            <p className="text-neutral-500 mb-4">{profile.rollNumber}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 mb-2">
              <BookOpen size={16} />
              <span>{profile.programme} - {profile.department}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 mb-2">
              <User size={16} />
              <span>Section: {profile.section}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
              <Calendar size={16} />
              <span>Batch: {profile.batch}</span>
            </div>
          </div>

          {/* Academic Stats */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Academic Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Semester</span>
                <span className="font-semibold text-neutral-800">{profile.semester}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">CGPA</span>
                <span className="font-semibold text-primary">{profile.cgpa}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Blood Group</span>
                <span className="font-semibold text-error">{profile.bloodGroup}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Roll Number</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.rollNumber}
                </div>
              </div>
              <div>
                <label className="label">Username</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.username}
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-neutral-400" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-neutral-400" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="input bg-neutral-50 cursor-not-allowed">
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Nationality</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="input bg-neutral-50 cursor-not-allowed">
                    {profile.nationality}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="label">Address</label>
                {isEditing ? (
                  <textarea
                    value={editForm.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="input"
                    rows={2}
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-neutral-400 mt-1" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Department</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.department}
                </div>
              </div>
              <div>
                <label className="label">Programme</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.programme}
                </div>
              </div>
              <div>
                <label className="label">Batch</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.batch}
                </div>
              </div>
              <div>
                <label className="label">Section</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.section}
                </div>
              </div>
              <div>
                <label className="label">Admission Date</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {new Date(profile.admissionDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="label">Current CGPA</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.cgpa}
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Guardian Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.guardianName}
                    onChange={(e) => handleInputChange('guardianName', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="input bg-neutral-50 cursor-not-allowed">
                    {profile.guardianName}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Guardian Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.guardianPhone}
                    onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-neutral-400" />
                    <span>{profile.guardianPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;