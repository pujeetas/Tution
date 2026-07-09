import Booking from '../models/Booking.js';
import TutorProfile from '../models/TutorProfile.js';
import Student from '../models/Student.js';

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
    const { tutorProfileId, subject, date, durationHours, mode, notes, studentId } = req.body;

    if (!tutorProfileId || !subject || !date || !durationHours || !mode || !studentId) {
      res.status(400);
      throw new Error(
        'tutorProfileId, subject, date, durationHours, mode and studentId are required'
      );
    }

    const tutorProfile = await TutorProfile.findById(tutorProfileId);
    if (!tutorProfile) {
      res.status(404);
      throw new Error('Tutor not found');
    }

    const student = await Student.findOne({ _id: studentId, parent: req.user._id });
    if (!student) {
      res.status(404);
      throw new Error('Student not found');
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
      organization: tutorProfile.organization || undefined,
      student: student._id,
      subject,
      date: sessionDate,
      durationHours,
      mode,
      notes,
      amount: tutorProfile.hourlyRate * durationHours,
    });

    const populated = await booking.populate([
      { path: 'tutor', select: 'name email' },
      { path: 'parent', select: 'name email' },
      { path: 'student' },
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
    let filter;
    if (req.user.role === 'tutor') {
      filter = { tutor: req.user._id };
    } else if (req.user.role === 'centre') {
      filter = { organization: req.user.organization };
    } else {
      filter = { parent: req.user._id };
    }

    const bookings = await Booking.find(filter)
      .populate('tutor', 'name email')
      .populate('parent', 'name email phone')
      .populate('student')
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
    const isCentreAdmin =
      req.user.role === 'centre' &&
      req.user.organization &&
      booking.organization &&
      booking.organization.toString() === req.user.organization.toString();

    if (!isTutor && !isParent && !isCentreAdmin) {
      res.status(403);
      throw new Error('Not authorized to update this booking');
    }

    // Parents may only cancel; tutors and the tutor's centre admin may confirm, complete or cancel
    const actingAsTutor = isTutor || isCentreAdmin;
    if (isParent && !actingAsTutor && status !== 'Cancelled') {
      res.status(403);
      throw new Error('Parents can only cancel a booking');
    }

    const allowed = ALLOWED_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(status)) {
      res.status(400);
      throw new Error(`Cannot change status from ${booking.status} to ${status}`);
    }

    if (status === 'Completed' && booking.paymentStatus !== 'paid') {
      res.status(400);
      throw new Error('Booking must be paid before it can be marked completed');
    }

    booking.status = status;
    await booking.save();

    const populated = await booking.populate([
      { path: 'tutor', select: 'name email' },
      { path: 'parent', select: 'name email phone' },
      { path: 'student' },
    ]);

    res.json({ success: true, booking: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate payment for a confirmed booking (dev-only stand-in for a real payment gateway)
// @route   PATCH /api/bookings/:id/pay
// @access  Private (parent, own booking)
export const simulatePayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.parent.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to pay for this booking');
    }

    if (booking.status !== 'Confirmed') {
      res.status(400);
      throw new Error('Booking must be confirmed by the tutor before payment');
    }

    if (booking.paymentStatus === 'paid') {
      res.status(400);
      throw new Error('Booking is already paid');
    }

    booking.paymentStatus = 'paid';
    await booking.save();

    const populated = await booking.populate([
      { path: 'tutor', select: 'name email' },
      { path: 'parent', select: 'name email phone' },
      { path: 'student' },
    ]);

    res.json({ success: true, booking: populated });
  } catch (error) {
    next(error);
  }
};
