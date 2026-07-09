import express from 'express';
import {
  register,
  login,
  getMe,
  completeOnboarding,
  saveFormConfig,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/onboarding', protect, completeOnboarding);
router.patch('/form-config', protect, saveFormConfig);

export default router;
