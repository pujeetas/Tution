import express from 'express';
import {
  listMyStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  listAddedStudents,
  addStudentForParent,
  bulkDeleteStudents,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, authorize('parent'), listMyStudents);
router.post('/', protect, authorize('parent'), createStudent);
router.patch('/:id', protect, authorize('parent'), updateStudent);
router.delete('/:id', protect, authorize('parent'), deleteStudent);

router.get('/added', protect, authorize('tutor', 'centre'), listAddedStudents);
router.post('/add-for-parent', protect, authorize('tutor', 'centre'), addStudentForParent);
router.post('/bulk-delete', protect, authorize('tutor', 'centre'), bulkDeleteStudents);

export default router;
