import express from 'express';
import { 
  updateTimeTable,
  getTimeTable,
  getStudentTimeTable,
  getFacultyTimeTable,
  deleteTimeTable,
  getTimeTableFilters,
  bulkImportTimeTable
} from '../controllers/timeTableController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - all timetable routes require authentication
router.use(protect);

// Common routes
router.get('/filters', getTimeTableFilters);
router.get('/', getTimeTable);

// Student routes
router.get('/student', authorize('student'), getStudentTimeTable);

// Faculty routes
router.get('/faculty', authorize('faculty'), getFacultyTimeTable);

// HOD routes - management operations
router.put('/', authorize('hod'), updateTimeTable);
router.delete('/:id', authorize('hod'), deleteTimeTable);
router.post('/bulk-import', authorize('hod'), bulkImportTimeTable);

export default router;