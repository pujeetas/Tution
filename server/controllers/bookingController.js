import Booking from '../models/Booking.js';
import TutorProfile from '../models/TutorProfile.js';

// Allowed status transitions: Pending -> Confirmed -> Completed; Pending/Confirmed -> Cancelled
const ALLOWED_TRANSITIONS = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
};

// @desc    Create a booking (parent books a tutor)
// @route   POST /api/bookings
// @access  Private (parent)
export const createBooking = async (req, res, next) => {
  try {
    const { tutorProfileId, subject, date, durationHours, mode, notes, childName, childLevel } =
      req.body;

    if (!tutorProfileId || !subject || !date || !durationHours || !mode) {
      res.status(400);
      throw new Error('tutorProfileId, subject, date, durationHours and mode are required');
    }

    const tutorProfile = await TutorProfile.findById(tutorProfileId);
    if (!tutorProfile) {
      res.status(404);
      throw new Error('Tutor not found');
    }

    const sessionDate = new Date(date);
    if (Number.isNaN(sessionDate.getTime())) {
      res.status(400);
      throw new Error('Invalid date');
    }
    if (sessionDate < new Date()) {
      res.status(400);
      throw new Error('Session date must be in the future');
    }

    if (mode !== 'online' && mode !== 'in-person') {
      res.status(400);
      throw new Error('Mode must be online or in-person');
    }
    if (tutorProfile.teachingMode !== 'both' && tutorProfile.teachingMode !== mode) {
      res.status(400);
      throw new Error(`This tutor only teaches ${tutorProfile.teachingMode}`);
    }
    if (!tutorProfile.subjects.includes(subject)) {
      res.status(400);
      throw new Error('This tutor does not teach that subject');
    }

    const booking = await Booking.create({
      tutor: tutorProfile.user,
      parent: req.user._id,
      childName: childName || req.user.childName,
      childLevel: childLevel || req.user.childLevel,
      subject,
      date: sessionDate,
      durationHours,
      mode,
      notes,
    });

    const populated = await booking.populate([
      { path: 'tutor', select: 'name email' },
      { path: 'parent', select: 'name email' },
    ]);

    res.status(201).json({ success: true, booking: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get own bookings (parent sees theirs, tutor sees incoming)
// @route   GET /api/bookings/me
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const filter =
      req.user.role === 'tutor' ? { tutor: req.user._id } : { parent: req.user._id };

    const bookings = await Booking.find(filter)
      .populate('tutor', 'name email')
      .populate('parent', 'name email phone')
      .sort({ date: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (tutor confirms/completes own bookings; parent can cancel)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const isTutor = booking.tutor.toString() === req.user._id.toString();
    const isParent = booking.parent.toString() === req.user._id.toString();

    if (!isTutor && !isParent) {
      res.status(403);
      throw new Error('Not authorized to update this booking');
    }

    // Parents may only cancel; tutors may confirm, complete or cancel
    if (isParent && !isTutor && status !== 'Cancelled') {
      res.status(403);
      throw new Error('Parents can only cancel a booking');
    }

    const allowed = ALLOWED_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error(`Cannot change status from ${booking.status} to ${status}`);
    }

    booking.status = status;
    await booking.save();

    const populated = await booking.populate([
      { path: 'tutor', select: 'name email' },
      { path: 'parent', select: 'name email phone' },
    ]);

    res.json({ success: true, booking: populated });
  } catch (error) {
    next(error);
  }
};
