import express from 'express';
import { 
  takeAttendance,
  getStudentAttendance,
  getFacultyClasses,
  getDepartmentAttendance
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/take', protect, authorize('faculty'), takeAttendance);
router.get('/student', protect, authorize('student'), getStudentAttendance);
router.get('/faculty/classes', protect, authorize('faculty'), getFacultyClasses);
router.get('/department', protect, authorize('hod'), getDepartmentAttendance);

export default router;