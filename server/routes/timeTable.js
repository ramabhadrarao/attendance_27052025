import express from 'express';
import { 
  updateTimeTable,
  getTimeTable
} from '../controllers/timeTableController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.put('/', protect, authorize('hod'), updateTimeTable);
router.get('/', protect, getTimeTable);

export default router;