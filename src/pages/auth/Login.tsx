import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

type FormData = {
  username: string;
  password: string;
  role: 'student' | 'faculty' | 'hod';
};

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password, data.role);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (data.role === 'student') {
        navigate('/student');
      } else if (data.role === 'faculty') {
        navigate('/faculty');
      } else if (data.role === 'hod') {
        navigate('/hod');
      }
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-slide-in">
      <div className="form-group">
        <label htmlFor="username" className="label">Username</label>
        <input
          id="username"
          type="text"
          className="input"
          placeholder="Enter your username"
          {...register('username', { required: 'Username is required' })}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-error">{errors.username.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="label">Password</label>
        <input
          id="password"
          type="password"
          className="input"
          placeholder="Enter your password"
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-error">{errors.password.message}</p>
        )}
      </div>

      <div className="form-group">
        <label className="label">Login As</label>
        <div className="grid grid-cols-3 gap-3">
          <label className="flex items-center p-3 border border-neutral-200 rounded-md cursor-pointer hover:bg-neutral-50 transition-colors">
            <input
              type="radio"
              value="student"
              className="mr-2"
              {...register('role', { required: 'Please select a role' })}
            />
            <span>Student</span>
          </label>
          <label className="flex items-center p-3 border border-neutral-200 rounded-md cursor-pointer hover:bg-neutral-50 transition-colors">
            <input
              type="radio"
              value="faculty"
              className="mr-2"
              {...register('role', { required: 'Please select a role' })}
            />
            <span>Faculty</span>
          </label>
          <label className="flex items-center p-3 border border-neutral-200 rounded-md cursor-pointer hover:bg-neutral-50 transition-colors">
            <input
              type="radio"
              value="hod"
              className="mr-2"
              {...register('role', { required: 'Please select a role' })}
            />
            <span>HOD</span>
          </label>
        </div>
        {errors.role && (
          <p className="mt-1 text-sm text-error">{errors.role.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`btn btn-primary w-full mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;