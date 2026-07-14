import express from 'express';
import {
  listClasses,
  createClass,
  updateClass,
  bulkDeleteClasses,
  getClassTutorOptions,
  getClassById,
} from '../controllers/classController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('tutor', 'centre'), listClasses);
router.post('/', protect, authorize('tutor', 'centre'), createClass);
router.post('/bulk-delete', protect, authorize('tutor', 'centre'), bulkDeleteClasses);
router.get('/meta/tutor-options', protect, authorize('tutor', 'centre'), getClassTutorOptions);
router.patch('/:id', protect, authorize('tutor', 'centre'), updateClass);
router.get('/:id', protect, authorize('tutor', 'centre'), getClassById);

export default router;
