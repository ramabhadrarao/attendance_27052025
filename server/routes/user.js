import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllFaculty,
  getAllStudents,
  createUser,
  updateUser,
  deleteUser,
  getDepartmentStats
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - all user routes require authentication
router.use(protect);

// Common routes for all authenticated users
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);

// Faculty and HOD routes
router.get('/students', authorize('faculty', 'hod'), getAllStudents);

// HOD only routes
router.get('/faculty', authorize('hod'), getAllFaculty);
router.get('/department-stats', authorize('hod'), getDepartmentStats);
router.post('/', authorize('hod'), createUser);
router.put('/:id', authorize('hod'), updateUser);
router.delete('/:id', authorize('hod'), deleteUser);

export default router;