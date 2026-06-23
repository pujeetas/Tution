import express from 'express';
import {
  getTutors,
  getTutorById,
  getMyProfile,
  upsertMyProfile,
  getOptions,
} from '../controllers/tutorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTutors);
router.get('/meta/options', getOptions);
router.get('/me/profile', protect, authorize('tutor'), getMyProfile);
router.put('/me/profile', protect, authorize('tutor'), upsertMyProfile);
router.get('/:id', getTutorById);

export default router;
