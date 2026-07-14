import Class from '../models/Class.js';
import Student from '../models/Student.js';
import User from '../models/User.js';

// Scope for creating/updating/deleting a class, and for validating which
// students belong to the caller. Deliberately narrower than
// listVisibilityScopeFor below — being assigned as a class's tutor grants
// visibility, not edit/delete rights over a class someone else set up.
const scopeFor = (user) =>
  user.role === 'centre' && user.organization
    ? { organization: user.organization }
    : { addedBy: user._id };

// Scope for which classes a tutor/centre can see in their list. A staff
// tutor needs to see classes a centre admin created and assigned them to
// teach, not just ones they personally created — otherwise they can't find
// (or mark attendance for) their own sessions.
export const listVisibilityScopeFor = (user) =>
  user.role === 'centre' && user.organization
    ? { organization: user.organization }
    : { $or: [{ addedBy: user._id }, { tutors: user._id }] };

// Shared by createClass/updateClass. Resolves and validates the submitted
// tutors/students against the caller's scope — option lists sent to the
// client are already scope-filtered, but this re-checks server-side against
// a crafted request. tutorScope is combined via $and (not object-spread)
// because the individual-tutor branch also uses the _id key, which would
// otherwise silently clobber the { $in: tutorIds } constraint.
const resolveTutorsAndStudents = async (req, res, tutors, students) => {
  const scope = scopeFor(req.user);
  let tutorIds = Array.isArray(tutors) ? tutors : [];
  if (tutorIds.length === 0 && req.user.role === 'tutor') tutorIds = [req.user._id.toString()];
  if (tutorIds.length === 0) {
    res.status(400);
    throw new Error('At least one tutor must be assigned');
  }

  const tutorScope =
    req.user.role === 'centre' && req.user.organization
      ? { organization: req.user.organization }
      : { _id: req.user._id };
  const validTutors = await User.countDocuments({
    $and: [{ _id: { $in: tutorIds } }, { role: 'tutor' }, tutorScope],
  });
  if (validTutors !== tutorIds.length) {
    res.status(400);
    throw new Error('One or more tutors are invalid for this account');
  }

  const studentIds = Array.isArray(students) ? students : [];
  if (studentIds.length) {
    const validStudents = await Student.countDocuments({ _id: { $in: studentIds }, ...scope });
    if (validStudents !== studentIds.length) {
      res.status(400);
      throw new Error('One or more students are invalid for this account');
    }
  }

  return { tutorIds, studentIds };
};

// @desc    List classes this tutor/centre has added (org-wide for centres),
//          with search/level/subject/status filtering and pagination
// @route   GET /api/classes
// @access  Private (tutor, centre)
export const listClasses = async (req, res, next) => {
  try {
    const { search, level, subject, status, page = 1, limit = 10 } = req.query;

    // Combined via $and (not object-spread) — listVisibilityScopeFor can
    // itself be $or-shaped for a tutor, and a naive spread would let the
    // search clause's $or silently overwrite the visibility one.
    const conditions = [listVisibilityScopeFor(req.user)];
    if (level) conditions.push({ level });
    if (subject) conditions.push({ subject });
    if (status) conditions.push({ status });
    if (search) {
      const re = new RegExp(search.trim(), 'i');
      conditions.push({ $or: [{ name: re }, { location: re }] });
    }
    const filter = conditions.length > 1 ? { $and: conditions } : conditions[0];

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 10);

    const [classes, total] = await Promise.all([
      Class.find(filter)
        .populate('tutors', 'name')
        .populate('students', 'name')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Class.countDocuments(filter),
    ]);

    res.json({
      success: true,
      classes,
      total,
      page: pageNum,
      pages: Math.max(1, Math.ceil(total / limitNum)),
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a class
// @route   POST /api/classes
// @access  Private (tutor, centre)
export const createClass = async (req, res, next) => {
  try {
    const { name, lessonType, schedule, level, subject, location, tutors, students, description, visibility } =
      req.body;

    if (!name || !level || !subject) {
      res.status(400);
      throw new Error('Class name, level and subject are required');
    }

    const { tutorIds, studentIds } = await resolveTutorsAndStudents(req, res, tutors, students);

    const klass = await Class.create({
      name,
      lessonType,
      schedule,
      level,
      subject,
      location: location || '',
      tutors: tutorIds,
      students: studentIds,
      description: description || '',
      visibility: visibility || 'Public',
      addedBy: req.user._id,
      organization: req.user.organization || null,
    });

    res.status(201).json({ success: true, class: klass });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a class this tutor/centre added (org-scoped for centres)
// @route   PATCH /api/classes/:id
// @access  Private (tutor, centre)
export const updateClass = async (req, res, next) => {
  try {
    const { name, lessonType, schedule, level, subject, location, tutors, students, description, visibility } =
      req.body;

    if (!name || !level || !subject) {
      res.status(400);
      throw new Error('Class name, level and subject are required');
    }

    const { tutorIds, studentIds } = await resolveTutorsAndStudents(req, res, tutors, students);

    const klass = await Class.findOneAndUpdate(
      { _id: req.params.id, ...scopeFor(req.user) },
      {
        name,
        lessonType,
        schedule,
        level,
        subject,
        location: location || '',
        tutors: tutorIds,
        students: studentIds,
        description: description || '',
        visibility: visibility || 'Public',
      },
      { new: true, runValidators: true }
    )
      .populate('tutors', 'name')
      .populate('students', 'name');

    if (!klass) {
      res.status(404);
      throw new Error('Class not found');
    }

    res.json({ success: true, class: klass });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk-delete classes this tutor/centre added (org-scoped for centres)
// @route   POST /api/classes/bulk-delete
// @access  Private (tutor, centre)
export const bulkDeleteClasses = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400);
      throw new Error('ids must be a non-empty array');
    }

    const result = await Class.deleteMany({ _id: { $in: ids }, ...scopeFor(req.user) });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single class (same visibility rule as the list — creator,
//          assigned tutor, or org admin)
// @route   GET /api/classes/:id
// @access  Private (tutor, centre)
export const getClassById = async (req, res, next) => {
  try {
    const klass = await Class.findOne({ _id: req.params.id, ...listVisibilityScopeFor(req.user) })
      .populate('tutors', 'name')
      .populate('students', 'name');

    if (!klass) {
      res.status(404);
      throw new Error('Class not found');
    }

    res.json({ success: true, class: klass });
  } catch (error) {
    next(error);
  }
};

// @desc    Options for the "Assign Tutors" select: org staff tutors for a
//          centre, or just the tutor themself for an individual tutor
// @route   GET /api/classes/meta/tutor-options
// @access  Private (tutor, centre)
export const getClassTutorOptions = async (req, res, next) => {
  try {
    const tutors =
      req.user.role === 'centre' && req.user.organization
        ? await User.find({ role: 'tutor', organization: req.user.organization }).select('name email')
        : [{ _id: req.user._id, name: req.user.name, email: req.user.email }];
    res.json({ success: true, tutors });
  } catch (error) {
    next(error);
  }
};
