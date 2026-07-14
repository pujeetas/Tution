import Attendance, { ATTENDANCE_STATUSES, ABSENCE_VALIDITY } from '../models/Attendance.js';
import Class from '../models/Class.js';
import { listVisibilityScopeFor } from './classController.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Same visibility rule as Classes: class creator, an assigned tutor, or the
// org admin — being able to see a class is exactly what should let you mark
// attendance for it.
const findAccessibleClass = (user, classId) =>
  Class.findOne({ _id: classId, ...listVisibilityScopeFor(user) }).populate('students', 'name');

// @desc    Get the attendance session for a class+date, or a synthesized
//          all-Present draft (not yet persisted) if none exists yet
// @route   GET /api/attendance/session?classId=&date=
// @access  Private (tutor, centre)
export const getSession = async (req, res, next) => {
  try {
    const { classId, date } = req.query;
    if (!classId || !date || !DATE_RE.test(date)) {
      res.status(400);
      throw new Error('classId and a valid date (YYYY-MM-DD) are required');
    }

    const klass = await findAccessibleClass(req.user, classId);
    if (!klass) {
      res.status(404);
      throw new Error('Class not found');
    }

    const existing = await Attendance.findOne({ class: classId, date }).populate('records.student', 'name');
    if (existing) {
      return res.json({ success: true, session: existing, isNew: false });
    }

    const draft = {
      class: classId,
      date,
      records: klass.students.map((s) => ({
        student: { _id: s._id, name: s.name },
        status: 'Present',
        absenceValidity: null,
        remark: '',
      })),
    };
    res.json({ success: true, session: draft, isNew: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update the attendance session for a class+date
//          (upsert — autosaved by the client on every change)
// @route   PUT /api/attendance/session
// @access  Private (tutor, centre)
export const saveSession = async (req, res, next) => {
  try {
    const { classId, date, records } = req.body;
    if (!classId || !date || !DATE_RE.test(date)) {
      res.status(400);
      throw new Error('classId and a valid date (YYYY-MM-DD) are required');
    }
    if (!Array.isArray(records)) {
      res.status(400);
      throw new Error('records must be an array');
    }

    const klass = await findAccessibleClass(req.user, classId);
    if (!klass) {
      res.status(404);
      throw new Error('Class not found');
    }

    const rosterIds = new Set(klass.students.map((s) => s._id.toString()));
    const cleaned = records.map((r) => {
      if (!rosterIds.has(String(r.student))) {
        res.status(400);
        throw new Error("One or more students are not on this class's roster");
      }
      if (!ATTENDANCE_STATUSES.includes(r.status)) {
        res.status(400);
        throw new Error('Invalid attendance status');
      }
      const absenceValidity = r.status === 'Absent' ? r.absenceValidity : null;
      if (r.status === 'Absent' && !ABSENCE_VALIDITY.includes(absenceValidity)) {
        res.status(400);
        throw new Error('Absent records require a Valid/Invalid classification');
      }
      return {
        student: r.student,
        status: r.status,
        absenceValidity,
        remark: (r.remark || '').slice(0, 300),
      };
    });

    const session = await Attendance.findOneAndUpdate(
      { class: classId, date },
      {
        class: classId,
        date,
        records: cleaned,
        organization: req.user.organization || null,
        markedBy: req.user._id,
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('records.student', 'name');

    res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

// @desc    List past attendance sessions for a class, most recent first
// @route   GET /api/attendance?classId=
// @access  Private (tutor, centre)
export const listSessions = async (req, res, next) => {
  try {
    const { classId } = req.query;
    if (!classId) {
      res.status(400);
      throw new Error('classId is required');
    }

    const klass = await findAccessibleClass(req.user, classId);
    if (!klass) {
      res.status(404);
      throw new Error('Class not found');
    }

    const sessions = await Attendance.find({ class: classId }).sort({ date: -1 }).select('date records');

    res.json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};
