import TutorProfile, { SUBJECTS, LEVELS, TEACHING_MODES } from '../models/TutorProfile.js';
import Booking from '../models/Booking.js';

// @desc    List tutors with filters
// @route   GET /api/tutors?subject=Math&level=PSLE&mode=online&minRate=20&maxRate=80
// @access  Public
export const getTutors = async (req, res, next) => {
  try {
    const { subject, level, mode, minRate, maxRate } = req.query;
    const filter = {};

    if (subject) filter.subjects = subject;
    if (level) filter.levels = level;
    if (mode && mode !== 'both') {
      // A tutor teaching "both" matches online and in-person searches
      filter.teachingMode = { $in: [mode, 'both'] };
    } else if (mode === 'both') {
      filter.teachingMode = 'both';
    }

    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    const tutors = await TutorProfile.find(filter)
      .populate('user', 'name email')
      .sort({ hourlyRate: 1 });

    res.json({ success: true, count: tutors.length, tutors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single tutor profile (public)
// @route   GET /api/tutors/:id
// @access  Public
export const getTutorById = async (req, res, next) => {
  try {
    const tutor = await TutorProfile.findById(req.params.id).populate('user', 'name email');

    if (!tutor) {
      res.status(404);
      throw new Error('Tutor profile not found');
    }

    res.json({ success: true, tutor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dates the tutor already has bookings on (busy indicator only)
// @route   GET /api/tutors/:id/busy-dates
// @access  Public
export const getTutorBusyDates = async (req, res, next) => {
  try {
    const tutorProfile = await TutorProfile.findById(req.params.id).select('user');

    if (!tutorProfile) {
      res.status(404);
      throw new Error('Tutor profile not found');
    }

    const bookings = await Booking.find({
      tutor: tutorProfile.user,
      status: { $ne: 'Cancelled' },
    }).select('date durationHours -_id');

    res.json({ success: true, busyDates: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get own tutor profile
// @route   GET /api/tutors/me/profile
// @access  Private (tutor)
export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await TutorProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone'
    );
    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update own tutor profile
// @route   PUT /api/tutors/me/profile
// @access  Private (tutor)
export const upsertMyProfile = async (req, res, next) => {
  try {
    const { subjects, levels, teachingMode, hourlyRate, bio, yearsExperience } = req.body;

    const profile = await TutorProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        subjects,
        levels,
        teachingMode,
        hourlyRate,
        bio,
        yearsExperience,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('user', 'name email phone');

    res.json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Get filter option lists (subjects, levels, modes)
// @route   GET /api/tutors/meta/options
// @access  Public
export const getOptions = (req, res) => {
  res.json({
    success: true,
    subjects: SUBJECTS,
    levels: LEVELS,
    teachingModes: TEACHING_MODES,
  });
};
