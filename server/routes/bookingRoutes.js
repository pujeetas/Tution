import express from 'express';
import {
  createBooking,
  getMyBookings,
  updateBookingStatus,
  simulatePayment,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('parent'), createBooking);
router.get('/me', protect, getMyBookings);
router.patch('/:id/status', protect, updateBookingStatus);
router.patch('/:id/pay', protect, authorize('parent'), simulatePayment);

export default router;
