import express from 'express';
import { getSession, saveSession, listSessions } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/session', protect, authorize('tutor', 'centre'), getSession);
router.put('/session', protect, authorize('tutor', 'centre'), saveSession);
router.get('/', protect, authorize('tutor', 'centre'), listSessions);

export default router;
