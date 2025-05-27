import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Calendar, Edit3, Save, X, Crown } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';

const HodProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock HOD data - In a real app, this would come from an API
  const [profile, setProfile] = useState({
    id: 'h1',
    name: user?.name || 'Alice HOD',
    username: user?.username || 'hod',
    email: 'alice.hod@university.edu',
    phone: '+91 9876543210',
    department: 'Computer Science',
    designation: 'Head of Department & Professor',
    qualification: 'PhD Computer Science, M.Tech CSE',
    experience: '15 Years',
    specialization: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
    address: '456 Faculty Quarters, University Campus',
    joinDate: '2010-07-01',
    hodSince: '2018-01-01',
    employeeId: 'HOD001',
    previousRoles: ['Associate Professor', 'Assistant Professor'],
    publications: 45,
    researchProjects: 8
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
        <h1 className="text-2xl font-bold text-neutral-800">HOD Profile</h1>
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
        <div className="lg:col-span-1 space-y-6">
          <div className="card text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Crown size={48} className="text-primary" />
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
            <p className="text-neutral-500 mb-4">{profile.designation}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 mb-2">
              <MapPin size={16} />
              <span>Department of {profile.department}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 mb-2">
              <Calendar size={16} />
              <span>HOD since {new Date(profile.hodSince).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
              <Calendar size={16} />
              <span>Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}</span>
            </div>
          </div>

          {/* Academic Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Academic Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Experience</span>
                <span className="font-semibold text-neutral-800">{profile.experience}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Publications</span>
                <span className="font-semibold text-primary">{profile.publications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Research Projects</span>
                <span className="font-semibold text-secondary">{profile.researchProjects}</span>
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
                <label className="label">Employee ID</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.employeeId}
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

          {/* Professional Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Professional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Department</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {profile.department}
                </div>
              </div>
              <div>
                <label className="label">Current Designation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="input bg-neutral-50 cursor-not-allowed">
                    {profile.designation}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Experience</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="input bg-neutral-50 cursor-not-allowed">
                    {profile.experience}
                  </div>
                )}
              </div>
              <div>
                <label className="label">Qualification</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.qualification}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    className="input"
                  />
                ) : (
                  <div className="input bg-neutral-50 cursor-not-allowed">
                    {profile.qualification}
                  </div>
                )}
              </div>
              <div>
                <label className="label">HOD Since</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {new Date(profile.hodSince).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="label">Join Date</label>
                <div className="input bg-neutral-50 cursor-not-allowed">
                  {new Date(profile.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Specialization */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
              <BookOpen size={20} className="mr-2" />
              Areas of Specialization
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.specialization.map((area, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Career Progression */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Career Progression</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div>
                  <h4 className="font-medium text-neutral-800">Head of Department</h4>
                  <p className="text-sm text-neutral-600">
                    {new Date(profile.hodSince).toLocaleDateString()} - Present
                  </p>
                </div>
              </div>
              
              {profile.previousRoles.map((role, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg">
                  <div className="w-3 h-3 bg-neutral-400 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-neutral-800">{role}</h4>
                    <p className="text-sm text-neutral-600">Previous Role</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research & Publications */}
          <div className="card">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Research & Publications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <h4 className="text-2xl font-bold text-primary mb-2">{profile.publications}</h4>
                <p className="text-neutral-600">Research Publications</p>
                <p className="text-xs text-neutral-500 mt-1">Journals & Conferences</p>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <h4 className="text-2xl font-bold text-secondary mb-2">{profile.researchProjects}</h4>
                <p className="text-neutral-600">Research Projects</p>
                <p className="text-xs text-neutral-500 mt-1">Ongoing & Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HodProfile;