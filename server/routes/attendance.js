import express from 'express';
import { 
  takeAttendance,
  getStudentAttendance,
  getFacultyClasses,
  getClassStudents,
  getFacultyAttendanceRecords,
  getDepartmentAttendance,
  getAttendanceSummary
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - all attendance routes require authentication
router.use(protect);

// Student routes
router.get('/student', authorize('student'), getStudentAttendance);
router.get('/summary', getAttendanceSummary); // Available to all roles

// Faculty routes
router.get('/faculty/classes', authorize('faculty'), getFacultyClasses);
router.get('/faculty/records', authorize('faculty'), getFacultyAttendanceRecords);
router.post('/take', authorize('faculty'), takeAttendance);
router.get('/class-students', authorize('faculty', 'hod'), getClassStudents);

// HOD routes
router.get('/department', authorize('hod'), getDepartmentAttendance);

export default router;